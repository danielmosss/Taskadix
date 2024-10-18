import { Injectable, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Appointment, DisplayAppointment } from './app/interfaces';
import { AppointmentComponent } from './app/popups/appointment/appointment.component';
import { MatDialog } from '@angular/material/dialog';

export enum updateType {
  ADD = 'add',
  UPDATE = 'update',
  DELETE = 'delete',
  NONE = 'none'
}

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

  getDateWeekname(date: string, capitalLetter: boolean = false, letters: number = 0, locale: string): string {
    const dateObj = new Date(date);
    let name = dateObj.toLocaleString(locale, { weekday: 'long' })
    if (letters > 0) name = name.slice(0, letters);
    if (capitalLetter) name = name.charAt(0).toUpperCase() + name.slice(1);
    return name;
  }

  async openAppointmentDetails(appointment: Appointment): Promise<{ updateType: updateType, appointmentid: number }> {
    const dialog = this._dialog.open(AppointmentComponent, {
      data: appointment
    });

    const result = await dialog.afterClosed().toPromise();
    if (result) {
      return result;
    }
    return { updateType: updateType.NONE, appointmentid: 0 };
  }

  //week starts from sunday and ends on saturday
  getWeekNumber(date?: Date): number {
    date = date ? date : new Date();
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const dayOfWeek = firstDayOfYear.getDay();
    const offset = (dayOfWeek > 0) ? dayOfWeek - 1 : 6;
    const pastDaysOfYear = (date.valueOf() - firstDayOfYear.valueOf()) / 86400000;

    const totalDays = pastDaysOfYear + offset;

    return Math.ceil((totalDays + 1) / 7);
  }


  isMobile(): boolean {
    return window.innerWidth < 600;
  }

  getTaskStyle(disApp: DisplayAppointment, disAppointments: DisplayAppointment[], appointments: Appointment[], heightPerHour: number): { top: string, height: string, width: string, left: string, 'z-index': string } {
    const appointment = appointments.find(appointment => appointment.id === disApp.appointmentid);
    if (!appointment) {
      return { top: '0px', height: '0px', width: '0px', left: '0px', 'z-index': '0' };
    }

    if (appointment.isAllDay) {
      let top = 30;
      top = (disAppointments.filter(disApp => disApp.isAllDay).indexOf(disApp) * (top + 10));
      return { 'top': `${top}px`, 'height': '30px', width: '100%', left: '0px', 'z-index': '3' };
    }

    const startHour = parseInt(disApp.starttime.split(':')[0], 10);
    const startMinute = parseInt(disApp.starttime.split(':')[1], 10);
    const endHour = parseInt(disApp.endtime.split(':')[0], 10);
    const endMinute = parseInt(disApp.endtime.split(':')[1], 10);

    const startPosition = (startHour + startMinute / 60) * heightPerHour; // Bijvoorbeeld, 9.30 wordt 570 (9*60 + 30)
    const endPosition = (endHour + endMinute / 60) * heightPerHour;

    const height = endPosition - startPosition;

    return {
      top: `${startPosition}px`,
      height: `${height}px`,
      width: `${disApp.width}px`,
      left: `${disApp.left}px`,
      'z-index': '2'
    };
  }

  getCurrentTime(): { hour: string, minute: string } {
    const currentTime = moment().format('HH:mm');
    return { hour: currentTime.split(':')[0], minute: currentTime.split(':')[1] };
  }

  getActivePosition(heightPerHour: number): string {
    const { hour: currentHour, minute: currentMinute } = this.getCurrentTime();
    const position = (parseInt(currentHour, 10) + parseInt(currentMinute, 10) / 60) * heightPerHour;
    return position.toString()
  }

  generateTimes(): string[] {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return times;
  }

  calculateOverlaps(tasks: DisplayAppointment[], widthPerDay: number): DisplayAppointment[] {
    // Sort tasks by start time
    const sortedTasks = tasks.sort((a, b) => a.starttime.localeCompare(b.starttime));
    const result = [];

    let i = 0;
    while (i < sortedTasks.length) {
      const currentTask = sortedTasks[i];
      let overlaps = [currentTask];

      // Find all tasks that overlap with the current or any overlapping task
      let maxEndTime = currentTask.endtime;
      for (let j = i + 1; j < sortedTasks.length; j++) {
        const nextTask = sortedTasks[j];
        if (nextTask.starttime < maxEndTime) {
          overlaps.push(nextTask);
          if (nextTask.endtime > maxEndTime) {
            maxEndTime = nextTask.endtime;
          }
        } else {
          break;
        }
      }

      // Calculate width and left for overlapping tasks
      const width = widthPerDay / overlaps.length;
      overlaps.forEach((task, index) => {
        task.width = width;
        task.left = index * width
      });

      // Add processed tasks to the result array
      result.push(...overlaps);

      // Skip over the processed tasks
      i += overlaps.length;
    }
    return result;
  }

  processDisplayAppointments(appointment: Appointment): DisplayAppointment[] {
    // appointments can be over multipledays, so we need to create a displayappointment for each day.
    // we need to check which part of the multiple day appointment is in this week.
    let displayAppointments: DisplayAppointment[] = [];

    //if single day appointment
    if (appointment.date === appointment.enddate) {
      let displayAppointment: DisplayAppointment = {
        starttime: appointment.starttime,
        endtime: appointment.endtime,
        isAllDay: appointment.isAllDay,
        date: appointment.date,
        appointmentid: appointment.id,
      }
      displayAppointments.push(displayAppointment);
    }

    // if multiple day appointment
    else if (appointment.date !== appointment.enddate) {
      let startDate = new Date(appointment.date);
      let endDate = new Date(appointment.enddate);
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        let starttime = appointment.starttime;
        let endtime = appointment.endtime;

        if (currentDate.toDateString() === startDate.toDateString()) {
          starttime = appointment.starttime;
          endtime = '23:59:00';
        }
        else
        if (currentDate.toDateString() === endDate.toDateString()) {
          starttime = '00:00:00';
          endtime = appointment.endtime;
        }
        else {
          starttime = '00:00:00';
          endtime = '23:59:00';
        }

        if (appointment.isAllDay) {
          starttime = '00:00:00';
          endtime = '00:00:00';
        }

        let displayAppointment: DisplayAppointment = {
          starttime: starttime,
          endtime: endtime,
          isAllDay: appointment.isAllDay,
          date: moment(currentDate).format('YYYY-MM-DD'),
          appointmentid: appointment.id,
        }
        displayAppointments.push(displayAppointment);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    return displayAppointments;
  }

  readFile(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (e: Event) {
        resolve({ name: file.name, data: (<any>e.target).result });
      };
      reader.onerror = function (e) {
        reject(e);
      };
      reader.readAsDataURL(file)
    })
  }
}
