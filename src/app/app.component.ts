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
    {
      label: 'Home',
      link: '/'
    },
    {
      label: 'Regressão score',
      link: '/models/score-regression'
    },
    {
      label: 'Classificação região',
      link: '/models/region-classification'
    },
    { label: 'Impacto Pandemia', action: this.onClick.bind(this) },
    { label: 'Sobre', action: this.onClick.bind(this) },
  ];

  private onClick() {
    alert('Clicked in menu item')
  }

}
