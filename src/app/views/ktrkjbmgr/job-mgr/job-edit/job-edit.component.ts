import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseComponent} from '../../../../components/base/base.component';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-job-edit',
  templateUrl: './job-edit.component.html',
  styleUrls: ['./job-edit.component.css']
})
export class JobEditComponent extends BaseComponent implements OnInit, OnDestroy {
  public that: JobEditComponent;
  public operType = 1;

  public jobData = {
    orgId: 0,
    orgName: '',
    jobName: '',
    schedule: '',
    businessType: '',
    remark: '',
    taskInfos: []
  };


  public defaultData = {
    sort: '',
    taskName: ''
  };


  constructor(public _ActivatedRoute: ActivatedRoute) {
    super();
    this.that = this;
  }


  public taskList = [];

  public dialogOpts = {
    select: {
      title: '选择数据转换资源',
      visible: false,
      rule: null,
    },
  };


  addDataRow(i) {
    this._addDataRow(i, this.jobData.taskInfos, this.defaultData, 100);
  }

  removeDataRow(i) {
    this._removeDataRow(i, this.jobData.taskInfos);
  }

  ngOnInit() {
    this._ActivatedRoute.queryParams.subscribe(params => {
      if (this.operType == 1) {
        this.jobData.orgId = params.orgId;
        this.jobData.orgName = params.orgName;
      }
    });
    for (let i = 0; i < 5; i++) {
      this.jobData.taskInfos.push(Object.assign({}, this.defaultData));
    }
  }

  onscheduleTypeChange() {
    this.tipMessage(this.jobData.schedule);
  }

  public busTypeList = [
    {label: '请选择', value: 0},
    {label: '发布', value: 1},
    {label: '订阅', value: 2},
  ];

  public scheduleTypeList = [
    {label: '1分钟', value: '1M'},
    {label: '5分钟', value: '5M'},
    {label: '30分钟', value: '30M'},
    {label: '1小时', value: '1H'},
    {label: '2小时', value: '2H'},
    {label: '6小时', value: '6H'},
    {label: '每天', value: 'DAY'},
    {label: '每周', value: 'WEEK'},
    {label: '每月', value: 'MONTH'},
    {label: '每年', value: 'YEAR'}
  ];


  public valid = {
    jobData: {
      _fields: ['jobName', 'businessType', 'schedule', 'remark'],
      jobName: {
        status: false,
        msg: '',
        valids: [
          {required: true, msg: '任务名称不能为空！'},
          {minLength: 2, msg: '任务名称最小长度为2！'}
        ]
      },
      businessType: {
        status: false,
        msg: '',
        valids: [
          {required: true, msg: '所属业务不能为空！'},
        ]
      },
      schedule: {
        status: false,
        msg: '',
        valids: [
          {required: true, msg: '执行计划不能为空！'},
        ]
      }
    },
    "data.$": {
      valids: [{ norepeat: "sort", msg: "排序号不能重复" }],
      sort: {
        status: false,
        name: "排序号",
        valids: [{ required: true }, { regexp: this.regexp_data }]
      },
      taskName: {
        status: false,
        name: "中文名称",
        valids: [{ required: true ,  msg:"中文名称格式错误，仅支持中文字母数字！" }]
      }
    },
    data: []
  };

  public getOperName() {
    return this.operType == 1 ? '新增' : (this.operType == 2 ? '修改' : '查看');
  }

  public getRouterName() {
    return 'index/datashare/jobMgr';
  }

  onbusTypeChange() {
    //我的想法是 根据选择的业务类型 和机构id来 取哪些 转换 用于后面的组装
    this.tipMessage(this.jobData.businessType + '---' + this.jobData.orgId);
    let url = 'datajob/queryTasks';
    var queryParam = {businessType: this.jobData.businessType, orgId: this.jobData.orgId};
    this.getHttpClient().get(url, queryParam, data => {
        if (data && data.length > 0) {
          this.taskList = [{value: '', label: '请选择'}];
          for (let d of data) {
            console.info(d.taskId + '----' + d.taskName);
            this.taskList.push({value: d.taskId, label: d.taskName});
          }
        }
      }
    );
  };

  goback() {
    this.getRouter().navigate([this.getRouterName() + '/search'], {queryParams: {back: true}});
  }


  saveitem() {
    alert('saveitem?');
    console.log(this.jobData);
  }

}
