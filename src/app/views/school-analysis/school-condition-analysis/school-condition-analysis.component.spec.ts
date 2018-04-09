import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolConditionAnalysisComponent } from './school-condition-analysis.component';

describe('SchoolConditionAnalysisComponent', () => {
  let component: SchoolConditionAnalysisComponent;
  let fixture: ComponentFixture<SchoolConditionAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolConditionAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolConditionAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
