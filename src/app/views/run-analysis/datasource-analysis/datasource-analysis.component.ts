import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {BaseComponent} from "../../../components/base/base.component";
import {BaseService} from "../../../components/base/base.service";
import {Router} from "@angular/router";
import {HttpClient} from "../../../components/http-client.service";

@Component({
  selector: 'app-datasource-analysis',
  templateUrl: './datasource-analysis.component.html',
  styleUrls: ['./datasource-analysis.component.css']
})
export class DatasourceAnalysisComponent  extends BaseComponent implements OnInit, OnDestroy {

  public tableEvent: EventEmitter<any> = new EventEmitter();

  constructor(
              public _Router: Router,
              public _HttpClient: HttpClient) {
    super();
  }


  public startTime: Date;
  public endTime: Date;
  public treeNode: any;


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

  public queryParam = {
    operRes: 0,
    keyWord: '',
    operModuleId: 99,
    startTime: '',
    endTime: '',
    orgId: 0
  };
  public tableOpts = {
    that: this,
    queryMethod: 'get',
    queryUrl: "log/queryList",
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

    //混合表头的格式再定义
    //checkbox类型表示当前列显示checkbox
    //number支持俩种类型，//number：12345, numberpage加上页码后的数字：21 22 23...
    //普通的字段可支持link、format， format后续需要再增加实现
    //button表示按钮列，每一列可以多个按钮，根据options指定字段可以给多列都使用按钮
    theadOptions: [
      {name: '序号', type: 'numberpage'},
      {name: '用户编号', field: 'userNo', link: ''},
      {name: '真实姓名', field: 'realName', link: ''},
      {name: '所在部门', field: 'orgName', link: ''},
      {name: '操作类型', field: 'operType', link: ''},
      {name: '日志类型', field: 'operRes', link: ''},
      {name: '操作日志描述', field: 'operObject', link: ''},
      {name: 'IP地址', field: 'operIp', link: ''},
      {name: '记录时间', field: 'operTime', link: ''}
    ],
    //callback指定回调的方法，
    //disabled指定按钮是否禁用
    //hidden指定按钮是否隐藏
    //此三个方法参数一样,共俩个，第一个index,第二个当前行item
    buttonOptions: [],
    selections: [],
    emptyMessage: '暂无数据',
    tableEvent: this.tableEvent
  };

  ngOnInit() {
  }

  /**
   * 树节点点击事件
   * @param node
   */
  treeNodeSelect(node) {
    this.treeNode = node;
    this.queryParam.orgId = node.data.id;
    this.flushData();
  }

  flushData() {
    this.tableEvent.emit({flush: true});
  }
}

