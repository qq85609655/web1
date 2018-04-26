import {Component, EventEmitter, OnInit} from '@angular/core';
import {BaseComponent} from '../../../../../components/base/base.component';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';

export class DataItemInfoComponent extends BaseComponent implements OnInit {
  constructor(public _ActivatedRoute: ActivatedRoute) {
    super();
    //this.initSourceIdAndType(1 );
  }


  queryParam = {
    nodeId: 0
  };

  public tableEvent: EventEmitter<any> = new EventEmitter();

  public codeTableOpts = {
    that: this,
    queryMethod: 'post',
    queryUrl: 'codestandard/queryCodeALL',
    pageParam: {
      pageNum: 1,
      pageSize: 1000
    },//可使用默认值
    isPage: false,//是否分页
    defaultPageSize: 1000,
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
    usingCache: false,
    buttonOptions: [],
    selections: [],
    emptyMessage: '暂无数据',
    tableEvent: this.tableEvent
  };

  initSourceIdAndType(sourceId: number) {
    this.sourceId = sourceId;
    let type = '';
    this._ActivatedRoute.params.subscribe(params => {
      type = params['type'];
    });
    this.operType = 3;
    if (type == 'add') {
      this.operType = 1;
    } else if (type == 'edit') {
      this.operType = 2;
    }
  }

  public sourceId = 1;
  public operType = 2; //1新增，2修改，3查看
  public routeParams = {
    appendAdd: false
  };

  public subclassNode = {
    subclassCode: '',
    subclassName: ''
  };
  public itemData = {
    id: 0,
    subclassCode: '',
    subclassName: '',
    // itemCode: "",
    itemName: '',
    itemComment: '',
    dataType: 'C',
    dataLength: '50',
    dataPrimarykey: 0,
    dataNullable: 1,
    dataValueSource: '',
    dataExplain: '',
    dataReferenced1: '',
    dataReferenced2: '',
    dataReferenced3: '',
    selectable: 'O'
  };
  public valid = {
    itemData: {
      /*     itemCode: {
            status: false,
            name: "编号",
            valids: [{ required: true }, { regexp: this.regexp_code }]
          },*/
      itemName: {
        status: false,
        name: '数据项名',
        valids: [{required: true}]
      },
      dataType: {
        status: false,
        name: '类型',
        valids: [{required: false}]
      },
      itemComment: {
        status: false,
        name: '中文名称',
        valids: [{required: true}, {regexp: this.regexp_char2, msg: '中文名称格式错误，仅支持中文字母数字！'}]
      },
      dataPrimarykey: {
        status: false,
        name: '主键',
        valids: [{required: true, nullValue: -1}]
      },
      dataLength: {
        status: false,
        name: '长度',
        valids: [{required: true}, {regexp: /^[1-9][0-9]*(\,[0-9]+)?$/, msg: '长度格式错误，仅支持单个数字或俩个数字用逗号分割！'}]
      },
      selectable: {
        status: false,
        name: '约束',
        valids: [{required: false}]
      },
      dataNullable: {
        status: false,
        name: '是否可空',
        valids: [{required: false, nullValue: -1}]
      }
    }
  };

  public appendAdd = false;

  public DataReferencedList = [{value: '', label: '请选择'}, {value: '1001', label: '干部人事管理代码'},
    {value: '1002', label: '国家标准代码'}, {value: '1003', label: '行业标准代码'}, {value: '1004', label: '学科专业资产代码'}, {
      value: '1000',
      label: '国家教育代码'
    }];

  public DataReferencedList2 = [];

  public DataReferencedList3 = [];


  public isShow1 = true;
  public isShow2 = false;
  public isShow3 = false;
  public isShow4 = false;

  public change1() {
    var dt = this.itemData;
    var ref1 = dt.dataReferenced1;
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
          this.isShow2 = true;
          if (ref1 == '1000') {
            this.isShow3 = true;
          } else {
            this.isShow3 = false;
          }
          this.isShow4 = false;
        }
      }
    );
  }

  changeForReferenced() {
    // debugger;
    this.isShow1 = false;
    var dtt = this.itemData;
    var keyflag = dtt.dataPrimarykey;
    if (keyflag == 1) {
      this.isShow1 = false;
      this.isShow2 = false;
      this.isShow3 = false;
      this.isShow4 = false;
    } else {
      this.isShow1 = true;
    }
  }

  public change2() {
    // debugger;
    var dt = this.itemData;
    let ref2 = dt.dataReferenced2;
    // console.info(ref2);
    //接着 加载2级类
    this.getHttpClient().get(
      'codestandard/queryNodesByParentId',
      {parentNode: ref2, type: 2},
      data => {
        console.info(data.length);
        if (data && data.length > 0) {
          for (let d of data) {
            console.info(d.nodeId + '----' + d.name);
            this.DataReferencedList3.push({value: d.nodeId, label: d.name});
          }
          this.isShow3 = true;
        } else {//说明 此时到了最后一级  那就显示 其代码值 列表 供参考
          this.isShow3 = false;
          this.isShow4 = true;
          this.flushTable(ref2);
        }
      }
    );
  }

  public flushTable(v: any) {
    console.info('ref========', v);
    this.queryParam.nodeId = parseInt(v);
    this.tableEvent.emit({flush: true});
  }

  public change3() {
    var dt = this.itemData;
    var ref3 = dt.dataReferenced3;
    //接着 加载2级类
    this.getHttpClient().get(
      'codestandard/queryNodesByParentId',
      {parentNode: ref3, type: 3},
      data => {
        if (data != null) {
          this.isShow4 = true;
          //展示详情：
          this.queryParam.nodeId = parseInt(ref3);
          this.tableEvent.emit({flush: true});
        }
      }
    );
  }

  public show1() {
    return this.isShow1;
  }

  public show2() {
    return this.isShow2;
  }

  public show3() {
    return this.isShow3;
  }

  public show4() {
    return this.isShow4;
  }


  public dataTypeList = [
    // { value: "", label: "请选择" },
    {value: 'C', label: 'C 字符型'},
    {value: 'D', label: 'D 日期型'},
    {value: 'N', label: 'N 数值型'},
    {value: 'M', label: 'M 币值型'},
    {value: 'B', label: 'B 二进制类型'},
    {value: 'T', label: 'T 文本型'}
  ];
  public dataPrimarykeyList = [
    //  { value: -1, label: "请选择" },
    {value: 0, label: '否'},
    {value: 1, label: '是'}
  ];
  public selectableList = [
    //{ value: "", label: "请选择" },
    {value: 'M', label: '必选'},
    {value: 'O', label: '可选'}
  ];
  public dataNullableList = [
    //{ value: -1, label: "请选择" },
    {value: 1, label: '空'},
    {value: 0, label: '非空'}
  ];
  defaultOption = {label: '请选择', value: ''};

  ngOnInit() {
    this._ActivatedRoute.queryParams.subscribe(params => {
      if (this.operType == 1) {
        this.subclassNode.subclassCode = params.subclassCode;
        this.subclassNode.subclassName = params.subclassName;
        this.itemData.subclassCode = params.subclassCode;
        this.itemData.subclassName = params.subclassName;
        this.appendAdd =
          params.appendAdd === 'true' || params.appendAdd === true;
      } else {
        this.itemData.id = params.id;
      }
      Object.assign(this.routeParams, params);
    });
    if (this.operType > 1) {
      this.getHttpClient().get(
        'datastandarditem/getItemVo',
        {id: this.itemData.id},
        data => {
          if (!data) {
            this.tipWarnMessage('当前元数据不存在或已被删除！');
            return;
          }
          Object.assign(this.itemData, data);
        }
      );
    }
  }


  saveDataOk() {
    let flag = this.validData(this.valid, 'itemData');
    if (!flag) return false;
    var url = '';
    if (this.operType == 1) {
      url = 'datastandarditem/addItemVo';
    } else if (this.operType == 2) {
      url = 'datastandarditem/updateItemVo';
    }
    this.getHttpClient().post(
      url,
      {sourceId: this.sourceId},
      this.itemData,
      data => {
        this.tipMessage((this.operType == 1 ? '新增' : '修改') + '元数据成功！');

        if (this.operType == 1) {
          if (this.appendAdd == true) {
            this.routeParams.appendAdd = true;
            if (this.sourceId == 1) {
              this.reloadRouterLink(
                ['index/CountryMeta/add'],
                this.routeParams
              );
            } else {
              this.reloadRouterLink(
                ['index/school/SchoolMeta/add'],
                this.routeParams
              );
            }
            return;
          }
        }
        this.goback();
      }
    );
  }


  checkDisabled(canModify: boolean) {
    if (this.operType == 3) {
      return true;
    } else if (this.operType == 1) {
      return false;
    } else {
      return !canModify;
    }
  }


  goback() {
    if (this.sourceId == 1) {
      this.getRouter().navigate(['index/CountryMeta/search'], {
        queryParams: {back: true}
      });
    } else {
      this.getRouter().navigate(['index/school/SchoolMeta/search'], {
        queryParams: {back: true}
      });
    }
  }

  getFunctionName() {
    return this.sourceId == 1 ? '元数据' : '元数据';
  }

  getFunctionParentName() {
    return this.sourceId == 1 ? '国家数据标准' : '学校数据标准';
  }

  getOperName() {
    if (this.operType == 1) {
      return '新增';
    } else if (this.operType == 2) {
      return '修改';
    } else if (this.operType == 3) {
      return '查看';
    }
    return '未知';
  }
}
