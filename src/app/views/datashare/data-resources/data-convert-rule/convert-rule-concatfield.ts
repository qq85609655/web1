import {ConvertRule} from "./convert-rule";

/**
 * 合并字段
 */
export class ConvertRuleConcatfield extends ConvertRule {

  public sourceList = [];//可选择的所有字段
  public fieldList = [];//可选择的所有字段,用于界面显示
  //当前操作的列表，仅操作时有效。当前规则操作时不能直接修改data.dataList的数据，故定义俩个数组
  public dataList = [];//操作的数据列表

  public defaultData = {
    rowIndex: -1,
    targetField: '',
    status: true,
    delimiter: '',
    concatFields: [{sourceField:''},{sourceField:''}]
  };

  public rowData: any={
    rowIndex: -1,
    targetField:'',
    delimiter:'',
    concatFields: [{sourceField:''},{sourceField:''}]
  };
  public outputs = [];//输出字段列表
  public data = {
    dataList: [],
    outputs: this.outputs
  };

  constructor(param: any) {
    super(param, ConvertRule.Type_Concat, ConvertRule.Name_Concat);
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
      for(let e of d2.concatFields){
        if(this.findFieldIndex(this.sourceList, e.sourceField) < 0){
          e.sourceField='';
        }
      }
    }
    this.checkRowDatas(this.dataList, this.sourceList);
    this.rowData = this.newRowData(null);
    this.modifyName = this.name;
    this.validDataClean(this.valid,"rowData");
    this.validDataClean(this.valid,"modifyName");
    return true;
  }


  //检查行数据正确性，返回错误编号
  checkRowDatas(list:Array<any>, sourceList?: Array<any>): number {
    if(!list) return;
    if(!sourceList){
      sourceList = this.getParentOutputs(false).outputs;
    }
    let flag = 0;
    for(let row of list){
      row.status = true;
      //检查输入是否存在
      for (let f of row.concatFields){
        if(this.findFieldIndex(sourceList, f.sourceField) < 0){
          row.status = false;
          flag = flag==0 ? 1 : flag;
          break;
        }
      }
      if(!row.status) break;
      //检查输出是否不存在
      if(this.findFieldIndex(sourceList, row.targetField) >= 0){
        row.status = false;
        flag = flag==0 ? 2 : flag;
        break;
      }
    }
    //此时不检查mapping规则的是否有问题，因为其他调整，不影响concatFields的值变化
    //返回是否无错误
    return flag;
  }
  close() {
    this.dataList.splice(0, this.dataList.length);
    this.sourceList.splice(0, this.sourceList.length);
  }

  public check(): boolean {
    if (this.data.dataList.length == 0) {
      this.tipWarnMessage("请选择至少添加一个【"+this.typeName+"】操作！");
      return false;
    }
   let errorInt = this.checkRowDatas(this.data.dataList, null);
    if(errorInt > 0){
      let msg = "部分输入字段已丢弃！";
      if(errorInt == 2){
        msg = "部分输出字段已存在！";
      }
      this.setError(msg);
      return false;
    }
    this.setError(null);
    return true;
  }

  onConcatOk(): any {
    //检查操作列表
    let flag = this.validData(this.valid,"rowData", this);
    if(!flag)return false;

    //检查输出字段是否被前面的规则使用过
    let targets = [this.rowData.targetField];
    if(!this.checkFieldNoRepeat(targets)){
      return false;
    }
    let fieldIndex = this.rowData.rowIndex;
    //检查在当前规则是否被使用
    for(let i=0;i < this.dataList.length;i++){
      if(i == fieldIndex) continue;
      if(this.rowData.targetField == this.dataList[i].targetField){
        this.dialogMessage("字段["+this.rowData.targetField+"]已被当前规则其他字段合并使用！");
        return false;
      }
    }
    if(fieldIndex < 0){
      this.dataList.push(this.rowData);
    }else{
      Object.assign(this.dataList[fieldIndex] , this.rowData);
    }
    //修改的字段，状态均为成功，因为以上代码已验证完整性
    this.rowData.status = true;
    this.rowData = this.newRowData(null);
  }


  //保存当前整个规则
  onALLConcatOk(){
    //检查步骤名称
    let flag = this.validData(this.valid,"modifyName", this);
    if(!flag)return false;
    if (this.dataList.length == 0) {
      this.tipWarnMessage("请选择至少添加一个【"+ this.typeName +"】操作！");
      return false;
    }
    let outs = [];
    for (let d of this.dataList) {
      let updateField = {
        field: d.targetField,
        ruleType: this.type,
        dataType: 'C',
        comment: '',
        length: 0
      };
      //添加字段的所有长度
      for(let m of d.concatFields){
        let sourceFieldIndex = this.findFieldIndex(this.sourceList, m.sourceField);
        if(!updateField.comment){
          updateField.comment = this.sourceList[sourceFieldIndex].comment;
        }
        updateField.length += this.sourceList[sourceFieldIndex].length;
      }
      //添加分隔符长度
      updateField.length += (d.concatFields.length-1) * d.delimiter.length;
      let field2 = Object.assign({}, this.defaultField, updateField);
      outs.push(field2);
    }
    this.pushAll(this.outputs, outs, true);
    this.pushAll(this.data.dataList, this.dataList, true);
    this.name = this.modifyName;
    this.closeRuleDetail();
    this.checkAllAfter();
  }


  addDataRow(i) {
    this._addDataRow(i, this.rowData.concatFields, {sourceField:''});
    this._addDataRow(i, this.valid.rowData.concatFields, null);

  }

  removeDataRow(i) {
    this._removeDataRow(i, this.rowData.concatFields);
    this._removeDataRow(i, this.valid.rowData.concatFields);
  }

  findDataIndex(sourceField){
    let index = -1;
    sourceField = sourceField.toLowerCase();
    for(let i=0;i<this.dataList.length;i++){
      if(this.dataList[i].sourceField.toLowerCase() == sourceField){
        index = i ;
        break;
      }
    }
    return index;
  }

  public valid = {
    modifyName:{
      status: false,
      msg: '',
      valids: [
        {required: true, msg: '步骤名称不能为空！'},
      ]
    },
    rowData: {
      _fields: ['targetField', 'delimiter', "concatFields.$"],
      targetField: {
        status: false,
        msg: '',
        valids: [
          {required: true, msg: '输出字段不能为空！'},
          {regexp: this.regexp_field, msg: '请输入有效的输出字段，仅支持字母数字下划线，且以字母开头！'}
        ]
      },
      delimiter: {
        status: false,
        msg: '',
        valids: [{required: true, msg: '分隔符不能为空！'}]
      },
      "concatFields.$": {
        valids: [
          /*{norepeat: 'sourceField', msg: '输入字段不能重复！'}*/
        ],
        _fields: ['sourceField'],
        sourceField: {
          status: false,
          msg: '',
          valids: [
            {required: true, msg: '输入字段不能为空！'},
          ]
        }
      },
      concatFields: []
    }
  };


  //修改按钮
  onUpdate(item, index){
    let fieldIndex = index;
    this.validDataClean(this.valid,"rowData");
    this.validDataClean(this.valid,"modifyName");
    /*if(fieldIndex < 0){
      this.rowData = this.newRowData(null);
      this.rowData.sourceField = sourceField;
      console.log(this.rowData);
      return;
    }*/
    let d = this.dataList[fieldIndex];
    this.rowData = this.newRowData(d);
    this.rowData.rowIndex = index;
  }


  //创建一个新的row记录
  newRowData(d): any{
    if(! d ){
      d = this.defaultData;
    }
    let d2 = Object.assign({}, d);
    let concatFields = [];
    for(let vo of d2.concatFields){
      concatFields.push(Object.assign({}, vo));
    }
    d2.concatFields = concatFields;
    return d2;
  }


  //删除按钮
  onDelete(item, index){
    let fieldIndex = index;
    this.dataList.splice(index , 1);
    if(index == this.rowData.rowIndex){
      this.rowData = this.newRowData(null);
    }
  }

  cancelUpdateData(){
    this.rowData = this.newRowData(null);
  }
}
