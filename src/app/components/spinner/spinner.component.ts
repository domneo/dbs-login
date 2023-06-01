import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
  @Input() size: string = '36';

  width = `${this.size}px`;
  height = `${this.size}px`;
  transformStyle = `scale(${parseInt(this.size) / 80})`;
}
