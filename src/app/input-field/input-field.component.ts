import { Component, EventEmitter, Input, Output } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
})
export class InputFieldComponent {
  @Input() label: string = '';
  @Input() value: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() variant: 'default' | 'success' | 'error' = 'default';
  @Input() icon: string = '';
  @Input() validationText: string = '';
  @Input() validationIcon: string = '';
  @Input() validationType: 'default' | 'success' | 'error' = 'default';
  @Output() onChange = new EventEmitter();

  id = uuidv4();

  valueChange = (event: Event) => {
    this.onChange.emit((<HTMLInputElement>event.target).value);
  };
}
