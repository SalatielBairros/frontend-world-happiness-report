import { RegionClassificationEvaluation } from "./region-classification-evaluation.model";

export interface BalancedClassificationResponse {
    test_data_evaluation: RegionClassificationEvaluation
    validation_data_evaluation: RegionClassificationEvaluation
}