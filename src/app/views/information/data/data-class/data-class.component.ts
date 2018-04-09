import { AfterViewInit, Component, EventEmitter, OnInit } from "@angular/core";
import { BaseComponent } from "../../../../components/base/base.component";

export class DataClassComponent extends BaseComponent
  implements OnInit, AfterViewInit {
  constructor() {
    super();
    this.initSourceId(1);
  }

  public sourceId = 1;
  public tableEvent: EventEmitter<any> = new EventEmitter();
  public queryParam = {
    sourceId: 1,
    keyWord: "",
    subsetCode: "",
    classCode: ""
  };
  public queryParam2 = {
    sourceId: 1
  }

  public tableOpts = {
    that: this,
    queryMethod: "post",
    queryUrl: "datastandard/queryClassList",
    pageParam: {
      pageNum: 1,
      pageSize: 10
    }, //可使用默认值
    isPage: true, //是否分页
    defaultPageSize: 10,
    queryParam: this.queryParam2, //页面选择的查询参数，包括树节点id等信息
    bodyParam: this.queryParam, //请求体中的参数
    queryResultField: ["code"], //第一个值指定id的字段名,主要用于修改删除，状态切换
    tableType: "single", //树类型，simple/checkbox

    //混合表头的格式再定义
    //checkbox类型表示当前列显示checkbox
    //number支持俩种类型，//number：12345, numberpage加上页码后的数字：21 22 23...
    //普通的字段可支持link、format， format后续需要再增加实现
    //button表示按钮列，每一列可以多个按钮，根据options指定字段可以给多列都使用按钮
    theadOptions: [
      { name: "编号", field: "code", link: "" },
      { name: "中文名称", field: "name" },
      { name: "描述", field: "description" },
      { name: "操作", type: "button", buttonOptions: "buttonOptions" }
    ],
    //callback指定回调的方法，
    //disabled指定按钮是否禁用
    //hidden指定按钮是否隐藏
    //此三个方法参数一样,共俩个，第一个index,第二个当前行item
    buttonOptions: [
      { name: "修改", callback: this.updateData, disabled: null, hidden: null , authcode:'025003'},
      { name: "删除", callback: this.deleteData, disabled: null, hidden: null, authcode:'025004' }
    ],
    selections: [],
    emptyMessage: "暂无数据",
    tableEvent: this.tableEvent
  };

  defaultOrgData = {
    code: "",
    parentCode: "",
    name: "",
    description: "",
    tableName: ""
  };
  dialogOpts = {
    delete: {
      title: "数据类删除",
      visible: false,
      data: {}
    },
    addEdit: {
      type: "add",
      title: "数据类删除",
      visible: false,
      subsetCode: "",
      data: [this.defaultOrgData]
    }
  };
  public valid = {
    "data.$": {
      valids: [{ norepeat: "code", msg: "编号不能重复" }],
      code: {
        status: false,
        name: "编号",
        valids: [{ required: true }, { regexp: this.regexp_code }]
      },
      name: {
        status: false,
        name: "中文名称",
        valids: [{ required: true }, { regexp: this.regexp_char2, msg:"中文名称格式错误，仅支持中文字母数字！" }]
      }
    },
    data: []
  };

  defaultOption = { label: "请选择", value: "" };
  dataSubsets = [this.defaultOption];
  dataClasses = [this.defaultOption];
  ngOnInit() {}

  ngAfterViewInit() {
    this.querySubsets(() => {
      this.queryParam.subsetCode = this.dataSubsets[0].value;
      this.flushData();
    });
  }

  flushData() {
    this.tableEvent.emit({ flush: true });
  }

  initSourceId(sourceId: number) {
    this.sourceId = sourceId;
    this.queryParam.sourceId = sourceId;
    this.queryParam2.sourceId = sourceId;
  }

  querySubsets(callback?: Function) {
    var queryParam = {
      sourceId: this.sourceId,
      nodeType: 1
    };
    this.getHttpClient().get(
      "datastandard/queryDataOrgListAll",
      queryParam,
      data => {
        if (!data || data.length == 0) {
          this.dataSubsets = [this.defaultOption];
        } else {
          this.dataSubsets = this.handleVoToDropdown(data);
        }
        if (callback) {
          callback();
        }
      }
    );
  }

  addData() {
    if (this.queryParam.subsetCode == "") {
      this.tipWarnMessage("请选择有效的数据子集");
      return false;
    }
    this.dialogOpts.addEdit.subsetCode = this.queryParam.subsetCode;
    this.dialogOpts.addEdit.type = "add";
    this.dialogOpts.addEdit.title = "新增" + this.getFunctionName();
    this.dialogOpts.addEdit.data = [Object.assign({}, this.defaultOrgData)];
    this.validDataClean(this.valid, "data.$");
    this.dialogOpts.addEdit.visible = true;
  }

  updateData(index, item) {
    this.dialogOpts.addEdit.subsetCode = this.queryParam.subsetCode;
    this.dialogOpts.addEdit.type = "edit";
    this.dialogOpts.addEdit.title = "修改" + this.getFunctionName();
    this.dialogOpts.addEdit.data = [Object.assign({}, item)];
    this.validDataClean(this.valid, "data.$");
    this.dialogOpts.addEdit.visible = true;
  }

  deleteData(index, item) {
    this.dialogOpts.delete = {
      title: "数据类删除",
      visible: true,
      data: { sourceId: this.sourceId, code: item.code }
    };
  }

  deleteDataOk() {
    var url = "datastandard/deleteClassVo";
    this.getHttpClient().get(url, this.dialogOpts.delete.data, data => {
      this.tipMessage("删除" + this.getFunctionName() + "成功!");
      this.flushData();
      this.dialogOpts.delete.visible = false;
    });
  }

  addEditDataOk() {
    let flag = this.validData(this.valid, "data.$", this.dialogOpts.addEdit);
    if (!flag) return;
    //Todo 检验数据
    var url = "";
    var bodyParam: any;
    if (this.dialogOpts.addEdit.type == "add") {
      url = "datastandard/addClassVos";
      bodyParam = this.dialogOpts.addEdit.data;
    } else {
      url = "datastandard/updateClassVo";
      bodyParam = this.dialogOpts.addEdit.data[0];
    }
    var queryParam = {
      sourceId: this.sourceId,
      parentCode: this.queryParam.subsetCode
    };
    this.getHttpClient().post(url, queryParam, bodyParam, data => {
      this.tipMessage(
        (this.dialogOpts.addEdit.type == "add" ? "新增" : "修改") +
          this.getFunctionName() +
          "成功!"
      );
      this.flushData();
      this.dialogOpts.addEdit.visible = false;
    });
  }

  handleVoToDropdown(data) {
    if (!data || data.length == 0) {
      return [];
    }
    var data2 = [];
    for (let d of data) {
      data2.push({ label: d.name, value: d.code });
    }
    return data2;
  }

  addNodeRow(i) {
    this._addDataRow(i, this.dialogOpts.addEdit.data, this.defaultOrgData, 8);
  }
  removeNodeRow(i) {
    this._removeDataRow(i, this.dialogOpts.addEdit.data);
  }

  getFunctionName() {
    return this.sourceId == 1 ? "数据类" : "数据类";
  }
  getFunctionParentName() {
    return this.sourceId == 1 ? "国家数据标准" : "学校数据标准";
  }
}
