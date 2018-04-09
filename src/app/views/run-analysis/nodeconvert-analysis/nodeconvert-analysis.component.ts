import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {BaseService} from "../../../components/base/base.service";
import {BaseComponent} from "../../../components/base/base.component";
import {Router} from "@angular/router";
import {HttpClient} from "../../../components/http-client.service";

@Component({
  selector: 'app-nodeconvert-analysis',
  templateUrl: './nodeconvert-analysis.component.html',
  styleUrls: ['./nodeconvert-analysis.component.css']
})
export class NodeconvertAnalysisComponent extends BaseComponent implements OnInit, OnDestroy {
  constructor(
              public _Router: Router,
              public _HttpClient: HttpClient) {
    super();
  }

  public treeNode: any;


  public startTime: Date;
  public endTime: Date;

  //树参数
  public treeOpts = {
    that: this,
    queryMethod: 'get',
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
    operRes: 0,
    keyWord: '',
    operModuleId: 99,
    startTime: '',
    endTime: '',
    orgId: 0,
    orgIds: ''
  };
  public tableOpts = {
    that: this,
    queryMethod: 'get',
    queryUrl: "kettleLog/queryList",
    pageParam: {
      pageNum: 1,
      pageSize: 10
    },//可使用默认值
    isPage: true,//是否分页
    defaultPageSize: 10,
    queryParam: this.queryParam,//页面选择的查询参数，包括树节点id等信息
    bodyParam: {},//请求体中的参数
    queryResultField: ['userId'],//第一个值指定id的字段名,主要用于修改删除，状态切换
    tableType: 'single',//树类型，simple/checkbox
    isColGroup: false,//是否是混合表头,rowspan colspan大于1

    theadOptions: [
      { name: '编号', type: 'numberpage' },
      { name: '数据资源名称', field: 'mappingName', link: '' },
      { name: '所在部门', field: 'orgName', link: '' },
      { name: '转换总数', field: 'convertCount', link: '' },
      { name: '失败数量', field: 'failCount', link: '' },
      { name: '记录时间', field: 'recordTime', link: '' },
      { name: '错误描述', field: 'errorRemark', link: '' }
    ],
    buttonOptions: [
    ],
    selections: [],
    emptyMessage: '暂无数据',
    tableEvent: this.tableEvent
  };


  flushData() {
    this.tableEvent.emit({ flush: true });
  }
  /**
   * 树节点点击事件
   * @param node
   */
  treeNodeSelect(node) {
    this.treeNode = node;
    this.queryParam.orgId = node.data.id;
    var orgNodeIds = this.getOrgNodeIds(node.data, true);
    this.queryParam.orgIds = orgNodeIds.join(',');
    this.flushData();
  }

  ngOnInit() {
  }

}
