import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from './data.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private _snackbar: MatSnackBar, private _dataService: DataService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let lcErr = error.message.toLowerCase();
        if (error.status == 401) {
          var errorBody = `You entered an invalid username and password combination.`;
          this._snackbar.open(errorBody, '', { duration: 3000, horizontalPosition: 'left' });
        }
        else if (error.status == 403 && (error.url?.includes('GetUserData') || lcErr == "invalid token" || lcErr == "user not found")) {
          this._dataService.logout();
        }
        else {
          var errorBody = `${error.error} (${error.status} - ${error.statusText})`
          this._snackbar.open(errorBody, '', { duration: 3000, horizontalPosition: 'left' });
        }
        return throwError(error);
      })
    );
  }
}
