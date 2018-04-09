import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataHelpInfoComponent } from './data-help-info.component';

describe('DataHelpInfoComponent', () => {
  let component: DataHelpInfoComponent;
  let fixture: ComponentFixture<DataHelpInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataHelpInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataHelpInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
