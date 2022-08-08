import { Metrics } from "./metrics.model";

export interface CountryData extends Metrics {
    country: string;
    region: string;    
}