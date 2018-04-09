import {AfterViewInit, Component, EventEmitter, OnInit} from '@angular/core';
import {BaseComponent} from '../../../components/base/base.component';
import {HttpClient} from '../../../components/http-client.service';
import {Router} from '@angular/router';
import {window} from 'rxjs/operator/window';


@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.css']
})


export class InterfaceComponent extends BaseComponent
  implements OnInit, AfterViewInit {

  public tableEvent: EventEmitter<any> = new EventEmitter();


  constructor(public _Router: Router, public _HttpClient: HttpClient) {
    super();
  }


  flushData() {
    this.tableEvent.emit({flush: true});
  }


  public queryParam = {
    tableName: '',
    tableType: ''
  };


  public queryParam2 = {
    tableName: '',
    tableType: ''
  };

  ngOnInit() {
  }

  runAllNow() {
    let pathParam = '';
    if (!this.tableOpts.selections || this.tableOpts.selections.length <= 0) {
      this.tipWarnMessage('请选择至少一条数据！');
      return false;
    }
    let taskIds = [];
    for (let selection of this.tableOpts.selections) {
      taskIds.push(selection.taskId);
    }
    pathParam += taskIds.join(',');
    this.dialogOpts.runAllNow.pathParam.tableName = pathParam;
    this.dialogOpts.runAllNow.visible = true;
    return true;
  }
  RunAllNowOk(){
    location.href = this.getBasePath() + 'interface/code/' + this.dialogOpts.runAllNow.pathParam.tableName;
    this.tipMessage('执行成功！');
    this.dialogOpts.startnow.visible = false;
  }

  public tableOpts = {
    that: this,
    queryMethod: 'post',
    queryUrl: 'interface/queryAllCenterTableList',
    pageParam: {
      pageNum: 1,
      pageSize: 10
    }, //可使用默认值
    isPage: true, //是否分页
    defaultPageSize: 10,
    queryParam: this.queryParam2, //页面选择的查询参数，包括树节点id等信息
    bodyParam: this.queryParam, //请求体中的参数
    queryResultField: ['tableName'], //第一个值指定id的字段名,主要用于修改删除，状态切换
    tableType: 'single', //树类型，simple/checkbox
    theadOptions: [
      {name: '', type: 'checkbox'},
      {name: '表名称', field: 'tableName'},
      {name: '类型', field: 'tableType'},
      //{name: '注释', field: 'comments'},
      {name: '创建时间', field: 'createDate'},
      {name: '修改时间', field: 'updateDate'},
      {name: '操作', type: 'button', buttonOptions: 'buttonOptions'}
    ],
    buttonOptions: [
      {name: '生成代码', callback: this.runIt},
      {name: '查看', callback: this.see},
    ],
    selections: [],
    emptyMessage: '暂无数据',
    tableEvent: this.tableEvent
  };

  dialogOpts = {
    startnow: {
      title: '生成接口代码',
      visible: false,
      pathParam: {
        tableName: ''
      }
    },
    runAllNow: {
      title: '批量生成接口代码',
      visible: false,
      pathParam: {
        tableName: ''
      }
    }
  };

  runIt(index, item) {
    this.dialogOpts.startnow.visible = true;
    this.dialogOpts.startnow.pathParam = item;
  }

  see(index, item) {
    //弹出一个对话框来显示表的相关属性 和字段信息
  }

  startnowOk() {
    location.href = this.getBasePath() + 'interface/code/' + this.dialogOpts.startnow.pathParam.tableName;
    this.tipMessage('执行成功！');
    this.dialogOpts.startnow.visible = false;
  }

  ngAfterViewInit() {
    this.flushData();
  }

}
