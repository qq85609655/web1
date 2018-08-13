import {Component, OnInit} from '@angular/core';
import {BaseComponent} from '../../../../components/base/base.component';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-data-editsql',
  templateUrl: './data-editsql.component.html',
  styleUrls: ['./data-editsql.component.css']
})
export class DataEditsqlComponent extends BaseComponent implements OnInit {
  public continueAdd: boolean = false;

  public operType = 1;//1新增 2修改 3查看
  public dbSourceList = []; //根据当前机构id 去查询其下面配置哪些数据源

  constructor(public _ActivatedRoute: ActivatedRoute) {
    super();
    let path = this.getRouterPath();
    if (path.endsWith('add')) {
      this.operType = 1;
    } else if (path.endsWith('edit')) {
      this.operType = 2;
    } else {
      this.operType = 3;
    }
  }

  plsqls = {
    dbSourceId: 0,
    name: '',
    content: '',
    aliansName: '',
    id: 0,
    remark: '',
    orgId: ''
  };

  public routerParams: any;

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

  ngOnInit() {
    this._ActivatedRoute.queryParams.subscribe(params => {
      if (this.operType == 1) {
        this.plsqls.orgId = params.orgId;
        if (params.continueAdd && params.continueAdd == 'true') {
          this.continueAdd = true;
        }
      } else {
        this.plsqls.id = params.id;
      }
      this.routerParams = params;
    });
    this.initDbSourceList();
    if (this.operType > 1) {
      this.getHttpClient().get('plsql/getInfoById', {id: this.plsqls.id}, data => {
        Object.assign(this.plsqls, data);
      });
    }
  };

  initDbSourceList() {
    this.dbSourceList = [];
    this.getHttpClient().get('plsql/getDbSourceListByOrgId', {orgId: this.plsqls.orgId}, data => {
      if (data && data.length > 0) {
        for (let d of data) {
          this.dbSourceList.push({label: d.name, value: d.id});
        }
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
    this.getRouter().navigate(['index/datashare/plsql/search'], {queryParams: {back: true}});
  }

  toTestOk() {
    if (this.operType < 3) {
      let flag = this.validData(this.valid, 'plsql', this);
      if (!flag) {
        return false;
      }
    }
    this.getHttpClient().post('plsql/checkOut', null, this.plsqls, (data) => {
      if (data == 'true' || data == true) {
        this.dialogMessage('sql脚本可以执行！');
        this.showResult();
      } else {
        this.dialogMessage('脚本无法执行！');
        this.showErrors();
      }
    });
  }

  showResult() {

  }

  showErrors() {

  }

  toSaveOk() {
    if (this.checkAjaxFlag()) {
      return false;
    }
    let flag = this.validData(this.valid, 'plsqls', this);
    if (!flag) {
      this.removeAjaxFlag();
      return false;
    }
    let url = 'plsql/insertData';
    if (this.operType > 1) {
      url = 'plsql/updateData';
    }
    this.getHttpClient().post(url, null, this.plsqls, (data) => {
      this.tipMessage('数据源' + (this.operType == 1 ? '新增' : '修改') + '成功！');
      if (this.operType == 1 && this.continueAdd == true) {
        this.reloadRouterLink(['index/datashare/plsql/add'], Object.assign({}, this.routerParams, {continueAdd: true}));
        return;
      }
      this.goback();
    }, null, () => {
      this.removeAjaxFlag();
    });
  }

  public valid = {
    plsqls: {
      _fields: ['name', 'dbSourceId', 'aliansName', 'content'],
      name: {
        status: false,
        name: '名称',
        valids: [{required: true}, {regexp: '', msg: '名称格式错误，仅支持字母数字下划线中划线！'}]
      },
      dbSourceId: {
        status: false,
        name: '数据来源',
        valids: [{required: true}]
      },
      aliansName: {
        status: false,
        name: '英文名称',
        valids: [{required: true}, {regexp: '', msg: '英文名称格式错误，仅支持字母数字下划线中划线！'}]
      },
      content: {
        status: false,
        name: '查询脚本',
        valids: [{required: true}]
      },
    }
  };
}
