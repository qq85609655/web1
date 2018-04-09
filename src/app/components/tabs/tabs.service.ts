import {EventEmitter, Injectable} from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class TabsService{
  private tabData = {
    tabList: [],
    selectedId: 0
  };

  public menuData={
    selectedId: 0,
    menus: []
  }

  public maxLength = 8;

  leftMenuEvent = new EventEmitter();

  rebuildLeftMenuEvent(){
    this.leftMenuEvent.unsubscribe();
    this.leftMenuEvent = new EventEmitter();
  }

  destoryLeftMenuEvent(){
    this.leftMenuEvent.unsubscribe();
  }

  //由页面刷新菜单和横向tab的选中
  selectedMenuId(id: number){
    this.selectTabMenuId(id);
    this.selectLeftMenuId(id);
  }

  public selectTabMenuId(id , selectMenu?:any){
    if(id <= 0){
      this.tabData.selectedId = 0;
    }
    if(!selectMenu) {
      selectMenu = this.findMenuById(this.menuData.menus, id);
    }
    if(selectMenu){
      this.addTab(selectMenu);
    }
  }

  public selectLeftMenuId(id){
    this.leftMenuEvent.emit({selectedId: id});
  }

  getTabData(){
    return this.tabData;
  }
  getMenuData(){
    return this.menuData;
  }

  private addTab(menuItem) {
    var arr = this.tabData.tabList;
    var flag = false; //判断是否存在
    for (let tab of this.tabData.tabList) {
      if (tab.menuId === menuItem.menuId) {
        flag = true;
      }
    }
    if (!flag) {
      if (this.tabData.tabList.length >= this.maxLength) {
        let len = this.tabData.tabList.length - this.maxLength + 1;
        for (let i = 0; i < len; i++) {
          this.tabData.tabList.shift();
        }
      }
      this.tabData.tabList.push(menuItem);
    }
    this.tabData.selectedId = menuItem.menuId;
  }

  public findMenuById(list, menuId){
    if(!list || list.length == 0){
      return;
    }
    for(let menu of list){
      if(!menu.children || menu.children.length == 0){
        if(menu.menuId == menuId){
          return menu;
        }
      }else{
        //只查找叶子节点
        let result = this.findMenuById(menu.children, menuId);
        if(result){
          return result;
        }
      }
    }
    return null;
  }

  public cleanAllTabs(){
    this.tabData.tabList.splice(0,this.tabData.tabList.length);
    this.tabData.selectedId = 0;
  }
}


