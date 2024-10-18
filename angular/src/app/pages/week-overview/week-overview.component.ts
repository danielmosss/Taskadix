import { APP_BOOTSTRAP_LISTENER, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Appointment, day, DisplayAppointment } from 'src/app/interfaces';
import { CreateAppointmentComponent } from 'src/app/popups/create-appointment/create-appointment.component';
import * as moment from 'moment';
import { DataService } from 'src/data.service';
import { GlobalfunctionsService, updateType } from 'src/globalfunctions.service';
import { AppointmentComponent } from 'src/app/popups/appointment/appointment.component';

@Component({
  selector: 'app-week-overview',
  templateUrl: './week-overview.component.html',
  styleUrls: ['./week-overview.component.scss']
})
export class WeekOverviewComponent implements OnInit, AfterViewInit {

  // Global functions
  getDateNumber = this.globalfunctions.getDateNumber;
  getDateName = this.globalfunctions.getDateName;
  updateType = updateType;
  // Global functions

  @ViewChild('weekgridScroll') weekgridScroll: ElementRef;

  public weeknumber: number = 0;
  public activeTimePosition: string = this.GetActivePosition();

  public heightPerHour: number = 60;
  public widthPerDay: number = 235;
  public gridDividerWidth: number = 3;
  public dividerHeight: number = 3;

  private appointments: Map<number, Appointment> = new Map<number, Appointment>();
  public days: day[] = [];
  public times: string[] = [];

  constructor(private _dialog: MatDialog, private _dataservice: DataService, private globalfunctions: GlobalfunctionsService) { }

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

  getNumberOfWholeDayAppointments(day: day): number {
    return day.displayAppointments.filter(appointment => appointment.isAllDay).length;
  }

  getAppointment(id: number): Appointment {
    return this.appointments.get(id) || {} as Appointment;
  }

  getTaskStyle(disApp: DisplayAppointment): any {
    let day = this.findDayInWeek(new Date(disApp.date));
    if (!day) return;
    return this.globalfunctions.getTaskStyle(disApp, day.displayAppointments, Array.from(this.appointments.values()), this.heightPerHour);
  }

  findDayInWeek(date: Date): day | undefined {
    return this.days.find(day => day.date === moment(date).format('YYYY-MM-DD'));
  }

  weekSelected(dateRange: { start: string, end: string }) {
    this.days = this.generateCustomWeek(new Date(dateRange.start));
    this.weeknumber = moment(dateRange.start).week();
    this.getAppointments(dateRange.start, dateRange.end);
  }

  getAppointments(beginDate: string, endDate: string) {
    this.appointments.clear();
    this.days.forEach(day => day.displayAppointments = []);

    this._dataservice.GetAppointmentsV3(beginDate, endDate).subscribe((data) => {
      if (data == null) return;
      data.forEach(appointment => {
        this.appointments.set(appointment.id, appointment);
        var displAppointments: DisplayAppointment[] = this.globalfunctions.processDisplayAppointments(appointment);
        displAppointments.forEach(displApp => {
          let day = this.days.find(day => day.date === displApp.date);
          if (day) {
            day.displayAppointments.push(displApp);
          }
        });
      });
      this.days.forEach(day => {
        day.displayAppointments = this.globalfunctions.calculateOverlaps(day.displayAppointments, this.widthPerDay);
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

  generateCustomWeek(startDate: Date): day[] {
    const days: day[] = [];
    const today = new Date(startDate);
    const endDay = new Date(today);
    endDay.setDate(today.getDate() + 6); // Set endDay to 6 days after today

    for (let d = new Date(today); d <= endDay; d.setDate(d.getDate() + 1)) {
      days.push({
        date: moment(d).format('YYYY-MM-DD'),
        day: d.toLocaleString('en-us', { weekday: 'long' }),
        istoday: moment(d).isSame(moment(), 'day'),
        displayAppointments: []
      });
    }

    return days;
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
        displayAppointments: []
      })
      sunday.setDate(sunday.getDate() + 1);
    }
    return days;
  }

  ShowCategory(disApp: DisplayAppointment): boolean {
    let day = this.findDayInWeek(new Date(disApp.date));
    if (!day) return false;

    let height = this.globalfunctions.getTaskStyle(disApp, day.displayAppointments, Array.from(this.appointments.values()), this.heightPerHour).height;
    let heightNumber = parseInt(height.slice(0, -2), 10);
    return heightNumber > 30;
  }

  newAppointment(appointmentId: number) {
    this._dataservice.getAppointment(appointmentId).subscribe(appointment => {
      var displAppointments: DisplayAppointment[] = this.globalfunctions.processDisplayAppointments(appointment);
      displAppointments.forEach(displApp => {
        let day = this.days.find(day => day.date === displApp.date);
        if (day) {
          day.displayAppointments.push(displApp);
        }
      });
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

  async openDetails(disApp: DisplayAppointment) {
    const appointment = this.appointments.get(disApp.appointmentid);
    if (!appointment) return;

    let result = await this.globalfunctions.openAppointmentDetails(appointment);
    if (result.updateType === updateType.UPDATE || result.updateType === updateType.DELETE) {
      this.getAppointments(this.days[0].date, this.days[6].date);
    }
  }

  isMobile(): boolean {
    return this.globalfunctions.isMobile();
  }
}
