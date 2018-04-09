import { Component, OnInit } from '@angular/core';
import {CodeStandardComponent} from "../code-standard/code-standard.component";

@Component({
  selector: 'app-code-standard-school',
  templateUrl: '../code-standard/code-standard.component.html',
  styleUrls: ['../code-standard/code-standard.component.css']
})
export class CodeStandardSchoolComponent extends CodeStandardComponent implements OnInit {

  constructor() {
    super();
    this.initSourceId(2);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
