import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/data.service';
import * as moment from 'moment';
import { Appointment, Category, NewAppointment, newTodoRequirements } from 'src/app/interfaces';
import { NonNullAssert } from '@angular/compiler';
import { firstValueFrom } from 'rxjs';

interface CalendarEvent {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  // Add more fields as necessary
}

@Component({
  selector: 'app-uploadics',
  templateUrl: './uploadics.component.html',
  styleUrls: ['./uploadics.component.scss']
})
export class UploadicsComponent implements OnInit {
  public newtodo: newTodoRequirements;

  constructor(private _snackBar: MatSnackBar, private _dataService: DataService, private dialogRef: MatDialogRef<UploadicsComponent>) { }

  ngOnInit(): void {
    moment.locale('nl');
  }

  close() {
    this.dialogRef.close();
  }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file.type !== "text/calendar") {
      this._snackBar.open("File must be of type .ics", "Dismiss", { duration: 5000, horizontalPosition: "left", verticalPosition: "bottom" });
      return;
    }
    var categories: Category[] = [];
    await firstValueFrom(this._dataService.getCategories()).then((data) => {
      categories = data;
    });

    this.readFile(file).then((data: any) => {
      data.data = data.data.replace(/data:text\/calendar;base64,/g, "");
      // convert to string
      var icsString = atob(data.data);
      // parse the ics string
      const events = this.parseICS(icsString);

      events.forEach(event => {
        console.log("event", event);

        let category: Category | undefined = categories.find(category => category.term === "ICS Import");
        if (!category) {
          return this._snackBar.open("No category found for ICS Import", "Dismiss", { duration: 5000, horizontalPosition: "left", verticalPosition: "bottom" });
        }

        var appointment: NewAppointment = {
          title: event.title,
          description: event.description,
          date: event.startDate,
          enddate: event.endDate,
          isAllDay: (event.startTime === "00:00" && event.endTime === "23:59" && (event.startDate === event.endDate) ? true : false),
          starttime: event.startTime,
          endtime: event.endTime,
          location: event.location,
          category: { id: category.id, term: category.term }
        }

        this._dataService.createAppointment(appointment).subscribe(() => {
          this._snackBar.open("Event added to your calendar", "Dismiss", { duration: 5000, horizontalPosition: "left", verticalPosition: "bottom" });
        })
        return;
      })
      this.close();
    })
  }

  readFile(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (e: Event) {
        resolve({ name: file.name, data: (<any>e.target).result });
      };
      reader.onerror = function (e) {
        reject(e);
      };
      reader.readAsDataURL(file)
    })
  }

  parseICS(icsContent: string): CalendarEvent[] {
    const events: CalendarEvent[] = [];
    const lines = icsContent.split(/\r\n|\n|\r/);

    let currentEvent: any = {};
    let isEvent = false;
    lines.forEach(line => {
      console.log(line)
      if (line.startsWith('BEGIN:VEVENT')) {
        currentEvent = {};
        isEvent = true;
      } else if (line.startsWith('END:VEVENT')) {
        events.push(currentEvent);
        currentEvent = {};
        isEvent = false;
      } else if (isEvent) {
        var [key, value] = line.split(':');
        if(key.includes('DTSTART') || key.includes('DTEND')) {
          key = line.split(';')[0];
          value = line.split(';')[1];
        }
        switch (key) {
          case 'SUMMARY':
            currentEvent.title = value;
            break;
          case 'DESCRIPTION':
            currentEvent.description = value;
            break;
          case 'DTSTART':
            currentEvent.startDate = moment(value.split(":")[1], "YYYYMMDDTHHmmss").format("YYYY-MM-DD");
            currentEvent.startTime = moment(value.split(":")[1], "YYYYMMDDTHHmmss").format("HH:mm");
            break;
          case 'DTEND':
            currentEvent.endDate = moment(value.split(":")[1], "YYYYMMDDTHHmmss").format("YYYY-MM-DD");
            currentEvent.endTime = moment(value.split(":")[1], "YYYYMMDDTHHmmss").format("HH:mm");
            break;
          case 'LOCATION':
            currentEvent.location = value;
            break;
          // Add more cases as needed for additional fields
        }
      }
    });

    return events.map(event => ({
      ...event
    }));
  }
}
