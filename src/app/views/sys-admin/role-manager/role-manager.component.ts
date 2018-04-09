import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  AfterViewInit
} from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "../../../components/http-client.service";
import { BaseComponent } from "../../../components/base/base.component";

@Component({
  selector: "app-role-manager",
  templateUrl: "./role-manager.component.html",
  styleUrls: ["./role-manager.component.css"]
})
export class RoleManagerComponent extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit {
  public treeNode: any; // 树节点
  public inputLength: any = 60; //字数长度

  constructor(public _Router: Router, public _HttpClient: HttpClient) {
    super();
  }
  // 表格
  public tableEvent: EventEmitter<any> = new EventEmitter();
  public tableEvent2: EventEmitter<any> = new EventEmitter();
  // 表格参数
  public queryParam = {
    state: -1,
    roleName: "",
    roleId: ""
  };
  public queryParam2 = {
    roleId: 0
  };

  public tableOpts2 = {
    that: this,
    queryMethod: "get",
    queryUrl: "sysuser/queryList4Role",
    pageParam: {
      pageNum: 1,
      pageSize: 10
    }, //可使用默认值
    isPage: false, //是否分页
    defaultPageSize: 10,
    queryParam: this.queryParam2, //页面选择的查询参数，包括树节点id等信息
    bodyParam: {}, //请求体中的参数
    queryResultField: ["userId"], //第一个值指定id的字段名,主要用于修改删除，状态切换
    tableType: "single", //树类型，simple/checkbox
    isColGroup: false, //是否是混合表头,rowspan colspan大于1

    //混合表头的格式再定义
    //checkbox类型表示当前列显示checkbox
    //number支持俩种类型，//number：12345, numberpage加上页码后的数字：21 22 23...
    //普通的字段可支持link、format， format后续需要再增加实现
    //button表示按钮列，每一列可以多个按钮，根据options指定字段可以给多列都使用按钮
    theadOptions: [
      { name: "序号", type: "numberpage" },
      { name: "姓名", field: "realName" },
      { name: "所属机构", field: "orgName" }
    ],
    buttonOptions: [],
    selections: [],
    emptyMessage: "暂无数据",
    tableEvent: this.tableEvent2
  };

  public tableOpts = {
    that: this,
    queryMethod: "post",
    queryUrl: "role/queryList",
    pageParam: {
      pageNum: 1,
      pageSize: 10
    }, //可使用默认值
    isPage: true, //是否分页
    defaultPageSize: 10,
    queryParam: {}, //页面选择的查询参数，包括树节点id等信息
    bodyParam: this.queryParam, //请求体中的参数
    queryResultField: ["roleId"], //第一个值指定id的字段名,主要用于修改删除，状态切换
    tableType: "single", //树类型，simple/checkbox
    isColGroup: false, //是否是混合表头,rowspan colspan大于1

    //混合表头的格式再定义
    //checkbox类型表示当前列显示checkbox
    //number支持俩种类型，//number：12345, numberpage加上页码后的数字：21 22 23...
    //普通的字段可支持link、format， format后续需要再增加实现
    //button表示按钮列，每一列可以多个按钮，根据options指定字段可以给多列都使用按钮
    theadOptions: [
      { name: "序号", type: "numberpage" },
      { name: "角色名称", field: "roleName", title: true},
      {
        name: "状态",
        field: "state",
        type: "switch",
        queryUrl: "role/updateStatus",
        queryParam: {},
        switchName: ["启用", "停用"]
      },
      { name: "说明", field: "remark" , title: true},
      { name: "授权人数", field: "ncount", link: this.seeCounts },
      { name: "操作", type: "button", buttonOptions: "buttonOptions" }
    ],
    //callback指定回调的方法，
    //disabled指定按钮是否禁用
    //hidden指定按钮是否隐藏
    //此三个方法参数一样,共俩个，第一个index,第二个当前行item
    buttonOptions: [
      { name: "修改", callback: this.editRole, authcode:'015003' },
      { name: "删除", callback: this.deleteRole , authcode:'015004'}
    ],
    selections: [],
    emptyMessage: "暂无数据",
    tableEvent: this.tableEvent
  };

  // 弹出框参数
  dialogOpts = {
    delete: {
      title: "删除",
      visible: false,
      pathParam: "",
      data: {
        roleId: 0
      }
    },
    details: {
      title: "授权人数",
      visible: false,
      dto: {
        roleName: ""
      }
    },
    addEdit: {
      isAdd: true,
      title: "",
      visible: false,
      dto: {
        roleId: "",
        roleName: "",
        remark: "",
        authList: [],
        orgList: [],
        state: 1
      }
    }
  };
  public valid = {
    dialogOpts: {
      addEdit: {
        dto: {
          roleName: {
            status: false,
            name: "角色名称",
            valids: [{ required: true }, { regexp: this.regexp_char2 }]
          }
        }
      }
    }
  };
  //树参数
  public orgTreeOpts = {
    that: this,
    queryMethod: "get",
    queryUrl: "org/orgShowTree",
    queryParam: {}, //表示query类型参数，放在?后面。后续如果需要pathParam bodyParam再调整
    functionName: "机构列表", //新增和修改框标题中的功能名称
    queryResultField: ["id", "parentId", "orgName", "children"], //查询结果对象中，需要的字段名称
    treeType: "checkbox", //树类型，simple/checkbox
    queryDataToTreeData: null, //查询数据转换为树需要的数据
    nodeSelect: this.treeNodeSelect,
    operButton: {},
    treeEvent: new EventEmitter(),
    /* 以下为checkbox模式下配置*/
    queryCheckedMethod: "get",
    queryCheckedUrl: "",
    queryCheckedParam: {},
    selectedNodeIds: []
  };
  //菜单参数
  public menuTreeOpts = {
    that: this,
    queryMethod: "get",
    queryUrl: "menu/queryMenuAuthCodes",
    queryParam: {}, //表示query类型参数，放在?后面。后续如果需要pathParam bodyParam再调整
    functionName: "机构列表", //新增和修改框标题中的功能名称
    queryResultField: ["authId", "parentId", "authName", "children"], //查询结果对象中，需要的字段名称
    treeType: "checkbox", //树类型，simple/checkbox
    queryDataToTreeData: null, //查询数据转换为树需要的数据
    nodeSelect: this.treeNodeSelect,
    operButton: {},
    treeEvent: new EventEmitter(),
    queryCheckedMethod: "get",
    queryCheckedUrl: "",
    queryCheckedParam: {},
    selectedNodeIds: []
  };
  // 下拉框数据
  public statusList = [
    { label: "全部", value: -1 },
    { label: "启用", value: 1 },
    { label: "停用", value: 0 }
  ];
  ngOnInit() {}

  ngAfterViewInit() {
    this.flushData();
  }
  // 新增编辑
  addRole() {
    this.validDataClean(this.valid, "dialogOpts");
    var that = this;
    this.menuTreeOpts.treeEvent.emit({
      flushChecked: true,
      selectedNodeIds: []
    });
    this.orgTreeOpts.treeEvent.emit({
      flushChecked: true,
      selectedNodeIds: []
    });
    that.dialogOpts.addEdit = {
      isAdd: true,
      title: "新增角色",
      visible: true,
      dto: {
        roleId: "",
        roleName: "",
        remark: "",
        authList: [],
        orgList: [],
        state: 1
      }
    };
  }

  seeCounts(index, item) {
    var that = this;
    that.dialogOpts.details = {
      title: "用户授权列表",
      visible: true,
      dto: {
        roleName: item.roleName
      }
    };
    this.queryParam2.roleId = item.roleId;
    this.tableOpts2.tableEvent.emit({ flush: true });
  }

  editRole(index, item) {
    this.validDataClean(this.valid, "dialogOpts");
    let roleId = item.roleId;
    let state = item.state;
    var that = this;
    that._HttpClient.get("role/getRoleInfoVo", { roleId: roleId }, data => {
      that.dialogOpts.addEdit.isAdd = false;
      that.dialogOpts.addEdit.title = "修改角色";
      that.dialogOpts.addEdit.dto = {
        roleId: data.roleId,
        roleName: data.roleName,
        remark: data.remark,
        authList: [],
        orgList: [],
        state: state
      };
      this.menuTreeOpts.treeEvent.emit({
        flushChecked: true,
        selectedNodeIds: data.authList
      });
      this.orgTreeOpts.treeEvent.emit({
        flushChecked: true,
        selectedNodeIds: data.orgList
      });
      that.dialogOpts.addEdit.visible = true;
    });
  }

  addEditRoleOk() {
    let flag = this.validData(this.valid, "dialogOpts");
    if (!flag) return false;
    var that = this;
    let url = that.dialogOpts.addEdit.isAdd
      ? "role/saveEntity"
      : "role/updateEntity";
    that.dialogOpts.addEdit.dto.authList = this.menuTreeOpts.selectedNodeIds;
    that.dialogOpts.addEdit.dto.orgList = this.orgTreeOpts.selectedNodeIds;
    if (
      !that.dialogOpts.addEdit.dto.authList ||
      that.dialogOpts.addEdit.dto.authList.length == 0
    ) {
      this.tipWarnMessage("可操作功能不能为空");
      return false;
    }
    if (
      !that.dialogOpts.addEdit.dto.orgList ||
      that.dialogOpts.addEdit.dto.orgList.length == 0
    ) {
      this.tipWarnMessage("可访问数据不能为空");
      return false;
    }
    that._HttpClient.post_old(url, this.dialogOpts.addEdit.dto, null, data => {
      if(data){
        that.tipMessage("操作成功！");
        that.dialogOpts.addEdit.visible = false;
        that.flushData();
      }
    });
  }

  // 刷新列表
  flushData() {
    this.tableEvent.emit({ flush: true });
  }

  // 删除
  deleteRole(index, item) {
    this.deleteRoles(item.roleId);
  }

  public deleteRoles(roleId?: number) {
    this.dialogOpts.delete.data.roleId = roleId;
    this.dialogOpts.delete.visible = true;
    return true;
  }

  // 确认删除
  deleteRoleOk() {
    let url = "role/deleteEntity";
    this._HttpClient.post(url, this.dialogOpts.delete.data, null, data => {
      this.tipMessage("角色删除成功！");
      this.dialogOpts.delete.visible = false;
      this.flushData();
    });
  }

  // 树节点
  treeNodeSelect(node) {
    this.treeNode = node;
    this.flushData();
  }
}
