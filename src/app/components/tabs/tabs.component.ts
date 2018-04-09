import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {TabsService} from './tabs.service';
import {Router} from "@angular/router";
import {BaseComponent} from "../base/base.component";

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent extends BaseComponent implements OnInit {
  public flag = true;
  public honeMenu={
    id:0,
    menuId:0,
    menuName:'首页',
    url:'/index'
  };
  public tabData: any = {
    tabList: [],
    selectedId: 0
  };

  constructor(public _TabsService: TabsService) {
    super();
  }

  ngOnInit() {
   this.tabData = this._TabsService.getTabData();
  }

  removeTab(tabItem) {
    var index = -1;
    for(let i = 0; i < this.tabData.tabList.length; i++){
      if (this.tabData.tabList[i].menuId === tabItem.menuId){
        index = i;
      }
    }
    if(index == -1){
      return false;
    }
    let removeMenu = this.tabData.tabList[index];
    this.tabData.tabList.splice(index,1);
    if(removeMenu.menuId == this.tabData.selectedId){
      this.changeMenu(this.honeMenu);
    }
  }

  changeMenu(menuItem) {
    if (this.tabData.selectedId == menuItem.menuId) {
      return true;
    }
    this.tabData.selectedId = menuItem.menuId;
    this._TabsService.selectLeftMenuId(menuItem.menuId);
    this.getRouter().navigate([menuItem.url]);
    this.getSelectCacheService().clean();
  }
}
