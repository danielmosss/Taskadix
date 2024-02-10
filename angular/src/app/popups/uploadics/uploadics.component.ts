import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/data.service';
import * as moment from 'moment';
import { newTodoRequirements } from 'src/app/interfaces';

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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file.type !== "text/calendar") {
      this._snackBar.open("File must be of type .ics", "Dismiss", { duration: 5000, horizontalPosition: "left", verticalPosition: "bottom" });
      return;
    }

    this.readFile(file).then((data: any) => {
      data.data = data.data.replace(/data:text\/calendar;base64,/g, "");
      // convert to string
      var icsString = atob(data.data);
      // parse the ics string
      const events = this.parseICS(icsString);
      events.forEach(event => {
        console.log("event", event);

        // TODO: send start and end time to backend when time is implemented, same for location.
        this.newtodo = {
          title: event.title,
          description: `${event.startTime} - ${event.endTime} ${event.location ? `@ ${event.location}` : ""}\n${event.description}`,
          date: event.startDate
        }
        this._dataService.postTodoInfo(this.newtodo).subscribe(data => {
          this._snackBar.open("Event added to your calendar", "Dismiss", { duration: 5000, horizontalPosition: "left", verticalPosition: "bottom" });
        })
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
