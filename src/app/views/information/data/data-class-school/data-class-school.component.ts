import { Component, OnInit } from '@angular/core';
import {DataClassComponent} from "../data-class/data-class.component";
import {BaseService} from "../../../../components/base/base.service";

@Component({
  selector: 'app-data-class-school',
  templateUrl: '../data-class/data-class.component.html',
  styleUrls: ['../data-class/data-class.component.css']
})
export class DataClassSchoolComponent extends DataClassComponent implements OnInit {

  constructor() {
    super();
    this.initSourceId(2);
  }

  ngOnInit() {
  }

}
