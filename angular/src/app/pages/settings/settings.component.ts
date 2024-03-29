import { Component, OnInit } from '@angular/core';

enum SettingsTabs {
  Account,
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

  constructor() {}

  ngOnInit() {
  }

  changeTab(tab: SettingsTabs) {
    this.activeTab = tab;
  }

  isActive(tab: SettingsTabs): boolean {
    return this.activeTab === tab;
  }


}
