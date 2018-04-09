import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeStandardCountryComponent } from './code-standard-country.component';

describe('CodeStandardCountryComponent', () => {
  let component: CodeStandardCountryComponent;
  let fixture: ComponentFixture<CodeStandardCountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeStandardCountryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeStandardCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
