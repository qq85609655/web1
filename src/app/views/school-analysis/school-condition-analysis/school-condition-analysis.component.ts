import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../../../components/base/base.component";
import {Http} from "@angular/http";

@Component({
  selector: 'app-school-condition-analysis',
  templateUrl: './school-condition-analysis.component.html',
  styleUrls: ['./school-condition-analysis.component.css']
})
export class SchoolConditionAnalysisComponent extends BaseComponent implements OnInit {
  showloading: boolean = true;
  flowShowloading=true;
  constructor(private http: Http) { super();}

  ngOnInit() {
    setTimeout(() => {
      this.showloading = false;
    }, 1000);

    this.http.get('./assets/json/flow.json' , null)
      .map(res => {return res.json();}).subscribe(data => {
      let data1 = [];
      let data2= [];
      for(let d of data){
        data1.push(d[0]);
        data2.push(d[1]);
      }
      this.flowOption.xAxis.data = data1;
      this.flowOption.series[0].data = data2;
      this.flowShowloading = false;
    });
  }

  areaOption = {
    title : {
      text: '学校建筑面积增长表',
      x: 'left',
      align: 'right'
    },
    tooltip : {
      trigger: 'axis',
      axisPointer : {            // 坐标轴指示器，坐标轴触发有效
        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      data:['新增校舍','校舍','非校舍','总建筑','占地'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis : [
      {
        type : 'category',
        data : ['2011', '2012','2013','2014','2015','2016','2017']
      }
    ],
    yAxis : [
      {
        type : 'value',
        name : '平方米'
      }
    ],
    series : [
      {
        name:'新增校舍',
        type:'bar',
        data:[15240, 21454, 10324, 40125, 15680, 21360, 75614]
      },
      {
        name:'校舍',
        type:'bar',
        data:[102451, 125624, 129658, 164524, 175644, 196522, 264517]
      },
      {
        name:'非校舍',
        type:'bar',
        data:[102542, 112453, 135214, 142145, 145624, 164521, 225423]
      },
      {
        name:'总建筑',
        type:'bar',
        data:[201524, 231524, 254514, 301254, 310004, 37524, 494521]
      },
      {
        name:'占地',
        type:'bar',
        data:[332560, 395642, 425614, 504125, 520124, 595654, 735264],

      }]
  };





  regionOption = {
    title: {
      text: '各类建筑面积统计',
      x:'center'
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {}
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
      orient: 'vertical',
      x: 'left',
      data:['教学','生活','其他','教室','图书馆','体育馆','实验室','学生宿舍','学生食堂','教工宿舍','教工食堂','生活福利','会堂']
    },
    series: [
      {
        name:'访问来源',
        type:'pie',
        selectedMode: 'single',
        radius: [0, '30%'],

        label: {
          normal: {
            position: 'inner'
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data:[
          {value:251245, name:'教学', selected:true},
          {value:301524, name:'生活'},
          {value:51526, name:'其他'}
        ]
      },
      {
        name:'访问来源',
        type:'pie',
        radius: ['40%', '55%'],
        label: {
          normal: {
            formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
            backgroundColor: '#eee',
            borderColor: '#aaa',
            borderWidth: 1,
            borderRadius: 4,
            // shadowBlur:3,
            // shadowOffsetX: 2,
            // shadowOffsetY: 2,
            // shadowColor: '#999',
            // padding: [0, 7],
            rich: {
              a: {
                color: '#999',
                lineHeight: 22,
                align: 'center'
              },
              // abg: {
              //     backgroundColor: '#333',
              //     width: '100%',
              //     align: 'right',
              //     height: 22,
              //     borderRadius: [4, 4, 0, 0]
              // },
              hr: {
                borderColor: '#aaa',
                width: '100%',
                borderWidth: 0.5,
                height: 0
              },
              b: {
                fontSize: 16,
                lineHeight: 33
              },
              per: {
                color: '#eee',
                backgroundColor: '#334455',
                padding: [2, 4],
                borderRadius: 2
              }
            }
          }
        },
        data:[
          {value:114141, name:'教室'},
          {value:30124, name:'图书馆'},
          {value:31524, name:'体育馆'},
          {value:75456, name:'实验室'},
          {value:172354, name:'学生宿舍'},
          {value:30124, name:'学生食堂'},
          {value:77590, name:'教工宿舍'},
          {value:21456, name:'教工食堂'},
          {value:17245, name:'生活福利'},
          {value:34281, name:'会堂'}
        ]
      }
    ]
  };



  bookOption = {
    title: {
      text: '历年图书数量统计'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data:['新增数','总册数']
    },
    toolbox: {
      show: true,
      feature: {
        magicType: {type: ['line', 'bar']},
        restore: {},
        saveAsImage: {}
      }
    },
    xAxis:  {
      type: 'category',
      boundaryGap: false,
      data: ['2010','2011','2012','2014','2014','2015','2016','2017']
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} 万册'
      }
    },
    series: [
      {
        name:'新增数',
        type:'line',
        data:[1.3, 0.5, 1.9, 0.9, 2.1, 4.1, 2.9, 5]
      },
      {
        name:'总册数',
        type:'line',
        data:[10, 10.5, 12.1, 13, 15.1, 19.2, 22.1, 27.1]
      }
    ]
  };


  booktypeOption = {
    title : {
      text: '专业期刊统计',
      subtext: '纯属虚构',
      x:'center'
    },
    tooltip : {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['中文纸质专业期刊','英文纸质专业期刊','电子专业期刊','其他']
    },
    series : [
      {
        name: '访问来源',
        type: 'pie',
        radius : '55%',
        center: ['50%', '60%'],
        data:[
          {value:6523, name:'中文纸质专业期刊'},
          {value:4985, name:'英文纸质专业期刊'},
          {value:5672, name:'电子专业期刊'},
          {value:986, name:'其他'}
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };


  flowOption = {
    title: {
      text: 'Beijing AQI'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      data: []
    },
    yAxis: {
      splitLine: {
        show: false
      },
      name : ''
    },
    toolbox: {
      left: 'center',
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      }
    },
    dataZoom: [{
      startValue: '2014-06-01'
    }, {
      type: 'inside'
    }],
    visualMap: {
      top: 10,
      right: 10,
      pieces: [{
        gt: 0,
        lte: 50,
        color: '#096'
      }, {
        gt: 50,
        lte: 100,
        color: '#ffde33'
      }, {
        gt: 100,
        lte: 150,
        color: '#ff9933'
      }, {
        gt: 150,
        lte: 200,
        color: '#cc0033'
      }, {
        gt: 200,
        lte: 300,
        color: '#660099'
      }, {
        gt: 300,
        color: '#7e0023'
      }],
      outOfRange: {
        color: '#999'
      }
    },
    series: [{
      name: 'Beijing AQI',
      type: 'line',
      data: [],
      markLine: {
        silent: true,
        data: [{
          yAxis: 50
        }, {
          yAxis: 100
        }, {
          yAxis: 150
        }, {
          yAxis: 200
        }, {
          yAxis: 300
        }]
      }
    }]
  };
}
