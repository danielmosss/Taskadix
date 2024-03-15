import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NewAppointment, Todo, newTodoRequirements } from 'src/app/interfaces';
import { DataService } from 'src/data.service';
import * as moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

enum todoCardProperty {
  title = "title",
  description = "description",
  date = "date"
}

@Component({
  selector: 'app-create-appointment',
  templateUrl: './create-appointment.component.html',
  styleUrls: ['./create-appointment.component.scss']
})
export class CreateAppointmentComponent implements OnInit {
  public todoCard?: newTodoRequirements;
  public formattedDate?: string = undefined;
  todoCardProperty = todoCardProperty;

  public begintime: string
  public endtime: string
  public eventIsWholeDay: boolean = false;
  public NewAppointment: NewAppointment = this.CreateNewAppointment();

  constructor(private dialogRef: MatDialogRef<CreateAppointmentComponent>, private _dataService: DataService) { }
  ngOnInit(): void {

  }

  changedProperty(property: todoCardProperty, event: any) {
    if (!this.todoCard) this.todoCard = { title: "", description: "" };

    switch (property) {
      case todoCardProperty.title:
        this.todoCard.title = event.target.value;
        break;
      case todoCardProperty.description:
        this.todoCard.description = event.target.value;
        break;
      case todoCardProperty.date:
        this.todoCard.date = event;
        break;
    }
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const formatted = moment(event.value).format('YYYY-MM-DD');
    this.formattedDate = formatted; // Update the input field with formatted date
    this.changedProperty(todoCardProperty.date, formatted);
  }

  cancel() {
    this.dialogRef.close();
  }

  saveCard() {
    if (!this.todoCard) this.cancel();
    else {
      this._dataService.postTodoInfo(this.todoCard).subscribe((data?: Todo) => {
        this.dialogRef.close(data);
      })
    }
  }

  // Check if the user has entered required fields.
  canSave() {
    return this.todoCard &&
           this.todoCard.title &&
           this.todoCard.description &&
           this.todoCard.date;
  }

  setEndtime($event: string){
    if (!this.endtime){
      this.endtime = moment($event, "HH:mm").add(1, "hour").format("HH:mm");
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
      categoryid: 0
    }
  }
}
