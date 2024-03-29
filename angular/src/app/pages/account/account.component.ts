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

  public oldPassword: string;
  public newPassword: string;
  public newRepeatPassword: string;

  constructor(private _dataservice: DataService, private _snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.setUserData();
  }

  logout() {
    this._dataservice.logout();
  }

  // Check if user can sync webcall, if the user has never synced before, or if the last sync was more than 1 day ago, the user can sync.
  canSyncWebcall() {
    if (this.userdata?.webcalllastsynced == "") {
      return true;
    }
    if (this.userdata) {
      let lastsynced = new Date(this.userdata.webcalllastsynced);
      let today = new Date();
      let diff = Math.abs(today.getTime() - lastsynced.getTime());
      let diffDays = Math.ceil(diff / (1000 * 3600 * 24));
      if (diffDays > 1) {
        return true;
      }
    }
    return false;
  }

  // Set webcall url and save it to the database.
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

  changePassword() {
    console.log(this.oldPassword, this.newPassword, this.newRepeatPassword);
  }
}
