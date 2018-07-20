import {AfterViewInit, Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import "rxjs/add/operator/toPromise";
import {Md5} from "ts-md5/src/md5";
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {BaseComponent} from "../../components/base/base.component";
import {HttpClient} from "../../components/http-client.service";
import {SystemInfoService} from "../index/system-info.service";
import {TabsService} from "../../components/tabs/tabs.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent extends BaseComponent
  implements OnInit, AfterViewInit {
  error: any;
  SERVER: string;
  public Prompt: boolean = false;
  systenInfo: any;

  userInfo = {
    cookie: false, //当前密码信息是否跟cookie一致
    checked: false,
    account: "",
    password: "",
    pwd: "",
    pwdCookie: "",
    pwdLength: 0,
    pwdRelAccount: ""
  };
  userInfoTmp: any = {};
  login_pwd = "login_pwd";
  login_pwd_len = "login_pwd_len";
  login_account = "login_account";

  constructor(
    public _HttpClient: HttpClient,
    public router: Router,
    public _TabsService: TabsService,
    public _SystemInfoService: SystemInfoService
  ) {
    super();
    this.SERVER = _HttpClient.SERVER_CONST;
    this.systenInfo = this._SystemInfoService.getSystenInfo();
  }

  ngOnInit(): void {
    this._SystemInfoService.initSystemInfo();
    this.getHttpClient().get(
      "common/logininfo",
      { noCheckLogin: true },
      data => {
        if (data) {
          //已登录，自动跳转主页
          this.tipMessage("用户已登录！");
           this._SystemInfoService.cleanUserInfo();
         this.loadRouterLink(["/index"]);

        }
      }
    );
    this.initCookieInfo();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.firstNotKeyCode = false;
    }, 5000);
  }
  firstNotKeyCode = true; //第一次密码框非keycode事件，即浏览器回填密码，优化处理

  initCookieInfo() {
    Object.assign(this.userInfoTmp, this.userInfo);
    let account = Cookie.get(this.login_account);
    if (account) {
      this.userInfoTmp.account = account;
      this.userInfoTmp.pwdRelAccount = account;
    }
    if (Cookie.get(this.login_pwd)) {
      this.userInfoTmp.password = Cookie.get(this.login_pwd);
      let length = parseInt(Cookie.get(this.login_pwd_len), 10);
      this.userInfoTmp.pwd = "";
      while (this.userInfoTmp.pwd.length < length) {
        this.userInfoTmp.pwd += "0";
      }
      this.userInfoTmp.cookie = true;
      this.userInfoTmp.checked = true;
      this.userInfoTmp.pwdCookie = this.userInfoTmp.pwd;
      this.userInfoTmp.pwdLength = length;
    } else {
      this.userInfoTmp.password = "";
      this.userInfoTmp.pwd = "";
      this.userInfoTmp.cookie = false;
      this.userInfoTmp.checked = false;
      this.userInfoTmp.pwdCookie = "";
      this.userInfoTmp.pwdLength = 0;
    }
    Object.assign(this.userInfo, this.userInfoTmp);
  }

  accountKeyup(event) {
    //console.log("accountKeyup",this.userInfo,event);
    if (this.userInfo.pwdRelAccount) {
      //跟当前密码相关的账号已变更，则清空密码
      if (this.userInfo.account !== this.userInfo.pwdRelAccount) {
        this.userInfo.cookie = false;
        this.userInfo.pwdRelAccount = "";
        this.userInfo.pwd = "";
      }
    }
  }

  pwdKeyup(event) {
    //console.log("pwdKeyup",this.userInfo, event);
    if (event.keyCode === undefined) {
      //非键盘事件，更新浏览器填充的密码
      if (this.firstNotKeyCode) {
        this.firstNotKeyCode = false;
        if (this.userInfo.cookie) {
          this.userInfo.pwd = this.userInfoTmp.pwd;
        }
      }
      return true;
    }
    if (event.keyCode == 13) {
      this.onSubmit();
      return true;
    }
    this.userInfo.pwdRelAccount = this.userInfo.account;
    if (this.userInfo.cookie) {
      this.userInfo.cookie = false;
      //cookie初始化的密码，如果密码有变化，则清空cookie密码
      if (this.userInfo.pwd != this.userInfo.pwdCookie) {
        if (this.userInfo.pwd.length > this.userInfo.pwdLength) {
          this.userInfo.pwd = this.userInfo.pwd.substr(this.userInfo.pwdLength);
        } else {
          this.userInfo.pwd = "";
        }
      }
    }
  }

  onSubmit() {
    let account = this.trim(this.userInfo.account);
    if (account == "") {
      this.tipWarnMessage("请输入账号！");
      return false;
    }
    if (this.userInfo.pwd == "") {
      this.tipWarnMessage("请输入密码！");
      return false;
    }
    if (this.userInfo.cookie !== true) {
      this.userInfo.password = Md5.hashStr(this.userInfo.pwd, false).toString();
    }
    let cookieStatus = 0; //1保存，0不处理，-1清理
    if (this.userInfo.checked) {
      if (this.userInfo.cookie !== true) {
        cookieStatus = 1;
      } else {
        cookieStatus = 0;
      }
    } else {
      cookieStatus = -1;
    }
    Cookie.set(this.login_account, this.userInfo.account, 31);
    let bodyParam = {
      account: account,
      password: this.userInfo.password
    };
    this.getHttpClient().post("common/login", null, bodyParam, data => {
      let msg = "";
      if (data.counts === 1) {
        if (cookieStatus == 1) {
          Cookie.set(
            this.login_pwd,
            this.userInfo.password,
            7
          );
          Cookie.set(
            this.login_pwd_len,
            this.userInfo.pwd.length + "",
            7
          );
        } else if (cookieStatus == -1) {
          Cookie.delete(this.login_pwd);
          Cookie.delete(this.login_pwd_len);
        }
        this.tipMessage("登录成功！");
        debugger;
        this._TabsService.cleanAllTabs();
        this._SystemInfoService.setUserInfoForLogin(data.userInfo);
        this.router.navigate(["/index"]);
        return true;
      } else if (data.counts === -1) {
        msg = "用户名不存在，请重新输入！";
      } else if (data.counts === -2) {
        msg = "密码错误！";
      } else if (data.counts === -3) {
        msg = "您的账号已被停用，请联系管理员！";
      }else if (data.counts === -4) {
        msg = "您的账号没有有效的角色权限，请联系管理员！";
      } else {
        msg = "登录失败！";
      }
      this._SystemInfoService.cleanUserInfo();
      this.tipWarnMessage(msg);
    });
  }

  forgetPwd() {
    this.dialogOpts.forgotPwd = {
      title: "找回密码",
      visible: true,
      param: {
        account: "",
        email: ""
      }
    };
  }
  forgetPwdOk() {
    // 必填验证
    let flag = this.validData(this.valid, "dialogOpts");
    if (!flag) return false;

    this.getHttpClient().post(
      "forgetPwd/sendMail",
      null,
      this.dialogOpts.forgotPwd.param,
      data => {
        let msg = "";
        if (data.counts === 1) {
          this.tipMessage("取回密码的方法已通过Email发到您的邮箱中，请在3天之内修改您的密码！");
          this.dialogOpts.forgotPwd.visible = false;
          return;
        } else if (data.counts === -1) {
          msg = "该用户不存在或输入邮箱格式有误，请重新输入！";
        } else if (data.counts === 2) {
          msg = "您的账号已被停用，请联系管理员！";
          this.dialogOpts.forgotPwd.visible = false;
        } else {
          msg = "登录失败！";
          this.dialogOpts.forgotPwd.visible = false;
        }
        this.tipWarnMessage(msg);
      }
    );
  }
  dialogOpts = {
    forgotPwd: {
      title: "找回密码",
      visible: false,
      param: {
        account: "",
        email: ""
      }
    }
  };
  public valid = {
    dialogOpts: {
      forgotPwd: {
        param: {
          email: {
            status: false,
            msg: "",
            name: "邮箱",
            valids: [{ required: true }, { regexp: this.regexp_email }]
          },
          account: {
            status: false,
            msg: "",
            name: "用户编号",
            valids: [{ required: true }, { regexp: this.regexp_char }]
          }
        }
      }
    }
  };
}
