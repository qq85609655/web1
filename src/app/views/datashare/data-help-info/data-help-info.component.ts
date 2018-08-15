import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "../../../components/http-client.service";
import {BaseComponent} from "../../../components/base/base.component";


@Component({
  selector: 'app-data-help-info',
  templateUrl: './data-help-info.component.html',
  styleUrls: ['./data-help-info.component.css']
})
export class DataHelpInfoComponent extends BaseComponent implements OnInit, OnDestroy {

  error: any;
  @Input() tabelData: any;

  tableOps; //表格配置项，分别从各个组件传人
  pageLength: any = ['10', '15', '20']; //单页显示多少条数据
  //获取表格数据的 参数
  public params: any = {
    connectionId: 0,
    tableName: '',
    from: '',
    source: ''
  };

  public  sourceList = [

  ];

  public  tableNameList = [

  ];

  public fromList = [
    {label: '中心库', value: 1},
    {label: '用户库', value: 2}];

  public isLastItem: boolean = false;

  public indexs: any;//页码选中

  constructor(public _Router: Router,
              public _HttpClient: HttpClient) {
    super();
  }

  ngOnInit() {

    /* this._ActivatedRoute.queryParams.subscribe(params => {
       this.params.connectionId = params.connectionId;
       this.params.tableName = params.tableName;
       //根据链接id 和表名 查询出来 其表头 和 数据加载到页面
       this._HttpClient.get("", {id: this.params.id}, data => {

       });
     });*/
  }
  flushData(){
   // alert("查询....");

    this._HttpClient.get("dataInfo/queryTableDatas", {id: this.params.id}, data => {

    });
  }


  //操作
  prePage() {
    var prePageNum = 0;
    if (this.tabelData.pageNum == 1) {
      return;
    } else {
      prePageNum = this.tabelData.pageNum - 1;
    }
    this.setSearch(prePageNum, this.tabelData.pageSize);
  }

  nextPage() {
    var nextPageNum = 0;
    if (this.tabelData.pageNum == this.tabelData.pages) {
      return;
    } else {
      nextPageNum = this.tabelData.pageNum + 1;
    }
    this.setSearch(nextPageNum, this.tabelData.pageSize);
  }

  firstPage() {
    var nextPageNum = 1;
    this.setSearch(nextPageNum, this.tabelData.pageSize);
  }

  lastPage() {
    var lastPageNum = this.tabelData.pages;
    this.setSearch(lastPageNum, this.tabelData.pageSize);
  }

  numberPage(pageNumber) {
    let pageNum = pageNumber;
    if (pageNum > this.tabelData.pages) {
      pageNum = this.tabelData.pages;
    }
    this.setSearch(pageNum, this.tabelData.pageSize);
  }

  goNumberPage(pageNumber) {
    let pageNum = pageNumber.value;
    if (pageNum > this.tabelData.pages) {
      pageNum = this.tabelData.pages;
    }

    pageNumber.value = pageNum;
    this.setSearch(pageNum, this.tabelData.pageSize);
  }

  setSearch(pageNum: number, pageSize: number) {//设置pageNum，pageSize
    var that = this;
    that.tableOps.params.pageNum = pageNum;
    that.tableOps.params.pageSize = pageSize;
    this.indexs = that.tableOps.params.pageNum;
  }

  changePageSize(pageLenItem) {
    var pageNumber = 1;
    var pageSize = pageLenItem;
    this.setSearch(pageNumber, pageSize);
  }
}
