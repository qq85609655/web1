import {Component, EventEmitter, OnInit} from '@angular/core';
import {BaseComponent} from "../../../../components/base/base.component";

export class CodeStandardComponent extends BaseComponent implements OnInit {

  constructor() {
    super();
    this.initSourceId(1);
  }

  public sourceId = 1;


  public treeNode: any;
  public treeEvent = new EventEmitter();
  public treeQueryParam = {
    sourceId: 1
  };
  public treeOpts = {
    that: this,
    queryMethod: 'get',
    expandedIndex: 0,
    queryUrl: "codestandard/queryCodeNodeTree",
    queryParam: this.treeQueryParam,//表示query类型参数，放在?后面。后续如果需要pathParam bodyParam再调整
    functionName: '代码标准',//新增和修改框标题中的功能名称
    queryResultField: ['code', 'parentCode', 'name', 'children'],//查询结果对象中，需要的字段名称
    treeType: 'single',//树类型，simple/checkbox
    nodeSelect: this.treeNodeSelect,
    operButton: {
      add: {
        show: true,
        callback: this.addNodeData,
        disabled: (node) => node.data.nodeType >= 2
      },
      edit: {
        show: true,
        callback: this.updateNodeData,
        disabled: (node) => node.data.nodeType == 0
      },
      delete: {
        show: true,
        callback: this.deleteNodeData,
        disabled: (node) => node.data.nodeType == 0
      }
    },
    treeEvent: this.treeEvent
  };

  public tableEvent: EventEmitter<any> = new EventEmitter();
  public queryParam = {
    sourceId: 1,
    keyWord: '',
    nodeId: 0,
    nodeType: 0
  };
  public queryParam2 = {
    sourceId: 1
  }

  public tableOpts = {
    that: this,
    queryMethod: 'post',
    queryUrl: "codestandard/queryCodeList",
    pageParam: {
      pageNum: 1,
      pageSize: 10
    },//可使用默认值
    isPage: true,//是否分页
    defaultPageSize: 10,
    queryParam: this.queryParam2,//页面选择的查询参数，包括树节点id等信息
    bodyParam: this.queryParam,//请求体中的参数
    queryResultField: ['codeId'],//第一个值指定id的字段名,主要用于修改删除，状态切换
    tableType: 'single',//树类型，simple/checkbox

    //混合表头的格式再定义
    //checkbox类型表示当前列显示checkbox
    //number支持俩种类型，//number：12345, numberpage加上页码后的数字：21 22 23...
    //普通的字段可支持link、format， format后续需要再增加实现
    //button表示按钮列，每一列可以多个按钮，根据options指定字段可以给多列都使用按钮
    theadOptions: [
      {name: '编号', type: 'numberpage'},
      {name: '代码', field: 'code'},
      {name: '中文名称', field: 'name'},
      {name: '所属代码类', field: 'nodeName'},
      {name: '描述', field: 'description'},
      {name: '操作', type: 'button', buttonOptions: 'buttonOptions'}
    ],
    //callback指定回调的方法，
    //disabled指定按钮是否禁用
    //hidden指定按钮是否隐藏
    //此三个方法参数一样,共俩个，第一个index,第二个当前行item
    buttonOptions: [
      {name: '修改', callback: this.updateData, disabled: null, hidden: null, authcode: ''},
      {name: '删除', callback: this.deleteData, disabled: null, hidden: null, authcode: ''},
    ],
    selections: [],
    emptyMessage: '暂无数据',
    tableEvent: this.tableEvent
  };


  defaultNodeData = {
    nodeId: 0,
    parentnodeId: 0,
    parentnodeName: '',
    code: '',
    name: '',
    description: '',
    nodeType: 0
  };
  defaultData = {
    codeId: 0,
    nodeId: 0,
    nodeName: '',
    code: '',
    name: '',
    description: ''
  };
  dialogOpts = {
    delete: {
      title: '数据类删除',
      visible: false,
      data: {}
    },
    deleteNode: {
      title: '数据类删除',
      visible: false,
      data: {}
    },
    addEdit: {
      type: 'add',
      title: '数据类删除',
      visible: false,
      nodeId: 0,
      nodeName: '',
      data: [this.defaultData]
    },
    addEditNode: {
      type: 'add',
      title: '数据类删除',
      visible: false,
      parentnodeId: 0,
      parentnodeName: '',
      addNodeType: 0,
      data: [this.defaultNodeData]
    }
  }
  public validtree = {
    "data.$": {
      valids: [{norepeat: "code", msg: "编号不能重复"}],
      code: {
        status: false,
        name: "代码类编号",
        valids: [{required: true}]
      },
      name: {
        status: false,
        name: "名称",
        valids: [{required: true}]
      }
    },
    data: []
  };
  public valid = {
    "data.$": {
      valids: [{norepeat: "code", msg: "编号不能重复"}],
      code: {
        status: false,
        name: "代码",
        valids: [{required: true}, {regexp: this.regexp_code}]
      },
      name: {
        status: false,
        name: "名称",
        valids: [{required: true}]
      }
    },
    data: []
  };

  ngOnInit() {

  }

  initSourceId(sourceId: number) {
    this.sourceId = sourceId;
    this.queryParam.sourceId = sourceId;
    this.queryParam2.sourceId = sourceId;
    this.treeQueryParam.sourceId = sourceId;
    this.tableOpts.buttonOptions[0].authcode = this.getAuthcode(3);
    this.tableOpts.buttonOptions[1].authcode = this.getAuthcode(4);
  }

  private authcodes = [['', '', '032002', '032003', '032004'], ['', '', '033002', '033003', '033004']];

  getAuthcode(oper: number): string {
    return this.authcodes[this.queryParam.sourceId - 1][oper];
  }

  /**
   * 树节点点击事件
   * @param node
   */
  treeNodeSelect(node) {
    this.treeNode = node;
    this.queryParam.nodeId = node.data.nodeId;
    this.queryParam.nodeType = node.data.nodeType;
    this.flushData();
  }

  /*** 修改树节点代码类信息  ***/
  addNodeData(node) {
    this.dialogOpts.addEditNode = {
      type: 'add',
      title: '新增代码类',
      visible: true,
      parentnodeId: node.data.nodeId,
      parentnodeName: node.data.name,
      addNodeType: node.data.nodeType + 1,
      data: [Object.assign({}, this.defaultNodeData)]
    };
    this.validDataClean(this.validtree, "data.$");
  }

  updateNodeData(node) {
    this.dialogOpts.addEditNode = {
      type: 'edit',
      title: '修改代码类',
      visible: true,
      parentnodeId: node.parent.data.nodeId,
      parentnodeName: node.parent.data.name,
      addNodeType: 0,
      data: [Object.assign({}, node.data)]
    };
    this.validDataClean(this.validtree, "data.$");
  }

  addEditNodeDataOk() {
    let flag = this.validData(this.validtree, "data.$", this.dialogOpts.addEditNode);
    if (!flag) return;
    //Todo 检验数据
    var url = "";
    var bodyParam: any;
    let queryParam = {
      sourceId: this.sourceId,
      nodeId: this.dialogOpts.addEditNode.parentnodeId
    };
    if (this.dialogOpts.addEditNode.type == 'add') {
      url = "codestandard/addNodeVos";
      bodyParam = this.dialogOpts.addEditNode.data;
      for (let d of bodyParam) {
        d.nodeType = this.dialogOpts.addEditNode.addNodeType;
      }
    } else {
      url = "codestandard/updateNodeVo";
      bodyParam = this.dialogOpts.addEditNode.data[0];
    }
    this.getHttpClient().post(url, queryParam, bodyParam, (data) => {
      this.tipMessage((this.dialogOpts.addEditNode.type == 'add' ? "新增" : "修改") + "代码类成功!");
      this.dialogOpts.addEditNode.visible = false;
      this.flushData();
      this.treeOpts.treeEvent.emit({flush: true});
    });
  }

  deleteNodeData(node) {
    if (node.children && node.children.length > 0) {
      this.tipWarnMessage("当前节点存在下级代码类，不能删除！");
      return;
    }

    this.dialogOpts.deleteNode = {
      title: '代码类删除',
      visible: true,
      data: {sourceId: this.sourceId, nodeId: node.data.nodeId}
    };
  }

  deleteNodeDataOk() {
    var url = "codestandard/deleteNodeVo";
    this.getHttpClient().get(url, this.dialogOpts.deleteNode.data, (data) => {
      this.tipMessage("删除代码类成功!");
      this.dialogOpts.deleteNode.visible = false;
      this.flushData();
      this.treeOpts.treeEvent.emit({flush: true});
    });
  }

  /*** 修改列表代码信息  ***/
  addData() {
    if (this.treeNode.data.nodeType != 2) {
      this.tipWarnMessage("请选择第三级代码分类节点新增代码数据！");
      return;
    }
    this.dialogOpts.addEdit.type = 'add';
    this.dialogOpts.addEdit.title = '新增' + this.getFunctionName();
    this.dialogOpts.addEdit.data = [Object.assign({}, this.defaultData)];
    this.dialogOpts.addEdit.nodeId = this.treeNode.data.nodeId;
    this.dialogOpts.addEdit.nodeName = this.treeNode.data.name;
    this.validDataClean(this.valid, "data.$");
    this.dialogOpts.addEdit.visible = true;
  }

  updateData(index, item) {
    this.dialogOpts.addEdit.type = 'edit';
    this.dialogOpts.addEdit.title = '修改' + this.getFunctionName();
    this.dialogOpts.addEdit.data = [Object.assign({}, item)];
    this.dialogOpts.addEdit.nodeId = item.nodeId;
    this.dialogOpts.addEdit.nodeName = item.nodeName;
    this.validDataClean(this.valid, "data.$");
    this.dialogOpts.addEdit.visible = true;
  }

  addEditDataOk() {
    let flag = this.validData(this.valid, "data.$", this.dialogOpts.addEdit);
    if (!flag) return;
    //Todo 检验数据
    var url = "";
    var bodyParam: any;
    if (this.dialogOpts.addEdit.type == 'add') {
      url = "codestandard/addCodeVos";
      bodyParam = this.dialogOpts.addEdit.data;
    } else {
      url = "codestandard/updateCodeVo";
      bodyParam = this.dialogOpts.addEdit.data[0];
    }
    let queryParam = {
      sourceId: this.sourceId,
      nodeId: this.dialogOpts.addEdit.nodeId
    };
    this.getHttpClient().post(url, queryParam, bodyParam, (data) => {
      this.tipMessage((this.dialogOpts.addEdit.type == 'add' ? "新增" : "修改") + this.getFunctionName() + "成功!");
      this.dialogOpts.addEdit.visible = false;
      this.flushData();

    });
  }

  deleteData(index, item) {
    this.dialogOpts.delete = {
      title: this.getFunctionName() + '删除',
      visible: true,
      data: {sourceId: this.sourceId, codeId: item.codeId}
    };
  }

  deleteDataOk() {
    var url = "codestandard/deleteCodeVo";
    this.getHttpClient().get(url, this.dialogOpts.delete.data, (data) => {
      this.tipMessage("删除" + this.getFunctionName() + "成功!");
      this.flushData();
      this.dialogOpts.delete.visible = false;
    });
  }


  addDataRow(i) {
    this._addDataRow(i, this.dialogOpts.addEdit.data, this.defaultData, 8);
  }

  removeDataRow(i) {
    this._removeDataRow(i, this.dialogOpts.addEdit.data);
  }

  addNodeDataRow(i) {
    this._addDataRow(i, this.dialogOpts.addEditNode.data, this.defaultNodeData, 8);
  }

  removeNodeDataRow(i) {
    this._removeDataRow(i, this.dialogOpts.addEditNode.data);
  }

  getFunctionName() {
    return this.sourceId == 1 ? '国家标准代码' : '数据字典';
  }

  flushData() {
    this.tableEvent.emit({flush: true});
  }
}

