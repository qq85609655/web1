import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GdztYxldComponent } from './gdzt-yxld.component';

describe('GdztYxldComponent', () => {
  let component: GdztYxldComponent;
  let fixture: ComponentFixture<GdztYxldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GdztYxldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdztYxldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
