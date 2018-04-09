import { Component, OnInit } from '@angular/core';
import {BzdmComponent} from "../bzdm/bzdm.component";

@Component({
  selector: 'app-gdzt-shpj',
  templateUrl: '../bzdm/bzdm.component.html',
  styleUrls: ['../bzdm/bzdm.component.css']
})
export class GdztShpjComponent extends  BzdmComponent implements OnInit {

  constructor() {
    super();
    this.initType(69);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
