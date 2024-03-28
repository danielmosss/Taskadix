import { APP_BOOTSTRAP_LISTENER, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Appointment } from 'src/app/interfaces';
import { CreateAppointmentComponent } from 'src/app/popups/create-appointment/create-appointment.component';
import * as moment from 'moment';
import { DataService } from 'src/data.service';

interface day {
  date: string,
  day: string,
  istoday: boolean,
  appointments: Appointment[]
}

@Component({
  selector: 'app-week-overview',
  templateUrl: './week-overview.component.html',
  styleUrls: ['./week-overview.component.scss']
})
export class WeekOverviewComponent implements OnInit, AfterViewInit {
  @ViewChild('weekgridScroll') weekgridScroll: ElementRef;

  public weeknumber: number = 0;
  public activeTimePosition: string = this.GetActivePosition();

  public heightPerHour: number = 60;
  public widthPerDay: number = 235;
  public gridDividerWidth: number = 3;
  public dividerHeight: number = 3;

  public days: day[] = [];
  public times: string[] = [];

  constructor(private _dialog: MatDialog, private _dataservice: DataService) { }

  ngOnInit(): void {
    this.times = this.generateTimes();
    this.days = this.generateDays();
    this.weeknumber = moment().week();
    this.getAppointments(this.days[0].date, this.days[6].date);

    setInterval(() => {
      this.activeTimePosition = this.GetActivePosition();
    }, 60000);
  }

  ngAfterViewInit(): void {
    let hour = parseInt(this.getCurrentTime().hour, 10);
    let scrollHeight = 0;
    if (hour >= 0 && hour < 6) scrollHeight = 0;
    else if (hour >= 6 && hour < 24) scrollHeight = (hour - 2) * this.heightPerHour;
    else if (hour >= 17 && hour < 24) scrollHeight = 16 * this.heightPerHour;

    this.weekgridScroll.nativeElement.scrollTop = scrollHeight;
  }

  findDayInWeek(date: Date): { date: string, day: string, appointments: Appointment[] } | undefined {
    return this.days.find(day => day.date === moment(date).format('YYYY-MM-DD'));
  }

  getAppointments(beginDate: string, endDate: string) {
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
    for (let hour = 0; hour < 24; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return times;
  }

  generateDays(): day[] {
    const days: day[] = [];
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 0);
    const sunday = new Date(today.setDate(diff));
    for (let i = 0; i < 7; i++) {
      days.push({
        date: moment(sunday).format('YYYY-MM-DD'),
        day: sunday.toLocaleString('en-us', { weekday: 'long' }),
        istoday: moment(sunday).isSame(moment(), 'day'),
        appointments: []
      })
      sunday.setDate(sunday.getDate() + 1);
    }
    return days;
  }

  calculateOverlaps(tasks: Appointment[]): Appointment[] {
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
      const width = this.widthPerDay / overlaps.length;
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

  getTaskStyle(appointment: Appointment): any {
    if (appointment.isAllDay) {
      let top = 30;
      const wholeDayAppointments = this.days.find(day => day.date === appointment.date)?.appointments.filter(appointment => appointment.isAllDay);
      if (wholeDayAppointments) {
        top = (wholeDayAppointments.indexOf(appointment) * (top + 10));
      }
      return { 'top.px': top, 'height': '30px', width: '100%', left: '0px' };
    }

    const startHour = parseInt(appointment.starttime.split(':')[0], 10);
    const startMinute = parseInt(appointment.starttime.split(':')[1], 10);
    const endHour = parseInt(appointment.endtime.split(':')[0], 10);
    const endMinute = parseInt(appointment.endtime.split(':')[1], 10);

    const startPosition = (startHour + startMinute / 60) * this.heightPerHour; // Bijvoorbeeld, 9.30 wordt 570 (9*60 + 30)
    const endPosition = (endHour + endMinute / 60) * this.heightPerHour;

    const height = endPosition - startPosition;

    return {
      top: `${startPosition}px`,
      height: `${height}px`,
      width: `${appointment.width}px`,
      left: `${appointment.left}px`
    };
  }

  ShowCategory(appointment: Appointment): boolean {
    let height = this.getTaskStyle(appointment).height;
    let heightNumber = parseInt(height.slice(0, -2), 10);
    return heightNumber > 30;
  }

  newAppointment(appointmentId: number) {
    this._dataservice.getAppointment(appointmentId).subscribe(appointment => {
      const date = new Date(appointment.date);
      const calendarDay = this.findDayInWeek(date);
      if (!calendarDay) return;
      if (!calendarDay.appointments) {
        calendarDay.appointments = [];
      }
      calendarDay.appointments.push(appointment);
      calendarDay.appointments = this.calculateOverlaps(calendarDay.appointments);
    })
  }

  getFormattedTime(time: string): string {
    return moment(time, 'HH:mm').format('HH:mm');
  }

  getCurrentTime(): { hour: string, minute: string } {
    const currentTime = moment().format('HH:mm');
    return { hour: currentTime.split(':')[0], minute: currentTime.split(':')[1] };
  }

  getDateNumber(date: string): string {
    return moment(date).format('DD');
  }

  GetActivePosition(): string {
    const { hour: currentHour, minute: currentMinute } = this.getCurrentTime();
    const position = (parseInt(currentHour, 10) + parseInt(currentMinute, 10) / 60) * this.heightPerHour;
    return position.toString()
  }
}
