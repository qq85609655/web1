import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GdztBxjfComponent } from './gdzt-bxjf.component';

describe('GdztBxjfComponent', () => {
  let component: GdztBxjfComponent;
  let fixture: ComponentFixture<GdztBxjfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GdztBxjfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdztBxjfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
