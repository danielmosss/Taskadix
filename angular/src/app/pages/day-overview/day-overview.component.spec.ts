import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayOverviewComponent } from './day-overview.component';

describe('DayOverviewComponent', () => {
  let component: DayOverviewComponent;
  let fixture: ComponentFixture<DayOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DayOverviewComponent]
    });
    fixture = TestBed.createComponent(DayOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
