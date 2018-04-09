import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JyBzdmComponent } from './jy-bzdm.component';

describe('JyBzdmComponent', () => {
  let component: JyBzdmComponent;
  let fixture: ComponentFixture<JyBzdmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JyBzdmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JyBzdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
