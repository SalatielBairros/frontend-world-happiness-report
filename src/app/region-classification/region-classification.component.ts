import { Component, OnInit } from '@angular/core';
import { PoSelectOption } from '@po-ui/ng-components';
import { Observable, forkJoin, map } from 'rxjs';
import { DataService } from '../services/data.service';
import { MlModelsService } from '../services/ml-models.service';

@Component({
  selector: 'app-region-classification',
  templateUrl: './region-classification.component.html',
  styleUrls: ['./region-classification.component.less']
})
export class RegionClassificationComponent implements OnInit {

  public label_metrics: Array<PoSelectOption> = [    
    {
      label: 'Precisão',
      value: 'precision'
    },
    {
      label: 'Recall',
      value: 'recall'
    },
    {
      label: 'F1-Score',
      value: 'f1_score'
    }
  ];
  public regions: Array<string> = [];
  public graphData: any = {};
  public graphOptions: any = null;
  public updatedOptions: any = null;

  constructor(public mlService: MlModelsService, public dataService: DataService) { }

  ngOnInit(): void {
    let regions = this.dataService.getRegions();
    let knn = this.mlService.getRegionClassificationEvaluation('knn');
    let balanced_knn = this.mlService.getRegionClassificationBalancedEvaluation('knn');
    let randomForest = this.mlService.getRegionClassificationEvaluation('random-forest');
    let balanced_randomForest = this.mlService.getRegionClassificationBalancedEvaluation('random-forest');

    forkJoin([regions, knn, balanced_knn, randomForest, balanced_randomForest]).subscribe({
      next: (results) => {
        this.regions = results[0];
        console.log(this.regions);
        this.label_metrics.map(m => m.value).forEach(m => {
          this.graphData[m] = []

          let knn_series: Array<any> = []
          this.regions.forEach(r => knn_series.push({
            name: r,
            value: [r, results[1].report_by_label[r][m]]
          }));
          this.graphData[m].push({
            name: 'KNN',
            type: 'bar',
            data: knn_series
          })

          let balanced_knn_series: Array<any> = []
          this.regions.forEach(r => balanced_knn_series.push({
            name: r,
            value: [r, results[2].validation_data_evaluation.report_by_label[r][m]]
          }));
          this.graphData[m].push({
            name: 'KNN Balanceado',
            type: 'bar',
            data: balanced_knn_series
          });

          let randomForest_series: Array<any> = []
          this.regions.forEach(r => randomForest_series.push({
            name: r,
            value: [r, results[3].report_by_label[r][m]]
          }));
          this.graphData[m].push({
            name: 'Random Forest',
            type: 'bar',
            data: randomForest_series
          });

          let balanced_randomForest_series: Array<any> = []
          this.regions.forEach(r => balanced_randomForest_series.push({
            name: r,
            value: [r, results[4].validation_data_evaluation.report_by_label[r][m]]
          }));
          this.graphData[m].push({
            name: 'Random Forest Balanceado',
            type: 'bar',
            data: balanced_randomForest_series
          });
        });
        console.log(this.graphData)
        this.loadGraph(this.regions, this.graphData['precision']);
      },
      error: (err) => console.error(err),
      complete: () => console.log('All calls completed!')
    });
  }

  public loadGraph(xAxis: Array<string>, series: Array<any>): void {
    this.graphOptions = {
      xAxis: {
        type: 'category',
        data: xAxis
      },
      yAxis: {
        type: 'value'
      },
      legend: {
        data: ['KNN', 'KNN Balanceado', 'Random Forest', 'Random Forest Balanceado'],
        align: 'left',
      },
      z: 10,
      dataZoom: [
        {
          type: 'inside',
        },
      ],
      grid: {
        left: '0',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      series: series,
      tooltip: {}
    };
    console.log(this.graphOptions);
  }

  public onMetricChange(event: any): void {
    this.updatedOptions = {
      series: this.graphData[event]
    };
  }
}
