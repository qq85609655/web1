import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtlErrorLogComponent } from './etl-error-log.component';

describe('EtlErrorLogComponent', () => {
  let component: EtlErrorLogComponent;
  let fixture: ComponentFixture<EtlErrorLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtlErrorLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtlErrorLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
