import { AfterContentInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Appointment, Todo } from 'src/app/interfaces';
import { DataService } from 'src/data.service';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public day: { date: string, day: string, appointments: Appointment[] } = { date: '', day: '', appointments: [] };
  public upcomingSevenDaysTodos: { date: string, tasks: Todo[] }[] = [];

  constructor(private _dataservice: DataService) { }

  ngOnInit(): void {
    this.day.date = moment().format('YYYY-MM-DD');
    this.day.day = moment().format('dddd');
    this.getAppointments(moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'));
  }

  getWeekNumber(): number {
    let date = new Date();
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.valueOf() - firstDayOfYear.valueOf()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  getDateName(date?: string): string {
    moment.locale('nl');
    let dateName = moment(date ? date : moment()).format('DD MMMM');
    dateName = dateName.charAt(0).toUpperCase() + dateName.slice(1);
    dateName = dateName.replace(/\b\w/g, l => l.toUpperCase());
    return dateName;
  }

  getAppointments(beginDate: string, endDate: string) {
    this._dataservice.getAppointments(beginDate, endDate).subscribe((data) => {
      data.forEach(element => {
        const day = this.day;
        if (day && element.appointments.length > 0) {
          day.appointments = element.appointments;
          // add them 5x more to day.appointments for testing overflow
          for (let i = 0; i < 5; i++) {
            day.appointments = day.appointments.concat(element.appointments);
          }
        }
      });
    });

    this._dataservice.getTodo().subscribe((data) => {
      this.upcomingSevenDaysTodos = data;
    });
  }

  getFormattedTime(time: string): string {
    return moment(time, 'HH:mm').format('HH:mm');
  }

  getPercentTaskedChecked(tasks: Todo[]): number {
    let checkedTasks = tasks.filter(task => task.checked);
    return (checkedTasks.length / tasks.length) * 100;
  }
}
