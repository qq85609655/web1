import { Component, OnInit } from '@angular/core';
import {BzdmComponent} from "../bzdm/bzdm.component";

@Component({
  selector: 'app-gdzt-xsxx',
  templateUrl: '../bzdm/bzdm.component.html',
  styleUrls: ['../bzdm/bzdm.component.css']
})
export class GdztXsxxComponent extends  BzdmComponent implements OnInit {

  constructor() {
    super();
    this.initType(70);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
