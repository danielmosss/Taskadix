import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/data.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit{
  public username = this._dateservice.getUsername();

  constructor(private _dateservice: DataService, private _snackbar: MatSnackBar) { }

  ngOnInit(): void {

  }

  logout() {
    this._dateservice.logout();
    this._snackbar.open("Logged out", '', { duration: 3000, horizontalPosition: 'left', panelClass: 'success' });
  }

}
