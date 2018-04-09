import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpageComponent } from './ppage.component';

describe('PpageComponent', () => {
  let component: PpageComponent;
  let fixture: ComponentFixture<PpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
