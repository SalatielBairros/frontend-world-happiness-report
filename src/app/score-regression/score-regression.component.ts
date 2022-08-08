import { Component, OnInit } from '@angular/core';
import { PoSelectOption } from '@po-ui/ng-components';
import { RegressionModelEvaluation } from '../models/regression-model-evaluation.model';
import { MlModelsService } from '../services/ml-models.service';

@Component({
  selector: 'app-score-regression',
  templateUrl: './score-regression.component.html',
  styleUrls: ['./score-regression.component.less']
})
export class ScoreRegressionComponent implements OnInit {

  constructor(public service: MlModelsService) { }

  public evaluations: any = {}
  public years: Array<number> = [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]
  public graphOptions: any = null;
  public graphImportancesOptions: any = null;
  public updatedOptions: any = null;
  public updatedImportancesOptions: any = null;
  public isGraphLoading: boolean = false;
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
    this.isGraphLoading = true;
    this.service.getScoreRegressionEvaluation('knn').subscribe({
      next: (data) => {
        this.evaluations['knn'] = data

        let features_knn: any = {}
        data[0].importances.map(i => i[0]).forEach(x => features_knn[x] = [])
        data.forEach(x => x.importances.forEach(i => features_knn[i[0]].push(i[1])))

        let series = []
        for (const [key, value] of Object.entries(features_knn)) {
          series.push({
            name: key,
            type: 'bar',
            stack: 'counts',
            data: value
          })
        }
        this.updatedImportancesOptions = {
          series: series,
          legend: {
            data: Object.keys(features_knn)
          }
        }

        this.service.getScoreRegressionEvaluation('random-forest').subscribe({
          next: (data) => {
            this.evaluations['random-forest'] = data
            this.onMetricChange('r2');
          },
        });
      },
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
    this.graphImportancesOptions = {
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
      tooltip: {}
    };
    this.isGraphLoading = false;
  }
}
