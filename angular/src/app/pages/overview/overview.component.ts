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
import { DayTodo, Todo, userdata } from '../../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploadjsonComponent } from '../../popups/uploadjson/uploadjson.component';
const timer = (ms: any) => new Promise(res => setTimeout(res, ms))
import * as moment from 'moment';
import { UploadicsComponent } from 'src/app/popups/uploadics/uploadics.component';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  public connectedLists: any[] = [];
  public Todolist: DayTodo[] = [];
  public updatedList: Todo[] = [];
  public deletedList: Todo[] = [];
  public dateRange: { start: string, end: string };

  public loading: boolean = false;
  public userdata: userdata | null;

  public showCheckedItems: boolean = false;

  public viewAccountSettings: boolean = false;

  constructor(private _dataservice: DataService, private _dialog: MatDialog, private _snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.getUserData();
    this.getTodoTasks();
  }

  getUserData() {
    this._dataservice.getUserDataReturn().subscribe(data => {
      this.userdata = data;
    })
  }

  logout() {
    this._dataservice.logout();
  }

  openJsonuploader(){
    var dialog = this._dialog.open(UploadjsonComponent)
    dialog.afterClosed().subscribe((data?: Todo[]) => {
      if (!data) return;
      this.getTodoTasks();
    })
  }

  openICSuploader(){
    var dialog = this._dialog.open(UploadicsComponent)
    dialog.afterClosed().subscribe((data?: Todo[]) => {
      this.getTodoTasks();
    })
  }

  isMobile(){
    return this._dataservice.isMobile();
  }

  getTodoTasks() {
    if (this.dateRange) this._dataservice.getTodoByDateRange(this.dateRange).subscribe(data => { this.handleGetTodos(data); })
    else this._dataservice.getTodo().subscribe(data => { this.handleGetTodos(data); })
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

  // Event fired when item is dropped in a list
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

    this._dataservice.putTodoList(this.updatedList).subscribe(data => {
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

  // open dialog with component CreateTodoComponent to create a new todo
  openCreateTodo() {
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

  getCheckItemsForDay(day: DayTodo) {
    return day.tasks.filter(t => t.checked).length
  }

  getDate(day: DayTodo) {
    return moment(day.date).format("- DD MMM");
  }
}
