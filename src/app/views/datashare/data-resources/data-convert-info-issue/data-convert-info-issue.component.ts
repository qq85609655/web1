import { Component, OnInit } from '@angular/core';
import {DataConvertInfoComponent} from "../data-convert-info/data-convert-info.component";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-data-convert-info-issue',
  templateUrl: '../data-convert-info/data-convert-info.component.html',
  styleUrls: ['../data-convert-info/data-convert-info.component.css']
})
export class DataConvertInfoIssueComponent extends DataConvertInfoComponent implements OnInit {

  constructor(public _ActivatedRoute: ActivatedRoute) {
    super(_ActivatedRoute)
    this.setBusinessType(1);
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
