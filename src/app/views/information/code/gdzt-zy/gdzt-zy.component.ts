import { Component, OnInit } from '@angular/core';
import {BzdmComponent} from "../bzdm/bzdm.component";

@Component({
  selector: 'app-gdzt-zy',
  templateUrl: '../bzdm/bzdm.component.html',
  styleUrls: ['../bzdm/bzdm.component.css']
})
export class GdztZyComponent extends  BzdmComponent implements OnInit {

  constructor() {
    super();
    this.initType(67);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
