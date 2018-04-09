import { Component, OnInit } from '@angular/core';
import {DataConvertInfoComponent} from "../data-convert-info/data-convert-info.component";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-data-convert-info-subscribe',
  templateUrl: '../data-convert-info/data-convert-info.component.html',
  styleUrls: ['../data-convert-info/data-convert-info.component.css']
})
export class DataConvertInfoSubscribeComponent extends DataConvertInfoComponent implements OnInit {

  constructor(public _ActivatedRoute: ActivatedRoute) {
    super(_ActivatedRoute)
    this.setBusinessType(2);
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
