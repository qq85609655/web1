import {ConvertRule} from "./convert-rule";

/**
 * 列转多行
 */
export class ConvertRuleSplitfieldtorows  extends ConvertRule {

  public sourceList = [];//可选择的所有字段
  public fieldList = [];//可选择的所有字段,用于界面显示
  //当前操作的列表，仅操作时有效。当前规则操作时不能直接修改data.dataList的数据，故定义俩个数组
  public dataList = [];//操作的数据列表

  public defaultData = {
    targetField: '',
    sourceField: '',
    delimiter: '',
  };

/*
  delimiterType=[
    {label: ";", value: 0},
    {label: ";", value: 1},
    {label: ".", value: 2},
    {label: ",", value: 3},
    {label: "/", value: 4},
    {label: "?", value: 5},
    {label: "&", value: 6},
    {label: "*", value: 7},
    {label: "@", value: 8},
    {label: "#", value: 9},
    {label: "¥", value: 10},
    {label: "$", value: 11}
  ];
*/

  public valid = {
    modifyName:{
      status: false,
      msg: '',
      valids: [
        {required: true, msg: '步骤名称不能为空！'},
      ]
    },
    "dataList.$":{
      valids:[
        {norepeat:'targetField', msg:'输出字段不能重复'}
      ],
      _fields:['sourceField','targetField','delimiter'],
      sourceField:{
        status: false,
        msg: '',
        valids: [
          {required: true, msg: '输入字段不能为空！'},
        ]
      },
      targetField:{
        status: false,
        msg: '',
        valids: [
          {required: true, msg: '输出字段不能为空！'},
          {regexp: this.regexp_field, msg: '请输入有效的输出字段，仅支持字母数字下划线，且以字母开头！'}
        ]
      }
    },
    dataList:[]
  };


  public outputs = [];//输出字段列表
  public data = {
    dataList: [],
    outputs: this.outputs
  };

  constructor(param: any) {
    super(param, ConvertRule.Type_Splitfieldtorows, ConvertRule.Name_Splitfieldtorows);
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
      let d2 = Object.assign({}, d);
      this.dataList.push(d2);
      if(this.findFieldIndex(this.sourceList, d2.sourceField) < 0){
        d2.sourceField = '';
      }
    }
    if (this.dataList.length == 0) {
      this.dataList.push(Object.assign({}, this.defaultData));
    }
    this.modifyName = this.name;
    this.validDataClean(this.valid,"dataList.$");
    this.validDataClean(this.valid,"modifyName");
    return true;
  }

  close() {
    this.dataList.splice(0, this.dataList.length);
    this.sourceList.splice(0, this.sourceList.length);
  }

  public check(): boolean {
    if(this.data.dataList.length == 0){
      this.setError("请选择至少添加一个"+this.typeName+"操作！");
      return false;
    }
    let sources = this.getParentOutputs(false).outputs;
    for(let data of this.data.dataList){
      if(this.findFieldIndex(sources, data.sourceField) < 0){
        this.setError("部分输入字段已丢失！");
        return false;
      }
    }
    for(let data of this.data.dataList){
      if(this.findFieldIndex(sources, data.targetField) >= 0){
        this.setError("部分输出字段已存在！");
        return false;
      }
    }
    this.setError(null);
    return true;
  }

  onSplitfieldtorowsOk(): any {
    //检查步骤名称
    let flag = this.validData(this.valid,"modifyName", this);
    if(!flag)return false;
    //检查字符串操作列表
    flag = this.validData(this.valid,"dataList.$", this);
    if(!flag)return false;
    let targets = [];
    for(let d of this.dataList){
      targets.push(d.targetField);
    }
    //检查输出字段是否被使用过
    if(!this.checkFieldNoRepeat(targets)){
      return false;
    }
    let outs = [];
    for (let d of this.dataList) {
      let sourceField = d.sourceField;
      let field = this.sourceList[this.findFieldIndex(this.sourceList, sourceField)];
      let updateField = {
        field: d.targetField,
        ruleType: this.type,
        dataType: 'C'
      };
      let field2 = Object.assign({}, field, updateField);
      outs.push(field2);
    }

    this.pushAll(this.outputs , outs, true);
    this.pushAll(this.data.dataList, this.dataList, true);
    this.name = this.modifyName;
    //关闭步骤界面
    this.closeRuleDetail();
    //检查本身规则，并检查后续规则
    this.check();
    this.getNextRule().checkAllAfter();
  }

  addDataRow(i) {
    this._addDataRow(i, this.dataList, this.defaultData);
  }

  removeDataRow(i) {
    this._removeDataRow(i, this.dataList);
  }
}

