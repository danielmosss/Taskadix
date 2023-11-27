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
    date: string,
    todoOrder: number
  }>
}

interface todo{
  id: number,
  title: string,
  description: string,
  date: string
  todoOrder: number
}

@Component({
  selector: 'app-todo-overview',
  templateUrl: './todo-overview.component.html',
  styleUrls: ['./todo-overview.component.scss']
})
export class TodoOverviewComponent implements OnInit {
  public connectedLists: any[] = [];
  public Todolist: TodoDay[] = [];
  public updatedList: todo[] = [];
  public deletedList: todo[] = [];

  constructor(private _dateService: DataService) { }

  ngOnInit(): void {
    this._dateService.getTodo().subscribe(data => {
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
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      const list = event.container.data;
      list.forEach((item, index) => {
        item.todoOrder = index + 1;
        this.updateTodoList(item);
      })
    } else {
      let containerDate = event.container.data[0].date;
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);

      const list = event.container.data;
      list.forEach((item, index) => {
        item.todoOrder = index + 1;
        item.date = containerDate;
        this.updateTodoList(item);
      })

      const previousList = event.previousContainer.data;
      previousList.forEach((item, index) => {
        item.todoOrder = index + 1;
        this.updateTodoList(item);
      })
    }
  }


  updateTodoList(itemToUpdate: todo){
    // check if item is already in updatedList
    const index = this.updatedList.findIndex(item => item.id === itemToUpdate.id);
    if (index !== -1) this.updatedList[index] = itemToUpdate;
    else this.updatedList.push(itemToUpdate);
    console.log(this.updatedList);
  }
}
