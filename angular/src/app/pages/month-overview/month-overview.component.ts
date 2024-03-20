import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Appointment, Todo } from 'src/app/interfaces';
import { CardpopupComponent } from 'src/app/popups/cardpopup/cardpopup.component';
import { CalendarService, CalendarDay } from 'src/calendar.service';
import { DataService } from 'src/data.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './month-overview.component.html',
  styleUrls: ['./month-overview.component.scss']
})
export class MonthOverviewComponent implements OnInit {
  monthView: { weeknumber: number, days: CalendarDay[] }[] = []
  today: Date = new Date();

  constructor(private calendarService: CalendarService, private _dataservice: DataService, private _dialog: MatDialog) { }

  ngOnInit(): void {
    this.getMonthView();
    //this.getTodoTasks();
    this.getMonthAppointments();
  }

  getMonthView(): void {
    const now = new Date();
    let flatMonthView = this.calendarService.getMonthView(now.getFullYear(), now.getMonth());
    // Transform flat array into weeks for easier management in template
    this.monthView = [];
    for (let i = 0; i < flatMonthView.length; i += 7) {
      this.monthView.push({
        weeknumber: this.getWeekNumber(flatMonthView[0].date),
        days: flatMonthView.slice(i, i + 7)
      })
    }
    console.log(this.monthView);
  }

  getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.valueOf() - firstDayOfYear.valueOf()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  getMonthAppointments() {
    this._dataservice.getAppointments(this.monthView[0].days[0].momentDate, this.monthView[5].days[6].momentDate).subscribe(monthData => {
      monthData.forEach(day => {
        let findday = this.findDayInMonthView(new Date(day.date))
        if (findday) {
          if (!findday.events) {
            findday.events = [];
          }
          day.appointments.forEach(appointment => {
            if (findday) findday.events.push(appointment);
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

  drop(event: CdkDragDrop<Appointment[], any>, weekIndex: number, dayIndex: number): void {
    if (event.previousContainer === event.container) {
      // Move the item within the same list
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Transfer the item to a different list
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    // Implement any additional update logic here
    console.log(this.monthView)
  }

  // Helper function to generate an array of connected drop lists
  getConnectedList(monthView: any): string[] {
    return monthView.reduce((previous: any, week: any, weekIndex: any) => {
      const weekLists = week.days.map((day: any, dayIndex: any) => `week${weekIndex}day${dayIndex}`);
      return previous.concat(weekLists);
    }, []);
  }

  openCardInfo(event: Appointment) {
    var dialog = this._dialog.open(CardpopupComponent, {
      data: event
    })
  }

  newAppointment(appointmentId: number) {
    console.log(appointmentId)
    this._dataservice.getAppointment(appointmentId).subscribe(appointment => {
      const date = new Date(appointment.date);
      const calendarDay = this.findDayInMonthView(date);
      if (!calendarDay) return;
      if (!calendarDay.events) {
        calendarDay.events = [];
      }
      calendarDay.events.push(appointment);
    })
  }
}
