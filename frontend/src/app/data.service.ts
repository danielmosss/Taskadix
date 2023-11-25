import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private REST_API_SERVER = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  public getWeather() {
    return this.http.get
}
