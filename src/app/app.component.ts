import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './shared/services/api.service';
import { PlayersService } from './shared/services/players/players.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'SPL-2022-Dec-Admin';
  players: any;
  fileName: any;
  uploadPlayes: any = [];
  constructor(
    private router: Router,
    private playerService: PlayersService,
    private apiService: ApiService
  ) {}

  async getPlayers() {
    const response: any = await this.playerService.getPlayers();
    this.players = response.data;
  }

  redirect(index: any) {
    this.router.navigateByUrl('players');
  }

  async bidDone(player: any, index: any) {
    player.currentPrice = this.getNewBidPrice(player);
    this.players[index] = player;
    const response: any = await this.playerService.updatePlayerBid(player.id, {
      currentPrice: player.currentPrice,
    });
  }

  getNewBidPrice(player: any) {
    if (+player.currentPrice - +player.basePrice > 100000) {
      return +player.currentPrice + 50000;
    } else if (player.currentPrice) {
      return +player.currentPrice + 25000;
    } else {
      return +player.basePrice + 25000;
    }
  }

  async onChange(event: any, name: any) {
    const file = event.target.files[0];
    if (file) {
      let reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = async (e) => {
        let csv: any = reader.result;
        let allTextLines = [];
        allTextLines = csv.split(/\r|\n|\r/);

        //Table Headings
        let headers = allTextLines[0].split(',');
        let data = headers;
        let tarr: any = [];
        for (let j = 0; j < headers.length; j++) {
          tarr.push(data[j]);
        }
        //Pusd headings to array variable
        //  this.lines.push(tarr);

        // Table Rows
        let tarrR = [];

        let arrl = allTextLines.length;
        let rows = [];
        for (let i = 1; i < arrl; i++) {
          rows.push(allTextLines[i].split(','));
        }

        for (let j = 0; j < arrl; j++) {
          tarrR.push(rows[j]);
        }
        console.table('data', tarrR);
        tarrR.map((item) => {
          this.preparePlayersObject(item, tarr);
        });
        //Push rows to array variable
        //  this.linesR.push(tarrR);
        await this.playerService.uploadPlayers({ data: this.uploadPlayes });
      };
    }
  }

  preparePlayersObject(data: any, headers: [any]) {
    if (data && data.length > 12) {
      const style = data[headers.indexOf('Batting and Bowling Styles')];
      const player = {
        name: data[headers.indexOf('Name')].replaceAll('"', ''),
        gender: data[headers.indexOf('Gender')].replaceAll('"', ''),
        sports: data[headers.indexOf('Which sport will you play?')].replaceAll(
          '"',
          ''
        ),
        skills: data[headers.indexOf('Cricket Specialisation')].replaceAll(
          '"',
          ''
        ),
        battingStyle: style.replaceAll('"', '').split(';')[0],
        bowlingStyle: style
          .replaceAll('"', '')
          .substring(
            style.replaceAll('"', '').indexOf(';') + 1,
            style.replaceAll('"', '').length
          ),
        bowlingRating: data[
          headers.indexOf('Rate your Bowling Skills:')
        ].replaceAll('"', ''),
        battingRating: data[
          headers.indexOf('Rate your Batting Skills:')
        ].replaceAll('"', ''),
        wantToBeCaptain:
          data[headers.indexOf('Want to become a captain?')].replaceAll(
            '"',
            ''
          ) == '' ||
          data[headers.indexOf('Want to become a captain?')].replaceAll(
            '"',
            ''
          ) == 'No'
            ? 0
            : 1,
      };
      if (player.bowlingStyle === player.battingStyle) {
        if (player.skills === 'Batsman') {
          player.bowlingStyle = null;
        } else {
          player.battingStyle = null;
        }
      }
      this.uploadPlayes.push(player);
    }
  }
}
