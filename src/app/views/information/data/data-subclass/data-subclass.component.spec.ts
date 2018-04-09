import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSubclassComponent } from './data-subclass.component';

describe('DataSubclassComponent', () => {
  let component: DataSubclassComponent;
  let fixture: ComponentFixture<DataSubclassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataSubclassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSubclassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
