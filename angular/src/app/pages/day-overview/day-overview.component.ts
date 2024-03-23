import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Appointment } from 'src/app/interfaces';
import { DataService } from 'src/data.service';

@Component({
  selector: 'app-day-overview',
  templateUrl: './day-overview.component.html',
  styleUrls: ['./day-overview.component.scss']
})
export class DayOverviewComponent implements OnInit, AfterViewInit {
  @ViewChild('daygridScroll') daygridScroll: ElementRef;

  public heightPerHour: number = 60;
  public widthPerDay: number = 1698;
  public widthTimeColumn: number = 75;
  public dividerHeight: number = 3;
  public weeknumber: number = moment().week();

  public day: { date: string, day: string, appointments: Appointment[] } = { date: moment().format('YYYY-MM-DD'), day: moment().format('dddd'), appointments: [] };
  public times: string[] = [];

  constructor(private _dataservice: DataService) { }

  ngOnInit(): void {
    this.times = this.generateTimes();
    this.getAppointments(moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'));
  }

  ngAfterViewInit(): void {
    let hour = parseInt(this.getCurrentTime().hour, 10);
    let scrollHeight = 0;
    if (hour >= 0 && hour < 6) scrollHeight = 0;
    else if (hour >= 6 && hour < 24) scrollHeight = (hour - 2) * this.heightPerHour;
    else if (hour >= 17 && hour < 24) scrollHeight = 16 * this.heightPerHour;

    this.daygridScroll.nativeElement.scrollTop = scrollHeight;
  }

  newAppointment(appointmentId: number) {
    this._dataservice.getAppointment(appointmentId).subscribe(appointment => {
      if (appointment.date !== this.day.date) return;
      this.day.appointments.push(appointment);
      this.day.appointments = this.calculateOverlaps(this.day.appointments);
    })
  }

  getTaskStyle(appointment: Appointment): any {
    if (appointment.isAllDay) {
      let top = 30;
      const wholeDayAppointments = this.day.appointments.filter(appointment => appointment.isAllDay);
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

  getAppointments(beginDate: string, endDate: string) {
    this._dataservice.getAppointments(beginDate, endDate).subscribe((data) => {
      data.forEach(element => {
        const day = this.day;
        if (day && element.appointments.length > 0) {
          day.appointments = element.appointments;
          day.appointments = this.calculateOverlaps(day.appointments);
        }
      });
    });
  }

  getDateName(): string {
    moment.locale('nl');
    let dateName = moment().format('dddd DD MMMM YYYY');
    dateName = dateName.charAt(0).toUpperCase() + dateName.slice(1);
    dateName = dateName.replace(/\b\w/g, l => l.toUpperCase());
    return dateName;
  }

  ShowCategory(appointment: Appointment): boolean {
    let height = this.getTaskStyle(appointment).height;
    let heightNumber = parseInt(height.slice(0, -2), 10);
    return heightNumber > 60;
  }

  getFormattedTime(time: string): string {
    return moment(time, 'HH:mm').format('HH:mm');
  }

  generateTimes(): string[] {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return times;
  }

  getCurrentTime(): { hour: string, minute: string } {
    const currentTime = moment().format('HH:mm');
    return { hour: currentTime.split(':')[0], minute: currentTime.split(':')[1] };
  }

  getActivePosition(): string {
    const { hour: currentHour, minute: currentMinute } = this.getCurrentTime();
    const position = (parseInt(currentHour, 10) + parseInt(currentMinute, 10) / 60) * this.heightPerHour;
    return position.toString()
  }
}
