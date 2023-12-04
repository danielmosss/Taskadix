import { Component } from '@angular/core';
import { DataService } from 'src/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dashboard';

  constructor(private _dateService: DataService) { }

  isLoggedIn(): boolean {
    return this._dateService.isLoggedIn();
  }

  logout(){
    this._dateService.logout();
  }
}
