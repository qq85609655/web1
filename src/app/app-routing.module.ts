import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {LoginComponent} from './views/login/login.component';
import {EditPasswordComponent} from './views/login/edit-password/edit-password.component';
import {Code404Component} from './code404/code404.component';
import {LoginGuard} from './login.service';

import {IndexComponent} from './views/index/index.component';

import {DataSourceSearchComponent} from './views/datashare/data-source/data-source-search/data-source-search.component';


import {MainIndexComponent} from './views/index/main-index/main-index.component';
import {UserManagerComponent} from './views/sys-admin/user-manager/user-manager.component';
import {RoleManagerComponent} from './views/sys-admin/role-manager/role-manager.component';
import {MenuManagerComponent} from './views/sys-admin/menu-manager/menu-manager.component';
import {SkipIndexComponent} from './views/index/skip-index/skip-index.component';
import {LogLoginLogSearchComponent} from './views/sys-admin/log-login-log-search/log-login-log-search.component';
import {LogOperLogSearchComponent} from './views/sys-admin/log-oper-log-search/log-oper-log-search.component';
import {OrgManagerComponent} from './views/sys-admin/org-manager/org-manager.component';
import {ConfigManagerComponent} from './views/sys-admin/config-manager/config-manager.component';
import {ImportUserComponent} from './views/sys-admin/user-manager/import-user/import-user.component';
import {DataSubsetCountryComponent} from './views/information/data/data-subset-country/data-subset-country.component';
import {DataSubsetSchoolComponent} from './views/information/data/data-subset-school/data-subset-school.component';
import {DataClassSchoolComponent} from './views/information/data/data-class-school/data-class-school.component';
import {DataClassCountryComponent} from './views/information/data/data-class-country/data-class-country.component';
import {DataSubclassSchoolComponent} from './views/information/data/data-subclass-school/data-subclass-school.component';
import {DataSubclassCountryComponent} from './views/information/data/data-subclass-country/data-subclass-country.component';
import {DataSubclassDetailSchoolComponent} from './views/information/data/data-subclass-detail-school/data-subclass-detail-school.component';
import {DataSubclassDetailCountryComponent} from './views/information/data/data-subclass-detail-country/data-subclass-detail-country.component';
import {DataItemInfoCountryComponent} from './views/information/data/data-item/data-item-info-country/data-item-info-country.component';
import {DataItemInfoSchoolComponent} from './views/information/data/data-item/data-item-info-school/data-item-info-school.component';
import {DataItemSearchCountryComponent} from './views/information/data/data-item/data-item-search-country/data-item-search-country.component';
import {DataItemSearchSchoolComponent} from './views/information/data/data-item/data-item-search-school/data-item-search-school.component';
import {CodeStandardSchoolComponent} from './views/information/code/code-standard-school/code-standard-school.component';
import {DataHelpInfoComponent} from './views/datashare/data-help-info/data-help-info.component';
import {DataConvertInfoIssueComponent} from './views/datashare/data-resources/data-convert-info-issue/data-convert-info-issue.component';
import {DataConvertListSubscribeComponent} from './views/datashare/data-resources/data-convert-list-subscribe/data-convert-list-subscribe.component';
import {DataConvertListIssueComponent} from './views/datashare/data-resources/data-convert-list-issue/data-convert-list-issue.component';
import {DataConvertInfoSubscribeComponent} from './views/datashare/data-resources/data-convert-info-subscribe/data-convert-info-subscribe.component';
import {NoderunWatchComponent} from './views/run-admin/noderun-watch/noderun-watch.component';
import {NodeconvertAnalysisComponent} from './views/run-analysis/nodeconvert-analysis/nodeconvert-analysis.component';
import {DatasourceAnalysisComponent} from './views/run-analysis/datasource-analysis/datasource-analysis.component';
import {DataSourceInfoComponent} from './views/datashare/data-source/data-source-info/data-source-info.component';
import {EmailSendLogComponent} from './views/sys-admin/email-send-log/email-send-log.component';
import {EtlPushComponent} from './views/run-admin/etl-push/etl-push.component';
import {EtlLogComponent} from './views/run-admin/etl-log/etl-log.component';
import {EtlErrorLogComponent} from './views/run-admin/etl-log/etl-error-log/etl-error-log.component';
import {SchoolConditionAnalysisComponent} from './views/school-analysis/school-condition-analysis/school-condition-analysis.component';
import {TeacherComponent} from './views/school-analysis/teacher/teacher.component';
import {TeachingComponent} from './views/school-analysis/teaching/teaching.component';
import {StudentAnalysisComponent} from './views/school-analysis/student-analysis/student-analysis.component';
import {JyBzdmComponent} from './views/information/code/jy-bzdm/jy-bzdm.component';
import {GBTCodeStandardComponent} from './views/information/code/gbt-code-standard/gbt-code-standard.component';
import {JyxgGjBzdmComponent} from './views/information/code/jyxg-gj-bzdm/jyxg-gj-bzdm.component';
import {JyxgHyBzdmComponent} from './views/information/code/jyxg-hy-bzdm/jyxg-hy-bzdm.component';
import {JybOtherBzdmComponent} from './views/information/code/jyb-other-bzdm/jyb-other-bzdm.component';
import {GdztJbxxComponent} from './views/information/code/gdzt-jbxx/gdzt-jbxx.component';
import {GdztYxldComponent} from './views/information/code/gdzt-yxld/gdzt-yxld.component';
import {GdztJbbxtjComponent} from './views/information/code/gdzt-jbbxtj/gdzt-jbbxtj.component';
import {GdztSjjxtjComponent} from './views/information/code/gdzt-sjjxtj/gdzt-sjjxtj.component';
import {GdztBxjfComponent} from './views/information/code/gdzt-bxjf/gdzt-bxjf.component';
import {GdztJsdwComponent} from './views/information/code/gdzt-jsdw/gdzt-jsdw.component';
import {GdztZyComponent} from './views/information/code/gdzt-zy/gdzt-zy.component';
import {GdztJxglyjxyjComponent} from './views/information/code/gdzt-jxglyjxyj/gdzt-jxglyjxyj.component';
import {GdztShpjComponent} from './views/information/code/gdzt-shpj/gdzt-shpj.component';
import {GdztXsxxComponent} from './views/information/code/gdzt-xsxx/gdzt-xsxx.component';
import {GdztBcsjComponent} from './views/information/code/gdzt-bcsj/gdzt-bcsj.component';
import {KtrMgrComponent} from './views/ktrkjbmgr/ktr-mgr/ktr-mgr.component';
import {KjbMgrComponent} from './views/ktrkjbmgr/kjb-mgr/kjb-mgr.component';
import {InterfaceComponent} from './views/information/interface/interface.component';
import {JobMgrComponent} from './views/ktrkjbmgr/job-mgr/job-mgr.component';
import {JobEditComponent} from './views/ktrkjbmgr/job-mgr/job-edit/job-edit.component';
import {DataPlsqlComponent} from './views/datashare/data-plsql/data-plsql.component';
import {DataEditsqlComponent} from './views/datashare/data-plsql/data-editsql/data-editsql.component';
import {DyTaskCloneComponent} from './views/ktrkjbmgr/dy-task-clone/dy-task-clone.component';
import {FbTaskCloneComponent} from './views/ktrkjbmgr/fb-task-clone/fb-task-clone.component';


export const routes: any = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'index',
    component: IndexComponent,
    children: [
      {
        path: '',
        component: MainIndexComponent,
      },
      {
        path: 'skip',
        component: SkipIndexComponent,
      },
      {
        path: 'CountrySubset',
        component: DataSubsetCountryComponent,
      },
      {
        path: 'CountryCategory',
        component: DataClassCountryComponent
      },
      {
        path: 'CountrySubclass',
        component: DataSubclassCountryComponent
      },
      {
        path: 'CountrySubclassdetail',
        component: DataSubclassDetailCountryComponent,
      },
      {
        path: 'CountryMeta',
        component: '',
        children: [
          {
            path: 'search',
            component: DataItemSearchCountryComponent,
          },
          {
            path: ':type',
            component: DataItemInfoCountryComponent,
          }
        ]
      },
      //学校的路由配置
      {
        path: 'school',
        component: '',
        children: [
          {
            path: 'subset',
            component: DataSubsetSchoolComponent
          },
          {
            path: 'Category',
            component: DataClassSchoolComponent
          },
          {
            path: 'subclass',
            component: DataSubclassSchoolComponent
          },
          {
            path: 'subclassdetail',
            component: DataSubclassDetailSchoolComponent
          },
          {
            path: 'SchoolMeta',
            component: '',
            children: [
              {
                path: 'search',
                component: DataItemSearchSchoolComponent,
              }, {
                path: ':type',
                component: DataItemInfoSchoolComponent
              }
            ]
          }
        ]
      },
      //代码标准
      {
        path: 'code',
        component: '',
        children: [
          {
            path: 'countryCode',
            component: '',
            children: [
              {
                path: '1000',
                component: JyBzdmComponent,
              }, {
                path: '1001',
                component: GBTCodeStandardComponent,
              }, {
                path: '1002',
                component: JyxgGjBzdmComponent,
              }, {
                path: '1003',
                component: JyxgHyBzdmComponent,
              }, {
                path: '1004',
                component: JybOtherBzdmComponent,
              }, {
                path: '1201',
                component: GdztJbxxComponent,
              }, {
                path: '1202',
                component: GdztYxldComponent,
              }, {
                path: '1203',
                component: GdztJbbxtjComponent,
              }, {
                path: '1204',
                component: GdztSjjxtjComponent,
              }, {
                path: '1205',
                component: GdztBxjfComponent,
              }, {
                path: '1206',
                component: GdztJsdwComponent,
              }, {
                path: '1207',
                component: GdztZyComponent,
              }, {
                path: '1208',
                component: GdztJxglyjxyjComponent,
              }, {
                path: '1209',
                component: GdztShpjComponent,
              }, {
                path: '1210',
                component: GdztXsxxComponent,
              }, {
                path: '1211',
                component: GdztBcsjComponent,
              }
            ]
          },
          {
            path: 'dataDictionary',
            component: CodeStandardSchoolComponent
          },
          {
            path: 'interface',
            component: InterfaceComponent
          }
        ]
      },
      //数据共享交换
      {
        path: 'datashare',
        component: '',
        children: [
          {
            path: 'datasource', component: '',
            children: [
              {path: '', redirectTo: 'search', pathMatch: 'full'},
              {path: 'search', component: DataSourceSearchComponent},
              {path: ':type', component: DataSourceInfoComponent},
            ]
          },
          {
            path: 'issueDataResources', component: '',
            children: [
              {path: '', redirectTo: 'search', pathMatch: 'full'},
              {path: 'search', component: DataConvertListIssueComponent},
              {path: ':type', component: DataConvertInfoIssueComponent}
            ]
          },
          {
            path: 'plsql', component: '',
            children: [
              {path: '', redirectTo: 'search', pathMatch: 'full'},
              {path: 'search', component: DataPlsqlComponent},
              {path: ':type', component: DataEditsqlComponent}
            ]
          },
          {
            path: 'subscribeDataResources', component: '',
            children: [
              {path: '', redirectTo: 'search', pathMatch: 'full'},
              {path: 'search', component: DataConvertListSubscribeComponent},
              {path: ':type', component: DataConvertInfoSubscribeComponent}
            ]
          },
          {path: 'ktrmgr', component: KtrMgrComponent},
          {path: 'kjbmgr', component: KjbMgrComponent},
          {
            path: 'dycl', component: '',
            children: [
              {path: '', redirectTo: 'search', pathMatch: 'full'},
              {path: 'search', component: DyTaskCloneComponent}
            ]
          },
          {
            path: 'fbcl', component: '',
            children: [
              {path: '', redirectTo: 'search', pathMatch: 'full'},
              {path: 'search', component: FbTaskCloneComponent}
            ]
          },
          {
            path: 'jobMgr', component: '',
            children: [
              {path: '', redirectTo: 'search', pathMatch: 'full'},
              {path: 'search', component: JobMgrComponent},
              {path: ':type', component: JobEditComponent},
            ]
          }
        ]
      },
      //系统管理
      {
        path: 'sysAdmin',
        component: '',
        children: [
          {
            path: 'configAdmin',
            component: ConfigManagerComponent
          }
          ,
          {
            path: 'dataInfos',
            component: DataHelpInfoComponent
          }
          ,
          {
            path: 'importUser',
            component: ImportUserComponent
          }
          ,
          {
            path: 'menuAdmin',
            component: MenuManagerComponent
          }, {
            path: 'loginLog',
            component: LogLoginLogSearchComponent
          }
          , {
            path: 'OperaLog',
            component: LogOperLogSearchComponent
          }, {
            path: 'userAdmin',
            component: UserManagerComponent
          }, {
            path: 'roleAdmin',
            component: RoleManagerComponent
          }, {
            path: 'orgAdmin',
            component: OrgManagerComponent
          }, {
            path: 'emailSendLog',
            component: EmailSendLogComponent
          }]
      },
      //交换运行监控
      {
        path: 'runAdmin',
        component: '',
        children: [
          {
            path: 'signNodeAdmin',
            component: NoderunWatchComponent
          },
          {
            path: 'alertAdmin',
            component: EtlPushComponent
          },
          {
            path: 'etlConvertLog',
            component: EtlLogComponent,
          },
          {
            path: 'etlErrorLog',
            component: EtlErrorLogComponent
          }
        ]
      },
      //交换数据量统计
      {
        path: 'runAnalysis',
        component: '',
        children: [
          {
            path: 'nodeConvertAnalysis',
            component: NodeconvertAnalysisComponent
          },
          {
            path: 'dataSourceAnalysis',
            component: DatasourceAnalysisComponent
          }
        ]
      },
      {
        path: 'schoolAnalysis', component: '',
        children: [
          {path: 'schoolCondition', component: SchoolConditionAnalysisComponent},
          {path: 'teacher', component: TeacherComponent},
          {path: 'teaching', component: TeachingComponent},
          {path: 'student', component: StudentAnalysisComponent}
        ]
      },
      {
        path: 'info', component: '',
        children: [
          {path: 'schoolCondition', component: SchoolConditionAnalysisComponent},
          {path: 'teacher', component: TeacherComponent},
          {path: 'teaching', component: TeachingComponent},
          {path: 'student', component: StudentAnalysisComponent}
        ]
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'editPwd',
    component: EditPasswordComponent
  },
  {
    path: '**',
    component: Code404Component
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [LoginGuard]
})
export class AppRoutingModule {
}


