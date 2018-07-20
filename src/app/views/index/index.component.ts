import {Component, OnInit} from '@angular/core';
import {BrowserModule} from "@angular/platform-browser";
import {SystemInfoService} from "./system-info.service";
//import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {


  constructor(public _SystemInfoService: SystemInfoService) {

  }
  public userInfo:any ={
    userId:""
  };
  ngOnInit() {
    this.userInfo = this._SystemInfoService.getUserInfo();
    this._SystemInfoService.initUserInfo();
  }
}
