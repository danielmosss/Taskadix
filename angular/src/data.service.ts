import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DayTodo, Todo, Weather, newTodoRequirements } from './app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _hostname = "http://137.117.175.76:8000";
  private _hostnameSecureApi = "http://137.117.175.76/api";

  constructor(private http: HttpClient) { }

  public getWeather() {
    return this.http.get<Weather>(this._hostnameSecureApi + "/GetWeather", { headers: this.getCustomHeaders() });
  }

  public getTodo() {
    return this.http.get<Array<DayTodo>>(this._hostnameSecureApi + "/GetTodoTasks", { headers: this.getCustomHeaders() });
  }

  public getTodoByDateRange(dateRange: { start: string, end: string }) {
    return this.http.get<Array<DayTodo>>(this._hostnameSecureApi + `/GetTodoTasksByDateRange?start=${dateRange.start}&end=${dateRange.end}`, { headers: this.getCustomHeaders() });
  }

  public putTodoList(todo: Todo[]) {
    return this.http.put<Array<DayTodo>>(this._hostnameSecureApi + "/PutTodoTasks", todo, { headers: this.getCustomHeaders() });
  }

  public putTodoInfo(todoCard: Todo){
    return this.http.put<Todo>(this._hostnameSecureApi + "/PutTodoTaskInfo", todoCard, { headers: this.getCustomHeaders() });
  }

  public deleteTodoTask(todoCard: Todo){
    return this.http.delete<Todo>(this._hostnameSecureApi + "/DeleteTodoTask", {body: todoCard, headers: this.getCustomHeaders()});
  }

  public postTodoInfo(todoCard: newTodoRequirements){
    return this.http.post<Todo>(this._hostnameSecureApi + "/PostTodoTask", todoCard, { headers: this.getCustomHeaders() });
  }

  public markAsIrrelevant(todoCard: Todo){
    return this.http.post<{status: string}>(this._hostnameSecureApi + "/PostMarkAsIrrelevant", todoCard, { headers: this.getCustomHeaders() });
  }

  public getUserData(){
    return this.http.get<{username: string}>(this._hostname + "/GetUserData", { headers: this.getCustomHeaders() });
  }

  public register(username: string, password: string, email: string) {
    this.http.post<{ jsonwebtoken: string }>(this._hostname + "/register", { username, password, email }).pipe().subscribe(
      (res) => {
        this._jsonwebtoken = res.jsonwebtoken;
      }
    );
  }

  public login(username: string, password: string) {
    this.http.post<{ jsonwebtoken: string }>(this._hostname + "/login", { username, password }).pipe().subscribe(
      (res) => {
        this._jsonwebtoken = res.jsonwebtoken;
      }
    );
  }

  public logout() {
    localStorage.removeItem('jsonwebtoken');
  }

  public isLoggedIn(): boolean {
    return !!this._jsonwebtoken;
  }

  private get _jsonwebtoken(): string {
    return localStorage.getItem('jsonwebtoken') || '';
  }

  private set _jsonwebtoken(jsonwebtoken) {
    localStorage.setItem('jsonwebtoken', jsonwebtoken);
  }

  public getCustomHeaders(): HttpHeaders {
    var headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('ngrok-skip-browser-warning', '69420');
    if (this._jsonwebtoken) {
      headers = headers.set('Authorization', "Bearer " + this._jsonwebtoken);
    }
    return headers;
  }
}
