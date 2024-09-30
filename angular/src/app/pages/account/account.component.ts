import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { appointmentCategory, UserData } from 'src/app/interfaces';
import { DataService } from 'src/data.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  @Output() onSyncWebcall = new EventEmitter<void>();

  public userdata: UserData | null;
  public newIcsUrl: string;
  public newIcsCategoryId: number;
  public AddNew: boolean = false;

  public categories: appointmentCategory[] = [];

  public oldPassword: string;
  public newPassword: string;
  public newRepeatPassword: string;

  constructor(private _dataservice: DataService, private _snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.setUserData();
    this._dataservice.getCategories().subscribe((data: any) => {
      this.categories = data;
    });
  }

  logout() {
    this._dataservice.logout();
  }

  // Check if user can sync webcall, if the user has never synced before, or if the last sync was more than 1 day ago, the user can sync.
  canSyncWebcall(id: number) {
    var ics_import = this.userdata?.ics_imports.find(x => x.id == id);

    if (ics_import?.ics_last_synced_at == null || ics_import?.ics_last_synced_at == "") {
      return true;
    }
    if (this.userdata) {
      let lastsynced = new Date(ics_import.ics_last_synced_at);
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
  setwebcallurl(id:number, new_ics_url: string) {
    this._dataservice.saveWebcallUrl(new_ics_url, id, this.newIcsCategoryId).subscribe((data: any) => {
      if (data.status == 'success') {
        this.setUserData();
      }
    })
  }

  syncWebcall(id: number) {
    this._dataservice.syncWebcall(id).subscribe((data: any) => {
      if (data.status == 'success') {
        this.onSyncWebcall.emit();
        this.setUserData();
      }
    })
  }

  addNewImport(){
    this.setwebcallurl(0, this.newIcsUrl)
    this.newIcsUrl = "";
  }

  setUserData() {
    this._dataservice.getUserDataReturn().subscribe((data: any) => {
      this.userdata = data;
    })
  }

  SyncedAgo(ics_last_synced_at: string) {
    let lastsynced = new Date(ics_last_synced_at);
    let today = new Date();
    let diff = Math.abs(today.getTime() - lastsynced.getTime());
    let diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    let diffHours = Math.ceil(diff / (1000 * 3600));
    let diffMinutes = Math.ceil(diff / (1000 * 60));
    let diffSeconds = Math.ceil(diff / 1000);

    if (diffDays > 1) {
      return diffDays + " days ago";
    }
    if (diffHours > 1) {
      return diffHours + " hours ago";
    }
    if (diffMinutes > 1) {
      return diffMinutes + " minutes ago";
    }
    if (diffSeconds > 1) {
      return diffSeconds + " seconds ago";
    }
    return "1 second ago";
  }

  changePassword() {
    console.log(this.oldPassword, this.newPassword, this.newRepeatPassword);
  }
}
