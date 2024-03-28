import { AfterContentInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Appointment, Todo } from 'src/app/interfaces';
import { DataService } from 'src/data.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentComponent } from 'src/app/popups/appointment/appointment.component';
import { GlobalfunctionsService } from 'src/globalfunctions.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // Global functions
  formatTime = this.globalfunctions.getFormattedTime;
  getDateName = this.globalfunctions.getDateName;
  openAppointmentDetails = this.globalfunctions.openAppointmentDetails;
  // Global functions


  public day: { date: string, day: string, appointments: Appointment[] } = { date: '', day: '', appointments: [] };
  public upcomingSevenDaysTodos: { date: string, tasks: Todo[] }[] = [];

  constructor(private _dataservice: DataService, private _dialog: MatDialog, private globalfunctions: GlobalfunctionsService) { }

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

  getAppointments(beginDate: string, endDate: string) {
    this._dataservice.getAppointments(beginDate, endDate).subscribe((data) => {
      data.forEach(element => {
        const day = this.day;
        if (day && element.appointments.length > 0) {
          day.appointments = element.appointments;
          day.appointments = day.appointments.sort((a, b) => a.starttime.localeCompare(b.starttime));
        }
      });
    });

    this._dataservice.getTodo().subscribe((data) => {
      this.upcomingSevenDaysTodos = data;
    });
  }

  getPercentTaskedChecked(tasks: Todo[]): number {
    let checkedTasks = tasks.filter(task => task.checked);
    return (checkedTasks.length / tasks.length) * 100;
  }

  checkTodo(isChecked: boolean, todo: Todo) {
    todo.checked = isChecked;
  }
}
