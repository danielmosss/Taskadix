import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { Appointment, day, DisplayAppointment } from 'src/app/interfaces';
import { AppointmentComponent } from 'src/app/popups/appointment/appointment.component';
import { DataService } from 'src/data.service';
import { GlobalfunctionsService, updateType } from 'src/globalfunctions.service';
import { WeekOverviewComponent } from '../week-overview/week-overview.component';

@Component({
  selector: 'app-day-overview',
  templateUrl: './day-overview.component.html',
  styleUrls: ['./day-overview.component.scss']
})
export class DayOverviewComponent implements OnInit, AfterViewInit {
  @ViewChild('daygridScroll') daygridScroll: ElementRef;
  updateType = updateType;

  public heightPerHour: number = 60;
  public widthPerDay: number = 1670;
  public widthTimeColumn: number = 75;
  public dividerHeight: number = 3;
  public weeknumber: number = moment().week();

  private appointments: Map<number, Appointment> = new Map<number, Appointment>();
  public day: day = { date: '', day: '', istoday: false, displayAppointments: []};
  public times: string[] = [];
  public activeDate: string = moment().format('YYYY-MM-DD');

  constructor(private _dataservice: DataService, private globalfunctions: GlobalfunctionsService, private _dialog: MatDialog) { }

  // Global functions
  getCurrentTime = this.globalfunctions.getCurrentTime;
  getActivePosition() {
    return this.globalfunctions.getActivePosition(this.heightPerHour);
  }
  calculateOverlaps(disApps: DisplayAppointment[]) {
    return this.globalfunctions.calculateOverlaps(disApps, this.heightPerHour);
  }
  // Global functions

  ngOnInit(): void {
    this.times = this.globalfunctions.generateTimes();
    this.dayDateSelected(moment().format('YYYY-MM-DD'));
  }

  ngAfterViewInit(): void {
    let hour = parseInt(this.getCurrentTime().hour, 10);
    let scrollHeight = 0;
    if (hour >= 0 && hour < 6) scrollHeight = 0;
    else if (hour >= 6 && hour < 24) scrollHeight = (hour - 2) * this.heightPerHour;
    else if (hour >= 17 && hour < 24) scrollHeight = 16 * this.heightPerHour;

    this.daygridScroll.nativeElement.scrollTop = scrollHeight;
  }

  getAppointment(id: number): Appointment {
    return this.appointments.get(id) || {} as Appointment;
  }

  newAppointment(appointmentId: number) {
    this._dataservice.getAppointment(appointmentId).subscribe(appointment => {
      if (appointment.date !== this.day.date) return;
      // this.day.appointments.push(appointment);
      // this.day.appointments = this.calculateOverlaps(this.day.appointments);
      var displAppointments: DisplayAppointment[] = this.globalfunctions.processDisplayAppointments(appointment);
      displAppointments.forEach(displApp => {
        if (displApp.date === this.day.date) {
          this.day.displayAppointments.push(displApp);
        }
      });
      this.day.displayAppointments = this.calculateOverlaps(this.day.displayAppointments);
    })
  }

  getTaskStyle(disApp: DisplayAppointment): any {
    return this.globalfunctions.getTaskStyle(disApp, this.day.displayAppointments, Array.from(this.appointments.values()), this.heightPerHour);
  }

  getAppointments(beginDate: string, endDate: string) {
    this._dataservice.GetAppointmentsV3(beginDate, endDate).subscribe((data) => {
      if (data == null) return;
      data.forEach(appointment => {
        this.appointments.set(appointment.id, appointment);
        var displAppointments: DisplayAppointment[] = this.globalfunctions.processDisplayAppointments(appointment);
        displAppointments.forEach(displApp => {
          if (displApp.date === this.day.date) {
            this.day.displayAppointments.push(displApp);
          }
        });
        this.day.displayAppointments = this.calculateOverlaps(this.day.displayAppointments);
      });
    });
  }

  getDateName(date: string): string {
    moment.locale('nl');
    let dateName = moment(date).format('dddd DD MMMM YYYY');
    dateName = dateName.charAt(0).toUpperCase() + dateName.slice(1);
    dateName = dateName.replace(/\b\w/g, l => l.toUpperCase());
    return dateName;
  }

  ShowCategory(displApp: DisplayAppointment): boolean {
    let height = this.getTaskStyle(displApp).height;
    let heightNumber = parseInt(height.slice(0, -2), 10);
    return heightNumber > 60;
  }

  getFormattedTime(time: string): string {
    return moment(time, 'HH:mm').format('HH:mm');
  }

  dayDateSelected(date: string) {
    this.day = { date: date, day: moment(date).format('dddd'), istoday: moment(date).isSame(moment(), 'day'), displayAppointments: [] };
    this.getAppointments(date, date);
  }

  async openDetails(displayAppo: DisplayAppointment) {
    const appointment = this.getAppointment(displayAppo.appointmentid);
    let result = await this.globalfunctions.openAppointmentDetails(appointment);
    if (result.updateType === updateType.DELETE) {
      this.day.displayAppointments = this.day.displayAppointments.filter(disApp => disApp.appointmentid !== result.appointmentid);
      this.day.displayAppointments = this.calculateOverlaps(this.day.displayAppointments);
      this.appointments.delete(result.appointmentid);
    }
    if (result.updateType === updateType.UPDATE) {
      this.getAppointments(this.day.date, this.day.date);
    }
  }
}
