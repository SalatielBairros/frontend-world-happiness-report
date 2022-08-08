import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { BaseHttpService } from '../core/base-http.service';
import { CountryData } from '../models/country-data.model';
import { Metrics } from '../models/metrics.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  processedData$: Observable<Array<CountryData>> | undefined;

  constructor(
    private http: BaseHttpService) {
  }


  public getProcessedData(): Observable<Array<CountryData>> {
    if (!this.processedData$) {
      let columns = "country,region,year,score,gdp,social_support,hle,freedom,generosity,corruption,positive_affect,negative_affect"
      this.processedData$ = this.http.get<Array<any>>(`data-ingestion/ingested/processed-data?columns=${columns}`)
        .pipe(map((response: Array<CountryData>) => {
          return response
        }), shareReplay(1));
    }
    return this.processedData$;
  }

  public getGroupedData(groupBy: string = "year", country: string = '', region: string = ''): Observable<Array<Metrics>> {
    let params = '';    
    if (country) {
      params += `&country=${country}`;
    }
    if (region) {
      params += `&region=${region}`;
    }

    let columns = "year,score,gdp,social_support,hle,freedom,generosity,corruption,positive_affect,negative_affect"
    return this.http.get<Array<Metrics>>(`data-ingestion/ingested/processed-data/grouped?group_by=${groupBy}&columns=${columns}${params}`);
  }

  public getCountries(): Observable<Array<string>> {    
    return this.http.get<any>('data-ingestion/ingested/processed-data/countries')
      .pipe(map((response: any) => response.data));
  }

  public getRegions(): Observable<Array<string>> {    
    return this.http.get<any>('data-ingestion/ingested/processed-data/regions')
      .pipe(map((response: any) => response.data));
  }
}