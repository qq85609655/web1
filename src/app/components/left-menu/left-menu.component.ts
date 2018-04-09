import {Component, OnDestroy, OnInit} from '@angular/core';
import {TabsService} from '../tabs/tabs.service';
import {Router} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {BaseComponent} from "../base/base.component";

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css'],
  animations: [
    trigger('menuState', [
      state('inactive', style({height: 0})),
      state('active', style({height: '*'})),
      transition('inactive <=> active', animate(200))
    ])
  ]
})
export class LeftMenuComponent extends BaseComponent implements OnInit,OnDestroy {
  public menuData={
    selectedId: 0,
    menus: []
  }

  constructor(public _TabsService: TabsService,
              public _Router: Router) {
    super();
  }

  ngOnInit() {
    this.menuData = this._TabsService.getMenuData();
    this.menuData.menus.splice(0, this.menuData.menus.length);
    this._TabsService.rebuildLeftMenuEvent();
    this._TabsService.leftMenuEvent.subscribe((params)=>{
      if(!params){
        return false;
      }
      if(params.hasOwnProperty("selectedId")){
        let selectedId = params.selectedId;
        setTimeout(()=>{
        this.selectedLeftMenu(selectedId);
        },50);
      }
    });


    this.getHttpClient().get("menu/getMenuInfos",null,data=>{
      if(!data || data.length == 0){
        this.dialogMessage("您没有任一菜单权限，请联系管理员！" ,()=>{

        });
        return false;
      }
      this.appendMenuInfo(data, null, 0 );
      this.pushAll(this.menuData.menus , data, true);
      this._Router.navigate(['/index']);
    });
  }

  ngOnDestroy(){
    this._TabsService.destoryLeftMenuEvent();
  }
  /**
   * menu对象增加id字段
   * @param data
   */
  appendMenuInfo(data,parent, index){
    if(!data || data.length == 0){
      return;
    }
    for(let menu of data){
      menu.id = menu.menuId;
      menu.state = 'inactive';
      menu.parent = parent;
      menu.index = index;
      this.appendMenuInfo(menu.children, menu, index + 1);
    }
  }

  menuClick(menuItem: any) {
    this.menuData.selectedId = menuItem.menuId;
    this._TabsService.selectTabMenuId(menuItem.menuId, menuItem);
    this.getSelectCacheService().clean();
    this.reloadRouterLink([menuItem.url]);
  }

  selectedLeftMenu(selectedId){
    if(selectedId <= 0){
      this.menuData.selectedId = 0;
    }else{
      //非首页，待实现
      let selectMenu = this._TabsService.findMenuById(this.menuData.menus , selectedId);
      if(!selectMenu){
        return;
      }
      this.menuData.selectedId = selectedId;
      let node = selectMenu;
      while(node){
        if(node.state == 'inactive') {
          node.state = 'active';
        }
        if(!node.parent){
          setTimeout(()=>{
            this.closeSiblings(node);
          },200);
          break;
        }
        node = node.parent;
      }
    }
  }

  public toggleState(menu) {
    let toActive = menu.state !== 'active';
    menu.state = toActive ? 'active' : 'inactive';
    if(toActive && menu.index == 0){
      setTimeout(()=>{
        this.closeSiblings(menu);
      },200);
    }
  }
  public closeSiblings(menu){
    let menus;
    if(menu.parent){
      menus = menu.parent.children;
    }else{
      menus = this.menuData.menus;
    }
    for(let m of menus){
      if(menu.menuId != m.menuId && m.state == 'active' ){
        m.state = 'inactive';
      }
    }
  }
}
