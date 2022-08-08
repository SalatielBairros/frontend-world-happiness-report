import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'models/score-regression',
    loadChildren: () => import('./score-regression/score-regression.module').then(m => m.ScoreRegressionModule)
  },
  {
    path: 'models/region-classification',
    loadChildren: () => import('./region-classification/region-classification.module').then(m => m.RegionClassificationModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
