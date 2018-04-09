import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataItemInfoSchoolComponent } from './data-item-info-school.component';

describe('DataItemInfoSchoolComponent', () => {
  let component: DataItemInfoSchoolComponent;
  let fixture: ComponentFixture<DataItemInfoSchoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataItemInfoSchoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataItemInfoSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
