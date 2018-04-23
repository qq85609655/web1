import {ConvertRule} from './convert-rule';
import {EventEmitter} from '@angular/core';

/**
 * 值映射
 */
export class ConvertRuleValuemapper extends ConvertRule {

  public sourceList = [];//可选择的所有字段
  public fieldList = [];//可选择的所有字段,用于界面显示
  //当前操作的列表，仅操作时有效。当前规则操作时不能直接修改data.dataList的数据，故定义俩个数组
  public dataList = [];//操作的数据列表

  public rowData: any = {
    sourceField: '',
    targetField: '',
    mappings: [{sourceValue: '', targetValue: ''}]
  };

  public defaultData = {
    sourceField: '',
    targetField: '',
    defValue: '',
    status: true,
    mappings: [{sourceValue: '', targetValue: ''}]
  };


  public outputs = [];//输出字段列表
  public data = {
    dataList: [],
    outputs: this.outputs
  };

  constructor(param: any) {
    super(param, ConvertRule.Type_ValueMapper, ConvertRule.Name_ValueMapper);
    this.pushAll(this.data.dataList, param.dataList, true);
    this.pushAll(this.data.outputs, param.outputs, true);
  }

  getOutputs(): Array<any> {
    return this.outputs;
  }

  getData(): any {
    return this.data;
  }

  open(): any {
    let obj = this.getParentOutputs();
    if (!obj.status) return false;
    this.sourceList = obj.outputs;
    this.fieldList = obj.fieldList;
    this.dataList.splice(0, this.dataList.length);
    for (let d of this.data.dataList) {
      let d2 = this.newRowData(d);
      this.dataList.push(d2);
      //如果字段已被删除，则sourceField置空
      if (this.findFieldIndex(this.sourceList, d2.sourceField) < 0) {
        d2.sourceField = '';
      }
    }
    this.checkRowDatas(this.dataList, this.sourceList);
    this.rowData = this.newRowData(null);
    this.modifyName = this.name;
    this.validDataClean(this.valid, 'rowData');
    this.validDataClean(this.valid, 'modifyName');
    return true;
  }

  //创建一个新的row记录
  newRowData(d): any {
    if (!d) {
      d = this.defaultData;
    }
    let d2 = Object.assign({}, d);
    let mappings = [];
    for (let vo of d2.mappings) {
      mappings.push(Object.assign({}, vo));
    }
    d2.mappings = mappings;
    return d2;
  }

  close() {
    this.dataList.splice(0, this.dataList.length);
    this.sourceList.splice(0, this.sourceList.length);
  }

  //修改按钮
  onUpdate(sourceField) {
    let fieldIndex = this.findDataIndex(sourceField);
    this.validDataClean(this.valid, 'rowData');
    this.validDataClean(this.valid, 'modifyName');
    if (fieldIndex < 0) {
      this.rowData = this.newRowData(null);
      this.rowData.sourceField = sourceField;
      console.log(this.rowData);
      return;
    }
    let d = this.dataList[fieldIndex];
    this.rowData = this.newRowData(d);
  }

  //删除按钮
  onDelete(sourceField) {
    let fieldIndex = this.findDataIndex(sourceField);
    if (fieldIndex < 0) {
      return;
    }
    this.dataList.splice(fieldIndex, 1);
  }

  //检查行数据正确性，返回错误编号
  checkRowDatas(list: Array<any>, sourceList?: Array<any>): number {
    if (!list) return;
    if (!sourceList) {
      sourceList = this.getParentOutputs(false).outputs;
    }
    let flag = 0;
    for (let row of list) {
      row.status = true;
      //检查输入是否存在
      if (this.findFieldIndex(sourceList, row.sourceField) < 0) {
        row.status = false;
        flag = flag == 0 ? 1 : flag;
        break;
      }
      //检查输入是否不存在
      if (this.findFieldIndex(sourceList, row.targetField) >= 0) {
        row.status = false;
        flag = flag == 0 ? 2 : flag;
        break;
      }
    }
    //此时不检查mapping规则的s是否有问题，因为其他调整，不影响mappings的值变化
    //返回是否无错误
    return flag;
  }

  findDataIndex(sourceField) {
    let index = -1;
    sourceField = sourceField.toLowerCase();
    for (let i = 0; i < this.dataList.length; i++) {
      if (this.dataList[i].sourceField.toLowerCase() == sourceField) {
        index = i;
        break;
      }
    }
    return index;
  }


  public check(): boolean {
    if (this.data.dataList.length == 0) {
      this.setError('请选择至少添加一个' + this.typeName + '操作！');
      return false;
    }
    let sources = this.getParentOutputs(false).outputs;
    for (let data of this.data.dataList) {
      if (this.findFieldIndex(sources, data.sourceField) < 0) {
        this.setError('部分输入字段已丢失！');
        return false;
      }
    }
    for (let data of this.data.dataList) {
      if (this.findFieldIndex(sources, data.targetField) >= 0) {
        this.setError('部分输出字段已存在！');
        return false;
      }
    }
    this.setError(null);
    return true;
  }

  //当做操作的行数据保存
  onMapperOk(): any {
    //检查操作列表
    let flag = this.validData(this.valid, 'rowData', this);
    if (!flag) return false;
    let sourceField = this.rowData.sourceField;

    //检查输出字段是否被前面的规则使用过
    if (!this.checkFieldNoRepeat([this.rowData.targetField])) {
      return false;
    }
    let fieldIndex = this.findDataIndex(sourceField);
    //检查在当前规则是否被使用
    for (let i = 0; i < this.dataList.length; i++) {
      if (i == fieldIndex) continue;
      if (this.dataList[i].targetField == this.rowData.targetField) {
        this.dialogMessage('字段[' + this.rowData.targetField + ']已被当前规则其他映射关系使用！');
        return false;
      }
    }
    if (fieldIndex < 0) {
      this.dataList.push(this.rowData);
    } else {
      Object.assign(this.dataList[fieldIndex], this.rowData);
    }
    //修改的字段，状态均为成功，因为以上代码已验证完整性
    this.rowData.status = true;
    this.rowData = this.newRowData(null);
  }

  //保存当前整个规则
  onAllMappingOk() {
    //检查步骤名称
    let flag = this.validData(this.valid, 'modifyName', this);
    if (!flag) return false;
    if (this.dataList.length == 0) {
      this.tipWarnMessage('请选择至少添加一个字段的值映射操作！');
      return false;
    }
    let outs = [];
    for (let d of this.dataList) {
      let sourceField = d.sourceField;
      let field = this.sourceList[this.findFieldIndex(this.sourceList, sourceField)];
      let updateField = {
        field: d.targetField,
        ruleType: this.type,
        dataType: 'C',
        length: 0
      };
      //计算字段长度
      if (d.defValue.length > updateField.length) {
        updateField.length = d.defValue.length;
      }
      for (let m of d.mappings) {
        if (m.targetValue.length > updateField.length) {
          updateField.length = m.targetValue.length;
        }
      }
      let field2 = Object.assign({}, field, updateField);
      outs.push(field2);
    }
    this.pushAll(this.outputs, outs, true);
    this.pushAll(this.data.dataList, this.dataList, true);
    this.name = this.modifyName;
    this.closeRuleDetail();
    this.checkAllAfter();
  }

  public valid = {
    modifyName: {
      status: false,
      msg: '',
      valids: [
        {required: true, msg: '步骤名称不能为空！'},
      ]
    },
    rowData: {
      _fields: ['sourceField', 'targetField', 'mappings.$'],
      sourceField: {
        status: false,
        msg: '',
        valids: [
          {required: true, msg: '输入字段不能为空！'},
        ]
      },
      targetField: {
        status: false,
        msg: '',
        valids: [
          {required: true, msg: '输出字段不能为空！'},
          {regexp: this.regexp_field, msg: '请输入有效的输出字段，仅支持字母数字下划线，且以字母开头！'}
        ]
      },
      /*defValue: {
        status: false,
        msg: '',
        valids: [
          {required: true, msg: '缺省值不能为空！'},
        ]
      },*/
      'mappings.$': {
        valids: [
          {norepeat: 'sourceValue', msg: '源值不能重复'}
        ],
        _fields: ['sourceValue', 'targetValue'],
        sourceValue: {
          status: false,
          msg: '',
          valids: [
            {required: true, msg: '源值不能为空！'},
          ]
        },
        targetValue: {
          status: false,
          msg: '',
          valids: [
            {required: true, msg: '目标值不能为空！'}
          ]
        }
      },
      mappings: []
    }
  };

  public tableEvent: EventEmitter<any> = new EventEmitter();

  showCode = {
    BigCodeType: '',
    SecondCodeType: '',
    DetailCode: [{
      code: '',
      name: ''
    }
    ],
    title: '查询标准代码',
    visible: false,
    pathParam: ''
  };

  showCodes() {
    this.showCode.visible = true;
  }


  public treeNode: any;
  public treeEvent = new EventEmitter();
  public treeQueryParam = {
    parentId: 1
  };
  public treeOpts = {
    that: this,
    queryMethod: 'get',
    expandedIndex: 0,
    queryUrl: "codestandard/queryCodeNodeTree2",
    queryParam: this.treeQueryParam,//表示query类型参数，放在?后面。后续如果需要pathParam bodyParam再调整
    functionName: '代码标准',//新增和修改框标题中的功能名称
    queryResultField: ['code', 'parentCode', 'name', 'children'],//查询结果对象中，需要的字段名称
    treeType: 'single',//树类型，simple/checkbox
    nodeSelect: '',
    operButton: {
    },
    treeEvent: this.treeEvent
  };


  addDataRow(i) {
    this._addDataRow(i, this.rowData.mappings, {sourceValue: '', targetValue: ''});
    this._addDataRow(i, this.valid.rowData.mappings, null);

  }

  removeDataRow(i) {
    this._removeDataRow(i, this.rowData.mappings);
    this._removeDataRow(i, this.valid.rowData.mappings);
  }
}
