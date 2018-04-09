import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ActivatedRoute,Router } from "@angular/router";
import "rxjs/add/operator/toPromise";
import { Md5 } from "ts-md5/src/md5";
import {BaseComponent} from "../../../components/base/base.component";
import {HttpClient} from "../../../components/http-client.service";

@Component({
  selector: "app-edit-password",
  templateUrl: "./edit-password.component.html",
  styleUrls: ["./edit-password.component.css"]
})
export class EditPasswordComponent extends BaseComponent implements OnInit {
  constructor(
    public _HttpClient: HttpClient,
    public router: Router,
    public _ActivatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
    this._ActivatedRoute.queryParams.subscribe( params =>{
      this.param.userNo = params.userNo;
    })
  }

  public param = {
    pwd: "",
    confirmpwd: "",
    userNo: ""
  };

  pwdKeyup(event) {
    if (event.keyCode == 13) {
      this.onSubmit();
      return true;
    }
  }

  onSubmit() {
    if (this.param.pwd == "") {
      this.tipWarnMessage("请输入新密码！");
      return false;
    }
    if (this.param.confirmpwd == "") {
      this.tipWarnMessage("请再次输入密码！");
      return false;
    }
    if (this.param.pwd != this.param.confirmpwd) {
      this.tipWarnMessage("两次输入的密码不一致，请重新输入");
      return false;
    }
    var _that = this;
    let bodyParam = {
      pwd: this.param.pwd,
      confirmpwd:  this.param.confirmpwd,
      userNo:this.param.userNo
    };
    this._HttpClient.post("/forgetPwd/editPwd",null, bodyParam,  data => {
      this.tipMessage("密码修改成功，请重新登录...");
      window.setTimeout(c => _that.router.navigate(["/login"]), 1000);
    });
  }
}
