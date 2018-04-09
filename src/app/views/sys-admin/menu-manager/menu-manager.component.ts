import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '../../../components/http-client.service';
import {BaseComponent} from '../../../components/base/base.component';

@Component({
  selector: 'app-menu-manager',
  templateUrl: './menu-manager.component.html',
  styleUrls: ['./menu-manager.component.css']
})
export class MenuManagerComponent extends BaseComponent implements OnInit, OnDestroy {

  constructor(public _Router: Router, public _HttpClient: HttpClient, public _ActivatedRoute: ActivatedRoute) {
    super();
  }

  public tableEvent: EventEmitter<any> = new EventEmitter();
  public queryParam = {
    menuName: ''
  };


  ngOnInit() {

  }


  ngAfterViewInit() {
    this.flushData();
  }


  public tableOpts = {
    that: this,
    queryMethod: 'post',
    queryUrl: 'menu/queryList',
    pageParam: {
      pageNum: 1,
      pageSize: 10
    }, //可使用默认值
    isPage: true, //是否分页
    defaultPageSize: 10,
    queryParam: {}, //页面选择的查询参数，包括树节点id等信息
    bodyParam: this.queryParam, //请求体中的参数
    queryResultField: ['menuId'], //第一个值指定id的字段名,主要用于修改删除，状态切换
    tableType: 'single', //树类型，simple/checkbox
    theadOptions: [
      {name: '序号', type: 'numberpage'},
      {name: '菜单名称', field: 'menuName', title: true},
      {name: '路径', field: 'url', title: true},
      {name: '权限码', field: 'authCode', title: true},
      {name: '描述', field: 'remark', title: true},
      {name: '操作', type: 'button', buttonOptions: 'buttonOptions'}
    ],
    buttonOptions: [],
    selections: [],
    emptyMessage: '暂无数据',
    tableEvent: this.tableEvent
  };

  flushData() {
    this.tableEvent.emit({flush: true});
  }

}
