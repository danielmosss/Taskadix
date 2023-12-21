import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadjsonComponent } from './uploadjson.component';

describe('UploadjsonComponent', () => {
  let component: UploadjsonComponent;
  let fixture: ComponentFixture<UploadjsonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadjsonComponent]
    });
    fixture = TestBed.createComponent(UploadjsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
