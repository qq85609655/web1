import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-ppage',
  templateUrl: './ppage.component.html',
  styleUrls: ['./ppage.component.css']
})
export class PpageComponent implements OnInit,OnChanges{
  @Input() first = 0;//当前页的第一条记录索引
  @Input() totalRecords=0;//总记录数
  @Input() rows=10;//分页大小
  @Input() pageLinkSize = 3;//标准页码块最大大小为: 2*pageLinkSize-1
  @Input() rowsPerPageOptions = [10, 30, 50, 100];//分页选项
  @Output() onPageChange = new EventEmitter();

  page= 1;//页码从0开始
  totalPage = 10;
  pageLinks:Array<number> = [];
  rowsList = [];
  pageInput={
    page: '',
    stauts: true
  };
  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(change){
    let intFields = ['first', 'totalRecords', 'rows', 'pageLinkSize'];
    for(let f of intFields){
      if(change.hasOwnProperty(f)){
        this[f] = parseInt( this[f]+'',10);
      }
    }
    if(this.first < 0 ||  this.totalRecords < 0  || this.first > this.totalRecords){
      this.page = 0;
      this._onPageChange();
      return;
    }
    this.pageInput.page = '';
    this.pageInput.stauts = true;
    this.page = this.calPage(this.first, this.rows) - 1;
    this.totalPage = this.calPage(this.totalRecords, this.rows);
    this.pageLinks = this.calPageLinks();
    if(change.hasOwnProperty('rowsPerPageOptions')){
      this.rowsList.splice(0, this.rowsList.length);
      for(let row of this.rowsPerPageOptions){
        this.rowsList.push({label:row+"条", value:row});
      }
    }
  }

  onLinkClick(page){
    if(this.page == page){
      return true;
    }
    this.page = page;
    this._onPageChange();
  }

  _onPageChange(){
    let param = {
      page : this.page,
      rows : this.rows
    };
    this.onPageChange.emit(param);
  }

  //输入框按钮限制事件
  onKeydown(event){
    let keyCode = event.keyCode;
    if(keyCode && keyCode == 13){
      return true;
    }
    //8 46 Delete Backspace
    //37 39 左箭头 右箭头
    if(keyCode && ( (keyCode>=48&&keyCode<=57) || (keyCode>=96&&keyCode<=105)  || keyCode==8 || keyCode==46 || keyCode==37 || keyCode==39) ){
      return true;
    }
    return false
  }

  cleanValue(){
    //清理无效值
    let page = this.pageInput.page;
    for(let i=0;i<page.length;i++){
      if('0123456789'.indexOf(page.charAt(i)) < 0){
        page = page.substr(0, i);
      }
    }
    this.pageInput.page = page;
  }

  onKeyup(event){
    this.cleanValue();
    let flag = this.checkInput(true);
    if(flag && event.keyCode && event.keyCode == 13){
      this.onGoClick();
      return true;
    }
  }

  checkInput(ignoreBlank: boolean):boolean {
    if(!this.pageInput.page){
      this.pageInput.stauts = ignoreBlank;
      return this.pageInput.stauts;
    }
    if(!/^[1-9][0-9]*$/.test(this.pageInput.page)){
      this.pageInput.stauts = false;
      return this.pageInput.stauts;
    }else{
      let p = parseInt(this.pageInput.page,10);
      if(this.totalPage <= (p-1)){
        this.pageInput.stauts = false;
        return this.pageInput.stauts;
      }
      this.pageInput.stauts = true;
      return this.pageInput.stauts;
    }
  }
  //go按钮点击
  onGoClick(){
    let flag = this.checkInput(false);
    if(!flag) return false;
    let p = parseInt(this.pageInput.page,10);
    //页码没有变化，不查询
    if(this.page == (p-1)){
      return false;
    }
    this.page = p - 1;
    this._onPageChange();
  }

  onSelectChange(event){
    this._onPageChange();
  }

  calPageLinks(): Array<number>{
    let pageLinks = [];
    let start = 0;
    let end = this.totalPage-1;
    pageLinks.push(start);
    let extendLength = this.pageLinkSize - 1;
    if((this.page-extendLength) > (start+1)){
      //开始和页码块有间隙，加个...
      pageLinks.push(-1);
    }
    for(let i = this.page-extendLength; i<this.page; i++){
      if(i > start){
        pageLinks.push(i);
      }
    }
    if(this.page > start && this.page < end){
      pageLinks.push(this.page);
    }
    for(let i = this.page+1; i<=(this.page + extendLength); i++){
      if(i < end){
        pageLinks.push(i);
      }
    }
    if((this.page+extendLength) < (end -1)){
      //开始和页码块有间隙，加个...
      pageLinks.push(-1);
    }
    if(end > start){
      pageLinks.push(end);
    }
    return pageLinks;
  }

  calPage(size, rows){
    if(size <= 0) return 1;
    let result = parseInt((size/rows) + '');
    if(size % rows > 0){
      result = result + 1;
    }
    return result;

  }
}
