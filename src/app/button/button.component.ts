import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input()
  set disabled(value: boolean | string) {
    this.disabledBoolean =
      value === 'true' || value.toString() === 'true' || value === '';
  }
  get disabled(): string {
    return this.disabledBoolean.toString();
  }
  @Output() onClick = new EventEmitter();

  disabledBoolean: boolean = false;

  btnClick = () => {
    this.onClick.emit();
  };
}
