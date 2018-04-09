import { Component, OnInit } from '@angular/core';
import {DataItemInfoComponent} from "../data-item-info/data-item-info.component";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-data-item-info-school',
  templateUrl: '../data-item-info/data-item-info.component.html',
  styleUrls: ['../data-item-info/data-item-info.component.css']
})
export class DataItemInfoSchoolComponent extends DataItemInfoComponent implements OnInit {

  constructor(public _ActivatedRoute: ActivatedRoute) {
    super(_ActivatedRoute);
    this.initSourceIdAndType(2);
  }

  ngOnInit() {
    super.ngOnInit();
  }

}

