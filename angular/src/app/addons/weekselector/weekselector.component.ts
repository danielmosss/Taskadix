import { Component, Injectable, EventEmitter, Output } from '@angular/core';
import {DateAdapter, MatNativeDateModule} from '@angular/material/core';
import {
  MatDateRangeSelectionStrategy,
  DateRange,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import * as moment from 'moment';


@Injectable()
export class FiveDayRangeSelectionStrategy<D> implements MatDateRangeSelectionStrategy<D> {
  constructor(private _dateAdapter: DateAdapter<D>, private component: WeekselectorComponent) {}

  selectionFinished(date: D | null): DateRange<D> {
    this.component.dateChanged(this._createFiveDayRange(date));
    return this._createFiveDayRange(date);
  }

  createPreview(activeDate: D | null): DateRange<D> {
    return this._createFiveDayRange(activeDate);
  }

  private _createFiveDayRange(date: D | null): DateRange<D> {
    if (date) {
      const start = date
      const end = this._dateAdapter.addCalendarDays(date, 6);
      return new DateRange<D>(start, end);
    }

    return new DateRange<D>(null, null);
  }
}

@Component({
  selector: 'app-weekselector',
  templateUrl: './weekselector.component.html',
  styleUrls: ['./weekselector.component.scss'],
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: FiveDayRangeSelectionStrategy,
    },
  ],
})
export class WeekselectorComponent {
  @Output() onDateSelected = new EventEmitter<{ start: string, end: string }>();

  constructer() {}

  dateChanged(dateRange: {start: any, end: any}) {
    moment.locale('en');
    dateRange.start = moment(dateRange.start, "DD-MM-YYYY").format("YYYY-MM-DD");
    dateRange.end = moment(dateRange.end, "DD-MM-YYYY").format("YYYY-MM-DD");

    this.onDateSelected.emit(dateRange);
  }
}

