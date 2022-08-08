import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RegionClassificationComponent } from "./region-classification.component";

const routes: Routes = [
  {
    path: '',
    component: RegionClassificationComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegionClassificationRoutingModule {}