import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GdztXsxxComponent } from './gdzt-xsxx.component';

describe('GdztXsxxComponent', () => {
  let component: GdztXsxxComponent;
  let fixture: ComponentFixture<GdztXsxxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GdztXsxxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdztXsxxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
