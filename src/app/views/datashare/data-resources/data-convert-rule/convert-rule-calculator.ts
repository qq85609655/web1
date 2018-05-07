import {ConvertRule} from "./convert-rule";

/**
 * 计算器功能
 */
export class ConvertRuleCalculator extends ConvertRule {

  public sourceList = [];//可选择的所有字段
  public fieldList = [];//可选择的所有字段,用于界面显示
  //当前操作的列表，仅操作时有效。当前规则操作时不能直接修改data.dataList的数据，故定义俩个数组
  public dataList = [];//操作的数据列表


  /**
   * 值类型
   * @type {[{label: string; value: number}]}
   */
  valueTypeList = [{label: "number", value: 1}];

  /**
   * 计算器公式
   */
  calculatorList = [
    {label: "A+B", value: 203},
    {label: "A-B", value: 204},
    {label: "A*B", value: 205},
    {label: "A/B", value: 206},
    {label: "A*A", value: 107},
    {label: "sqrt(A)", value: 108},
    {label: "100*(A/B)", value: 209},
    {label: "A-(A*B/100)", value: 210},
    {label: "A+(A*B/100)", value: 211},
    {label: "A+B+C", value: 344}
  ];

  /**
   * 默认的页面列表数据字段对应
   */
  public defaultData = {
    targetField: '',
    fieldA: '',
    fieldB: '',
    fieldC: '',
    fieldSize: 2,
    valueType: 0,
    longVal: '0',
    accuracy: '0',
    calculator: 203
  };
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
      _fields:['fieldA','fieldB','fieldC','targetField','valueType', 'longVal', 'accuracy'],
      fieldA:{
        status: false,
        msg: '',
        valids: [
          {required: true, msg: '输入字段fieldA不能为空！'},
        ]
      },
      fieldB:{
        status: false,
        msg: '',
        valids: [
          {required: true, msg: '输入字段fieldB不能为空！',condition:(data) => data.calculator >= 200},
        ]
      },
      fieldC:{
        status: false,
        msg: '',
        valids: [
          {required: true, msg: '输入字段fieldC不能为空！',condition:(data) => data.calculator >= 300},
        ]
      },
      targetField:{
        status: false,
        msg: '',
        valids: [
          {required: true, msg: '输出字段不能为空！'},
          {regexp: this.regexp_field, msg: '请输入有效的输出字段，仅支持字母数字下划线，且以字母开头！'}
        ]
      },
      longVal:{
        status: false,
        msg: '',
        valids: [
          {required: true, msg: '长度不能为空！'},
          {regexp: this.regexp_plusint, msg: '请输入有效的长度,仅支持正整数！'}
        ]
      },
      accuracy:{
        status: false,
        msg: '',
        valids: [
          {required: true, msg: '精确度不能为空！'},
          {regexp: this.regexp_natureint, msg: '请输入有效的精确度,仅支持非负整数！'}
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

  constructor(param: any,busType:any) {
    super(param, ConvertRule.Type_Calculator, ConvertRule.Name_Calculator);
    this.pushAll(this.data.dataList, param.dataList, true);
    this.pushAll(this.data.outputs, param.outputs, true);
  }

  getOutputs(): Array<any> {
    return this.outputs;
  }

  getData(): any {
    return this.data;
  }

  fieldNames=['fieldA','fieldB','fieldC'];
  open(): any {
    let obj = this.getParentOutputs();
    if (!obj.status) return false;
    this.sourceList = obj.outputs;
    this.fieldList = obj.fieldList;
    this.dataList.splice(0, this.dataList.length);
    for (let d of this.data.dataList) {
      let d2 = Object.assign({}, d);
      this.dataList.push(d2);

      for(let i=0;i<this.fieldNames.length;i++){
        let fieldName = this.fieldNames[i];
        if(d2.fieldSize >= (i+1) && this.findFieldIndex(this.sourceList, d2[fieldName]) < 0) {
            d2[fieldName] = '';
        }
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
    if (this.data.dataList.length == 0) {
      this.setError("请选择至少添加一个"+this.typeName+"操作！");
      return false;
    }
    let sources = this.getParentOutputs(false).outputs;
    for(let data of this.data.dataList){
      for(let i=0;i<this.fieldNames.length;i++){
        let fieldName = this.fieldNames[i];
        if(data.fieldSize >= (i+1) && this.findFieldIndex(sources, data[fieldName]) < 0) {
          this.setError("部分输入字段已丢失！");
          return false;
        }
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

  onCaculatorOk(): any {
    for(let data of this.dataList){
      data.fieldSize = parseInt((data.calculator / 100) +'' ,10);
    }
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
      let updateField = {
        field: d.targetField,
        ruleType: this.type,
        dataType: 'N',
        length: 0,
        decimalLength:0,
        comment:''
      };
      for(let i=0;i<this.fieldNames.length;i++){
        let fieldName = this.fieldNames[i];
        if(d.fieldSize >= (i+1) ) {
          let field = this.sourceList[this.findFieldIndex(this.sourceList, d[fieldName])];
          if(updateField.length < field.length){
            updateField.length = field.length;
          }
          if(!updateField.comment){
            updateField.comment = field.comment;
          }
        }
      }
      updateField.length = parseInt(d.longVal,10);
      updateField.decimalLength = parseInt(d.accuracy,10);
      let field3 = Object.assign({}, this.defaultField, updateField);
      outs.push(field3);
    }

    //去除多余的字段选择
    for(let data of this.dataList){
      if(data.fieldSize < 3){
        data.fieldC = '';
      }
      if(data.fieldSize < 2){
        data.fieldB = '';
      }
    }
    this.pushAll(this.outputs , outs, true);
    this.pushAll(this.data.dataList, this.dataList, true);
    this.name = this.modifyName;
    //关闭步骤界面
    this.closeRuleDetail();
    //检查本身规则，并检查后续规则
    this.checkAllAfter();
  }

  addDataRow(i) {
    this._addDataRow(i, this.dataList, this.defaultData);
    this._addDataRow(i,this.valid.dataList, null);
  }

  removeDataRow(i) {
    this._removeDataRow(i, this.dataList);
    this._removeDataRow(i, this.valid.dataList);
  }
}
