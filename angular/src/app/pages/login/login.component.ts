import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
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

  constructor(private _dataService: DataService, private _snackbar: MatSnackBar, private _router: Router) { }

  public async login(): Promise<void>{
    if (!this.canSendRequest(RequestType.LOGIN)) {
      this._snackbar.open("Make sure you have entered a username and password", "OK", { duration: 5000, horizontalPosition: "left", verticalPosition: "bottom" });
      return;
    }
    if(await this._dataService.login(this.username, this.password)){
      this._router.navigate(["/"]);
    }
    else{
      this._snackbar.open("Invalid username or password", "OK", { duration: 5000, horizontalPosition: "left", verticalPosition: "bottom" });
    }
  }

  public register(): void {
    if (!this.canSendRequest(RequestType.REGISTER)) {
      this._snackbar.open("Make sure you have entered a username, password and email", "OK", { duration: 5000, horizontalPosition: "left", verticalPosition: "bottom" });
      return;
    }
    this._dataService.register(this.username, this.password, this.email)
  }

  // Check if the user has entered required fields before sending a request.
  canSendRequest(type: RequestType): boolean {
    switch (type) {
      case RequestType.LOGIN:
        return (this.username !== "" && this.password !== "")
      case RequestType.REGISTER:
        return (this.username !== "" && this.password !== "" && this.email !== "")
    }
  }
}
