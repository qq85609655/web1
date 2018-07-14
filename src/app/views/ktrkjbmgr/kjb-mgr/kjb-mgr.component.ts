import {AfterViewInit, Component, EventEmitter, OnInit} from '@angular/core';
import {BaseComponent} from '../../../components/base/base.component';
import {HttpClient} from '../../../components/http-client.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-kjb-mgr',
  templateUrl: './kjb-mgr.component.html',
  styleUrls: ['./kjb-mgr.component.css']
})
export class KjbMgrComponent extends BaseComponent
  implements OnInit, AfterViewInit {

  public tableEvent: EventEmitter<any> = new EventEmitter();


  constructor(public _Router: Router, public _HttpClient: HttpClient) {
    super();
  }


  flushData() {
    this.tableEvent.emit({flush: true});
  }


  ngAfterViewInit() {
    this.flushData();
  }

  public queryParam = {
    fileName: '',
    fileType: 'kjb'
  };


  public queryParam2 = {
    fileName: '',
    fileType: 'kjb'
  };

  ngOnInit() {

  }


  public tableOpts = {
    that: this,
    queryMethod: 'post',
    queryUrl: 'kfilemgr/queryLocalTransFileList',
    pageParam: {
      pageNum: 1,
      pageSize: 10
    }, //可使用默认值
    isPage: true, //是否分页
    defaultPageSize: 10,
    queryParam: this.queryParam2, //页面选择的查询参数，包括树节点id等信息
    bodyParam: this.queryParam, //请求体中的参数
    queryResultField: ['fileName'], //第一个值指定id的字段名,主要用于修改删除，状态切换
    tableType: 'single', //树类型，simple/checkbox
    theadOptions: [
      {name: 'job名称', field: 'fileName'},
      {name: '保存路径', field: 'filePath'},
      {name: '创建时间', field: 'createTime2'},
      {name: '最后编辑时间', field: 'updateTime2'},
      {name: '操作', type: 'button', buttonOptions: 'buttonOptions'}
    ],
    //callback指定回调的方法，
    //disabled指定按钮是否禁用
    //hidden指定按钮是否隐藏
    //此三个方法参数一样,共俩个，第一个index,第二个当前行item
    buttonOptions: [
      {name: '执行', callback: this.runIt},
    ],
    selections: [],
    emptyMessage: '暂无数据',
    tableEvent: this.tableEvent
  };

  runIt(index, item) {
    this.dialogOpts.startnow.visible = true;
    this.dialogOpts.startnow.pathParam = item;
  }

  dialogOpts = {
    startnow: {
      title: '执行',
      visible: false,
      pathParam: {
        fileName: '',
        fileType: ''
      }
    }
  };


  RunBatch() {
    let pathParam = '';
    if (!this.tableOpts.selections || this.tableOpts.selections.length <= 0) {
      this.tipWarnMessage('请选择至少一条数据！');
      return false;
    }
    let fileNames = [];
    for (let selection of this.tableOpts.selections) {
      fileNames.push(selection.fileName);
    }
    pathParam += fileNames.join(',');
    this.dialogOpts.startnow.visible = true;
    this.dialogOpts.startnow.pathParam.fileName = pathParam;
    this.dialogOpts.startnow.pathParam.fileType = 'kjb';
    return true;
  }

  loadAgain() {
    var urrl = 'kfilemgr/load/kjb';
    console.info(urrl);
    this._HttpClient.get(urrl, '', data => {
      if (data) {
        this.tipMessage('执行成功！');
        this.flushData() ;
      }
    });
  }

  runItOk() {
    let fileName = this.dialogOpts.startnow.pathParam.fileName;
    var ext = fileName.substring(0, fileName.lastIndexOf('.'));
    console.info(ext);
    var urrl = 'kfilemgr/runIt/' + this.dialogOpts.startnow.pathParam.fileType + '/' + ext;
    console.info(urrl);
    this._HttpClient.get(urrl, '', data => {
      if (data) {
        this.tipMessage('执行成功！');
        this.dialogOpts.startnow.visible = false;
      }
    });
  }
}
