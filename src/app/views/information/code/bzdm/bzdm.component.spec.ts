import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BzdmComponent } from './bzdm.component';

describe('BzdmComponent', () => {
  let component: BzdmComponent;
  let fixture: ComponentFixture<BzdmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BzdmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BzdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
