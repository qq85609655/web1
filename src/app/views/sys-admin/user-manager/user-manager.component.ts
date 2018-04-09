import {Component, EventEmitter, OnDestroy, OnInit} from "@angular/core";
import {BaseComponent} from "../../../components/base/base.component";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "../../../components/http-client.service";

@Component({
  selector: "app-user-manager",
  templateUrl: "./user-manager.component.html",
  styleUrls: ["./user-manager.component.css"]
})
export class UserManagerComponent extends BaseComponent  implements OnInit, OnDestroy {

  constructor(public _Router: Router, public _HttpClient: HttpClient,public _ActivatedRoute: ActivatedRoute) {
    super();
  }

  public treeNode: any;

  //树参数
  public treeOpts = {
    that: this,
    queryMethod: "get",
    expandedIndex: 0,
    queryUrl: "org/orgShowTree",
    usingCache:false,
    queryParam: {}, //表示query类型参数，放在?后面。后续如果需要pathParam bodyParam再调整
    functionName: "机构列表", //新增和修改框标题中的功能名称
    queryResultField: ["id", "parentId", "orgName", "children"], //查询结果对象中，需要的字段名称
    treeType: "single", //树类型，simple/checkbox
    queryDataToTreeData: null, //查询数据转换为树需要的数据
    nodeSelect: this.treeNodeSelect,
    operButton: {},
    treeEvent:new EventEmitter()
  };

  public sexList = [{label: "男", value: 1}, {label: "女", value: 2}];

  public statusList = [
    {label: "全部", value: -1},
    {label: "启用", value: 1},
    {label: "停用", value: 0}
  ];

  public tableEvent: EventEmitter<any> = new EventEmitter();
  public queryParam = {
    state: -1,
    orgId: 0,
    orgIds: "",
    orgName: "",
    keyWord: "",
    userId: "",
    userNo: ""
  };
  public tableOpts = {
    that: this,
    queryMethod: "post",
    queryUrl: "sysuser/queryList",
    pageParam: {
      pageNum: 1,
      pageSize: 10
    }, //可使用默认值
    isPage: true, //是否分页
    defaultPageSize: 10,
    usingCache:false,
    queryParam: {}, //页面选择的查询参数，包括树节点id等信息
    bodyParam: this.queryParam, //请求体中的参数
    queryResultField: ["userId"], //第一个值指定id的字段名,主要用于修改删除，状态切换
    tableType: "single", //树类型，simple/checkbox
    isColGroup: false, //是否是混合表头,rowspan colspan大于1

    theadOptions: [
      {name: "序号", type: "numberpage"},
      {name: "姓名(用户编号)", field: "userStr", title: true},
      {
        name: "状态",
        field: "state",
        type: "switch",
        queryUrl: "sysuser/updateStatus",
        queryParam: {},
        switchName: ["启用", "停用"],
        disabled: (index, item) => this.isThisAdmin(item)
      },
      {name: "所属机构", field: "orgName", link: "", title: true},
      {name: "创建时间", field: "createTimeStr", link: "", title: true},
      {name: "操作", type: "button", buttonOptions: "buttonOptions"}
    ],
    dataHandler: (row) => {
      row.userStr = row.realName + '(' + row.userNo + ')';
    },
    buttonOptions: [
      {
        name: "修改",
        callback: this.editUser,
        // disabled: (index, item) => this.isAdmin(item),
        authcode: "013003"
      },
      {
        name: "删除",
        callback: this.deleteUser,
        disabled: (index, item) => this.isThisAdmin(item),
        authcode: "013004"
      },
      {
        name: "授权",
        callback: this.userAuth,
        disabled: (index, item) => this.isThisAdmin(item),
        authcode: "013003"
      },
      {
        name: "重置密码",
        callback: this.resetPwd,
        // disabled: (index, item) => this.isAdmin(item),
        authcode: "013006"
      }
    ],
    selections: [],
    emptyMessage: "暂无数据",
    tableEvent: this.tableEvent
  };

  dialogOpts = {
    delete: {
      title: "删除",
      visible: false,
      pathParam: "",
      data: {
        userId: 0
      }
    },
    addEdit: {
      isAdd: true,
      title: "",
      visible: false,
      dto: {
        realName: "",
        userNo: "",
        sex: 1,
        email: "",
        orgId: 0,
        orgName: ""
      }
    },
    sq: {
      title: "",
      visible: false,
      userId: "",
      roles: []
    },
    importOut: {
      title: "导出",
      visible: false
    }
  };
  public selectOpts = {
    that: this,
    getName: (row) => row.roleName,//要显示的文字
    functionName: '角色',
    width: '220px',
    height: '330px'
  };
  public valid = {
    dialogOpts: {
      addEdit: {
        dto: {
          userNo: {
            status: false,
            msg: "",
            name: "用户编号",
            valids: [{required: true}, {regexp: this.regexp_char}]
          },
          realName: {
            status: false,
            msg: "",
            name: "姓名",
            valids: [{required: true}, {regexp: this.regexp_char}]
          },
          email: {
            status: false,
            msg: "",
            name: "邮箱",
            valids: [{required: true}, {regexp: this.regexp_email}]
          }
        }
      }
    }
  };

  ngOnInit() {
    this._ActivatedRoute.queryParams.subscribe(params => {
      if (params.back == "true") {
        this.treeOpts.usingCache = true;
        this.tableOpts.usingCache = true;
      }
    });
  }

  /**
   * 授权
   */
  userAuth(index, item) {
    this.dialogOpts.sq.title = "用户授权";
    this.dialogOpts.sq.userId = item.userId;
    this.dialogOpts.sq.title = "用户授权";

    this.getHttpClient().get("role/queryAllByUserId/" + item.userId, {}, (data) => {
      for (let role of data.list) {
        role.selected = false;
        for (let selId of data.hasRoleIds) {
          if (selId == role.roleId) {
            role.selected = true;
            break;
          }
        }
      }
      this.dialogOpts.sq.roles = data.list; //所有的角色
      this.dialogOpts.sq.visible = true;
    });
  }

  ajaxFlag = false;
  // 确认授权
  sqOk() {
    if(this.checkAjaxFlag()) return false;
    var that = this;
    var roleIds = [];
    that.dialogOpts.sq.roles.forEach(e => {
      if (!!e.selected) {
        roleIds.push(e.roleId);
      }
    });
    if (roleIds.length == 0) {
      this.tipWarnMessage("请至少选一个角色授权！");
      this.removeAjaxFlag();
      return false;
    }
    that._HttpClient.post(
      "sysuser/saveUserRole/" + that.dialogOpts.sq.userId + "/" + roleIds,
      {},
      null,
      function (data) {
        if (data) {
          that.tipMessage("用户授权成功！");
          that.dialogOpts.sq.visible = false;
          that.flushData();
        } else {
          that.tipMessage("用户授权失败！");
          that.dialogOpts.sq.visible = false;
          that.flushData();
        }
      },null, ()=>{this.removeAjaxFlag();}
    );
  }

  // 重置密码
  resetPwd(index, item) {
    let url = "sysuser/resetPwd";
    var queryParam = {
      userId: item.userId
    };
    this._HttpClient.get(url, queryParam, data => {
      this.tipMessage("用户密码重置成功，请去您的邮箱查看新密码！");
    });
  }

  // 删除
  deleteUser(index, item) {
    this.deleteUsers(item.userId);
  }

  public deleteUsers(userId?: number) {
    this.dialogOpts.delete.data.userId = userId;
    this.dialogOpts.delete.visible = true;
    return true;
  }

  // 确认删除
  deleteUserOk() {
    let url = "sysuser/deleteEntity";
    this._HttpClient.get(url, this.dialogOpts.delete.data, data => {
      this.tipMessage("用户删除成功！");
      this.dialogOpts.delete.visible = false;
      this.flushData();
    });
  }

  importUser() {
    this.saveSelectToLink(this.treeOpts.treeEvent,this.tableOpts.tableEvent,()=>{
      this._Router.navigate(["/index/sysAdmin/importUser"]);
    });
  }

  exportUser() {
    this.dialogConfirmMessage("导出用户","是否确定导出用户？",()=>{
      window.location.href = this.getBasePath() + "sysuser/userDL";
      this.tipMessage("用户导出成功！");
    });
  }

  addUsqser() {
    var that = this;
    that.validDataClean(this.valid, "dialogOpts");
    if (this.treeNode.data.nodeType != 3) {
      this.tipWarnMessage("请选择第三级组织机构节点新增用户！");
      return false;
    }
    that.dialogOpts.addEdit = {
      isAdd: true,
      title: "新增用户",
      visible: true,
      dto: {
        realName: "",
        userNo: "",
        sex: 1,
        email: "",
        orgName: this.queryParam.orgName,
        orgId: this.queryParam.orgId
      }
    };
  }

  editUser(index, item) {
    var that = this;
    that.validDataClean(this.valid, "dialogOpts");
    Object.assign(that.dialogOpts.addEdit.dto, item);
    that.dialogOpts.addEdit.isAdd = false;
    that.dialogOpts.addEdit.title = "修改用户";
    that.dialogOpts.addEdit.visible = true;
  }

  addEditUserOk() {
    if(this.checkAjaxFlag()) return false;
    let flag = this.validData(this.valid, "dialogOpts");
    if (!flag) {
      this.removeAjaxFlag();
      return false;
    }
    var that = this;
    that.dialogOpts.addEdit.dto.orgId = that.queryParam.orgId;
    let url = that.dialogOpts.addEdit.isAdd
      ? "sysuser/saveEntity"
      : "sysuser/updateEntity";
    that._HttpClient.post(url, null, this.dialogOpts.addEdit.dto, data => {
      if (data) {
        that.tipMessage("操作成功！");
        that.dialogOpts.addEdit.visible = false;
        that.flushData();
      } else {
        //that.valid.dialogOpts.addEdit.dto.userNo.status = true;
      }
    },null, ()=>{this.removeAjaxFlag();});
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
    this.queryParam.orgIds = orgNodeIds.join(",");
    this.flushData();
  }

  flushData() {
    this.tableEvent.emit({flush: true});
  }

  isThisAdmin(item) {
    if (item.userType == 1) {
      return true;
    } else {
      return false;
    }
  }
}
