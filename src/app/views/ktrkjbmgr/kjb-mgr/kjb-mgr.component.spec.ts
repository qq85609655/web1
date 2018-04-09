import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KjbMgrComponent } from './kjb-mgr.component';

describe('KjbMgrComponent', () => {
  let component: KjbMgrComponent;
  let fixture: ComponentFixture<KjbMgrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KjbMgrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KjbMgrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
