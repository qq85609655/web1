import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainIndexTaskComponent } from './main-index-task.component';

describe('MainIndexTaskComponent', () => {
  let component: MainIndexTaskComponent;
  let fixture: ComponentFixture<MainIndexTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainIndexTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainIndexTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
