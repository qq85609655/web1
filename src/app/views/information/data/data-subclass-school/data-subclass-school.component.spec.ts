import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSubclassSchoolComponent } from './data-subclass-school.component';

describe('DataSubclassSchoolComponent', () => {
  let component: DataSubclassSchoolComponent;
  let fixture: ComponentFixture<DataSubclassSchoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataSubclassSchoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSubclassSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
