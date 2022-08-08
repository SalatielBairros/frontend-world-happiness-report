import { RegionClassificationModule } from "../region-classification/region-classification.module";

export interface BalancedClassificationResponse {
    test_data_evaluation: RegionClassificationModule
    validation_data_evaluation: RegionClassificationModule
}