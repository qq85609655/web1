import {AfterViewInit, Component, EventEmitter, OnInit} from '@angular/core';
import {BaseComponent} from '../../../components/base/base.component';
import {Router} from '@angular/router';
import {HttpClient} from '../../../components/http-client.service';


@Component({
  selector: 'app-ktr-mgr',
  templateUrl: './ktr-mgr.component.html',
  styleUrls: ['./ktr-mgr.component.css']
})
export class KtrMgrComponent extends BaseComponent
  implements OnInit, AfterViewInit {

  public tableEvent: EventEmitter<any> = new EventEmitter();


  constructor(public _Router: Router, public _HttpClient: HttpClient) {
    super();
  }


  flushData() {
    this.tableEvent.emit({flush: true});
  }


  public queryParam = {
    fileName: '',
    fileType: 'ktr'
  };


  public queryParam2 = {
    fileName: '',
    fileType: 'ktr'
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
      {name: '', type: 'checkbox'},
      {name: '转换任务名称', field: 'fileName'},
      {name: '保存路径', field: 'filePath'},
      {name: '调度计划', field: 'scheduleInfo'},
      {name: '操作', type: 'button', buttonOptions: 'buttonOptions'}
    ],
    buttonOptions: [
      {name: '立即执行', callback: this.runIt},
      {name: '调度计划调整', callback: this.changeScheduleInfo},
    ],
    selections: [],
    emptyMessage: '暂无数据',
    tableEvent: this.tableEvent
  };

  dialogOpts = {
    startnow: {
      title: '立即执行',
      visible: false,
      pathParam: {
        fileName: '',
        fileType: ''
      }
    },
    changeSchedule: {
      title: '修改调度',
      visible: false,
      pathParam: {
        fileName: '',
        scheduleInfo: ''
      }
    }
  };

  runIt(index, item) {
    this.dialogOpts.startnow.visible = true;
    this.dialogOpts.startnow.pathParam = item;
  }

  runBatch() {
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
    this.dialogOpts.startnow.pathParam.fileType = 'ktr';
    return true;
  }


  changeScheduleInfo(index, item) {
    this.dialogOpts.changeSchedule.visible = true;
    this.dialogOpts.changeSchedule.pathParam = item;
  }

  loadAgain(){
    var urrl = 'kfilemgr/load/ktr';
    console.info(urrl);
    this._HttpClient.get(urrl, '', data => {
      if (data) {
        this.tipMessage('执行成功！');
        this.flushData() ;
      }
    });
  }
  startnowOk() {
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

  changeScheduleOk() {
    this._HttpClient.get('kfilemgr/changeSchedule/' + this.dialogOpts.changeSchedule.pathParam.fileName + '/' + this.dialogOpts.changeSchedule.pathParam.scheduleInfo, '', data => {
      if (data) {
        this.tipMessage('执行成功！');
        this.dialogOpts.changeSchedule.visible = false;
      }
    });
  }


  ngAfterViewInit() {
    this.flushData();
  }

}
