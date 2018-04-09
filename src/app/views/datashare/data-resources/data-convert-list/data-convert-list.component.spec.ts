import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataConvertListComponent } from './data-convert-list.component';

describe('DataConvertListComponent', () => {
  let component: DataConvertListComponent;
  let fixture: ComponentFixture<DataConvertListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataConvertListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataConvertListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
