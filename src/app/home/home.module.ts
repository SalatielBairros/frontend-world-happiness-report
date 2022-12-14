import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoFieldModule, PoModule } from '@po-ui/ng-components';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    PoModule,
    FormsModule,
    PoFieldModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ]
})
export class HomeModule { }