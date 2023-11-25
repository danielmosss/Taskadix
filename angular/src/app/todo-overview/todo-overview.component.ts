import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { DataService } from 'src/data.service';

interface TodoDay {
  day: string,
  tasks: Array<{
    id: number,
    title: string,
    description: string,
    date: string
  }>
}


@Component({
  selector: 'app-todo-overview',
  templateUrl: './todo-overview.component.html',
  styleUrls: ['./todo-overview.component.scss']
})
export class TodoOverviewComponent implements OnInit {
  public connectedLists: any[] = [];
  public Todolist: TodoDay[] = [];

  constructor(private _dateService: DataService) { }

  ngOnInit(): void {

    this._dateService.getTodo().subscribe(data => {
      console.log(data);
      this.Todolist = data;
      this.connectedLists = this.Todolist.map(d => `${d.day}List`);
    })
  }

  getDayName(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      // Same list - reorder
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Different list - transfer item
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
}
