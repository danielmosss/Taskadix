import { Component, Inject, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { Todo } from 'src/app/interfaces';
import { DataService } from 'src/data.service';
import { GlobalfunctionsService } from 'src/globalfunctions.service';

enum todoCardProperty {
  title = "title",
  description = "description"
}

@Component({
  selector: 'app-cardpopup',
  templateUrl: './cardpopup.component.html',
  styleUrls: ['./cardpopup.component.scss']
})
export class CardpopupComponent implements OnInit {
  public todoCard: Todo = { ...this.data }
  public todoCardCopy: Todo = { ...this.todoCard };
  public editMode: boolean = false;
  todoCardProperty = todoCardProperty;
  public formattedDate?: string = undefined;

  constructor(private dialogRef: MatDialogRef<CardpopupComponent>, @Inject(MAT_DIALOG_DATA) public data: Todo, private _dataService: DataService, private _snackBar: MatSnackBar, private globalfunctions: GlobalfunctionsService) { }

  getDateName = this.globalfunctions.getDateName;

  ngOnInit(): void {

  }

  editCard(cancel?: boolean) {
    if (cancel) {
      if (this.todoCardCopy) this.todoCard = this.todoCardCopy;
    }
    this.editMode = !this.editMode;
  }

  async saveCard() {
    await this._dataService.putTodoInfo(this.todoCard).toPromise()
    this.dialogRef.close(this.todoCard);
  }

  deleteCard(todoCard: Todo) {
    this._dataService.deleteTodoTask(todoCard).subscribe(data => {
      this.todoCard.deleted = true;
      this.dialogRef.close(this.todoCard);
    })
  }

  matdialogclose() {
    this.dialogRef.close();
  }

  changedProperty(property: todoCardProperty, event: any) {
    switch (property) {
      case todoCardProperty.title:
        this.todoCard.title = event.target.value;
        break;
      case todoCardProperty.description:
        this.todoCard.description = event.target.value;
        break;
    }
  }

  checkTodo(todoCard: Todo) {
    todoCard.checked = !todoCard.checked;
    this._dataService.checkTodoTask(todoCard).subscribe(data => {
      if (data.status == "success") {
        this.dialogRef.close(todoCard);
        return;
      }
      todoCard.checked = !todoCard.checked;
      this._snackBar.open("Could not check todo", "Close", {
        duration: 2000,
        horizontalPosition: 'left',
        verticalPosition: 'bottom',
      })
      this.dialogRef.close();
    })
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const formatted = moment(event.value).format('YYYY-MM-DD');
    this.formattedDate = formatted; // Update the input field with formatted date
    this.todoCard.date = formatted;
  }
}
