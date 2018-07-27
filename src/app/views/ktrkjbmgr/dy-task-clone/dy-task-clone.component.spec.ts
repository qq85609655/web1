import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DyTaskCloneComponent } from './dy-task-clone.component';

describe('DyTaskCloneComponent', () => {
  let component: DyTaskCloneComponent;
  let fixture: ComponentFixture<DyTaskCloneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DyTaskCloneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DyTaskCloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
