import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/data.service';

const exampleJson = [
  {
    "title": "Title Required",
    "description": "Description Required",
    "date": "YYYY-MM-DD"
  },
  {
    "title": "Title Required",
    "description": "Description Required",
    "date": "YYYY-MM-DD"
  },
  {
    "title": "Title Required",
    "description": "Description Required",
    "date": "YYYY-MM-DD"
  }
]

interface uploadTodoJson {
  title: string,
  description: string,
  date: string
}

@Component({
  selector: 'app-uploadjson',
  templateUrl: './uploadjson.component.html',
  styleUrls: ['./uploadjson.component.scss']
})
export class UploadjsonComponent implements OnInit {
  constructor(private _snackBar: MatSnackBar, private _dataService: DataService, private dialogRef: MatDialogRef<UploadjsonComponent>) { }

  ngOnInit(): void {

  }

  close() {
    this.dialogRef.close();
  }

  getJson(){
   return JSON.stringify(exampleJson).replace(/},/g, "},\n");
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file.type !== "application/json") {
      this._snackBar.open("File must be of type .json", "Dismiss", { duration: 5000, horizontalPosition: "left", verticalPosition: "bottom" });
      return;
    }

    this.readFile(file).then((data: any) => {
      data.data = data.data.replace(/data:application\/json;base64,/g, "");
      var uploadedJson: uploadTodoJson[];

      try {
        uploadedJson = JSON.parse(atob(data.data));
      } catch (error) {
        this._snackBar.open("Json must be valid", "Dismiss", { duration: 5000, horizontalPosition: "left", verticalPosition: "bottom" });
        return;
      }

      if (!uploadedJson.every(item => item.title && item.description && item.date)) {
        this._snackBar.open("Json must be valid", "Dismiss", { duration: 5000, horizontalPosition: "left", verticalPosition: "bottom" });
        return;
      }

      if (!uploadedJson.every(item => {
        var date = new Date(item.date);
        return date instanceof Date && !isNaN(date.getTime()) && item.date.split("-").length == 3;
      })) {
        this._snackBar.open("Date must be valid and in format YYYY-MM-DD", "Dismiss", { duration: 5000, horizontalPosition: "left", verticalPosition: "bottom" });
        return;
      }

      try {
        this._dataService.uploadBulkTodos(uploadedJson).subscribe(data => {
          this._snackBar.open("Uploaded", "Dismiss", { duration: 5000, horizontalPosition: "left", verticalPosition: "bottom" });
          this.dialogRef.close(data);
        })
      } catch (error) {
        this._snackBar.open("Error uploading", "Dismiss", { duration: 5000, horizontalPosition: "left", verticalPosition: "bottom" });
        this.close();
      }
    })
  }

  // File reader that returns a promise.
  readFile(file: File){
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (e: Event) {
        resolve({ name: file.name, data: (<any>e.target).result });
      };
      reader.onerror = function (e) {
        reject(e);
      };
      reader.readAsDataURL(file)
    })
  }

}
