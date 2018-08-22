import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {BaseComponent} from '../../../../components/base/base.component';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '../../../../components/http-client.service';

@Component({
  selector: 'app-data-convert-list',
  templateUrl: './data-convert-list.component.html',
  styleUrls: ['./data-convert-list.component.css']
})
export class DataConvertListComponent extends BaseComponent
  implements OnInit, OnDestroy {
  public treeNode: any;
  public statusList = [
    {label: '全部', value: -1},
    {label: '启用', value: 1},
    {label: '停用', value: 0}
  ];
  public collectionList = [{label: '全部', value: 0}];

  // public dataTypes = [{ label: '全部', value: 0 }, { label: '结构化数据', value: 1 }, { label: '非结构化数据', value: 2 }];

  constructor(public _ActivatedRoute: ActivatedRoute,
              public _Router: Router,
              public _HttpClient: HttpClient) {
    super();
    this.setBusinessType(1);
  }

  //树参数
  public treeOpts = {
    that: this,
    queryMethod: 'get',
    queryUrl: 'org/orgShowTree',
    expandedIndex: 0,
    queryParam: {businessType: 1}, //表示query类型参数，放在?后面。后续如果需要pathParam bodyParam再调整
    functionName: '数据资源', //新增和修改框标题中的功能名称
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
    businessType: 1,
    orgName: '',
    orgId: 0,
    orgIds: '',
    dataTypeValue: 1,
    status: -1,
    name: '',
    collectionId: 0
  };
  public queryParam2 = {
    businessType: 1
  };
  public tableOpts = {
    that: this,
    queryMethod: 'post',
    queryUrl: 'datatask/queryList',
    pageParam: {
      pageNum: 1,
      pageSize: 10
    }, //可使用默认值
    isPage: true, //是否分页
    defaultPageSize: 10,
    queryParam: this.queryParam2, //页面选择的查询参数，包括树节点id等信息
    bodyParam: this.queryParam, //请求体中的参数
    queryResultField: ['taskId'], //第一个值指定id的字段名,主要用于修改删除，状态切换
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
      {name: '主键', field: 'taskId'},
      {name: '数据资源名称', field: 'taskName', link: this.showDataSource, title: true},
      {name: '同步计划', field: 'runTypeStr'},
      {name: '所属机构', field: 'orgName'},
      {
        name: '状态',
        field: 'runStatus',
        type: 'switch',
        queryUrl: 'datatask/updateStatus',
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
        callback: this.updateDataSource,
        disabled: (index, item) => item.runStatus == 1,
        hidden: null,
        authcode: ''
      },
      {
        name: '删除',
        callback: this.deleteDataSource,
        disabled: (index, item) => item.runStatus == 1,
        hidden: null,
        authcode: ''
      },
      {
        name: '手动同步',
        callback: this.startNow,
        authcode: ''
      }
      //  {name:'启动', callback: this.startService, disabled: null, hidden: (index,item)=>item.runStatus == 1},
      ///  {name:'停止', callback: this.stopService,  disabled: null, hidden: (index,item)=>item.runStatus != 1},
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

  startNow(index, item) {
    this.dialogOpts.startnow.visible = true;
    this.dialogOpts.startnow.pathParam = item;
  }

  startnowOk() {
    this._HttpClient.get('datatask/startNow/' + this.dialogOpts.startnow.pathParam.taskId, '', data => {
      if (data) {
        this.tipMessage('执行成功！');
        this.dialogOpts.startnow.visible = false;
      }
    });
  }

  startLocalKettleOk() {
    this._HttpClient.get('datatask/startLocalKettle', '', data => {
      if (data) {
        this.tipMessage('执行成功！请稍后!');
        this.dialogOpts.startLocalKettle.visible = false;
      } else {
        this.tipWarnMessage('执行失败！请联系管理员!');
        this.dialogOpts.startLocalKettle.visible = false;
      }
    });
  }

  /*
  查看任务详情
   */
  detailDataSource(index, item) {
    this.saveSelectToLink(
      this.treeOpts.treeEvent,
      this.tableOpts.tableEvent,
      () => {
        this._Router.navigate([this.getRouterName() + '/detail'], {
          queryParams: {taskId: item.taskId}
        });
      }
    );
  }

  dialogOpts = {
    delete: {
      title: '数据资源删除',
      visible: false,
      pathParam: ''
    },
    startnow: {
      title: '立即执行',
      visible: false,
      pathParam: {
        taskId: ''
      }
    },
    startLocalKettle: {
      title: '本地kettle平台',
      visible: false,
      pathParam: ''
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

  //指定当前页面的类型
  setBusinessType(type: number) {
    this.treeOpts.queryParam.businessType = type;
    this.queryParam.businessType = type;
    this.queryParam2.businessType = type;
    this.tableOpts.buttonOptions[0].authcode = this.getAuthcode(3);
    this.tableOpts.buttonOptions[1].authcode = this.getAuthcode(4);
    this.tableOpts.theadOptions[this.tableOpts.theadOptions.length - 2][
      'authcode'
      ] = this.getAuthcode(5);
  }

  private authcodes = [
    ['', '', '011002', '011003', '011004', '011005'],
    ['', '', '012002', '012003', '012004', '012005']
  ];

  getAuthcode(oper: number): string {
    return this.authcodes[this.queryParam.businessType - 1][oper];
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
    this.flushConnections();
    this.flushData();
  }

  flushConnections() {
    let old_orgIds = this.queryParam.orgIds;
    this.getHttpClient().get(
      'datasource/queryListAll',
      {orgIds: this.queryParam.orgIds},
      data => {
        if (old_orgIds != this.queryParam.orgIds) {
          return;
        }
        let list = [{label: '全部', value: 0}];
        let exists = false;
        if (data && data.length > 0) {
          for (let d of data) {
            list.push({label: d.name, value: d.id});
            if (d.id == this.queryParam.collectionId) {
              exists = true;
            }
          }
        }
        this.collectionList = list;
        //如果选择的链接不存在，且为全部时，刷新数据
        if (!exists && this.queryParam.collectionId > 0) {
          this.queryParam.collectionId = 0;
          this.flushData();
        }
      }
    );
  }

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
    let url = 'datatask/deleteTaskBatch';
    this._HttpClient.delete_old(
      url + '/' + this.dialogOpts.delete.pathParam,
      null,
      data => {
        this.tipMessage(this.getFunctionName() + '删除成功！');
        this.flushData();
      }
    );
    this.dialogOpts.delete.visible = false;
  }

  /**
   * 启动任务/停止任务
   * @param index
   * @param item
   */
  startService(index, item) {
    this.startOrStopServices(1, item.taskId);
  }

  stopService(index, item) {
    this.startOrStopServices(0, item.taskId);
  }

  //启动任务停止任务
  public startOrStopServices(serviceState: number, taskId?: string) {
    let url = 'datatask/startStopServiceBatch';
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
      this.tipMessage(this.getFunctionName() + '任务' + operInfo + successState);
      this.flushData();
    });
  }

  showDataSource(index, item) {
    this.saveSelectToLink(
      this.treeOpts.treeEvent,
      this.tableOpts.tableEvent,
      () => {
        this._Router.navigate([this.getRouterName() + '/detail'], {
          queryParams: {taskId: item.taskId}
        });
      }
    );
  }

  //修改数据资源
  updateDataSource(index, item) {
    this.saveSelectToLink(
      this.treeOpts.treeEvent,
      this.tableOpts.tableEvent,
      () => {
        this._Router.navigate([this.getRouterName() + '/edit'], {
          queryParams: {taskId: item.taskId}
        });
      }
    );
  }

  addDataSource2() {
    this.dialogOpts.startLocalKettle.visible = true;
  }

  exportRelations() {
    this.dialogConfirmMessage('导出当前资源分类下所有的任务详细说明', '是否确定导出？', () => {
      window.location.href = this.getBasePath() + 'datatask/exportRelations';
      this.tipMessage('导出成功！');
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

  public getFunctionName(): string {
    if (this.queryParam.businessType == 1) {
      return '发布数据资源';
    } else {
      return '订阅数据资源';
    }
  }

  public getRouterName() {
    if (this.queryParam.businessType == 1) {
      return 'index/datashare/issueDataResources';
    } else {
      return 'index/datashare/subscribeDataResources';
    }
  }
}
