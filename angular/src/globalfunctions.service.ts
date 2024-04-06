import { Injectable, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Appointment } from './app/interfaces';
import { AppointmentComponent } from './app/popups/appointment/appointment.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class GlobalfunctionsService {

  constructor(private _dialog: MatDialog) { }

  getFormattedTime(time: string): string {
    return moment(time, 'HH:mm').format('HH:mm');
  }

  getDateName(date?: string): string {
    moment.locale('nl');
    let dateName = moment(date ? date : moment()).format('DD MMMM');
    dateName = dateName.charAt(0).toUpperCase() + dateName.slice(1);
    dateName = dateName.replace(/\b\w/g, l => l.toUpperCase());
    return dateName;
  }

  getDateNumber(date: string): string {
    return moment(date).format('DD');
  }

  openAppointmentDetails(appointment: Appointment) {
    let dialog = this._dialog.open(AppointmentComponent, {
      data: appointment
    })
    dialog.afterClosed().subscribe(result => {
      if (result) {

      }
    })
  }

  getWeekNumber(date?: Date): number {
    date = date ? date : new Date();
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.valueOf() - firstDayOfYear.valueOf()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  isMobile(): boolean {
    return window.innerWidth < 600;
  }
}
