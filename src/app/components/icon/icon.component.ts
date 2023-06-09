import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent {
  @Input() name: string = '';
  @Input() size?: string = '100%';
  @Input() thickness?: string = '1';
}
