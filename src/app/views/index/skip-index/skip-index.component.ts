import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-skip-index',
  templateUrl: './skip-index.component.html',
  styleUrls: ['./skip-index.component.css']
})
export class SkipIndexComponent implements OnInit {
  error = '';
  constructor(public _Router: Router,
              public _ActivatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this._ActivatedRoute.queryParams.subscribe(params => {
      if(params && params.link && params.link.length >0){
        let params2 = Object.assign({}, params);
        delete params2.link;
        setTimeout(() => {
          this._Router.navigate(params.link, {queryParams: params2});
        },1);
      }else{
        this.error = "路由地址不存在，请检查！";
      }
    });
  }
}
