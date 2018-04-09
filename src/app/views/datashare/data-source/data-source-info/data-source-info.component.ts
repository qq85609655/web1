import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../../../../components/base/base.component";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-data-source-info',
  templateUrl: './data-source-info.component.html',
  styleUrls: ['./data-source-info.component.css']
})
export class DataSourceInfoComponent extends BaseComponent implements OnInit {
  public continueAdd: boolean = false;
  regexp_sourcename = /^[a-zA-Z0-9\_\-]+$/
  public valid = {
    dataSource: {
      _fields:['name','dbType','dbName','host','port','username','password','tableSpaces','indexSpaces'],
      name: {
        status: false,
        name: "数据源名称",
        valids: [{ required: true }, { regexp: '' ,msg : '数据源名称格式错误，仅支持字母数字下划线中划线！'}]
      },
      dbType: {
        status: false,
        name: "数据库类型",
        valids: [{ required: true }]
      },
      dbName: {
        status: false,
        name: "数据库名称",
        valids: [{ required: true }, { regexp: '', msg : '数据库名称格式错误，仅支持字母数字下划线中划线！'}]
      },
      host: {
        status: false,
        name: "IP地址",
        valids: [{ required: true }, { regexp: this.regexp_ip ,msg : 'IP地址格式错误！'}]
      },
      port: {
        status: false,
        name: "端口",
        valids: [{ required: true }, { regexp: this.regexp_plusint ,msg : '端口格式错误！'}]
      },
      username: {
        status: false,
        name: "用户名",
        valids: [{ required: true }, { regexp: this.regexp_sourcename, msg : '用户名格式错误，仅支持字母数字下划线中划线！'}]
      },
      password: {
        status: false,
        name: "密码",
        valids: [{ required: true }]
      },
      tableSpaces:{
        status: false,
        valids: [{ regexp: this.regexp_char, msg : '数据表空间格式错误，仅支持中文字母数字下划线中划线！', condition: (d)=>{return d.dbType ==2 && d.tableSpaces != '';}}]
      },
      indexSpaces:{
        status: false,
        valids: [{ regexp: this.regexp_char, msg : '索引表空间格式错误，仅支持中文字母数字下划线中划线！', condition: (d)=>{return d.dbType ==2 && d.tableSpaces != '';}}]
      }
    }
  };

  dataSource = {
    dbType: 0,
    dbTypeName: '',
    id: 0,
    port: '',
    dbName: '',
    name: '',
    host: '',
    username: '',
    password: '',
    remark: '',
    tableSpaces: '',
    indexSpaces: '',
    orgId:''
  }
  public routerParams: any;
  public dbTypeList =  [
    {value: 2, label: 'Oracle', defaultport: 1521},
    {value: 1, label: 'MySql', defaultport: 3306},
    {value: 3, label: 'MS SQL Server', defaultport: 1433}];

  constructor(public _ActivatedRoute: ActivatedRoute) {
    super();
    let path = this.getRouterPath();
    if (path.endsWith("add")) {
      this.operType = 1;
    } else if (path.endsWith("edit")) {
      this.operType = 2;
    } else {
      this.operType = 3;
    }
  }
  public operType = 1;//1新增 2修改 3查看

  ngOnInit() {
    this._ActivatedRoute.queryParams.subscribe(params => {
      if(this.operType == 1){
        this.dataSource.orgId = params.orgId;
        if(params.continueAdd && params.continueAdd == 'true' ){
          this.continueAdd = true;
        }
      }else{
        this.dataSource.id = params.id;
      }
      this.routerParams = params;
    });
    if(this.operType > 1){
      this.getHttpClient().get("datasource/getDataInfoById", {id: this.dataSource.id}, data => {
        Object.assign(this.dataSource, data);
      });
    }
  };

//选择数据库类型
  onDbtypeChange() {
    if(this.operType == 1){
      if(this.dataSource.dbType  ==  1){
        this.dataSource.port = '3306';
      }else if(this.dataSource.dbType  ==  2){
        this.dataSource.port = '1521';
      }else if(this.dataSource.dbType  ==  3){
        this.dataSource.port = '1433';
      }
    }
  }

  toSaveOk() {
    if(this.checkAjaxFlag()){
      return false;
    }
    let flag = this.validData(this.valid,'dataSource', this);
    if (!flag) {
      this.removeAjaxFlag();
      return false;
    }
    let url = 'datasource/insertData';
    if(this.operType > 1){
      url = 'datasource/updateData';
    }
    this.getHttpClient().post(url, null, this.dataSource,  (data)=> {
      this.tipMessage("数据源"+(this.operType == 1 ? "新增":"修改")+"成功！");
      if(this.operType == 1 && this.continueAdd == true){
        this.reloadRouterLink(["index/datashare/datasource/add"], Object.assign({}, this.routerParams,{continueAdd:true}));
        return;
      }
      this.goback();
    },null,()=>{this.removeAjaxFlag();});
  }

  //测试连接
  toTestOk() {
    if(this.operType < 3){
      let flag = this.validData(this.valid,'dataSource', this);
      if (!flag) {
        return false;
      }
    }
    this.getHttpClient().post("datasource/connect", null, this.dataSource,  (data)=> {
      if (data == "true" || data == true) {
        this.dialogMessage("测试连接成功！");
      }else{
        this.dialogMessage("测试连接失败！");
      }
    });
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
    this.getRouter().navigate(['index/datashare/datasource/search'], {queryParams: {back: true}});
  }
  getOperName() {
    if (this.operType == 1) {
      return "新增";
    } else if (this.operType == 2) {
      return "修改";
    } else if (this.operType == 3) {
      return "查看";
    }
    return "未知";
  }
}
