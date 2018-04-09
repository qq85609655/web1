import { Component, OnInit } from '@angular/core';
import {BaseService} from "../../../../components/base/base.service";
import {DataClassComponent} from "../data-class/data-class.component";

@Component({
  selector: 'app-data-class-country',
  templateUrl: '../data-class/data-class.component.html',
  styleUrls: ['../data-class/data-class.component.css']
})
export class DataClassCountryComponent extends DataClassComponent implements OnInit {

  constructor() {
    super();
    this.initSourceId(1);
  }

  ngOnInit() {
  }

}
