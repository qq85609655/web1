import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobMgrComponent } from './job-mgr.component';

describe('JobMgrComponent', () => {
  let component: JobMgrComponent;
  let fixture: ComponentFixture<JobMgrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobMgrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobMgrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
