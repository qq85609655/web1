import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataItemSearchComponent } from './data-item-search.component';

describe('DataItemSearchComponent', () => {
  let component: DataItemSearchComponent;
  let fixture: ComponentFixture<DataItemSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataItemSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataItemSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
