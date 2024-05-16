import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-startup-script-generator',
  templateUrl: './startup-script-generator.component.html',
  styleUrls: ['./startup-script-generator.component.scss']
})
export class StartupScriptGeneratorComponent {
  scriptForm: FormGroup;
  batchScript: string = `@echo off\necho Starting programs...\n`;

  constructor(private fb: FormBuilder) {
    this.scriptForm = this.fb.group({
      appName: '',
      appPath: '',
      appArgs: ''
    });
  }

  generateScript() {
    const { appName, appPath, appArgs } = this.scriptForm.value;
    const args = appArgs.split(',').map((arg: any) => arg.trim()).join(' ');
    this.batchScript += `start "" "${appPath}" ${args}\n`;
    this.scriptForm.reset();
  }

  downloadScript() {
    this.batchScript += `echo All programs started.
    pause`;

    const element = document.createElement('a');
    const file = new Blob([this.batchScript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "startup.bat";
    document.body.appendChild(element);
    element.click();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.batchScript = fileReader.result as string;
      };
      fileReader.readAsText(file);
    }
  }
}
