/**
 * Created by yanling.zhong on 2017/7/21.
 */
import {EventEmitter, Injectable} from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
// 顶部弹窗 top-dialog

export class PromptService {
  promptEvent: EventEmitter<any> = new EventEmitter;

  public rebuildPromptEvent():any{
    this.promptEvent = new EventEmitter;
  }

  destoryPromptEvent(){
    console.log("promptEvent事件销毁");
    this.promptEvent.unsubscribe();
    this.promptEvent = new EventEmitter;
  }
}
