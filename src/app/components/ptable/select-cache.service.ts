import { Injectable } from '@angular/core';
import {Location} from '@angular/common';

@Injectable()
export class SelectCacheService{

  private routerPath = "";
  private data = {};
  constructor(public _Location: Location) {

  }

  private getRouterPath(){
    let path = this._Location.path();
    if(path.indexOf('?') >= 0){
      path = path.substr(0, path.indexOf('?'));
    }
    return path;
  }

  private setData(data: any, key: string){
    let path = this.getRouterPath();
    if(path !== this.routerPath){
      this.routerPath = path;
      this.data = {};
    }
    this.data[key] = data;
  }

  private getData(key: string): any{
    let path = this.getRouterPath();
    if(path == this.routerPath){
      return this.data[key];
    }else{
      return null;
    }
  }

  public setTreeData(data: any){
    return this.setData(data, 'tree');
  }

  public getTreeData(){
    return this.getData('tree');
  }

  public setTableData(data: any){
    return this.setData(data, 'table');
  }

  public getTableData(){
    return this.getData('table');
  }

  public clean(){
    this.data = {};
    this.routerPath = "";
  }
}
