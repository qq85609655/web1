import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogOperLogSearchComponent } from './log-oper-log-search.component';

describe('LogOperLogSearchComponent', () => {
  let component: LogOperLogSearchComponent;
  let fixture: ComponentFixture<LogOperLogSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogOperLogSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogOperLogSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
