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
      label: 'Sobre o projeto',
      link: '/'
    },
    {
      label: 'Visão geral dos dados',
      link: '/data'
    },
    {
      label: 'Regressão score',
      link: '/models/score-regression'
    },
    {
      label: 'Classificação região',
      link: '/models/region-classification'
    },
    {
      label: 'Impacto Pandemia',
      link: '/pandemic-impact'
    }    
  ];
}
