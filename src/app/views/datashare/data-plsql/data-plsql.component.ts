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

  public dbTypeList = [{label: '全部', value: -1}, {label: 'Oracle', value: 2}, {
    label: 'MySql',
    value: 1
  }, {label: 'MS SQL Server', value: 3}];

  public tableEvent: EventEmitter<any> = new EventEmitter();


  public queryParam = {
    dbType: '',
    sqlName: '',
  };


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
      {name: '状态', field: 'status'},
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
    this.saveSelectToLink(null, this.tableOpts.tableEvent, () => {
      this._Router.navigate(['index/datashare/plsql/add'], '');
    });
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
