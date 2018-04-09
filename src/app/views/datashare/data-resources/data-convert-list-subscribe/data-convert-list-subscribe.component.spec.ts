import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataConvertListSubscribeComponent } from './data-convert-list-subscribe.component';

describe('DataConvertListSubscribeComponent', () => {
  let component: DataConvertListSubscribeComponent;
  let fixture: ComponentFixture<DataConvertListSubscribeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataConvertListSubscribeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataConvertListSubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
