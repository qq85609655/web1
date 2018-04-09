import {Component, OnInit, Input, Output, OnChanges, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-pmultiselect',
  templateUrl: './pmultiselect.component.html',
  styleUrls: ['./pmultiselect.component.css']
})
export class PmultiselectComponent implements OnInit,OnChanges {

  /*
  * {
  *   name:'abc'
  *   selected:true//是否已选择
  * }
  * */
  @Input() selectList = [];
  @Output() onSelectChange;
  @Input() selectOpts:any;
  public selectOptsDefault = {
      that: this,
      getName: (row) => row.name,//要显示的文字
      functionName:'角色',
      width:'220px',
      height:'330px',
      buttons:['>','>>','<','<<']//右移，全部右移，左移，全部左移
  };

  constructor() {
    this.onSelectChange = new EventEmitter();
  }

  ngOnChanges(change:any){
    if(change.hasOwnProperty('selectList')){
      for(let row of change.selectList){
        if(!row.hasOwnProperty("selected")){
          row.selected = false;
        }
        row.checked = false;
      }
    }
  }

  ngOnInit() {
    this.selectOpts = Object.assign({}, this.selectOptsDefault, this.selectOpts);
  }

  toLeft(){
    let list = this.getCheckedList(true);
    if(list.length == 0)return false;
    for(let row of list){
      row.selected = false;
      row.checked =false;
    }
    this._onSelectChange();
  }

  toLeftAll(){
    let exists = false;
    for(let row of this.selectList){
      if(row.selected == true){
        row.selected = false;
        row.checked =false;
        exists = true;
      }
    }
    if(exists){
      this._onSelectChange();
    }
  }

  toRight(){
    let list = this.getCheckedList(false);
    if(list.length == 0)return false;
    for(let row of list){
      row.selected = true;
      row.checked =false;
    }
    this._onSelectChange();
  }

  toRightAll(){
    let exists = false;
    for(let row of this.selectList){
      if(row.selected != true){
        row.selected = true;
        row.checked =false;
        exists = true;
      }
    }
    if(exists){
      this._onSelectChange();
    }
  }

  getCheckedList(selected: boolean):Array<any>{
    let list = [];
    if(selected){
      for(let row of this.selectList){
        if(row.selected == true && row.checked == true){
          list.push(row);
        }
      }
    }else{
      for(let row of this.selectList){
        if(row.selected != true  && row.checked == true){
          list.push(row);
        }
      }
    }
    return list;
  }

  dblclickSelected(item, selected:boolean){
    item.selected = selected;
    setTimeout(()=>{
      item.checked =false; //防止和单击事件冲突
    },50);
    this._onSelectChange();
  }


  _onSelectChange(){
    let list = [];
    for(let row of this.selectList){
      if( row.selected == true){
        list.push(row);
      }
    }
    this.onSelectChange.emit(list);
  }

  calPx(value:string, addPx:number){
    if(value.endsWith('px')){
      value = value.substr(0,value.length-2);
    }
    return (parseInt(value,10)  + addPx) + 'px';
  }
}
