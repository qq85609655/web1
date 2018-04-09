import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QyfcComponent } from './qyfc.component';

describe('QyfcComponent', () => {
  let component: QyfcComponent;
  let fixture: ComponentFixture<QyfcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QyfcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QyfcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
