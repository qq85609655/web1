import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataItemSearchSchoolComponent } from './data-item-search-school.component';

describe('DataItemSearchSchoolComponent', () => {
  let component: DataItemSearchSchoolComponent;
  let fixture: ComponentFixture<DataItemSearchSchoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataItemSearchSchoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataItemSearchSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
