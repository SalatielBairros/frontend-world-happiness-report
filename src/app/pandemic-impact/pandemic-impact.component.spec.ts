import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PandemicImpactComponent } from './pandemic-impact.component';

describe('PandemicImpactComponent', () => {
  let component: PandemicImpactComponent;
  let fixture: ComponentFixture<PandemicImpactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PandemicImpactComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PandemicImpactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
