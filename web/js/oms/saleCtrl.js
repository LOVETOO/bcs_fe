var fileControllers = angular.module('inspinia');


function salepiheaderController($scope,notify,BasemanService){
	
	if(BasemanService._loadStorage("sale_pi_header")){
		$scope.sale_pi_header = JSON.parse(BasemanService._loadStorage("sale_pi_header"));
	}else{
		$scope.sale_pi_header = {};
	}
	BasemanService.pageInit($scope);
	
	$scope.stats = [{id:"1",value:"制单"},
	                {id:"2",value:"提交"},
	                {id:"3",value:"启动"},
	                {id:"4",value:"驳回"},
	                {id:"5",value:"审核"},
	                {id:"10",value:"红冲"},
	                {id:"99",value:"关闭"}];
	
	$scope.search = function(){
		var sqlWhere = BasemanService.getSqlWhere([],$scope.searchtext);
		var postdata={sqlwhere: sqlWhere};
		var promise = BasemanService.RequestPost("sale_pi_header","search",postdata);
        promise.then(function(data){
			$scope.sale_pi_header.sale_pi_headers =data.sale_pi_headers;
			var pageInfoStr = "";
			if(!data.pagination){
				var cn = data.sale_pi_headers.length;
				var pc = Math.ceil(cn/$scope.pageSize);
				var pageInfoStr = "pn="+$scope.currentPage+",ps="+$scope.pageSize+",pc="+pc+",cn="+cn+",ci=0";
				BasemanService.pageInfoOp($scope,pageInfoStr);
			}else{
				BasemanService.pageInfoOp($scope,data.pagination);
			}
			
        });
	}
	
	$scope.so_delete = function(index){
		var  postdata={
				supplier_id:$scope.sale_pi_header.sale_pi_headers[index].pi_id
		    };
			var promise = BasemanService.RequestPost("sale_pi_header","delete",postdata);
	        promise.then(function(data){
	        	BasemanService.notify(notify,"删除成功!","alert-info",1000);
				$scope.seaport.seaports.splice(index, 1);
				BasemanService.reloadFootable();
	        });
	}
	
	$scope.edit = function(index,event){
		BasemanService.setEditObj({key:"sale_pi_header",value:$scope.sale_pi_header.sale_pi_headers[index].pi_id});
		BasemanService._saveStorage("sale_pi_header",JSON.stringify($scope.sale_pi_header));
		$(event.currentTarget).closest(".ibox-content").siblings(".ibox-title")
		.find("a[ui-sref='gallery.sale_pi_header_edit']").trigger("click");
	}
	
}


function salepiheaderEditController($modal,$scope,notify,$timeout,$location,BasemanService){
	
	//如果是编辑
	$scope.isEdit = false;
	$scope.EditStr = "新增";
	$scope.objattachs = [];
	var editObj = BasemanService.getEditObj();
	
	$scope.sale_pi_header = {};
	
	if(editObj.key == "sale_pi_header"){
		$scope.isEdit = true;
		$scope.EditStr = "编辑";
		var promise = BasemanService.RequestPost("sale_pi_header","select",{pi_id:editObj.value});
        promise.then(function(data){
        	$timeout(function(){
//        		$scope.sale_pi_header = data;
        		$scope.sale_pi_header = HczyCommon.numPropToString(data);
        		//流程控制
//        		if(Number(data.wfid)>0){
//        			$scope.getwfDetail(data.wfid);
//        		}
        			
        	});
        	
        	$scope.objattachs = data.objattachs;
        },function(data){
        	$scope.isEdit = false;
    		$scope.EditStr = "新增";
        });
		
		BasemanService.setEditObj({key:"",value:""});
		
		//初始化查询
		var promise = BasemanService.RequestPost("base_search","searchinit",{});
		promise.then(function(data){
			$scope.basedata = data;
		});
		
		}else{
		
		$scope.sale_pi_header.pi_date = new Date();
		
		$scope.sale_pi_header.sale_pi_item_lineofsale_pi_headers = new Array();
		$scope.sale_pi_header.sale_pi_box_lineofsale_pi_headers = new Array();
		$scope.sale_pi_header.sale_pi_item_confofsale_pi_headers = new Array();
		$scope.sale_pi_header.sale_pi_analyofsale_pi_headers = new Array();
		$scope.sale_pi_header.objattachs = new Array();
		$scope.sale_pi_header.creator = window.strUserId;
		//初始化查询
		var promise = BasemanService.RequestPost("base_search","searchinit",{});
		promise.then(function(data){
			$scope.basedata = data;
			//默认值
			if(!$scope.isEdit){
				$scope.sale_pi_header.sale_org_id = data.dict_sale_orgs[0].dictvalue;
				$scope.sale_pi_header.sale_org_name = data.dict_sale_orgs[0].dictname;
				$scope.sale_pi_header.payment_type_id = data.payment_types[0].payment_type_id;
				$scope.sale_pi_header.order_type_id = data.sale_order_types[0].order_type_id;
				$scope.sale_pi_header.ship_type = data.dict_ship_types[0].dictvalue;
				for(var i = 0; i<data.base_currencys.length; i++){
					if(data.base_currencys[i].currency_name == "美元"){
						$scope.sale_pi_header.currency_id = data.base_currencys[i].currency_id;
						$scope.sale_pi_header.currency_code = data.base_currencys[i].currency_code;
						$scope.sale_pi_header.currency_name = data.base_currencys[i].currency_name;
					}
				}
				
			}
		});
	}
	$scope.options = {
    	    editable: true,
    	    enableAddRow: true,
    	    enableCellNavigation: true,
    	    asyncEditorLoading: false,
    	    autoEdit: false
    	  };
	function requiredFieldValidator(value) {
	    if (value == null || value == undefined || !value.length) {
	      return {valid: false, msg: "This is a required field"};
	    } else {
	      return {valid: true, msg: null};
	    }
	  }
	$scope.columns = [
	        	    {id: "title", name: "柜型", field: "box_type", width: 120, cssClass: "cell-title", editor: Slick.Editors.Text, validator: requiredFieldValidator},
	        	    {id: "desc", name: "柜数", field: "box_qty", width: 100, editor: Slick.Editors.LongText},
	        	    {id: "duration", name: "到货港", field: "box_line_name", editor: Slick.Editors.Text},
	        	    {id: "%", name: "单柜海运费", field: "amt_fee1", width: 80, resizable: false, formatter: Slick.Formatters.PercentCompleteBar, editor: Slick.Editors.PercentComplete},
	        	    {id: "start", name: "单柜保险费", field: "amt_fee2", minWidth: 60, editor: Slick.Editors.Date},
	        	    {id: "finish", name: "备注", field: "note", minWidth: 60, editor: Slick.Editors.Text},
	        	  ];
	var data = [];
	for (var i = 0; i < 10; i++) {
	      var d = (data[i] = {});

	      d["box_type"] = "Task " + i;
	      d["box_qty"] = "This is a sample task description.\n  It can be multiline";
	      d["box_line_name"] = "5 days";
	      d["amt_fee1"] = Math.round(Math.random() * 100);
	      d["amt_fee2"] = "01/01/2009";
	      d["note"] = "01/05/2009";
	    }
	
	$scope.data = data;
	$scope.columns = [{id: "box_type", name: "柜型", field: "box_type",width: 120, cssClass: "cell-title", editor: Slick.Editors.Text},
					    {id: "box_qty", name: "柜数", field: "box_qty",width: 120, cssClass: "cell-title", editor: Slick.Editors.Text},
					    {id: "box_line_name", name: "到货港", field: "box_line_name", selectable: false,width: 120, cssClass: "cell-title", editor: Slick.Editors.Text},
					    {id: "amt_fee1", name: "单柜海运费", field: "amt_fee1",width: 120, cssClass: "cell-title", editor: Slick.Editors.Text},
					    {id: "amt_fee2", name: "单柜保险费", field: "amt_fee2",width: 120, cssClass: "cell-title", editor: Slick.Editors.Text},
					    {id: "note", name: "备注", field: "note",width: 120, cssClass: "cell-title", editor: Slick.Editors.Text},
					  ];
	$scope.sale_pi_header.sale_pi_box_lineofsale_pi_headers = data;
	$scope.alert = function (){
		alert($scope.data.length);
	}
	var oneObj = {};
	oneObj.box_type = '20G';
	oneObj.box_qty = '200';
	oneObj.box_line_name = 'HKNN';
	oneObj.amt_fee1 = '100';
	oneObj.amt_fee2 = '100';
	oneObj.note = 'Note';
	oneObj.oprations = 'OP';
	if(!$scope.sale_pi_header.sale_pi_item_confofsale_pi_headers){
		$scope.sale_pi_header.sale_pi_item_confofsale_pi_headers = [];
		$scope.sale_pi_header.sale_pi_item_confofsale_pi_headers.push(oneObj);
	}
	
	$scope.currency_change = function(){
		for(var i=0; i<$scope.basedata.base_currencys.length; i++){
			if($scope.basedata.base_currencys[i].currency_id == $scope.sale_pi_header.currency_id){
				$scope.sale_pi_header.currency_code = $scope.basedata.base_currencys[i].currency_code;
				$scope.sale_pi_header.currency_name = $scope.basedata.base_currencys[i].currency_name;
			}
		}
	}
	$scope.editSaliPiItemLine = function(index){
		$scope.isLineEdit = true;
		$scope.EditObj = $scope.sale_pi_header.sale_pi_item_lineofsale_pi_headers[index];
		BasemanService.openFrm("views/popview/Pop_ProItemHeader.html",PopSalePiItemLineController,$scope,"","lg")
		.result.then(function (result){
			$scope.sale_pi_header.sale_pi_item_lineofsale_pi_headers[index] = result;
		});
		
	}
	
	//明细操作sale_pi_item_lineofsale_pi_headers
	$scope.addProItem = function (){
		var newObj = {id:$scope.sale_pi_header.sale_pi_item_lineofsale_pi_headers.length +1};
		$scope.sale_pi_header.sale_pi_item_lineofsale_pi_headers.push(newObj);
	}
	$scope.removeProItem = function (index){
		$scope.sale_pi_header.sale_pi_item_lineofsale_pi_headers.splice(index,1);
	}
	//柜型柜量sale_pi_box_lineofsale_pi_headers
	$scope.addPiBox = function(){
		var newObj = {id:$scope.sale_pi_header.sale_pi_box_lineofsale_pi_headers.length +1};
		$scope.sale_pi_header.sale_pi_box_lineofsale_pi_headers.push(newObj);
	}
	$scope.removePiBox = function(index){
		$scope.sale_pi_header.sale_pi_box_lineofsale_pi_headers.splice(index);
	}
	//选配清单sale_pi_item_confofsale_pi_headers
	$scope.addPiConf = function(){
		var newObj = {id:$scope.sale_pi_header.sale_pi_item_confofsale_pi_headers.length +1};
		$scope.sale_pi_header.sale_pi_item_confofsale_pi_headers.push(newObj);
	}
	$scope.removePiConf = function(index){
		$scope.sale_pi_header.sale_pi_item_confofsale_pi_headers.splice(index);
	}
	
	//营业分析sale_pi_analyofsale_pi_headers、sale_pi_feeofsale_pi_headers
	$scope.addPiAnaly = function(){
		var newObj = {id:$scope.sale_pi_header.sale_pi_analyofsale_pi_headers.length +1};
		$scope.sale_pi_header.sale_pi_analyofsale_pi_headers.push(newObj);
	}
	$scope.removePiAnaly = function(index){
		$scope.sale_pi_header.sale_pi_analyofsale_pi_headers.splice(index);
	}
	//产品明细
	$scope.openProItem = function(){
		BasemanService.openFrm("views/popview/Pop_ProItemHeader.html",PopSalePiItemLineController,$scope,"","lg")
		.result.then(function (result){
			result.item_line_id = "";
			$scope.sale_pi_header.sale_pi_item_lineofsale_pi_headers.push(result);
		});
	}
	
	
	//业务员弹窗
	$scope.openSalesUserFrm = function (){
		var FrmInfo = {};
		FrmInfo.title = "查询业务员"; 
		FrmInfo.thead = [{name:"业务员ID",code:"userid"},
		                 {name:"业务员名称",code:"username"}];
		BasemanService.openCommonFrm(PopUserController,$scope,FrmInfo)
		.result.then(function (result) {
			$scope.sale_pi_header.sales_user_id = result.userid;
			$scope.sale_pi_header.sales_user_name = result.username;
		});
	}
	//销售部门弹窗
	$scope.openSalesPartFrm = function (){
		var FrmInfo = {};
		FrmInfo.title = "销售部门查询"; 
		FrmInfo.thead = [{name:"部门编码",code:"org_code"},
		                 {name:"部门名称",code:"org_name"}];
		BasemanService.openCommonFrm(PopOrgController,$scope,FrmInfo)
		.result.then(function (result) {
			$scope.sale_pi_header.org_id = result.org_id;
			$scope.sale_pi_header.org_code = result.org_code;
			$scope.sale_pi_header.org_name = result.org_name;
		});
	}
	//客户弹窗
	$scope.openCustFrm = function (){
		var FrmInfo = {};
		FrmInfo.title = "客户查询"; 
		FrmInfo.thead = [{name:"客户编码",code:"cust_code"},
		                 {name:"客户名称",code:"cust_name"}];
		BasemanService.openCommonFrm(PopCustController,$scope,FrmInfo)
		.result.then(function (result) {
			$scope.sale_pi_header.cust_id = result.cust_id;
			$scope.sale_pi_header.cust_code = result.cust_code;
			$scope.sale_pi_header.cust_name = result.cust_name;
		});
	}
	//进港口港口弹窗
	$scope.openSeaPortInFrm = function (){
		var FrmInfo = {};
		FrmInfo.title = "港口查询"; 
		FrmInfo.thead = [{name:"港口名称",code:"seaport_name"},
		                 {name:"港口类型",code:"seaport_type"}];
		BasemanService.openCommonFrm(PopSeaPortController,$scope,FrmInfo)
		.result.then(function (result) {
			$scope.sale_pi_header.seaport_in_id = result.seaport_id;
			$scope.sale_pi_header.seaport_in_name = result.seaport_name;
			$scope.sale_pi_header.seaport_in_type = result.seaport_type;
		});
	}
	//出港口弹窗
	$scope.openSeaPortOutFrm = function (){
		var FrmInfo = {};
		FrmInfo.title = "港口查询"; 
		FrmInfo.thead = [{name:"港口名称",code:"seaport_name"},
		                 {name:"港口类型",code:"seaport_type"}];
		BasemanService.openCommonFrm(PopSeaPortController,$scope,FrmInfo)
		.result.then(function (result) {
			$scope.sale_pi_header.seaport_out_id = result.seaport_id;
			$scope.sale_pi_header.seaport_out_name = result.seaport_name;
			$scope.sale_pi_header.seaport_out_type = result.seaport_type;
		});
	}
	//柜型桂量到港口弹窗
	$scope.openBoxLineSeaPortFrm = function (index){
		var FrmInfo = {};
		FrmInfo.title = "港口查询"; 
		FrmInfo.thead = [{name:"港口名称",code:"seaport_name"},
		                 {name:"港口类型",code:"seaport_type"}];
		BasemanService.openCommonFrm(PopSeaPortController,$scope,FrmInfo)
		.result.then(function (result) {
			$scope.sale_pi_header.sale_pi_box_lineofsale_pi_headers[index].seaport_in_id = result.seaport_id;
			$scope.sale_pi_header.sale_pi_box_lineofsale_pi_headers[index].seaport_in_name = result.seaport_name;
//			$scope.sale_pi_header.sale_pi_box_lineofsale_pi_headers[index].box_type = result.seaport_type;
		});
	}
	//基准机型
	$scope.openProItemFrm = function(){
		var FrmInfo = {};
		FrmInfo.title = "基准机型"; 
		FrmInfo.thead = [{name:"整机编码",code:"item_h_code"},
		                 {name:"整机名称",code:"item_h_name"}];
		BasemanService.openCommonFrm(PopItemController,$scope,FrmInfo)
		.result.then(function (result) {
//			$scope.sale_pricelist.item_id = result.item_h_id;
//			$scope.sale_pricelist.item_code = result.item_h_code;
//			$scope.sale_pricelist.item_name = result.item_h_name;
		});
	}
	//配件
	$scope.openLinePartFrm = function(){
		var FrmInfo = {};
		FrmInfo.title = "备件查询"; 
		FrmInfo.thead = [{name:"备件编码",code:"item_h_code"},
		                 {name:"备件名称",code:"item_h_name"}];
		
		BasemanService.openCommonFrm(PopPartController,$scope,FrmInfo)
		.result.then(function (result) {
//			$scope.proitem.pro_item_line_partofpro_item_headers[$index]
//			.css_item_code = result.item_h_code;
//			$scope.proitem.pro_item_line_partofpro_item_headers[$index]
//			.css_item_name = result.item_h_name;
		});
	}
	//移除附件
	$scope.removeAttach = function(index){
		
	}
	//流程处理
	
	$scope.iswfshow = function(wfid){
		return Number(wfid)>0;
	}
	$scope.wfdetail = function(wfid){
		$('.wf_detail').toggleClass('hide');
		if($('.wf_detail').attr("selected"))return;
		var postdata = {wfid:wfid};
		BasemanService.RequestPost("base_wf","select",postdata)
		.then(function(data){
			$scope.wfprocusers = data.wfprocusers;
			$scope.wfprocs = data.wfprocs;
			$('.wf_detail').attr("selected","true");
		},function(data){
			
		})
	}
	
	$scope.getwfDetail = function(wfid){
		var postdata = {wfid:wfid};
		BasemanService.RequestPost("base_wf","select",postdata)
		.then(function(data){
			$scope.wfinfo = data;
		})
	}
	
	$scope.wfstart = function(){
		BasemanService.openFrm("views/popview/wf_option.html",PopWFOptionController,$scope,"","sm")
		.result.then(function (result){
			//返回即提交
			var  postdata={
					opinion: result.opinion, 
					pi_id:$scope.sale_pi_header.pi_id, //单据ID
					wfid:$scope.sale_pi_header.wfid  // 流程ID
					};
			BasemanService.RequestPost("base_wf","wfsubmit",postdata)
			.then(function(){
				alert("成功");
			},function(){
				
			})
		});
	}
	
	$scope.wfsubmit = function(){//通过流程
		BasemanService.openFrm("views/popview/wf_option.html",PopWFOptionController,$scope,"","sm")
		.result.then(function (result){
			//返回即提交
			var  postdata={
					opinion: result.opinion, 
					pi_id:x_objid, //单据ID
					wfid:$scope.sale_pi_header.wfid  // 流程ID
					};
			BasemanService.RequestPost("base_wf","wfsubmit",postdata)
			.then(function(){
				alert("成功");
			},function(){
				
			})
		});
	}
	$scope.wfreject = function(){//流程驳回
		BasemanService.openFrm("views/popview/wf_option.html",PopWFOptionController,$scope,"","sm")
		.result.then(function (result){
			//返回即提交
			var  postdata={
					opinion: result.opinion, 
					pi_id:x_objid, //单据ID
					wfid:x_wfid  // 流程ID
					};
			BasemanService.RequestPost("base_wf","wfsubmit",postdata)
			.then(function(){
				alert("驳回");
			},function(){
				
			})
		});
	}
	$scope.wfbreak = function(){//流程中断
		//返回即提交
		var  postdata={
				opinion: result.opinion, 
				pi_id:x_objid, //单据ID
				wfid:x_wfid  // 流程ID
				};
		BasemanService.RequestPost("base_wf","wfbreak",postdata)
		.then(function(){
			alert("中断");
		})
	}
	
	$scope.openHistoryOrder = function(){
		BasemanService.openFrm("views/popview/Pop_HistoryOrder.html",PopHistoryOrderController,$scope,"","lg")
		.result.then(function (items){
			if(items.length > 0){
				for(var i=0;i<items.length;i++){
					items[i].source_line_id =  items[i].item_line_id;
					items[i].source_id =  items[i].pi_id;
					
					items[i].item_line_id = "";//防止外键关联
					$scope.sale_pi_header.sale_pi_item_lineofsale_pi_headers.push(items[i]);
				}
			}
		});
	}
	
	$scope.exportExl = function(){
		if(!$scope.sale_pi_header.pi_id){
			BasemanService.notify(notify,"请先保存单据","alert-info");
			return; 
		}
		BasemanService.RequestPost("sale_pi_header","exporttoexcel",{'pi_id':$scope.sale_pi_header.pi_id})
		.then(function(data){
			if(data.docid != undefined && Number(data.docid) != 0){
				var fileurl='/downloadfile.do?docid='+data.docid+'&loginguid='+window.strLoginGuid+'&t='+new Date().getTime();
				window.open(fileurl,'_blank','height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
			}else{
				BasemanService.notify(notify,"导出失败!","alert-info",1000);
			}
		});
	}
	$scope.exportExl2 = function(){
		if(!$scope.sale_pi_header.pi_id){
			BasemanService.notify(notify,"请先保存单据","alert-info");
			return; 
		}
		BasemanService.RequestPost("sale_pi_header","exporttoexcel1",{'pi_id':$scope.sale_pi_header.pi_id})
		.then(function(data){
			if(data.docid != undefined && Number(data.docid) != 0){
				var fileurl='/downloadfile.do?docid='+data.docid+'&loginguid='+window.strLoginGuid+'&t='+new Date().getTime();
				window.open(fileurl,'_blank','height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
			}else{
				BasemanService.notify(notify,"导出失败!","alert-info",1000);
			}
		});
	}
	
	//保存更新
	$scope.save = function(){
		if($scope.isEdit){
			var promise = BasemanService.RequestPost("sale_pi_header","update",$scope.sale_pi_header);
	        promise.then(function(data){
	        	BasemanService.notify(notify,"更新成功!","alert-info",1000);
	        	$scope.sale_pi_header = HczyCommon.numPropToString(data);
	        });
		}else{
			var promise = BasemanService.RequestPost("sale_pi_header","insert",$scope.sale_pi_header);
	        promise.then(function(data){
	        	BasemanService.notify(notify,"保存成功!","alert-info",1000);
	        	$scope.isEdit = true;
        		$scope.sale_pi_header = HczyCommon.numPropToString(data);
//	        	$scope.sale_pi_header = data;
	        	$scope.isEditStr = "编辑";
	        });
		}
	}
	
	//关闭了当前页
	$scope.closebox = function(){
		$location.path("/gallery/sale_pi_header1");
	}
}

function PrintTemplateController($scope,BasemanService){
	BasemanService.pageInit($scope);
	
	$scope.search = function(){
		BasemanService.RequestPost("base_print_templet","search",{})
		.then(function(data){
			$scope.base_print_templets = data.base_print_templets;
		});
	}
	
	$scope.so_delete = function(index){
		var  postdata={
				templet_id:$scope.base_print_templets[index].templet_id
		    };
		BasemanService.RequestPost("base_print_templet","delete",postdata)
		.then(function(data){
			$scope.base_print_templets.splice(index,1);
		});
	}
	
	//跳转编辑
	$scope.edit = function(index,event){
		BasemanService.setEditObj({key:"base_print_templet",value:$scope.base_print_templets[index].templet_id});
		$(event.currentTarget).closest(".ibox-content").siblings(".ibox-title")
		.find("a[ui-sref='gallery.printTemplateEdit']").trigger("click");
		
	}
	
}

function PrintTemplateEditController($timeout,$location,$scope,notify,BasemanService){
	$scope.printtpl = {};
	$scope.objattachs = [];
	
	//如果是编辑
	$scope.isEdit = false;
	var editObj = BasemanService.getEditObj();
	if(editObj.key == "base_print_templet"){
		$scope.isEdit = true;
		$scope.EditStr = "编辑";
		BasemanService.RequestPost("base_print_templet","select",{templet_id:editObj.value})
        .then(function(data){
        	$scope.printtpl = data;
        	$scope.objattachs = data.objattachs;
        });
		
        BasemanService.setEditObj({key:"",value:""})
	}else{
		$scope.printtpl.create_time = new Date();
		$timeout(function(){
			$scope.printtpl.creator = window.strUserId;
		},1000);
		
	}
	
	$scope.createNew = function(){
		$scope.printtpl = {};
	}
	
	$scope.exportExl = function(){
		BasemanService.RequestPost("base_print_templet","exporttoexcel",{templet_id:$scope.printtpl.templet_id})
		.then(function(data){
			alert(data.docid);
		});
	}
	
	$scope.save = function(){
		if(!$scope.printtpl.templet_code && !$scope.printtpl.templet_name){
			alert("必填项不能为空!");
			return;
		}
		
		$scope.printtpl.objattachs = $scope.objattachs;
		
		if($scope.isEdit){
			BasemanService.RequestPost("base_print_templet","update",$scope.printtpl)
			.then(function(data){
				BasemanService.notify(notify,"更新成功！","alert-info");
			});
		}else{
			BasemanService.RequestPost("base_print_templet","insert",$scope.printtpl)
			.then(function(data){
				$scope.printtpl = data;
				$scope.isEdit = true;
				BasemanService.notify(notify,"保存成功！","alert-info");
			});
		}
	}
	
	//关闭了当前页
	$scope.closebox = function(){
		$location.path("/gallery/printTemplate");
	}
}

function saleProdHeaderPlanController($scope,BasemanService,notify){
	
	//基础数据
	$scope.baseinfo = BasemanService._loadStorageObj("oms_baseinfo");
	
	$scope.sale_pi_plan = {};
	//销售部门
	$scope.openSaleOrgFrm = function(){
		//销售部门弹窗
		var FrmInfo = {};
		FrmInfo.title = "销售部门查询"; 
		FrmInfo.thead = [{name:"部门编码",code:"org_code"},
		                 {name:"部门名称",code:"org_name"}];
		BasemanService.openCommonFrm(PopOrgController,$scope,FrmInfo)
		.result.then(function (result) {
			$scope.sale_pi_plan.org_id = result.org_id;
			$scope.sale_pi_plan.org_name = result.org_name;
		});
	}
	//客户
	$scope.openCustFrm = function(){
		//客户弹窗
		var FrmInfo = {};
		FrmInfo.title = "客户查询"; 
		FrmInfo.thead = [{name:"客户编码",code:"cust_code"},
		                 {name:"客户名称",code:"cust_name"}];
		BasemanService.openCommonFrm(PopCustController,$scope,FrmInfo)
		.result.then(function (result) {
			$scope.sale_pi_plan.cust_id = result.cust_id;
			$scope.sale_pi_plan.cust_code = result.cust_code;
			$scope.sale_pi_plan.cust_name = result.cust_name;
		});
	}
	//发货港
	$scope.openOutSeaPort = function(){
		var FrmInfo = {};
		FrmInfo.title = "港口查询"; 
		FrmInfo.thead = [{name:"港口名称",code:"seaport_name"},
		                 {name:"港口类型",code:"seaport_type"}];
		BasemanService.openCommonFrm(PopSeaPortController,$scope,FrmInfo)
		.result.then(function (result) {
			$scope.sale_pi_plan.seaport_out_id = result.seaport_id;
			$scope.sale_pi_plan.seaport_out_name = result.seaport_name;
			$scope.sale_pi_plan.seaport_out_type = result.seaport_type;
		});
	}
	//目的港
	$scope.openInSeaPort = function(){
		var FrmInfo = {};
		FrmInfo.title = "港口查询"; 
		FrmInfo.thead = [{name:"港口名称",code:"seaport_name"},
		                 {name:"港口类型",code:"seaport_type"}];
		BasemanService.openCommonFrm(PopSeaPortController,$scope,FrmInfo)
		.result.then(function (result) {
			$scope.sale_pi_plan.seaport_in_id = result.seaport_id;
			$scope.sale_pi_plan.seaport_in_name = result.seaport_name;
			$scope.sale_pi_plan.seaport_in_type = result.seaport_type;
		});
	}
	
	//搜索
	$scope.search = function(){
		
		$scope.sale_pi_plan.flag = 2;
		
		var promise = BasemanService.RequestPost("sale_prod_header","search",$scope.sale_pi_plan);
		promise.then(function(data){
			$scope.sale_prod_headers = data.sale_prod_headers;
		});
	}
	$scope.indexs = [];
	$scope.trselect = function(index,event){
		var checkbox = $(event.currentTarget).find("input[name='checkbox']")[0];
    	if($(event.currentTarget).hasClass("info")){
    		$(event.currentTarget).removeClass("info")
    		if(checkbox.checked){
    			checkbox.checked=false;
            }
    		for(var i = 0 ;i<$scope.indexs.length;i++){
    			if($scope.indexs[i] == index){
    				$scope.indexs.splice(i,1);
    			}
    		}
    		
    	}else{
    		$(event.currentTarget).addClass("info")
    		if(!checkbox.checked){
    			checkbox.checked=true;
            }
    		$scope.indexs.push(index);
    	}
	}
	
	//拆分
	$scope.openSpliceProd = function(){
		if($scope.indexs.length != 1 ){
			BasemanService.notify(notify,"请选择一条内容进行拆分!","alert-info");
			//alert("请选择一条内容进行拆分!");
			return;
		}
		BasemanService.openFrm("views/popview/Pop_SplicePlan.html",PopSaleProdSpliceLineController,$scope)
		.result.then(function (result){
			var index = $scope.indexs[0];
			
			$scope.sale_prod_headers[index].splitqty = result.splice_num;
			$scope.sale_prod_headers[index].splitdelivery_date = result.splice_date;
			
			BasemanService.RequestPost("sale_prod_header","split",$scope.sale_prod_headers[index])
			.then(function(data){
				$scope.indexs = [];
				$scope.search();
			},function(){
				$scope.indexs = [];
			});
		});
	}
	//合并
	$scope.combineProd = function(){
		
		if($scope.indexs.length < 2 ){
			BasemanService.notify(notify,"请选择两条或以上记录进行合并!","alert-info");
			//alert("请选择两条或以上记录进行合并!");
			return;
		}
		var indexs = [];
		var seqs = [];
		for(var i =0;i<$scope.indexs.length;i++){
			indexs.push($scope.sale_prod_headers[$scope.indexs[i]].prod_no);
			seqs.push($scope.sale_prod_headers[$scope.indexs[i]].prod_line_id);
		}
		
		var stat = true;
		var i = indexs.length;
		while (i > 0) {
	        for (j = 0; j < i - 1; j++) {
	            if (indexs[j] != indexs[j + 1]) {
	            	stat = false;break;
	            }
	        }
	        i--;
	    }
		if(!stat){
			BasemanService.notify(notify,"不同单号无法合并！","alert-info");
			return;
		}
		var seqStr = "";
		for(var i =0;i<seqs.length;i++){
			seqStr += seqs[i] + ",";
		}
		seqStr = seqStr.substring(0, seqStr.length-1);
		var postdata = {prod_no:indexs[0],seqs:seqStr};
		BasemanService.RequestPost("sale_prod_header","merge",postdata)
		.then(function(data){
			$scope.indexs = [];
			$scope.search();
		},function(){
			$scope.indexs = [];
		});
		
	}
	//出货预告
	$scope.previewProd = function(){
		
	}
	
}
/**
 * 落货纸
 * @param $scope
 * @param BasemanService
 */
function salewarnheaderController($scope,BasemanService,notify){
	$scope.sale_warn_header = {};
	
	$scope.create_warn = function(){
		if($scope.boxlines.length <=0 ){
			BasemanService.notify(notify,"未有装柜内容！","alert-info",2000);
			return;
		}
//		else if($scope.boxlines[0].virtual_box == undefined){
//			BasemanService.notify(notify,"柜型虚拟柜号未生成！","alert-info",2000);
//			return;
//		}
		var postdata = {sale_prod_header:$scope.boxlines};
		BasemanService.RequestPost("sale_prod_header","create_warn",postdata)
		.then(function(data){
			alert("已生成落货纸");
		},function(data){
			
		});
	}
	
	//销售部门
	$scope.openSalesPartFrm = function (){
		var FrmInfo = {};
		FrmInfo.title = "销售部门查询"; 
		FrmInfo.thead = [{name:"部门编码",code:"org_code"},
		                 {name:"部门名称",code:"org_name"}];
		BasemanService.openCommonFrm(PopOrgController,$scope,FrmInfo)
		.result.then(function (result) {
			$scope.sale_warn_header.org_id = result.org_id;
			$scope.sale_warn_header.org_code = result.org_code;
			$scope.sale_warn_header.org_name = result.org_name;
		});
	}
	//客户弹窗
	$scope.openCustFrm = function (){
		var FrmInfo = {};
		FrmInfo.title = "客户查询"; 
		FrmInfo.thead = [{name:"客户编码",code:"cust_code"},
		                 {name:"客户名称",code:"cust_name"}];
		BasemanService.openCommonFrm(PopCustController,$scope,FrmInfo)
		.result.then(function (result) {
			$scope.sale_warn_header.cust_id = result.cust_id;
			$scope.sale_warn_header.cust_code = result.cust_code;
			$scope.sale_warn_header.cust_name = result.cust_name;
		});
	}
	//发货港
	$scope.openOutSeaPort = function(){
		var FrmInfo = {};
		FrmInfo.title = "港口查询"; 
		FrmInfo.thead = [{name:"港口名称",code:"seaport_name"},
		                 {name:"港口类型",code:"seaport_type"}];
		BasemanService.openCommonFrm(PopSeaPortController,$scope,FrmInfo)
		.result.then(function (result) {
			$scope.sale_warn_header.sea_port_out_id = result.seaport_id;
			$scope.sale_warn_header.sea_port_out_name = result.seaport_name;
			$scope.sale_warn_header.sea_port_out_type = result.seaport_type;
		});
	}
	//目的港
	$scope.openInSeaPort = function(){
		var FrmInfo = {};
		FrmInfo.title = "港口查询"; 
		FrmInfo.thead = [{name:"港口名称",code:"seaport_name"},
		                 {name:"港口类型",code:"seaport_type"}];
		BasemanService.openCommonFrm(PopSeaPortController,$scope,FrmInfo)
		.result.then(function (result) {
			$scope.sale_warn_header.sea_port_in_id = result.seaport_id;
			$scope.sale_warn_header.sea_port_in_name = result.seaport_name;
			$scope.sale_warn_header.sea_port_in_type = result.seaport_type;
		});
	}
	$scope.sale_warn_headers = [];
	for(var i=1 ; i<10;i++){
		var newObj = {};
		
		newObj.prod_line_id = '10000' + i;
		newObj.batch_no = '10000' + i;
		newObj.po_no = '10000' + i;
		newObj.cust_name = '客户' + i;
		newObj.cust_item_name = '机型' + i;
		newObj.qty_total = i * 100;//总数量
		newObj.load_qty = i * 50;//已装柜
		newObj.wait_total = newObj.qty_total - newObj.load_qty;//待装柜
		newObj.seaport_out_name = "中山";
		newObj.seaport_in_name = "波尔图";
		newObj.box_type_name = "40HQ";
		newObj.total_gw = "1";
		newObj.total_nw = "1";
		newObj.ship_type = "1";
		newObj.ship_type_name = "海运";
		newObj.note = "注意轻放";
		newObj.this_qty = newObj.wait_total;
		
		newObj.delivery_date = new Date().Format("yyyy-MM-dd");
		newObj.total_box_qty = "1000";//柜型的总数量
		newObj.total_volume = "4";//柜型的总体积
		
		$scope.sale_warn_headers.push(newObj);
	}
	$scope.search = function(){
		$scope.sale_warn_header.flag = 2;
		
		var promise = BasemanService.RequestPost("sale_warn_header","search",$scope.sale_warn_header);
		promise.then(function(data){
			for(var i =0;i<data.sale_warn_headers.length;i++){
				data.sale_warn_headers[i].wait_total = data.sale_warn_headers[i].qty_total - data.sale_warn_headers[i].load_qty;
				if(data.sale_warn_headers[i].wait_total <0){
					data.sale_warn_headers[i].wait_total = 0;
				}
				data.sale_warn_headers[i].this_qty = data.sale_warn_headers[i].wait_total;
			}
			$scope.sale_warn_headers = data.sale_warn_headers;
			$scope.indexs = [];//清除选中的
		});
	}
	$scope.indexs = [];
	$scope.trselect =function(index,event){
		var checkbox = $(event.currentTarget).find("input[name='checkbox']")[0];
    	if($(event.currentTarget).hasClass("info")){
    		$(event.currentTarget).removeClass("info")
    		if(checkbox.checked){
    			checkbox.checked=false;
            }
    		for(var i = 0 ;i<$scope.indexs.length;i++){
    			if($scope.indexs[i] == index){
    				$scope.indexs.splice(i,1);
    			}
    		}
    	}else{
    		$(event.currentTarget).addClass("info")
    		if(!checkbox.checked){
    			checkbox.checked=true;
            }
    		$scope.indexs.push(index);
    	}
	}
	
	//装柜
	$scope.fillinbox = function(){
		var indexs = [];
		for(var i =0;i<$scope.indexs.length;i++){
			var $qty = Number($scope.sale_warn_headers[$scope.indexs[i]].this_qty);
			var $wait_fill =  Number($scope.sale_warn_headers[$scope.indexs[i]].wait_total);
			if(!$qty || $qty <= 0 ){
				BasemanService.notify(notify,"PO号"+$scope.sale_warn_headers[$scope.indexs[i]].po_no+"本次装柜数量不正确!","alert-info",2000);
				return false;
			}
			else if($qty > $wait_fill){
				BasemanService.notify(notify,"PO号"+$scope.sale_warn_headers[$scope.indexs[i]].po_no+"本次装柜数超出等待装柜数!","alert-info",2000);
				return false;
			}
			else if($wait_fill <= 0){//代装数为零
				BasemanService.notify(notify,"PO号"+$scope.sale_warn_headers[$scope.indexs[i]].po_no+"无等待装柜数!","alert-info",2000);
				return false;
			}
			
			//没有柜创建一个
			if($scope.boxlines.length <=0 ){
				//newboxline($scope);
				var boxline = {};
				boxline.id = 1;
				boxline.total_box_qty = $scope.sale_warn_headers[$scope.indexs[i]].total_box_qty;
				if(boxline.total_box_qty <=0){
					BasemanService.notify(notify,"柜型总数量体积应该大于零","alert-info",2000);
					return false;
				}
				boxline.cust_id = $scope.sale_warn_headers[$scope.indexs[i]].cust_id;
				boxline.total_volume = $scope.sale_warn_headers[$scope.indexs[i]].total_volume;
				boxline.box_type_name = $scope.sale_warn_headers[$scope.indexs[i]].box_type_name;
				boxline.seaport_in_name = $scope.sale_warn_headers[$scope.indexs[i]].seaport_in_name;
				boxline.seaport_out_name = $scope.sale_warn_headers[$scope.indexs[i]].seaport_out_name;
				boxline.ship_type_name = $scope.sale_warn_headers[$scope.indexs[i]].ship_type_name;
				boxline.wait_total = 0;
				boxline.boxline_of_details = [];
				$scope.boxlines.push(boxline);
			}
			
			if($scope.boxlines[$scope.boxlines.length-1].box_type_name==undefined){//所选择的柜型无柜型
				BasemanService.notify(notify,"未设置柜型","alert-info",2000);
				return false;
			}
			
			//所选择的柜的体积（已知）是否装满
			if(Number($scope.boxlines[$scope.boxlines.length-1].wait_total) >= Number($scope.boxlines[$scope.boxlines.length-1].total_box_qty)){
				//上一个柜已装满
				var boxline = {};
				boxline.id = 1;
				boxline.total_box_qty = $scope.sale_warn_headers[$scope.indexs[i]].total_box_qty;
				boxline.total_volume = $scope.sale_warn_headers[$scope.indexs[i]].total_volume;
				boxline.box_type_name = $scope.sale_warn_headers[$scope.indexs[i]].box_type_name;
				boxline.seaport_in_name = $scope.sale_warn_headers[$scope.indexs[i]].seaport_in_name;
				boxline.seaport_out_name = $scope.sale_warn_headers[$scope.indexs[i]].seaport_out_name;
				boxline.ship_type_name = $scope.sale_warn_headers[$scope.indexs[i]].ship_type_name;
				boxline.wait_total = 0;
				boxline.boxline_of_details = [];
				$scope.boxlines.push(boxline);
				
			}else{//未装满
				//清单
				var load_qty = Number($scope.sale_warn_headers[$scope.indexs[i]].this_qty);//
				var wait_fill_total = Number($scope.sale_warn_headers[$scope.indexs[i]].wait_total);//将要入柜的
				var fill_total = Number($scope.boxlines[$scope.boxlines.length-1].total_box_qty);//柜的总数量
				var box_in_total = Number($scope.boxlines[$scope.boxlines.length-1].wait_total);//柜的已装数量
				var prod_line_id = $scope.sale_warn_headers[$scope.indexs[i]].prod_line_id;//用于明细融合
				var barch_no = $scope.sale_warn_headers[$scope.indexs[i]].batch_no;//用于明细融合
				
				var details = {}
				details.prod_line_id = $scope.sale_warn_headers[$scope.indexs[i]].prod_line_id;
				details.batch_no = $scope.sale_warn_headers[$scope.indexs[i]].batch_no;
				details.cust_name = $scope.sale_warn_headers[$scope.indexs[i]].cust_name;
				details.cust_item_name = $scope.sale_warn_headers[$scope.indexs[i]].cust_item_name;
				details.delivery_date = $scope.sale_warn_headers[$scope.indexs[i]].delivery_date;
				details.total_box_qty = fill_total;
				var qty = 0;//入柜数
				if(box_in_total + load_qty > fill_total){
					qty = fill_total - box_in_total;
				}else{
					qty = load_qty;
				}
//				var this_qty = Number($scope.sale_warn_headers[$scope.indexs[i]].this_qty)
//				$scope.sale_warn_headers[$scope.indexs[i]].this_qty = this_qty + qty;
				details.qty = qty;
				details.bili = (qty/fill_total).toPercent();
				details.volumns = $scope.boxlines[$scope.boxlines.length-1].total_volume;
				details.boxline_id = $scope.boxlines[$scope.boxlines.length-1].id;
				//改变主表内容
				$scope.sale_warn_headers[$scope.indexs[i]].wait_total = wait_fill_total - qty;
				var temp = Number($scope.sale_warn_headers[$scope.indexs[i]].load_qty);
				$scope.sale_warn_headers[$scope.indexs[i]].load_qty = temp + qty;
				//是否选中柜/默认放进最后一个柜
				if($scope.boxline_select >=0){
					var wait_total = Number($scope.boxlines[$scope.boxline_select].wait_total);
					wait_total += details.qty;
					$scope.boxlines[$scope.boxline_select].wait_total = wait_total;
					$scope.boxlines[$scope.boxline_select].bili =  (wait_total/$scope.boxlines[$scope.boxlines.length-1].total_box_qty).toPercent();
					//当前柜中已经有该明细
					var stat = false;
					var current_box_list = $scope.boxlines[$scope.boxline_select].boxline_of_details;
					for(var i=0;i<current_box_list.length;i++){
						if(current_box_list[i].prod_line_id == details.prod_line_id){
							var qty = current_box_list[i].qty;
							qty += details.qty;
							current_box_list[i].qty = qty;
							current_box_list[i].bili = (qty/$scope.boxlines[$scope.boxline_select].total_box_qty).toPercent();
							stat = true;
							$scope.boxlines[$scope.boxline_select].boxline_of_details[i] = current_box_list[i];
							break;
						}
					}
					if(!stat){
						$scope.boxlines[$scope.boxline_select].boxline_of_details.push(details);
					}
					
				}else{
					var wait_total = Number($scope.boxlines[$scope.boxlines.length-1].wait_total);
					wait_total += details.qty;
					$scope.boxlines[$scope.boxlines.length-1].wait_total = wait_total;
					$scope.boxlines[$scope.boxlines.length-1].bili =  (wait_total/$scope.boxlines[$scope.boxlines.length-1].total_box_qty).toPercent();
					//当前柜中已经有该明细
					var stat = false;
					var current_box_list = $scope.boxlines[$scope.boxlines.length-1].boxline_of_details;
					for(var i=0;i<current_box_list.length;i++){
						if(current_box_list[i].prod_line_id == details.prod_line_id){
							var qty = current_box_list[i].qty;
							qty += details.qty;
							current_box_list[i].qty = qty;
							current_box_list[i].bili = (qty/$scope.boxlines[$scope.boxlines.length-1].total_box_qty).toPercent();
							stat = true;
							$scope.boxlines[$scope.boxlines.length-1].boxline_of_details[i] = current_box_list[i];
							break;
						}
					}
					if(!stat){
						$scope.boxlines[$scope.boxlines.length-1].boxline_of_details.push(details);
					}
				}
				
				
				
			}
			
		}
	}
	
	//新增柜型
	$scope.boxlines = [];
	$scope.newBox = function(){
		var obj = {};
		obj.id = $scope.boxlines.length + 1;
		obj.boxline_of_details = [];
		$scope.boxlines.push(obj);
	}
	//选中柜
	$scope.boxline_select = -1;
	$scope.boxlineselect = function(index,event){
		$(event.currentTarget).addClass("info").siblings("tr").removeClass("info");
    	$scope.boxline_select = index;
    	$scope.boxline_of_details = $scope.boxlines[index].boxline_of_details;
    	
	}
	//删除柜型
	$scope.deleteBox = function(){
		if($scope.boxline_select>=0){
			//释放柜
			var boxline = $scope.boxlines[$scope.boxline_select];
			var headers = $scope.sale_warn_headers;
			for(var i=0;i<boxline.boxline_of_details.length;i++){
				for(var j=0;j<headers.length;j++){
					if(boxline.boxline_of_details[i].prod_line_id == headers[j].prod_line_id){
						
//						var this_qty = Number($scope.sale_warn_headers[j].this_qty);
//						$scope.sale_warn_headers[j].this_qty = this_qty - Number(boxline.boxline_of_details[i].qty);
						$scope.sale_warn_headers[j].load_qty -= Number(boxline.boxline_of_details[i].qty);
						$scope.sale_warn_headers[j].wait_total =
							Number($scope.sale_warn_headers[j].wait_total) + Number(boxline.boxline_of_details[i].qty);
					}
				}
			}
			$scope.boxlines.splice($scope.boxline_select,1);
		}
		//清空明细
		$scope.boxline_of_details = [];
		//清除选中
		$scope.boxline_select = -1;
	}
	//自动生成柜型
	$scope.autoCreateBoxNum = function(){
		var boxlength = $scope.boxlines.length;
		if(boxlength > 0 ){
			var postdata = {
					box_nos:boxlength	
			};
			BasemanService.RequestPost("sale_warn_header","generate_boxno",postdata)
			.then(function(data){
				for(var i =0;i<boxlength;i++){
					$scope.boxlines[i].virtual_box = data.virtual_box;
				}
				//alert("自动生成柜型：" + data.virtual_box);
			});
		}
		
	}
	//复制当前柜型
	$scope.copyCurrentBox = function(){
		//选中的柜
		if($scope.boxline_select >= 0){
			$scope.currentBox = $scope.boxlines[$scope.boxline_select];
		}
	}
	//选中行
	$scope.boxdetail_select = -1;
	$scope.boxlinecheck = function(index,event){
		$(event.currentTarget).addClass("info").siblings("tr").removeClass("info");
    	$scope.boxdetail_select = index;
	}
	//删除行
	$scope.deleteBoxLine = function(){
		if($scope.boxdetail_select >=0){
			//当前行的所在柜
			var currentline = $scope.boxline_of_details[$scope.boxdetail_select];
			
			var boxline_id = currentline.boxline_id;
			for(var i=0;i<$scope.boxlines.length;i++){
				if($scope.boxlines[i].id == boxline_id){
					var currentbox = $scope.boxlines[i];
					for(var j=0;j<$scope.sale_warn_headers.length;j++){
						if($scope.sale_warn_headers[j].prod_line_id == currentline.prod_line_id){
//							var this_qty = Number($scope.sale_warn_headers[j].this_qty);
//							$scope.sale_warn_headers[j].this_qty = this_qty - Number(currentline.qty);
							$scope.sale_warn_headers[j].load_qty -= Number(currentline.qty);
							$scope.sale_warn_headers[j].wait_total =
								Number($scope.sale_warn_headers[j].wait_total) + Number(currentline.qty);
							
							currentbox.wait_total = Number(currentbox.wait_total) - Number(currentline.qty);
							currentbox.bili =  (currentbox.wait_total/currentbox.total_box_qty).toPercent();;
							$scope.boxlines[i] = currentbox;
							
							break;
						}
					}
					break;
				}
			}
			
			$scope.boxline_of_details.splice($scope.boxdetail_select,1);
		}
	}
}


fileControllers
	.controller("salepiheaderController",salepiheaderController)
	.controller("salepiheaderEditController",salepiheaderEditController)
	.controller("saleProdHeaderPlanController",saleProdHeaderPlanController)
	.controller("salewarnheaderController",salewarnheaderController)
	.controller("PrintTemplateEditController",PrintTemplateEditController)
	.controller("PrintTemplateController",PrintTemplateController)