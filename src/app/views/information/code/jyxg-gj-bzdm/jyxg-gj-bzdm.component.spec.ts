import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JyxgGjBzdmComponent } from './jyxg-gj-bzdm.component';

describe('JyxgGjBzdmComponent', () => {
  let component: JyxgGjBzdmComponent;
  let fixture: ComponentFixture<JyxgGjBzdmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JyxgGjBzdmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JyxgGjBzdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
