import { Component, OnInit } from '@angular/core';
import { appointmentCategory } from 'src/app/interfaces';
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
export class SettingsComponent implements OnInit{
  SettingsTabs = SettingsTabs;
  public activeTab: SettingsTabs = SettingsTabs.Account;

  public categories: appointmentCategory[] = [];
  public newCategoryName: string = "";
  public newCategoryColor: string = "#000000";

  constructor(private _dataservice: DataService) {}

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

  addCategory() {
    //make database call

    // add to categories
    this.categories.push({
      id: 0,
      term: this.newCategoryName,
      color: this.newCategoryColor,
      userid: 0,
      isdefault: false
    });
    this.newCategoryName = "";
    this.newCategoryColor = "#000000";
  }

}
