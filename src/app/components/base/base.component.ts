

import {EventEmitter, OnDestroy, OnInit} from "@angular/core";
import { BaseService } from "./base.service";
import { HttpClient } from "../http-client.service";
import { Router} from "@angular/router";
import {SelectCacheService} from "../ptable/select-cache.service";
import {DatePipe} from "@angular/common";

export class BaseComponent implements OnInit, OnDestroy {
  private  _BaseService:BaseService;
  constructor() {
    this._BaseService = BaseService.staticBaseService;
  }
  public static _Regexp_Template={
    regexp_tablename: /^[a-zA-Z][a-zA-Z0-9\_]*$/,
    regexp_field: /^[a-zA-Z][a-zA-Z0-9\_]*$/,
    regexp_plusint: /^[1-9][0-9]*$/,//正整数，不包含0
    regexp_natureint: /^[0-9]+$/,//自然数，包含0
    regexp_double: /^\-?[0-9]+(\.[0-9]+)?$/,
    regexp_data:/^[0-9]*$/,
    regexp_cn: /^[\u4e00-\u9fa5]+$/,
    regexp_code: /^[a-zA-Z0-9]*$/,
    regexp_char:/^[\u4e00-\u9fa5A-Za-z0-9\-\_]+$/,
    regexp_char1:/^[A-Za-z0-9.]+$/,
    regexp_char2:/^[\u4e00-\u9fa5A-Za-z0-9]+$/,
    regexp_ip:/^[0-9]{1,3}(\.[0-9]{1,3}){3}((\.[0-9]{1,3}){2})?$/,
    regexp_email:/^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
  }
  regexp_tablename = BaseComponent._Regexp_Template.regexp_tablename;
  regexp_field = BaseComponent._Regexp_Template.regexp_field;
  regexp_plusint= BaseComponent._Regexp_Template.regexp_plusint;
  regexp_natureint= BaseComponent._Regexp_Template.regexp_natureint;
  regexp_double = BaseComponent._Regexp_Template.regexp_double;
  regexp_cn = BaseComponent._Regexp_Template.regexp_cn;
  regexp_data=BaseComponent._Regexp_Template.regexp_data;
  regexp_code = BaseComponent._Regexp_Template.regexp_code;
  regexp_char= BaseComponent._Regexp_Template.regexp_char;
  regexp_char1= BaseComponent._Regexp_Template.regexp_char1;
  regexp_char2= BaseComponent._Regexp_Template.regexp_char2;
  regexp_email= BaseComponent._Regexp_Template.regexp_email;
  regexp_ip= BaseComponent._Regexp_Template.regexp_ip;

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  getHttpClient(): HttpClient {
    return this._BaseService.getHttpClient();
  }

  getRouter(): Router {
    return this._BaseService.getRouter();
  }

  getBasePath(){
    return this._BaseService.getHttpClient().SERVER;
  }


  /**
   * 通过事件回调的方式，保存查询信息，并回调
   * @param {EventEmitter<any>} treeEvent
   * @param {EventEmitter<any>} tableEvent
   * @param {Function} callback
   */
  saveSelectToLink(treeEvent: EventEmitter<any>, tableEvent: EventEmitter<any>, callback?: Function){
    //逻辑判断EventEmitter有效性
    if(!treeEvent){
      treeEvent = tableEvent;
      tableEvent = null;
    }
    if(!treeEvent){
      return false;
    }
    treeEvent.emit({saveStatus:true, callback: ()=>{
      if(tableEvent){
        tableEvent.emit({saveStatus:true, callback: ()=>{
          if(callback){
            callback();
          }
        }});
      }else{
        if(callback){
          callback();
        }
      }
    }});
  }

  getSelectCacheService(): SelectCacheService{
    return this._BaseService.getSelectCacheService()
  }

  getRouterPath(){
    let path = this._BaseService.getLocation().path();
    if(path.indexOf('?') >= 0){
      path = path.substr(0, path.indexOf('?'));
    }
    return path;
  }
  getDatePipe(): DatePipe{
    return this._BaseService.getDatePipe();
  }

  addDateMonth(date, count){
    let date2 = new Date();
    date2.setTime(date.getTime());
    date2.setMonth(date2.getMonth() + count);
    return date2;
  }

  /**
   * 跳转路由，此方式可返回上一页面
   * @param {string[]} commands
   * @param queryParams
   */
  loadRouterLink(commands: string[], queryParams?: any) {
    this.getRouter().navigate(commands, queryParams);
  }

  /**
   * 跳转路由，当路由地址相同时，通过切换地址的方式刷新页面，不可返回上一页面
   * @param {string[]} commands
   * @param queryParams
   */
  reloadRouterLink(commands: string[], queryParams?: any) {
    let queryParams2 = {
      link: commands
    };
    Object.assign(queryParams2, queryParams);
    this.getRouter().navigate(["/index/skip"], { queryParams: queryParams2 });
  }

  /**
   * 根据树节点数据，返回所有的组织ID
   * @param node
   * @param {boolean} containRoot 是否需要跟节点
   */
  getOrgNodeIds(node, containRoot?: boolean): Array<any>{
    let nodeIds = [];
    if(node.nodeType == 1 && containRoot === true){
      nodeIds.push(node.id);
    }
    this._getOrgNodeId(node, nodeIds);
    return nodeIds;
  }

  getMenuIds(node, containRoot?: boolean): Array<any>{
    let nodeIds = [];
    if(node.nodeType == 1 && containRoot === true){
      nodeIds.push(node.menuId);
    }
    this._getMenuId(node, nodeIds);
    return nodeIds;
  }

  getCnDateLocale() {
    return {
      firstDayOfWeek: 0,
      dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
      dayNamesShort: ["日", "一", "二", "三", "四", "五", "六"],
      dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
      monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
      monthNamesShort: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      today: '今天',
      clear: '清除'
    };
  }
  private _getMenuId(node, nodeIds){
    if(node.nodeType == 3){
      nodeIds.push(node.menuId);
    }
    if(node.children){
      for(let child of node.children){
        this._getMenuId(child, nodeIds);
      }
    }
  }


  private _getOrgNodeId(node, nodeIds){
    if(node.nodeType == 3){
      nodeIds.push(node.id);
    }
    if(node.children){
      for(let child of node.children){
        this._getOrgNodeId(child, nodeIds);
      }
    }
  }

  public isAdmin():boolean{
    return this._BaseService.getSystemInfoService().isAdmin();
  }

  setMeunId(id:number){
    this._BaseService.getTabsService().selectedMenuId(id);
  }

  /**
   * 其中validConfig/data的第一级属性中要包含validName
   * 如果验证字段要求顺序时，补充_fields字段
   * @param validConfig 验证的数据结果，默认valid对象即可
   * @param validName 验证的字段名
   * @param data 验证的字段名的父对象
   * @return 返回是否成功
   */
  validData(validConfig, validName, data?: any): boolean{
    if(!data){
      data = this;
    }
    let errorMsg = this._BaseService.getDataValidService().validData(validConfig, validName , data);
    if(errorMsg && errorMsg.length>0) {
      this.tipWarnMessage(errorMsg[0]);
      return false;
    }else{
      return true;
    }
  }
  validDataClean(validConfig, validName){
    this._BaseService.getDataValidService().validDataClean(validConfig, validName);
  }

  _ajaxFlag = false;
  checkAjaxFlag(){
    if(this._ajaxFlag){
      return true;
    }
    this._ajaxFlag = true;
    return false;
  }
  removeAjaxFlag(){
    this._ajaxFlag = false;
  }

  //提示信息
  tipMessage(msg: string) {
    var promptData = {
      tag: 'tip',
      title: msg,
      time: 1000
    };
    this._BaseService.getPromptService().promptEvent.emit(promptData);
  }
  //提示警告信息
  tipWarnMessage(msg: string) {
    var promptData = {
      tag: 'warn',
      title: msg,
      time: 1000
    };
    this._BaseService.getPromptService().promptEvent.emit(promptData);
  }
  //提示信息，并设置关闭时间，单位毫秒
  tipMessageTime(msg: string, time: number) {
    var promptData = {
      tag: 'tip',
      title: msg,
      time: time
    };
    this._BaseService.getPromptService().promptEvent.emit(promptData);
  }

  dialogMessage(msg:string, callback?: Function){
    var promptData = {
      tag: 'dialog',
      msg: msg,
      callback: callback
    };
    this._BaseService.getPromptService().promptEvent.emit(promptData);
  }

  dialogConfirmMessage(title: string, msg: string, callback: Function){
    var promptData = {
      tag: 'confirm',
      title: title ? title : '提示信息',
      msg: msg,
      callback: callback
    };
    this._BaseService.getPromptService().promptEvent.emit(promptData);
  }


  //获取剩余长度
  getRestLength(str, max?:number) {
    max = max || 60;
    str = str || '';
    return Math.max((max - str.length), 0);
  }

  _addDataRow(index, data, row, maxLength?:number){
    if(!maxLength || maxLength<=0){
      maxLength = 8;
    }
    if (data.length < maxLength) {
      let obj = null;
      if(!row || row == null){
        obj = null;
      }else{
        obj = Object.assign({},row);
      }
      data.splice(index + 1, 0, obj);
    } else {
      if(row && row !== null){
        this.tipWarnMessage("不能超过" + maxLength + "行!");
      }
    }
  }

  _removeDataRow(index, data) {
    data.splice(index, 1);
  }

  pushAll(target: Array<any>, source: any, targetClean?: boolean){
    if(targetClean === true && target){
      target.splice(0, target.length);
    }
    if(!target || !source){
      return;
    }
    for(let s of source){
      target.push(s);
    }
  }

  public trim(str){
    return str.replace(/(^\s*)|(\s*$)/g, '');
  }

  checkAuth(authCodes: string){
    let userInfo = this._BaseService.getSystemInfoService().getUserInfo();
    if(userInfo.userType == 1){
      //超级管理员用于所有权限
      return true;
    }
    if(!authCodes || authCodes==''){
      return true;
    }
    let authList = userInfo.authList;
    let auths = authCodes.split(",");
    for(let auth of auths){
      for(let auth2 of authList){
        if(auth == auth2){
          return true;
        }
      }
    }
    return false;
  }
}
