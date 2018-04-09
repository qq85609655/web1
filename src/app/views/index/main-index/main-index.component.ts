import {Component, OnInit, OnDestroy} from "@angular/core";
import {SystemInfoService} from "../system-info.service";
import {HttpClient} from "../../../components/http-client.service";
import {TabsService} from "../../../components/tabs/tabs.service";
import {BaseComponent} from "../../../components/base/base.component";

@Component({
  selector: "app-main-index",
  templateUrl: "./main-index.component.html",
  styleUrls: ["./main-index.component.css"]
})
export class MainIndexComponent extends BaseComponent implements OnInit {
  public standardObject = {
    a1: 0,
    a2: 0,
    a3: 0,
    a4: 0,
    a5: 0,
    a6: 0,
    loading:true,
    totalCounts: 0,
    errorCounts: 0,
    nodeWatchVos: [],
    flag_runAuth: 0
  };

  public isBg = true;

  constructor(public _HttpClient: HttpClient,public _TabsService: TabsService) {
    super();
  }

  ngOnInit() {
    this._HttpClient.get("/index/getStandardInfos", {}, data => {
      Object.assign(this.standardObject, data);
    },null,()=>{
      this.standardObject.loading=false;
    });

    this._TabsService.selectedMenuId(0);
    document.body.style.background = "#eff2f9";
  }

  ngOnDestroy() {
    document.body.style.background = "#fff";
  }
}
