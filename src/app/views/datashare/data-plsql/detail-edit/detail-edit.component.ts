import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseComponent} from '../../../../components/base/base.component';
import {HttpClient} from '../../../../components/http-client.service';

@Component({
  selector: 'app-detail-edit',
  templateUrl: './detail-edit.component.html',
  styleUrls: ['./detail-edit.component.css']
})
export class DetailEditComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(public _ActivatedRoute: ActivatedRoute,
              public _Router: Router,
              public _HttpClient: HttpClient) {
    super();
  }

  public tableEvent: EventEmitter<any> = new EventEmitter();

  public queryParam = {
    sqlId: 0,
    columnName: ''
  };


  public tableOpts = {
    that: this,
    queryMethod: 'post',
    queryUrl: 'plsql/queryList2',
    pageParam: {
      pageNum: 1,
      pageSize: 10
    },//可使用默认值
    isPage: true,//是否分页
    defaultPageSize: 10,
    queryParam: this.queryParam,//页面选择的查询参数，包括树节点id等信息
    bodyParam: this.queryParam,//请求体中的参数
    queryResultField: ['id'],//第一个值指定id的字段名,主要用于修改删除，状态切换
    tableType: 'single',//树类型，simple/checkbox
    isColGroup: false,//是否是混合表头,rowspan colspan大于1
    usingCache: false,
    theadOptions: [
      {name: '序号', type: 'numberpage'},
      {name: '字段名称', field: 'columnLabel'},
      {name: '中文名称', field: 'columnLabelName'},
      {name: '操作', type: 'button', buttonOptions: 'buttonOptions'}
    ],
    buttonOptions: [
      {name: '修改', callback: this.editColumnItem}
    ],
    selections: [],
    emptyMessage: '暂无数据',
    tableEvent: this.tableEvent
  };

  editColumnItem(index, item) {
    this.dialogOpts.updateAlianName.visible = true;
    this.dialogOpts.updateAlianName.data.id = item.id;
    this.dialogOpts.updateAlianName.data.sqlId = this.queryParam.sqlId;
    this.dialogOpts.updateAlianName.data.columnLabelName = item.columnLabelName;
  }

  dialogOpts = {
    updateAlianName: {
      title: '输入中文名称',
      visible: false,
      data: {
        id: 0,
        sqlId: 0,
        columnLabelName: ''
      }
    }
  };
  public sqlColumnDetail = {
    id: 0,
    sqlId: 0,
    columnLabelName: ''
  };


  ngOnInit() {
    this._ActivatedRoute.queryParams.subscribe(params => {
      this.queryParam.sqlId = params.id;
      console.info('------------------------' + this.queryParam.sqlId);
    });
    //  alert(this.queryParam.sqlId);
  }

  ngAfterViewInit() {
    this.flushData();
  }

  /**
   * 提交修改
   */
  submitOk() {
    this.sqlColumnDetail.id = this.dialogOpts.updateAlianName.data.id;
    this.sqlColumnDetail.columnLabelName = this.dialogOpts.updateAlianName.data.columnLabelName;
    this.sqlColumnDetail.sqlId = this.dialogOpts.updateAlianName.data.sqlId;

    console.info(this.sqlColumnDetail);
    if (this.sqlColumnDetail.columnLabelName == '' || this.sqlColumnDetail.columnLabelName == null) {
          this.tipWarnMessage("请输入有效的字段名称!");
          $("#columnstr").focus();
    }

    this.getHttpClient().post('plsql/upDateColumn', null, this.sqlColumnDetail, (data) => {
      if (data == 'true' || data == true) {
        this.tipMessage('修改成功！');
        this.dialogOpts.updateAlianName.visible = false;
        this.flushData();
      } else {
        this.tipWarnMessage('修改失败！');
        this.dialogOpts.updateAlianName.visible = false;
        this.flushData();
      }
    });
  }

  flushData() {
    this.tableEvent.emit({flush: true});
  }

}
