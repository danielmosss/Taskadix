import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoOverviewComponent } from './todo-overview.component';

describe('TodoOverviewComponent', () => {
  let component: TodoOverviewComponent;
  let fixture: ComponentFixture<TodoOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodoOverviewComponent]
    });
    fixture = TestBed.createComponent(TodoOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
