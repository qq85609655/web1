import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogLoginLogSearchComponent } from './log-login-log-search.component';

describe('LogLoginLogSearchComponent', () => {
  let component: LogLoginLogSearchComponent;
  let fixture: ComponentFixture<LogLoginLogSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogLoginLogSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogLoginLogSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
