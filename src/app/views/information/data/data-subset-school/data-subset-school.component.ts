import { Component, OnInit } from '@angular/core';
import {BaseService} from "../../../../components/base/base.service";
import {DataSubsetComponent} from "../data-subset/data-subset.component";

@Component({
  selector: 'app-data-subset-school',
  templateUrl: '../data-subset/data-subset.component.html',
  styleUrls: ['../data-subset/data-subset.component.css']
})
export class DataSubsetSchoolComponent extends DataSubsetComponent implements OnInit {

  constructor() {
    super();
    this.initSourceId(2);
  }

  ngOnInit() {
  }

}
