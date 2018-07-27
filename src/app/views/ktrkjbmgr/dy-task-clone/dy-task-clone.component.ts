import { Component, OnInit } from '@angular/core';
import {TaskCloneComponent} from '../task-clone/task-clone.component';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '../../../components/http-client.service';

@Component({
  selector: 'app-dy-task-clone',
  templateUrl: '../task-clone/task-clone.component.html',
  styleUrls: ['../task-clone/task-clone.component.css']
})
export class DyTaskCloneComponent extends TaskCloneComponent implements OnInit {

  constructor(public _ActivatedRoute: ActivatedRoute,
              public _Router: Router,
              public _HttpClient: HttpClient) {
    super(_ActivatedRoute, _Router, _HttpClient);
    super.setBusinessType(2);
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
