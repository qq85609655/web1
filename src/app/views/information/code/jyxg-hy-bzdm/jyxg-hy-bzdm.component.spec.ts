import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JyxgHyBzdmComponent } from './jyxg-hy-bzdm.component';

describe('JyxgHyBzdmComponent', () => {
  let component: JyxgHyBzdmComponent;
  let fixture: ComponentFixture<JyxgHyBzdmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JyxgHyBzdmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JyxgHyBzdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
