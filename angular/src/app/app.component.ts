import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dashboard';

  constructor(private _dateService: DataService, private _snackbar: MatSnackBar) { }

  isLoggedIn(): boolean {
    return this._dateService.isLoggedIn();
  }

  logout(){
    this._dateService.logout();
    this._snackbar.open("Logged out", '', { duration: 3000, horizontalPosition: 'left', panelClass: 'success' });
  }
}
