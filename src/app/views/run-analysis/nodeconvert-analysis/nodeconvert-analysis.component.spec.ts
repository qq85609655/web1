import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeconvertAnalysisComponent } from './nodeconvert-analysis.component';

describe('NodeconvertAnalysisComponent', () => {
  let component: NodeconvertAnalysisComponent;
  let fixture: ComponentFixture<NodeconvertAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeconvertAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeconvertAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
