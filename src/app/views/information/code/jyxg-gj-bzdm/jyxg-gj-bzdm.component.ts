import { Component, OnInit } from '@angular/core';
import {BzdmComponent} from "../bzdm/bzdm.component";

@Component({
  selector: 'app-jyxg-gj-bzdm',
  templateUrl: '../bzdm/bzdm.component.html',
  styleUrls: ['../bzdm/bzdm.component.css']
})
export class JyxgGjBzdmComponent extends  BzdmComponent implements OnInit {

  constructor() {
    super();
    this.initType(3);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
