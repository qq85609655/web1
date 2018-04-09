import { Injectable } from '@angular/core';

@Injectable()
export class DataValidService {

  constructor() { }

  public data = {
    id:1,
    name:'',
    start:10,
    end:20,
    time:{
      type : 1,
      spaces:''
    },
    score:[
      {scoreId:1 , scoreName:"化学", score:68.3}
    ]
  };

  myScore = [
    {scoreId:1 , scoreName:"化学", score:68.3},
    {scoreId:1 , scoreName:"化学", score:68.3}
  ];

  //_fields标记当前对象有那些字段需要验证，主要目的是为了排序
  //status用户控制红色样式，true表示错误
  //msg 用户错误title文字
  //name 当前验证的功能名称，以便产生默认提示文字
  //valids 验证列表
  //required 必填。部分非字符串下，默认空值字段nullValue(非必填)，默认值为0/''
  //regexp 正则表达式，可以为RexExp对象，也可以为字符串
  //数组已.$结尾
  //数组可以验证数组长度
  //数组中$this表示数组为字符串数组等基础类型数组，非对象数组
  //norepeat 不能重复的字段，可以添加多行来验证多个字段,默认认为不重复字段非空
  public valid = {
    data: {
      _fields:['id','name',"score.$"],
      id:{
        status: false,
        msg: '',
        name:'用户ID',
        valids:[
          {required:true, msg: '用户名不能为空！', nullValue: -1},
          {maxLength:20, msg:'用户名最大长度为20！'},
          {minLength:4, msg:'用户名最小长度为20！'},
          {regexp: '', msg: '用户名格式错误！'}
        ]
      },
      name: {
        status: false,
        msg: '',
        name:'用户ID',
        valids:[
          {required:true, msg: '用户名不能为空！'},
          {maxLength:20, msg:'用户名最大长度为20！'},
          {minLength:4, msg:'用户名最小长度为20！'},
          {regexp: '', msg: '用户名格式错误！'}
        ]
      },
      time:{
        _fields:['id','name'],
        id:{
          status: false,
          msg: '',
          name:'用户ID',
          valids:[
            {required:true, msg: '用户名不能为空！', nullValue: -1, condition : null},
            {maxLength:20, msg:'用户名最大长度为20！'},
            {minLength:4, msg:'用户名最小长度为20！'},
            {regexp: '', msg: '用户名格式错误！'}
          ]
        },
        name: {
          status: false,
          msg: '',
          name:'用户ID',
          valids:[
            {required:true, msg: '用户名不能为空！'},
            {maxLength:20, msg:'用户名最大长度为20！'},
            {minLength:4, msg:'用户名最小长度为20！'},
            {regexp: '', msg: '用户名格式错误！'}
          ]
        }
      },
      score: [],
      "score.$":{
        valids:[
          {maxLength:20, msg:'用户列表最大长度为20！'},
          {minLength:4, msg:'用户列表最小长度为20！'}
        ],
        _fields:['scoreId','score'],
        scoreId:{
          status: false,
          msg: '',
          name:'用户ID',
          valids:[
            {required:true, msg: '用户名不能为空！'}
          ]
        },
        score:{
          status: false,
          msg: '',
          name:'用户ID',
          valids:[
            {required:true, msg: '用户名不能为空！'}
          ]
        }
      }
    },
    "myScore.$":{
      valids:[
        {maxLength:20, msg:'用户列表最大长度为20！'},
        {minLength:4, msg:'用户列表最小长度为20！'},
        {norepeat:'scoreName', msg:'学科名称不能重复'}
      ],
      _fields:['scoreId','score'],
      scoreId:{
        status: false,
        msg: '',
        name:'用户ID',
        valids:[
          {required:true, msg: '用户名不能为空！'}
        ]
      },
      score:{
        status: false,
        msg: '',
        name:'用户ID',
        valids:[
          {required:true, msg: '用户名不能为空！'}
        ]
      }
    }
  }

  /*
    <input type="text" [(ngModel)]="data.id" maxlength="20" [ngClass]="{'error': valid.data.id.status}">
    <tr *ngFor="let s of data.score;let i = index">
      <td>
        <input type="text" [(ngModel)]="s.scoreName" maxlength="20" [ngClass]="{'error': valid.data?.score[i]?.scoreName.status}">
      </td>
    <tr>
    //注意数组时，数组对象和字段对象前面要有?
  */
  public validData(validRoot , validName: string, that): Array<any>{
    validRoot._fields = [validName];
    let errorMsg = [];
    this.validData_inner(validRoot, validRoot, that, errorMsg);
    return errorMsg;
  }

  public validDataClean(validRoot , validName: string){
    validRoot._fields = [validName];
    this.validDataClean_inner(validRoot);
  }

  private validDataClean_inner(validInfo){
    if(validInfo.hasOwnProperty('_fields')) {
      let fields = validInfo._fields;
      for (let field of fields) {
        if(!validInfo.hasOwnProperty(field)){
          console.log("验证数据信息不存在，请检查!",field, validInfo);
          continue;
        }
        if (field.endsWith(".$")) {
          let fieldName = field.substr(0, field.length - 2);
          validInfo[fieldName] = [];
          continue;
        }
        this.validDataFieldClean(field, validInfo);
      }
    }else{
      return false;
    }
  }

  private validDataFieldClean(field, validInfos){
    let validInfo = validInfos[field];
    if(!validInfo.hasOwnProperty("valids")){
      if(validInfo.hasOwnProperty('_fields')){
        //表示多层的对象引用
        this.validDataClean_inner(validInfos[field]);
        return;
      }else{
        if(this.appendField(validInfo)){
          this.validDataClean_inner(validInfos[field]);
          return true;
        }
        console.log("验证信息没有验证列表valids，也没有字段列表_fields,请检查!",field, validInfos);
        return true;
      }
    }
    validInfos[field].status = false;
    validInfos[field].msg = '';
  }


  private validData_inner(validInfo, validResultInfo, that ,errorMsg:Array<any>): boolean{
    if(!validResultInfo){
      validResultInfo = validInfo;
    }
    if(validInfo.hasOwnProperty('_fields')) {
      let fields = validInfo._fields;
      for (let field of fields) {
        if(!validInfo.hasOwnProperty(field)){
          console.log("验证数据信息不存在，请检查!",field, validInfo);
          continue;
        }
        if (field.endsWith(".$")) {
          this.validDataArray(field, validInfo, validResultInfo, that,errorMsg);
          continue;
        }
        this.validDataField(field, validInfo, validResultInfo , that, errorMsg);
      }
    }else{
      return false;
    }
  }


  private validDataArray(field, validInfo, validResultInfo, validData, errorMsg:Array<any>){
    let fieldName = field.substr(0, field.length - 2);
    if(validResultInfo.hasOwnProperty(fieldName) && this.isArray(validResultInfo[fieldName]) ){

    }else{
      validResultInfo[fieldName] = [];
    }
    let resultInfos = validResultInfo[fieldName];
    while(true){
      if(resultInfos.length >= validData[fieldName].length){
        break;
      }
      resultInfos.push({});//补齐到索引的长度
    }
    for(let i=0;i<resultInfos.length;i++){
      if(resultInfos[i] === null){
        resultInfos[i] = {};
      }
    }

    //验证字段
    for(let i=0;i<validData[fieldName].length;i++){
      if(!validInfo[field].hasOwnProperty("_fields")){
        let fields = [];
        for(let f in validInfo[field])  {
          if(f == 'valids') continue;
          fields.push(f);
        }
        validInfo[field]["_fields"] = fields;
      }
      this.validData_inner(validInfo[field], resultInfos[i], validData[fieldName][i],errorMsg);
    }
    //数组级别验证
    if(validInfo[field].valids) {
      for (let valid2 of validInfo[field].valids) {
        if (valid2.hasOwnProperty('norepeat') && valid2.norepeat) {
          let field2 = valid2.norepeat;
          this.checkRepeat(field2, valid2, validData[fieldName], errorMsg);
        }
      }
    }
  }

  private checkRepeat(field, valid: any, validDatas, errorMsg:Array<any>){
    if(!validDatas || validDatas.length<=1){
      return;
    }
    //valid.status = false;
    let length = validDatas.length;
    let errorFlag = false;
    for(let i=0;i<length-1;i++){
      let value1 = validDatas[i][field];
      if(value1 == ''){
        continue;
      }
      for(let j=i+1;j<length;j++){
        let value2 = validDatas[j][field];
        if(value1 == ''){
          continue;
        }
        if(value1 == value2){
          errorFlag = true;
          //set error
        }
      }
    }
    if(errorFlag){
      let msg:any = valid.msg;
      if(!msg){
        msg = '数组字段值不能重复！';
      }
      //valid.status = true;
      //valid.msg = msg;
      errorMsg.push(msg);
    }
  }

  appendField(validInfo): boolean {
    if(!validInfo.hasOwnProperty("valids") && !validInfo.hasOwnProperty('_fields')
      && !validInfo.hasOwnProperty("status") && !validInfo.hasOwnProperty("msg")){
      let fields = [];
      for(let f in validInfo)  {
        fields.push(f);
      }
      validInfo["_fields"] = fields;
      return true;
    }
    return false;
  }

  /**
   *
   * @param {string} field
   * @param validInfo
   * @param validResultInfo
   * @param {number} index -1表示对象，否则为数组
   */
  private validDataField(field: string, validInfos, validResultInfos, dataObj, errorMsg:Array<any>): boolean{
    let validInfo = validInfos[field];
    if(!validResultInfos.hasOwnProperty(field)){
      validResultInfos[field] = {};
    }
    if(!validInfo.hasOwnProperty("valids")){
      if(validInfo.hasOwnProperty('_fields')){
        //表示多层的对象引用
        this.validData_inner(validInfos[field], validResultInfos[field], dataObj[field],errorMsg);
        return;
      }else{
        if(this.appendField(validInfo)){
          this.validData_inner(validInfos[field], validResultInfos[field], dataObj[field], errorMsg);
          return true;
        }

        console.log("验证信息没有验证列表valids，也没有字段列表_fields,请检查!",field, validInfos);
        return true;
      }
    }
    validResultInfos[field].status = false;
    validResultInfos[field].msg = '';

    let validResultInfo = validResultInfos[field];
    let value = dataObj[field];
    if(!validInfo.name && validInfo.name != ''){
      validInfo.name = '';
    }
    for(let valid of validInfo.valids){
      if(valid.condition && valid.condition(dataObj) === false){
        continue;
      }
      if(valid.required === true){
        if(valid.hasOwnProperty('nullValue')){
          if(value === valid.nullValue){
            this.setMsg(validInfo, validResultInfo, valid, 1, errorMsg);
            break;
          }
        }else{
          if(!value || value === 0 || value == ''){
            this.setMsg(validInfo, validResultInfo, valid, 1, errorMsg);
            break;
          }
        }
        continue;
      }

      if(valid.hasOwnProperty('minLength')){
        if(value.length < parseInt(valid.minLength, 10 )){
          this.setMsg(validInfo, validResultInfo, valid, 2, errorMsg);
          break;
        }
        continue;
      }

      if(valid.hasOwnProperty('maxLength')){
        if(value.length > parseInt(valid.maxLength, 10 )){
          this.setMsg(validInfo, validResultInfo, valid, 3, errorMsg);
          break;
        }
        continue;
      }

      if(valid.hasOwnProperty('regexp')){
        let reg: any;
        if(this.isString(valid.regexp)){
          reg = new RegExp(reg);
        }else{
          reg = valid.regexp;
        }
        if(!reg.test(value+'')){
          this.setMsg(validInfo, validResultInfo, valid, 4, errorMsg);
          break;
        }
        continue;
      }
    }
    return validResultInfo.status;
  }


  //type 1必填，2最小长度，3最大长度，4正则
  private setMsg(validInfo, validResultInfo, valid, type, errorMsg:Array<any>){
    if(validResultInfo.status === true) return;
    validResultInfo.status = true;
    if(valid.hasOwnProperty('msg') && valid.msg != '') {
      validResultInfo.msg = valid.msg;
    }else{
      if(type == 1){
        validResultInfo.msg = validInfo.name + '不能为空！';
      }else if(type == 2){
        validResultInfo.msg = validInfo.name + '最小长度为'+ valid.minLength +'！';
      }else if(type == 3){
        validResultInfo.msg = validInfo.name + '最大长度为'+ valid.maxlength +'！';
      }else if(type == 4){
        validResultInfo.msg = validInfo.name + '数据格式错误！';
      }else if(type == 11){
        validResultInfo.msg = '数组最小长度为'+ valid.minlength +'！';
      }else if(type == 12){
        validResultInfo.msg = '数组最大长度为'+ valid.maxlength +'！';
      }else if(type == 13){
        validResultInfo.msg = '数组字段值不能重复！';
      }else{
        validResultInfo.msg = 'error';
      }
    }
    errorMsg.push(validResultInfo.msg);
    //console.log(validResultInfo.msg);
  }

  isString(str) :boolean{
    return (typeof str == 'string') && str.constructor==String;
  }

  isArray(obj): boolean{
    return obj instanceof Array;
  }
}
