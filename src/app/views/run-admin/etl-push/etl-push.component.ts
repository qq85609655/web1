import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {BaseComponent} from "../../../components/base/base.component";
import {HttpClient} from "../../../components/http-client.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-etl-push',
  templateUrl: './etl-push.component.html',
  styleUrls: ['./etl-push.component.css']
})
export class EtlPushComponent extends BaseComponent implements OnInit, OnDestroy {
  constructor(public _Router: Router,
              public _HttpClient: HttpClient) {
    super();
  }

  public treeNode: any;


  public statusList = [{label: '全部', value: -1}, {label: '是', value: 1}, {label: '否', value: 0}];

  //树参数
  public treeOpts = {
    that: this,
    queryMethod: 'get',
    queryUrl: "org/orgShowTree",
    expandedIndex: 0,
    queryParam: {},//表示query类型参数，放在?后面。后续如果需要pathParam bodyParam再调整
    functionName: '机构列表',//新增和修改框标题中的功能名称
    queryResultField: ['id', 'parentId', 'orgName', 'children'],//查询结果对象中，需要的字段名称
    treeType: 'single',//树类型，simple/checkbox
    queryDataToTreeData: null,//查询数据转换为树需要的数据
    nodeSelect: this.treeNodeSelect,
    operButton: {}
  };

  public busType;
  public tableEvent: EventEmitter<any> = new EventEmitter();
  public queryParam = {
    orgId: 0,
    orgIds: '',
    orgName: '',
    isPush: -1,
  };
  public tableOpts = {
    that: this,
    queryMethod: 'post',
    queryUrl: "alertPush/queryList",
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

    theadOptions: [
      {name: '序号', type: 'numberpage'},
      {name: '姓名(用户编号)', field: 'xm', link: ''},
      {name: '所在部门', field: 'orgName', link: ''},
      {
        name: '是否邮件推送', field: 'isPush',
        type: 'switch',
        queryUrl: 'sysuser/updateSendStatus',
        queryParam: {},
        switchName: ['是', '否'],
        authcode: '019002,019003'
      },
      {name: '发布资源', field: 'fbCount', link: ''},
      {name: '订阅资源', field: 'dyCount', link: ''},
      {name: '操作', type: 'button', buttonOptions: 'buttonOptions'}
    ],
    buttonOptions: [
      {name: '发布邮件推送', callback: this.editFb, authcode: '019002'},
      {name: '订阅邮件推送', callback: this.editDy, authcode: '019003'},
    ],
    selections: [],
    emptyMessage: '暂无数据',
    tableEvent: this.tableEvent
  };

  dialogOpts = {
    set: {
      title: '',
      visible: false,
      userId: '',
      busType: 1,
      taskList: []
    }
  }
  public selectOpts = {
    that: this,
    getName: (row) => row.taskName,//要显示的文字
    functionName:'资源任务',
    width:'220px',
    height:'330px'
  };

  /**
   *
   * @param index
   * @param item
   */

  editFb(index,item){
    this.editFbDy(index, item,1);
  }
  editDy(index, item) {
    this.editFbDy(index, item,2);
  }

  editFbDy(index, item, type) {
    var that = this;
    that.dialogOpts.set.title = '发布邮件推送';
    that.dialogOpts.set.userId = item.id;
    that.dialogOpts.set.busType = type;
    if(type == 2){
      that.dialogOpts.set.title = '订阅邮件推送';
    }
    let queryParam = {
      userId:that.dialogOpts.set.userId,
      businessType: that.dialogOpts.set.busType
    };
    this.getHttpClient().get('alertPush/queryAllByParams', queryParam, (data)=>{
      for(let task of data.list){
        task.selected = false;
        for(let selId of data.hasTaskIds){
          if(selId == task.taskId){
            task.selected = true;
            break;
          }
        }
      }
      this.dialogOpts.set.taskList = data.list; //所有的角色
      this.dialogOpts.set.visible = true;
    });
  }


  ok() {
    var that = this;
    var taskIds = [];
    that.dialogOpts.set.taskList.forEach(e => {
      if (!!e.selected) {
        taskIds.push(e.taskId);
      }
    });
    var queryParam = {
      busType:that.dialogOpts.set.busType,
      userId:that.dialogOpts.set.userId,
      taskIds: taskIds.join(",")
    };
    let busName = that.dialogOpts.set.busType == 1 ? "发布" : "订阅";
    that._HttpClient.get('sysuser/saveUserTask', queryParam, function (data) {
      if (data) {
        that.tipMessage(busName+"邮件推送修改成功！");
        that.dialogOpts.set.visible = false;
        that.flushData();
      } else {
        that.tipMessage(busName+"邮件推送修改失败！");
        that.dialogOpts.set.visible = false;
        that.flushData();
      }
    })
  }

  flushData() {
    this.tableEvent.emit({flush: true});
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
    this.flushData();
  }

  ngOnInit() {
  }

}
