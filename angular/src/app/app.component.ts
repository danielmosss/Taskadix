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

  constructor(private _dateservice: DataService, private _snackbar: MatSnackBar) { }

  ngOnInit(): void {
    if (this._dateservice.isLoggedIn()) {
      this._dateservice.getUserData();
    }
  }

  isLoggedIn(): boolean {
    return this._dateservice.isLoggedIn();
  }

  isJWTtokenValid(): boolean {
    return this._dateservice.validJwtToken;
  }
}
