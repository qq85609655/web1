import { Component, OnInit } from '@angular/core';
import {DataSubclassComponent} from "../data-subclass/data-subclass.component";
import {BaseService} from "../../../../components/base/base.service";

@Component({
  selector: 'app-data-subclass-country',
  templateUrl: '../data-subclass/data-subclass.component.html',
  styleUrls: ['../data-subclass/data-subclass.component.css']
})
export class DataSubclassCountryComponent extends DataSubclassComponent implements OnInit {

  constructor() {
    super();
    this.initSourceId(1);
  }

  ngOnInit() {
  }

}
