import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  public backgroundColor: string;

  constructor(private _dataservice: DataService, private _snackbar: MatSnackBar) { }

  ngOnInit(): void {
    if (this.userdata?.backgroundcolor){
      this.backgroundColor = this.userdata.backgroundcolor;
      this.updateBackgroundcolor();
    }else{
      this.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--background-color');
    }
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

  updateBackgroundcolor(){
    document.documentElement.style.setProperty('--background-color', this.backgroundColor);
  }

  saveBackgroundcolor(){
    this._dataservice.putBackgroundcolor(this.backgroundColor).subscribe((data: any) => {
      if (data.status == 'success') {
        this._snackbar.open('Background color has been updated.', '', {duration: 2000});
      }
    })
  }
}
