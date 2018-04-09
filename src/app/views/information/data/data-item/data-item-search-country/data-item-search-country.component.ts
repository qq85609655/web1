import { Component, OnInit } from '@angular/core';
import {DataItemSearchComponent} from "../data-item-search/data-item-search.component";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-data-item-search-country',
  templateUrl: '../data-item-search/data-item-search.component.html',
  styleUrls: ['../data-item-search/data-item-search.component.css']
})
export class DataItemSearchCountryComponent extends DataItemSearchComponent implements OnInit {

  constructor(public _ActivatedRoute: ActivatedRoute) {
    super(_ActivatedRoute);
    this.initSourceId(1);
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
