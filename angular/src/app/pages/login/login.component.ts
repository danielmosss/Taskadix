import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/data.service';

enum RequestType {
  LOGIN,
  REGISTER
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public username: string = "";
  public password: string = "";
  public email: string = "";
  public hide: boolean = true;
  public loginMode: boolean = true;

  constructor(private _dataService: DataService, private _snackbar: MatSnackBar) { }

  public login(): void {
    if(!this.canSendRequest(RequestType.LOGIN)){
      this._snackbar.open("Make sure you have entered a username and password", "OK", {duration: 5000, horizontalPosition: "left", verticalPosition: "bottom"});
      return;
    }
    this._dataService.login(this.username, this.password)
  }

  public register(): void {
    if(!this.canSendRequest(RequestType.REGISTER)){
      this._snackbar.open("Make sure you have entered a username, password and email", "OK", {duration: 5000, horizontalPosition: "left", verticalPosition: "bottom"});
      return;
    }
    this._dataService.register(this.username, this.password, this.email)
  }

  canSendRequest(type: RequestType): boolean {
    switch (type) {
      case RequestType.LOGIN:
        return (this.username !== "" && this.password !== "")
      case RequestType.REGISTER:
        return (this.username !== "" && this.password !== "" && this.email !== "")
    }
  }
}
