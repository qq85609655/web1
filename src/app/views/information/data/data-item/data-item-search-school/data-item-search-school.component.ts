import { Component, OnInit } from '@angular/core';
import {DataItemSearchComponent} from "../data-item-search/data-item-search.component";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-data-item-search-school',
  templateUrl: '../data-item-search/data-item-search.component.html',
  styleUrls: ['../data-item-search/data-item-search.component.css']
})
export class DataItemSearchSchoolComponent extends DataItemSearchComponent implements OnInit {

  constructor(public _ActivatedRoute: ActivatedRoute) {
    super(_ActivatedRoute);
    this.initSourceId(2);
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
