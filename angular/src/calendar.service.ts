import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Appointment, DisplayAppointment, Todo } from './app/interfaces';

export interface CalendarDay {
  date: Date;
  momentDate: string;
  displayAppointments: Array<DisplayAppointment>;
  isInSelectedMonth?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  currentDate: Date = new Date();

  constructor() { }

  getMonthView(year: number, month: number): CalendarDay[] {
    let days: CalendarDay[] = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Find the first day to display in the calendar (including the previous month)
    const startDay = new Date(firstDayOfMonth);
    startDay.setDate(startDay.getDate() - startDay.getDay()); // Adjust to start the week on Sunday

    // Find the last day to display in the calendar (including the next month)
    const endDay = new Date(lastDayOfMonth);
    while (endDay.getDay() !== 6) {
      endDay.setDate(endDay.getDate() + 1); // Ensure the week ends on Saturday
    }

    for (let day = new Date(startDay); day <= endDay; day.setDate(day.getDate() + 1)) {
      days.push({
        date: new Date(day),
        momentDate: moment(day).format('YYYY-MM-DD'),
        displayAppointments: [],
        isInSelectedMonth: day.getMonth() === month
      });
    }

    return days;
  }
}
