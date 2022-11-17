import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PlayersService } from './shared/services/players/players.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'SPL-2022-Dec-Admin';
  players: any;
  constructor(private router: Router, private playerService: PlayersService) {}

  async getPlayers() {
    const response: any = await this.playerService.getPlayers();
    this.players = response.data;
  }

  redirect(index: any) {
    this.router.navigateByUrl('players');
  }

  async bidDone(player: any,index:any) {
    player.currentPrice = this.getNewBidPrice(player);
    this.players[index] = player;
    const response: any = await this.playerService.updatePlayerBid(player.id, {
      currentPrice: player.currentPrice,
    });
  }

  getNewBidPrice(player: any) {
    if ((+player.currentPrice - +player.basePrice) > 100000) {
      return +player.currentPrice + 50000
    } else if(player.currentPrice) {
      return +player.currentPrice + 25000
    }else{
      return +player.basePrice + 25000

    }
  }
}
