import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GdztJsdwComponent } from './gdzt-jsdw.component';

describe('GdztJsdwComponent', () => {
  let component: GdztJsdwComponent;
  let fixture: ComponentFixture<GdztJsdwComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GdztJsdwComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdztJsdwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
