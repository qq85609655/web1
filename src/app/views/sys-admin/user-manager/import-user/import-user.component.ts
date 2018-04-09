import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ViewChild,
  EventEmitter,
  AfterViewInit
} from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "../../../../components/http-client.service";
import { BaseComponent } from "../../../../components/base/base.component";
import { FileUpload, Message } from "primeng/primeng";

@Component({
  selector: "app-import-user",
  templateUrl: "./import-user.component.html",
  styleUrls: ["./import-user.component.css"]
})
export class ImportUserComponent extends BaseComponent implements OnInit {
  constructor(public _Router: Router, public _HttpClient: HttpClient) {
    super();
  }
  public queryParam = {
    state: 0,
    roleName: "",
    roleId: ""
  };

  uploadStatus='';

  errorInfo={
    successCount:0,
    errorCount:0,
    errorVos:[]
  }

  ngOnInit() {}

  // 上传
  importUser(){
    var that = this;
    if(that.fileupload.hasFiles()){
      that.fileupload.upload();
      return false;
    }
  }

  onUpload(event) {
    let http:XMLHttpRequest = event.xhr;
    var that = this;
    if(http.status < 300){
      let response = http.responseText;
      let responseData:any = null;
      try {
        responseData = JSON.parse(response);
      }catch(e){

      }
      this.uploadStatus = 'uploadover';
      //请求异常
      if (this.getHttpClient().checkHandleError(responseData)) {
        this.errorInfo.successCount = 0;
        this.errorInfo.errorCount = 0;
        this.errorInfo.errorVos = [];
        return;
      }
      this.tipMessage("导入完成！");
      Object.assign(this.errorInfo, responseData);
    }
  }

  onBeforeSend(event){
    event.xhr.setRequestHeader('accept', 'application/json;charset=UTF-8');
    this.uploadStatus = 'uploading';
  }

  @ViewChild("fileupload")
  fileupload :FileUpload;

  // 下载模板
  dialogOpts = {
    templateUser: {
      visible: false
    }
  };
  templateUser() {
    this.dialogOpts.templateUser.visible = true;
  }
  templateUserOk() {
    window.location.href = this.getBasePath() + "common/resources/user.xlsx";
    this.dialogOpts.templateUser.visible = false;
    this.tipMessage("用户导入模板下载成功！");
  }
  goback() {
    this.getRouter().navigate(["/index/sysAdmin/userAdmin"], {queryParams: {back: true}});
  }


  onRemove(event){
    //解决IE兼容问题
    //再IE11下，删除input[file]组件时，会额外调用change事件，此时需要禁止change事件(通过selfInputChange控制)，否则刚刚选择的文件就丢失了
    //但remove时，也删除input[file]组件，但此时不会再有额外change事件，需要手动关闭selfInputChange状态
    if(this.fileupload.isIE11()){
      setTimeout(()=>{
        if(this.fileupload.selfInputChange) {
          this.fileupload.selfInputChange = false;
        }
      },100);
    }
  }
}
