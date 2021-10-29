'use strict';
function Customer_Visit($scope,$rootScope,BasemanService,$state,localeStorageService){

    localeStorageService.pageHistory($scope,function(){
        $scope.data.currItem.page_info = {
                oldPage : $scope.oldPage,
                currentPage : $scope.currentPage,
                pageSize : $scope.pageSize,
                totalCount : $scope.totalCount,
                pages : $scope.pages
            }
        return $scope.data.currItem
    });

    $scope.data={};
    $scope.data.currItem={};
    $scope.userbean = {};
    $scope.sale_customs_price = {};

    BasemanService.pageInit($scope);
    
  //高级查询
    $scope.init_table = function(){
	    	$scope.FrmInfo={
			classid: 'app_wq_customer_visit', //Search请求类---主表
			type: 'sqlback', //单选或多选，默认''单选
			sqlBlock: "cust_code != '该字段所传的数据必须与对应字段的属性一样'" //强制性的过滤条件，默认空
			}
		BasemanService.open(CommonPopController, $scope)
			.result.then(function(result) {
				console.log(result);
			    if(result.sqlwhere){
			 	$scope.highsql = result.sqlwhere;
			    }
			 $scope.search();
		});					
    }
    
 // 查询
    function getSqlWhere(){
    	if($scope.highsql){
    		return $scope.highsql;
    	}
    	else return BasemanService.getSqlWhere(["title","content", "creator"],$scope.searchtext);
    }
    $scope._pageLoad = function(postdata){
    	
        if(postdata){
            postdata.sqlwhere = getSqlWhere();
            $scope.initsql = '';
        }
        $scope.highsql = "";
        BasemanService.RequestPost("app_wq_customer_visit","search",postdata)
        .then(function(data){
            $scope.data.currItem.app_wq_customer_visits =data.app_wq_customer_visits;
             BasemanService.pageInfoOp($scope,data.pagination);
             $scope.data.currItem.app_wq_customer_visits.length > 0?
                 	BasemanService.notice("搜索已完成","alert-info"):
                 		BasemanService.notice("未含有搜索记录","alert-warning");
        });
    }

    $scope.new = function(){

        localeStorageService.remove("crmman.base_drp_custedit");
        console.log($scope);
        //跳转
        $state.go("crmman.base_drp_custedit");
    }



    //查询删除
    $scope.deletePoint = function(item) {
        return $modal.open({
            templateUrl: "views/common/Pop_Delete.html",
            controller: function($scope, $modalInstance) {
                $scope.FrmInfo = {};
                $scope.FrmInfo.title = "选择海关报价型号";

                // 确定
                $scope.ok = function() {
                    $scope.so_delete();
                };

                // 取消
                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                };
            },
            scope: $scope
        });
    };

    $scope.so_delete = function(index){
        ds.dialog.confirm("您确定删除这条记录吗？",function(){
            var  postdata={
                cust_id:parseInt($scope.data.currItem.drp_custs[index].cust_id)
            };
            var promise = BasemanService.RequestPost("drp_cust","delete",postdata);
            promise.then(function(data){
                BasemanService.notice("删除成功!","alert-info");
                $scope.search();
            });
        });
    }


    $scope.edit = function(index,event){

        $scope.editobj = {cust_id: $scope.data.currItem.drp_custs[index].cust_id};
        //select
        var promise = BasemanService.RequestPost("drp_cust", "select", $scope.editobj);
        promise.then(function(data) {
            $scope.editobj = data;
            localeStorageService.set("crmman.base_drp_custedit", $scope.editobj);
            //跳转
            $state.go("crmman.base_drp_custedit");
        });
    }

    var temp = localeStorageService.getHistoryItem($rootScope.$state.$current.name);
    if(temp){
        $scope.data.currItem = temp;

        $scope.oldPage = temp.page_info.oldPage;
        $scope.currentPage = temp.page_info.currentPage;
        $scope.pageSize = temp.page_info.pageSize;
        $scope.totalCount = temp.page_info.totalCount;
        $scope.pages = temp.page_info.pages;
    }


    // 打印
  $scope.print = function(index,event){
        $scope.editobj = {cust_id: $scope.data.currItem.drp_custs[index].cust_id};
        //select
        var promise = BasemanService.RequestPost("drp_cust", "select", $scope.editobj);
        promise.then(function(data) {
            $scope.editobj = data;
            localeStorageService.set("crmman.drp_cust_print", $scope.editobj);
            //跳转
            $state.go("crmman.drp_cust_print");
        });
    }

}
//产品编辑页面
function Customer_Visit_Detail($scope, $http, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {

    $rootScope.currScope = $scope;

    var _stateName = $rootScope.$state.$current.name;
    //console.log("enter state = " + _stateName);
    $scope.data = localeStorageService.get(_stateName);
    if ($scope.data == undefined) {
        $scope.data = {
            currItem: {
            
        
            },
            items: [],
            currItemIndex: -1,
        };
    }
    $scope.userbean = {};
    if(window.userbean){
        $scope.userbean = window.userbean;
    }
    $scope.userbean = window.userbean;
    var mystring= $scope.userbean.roleids;
    var myarray = mystring.split(",");
    for(var i=0;i<myarray.length;i++) {
        if(myarray[i]=="XF_价格权限"){
           $scope.data.appear=1; 
        }
    }

   /** $scope.custtypes = [{
        id: 1,
        name: "常规客户" 
    }, {
        id: 2,
        name: "超市客户"
    }, {
        id: 3,
        name: "承运商"
    }];*/
    $scope.settle_modeintegers = [{
        id: 1,
        name: "发货"
    }, {
        id: 2,
        name: "开票"
    }];
    $scope.settle_cycleintegers = [{
        id: 1,
        name: "月结"
    }, {
        id: 2,
        name: "半月结"
    }];

    $scope.search = function() {
        var FrmInfo = {};
        FrmInfo.title = "客户资料查询";
        FrmInfo.thead = [{
            name: "客户编码",
            code: "cust_code"
        }, {
            name: "客户名称",
            code: "cust_name"
        }, {
            name: "所属部门",
            code: "org_name"
        }];
        BasemanService.openCommonFrm(PopDrpCustController, $scope, FrmInfo)
            .result.then(function(result) {
                $scope.data.currItem.cust_id = result.cust_id;


                if (result.cust_id != 0) {
                    $scope.refresh(2);
                }
            });
    }


    //城市查询
    $scope.selectarea= function(p) {
        var FrmInfo = {};
        FrmInfo.title = "城市查询";
        FrmInfo.thead = [{
            name: "城市编码",
            code: "areacode"
        }, {
            name: "城市名称",
            code: "areaname"
        }, {
            name: "备注",
            code: "note"
        }];


            FrmInfo.initsql=" areatype=4 "

        BasemanService.openCommonFrm(PopDrpAreaCityController, $scope, FrmInfo)
            .result.then(function(result) {

        switch(p){
            case 1:
                $scope.data.currItem.start_areacode = result.areacode;
                $scope.data.currItem.start_areaname = result.areaname;
                break;
           default:
            $scope.data.currItem.province_id = result.areaid;
                $scope.data.currItem.province_code = result.areacode;
                $scope.data.currItem.province_name = result.areaname;
                break;

            }

               });
    };

     $scope.save = function() {
        HczyCommon.commitGrid($scope.aoptions.grid,$scope.aoptions.grid,$scope.feeoptions.grid,$scope.dzjoptions.grid);
        $scope.data.currItem.drp_cust_addressofdrp_custs = $scope.aoptions.grid.getData();
        $scope.data.currItem.drp_cust_item_kindofdrp_custs = $scope.feeoptions.grid.getData();
        $scope.data.currItem.drp_cust_dzj_lineofdrp_custs = $scope.dzjoptions.grid.getData();
        var postdata = $scope.data.currItem;

        var j=0;         
        for (var i = 0; i < $scope.data.currItem.drp_cust_addressofdrp_custs.length; i++) {
             if($scope.data.currItem.drp_cust_addressofdrp_custs[i].defaulted==2){
                j=j+1;
             }
            $scope.data.currItem.drp_cust_addressofdrp_custs[i].seq = (i + 1);
        }
         
         if(j>1){
        BasemanService.notice("保存失败，默认的城市超过2个!", "alert-warning");
        return;
 }   
       
            var action = "update";
            if (postdata.cust_id == undefined || postdata.cust_id == 0) {
                action = "insert";
            }
            var promise = BasemanService.RequestPost("drp_cust", action, postdata);
            promise.then(function(data) {

                BasemanService.notice("保存成功!", "alert-info");
                $scope.data.currItem = data;

            $scope.aoptions.grid.setData($scope.data.currItem.drp_cust_addressofdrp_custs);    
            $scope.aoptions.grid.invalidateAllRows();
            $scope.aoptions.grid.updateRowCount();
            $scope.aoptions.grid.render();

            });
        
    };


       $scope.refresh = function(flag) {
        var postdata = {
            cust_id: $scope.data.currItem.cust_id
        };
        if (postdata.cust_id == undefined || postdata.cust_id == 0) {
            BasemanService.notice("客户资料没有保存，无法刷新", "alert-warning");
            return;
        };
        var promise = BasemanService.RequestPost("drp_cust", "select", postdata);
        promise.then(function(data) {
            $scope.data.currItem = data;
		    $scope.aoptions.grid.setData($scope.data.currItem.drp_cust_addressofdrp_custs);    
            $scope.aoptions.grid.invalidateAllRows();
            $scope.aoptions.grid.updateRowCount();
            $scope.aoptions.grid.render();

      for (var i=0;i<$scope.data.currItem.drp_cust_item_kindofdrp_custs.length;i++){
        $scope.data.currItem.drp_cust_item_kindofdrp_custs[i].seq=(i+1);
      }
            $scope.feeoptions.grid.setData($scope.data.currItem.drp_cust_item_kindofdrp_custs);    
            $scope.feeoptions.grid.invalidateAllRows();
            $scope.feeoptions.grid.updateRowCount();
            $scope.feeoptions.grid.render();
      
      for (var i=0;i<$scope.data.currItem.drp_cust_no_lineofdrp_custs.length;i++){
        $scope.data.currItem.drp_cust_no_lineofdrp_custs[i].seq=(i+1);
      }
            $scope.custoptions.grid.setData($scope.data.currItem.drp_cust_no_lineofdrp_custs);    
            $scope.custoptions.grid.invalidateAllRows();
            $scope.custoptions.grid.updateRowCount();
            $scope.custoptions.grid.render();
            if (flag != 2) {
                BasemanService.notice("刷新成功", "alert-info");
            };

        });
    };
 
     $scope.additem = function() {
        var item = {
            seq: 1
        };
        $scope.aoptions.grid.getData().push(item);
        $scope.aoptions.grid.invalidateAllRows();
        $scope.aoptions.grid.render();
    };
   

    $scope.delitem = function() {

        var grid = $scope.aoptions.grid;
        var rowidx = grid.getActiveCell().row;
        $scope.aoptions.grid.getData().splice(rowidx, 1);
        grid.invalidateAllRows();
        grid.updateRowCount();
        grid.render();

    };
    $scope.additem1 = function() {
       
         $scope.FrmInfo={};
                $scope.FrmInfo.initsql=" usable=2";

             BasemanService.openFrm("views/popview/Pop_Drp_CustNo.html",PopCustNoAddController,$scope,"","lg")
             .result.then(function (items){
              if(items.length){

                var grid = $scope.custoptions.grid;
                var data = grid.getData();
                for(var i=0;i<items.length;i++){
                    var tempobj = new Object();
                    tempobj.item_id =  items[i].item_id;                     
                    tempobj.cust_item_no =  items[i].item_code;
                    tempobj.item_code =  items[i].item_code;
                    tempobj.item_name =  items[i].item_name;
                    tempobj.spec =  items[i].spec;
                     tempobj.seq = (i+1);                           
                    data.push(tempobj);
                }
                }
                grid.setData(data);
                grid.invalidateAllRows();
                grid.render();

             });
        
    };
   

    $scope.delitem1 = function() {

        var grid = $scope.custoptions.grid;
        var rowidx = grid.getActiveCell().row;
        $scope.custoptions.grid.getData().splice(rowidx, 1);
        grid.invalidateAllRows();
        grid.updateRowCount();
        grid.render();

    };
    $scope.additem2 = function() {
        $scope.setColumnsConfig();
        var item_kind_id = "";
        for(var i=0;i<$scope.itemkinds.length;i++){
            if($scope.itemkinds[i].desc == '1'){
                item_kind_id = $scope.itemkinds[i].value;
                break;
            }
        }
        var item = {
            seq: 1,
            item_kind: item_kind_id
        };
        $scope.feeoptions.grid.getData().push(item);
        $scope.feeoptions.grid.invalidateAllRows();
        $scope.feeoptions.grid.render();
    };
   

    $scope.delitem2 = function() {

        var grid = $scope.feeoptions.grid;
        var rowidx = grid.getActiveCell().row;
        $scope.feeoptions.grid.getData().splice(rowidx, 1);
        grid.invalidateAllRows();
        grid.updateRowCount();
        grid.render();

    };
    
    $scope.additem3 = function() {
        
        var item = {
            seq: 1,
        };
        $scope.dzjoptions.grid.getData().push(item);
        $scope.dzjoptions.grid.invalidateAllRows();
        $scope.dzjoptions.grid.render();
    };
    
    $scope.delitem3 = function() {
        var grid = $scope.dzjoptions.grid;
        var rowidx = grid.getActiveCell().row;
        $scope.dzjoptions.grid.getData().splice(rowidx, 1);
        grid.invalidateAllRows();
        grid.updateRowCount();
        grid.render();

    };
	 $scope.new = function() {
        $scope.data.currItem={
            drp_cust_addressofdrp_custs:[]};
        $scope.aoptions.grid.setData($scope.data.currItem.drp_cust_addressofdrp_custs);  

        $scope.userbean = {};
    if(window.userbean){
        $scope.userbean = window.userbean;
    }
    $scope.userbean = window.userbean;
    var mystring= $scope.userbean.roleids;
    var myarray = mystring.split(",");
    for(var i=0;i<myarray.length;i++) {
        if(myarray[i]=="XF_价格权限"){
           $scope.data.appear=1; 
        }
    }
    
		  
         
    };
    //需要查询  -- 产品组织信息
    BasemanService.RequestPost("base_search","search",{flag:1, flag_name:'cust_price_type'})
    .then(function(data){
        $scope.cust_price_types = [];
        for(var i=0;i<data.cust_price_types.length;i++){
            var newobj = {
                    id: data.cust_price_types[i].id,
                    name: data.cust_price_types[i].name
            }
            $scope.cust_price_types.push(newobj);
        }
    },function(data){
        $scope.cust_price_types = new Array();
    });
    BasemanService.RequestPost("base_search","search",{flag:1, flag_name:'cust_type'})
    .then(function(data){
        $scope.cust_types = [];
        for(var i=0;i<data.cust_types.length;i++){
            var newobj = {
                    id: data.cust_types[i].id,
                    name: data.cust_types[i].name
            }
            $scope.cust_types.push(newobj);
        }
    },function(data){
        $scope.cust_types = new Array();
    });
    BasemanService.RequestPost("base_search","search",{flag:1, flag_name:'item_kind'})
    .then(function(data){
        $scope.itemkinds = [];
        for(var i=0;i<data.item_kinds.length;i++){
            var newobj = {
                    value: data.item_kinds[i].id,
                    desc: data.item_kinds[i].name
            }
            $scope.itemkinds.push(newobj);
        }
        $scope.setColumnsConfig();
    },function(data){
        $scope.itemkinds = new Array();
    });
    
    //柜型所在列，修改列的时候需要更新这里
    $scope.setColumnsConfig = function(){
        var culumn = $scope.feeoptions.grid.getColumns();
        if(!culumn[1].options || !culumn[1].options.length){
            culumn[1].options = $scope.itemkinds
        }
    }
    

   $scope.searchmodel=function(item) {
        return $modal.open({
            templateUrl: "views/common/Pop_Common.html",
            controller: function($scope, $modalInstance) {
                $scope.FrmInfo = {};
                $scope.FrmInfo.title = "收货城市选择";
                $scope.FrmInfo.thead = [{
                    name: "收货城市名字",
                    code: "areaname"
                }, {
                    name: "收货城市编码",
                    code: "areacode"
                }];
                
                // 确定
                $scope.ok = function() {
                    item.areaid = $scope.item.areaid;              
                    item.areaname = $scope.item.areaname;
                    item.areacode = $scope.item.areacode; 
                    item.areaname_adds=$scope.item.note;				

               
                    //console.log('ok......:'+$scope.item.uom_name+' :'+item.uom_name);
                    $modalInstance.close($scope.item);
                };
                
                // 取消
                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                };
                $scope.search = function() {
                    var sqlWhere = BasemanService.getSqlWhere(["areaid", "areaname"], $scope.searchtext);
                    var postdata = {
                        sqlwhere: sqlWhere
                    ///cust_id: $scope.data.currItem.cust_id

                    };
                    var promise = BasemanService.RequestPost("scparea", "search", postdata);
                    promise.then(function(data) {
                        $scope.items = data.scpareas;
                        // console.log('search......0');                         
                    });
                };
                
                // 单击明细行
                $scope.addLine = function(index, $event) {
                    $($event.currentTarget).addClass("info").siblings("tr").removeClass("info");
                    $scope.item = $scope.items[index];
                    
                     //console.log('addLine......1');
                };
                
                // 双击明细行确认
                $scope.addConfirm = function(index) {
                    //console.log('-addConfirm......2');
                    item.areaid = $scope.items[index].areaid;
                 
                    //item.brand = "HOMA";
                    item.areaname = $scope.items[index].areaname;
                    item.areacode =$scope.items[index].areacode;
                    item.areaname_adds =$scope.items[index].note;                    
                    $modalInstance.close($scope.item);                  
                    
                    $modalInstance.close($scope.items[index]);
                }
            },
            scope: $scope
        });
    };

    
    $scope.selectprod = function(){
    	var _this = $(this);
		var index = _this.attr('index');
		index = Number(index);
		var cell = _this.attr('cell');
		$scope.FrmInfo = {
					title : "产品资料查询",
					thead : [{
			            name: "产品编码",
			            code: "item_code"
			        }, {
			            name: "规格型号",
			            code: "spec"
			        }, {
			            name: "产品名称",
			            code: "item_name"
			        }],
					classid:"drp_item",
					postdata:{},
					searchlist:["item_code","spec","item_name"],
			};
	        BasemanService.open(CommonPopController,$scope)
	        .result.then(function (result) {
	        	var grid = $scope.dzjoptions.grid;
	        	var data = grid.getData();
//	        	_this.prev().val(result.item_code);
	        	data[index].item_code = result.item_code;
	        	data[index].spec = result.spec;
	        	data[index].item_name = result.item_name;
	        	grid.updateRow(index);
	        });
    }
    
      $scope.acolumns = [{
        id: "sel",
        name: "#",
        field: "seq",
        behavior: "select",
        cssClass: "cell-selection",
        width: 40,
        cannotTriggerInsert: true,
        resizable: false,
        selectable: false,
        focusable: false
    },{
        id: "defaulted",
        name: "是否默认",
        field: "defaulted",
        width: 120,
        formatter: Slick.Formatters.Checkmark,
        editor: Slick.Editors.Checkbox
    },{
        id: "areaname",
        name: "收货城市",
        field: "areaname",
        width: 120,
        action:$scope.searchmodel,
        editor:Slick.Editors.ButtonEditor
    },{
        id: "address",
        name: "收货地址",
        field: "address",
        width: 180,
        editor:Slick.Editors.Text 
    },{
        id: "take_man",
        name: "收货人",
        field: "take_man",
        width: 100,
        editor:Slick.Editors.Text 
    }, {
        id: "idcard",
        name: "收货人身份证号码",
        field: "idcard",
        width: 140,
        cssClass: "rightAligned",
        //headerCssClass: "rightAligned column-editable",
        editor:Slick.Editors.Text 
    }, {
        id: "phone_code",
        name: "收货人电话号码",
        field: "phone_code",
        width: 120,
        //dataItemColumnValueExtractor: $scope.getCheckboxValue
     editor:Slick.Editors.Text 

       
    }, {
        id: "rcv_company",
        name: "门店名称",
        field: "rcv_company",
        width: 180,      
         editor: Slick.Editors.Text
    },{
        id: "note",
        name: "备注",
        field: "note",
        width: 120,
        editor: Slick.Editors.Text
    }];

    $scope.aoptions = {
        editable: true,
        enableAddRow: false,
        enableCellNavigation: true,
        asyncEditorLoading: false,
        autoEdit: true
    };


    $scope.custcolumns = [{
        id: "sel",
        name: "#",
        field: "seq",
        behavior: "select",
        cssClass: "cell-selection",
        width: 40,
        cannotTriggerInsert: true,
        resizable: false,
        selectable: false,
        focusable: false
    },{
        id: "cust_item_no",
        name: "客户产品货号",
        field: "cust_item_no",
        width: 120,
       // formatter: Slick.Formatters.Checkmark,
        editor:Slick.Editors.Text 
    },{
        id: "item_code",
        name: "产品编码",
        field: "item_code",
        width: 120,
    },{
        id: "item_name",
        name: "产品名称",
        field: "item_name",
        width: 120,

    },{
        id: "spec",
        name: "产品型号",
        field: "spec",
        width: 120,

    }];
    
    $scope.dzjoptions = {
        editable: true,
        enableAddRow: false,
        enableCellNavigation: true,
        asyncEditorLoading: false,
        autoEdit: true
    };
    
    $scope.dzjcolumns = [{
        id: "seq",
        name: "#",
        field: "seq",
        behavior: "select",
        cssClass: "cell-selection",
        width: 40,
        cannotTriggerInsert: true,
        resizable: false,
        selectable: false,
        focusable: false
    },{
        id: "item_code",
        name: "产品编码",
        field: "item_code",
        width: 120,
        toaction: $scope.selectprod,
        editor: Slick.Editors.ButtonEditor,
    },{
        id: "item_name",
        name: "产品名称",
        field: "item_name",
        width: 120,
        editor: Slick.Editors.ReadonlyText,
    },{
        id: "spec",
        name: "产品型号",
        field: "spec",
        width: 120,
        editor: Slick.Editors.ReadonlyText,
    }];
    
    $scope.custoptions = {
        editable: true,
        enableAddRow: false,
        enableCellNavigation: true,
        asyncEditorLoading: false,
        autoEdit: true
    };

    $scope.feecolumns = [{
        id: "sel",
        name: "#",
        field: "seq",
        behavior: "select",
        cssClass: "cell-selection",
        width: 40,
        cannotTriggerInsert: true,
        resizable: false,
        selectable: false,
        focusable: false
    },{
        id: "item_kind",
        name: "产品组织",
        field: "item_kind",
        width: 120,
       // formatter: Slick.Formatters.Checkmark,
        options: [],
        editor: Slick.Editors.SelectOption,
        formatter: Slick.Formatters.SelectOption
    }];

    $scope.feeoptions = {
        editable: true,
        enableAddRow: false,
        enableCellNavigation: true,
        asyncEditorLoading: false,
        autoEdit: true
    };
      $scope.selectorg = function() {
        var FrmInfo = {};
        FrmInfo.title = "部门查询";
        FrmInfo.thead = [{
            name: "部门编码",
            code: "org_code"
        }, {
            name: "部门名称",
            code: "org_name"
        }];
        BasemanService.openCommonFrm(PopOrgController, $scope, FrmInfo)
            .result.then(function(result) {
                $scope.data.currItem.orgid = result.org_id;
                $scope.data.currItem.org_name = result.org_name;
                $scope.data.currItem.org_code = result.org_code;
            });
    };

    var _stateName = $rootScope.$state.$current.name;
    var data = localeStorageService.get(_stateName);

     if (data == undefined){ //非编辑
        var temp = localeStorageService.getHistoryItem($rootScope.$state.$current.name);
        if(temp){//历史纪录
            $scope.data.currItem = temp;
      
        }else{
            //需加增加，定时器，否则取不到登录用户信息
            $timeout(function () {
                $scope.new();
            });
        }
      }else{
        $scope.data.currItem = data;
        $scope.refresh(2);
        
        
    }

  // 打印
    $scope.doPrint= function(index)  {
         alert('index:'+index);
        BasemanService.setEditObj({key:"drp_cust_print",value:$scope.data.currItem.drp_custs[index].cust_id});
        $state.go("crmman.drp_cust_print");
    }  
   
};

// 打印
function Drp_GCust_Print($scope, $http, $rootScope,$timeout, $modal,$location, BasemanService,localeStorageService) {
        $scope.data = {};
 
        //cope.isEdit = false;
       //scope.EditStr = "打印";
       alert('print');
        var promise = BasemanService.RequestPost("Drp_Cust", "select", {cust_id: editObj.value});
        promise.then(function (data) {
            $scope.data.currItem = data;
        });

       //BasemanService.setEditObj({key: "", value: ""})
        
        
}

// 产品资料
angular.module('inspinia')
    .controller('Customer_Visit', Customer_Visit)
    .controller('Customer_Visit_Detail', Customer_Visit_Detail)
