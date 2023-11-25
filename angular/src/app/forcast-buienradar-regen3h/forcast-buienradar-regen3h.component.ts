import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DataService } from 'src/data.service';
Chart.register(...registerables)
const timer = (ms: number) => new Promise(res => setTimeout(res, ms))

interface interfaceRainForcast {
  date: string,
  date_epoch: number,
  day: {
    maxtemp_c: number,
    maxtemp_f: number,
    mintemp_c: number,
    mintemp_f: number,
    avgtemp_c: number,
    avgtemp_f: number,
    maxwind_mph: number,
    maxwind_kph: number,
    totalprecip_mm: number,
    totalprecip_in: number,
    totalsnow_cm: number,
    avgvis_km: number,
    avgvis_miles: number,
    avghumidity: number,
    daily_will_it_rain: number,
    daily_chance_of_rain: number,
    daily_will_it_snow: number,
    daily_chance_of_snow: number,
    condition: {
      text: string,
      icon: string,
      code: number
    },
    uv: number
  },
  astro: {
    sunrise: string,
    sunset: string,
    moonrise: string,
    moonset: string,
    moon_phase: string,
    moon_illumination: number,
    is_moon_up: number,
    is_sun_up: number
  },
  hour: Array<{
    time_epoch: number,
    time: string,
    temp_c: number,
    temp_f: number,
    is_day: number,
    condition: {
      text: string,
      icon: string,
      code: number
    },
    wind_mph: number,
    wind_kph: number,
    wind_degree: number,
    wind_dir: string,
    pressure_mb: number,
    pressure_in: number,
    precip_mm: number,
    precip_in: number,
    humidity: number,
    cloud: number,
    feelslike_c: number,
    feelslike_f: number,
    windchill_c: number,
    windchill_f: number,
    heatindex_c: number,
    heatindex_f: number,
    dewpoint_c: number,
    dewpoint_f: number,
    will_it_rain: number,
    chance_of_rain: number,
    will_it_snow: number,
    chance_of_snow: number,
    vis_km: number,
    vis_miles: number,
    gust_mph: number,
    gust_kph: number,
    uv: number
  }>
}


@Component({
  selector: 'app-forcast-buienradar-regen3h',
  templateUrl: './forcast-buienradar-regen3h.component.html',
  styleUrls: ['./forcast-buienradar-regen3h.component.scss']
})
export class ForcastBuienradarRegen3hComponent implements OnInit {

  constructor(private _dataservice: DataService) { }

  @Input() place: string = "";
  @Input() data: Array<interfaceRainForcast> = [];
  public chartData: Array<{ x: string, y: number }> = []
  public forcastData?: interfaceRainForcast
  ngOnInit(): void {
    console.log(this.data)
    this.forcastData = this.data[0]
    this.forcastData.hour.forEach(element => {
      var time = element.time.split(" ")[1]
      this.chartData.push({ x: time, y: element.precip_mm })
    })

    this.RenderChart()
  }

  RenderChart() {
    Chart.defaults.font.size = 14

    new Chart("Regen", {
      type: 'line',
      data: {
        datasets: [
          {
            label: this.place,
            data: this.chartData,
            backgroundColor: '#2c22ef',
            pointStyle: false,
            pointHitRadius: 10,
            fill: true,
            tension: 0.2
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "#3f4147",
            },
            border: {
              color: "rgba(255, 255, 255, 1)"
            },
            suggestedMax: 10,
            ticks: {
              stepSize: 2.5
            }
          },
          x: {
            border: {
              color: "rgba(255, 255, 255, 1)"
            },
            position: 'bottom'
          }
        }
      }
    });
  }
}
