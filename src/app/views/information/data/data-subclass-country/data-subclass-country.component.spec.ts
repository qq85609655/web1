import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSubclassCountryComponent } from './data-subclass-country.component';

describe('DataSubclassCountryComponent', () => {
  let component: DataSubclassCountryComponent;
  let fixture: ComponentFixture<DataSubclassCountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataSubclassCountryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSubclassCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
