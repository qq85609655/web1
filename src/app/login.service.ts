/**
 * Created by yanling.zhong on 2017/7/18.
 */
import {CanActivate} from '@angular/router';
import { Injectable } from '@angular/core';
@Injectable()
export class LoginGuard implements CanActivate {
  canActivate() {
    // 这里判断登录状态, 返回 true 或 false
    // let loginedIn: boolean = false;
    // if (!loginedIn) {
    //   console.log('用户未登陆');
    // }
    return true;
  }
}
