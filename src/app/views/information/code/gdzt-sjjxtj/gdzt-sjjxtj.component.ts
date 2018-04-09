import { Component, OnInit } from '@angular/core';
import {BzdmComponent} from "../bzdm/bzdm.component";

@Component({
  selector: 'app-gdzt-sjjxtj',
  templateUrl: '../bzdm/bzdm.component.html',
  styleUrls: ['../bzdm/bzdm.component.css']
})
export class GdztSjjxtjComponent extends  BzdmComponent implements OnInit {

  constructor() {
    super();
    this.initType(64);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
