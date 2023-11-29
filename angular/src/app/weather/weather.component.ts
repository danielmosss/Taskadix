import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/data.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { interfaceLocation, interfaceRainForcast, interfaceWeather } from '../interfaces';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {
  public currentWeather?: interfaceWeather;
  public location?: interfaceLocation;

  public rainForcast?: interfaceRainForcast;

  public buienradarUrl = "https://gadgets.buienradar.nl/gadget/zoommap/?lat=52.14&lng=5.58&overname=2&zoom=13&naam=Barneveld, Gelderland&size=2b&voor=1"
  sanitizedUrl: SafeResourceUrl | null = null;

  constructor(private _dataService: DataService, private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.sanitizedUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.buienradarUrl);

    this._dataService.getWeather().subscribe(data => {
      this.currentWeather = data.current
      this.location = data.location
      this.rainForcast = data.forecast
    })
  }
}
