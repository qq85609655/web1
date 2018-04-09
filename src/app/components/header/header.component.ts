import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Md5} from 'ts-md5/src/md5';
import {HttpClient} from '../../components/http-client.service';
import {SystemInfoService} from '../../views/index/system-info.service';
import {BaseComponent} from '../base/base.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent extends BaseComponent implements OnInit {

  public sexList = [
    {label: '男', value: 1},
    {label: '女', value: 2}];

  systenInfo: any;
  userInfo: any;

  dialogOpts = {
    editPwd: {
      title: '修改密码',
      visible: false,
      data: {
        oldPwd: '',
        newPwd: '',
        newPwdRepeat: ''
      }
    },
    editUserInfo: {
      title: '修改用户信息',
      visible: false,
      data: {
        userId: 0,
        realName: '',
        userNo: '',
        sex: '',
        email: '',
        orgName: ''
      }
    }
  };


  constructor(public router: Router,
              public _HttpClient: HttpClient,
              public _SystemInfoService: SystemInfoService) {
    super();
    this.systenInfo = this._SystemInfoService.getSystenInfo();
    this.userInfo = this._SystemInfoService.getUserInfo();
  }

  ngOnInit() {

  }

  showHelp() {
    alert('dddddddddddddddddd');
  }

  logoout() {
    this.dialogConfirmMessage('退出', '确定退出?', () => {
      this.getHttpClient().get('common/loginout', null, (data) => {
        if (data.counts == 1) {
          this._SystemInfoService.cleanUserInfo();
          window.top.location.href = data.location;
        }
      });
    });
  }

  editPwd() {
    this.dialogOpts.editPwd.data.oldPwd = '';
    this.dialogOpts.editPwd.data.newPwd = '';
    this.dialogOpts.editPwd.data.newPwdRepeat = '';
    this.validDataClean(this.valid.dialogOpts, 'editPwd');
    this.dialogOpts.editPwd.visible = true;
  }

  editPwdOk() {
    var that = this;
    let flag = this.validData(this.valid.dialogOpts, 'editPwd', this.dialogOpts);
    if (!flag) return false;
    if (this.dialogOpts.editPwd.data.newPwd != this.dialogOpts.editPwd.data.newPwdRepeat) {
      this.tipWarnMessage('俩次密码输入不一致！');
      return false;
    }
    let queryParam = {
      oldPwd: Md5.hashStr(this.dialogOpts.editPwd.data.oldPwd, false),
      newPwd: Md5.hashStr(this.dialogOpts.editPwd.data.newPwd, false)
    };
    this.getHttpClient().get('sysuser/updatePwd', queryParam, () => {
      this.tipMessage('密码修改成功！');
      this.dialogOpts.editPwd.visible = false;
    });
  }

  editUserInfo() {
    if (this.userInfo.userId <= 0) {
      this.tipWarnMessage('用户信息加载中，请稍等！');
      return false;
    }
    for (let key in this.dialogOpts.editUserInfo.data) {
      this.dialogOpts.editUserInfo.data[key] = this.userInfo[key];
    }
    this.validDataClean(this.valid.dialogOpts, 'editUserInfo');
    this.dialogOpts.editUserInfo.visible = true;
  }

  editUserInfoOk() {
    var that = this;
    let flag = this.validData(this.valid.dialogOpts, 'editUserInfo', this.dialogOpts);
    if (!flag) return false;
    this.getHttpClient().post('sysuser/updateMyEntity', null, this.dialogOpts.editUserInfo.data, () => {
      this.tipMessage('个人信息修改成功！');
      this.dialogOpts.editUserInfo.visible = false;
      this._SystemInfoService.cleanUserInfo();
      this._SystemInfoService.initUserInfo();
    });
  }

  public valid = {
    dialogOpts: {
      editUserInfo: {
        data: {
          _fields: ['realName', 'email'],
          realName: {
            status: false,
            name: '姓名',
            valids: [{required: true}]
          },
          email: {
            status: false,
            name: '邮箱',
            valids: [{required: true}, {regexp: this.regexp_email}]
          },
        }
      },
      editPwd: {
        data: {
          _fields: ['oldPwd', 'newPwd', 'newPwdRepeat'],
          oldPwd: {
            status: false,
            name: '旧密码',
            valids: [{required: true}]
          },
          newPwd: {
            status: false,
            name: '新密码',
            valids: [{required: true}, {minLength: 6}]
          },
          newPwdRepeat: {
            status: false,
            name: '确认新密码',
            valids: [{required: true}, {minLength: 6}]
          },
        }
      }
    }
  };
}
