import {Injectable} from '@angular/core';
import {DatePipe, Location} from '@angular/common';
import {PromptService} from "../common/prompt/promt.service";
import {HttpClient} from "../http-client.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SelectCacheService} from "../ptable/select-cache.service";
import {DataValidService} from "../verify/data-valid.service";
import {SystemInfoService} from "../../views/index/system-info.service";
import {TabsService} from "../tabs/tabs.service";

@Injectable()
export class BaseService {

  public static staticBaseService : BaseService;

  //ActivatedRoute 为非单例模式，不能使用当前方式注入
  constructor(public _PromptService: PromptService,
              public _HttpClient: HttpClient,
              public _Router: Router,
              public _Location: Location,
              public _SelectCacheService: SelectCacheService,
              public _DataValidService: DataValidService,
              public _SystemInfoService: SystemInfoService,
              public _DatePipe: DatePipe,
              public _TabsService: TabsService){
    BaseService.staticBaseService = this;
  }

  getPromptService(): PromptService{
    return this._PromptService;
  }

  getHttpClient(): HttpClient{
    return this._HttpClient;
  }

  getRouter(): Router{
    return this._Router;
  }

  getLocation(): Location{
    return this._Location;
  }

  getSelectCacheService(): SelectCacheService{
    return this._SelectCacheService;
  }

  getDataValidService(): DataValidService{
    return this._DataValidService;
  }

  getSystemInfoService(): SystemInfoService{
    return this._SystemInfoService;
  }

  getDatePipe(): DatePipe{
    return this._DatePipe;
  }

  getTabsService():TabsService{
    return this._TabsService;
  }
}
