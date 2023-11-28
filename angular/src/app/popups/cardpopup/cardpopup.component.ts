import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/data.service';

interface todo {
  id: number,
  title: string,
  description: string,
  date: string
  todoOrder: number,
  deleted?: boolean
  IsCHE: boolean
}

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
  public todoCard: todo = { ...this.data }
  public todoCardCopy: todo = { ...this.todoCard };
  public editMode: boolean = false;
  todoCardProperty = todoCardProperty;

  constructor(private dialogRef: MatDialogRef<CardpopupComponent>, @Inject(MAT_DIALOG_DATA) public data: todo, private _dataService: DataService, private _snackBar: MatSnackBar) { }
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

  deleteCard(todoCard: todo) {
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

  markAsIrrelevant(todoCard: todo) {
    this._dataService.markAsIrrelevant(todoCard).subscribe(data => {
      if(data.status == "success"){
        this.todoCard.deleted = true;
        this.dialogRef.close(this.todoCard);
        return;
      }
      this._snackBar.open("Could not mark as irrelevant", "Close", {
        duration: 2000,
        horizontalPosition: 'left',
        verticalPosition: 'bottom',
      })
      this.dialogRef.close();
    })
  }
}
