import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateAppointmentComponent } from 'src/app/popups/create-appointment/create-appointment.component';

export interface WeekTask {
  id: string;
  title: string;
  description: string;
  day: string; // 'Monday', 'Tuesday', etc.
  startTime: string; // Bijvoorbeeld '10:00'
  endTime: string; // Bijvoorbeeld '11:00'
}


@Component({
  selector: 'app-week-overview',
  templateUrl: './week-overview.component.html',
  styleUrls: ['./week-overview.component.scss']
})
export class WeekOverviewComponent {

  constructor(private _dialog: MatDialog) { }

  weekTasks: WeekTask[] = [
    {
      id: '1',
      title: 'Meeting',
      description: 'Meeting with the team',
      day: 'Monday',
      startTime: '10:00',
      endTime: '11:00'
    },
    {
      id: '2',
      title: 'Lunch',
      description: 'Lunch with the team',
      day: 'Monday',
      startTime: '12:00',
      endTime: '13:00'
    }
  ];

  times = this.generateTimes();
  days = this.generateDays();


  generateTimes(): string[] {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return times;
  }

  generateDays(): string[] {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  }

  // getTaskStyle(task: WeekTask): any {
  //   const startHour = parseInt(task.startTime.split(':')[0], 10);
  //   const startMinute = parseInt(task.startTime.split(':')[1], 10);
  //   const endHour = parseInt(task.endTime.split(':')[0], 10);
  //   const endMinute = parseInt(task.endTime.split(':')[1], 10);

  //   const startRow = (startHour - 7) * 2 + (startMinute / 30) + 1; // Adjusted for 7:00 start and 2 rows per hour
  //   const endRow = (endHour - 7) * 2 + (endMinute / 30) + 1; // Adjusted for 7:00 start and 2 rows per hour

  //   return {
  //     'grid-row-start': startRow,
  //     'grid-row-end': endRow
  //   };
  // }

  getTaskStyle(task: WeekTask): any {
    const startHour = parseInt(task.startTime.split(':')[0], 10);
    const startMinute = parseInt(task.startTime.split(':')[1], 10);
    const endHour = parseInt(task.endTime.split(':')[0], 10);
    const endMinute = parseInt(task.endTime.split(':')[1], 10);

    const startPosition = (startHour + startMinute / 60) * 50; // Bijvoorbeeld, 9.30 wordt 570 (9*60 + 30)
    const endPosition = (endHour + endMinute / 60) * 50;

    const height = endPosition - startPosition;

    return {
      top: `${startPosition}px`, // Hier ga je ervan uit dat elke uur 60px hoog is
      height: `${height}px`
    };
  }
}
