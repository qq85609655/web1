import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpzxComponent } from './cpzx.component';

describe('CpzxComponent', () => {
  let component: CpzxComponent;
  let fixture: ComponentFixture<CpzxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpzxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpzxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
