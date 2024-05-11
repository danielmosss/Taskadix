import { AfterContentInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Appointment, Todo } from 'src/app/interfaces';
import { DataService } from 'src/data.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentComponent } from 'src/app/popups/appointment/appointment.component';
import { GlobalfunctionsService, updateType } from 'src/globalfunctions.service';
import { CreateAppointmentComponent } from 'src/app/popups/create-appointment/create-appointment.component';
import { CreateTodoComponent } from 'src/app/popups/create-todo/create-todo.component';
import { CardpopupComponent } from 'src/app/popups/cardpopup/cardpopup.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // Global functions
  formatTime = this.globalfunctions.getFormattedTime;
  getDateName = this.globalfunctions.getDateName;
  getWeekNumber = this.globalfunctions.getWeekNumber;
  isMobile = this.globalfunctions.isMobile;
  getDateWeekname = this.globalfunctions.getDateWeekname;
  updateType = updateType;
  // Global functions


  public day: { date: string, day: string, appointments: Appointment[] } = { date: '', day: '', appointments: [] };
  public upcomingSevenDaysTodos: { date: string, tasks: Todo[] }[] = [];

  constructor(private _dataservice: DataService, private _dialog: MatDialog, private globalfunctions: GlobalfunctionsService) { }

  ngOnInit(): void {
    this.day.date = moment().format('YYYY-MM-DD');
    this.day.day = moment().format('dddd');
    this.getAppointments(moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'));
  }

  getAppointments(beginDate: string, endDate: string) {
    this._dataservice.getAppointments(beginDate, endDate).subscribe((data) => {
      if (!data) return;
      data.forEach(element => {
        const day = this.day;
        if (day && element.appointments.length > 0) {
          day.appointments = element.appointments;
          day.appointments = day.appointments.sort((a, b) => a.starttime.localeCompare(b.starttime));
        }
      });
    });

    this._dataservice.getTodo().subscribe((data) => {
      this.upcomingSevenDaysTodos = data;
    });
  }

  getPercentTaskedChecked(tasks: Todo[]): number {
    let checkedTasks = tasks.filter(task => task.checked);
    return (checkedTasks.length / tasks.length) * 100;
  }

  checkTodo(isChecked: boolean, todo: Todo) {
    todo.checked = isChecked;
    this._dataservice.checkTodoTask(todo).subscribe();
  }

  async openDetails(appointment: Appointment) {
    let result = await this.globalfunctions.openAppointmentDetails(appointment);
    if (result.updateType === updateType.DELETE) {
      this.day.appointments = this.day.appointments.filter(appointment => appointment.id !== result.appointmentid);
    }
    if (result.updateType === updateType.UPDATE) {
      // TODO: update only the appointment that was updated, not all appointments
      this.getAppointments(this.day.date, this.day.date);
    }
  }

  openTodoDetails(todo: Todo) {
    var dialog = this._dialog.open(CardpopupComponent, {
      data: todo
    })
    dialog.afterClosed().subscribe((data?: Todo) => {
      if (!data) return;
      if (data.deleted) {
        this.upcomingSevenDaysTodos.forEach(day => {
          day.tasks = day.tasks.filter(task => task.id !== data.id);
        })
      }
      else if (!data.deleted) {
        this.upcomingSevenDaysTodos.forEach(day => {
          day.tasks.forEach(task => {
            if (task.id === data.id) {
              Object.assign(task, data);
            }
          })
        })
      }
    })
  }

  openCreateAppointment() {
    let dialog = this._dialog.open(CreateAppointmentComponent)
    dialog.afterClosed().subscribe((newAppointmentId: number) => {
      this._dataservice.getAppointment(newAppointmentId).subscribe(appointment => {
        if (appointment.date !== this.day.date) return;
        this.day.appointments.push(appointment);
        this.day.appointments = this.day.appointments.sort((a, b) => a.starttime.localeCompare(b.starttime));
      })
    })
  }

  openCreateTodo() {
    var dialog = this._dialog.open(CreateTodoComponent)
    dialog.afterClosed().subscribe((data?: Todo) => {
      if (!data) return;
      this.upcomingSevenDaysTodos.forEach(day => {
        if (day.date === data.date) {
          day.tasks.push(data);
        }
      })
    })
  }

}
