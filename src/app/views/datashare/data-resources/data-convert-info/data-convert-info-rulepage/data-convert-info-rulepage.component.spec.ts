import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataConvertInfoRulepageComponent } from './data-convert-info-rulepage.component';

describe('DataConvertInfoRulepageComponent', () => {
  let component: DataConvertInfoRulepageComponent;
  let fixture: ComponentFixture<DataConvertInfoRulepageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataConvertInfoRulepageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataConvertInfoRulepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
