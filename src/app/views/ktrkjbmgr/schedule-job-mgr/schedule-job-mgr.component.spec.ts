import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleJobMgrComponent } from './schedule-job-mgr.component';

describe('ScheduleJobMgrComponent', () => {
  let component: ScheduleJobMgrComponent;
  let fixture: ComponentFixture<ScheduleJobMgrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleJobMgrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleJobMgrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
