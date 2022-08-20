import { Component, OnInit } from '@angular/core';
import { PoSelectOption } from '@po-ui/ng-components';
import { forkJoin } from 'rxjs';
import { DataService } from '../services/data.service';
import { MlModelsService } from '../services/ml-models.service';
declare var Plotly: any;
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
      value: 'f1-score'
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

        this.plotConfusionMatrix(this.regions, results[2].validation_data_evaluation.confusion_matrix, 'knn_confusion_matrix');
        this.plotConfusionMatrix(this.regions, results[4].validation_data_evaluation.confusion_matrix, 'rf_confusion_matrix');        

        let fi_element = document.getElementById('feature_importance_graph');
        let knn_fi_x: Array<string> = []
        let knn_fi_y: Array<number> = []
        results[2].validation_data_evaluation.feature_importances.forEach(x => {
          knn_fi_x.push(x[0]);
          knn_fi_y.push(x[1]);
        });
        let series_knn = {
          name: 'KNN',
          type: 'bar',
          x: knn_fi_x,
          y: knn_fi_y,
        }

        let rf_fi_x: Array<string> = []
        let rf_fi_y: Array<number> = []
        results[4].validation_data_evaluation.feature_importances.forEach(x => {
          rf_fi_x.push(x[0]);
          rf_fi_y.push(x[1]);
        });
        let series_rf = {
          name: 'Random Forest',
          type: 'bar',
          x: rf_fi_x,
          y: rf_fi_y,
        }
        var layout = {barmode: 'group'};
        Plotly.newPlot(fi_element, [series_knn, series_rf], layout);

        this.label_metrics.map(m => m.value).forEach(m => {
          this.graphData[m] = []

          let balanced_validation_knn_series: Array<any> = []
          this.regions.forEach(r => balanced_validation_knn_series.push({
            name: r,
            value: [r, results[2].validation_data_evaluation.report_by_label[r][m]]
          }));
          let balanced_validation_knn = {
            name: 'KNN Balanceado (Validação)',
            type: 'bar',
            data: balanced_validation_knn_series
          }
          this.graphData[m].push(balanced_validation_knn);

          let balanced_randomForest_series: Array<any> = []
          this.regions.forEach(r => balanced_randomForest_series.push({
            name: r,
            value: [r, results[4].validation_data_evaluation.report_by_label[r][m]]
          }));
          let balanced_validation_rf = {
            name: 'Random Forest Balanceado (Validação)',
            type: 'bar',
            data: balanced_randomForest_series
          }
          this.graphData[m].push(balanced_validation_rf);          
        });

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
        data: xAxis,
        show: false
      },
      yAxis: {
        type: 'value'
      },
      legend: {
        data: ['KNN Balanceado', 'Random Forest Balanceado'],
        align: 'left',
      },
      grid: {
        left: '0',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      series: series,
      tooltip: {}
    };
  }

  public onMetricChange(event: any): void {
    this.updatedOptions = {
      series: this.graphData[event]
    };
  }

  private plotConfusionMatrix(labels: Array<string>, data: Array<Array<number>>, element_id: any) {
    let element = document.getElementById(element_id);
    const reducer = (accumulator: number, curr: number) => accumulator + curr;
    let confusion_matrix: Array<Array<number>> = []
    data.forEach((row, index) => {
      let sum = row.reduce(reducer);
      let new_array: Array<number> = [];

      row.forEach((e) => {
        new_array.push(e / sum);
      });

      confusion_matrix.push(new_array);
    });

    var graph_data = [
      {
        z: confusion_matrix,
        x: labels,
        y: labels,
        type: 'heatmap',
        hoverongaps: false,
        colorscale: 'Greys',
        reversescale: true,
        showscale: false
      }
    ];

    var layout = {      
      margin: {
        l: 150,
        r: 50,
        b: 0,
        t: 50,
        pad: 4
      },
      xaxis: {
        showticklabels:false
      }
    };

    Plotly.newPlot(element, graph_data, layout);
  }
}
