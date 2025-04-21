import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { Category } from 'src/app/interfaces';
import { CreateAppointmentComponent } from 'src/app/popups/create-appointment/create-appointment.component';
import { UploadicsComponent } from 'src/app/popups/uploadics/uploadics.component';
import { DataService } from 'src/data.service';

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
  @Output() weekSelected: EventEmitter<{ start: string, end: string }> = new EventEmitter<{ start: string, end: string }>();
  @Output() dayDateSelected: EventEmitter<string> = new EventEmitter<string>();
  @Output() monthSelected: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectedCategories: EventEmitter<Category[]> = new EventEmitter<Category[]>();

  public categories: Category[] = [];
  public selcCategories: Category[] | null = null;

  constructor(
    private _dialog: MatDialog,
    private _router: Router,
    private _dataservice: DataService
  ) { }

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(){
    this._dataservice.getCategories().subscribe((categories: Category[]) => {
      this.categories = categories;
    });
  }

  toggleCategory($event: MatSelectChange){
    this.selcCategories = $event.value;
    this.selectedCategories.emit($event.value);
  }

  openCreateAppointment() {
    let dialog = this._dialog.open(CreateAppointmentComponent)
    dialog.afterClosed().subscribe((result: number) => {
      this.newAppointmentId.emit(result)
    })
  }

  openICSupload() {
    let dialog = this._dialog.open(UploadicsComponent)
    dialog.afterClosed().subscribe((result: number) => {
      this.newAppointmentId.emit(result)
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

  handleDateRangeSelection(dateRange: { start: string, end: string }) {
    this.weekSelected.emit(dateRange)
  }

  handleMonthSelection(month: string) {
    this.monthSelected.emit(month)
  }

  handleDateSelection(date: string) {
    this.dayDateSelected.emit(date)
  }
}
