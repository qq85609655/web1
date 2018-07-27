import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCloneComponent } from './task-clone.component';

describe('TaskCloneComponent', () => {
  let component: TaskCloneComponent;
  let fixture: ComponentFixture<TaskCloneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskCloneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
