import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Todo } from './app/interfaces';

export interface CalendarDay {
  date: Date;
  momentDate?: string;
  events: Array<Todo>;
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
        events: []
      });
    }

    return days;
  }

  getWeekView(year: number, month: number, day: number): CalendarDay[] {
    let days: CalendarDay[] = [];
    const startDay = new Date(year, month, day);
    startDay.setDate(startDay.getDate() - startDay.getDay()); // Adjust to start the week on Sunday

    for (let i = 0; i < 7; i++) {
      days.push({
        date: new Date(startDay),
        momentDate: moment(startDay).format('YYYY-MM-DD'),
        events: []
      });
      startDay.setDate(startDay.getDate() + 1);
    }

    return days;
  }

  getDayView(year: number, month: number, day: number): CalendarDay[] {
    let days: CalendarDay[] = [];
    const date = new Date(year, month, day);
    days.push({
      date: date,
      momentDate: moment(date).format('YYYY-MM-DD'),
      events: []
    });

    return days;
  }
}
