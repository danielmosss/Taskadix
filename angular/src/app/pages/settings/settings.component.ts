import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { appointmentCategory } from 'src/app/interfaces';
import { CreateCategoryComponent } from 'src/app/popups/create-category/create-category.component';
import { DataService } from 'src/data.service';

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

  constructor(private _dataservice: DataService, private _dialog: MatDialog) { }

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

  // changedCategoryColor(category: appointmentCategory) {
  //   this._dataservice.updateCategory(category)
  // }
}
