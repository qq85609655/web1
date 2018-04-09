import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GywmComponent } from './gywm.component';

describe('GywmComponent', () => {
  let component: GywmComponent;
  let fixture: ComponentFixture<GywmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GywmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GywmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
