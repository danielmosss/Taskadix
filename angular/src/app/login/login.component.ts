import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public username: string;
  public password: string;
  public hide: boolean = true;

  constructor(private _dataService: DataService) { }

  ngOnInit(): void {

  }

  public login(): void {
    console.log(this.username, this.password)
    this._dataService.login(this.username, this.password)
  }
}
