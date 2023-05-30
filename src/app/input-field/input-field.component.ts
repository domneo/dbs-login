import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
})
export class InputFieldComponent {
  @Input() value: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() variant: 'default' | 'success' | 'error' = 'default';
  @Input() icon: string = '';
  @Input() validationText: string = '';
  @Input() validationIcon: string = '';
  @Input() validationType: 'success' | 'error' = 'success';
  @Output() onChange = new EventEmitter();

  valueChange = (event: Event) => {
    this.onChange.emit((<HTMLInputElement>event.target).value);
  };
}
