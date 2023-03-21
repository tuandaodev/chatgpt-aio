import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CacheKeys, TRIGGER_MODES } from '@shared/app.constants';

interface TriggerModeModel {
  value: string;
  name: string;
}

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent {

  triggerModes: TriggerModeModel[] = [
    {
      value: TRIGGER_MODES.AUTO,
      name: 'Auto'
    },
    {
      value: TRIGGER_MODES.MANUAL,
      name: 'Manual'
    },
    {
      value: TRIGGER_MODES.CONTAINS,
      name: "Contains"
    }
  ];

  public readonly TRIGGER_MODES = TRIGGER_MODES;

  triggerContainers: string[] = ["?"];

  formGroup: FormGroup;
  
  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  initForm() {
    this.formGroup = this.fb.group({
      triggerMode: [this.triggerModes[0].value],
      triggerContainers: ["?"]
    });
  }

  loadData() {
    const json = localStorage.getItem(CacheKeys.SETTINGS);
    if (!json) return;
    const data = JSON.parse(json);
    if (data) {
      this.formGroup.patchValue({
        triggerMode: data.triggerMode,
        triggerContainers: data.triggerContainers
      })
    }
  }

  get f() {
    return this.formGroup.controls;
  }

  onSubmit() {
    const data = {
      ...this.formGroup.value,
    }
    
    console.log(JSON.stringify(data));
    localStorage.setItem(CacheKeys.SETTINGS, JSON.stringify(data));
  }
}
