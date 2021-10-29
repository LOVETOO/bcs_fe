var billmanControllers = angular.module('inspinia');
function fin_tddf_headerEdit($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService,notify) {
    //继承基类方法
    fin_tddf_headerEdit = HczyCommon.extend(fin_tddf_headerEdit, ctrl_bill_public);
    fin_tddf_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本
	$scope.objconf = {
        name: "fin_tddf_header",
        key:"tddf_id",
        wftempid:10074,
        FrmInfo: {},
		grids:[{optionname: 'options_5', idname: 'fin_tddf_headers'}]
    };

    /************************初始化页面***********************/
	var myDate= new Date();
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            stat: 1,
            create_time:myDate.toLocaleDateString()
        };
    };
    /**---------------------初始化页面----------------------*/
    /***********************保存校验区域*********************/
    $scope.validate = function () {
        var errorlist = [];
        $scope.data.currItem.invoice_no == undefined ? errorlist.push("发票流水号为空") : 0;
        $scope.data.currItem.td_order == undefined ? errorlist.push("提单号为空") : 0;
        $scope.data.currItem.discharged_type == undefined ||$scope.data.currItem.discharged_type==0 ? errorlist.push("放单类型为空") : 0;
        if (errorlist.length) {
            BasemanService.notify(notify,errorlist, "alert-danger");
            return false;
        }
        return true;
    }
	
	$scope.refresh_after= function(){
        $scope.data.currItem.discharged_type=Number($scope.data.currItem.discharged_type);
        $scope.setbill_invoice_funds_line();
	}
	/***********************权限控制*********************/

	if (window.userbean) {
        $scope.userbean = window.userbean;
    }
    //用户权限
    $scope.user_auth = {
        //知否有区域总监权限
        area_auth: false
    };
    //业务员,区总,系总,财务,事总权限
	var mystring = $scope.userbean.stringofrole;
    $scope.user_auth.saleman_auth = mystring.indexOf("销售人员") > -1 ? true : false;
    $scope.user_auth.areamanager_auth = mystring.indexOf("大区总监") > -1 ? true : false;
    $scope.user_auth.system_auth = mystring.indexOf("外总") > -1 ? true : false;
    $scope.user_auth.departmen_auth = mystring.indexOf("事总") > -1 ? true : false;
    $scope.user_auth.infance_auth = mystring.indexOf("财务部") > -1 ? true : false;
    $scope.user_auth.admin_auth = mystring.indexOf("admin") > -1 ? true : false;

    /**---------------------权限控制-------------------*/
    $scope.save_before = function () {

    }
    /**********************下拉框值查询（系统词汇）***************/
    // $scope.setgridstat = function (stat) {
    //     //if(data.stat && data.stat != 1){
    //     if (stat == undefined) {
    //         return;
    //     }
    //     for (var i = 0; i < $scope.objconf.grids.length; i++) {
    //         if ($scope[$scope.objconf.grids[i].optionname].columnApi) {
    //             var allcol = $scope[$scope.objconf.grids[i].optionname].columnApi.getAllColumns();
    //
    //             if (parseInt(stat) > 1) {
    //                 for (var j = 0; j < allcol.length; j++) {
    //                     allcol[j].colDef.editable = false;
    //                 }
    //             } else {
    //                 var defaultcols = $scope[$scope.objconf.grids[i].optionname].defaultColumns;
    //                 if (defaultcols) {
    //                     for (var j = 0; j < allcol.length; j++) {
    //                         if (defaultcols[j] && allcol[j].colDef && allcol[j].colDef.field == defaultcols[j].field) {
    //
    //                             allcol[j].colDef.editable = defaultcols[j].editable;
    //                         }
    //                     }
    //                 }
    //             }
    //
    //         }
    //         if ($scope.objconf.grids[i].line && $scope[$scope.objconf.grids[i].line.optionname].columnApi) {
    //             var allcol = $scope[$scope.objconf.grids[i].line.optionname].columnApi.getAllColumns();
    //             if (stat && parseInt(stat) > 1) {
    //                 for (var j = 0; j < allcol.length; j++) {
    //                     allcol[j].colDef.editable = false;
    //                 }
    //             } else {
    //                 var defaultcols = $scope[$scope.objconf.grids[i].line.optionname].defaultColumns;
    //                 if (defaultcols) {
    //                     for (var j = 0; j < allcol.length; j++) {
    //                         if (defaultcols[j] && allcol[j].colDef && allcol[j].colDef.field == defaultcols[j].field) {
    //                             allcol[j].colDef.editable = defaultcols[j].editable;
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     //下拉选项是否可编辑
    //     $timeout(function () {
    //         if ($scope.data.currItem.stat == 1) {
    //             $("select.chosen-select").each(function () {
    //
    //                 var _this = $(this);
    //                 var c_disbled = false;
    //                 if (_this[0].disabled && _this.attr("readonly")) {
    //                     c_disbled = true;
    //                 }
    //                 _this.attr('disabled', c_disbled).trigger("chosen:updated");
    //             });
    //         } else {
    //             $("select.chosen-select").each(function () {
    //                 var _this = $(this);
    //                 var c_disbled = false;
    //                 _this.attr('disabled', c_disbled).trigger("chosen:updated");
    //             });
    //         }
    //     }, 1000);
    // };
    //状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        var stats = [];
        for (var i = 0; i < data.dicts.length; i++) {
            object = {};
            object.id = data.dicts[i].dictvalue;
            object.name = data.dicts[i].dictname;
            stats.push(object);
        }
        $scope.stats = stats;
    })
    //放单类型discharged_type
    $scope.discharged_types=[{dictvalue:1,dictname:"电放"},{dictvalue:2,dictname:"寄单"}];

    /*********************流程控制**************************/
    // $scope.wfstart_validDate = function (e) {
    //     var msg = []
    //     if($scope.userbean.stringofrole.indexOf("销售人员")&& $scope.data.currItem.currprocid==2){
    //         if($scope.data.currItem.discharged_type==1){
    //             $scope.data.currItem.apply_man==undefined|| $scope.data.currItem.apply_man==""? msg.push("申请负责人不能为空"):0;
    //             $scope.data.currItem.apply_call==undefined|| $scope.data.currItem.apply_call==""? msg.push("申请人电话不能为空"):0;
    //             $scope.data.currItem.apply_phone==undefined|| $scope.data.currItem.apply_phone==""? msg.push("申请人手机不能为空"):0;
    //             $scope.data.currItem.qy_user==undefined|| $scope.data.currItem.qy_user==""? msg.push("国家经理不能为空"):0;
    //             $scope.data.currItem.receiv_man==undefined|| $scope.data.currItem.receiv_man==""? msg.push("收货人信息不能为空"):0;
    //         }
    //         if($scope.data.currItem.discharged_type==2){
    //             $scope.data.currItem.receive_com==undefined|| $scope.data.currItem.receive_com==""? msg.push("收件人不能为空"):0;
    //             $scope.data.currItem.receive_address==undefined|| $scope.data.currItem.receive_address==""? msg.push("收件货地址不能为空"):0;
    //             $scope.data.currItem.country==undefined|| $scope.data.currItem.country==""? msg.push("国家不能为空"):0;
    //             $scope.data.currItem.email==undefined|| $scope.data.currItem.email==""? msg.push("邮编不能为空"):0;
    //             $scope.data.currItem.contact==undefined|| $scope.data.currItem.contact==""? msg.push("联系人不能为空"):0;
    //
    //             $scope.data.currItem.receive_phone==undefined|| $scope.data.currItem.receive_phone==""? msg.push("电话号码不能为空"):0;
    //             $scope.data.currItem.city==undefined|| $scope.data.currItem.city==""? msg.push("城市不能为空"):0;
    //             $scope.data.currItem.express_name==undefined|| $scope.data.currItem.express_name==""? msg.push("快递公司名称不能为空"):0;
    //             $scope.data.currItem.express_code==undefined|| $scope.data.currItem.express_code==""? msg.push("寄单号不能为空"):0;
    //         }
    //     }
    //     if (msg.length > 0) {
    //         BasemanService.notice(msg);
    //         return false;
    //     }
    //     return true;
    // }

    /**********************弹出框值查询**************************/
//发票流水号
 $scope.selectinvoice_no = function () {
     if($scope.data.currItem.stat!=1){
         return
     }
        $scope.FrmInfo = {
            title: "发票流水号查询",
            thead: [{
                name: "商业发票号",
                code: "invoice_no",
				  show: true,
                iscond: true,
                type: 'string'

            },{
                name: "实际发票号",
                code: "fact_invoice_no",
				  show: true,
                iscond: true,
                type: 'string'

            },{
                name: "形式发票号",
                code: "pi_no",
				  show: true,
                iscond: true,
                type: 'string'

            },{
                name: "发票金额",
                code: "invoice_amt",
				  show: true,
                iscond: true,
                type: 'string'

            },{
                name: "业务部门",
                code: "org_code",
				  show: true,
                iscond: true,
                type: 'string'

            },{
                name: "客户",
                code: "cust_code",
				  show: true,
                iscond: true,
                type: 'string'

            }],
            classid: "bill_invoice_header",
			postdata: {s_flag:10},
            sqlBlock: "stat = 5 and notice_ids  is not null"
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            result.stat = $scope.data.currItem.stat;
            result.creator = $scope.data.currItem.creator;
            result.create_time = $scope.data.currItem.create_time;
            result.wfid = 0;
            result.wfflag = 0;
            result.checkor = '';
            result.check_time = '';

            $scope.data.currItem.apply_call = "";
            $scope.data.currItem.apply_fax = "";
            $scope.data.currItem.apply_man = "";
            $scope.data.currItem.apply_phone = "";
            $scope.data.currItem.apply_reason = "";

            $scope.data.currItem.receive_address = "";
            $scope.data.currItem.receive_com = "";
            $scope.data.currItem.receive_fax = "";
            $scope.data.currItem.receive_phone = "";

            $scope.data.currItem.fulfill_date = "";
            $scope.data.currItem.fulfill_man = "";

            $scope.data.currItem.note = "";

            //copy result to $scope.data.currItem
            HczyCommon.stringPropToNum(result);
            for (name in result) {
                $scope.data.currItem[name] = result[name];
            }
            $scope.data.currItem.org_code = result.org_code;
            $scope.data.currItem.ship_date = result.actual_ship_date;
            $scope.setbill_invoice_funds_line();
        })
    }
    $scope.setbill_invoice_funds_line = function () {
        BasemanService.RequestPost("bill_invoice_header", "getpayline", {invoice_id: $scope.data.currItem.invoice_id})
			.then(function (returnData) {
            $scope.data.currItem.seaport_in_code=returnData.seaport_in_code;
            $scope.data.currItem.seaport_in_id=returnData.seaport_in_id;
            $scope.data.currItem.seaport_in_name=returnData.seaport_in_name;
            $scope.data.currItem.invoice_amt=returnData.invoice_amt;
            $scope.data.currItem.invoice_amt=returnData.invoice_amt;
            $scope.data.currItem.tt_amt=returnData.tt_amt;
                var data=returnData.bill_invoice_funds_lineofbill_invoice_headers;
                $scope.data.currItem.alloamt=0;
                for(var i=0;i<data.length;i++){
                    var seq=i+1;
                    if(data[i].allo_amt!=""){
                        $scope.data.currItem.alloamt+=parseFloat(data[i].allo_amt);
                    }
                }
			$scope.gridSetData("options_5",returnData.bill_invoice_funds_lineofbill_invoice_headers);
        })

    }
    //业务部门
	 $scope.selectorg = function () { 
       
    }
	//客户
	$scope.selectcust = function () {

	}
	//通知单号
	$scope.selectnotice_no = function () {
    }
	//收货人公司名称
	$scope.selectre_com = function () {
        if($scope.data.currItem.stat!=1){
            return
        }
        $scope.FrmInfo = {
			is_high:true,
			is_custom_search:true,
            title: "收货人公司查询",
            thead: [{
                name: "收货人公司名称",
                code: "receive_com",
				 show: true,
                iscond: true,
                type: 'string'

            }, {
                name: "收货人地址",
                code: "receive_address",
				show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "联系人电话",
                code: "receive_phone",
				show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "传真",
                code: "receive_fax",
				show: true,
                iscond: true,
                type: 'string'
            }],
            classid: "fin_tddf_header",
			postdata: {flag:2},
			//sqlBlock: "cust_id="+ $scope.data.currItem.cust_code
        };
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
			for (name in result) {
                $scope.data.currItem[name] = result[name];
            }
			 
        });
    }
	$scope.selectqy_user = function () {
        if(!($scope.data.currItem.stat!=5&&userbean.stringofrole.indexOf('销售人员')>-1)){
            return;
        }
        $scope.FrmInfo = {
			is_high:true,
			is_custom_search:true,
            title: "国家经理",
            thead: [{
                name: "用户编码",
                code: "userid",
				 show: true,
                iscond: true,
                type: 'string'

            }, {
                name: "用户名称",
                code: "username",
				show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "机构ID",
                code: "sourceorgid",
				show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "机构路径",
                code: "namepath",
				show: true,
                iscond: true,
                type: 'string'
            }],
			backdatas: "users",
            classid: "scpuser",
			searchlist:["userid","username","sourceorgid"],
        };
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
			$scope.data.currItem.qy_user = result.userid 
        });
    }
//寄单地址
$scope.selectsend_addr = function () {
    if($scope.data.currItem.stat!=1){
        return
    }
        $scope.FrmInfo = {
			is_custom_search:true,
            title: "寄单地址查询",
            thead: [{
                name: "寄单地址",
                code: "send_addr",
				 show: true,
                iscond: true,
                type: 'string'}],

            classid: "fin_tddf_header",
			
        };
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
			$scope.data.currItem.send_addr = result.send_addr 
        });
    }
 //分组功能
    var groupColumn = {
        headerName: "Group",
        width: 200,
        field: 'name',
        valueGetter: function (params) {
            if (params.node.group) {
                return params.node.key;
            } else {
                return params.data[params.colDef.field];
            }
        },
        comparator: agGrid.defaultGroupComparator,
        cellRenderer: 'group',
        cellRendererParams: function (params) {
        }
    };	
	//网格定义
    $scope.options_5 = {
            rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
            pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
            groupKeys: undefined,
            groupHideGroupColumns: false,
            enableColResize: true, //one of [true, false]
            enableSorting: true, //one of [true, false]
            enableFilter: true, //one of [true, false]
            enableStatusBar: false,
            enableRangeSelection: true,
            rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
            rowDeselection: false,
            quickFilterText: null,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            groupColumnDef: groupColumn,
            showToolPanel: false,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_5.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
    $scope.columns_5 = [{
            headerName: "分配单号", field: "allo_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "资金系统单号", field: "other_no", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "分配金额", field: "allo_amt", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "创建时间", field: "create_time", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "到款类型", field: "funds_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: [{value: 1, desc: 'TT'}, {value: 2, desc: 'LC'}, {value: 3, desc: 'OA'}, {value: 4, desc: '领导特批'}]
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    //数据缓存
    $scope.initdata();
}
//加载控制器
billmanControllers
    .controller('fin_tddf_headerEdit', fin_tddf_headerEdit)
