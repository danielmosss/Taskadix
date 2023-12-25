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

  constructor(private _dateService: DataService, private _snackbar: MatSnackBar) { }

  ngOnInit(): void {
    if (this._dateService.isLoggedIn()) {
      this._dateService.getUserData().subscribe(data => {
        this._dateService.validJwtToken = true;
        this._dateService.username = data.username;
      })
    }
  }

  isLoggedIn(): boolean {
    return this._dateService.isLoggedIn();
  }

  isJWTtokenValid(): boolean {
    return this._dateService.validJwtToken;
  }
}
