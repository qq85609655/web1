import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtlLogComponent } from './etl-log.component';

describe('EtlLogComponent', () => {
  let component: EtlLogComponent;
  let fixture: ComponentFixture<EtlLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtlLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtlLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
