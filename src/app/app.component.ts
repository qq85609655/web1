import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {BaseService} from "./components/base/base.service";
declare var $: any;
@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  // selector 选择器 //template 模板 //styleUrls 模板样式，
 //  template: '<router-outlet></router-outlet><a routerLink="/heroes" >Heroes</a>',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // 控制器，数据绑定 让模板和控制器联系起来
  title = 'hello angular!';
  constructor( public  router: Router,public _BaseService:BaseService) {}
  toheroes() {
    this.router.navigate(['/index']);
  }
}
