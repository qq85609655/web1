import { Component, OnInit } from '@angular/core';
import {BzdmComponent} from "../bzdm/bzdm.component";

@Component({
  selector: 'app-gdzt-yxld',
  templateUrl: '../bzdm/bzdm.component.html',
  styleUrls: ['../bzdm/bzdm.component.css']
})
export class GdztYxldComponent extends  BzdmComponent implements OnInit {

  constructor() {
    super();
    this.initType(62);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
