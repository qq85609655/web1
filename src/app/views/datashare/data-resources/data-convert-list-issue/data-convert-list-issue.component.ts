import { Component, OnInit } from '@angular/core';
import {DataConvertListComponent} from "../data-convert-list/data-convert-list.component";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "../../../../components/http-client.service";

@Component({
  selector: 'app-data-convert-list-issue',
  templateUrl: '../data-convert-list/data-convert-list.component.html',
  styleUrls: ['../data-convert-list/data-convert-list.component.css']
})
export class DataConvertListIssueComponent extends DataConvertListComponent implements OnInit {

  constructor(public _ActivatedRoute: ActivatedRoute,
              public _Router: Router,
              public _HttpClient: HttpClient) {
    super(_ActivatedRoute, _Router, _HttpClient);
    super.setBusinessType(1);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
