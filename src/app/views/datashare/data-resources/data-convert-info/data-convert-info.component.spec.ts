import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataConvertInfoComponent } from './data-convert-info.component';

describe('DataConvertInfoComponent', () => {
  let component: DataConvertInfoComponent;
  let fixture: ComponentFixture<DataConvertInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataConvertInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataConvertInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
