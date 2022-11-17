import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
  })
export class HttpErrorHandler {
  constructor(
    // private toastr: ToastrService,
    // private ngxLoader: NgxUiLoaderService,
    private router: Router
  ) { }

  async handleError(serviceName = '', error: HttpErrorResponse, endpoint = 'operation') {
    const errorMessage = error.error.error;
    if (errorMessage) {
      // this.toastr.error(errorMessage);
    }
    // this.ngxLoader.stop();
    switch (error.status) {
      case 400:
        return throwError(error);
      case 401:
        localStorage.clear();
        // await this.localStorageService.clearDataFromIndexedDB();
        this.router.navigate(['/']);
        return;
      case 403:
        return throwError(error);
      case 404:
        return throwError(error);
      case 500:
        return throwError(error);
      default:
    }

    return throwError(error);
  }
}
