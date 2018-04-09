import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataItemInfoComponent } from './data-item-info.component';

describe('DataItemInfoComponent', () => {
  let component: DataItemInfoComponent;
  let fixture: ComponentFixture<DataItemInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataItemInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataItemInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
