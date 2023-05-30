import { Component } from '@angular/core';

@Component({
  selector: 'app-elements',
  templateUrl: './elements.component.html',
  styleUrls: ['./elements.component.scss'],
})
export class ElementsComponent {
  onInputChange = (value: string) => {
    console.log(value);
  };
  onButtonClick = () => {
    console.log('clicked');
  };
}
