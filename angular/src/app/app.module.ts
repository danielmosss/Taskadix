import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { WeatherComponent } from './weather/weather.component';
import { TodoOverviewComponent } from './todo-overview/todo-overview.component';
import { AgendaComponent } from './agenda/agenda.component';
import { ForcastBuienradarRegen3hComponent } from './forcast-buienradar-regen3h/forcast-buienradar-regen3h.component';
import { CardpopupComponent } from './popups/cardpopup/cardpopup.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { CreateTodoComponent } from './popups/create-todo/create-todo.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { WeekselectorComponent } from './addons/weekselector/weekselector.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { LoaderComponent } from './addons/loader/loader.component';
import { LoginComponent } from './login/login.component';
import { HttpInterceptorService } from 'src/http-interceptor.service';




@NgModule({
  declarations: [
    AppComponent,
    WeatherComponent,
    TodoOverviewComponent,
    AgendaComponent,
    ForcastBuienradarRegen3hComponent,
    CardpopupComponent,
    CreateTodoComponent,
    WeekselectorComponent,
    LoaderComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    DragDropModule,
    MatDialogModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
