import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { userdata } from 'src/app/interfaces';
import { DataService } from 'src/data.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  @Output() onSyncWebcall = new EventEmitter<void>();

  public userdata: userdata | null;
  public setWebcallurl: string;
  public webcallurlSet: boolean = false;

  public backgroundColor: string;

  constructor(private _dataservice: DataService, private _snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.setUserData();
    if (this.userdata?.backgroundcolor) {
      this.backgroundColor = this.userdata.backgroundcolor;
      this.updateBackgroundcolor();
    } else {
      this.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--background-color');
    }
  }

  logout() {
    this._dataservice.logout();
  }

  canSyncWebcall() {
    if (this.userdata?.webcalllastsynced == null) {
      return true;
    }
    let lastsynced = new Date(this.userdata.webcalllastsynced);
    let today = new Date();
    let diff = Math.abs(today.getTime() - lastsynced.getTime());
    let diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    if (diffDays > 1) {
      return true;
    }
    return false;
  }

  setwebcallurl() {
    this._dataservice.saveWebcallUrl(this.setWebcallurl).subscribe((data: any) => {
      if (data.status == 'success') {
        this.webcallurlSet = true;
        this.setUserData();
      }
    })
  }

  syncWebcall() {
    this._dataservice.syncWebcall().subscribe((data: any) => {
      if (data.status == 'success') {
        this.onSyncWebcall.emit();
        this.setUserData();
      }
    })
  }

  setUserData() {
    this._dataservice.getUserDataReturn().subscribe((data: any) => {
      this.userdata = data;
    })
  }

  updateBackgroundcolor() {
    document.documentElement.style.setProperty('--background-color', this.backgroundColor);
  }

  saveBackgroundcolor() {
    this._dataservice.putBackgroundcolor(this.backgroundColor).subscribe((data: any) => {
      if (data.status == 'success') {
        this._snackbar.open('Background color has been updated.', '', { duration: 2000, horizontalPosition: 'left', verticalPosition: 'bottom', });
        if (this.userdata) {
          this.userdata.backgroundcolor = this.backgroundColor;
        }
      }
    })
  }
}
