import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserData } from 'src/app/interfaces';
import { DataService } from 'src/data.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit{
  public userdata: UserData | null;

  constructor(private _dataservice: DataService, private _snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this._dataservice.getUserDataReturn().subscribe(data => {
      this.userdata = data;
    })
  }

  logout() {
    this._dataservice.logout();
  }
}
