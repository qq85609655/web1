import { Component, OnInit } from '@angular/core';
import {BzdmComponent} from "../bzdm/bzdm.component";

@Component({
  selector: 'app-jyxg-hy-bzdm',
  templateUrl: '../bzdm/bzdm.component.html',
  styleUrls: ['../bzdm/bzdm.component.css']
})
export class JyxgHyBzdmComponent extends  BzdmComponent implements OnInit {


  constructor() {
    super();
    this.initType(4);
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
