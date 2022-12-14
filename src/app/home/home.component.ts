import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PoSelectOption, PoTableColumn, PoTableColumnSortType, PoTableLiterals } from '@po-ui/ng-components';
import { CountryData } from '../models/country-data.model';
import { Metrics } from '../models/metrics.model';
import { DataService } from '../services/data.service';
declare var Plotly: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  constructor(private service: DataService) { }

  public selectedCountry: string = '';
  public selectedMetric: string = '';
  public selectedRegion: string = '';
  public chartInstance: any;
  public all_items: Array<CountryData> = [];
  public grouped_data: Array<Metrics> = [];
  public tableLoading: boolean = true;
  public graphLoading: boolean = true;
  public loadingCorrelations: boolean = true;
  public showMoreLoading: boolean = false;
  public currentGraphData: Array<number> = [];
  public view_items: Array<CountryData> = [];
  public columns: Array<PoTableColumn> = [
    {
      property: 'country',
      label: 'País'
    },
    {
      property: 'region',
      label: 'Região'
    },
    {
      property: 'year',
      label: 'Ano'
    },
    {
      property: 'score',
      label: 'Score',
      type: 'number',
      format: '1.4-4'
    },
    {
      property: 'gdp',
      label: 'GDP',
      type: 'number',
      format: '1.4-4'
    },
    {
      property: 'social_support',
      label: 'Suporte Social',
      type: 'number',
      format: '1.4-4'
    },
    {
      property: 'hle',
      label: 'HLE',
      type: 'number',
      format: '2.4-4'
    },
    {
      property: 'freedom',
      label: 'Liberdade',
      type: 'number',
      format: '1.4-4'
    },
    {
      property: 'generosity',
      label: 'Generosidade',
      type: 'number',
      format: '1.4-4'
    },
    {
      property: 'corruption',
      label: 'Corrupção',
      type: 'number',
      format: '1.4-4'
    },
    {
      property: 'positive_affect',
      label: 'Afeição Positiva',
      type: 'number',
      format: '1.4-4'
    },
    {
      property: 'negative_affect',
      label: 'Afeição Negativa',
      type: 'number',
      format: '1.4-4'
    }
  ];
  public customLiterals: PoTableLiterals = {
    loadMoreData: 'Buscar mais dados',
    loadingData: 'Processando',
    noColumns: 'Sem colunas',
    noData: 'Sem dados',
    seeCompleteSubtitle: 'Mostrar legenda completa',
    completeSubtitle: 'Todas legendas'
  };
  public graphOptions: any = null;
  public updatedOptions: any = null;
  public countries: Array<PoSelectOption> = []
  public regions: Array<PoSelectOption> = []

  private page_size: number = 10;
  private current_page: number = 1;

  ngOnInit(): void {
    this.current_page = 1;
    this.loadTable();
    this.loadCountriesDrop();
    this.loadRegionsDrop();
    this.loadGraph();
    this.plotCorrelations();
  }

  private loadRegionsDrop() {
    this.service.getRegions().subscribe({
      next: (data) => {
        this.regions = data.map(item => <PoSelectOption>{
          value: item,
          label: item
        });
        this.regions.unshift(<PoSelectOption>{
          value: '',
          label: 'Selecione...'
        });
      }
    });
  }

  private loadCountriesDrop() {
    this.service.getCountries().subscribe({
      next: (data) => {
        this.countries = data.map(item => <PoSelectOption>{
          value: item,
          label: item
        });
        this.countries.unshift(<PoSelectOption>{
          value: '',
          label: 'Selecione...'
        });
      }
    });
  }

  private loadGraph(country: string = '', region: string = '') {
    this.service.getGroupedData('year', country, region).subscribe({
      next: (data) => {
        this.grouped_data = data;
        this.currentGraphData = data.map(item => item.score)
        this.graphOptions = {
          xAxis: {
            type: 'category',
            data: data.map(item => item.year)
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
          tooltip: {},
          series: [{
            name: 'Dados',
            type: 'line',
            data: this.currentGraphData
          }]
        };
        this.graphLoading = false;
      }
    });
  }

  public onShowMore(event: any): void {
    this.showMoreLoading = true;
    this.current_page++;
    this.view_items = this.all_items.slice(0, this.page_size * this.current_page);
    this.showMoreLoading = false;
  }

  public onMetricChange(event: string): void {
    this.selectedMetric = event;
  }

  public onCountryChange(event: string): void {
    this.selectedCountry = event;
  }

  public onRegionChange(event: string): void {
    this.selectedRegion = event;
  }

  public onClickFilter(): void {
    this.graphLoading = true;
    this.service.getGroupedData('year', this.selectedCountry, this.selectedRegion).subscribe({
      next: (data) => {
        if (this.selectedMetric == null || this.selectedMetric == '') {
          this.selectedMetric = 'score';
        }
        this.currentGraphData = data.map(x => (<any>x)[this.selectedMetric]);
        this.updatedOptions = {
          series: [{
            data: this.currentGraphData
          }]
        };
        this.graphLoading = false;
      }
    });
  }

  public onTableSorting(order: { column?: PoTableColumn | undefined, type: PoTableColumnSortType | undefined }): void {
    this.current_page = 1
    this.all_items.sort((a, b) => {
      return (<any>a)[order.column?.property ?? 'score'] > (<any>b)[order.column?.property ?? 'score'] ? 1 : -1;
    });

    if (order.type == PoTableColumnSortType.Descending) {
      this.all_items = this.all_items.reverse()
    }
    this.view_items = this.all_items.slice(0, this.page_size);
  }

  private loadTable() {
    this.service.getProcessedData().subscribe(
      {
        next: (data) => {
          this.all_items = data;
          this.view_items = this.all_items.slice(0, this.page_size);
        },
        error: (err) => console.error(err),
        complete: () => this.tableLoading = false
      });
  }

  private plotCorrelations(): void {
    let element = document.getElementById('corr_matrix');
    this.service.getCorrelations().subscribe({
      next: (data) => {
        let keys = Object.keys(data);
        let zValues: any = Object.values(data)

        var graph_data = [
          {
            z: zValues,
            x: keys,
            y: keys,
            type: 'heatmap',
            hoverongaps: false,
            colorscale: 'RdBu',
            reversescale: true,
            showscale: false
          }
        ];

        var layout = {
          annotations: [],
          width: 1200,
          height: 600,
          margin: {
            l: 200,
            r: 50,
            b: 100,
            t: 50,
            pad: 4
          },
        };

        for (var i = 0; i < keys.length; i++) {
          for (var j = 0; j < keys.length; j++) {
            var currentValue = zValues[i][j];
            if (currentValue != 0.0) {
              var textColor = 'white';
            } else {
              var textColor = 'black';
            }
            var result: any = {
              xref: 'x1',
              yref: 'y1',
              x: keys[j],
              y: keys[i],
              text: (<number>zValues[i][j]).toFixed(2),
              font: {
                family: 'Arial',
                size: 12,
                color: textColor
              },
              showarrow: false
            };
            layout.annotations.push(<never>result);
          }
        }

        Plotly.newPlot(element, graph_data, layout);
        this.loadingCorrelations = false;
      }
    });
  }
}
