import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    private _dataservice: DataService,
    private _router: Router,
  ) { }
  public canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this._dataservice.isLoggedIn()) {
      return true;
    } else {
      this._dataservice.logout();
      this._router.navigate(['/login']);
      return false;
    }
  }
}
