import { Injectable } from '@angular/core';
import { constants } from './constants';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpErrorHandler } from './error-handler/http-error-handler.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  URL = environment.apiEndPoint; // endpoint URL
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private httpErrorHandler: HttpErrorHandler
  ) // private ngxLoader: NgxUiLoaderService,
  // private localStorageService: LocalStorageService
  {}

  async getHeaders(tokenRequired: boolean, formData?: boolean) {
    let token: any;
    if (tokenRequired) {
      const headers = new HttpHeaders()
        .set('authorization', token)
        .set('Content-Type', 'application/json');
      return headers;
    } else if (formData) {
      const headers = new HttpHeaders().set('authorization', token);
      return headers;
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      return headers;
    }
  }

  // this function should be used for fetch details without header token
  async get(path: any, authorize: boolean, loaderContinue?: undefined) {
    return new Promise(async (resolve, _) => {
      const success = (res: any) => {
        // toaster success message
        if (res && res.message) {
          this.toastr.success(res.message);
        }
        if (!loaderContinue) {
          // this.ngxLoader.stop();
        }
        resolve(res);
      };
      const error = (err: HttpErrorResponse) => {
        return this.httpErrorHandler.handleError(path, err);
      };
      const netowrkIsConnected = await this.getNetworkConnection();
      if (netowrkIsConnected) {
        const headers = await this.getHeaders(authorize, false);
        return this.http
          .get(`${this.URL}${path}`, { headers })
          .subscribe(success, error);
      } else {
        // this.ngxLoader.stop();
        this.toastr.error(constants.NO_INTERNET_CONNECTION_MSG);
      }
    });
  }

  // this function should be used for post details without header token
  async post(path: any, obj: any, authorize: boolean) {
    return new Promise(async (resolve, _) => {
      const success = (res: any) => {
        if (res && res.message) {
          this.toastr.success(res.message);
        }
        // this.ngxLoader.stop();
        resolve(res);
      };
      const error = (err: HttpErrorResponse) => {
        return this.httpErrorHandler.handleError(path, err);
      };
      const netowrkIsConnected = await this.getNetworkConnection();
      if (netowrkIsConnected) {
        const headers = await this.getHeaders(authorize, false);
        return this.http
          .post<any>(`${this.URL}${path}`, obj, { headers })
          .subscribe(success, error);
      } else {
        // this.ngxLoader.stop();
        this.toastr.error(constants.NO_INTERNET_CONNECTION_MSG);
      }
    });
  }

  // this function should be used for post details with header token

  async postFormDataReqWithToken(path: any, obj: any) {
    return new Promise(async (resolve, _) => {
      const success = (res: any) => {
        if (res && res.message) {
          this.toastr.success(res.message);
        }
        // this.ngxLoader.stop();
        resolve(res);
      };
      const error = (err: HttpErrorResponse) => {
        return this.httpErrorHandler.handleError(path, err);
      };
      const netowrkIsConnected = await this.getNetworkConnection();
      if (netowrkIsConnected) {
        const headers = await this.getHeaders(false, true);
        return this.http
          .post<any>(`${this.URL}${path}`, obj, {
            headers,
          })
          .subscribe(success, error);
      } else {
        // this.ngxLoader.stop();
        this.toastr.error(constants.NO_INTERNET_CONNECTION_MSG);
      }
    });
  }

  async postExportData(path: any, obj: any) {
    return new Promise(async (resolve, _) => {
      const success = (res: any) => {
        if (res && res.message) {
          this.toastr.success(res.message);
        }
        // this.ngxLoader.stop();
        resolve(res);
      };
      const error = (err: HttpErrorResponse) => {
        return this.httpErrorHandler.handleError(path, err);
      };
      const options = {
        headers: await this.getHeaders(false, true),
        responseType: 'text' as 'json',
      };
      return this.http
        .post<any>(this.URL + path, obj, options)
        .subscribe(success, error);
    });
  }

  async delete(path: any, authorize: any) {
    return new Promise(async (resolve) => {
      const success = (res: any) => {
        // toaster success message
        if (res && res.message) {
          this.toastr.success(res.message);
        }
        // this.ngxLoader.stop();
        resolve(res);
      };
      const error = (err: HttpErrorResponse) => {
        return this.httpErrorHandler.handleError(path, err);
      };
      const netowrkIsConnected = await this.getNetworkConnection();
      if (netowrkIsConnected) {
        const headers = await this.getHeaders(authorize, false);
        return this.http
          .delete(`${this.URL}${path}`, { headers })
          .subscribe(success, error);
      } else {
        // this.ngxLoader.stop();
        this.toastr.error(constants.NO_INTERNET_CONNECTION_MSG);
      }
    });
  }

  getNetworkConnection() {
    const isOnline: boolean = navigator.onLine;
    if (isOnline) {
      return true;
    }
    return false;
  }

  async uploadFileWithProgress(path: any, obj: any) {
    const netowrkIsConnected = await this.getNetworkConnection();
    if (netowrkIsConnected) {
        const headers = await this.getHeaders(false, true);
        return this.http.post<any>(`${this.URL}${path}`, obj, {
            headers, reportProgress: true,
            observe: 'events'
        }).subscribe((e: any) => {
          switch (e.type) {
              case HttpEventType.Sent:
                  break;
              case HttpEventType.ResponseHeader:
                  break;
              case HttpEventType.UploadProgress:
                  let progress = Math.round(e.loaded / e.total * 100);
                  console.log('progress',progress);

                  break;
              case HttpEventType.Response:
                 debugger;
          }
      });;
    } else {
        // this.ngxLoader.stop();
        this.toastr.error(constants.NO_INTERNET_CONNECTION_MSG);
    }

}
}
