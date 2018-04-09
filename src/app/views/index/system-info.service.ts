import { Injectable } from '@angular/core';
import { HttpClient } from "../../components/http-client.service";

@Injectable()
export class SystemInfoService {

  systemFlag = false;
  systenInfo = {
    sysName: "国泰安数据中心",
    sysLogoUrl: 'common/resources/login_logo.png',
    copyRight: "Copyright © 2015 GTA rights reserved     版权所有  粤ICP备05065871号  技术支持：深圳国泰安教育技术股份有限公司"
  }
  userFlag = false;
  userInfo = {userType: 2, authList: []};
  userInfoDefault = {
    userId: 0,
    userNo: ' ',
    realName: '',
    email: '',
    phone: '',
    sex: 1,
    orgId: 0,
    orgName: ' ',
    userType: 2,
    loginTime: '',
    authList: []
  }

  constructor(public _HttpClient: HttpClient) {
    Object.assign(this.userInfo, this.userInfoDefault);
  }

  public initSystemInfo() {
    if (this.systemFlag === true) {
      return;
    }
    this._HttpClient.get("/common/systemInfo", {}, (data) => {
      Object.assign(this.systenInfo, data);
      this.systemFlag = true;
    });
  }

  public initUserInfo() {
    this.initSystemInfo();
    if (this.userFlag === true) {
      return;
    }
    this._HttpClient.get("/common/logininfo", {}, (data) => {
      Object.assign(this.userInfo, data);
      this.userFlag = true;
    });
  }

  public cleanUserInfo() {
    this.userFlag = false;
    Object.assign(this.userInfo, this.userInfoDefault);
  }

  public cleanSystemInfo() {
    this.systemFlag = false;
  }

  public getSystenInfo() {
    return this.systenInfo;
  }

  public getUserInfo() {
    return this.userInfo;
  }

  public isAdmin():boolean{
    return this.userInfo.userType == 1;
  }

  public setUserInfoForLogin(userInfo){
    Object.assign(this.userInfo, userInfo);
    this.userFlag = true;
  }
}
