import { Component, EventEmitter, Output } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-dayselector',
  templateUrl: './dayselector.component.html',
  styleUrls: ['./dayselector.component.scss']
})
export class DayselectorComponent {
  @Output() onDateSelected = new EventEmitter<string>();

  onDateChange(event: any) {
    this.onDateSelected.emit(moment(event.value).format('YYYY-MM-DD'));
  }
}
