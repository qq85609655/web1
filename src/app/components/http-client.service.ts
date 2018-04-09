import {Injectable} from '@angular/core';
import {Http, RequestOptions, RequestOptionsArgs, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';
import {Router} from '@angular/router';
import {Observable} from "rxjs/Observable";
import {PromptService} from "./common/prompt/promt.service";  //  寮圭獥鏈嶅姟

@Injectable()
// 璇锋眰
export class HttpClient {
  error: any;
  //鏍规嵁鏈湴寮�鍙戠幆澧冩潵瀹�
  SERVER_CONST = './api/';
  SERVER: string;

  kickOutStatus = false;//鏍囪鏄惁姝ｅ湪鎵撳紑韪笅绾跨獥鍙ｏ紝绂佹璺宠浆鐧诲綍

  constructor(private http: Http, private router: Router,public _PromptService: PromptService) {
    this.SERVER = this.SERVER_CONST;
    if(!this.SERVER.endsWith("/")){ 
      this.SERVER += "/";
    }
  }

  //get/post鏂规硶涓嶅寘鍚玴athParam锛屽彲鍐嶈皟鐢ㄦ椂鐩存帴杩藉姞鍒皍rl涓�
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
        //濡傛灉闈瀓son瀛楃涓诧紝杩斿洖text缁檚uccess
        return res.text();
      }
    }).subscribe(data => {
        if (this.checkHandleError(data)) {
          if(error){
            error(data);
          }
          return;
        }

        // 濡傛灉鏈夊洖璋冩柟娉曪紝璋冪敤鍥炶皟鏂规硶銆�
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


  /**
   * 鍥犱负娌℃湁鍔犺浇ng2-interceptor 缁勪欢瀵筯ttp鎷︽埅锛屽彧鑳藉湪姣忎釜鏂规硶涓坊鍔犳嫤鎴��
   * 閫氳繃璋冪敤checkHandlerError杩涜澶勭悊銆�
   * 涓存椂鏂规銆�
   * by zhangzhongwei at 2017骞�9鏈�23鏃�
   * @param data
   * @returns {boolean}
   */
  checkHandleError(data) {

    // 濡傛灉鏈繑鍥炵粨鏋�,瑙嗕负澶辫触,鎻愮ず鍚庡仠姝� .
    if (data === undefined || data == null) {
      alert('鏈繑鍥炴甯哥粨鏋�');
      return true;
    }

    // 鍥犱负鍚庡彴鏈夊緢澶歝ontroler 鐩存帴杩斿洖浜唗rue 鎴杅alse ,鏃犳硶浣跨敤if(data) 鏉ュ垽鏂粨鏋滄槸鍚﹀瓨鍦紝鍙兘娣诲姞涓�灞傚垽鏂�
    // 濡傛灉鐩存帴鏄痜alse 锛屽垯璁や负杩斿洖缁撴灉浠庤姹傛潵璇存槸姝ｇ‘鐨勩��  浣嗕笟鍔＄粨鏋滄槸閿欒鐨勩��
    if (data === false) {
      return false;
    }

    // 鍥犱负鍚庡彴杩斿洖缁撴灉鏈粺涓�灏佽绫诲瀷,鍥犳,浠呭垽鏂� data鎴杄xception success鐨勫瓨鍦ㄦ��,鏃犳硶鍒ゆ柇缁撴灉鏄惁姝ｅ父.
    // 鍙兘缁熶竴鍒ゆ柇寮傚父缁撴灉,澶勭悊瀹屽紓甯哥粨鏋�,瑙嗕负姝ｅ父!!!
    // 閫氳繃杩斿洖缁撴灉閲岀殑exception 鏉ュ垽鏂紝浠呭湪 exception 瀛樺湪涓斾负鐪熺殑鏃跺�欏垽鏂墠閫氳繃銆傦紙鍘熷洜鐪嬩笂闈級
    if (data.exception) {

      // 濡傛灉鏄湭鐧诲綍寮傚父,鐩存帴璺宠浆鍥炵櫥褰曢〉闈�  濡傛灉鍚庣粨闇�瑕佹墿灞曞脊鍑虹櫥褰曢〉闈�,鎴栬烦杞埌鎸囧畾鐨勭粺涓�鐧诲綍椤甸潰,
      // 鍙互缁熶竴淇敼. 鏈�濂芥槸鐩存帴鍒版嫤鎴櫒閲屽鐞�.
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

      //琚涪涓嬬嚎
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

      // 鍚﹀垯,鎻愮ず閿欒,骞惰繑鍥瀎alse
      // const message = data.expInfo || '鏈煡鍘熷洜鎿嶄綔澶辫触';
      var promptData = {
        tag: 'warn',
        title: data.expInfo || '鏈煡鍘熷洜鎿嶄綔澶辫触',
        time: 1000
      };
      this._PromptService.promptEvent.emit(promptData);
      return true;

    } else {
      // 灏介噺鍑忓皯鍒ゆ柇 鐩存帴杩斿洖涓氬姟澶勭悊
      return false;
    }
  }






















/*******************  浠ヤ笅涓哄巻鍙叉帴鍙ｏ紝鍚庣画涓嶅緱鍐嶈皟鐢�  **********************/
  request(url: string, opts?: Object) {
    return this.http.request(this.SERVER + url, new RequestOptions(opts))
      .map(res => res.json())
      .subscribe(data => {
        if (data) {
          // console.log('鎷垮埌鏁版嵁浜�');
          // console.log(data);
          // CallBackFun(data)
        }
      }, error => this.error = error);
  }

  /**
   *  get 鏂规硶鐪嬩笂鍘绘槸鐢ㄦ潵鍙栨暟鎹殑銆�
   * @param url
   * @param {Object} opts
   * @param CallBackFun
   * @returns {Subscription}
   */
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
    if (opts && opts.validData) {// 濡傛灉鎻愪氦鐨勬暟鎹渶瑕佹牎楠�
      // console.log('鑾峰彇put鐨勫弬validData锛�');
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
    if (opts && opts.validData) {// 濡傛灉鎻愪氦鐨勬暟鎹渶瑕佹牎楠�
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


  /**
   *  鐪嬫牱瀛愭槸鏍￠獙鏍煎紡鏄惁姝ｇ‘鐨勬柟娉曘�� 浣唂or寰幆浠呰兘澶勭悊绠�鍗曠被鍨嬨�� 濡傛灉鏈夊鏉傜被鍨嬪氨浼氬嚭閿欍��
   * @param params
   * @returns {number}
   */
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

  /**
   * 鐪嬫牱瀛愭槸澶勭悊form鏍￠獙鐨勩��
   * 浣嗘槸锛宖orm鐨勬牎楠屽簲璇ュ湪form鐨剆ubmit鏂规硶涓皝瑁呫��
   * 骞朵笖锛屾牎楠岀粨鏋滆鏄剧ず缁欑敤鎴蜂互鏂逛究鐢ㄦ埛淇敼銆� 鍙樉绀洪敊璇綋楠岄潪甯镐笉濂姐�� 涓嶇煡閬撴祴璇曡兘涓嶈兘閫氳繃 銆�
   * @param params
   * @returns {number}
   */
  byOneValid(params) {
    let reqStatus = false;
    let lenStatus = false;
    let typeStatus = false;
    if (params.valid.itRequried.reg && !(params.value + '')) {// 濡傛灉鏄繀濉�
      reqStatus = true;
    } else {
      reqStatus = false;
    }
    if (params.valid.itLen.reg && (params.value + '').length > params.valid.itLen.reg) {// 濡傛灉闀垮害鏈夐檺鍒�
      lenStatus = true;
    } else {
      lenStatus = false;
    }
    if (params.valid.itType.reg) {// 濡傛灉瀛楃绫诲瀷鏈夐檺鍒�
      const re = params.valid.itType.reg;
      const result = re.test((params.value + ''));
      if (params.value === '') {
        typeStatus = false;
      } else {
        // 鏍￠獙涓嶉�氳繃涓篺lase
        if (!result) {
          typeStatus = true;
        } else {
          typeStatus = false;
        }
      }
    }
    if (reqStatus || lenStatus || typeStatus) {// 濡傛灉浠讳綍涓�椤逛笉婊¤冻瑕佹眰
      params.valid.validStatus = true;
      return 1;
    } else {
      params.valid.validStatus = false;
      return 0;
    }
  }
}
