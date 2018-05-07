import {ConvertRule} from "./convert-rule";

/**
 * 去除重复记录
 */

export class ConvertRuleUniquerow extends ConvertRule {

  public sourceList = [];//可选择的所有字段
  public fieldList = [];//可选择的所有字段,用于界面显示
  //当前操作的列表，仅操作时有效。当前规则操作时不能直接修改data.dataList的数据，故定义俩个数组
  public dataList = [];//操作的数据列表

  /**
   * 默认的页面列表数据字段对应
    */
  public defaultData = {
    sourceField: '',
    ignore: 0,
  };
  /**
   * 忽略大小写
   */
  ignoreList = [{label: "是", value: 1}, {label: "否", value: 0}];


  public outputs = [];//输出字段列表
  public data = {
    dataList: [],
    outputs: this.outputs
  };

  constructor(param: any,busType:any) {
    super(param, ConvertRule.Type_UniqueRows, ConvertRule.Name_UniqueRows);
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
    if(!obj.status) return false;
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
    if(this.dataList.length == 0){
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
    this.setError(null);
    return true;
  }

  onUniqurowOk(): any {
    //检查步骤名称
    let flag = this.validData(this.valid,"modifyName", this);
    if(!flag)return false;
    //检查字符串操作列表
    flag = this.validData(this.valid,"dataList.$", this);
    if(!flag)return false;

    this.pushAll(this.data.dataList, this.dataList, true);
    this.name = this.modifyName;
    //关闭步骤界面
    this.closeRuleDetail();
    this.checkAllAfter();
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
        {norepeat:'sourceField', msg:'输入字段不能重复！'}
      ],
      _fields:['sourceField'],
      sourceField:{
        status: false,
        msg: '',
        valids: [
          {required: true, msg: '输入字段不能为空！'},
        ]
      }
    },
    dataList:[]
  };

  addDataRow(i) {
    this._addDataRow(i, this.dataList, this.defaultData);
    this._addDataRow(i,this.valid.dataList , null);
  }

  removeDataRow(i) {
    this._removeDataRow(i, this.dataList);
    this._removeDataRow(i, this.valid.dataList);
  }
}
