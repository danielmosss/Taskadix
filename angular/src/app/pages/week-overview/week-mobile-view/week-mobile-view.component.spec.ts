import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekMobileViewComponent } from './week-mobile-view.component';

describe('WeekMobileViewComponent', () => {
  let component: WeekMobileViewComponent;
  let fixture: ComponentFixture<WeekMobileViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeekMobileViewComponent]
    });
    fixture = TestBed.createComponent(WeekMobileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
