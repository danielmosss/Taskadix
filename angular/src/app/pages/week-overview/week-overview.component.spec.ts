import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekOverviewComponent } from './week-overview.component';

describe('WeekOverviewComponent', () => {
  let component: WeekOverviewComponent;
  let fixture: ComponentFixture<WeekOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeekOverviewComponent]
    });
    fixture = TestBed.createComponent(WeekOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
