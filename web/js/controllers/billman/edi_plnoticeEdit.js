var billmanControllers = angular.module('inspinia');
function edi_plnoticeEdit($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService,notify) {
    //继承基类方法
    edi_plnoticeEdit = HczyCommon.extend(edi_plnoticeEdit, ctrl_bill_public);
    edi_plnoticeEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "edi_plnotice",
        key:"corpserialid",
        wftempid:10144,
        FrmInfo: {},
		 grids: [{optionname: 'options_11', idname: 'edi_plnotice_lineofedi_plnotices'}]
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
		$scope.data.currItem.plreasoncode == undefined ? errorlist.push("可损原因") : 0;
        $scope.data.currItem.troverflag == undefined ? errorlist.push("是否委托我司追讨") : 0;
        $scope.data.currItem.financeflag == undefined ? errorlist.push("是否已办理贸易融资") : 0;
        $scope.data.currItem.ifinsuranturge == undefined ? errorlist.push("是否已签署《索赔权转让协议》") : 0;
        $scope.data.currItem.detainflag == undefined ? errorlist.push("是否已签署《赔款转让协议》") : 0;
        $scope.data.currItem.ifbankurge == undefined ? errorlist.push("是否已向保兑银行催款") : 0;
        $scope.data.currItem.ifarf == undefined ? errorlist.push("是否签署《应收账款转让协议》") : 0;

		
        if (errorlist.length) {
            BasemanService.notify(notify,errorlist, "alert-danger");
            return false;
        }
        return true;
    }
	
	
	
    /**----------------------保存校验区域-------------------*/
	
	$scope.refresh_after= function(){

	}
	/*---------------------刷新------------------------------*/
	
	$scope.refresh_after= function(){
        $scope.data.currItem.plreasoncode=Number($scope.data.currItem.plreasoncode);
        $scope.data.currItem.troverflag=Number($scope.data.currItem.troverflag);
        $scope.data.currItem.financeflag=Number($scope.data.currItem.financeflag);
        $scope.data.currItem.ifinsuranturge=Number($scope.data.currItem.ifinsuranturge);
        $scope.data.currItem.detainflag=Number($scope.data.currItem.detainflag);
        $scope.data.currItem.ifbankurge=Number($scope.data.currItem.ifbankurge);
        $scope.data.currItem.ifarf=Number($scope.data.currItem.ifarf);
		//复制历史
		if($scope.data.currItem.copy==1){
			$scope.data.currItem.corpserialid="";
		}
		
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
    /**---------------------权限控制-------------------*/
	

   


    /**********************下拉框值查询（系统词汇）***************/

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
    $scope.trueorfalses = [{id: 0, name: "否"}, {id: 1, name: "是"}];
	$scope.plreasoncodes =[{id:0,name:"拖欠"},{id:1,name:"拒收"},{id:2,name:"破产"},{id:3,name:"其他"}];
    
//刷新
 /**********************弹出框值查询**************************/
 
 $scope.selectorg = function () {
        $scope.FrmInfo = {

            postdata: {},
            classid: "scporg",
            backdatas: "orgs",
            sqlBlock: "stat =2 and orgtype = 5",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_id = parseInt(result.orgid);
            $scope.data.currItem.areano = result.code;
            $scope.data.currItem.areaname = result.orgname;
        });
    }
    
 $scope.selectbuyerno = function () {
        $scope.FrmInfo = {
        title: "买方代码查询",
		is_high: true,
            thead: [{
                    name: "中信保买方代码",
                    code: "buyerno",
					show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "客户编码",
                    code: "cust_code",
					show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "客户名称",
                    code: "cust_name",
					show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "买方英文名称",
                    code: "engname",
					show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "买方英文地址",
                    code: "engaddress",
					show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "买方中文地址",
                    code: "chnaddress",
					show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "买方中文名称",
                    code: "chnname",
					show: true,
                    iscond: true,
                    type: 'string'
                }],			
			is_custom_search: true,
            backdatas: "",
            sqlBlock: "",
            classid: "edi_buyerinfo",
			postdata:{}
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			$scope.data.currItem.sinosurebuyerno = result.buyerno;
			$scope.data.currItem.shtname = result.shtname;
            $scope.data.currItem.cust_code = result.cust_code;
			$scope.data.currItem.cust_name = result.cust_name;
			$scope.data.currItem.buyerengaddress = result.engaddress;
            $scope.data.currItem.buyerengname = result.engname;
            $scope.data.currItem.plreasoncode = result.plreasoncode;
        });
    }
	$scope.selectbankno = function () {
        $scope.FrmInfo = {
        title: "买方国家查询",
            thead: [{
                    name: "企业内部编码",
                    code: "corpserialno"
                }, {
                    name: "swift",
                    code: "bankswift"
                }, {
                    name: "中文名称",
                    code: "chnname"
                }, {
                    name: "英文名称",
                    code: "engname"
                }, {
                    name: "国家代码",
                    code: "countrycode"
                }, {
                    name: "英文地址",
                    code: "address"
                }],			
			is_custom_search: true,
            backdatas: "",
            sqlBlock: "",
            classid: "edi_bankinfo",
			postdata:{}
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			$scope.data.currItem.bizopenbankno = result.bankswift;
			$scope.data.currItem.openbankengname = result.engname;
            $scope.data.currItem.openbankaddress = result.address;
        });
    }
	
	$scope.selectbs = function () {
        $scope.FrmInfo = {
        title: "买方国家查询",
            thead: [{
                    name: "企业内部编码",
                    code: "corpserialno"
                }, {
                    name: "swift",
                    code: "bankswift"
                }, {
                    name: "中文名称",
                    code: "chnname"
                }, {
                    name: "英文名称",
                    code: "engname"
                }, {
                    name: "国家代码",
                    code: "countrycode"
                }, {
                    name: "英文地址",
                    code: "address"
                }],			
			is_custom_search: true,
            backdatas: "",
            sqlBlock: "",
            classid: "edi_bankinfo",
			postdata:{}
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			$scope.data.currItem.bizexbankno = result.bankswift;
			$scope.data.currItem.exbankengname = result.engname;
            $scope.data.currItem.exbankaddress = result.address;
        });
    }
   
     $scope.addline11 =function(){
      $scope.FrmInfo = {
            title: "出运申报查询",
            thead: [{
                    name: "发票号码",
                    code: "invoiceno"
                }, {
                    name: "海关代码",
                    code: "code10"
                }, {
                    name: "出运日期",
                    code: "transportdate"
                }, {
                    name: "申报日期",
                    code: "applytime"
                }, {
                    name: "支付条件",
                    code: "paymode"
                }, {
                    name: "应付款日期",
                    code: "create_time"
                }],			
			is_custom_search: true,
            backdatas: "",
            sqlBlock: " stat=5",
            classid: "edi_shipmentapplyinfo",
			postdata:{flag:1}
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			result.shouldpaydate=result.create_time;
			result.shouldsum =result.premium;
			result.stat ="未处理";
			result.plsum =result.insuresum;
			result.names  =result.payername
			$scope.data.currItem.bizopenbankno = result.bankno;
			//$scope.data.currItem.cust_name = result.cust_name;
            $scope.data.currItem.openbankengname = result.bankengname;
			$scope.data.currItem.openbankaddress = result.bankaddr;
			$scope.data.currItem.sinosurebuyerno = result.buyerno;
            $scope.data.currItem.buyerengname = result.buyerengname;
			
			$scope.data.currItem.buyerengaddress = result.buyerengaddr;
			$scope.data.currItem.cust_code = result.cust_code;
            $scope.data.currItem.cust_name = result.cust_name;	
			
			$scope.data.currItem.areano = result.org_code;
			$scope.data.currItem.areaname = result.org_name;
            $scope.data.currItem.shtname = result.shtname;
			
			var data=$scope.gridGetData("options_11");
			data.push(result);
			$scope.data.currItem.edi_plnotice_lineofedi_plnotices=data;
			$scope.options_11.api.setRowData(data);
			
        });
	 }
     
	 $scope.delline11 =function(){
		var data = $scope.gridGetData("options_11");
        var rowidx = $scope.options_11.api.getFocusedCell().rowIndex;
        data.splice(rowidx, 1);
        $scope.options_11.api.setRowData(data);
	 }
	/**************************网格定义******************************/
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

    //资金预览
    $scope.options_11 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_11.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
	
	$scope.columns_11 = [
        {
            headerName: "海关代码", field: "code10", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "出运日期", field: "transportdate", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "申报日期", field: "applytime", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "发票金额", field: "invoicesum", editable: true, filter: 'set', width: 150,
            cellEditor: "浮点框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "支付条件", field: "paymode", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "应付款日期", field: "shouldpaydate", editable: true, filter: 'set', width: 150,
            cellEditor: "年月日",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "发票号", field: "invoiceno", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "投保金额", field: "insuresum", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "信保确认的收汇状态", field: "stat", editable: false, filter: 'set', width: 150,
            cellEditor: "下拉框",
			cellEditorParams: {values: [{value:0,desc:"未收汇"},{value:1,desc:"完全收汇"},{value:2,desc:"部分收汇"},{value:3,desc:"视同收汇"}]},
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "可损金额", field: "plsum", editable: true, filter: 'set', width: 150,
            cellEditor: "浮点框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "出口企业名称", field: "names", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
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
    .controller('edi_plnoticeEdit', edi_plnoticeEdit)

