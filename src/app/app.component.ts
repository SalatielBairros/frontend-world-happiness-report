import { Component } from '@angular/core';

import { PoMenuItem } from '@po-ui/ng-components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  public readonly AppName: string = 'World Happiness Report';

  readonly menus: Array<PoMenuItem> = [
    { label: 'Home', action: this.onClick.bind(this) },
    { label: 'Regressão score', action: this.onClick.bind(this) },
    { label: 'Classificação região', action: this.onClick.bind(this) },
    { label: 'Impacto Pandemia', action: this.onClick.bind(this) },
    { label: 'Sobre', action: this.onClick.bind(this) },
  ];

  private onClick() {
    alert('Clicked in menu item')
  }

}
