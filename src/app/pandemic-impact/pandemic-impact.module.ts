import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PandemicImpactComponent } from './pandemic-impact.component';
import { PoFieldModule, PoModule } from '@po-ui/ng-components';
import { FormsModule } from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';
import { PandemicImpactRoutingModule } from './pandemic-impact-routing.module';

@NgModule({
  declarations: [
    PandemicImpactComponent
  ],
  imports: [
    CommonModule,
    PoModule,
    PandemicImpactRoutingModule,
    FormsModule,
    PoFieldModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ]
})
export class PandemicImpactModule { }
