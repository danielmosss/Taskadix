import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Appointment, NewAppointment } from 'src/app/interfaces';
import { DataService } from 'src/data.service';
import * as moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-create-appointment',
  templateUrl: './create-appointment.component.html',
  styleUrls: ['./create-appointment.component.scss']
})
export class CreateAppointmentComponent implements OnInit {
  public NewAppointment: NewAppointment;
  public editingExisting: boolean = false;
  public categories: { id: number, term: string }[] =
    [
      { id: 1, term: "Work" },
      { id: 2, term: "Personal" },
      { id: 3, term: "Family" },
      { id: 4, term: "Friends" },
      { id: 5, term: "Other" }
    ];

  constructor(
    private dialogRef: MatDialogRef<CreateAppointmentComponent>,
    private _dataService: DataService,
    private _snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public appointment: Appointment,
  ) { }

  ngOnInit(): void {
    if (this.appointment) {
      this.editingExisting = true;
      this.NewAppointment = {
        title: this.appointment.title,
        description: this.appointment.description,
        date: this.appointment.date,
        starttime: "00:00",
        endtime: "00:00",
        isAllDay: this.appointment.isAllDay,
        location: this.appointment.location,
        category: { id: this.appointment.category.id, term: this.appointment.category.term }
      }

      if (!this.NewAppointment.isAllDay) {
        this.NewAppointment.starttime = moment(this.appointment.starttime, "HH:mm").format("HH:mm");
        this.NewAppointment.endtime = moment(this.appointment.endtime, "HH:mm").format("HH:mm");
      }
    } else {
      this.NewAppointment = this.CreateNewAppointment();
    }
    this._dataService.getCategories().subscribe(categories => {
      this.categories = categories;
    })
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const formatted = moment(event.value).format('YYYY-MM-DD');
    this.NewAppointment.date = formatted;
  }

  cancel() {
    this.dialogRef.close();
  }

  changeTime($event: string, isStarttime: boolean) {
    if (isStarttime && this.NewAppointment.endtime === "") {
      this.NewAppointment.endtime = moment($event, "HH:mm").add(1, "hour").format("HH:mm");
    }
    let momentStart = moment(this.NewAppointment.starttime, "HH:mm");
    let momentEnd = moment($event, "HH:mm");
    if (!isStarttime && momentEnd.isBefore(momentStart)) {
      setTimeout(() => {
          this.NewAppointment.endtime = moment(this.NewAppointment.starttime, "HH:mm").add(1, "hour").format("HH:mm");
      }, 0);
    }
  }

  CreateNewAppointment(): NewAppointment {
    return {
      title: "",
      description: "",
      date: "",
      isAllDay: false,
      starttime: "",
      endtime: "",
      location: "",
      category: { id: 0, term: "" }
    }
  }

  categoryChange($event: any) {
    let category = this.categories.find(x => x.term === $event.value);
    if (!category) return;
    this.NewAppointment.category.id = category.id;
    this.NewAppointment.category.term = category.term;
  }

  canCreateAppointment() {
    let v = this.NewAppointment;
    return (
      v.title !== "" &&
      v.date !== "" &&
      v.category.id !== 0 &&
      (
        v.isAllDay
        ||
        (v.starttime !== "" && v.endtime !== "")
      )
    )
  }

  createAppointment() {
    if (this.editingExisting) {
      let updateAppointment: Appointment = {
        id: this.appointment.id,
        userid: this.appointment.userid,
        title: this.NewAppointment.title,
        description: this.NewAppointment.description,
        date: this.NewAppointment.date,
        isAllDay: this.NewAppointment.isAllDay,
        starttime: this.NewAppointment.starttime ? this.NewAppointment.starttime : "",
        endtime: this.NewAppointment.endtime,
        location: this.NewAppointment.location,
        iswebcall: this.appointment.iswebcall,
        category: { id: this.NewAppointment.category.id, term: this.NewAppointment.category.term, color: this.appointment.category.color },
      }

      this._dataService.updateAppointment(updateAppointment).subscribe((res) => {
        this.dialogRef.close(res.id);
        this._snackbar.open("Appointment updated", '', { duration: 3000, horizontalPosition: 'left', panelClass: 'success' });
      })
    }else{
      this._dataService.createAppointment(this.NewAppointment).subscribe((res) => {
        this.dialogRef.close(res.id);
        this._snackbar.open("Appointment created", '', { duration: 3000, horizontalPosition: 'left', panelClass: 'success' });
      })
    }
  }
}
