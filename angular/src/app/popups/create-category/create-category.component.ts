import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/data.service';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss']
})
export class CreateCategoryComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<CreateCategoryComponent>, private _snackbar: MatSnackBar, private _dataservice: DataService) { }
  public newCategoryName: string;
  public newCategoryColor: string;

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    if (!this.newCategoryName || !this.newCategoryColor) {
      this._snackbar.open("Please fill out all fields", "", { duration: 2000 });
      return;
    }

    this._dataservice.createCategory(this.newCategoryName, this.newCategoryColor).subscribe((data: any) => {
      this.dialogRef.close(data);
      this._snackbar.open("Category created", "", { duration: 2000 });
    })
  }
}
