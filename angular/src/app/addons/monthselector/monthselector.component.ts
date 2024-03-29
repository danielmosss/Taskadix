import { Component, EventEmitter, Output } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { Moment } from 'moment';

@Component({
  selector: 'app-monthselector',
  templateUrl: './monthselector.component.html',
  styleUrls: ['./monthselector.component.scss']
})
export class MonthselectorComponent {
  @Output() onDateSelected = new EventEmitter<string>();
  chosenMonthHandler(event: Moment, datepicker: MatDatepicker<Moment>) {
    datepicker.select(event);
    datepicker.close();
    this.onDateSelected.emit(event.format('YYYY-MM-DD'));
  }
}
