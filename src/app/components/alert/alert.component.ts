import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent {
  @Input() variant: 'default' | 'success' | 'warning' | 'error' = 'default';

  icon: string = '';

  ngOnInit() {
    switch (this.variant) {
      case 'default':
        this.icon = 'information-circle';
        break;
      case 'success':
        this.icon = 'check-circle';
        break;
      case 'warning':
        this.icon = 'exclamation-triangle';
        break;
      case 'error':
        this.icon = 'exclamation-circle';
        break;
      default:
        break;
    }
  }
}
