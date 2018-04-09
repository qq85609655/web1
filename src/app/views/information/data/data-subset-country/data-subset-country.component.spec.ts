import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSubsetCountryComponent } from './data-subset-country.component';

describe('DataSubsetCountryComponent', () => {
  let component: DataSubsetCountryComponent;
  let fixture: ComponentFixture<DataSubsetCountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataSubsetCountryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSubsetCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
