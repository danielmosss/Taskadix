import { Component, Inject, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Appointment } from 'src/app/interfaces';
import { DataService } from 'src/data.service';
import { GlobalfunctionsService } from 'src/globalfunctions.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent {
  formatTime = this.globalfunctions.getFormattedTime;
  getDateName = this.globalfunctions.getDateName;

  constructor(
    private dialogRef: MatDialogRef<AppointmentComponent>,
    @Inject(MAT_DIALOG_DATA) public appointment: Appointment,
    private globalfunctions: GlobalfunctionsService,
    private _router: Router,
    private _dataservice: DataService
  ) { }

  navigate(url: string, blank: boolean = false) {
    if (blank) {
      window.open(url, '_blank');
    }
    else {
      this._router.navigate([url]);
    }
  }

  editAppointment(appointment: Appointment) {
    // close this one and open a new one to edit this.
  }

  deleteAppointment(appointment: Appointment) {
    this._dataservice.deleteAppointment(appointment).subscribe(data => {
      console.log(data);
      if (data.status == "success") {
        this.dialogRef.close(appointment.id);
      }
    })
  }
}
