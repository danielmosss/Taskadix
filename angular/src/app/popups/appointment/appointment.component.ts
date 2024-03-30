import { Component, Inject, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Appointment } from 'src/app/interfaces';
import { GlobalfunctionsService } from 'src/globalfunctions.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent{
  formatTime = this.globalfunctions.getFormattedTime;
  getDateName = this.globalfunctions.getDateName;

  constructor(private dialogRef: MatDialogRef<AppointmentComponent>, @Inject(MAT_DIALOG_DATA) public appointment: Appointment, private globalfunctions: GlobalfunctionsService) { }
}
