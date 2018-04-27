import {ConvertRule} from './convert-rule';
import {EventEmitter} from '@angular/core';

/**
 * 值映射
 */
export class ConvertRuleValuemapper extends ConvertRule {

  public tableEvent: EventEmitter<any> = new EventEmitter();

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
    dataReferenced1: '',
    dataReferenced2: '',
    dataReferenced3: '',
    status: true,
    mappings: [{sourceValue: '', targetValue: ''}]
  };

  public isShow1 = false;
  public isShow2 = false;
  public isShow3 = false;

  public DataReferencedList = [{value: '', label: '请选择'}, {value: '1001', label: '干部人事管理代码'},
    {value: '1002', label: '国家标准代码'}, {value: '1003', label: '行业标准代码'}, {value: '1004', label: '学科专业资产代码'}, {
      value: '1000',
      label: '国家教育代码'
    }];

  public DataReferencedList2 = [];

  public DataReferencedList3 = [];




  public queryParam = {
    nodeId: 0
  };

  public codeTableOpts1 = {
    that: this,
    queryMethod: 'post',
    queryUrl: 'codestandard/queryCodeALL',
    pageParam: {
      pageNum: 1,
      pageSize: 8
    },//可使用默认值
    isPage: false,//是否分页
    defaultPageSize: 8,
    queryParam: this.queryParam,//页面选择的查询参数，包括树节点id等信息
    bodyParam: this.queryParam,//请求体中的参数
    queryResultField: ['codeId'],//第一个值指定id的字段名,主要用于修改删除，状态切换
    tableType: 'single',//树类型，simple/checkbox
    theadOptions: [
      {name: '编号', type: 'numberpage'},
      {name: '代码', field: 'code'},
      {name: '中文名称', field: 'name'},
      {name: '描述', field: 'description'},
    ],
    isColGroup: false, //是否是混合表头,rowspan colspan大于1
    usingCache: false,
    buttonOptions: [],
    selections: [],
    emptyMessage: '暂无数据',
    tableEvent: this.tableEvent
  };


  public show1() {
    return this.isShow1;
  }

  public show2() {
    return this.isShow2;
  }

  public show3() {
    return this.isShow3;
  }

  public change1() {
    var ref1 = this.rowData.dataReferenced1;
    console.info(ref1);
    //接着 加载2级类
    this.getHttpClient().get(
      'codestandard/queryNodesByParentId',
      {parentNode: ref1, type: 1},
      data => {
        this.DataReferencedList2 = [{value: '', label: '请选择'}];
        if (data && data.length > 0) {
          for (let d of data) {
            console.info(d.nodeId + '----' + d.name);
            this.DataReferencedList2.push({value: d.nodeId, label: d.name});
          }
          this.isShow1 = true;
          if (ref1 == '1000') {
            this.isShow2 = true;
          } else {
            this.isShow2 = false;
          }
        }
      }
    );
  }


  public change2() {
    // debugger;
    let ref2 = this.rowData.dataReferenced2;
    console.info(ref2);
    //接着 加载2级类
    this.getHttpClient().get(
      'codestandard/queryNodesByParentId',
      {parentNode: ref2, type: 2},
      data => {
       // console.info(data.length);
        if (data && data.length > 0) {
          for (let d of data) {
            console.info(d.nodeId + '----' + d.name);
            this.rowData.DataReferencedList3.push({value: d.nodeId, label: d.name});
          }
          this.isShow2= true;
        } else {//说明 此时到了最后一级  那就显示 其代码值 列表 供参考
          this.isShow3 = true;
          this.flushTable(ref2);
        }
      }
    );
  }


  public change3() {
    var ref3 = this.rowData.dataReferenced3;
    //接着 加载2级类
    this.getHttpClient().get(
      'codestandard/queryNodesByParentId',
      {parentNode: ref3, type: 3},
      data => {
        if (data != null) {
          this.isShow3 = true;
          //展示详情：
          this.queryParam.nodeId = parseInt(ref3);
          this.tableEvent.emit({flush: true});
        }
      }
    );
  }


  public flushTable(v: any) {
    console.info('ref========', v);
    this.queryParam.nodeId = parseInt(v);
    this.tableEvent.emit({flush: true});
  }


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
      defValue: {
        status: false,
        msg: '',
        valids: [
          {required: true, msg: '缺省值不能为空！'},
        ]
      },
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

  addDataRow(i) {
    this._addDataRow(i, this.rowData.mappings, {sourceValue: '', targetValue: ''});
    this._addDataRow(i, this.valid.rowData.mappings, null);

  }

  removeDataRow(i) {
    this._removeDataRow(i, this.rowData.mappings);
    this._removeDataRow(i, this.valid.rowData.mappings);
  }

}
