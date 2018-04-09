import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {BaseComponent} from "../../../components/base/base.component";
import {BaseService} from "../../../components/base/base.service";
import {HttpClient} from "../../../components/http-client.service";

@Component({
  selector: 'app-log-oper-log-search',
  templateUrl: './log-oper-log-search.component.html',
  styleUrls: ['./log-oper-log-search.component.css']
})
export class LogOperLogSearchComponent extends BaseComponent implements OnInit, OnDestroy {

  public tableEvent: EventEmitter<any> = new EventEmitter();

  constructor(public _Router: Router,
              public _HttpClient: HttpClient) {
    super();
  }

  public startTime: Date;
  public endTime: Date;


  public statusList = [{label: '全部', value: 0}, {label: '正常', value: 1}, {label: '异常', value: 2}];
  public treeNode: any;


  //树参数
  public treeOpts = {
    that: this,
    queryMethod: 'get',
    expandedIndex: 0,
    queryUrl: "menu/getMenuTree",
    queryParam: {},//表示query类型参数，放在?后面。后续如果需要pathParam bodyParam再调整
    functionName: '菜单',//新增和修改框标题中的功能名称
    queryResultField: ['menuId', 'parentId', 'menuName', 'children'],//查询结果对象中，需要的字段名称
    treeType: 'single',//树类型，simple/checkbox
    queryDataToTreeData: null,//查询数据转换为树需要的数据
    nodeSelect: this.treeNodeSelect,
    operButton: {}
  };

  public queryParam = {
    operRes: 0,
    keyWord: '',
    operModuleIds: '0',
    startTime: '',
    endTime: '',
    orgIds: ''
  };

  public tableOpts = {
    that: this,
    queryMethod: 'post',
    queryUrl: "log/queryListOper",
    pageParam: {
      pageNum: 1,
      pageSize: 10
    },//可使用默认值
    isPage: true,//是否分页
    defaultPageSize: 10,
    queryParam: {},//页面选择的查询参数，包括树节点id等信息
    bodyParam: this.queryParam,//请求体中的参数
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
      {name: '姓名(用户编号)', field: 'operUserStr'},
      {name: '模块', field: 'operModuleName'},
      {name: '操作类型', field: 'operType'},
      {name: '描述', field: 'operContent',title:true},
      {name: 'IP地址', field: 'operIp'},
      {name: '记录时间', field: 'operTime'}
    ],
    dataHandler:(row)=>{row.operUserStr = row.operUserName+'('+row.operUserNo+')';},
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
    this.timeOpts.endTime= new Date();
    this.timeOpts.startTime= new Date();
    this.timeOpts.startTime.setDate(this.timeOpts.startTime.getDate() - 7);
    this.onSelectTime(1);
    this.onSelectTime(2);
  }

  public timeOpts ={
    startTime: null,
    startTimeMin:null,
    endTime: null,
    endTimeMax:null
  }
  public cn = this.getCnDateLocale();
  onSelectTime(type){
    if(type == 1) {
      this.queryParam.startTime = this.getDatePipe().transform(this.timeOpts.startTime, 'yyyy-MM-dd');
      this.timeOpts.endTimeMax = this.addDateMonth(this.timeOpts.startTime , 3);
      this.flushData();
    }else if(type == 2) {

      this.queryParam.endTime = this.getDatePipe().transform(this.timeOpts.endTime, 'yyyy-MM-dd');
      this.timeOpts.startTimeMin = this.addDateMonth(this.timeOpts.endTime , -3);
      this.flushData();
    }
  }

  /**
   * 树节点点击事件
   * @param node
   */
  treeNodeSelect(node) {
    this.treeNode = node;
    var operModuleIds = this.getMenuIds(node.data, true);
    this.queryParam.operModuleIds = operModuleIds.join(',');
    console.info(this.queryParam.operModuleIds);
    this.flushData();
  }

  flushData() {
    this.tableEvent.emit({flush: true});
  }
}
