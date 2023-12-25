import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForcastBuienradarRegen3hComponent } from './forcast-buienradar-regen3h.component';

describe('ForcastBuienradarRegen3hComponent', () => {
  let component: ForcastBuienradarRegen3hComponent;
  let fixture: ComponentFixture<ForcastBuienradarRegen3hComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForcastBuienradarRegen3hComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForcastBuienradarRegen3hComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
