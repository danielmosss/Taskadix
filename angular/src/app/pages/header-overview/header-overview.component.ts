import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
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

  constructor(private _dialog: MatDialog, private _router: Router) { }

  ngOnInit(): void {

  }

  openCreateAppointment() {
    let dialog = this._dialog.open(CreateAppointmentComponent)
    dialog.afterClosed().subscribe((result: {id: number}) => {
      console.log(result)
      this.newAppointmentId.emit(result.id)
    })
  }

  isActiveView(route: string, exactMatch: boolean = false): boolean {
    if (this._router.url.includes(route) && !exactMatch) {
      return true;
    }
    else if (this._router.url === route && exactMatch) {
      return true
    }

    return false;
  }

  navigateTo(route: string) {
    this._router.navigate([route])
  }
}
