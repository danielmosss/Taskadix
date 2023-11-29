import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/data.service';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Todo, newTodoRequirements } from 'src/app/interfaces';



enum todoCardProperty {
  title = "title",
  description = "description",
  date = "date"
}

@Component({
  selector: 'app-create-todo',
  templateUrl: './create-todo.component.html',
  styleUrls: ['./create-todo.component.scss'],
  providers: [DatePipe]
})
export class CreateTodoComponent implements OnInit {
  public todoCard?: newTodoRequirements;
  public formattedDate?: string = undefined;
  todoCardProperty = todoCardProperty;

  constructor(private dialogRef: MatDialogRef<CreateTodoComponent>, private _dataService: DataService, private _datePipe: DatePipe) { }
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

  canSave() {
    if (!this.todoCard) return false;
    else if (!this.todoCard.title) return false;
    else if (!this.todoCard.description) return false;
    else if (!this.todoCard.date) return false;
    else if (this.todoCard.title == "") return false;
    else if (this.todoCard.description == "") return false;
    else if (this.todoCard.date == "") return false;
    else return true;
  }
}
