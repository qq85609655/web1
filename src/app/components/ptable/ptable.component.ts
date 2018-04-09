import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { HttpClient } from "../http-client.service";
import {BaseComponent} from "../base/base.component";

@Component({
  selector: 'app-ptable',
  templateUrl: './ptable.component.html',
  styleUrls: ['./ptable.component.css']
})
export class PtableComponent extends BaseComponent implements OnInit, OnDestroy {

  public totalRecords = 0;
  public firstRecord = 0;
  public tableOptsDefault = {
    that: this,
    queryMethod: 'post',
    queryUrl: "",
    pageParam: {
      pageNum: 1,
      pageSize: 10
    },//可使用默认值
    isPage: true,//是否分页
    defaultPageSize: 10,
    rowsPerPageOptions:[10,30,50,100],
    queryParam: {

    },//页面选择的查询参数，包括树节点id等信息
    bodyParam: {

    },//请求体中的参数
    queryResultField: ['id'],//第一个值指定id的字段名,主要用于修改删除，状态切换
    tableType: 'single',//树类型，simple/checkbox
    isColGroup: false,//是否是混合表头,rowspan colspan大于1
    usingCache:false,
    loading:false,//查询比较慢的时候是否显示加载中效果

    //混合表头的格式再定义
    //checkbox类型表示当前列显示checkbox
    //number支持俩种类型，//number：12345, numberpage加上页码后的数字：21 22 23...
    //普通的字段可支持link、format， link使用回调函数的方式实现
    //button表示按钮列，每一列可以多个按钮，根据buttonOptions指定字段可以给多列都使用按钮
    //title 为true表示需要title熟悉
    theadOptions: [
      { name: '', type: 'checkbox' },
      { name: '序号', type: 'number' },
      { name: '数据资源名称', field: 'name', link: (index,item)=>{} },
      { name: '数据类型', field: 'typeName' ,title : true },
      { name: '同步计划', field: 'scheduleName' },
      { name: '状态', field: 'scheduleName', type: 'switch', queryUrl: '', queryParam: {}, switchName: ['On', 'Off'] ,disabled:null},
      { name: '所属节点名称', field: 'resourceTreeName' },
      { name: '说明', field: 'description' },
      { name: '操作', type: 'button', buttonOptions: 'buttonOptions' }
    ],
    //callback指定回调的方法，
    //disabled指定按钮是否禁用
    //hidden指定按钮是否隐藏
    //此三个方法参数一样,共俩个，第一个index,第二个当前行item
    buttonOptions: [
      { name: '修改', callback: null, disabled: null, hidden: null },
      { name: '删除', callback: null, disabled: null, hidden: null },
      { name: '启动', callback: null, disabled: null, hidden: null },
      { name: '停止', callback: null, disabled: null, hidden: null },
    ],
    dataHandler:null,//用于对返回的数据行处理一下，得到显示的文字
    selections: [],//由此组件传递已选择的列表
    emptyMessage: '暂无数据',
    tableEvent: null
  };

  @Input() tableOpts: any;
  @Output() selectionChange = new EventEmitter();
  tableData = [];
  tableEvent: EventEmitter<any>;

  selections = [];
  dataloading=false;


  constructor(public _HttpClient: HttpClient) {super() }

  ngOnInit() {
    this.tableOpts = Object.assign({}, this.tableOptsDefault, this.tableOpts);
    if(this.tableOpts.usingCache === true){
      //读取缓存数据，加载树
      let data = this.getSelectCacheService().getTableData();
      if(data){
        Object.assign(this.tableOpts.pageParam , data.pageParam);
        Object.assign(this.tableOpts.queryParam, data.queryParam);
        Object.assign(this.tableOpts.bodyParam, data.bodyParam);
      }
    }

    this.tableEvent = this.tableOpts.tableEvent;
    if (this.tableEvent) {
      this.tableEvent.subscribe(params => {
        if (!params) {
          return;
        }
        if (params.flush == true) {
          this.flushTable();
        }else if (params.saveStatus == true) {
          this.saveTableStatus(params.callback);
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.tableEvent) {
      this.tableEvent.unsubscribe();
    }
  }

  flushTable() {
    var that = this;
    if (this.tableOpts.queryMethod.toLowerCase() == 'get') {
      var query = {};
      Object.assign(query, this.tableOpts.queryParam);
      if (this.tableOpts.isPage) {
        Object.assign(query, this.tableOpts.pageParam);
      }
      if(this.tableOpts.loading){
        this.tableData = [];
        this.dataloading = true;
      }
      that._HttpClient.get(this.tableOpts.queryUrl, query, data => {
        this.flushTableData(data);
      },null, ()=>{
        if(this.tableOpts.loading){
          this.dataloading = false;
        }
      });
      return;
    }
    if (this.tableOpts.queryMethod.toLowerCase() == 'post') {
      var query = {};
      Object.assign(query, this.tableOpts.queryParam);
      var body = {};
      Object.assign(body, this.tableOpts.bodyParam);
      if (this.tableOpts.isPage) {
        Object.assign(body, this.tableOpts.pageParam);
      }
      if(this.tableOpts.loading){
        this.tableData = [];
        this.dataloading = true;
      }
      that._HttpClient.post(this.tableOpts.queryUrl, query, body, data => {
        this.flushTableData(data);
      },null, ()=>{
        if(this.tableOpts.loading){
          this.dataloading = false;
        }
      });
      return;
    }
  }
  private flushTableData(data){
    let tableData:any;
    if (this.tableOpts.isPage) {
      tableData = data.list;
      this.totalRecords = data.total;
      this.firstRecord = (data.pageNum - 1) * this.tableOpts.pageParam.pageSize + 1;
      if(!data.list || data.list.length == 0){
        if(data.pageNum > 1){
          this.tableOpts.pageParam.pageNum = 1;
          this.flushTable();
        }
      }
    } else {
      tableData = data;
    }
    if(this.tableOpts.dataHandler){
      for(let row of tableData){
        this.tableOpts.dataHandler.call(this.tableOpts.that, row);
      }
    }


    let columnIndexs = [];
    for(let ci =0; ci < this.tableOpts.theadOptions.length;ci++){
      let column = this.tableOpts.theadOptions[ci];
      if(column.class){
        columnIndexs.push(ci);
      }
    }
    if(columnIndexs.length > 0) {
      for (let row of tableData) {
        row._class = new Array(this.tableOpts.theadOptions.length);
        for(let ci of columnIndexs){
          let column = this.tableOpts.theadOptions[ci];
          if(!column.class){
            continue;
          }
          let newClass:any = {};
          for(let c in column.class){
            if(column.class[c] === true || column.class[c] === false){
              newClass[c] = column.class[c];
            }else{
              newClass[c] = column.class[c](row);
            }
          }
          row._class[ci] = newClass;
        }

      }
    }else{
      for (let row of tableData) {
        row._class = [];
      }
    }

    this.tableData = tableData;
    if(this.tableOpts.selections){
      this.tableOpts.selections.splice(0, this.tableOpts.selections.length);
    }
  }




  saveTableStatus(callback?: Function){
    let tableStatus = {
      pageParam : this.tableOpts.pageParam,
      queryParam:this.tableOpts.queryParam,
      bodyParam:this.tableOpts.bodyParam
    };
    this.getSelectCacheService().setTableData(tableStatus);
    if(callback){
      callback();
    }
  }

  /**
   * switch切换事件，目前不允许自定义
   * @param event
   * @param colunmIndex
   * @param data
   */
  onHandleSwitchChange(event, colunmIndex, data) {
    var query = {
      checked: event.checked
    };
    //提交传递的字段名跟table返回的数据字段名保持一致
    query[this.tableOpts.queryResultField[0]] = data[this.tableOpts.queryResultField[0]];
    var columnOption = this.tableOpts.theadOptions[colunmIndex];
    if (columnOption.queryParam) {
      query = Object.assign({}, columnOption.queryParam, query);
    }
    //console.log(this.tableOpts.queryResultField[0]);
    //console.log(colunmIndex, data, columnOption);
    this._HttpClient.get(columnOption.queryUrl, query, data => {

    }, ()=>{this.flushTable();});
  }

  onPageChange(event) {
    let pageNum = this.tableOpts.pageParam.pageNum;
    let pageSize = this.tableOpts.pageParam.pageSize;
    this.tableOpts.pageParam.pageNum = event.page + 1;
    this.tableOpts.pageParam.pageSize = event.rows;
    if (this.tableOpts.pageParam.pageNum != pageNum || this.tableOpts.pageParam.pageSize != pageSize) {
      this.flushTable();
    }
  }

  callFrom(method: Function, arg0?: any, arg1?: any, arg2?: any): any {
    if (!method) {
      return false;
    }
    var that = this.tableOpts.that;
    return method.call(that, arg0, arg1, arg2);
  }

  onSelectionChange(event){
    this.selectionChange.emit(event);
    console.log(event);
  }
}
