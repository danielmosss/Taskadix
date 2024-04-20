import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilePickDayPopupComponent } from './mobile-pick-day-popup.component';

describe('MobilePickDayPopupComponent', () => {
  let component: MobilePickDayPopupComponent;
  let fixture: ComponentFixture<MobilePickDayPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MobilePickDayPopupComponent]
    });
    fixture = TestBed.createComponent(MobilePickDayPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
