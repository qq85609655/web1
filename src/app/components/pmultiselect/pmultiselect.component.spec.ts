import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmultiselectComponent } from './pmultiselect.component';

describe('PmultiselectComponent', () => {
  let component: PmultiselectComponent;
  let fixture: ComponentFixture<PmultiselectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmultiselectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
