import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreRegressionComponent } from './score-regression.component';

describe('ScoreRegressionComponent', () => {
  let component: ScoreRegressionComponent;
  let fixture: ComponentFixture<ScoreRegressionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoreRegressionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreRegressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
