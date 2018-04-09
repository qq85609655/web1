import {Component, EventEmitter, OnDestroy, OnInit,AfterViewInit} from '@angular/core';
import {HttpClient} from "../../../../components/http-client.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BaseComponent} from "../../../../components/base/base.component";

@Component({
  selector: 'app-etl-error-log',
  templateUrl: './etl-error-log.component.html',
  styleUrls: ['./etl-error-log.component.css']
})
export class EtlErrorLogComponent extends BaseComponent implements OnInit, OnDestroy,AfterViewInit {
  constructor(public _Router: Router,
              public _ActivatedRoute: ActivatedRoute,
              public _HttpClient: HttpClient) {
    super();
  }

  public tableEvent: EventEmitter<any> = new EventEmitter();
  public queryParam = {
    channel_id: 0,
    logDt:''
  };


  ngOnInit() {
    this._ActivatedRoute.queryParams.subscribe(params => {
      this.queryParam.channel_id = params.channel_id;
      this.queryParam.logDt = params.logDt;
    });
  }
  ngAfterViewInit(){
    this.flushData();
  }
  goback() {
      this.getRouter().navigate(["/index/runAdmin/etlConvertLog"], {
        queryParams: { back: true }
      });
  }

  public tableOpts = {
    that: this,
    queryMethod: 'get',
    queryUrl: "kettleLog/queryErrorList",
    pageParam: {
      pageNum: 1,
      pageSize: 10
    },//可使用默认值
    isPage: true,//是否分页
    defaultPageSize: 10,
    queryParam: this.queryParam,//页面选择的查询参数，包括树节点id等信息
    bodyParam: {},//请求体中的参数
    queryResultField: ['id'],//第一个值指定id的字段名,主要用于修改删除，状态切换
    tableType: 'single',//树类型，simple/checkbox
    isColGroup: false,//是否是混合表头,rowspan colspan大于1

    theadOptions: [
      {name: '序号', type: 'numberpage'},
      {name: '错误码', field: 'code'},
      {name: '记录时间', field: 'logDt'},
      {name: '错误行的主键值', field: 'pkValue'},
      {name: '错误列', field: 'field'},
      {name: '日志描述', field: 'description',title:true, class:{wrap:true}}
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
