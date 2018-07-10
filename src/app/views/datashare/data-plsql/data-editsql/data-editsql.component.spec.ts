import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataEditsqlComponent } from './data-editsql.component';

describe('DataEditsqlComponent', () => {
  let component: DataEditsqlComponent;
  let fixture: ComponentFixture<DataEditsqlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataEditsqlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataEditsqlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
