import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeStandardComponent } from './code-standard.component';

describe('CodeStandardComponent', () => {
  let component: CodeStandardComponent;
  let fixture: ComponentFixture<CodeStandardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeStandardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
