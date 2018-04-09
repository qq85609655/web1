import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataClassSchoolComponent } from './data-class-school.component';

describe('DataClassSchoolComponent', () => {
  let component: DataClassSchoolComponent;
  let fixture: ComponentFixture<DataClassSchoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataClassSchoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataClassSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
