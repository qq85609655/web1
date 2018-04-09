import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GdztJbxxComponent } from './gdzt-jbxx.component';

describe('GdztJbxxComponent', () => {
  let component: GdztJbxxComponent;
  let fixture: ComponentFixture<GdztJbxxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GdztJbxxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdztJbxxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
