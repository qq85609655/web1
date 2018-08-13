import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseComponent} from '../../../components/base/base.component';
import {HttpClient} from '../../../components/http-client.service';

@Component({
  selector: 'app-data-plsql',
  templateUrl: './data-plsql.component.html',
  styleUrls: ['./data-plsql.component.css']
})


export class DataPlsqlComponent extends BaseComponent implements OnInit, OnDestroy {

  constructor(public _ActivatedRoute: ActivatedRoute,
              public _Router: Router,
              public _HttpClient: HttpClient) {
    super();
  }

  public queryParam = {
    orgId: 0,
    orgIds: '',
    dbType: '',
    sqlName: '',
  };

  public dbTypeList = [{label: '全部', value: -1}, {label: 'Oracle', value: 2}, {
    label: 'MySql',
    value: 1
  }, {label: 'MS SQL Server', value: 3}];

  public tableEvent: EventEmitter<any> = new EventEmitter();
  public treeNode: any;
  //树参数
  public treeOpts = {
    that: this,
    queryMethod: 'get',
    queryUrl: 'org/orgShowTree',
    usingCache: false,
    expandedIndex: 0,
    queryParam: {},//表示query类型参数，放在?后面。后续如果需要pathParam bodyParam再调整
    functionName: '机构列表',//新增和修改框标题中的功能名称
    queryResultField: ['id', 'parentId', 'orgName', 'children'],//查询结果对象中，需要的字段名称
    treeType: 'single',//树类型，simple/checkbox
    queryDataToTreeData: null,//查询数据转换为树需要的数据
    nodeSelect: this.treeNodeSelect,
    operButton: {},
    treeEvent: new EventEmitter()
  };

  treeNodeSelect(node) {
    this.treeNode = node;
    this.queryParam.orgId = node.data.id;
    var orgNodeIds = this.getOrgNodeIds(node.data, true);
    this.queryParam.orgIds = orgNodeIds.join(',');
    this.flushData();
  }

  public tableOpts = {
    that: this,
    queryMethod: 'post',
    queryUrl: 'plsql/queryList',
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
    usingCache: false,
    theadOptions: [
      {name: '序号', type: 'numberpage'},
      {name: '查询名称', field: 'sqlName'},
      {name: '英文别名', field: 'sqlAliansName'},
      {name: '状态', field: 'status'},//开启状态
      {name: '创建时间', field: 'createTime'},
      {name: '操作', type: 'button', buttonOptions: 'buttonOptions'}
    ],
    buttonOptions: [
      {name: '查看', callback: this.detailItem},
      {name: '修改', callback: this.editItem},
      {name: '删除', callback: this.deleteItem}
    ],
    selections: [],
    emptyMessage: '暂无数据',
    tableEvent: this.tableEvent
  };

  ngOnInit() {
    this._ActivatedRoute.queryParams.subscribe(params => {
      if (params.back == 'true') {
        this.tableOpts.usingCache = true;
      }
    });
  }

  addData(opsItem?: any, listItem?: any) {
    if (this.treeNode.data.nodeType != 3) {
      this.tipWarnMessage('请选择第三级机构新增数据资源任务！');
      return false;
    }
    let tree = {
      orgId: this.queryParam.orgId,
    };
    this.saveSelectToLink(
      this.treeOpts.treeEvent,
      this.tableOpts.tableEvent,
      () => {
        this._Router.navigate(['index/datashare/plsql/add/'], {
          queryParams: tree
        });
      }
    );
  }

  flushData() {
    this.tableEvent.emit({flush: true});
  }

  detailItem(index, item) {
    this.saveSelectToLink(null, this.tableOpts.tableEvent, () => {
      this._Router.navigate(['index/datashare/plsql/detail'], {queryParams: {id: item.id}});
    });
  }

  editItem(index, item) {
    this.saveSelectToLink(null, this.tableOpts.tableEvent, () => {
      this._Router.navigate(['index/datashare/plsql/edit'], {queryParams: {id: item.id}});
    });
  }

  // 删除
  deleteItem(index, item) {
    this.deleteItems(item.id);
  }

  public deleteItems(id?: number) {
    this.dialogOpts.delete.data.id = id;
    this.dialogOpts.delete.visible = true;
    return true;
  }

  dialogOpts = {
    delete: {
      title: '删除',
      visible: false,
      pathParam: '',
      data: {
        id: 0
      }
    }
  };

  deleteOk() {
    let url = 'plsql/' + this.dialogOpts.delete.data.id;
    console.log(this.dialogOpts.delete.data.id);
    this._HttpClient.delete_old(url, {}, data => {
      this.tipMessage('数据源删除成功！');
      this.dialogOpts.delete.visible = false;
      this.flushData();
    });
  }

}
