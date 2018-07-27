import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FbTaskCloneComponent } from './fb-task-clone.component';

describe('FbTaskCloneComponent', () => {
  let component: FbTaskCloneComponent;
  let fixture: ComponentFixture<FbTaskCloneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FbTaskCloneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FbTaskCloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
