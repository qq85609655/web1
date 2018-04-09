import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GBTCodeStandardComponent } from './gbt-code-standard.component';

describe('GBTCodeStandardComponent', () => {
  let component: GBTCodeStandardComponent;
  let fixture: ComponentFixture<GBTCodeStandardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GBTCodeStandardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GBTCodeStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
