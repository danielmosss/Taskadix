import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Appointment, Todo } from 'src/app/interfaces';
import { AppointmentComponent } from 'src/app/popups/appointment/appointment.component';
import { CardpopupComponent } from 'src/app/popups/cardpopup/cardpopup.component';
import { CalendarService, CalendarDay } from 'src/calendar.service';
import { DataService } from 'src/data.service';
import { GlobalfunctionsService, updateType } from 'src/globalfunctions.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './month-overview.component.html',
  styleUrls: ['./month-overview.component.scss']
})
export class MonthOverviewComponent implements OnInit {

  // Global functions
  getWeekNumber = this.globalfunctions.getWeekNumber
  formatTime = this.globalfunctions.getFormattedTime;
  updateType = updateType;
  // Global functions

  monthView: { weeknumber: number, days: CalendarDay[] }[] = []
  today: Date = new Date();

  constructor(private calendarService: CalendarService, private _dataservice: DataService, private _dialog: MatDialog, private globalfunctions: GlobalfunctionsService) { }

  ngOnInit(): void {
    this.getMonthView();
  }

  getMonthView(date?: any): void {
    if (!date) date = new Date();
    let monthNr = new Date(date).getMonth();
    let yearNr = new Date(date).getFullYear();
    let flatMonthView = this.calendarService.getMonthView(yearNr, monthNr);

    this.monthView = [];
    for (let i = 0; i < flatMonthView.length; i += 7) {
      this.monthView.push({
        weeknumber: this.getWeekNumber(flatMonthView[i + 1].date),
        days: flatMonthView.slice(i, i + 7)
      })
    }

    this.getMonthAppointments();
  }

  getMonthAppointments() {
    this._dataservice.getAppointments(this.monthView[0].days[0].momentDate, this.monthView[this.monthView.length - 1].days[6].momentDate).subscribe(monthData => {
      monthData.forEach(day => {
        let findday = this.findDayInMonthView(new Date(day.date))
        if (findday) {
          if (!findday.appointments) {
            findday.appointments = [];
          }
          findday.appointments = day.appointments;

          // order: wholeday, then time based
          findday.appointments = findday.appointments.sort((a, b) => {
            if (a.isAllDay && !b.isAllDay) return -1;
            if (!a.isAllDay && b.isAllDay) return 1;
            if (a.isAllDay && b.isAllDay) return 0;
            return a.starttime.localeCompare(b.starttime);
          })
        }
      })
    })
  }

  findDayInMonthView(day: Date): CalendarDay | undefined {
    for (let week of this.monthView) {
      for (let calendarDay of week.days) {
        if (calendarDay.date.toDateString() === day.toDateString()) {
          return calendarDay;
        }
      }
    }
    return undefined;
  }

  jsonFyObject(obj: any): string {
    return JSON.stringify(obj);
  }

  newAppointment(appointmentId: number) {
    console.log(appointmentId)
    this._dataservice.getAppointment(appointmentId).subscribe(appointment => {
      const date = new Date(appointment.date);
      const calendarDay = this.findDayInMonthView(date);
      if (!calendarDay) return;
      if (!calendarDay.appointments) calendarDay.appointments = [];
      calendarDay.appointments.push(appointment);
    })
  }

  monthSelected(date: string) {
    this.getMonthView(date);
  }

  async openDetails(appointment: Appointment) {
    let result = await this.globalfunctions.openAppointmentDetails(appointment);
    if (result.updateType === updateType.DELETE) {
      this.monthView.forEach(week => {
        week.days.forEach(day => {
          if (day.appointments) day.appointments = day.appointments.filter(appointment => appointment.id !== result.appointmentid);
        })
      })
    }
    if (result.updateType === updateType.UPDATE) {
      // TODO: update only the appointment itself, not the whole month
      this.getMonthAppointments();
    }
  }
}
