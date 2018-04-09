import {Component, OnDestroy, OnInit} from '@angular/core';
import {PromptService} from "./promt.service";

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.css']
})
export class PromptComponent implements OnInit, OnDestroy {
  public promptData = {
    status: 'hide',
    tag: '',
    title: ''
  };
  public dialogOpts={
    tip:{
      width:450,
      tag: 'dialog',
      visible: false,
      title:'提示信息',
      callback: null,
      msg : ''
    }
  }

  constructor(public _PromptService: PromptService) {}

  ngOnInit() {
    this._PromptService.rebuildPromptEvent();
    this._PromptService.promptEvent.subscribe(params => {
      if (params){
        if(params.tag == "dialog" || params.tag == "confirm") {
          if(this.dialogOpts.tip.visible === true){
            return false;
          }
          this.dialogOpts.tip.tag = params.tag;
          this.dialogOpts.tip.msg = params.msg;
          this.dialogOpts.tip.title = '提示信息';
          if(params.title){
            this.dialogOpts.tip.title = params.title;
          }
          this.dialogOpts.tip.callback = params.callback;
          this.dialogOpts.tip.visible = true;
          if(this.dialogOpts.tip.msg.length<=10){
            this.dialogOpts.tip.width = 450;
          }else{
            this.dialogOpts.tip.width = 450;
          }
          return true;
        }else {
          this.promptData.status = 'show';
          this.promptData.tag = params.tag;
          this.promptData.title = params.title;
          this.setTime(params.time);
        }
      }
    });
  }

  ngOnDestroy(){
    this._PromptService.destoryPromptEvent();
  }

  setTime(time :number) {
    if(!time || time < 100){
      time = 1000;
    }
    let that = this;
    setTimeout(()=> {
      that.promptData.status = 'hide';
    }, time);
  }

  dialogClose(tag?: string){
    //tag不存在或等于dialog时，都要调用回调方法
    if(tag == 'confirm'){
      return;
    }
    this.dialogOpts.tip.visible = false;
    if(this.dialogOpts.tip.callback){
      this.dialogOpts.tip.callback();
    }
  }
}
