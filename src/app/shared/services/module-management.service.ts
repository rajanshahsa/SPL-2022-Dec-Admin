import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ModuleManagementService {
  constructor(
    private apiServices: ApiService
  ) { }

  public getModules() {
    return this.apiServices.get('/module/list', true);
  }

  public updateMuduleStatus(data) {
    return this.apiServices.post(`/module/enable-disable/${data.id}`, data, true);
  }

  public updateSubMuduleStatus(data) {
    return this.apiServices.post(`/module/submodule/enable-disable/${data.id}`, data, true);
  }
}
