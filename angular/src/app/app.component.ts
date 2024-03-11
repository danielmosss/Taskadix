import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'dashboard';

  constructor(private _dataservice: DataService, private _snackbar: MatSnackBar) { }

  ngOnInit(): void {
    if (this._dataservice.isLoggedIn()) {
      this._dataservice.getUserDataOnLoad();
    }
  }

  isLoggedIn(): boolean {
    return this._dataservice.isLoggedIn();
  }

  isJWTtokenValid(): boolean {
    return this._dataservice.validJwtToken;
  }
}
