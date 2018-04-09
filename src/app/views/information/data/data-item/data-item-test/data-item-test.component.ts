import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../../../../../components/base/base.component";

@Component({
  selector: 'app-data-item-test',
  templateUrl: './data-item-test.component.html',
  styleUrls: ['./data-item-test.component.css']
})
export class DataItemTestComponent extends BaseComponent implements OnInit {

  constructor() {super(); }

  public typeList = [
    { value: 0, label: "全部" },
    { value: 1, label: "有主键子类" },
    { value: 2, label: "无主键子类" }];
  public subclassList = [];
  public subclassData=[];
  subclassParam = {
    type:0,
    keyword:''
  };


  itemParam:any ={};
  itemParamDef:any ={
    primarySize:0,
    subclassIndex:0,
    subclassCode:'',
    subclass: {},
    primaryIds:[]
  };

  itemData=[];

  ngOnInit() {
    this.itemParam = Object.assign({}, this.itemParamDef);
    this.flushSubclass();
  }


  flushSubclass(){
    this.getHttpClient().post("common/standardtest/querySubclass", null, this.subclassParam,(data)=>{
      this.subclassList = [];
      this.subclassData = [];
      this.itemParam = Object.assign({}, this.itemParamDef, {subclassCode: this.itemParam.subclassCode});
      this.itemData = [];
      if(data&& data.length>0){
        for(let i=0;i<data.length;i++){
          let d = data[i];
          this.subclassList.push({value: d.code, label: d.name+'('+(i+1)+')' + (d.nodeType>0?'P':'') });
        }
        this.subclassData = data;
        let pri = 0;
        for(let sub of this.subclassData){
          if(sub.nodeType > 0){
            pri++;
          }
        }
        this.itemParam.primarySize = pri;
        let index = this.findSubclassIndex(this.itemParam.subclassCode);
        if(index <= 0){
          this.itemParam.subclassCode = this.subclassData[0].code;
        }
        this.subclassChange();
      }
    });
  }

  subclassChange(){
    let index = this.findSubclassIndex(this.itemParam.subclassCode);
    this.itemParam.subclass= this.subclassData[index];
    this.itemParam.subclassIndex = index;
    this.itemData = [];
    if(index < 0){
      return;
    }
    this.getHttpClient().get("common/standardtest/queryItemList",{subclassCode:this.itemParam.subclassCode}, (data)=>{
      let ids = [];
      if(data && data.length >0){
        for(let d of data){
          d.primary = d.dataPrimarykey == 1;
          if(d.primary) {
            ids.push(d.id);
          }
        }
      }
      this.itemParam.primaryIds = ids;
      this.itemData = data;
    });
  }

  prevNextTable(next){
    let index = this.itemParam.subclassIndex - 1;
    if(next === true){
      index = this.itemParam.subclassIndex + 1;
    }
    if(index<0 ||index>= this.subclassData.length){
      return;
    }
    this.itemParam.subclassCode = this.subclassData[index].code;
    this.subclassChange();
  }


  saveTable(){
    if(!this.itemData || this.itemData.length==0 || this.itemParam.subclassCode == ''){
      this.tipMessage("没有选择数据子类！");
      return;
    }
    let primaryIds = [];
    for(let item of this.itemData){
      if(item.primary){
        primaryIds.push(item.id);
      }
    }
    let primaryIds_old = this.itemParam.primaryIds;
    if(primaryIds.length == primaryIds_old.length &&  primaryIds.join(',') === primaryIds_old.join(',')){
      this.tipMessage("主键没有变化，不保存！");
      return;
    }
    this.getHttpClient().post("common/standardtest/updateItemList",{subclassCode:this.itemParam.subclassCode}, primaryIds,(data)=>{
      this.tipMessage("保存成功！");
      this.flushSubclass();
    });
  }

  rebuild =false;
  rebuildAllTable(){
    if(this.rebuild) return false;
    this.rebuild = true;
    this.getHttpClient().get("common/standardtest/rebuildAllTables",null, (data)=>{

    },null,()=>{
      this.rebuild = false;
    });
  }

  findSubclassIndex(subclassCode){
    let index = -1;
    for(let i=0;i<this.subclassData.length;i++){
      if(this.subclassData[i].code == subclassCode){
        index = i;
      }
    }
    return index;
  }
}
