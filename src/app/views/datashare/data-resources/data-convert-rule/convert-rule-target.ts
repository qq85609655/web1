import {ConvertRuleSource} from './convert-rule-source';

export class ConvertRuleTarget extends ConvertRuleSource {

  public conditionss = [];
  public mappings: any = [];
  public updates: any = [];
  public sourceFieldList = [];
  public targetFieldList = [];


  updateTypeList =
    [
      {label: '请选择', value: 0},
      {label: '全表插入', value: 1},
      // {label: '按照主键更新插入', value: 2},
      {label: '自定义更新条件', value: -1}
    ];
//订阅的时候 需要针对第三方库的表 来生成主键
  // 如果第三方表 主键是int 递增 那么 我们这么需要插入null 即可
  //如果第三方表主键是varchar
  // 需要用户自己来配置： 根据主键的长度来决定生成的 uuid 的长度
  keyCreateList = [
    {lable: '系统生成uuid', value: 0},
    {lable: '插入null', value: 1},
  ];

  public primaryFlagList = [{value: 'N', label: '否'}, {value: 'Y', label: '是'}];


  public maxMappingLength = 50;
  public initMappingLength = 10;
  public hasPrimarykey = false;

  public defaultData = {
    sourceField: '',
    targetField: '',
    sourceType: '',
    targetType: '',
    source: {},
    target: {},
    status: 0,
    primaryFlag: 'N' //默认为否
  };


  public defaultUpdateData = {
    sourceField: '',
    targetField: '',
    updateType: 1,
    primaryFlag: 'N'
  };


  // public dialogOpts = {
  //   updateDict: {
  //     title: '自定义更新条件',
  //     visible: false,
  //     fieldList: [],
  //     typeList: []
  //   }
  // };


  public getData() {
    // debugger;
    let conditions = [];
    //alert(this.data.updateType);
    if (this.data.updateType == -1) {
      for (let t of this.data.mappings) {
        // if (t.target.primarykey == 1) {
        //   conditions.push({sourceField: t.sourceField, targetField: t.targetField, keyCondition: '='});
        //   }else {
        if (t.primaryFlag == 'Y' && this.data.updateType != -1) {
          conditions.push({sourceField: t.sourceField, targetField: t.targetField, keyCondition: '='});
        }
        // }
      }
    }


    return {data: Object.assign({}, this.data, {conditions: conditions}), targetList: this.targetList};
  }


  /**
   * 此处加上一列 为的是 将 这一行的源字段与目标字段作为更新条件 的 condition ==  此时就不需要用主键来更新了
   * （如果勾选了 任意一个字段为是的话 就需要废掉主键更新了）
   * 每一次 change 都需要刷新condition
   * @param index
   */
  /*setPrimaryKey(index) {
    alert('index=====' + index);
    let row = this.mappings[index];
    let sourceField = row.sourceField;
    let targetField = row.targetField;

    alert('sourceField=====' + sourceField);
    alert('targetField=====' + targetField);

    if (sourceField == '') {
      this.tipWarnMessage('请选择源字段');
      return false;
    }

    if (targetField == '') {
      this.tipWarnMessage('请选择目标字段');
      return false;
    }
    let primaryKeyFlag = row.primaryFlag;
    alert(primaryKeyFlag);
    if (primaryKeyFlag == 'Y') {
      this.conditionss.push({sourceField: sourceField, targetField: targetField, keyCondition: '='});
    }else{

    }
    return true;
  }*/

  /*onUpdateDictOk() {
    debugger;
    for (let d of this.updates) {
      let sourceField = d.sourceField;
      let targetField = d.targetField;
      if (sourceField == '' || targetField == '') {
        this.tipWarnMessage('请选择');
        return false;
      }
    }
    this.pushAll(this.data.conditions, this.updates, true);
    this.dialogOpts.updateDict.visible = false;
    return true;
  }*/

  /* closeUpdateDict() {
     //this.data.conditions=[];
     this.pushAll(this.data.conditions, this.updates, true);
     this.dialogOpts.updateDict.visible = false;
     this.data.updateType = 0;
   }*/


  /*  compileTypes = [{label: '>', value: '>'}, {label: '<', value: '<'}, {label: '=', value: '='}, {
      label: '>=',
      value: '>='
    }, {label: '<=', value: '<='}];*/

  /*
    private String field;//字段名称
    private String comment;//注释
    private String dataType;//数据类型
    private int length;//总长度
    private int decimalLength = 0;//小数长度，根据实际情况，后续考虑是否使用
    private int primarykey;//0非主键，1主键
    private int nullable;//0不可空，1可空
    private int ruleType = 1;//规则类型,数据来源类型
   */

  constructor(param: any) {
    super(param);
    this.initRule();
    // this.initCondition(param);

  }

  // initCondition(param: any) {
  //  debugger;
  //  console.info(param.data.conditions);
  // }

  protected isSource() {
    return false;
  }


  public getOutputs() {
    //无输出
    return [];
  }

  open() {
    let obj = this.getParentOutputs();
    if (!obj.status) return false;
    this.sourceList = obj.outputs;
    this.sourceFieldList = obj.fieldList;
    if (!this.targetList || this.targetList.length <= 0) {
      this.tipWarnMessage('请选择有效的目标表！');
      return false;
    }
    this.targetFieldList = this.packFieldOptions(this.targetList, this);
    for (let d of this.data.mappings) {
      let d2 = Object.assign({}, d);
      this.mappings.push(d2);
      //如果字段已被删除，则sourceField置空
      if (this.findFieldIndex(this.sourceList, d2.sourceField) < 0) {
        d2.sourceField = '';
        d2.source = {};
      }
      if (this.findFieldIndex(this.targetList, d2.targetField) < 0) {
        d2.targetField = '';
        d2.target = {};
      }
      this.checkRowDataStatus(d2);
    }
    for (let i = this.mappings.length; i < this.initMappingLength; i++) {
      this.mappings.push(Object.assign({}, this.defaultData));
    }
    return true;
  }

  close() {
    this.mappings.splice(0, this.mappings.length);
  }

  onSourceChange(index) {
    let row = this.mappings[index];
    let fieldIndex = this.findFieldIndex(this.sourceList, row.sourceField);
    row.source = this.sourceList[fieldIndex];
    this.checkRowDataStatus(row);
  }


  onTargetChange(index) {
    let row = this.mappings[index];
    let hasUsed = false;
    for (let i = 0; i < this.mappings.length; i++) {
      if (i == index) continue;
      if (row.targetField == this.mappings[i].targetField) {
        hasUsed = true;
        break;
      }
    }
    if (hasUsed) {
      this.tipWarnMessage('字段[' + row.targetField + ']已被输出字段使用！');
      setTimeout(() => {
        row.targetField = '';
        row.target = {};
        this.checkRowDataStatus(row);
      }, 100);
      return false;
    }
    let fieldIndex = this.findFieldIndex(this.targetList, row.targetField);
    row.target = this.targetList[fieldIndex];
    this.checkRowDataStatus(row);
  }

  /*showMyCaption(index) {

    alert(index);

    this.tipMessage('开始进行自定义更新条件.....');
    /!*
     需要根据选择  源表 和 目标表字段 列出来
     *!/
    if (!this.dialogOpts.updateDict.visible) {
      if (this.data.updateType == 3) {
        if (this.updates.length == 0) {
          this.updates.push(Object.assign({}, this.defaultUpdateData));
        }
        this.dialogOpts.updateDict.visible = true;
      }
    }
  }*/

  onAutoMapping() {
    let autoMappings = [];
    for (let t of this.targetList) {
      let mapping = Object.assign({}, this.defaultData);
      mapping.targetField = t.field;
      mapping.target = t;
      let sourceIndex = this.findFieldIndex(this.sourceList, mapping.targetField);
      if (sourceIndex >= 0) {
        mapping.sourceField = this.sourceList[sourceIndex].field;
        mapping.source = this.sourceList[sourceIndex];
        this.checkRowDataStatus(mapping);
      }
      autoMappings.push(mapping);
    }
    this.pushAll(this.mappings, autoMappings, true);
  }

  //检查行数据正确性，返回错误编号
  checkRowDatas(list: Array<any>): number {
    if (!list) return;
    let sources = this.getParentOutputs(false).outputs;
    let flag = 0;
    for (let row of list) {
      if (this.findFieldIndex(sources, row.sourceField) < 0) {
        flag = flag == 0 ? 1 : flag;
        break;
      }
      if (this.findFieldIndex(this.targetList, row.targetField) < 0) {
        flag = flag == 0 ? 2 : flag;
        break;
      }
      if (!this.checkRowDataStatus(row)) {
        flag = flag == 0 ? 3 : flag;
        break;
      }
    }
    //返回错误编号
    return flag;
  }

  //-1错误，0不检查，1成功，2警告
  checkRowDataStatus(row): boolean {
    let sourceDbtype = this.getSourceRule().data.sourceDbtype;
    let sourceType = '';
    let targetType = '';
    if (row.sourceField != '') {
      sourceType = this.getFieldChangeType(row.source.dataType, sourceDbtype);
    }
    if (row.targetField != '') {
      targetType = this.getFieldChangeType(row.target.dataType, this.data.targetDbtype);
    }
    row.sourceType = sourceType;
    row.targetType = targetType;
    if (row.sourceField == '' || row.targetField == '') {
      row.status = 0;
      return row.status >= 1;
    }
    //类型未知时
    if (!sourceType || !targetType) {
      row.status = -1;
      return row.status >= 1;
    }
    //目标为字符串时
    if (targetType == 'C' && (sourceType == 'N' || sourceType == 'D')) {
      row.status = 2;
      return row.status >= 1;
    }
    //目标为T时
    if (targetType == 'T' && (sourceType == 'C' || sourceType == 'N' || sourceType == 'D')) {
      row.status = 2;
      return row.status >= 1;
    }
    //类型不匹配，则错误
    if (sourceType != targetType) {
      row.status = -1;
      return row.status >= 1;
    }
    if (targetType == 'D') {
      row.status = 1;
      return row.status >= 1;
    }

    if (targetType == 'T') {
      if (row.source.length <= row.target.length) {
        row.status = 1;
      } else {
        row.status = 2;
      }
      return row.status >= 1;
    }

    if (targetType == 'N') {
      let sl = row.source.length - row.source.decimalLength;
      let tl = row.target.length - row.target.decimalLength;
      if (sl < 0) sl = 0;
      if (tl < 0) tl = 0;
      if (sl <= tl) {
        row.status = 1;
      } else {
        row.status = 2;
      }
      return row.status >= 1;
    }
    if (targetType == 'C') {
      //字符串考虑定长字符串的情况
      if (row.source.length <= row.target.length) {
        row.status = 1;
      } else {
        let isFix = this.checkIsFix(row.source.dataType, sourceDbtype);
        if (isFix) {
          row.status = -1;
        } else {
          row.status = 2;
        }
      }
      return row.status >= 1;
    }
    //未知类型
    row.status = -1;
    return row.status >= 1;
  }

  checkMustFields(list: Array<any>): Array<any> {
    let mustFields = [];
    //当为发布的时候 加上主键的必选
    debugger;
    console.log(this.businessType);
    if (this.businessType == 1) {
      for (let t of this.targetList) {
        if (t.primarykey == 1 || t.nullable == 0) {
          mustFields.push(t.field);
        }
      }
    }
    let notExistsFields = [];
    for (let field of mustFields) {
      let exists = false;
      if (list) {
        for (let row of list) {
          if (field == row.targetField) {
            exists = true;
            break;
          }
        }
      }
      if (!exists) {
        notExistsFields.push(field);
      }
    }
    return notExistsFields;
  }

  public check(): boolean {
    if (this.targetList.length == 0) {
      this.setError('请选择有效的目标表！');
      return false;
    }
    if (!this.data.mappings || this.data.mappings.length == 0) {
      this.setError('请至少设置一条有效的映射关系！');
      return false;
    }
    let flag = this.checkRowDatas(this.data.mappings);
    if (flag == 1) {
      this.setError('部分输入字段已丢失！');
      return false;
    } else if (flag == 2) {
      this.setError('部分输出字段已丢失！');
      return false;
    } else if (flag == 3) {
      this.setError('部分映射关系错误！');
      return false;
    }
    let notExistsFields = this.checkMustFields(this.data.mappings);
    if (notExistsFields.length > 0) {
      this.setError('主键和非空字段[' + notExistsFields.join(',') + ']需要设置映射关系！');
      return false;
    }
    this.setError(null);
    return true;
  }

  onTargetMappingOk() {
    //检查字符串操作列表
    let validMappings = [];
    for (let row of this.mappings) {
      if (row.sourceField != '' && row.targetField != '') {
        validMappings.push(row);
      }
    }
    if (validMappings.length == 0) {
      this.tipWarnMessage('请至少设置一条有效的映射关系！');
      return false;
    }
    for (let row of validMappings) {
      if (!this.checkRowDataStatus(row)) {
        this.tipWarnMessage('请完善所有映射关系！');
        return false;
      }
    }
    let notExistsFields = this.checkMustFields(this.mappings);
    if (notExistsFields.length > 0) {
      this.tipWarnMessage('主键和非空字段[' + notExistsFields.join(',') + ']需要设置映射关系！');
      return false;
    }
    this.pushAll(this.data.mappings, validMappings, true);
    //关闭步骤界面
    this.closeRuleDetail();
    //检查本身规则，并检查后续规则
    this.checkAllAfter();
  }

  //表字段变化时，刷新值映射
  flushTargetList() {
    let hasPri = false;
    for (let t of this.targetList) {
      if (t.primarykey == 1) {
        hasPri = true;
        break;
      }
    }
    if (!hasPri) {
      this.data.updateType = 1;
    }
    this.hasPrimarykey = hasPri;
  }

  //切换表及表上级选择时候，清理已存在的字段
  cleanFieldListData() {
    this.targetList.splice(0, this.targetList.length);
    //this.mappings.splice(0, this.mappings.length);
    this.targetFieldList = [];
  }

  addUpdateDictRow(i) {
    // debugger;
    this._addDataRow(i, this.updates, this.defaultUpdateData, this.maxMappingLength);
  }


  removeUpdateDictRow(i) {
    //debugger;
    this._removeDataRow(i, this.updates);
  }

  addDataRow(i) {
    this._addDataRow(i, this.mappings, this.defaultData, this.maxMappingLength);
  }

  removeDataRow(i) {
    this._removeDataRow(i, this.mappings);
  }
}
