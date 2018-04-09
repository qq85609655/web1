import { Component, OnInit } from '@angular/core';
import {CodeStandardComponent} from "../code-standard/code-standard.component";

@Component({
  selector: 'app-code-standard-country',
  templateUrl: '../code-standard/code-standard.component.html',
  styleUrls: ['../code-standard/code-standard.component.css']
})
export class CodeStandardCountryComponent extends CodeStandardComponent implements OnInit {

  constructor() {
    super();
    this.initSourceId(1);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
