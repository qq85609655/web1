import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataItemInfoCountryComponent } from './data-item-info-country.component';

describe('DataItemInfoCountryComponent', () => {
  let component: DataItemInfoCountryComponent;
  let fixture: ComponentFixture<DataItemInfoCountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataItemInfoCountryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataItemInfoCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
