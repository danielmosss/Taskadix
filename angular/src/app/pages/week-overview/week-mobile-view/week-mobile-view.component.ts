import { Component, OnInit } from '@angular/core';
import { GlobalfunctionsService } from 'src/globalfunctions.service';
import { day } from '../week-overview.component';
import * as moment from 'moment';

@Component({
  selector: 'app-week-mobile-view',
  templateUrl: './week-mobile-view.component.html',
  styleUrls: ['./week-mobile-view.component.scss']
})
export class WeekMobileViewComponent implements OnInit {
  //day of today minus 14 days and plus 14 days. create little boxes with the date and underneath the dayname. aling them with display flex row and let them overflow-x left and right. auto scroll to today.

  constructor(private globalfunctions: GlobalfunctionsService) { }

  getDateNumber = this.globalfunctions.getDateNumber;


  public days: day[] = [];

  ngOnInit(): void {
    this.days = this.generateDays();
  }

  generateDays(): day[] {
    let days: day[] = [];

    let today = new Date();
    let TwoWeeksAgo = new Date(today.setDate(today.getDate() - 14));

    for (let i = 0; i < 28; i++) {
      let date = new Date(TwoWeeksAgo.setDate(TwoWeeksAgo.getDate() + 1));
      let day = this.globalfunctions.getDateName(date.toISOString());
      days.push({
        date: moment(date).format('YYYY-MM-DD'),
        day: date.toLocaleString('en-us', { weekday: 'short' }),
        istoday: date.toDateString() === new Date().toDateString(),
        appointments: []
      });
    }

    return days;
  }
}
