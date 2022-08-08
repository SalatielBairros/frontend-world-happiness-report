export interface RegressionModelEvaluation {
    year: number
    r2: number
    adjusted_r2: number
    mean_squared_error: number
    sqrt_mean_squared_error: number
    importances: Array<Array<any>>
}