import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { DataService } from 'src/data.service';
import { MatDialog } from '@angular/material/dialog';
import { CardpopupComponent } from '../popups/cardpopup/cardpopup.component';
import { CreateTodoComponent } from '../popups/create-todo/create-todo.component';
import { DayTodo } from '../interfaces';
const timer = (ms: any) => new Promise(res => setTimeout(res, ms))

interface TodoDay {
  day: string,
  date: string,
  tasks: Array<{
    id: number,
    title: string,
    description: string,
    date: string,
    todoOrder: number,
    IsCHE: boolean,
  }>
}

interface todo {
  id: number,
  title: string,
  description: string,
  date: string
  todoOrder: number
  deleted?: boolean,
  IsCHE: boolean
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

  public loading: boolean = false;

  constructor(private _dateService: DataService, private _dialog: MatDialog) { }

  ngOnInit(): void {
    this.getTodoTasks();
  }

  getTodoTasks(dateRange?: { start: string, end: string }) {
    if (dateRange) this._dateService.getTodoByDateRange(dateRange).subscribe(data => { this.handleGetTodos(data); })
    else this._dateService.getTodo().subscribe(data => { this.handleGetTodos(data); })
  }

 async handleGetTodos(data: DayTodo[]) {
    if (this.Todolist.length > 0) {
      data.forEach(async (item, index) => {
        this.Todolist[index] = item;
        this.connectedLists[index] = `${item.day}List`;
      })
    } else {
      this.Todolist = data;
      this.connectedLists = this.Todolist.map(d => `${d.day}List`);
    }

    await timer(1000);
    this.loading = false;
  }

  getDayName(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      const list = event.container.data;
      list.forEach(async (item, index) => {
        item.todoOrder = index + 1;
        await this.updateTodoList(item);
      })
    } else {
      let containerID = event.container.id;
      let containerDay = containerID.split("List")[0];
      let containerDate = this.Todolist.find(d => d.day === containerDay)?.date;
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);

      const list = event.container.data;
      list.forEach(async (item, index) => {
        item.todoOrder = index + 1;
        item.date = containerDate;
        await this.updateTodoList(item);
      })

      const previousList = event.previousContainer.data;
      previousList.forEach(async (item, index) => {
        item.todoOrder = index + 1;
        await this.updateTodoList(item);
      })
    }

    this._dateService.putTodoList(this.updatedList).subscribe(data => {
      this.updatedList = [];
      this.Todolist = data;
      this.connectedLists = this.Todolist.map(d => `${d.day}List`);
    })
  }


  async updateTodoList(itemToUpdate: todo) {
    const index = this.updatedList.findIndex(item => item.id === itemToUpdate.id);
    if (index !== -1) this.updatedList[index] = itemToUpdate;
    else this.updatedList.push(itemToUpdate);
  }

  openCardInfo(todo: todo) {
    var dialog = this._dialog.open(CardpopupComponent, {
      data: todo
    })
    dialog.afterClosed().subscribe((data?: todo) => {
      if (!data) return;
      if (data.deleted) {
        var index = this.Todolist.findIndex(d => d.date === data.date);
        var todoIndex = this.Todolist[index].tasks.findIndex(t => t.id === data.id);
        this.Todolist[index].tasks.splice(todoIndex, 1);
      }
      else if (!data.deleted) {
        var index = this.Todolist.findIndex(d => d.date === data.date);
        var todoIndex = this.Todolist[index].tasks.findIndex(t => t.id === data.id);
        this.Todolist[index].tasks[todoIndex] = data;
      }
    })
  }

  openCardCreate() {
    var dialog = this._dialog.open(CreateTodoComponent)
    dialog.afterClosed().subscribe((data?: todo) => {
      if (!data) return;
      var index = this.Todolist.findIndex(d => d.date === data.date);
      this.Todolist[index].tasks.push(data);
    })
  }

  handleDateSelection(dateRange: { start: string, end: string }) {
    this.loading = true;
    this.getTodoTasks(dateRange);
  }
}
