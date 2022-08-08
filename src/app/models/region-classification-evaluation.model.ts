export interface RegionClassificationEvaluation{
    accuracy: number
    precision: number
    recall: number
    f1_score: number
    confusion_matrix: Array<Array<number>>
    report_by_label: any
    feature_importances: Array<Array<any>>
}