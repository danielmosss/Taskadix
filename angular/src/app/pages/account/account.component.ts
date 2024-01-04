import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataService } from 'src/data.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  @Output() onSyncWebcall = new EventEmitter<void>();

  public userdata = this._dataservice.userdata;
  public setWebcallurl: string;
  public webcallurlSet: boolean = false;

  constructor(private _dataservice: DataService) { }

  ngOnInit(): void {
  }

  logout(){
    this._dataservice.logout();
  }

  setwebcallurl(){
    this._dataservice.saveWebcallUrl(this.setWebcallurl).subscribe((data: any) => {
      if (data.status == 'success') {
        this._dataservice.getUserData();
        this.webcallurlSet = true;
      }
    })
  }

  syncWebcall(){
    this._dataservice.syncWebcall().subscribe((data: any) => {
      if (data.status == 'success') {
        this.onSyncWebcall.emit();
      }
    })
  }
}
