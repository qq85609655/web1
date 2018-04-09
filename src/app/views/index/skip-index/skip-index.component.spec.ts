import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkipIndexComponent } from './skip-index.component';

describe('SkipIndexComponent', () => {
  let component: SkipIndexComponent;
  let fixture: ComponentFixture<SkipIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkipIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkipIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
