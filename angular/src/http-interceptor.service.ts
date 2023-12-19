import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private _snackbar: MatSnackBar) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 401:
            var errorBody = `You entered an invalid username and password combination.`;
            this._snackbar.open(errorBody, '', { duration: 3000, horizontalPosition: 'left'});
            return throwError(error);
          default:
            var errorBody = `${error.name} (${error.statusText}) - Url: ${error.url}`
            this._snackbar.open(errorBody, '', { duration: 3000, horizontalPosition: 'left'});
            return throwError(error);
        }
      })
    );
  }
}
