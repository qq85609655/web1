import {Component, OnInit, ViewChild} from '@angular/core';
import {FileUpload, Message} from 'primeng/primeng';
import {Router} from '@angular/router';
import {HttpClient} from '../../../components/http-client.service';
import {BaseComponent} from '../../../components/base/base.component';
import {BaseService} from '../../../components/base/base.service';
import {SystemInfoService} from '../../index/system-info.service';

@Component({
  selector: 'app-config-manager',
  templateUrl: './config-manager.component.html',
  styleUrls: ['./config-manager.component.css']
})
export class ConfigManagerComponent extends BaseComponent implements OnInit {
  msgs: Message[];

  constructor(public _Router: Router,
              public _HttpClient: HttpClient,
              public _SystemInfoService: SystemInfoService) {
    super();
  }


  public bzList = [
    {label: '国家标准', value: 1},
    {label: '国家人才状态标准', value: 2},
  ];

  // 系统设置参数
  public systemparam = {
    sysName: '', //系统名称
    schoolName: '', //学校名称
    file: '', //系统logo 路径
    copyRight: '', //版权信息
    sysLogoUrl: 'common/resources/login_logo.png',
    sfInit: 0,
    initbz: 1,
    kettleInstallPath: '',
    ktrFilesPath: '',
    kjbFilesPath: ''
  };

//选择数据库类型
  onDbtypeChange() {
    if (this.centerDb.dbType == 1) {
      this.centerDb.port = '3306';
    } else if (this.centerDb.dbType == 2) {
      this.centerDb.port = '1521';
    } else if (this.centerDb.dbType == 3) {
      this.centerDb.port = '1433';
    }
  }

  public dbTypeList = [
    {value: 1, label: 'MySql'},
    {value: 2, label: 'Oracle'},
    {value: 3, label: 'MS SQL Server'}];

  // 邮箱设置参数
  public emailparam = {
    emailHost: '', //发件人邮箱
    emailSmtpAddr: '', //SMTP地址
    emailSmtpPort: '', //端口
    emailUser: '', //用户名
    emailPwd: '' //密码
  };

  public centerDb = {
    dbType: 1,
    dbName: '',
    tableSpaces: '',
    port: '',
    username: '',
    password: '',
    ipAddress: ''
  };
  public initparam = {
    sfInit: 0
  };
  dialogOpts = {
    initialization: {
      title: '初始化',
      visible: false
    }
  };

  public valid = {
    systemparam: {
      sysName: {
        status: false,
        name: '系统名称',
        valids: [{required: true}]
      },
      schoolName: {
        status: false,
        name: '学校名称',
        valids: [{required: true}]
      }
    },
    emailparam: {
      emailHost: {
        status: false,
        name: '发件人邮箱',
        valids: [{required: true}, {regexp: this.regexp_email}]
      },
      emailSmtpAddr: {
        status: false,
        name: 'SMTP地址',
        valids: [{required: true}]
      },
      emailSmtpPort: {
        status: false,
        name: '端口',
        valids: [{required: true}, {regexp: this.regexp_natureint}]
      },
      emailUser: {
        status: false,
        name: '用户名',
        valids: [{required: true}]
      },
      emailPwd: {
        status: false,
        name: '密码',
        valids: [{required: true}]
      }
    },
    centerDb: {
      dbType: {
        status: false,
        name: '数据库类型',
        valids: [{required: true}]
      },
      ipAddress: {
        status: false,
        name: 'IP地址',
        valids: [{required: true}]
      },
      dbName: {
        status: false,
        name: '数据库名称',
        valids: [{required: true}]
      },
      username: {
        status: false,
        name: '用户名',
        valids: [{required: true}]
      },
      password: {
        status: false,
        name: '密码',
        valids: [{required: true}]
      }
      , port: {
        status: false,
        name: '端口号',
        valids: [{required: true}]
      }

    }
  };

  flushData() {
  }

  ngOnInit() {
    this._HttpClient.get('config/queryEntity', '', data => {
      debugger;
      this.systemparam = {
        sysName: data.sysName, //系统名称
        schoolName: data.schoolName, //学校名称
        file: data.file, //系统logo 路径
        copyRight: data.copyRight, //版权信息
        sysLogoUrl: data.sysLogoUrl,
        sfInit: data.sfInit,
        initbz: data.initbz,
        kettleInstallPath: data.kettleInstallPath,
        ktrFilesPath: data.ktrFilesPath,
        kjbFilesPath: data.kjbFilesPath
      };
      this.emailparam = {
        emailHost: data.emailHost, //发件人邮箱
        emailSmtpAddr: data.emailSmtpAddr, //SMTP地址
        emailSmtpPort: data.emailSmtpPort, //端口
        emailUser: data.emailUser, //用户名
        emailPwd: data.emailPwd //密码
      };
      this.centerDb ={
        dbType:data.dbType,
        dbName: data.dbName,
        tableSpaces: data.tableSpaces,
        port: data.port,
        username: data.username,
        password: data.password,
        ipAddress: data.ipAddress
      };
      this.initparam.sfInit = data.sfInit;
    });
  }

  saveSystemSetOk() {
    var that = this;
    if (this.fileupload.hasFiles()) {
      this.fileupload.upload();
      return false;
    }
    this.saveSystemSetInfoOk();
  }

  initCenterDataBase() {
    this.dialogOpts.initialization.visible = true;
  }

  initializationOk() {
    this._HttpClient.post('config/initCenterDataBase', this.initparam, {}, data => {
      this.tipMessage('中心库表初始化完成！！');
    });
    this.dialogOpts.initialization.visible = false;
  }

  saveSystemSetInfoOk() {
    let flag = this.validData(this.valid, 'systemparam');
    if (!flag) return false;
    this._HttpClient.post('config/updateSys', null, this.systemparam, data => {
      this.tipMessage('系统设置修改成功！');
      this._SystemInfoService.cleanSystemInfo();
      this._SystemInfoService.initSystemInfo();
      this.reloadRouterLink(['index/sysAdmin/configAdmin'], {});
    });
  }

  /**
   * 变更 中心库链接配置
   * @returns {boolean}
   */
  saveCenterDbInfoOk() {
    let flag = this.validData(this.valid, 'centerDb');
    if (!flag) return false;
    var that = this;
    that._HttpClient.post('config/updateCenterDb', null, this.centerDb, data => {
      if (data) {
        this.tipMessage('中心库链接配置修改成功！');
      }
    });
  }

  /**
   * 变更邮箱服务器配置
   * @returns {boolean}
   */
  saveEmailDataOk() {
    let flag = this.validData(this.valid, 'emailparam');
    if (!flag) return false;
    var that = this;
    that._HttpClient.post('config/updateEmail', null, this.emailparam, data => {
      if (data) {
        this.tipMessage('邮箱设置修改成功！');
      }
    });
  }

  onUpload(event) {
    let http = event.xhr;
    if (http.status < 300) {
      this.saveSystemSetInfoOk();
    } else {
      this.tipWarnMessage('logo上传失败！');
    }
  }

  @ViewChild('fileupload') fileupload: FileUpload;

  onRemove(event) {
    //解决IE兼容问题
    //再IE11下，删除input[file]组件时，会额外调用change事件，此时需要禁止change事件(通过selfInputChange控制)，否则刚刚选择的文件就丢失了
    //但remove时，也删除input[file]组件，但此时不会再有额外change事件，需要手动关闭selfInputChange状态
    if (this.fileupload.isIE11()) {
      setTimeout(() => {
        if (this.fileupload.selfInputChange) {
          this.fileupload.selfInputChange = false;
        }
      }, 100);
    }
  }
}
