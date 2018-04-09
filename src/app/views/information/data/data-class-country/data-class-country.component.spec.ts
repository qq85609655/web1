import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataClassCountryComponent } from './data-class-country.component';

describe('DataClassCountryComponent', () => {
  let component: DataClassCountryComponent;
  let fixture: ComponentFixture<DataClassCountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataClassCountryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataClassCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
