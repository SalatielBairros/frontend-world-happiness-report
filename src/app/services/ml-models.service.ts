import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { BaseHttpService } from '../core/base-http.service';
import { BalancedClassificationResponse } from '../models/balanced-classification-response.model';
import { RegionClassificationEvaluation } from '../models/region-classification-evaluation.model';
import { RegressionModelEvaluation } from '../models/regression-model-evaluation.model';

@Injectable({
    providedIn: 'root',
})
export class MlModelsService {

    processedRegressionData$: any = {}
    processedClassificationData$: any = {}
    processedBalancedClassificationData$: any = {}

    constructor(
        private http: BaseHttpService) {
    }

    public getScoreRegressionEvaluation(algorithm: string = 'knn'): Observable<Array<RegressionModelEvaluation>> {
        if (!this.processedRegressionData$[algorithm]) {
            this.processedRegressionData$[algorithm] = this.http.get<Array<RegressionModelEvaluation>>(`score-regression/${algorithm}/evaluate`)
                .pipe(map((response: Array<RegressionModelEvaluation>) => {
                    return response
                }), shareReplay(1));
        }
        return this.processedRegressionData$[algorithm];
    }

    public getRegionClassificationEvaluation(algorithm: string = 'knn'): Observable<RegionClassificationEvaluation> {
        if (!this.processedClassificationData$[algorithm]) {
            this.processedClassificationData$[algorithm] = this.http.get<RegressionModelEvaluation>(`region-classification/${algorithm}/evaluate`)
                .pipe(map((response: RegressionModelEvaluation) => {
                    return response
                }), shareReplay(1));
        }
        return this.processedClassificationData$[algorithm];
    }

    public getRegionClassificationBalancedEvaluation(algorithm: string = 'knn'): Observable<BalancedClassificationResponse> {
        if (!this.processedBalancedClassificationData$[algorithm]) {
            this.processedBalancedClassificationData$[algorithm] = this.http.get<BalancedClassificationResponse>(`region-classification/${algorithm}/balanced/evaluate`)
                .pipe(map((response: BalancedClassificationResponse) => {
                    return response
                }), shareReplay(1));
        }
        return this.processedBalancedClassificationData$[algorithm];
    }
}