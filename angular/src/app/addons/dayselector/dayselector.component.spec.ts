import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayselectorComponent } from './dayselector.component';

describe('DayselectorComponent', () => {
  let component: DayselectorComponent;
  let fixture: ComponentFixture<DayselectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DayselectorComponent]
    });
    fixture = TestBed.createComponent(DayselectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
