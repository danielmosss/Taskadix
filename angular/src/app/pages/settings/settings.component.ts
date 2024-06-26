import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Appointment, Category, Todo, appointmentCategory, backup } from 'src/app/interfaces';
import { CreateCategoryComponent } from 'src/app/popups/create-category/create-category.component';
import { DataService } from 'src/data.service';
import { GlobalfunctionsService } from 'src/globalfunctions.service';

enum SettingsTabs {
  Account,
  Categories,
  Family,
  Backup,
  Help
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  SettingsTabs = SettingsTabs;
  public activeTab: SettingsTabs = SettingsTabs.Account;

  public categories: appointmentCategory[] = [];
  public editCategory: appointmentCategory | null = null;

  constructor(private _snackBar: MatSnackBar, private _dataservice: DataService, private _dialog: MatDialog, private globalfunctions: GlobalfunctionsService) { }

  isMobile() {
    return this.globalfunctions.isMobile();
  }

  ngOnInit() {
  }

  changeTab(tab: SettingsTabs) {
    this.activeTab = tab;
    if (tab === SettingsTabs.Categories) {
      this._dataservice.getCategories().subscribe((data: any) => {
        this.categories = data;
      });
    }
  }

  isActive(tab: SettingsTabs): boolean {
    return this.activeTab === tab;
  }

  createCategory() {
    let dialog = this._dialog.open(CreateCategoryComponent)
    dialog.afterClosed().subscribe((category) => {
      if (category) {
        this.categories.push(category);
      }
    });
  }

  selectEditCategory(category: appointmentCategory) {
    this.editCategory = category;
  }

  saveCategory(category: appointmentCategory) {
    this._dataservice.updateCategory(category).subscribe(() => {
      this.editCategory = null;
    });
  }

  deleteCategory(category: appointmentCategory) {
    this._dataservice.deleteCategory(category).subscribe(() => {
      this.categories = this.categories.filter((c) => c.id !== category.id);
    });
  }


  downloadBackup() {
    this._dataservice.getBackup().subscribe((data: any) => {
      const element = document.createElement('a');
      const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      element.href = URL.createObjectURL(file);
      element.download = "taskadix-backup-" + new Date().toISOString().split('T')[0] + ".json";
      document.body.appendChild(element);
      element.click();
    });
  }
  restoreBackup($event: any) {
    const file: File = $event.target.files[0];
    if (file.type !== "application/json") {
      this._snackBar.open("File must be of type .json", "Dismiss", { duration: 5000, horizontalPosition: "left", verticalPosition: "bottom" });
      return;
    }

    this.globalfunctions.readFile(file).then((data: any) => {
      data.data = data.data.replace(/data:application\/json;base64,/g, "");
      var uploadedJson: backup

      try {
        uploadedJson = JSON.parse(atob(data.data));
      } catch (error) {
        this._snackBar.open("Your backupfile is not valid", "Dismiss", { duration: 5000, horizontalPosition: "left", verticalPosition: "bottom" });
        return;
      }

      if (uploadedJson.templatev == 2) {
        this._dataservice.restorebackup(uploadedJson).subscribe(data => {
          this._snackBar.open("Your backup has been restored", "Dismiss", { duration: 5000, horizontalPosition: "left", verticalPosition: "bottom" });
        })
      }
    })
  }
}
