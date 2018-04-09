import { Component, OnInit } from '@angular/core';
import {BzdmComponent} from "../bzdm/bzdm.component";

@Component({
  selector: 'app-gdzt-jxglyjxyj',
  templateUrl: '../bzdm/bzdm.component.html',
  styleUrls: ['../bzdm/bzdm.component.css']
})
export class GdztJxglyjxyjComponent extends  BzdmComponent implements OnInit {

  constructor() {
    super();
    this.initType(68);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
