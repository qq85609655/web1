import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {BaseComponent} from '../../../components/base/base.component';
import {Router} from '@angular/router';
import {HttpClient} from '../../../components/http-client.service';

@Component({
  selector: 'app-etl-log',
  templateUrl: './etl-log.component.html',
  styleUrls: ['./etl-log.component.css']
})
export class EtlLogComponent extends BaseComponent implements OnInit, OnDestroy {
  constructor(public _Router: Router,
              public _HttpClient: HttpClient) {
    super();
  }

  public tableEvent: EventEmitter<any> = new EventEmitter();

  public treeNode: any;
  public sourceList = [{label: '发布数据资源', value: 1}, {label: '订阅数据资源', value: 2}];

  //树参数
  public treeOpts = {
    that: this,
    queryMethod: 'get',
    expandedIndex: 0,
    queryUrl: 'org/orgShowTree',
    queryParam: {},//表示query类型参数，放在?后面。后续如果需要pathParam bodyParam再调整
    functionName: '机构列表',//新增和修改框标题中的功能名称
    queryResultField: ['id', 'parentId', 'orgName', 'children'],//查询结果对象中，需要的字段名称
    treeType: 'single',//树类型，simple/checkbox
    queryDataToTreeData: null,//查询数据转换为树需要的数据
    nodeSelect: this.treeNodeSelect,
    operButton: {}
  };

  public queryParam = {
    startTime: '',
    transName: '',
    endTime: '',
    orgId: 0,
    orgIds: '',
    busType: 1
  };
  public tableOpts = {
    that: this,
    queryMethod: 'post',
    queryUrl: 'kettleLog/queryList',
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

    theadOptions: [
      {name: '编号', type: 'numberpage'},
      {name: '数据资源名称', field: 'transname'},
      {name: '所在部门', field: 'orgName'},
      {name: '转换总数', field: 'line_input'},
      {name: '失败数量', field: 'line_rejected'},
      {name: '记录时间', field: 'logdate'},
      {name: '任务运行结果', field: 'status'},
      {name: '日志描述', field: 'log_field', title: true},
      {name: '操作', type: 'button', buttonOptions: 'buttonOptions'}
    ],
    buttonOptions: [
      {name: '查看', callback: this.detailLog, disabled: (index, item) => item.line_rejected == 0, hidden: null},
    ],
    selections: [],
    emptyMessage: '暂无数据',
    tableEvent: this.tableEvent
  };

  //转向 列表页面
  detailLog(index, item) {
    this._Router.navigate(['index/runAdmin/etlErrorLog'], {queryParams: {channel_id: item.channel_id}});
  }

  ngOnInit() {
    this.timeOpts.endTime = new Date();
    this.timeOpts.startTime = new Date();
    this.timeOpts.startTime.setDate(this.timeOpts.startTime.getDate() - 7);
    this.onSelectTime(1);
    this.onSelectTime(2);
  }

  public timeOpts = {
    startTime: null,
    startTimeMin: null,
    endTime: null,
    endTimeMax: null
  };
  public cn = this.getCnDateLocale();

  onSelectTime(type) {
    if (type == 1) {
      this.queryParam.startTime = this.getDatePipe().transform(this.timeOpts.startTime, 'yyyy-MM-dd');
      this.timeOpts.endTimeMax = this.addDateMonth(this.timeOpts.startTime, 3);
      this.flushData();
    } else if (type == 2) {
      this.queryParam.endTime = this.getDatePipe().transform(this.timeOpts.endTime, 'yyyy-MM-dd');
      this.timeOpts.startTimeMin = this.addDateMonth(this.timeOpts.endTime, -3);
      this.flushData();
    }
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

  flushData() {
    this.tableEvent.emit({flush: true});
  }

  dialogOpts = {
    clearOpt: {
      title: '确认清空所有日志',
      visible: false,
      param: {
        type: ''
      }
    }
  };

  clearLog() {
    this.dialogOpts.clearOpt = {
      title: '确认清空所有日志',
      visible: true,
      param: {
        type: 'ALL'
      }
    };
  }

  clearOK() {
    var that = this;
    this._HttpClient.post(
      'kettleLog/clearLogs',
      {},
      null,
      function (data) {
        if (data) {
          that.tipMessage('清空操作成功！');
          that.dialogOpts.clearOpt.visible = false;
          that.flushData();
        } else {
          that.tipMessage('清空操作失败！');
          that.dialogOpts.clearOpt.visible = false;
          that.flushData();
        }
      }, null, () => {
        that.removeAjaxFlag();
      }
    );
  }


}
