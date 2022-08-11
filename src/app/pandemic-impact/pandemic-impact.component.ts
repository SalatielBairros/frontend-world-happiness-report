import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PoSelectOption, PoTableColumn, PoTableLiterals } from '@po-ui/ng-components';
import { CountryData } from '../models/country-data.model';
import { Metrics } from '../models/metrics.model';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-pandemic-impact',
  templateUrl: './pandemic-impact.component.html',
  styleUrls: ['./pandemic-impact.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class PandemicImpactComponent implements OnInit {

  constructor(private service: DataService) { }

  public selectedCountry: string = '';
  public selectedMetric: string = '';
  public selectedRegion: string = '';
  public chartInstance: any;
  public all_items: Array<CountryData> = [];
  public grouped_data: Array<Metrics> = [];
  public tableLoading: boolean = true;
  public showMoreLoading: boolean = false;
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
    this.loadCountriesDrop();
    this.loadRegionsDrop();
    this.loadGraph();
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
    this.service.getGroupedPandemicData('year', country, region).subscribe({
      next: (data) => {
        this.grouped_data = data;
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
            data: data.map(item => item.score)
          }]
        };
      }
    });
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
    this.service.getGroupedPandemicData('year', this.selectedCountry, this.selectedRegion).subscribe({
      next: (data) => {
        this.updatedOptions = {
          series: [{
            data: data.map(x => (<any>x)[this.selectedMetric])
          }]
        };
      }
    });
  }
}
