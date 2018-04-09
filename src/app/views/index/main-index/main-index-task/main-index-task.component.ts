import {Component, OnInit} from '@angular/core';
import {BaseComponent} from '../../../../components/base/base.component';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-main-index-task',
  templateUrl: './main-index-task.component.html',
  styleUrls: ['./main-index-task.component.css']
})
export class MainIndexTaskComponent extends BaseComponent implements OnInit {
  public taskObject = {
    loading: true,
    nodeWatchFlag: false,
    totalCounts: 0,
    errorCounts: 0,
    //  nodeWatchVos: []
    etlTaskStatuses: []
  };

  constructor(public _ActivatedRoute: ActivatedRoute, public _Router: Router) {
    super();
  }

  doinit() {
     Object.assign(this.taskObject, null);
    this.getHttpClient().get('/index/getTaskStatus', {}, data => {
      Object.assign(this.taskObject, data);
      this.taskObject.loading = false;
    }, null, () => {
      this.taskObject.loading = false;
    });
  }

  ngOnInit() {
    this.doinit();
  }

  more() {
    this._Router.navigate(['index/runAdmin/signNodeAdmin']);
  }

  doRefrash() {
    this.tipWarnMessage("正在刷新任務狀態數據，請稍等...");
    this.getHttpClient().get('/index/doRefrashTaskStatus', {}, data => {
      this.doinit();
    }, null, () => {
      this.taskObject.loading = false;
    });
  }
}
