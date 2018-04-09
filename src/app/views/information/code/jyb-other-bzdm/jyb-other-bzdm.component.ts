import { Component, OnInit } from '@angular/core';
import {BzdmComponent} from "../bzdm/bzdm.component";

@Component({
  selector: 'app-jyb-other-bzdm',
  templateUrl: '../bzdm/bzdm.component.html',
  styleUrls: ['../bzdm/bzdm.component.css']
})
export class JybOtherBzdmComponent extends  BzdmComponent implements OnInit {

  constructor() {
    super();
    this.initType(5);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
