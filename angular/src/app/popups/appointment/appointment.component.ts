import { Component, Inject, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Appointment } from 'src/app/interfaces';
import { DataService } from 'src/data.service';
import { GlobalfunctionsService, updateType } from 'src/globalfunctions.service';
import { CreateAppointmentComponent } from '../create-appointment/create-appointment.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
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

  GoogleCalanderLink(appointment: Appointment){
    let url = `https://calndr.link/d/event/?service=google&start=${appointment.date}T${appointment.starttime}&end=${appointment.enddate}T${appointment.endtime}&title=${appointment.title}&timezone=Europe/Amsterdam`
    navigator.clipboard.writeText(url).then(() => {
      this._snackBar.open("Google Calendar link copied to clipboard", '', { duration: 3000, horizontalPosition: 'left', panelClass: 'alert' });
    }).catch(() => {
      this._snackBar.open("Oops! An error occurred while trying to copy the invitation link.", '', { duration: 3000, horizontalPosition: 'left', panelClass: 'alert' });
    });
  }

  closedialog(updatetype: updateType, appointmentid: number) {
    this.dialogRef.close({ updateType: updatetype, appointmentid: appointmentid });
  }
}
