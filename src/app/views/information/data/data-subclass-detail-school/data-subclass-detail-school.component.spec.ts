import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSubclassDetailSchoolComponent } from './data-subclass-detail-school.component';

describe('DataSubclassDetailSchoolComponent', () => {
  let component: DataSubclassDetailSchoolComponent;
  let fixture: ComponentFixture<DataSubclassDetailSchoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataSubclassDetailSchoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSubclassDetailSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
