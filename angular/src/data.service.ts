import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DayTodo, Todo, Weather, newTodoRequirements } from './app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _hostname = "http://localhost:8000";

  constructor(private http: HttpClient) { }

  public getWeather() {
    return this.http.get<Weather>(this._hostname + "/GetWeather");
  }

  public getTodo() {
    return this.http.get<Array<DayTodo>>(this._hostname + "/GetTodoTasks");
  }

  public getTodoByDateRange(dateRange: { start: string, end: string }) {
    return this.http.get<Array<DayTodo>>(this._hostname + `/GetTodoTasksByDateRange?start=${dateRange.start}&end=${dateRange.end}`);
  }

  public putTodoList(todo: Todo[]) {
    return this.http.put<Array<DayTodo>>(this._hostname + "/PutTodoTasks", todo);
  }

  public putTodoInfo(todoCard: Todo){
    return this.http.put<Todo>(this._hostname + "/PutTodoTaskInfo", todoCard);
  }

  public deleteTodoTask(todoCard: Todo){
    return this.http.delete<Todo>(this._hostname + "/DeleteTodoTask", {body: todoCard});
  }

  public postTodoInfo(todoCard: newTodoRequirements){
    return this.http.post<Todo>(this._hostname + "/PostTodoTask", todoCard);
  }

  public markAsIrrelevant(todoCard: Todo){
    return this.http.post<{status: string}>(this._hostname + "/PostMarkAsIrrelevant", todoCard);
  }
}
