import { Component, OnInit } from '@angular/core';
import {DataSubsetComponent} from "../data-subset/data-subset.component";
import {BaseService} from "../../../../components/base/base.service";

@Component({
  selector: 'app-data-subset-country',
  templateUrl: '../data-subset/data-subset.component.html',
  styleUrls: ['../data-subset/data-subset.component.css']
})
export class DataSubsetCountryComponent extends DataSubsetComponent implements OnInit {

  constructor() {
    super();
    this.initSourceId(1);
  }

  ngOnInit() {

  }

}
