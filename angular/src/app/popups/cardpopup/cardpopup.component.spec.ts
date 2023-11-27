import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardpopupComponent } from './cardpopup.component';

describe('CardpopupComponent', () => {
  let component: CardpopupComponent;
  let fixture: ComponentFixture<CardpopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardpopupComponent]
    });
    fixture = TestBed.createComponent(CardpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
