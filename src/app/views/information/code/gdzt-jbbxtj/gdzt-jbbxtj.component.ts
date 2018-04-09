import { Component, OnInit } from '@angular/core';
import {BzdmComponent} from "../bzdm/bzdm.component";

@Component({
  selector: 'app-gdzt-jbbxtj',
  templateUrl: '../bzdm/bzdm.component.html',
  styleUrls: ['../bzdm/bzdm.component.css']
})
export class GdztJbbxtjComponent  extends  BzdmComponent implements OnInit {

  constructor() {
    super();
    this.initType(63);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}

