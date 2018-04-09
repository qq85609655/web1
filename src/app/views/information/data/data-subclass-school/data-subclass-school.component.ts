import { Component, OnInit } from '@angular/core';
import {BaseService} from "../../../../components/base/base.service";
import {DataSubclassComponent} from "../data-subclass/data-subclass.component";

@Component({
  selector: 'app-data-subclass-school',
  templateUrl: '../data-subclass/data-subclass.component.html',
  styleUrls: ['../data-subclass/data-subclass.component.css']
})
export class DataSubclassSchoolComponent extends DataSubclassComponent implements OnInit {

  constructor() {
    super();
    this.initSourceId(2);
  }

  ngOnInit() {
  }

}
