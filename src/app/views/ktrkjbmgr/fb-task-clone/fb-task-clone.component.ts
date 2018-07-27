import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '../../../components/http-client.service';
import {TaskCloneComponent} from '../task-clone/task-clone.component';

@Component({
  selector: 'app-fb-task-clone',
  templateUrl: '../task-clone/task-clone.component.html',
  styleUrls: ['../task-clone/task-clone.component.css']
})
export class FbTaskCloneComponent extends TaskCloneComponent implements OnInit {
  constructor(public _ActivatedRoute: ActivatedRoute,
              public _Router: Router,
              public _HttpClient: HttpClient) {
    super(_ActivatedRoute, _Router, _HttpClient);
    super.setBusinessType(1);
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
