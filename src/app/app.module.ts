import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {CommonModule, DatePipe, HashLocationStrategy, LocationStrategy} from '@angular/common';
import {DataTablesModule} from 'angular-datatables'; // 表格控件
import {AppRoutingModule} from './app-routing.module'; // 引用路由主文件
import {IndexComponent} from './views/index/index.component'; // 主页
import {AppComponent} from './app.component';
import {LoginComponent} from './views/login/login.component'; //
import {FooterComponent} from './components/footer/footer.component';
import {HeaderComponent} from './components/header/header.component';
import {Code404Component} from './code404/code404.component'; // 错误页面
import {CustomerserviceComponent} from './components/customerservice/customerservice.component'; //智能客服机器人
import {CrumbsComponent} from './components/common/crumbs/crumbs.component'; // 面包屑
import {TabsComponent} from './components/tabs/tabs.component'; // 页签
import {TabsService} from './components/tabs/tabs.service'; // 主页签服务
import {CrumService} from './components/common/crumbs/crums.service'; // 面包屑服务
import {InterFaceService} from './components/interface.service'; // 接口服务
import {HttpClient} from './components/http-client.service'; // 请求服务

import {DataSourceSearchComponent} from './views/datashare/data-source/data-source-search/data-source-search.component';
import {PromptComponent} from './components/common/prompt/prompt.component';
import {PromptService} from './components/common/prompt/promt.service';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {
  ButtonModule,
  CalendarModule,
  CheckboxModule,
  CodeHighlighterModule,
  ContextMenuModule,
  DataTableModule,
  DialogModule,
  DropdownModule,
  FileUploadModule,
  GrowlModule,
  InputSwitchModule,
  PaginatorModule,
  TabViewModule,
  TreeModule
} from "primeng/primeng";
//发布数据资源模块1
import {MainIndexComponent} from './views/index/main-index/main-index.component';
import {UserManagerComponent} from './views/sys-admin/user-manager/user-manager.component';
import {RoleManagerComponent} from './views/sys-admin/role-manager/role-manager.component';
import {MenuManagerComponent} from './views/sys-admin/menu-manager/menu-manager.component';
import {PtreeComponent} from "./components/ptree/ptree.component";
import {PtableComponent} from './components/ptable/ptable.component';
import {BaseService} from "./components/base/base.service";
import {SkipIndexComponent} from './views/index/skip-index/skip-index.component';
import {LogLoginLogSearchComponent} from './views/sys-admin/log-login-log-search/log-login-log-search.component';
import {LogOperLogSearchComponent} from './views/sys-admin/log-oper-log-search/log-oper-log-search.component';
import {OrgManagerComponent} from "./views/sys-admin/org-manager/org-manager.component";
import {ConfigManagerComponent} from './views/sys-admin/config-manager/config-manager.component';
import {ImportUserComponent} from './views/sys-admin/user-manager/import-user/import-user.component';
import {DataSubsetCountryComponent} from './views/information/data/data-subset-country/data-subset-country.component';
import {DataSubsetSchoolComponent} from './views/information/data/data-subset-school/data-subset-school.component';
import {DataClassCountryComponent} from './views/information/data/data-class-country/data-class-country.component';
import {DataClassSchoolComponent} from './views/information/data/data-class-school/data-class-school.component';
import {DataSubclassCountryComponent} from './views/information/data/data-subclass-country/data-subclass-country.component';
import {DataSubclassSchoolComponent} from './views/information/data/data-subclass-school/data-subclass-school.component';
import {DataSubclassDetailCountryComponent} from './views/information/data/data-subclass-detail-country/data-subclass-detail-country.component';
import {DataSubclassDetailSchoolComponent} from './views/information/data/data-subclass-detail-school/data-subclass-detail-school.component';
import {DataItemInfoCountryComponent} from './views/information/data/data-item/data-item-info-country/data-item-info-country.component';
import {DataItemInfoSchoolComponent} from './views/information/data/data-item/data-item-info-school/data-item-info-school.component';
import {DataItemSearchCountryComponent} from './views/information/data/data-item/data-item-search-country/data-item-search-country.component';
import {DataItemSearchSchoolComponent} from './views/information/data/data-item/data-item-search-school/data-item-search-school.component';
import {CodeStandardCountryComponent} from './views/information/code/code-standard-country/code-standard-country.component';
import {CodeStandardSchoolComponent} from './views/information/code/code-standard-school/code-standard-school.component';
import {SystemInfoService} from "./views/index/system-info.service";
import {SelectCacheService} from "./components/ptable/select-cache.service";
import {DataConvertInfoComponent} from "./views/datashare/data-resources/data-convert-info/data-convert-info.component";
import {DataConvertListComponent} from "./views/datashare/data-resources/data-convert-list/data-convert-list.component";
import {DataHelpInfoComponent} from './views/datashare/data-help-info/data-help-info.component';
import {DataConvertInfoRulepageComponent} from './views/datashare/data-resources/data-convert-info/data-convert-info-rulepage/data-convert-info-rulepage.component';
import {DataValidService} from "./components/verify/data-valid.service";
import {DataConvertListIssueComponent} from './views/datashare/data-resources/data-convert-list-issue/data-convert-list-issue.component';
import {DataConvertListSubscribeComponent} from './views/datashare/data-resources/data-convert-list-subscribe/data-convert-list-subscribe.component';
import {DataConvertInfoIssueComponent} from './views/datashare/data-resources/data-convert-info-issue/data-convert-info-issue.component';
import {DataConvertInfoSubscribeComponent} from './views/datashare/data-resources/data-convert-info-subscribe/data-convert-info-subscribe.component';
import {PpageComponent} from './components/ppage/ppage.component';
import {EditPasswordComponent} from './views/login/edit-password/edit-password.component';
import {DatasourceAnalysisComponent} from "./views/run-analysis/datasource-analysis/datasource-analysis.component"; // 忘记密码
import {NodeconvertAnalysisComponent} from "./views/run-analysis/nodeconvert-analysis/nodeconvert-analysis.component";
import {NoderunWatchComponent} from "./views/run-admin/noderun-watch/noderun-watch.component";
import { DataSourceInfoComponent } from './views/datashare/data-source/data-source-info/data-source-info.component';
import { PmultiselectComponent } from './components/pmultiselect/pmultiselect.component';
import { LeftMenuComponent } from './components/left-menu/left-menu.component';
import { MainIndexTaskComponent } from './views/index/main-index/main-index-task/main-index-task.component';
import { EmailSendLogComponent } from './views/sys-admin/email-send-log/email-send-log.component';
import { EtlPushComponent } from './views/run-admin/etl-push/etl-push.component';
import { EtlLogComponent } from './views/run-admin/etl-log/etl-log.component';
import {EtlErrorLogComponent} from "./views/run-admin/etl-log/etl-error-log/etl-error-log.component";
import { SchoolConditionAnalysisComponent } from './views/school-analysis/school-condition-analysis/school-condition-analysis.component';
import {AngularEchartsModule} from "ngx-echarts";
import { TeacherComponent } from './views/school-analysis/teacher/teacher.component';
import { TeachingComponent } from './views/school-analysis/teaching/teaching.component';
import { StudentAnalysisComponent } from './views/school-analysis/student-analysis/student-analysis.component';
import { GBTCodeStandardComponent } from './views/information/code/gbt-code-standard/gbt-code-standard.component';
import { JyxgGjBzdmComponent } from './views/information/code/jyxg-gj-bzdm/jyxg-gj-bzdm.component';
import { JyxgHyBzdmComponent } from './views/information/code/jyxg-hy-bzdm/jyxg-hy-bzdm.component';
import { JybOtherBzdmComponent } from './views/information/code/jyb-other-bzdm/jyb-other-bzdm.component';
import { JyBzdmComponent } from './views/information/code/jy-bzdm/jy-bzdm.component';
import { BzdmComponent } from './views/information/code/bzdm/bzdm.component';
import { DataItemTestComponent } from './views/information/data/data-item/data-item-test/data-item-test.component';
import { GdztJbxxComponent } from './views/information/code/gdzt-jbxx/gdzt-jbxx.component';
import { GdztYxldComponent } from './views/information/code/gdzt-yxld/gdzt-yxld.component';
import { GdztJbbxtjComponent } from './views/information/code/gdzt-jbbxtj/gdzt-jbbxtj.component';
import { GdztSjjxtjComponent } from './views/information/code/gdzt-sjjxtj/gdzt-sjjxtj.component';
import { GdztBxjfComponent } from './views/information/code/gdzt-bxjf/gdzt-bxjf.component';
import { GdztJsdwComponent } from './views/information/code/gdzt-jsdw/gdzt-jsdw.component';
import { GdztZyComponent } from './views/information/code/gdzt-zy/gdzt-zy.component';
import { GdztJxglyjxyjComponent } from './views/information/code/gdzt-jxglyjxyj/gdzt-jxglyjxyj.component';
import { GdztShpjComponent } from './views/information/code/gdzt-shpj/gdzt-shpj.component';
import { GdztXsxxComponent } from './views/information/code/gdzt-xsxx/gdzt-xsxx.component';
import { GdztBcsjComponent } from './views/information/code/gdzt-bcsj/gdzt-bcsj.component';
import { KtrMgrComponent } from './views/ktrkjbmgr/ktr-mgr/ktr-mgr.component';
import { KjbMgrComponent } from './views/ktrkjbmgr/kjb-mgr/kjb-mgr.component';
import { InterfaceComponent } from './views/information/interface/interface.component';
import { JobMgrComponent } from './views/ktrkjbmgr/job-mgr/job-mgr.component';
import { JobAddComponent } from './views/ktrkjbmgr/job-mgr/job-add/job-add.component';
import { JobEditComponent } from './views/ktrkjbmgr/job-mgr/job-edit/job-edit.component';
import { JobDetailComponent } from './views/ktrkjbmgr/job-mgr/job-detail/job-detail.component';
import { DataPlsqlComponent } from './views/datashare/data-plsql/data-plsql.component';
import { DataEditsqlComponent } from './views/datashare/data-plsql/data-editsql/data-editsql.component';
import { DyTaskCloneComponent } from './views/ktrkjbmgr/dy-task-clone/dy-task-clone.component';
import { FbTaskCloneComponent } from './views/ktrkjbmgr/fb-task-clone/fb-task-clone.component';
import { TaskCloneComponent } from './views/ktrkjbmgr/task-clone/task-clone.component';
import { ScheduleJobMgrComponent } from './views/ktrkjbmgr/schedule-job-mgr/schedule-job-mgr.component';

@NgModule({
  declarations: [
    // 模块中有什么东西，只能声明组件，指令，管道
    AppComponent,
    LoginComponent,
    EditPasswordComponent,
    FooterComponent,
    HeaderComponent,
    Code404Component,
    LeftMenuComponent,
    CustomerserviceComponent,
    CrumbsComponent,
    TabsComponent,
    IndexComponent,
    DataSourceSearchComponent,
    PromptComponent,
    MainIndexComponent,
    UserManagerComponent,
    RoleManagerComponent,
    MenuManagerComponent,
    PtreeComponent,
    PtableComponent,
    IndexComponent,
    SkipIndexComponent,
    LogLoginLogSearchComponent,
    LogOperLogSearchComponent,
    OrgManagerComponent,
    ConfigManagerComponent,
    ImportUserComponent,
    DataSubsetCountryComponent,
    DataSubsetSchoolComponent,
    DataClassCountryComponent,
    DataClassSchoolComponent,
    DataSubclassCountryComponent,
    DataSubclassSchoolComponent,
    DataSubclassDetailCountryComponent,
    DataSubclassDetailSchoolComponent,
    DataItemInfoCountryComponent,
    DataItemInfoSchoolComponent,
    DataItemSearchCountryComponent,
    DataItemSearchSchoolComponent,
    CodeStandardCountryComponent,
    CodeStandardSchoolComponent,
    DataConvertListComponent,
    DataConvertInfoComponent,
    DataHelpInfoComponent,
    DataConvertInfoRulepageComponent,
    DataConvertListIssueComponent,
    DataConvertListSubscribeComponent,
    DataConvertInfoIssueComponent,
    DataConvertInfoSubscribeComponent,
    PpageComponent,
    EditPasswordComponent,
    NoderunWatchComponent,
    NodeconvertAnalysisComponent,
    DatasourceAnalysisComponent,
    DataSourceInfoComponent,
    PmultiselectComponent,
    MainIndexTaskComponent,
    EmailSendLogComponent,
    EtlPushComponent,
    EtlLogComponent,
    EtlErrorLogComponent,
    SchoolConditionAnalysisComponent,
    TeacherComponent,
    TeachingComponent,
    StudentAnalysisComponent,
    GBTCodeStandardComponent,
    JyxgGjBzdmComponent,
    JyxgHyBzdmComponent,
    JybOtherBzdmComponent,
    JyBzdmComponent,
    BzdmComponent,
    DataItemTestComponent,
    GdztJbxxComponent,
    GdztYxldComponent,
    GdztJbbxtjComponent,
    GdztSjjxtjComponent,
    GdztBxjfComponent,
    GdztJsdwComponent,
    GdztZyComponent,
    GdztJxglyjxyjComponent,
    GdztShpjComponent,
    GdztXsxxComponent,
    GdztBcsjComponent,
    KtrMgrComponent,
    KjbMgrComponent,
    InterfaceComponent,
    JobMgrComponent,
    JobAddComponent,
    JobEditComponent,
    JobDetailComponent,
    DataPlsqlComponent,
    DataEditsqlComponent,
    DyTaskCloneComponent,
    FbTaskCloneComponent,
    TaskCloneComponent,
    ScheduleJobMgrComponent
  ],
  imports: [
    // app模块依赖的东西
    BrowserModule,
    FormsModule,
    HttpModule,
    CommonModule,
    AppRoutingModule,
    DataTablesModule,
    BrowserAnimationsModule,
    AngularEchartsModule,
    TreeModule,
    GrowlModule,
    ButtonModule,
    ContextMenuModule,
    TabViewModule,
    CodeHighlighterModule,
    DropdownModule,
    DialogModule,
    DataTableModule,
    InputSwitchModule,
    PaginatorModule,
    CheckboxModule,
    CalendarModule,
    FileUploadModule,
  ],

  providers: [
    DatePipe,
    TabsService,
    CrumService,
    InterFaceService,
    HttpClient,
    PromptService,
    BaseService,
    SystemInfoService,
    SelectCacheService,
    DataValidService,
    { provide: LocationStrategy, useClass: HashLocationStrategy }//解决打包不能刷新的问题
  ],
  bootstrap: [
    // 模块的主组件，
    AppComponent
  ],
})

export class AppModule { }

