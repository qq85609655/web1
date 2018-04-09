import { Component, OnInit } from '@angular/core';
import {DataSubclassDetailComponent} from "../data-subclass-detail/data-subclass-detail.component";
import {ActivatedRoute} from "@angular/router";
import {BaseService} from "../../../../components/base/base.service";

@Component({
  selector: 'app-data-subclass-detail-school',
  templateUrl: '../data-subclass-detail/data-subclass-detail.component.html',
  styleUrls: ['../data-subclass-detail/data-subclass-detail.component.css']
})
export class DataSubclassDetailSchoolComponent extends DataSubclassDetailComponent implements OnInit {

  constructor(public _ActivatedRoute: ActivatedRoute) {
    super(_ActivatedRoute);
    this.initSourceId(2);
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
