import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {DragDropModule} from '@angular/cdk/drag-drop';


import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { WeatherComponent } from './weather/weather.component';
import { TodoOverviewComponent } from './todo-overview/todo-overview.component';
import { AgendaComponent } from './agenda/agenda.component';
import { ForcastBuienradarRegen3hComponent } from './forcast-buienradar-regen3h/forcast-buienradar-regen3h.component';
import { CardpopupComponent } from './popups/cardpopup/cardpopup.component';

import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';


@NgModule({
  declarations: [
    AppComponent,
    WeatherComponent,
    TodoOverviewComponent,
    AgendaComponent,
    ForcastBuienradarRegen3hComponent,
    CardpopupComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    DragDropModule,
    MatDialogModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
