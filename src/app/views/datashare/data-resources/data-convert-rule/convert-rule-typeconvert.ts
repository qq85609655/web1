import {ConvertRule} from "./convert-rule";

export class ConvertRuleTypeconvert extends ConvertRule {

  public sourceList = [];//可选择的所有字段
  public fieldList = [];//可选择的所有字段,用于界面显示
  //当前操作的列表，仅操作时有效。当前规则操作时不能直接修改data.dataList的数据，故定义俩个数组
  public dataList = [];//操作的数据列表

  typeList = [
    {label: "String", value: 'String'},
    {label: "Number", value: 'Number'},
    {label: "Date", value: 'Date'},
    {label: "Timestamp", value: 'Timestamp'},
    {label: "Integer", value: 'Integer'}
  ];

  formatList = [
     {label: "yyyy-MM-dd HH:mm:ss", value: "yyyy-MM-dd HH:mm:ss"}
    ,{label: "yyyy/MM/dd HH:mm:ss.SSS", value: "yyyy/MM/dd HH:mm:ss.SSS"}
    ,{label: "yyyy/MM/dd HH:mm:ss.SSS XXX", value: "yyyy/MM/dd HH:mm:ss.SSS XXX"}
    ,{label: "yyyy/MM/dd HH:mm:ss", value: "yyyy/MM/dd HH:mm:ss"}
    ,{label: "yyyyMMddHHmmss", value: "yyyyMMddHHmmss"}
    ,{label: "yyyy/MM/dd", value: "yyyy/MM/dd"}
    ,{label: "yyyy-MM-dd", value: "yyyy-MM-dd"}
    ,{label: "yyyy-MM-dd HH:mm:ss XXX", value: "yyyy-MM-dd HH:mm:ss XXX"}
    ,{label: "yyyyMMdd", value: "yyyyMMdd"}
    ,{label: "MM/dd/yyyy", value: "MM/dd/yyyy"}
    ,{label: "MM/dd/yyyy HH:mm:ss", value: "MM/dd/yyyy HH:mm:ss"}
    ,{label: "MM-dd-yyyy", value: "MM-dd-yyyy"}
    ,{label: "MM-dd-yyyy HH:mm:ss", value: "MM-dd-yyyy HH:mm:ss"}
    ,{label: "MM/dd/yy", value: "MM/dd/yy"}
    ,{label: "MM-dd-yy", value:"MM-dd-yy"}
    ,{label: "dd/MM/yyyy", value:"dd/MM/yyyy"}
    ,{label: "dd-MM-yyyy", value:"dd-MM-yyyy"}
    ,{label: "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", value:"yyyy-MM-dd'T'HH:mm:ss.SSSXXX"}
  ];

  public defaultData = {
    sourceField: '',
    targetField: '',
    targetType: 'String',
    format: this.formatList[0].value,
    longVal: '',
    accuracy: ''
  };

  public outputs = [];//输出字段列表
  public data = {
    dataList: [],
    outputs: this.outputs
  };

  constructor(param: any) {
    super(param, ConvertRule.Type_TypeConvert, ConvertRule.Name_TypeConvert);
    this.pushAll(this.data.dataList, param.dataList, true);
    this.pushAll(this.data.outputs, param.outputs, true);
  }

  getOutputs(): Array<any> {
    return this.outputs;
  }

  getData(): any {
    return this.data;
  }

  changeFormat(item){
    if (item.targetType == 'Date' || item.targetType == 'String' || item.targetType == 'Timestamp') {
      if(item.format == '') {
        item.format = this.formatList[0].value;
      }
    } else {
      item.format = '';
    }
  }

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
      _fields:['sourceField','targetField','longVal', 'accuracy'],
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
      },
      longVal:{
        status: false,
        msg: '',
        valids: [
          {regexp: this.regexp_natureint, msg: '请输入有效的长度,仅支持整数！',condition: (row) => row.longVal!='' }
        ]
      },
      accuracy:{
        status: false,
        msg: '',
        valids: [
          {regexp: this.regexp_natureint, msg: '请输入有效的精确度,仅支持整数！' ,condition: (row) => row.accuracy!=''}
        ]
      }
    },
    dataList:[]
  };

  open(): any {
    let obj = this.getParentOutputs();
    if (!obj.status) return false;
    this.sourceList = obj.outputs;
    this.fieldList = obj.fieldList;
    this.dataList.splice(0, this.dataList.length);
    for(let d of this.data.dataList){
      let d2 = Object.assign({}, d);
      this.dataList.push(d2);
      //如果字段已被删除，则sourceField置空
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
    if (this.data.dataList.length == 0) {
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

  onTypeConvertOk(): any {
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
    for(let d of this.dataList){
      let sourceField = d.sourceField;
      let field = this.sourceList[ this.findFieldIndex(this.sourceList, sourceField) ];
      let updateField = {
        field: d.targetField,
        ruleType: this.type,
        dataType: 'C'
      };
      if(d.targetType == 'String'){
        updateField.dataType = 'C';
      }else if(d.targetType == 'Date'){
        updateField.dataType = 'D';
      }else{
        updateField.dataType = 'N';
      }
      if(d.longVal){
        updateField['length'] = parseInt(d.longVal,10);
      }
      if(d.accuracy){
        updateField['decimalLength'] = parseInt(d.accuracy,10);
      }
      if(d.targetType == 'Integer'){
        updateField['decimalLength'] = 0;
      }
      let field2 = Object.assign({}, field, updateField);
      outs.push(field2);
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
    this._addDataRow(i, this.valid.dataList , null);
  }

  removeDataRow(i) {
    this._removeDataRow(i, this.dataList);
    this._removeDataRow(i, this.valid.dataList);
  }
}

