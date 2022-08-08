import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ScoreRegressionComponent } from "./score-regression.component";

const routes: Routes = [
  {
    path: '',
    component: ScoreRegressionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoreRegressionRoutingModule {}