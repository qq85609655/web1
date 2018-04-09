///<reference path="../../../../node_modules/primeng/components/common/treenode.d.ts"/>
import {AfterViewInit, Component, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
import {Tree, TreeNode} from "primeng/primeng";
import {HttpClient} from "../http-client.service";
import {BaseComponent} from "../base/base.component";
import {BaseService} from "../base/base.service";
import {UITreeNode} from "primeng/components/tree/tree";

@Component({
  selector: 'app-ptree',
  templateUrl: './ptree.component.html',
  styleUrls: ['./ptree.component.css']
})
export class PtreeComponent extends BaseComponent implements OnInit, AfterViewInit {
  public treeOptsDefault = {
    that: this,
    queryMethod: 'get',
    queryUrl: "",
    queryParam: {},//表示query类型参数，放在?后面。后续如果需要pathParam bodyParam再调整
    queryResultField: ['id','parentId','name', 'children'],//查询结果对象中，需要的字段名称
    functionName: '节点',//新增和修改框标题中的功能名称
    treeType: 'single',//树类型，simple/checkbox
    usingCache: false,//初始化时，是否需要读取缓存中的打开状态

    nodeSelect: null,//选中节点的查询
    expandedIndex: -1,//展开层级的索引，索引从0开始，默认值表示全部展开
    //当有callback时，不再使用其他参数，忽略本组织默认窗口
    //callback disabled提供一个参数，node，其中node.data为服务器返回的对象
    operButton:{
      add:{
        show: true,
        callback:null,
        disabled:null,
        queryUrl:'',
        queryParam: {}
      },
      edit:{
        show: true,
        callback:null,
        disabled:null,
        queryUrl:'',
        queryParam: {}
      },
      delete:{
        show: true,
        callback:null,
        disabled:null,
        queryUrl:'',
        queryParam: {},
        deleteTip: '确定删除当前节点吗？',
        deleteParentTip:'当前节点存在子节点，请先删除子节点后重试！'
      },
      up:{
        show: true,
        queryUrl:'',
        queryParam: {},
        authcode:''
      },
      down:{
        show: true,
        queryUrl:'',
        queryParam: {},
        authcode:''
      }
    },

    /* 以下为checkbox模式下配置*/
    queryCheckedMethod: 'get',
    queryCheckedUrl:'',
    queryCheckedParam:{},
    selectedNodeIds:[],
    treeEvent:null
  };

  @Input() treeOpts:any;
  treeOptsFields = [];
  treeData: TreeNode[];
  treeEvent: EventEmitter<any>;
  //刷新树时，记录树打开的状态
  treeStatus={
    status : false,
    id:null,
    ids:null,
    openIds:null,
    queryParam:null
  }

  selectedNode: any;
  selectedNodes = [];

  dialogOpts = {
    add:{
      title: '新增节点',
      visible:false,
      parent:{id: 0, label:''},
      addNodes:[{name:''}]
    },
    edit:{
      title: '修改节点',
      visible:false,
      parent:{id: '', label: '无'},
      editNode:{id:'', name:''}
    },
    delete:{
      title: '删除节点',
      visible:false,
      deleteNode:{id:''}
    }
  }

  constructor(public _HttpClient: HttpClient) {
    super();
  }

  ngOnInit() {
    this.treeOptsFields = [];
    for(var f in this.treeOpts){
      this.treeOptsFields.push(f);
    }
    this.treeOpts = Object.assign({}, this.treeOptsDefault, this.treeOpts);
    if(this.treeOpts.usingCache === true){
      //读取缓存数据，加载树
      let data = this.getSelectCacheService().getTreeData();
      if(data){
        Object.assign(this.treeStatus , data);
        Object.assign(this.treeOpts.queryParam, data.queryParam);
        this.treeStatus.status = true;

      }
    }
    this.treeEvent = this.treeOpts.treeEvent;
    if(this.treeEvent){
      this.treeEvent.subscribe(params=>{
        if(!params){
          return;
        }
        if(params.flush == true){//刷新树
          this.flushTree(true, params.noclick, false);
        }else if(params.flushChecked == true){//刷新checked选项
          //当selectedNodeIds传空数组，表示清空树的checked
          if(params.hasOwnProperty('selectedNodeIds')){
            this.updateCheckedToTree(params.selectedNodeIds);
          }else {
            this.flushTreeChecked();
          }
        }else if(params.saveStatus == true){
          //保存树状态缓存
          this.saveTreeStatus(false, params.callback);
        }
      });
    }
  }

  ngAfterViewInit(){
    this.flushTree(false, false);
  }

  /**
   *
   * @param {boolean} saveStatus 是否保存当前状态
   * @param {boolean} noclick 是否不执行点击事件
   * @param {boolean} checked 是否请求刷出checked状态
   */
  flushTree(saveStatus: boolean,noclick: boolean, checked?: boolean){
    if(!checked){
      checked = false;
    }
    if(saveStatus){
      this.saveTreeStatus(true);
    }
    var that = this;
    if(this.treeOpts.queryMethod.toLowerCase() == 'get') {
      that._HttpClient.get_old(this.treeOpts.queryUrl, this.treeOpts.queryParam, data => {
        this.queryDataToTreeData(data,noclick);
        if(checked){
          this.flushTreeChecked();
        }
      });
    }
  }

  flushTreeChecked(){
    if(this.isSingle()){
      return;
    }
    var that = this;
    if(this.treeOpts.queryMethod.toLowerCase() == 'get') {
      that._HttpClient.get(this.treeOpts.queryCheckedUrl, this.treeOpts.queryCheckedParam, data => {
        this.updateCheckedToTree(data);
      });
    }
  }

  /**
   * 保存树状态
   * @param {treeFlush} treeFlush true当前树刷新，false页面刷新保存到单例对象
   *
   */
  saveTreeStatus(treeFlush: boolean, callback?: Function){
    this.treeStatus.openIds = [];
    if(this.treeData && this.treeData.length > 0){
      this.treeStatus.openIds = [];
      for(let node of this.treeData){
        this.saveTreeStatusOpen(this.treeStatus.openIds, node);
      }
    }
    this.treeStatus.id = null;
    if(this.isSingle()){
      if(this.selectedNode){
        this.treeStatus.id = this.selectedNode.id;
      }
    }
    this.treeStatus.status = true;

    if(treeFlush){

    }else{
      this.treeStatus.queryParam = this.treeOpts.queryParam;
      this.getSelectCacheService().setTreeData(this.treeStatus);
    }
    if(callback){
      callback();
    }
  }

  saveTreeStatusOpen(openIds: Array<any>, node){
    if(node.expanded === true){
      openIds.push(node.id);
    }
    if(node.children){
      for(let cnode of node.children){
        this.saveTreeStatusOpen(openIds, cnode);
      }
    }
  }

  //展示树
  queryDataToTreeData(data: any, noclick:boolean){
    this.treeData = [];
    if(data){
      var dataroot = data;
      this.selectedNode = null;
      if(dataroot.length >= 0){
        if(dataroot.length>1){
          dataroot = dataroot[0];
          this.treeData.push(this.dataToNode(dataroot, null ,0));
        }else if(dataroot.length > 0){
          dataroot = dataroot[0];
          this.treeData.push(this.dataToNode(dataroot, null ,0));
        }else{
          return;
        }
      }else{
        this.treeData.push(this.dataToNode(dataroot, null ,0));
      }
      if(this.isSingle()) {
        if (this.selectedNode) {

        } else {
          this.selectedNode = this.treeData[0];
        }
        if (this.treeOpts.nodeSelect && noclick !== true) {
          this.treeOpts.nodeSelect.call(this.treeOpts.that, this.selectedNode);
        }
      }
      this.treeStatus.status = false;
    }
  }
  //展示树-递归
  dataToNode(data, parent, index: number){
    let idname = this.treeOpts.queryResultField[0];
    let pidname = this.treeOpts.queryResultField[1];
    let namename = this.treeOpts.queryResultField[2];
    let childrenname = this.treeOpts.queryResultField[3];
    let treeNode: any;
    treeNode = {};
    treeNode.label = data[namename];
    treeNode.data = data;
    treeNode.id = data[idname]+"";
    treeNode.parentId = data[pidname]+"";
    treeNode.index = index;

    treeNode.parent = parent;
    // treeNode.expandedIcon = "fa-battery-0";
    // treeNode.collapsedIcon = "fa-battery-1";
    if(this.treeStatus.status){
      if(this.findIndex.call(this.treeStatus.openIds, treeNode.id) >= 0) {
        treeNode.expanded = true;
      }else{
        treeNode.expanded = false;
      }
      if(this.isSingle()){
        if(this.treeStatus.id == treeNode.id) {
          this.selectedNode = treeNode;
        }
      }
    }else{
      treeNode.expanded = this.treeOpts.expandedIndex < 0 || treeNode.index <= this.treeOpts.expandedIndex;
    }

    if(data[childrenname] && data[childrenname].length > 0){
      treeNode.children = [];
      for(let childData of data[childrenname]){
        let childNode = this.dataToNode(childData, treeNode, index+1);
        treeNode.children.push(childNode);
      }
    }
    return treeNode;
  }

  //刷新树的checked选择
  updateCheckedToTree(nodeIds){
    this.selectedNodes.splice(0, this.selectedNodes.length);
    this.treeOpts.selectedNodeIds.splice(0, this.treeOpts.selectedNodeIds.length);
    if(!nodeIds){
      nodeIds = [];
    }
    //设置全选和半选状态
    for(let node of this.treeData){
      this.updateCheckedToTreeNode(nodeIds, node);
    }
  }
//刷新树的checked选择-递归
  updateCheckedToTreeNode(nodeIds,node) : number{
    let nodeFlag = 0;//2全选 1半选 0不选
    let isAdd = false;
    if(this.findIndex.call(nodeIds, node.id) >= 0){
      this.treeOpts.selectedNodeIds.push(node.id);
      this.selectedNodes.push(node);
      nodeFlag = 2;
      isAdd = true;
    }
    if(node.children && node.children.length > 0){
      let allFlag = true;
      let halfFlag = false;
      for(let child  of node.children){
        let flag = this.updateCheckedToTreeNode(nodeIds, child);
        if(flag < 2){
          allFlag = false;
        }
        if(flag > 0){
          halfFlag = true;
        }
      }
      //当节点不全选时，才去更新节点状态
      if(nodeFlag < 2){
        if(allFlag){
          nodeFlag = 2;
        }else if(halfFlag){
          nodeFlag = 1;
        }else{
          nodeFlag = 0;
        }
      }
    }
    if(nodeFlag == 2){
      if(!isAdd){
        this.selectedNodes.push(node);
      }
      node.partialSelected = false;
    }else if(nodeFlag == 1){
      node.partialSelected = true;
    }else{
      node.partialSelected = false;
    }
    return nodeFlag;
  }

  findIndex = function(obj) {
    var index = -1;
    let length = this.length;
    for (var i = 0; i < length; i++) {
      if (this[i] == obj) {
        index = i;
        break;
      }
    }
    return index;
  };
















  /****** 以下为事件相关 ******/
  addNode(node){
    this.dialogOpts.add.title = "新增"+this.treeOpts.functionName;
    this.dialogOpts.add.parent = node;
    this.dialogOpts.add.addNodes = [{name:''}];
    this.dialogOpts.add.visible = true;
  }

  editNode(node){
    this.dialogOpts.edit.title = "修改"+this.treeOpts.functionName;
    this.dialogOpts.edit.parent = {id:'', label: '无'};
    if(node.parent){
      this.dialogOpts.edit.parent.label = node.parent.label;
      this.dialogOpts.edit.parent.id = node.parent.id;
    }
    //重新赋值,否则影响树的显示
    this.dialogOpts.edit.editNode = {id: node.id, name: node.label};
    this.dialogOpts.edit.visible = true;
  }

  deleteNode(node){
    this.dialogOpts.delete.title = "删除"+this.treeOpts.functionName;
    this.dialogOpts.delete.deleteNode = node;
    this.dialogOpts.delete.visible = true;
  }

  addNodeOk(){
    //checkparams
    var body = {
      parentId : this.dialogOpts.add.parent.id,
      names:[]
    };
    for(let node of this.dialogOpts.add.addNodes){
      body.names.push(node.name);
    }
    var that = this;
    that._HttpClient.post_old(this.treeOpts.operButton.add.queryUrl, body, '', data => {
      //tip
    });
  }

  editNodeOk(){
    //checkparams
    var body = {
      parentId : this.dialogOpts.edit.parent.id,
      name:this.dialogOpts.edit.editNode.name,
      id: this.dialogOpts.edit.editNode.id
    };
    var that = this;
    that._HttpClient.post_old(this.treeOpts.operButton.edit.queryUrl, body, '', data => {
      //tip
    });
  }

  deleteNodeOk(){
    //checkparams
    var queryParam = {
      id: this.dialogOpts.delete.deleteNode.id
    };
    var that = this;
    that._HttpClient.get_old(this.treeOpts.operButton.delete.queryUrl, queryParam, data => {
      //tip
    });
  }


  public isSingle(){
    return this.treeOpts.treeType == 'single';
  }
  public hasOperButton(){
    let count = 0;
    for(let p in this.treeOpts.operButton){
      count ++;
    }
    return count > 0;
  }

  onAddNode(){
    if(!this.selectedNode){
      return false;
    }
    if(this.treeOpts.operButton.add.callback){
      this.treeOpts.operButton.add.callback.call(this.treeOpts.that , this.selectedNode);
    }else{
      this.addNode(this.selectedNode);
    }
  }
  onEditNode(){
    if(!this.selectedNode){
      return false;
    }
    if(this.treeOpts.operButton.edit.callback){
      this.treeOpts.operButton.edit.callback.call(this.treeOpts.that , this.selectedNode);
    }else{
      this.editNode(this.selectedNode);
    }
  }
  onDeleteNode(){
    if(!this.selectedNode){
      return false;
    }
    if(this.treeOpts.operButton.delete.callback){
      this.treeOpts.operButton.delete.callback.call(this.treeOpts.that , this.selectedNode);
    }else{
      this.deleteNode(this.selectedNode);
    }
  }

  onUpDown(isUp: boolean){
    let button = this.treeOpts.operButton[isUp?'up':'down'];
    let nodes: Array<any>;
    let node = this.selectedNode;
    if(!node.parent){
      nodes = this.treeData;
    }else{
      nodes = node.parent.children;
    }
    if((isUp && node.id == nodes[0].id) || (!isUp && node.id == nodes[nodes.length-1].id)){
      //不需要移动
      return true;
    }
    var queryParam = {
      id: this.selectedNode.id,
      up: isUp
    };
    queryParam = Object.assign({}, button.queryParam, queryParam);
    var that = this;
    that._HttpClient.get(button.queryUrl, queryParam, data => {
      this.tipMessage((isUp?"上移":"下移") + "成功！");
      this.moveNodeUpDown(this.selectedNode, isUp);
    });
  }

  moveNodeUpDown(node, isUp){
    let nodes: Array<any>;
    if(!node.parent){
      nodes = this.treeData;
    }else{
      nodes = node.parent.children;
    }
    let index = 0;
    for(let i=0;i<nodes.length;i++){
      if(nodes[i].id == node.id){
        index = i;
        break;
      }
    }
    if((isUp && index==0) || ( !isUp &&  index== (nodes.length-1) )){
      //不需要移动
      return true;
    }
    if(isUp) {
       let nodes2 = nodes.splice(index-1,1);
        nodes.splice(index,0, nodes2[0]);
    }else{
      let nodes2 = nodes.splice(index + 1,1);
      nodes.splice(index,0, nodes2[0]);
    }
  }

  onNodeSelect(event){
    if(this.isSingle()) {
      if(this.treeOpts.nodeSelect){
        this.treeOpts.nodeSelect.call(this.treeOpts.that ,this.selectedNode);
      }
      return;
    }
    this.treeOpts.selectedNodeIds.splice(0 , this.treeOpts.selectedNodeIds.length);
    for(let node of this.selectedNodes){
      if(node.children && node.children.length>0) continue;//非叶子节点不保存
      this.treeOpts.selectedNodeIds.push(node.id);
    }
    //console.log("node sel",this.treeOpts.selectedNodeIds,event.node);
  }

  onNodeUnSelect(event){
    if(this.isSingle()) {
      return;
    }
    this.treeOpts.selectedNodeIds.splice(0 , this.treeOpts.selectedNodeIds.length);
    for(let node of this.selectedNodes){
      if(node.children && node.children.length>0) continue;//非叶子节点不保存
      this.treeOpts.selectedNodeIds.push(node.id);
    }
    //console.log("node unsel",this.treeOpts.selectedNodeIds);
  }

  onCheckDisabled(type): boolean{
    if(!this.selectedNode){
      return true;
    }
    let param = this.treeOpts.operButton[type];
    if(param.disabled){
      return param.disabled.call(this.treeOpts.that, this.selectedNode);
    }
    //moredisabled函数
    let nodeIndex = this.selectedNode.index;
    if(type == 'add'){
      if(this.selectedNode.index >= 2){
        return true;
      }
      return false;
    }else if(type == 'edit'){
      if(this.selectedNode.index == 0){
        return true;
      }
      return false;
    }else if(type == 'delete'){
      if(this.selectedNode.index <= 1){
        return true;
      }
      return false;
    }else if(type == 'up'|| type == 'down'){
      if(this.selectedNode.index == 0){
        return true;
      }
      return false;
    }
    return true;
  }

  addNodeSubset(i) {
    this._addDataRow(i, this.dialogOpts.add.addNodes, {name: '' }, 8);
  }

  removeNodeSubset(i: number) {
    this._removeDataRow(i, this.dialogOpts.add.addNodes);
  }

  call(methodName: string, arg0?: any, arg1?: any, arg2?: any): any{
    if(!this.treeOpts[methodName]){
      return false;
    }

    var that = this;
    for(let f of this.treeOptsFields){
      if(f == methodName){
        that = this.treeOpts.that;
        break;
      }
    }
    this.treeOpts[methodName].call(that, arg0, arg1, arg2);
  }
}
