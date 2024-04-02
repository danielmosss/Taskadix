import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthOverviewComponent } from './month-overview.component';

describe('MonthOverviewComponent', () => {
  let component: MonthOverviewComponent;
  let fixture: ComponentFixture<MonthOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonthOverviewComponent]
    });
    fixture = TestBed.createComponent(MonthOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
