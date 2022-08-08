import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoFieldModule, PoModule } from '@po-ui/ng-components';
import { NgxEchartsModule } from 'ngx-echarts';
import { FormsModule } from '@angular/forms';
import { ScoreRegressionComponent } from './score-regression.component';
import { ScoreRegressionRoutingModule } from './score-regression-routing.module';

@NgModule({
  declarations: [ScoreRegressionComponent],
  imports: [
    CommonModule,
    ScoreRegressionRoutingModule,
    PoModule,
    FormsModule,
    PoFieldModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ]
})
export class ScoreRegressionModule { }