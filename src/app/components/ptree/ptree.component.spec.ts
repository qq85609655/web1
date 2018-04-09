import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PtreeComponent } from './ptree.component';

describe('PtreeComponent', () => {
  let component: PtreeComponent;
  let fixture: ComponentFixture<PtreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PtreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PtreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
