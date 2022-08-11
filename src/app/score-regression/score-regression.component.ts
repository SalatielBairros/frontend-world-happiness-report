import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PoSelectOption } from '@po-ui/ng-components';
import { MlModelsService } from '../services/ml-models.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-score-regression',
  templateUrl: './score-regression.component.html',
  styleUrls: ['./score-regression.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ScoreRegressionComponent implements OnInit {

  constructor(public service: MlModelsService) { }

  public evaluations: any = {}
  public years: Array<number> = [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]
  public graphOptions: any = null;
  public updatedOptions: any = null;
  public graphKnnImportancesOptions: any = null;
  public updatedKnnImportancesOptions: any = null;
  public graphRfImportancesOptions: any = null;
  public updatedRfImportancesOptions: any = null;
  public metrics: Array<PoSelectOption> = [
    {
      label: 'R²',
      value: 'r2'
    },
    {
      label: 'R² Ajustado',
      value: 'adjusted_r2'
    },
    {
      label: 'MSE',
      value: 'mean_squared_error'
    },
    {
      label: 'RMSE',
      value: 'sqrt_mean_squared_error'
    }];

  ngOnInit(): void {
    this.loadGraph()
    let knn = this.service.getScoreRegressionEvaluation('knn');
    let randomForest = this.service.getScoreRegressionEvaluation('random-forest');
    forkJoin([knn, randomForest]).subscribe((result) => {
      this.evaluations['knn'] = result[0]

      let features_knn: any = {}
      result[0][0].importances.map(i => i[0]).forEach(x => features_knn[x] = [])
      result[0].forEach(x => x.importances.forEach(i => features_knn[i[0]].push(i[1])))

      let series_knn = []
      for (const [key, value] of Object.entries(features_knn)) {
        series_knn.push({
          name: key,
          type: 'bar',
          stack: 'counts',
          data: value
        })
      }
      this.updatedKnnImportancesOptions = {
        series: series_knn,
        legend: {
          data: Object.keys(features_knn)
        }
      };

      this.evaluations['random-forest'] = result[1]
      this.onMetricChange('r2');

      let features_rf: any = {}
      result[1][0].importances.map(i => i[0]).forEach(x => features_rf[x] = [])
      result[1].forEach(x => x.importances.forEach(i => features_rf[i[0]].push(i[1])))

      let series_rf = []
      for (const [key, value] of Object.entries(features_rf)) {
        series_rf.push({
          name: key,
          type: 'bar',
          stack: 'counts',
          data: value
        })
      }
      this.updatedRfImportancesOptions = {
        series: series_rf,
        legend: {
          data: Object.keys(features_rf)
        }
      }
    });    
  }

  public onMetricChange(event: any): void {
    event = event || 'r2';

    this.updatedOptions = {
      series: [{
        name: 'KNN',
        type: 'line',
        data: this.evaluations['knn'].map((e: any) => e[event])
      },
      {
        name: 'Random Forest',
        type: 'line',
        data: this.evaluations['random-forest'].map((e: any) => e[event])
      }]
    }
  }

  private loadGraph() {
    this.graphOptions = {
      xAxis: {
        type: 'category',
        data: this.years
      },
      yAxis: {
        type: 'value'
      },
      legend: {
        data: ['KNN', 'Random Forest'],
        align: 'left',
      },
      grid: {
        left: '0',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      series: [{
        name: 'KNN',
        type: 'line',
        data: []
      },
      {
        name: 'Random Forest',
        type: 'line',
        data: []
      }],
      tooltip: {}
    };
    this.graphKnnImportancesOptions = {
      xAxis: {
        type: 'category',
      },
      yAxis: {
        type: 'value'
      },
      grid: {
        left: '0',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      tooltip: {}
    };
    this.graphRfImportancesOptions = {
      xAxis: {
        type: 'category',
      },
      yAxis: {
        type: 'value'
      },
      grid: {
        left: '0',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      tooltip: {}
    };
  }
}
