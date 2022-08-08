import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxEchartsModule } from 'ngx-echarts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PoModule } from '@po-ui/ng-components';
import { RouterModule } from '@angular/router';
import { HomeModule } from './home/home.module';
import { PandemicImpactComponent } from './pandemic-impact/pandemic-impact.component';

@NgModule({
  declarations: [
    AppComponent,
    PandemicImpactComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    PoModule,
    RouterModule.forRoot([]),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
