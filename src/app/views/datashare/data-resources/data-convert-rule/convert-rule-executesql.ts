import {ConvertRule} from './convert-rule';

/**
 * 执行sql脚本
 */
export class ConvertRuleExecuteSql extends ConvertRule {

  public sourceList = [];//可选择的所有字段
  public fieldList = [];//可选择的所有字段,用于界面显示
  //当前操作的列表，仅操作时有效。当前规则操作时不能直接修改data.dataList的数据，故定义俩个数组
  public dataList = [];//操作的数据列表

  public defaultData = {
    sqlStr: '',
    rowIndex: -1,
    status: true,
    paramFields: [{sourceField: ''}, {sourceField: ''}]
  };

  public rowData: any = {
    rowIndex: -1,
    sqlStr: '',
    paramFields: [{sourceField: ''}, {sourceField: ''}]
  };


  public valid = {
    modifyName: {
      status: false,
      msg: '',
      valids: [
        {required: true, msg: '步骤名称不能为空！'},
      ]
    },
    rowData: {
      _fields: ['sqlStr', 'paramFields.$'],
      'paramFields.$': {
        valids: [],
        _fields: ['sourceField'],
        sourceField: {
          status: false,
          msg: '',
          valids: [
            {required: false, msg: ''},
          ]
        }
      },
      paramFields: [],
      sqlStr: {
        status: false,
        msg: '',
        valids: [
          {required: true, msg: 'sql 脚本不能为空！！'}
        ]
      }
    }
  };


  //修改按钮
  onUpdate(item, index) {
    let fieldIndex = index;
    this.validDataClean(this.valid, 'rowData');
    this.validDataClean(this.valid, 'modifyName');
    let d = this.dataList[fieldIndex];
    this.rowData = this.newRowData(d);
    this.rowData.rowIndex = index;
  }


  //删除按钮
  onDelete(item, index) {
    this.dataList.splice(index, 1);
    if (index == this.rowData.rowIndex) {
      this.rowData = this.newRowData(null);
    }
  }

  cancelUpdateData() {
    this.rowData = this.newRowData(null);
  }


  public outputs = [];//输出字段列表
  public data = {
    dataList: [],
    outputs: this.outputs
  };

  constructor(param: any) {
    super(param, ConvertRule.Type_ExecuteSql, ConvertRule.Name_ExecuteSql);
    this.pushAll(this.data.dataList, param.dataList, true);
    this.pushAll(this.data.outputs, param.outputs, true);
  }

  addDataRow(i) {
    this._addDataRow(i, this.rowData.paramFields, {sourceField: ''});
    this._addDataRow(i, this.valid.rowData.paramFields, null);

  }

  removeDataRow(i) {
    this._removeDataRow(i, this.rowData.paramFields);
    this._removeDataRow(i, this.valid.rowData.paramFields);
  }


  getOutputs(): Array<any> {
    return this.outputs;
  }

  getData(): any {
    return this.data;
  }


  onExecuteOk(): any {
    //检查操作列表
    let flag = this.validData(this.valid, 'rowData', this);
    if (!flag) return false;
    let fieldIndex = this.rowData.rowIndex;
    if (fieldIndex < 0) {
      this.dataList.push(this.rowData);
    } else {
      Object.assign(this.dataList[fieldIndex], this.rowData);
    }
    //修改的字段，状态均为成功，因为以上代码已验证完整性
    this.rowData.status = true;
    this.rowData = this.newRowData(null);
  }

  onAllExecuteOk(): any {
    //检查步骤名称
    let flag = this.validData(this.valid, 'modifyName', this);
    if (!flag) return false;
    if (this.dataList.length == 0) {
      this.tipWarnMessage('请选择至少添加一个【' + this.typeName + '】操作！');
      return false;
    }
    let outs = [];
    this.pushAll(this.outputs, outs, true);
    this.pushAll(this.data.dataList, this.dataList, true);
    this.name = this.modifyName;
    this.closeRuleDetail();
    this.checkAllAfter();
  }


  //创建一个新的row记录
  newRowData(d): any {
    if (!d) {
      d = this.defaultData;
    }
    let d2 = Object.assign({}, d);
    let paramFields = [];
    for (let vo of d2.paramFields) {
      paramFields.push(Object.assign({}, vo));
    }
    d2.paramFields = paramFields;
    return d2;
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
      for (let e of d2.paramFields) {
        if (this.findFieldIndex(this.sourceList, e.sourceField) < 0) {
          e.sourceField = '';
        }
      }
    }
    this.checkRowDatas(this.dataList, this.sourceList);
    this.rowData = this.newRowData(null);
    this.modifyName = this.name;
    this.validDataClean(this.valid, 'rowData');
    this.validDataClean(this.valid, 'modifyName');
    return true;
  }

  close() {
    this.dataList.splice(0, this.dataList.length);
    this.sourceList.splice(0, this.sourceList.length);
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
      for (let f of row.paramFields) {
        if (this.findFieldIndex(sourceList, f.sourceField) < 0) {
          row.status = false;
          flag = flag == 0 ? 1 : flag;
          break;
        }
      }
      if (!row.status) break;
    }
    //此时不检查mapping规则的是否有问题，因为其他调整，不影响paramFields的值变化
    //返回是否无错误
    return flag;
  }


  public check(): boolean {
    if (this.data.dataList.length == 0) {
      this.setError('请选择至少添加一个' + this.typeName + '操作！');
      return false;
    }
    //检验脚本是否为空
    // 输入参数可以为空
    for (let data of this.data.dataList) {
      if (data.sqlStr.length == 0) {
        this.setError('sql 脚本不能为空！');
        return false;
      }
    }
    this.setError(null);
    return true;
  }


}

