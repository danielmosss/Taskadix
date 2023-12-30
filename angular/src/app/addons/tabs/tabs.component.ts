import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/data.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit{
  public username: string

  constructor(private _dateservice: DataService, private _snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.username = this._dateservice.getUsername();
  }

  logout() {
    this._dateservice.logout();
    this._snackbar.open("Logged out", '', { duration: 3000, horizontalPosition: 'left', panelClass: 'success' });
  }

}
