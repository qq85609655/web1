import {Injectable} from '@angular/core';
import {Http, RequestOptions, RequestOptionsArgs, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';
import {Router} from '@angular/router';
import {Observable} from "rxjs/Observable";
import {PromptService} from "./common/prompt/promt.service";

@Injectable()
export class HttpClient {
  error: any;
  SERVER_CONST = './api/';
  SERVER: string;

  kickOutStatus = false;

  constructor(private http: Http, private router: Router,public _PromptService: PromptService) {
    this.SERVER = this.SERVER_CONST;
    if(!this.SERVER.endsWith("/")){
      this.SERVER += "/";
    }
  }

  public get( url, queryParam, success?: Function,
               error ?: Function,complete?: Function, options?: RequestOptionsArgs){
    return this.request_inner("get", url, queryParam,null, success, error, complete, options);
  }

  public post( url, queryParam, bodyParam, success?: Function,
               error ?: Function,complete?: Function, options?: RequestOptionsArgs){
    return this.request_inner("post", url, queryParam, bodyParam, success, error, complete, options);
  }


  private request_inner(type, url, queryParam, bodyParam, success?: Function,
           error ?: Function,complete?: Function, options?: RequestOptionsArgs){
    let queryUrl = '';
    if(queryParam){
      for (const key in queryParam) {
        let value = queryParam[key];
        if (queryParam.hasOwnProperty(key)) {
          if(queryUrl.length<=0){
            queryUrl += "?";
          }else{
            queryUrl += "&";
          }
          queryUrl += key+"="+ encodeURI(value);
        }
      }
    }
    if(url.indexOf("/") == 0){
      url = url.substr(1);
    }
    url = this.SERVER + url;
    let obs: Observable<any>;
    if(type == 'get'){
      if(queryUrl=='' || queryUrl=='?'){
        queryUrl = '?'+new Date().getTime();
      }else{
        queryUrl += '&'+new Date().getTime();
      }
      obs = this.http.get(url + queryUrl, options);
    }else if(type == 'post'){
      obs = this.http.post(url + queryUrl, bodyParam, options);
    }else if(type == 'put'){
      obs = this.http.put(url + queryUrl, bodyParam, options);
    }else if(type == 'delete'){
      obs = this.http.delete(url + queryUrl, options);
    }else{
      return false;
    }
    return obs.map(res => {
      try{
        return res.json();
      }catch(e){
        return res.text();
      }
    }).subscribe(data => {
        if (this.checkHandleError(data)) {
          if(error){
            error(data);
          }
          return;
        }

        if (success) {
          success(data);
        }
      }, errorInfo => {
        if(error){
          error(errorInfo);
        }
      }, ()=>{
        if(complete){
          complete();
        }
      });
  }


  checkHandleError(data) {
    if (data === undefined || data == null) {
      alert('参数异常!');
      return true;
    }

    if (data === false) {
      return false;
    }

    if (data.exception) {
      if (data.expCode === 'GTA-00002') {
        if(! this.kickOutStatus){
          this.router.navigate(['/login']);
        }
        return true;
      }

      if (data.expCode === 'GTA-00003') {
        window.location.href = this.SERVER + "common/reg";
        return true;
      }

      if (data.expCode === 'GTA-00005') {
        var promptData2 = {
          tag: 'dialog',
          msg: data.expInfo,
          callback: ()=>{
            this.kickOutStatus = false;
            this.router.navigate(['/login']);
          }
        };
        this.kickOutStatus = true;
        this._PromptService.promptEvent.emit(promptData2);
        return true;
      }

      if(data.expCode==='GTA-00009'){
        window.location.href = data.expInfo;
        return true;
      }

      var promptData = {
        tag: 'warn',
        title: data.expInfo || '警告',
        time: 1000
      };
      this._PromptService.promptEvent.emit(promptData);
      return true;

    } else {
      return false;
    }
  }


  request(url: string, opts?: Object) {
    return this.http.request(this.SERVER + url, new RequestOptions(opts))
      .map(res => res.json())
      .subscribe(data => {
        if (data) {
        }
      }, error => this.error = error);
  }

  get_old(url, opts?: Object, CallBackFun?: any) {
    return this.request_inner("get", url, opts,null, CallBackFun);
  }

  delete_old(url, opts?: Object, CallBackFun?: any) {
    if (opts) {
      url += this.formatdelOpts(opts);
    }
    return this.request_inner("delete", url, null,null, CallBackFun);
  }

  put_old(url, opts, pathOpts?: any, CallBackFun?: any) {
    let bodyOpts: any;
    if (opts && opts.validData) {
      bodyOpts = opts.editData;
      const sta = this.formatValid(opts.validData);
      if (sta > 0) {
        return;
      }
    } else {
      bodyOpts = opts;
    }

    if (pathOpts) {
      url += this.formatdelOpts(pathOpts);
    }
    return this.request_inner("put", url, null,bodyOpts, CallBackFun);
  }

  post_old(url, opts, pathOpts?: any, CallBackFun?: any) {
    let bodyOpts: any;
    if (opts && opts.validData) {
      bodyOpts = opts.addData;
      if(bodyOpts == undefined){
        bodyOpts = opts.editData;
      }
      const sta = this.formatValid(opts.validData);
      if (sta > 0) {
        return;
      }
    } else {
      bodyOpts = opts;
    }
    if (pathOpts) {
      url += pathOpts;
    }
    return this.request_inner("post", url, null,bodyOpts, CallBackFun, errorInfo =>{
      if (CallBackFun) {
        CallBackFun(errorInfo.status);
      }
    });
  }

  formatdelOpts(opts) {
    let options = '';
    for (const Key in opts) {
      if (opts.hasOwnProperty(Key)) {
        options += '/' + opts[Key];
      }
    }
    return options;
  }

  encodeParams(params) {
    return Object.keys(params)
      .filter(key => params[key])
      .reduce((sum: URLSearchParams, key: string) => {
        sum.append(key, params[key]);
        return sum;
      }, new URLSearchParams());

  }
  formatValid(params) {
    let valid = 0;
    for (const objElem of params) {
      for (const name in objElem) {
        if (objElem.hasOwnProperty(name)) {
          valid += this.byOneValid(objElem[name]);
        }
      }
    }
    return valid;
  }

  byOneValid(params) {
    let reqStatus = false;
    let lenStatus = false;
    let typeStatus = false;
    if (params.valid.itRequried.reg && !(params.value + '')) {
      reqStatus = true;
    } else {
      reqStatus = false;
    }
    if (params.valid.itLen.reg && (params.value + '').length > params.valid.itLen.reg) {
      lenStatus = true;
    } else {
      lenStatus = false;
    }
    if (params.valid.itType.reg) {
      const re = params.valid.itType.reg;
      const result = re.test((params.value + ''));
      if (params.value === '') {
        typeStatus = false;
      } else {
        if (!result) {
          typeStatus = true;
        } else {
          typeStatus = false;
        }
      }
    }
    if (reqStatus || lenStatus || typeStatus) {
      params.valid.validStatus = true;
      return 1;
    } else {
      params.valid.validStatus = false;
      return 0;
    }
  }
}
