import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlContainer, NgModelGroup } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';

export type ValidationType = 'default' | 'success' | 'error';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgModelGroup }],
})
export class InputFieldComponent {
  @Input() name: string = '';
  @Input() label: string = '';
  @Input() value: string = '';
  @Input() placeholder: string = '';
  @Input()
  set required(value: boolean | string) {
    this.requiredBoolean =
      value === 'true' || value.toString() === 'true' || value === '';
  }
  get required(): string {
    return this.requiredBoolean.toString();
  }
  @Input()
  set disabled(value: boolean | string) {
    this.disabledBoolean =
      value === 'true' || value.toString() === 'true' || value === '';
  }
  get disabled(): string {
    return this.disabledBoolean.toString();
  }
  @Input() type: string = 'text';
  @Input() variant: string = 'default';
  @Input() icon: string = '';
  @Input() validationText: string = '';
  @Input() validationIcon: string = '';
  @Input() validationType: string = 'default';
  @Output() onChange = new EventEmitter();

  id: string = uuidv4();
  requiredBoolean: boolean = false;
  disabledBoolean: boolean = false;

  valueChange = (event: Event) => {
    this.onChange.emit(<HTMLInputElement>event.target);
  };
}
