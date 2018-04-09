import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GdztJbbxtjComponent } from './gdzt-jbbxtj.component';

describe('GdztJbbxtjComponent', () => {
  let component: GdztJbbxtjComponent;
  let fixture: ComponentFixture<GdztJbbxtjComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GdztJbbxtjComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdztJbbxtjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
