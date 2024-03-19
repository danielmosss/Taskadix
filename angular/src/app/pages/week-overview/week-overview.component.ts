import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateAppointmentComponent } from 'src/app/popups/create-appointment/create-appointment.component';

export interface WeekTask {
  id: string;
  title: string;
  description: string;
  day: string; // 'Monday', 'Tuesday', etc.
  startTime: string; // Bijvoorbeeld '10:00'
  endTime: string; // Bijvoorbeeld '11:00'
  width?: number;
  left?: number;
}


@Component({
  selector: 'app-week-overview',
  templateUrl: './week-overview.component.html',
  styleUrls: ['./week-overview.component.scss']
})
export class WeekOverviewComponent implements OnInit{
  public weeknumber: number = 0;
  public heightPerHour: number = 60;
  public dividerHeight: number = 2;

  constructor(private _dialog: MatDialog) { }

  ngOnInit(): void {
    this.weekAppointments = this.calculateOverlaps(this.weekAppointments);
  }

  weekAppointments: WeekTask[] = [
    {
      id: '1',
      title: 'Meeting',
      description: 'Meeting with the team',
      day: 'Monday',
      startTime: '10:00',
      endTime: '11:00'
    },
    {
      id: '3',
      title: 'Meeting 2',
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

  calculateOverlaps(tasks: WeekTask[]): WeekTask[] {
    const sortedTasks = tasks.sort((a, b) => a.startTime.localeCompare(b.startTime));

    for (let i = 0; i < sortedTasks.length; i++) {
      let overlaps = [sortedTasks[i]];

      for (let j = i + 1; j < sortedTasks.length; j++) {
        if (sortedTasks[j].startTime < sortedTasks[i].endTime) {
          overlaps.push(sortedTasks[j]);
        } else {
          break;
        }
      }

      const width = 250 / overlaps.length;
      overlaps.forEach((task, index) => {
        task.width = width;
        task.left = width * index;
      });

      i += overlaps.length - 1;
    }

    return sortedTasks;
  }

  getTaskStyle(task: WeekTask): any {
    const startHour = parseInt(task.startTime.split(':')[0], 10);
    const startMinute = parseInt(task.startTime.split(':')[1], 10);
    const endHour = parseInt(task.endTime.split(':')[0], 10);
    const endMinute = parseInt(task.endTime.split(':')[1], 10);

    const startPosition = (startHour + startMinute / 60) * this.heightPerHour; // Bijvoorbeeld, 9.30 wordt 570 (9*60 + 30)
    const endPosition = (endHour + endMinute / 60) * this.heightPerHour;

    const height = endPosition - startPosition;

    return {
      top: `${startPosition}px`, // Hier ga je ervan uit dat elke uur 60px hoog is
      height: `${height}px`,
      width: `${task.width}px`,
      left: `${task.left}px`
    };
  }
}
