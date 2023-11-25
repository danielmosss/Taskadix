import { Component } from '@angular/core';
import { DataService } from 'src/data.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent {
  constructor(private _dataService: DataService) { }
  ngOnInit(): void {
    this._dataService.getWeather().subscribe(data => {
      console.log(data);
    })
  }
}
