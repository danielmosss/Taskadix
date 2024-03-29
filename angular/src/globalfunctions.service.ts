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

  openAppointmentDetails(appointment: Appointment) {
    this._dialog.open(AppointmentComponent, {
      data: appointment
    })
  }
}
