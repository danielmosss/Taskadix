import { Component, Inject, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Appointment } from 'src/app/interfaces';
import { DataService } from 'src/data.service';
import { GlobalfunctionsService, updateType } from 'src/globalfunctions.service';
import { CreateAppointmentComponent } from '../create-appointment/create-appointment.component';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent {
  formatTime = this.globalfunctions.getFormattedTime;
  getDateName = this.globalfunctions.getDateName;
  updatetype = updateType;

  constructor(
    private dialogRef: MatDialogRef<AppointmentComponent>,
    @Inject(MAT_DIALOG_DATA) public appointment: Appointment,
    private globalfunctions: GlobalfunctionsService,
    private _router: Router,
    private _dataservice: DataService,
    private _dialog: MatDialog
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
    let dialog = this._dialog.open(CreateAppointmentComponent, { data: appointment })
    dialog.afterClosed().subscribe((appointmentid) => {
      if (appointmentid) this.closedialog(updateType.UPDATE, appointmentid);
    })
  }

  deleteAppointment(appointment: Appointment) {
    this._dataservice.deleteAppointment(appointment).subscribe(data => {
      if (data.status == "success") this.closedialog(updateType.DELETE, appointment.id);
    })
  }

  closedialog(updatetype: updateType, appointmentid: number) {
    this.dialogRef.close({ updateType: updatetype, appointmentid: appointmentid });
  }
}
