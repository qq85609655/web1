import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseComponent} from '../../../../components/base/base.component';
import {ActivatedRoute} from '@angular/router';
import {ConvertRule} from '../data-convert-rule/convert-rule';
import {ConvertRuleSource} from '../data-convert-rule/convert-rule-source';
import {ConvertRuleStringoper} from '../data-convert-rule/convert-rule-stringoper';
import {ConvertRuleTarget} from '../data-convert-rule/convert-rule-target';
import {ConvertRuleCalculator} from '../data-convert-rule/convert-rule-calculator';
import {ConvertRuleUniquerow} from '../data-convert-rule/convert-rule-uniquerow';
import {ConvertRuleAddconstant} from '../data-convert-rule/convert-rule-addconstant';
import {ConvertRuleStringreplace} from '../data-convert-rule/convert-rule-stringreplace';
import {ConvertRuleSplitfieldtorows} from '../data-convert-rule/convert-rule-splitfieldtorows';
import {ConvertRuleNumberrange} from '../data-convert-rule/convert-rule-numberrange';
import {ConvertRuleValuemapper} from '../data-convert-rule/convert-rule-valuemapper';
import {ConvertRuleSplitfield} from '../data-convert-rule/convert-rule-splitfield';
import {ConvertRuleConcatfield} from '../data-convert-rule/convert-rule-concatfield';
import {ConvertRuleTypeconvert} from '../data-convert-rule/convert-rule-typeconvert';
import {ConvertRuleStringcut} from '../data-convert-rule/convert-rule-stringcut';
import {ConvertRuleDynamicValuemapper} from '../data-convert-rule/convert-rule-dynamic-valuemapper';
import {ConvertRuleExecuteSql} from '../data-convert-rule/convert-rule-executesql';

@Component({
  selector: 'app-data-convert-info',
  templateUrl: './data-convert-info.component.html',
  styleUrls: ['./data-convert-info.component.css']
})
export class DataConvertInfoComponent extends BaseComponent implements OnInit, OnDestroy {
  public that: DataConvertInfoComponent;

  constructor(public _ActivatedRoute: ActivatedRoute) {
    super();
    this.setBusinessType(1);
    this.that = this;
    ConvertRule.initSupportDbFieldType();
  }

  ngOnInit() {
    this.initRuntimeList();
    this._ActivatedRoute.queryParams.subscribe(params => {
      if (this.operType == 1) {
        this.taskData.orgId = params.orgId;
        this.taskData.orgName = params.orgName;
        if (params.appendAdd == 'true') {
          this.pageParam.appendAdd = true;
        }
      } else {
        this.taskData.taskId = params.taskId;
      }
      this.routerParams = params;
    });
    if (this.operType == 1) {
      this.initRules();
    } else {
      this.getHttpClient().get('datatask/getDataTaskVo', {taskId: this.taskData.taskId}, data => {
        Object.assign(this.taskData, data);
        //  debugger;
        //  console.log(this.taskData);
        for (let run of this.runTypeList) {
          if (this.taskData.runType == run.value.runType && this.taskData.runSpace == run.value.runSpace) {
            this.runValue = run.value;
            break;
          }
        }
        this.initRules();
      });
    }
  }

  public destoryFlag = false;

  ngOnDestroy() {
    this.destoryFlag = true;
  }

  public dataTypeList = [{value: 1, label: '结构化数据'}, {value: 2, label: '非结构化数据'}];
  public ruleTypeList = [];
  public runTypeList = [
    {label: '1分钟', value: {runType: 1, runSpace: 1, runSpaces: '', runTime: '2018-01-01 01:00:00'}},
    {label: '5分钟', value: {runType: 1, runSpace: 5, runSpaces: '', runTime: '2018-01-01 01:00:00'}},
    {label: '30分钟', value: {runType: 1, runSpace: 30, runSpaces: '', runTime: '2018-01-01 01:00:00'}},
    {label: '1小时', value: {runType: 2, runSpace: 1, runSpaces: '', runTime: '2018-01-01 01:00:00'}},
    {label: '2小时', value: {runType: 2, runSpace: 2, runSpaces: '', runTime: '2018-01-01 01:00:00'}},
    {label: '6小时', value: {runType: 2, runSpace: 6, runSpaces: '', runTime: '2018-01-01 01:00:00'}},
    {label: '每天', value: {runType: 3, runSpace: 1, runSpaces: '', runTime: '2018-01-01 01:00:00'}},
    {label: '每周', value: {runType: 4, runSpace: 1, runSpaces: '1', runTime: '2018-01-01 01:30:00'}},
    {label: '每月', value: {runType: 5, runSpace: 1, runSpaces: '1', runTime: '2018-01-01 01:40:00'}},
    {label: '每年', value: {runType: 6, runSpace: 1, runSpaces: '1', runTime: '2018-01-01 01:50:00'}}
  ];

  public operType = 1;
  public businessType = 1;//1发布，2订阅
  public routerParams: any;
  public taskData = {
    taskId: 0,
    taskName: '',
    businessType: 1,
    orgId: 0,
    orgName: '',
    description: '',
    dataType: 1,
    runType: 0,
    runSpace: 5,
    runSpaces: '',
    runTime: '',
    runStatus: false,
    steps: [],
    updateType: 0
  };
  public runData = {
    runType: 0,
    runSpace: 5,
    runSpaces: '',
    runTime: '',
  };
  public runValue: any = null;
  pageParam = {
    appendAdd: false,
    startTask: false
  };


  public rules: Array<ConvertRule> = [];

  public sourceRule: ConvertRuleSource;
  public targetRule;

  public ruleType = 0;
  public rule: any;
  public continueAdd = false;


  public dialogOpts = {
    select: {
      title: '数据转换规则',
      visible: false,
      rule: null,
      selectType: 3
    },
    runtime: {
      title: '同步计划设置',
      visible: false,
      data: {
        runValue: null,
        runType: 0,
        runSpace: 5,
        runSpaces: '',
        runTime: '',
        runHour: '01',
        runMinute: '00',
        runDay: '01'
      }
    },
    tabledetail: {
      title: '数据表详情',
      type: 0,
      visible: false,
      fieldList: [],
      typeList: [],
      tableInfo: {name: '', dbType: 1, comment: ''}
    },

  };
  runHourList = [];
  runMinuteList = [];
  runDayList = [];
  runWeekList = [];
  runMonthList = [];
  runYearList = [];

  initRules() {
    // debugger;
    this.rules = [];
    let taskInfo = {businessType: this.businessType, orgId: this.taskData.orgId};
    if (this.operType == 1) {
      //源规则
      this.sourceRule = new ConvertRuleSource(Object.assign({}, taskInfo));
      this.sourceRule.setComponent(this);
      this.sourceRule.setNextRule(null, this.rules);
      this.rules.push(this.sourceRule);

      //目标规则
      this.targetRule = new ConvertRuleTarget(Object.assign({}, taskInfo));
      this.rules.push(this.targetRule);
      this.sourceRule.setNextRule(this.targetRule, this.rules);
    } else {

      //源规则
      let sourceData = JSON.parse(this.taskData.steps[0]);
      if (sourceData.type != ConvertRule.Type_Source) {
        this.tipWarnMessage('当前数据资源任务源数据格式错误!');
        return false;
      }
      this.sourceRule = new ConvertRuleSource(Object.assign({}, sourceData, taskInfo));
      this.sourceRule.setComponent(this);
      this.sourceRule.setNextRule(null, this.rules);
      this.rules.push(this.sourceRule);

      // debugger;
      //目标规则
      let targetData = JSON.parse(this.taskData.steps[this.taskData.steps.length - 1]);
      //  console.info(targetData);
      console.info(targetData.data.updateType);

      if (targetData.type != ConvertRule.Type_Target) {
        this.tipWarnMessage('当前数据资源任务目标数据格式错误!');
        return false;
      }
      this.targetRule = new ConvertRuleTarget(Object.assign({}, targetData, taskInfo));
      this.targetRule.setNextRule(null, this.rules);
      this.targetRule.updateType = targetData.data.updateType;
      this.rules.push(this.targetRule);
      // alert('11111111111111=============' + this.taskData.updateType);

      //初始化其他规则
      let prevRule: any = this.sourceRule;
      for (let i = 1; i < this.taskData.steps.length - 1; i++) {
        let ruleData = JSON.parse(this.taskData.steps[i]);
        debugger;
        let busType=taskInfo.businessType;
        let newRule = this.newConvertRuleByType(ruleData.type, ruleData, busType);
        this.rules.splice(i, 0, newRule);
        prevRule.setNextRule(newRule, this.rules);
        prevRule = newRule;
      }
      prevRule.setNextRule(this.targetRule, this.rules);

    }
  }

  onRuleTypeChange(event) {
    let value = event.value;
    Object.assign(this.taskData, value);
  }

  onRuleTypeAdvanced() {
    this.dialogOpts.runtime.data.runValue = this.runValue;
    this.dialogOpts.runtime.data.runType = this.taskData.runType;
    this.dialogOpts.runtime.data.runSpace = this.taskData.runSpace;
    this.dialogOpts.runtime.data.runSpaces = this.taskData.runSpaces;
    this.dialogOpts.runtime.data.runTime = this.taskData.runTime;
    this.dialogOpts.runtime.data.runDay = this.dialogOpts.runtime.data.runTime.substr(8, 2);
    this.dialogOpts.runtime.data.runHour = this.dialogOpts.runtime.data.runTime.substr(11, 2);
    this.dialogOpts.runtime.data.runMinute = this.dialogOpts.runtime.data.runTime.substr(14, 2);
    this.updateFrequencys(this.dialogOpts.runtime.data);
    this.dialogOpts.runtime.visible = true;
  }


  onRuleTypeAdvancedOk() {
    let spaces = [];
    let list = [];
    if (this.dialogOpts.runtime.data.runType == 4) {
      list = this.runWeekList;
    } else if (this.dialogOpts.runtime.data.runType == 5) {
      list = this.runMonthList;
    } else if (this.dialogOpts.runtime.data.runType == 6) {
      list = this.runYearList;
    }
    for (let vo of list) {
      if (vo.status) {
        spaces.push(vo.value);
      }
    }
    if (this.dialogOpts.runtime.data.runType >= 4 && spaces.length == 0) {
      this.tipWarnMessage('请至少选择一个执行频率！');
      return false;
    }
    this.runValue = this.dialogOpts.runtime.data.runValue;
    this.taskData.runType = this.dialogOpts.runtime.data.runType;
    this.taskData.runSpace = this.dialogOpts.runtime.data.runSpace;
    this.taskData.runSpaces = spaces.length == 0 ? '' : spaces.join(',');
    this.taskData.runTime = '2018-01-';
    this.taskData.runTime += this.dialogOpts.runtime.data.runDay + ' ';
    this.taskData.runTime += this.dialogOpts.runtime.data.runHour + ':';
    this.taskData.runTime += this.dialogOpts.runtime.data.runMinute + ':00';
    this.dialogOpts.runtime.visible = false;
    return true;
  }

  onRuleTypeChangeAdvanced(event) {
    let value = event.value;
    Object.assign(this.dialogOpts.runtime.data, value);
    this.dialogOpts.runtime.data.runDay = this.dialogOpts.runtime.data.runTime.substr(8, 2);
    this.dialogOpts.runtime.data.runHour = this.dialogOpts.runtime.data.runTime.substr(11, 2);
    this.dialogOpts.runtime.data.runMinute = this.dialogOpts.runtime.data.runTime.substr(14, 2);
    this.updateFrequencys(this.dialogOpts.runtime.data);
  }

  initRuntimeList() {
    if (this.runHourList.length > 0) return;
    for (let i = 0; i <= 23; i++) {
      this.runHourList.push({value: this.paddingLeft(i, '0'), label: i + ''});
    }
    for (let i = 0; i <= 59; i++) {
      this.runMinuteList.push({value: this.paddingLeft(i, '0'), label: i + ''});
    }
    for (let i = 1; i <= 31; i++) {
      this.runDayList.push({value: this.paddingLeft(i, '0'), label: i + ''});
    }
    let months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    for (let i = 1; i <= 12; i++) {
      this.runYearList.push({value: i + '', label: months[i - 1]});
    }
    let weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    for (let i = 1; i <= 7; i++) {
      this.runWeekList.push({value: i + '', label: weeks[i - 1]});
    }
    for (let i = 1; i <= 31; i++) {
      this.runMonthList.push({value: i + '', label: i + '号'});
    }
  }

  paddingLeft(obj, paddingStr) {
    let str = obj + '';
    if (str.length < 2) {
      str = paddingStr + str;
    }
    return str;
  }

  updateFrequencys(data) {
    let list = null;
    if (data.runType == 4) {
      list = this.runWeekList;
    } else if (data.runType == 5) {
      list = this.runMonthList;
    } else if (data.runType == 6) {
      list = this.runYearList;
    } else {
      return;
    }
    let spaces = data.runSpaces ? data.runSpaces.split(',') : [];
    for (let vo of list) {
      let flag = false;
      for (let space of spaces) {
        if (space == vo.value) {
          flag = true;
          break;
        }
      }
      vo.status = flag;
    }
  }

  onRuleDelete(rule: ConvertRule) {
    if (rule.type < 3) {
      this.tipWarnMessage('选择源表和选择目标表不能删除！');
      return;
    }
    let ruleIndex = this.getRuleIndex(rule.id);
    if (ruleIndex < 0) {
      this.tipWarnMessage('当前规则不存在！');
      return;
    }
    this.dialogConfirmMessage('删除规则', '您是否确定删除当前规则？', () => {
      this.onRuleDeleteOK(rule);
    });
  }

  onRuleDeleteOK(rule: ConvertRule) {
    let nextRule = rule.getNextRule();
    let ruleIndex = this.getRuleIndex(rule.id);
    if (ruleIndex < 0) {
      this.tipWarnMessage('当前规则不存在！');
      return;
    }
    this.rules.splice(ruleIndex, 1);
    rule.getPrevRule().setNextRule(nextRule, this.rules);
    if (this.rule && this.rule.id == rule.id) {
      this.rule = null;
    }
    nextRule.checkAllAfter();
  }

  onRuleUpdate(rule: ConvertRule) {
    let status = rule.open();
    if (status === false) {
      return false;
    }
    this.ruleType = rule.type;
    this.rule = rule;
  }

  //添加规则事件
  onRuleAdd(rule?: ConvertRule) {
    if (!rule) {
      //取最后一个非目标规则对象
      for (let i = this.rules.length - 1; i >= 0; i--) {
        if (this.rules[i].type != ConvertRule.Type_Target) {
          rule = this.rules[i];
          break;
        }
      }
    }
    this.ruleTypeList = [];
    for (let t of ConvertRule.ruleTypeList) {
      this.ruleTypeList.push(Object.assign({}, t));
    }
    this.dialogOpts.select.rule = rule;
    this.dialogOpts.select.selectType = -1;
    this.dialogOpts.select.visible = true;
  }

  //点击单个规则时，更新规则类型
  selectRuleClick(ruleType) {
    for (let rt of this.ruleTypeList) {
      delete rt.selected;
    }
    ruleType.selected = true;
    this.dialogOpts.select.selectType = ruleType.type;
  }


  selectRuleOk() {
    if (this.dialogOpts.select.selectType < 0) {
      this.tipWarnMessage('请选择一个转换规则！');
      return;
    }
    let newId = this.dialogOpts.select.rule.getNewId();
    let busType = this.sourceRule.businessType;
    debugger;
    console.info(busType);
    let newRule = this.newConvertRuleByType(this.dialogOpts.select.selectType, {id: newId}, busType);
    if (!newRule) {
      return false;
    }
    let index = this.getRuleIndex(this.dialogOpts.select.rule.id);
    this.rules.splice(index + 1, 0, newRule);
    let oldNextRule = this.dialogOpts.select.rule.getNextRule();
    this.dialogOpts.select.rule.setNextRule(newRule, this.rules);
    newRule.setNextRule(oldNextRule, this.rules);
    this.dialogOpts.select.visible = false;
    this.onRuleUpdate(newRule);
  }

  newConvertRuleByType(type: number, param: any, busType: any): ConvertRule {
    let newRule: ConvertRule = null;
    if (type == ConvertRule.Type_StringOper) {
      newRule = new ConvertRuleStringoper(param, busType);
    } else if (type == ConvertRule.Type_Calculator) {
      newRule = new ConvertRuleCalculator(param, busType);
    } else if (type == ConvertRule.Type_UniqueRows) {
      newRule = new ConvertRuleUniquerow(param, busType);
    } else if (type == ConvertRule.Type_AddConstant) {
      newRule = new ConvertRuleAddconstant(param, busType);
    } else if (type == ConvertRule.Type_Stringreplace) {
      newRule = new ConvertRuleStringreplace(param, busType);
    } else if (type == ConvertRule.Type_Splitfieldtorows) {
      newRule = new ConvertRuleSplitfieldtorows(param, busType);
    } else if (type == ConvertRule.Type_Numberrange) {
      newRule = new ConvertRuleNumberrange(param, busType);
    } else if (type == ConvertRule.Type_ValueMapper) {
      newRule = new ConvertRuleValuemapper(param, busType);
    } else if (type == ConvertRule.Type_Split) {
      newRule = new ConvertRuleSplitfield(param, busType);
    } else if (type == ConvertRule.Type_Concat) {
      newRule = new ConvertRuleConcatfield(param, busType);
    } else if (type == ConvertRule.Type_TypeConvert) {
      newRule = new ConvertRuleTypeconvert(param, busType);
    } else if (type == ConvertRule.Type_StringCut) {
      newRule = new ConvertRuleStringcut(param, busType);
    } else if (type == ConvertRule.Type_DynamicValueMapping) {
      newRule = new ConvertRuleDynamicValuemapper(param, busType);
    } else if (type == ConvertRule.Type_ExecuteSql) {
      newRule = new ConvertRuleExecuteSql(param, busType);
    } else {
      this.dialogMessage('功能开发中...');
      return null;
    }
    return newRule;
  }

  public getRuleIndex(id: number) {
    let index = -1;
    for (let i = 0; i < this.rules.length; i++) {
      if (this.rules[i].id == id) {
        index = i;
        break;
      }
    }
    return index;
  }


  onRuleClose() {
    let r = this.rule;
    this.rule = null;
    r.close();
  }


  saveDataTaskOk() {
    // debugger;
    if (this.checkAjaxFlag()) {
      return false;
    }
    let flag = this.validData(this.valid, 'taskData', this);
    if (!flag) {
      this.removeAjaxFlag();
      return false;
    }
    flag = this.sourceRule.checkAllAfter();
    if (!flag) {
      this.tipWarnMessage('请完善所有步骤！');
      this.removeAjaxFlag();
      return false;
    }
    this.taskData.steps.splice(0, this.taskData.steps.length);
    for (let r of this.rules) {
      let ruleData = r.getDataWhole();
      this.taskData.steps.push(JSON.stringify(ruleData));
      // JSON.parse
    }
    let url = 'datatask/' + (this.operType == 1 ? 'insertDataTask' : 'updateDataTask');
    let queryParam = {
      businessType: this.businessType
    };
    this.taskData.runStatus = this.pageParam.startTask;
    this.getHttpClient().post(url, queryParam, this.taskData, data => {
      this.tipMessage('数据资源任务' + this.getOperName() + '成功！');
      if (this.operType == 1 && this.pageParam.appendAdd === true) {
        this.reloadRouterLink([this.getRouterName() + '/add'], Object.assign({}, this.routerParams, {appendAdd: true}));
        return true;
      }
      this.goback();
    }, null, () => {
      this.removeAjaxFlag();
    });
  }

  openTableDetail(fieldList: Array<any>, tableInfo: any, type: any) {
    this.dialogOpts.tabledetail.fieldList = fieldList;
    this.dialogOpts.tabledetail.tableInfo = tableInfo;
    this.dialogOpts.tabledetail.typeList = [];
    for (let field of this.dialogOpts.tabledetail.fieldList) {
      let t = this.sourceRule.getFieldChangeType(field.dataType, this.dialogOpts.tabledetail.tableInfo.dbType);
      this.dialogOpts.tabledetail.typeList.push(t);
    }
    this.dialogOpts.tabledetail.type = type;
    this.dialogOpts.tabledetail.visible = true;
  }

  public valid = {
    taskData: {
      _fields: ['taskName', 'dataType', 'runType'],
      taskName: {
        status: false,
        msg: '',
        valids: [
          {required: true, msg: '资源名称不能为空！'},
          {minLength: 2, msg: '资源名称最小长度为2！'}
        ]
      },
      dataType: {
        status: false,
        msg: '',
        valids: [
          {required: true, msg: '请选择数据类型！'}
        ]
      },
      runType: {
        status: false,
        msg: '',
        valids: [
          {required: true, msg: '请选择同步时间！'}
        ]
      }
    }
  };

  goback() {
    this.getRouter().navigate([this.getRouterName() + '/search'], {queryParams: {back: true}});
  }

  setBusinessType(businessType: number) {
    this.businessType = businessType;
    this.taskData.businessType = businessType;
    let path = this.getRouterPath();
    if (path.endsWith('add')) {
      this.operType = 1;
    } else if (path.endsWith('edit')) {
      this.operType = 2;
    } else {
      this.operType = 3;
    }
  }


  isRuleOpen(): boolean {
    return this.rule && this.rule.type >= 0;
  }

  public isIssue() {
    return this.businessType == 1;
  }

  public getFunctionName() {
    return this.businessType == 1 ? '发布数据资源' : '订阅数据资源';
  }

  public getFunctionShortName() {
    return this.businessType == 1 ? '发布' : '订阅';
  }

  public getOperName() {
    return this.operType == 1 ? '新增' : (this.operType == 2 ? '修改' : '查看');
  }

  public getRouterName() {
    return this.businessType == 1 ? 'index/datashare/issueDataResources' : 'index/datashare/subscribeDataResources';
  }
}
