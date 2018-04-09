import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KtrMgrComponent } from './ktr-mgr.component';

describe('KtrMgrComponent', () => {
  let component: KtrMgrComponent;
  let fixture: ComponentFixture<KtrMgrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KtrMgrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KtrMgrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
