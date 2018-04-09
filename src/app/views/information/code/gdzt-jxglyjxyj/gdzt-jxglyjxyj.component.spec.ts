import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GdztJxglyjxyjComponent } from './gdzt-jxglyjxyj.component';

describe('GdztJxglyjxyjComponent', () => {
  let component: GdztJxglyjxyjComponent;
  let fixture: ComponentFixture<GdztJxglyjxyjComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GdztJxglyjxyjComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdztJxglyjxyjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
