import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { Appointment } from 'src/app/interfaces';
import { AppointmentComponent } from 'src/app/popups/appointment/appointment.component';
import { DataService } from 'src/data.service';
import { GlobalfunctionsService, updateType } from 'src/globalfunctions.service';

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

  public day: { date: string, day: string, datename: string, appointments: Appointment[] } = { date: moment().format('YYYY-MM-DD'), datename: this.getDateName(moment().format('YYYY-MM-DD')), day: moment().format('dddd'), appointments: [] };
  public times: string[] = [];

  constructor(private _dataservice: DataService, private globalfunctions: GlobalfunctionsService, private _dialog: MatDialog) { }

  // Global functions
  getCurrentTime = this.globalfunctions.getCurrentTime;
  getActivePosition() {
    return this.globalfunctions.getActivePosition(this.heightPerHour);
  }
  calculateOverlaps(appointments: Appointment[]) {
    return this.globalfunctions.calculateOverlaps(appointments, this.widthPerDay);
  }
  // Global functions

  ngOnInit(): void {
    this.times = this.globalfunctions.generateTimes();
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
    return this.globalfunctions.getTaskStyle(appointment, this.day.appointments, this.heightPerHour);
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

  getDateName(date: string): string {
    moment.locale('nl');
    let dateName = moment(date).format('dddd DD MMMM YYYY');
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

  dayDateSelected(date: string) {
    this.day = { date: date, datename: this.getDateName(date), day: moment(date).format('dddd'), appointments: [] };
    this.getAppointments(date, date);
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
}
