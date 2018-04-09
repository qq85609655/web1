import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataItemTestComponent } from './data-item-test.component';

describe('DataItemTestComponent', () => {
  let component: DataItemTestComponent;
  let fixture: ComponentFixture<DataItemTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataItemTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataItemTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
