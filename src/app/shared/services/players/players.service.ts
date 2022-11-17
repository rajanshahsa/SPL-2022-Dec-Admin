import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  constructor(
    private apiService: ApiService,
  ) { }

  async getPlayer(id:any) {
    return this.apiService.get(`/players/${id}`, false);
  }

  async getPlayers() {
    return this.apiService.get(`/players/`, false);
  }

  async updatePlayerBid(id:any,playerData:any) {
    return this.apiService.post(`/players/${id}`,playerData, false);
  }

}
