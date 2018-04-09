import {Component, OnInit} from '@angular/core';
import {CrumService} from './crums.service';

@Component({
  selector: 'app-crumbs',
  templateUrl: './crumbs.component.html',
  styleUrls: ['./crumbs.component.css']
})
export class CrumbsComponent implements OnInit {
  public crumData: any;

  constructor(public _CrumService: CrumService) {
  }

  ngOnInit() {
    this.crumData = this._CrumService.getCrums()
  }

}