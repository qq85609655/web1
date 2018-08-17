import {ConvertRule} from './convert-rule';
import {DataConvertInfoComponent} from '../data-convert-info/data-convert-info.component';

export class ConvertRuleSource extends ConvertRule {
  component: DataConvertInfoComponent;
  public data = {
    thirdConnectionId: 0,
    sourceDbtype: 1,
    targetDbtype: 1,
    thirdTablename: '',
    centerTablename: '',
    subsetCode: '',
    classCode: '',
    subclassCode: '',
    mappings: [],
    conditions: [],
    comment: '',
    updateType: 0
  };
  public businessType = 1;
  public orgId = '';

  public sourceList = [];
  public targetList = [];

  dataSourceListResult: any;
  //第三方数据表
  public dataSourceList: any = [{value: 0, label: '请选择'}];
  public dataTableList: any = [{value: '', label: '请选择'}];

  //中心库表
  public subsetList: any = [{value: '', label: '请选择'}];
  public classList: any = [{value: '', label: '请选择'}];
  public subclassList: any = [{value: '', label: '请选择'}];

  /**
   * 要求参数businessType orgId
   * @param param
   */
  constructor(param: any) {
    super(param, ConvertRule.Type_Source, ConvertRule.Name_Source);
    if (!this.isSource()) {
      this.type = ConvertRule.Type_Target;
      this.typeName = ConvertRule.Name_Target;
    }
    this.id = this.type;
    if (!param.name) {
      this.name = this.typeName;
    }
    this.businessType = param.businessType;
    this.orgId = param.orgId;
    if (param.data) {
      Object.assign(this.data, param.data);
    }
    if (this.isSource()) {
      this.initRule();
    }
  }

  protected isSource() {
    return true;
  }

  public getData() {
    return this.getData_inner();
  }

  private getData_inner(): any {
    return {data: this.data, sourceList: this.sourceList};
  }

  public getOutputs() {
    return this.sourceList;
  }

  initRule() {
    if ((this.isSource() && this.businessType == 1) || (!this.isSource() && this.businessType != 1)) {
      //第三方库，数据源
      this.getHttpClient().get('datasource/queryListAll', {pageSize: 10000, orgIds: this.orgId}, data => {
        this.dataSourceList = [{value: 0, label: '请选择'}];
        if (data && data.length > 0) {
          for (let d of data) {
            this.dataSourceList.push({value: d.id, label: d.name});
          }
          this.dataSourceListResult = data;
          if (this.data.thirdConnectionId > 0) {
            //修改初始化页面
            this.checkDropdownExists('thirdConnectionId', '数据源', this.dataSourceList, this.onDataSourceChange, true);
          }
        } else {
          this.dialogMessage('没有可选择的数据源信息！', () => {
            this.goback();
          });
        }
      });
    } else {
      //中心库子集
      this.getHttpClient().get('datastandard/queryDataOrgListAll', {sourceId: 1, nodeType: 1}, data => {
        this.subsetList = [{value: '', label: '请选择'}];
        if (data && data.length > 0) {
          for (let d of data) {
            this.subsetList.push({value: d.code, label: d.name});
          }
          if (this.data.subsetCode) {
            //修改初始化页面
            this.checkDropdownExists('subsetCode', '数据子集', this.subsetList, this.onSubsetChange);
          }
        } else {
          this.dialogMessage('没有可选择的数据子集信息！', () => {
            this.goback();
          });
        }
      });
    }
    //删除多余的db类型
    if (this.isSource()) {
      delete this.data.targetDbtype;
    } else {
      delete this.data.sourceDbtype;
    }
    //指定中心库db类型为1
    if (this.businessType == 1) {
      if (this.isSource()) {

      } else {
        this.data.targetDbtype = 1;
      }
    } else {
      if (this.isSource()) {
        this.data.sourceDbtype = 1;
      } else {

      }
    }
  }

  //检查选项数据是否存在，并向下调用
  checkDropdownExists(field: string, name: string, dropdownList, method, intType?: boolean): boolean {
    if (this.findeDropdownIndex(dropdownList, this.data[field]) >= 0) {
      method.call(this, true);
    } else {
      this.dialogMessage(name + '已不存在，请重新选择' + name + '！');
      if (intType === true) {
        this.data[field] = 0;
      } else {
        this.data[field] = '';
      }
      return false;
    }
    return true;
  }

  onDataSourceChange(initFlag?: boolean) {
    if (initFlag !== true) {
      this.cleanFieldListData();//非初始化时，清空已存在的字段
      this.data.thirdTablename = '';
    }
    for (let ds of this.dataSourceListResult) {
      if (ds.id == this.data.thirdConnectionId) {
        if (this.businessType == 1) {
          this.data.sourceDbtype = ds.dbType;
        } else {
          this.data.targetDbtype = ds.dbType;
        }
        break;
      }
    }
    this.dataTableList = [{value: '', label: '请选择'}];
    this.getHttpClient().get('datasource/' + this.data.thirdConnectionId+"/"+this.businessType, null, (data) => {
      this.dataTableList = [{value: '', label: '请选择'}];
      if (data && data.length > 0) {
        for (let d of data) {
          this.dataTableList.push({value: d, label: d});
        }
      }
      if (this.getSourceRule().getComponent().destoryFlag === true) {
        //存在数据库非常慢时，页面已销毁不再弹框
        return false;
      }
      if (initFlag) {
        this.checkDropdownExists('thirdTablename', '数据表', this.dataTableList, this.onDataTableChange);
      }
    });
  }

  onDataTableChange(initFlag?: boolean) {
    $('#primaryKeyInfo').html('');
    if (initFlag !== true) {
      this.cleanFieldListData();//非初始化时，清空已存在的字段
    }
    debugger;
    let tableName = this.data.thirdTablename;
    console.info(tableName);
    if (tableName != null) {
      var taname = tableName.split('#');
      var tType = taname[1];
      var tname = taname[0];
      console.info(tType + '---------' + tname);
      let queryParam = {
        connectionId: this.data.thirdConnectionId,
        tableName: tname,
        tType: tType,
        busType: this.businessType
      };

      this.getHttpClient().get('datasource/queryTableFields', queryParam, (data) => {
        console.info(data.ketAutoAddCount);
        if (!data || data.tableFieldVoList.length == 0) {
          data = [];
        }
        if (this.businessType == 1) {
          this.pushAll(this.sourceList, data.tableFieldVoList, true);
          for (let f of this.sourceList) {
            f.ruleType = 1;//源数据字段
          }
        } else {
          this.pushAll(this.targetList, data.tableFieldVoList, true);
          for (let f of this.targetList) {
            f.ruleType = 2;//目标数据字段
          }
          this.flushTargetList();
        }
        this.check();
        if (this.isSource() && this.getNextRule()) {
          this.getNextRule().checkAllAfter();
        }
        console.info(data.keyComment);
        // 分三种情况： 1 有一个主键 2 多个主键（联合主键） 3 无主键
        $('#primaryKeyInfo').html(data.keyComment);
      });
    }
  }

  onSubsetChange(initFlag?: boolean) {
    if (initFlag !== true) {
      this.cleanFieldListData();//非初始化时，清空已存在的字段
      this.data.classCode = '';
      this.data.subclassCode = '';
      this.subclassList = [{value: '', label: '请选择'}];
      this.subclassListData = [];
    }
    let queryParam = {
      sourceId: 1,
      subsetCode: this.data.subsetCode,
      nodeType: 2
    };
    this.classList = [{value: '', label: '请选择'}];
    this.getHttpClient().get('datastandard/queryDataOrgListAll', queryParam, data => {
      this.classList = [{value: '', label: '请选择'}];
      if (data && data.length > 0) {
        for (let d of data) {
          this.classList.push({value: d.code, label: d.name});
        }
      }
      if (initFlag) {
        this.checkDropdownExists('classCode', '数据类', this.classList, this.onClassChange);
      }
    });
  }

  subclassListData = [];

  onClassChange(initFlag?: boolean) {
    if (initFlag !== true) {
      this.cleanFieldListData();//非初始化时，清空已存在的字段
      this.data.subclassCode = '';
    }
    let queryParam = {
      sourceId: 1,
      subsetCode: this.data.subsetCode,
      classCode: this.data.classCode,
      nodeType: 3
    };
    this.subclassList = [{value: '', label: '请选择'}];
    this.getHttpClient().get('datastandard/queryDataOrgListAll', queryParam, data => {
      this.subclassList = [{value: '', label: '请选择'}];
      this.subclassListData = [];
      if (data && data.length > 0) {
        for (let d of data) {
          this.subclassList.push({value: d.code, label: d.name});
        }
        this.pushAll(this.subclassListData, data);
      }
      if (initFlag) {
        this.checkDropdownExists('subclassCode', '数据子类', this.subclassList, this.onSubclassChange);
      }
    });
  }

  onSubclassChange(initFlag?: boolean) {
    if (initFlag !== true) {
      this.cleanFieldListData();//非初始化时，清空已存在的字段
    }
    this.data.centerTablename = '';
    for (let subclass of this.subclassListData) {
      if (subclass.code == this.data.subclassCode) {
        this.data.centerTablename = subclass.tableName;
      }
    }
    let queryParam = {
      sourceId: 1,
      subclassCode: this.data.subclassCode,
    };
    this.getHttpClient().get('datastandarditem/queryItemListAll', queryParam, data => {
      if (!data || data.length == 0) {
        data = [];
      }
      if (this.businessType != 1) {
        this.pushAll(this.sourceList, data, true);
        for (let f of this.sourceList) {
          f.ruleType = 1;//源数据字段
        }
      } else {
        this.pushAll(this.targetList, data, true);
        for (let f of this.targetList) {
          f.ruleType = 2;//目标数据字段
        }
        this.flushTargetList();
      }
      this.check();
      if (this.isSource() && this.getNextRule()) {
        this.getNextRule().checkAllAfter();
      }
    });
  }

  flushTargetList() {

  }

  //切换表及表上级选择时候，清理已存在的字段
  cleanFieldListData() {
    this.sourceList.splice(0, this.sourceList.length);
  }

  public check(): boolean {
    if (this.isSource()) {
      if (this.sourceList.length == 0) {
        this.setError('请选择有效的源表！');
        return false;
      }
      this.setError(null);
      return true;
    } else {
      return false;
    }
  }

  openTableDetail(type) {
    //  debugger;
    let fieldList = null;

    let tableInfo = {name: '', dbType: 1, comment: '', type: type};
    if (type == 1) {
      fieldList = this.sourceList;
      if (!fieldList || fieldList.length == 0) {
        this.tipWarnMessage('请选择有效的源表！');
        return false;
      }
      if (this.businessType == 1) {
        tableInfo.name = this.data.thirdTablename;
      } else {
        tableInfo.name = this.data.centerTablename;
      }
      tableInfo.dbType = this.data.sourceDbtype;
    } else {
      fieldList = this.targetList;
      if (!fieldList || fieldList.length == 0) {
        this.tipWarnMessage('请选择有效的目标表！');
        return false;
      }
      if (this.businessType != 1) {
        tableInfo.name = this.data.thirdTablename;
      } else {
        tableInfo.name = this.data.centerTablename;
      }
      tableInfo.comment = this.data.comment;
      tableInfo.dbType = this.data.targetDbtype;
    }
    this.getSourceRule().getComponent().openTableDetail(fieldList, tableInfo, type);
  }

  public getComponent(): DataConvertInfoComponent {
    return this.component;
  }

  public setComponent(component: DataConvertInfoComponent) {
    this.component = component;
  }
}
