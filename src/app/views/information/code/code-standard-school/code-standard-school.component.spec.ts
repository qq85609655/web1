import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeStandardSchoolComponent } from './code-standard-school.component';

describe('CodeStandardSchoolComponent', () => {
  let component: CodeStandardSchoolComponent;
  let fixture: ComponentFixture<CodeStandardSchoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeStandardSchoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeStandardSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
