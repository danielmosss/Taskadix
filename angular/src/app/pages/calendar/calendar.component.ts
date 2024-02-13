import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Todo } from 'src/app/interfaces';
import { CardpopupComponent } from 'src/app/popups/cardpopup/cardpopup.component';
import { CalendarService, CalendarDay } from 'src/calendar.service';
import { DataService } from 'src/data.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  monthView: CalendarDay[][] = [];

  constructor(private calendarService: CalendarService, private _dataservice: DataService, private _dialog: MatDialog) { }

  ngOnInit(): void {
    this.getMonthView();
    this.getTodoTasks();
  }

  getMonthView(): void {
    const now = new Date();
    let flatMonthView = this.calendarService.getMonthView(now.getFullYear(), now.getMonth());
    // Transform flat array into weeks for easier management in template
    this.monthView = [];
    for (let i = 0; i < flatMonthView.length; i += 7) {
      this.monthView.push(flatMonthView.slice(i, i + 7));
    }
    console.log(this.monthView);
  }

  getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.valueOf() - firstDayOfYear.valueOf()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  getTodoTasks(): void {
    this._dataservice.getTodo().subscribe(data => {
      console.log(data)
      data.forEach((task: any) => {
        if (task.tasks.length == 0) return;
        const date = new Date(task.date);
        const calendarDay = this.findDayInMonthView(date);
        if (!calendarDay) return;
        if (!calendarDay.events) {
          calendarDay.events = [];
        }
        //calendarDay.events.push(task.tasks);
        task.tasks.forEach((todo: any) => {
          if(calendarDay.events) calendarDay.events.push(todo);
        })
      })
      console.log(this.monthView)
    });
  }

  findDayInMonthView(day: Date): CalendarDay | undefined {
    for (let week of this.monthView) {
      for (let calendarDay of week) {
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

  drop(event: CdkDragDrop<Todo[], any>, weekIndex: number, dayIndex: number): void {
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
    return monthView.reduce((previous:any, week:any, weekIndex:any) => {
      const weekLists = week.map((day:any, dayIndex:any) => `week${weekIndex}day${dayIndex}`);
      return previous.concat(weekLists);
    }, []);
  }

  openCardInfo(event: Todo){
    var dialog = this._dialog.open(CardpopupComponent, {
      data: event
    })
  }
}
