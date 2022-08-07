import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PoTableColumn, PoTableLiterals } from '@po-ui/ng-components';
import { CountryData } from '../models/country-data.model';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  constructor(private service: DataService) { }

  public all_items: Array<CountryData> = [];
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

  private page_size: number = 10;
  private current_page: number = 1;

  ngOnInit(): void {
    this.current_page = 1;
    this.service.getProcessedData().subscribe(
      {
        next: (data) => {
          this.all_items = data
          this.view_items = this.all_items.slice(0, this.page_size);
        },
        error: (err) => console.error(err),
        complete: () => this.tableLoading = false
      });
  }

  public onShowMore(event: any): void {    
    this.showMoreLoading = true;
    console.log(event);
    this.current_page++;
    this.view_items = this.all_items.slice(0, this.page_size * this.current_page);
    this.showMoreLoading = false;
  }
}
