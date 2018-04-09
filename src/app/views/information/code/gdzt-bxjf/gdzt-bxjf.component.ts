import { Component, OnInit } from '@angular/core';
import {BzdmComponent} from "../bzdm/bzdm.component";

@Component({
  selector: 'app-gdzt-bxjf',
  templateUrl: '../bzdm/bzdm.component.html',
  styleUrls: ['../bzdm/bzdm.component.css']
})
export class GdztBxjfComponent extends  BzdmComponent implements OnInit {

  constructor() {
    super();
    this.initType(65);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
