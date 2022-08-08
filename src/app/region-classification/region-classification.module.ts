import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegionClassificationComponent } from './region-classification.component';
import { PoFieldModule, PoModule } from '@po-ui/ng-components';
import { NgxEchartsModule } from 'ngx-echarts';
import { FormsModule } from '@angular/forms';
import { RegionClassificationRoutingModule } from './region-classification-routing.module';


@NgModule({    
  declarations: [RegionClassificationComponent],
  imports: [
    CommonModule,
    RegionClassificationRoutingModule,
    PoModule,
    FormsModule,
    PoFieldModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ]
})
export class RegionClassificationModule { }
