import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartupScriptGeneratorComponent } from './startup-script-generator.component';

describe('StartupScriptGeneratorComponent', () => {
  let component: StartupScriptGeneratorComponent;
  let fixture: ComponentFixture<StartupScriptGeneratorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StartupScriptGeneratorComponent]
    });
    fixture = TestBed.createComponent(StartupScriptGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
