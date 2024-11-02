import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Appointment, NewAppointment } from 'src/app/interfaces';
import { DataService } from 'src/data.service';
import * as moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';


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

  public GetTenLastLocationsUser: string[] = [];
  locationControl = new FormControl();
  filteredLocations: Observable<string[]>;

  displayFn(location: string): string {
    return location ? location : '';
  }


  constructor(
    private dialogRef: MatDialogRef<CreateAppointmentComponent>,
    private _dataService: DataService,
    private _snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public appointment: Appointment,
  ) { }

  ngOnInit(): void {

    this._dataService.GetTenLastLocationsUser().subscribe((res) => {
      this.GetTenLastLocationsUser = res;

      this.filteredLocations = this.locationControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    })

    if (this.appointment) {
      this.editingExisting = true;
      this.NewAppointment = {
        title: this.appointment.title,
        description: this.appointment.description,
        date: this.appointment.date,
        enddate: this.appointment.enddate,
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

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.GetTenLastLocationsUser.filter(location => location.toLowerCase().includes(filterValue));
  }

  onDateChange(event: MatDatepickerInputEvent<Date>, isEnddate: boolean) {
    const formatted = moment(event.value).format('YYYY-MM-DD');
    if (isEnddate) this.NewAppointment.enddate = formatted;
    else {
      this.NewAppointment.date = formatted;
      if (this.NewAppointment.enddate === "") {
        this.NewAppointment.enddate = formatted;
      }
    }
    this.checkIfDateAndTimeAreValid();
  }

  checkIfDateAndTimeAreValid() {
    // check if date is the same that endtime is after starttime
    // and if enddate is after date

    if (this.NewAppointment.date === this.NewAppointment.enddate) {
      if (!this.NewAppointment.isAllDay) {
        let start = moment(this.NewAppointment.starttime, "HH:mm");
        let end = moment(this.NewAppointment.endtime, "HH:mm");
        if (end.isBefore(start)) {
          this.NewAppointment.endtime = moment(this.NewAppointment.starttime, "HH:mm").add(1, 'hour').format("HH:mm");
        }
      }
    }
  }


  cancel() {
    this.dialogRef.close();
  }

  changeTime($event: string, isStarttime: boolean) {
    if (isStarttime){
      if(this.NewAppointment.endtime === ""){
        this.NewAppointment.endtime = moment($event, "HH:mm").add(1, 'hour').format("HH:mm");
      }
    }
    this.checkIfDateAndTimeAreValid();
  }

  CreateNewAppointment(): NewAppointment {
    return {
      title: "",
      description: "",
      date: "",
      enddate: "",
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
    let moment1 = moment(v.date + "T" + v.starttime);
    let moment2 = moment(v.enddate + "T" + v.endtime);
    var bool = moment2.isAfter(moment1);
    console.log(moment1 + " " + moment2 + " " + bool);
    return (
      v.title !== "" &&
      v.date !== "" &&
      v.category.id !== 0 &&
      (
      v.isAllDay
      ||
      (v.starttime !== "" && v.endtime !== "")
      )
      &&
      //check if enddate is after date
      moment(v.enddate + "T" + v.endtime).isAfter(moment(v.date + "T" + v.starttime)) &&
      //check if endtime is after starttime if dates are the same
      (
      v.isAllDay
      ||
      (moment(v.enddate).isSame(v.date) ? moment(v.endtime, "HH:mm").isAfter(moment(v.starttime, "HH:mm")) : true)
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
        enddate: this.NewAppointment.enddate,
        isAllDay: this.NewAppointment.isAllDay,
        starttime: this.NewAppointment.starttime ? this.NewAppointment.starttime : "",
        endtime: this.NewAppointment.endtime,
        location: this.NewAppointment.location,
        ics_import_id: this.appointment.ics_import_id,
        category: { id: this.NewAppointment.category.id, term: this.NewAppointment.category.term, color: this.appointment.category.color },
      }

      this._dataService.updateAppointment(updateAppointment).subscribe((res) => {
        this.dialogRef.close(res.id);
        this._snackbar.open("Appointment updated", '', { duration: 3000, horizontalPosition: 'left', panelClass: 'success' });
      })
    } else {
      this._dataService.createAppointment(this.NewAppointment).subscribe((res) => {
        this.dialogRef.close(res.id);
        this._snackbar.open("Appointment created", '', { duration: 3000, horizontalPosition: 'left', panelClass: 'success' });
      })
    }
  }
}
