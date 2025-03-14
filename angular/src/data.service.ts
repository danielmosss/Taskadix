import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Appointment, DayTodo, NewAppointment, Todo, UserData,appointmentCategory, backup, newTodoRequirements } from './app/interfaces';
import { environment } from './environments/environment.local';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _hostname = environment.apiUrl;
  private _SecureApi = this._hostname + "/api";

  public validJwtToken: boolean = false;
  public userLoggedIn: boolean = false;

  public userdata: UserData | null;

  public isMobile(): boolean {
    return window.innerWidth <= 1000;
  }

  constructor(private http: HttpClient, private _snackbar: MatSnackBar, private _router: Router) { }

  public getTodoTasks() {
    return this.http.get<Array<DayTodo>>(this._SecureApi + `/GetTodoTasks`, { headers: this.getCustomHeaders() });
  }

  public getUpcommingTodos(days: number = 7) {
    return this.http.get<Array<DayTodo>>(this._SecureApi + `/v3/GetTodosForNextXDays?days=${days}`, { headers: this.getCustomHeaders() });
  }

  public getTodoByDateRange(dateRange: { start: string, end: string }) {
    return this.http.get<Array<DayTodo>>(this._SecureApi + `/GetTodoTasksByDateRange?start=${dateRange.start}&end=${dateRange.end}`, { headers: this.getCustomHeaders() });
  }

  public putTodoList(todo: Todo[]) {
    return this.http.put<Array<DayTodo>>(this._SecureApi + "/PutTodoTasks", todo, { headers: this.getCustomHeaders() });
  }

  public putTodoInfo(todoCard: Todo) {
    return this.http.put<Todo>(this._SecureApi + "/PutTodoTaskInfo", todoCard, { headers: this.getCustomHeaders() });
  }

  public deleteTodoTask(todoCard: Todo) {
    return this.http.delete<{ message: string }>(this._SecureApi + "/DeleteTodoTask", { body: todoCard, headers: this.getCustomHeaders() });
  }

  public postTodoInfo(todoCard: newTodoRequirements) {
    return this.http.post<Todo>(this._SecureApi + "/PostTodoTask", todoCard, { headers: this.getCustomHeaders() });
  }

  public checkTodoTask(todoCard: Todo) {
    return this.http.post<{ status: string }>(this._SecureApi + "/PostCheckTodoTask", todoCard, { headers: this.getCustomHeaders() });
  }

  public saveWebcallUrl(url: string, id: number = 0, categoryId: number = 0) {
    return this.http.post<{ status: string }>(this._SecureApi + "/PostWebcallUrl", { url, id, categoryId }, { headers: this.getCustomHeaders() });
  }

  public syncWebcall(id: number) {
    return this.http.post<{ status: string }>(this._SecureApi + "/GetWebcallSync", id, { headers: this.getCustomHeaders() });
  }

  public putBackgroundcolor(color: string) {
    return this.http.put<{ status: string }>(this._SecureApi + "/PutBGcolor", { backgroundColor: color }, { headers: this.getCustomHeaders() });
  }

  public getUserDataOnLoad() {
    this.http.get<UserData>(this._SecureApi + "/GetUserData", { headers: this.getCustomHeaders() }).subscribe((data: UserData) => {
      this.validJwtToken = true;
      this.userdata = data;
    })
  }

  public getUserDataReturn() {
    return this.http.get<UserData>(this._SecureApi + "/GetUserData", { headers: this.getCustomHeaders() })
  }

  public uploadBulkTodos(todoCards: newTodoRequirements[]) {
    return this.http.post<Todo[]>(this._SecureApi + "/UploadBulkTodo", todoCards, { headers: this.getCustomHeaders() });
  }

  public register(username: string, password: string, email: string) {
    this.http.post<{ jsonwebtoken: string }>(this._hostname + "/register", { username, password, email }).pipe().subscribe(
      (res: { jsonwebtoken: string }) => {
        this._jsonwebtoken = res.jsonwebtoken;
      }
    );
  }

  public login(username: string, password: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post<{ jsonwebtoken: string }>(this._hostname + "/login", { username, password }).subscribe(
        (res: { jsonwebtoken: string }) => {
          this._jsonwebtoken = res.jsonwebtoken;
          this.validJwtToken = true;
          this.userLoggedIn = true;
          this.getUserDataOnLoad();
          resolve(true);
        },
        (error: Error) => {
          console.error('Login error', error);
          resolve(false);
        }
      );
    });
  }

  public logout() {
    this.userdata = null;
    localStorage.removeItem('jsonwebtoken');
    this._router.navigate(['/login']);
  }

  public isLoggedIn(): boolean {
    return !!this._jsonwebtoken;
  }

  public UserData() {
    return this.userdata;
  }

  private get _jsonwebtoken(): string {
    return localStorage.getItem('jsonwebtoken') || '';
  }

  private set _jsonwebtoken(jsonwebtoken) {
    localStorage.setItem('jsonwebtoken', jsonwebtoken);
  }

  // updateBackgroundcolor(backgroundcolor: string) {
  //   document.documentElement.style.setProperty('--background-color', backgroundcolor);
  // }

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

  public getCategories() {
    return this.http.get<appointmentCategory[]>(this._SecureApi + "/v2/GetCategories", { headers: this.getCustomHeaders() });
  }

  public createCategory(categoryName: string, categoryColor: string) {
    return this.http.post<appointmentCategory>(this._SecureApi + "/v2/CreateCategory", { term: categoryName, color: categoryColor }, { headers: this.getCustomHeaders() });
  }

  public updateCategory(category: appointmentCategory) {
    return this.http.put<appointmentCategory>(this._SecureApi + "/v2/PutCategory", category, { headers: this.getCustomHeaders() });
  }

  public deleteCategory(category: appointmentCategory) {
    return this.http.delete<{ message: string }>(this._SecureApi + `/v2/DeleteCategory?id=${category.id}`, { headers: this.getCustomHeaders() });
  }

  public createAppointment(appointment: NewAppointment) {
    return this.http.post<{ id: string }>(this._SecureApi + "/v2/CreateAppointment", appointment, { headers: this.getCustomHeaders() });
  }

  public updateAppointment(appointment: Appointment) {
    return this.http.put<{ id: string }>(this._SecureApi + "/v2/PutAppointment", appointment, { headers: this.getCustomHeaders() });
  }

  public getAppointment(appointmentId: number) {
    return this.http.get<Appointment>(this._SecureApi + `/v2/GetAppointment?id=${appointmentId}`, { headers: this.getCustomHeaders() });
  }

  public getAppointments(beginDate: string, endDate: string) {
    return this.http.get<{ date: string, appointments: Appointment[] }[]>(this._SecureApi + `/v2/GetAppointments?start=${beginDate}&end=${endDate}`, { headers: this.getCustomHeaders() });
  }

  public deleteAppointment(appointment: Appointment) {
    return this.http.delete<{ status: string }>(this._SecureApi + `/v2/DeleteAppointment?id=${appointment.id}`, { headers: this.getCustomHeaders() });
  }

  public getBackup() {
    return this.http.get<backup>(this._SecureApi + "/v2/GetBackup", { headers: this.getCustomHeaders() });
  }

  public restorebackup(backup: backup) {
    return this.http.post<{ status: string }>(this._SecureApi + "/v2/RestoreBackup", backup, { headers: this.getCustomHeaders() });
  }
  public GetTenLastLocationsUser() {
    return this.http.get<string[]>(this._SecureApi + "/v2/GetTenLastLocationsUser", { headers: this.getCustomHeaders() });
  }

  //V3 API Endpoints

  public GetAppointmentsV3(beginDate: string, endDate: string, categoryIds: number[] = []) {
    let params = new HttpParams()
      .set('start', beginDate)
      .set('end', endDate);

    categoryIds.forEach(id => {
      params = params.append('categoryIds', id.toString());
    });

    return this.http.get<Appointment[]>(this._SecureApi + `/v3/GetAppointments`, { headers: this.getCustomHeaders(), params });
  }
}
