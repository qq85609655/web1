import { Component, OnInit } from '@angular/core';
import {BzdmComponent} from "../bzdm/bzdm.component";

@Component({
  selector: 'app-jy-bzdm',
  templateUrl: '../bzdm/bzdm.component.html',
  styleUrls: ['../bzdm/bzdm.component.css']
})
export class JyBzdmComponent extends BzdmComponent implements OnInit {
  constructor() {
    super();
    this.initType(1)
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
