import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GdztSjjxtjComponent } from './gdzt-sjjxtj.component';

describe('GdztSjjxtjComponent', () => {
  let component: GdztSjjxtjComponent;
  let fixture: ComponentFixture<GdztSjjxtjComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GdztSjjxtjComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdztSjjxtjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
