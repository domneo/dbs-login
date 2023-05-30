import { Component } from '@angular/core';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
})
export class PlaygroundComponent {
  onInputChange = (value: string) => {
    console.log(value);
  };
  onButtonClick = () => {
    console.log('clicked');
  };
}
