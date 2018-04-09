import {Component, Input, OnInit} from '@angular/core';
import {DataConvertInfoComponent} from "../data-convert-info.component";

@Component({
  selector: 'app-data-convert-info-rulepage',
  templateUrl: './data-convert-info-rulepage.component.html',
  styleUrls: ['./data-convert-info-rulepage.component.css']
})
export class DataConvertInfoRulepageComponent implements OnInit {

  @Input() public rule: any;
  @Input() public parentComponent: DataConvertInfoComponent;
  public stepNameLength = 10;
  constructor() { }

  ngOnInit() {

  }

  onRuleClose(){
    this.parentComponent.onRuleClose();
  }
}
