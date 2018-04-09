import { Component, OnInit } from '@angular/core';
import {BzdmComponent} from "../bzdm/bzdm.component";

@Component({
  selector: 'app-gdzt-jsdw',
  templateUrl: '../bzdm/bzdm.component.html',
  styleUrls: ['../bzdm/bzdm.component.css']
})
export class GdztJsdwComponent extends  BzdmComponent implements OnInit {

  constructor() {
    super();
    this.initType(66);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
