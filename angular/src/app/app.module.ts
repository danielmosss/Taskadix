import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpInterceptorService } from 'src/http-interceptor.service';
import { RouterModule, Routes } from '@angular/router'

// Angular Materials
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import { NgxColorsModule } from 'ngx-colors';

// Timepicker
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';


// Components
import { LoginComponent } from './pages/login/login.component';
import { OverviewComponent } from './pages/overview/overview.component';

import { CreateTodoComponent } from './popups/create-todo/create-todo.component';
import { UploadjsonComponent } from './popups/uploadjson/uploadjson.component';
import { CardpopupComponent } from './popups/cardpopup/cardpopup.component';

import { LoaderComponent } from './addons/loader/loader.component';
import { WeekselectorComponent } from './addons/weekselector/weekselector.component';
import { TabsComponent } from './addons/tabs/tabs.component';
import { AccountComponent } from './pages/account/account.component';
import { UploadicsComponent } from './popups/uploadics/uploadics.component';
import { MonthOverviewComponent } from './pages/month-overview/month-overview.component';
import { WeekOverviewComponent } from './pages/week-overview/week-overview.component';
import { CreateAppointmentComponent } from './popups/create-appointment/create-appointment.component';
import { HeaderOverviewComponent } from './pages/header-overview/header-overview.component';
import { AuthGuardService } from 'src/auth-guard.service';
import { DayOverviewComponent } from './pages/day-overview/day-overview.component';
import { HomeComponent } from './pages/home/home.component';
import { DayselectorComponent } from './addons/dayselector/dayselector.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'todos',
    component: OverviewComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'overview/month',
    component: MonthOverviewComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'overview/week',
    component: WeekOverviewComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'overview/day',
    component: DayOverviewComponent,
    canActivate: [AuthGuardService]
  },
]

@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    CardpopupComponent,
    CreateTodoComponent,
    WeekselectorComponent,
    LoaderComponent,
    LoginComponent,
    UploadjsonComponent,
    TabsComponent,
    AccountComponent,
    UploadicsComponent,
    MonthOverviewComponent,
    WeekOverviewComponent,
    CreateAppointmentComponent,
    HeaderOverviewComponent,
    DayOverviewComponent,
    HomeComponent,
    DayselectorComponent
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
    MatProgressSpinnerModule,
    MatTabsModule,
    NgxColorsModule,
    MatSlideToggleModule,
    MatSelectModule,
    NgxMaterialTimepickerModule,
    RouterModule.forRoot(routes),
    MatProgressBarModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
