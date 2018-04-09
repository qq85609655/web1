import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataItemSearchCountryComponent } from './data-item-search-country.component';

describe('DataItemSearchCountryComponent', () => {
  let component: DataItemSearchCountryComponent;
  let fixture: ComponentFixture<DataItemSearchCountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataItemSearchCountryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataItemSearchCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
