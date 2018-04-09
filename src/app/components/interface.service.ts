/**
 * Created by yanling.zhong on 2017/7/21.
 */
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()


//接口
export  class InterFaceService{
  private CenIntfc: any;

  init() {
    this.CenIntfc = {
      "subset": "subset",
      "subclass": "subclass",
      "item":"item/1",
      "metadatatree":"item/metadatatree/1",
      "schooltree":"item/metadatatree/2",
	    "class":"class",
      "code":"code"
    }
  }
  getIntfc(){
    this.init();
    return this.CenIntfc;
  }






}
