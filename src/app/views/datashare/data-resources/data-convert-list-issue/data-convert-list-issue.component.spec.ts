import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataConvertListIssueComponent } from './data-convert-list-issue.component';

describe('DataConvertListIssueComponent', () => {
  let component: DataConvertListIssueComponent;
  let fixture: ComponentFixture<DataConvertListIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataConvertListIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataConvertListIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
