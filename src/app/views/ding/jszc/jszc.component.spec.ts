import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JszcComponent } from './jszc.component';

describe('JszcComponent', () => {
  let component: JszcComponent;
  let fixture: ComponentFixture<JszcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JszcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JszcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
