import { Component, OnInit } from '@angular/core';
import {BzdmComponent} from "../bzdm/bzdm.component";

@Component({
  selector: 'app-gbt-code-standard',
  templateUrl: '../bzdm/bzdm.component.html',
  styleUrls: ['../bzdm/bzdm.component.css']
})
export class GBTCodeStandardComponent extends  BzdmComponent implements OnInit {

  constructor() {
    super();
    this.initType(2);
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
