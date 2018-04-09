import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgManagerComponent } from './org-manager.component';

describe('OrgManagerComponent', () => {
  let component: OrgManagerComponent;
  let fixture: ComponentFixture<OrgManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
