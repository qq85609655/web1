import { Component, OnInit } from '@angular/core';
import {BzdmComponent} from "../bzdm/bzdm.component";

@Component({
  selector: 'app-gdzt-jbxx',
  templateUrl: '../bzdm/bzdm.component.html',
  styleUrls: ['../bzdm/bzdm.component.css']
})
export class GdztJbxxComponent extends  BzdmComponent implements OnInit {

  constructor() {
    super();
    this.initType(61);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
