import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateAppointmentComponent } from 'src/app/popups/create-appointment/create-appointment.component';

enum Type {
  month = 'month',
  week = 'week',
  day = 'day'
}

@Component({
  selector: 'app-header-overview',
  templateUrl: './header-overview.component.html',
  styleUrls: ['./header-overview.component.scss']
})
export class HeaderOverviewComponent implements OnInit {
  @Input() type: Type = Type.month;
  // emit a new appointmentid to the parent component
  @Output() newAppointmentId: EventEmitter<number> = new EventEmitter<number>();

  constructor(private _dialog: MatDialog) { }

  ngOnInit(): void {

  }

  openCreateAppointment() {
    let dialog = this._dialog.open(CreateAppointmentComponent)
    dialog.afterClosed().subscribe((result: {id: number}) => {
      console.log(result)
      this.newAppointmentId.emit(result.id)
    })
  }
}
