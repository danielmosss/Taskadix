import { APP_BOOTSTRAP_LISTENER, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Appointment } from 'src/app/interfaces';
import { CreateAppointmentComponent } from 'src/app/popups/create-appointment/create-appointment.component';
import * as moment from 'moment';
import { DataService } from 'src/data.service';


@Component({
  selector: 'app-week-overview',
  templateUrl: './week-overview.component.html',
  styleUrls: ['./week-overview.component.scss']
})
export class WeekOverviewComponent implements OnInit {
  public weeknumber: number = 0;
  public heightPerHour: number = 60;
  public widthPerDay: number = 240;
  public dividerHeight: number = 2;

  public days: { date: string, day: string, appointments: Appointment[] }[] = [];
  public times: string[] = [];

  constructor(private _dialog: MatDialog, private _dataservice: DataService) { }

  ngOnInit(): void {
    this.times = this.generateTimes();
    this.days = this.generateDays();
    this.getAppointments(this.days[0].date, this.days[6].date);
  }

  findDayInWeek(date: Date): { date: string, day: string, appointments: Appointment[] } | undefined {
    return this.days.find(day => day.date === moment(date).format('YYYY-MM-DD'));
  }

  getAppointments(beginDate: string, endDate: string){
    // Get appointments from the database
    this._dataservice.getAppointments(beginDate, endDate).subscribe((data) => {
      data.forEach(element => {
        const day = this.days.find(day => day.date === element.date);
        if (day && element.appointments.length > 0) {
          day.appointments = element.appointments;
          day.appointments = this.calculateOverlaps(day.appointments);
        }
      });
    });
  }

  generateTimes(): string[] {
    const times = [];
    for (let hour = 0; hour <= 24; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return times;
  }

  // this needs to give back an {date: string, day: string}[] from sunday to saturday for the current week
  generateDays(): { date: string, day: string, appointments: Appointment[] }[] {
    const days: { date: string, day: string, appointments: Appointment[] }[] = [];
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 0);
    const sunday = new Date(today.setDate(diff));
    for (let i = 0; i < 7; i++) {
      days.push({
        date: moment(sunday).format('YYYY-MM-DD'),
        day: sunday.toLocaleString('en-us', { weekday: 'long' }),
        appointments: []
      })
      sunday.setDate(sunday.getDate() + 1);
    }
    return days;
  }

  calculateOverlaps(tasks: Appointment[]): Appointment[] {
    const sortedTasks = tasks.sort((a, b) => a.starttime.localeCompare(b.starttime));

    for (let i = 0; i < sortedTasks.length; i++) {
      let overlaps = [sortedTasks[i]];

      for (let j = i + 1; j < sortedTasks.length; j++) {
        if (sortedTasks[j].starttime < sortedTasks[i].endtime) {
          overlaps.push(sortedTasks[j]);
        } else {
          break;
        }
      }

      const width = this.widthPerDay / overlaps.length;
      overlaps.forEach((task, index) => {
        task.width = width;
        task.left = width * index;
      });

      i += overlaps.length - 1;
    }

    return sortedTasks;
  }

  getTaskStyle(task: Appointment): any {
    if (task.isAllDay) return { top: '0px', height: '30px', width: '100%', left: '0px' };

    const startHour = parseInt(task.starttime.split(':')[0], 10);
    const startMinute = parseInt(task.starttime.split(':')[1], 10);
    const endHour = parseInt(task.endtime.split(':')[0], 10);
    const endMinute = parseInt(task.endtime.split(':')[1], 10);

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

  newAppointment(appointmentId: number) {
    console.log(appointmentId)
    this._dataservice.getAppointment(appointmentId).subscribe(appointment => {
      const date = new Date(appointment.date);
      const calendarDay = this.findDayInWeek(date);
      if (!calendarDay) return;
      if (!calendarDay.appointments) {
        calendarDay.appointments = [];
      }
      calendarDay.appointments.push(appointment);
    })
  }
}
