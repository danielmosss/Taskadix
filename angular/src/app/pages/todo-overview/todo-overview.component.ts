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
import { CardpopupComponent } from '../../popups/cardpopup/cardpopup.component';
import { CreateTodoComponent } from '../../popups/create-todo/create-todo.component';
import { DayTodo, Todo } from '../../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploadjsonComponent } from '../../popups/uploadjson/uploadjson.component';
const timer = (ms: any) => new Promise(res => setTimeout(res, ms))


@Component({
  selector: 'app-todo-overview',
  templateUrl: './todo-overview.component.html',
  styleUrls: ['./todo-overview.component.scss']
})
export class TodoOverviewComponent implements OnInit {
  public connectedLists: any[] = [];
  public Todolist: DayTodo[] = [];
  public updatedList: Todo[] = [];
  public deletedList: Todo[] = [];
  public dateRange: { start: string, end: string };

  public loading: boolean = false;
  public username: string

  constructor(private _dateService: DataService, private _dialog: MatDialog, private _snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.getTodoTasks();
    setTimeout(async () => {
      while (!this.username) {
        this.username = this._dateService.getUsername();
        await timer(100);
      }
    })
  }

  openJsonuploader(){
    var dialog = this._dialog.open(UploadjsonComponent)
    dialog.afterClosed().subscribe((data?: Todo[]) => {
      if (!data) return;
      this.getTodoTasks();
    })
  }

  logout() {
    this._dateService.logout();
    this._snackbar.open("Logged out", '', { duration: 3000, horizontalPosition: 'left', panelClass: 'success' });
  }

  isMobile(){
    return this._dateService.isMobile();
  }

  getTodoTasks() {
    if (this.dateRange) this._dateService.getTodoByDateRange(this.dateRange).subscribe(data => { this.handleGetTodos(data); })
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
      this.getTodoTasks();
      this.updatedList = [];
    })
  }


  async updateTodoList(itemToUpdate: Todo) {
    const index = this.updatedList.findIndex(item => item.id === itemToUpdate.id);
    if (index !== -1) this.updatedList[index] = itemToUpdate;
    else this.updatedList.push(itemToUpdate);
  }

  openCardInfo(todo: Todo) {
    var dialog = this._dialog.open(CardpopupComponent, {
      data: todo
    })
    dialog.afterClosed().subscribe((data?: Todo) => {
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
    dialog.afterClosed().subscribe((data?: Todo) => {
      if (!data) return;
      var index = this.Todolist.findIndex(d => d.date === data.date);
      this.Todolist[index].tasks.push(data);
    })
  }

  handleDateSelection(dateRange: { start: string, end: string }) {
    this.loading = true;
    this.dateRange = dateRange;
    this.getTodoTasks();
  }
}
