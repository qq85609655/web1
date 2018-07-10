import {BaseComponent} from '../../../../components/base/base.component';

export abstract class ConvertRule extends BaseComponent {
  public name: string;
  public modifyName: any;//编辑状态下的变量
  public type: number;
  public typeName: string;
  public id: number;
  public error = {
    status: false,
    msg: ''
  };
  public prevRule: any = null;
  public nextRule: any = null;
  public allRules: Array<ConvertRule>;

  defaultField = {
    field: '',//字段名称
    comment: '',//注释
    dataType: 'C',//数据类型
    length: 0,//总长度
    decimalLength: 0,//小数长度，根据实际情况，后续考虑是否使用
    primarykey: 0,//0非主键，1主键
    nullable: 1,//0不可空，1可空
    ruleType: 1,//规则类型,数据来源类型
    isAutoCreate: ''//是否自增
  };


  //默认最大初始化 映射字段长度为 50
  public maxMappingLength = 300;
  //默认初始化 映射字段长度 为10
  public initMappingLength = 10;
  public hasPrimarykey = false;
  // 默默认更新条件 为请选择
  public updateType = 0;


  public updateTypeList =
    [
      {label: '请选择', value: 0},
      {label: '全表插入', value: 1},
      // {label: '按照主键更新插入', value: 2},
      {label: '自定义更新条件', value: -1}
    ];

  public primaryFlagList = [{value: 'N', label: '否'}, {value: 'Y', label: '是'}];
  public relationList = [{value: '=', label: '='}, {value: '>', label: '>'}, {value: '<', label: '<'}, {
    value: '>=',
    label: '>='
  }, {value: '<=', label: '<='}, {value: '<>', label: '<>'}];


  public setNextRule(next: any, allRules: Array<ConvertRule>) {
    this.allRules = allRules;
    if (next) {
      this.nextRule = next;
      next.prevRule = this;
      next.allRules = allRules;
    }
  }

  public getPrevRule() {
    return this.prevRule;
  }

  public getNextRule() {
    return this.nextRule;
  }

  constructor(param: any, type: number, typeName: string) {
    super();
    this.type = type;
    this.typeName = typeName;
    this.id = param.id;
    this.name = param.name;
    if (!param.name) {
      this.name = this.typeName;
    } else {
      this.name = param.name;
    }
  }

  /******* 以下方法需要子类各自实现 ******/
  public close() {

  }

  public open(): boolean {
    return true;
  }

  //检查当前规则是否成功
  public check(): boolean {
    return true;
  }

  /**
   * 获取当前规则，产生的新增字段列表，即输出字段列表
   * @returns {Array<any>}
   */
  public abstract getOutputs(): Array<any>;

  /**
   * 返回需要提交到服务器的数据
   * @returns {any}
   */
  public abstract getData(): any;

  /******* 以上方法需要子类各自实现 ******/









  //包含全部提交的数据，不提交的数据不包含（typeName）
  public getDataWhole(): any {
    return Object.assign(this.getData(), {name: this.name, type: this.type, id: this.id});
  }

  public checkAllAfter(): boolean {
    let flag = this.check();
    let index = this.getRuleIndex(this.id);
    if (index == this.allRules.length - 1) {
      //最后一个rule，不再向后查找
      return flag;
    }
    let flagAfter = this.allRules[index + 1].checkAllAfter();
    //必须全部成功时，才为整个流程成功
    return flag === true && flagAfter === true;
  }

  public getName(): string {
    return this.name;
  }

  public getType(): number {
    return this.type;
  }

  public getTypeName(): string {
    return this.typeName;
  }

  /**
   * @param {string} msg 不存在或空字符串，表示清理错误
   */
  public setError(msg?: string) {
    if (msg) {
      this.error.status = true;
      this.error.msg = msg;
    } else {
      this.error.status = false;
      this.error.msg = '';
    }
  }

  /**
   *
   * @param {boolean} tip 是否提示无字段，打开规则时需要提示， check规则时不需要提示
   * @returns {{status: boolean; fieldList: Array; outputs: Array}}
   */
  public getParentOutputs(tip?: boolean) {
    let fieldList = [];
    let outputs = [];

    for (let i = 0; i < this.allRules.length; i++) {
      if (this.allRules[i].id == this.id) {
        break;
      }
      let thisRule = this.allRules[i];
      let output = this.allRules[i].getOutputs();
      if (output) {
        this.pushAll(fieldList, this.packFieldOptions(output, thisRule));
        this.pushAll(outputs, output);
      }
    }
    if (!fieldList || fieldList.length == 0) {
      if (tip !== false) {
        this.tipWarnMessage('当前规则没有输入字段，请检查前面所有规则及源表！');
      }
      return {status: false, fieldList: fieldList, outputs: outputs};
    }
    return {status: true, fieldList: fieldList, outputs: outputs};
  }

  packFieldOptions(fieldList, thisRule): Array<any> {
    //数据源不需要显示规则名称
    let typeNameMsg = '源表';
    if (thisRule.type == 2) {
      typeNameMsg = '目标表';
    } else if (thisRule.type > 2) {
      typeNameMsg = thisRule.id + '-' + thisRule.typeName;
    }
    let result = [];
    if (!fieldList) return result;
    for (let outField of fieldList) {
      let option = {value: outField.field, label: ''};
      // option.label = outField.field + '(' + typeNameMsg + ')' + outField.comment;
      if (outField.comment != '') {
        option.label = outField.field + '-' + outField.comment;
      } else {
        option.label = outField.field;
      }
      result.push(option);
    }

    return result;
  }

  /**
   * @param {Array<string>} fields
   * @returns {boolean}  ture检查正确，无重复字段
   */
  public checkFieldNoRepeat(fields: Array<string>): boolean {
    if (!fields || fields.length == 0) return true;
    let fieldList = [];
    let fieldExtends = [];
    for (let i = 0; i < this.allRules.length; i++) {
      if (this.allRules[i].id == this.id) {
        //向前查找错误，kettle的模式也是仅向前查找
        break;
      }
      let output = this.allRules[i].getOutputs();
      let extend = {id: this.allRules[i].id};
      if (output) {
        for (let out of output) {
          fieldList.push(out);
          fieldExtends.push(extend);
        }
      }
    }
    let errorFields = [];
    let msg = '';
    for (let i = 0; i < fields.length; i++) {
      let field = fields[i];
      let fieldIndex = this.findFieldIndex(fieldList, field);
      if (fieldIndex >= 0) {
        errorFields.push(field);

        if (fieldExtends[fieldIndex].id == 1) {
          msg += '字段[' + field + ']在数据源表中已存在！\n';
        } else {
          msg += '字段[' + field + ']在编号为' + fieldExtends[fieldIndex].id + '的步骤中已存在！\n';
        }
      }
    }
    if (msg) {
      this.dialogMessage(msg);
    }
    return errorFields.length == 0;
  }

  findFieldIndex(fieldList: Array<any>, field: string) {
    field = field.toLowerCase();
    let index = -1;
    if (fieldList) {
      for (let i = 0; i < fieldList.length; i++) {
        if (fieldList[i].field.toLowerCase() == field) {
          index = i;
          break;
        }
      }
    }
    return index;
  }

  findeDropdownIndex(dropdownList: Array<any>, value) {
    let index = -1;
    if (dropdownList) {
      for (let i = 0; i < dropdownList.length; i++) {
        if (dropdownList[i].value == value) {
          index = i;
          break;
        }
      }
    }
    return index;
  }

  public getSourceRule(): any {
    return this.allRules[0];
  }

  //通知组件关闭显示界面
  closeRuleDetail() {
    this.getSourceRule().getComponent().onRuleClose();
  }

  //返回上个页面
  goback() {
    this.getSourceRule().getComponent().goback();
  }


  public getRuleIndex(id: number) {
    let index = -1;
    for (let i = 0; i < this.allRules.length; i++) {
      if (this.allRules[i].id == id) {
        index = i;
        break;
      }
    }
    return index;
  }

  public getNewId() {
    if (!this.id || this.id <= 0) {
      console.log('error error error error,新建的转换规则不能获取newid');
      return -1;
    }
    let maxId = 3;
    for (let i = 0; i < this.allRules.length; i++) {
      if (this.allRules[i].id >= maxId) {
        maxId = this.allRules[i].id + 1;
      }
    }
    return maxId;
  }

  public static Type_Source = 1;
  public static Name_Source = '选择源表';
  public static Type_Target = 2;
  public static Name_Target = '选择目标表';

  public static Type_StringOper = 3;
  public static Name_StringOper = '字符串操作';
  public static Type_StringCut = 4;
  public static Name_StringCut = '字符串剪切';
  public static Type_Stringreplace = 5;
  public static Name_Stringreplace = '字符串替换';
  public static Type_AddConstant = 6;
  public static Name_AddConstant = '增加常量';

  public static Type_ValueMapper = 7;
  public static Name_ValueMapper = '静态值映射';
  public static Type_Split = 8;
  public static Name_Split = '拆分字段';
  public static Type_Concat = 9;
  public static Name_Concat = '合并字段';
  public static Type_Numberrange = 10;
  public static Name_Numberrange = '数值范围';

  public static Type_TypeConvert = 11;
  public static Name_TypeConvert = '类型转换';
  public static Type_Splitfieldtorows = 12;
  public static Name_Splitfieldtorows = '列拆分为多行';
  public static Type_Calculator = 13;
  public static Name_Calculator = '计算器';
  public static Type_UniqueRows = 14;
  public static Name_UniqueRows = '去除重复记录';

  //add by 周刚
  public static Name_ExecuteSql = '执行sql脚本';
  public static Type_ExecuteSql = 15;

  public static Name_DynamicValueMapping = '动态值隐射';
  public static Type_DynamicValueMapping = 16;

  public static ruleTypeList = [
    {type: ConvertRule.Type_StringOper, name: ConvertRule.Name_StringOper, description: '字符串操作'},
    {type: ConvertRule.Type_StringCut, name: ConvertRule.Name_StringCut, description: '字符串剪切'},
    {type: ConvertRule.Type_Stringreplace, name: ConvertRule.Name_Stringreplace, description: '字符串替换'},
    {type: ConvertRule.Type_AddConstant, name: ConvertRule.Name_AddConstant, description: '增加常量'},
    {type: ConvertRule.Type_ValueMapper, name: ConvertRule.Name_ValueMapper, description: '静态值映射'},
    {type: ConvertRule.Type_Concat, name: ConvertRule.Name_Concat, description: '合并字段'},
    {type: ConvertRule.Type_Split, name: ConvertRule.Name_Split, description: '拆分字段'},
    {type: ConvertRule.Type_Numberrange, name: ConvertRule.Name_Numberrange, description: '数值范围'},
    {type: ConvertRule.Type_TypeConvert, name: ConvertRule.Name_TypeConvert, description: '字段选择'},
    {type: ConvertRule.Type_Splitfieldtorows, name: ConvertRule.Name_Splitfieldtorows, description: '列拆分为多行'},
    {type: ConvertRule.Type_Calculator, name: ConvertRule.Name_Calculator, description: '计算器'},
    {type: ConvertRule.Type_UniqueRows, name: ConvertRule.Name_UniqueRows, description: '去除重复记录'},
    //{type: ConvertRule.Type_ExecuteSql, name: ConvertRule.Name_ExecuteSql, description: '执行脚本(包括sql查询语句、自定义函数、存储过程等)'},
    {
      type: ConvertRule.Type_DynamicValueMapping,
      name: ConvertRule.Name_DynamicValueMapping,
      description: '动态值隐射(类似静态值映射，区别在于映射的值来源于目标库的某个表某个对应字段)'
    },
  ];

  public static supportDbFieldType = {
    //mysql
    '1': {
      CHAR: 'C',
      VARCHAR: 'C',
      TINYINT: 'N',
      SMALLINT: 'N',
      MEDIUMINT: 'N',
      INT: 'N',
      bit:'N',
      INTEGER: 'N',
      BIGINT: 'N',
      FLOAT: 'N',
      DOUBLE: 'N',
      DECIMAL: 'N',
      numeric: 'N',
      REAL: 'N',
      DATE: 'D',
      BIT:'N',
      TIME: 'D',
      YEAR: 'D',
      DATETIME: 'D',
      TIMESTAMP: 'D',
      TEXT: 'T',
      LONGTEXT: 'T',
      MEDIUMTEXT: 'T',
      C: 'C',
      N: 'N',
      D: 'D',
      M: 'N',
      T: 'T'
    },

    //oracle
    '2': {
      'INT': 'N',
      'CHAR': 'C',
      'NCHAR': 'C',
      'VARCHAR': 'C',
      'VARCHAR2': 'C',
      'NVARCHAR2': 'C',
      'LONG': 'C',
      'NUMBER': 'N',
      'INTEGER': 'N',
      'FLOAT': 'N',
      'BINARY_FLOAT': 'N',
      'BINARY_DOUBLE': 'N',
      'DATE': 'D',
      'TIMESTAMP': 'D',
       'BIT':'N',
        'bit':'N',
      'TIMESTAMP WITH TIME ZONE': 'D',
      'TIMESTAMP WITH LOCAL TIME ZONE': 'D',
      'TIMESTAMP(3)': 'D',
      'TIMESTAMP(3) WITH TIME ZONE': 'D',
      'TIMESTAMP(3) WITH LOCAL TIME ZONE': 'D',
      'TIMESTAMP(6)': 'D',
      'TIMESTAMP(6) WITH TIME ZONE': 'D',
      'TIMESTAMP(6) WITH LOCAL TIME ZONE': 'D',
      'TIMESTAMP(9)': 'D',
      'TIMESTAMP(9) WITH TIME ZONE': 'D',
      'TIMESTAMP(9) WITH LOCAL TIME ZONE': 'D',
      'INTERVAL YEAR TO MOTH': 'D',
      'INTERVAL DAY TO SECOND': 'D',
      C: 'C',
      N: 'N',
      D: 'D',
      M: 'N',
      T: 'T'
    },

    //sqlserver
    '3': {
      'char': 'C',
      'varchar': 'C',
      'nchar': 'C',
      'nvarchar': 'C',
      'ntext': 'T',
      'text': 'T',
      'bit': 'N',
      'tinyint': 'N',
      'smallint': 'N',
      'int': 'N',
      'bigint': 'N',
      'decimal': 'N',
      'numeric': 'N',
      'smallmoney': 'N',
      'money': 'N',
      'float': 'N',
      'real': 'N',
      'datetime': 'D',
      'datetime2': 'D',
      'smalldatetime': 'D',
      'date': 'D',
      'time': 'D',
      'datetimeoffset': 'D',
      'timestamp': 'D',
      C: 'C',
      N: 'N',
      D: 'D',
      M: 'N',
      T: 'T'
    },

    'fix': {
      'CHAR': 'C',
      'NCHAR': 'C'
    },
    status: false

  };

  static initSupportDbFieldType() {
    if (ConvertRule.supportDbFieldType.status) {
      return;
    }
    for (let id in ConvertRule.supportDbFieldType) {
      if (id == 'status') continue;
      let old = ConvertRule.supportDbFieldType[id];
      let types: any = {};
      for (let type in old) {
        types[type.toUpperCase()] = old[type];
      }
      ConvertRule.supportDbFieldType[id] = types;
    }
    ConvertRule.supportDbFieldType.status = true;
  }

  //将目标数据类型转换成源字段类型
  getFieldChangeType(type, dbtype) {
    if (!dbtype || dbtype <= 0 || !type || type == '') return '';
    var changeType = ConvertRule.supportDbFieldType[dbtype + ''][type.toUpperCase()];
    if (changeType) {
      return changeType;
    } else {
      return '';
    }
  }

  //检查是否为定长字符串
  checkIsFix(type, dbtype) {
    var changeType = ConvertRule.supportDbFieldType['fix'][type.toUpperCase()];
    if (changeType) {
      return true;
    } else {
      return false;
    }
  }
}
