import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GdztBcsjComponent } from './gdzt-bcsj.component';

describe('GdztBcsjComponent', () => {
  let component: GdztBcsjComponent;
  let fixture: ComponentFixture<GdztBcsjComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GdztBcsjComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdztBcsjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
