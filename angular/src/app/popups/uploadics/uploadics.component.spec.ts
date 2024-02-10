import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadicsComponent } from './uploadics.component';

describe('UploadicsComponent', () => {
  let component: UploadicsComponent;
  let fixture: ComponentFixture<UploadicsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadicsComponent]
    });
    fixture = TestBed.createComponent(UploadicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
