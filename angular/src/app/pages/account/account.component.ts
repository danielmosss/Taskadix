import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/data.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  public userdata = this._dataservice.userdata;

  constructor(private _dataservice: DataService) { }

  ngOnInit(): void {
    // Get userinfo
    // Will have: username, email, password, webcall
  }

  logout(){
    this._dataservice.logout();
  }

  setwebcallurl(){
    // Set webcall url
  }
}
