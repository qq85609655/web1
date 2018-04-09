import {AfterViewInit, Component, EventEmitter, OnInit} from '@angular/core';
import {BaseComponent} from "../../../../../components/base/base.component";
import {ActivatedRoute} from "@angular/router";

export class DataItemSearchComponent extends BaseComponent implements OnInit,AfterViewInit {

  constructor(public _ActivatedRoute: ActivatedRoute) {
    super();
    this.initSourceId(1);
  }

  public sourceId = 1;
  public treeNode:any;
  public treeQueryParam = {
    sourceId: 1
  };
  public treeOpts = {
    that: this,
    queryMethod: 'get',
    expandedIndex: 0,
    queryUrl: "datastandard/queryDataOrgTree",
    queryParam: this.treeQueryParam,//表示query类型参数，放在?后面。后续如果需要pathParam bodyParam再调整
    functionName: '元数据',//新增和修改框标题中的功能名称
    queryResultField: ['code', 'parentCode', 'name', 'children'],//查询结果对象中，需要的字段名称
    treeType: 'single',//树类型，simple/checkbox
    nodeSelect: this.treeNodeSelect,
    operButton: {},
    usingCache:false,
    treeEvent: new EventEmitter()
  };

  public tableEvent:EventEmitter<any> = new EventEmitter();
  public queryParam = {
    sourceId: 1,
    keyWord: '',
    code: '',
    nodeType: 0
  };
  public queryParam2 = {
    sourceId: 1
  }

  public tableOpts= {
    that: this,
    queryMethod: 'post',
    queryUrl: "datastandarditem/queryItemList",
    pageParam: {
      pageNum: 1,
      pageSize: 10
    },//可使用默认值
    isPage: true,//是否分页
    defaultPageSize: 10,
    queryParam: this.queryParam2,//页面选择的查询参数，包括树节点id等信息
    bodyParam:this.queryParam,//请求体中的参数
    queryResultField: ['code'],//第一个值指定id的字段名,主要用于修改删除，状态切换
    tableType: 'single',//树类型，simple/checkbox
    usingCache: false,

    //混合表头的格式再定义
    //checkbox类型表示当前列显示checkbox
    //number支持俩种类型，//number：12345, numberpage加上页码后的数字：21 22 23...
    //普通的字段可支持link、format， format后续需要再增加实现
    //button表示按钮列，每一列可以多个按钮，根据options指定字段可以给多列都使用按钮
    theadOptions: [
      {name:'编号', field: 'itemCode'},
      {name:'数据项名', field: 'itemName', link: this.linkDataDetail},
      {name:'中文名称', field: 'itemComment'},
      {name:'所属子类', field: 'subclassName'},
      {name:'说明/示例', field: 'dataExplain'},
      {name:'操作', type:'button', buttonOptions: 'buttonOptions'}
    ],
    //callback指定回调的方法，
    //disabled指定按钮是否禁用
    //hidden指定按钮是否隐藏
    //此三个方法参数一样,共俩个，第一个index,第二个当前行item
    buttonOptions:[
      {name:'修改', callback: this.updateData, disabled: null, hidden: null, authcode:'027003'},
      {name:'删除', callback: this.deleteData, disabled: null, hidden: null, authcode:'027004'},
    ],
    selections:[],
    emptyMessage:'暂无数据',
    tableEvent: this.tableEvent
  };

  dialogOpts={
    delete:{
      title: '元数据删除',
      visible:false,
      data: {}
    }
  }

  ngOnInit() {
    this._ActivatedRoute.queryParams.subscribe(params=>{
      if(params.back == "true"){
        this.treeOpts.usingCache = true;
        this.tableOpts.usingCache = true;
      }
    });
  }

  ngAfterViewInit(){}

  flushData() {
    this.tableEvent.emit({flush:true});
  }

  initSourceId(sourceId:number){
    this.sourceId = sourceId;
    this.queryParam.sourceId = sourceId;
    this.queryParam2.sourceId = sourceId;
    this.treeQueryParam.sourceId = sourceId;
  }

  /**
   * 树节点点击事件
   * @param node
   */
  treeNodeSelect(node) {
    this.treeNode = node;
    this.queryParam.code = node.data.code;
    this.queryParam.nodeType = node.data.nodeType;
    this.flushData();
  }

  linkDataDetail(index ,item){
    var queryParams = {
      itemCode : item.itemCode,
      id: item.id
    };
    this.saveSelectToLink(this.treeOpts.treeEvent , this.tableOpts.tableEvent , ()=>{
      if(this.sourceId == 1) {
        this.getRouter().navigate(["index/CountryMeta/detail"], {queryParams: queryParams});
      }else{
        this.getRouter().navigate(["index/school/SchoolMeta/detail"], {queryParams: queryParams});
      }
    });
  }

  addData(){
    if(this.treeNode.data.nodeType != 3){
      this.tipWarnMessage("请选择数据子类节点后新增！");
      return;
    }
    var queryParams = {
      subclassCode: this.treeNode.data.code,
      subclassName: this.treeNode.data.name
    };
    this.saveSelectToLink(this.treeOpts.treeEvent , this.tableOpts.tableEvent , ()=>{
      if(this.sourceId == 1){
        this.getRouter().navigate(["index/CountryMeta/add"], {queryParams: queryParams})
      }else{
        this.getRouter().navigate(["index/school/SchoolMeta/add"], {queryParams: queryParams})
      }
    });

  }

  updateData(index,item){
    var queryParams = {
      itemCode: item.itemCode,
      id: item.id
    };
    this.saveSelectToLink(this.treeOpts.treeEvent , this.tableOpts.tableEvent , ()=>{
      if(this.sourceId == 1){
        this.getRouter().navigate(["index/CountryMeta/edit"], {queryParams: queryParams})
      }else{
        this.getRouter().navigate(["index/school/SchoolMeta/edit"], {queryParams: queryParams})
      }
    });
  }

  deleteData(index,item){
    this.dialogOpts.delete = {
      title: '元数据删除',
      visible:true,
      data: {id: item.id, sourceId : this.sourceId}
    };
  }

  deleteDataOk(){
    var url = "datastandarditem/deleteItemVo";
    this.getHttpClient().get( url, this.dialogOpts.delete.data, (data)=>{
      this.tipMessage("删除" + this.getFunctionName()+"成功!");
      this.flushData();
      this.dialogOpts.delete.visible = false;
    });
  }

  getFunctionName(){
    return this.sourceId == 1 ? '元数据':'元数据';
  }
  getFunctionParentName(){
    return this.sourceId == 1 ? '国家数据标准':'学校数据标准';
  }
}
