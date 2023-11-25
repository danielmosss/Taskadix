import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { WeatherComponent } from './weather/weather.component';
import { AgendaComponent } from './agenda/agenda.component';
import { TodoOverviewComponent } from './todo-overview/todo-overview.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, WeatherComponent, AgendaComponent, TodoOverviewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dashboard';
}
