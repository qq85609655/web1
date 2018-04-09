import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {BaseComponent} from "../../../components/base/base.component";
import {HttpClient} from "../../../components/http-client.service";


@Component({
  selector: 'app-noderun-watch',
  templateUrl: './noderun-watch.component.html',
  styleUrls: ['./noderun-watch.component.css']
})
export class NoderunWatchComponent extends BaseComponent implements OnInit, OnDestroy {

  constructor(public _Router: Router,
              public _HttpClient: HttpClient) {
    super();
  }

  public treeNode: any;

 /* public statusList = [{label: '全部', value: -1}, {label: '成功', value: 0}, {label: '失败', value: 1}];*/
  public sourceList = [{label: '全部', value: -1},{label: '发布数据资源', value: 1}, {label: '订阅数据资源', value: 2}];

  //树参数
  public treeOpts = {
    that: this,
    queryMethod: 'get',
    expandedIndex: 0,
    queryUrl: "org/orgShowTree",
    queryParam: {},//表示query类型参数，放在?后面。后续如果需要pathParam bodyParam再调整
    functionName: '机构列表',//新增和修改框标题中的功能名称
    queryResultField: ['id', 'parentId', 'orgName', 'children'],//查询结果对象中，需要的字段名称
    treeType: 'single',//树类型，simple/checkbox
    queryDataToTreeData: null,//查询数据转换为树需要的数据
    nodeSelect: this.treeNodeSelect,
    operButton: {}
  };

  public tableEvent: EventEmitter<any> = new EventEmitter();

  public queryParam = {
    orgId: 0,
    orgIds: '',
    orgName: '',
    status: 0,
    busType:-1
  };
  public tableOpts = {
    that: this,
    queryMethod: 'post',
    queryUrl: "nodeStatus/queryList",
    pageParam: {
      pageNum: 1,
      pageSize: 10
    },//可使用默认值
    isPage: true,//是否分页
    defaultPageSize: 10,
    rowsPerPageOptions:[10,30],
    queryParam: {},//页面选择的查询参数，包括树节点id等信息
    bodyParam: this.queryParam,//请求体中的参数
    queryResultField: ['id'],//第一个值指定id的字段名,主要用于修改删除，状态切换
    tableType: 'single',//树类型，simple/checkbox
    isColGroup: false,//是否是混合表头,rowspan colspan大于1
    loading:true,

    theadOptions: [
      {name: '序号', type: 'numberpage'},
      {name: '资源名称', field: 'taskName',title:true},
      {name: '源表', field: 'sourceTableName',title:true,class : {red:(row)=>row.sourceStatus != 1}},
      {name: '目标表', field: 'tagertTableName',title:true,class : {red:(row)=>row.targetStatus != 1}},
      {name: '所属机构', field: 'orgName',title:true},
      {name: '问题描述', field: 'errorInfo',title:true}
    ],
    buttonOptions: [],
    selections: [],
    emptyMessage: '暂无数据',
    tableEvent: this.tableEvent
  };


  /**
   * 树节点点击事件
   * @param node
   */
  treeNodeSelect(node) {
    this.treeNode = node;
    this.queryParam.orgId = node.data.id;
    this.queryParam.orgName = node.data.orgName;
    var orgNodeIds = this.getOrgNodeIds(node.data, true);
    this.queryParam.orgIds = orgNodeIds.join(',');
    this.flushData();
  }

  ngOnInit() {
    this.setMeunId(18);
  }

  flushData() {
    this.tableEvent.emit({flush: true});
  }
}

