import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-todo-overview',
  templateUrl: './todo-overview.component.html',
  styleUrls: ['./todo-overview.component.scss']
})
export class TodoOverviewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }

  testDataArray = [
    {
      "day": "Zaterdag",
      tasks: [
        {
          "title": "Task 1",
          "description": "Description 1"
        },
        {
          "title": "Task 2",
          "description": "Description 2"
        }
      ]
    },
    {
      "day": "Zondag",
      tasks: [
        {
          "title": "Task 3",
          "description": "Description 3"
        },
        {
          "title": "Task 4",
          "description": "Description 4"
        }
      ]
    },
    {
      "day": "Maandag",
      tasks: [
        {
          "title": "Task 5",
          "description": "Description 5"
        },
        {
          "title": "Task 6",
          "description": "Description 6"
        }
      ]
    },
    {
      "day": "Dinsdag",
      tasks: [
        {
          "title": "Task 7",
          "description": "Description 7"
        },
        {
          "title": "Task 8",
          "description": "Description 8"
        }
      ]
    },
    {
      "day": "Woensdag",
      tasks: [
        {
          "title": "Task 9",
          "description": "Description 9"
        },
        {
          "title": "Task 10",
          "description": "Description 10"
        }
      ]
    },
    {
      "day": "Donderdag",
      tasks: [
        {
          "title": "Task 11",
          "description": "Description 11"
        },
        {
          "title": "Task 12",
          "description": "Description 12"
        }
      ]
    },
    {
      "day": "Vrijdag",
      tasks: [
        {
          "title": "Task 13",
          "description": "Description 13"
        },
        {
          "title": "Task 14",
          "description": "Description 14"
        }
      ]
    }
  ]

  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  drop(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
