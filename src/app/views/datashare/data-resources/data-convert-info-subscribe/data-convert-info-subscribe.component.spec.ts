import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataConvertInfoSubscribeComponent } from './data-convert-info-subscribe.component';

describe('DataConvertInfoSubscribeComponent', () => {
  let component: DataConvertInfoSubscribeComponent;
  let fixture: ComponentFixture<DataConvertInfoSubscribeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataConvertInfoSubscribeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataConvertInfoSubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
