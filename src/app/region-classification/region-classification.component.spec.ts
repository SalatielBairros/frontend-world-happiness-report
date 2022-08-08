import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionClassificationComponent } from './region-classification.component';

describe('RegionClassificationComponent', () => {
  let component: RegionClassificationComponent;
  let fixture: ComponentFixture<RegionClassificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegionClassificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegionClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
