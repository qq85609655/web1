import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {BaseComponent} from '../../../components/base/base.component';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '../../../components/http-client.service';

@Component({
  selector: 'app-job-mgr',
  templateUrl: './job-mgr.component.html',
  styleUrls: ['./job-mgr.component.css']
})
export class JobMgrComponent extends BaseComponent
  implements OnInit, OnDestroy {

  public treeNode: any;
  public statusList = [
    {label: '全部', value: -1},
    {label: '启用', value: 1},
    {label: '停用', value: 0}
  ];

  public busList = [
    {label: '全部', value: -1},
    {label: '发布', value: 1},
    {label: '订阅', value: 2}];


  constructor(public _ActivatedRoute: ActivatedRoute,
              public _Router: Router,
              public _HttpClient: HttpClient) {
    super();
  }


  //树参数
  public treeOpts = {
    that: this,
    queryMethod: 'get',
    queryUrl: 'org/orgShowTree',
    expandedIndex: -1,
    queryParam: '', //表示query类型参数，放在?后面。后续如果需要pathParam bodyParam再调整
    functionName: '转换任务', //新增和修改框标题中的功能名称
    treeType: 'single', //树类型，simple/checkbox
    queryResultField: ['id', 'parentId', 'orgName', 'children'], //查询结果对象中，需要的字段名称
    queryDataToTreeData: null, //查询数据转换为树需要的数据
    nodeSelect: this.treeNodeSelect,
    operButton: {},
    usingCache: false,
    treeEvent: new EventEmitter()
  };

  public tableEvent: EventEmitter<any> = new EventEmitter();
  public queryParam = {
    orgName: '',
    orgId: 0,
    orgIds: '',
    status: -1,
    busType: 0,
    jobName: '',
  };
  public tableOpts = {
    that: this,
    queryMethod: 'post',
    queryUrl: 'datajob/queryList',
    pageParam: {
      pageNum: 1,
      pageSize: 10
    }, //可使用默认值
    isPage: true, //是否分页
    defaultPageSize: 10,
    queryParam: '', //页面选择的查询参数，包括树节点id等信息
    bodyParam: this.queryParam, //请求体中的参数
    queryResultField: ['jobId'], //第一个值指定id的字段名,主要用于修改删除，状态切换
    tableType: 'single', //树类型，simple/checkbox
    isColGroup: false, //是否是混合表头,rowspan colspan大于1
    usingCache: false,

    //混合表头的格式再定义
    //checkbox类型表示当前列显示checkbox
    //number支持俩种类型，//number：12345, numberpage加上页码后的数字：21 22 23...
    //普通的字段可支持link、format， format后续需要再增加实现
    //button表示按钮列，每一列可以多个按钮，根据options指定字段可以给多列都使用按钮
    theadOptions: [
      {name: '', type: 'checkbox'},
      {name: '序号', type: 'number'},
      {name: 'job名称', field: 'jobName', title: true},
      {name: '执行计划', field: 'schedule'},
      {name: '所属机构', field: 'orgName'},
      {
        name: '状态',
        field: 'status',
        type: 'switch',
        queryUrl: 'datajob/updateStatus',
        queryParam: {},
        switchName: ['启动', '停止'],
        authcode: ''
      },
      {name: '操作', type: 'button', buttonOptions: 'buttonOptions'}
    ],
    //callback指定回调的方法，
    //disabled指定按钮是否禁用
    //hidden指定按钮是否隐藏
    //此三个方法参数一样,共俩个，第一个index,第二个当前行item
    buttonOptions: [
      {
        name: '修改',
        callback: this.updateJob,
        disabled: (index, item) => item.status == 1,
        hidden: null,
        authcode: ''
      },
      {
        name: '删除',
        callback: this.deleteDataSource,
        disabled: (index, item) => item.status == 1,
        hidden: null,
        authcode: ''
      },
      {
        name: '手动同步',
        callback: this.startNow,
        authcode: ''
      }
    ],
    dataHandler: row => {
      if (row.runType == 1) {
        row.runTypeStr = row.runSpace + '分钟';
      } else if (row.runType == 2) {
        row.runTypeStr = row.runSpace + '小时';
      } else if (row.runType == 3) {
        row.runTypeStr = '每天';
      } else if (row.runType == 4) {
        row.runTypeStr = '每周';
      } else if (row.runType == 5) {
        row.runTypeStr = '每月';
      } else if (row.runType == 6) {
        row.runTypeStr = '每年';
      }
    },
    selections: [],
    emptyMessage: '暂无数据',
    tableEvent: this.tableEvent
  };

  /**
   * 表格中的删除事件
   * @param index
   * @param item
   */
  deleteDataSource(index, item) {
    this.deleteDataSources(item.taskId);
  }

  /**
   * 单个的和批量的删除事件
   * @param {string} taskId
   * @returns {boolean}
   */
  public deleteDataSources(taskId?: string) {
    let pathParam = '';
    if (!taskId) {
      if (!this.tableOpts.selections || this.tableOpts.selections.length <= 0) {
        this.tipWarnMessage('请选择至少一条数据！');
        return false;
      }
      let taskIds = [];
      for (let selection of this.tableOpts.selections) {
        taskIds.push(selection.taskId);
      }
      pathParam += taskIds.join(',');
    } else {
      pathParam += taskId;
    }
    this.dialogOpts.delete.pathParam = pathParam;
    this.dialogOpts.delete.visible = true;
    return true;
  }

  deleteDataSourcesOk() {
    let url = 'datajob/deleteJobBatch';
    this._HttpClient.delete_old(
      url + '/' + this.dialogOpts.delete.pathParam,
      null,
      data => {
        this.tipMessage('转换任务job删除成功！');
        this.flushData();
      }
    );
    this.dialogOpts.delete.visible = false;
  }


  public getRouterName() {
    return 'index/datashare/jobMgr';
  }

  //修改数据资源
  updateJob(index, item) {
    this.saveSelectToLink(
      this.treeOpts.treeEvent,
      this.tableOpts.tableEvent,
      () => {
        this._Router.navigate([this.getRouterName() + '/edit'], {
          queryParams: {jobId: item.jobId}
        });
      }
    );
  }

  startNow(index, item) {
    this.dialogOpts.startnow.visible = true;
    this.dialogOpts.startnow.pathParam = item;
  }

  startnowOk() {
    this._HttpClient.get('datajob/startNow/' + this.dialogOpts.startnow.pathParam.taskId, '', data => {
      if (data) {
        this.tipMessage('执行成功！');
        this.dialogOpts.startnow.visible = false;
      }
    });
  }

  addDataSource() {
    if (this.treeNode.data.nodeType != 3) {
      this.tipWarnMessage('请选择第三级机构新增数据资源任务！');
      return false;
    }
    let tree = {
      orgId: this.queryParam.orgId,
      orgName: this.queryParam.orgName
    };
    this.saveSelectToLink(
      this.treeOpts.treeEvent,
      this.tableOpts.tableEvent,
      () => {
        this._Router.navigate([this.getRouterName() + '/add'], {
          queryParams: tree
        });
      }
    );
  }

  //启动任务停止任务
  public startOrStopServices(serviceState: number, taskId?: string) {
    let url = 'datajob/startStopServiceBatch';
    if (serviceState == 1 || serviceState == 0) {
    } else {
      return false;
    }
    let pathParam = '';
    if (!taskId) {
      if (!this.tableOpts.selections || this.tableOpts.selections.length <= 0) {
        this.tipWarnMessage('请选择至少一条数据！');
        return false;
      }
      let taskIds = [];
      for (let selection of this.tableOpts.selections) {
        taskIds.push(selection.taskId);
      }
      pathParam += taskIds.join(',') + '/' + serviceState;
    } else {
      pathParam += taskId + '/' + serviceState;
    }
    this._HttpClient.put_old(url + '/' + pathParam, null, null, data => {
      var successState = '';
      if (data) {
        successState = '成功';
      } else {
        successState = '失败';
      }
      var operInfo = serviceState == 1 ? '启动' : '停止';
      this.tipMessage('转换任务JOB' + operInfo + successState);
      this.flushData();
    });
  }

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

  dialogOpts = {
    delete: {
      title: '转换任务Job删除',
      visible: false,
      pathParam: ''
    },
    startnow: {
      title: '立即执行',
      visible: false,
      pathParam: {
        taskId: ''
      }
    }
  };

  ngOnInit() {
    this._ActivatedRoute.queryParams.subscribe(params => {
      if (params.back == 'true') {
        this.treeOpts.usingCache = true;
        this.tableOpts.usingCache = true;
      }
    });
  }

  flushData() {
    this.tableEvent.emit({flush: true});
  }

}
