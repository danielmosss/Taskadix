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
        let errorMessage = error.error;
        this._snackbar.open(errorMessage, '', { duration: 3000, horizontalPosition: 'left', panelClass: 'error' });
        return throwError(error);
      })
    );
  }
}
