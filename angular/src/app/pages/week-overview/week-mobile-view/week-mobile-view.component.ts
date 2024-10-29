import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GlobalfunctionsService, updateType } from 'src/globalfunctions.service';
import * as moment from 'moment';
import { Appointment, day, DisplayAppointment } from 'src/app/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentComponent } from 'src/app/popups/appointment/appointment.component';
// import funciton from week-overview.component.ts
import { DataService } from 'src/data.service';
import { MobilePickDayPopupComponent } from 'src/app/popups/mobile-pick-day-popup/mobile-pick-day-popup.component';
import { HammerGestureConfig } from '@angular/platform-browser';
import * as Hammer from 'hammerjs'; // Import Hammer.js
import { WeekOverviewComponent } from '../week-overview.component';

export class MyHammerConfig extends HammerGestureConfig{
  override overrides = <any>{
    'swipe': { threshold:5, direction: Hammer.DIRECTION_HORIZONTAL }
  }
}

@Component({
  selector: 'app-week-mobile-view',
  templateUrl: './week-mobile-view.component.html',
  styleUrls: ['./week-mobile-view.component.scss']
})
export class WeekMobileViewComponent implements OnInit, AfterViewInit {
  @ViewChild('dateScroll') dateScroll: ElementRef;
  @ViewChild('daygridScroll') daygridScroll: ElementRef;

  public heightPerHour: number = 60; // also in week-mobile-view.component.scss (line 3 set variable --heightPerHour: 60px;)
  public widthPerDay: number = 280;
  public widthTimeColumn: number = 50;
  public dividerHeight: number = 3;

  //GLOBAL FUNCTIONS
  getDateNumber = this.globalfunctions.getDateNumber
  getDateName = this.globalfunctions.getDateName
  getFormattedTime = this.globalfunctions.getFormattedTime
  getCurrentTime = this.globalfunctions.getCurrentTime;
  getActivePosition() {
    return this.globalfunctions.getActivePosition(this.heightPerHour);
  }
  updateType = updateType;
  //GLOBAL FUNCTIONS

  public today: string = moment().format('YYYY-MM-DD');
  public activeDate: string = moment().format('YYYY-MM-DD');
  private appointments: Map<number, Appointment> = new Map<number, Appointment>();
  public days: day[] = [];
  public times: string[] = [];

  constructor(private globalfunctions: GlobalfunctionsService, private _dialog: MatDialog, private _dataservice: DataService) { }

  ngOnInit(): void {
    this.days = this.generateDays();
    this.times = this.globalfunctions.generateTimes();
    this.getAppointments(moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'));
  }

  ngAfterViewInit(): void {
    this.dateScroll.nativeElement.scrollLeft = 13 * 67;
    let hour = parseInt(this.getCurrentTime().hour, 10);
    let scrollHeight = 0;
    if (hour >= 0 && hour < 6) scrollHeight = 0;
    else if (hour >= 6 && hour < 24) scrollHeight = (hour - 2) * this.heightPerHour;
    else if (hour >= 17 && hour < 24) scrollHeight = 16 * this.heightPerHour;

    this.daygridScroll.nativeElement.scrollTop = scrollHeight;
  }

  getTaskStyle(disApp: DisplayAppointment): any {
    return this.globalfunctions.getTaskStyle(disApp, this.getActiveDay().displayAppointments, Array.from(this.appointments.values()), this.heightPerHour);
  }

  getActiveDay(): day {
    return this.days.find(day => day.date === this.activeDate) || this.days[0];
  }

  getAppointment(id: number): Appointment {
    return this.appointments.get(id) || {} as Appointment;
  }

  generateDays(middleDate?: Date): day[] {
    let days: day[] = [];

    let today = middleDate || new Date();
    let TwoWeeksAgo = new Date(today.setDate(today.getDate() - 14));

    for (let i = 0; i < 28; i++) {
      let date = new Date(TwoWeeksAgo.setDate(TwoWeeksAgo.getDate() + 1));
      days.push({
        date: moment(date).format('YYYY-MM-DD'),
        day: date.toLocaleString('en-us', { weekday: 'short' }),
        istoday: date.toDateString() === new Date().toDateString(),
        displayAppointments: []
      });
    }

    return days;
  }

  async openDetails(disApp: DisplayAppointment) {
    let appointment = this.getAppointment(disApp.appointmentid);
    let result = await this.globalfunctions.openAppointmentDetails(appointment);
    if (result.updateType === updateType.UPDATE || result.updateType === updateType.DELETE) {
      this.getAppointments(this.activeDate, this.activeDate);
    }
  }

  ShowCategory(disApp: DisplayAppointment): boolean {
    let day = this.days.find(day => day.date === disApp.date);
    if (!day) return false;

    let height = this.globalfunctions.getTaskStyle(disApp, day.displayAppointments, Array.from(this.appointments.values()), this.heightPerHour).height;
    let heightNumber = parseInt(height.slice(0, -2), 10);
    return heightNumber > 60;
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

  selectOtherDay(date: string) {
    this.activeDate = moment(date).format('YYYY-MM-DD');
    this.getAppointments(date, date);
  }

  handleDateSelection(date: string) {
    this.days = this.generateDays(new Date(date));
    this.selectOtherDay(date);
    this.dateScroll.nativeElement.scrollLeft = 13 * 67;
  }

  openDayPicker() {
    const dialog = this._dialog.open(MobilePickDayPopupComponent)
    dialog.afterClosed().subscribe((date) => {
      if (date) this.handleDateSelection(date);
    });
  }

  // day +1
  onSwipeLeft(){
    this.selectOtherDay(moment(this.activeDate).add(1, 'days').format('YYYY-MM-DD'));
  }

  // day -1
  onSwipeRight(){
    this.selectOtherDay(moment(this.activeDate).subtract(1, 'days').format('YYYY-MM-DD'));
  }
}
