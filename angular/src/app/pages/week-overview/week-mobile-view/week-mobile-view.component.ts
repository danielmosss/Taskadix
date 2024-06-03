import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GlobalfunctionsService, updateType } from 'src/globalfunctions.service';
import { day } from '../week-overview.component';
import * as moment from 'moment';
import { Appointment } from 'src/app/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentComponent } from 'src/app/popups/appointment/appointment.component';
import { DataService } from 'src/data.service';
import { MobilePickDayPopupComponent } from 'src/app/popups/mobile-pick-day-popup/mobile-pick-day-popup.component';
import { HammerGestureConfig } from '@angular/platform-browser';
import * as Hammer from 'hammerjs'; // Import Hammer.js

export class MyHammerConfig extends HammerGestureConfig{
  override overrides = <any>{
    'swipe': { direction: Hammer.DIRECTION_ALL }
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
  getTaskStyle(appointment: Appointment): any {
    return this.globalfunctions.getTaskStyle(appointment, this.day.appointments, this.heightPerHour);
  }
  calculateOverlaps(appointments: Appointment[]) {
    return this.globalfunctions.calculateOverlaps(appointments, this.widthPerDay);
  }
  updateType = updateType;
  //GLOBAL FUNCTIONS

  public day: { date: string, day: string, datename: string, appointments: Appointment[] } = { date: moment().format('YYYY-MM-DD'), datename: this.getDateName(moment().format('YYYY-MM-DD')), day: moment().format('dddd'), appointments: [] };
  public today: string = moment().format('YYYY-MM-DD');
  public activeDate: string = moment().format('YYYY-MM-DD');
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
        appointments: []
      });
    }

    return days;
  }

  async openDetails(appointment: Appointment) {
    let result = await this.globalfunctions.openAppointmentDetails(appointment);
    if (result.updateType === updateType.DELETE) {
      this.day.appointments = this.day.appointments.filter(appointment => appointment.id !== result.appointmentid);
    }
    if (result.updateType === updateType.UPDATE) {
      this.getAppointments(this.day.date, this.day.date);
    }
  }

  ShowCategory(appointment: Appointment): boolean {
    let height = this.getTaskStyle(appointment).height;
    let heightNumber = parseInt(height.slice(0, -2), 10);
    return heightNumber > 60;
  }

  getAppointments(beginDate: string, endDate: string) {
    this._dataservice.getAppointments(beginDate, endDate).subscribe((data) => {
      if (data == null) return;
      data.forEach(element => {
        const day = this.day;
        if (day && element.appointments.length > 0) {
          day.appointments = element.appointments;
          day.appointments = this.calculateOverlaps(day.appointments);
        }
      });
    });
  }

  selectOtherDay(date: string) {
    this.day = { date: date, datename: this.getDateName(date), day: moment(date).format('dddd'), appointments: [] };
    this.getAppointments(date, date);
    this.activeDate = moment(date).format('YYYY-MM-DD');
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

  onSwipeLeft(){
    alert('swipe left');
  }

  onSwipeRight(){
    alert('swipe right');
  }
}
