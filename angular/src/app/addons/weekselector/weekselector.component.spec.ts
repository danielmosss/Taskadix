import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekselectorComponent } from './weekselector.component';

describe('WeekselectorComponent', () => {
  let component: WeekselectorComponent;
  let fixture: ComponentFixture<WeekselectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeekselectorComponent]
    });
    fixture = TestBed.createComponent(WeekselectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
