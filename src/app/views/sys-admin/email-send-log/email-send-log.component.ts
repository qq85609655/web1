import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {BaseComponent} from "../../../components/base/base.component";
import {Router} from "@angular/router";
import { HttpClient } from "../../../components/http-client.service";

@Component({
  selector: 'app-email-send-log',
  templateUrl: './email-send-log.component.html',
  styleUrls: ['./email-send-log.component.css']
})
export class EmailSendLogComponent extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit {

  constructor(public _Router: Router, public _HttpClient: HttpClient) {
    super();
  }

  // 表格
  public tableEvent: EventEmitter<any> = new EventEmitter();
  // 表格参数
  public queryParam = {
    keyWord: "",
    startTime: '',
    endTime: '',
    module:  -1
  };
  public timeOpts ={
    startTime: null,
    startTimeMin:null,
    endTime: null,
    endTimeMax:null
  }
  public cn = this.getCnDateLocale();
  onSelectTime(type){
    if(type == 1) {
      this.queryParam.startTime = this.getDatePipe().transform(this.timeOpts.startTime, 'yyyy-MM-dd');
      this.timeOpts.endTimeMax = this.addDateMonth(this.timeOpts.startTime , 3);
      this.flushData();
    }else if(type == 2) {

      this.queryParam.endTime = this.getDatePipe().transform(this.timeOpts.endTime, 'yyyy-MM-dd');
      this.timeOpts.startTimeMin = this.addDateMonth(this.timeOpts.endTime , -3);
      this.flushData();
    }
  }
  // 下拉框数据
  public moduleList = [
    {label: "全部", value: -1},
    {label: "重置密码", value: 1},
    {label: "忘记密码", value: 2},
    {label: "用户新增", value: 3},
    {label: "转换错误日志", value: 4}
  ];

  public tableOpts = {
    that: this,
    queryMethod: "get",
    queryUrl: "emailSendLog/queryList",
    pageParam: {
      pageNum: 1,
      pageSize: 10
    }, //可使用默认值
    isPage: true, //是否分页
    defaultPageSize: 10,
    queryParam: this.queryParam, //页面选择的查询参数，包括树节点id等信息
    bodyParam: {}, //请求体中的参数
    queryResultField: ["id"], //第一个值指定id的字段名,主要用于修改删除，状态切换
    tableType: "single", //树类型，simple/checkbox
    isColGroup: false, //是否是混合表头,rowspan colspan大于1
    theadOptions: [
      {name: "序号", type: "numberpage"},
      {name: "收件人姓名", field: "xm", title: true},
      {name: "功能模块", field: "moduleName", title: true},
      {name: "发送时间", field: "sendTime", title: true},
      {name: "成功与否", field: "sendSuccessStr", title: true},
      {name: "说明", field: "content", title: true}
    ],
    buttonOptions: [],
    selections: [],
    emptyMessage: "暂无数据",
    tableEvent: this.tableEvent
  };

  ngOnInit() {
    this.timeOpts.endTime= new Date();
    this.timeOpts.startTime= new Date();
    this.timeOpts.startTime.setDate(this.timeOpts.startTime.getDate() - 7);
    this.onSelectTime(1);
    this.onSelectTime(2);
  }

  ngAfterViewInit() {
    this.flushData();
  }
  // 刷新列表
  flushData() {
    this.tableEvent.emit({flush: true});
  }

}
