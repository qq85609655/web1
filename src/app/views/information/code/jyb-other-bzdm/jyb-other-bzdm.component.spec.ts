import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JybOtherBzdmComponent } from './jyb-other-bzdm.component';

describe('JybOtherBzdmComponent', () => {
  let component: JybOtherBzdmComponent;
  let fixture: ComponentFixture<JybOtherBzdmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JybOtherBzdmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JybOtherBzdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
