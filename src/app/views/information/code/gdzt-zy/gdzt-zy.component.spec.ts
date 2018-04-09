import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GdztZyComponent } from './gdzt-zy.component';

describe('GdztZyComponent', () => {
  let component: GdztZyComponent;
  let fixture: ComponentFixture<GdztZyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GdztZyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdztZyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
