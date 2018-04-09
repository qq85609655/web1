import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSubsetSchoolComponent } from './data-subset-school.component';

describe('DataSubsetSchoolComponent', () => {
  let component: DataSubsetSchoolComponent;
  let fixture: ComponentFixture<DataSubsetSchoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataSubsetSchoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSubsetSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
