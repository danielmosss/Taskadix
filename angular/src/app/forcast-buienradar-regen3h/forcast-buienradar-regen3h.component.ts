import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DataService } from 'src/data.service';
import { interfaceRainForcastPerHour } from '../interfaces';
Chart.register(...registerables)
const timer = (ms: number) => new Promise(res => setTimeout(res, ms))

@Component({
  selector: 'app-forcast-buienradar-regen3h',
  templateUrl: './forcast-buienradar-regen3h.component.html',
  styleUrls: ['./forcast-buienradar-regen3h.component.scss']
})
export class ForcastBuienradarRegen3hComponent implements OnInit {

  constructor(private _dataservice: DataService) { }

  @Input() place: string = "";
  @Input() data: Array<interfaceRainForcastPerHour> = [];
  public chartData: Array<{ x: string, y: number }> = []
  public forcastData?: interfaceRainForcastPerHour
  ngOnInit(): void {
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
