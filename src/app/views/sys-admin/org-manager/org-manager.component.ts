import { Component, EventEmitter, OnInit } from "@angular/core";
import { BaseComponent } from "../../../components/base/base.component";
import { BaseService } from "../../../components/base/base.service";

@Component({
  selector: "app-org-manager",
  templateUrl: "./org-manager.component.html",
  styleUrls: ["./org-manager.component.css"]
})
export class OrgManagerComponent extends BaseComponent implements OnInit {
  public orgTypeList = [
    { label: "教学院系", value: 1 },
    { label: "行政机构", value: 2 }
  ];
  treeEvent = new EventEmitter();
  //树参数
  public treeOpts = {
    that: this,
    queryMethod: "get",
    expandedIndex: 0,
    queryUrl: "org/getOrgTree",
    queryParam: {}, //表示query类型参数，放在?后面。后续如果需要pathParam bodyParam再调整
    functionName: "机构列表", //新增和修改框标题中的功能名称
    queryResultField: ["id", "parentId", "orgName", "children"], //查询结果对象中，需要的字段名称
    treeType: "single", //树类型，simple/checkbox
    queryDataToTreeData: null, //查询数据转换为树需要的数据
    nodeSelect: this.treeNodeSelect,
    operButton: {
      up: {
        show: true,
        queryUrl: "org/updateSort",
        queryParam: {},
        authcode: "014005"
      },
      down: {
        show: true,
        queryUrl: "org/updateSort",
        queryParam: {},
        authcode: "014005"
      }
    },
    treeEvent: this.treeEvent
  };

  public treeNode = {
    id: "",
    orgName: "",
    nodeType: 1,
    children: []
  };

  orgDataDefault = {
    id: "",
    orgName: "",
    orgNo: "",
    orgAddress: "",
    parentId: "",
    parentName: "",
    manager: "",
    orgType: 2,
    nodeType: 0
  };
  public valid = {
    orgData: {
      orgNo: {
        status: false,
        name: "机构编号",
        valids: [{ required: true }, { regexp: this.regexp_char }]
      },
      orgName: {
        status: false,
        name: "机构名称",
        valids: [{ required: true }],
      //  valids: [{ required: true }, { regexp: this.regexp_char2 }]
      }
    }
  };
  public orgData = Object.assign({}, this.orgDataDefault);
  tableOpts = {
    type: "add", //add、edit、view
    appendAdd: false,
    canAdd: false, //是否可修改
    canEdit: false, //是否可修改
    canDelete: false //是否可修改
  };

  dialogOpts = {
    delete: {
      title: "删除机构",
      visible: false,
      data: { id: "" }
    }
  };

  constructor() {
    super();
  }

  ngOnInit() {}

  /**
   * 树节点点击事件
   * @param node
   */
  treeNodeSelect(node) {
    this.treeNode = node.data;
    //this.flushData();
    this.viewOrgData();
    this.tableOpts.appendAdd= false
  }

  //查看org数据
  viewOrgData() {
    this.tableOpts.type = "view";
    this.getHttpClient().get("org/getOrg", { id: this.treeNode.id }, data => {
      this.orgData = data;
      if (data.nodeType && data.nodeType == 1) {
        this.orgData.parentName = "无";
      }
      if (data.nodeType && data.nodeType > 1) {
        this.tableOpts.canEdit = true;
        this.tableOpts.canDelete = true;
      } else {
        this.tableOpts.canEdit = false;
        this.tableOpts.canDelete = false;
      }
      if (data.nodeType && data.nodeType < 3) {
        this.tableOpts.canAdd = true;
      } else {
        this.tableOpts.canAdd = false;
      }
    });
    this.validDataClean(this.valid, "orgData");
  }

  editOrgData() {
    this.tableOpts.type = "edit";
    this.validDataClean(this.valid, "orgData");
  }

  addOrgData() {
    this.tableOpts.type = "add";
    this.orgData = Object.assign({}, this.orgDataDefault);
    this.orgData.parentId = this.treeNode.id;
    this.orgData.parentName = this.treeNode.orgName;
    if (this.treeNode.nodeType == 1) {
      this.orgData.nodeType = 2;
    } else if (this.treeNode.nodeType == 2) {
      this.orgData.nodeType = 3;
    }
    //查询新增时，默认编号
    this.getHttpClient().get(
      "org/getNewOrgNo",
      { id: this.orgData.parentId },
      data => {
        this.orgData.orgNo = data;
      }
    );
    this.validDataClean(this.valid, "orgData");
  }

  saveOrgDataOk() {
    let flag = this.validData(this.valid, "orgData");
    if (!flag) return false;
    let url = "org/saveEntity";
    if (this.tableOpts.type == "edit") {
      url = "org/updateEntity";
    }
    this.getHttpClient().post(url, null, this.orgData, data => {
      this.tipMessage(
        "机构" + (this.tableOpts.type == "edit" ? "修改" : "新增") + "成功！"
      );
      if (!!this.tableOpts.appendAdd) {
        this.addOrgData();
        this.treeOpts.treeEvent.emit({ flush: true, noclick: true });
      } else {
        this.treeOpts.treeEvent.emit({ flush: true });
      }
    });
  }

  deleteOrgData() {
    if (
      this.treeNode.children &&
      this.treeNode.children &&
      this.treeNode.children.length > 0
    ) {
      this.tipWarnMessage("您好，该部门下有子部门或用户，请先删除子部门或用户，再进行删除！");
      return false;
    }
    this.dialogOpts.delete = {
      title: "删除机构",
      visible: true,
      data: this.orgData
    };
  }

  deleteOrgOk() {
    let url = "org/deleteEntity";
    this.getHttpClient().post(
      url,
      null,
      { id: this.dialogOpts.delete.data.id },
      data => {
        this.tipMessage("机构删除成功！");
        this.dialogOpts.delete.visible = false;
        this.treeOpts.treeEvent.emit({ flush: true });
      }
    );
  }
}
