import { APP_BOOTSTRAP_LISTENER, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
export class WeekOverviewComponent implements OnInit, AfterViewInit {
  @ViewChild('weekgridScroll') weekgridScroll: ElementRef;

  public weeknumber: number = 0;
  public heightPerHour: number = 90;
  public widthPerDay: number = 240;
  public dividerHeight: number = 3;

  public days: { date: string, day: string, appointments: Appointment[] }[] = [];
  public times: string[] = [];

  constructor(private _dialog: MatDialog, private _dataservice: DataService) { }

  ngOnInit(): void {
    this.times = this.generateTimes();
    this.days = this.generateDays();
    this.getAppointments(this.days[0].date, this.days[6].date);
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

      const gap = 4;
      const width = (this.widthPerDay - gap * (overlaps.length - 1)) / overlaps.length;

      overlaps.forEach((task, index) => {
        task.width = width;
        task.left = index * (width + gap);
      });

      i += overlaps.length - 1;
    }

    return sortedTasks;
  }

  getTaskStyle(task: Appointment): any {
    if (task.isAllDay) {
      let top = 30;
      const wholeDayAppointments = this.days.find(day => day.date === task.date)?.appointments.filter(appointment => appointment.isAllDay);
      if (wholeDayAppointments) {
        top = (wholeDayAppointments.indexOf(task) * (top + 4));
      }
      return { 'top.px': top, 'height': '30px', width: '100%', left: '0px' };
    }

    const startHour = parseInt(task.starttime.split(':')[0], 10);
    const startMinute = parseInt(task.starttime.split(':')[1], 10);
    const endHour = parseInt(task.endtime.split(':')[0], 10);
    const endMinute = parseInt(task.endtime.split(':')[1], 10);

    const startPosition = (startHour + startMinute / 60) * this.heightPerHour; // Bijvoorbeeld, 9.30 wordt 570 (9*60 + 30)
    const endPosition = (endHour + endMinute / 60) * this.heightPerHour;

    const height = endPosition - startPosition;

    return {
      top: `${startPosition}px`,
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

  getFormattedTime(time: string): string {
    return moment(time, 'HH:mm').format('HH:mm');
  }

  getCurrentTime(): { hour: string, minute: string } {
    const currentTime = moment().format('HH:mm');
    return { hour: currentTime.split(':')[0], minute: currentTime.split(':')[1] };
  }


  GetActivePosition(): string {
    const { hour: currentHour, minute: currentMinute } = this.getCurrentTime();
    const position = (parseInt(currentHour, 10) + parseInt(currentMinute, 10) / 60) * this.heightPerHour;
    return position.toString()
  }
}
