import { Component, OnInit } from '@angular/core';
import {DataItemInfoComponent} from "../data-item-info/data-item-info.component";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-data-item-info-country',
  templateUrl: '../data-item-info/data-item-info.component.html',
  styleUrls: ['../data-item-info/data-item-info.component.css']
})
export class DataItemInfoCountryComponent extends DataItemInfoComponent implements OnInit {

  constructor(public _ActivatedRoute: ActivatedRoute) {
    super(_ActivatedRoute);
    this.initSourceIdAndType(1);
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
