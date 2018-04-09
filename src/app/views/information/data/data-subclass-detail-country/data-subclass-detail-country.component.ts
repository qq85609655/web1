import { Component, OnInit } from '@angular/core';
import {BaseService} from "../../../../components/base/base.service";
import {ActivatedRoute} from "@angular/router";
import {BaseComponent} from "../../../../components/base/base.component";
import {DataSubclassDetailComponent} from "../data-subclass-detail/data-subclass-detail.component";

@Component({
  selector: 'app-data-subclass-detail-country',
  templateUrl: '../data-subclass-detail/data-subclass-detail.component.html',
  styleUrls: ['../data-subclass-detail/data-subclass-detail.component.css']
})
export class DataSubclassDetailCountryComponent extends DataSubclassDetailComponent implements OnInit {

  constructor(public _ActivatedRoute: ActivatedRoute) {
    super(_ActivatedRoute);
    this.initSourceId(1);
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
