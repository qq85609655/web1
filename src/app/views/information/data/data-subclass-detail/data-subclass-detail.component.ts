import {AfterViewInit, Component, EventEmitter, OnInit} from '@angular/core';
import {BaseComponent} from "../../../../components/base/base.component";
import {BaseService} from "../../../../components/base/base.service";
import {ActivatedRoute} from "@angular/router";

export class DataSubclassDetailComponent extends BaseComponent implements OnInit,AfterViewInit {

  constructor(public _ActivatedRoute: ActivatedRoute) {
    super();
    this.initSourceId(1);
  }

  public sourceId = 1;
  public tableEvent:EventEmitter<any> = new EventEmitter();
  public queryParam = {
    sourceId: 1,
    subclassCode: '',
  };
  public subclassParam = {
    code : '',
    name : '',
    tableName : ''
  };

  public tableOpts= {
    that: this,
    queryMethod: 'get',
    queryUrl: "datastandarditem/querySubclassItemList",
    pageParam: {
      pageNum: 1,
      pageSize: 10
    },//可使用默认值
    isPage: true,//是否分页
    defaultPageSize: 10,
    queryParam: this.queryParam,//页面选择的查询参数，包括树节点id等信息
    bodyParam:{

    },//请求体中的参数
    queryResultField: ['id'],//第一个值指定id的字段名,主要用于修改删除，状态切换
    tableType: 'single',//树类型，simple/checkbox
    theadOptions: [
      {name:'序号', type: 'numberpage'},
      {name:'编号', field: 'itemCode'},
      {name:'数据项名', field: 'itemName'},
      {name:'中文简称', field: 'itemComment'},
      {name:'类型', field: 'dataType'},
      {name:'长度', field: 'dataLength'},
      {name:'主键', field: 'dataPrimarykey'},
      {name:'可否为空', field: 'dataNullable'},
      {name:'约束', field: 'selectable'},
      {name:'取值范围', field: 'dataValueSource'},
      {name:'说明/示例', field: 'dataExplain'},
      {name:'引用管理', field: 'dataReferenced'}
    ],
    selections:[],
    emptyMessage:'暂无数据',
    tableEvent: this.tableEvent
  };


  ngOnInit() {
    this._ActivatedRoute.queryParams.subscribe(params=>{
        this.subclassParam = Object.assign(this.subclassParam, params);
    });
    this.queryParam.subclassCode = this.subclassParam.code;
  }

  ngAfterViewInit(){
    this.flushData();
  }

  flushData() {
    this.tableEvent.emit({flush:true});
  }

  initSourceId(sourceId:number){
    this.sourceId = sourceId;
    this.queryParam.sourceId = sourceId;
  }

  goback(){
    if(this.sourceId == 1) {
      this.getRouter().navigate(["index/CountrySubclass"], {queryParams: {back:true}});
    }else{
      this.getRouter().navigate(["index/school/subclass"], {queryParams: {back:true}});
    }
  }

  getFunctionName(){
    return this.sourceId == 1 ? '数据子类':'数据子类';
  }
  getFunctionParentName(){
    return this.sourceId == 1 ? '国家数据标准':'学校数据标准';
  }
}
