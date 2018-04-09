import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XwzxComponent } from './xwzx.component';

describe('XwzxComponent', () => {
  let component: XwzxComponent;
  let fixture: ComponentFixture<XwzxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XwzxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XwzxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
