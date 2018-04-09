import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasourceAnalysisComponent } from './datasource-analysis.component';

describe('DatasourceAnalysisComponent', () => {
  let component: DatasourceAnalysisComponent;
  let fixture: ComponentFixture<DatasourceAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasourceAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasourceAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
