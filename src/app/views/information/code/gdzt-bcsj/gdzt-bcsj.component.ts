import { Component, OnInit } from '@angular/core';
import {BzdmComponent} from "../bzdm/bzdm.component";

@Component({
  selector: 'app-gdzt-bcsj',
  templateUrl: '../bzdm/bzdm.component.html',
  styleUrls: ['../bzdm/bzdm.component.css']
})
export class GdztBcsjComponent  extends  BzdmComponent implements OnInit {

  constructor() {
    super();
    this.initType(71);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
