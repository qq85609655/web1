import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtlPushComponent } from './etl-push.component';

describe('EtlPushComponent', () => {
  let component: EtlPushComponent;
  let fixture: ComponentFixture<EtlPushComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtlPushComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtlPushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
