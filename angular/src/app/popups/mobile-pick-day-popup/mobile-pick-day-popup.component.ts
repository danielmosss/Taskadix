import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-mobile-pick-day-popup',
  templateUrl: './mobile-pick-day-popup.component.html',
  styleUrls: ['./mobile-pick-day-popup.component.scss']
})
export class MobilePickDayPopupComponent {

  constructor(private matdialogref: MatDialogRef<MobilePickDayPopupComponent>) { }
  onDateSelectedPopup(event: string) {
    this.matdialogref.close(event);
  }
}
