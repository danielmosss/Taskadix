import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NewAppointment, Todo, newTodoRequirements } from 'src/app/interfaces';
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
  public NewAppointment: NewAppointment = this.CreateNewAppointment();
  public categories: { id: number, term: string }[] =
    [
      { id: 1, term: "Work" },
      { id: 2, term: "Personal" },
      { id: 3, term: "Family" },
      { id: 4, term: "Friends" },
      { id: 5, term: "Other" }
    ];

  constructor(private dialogRef: MatDialogRef<CreateAppointmentComponent>, private _dataService: DataService, private _snackbar: MatSnackBar) { }
  ngOnInit(): void {
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


  setEndtime($event: string) {
    if (!this.NewAppointment.endtime) {
      this.NewAppointment.endtime = moment($event, "HH:mm").add(1, "hour").format("HH:mm");
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

  createAppointment(){
    this._dataService.createAppointment(this.NewAppointment).subscribe(
      (res) => {
        this.dialogRef.close(res);
        this._snackbar.open("Appointment created", '', { duration: 3000, horizontalPosition: 'left', panelClass: 'success' });
      }
    )
  }
}
