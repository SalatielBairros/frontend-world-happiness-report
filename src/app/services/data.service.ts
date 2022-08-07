import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { BaseHttpService } from '../core/base-http.service';
import { CountryData } from '../models/country-data.model';

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
}