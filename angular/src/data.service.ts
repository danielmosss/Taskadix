import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _hostname = "http://localhost:8000";

  constructor(private http: HttpClient) { }

  public getWeather() {
    return this.http.get(this._hostname + "/weather");
  }
}
