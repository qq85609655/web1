/**
 * Created by yanling.zhong on 2017/7/21.
 */
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map'; 

@Injectable()
export class CrumService {
  private crumData = {
    crumList: [],
    idCurrent: 0
  };
  getCrums(){
    return this.crumData;
  }
  changeCrums(menuItem) {
    if(!this.crumData.crumList.length){
      this.crumData.crumList.push(menuItem);
    }else{
      this.crumData.crumList.pop();
      this.crumData.crumList.push(menuItem);
    }
  }
}

