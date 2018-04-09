import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataConvertInfoIssueComponent } from './data-convert-info-issue.component';

describe('DataConvertInfoIssueComponent', () => {
  let component: DataConvertInfoIssueComponent;
  let fixture: ComponentFixture<DataConvertInfoIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataConvertInfoIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataConvertInfoIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
