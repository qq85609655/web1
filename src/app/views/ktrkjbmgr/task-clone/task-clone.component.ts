import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {BaseComponent} from '../../../components/base/base.component';
import {HttpClient} from '../../../components/http-client.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-task-clone',
  templateUrl: './task-clone.component.html',
  styleUrls: ['./task-clone.component.css']
})
export class TaskCloneComponent extends BaseComponent
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
    ],
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
  }

  //树参数
  public orgTreeOpts = {
    that: this,
    queryMethod: 'get',
    queryUrl: 'org/orgShowTree',
    queryParam: {}, //表示query类型参数，放在?后面。后续如果需要pathParam bodyParam再调整
    functionName: '机构列表', //新增和修改框标题中的功能名称
    queryResultField: ['id', 'parentId', 'orgName', 'children'], //查询结果对象中，需要的字段名称
    treeType: 'checkbox', //树类型，simple/checkbox
    queryDataToTreeData: null, //查询数据转换为树需要的数据
    nodeSelect: this.treeNodeSelect,
    operButton: {},
    treeEvent: new EventEmitter(),
    /* 以下为checkbox模式下配置*/
    queryCheckedMethod: 'get',
    queryCheckedUrl: '',
    queryCheckedParam: {},
    selectedNodeIds: []
  };

  dialogOpts = {
    clone: {
      title: '克隆资源',
      visible: false,
      dto: {
        ids: '',
        orgList: []
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

  }


  cloneItem() {
    let pathParam = '';
    if (!this.tableOpts.selections || this.tableOpts.selections.length <= 0) {
      this.tipWarnMessage('请选择至少一条数据！');
      return false;
    }
    let taskIds = [];
    for (let selection of this.tableOpts.selections) {
      taskIds.push(selection.taskId);
    }
    pathParam += taskIds.join('#');

    this.dialogOpts.clone.dto.ids = pathParam;
    this.dialogOpts.clone.visible = true;
    return true;
  }


  cloneOk() {
    //此处需要获取点击选中的三级部门的id
    var that = this;
    debugger;

    that.dialogOpts.clone.dto.orgList = that.orgTreeOpts.selectedNodeIds;
    let url = 'datatask/cloneTasksTo';

    that._HttpClient.post_old(url, this.dialogOpts.clone.dto, null, data => {
      if (data) {
        that.tipMessage('操作成功！');
        that.dialogOpts.clone.visible = false;
        that.flushData();
      }
    });
    return true;
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


  public getFunctionName(): string {
    if (this.queryParam.businessType == 1) {
      return '克隆发布数据资源';
    } else {
      return '克隆订阅数据资源';
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
