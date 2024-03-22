import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DataService } from 'src/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'dashboard';

  constructor(private _dataservice: DataService, private _snackbar: MatSnackBar, private _router: Router) { }

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

  navigateTo(route: string) {
    this._router.navigate([route]);
  }

  isActive(route: string, exactMatch: boolean = false): string {
    if (this._router.url.includes(route) && !exactMatch) {
      return "#00C9C8";
    }
    else if (this._router.url === route && exactMatch) {
      return "#00C9C8";
    }

    return "";
  }
}
