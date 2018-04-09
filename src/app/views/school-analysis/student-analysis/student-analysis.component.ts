import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-student-analysis',
  templateUrl: './student-analysis.component.html',
  styleUrls: ['./student-analysis.component.css']
})
export class StudentAnalysisComponent implements OnInit {
  showloading: boolean = true;
  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      this.showloading = false;
    }, 1000);
    this.initTimes();
  }


  initTimes(){
    let studentSize = 1000;
    let name = [];
    let ts = [];
    for(let i=0;i<studentSize;i++) {
      let n = this.getName(3, 2);
      name.push(n );
    }
    for(let j=0;j<this.timesOption.legend.data.length;j++){
      let tsdata=[];
      for(let i=0;i<studentSize;i++) {
        let num = this.getNumber(8, -10);
        if (num <= 0) {
          tsdata.push(0);
        } else {
          tsdata.push(Math.floor(num));
        }
      }
      ts.push({
        name: this.timesOption.legend.data[j] ,
        type:'bar',
        data: tsdata
      });
    }
    this.timesOption.dataZoom[0]['startValue'] = name[0];
    this.timesOption.dataZoom[0]['endValue'] = name[40];
    this.timesOption.xAxis[0].data = name;
    this.timesOption.series = ts;
  }

  timesOption = {
    title : {
      text: '学生日常表现统计',
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
      data:['缺课次数','迟到次数','早退次数','请假次数','处分次数'],
    },
    dataZoom: [{
      startValue: '',
      bottom:"20px"
    }, {
      type: 'inside'
    }],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis : [
      {
        type : 'category',
        data : ['新增校舍']
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
      }
    ]
  };

  areaOption = {
    title : {
      text: '学生分布情况统计',
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
      data:['数量'],
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
        data : ['外省学生数','西部学生数','农村学生数','贫困学生数','少数名族学生数']
      }
    ],
    yAxis : [
      {
        type : 'value',
        name : '数量'
      }
    ],
    series : [
      {
        name:'数量',
        type:'bar',
        data:[15240, 3650, 10324, 5612, 1562]
      }
    ]
  };

  gradeOption = {
    backgroundColor: '#2c343c',

    title: {
      text: 'Customized Pie',
      left: 'center',
      top: 20,
      textStyle: {
        color: '#ccc'
      }
    },

    tooltip : {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },

    visualMap: {
      show: false,
      min: 80,
      max: 600,
      inRange: {
        colorLightness: [0, 1]
      }
    },
    series : [
      {
        name:'访问来源',
        type:'pie',
        radius : '55%',
        center: ['50%', '50%'],
        data:[
          {value:1523, name:'初级'},
          {value:3652, name:'中级'},
          {value:945, name:'高级'},
          {value:2012, name:'无等级'}
        ].sort(function (a, b) { return a.value - b.value; }),
        roseType: 'radius',
        label: {
          normal: {
            textStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            }
          }
        },
        labelLine: {
          normal: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            },
            smooth: 0.2,
            length: 10,
            length2: 20
          }
        },
        itemStyle: {
          normal: {
            color: '#c23531',
            shadowBlur: 200,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },

        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function (idx) {
          return Math.random() * 200;
        }
      }
    ]
  };


  gradeOption2 = {
    title: {
      text: '毕业生社会技术等级人数统计',
      left: 'center',
      top: 20,
      textStyle: {
        color: '#ccc'
      }
    },
    tooltip : {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    visualMap: {
      show: false,
      min: 80,
      max: 600,
      inRange: {
        colorLightness: [0, 1]
      }
    },
    series : [
      {
        name:'',
        type:'pie',
        radius : '55%',
        center: ['50%', '50%'],
        data:[
          {value:1523, name:'初级'},
          {value:3652, name:'中级'},
          {value:945, name:'高级'},
          {value:2012, name:'无等级'}
        ].sort(function (a, b) { return a.value - b.value; }),
        roseType: 'radius',
        label: {
          normal: {
            textStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            }
          }
        },
        labelLine: {
          normal: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            },
            smooth: 0.2,
            length: 10,
            length2: 20
          }
        },
        itemStyle: {
          normal: {
            color:'red',
            shadowBlur: 30,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },

        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function (idx) {
          return Math.random() * 200;
        }
      }
    ]
  };


  getNumber(max,min){
    return Math.round(Math.random() * (max-min)) + min;
  }
  nameList = [
    '赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '褚', '卫', '蒋', '沈', '韩', '杨', '朱', '秦', '尤', '许', '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏', '陶', '姜', '戚', '谢', '邹', '喻', '柏', '水', '窦', '章', '云', '苏', '潘', '葛', '奚', '范', '彭', '郎', '鲁', '韦', '昌', '马', '苗', '凤', '花', '方', '俞', '任', '袁', '柳', '酆', '鲍', '史', '唐', '费', '廉', '岑', '薛', '雷', '贺', '倪', '汤', '滕', '殷', '罗', '毕', '郝', '邬', '安', '常', '乐', '于', '时', '傅', '皮', '卞', '齐', '康', '伍', '余', '元', '卜', '顾', '孟', '平', '黄', '和', '穆', '萧', '尹', '姚', '邵', '湛', '汪', '祁', '毛', '禹', '狄', '米', '贝', '明', '臧', '计', '伏', '成', '戴', '谈', '宋', '茅', '庞', '熊', '纪', '舒', '屈', '项', '祝', '董', '梁', '杜', '阮', '蓝', '闵', '席', '季', '麻', '强', '贾', '路', '娄', '危'
  ];
  getName(max, min) {
    var nameLen = Math.ceil(Math.random() * (max-min) + min);
    var name = [];
    for (var i = 0; i < nameLen; i++) {
      name.push(this.nameList[Math.round(Math.random() * this.nameList.length - 1)]);
    }
    return name.join('');
  }
}
