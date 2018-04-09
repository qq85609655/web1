import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSubclassDetailCountryComponent } from './data-subclass-detail-country.component';

describe('DataSubclassDetailCountryComponent', () => {
  let component: DataSubclassDetailCountryComponent;
  let fixture: ComponentFixture<DataSubclassDetailCountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataSubclassDetailCountryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSubclassDetailCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
