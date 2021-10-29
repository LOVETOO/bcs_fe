var basemanControllers = angular.module('inspinia');
function bill_allinv_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    bill_allinv_headerEdit = HczyCommon.extend(bill_allinv_headerEdit, ctrl_bill_public);
    bill_allinv_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "bill_allinv_header",
        key: "allinv_id",
        wftempid:10137,
        FrmInfo: {},
        grids: [{optionname: 'options_13', idname: 'bill_allinv_lineofbill_allinv_headers'}]
    };

    /************************系统词汇**************************/
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
    /************************网格下拉**************************/

    /***************************弹出框***********************/
	 $scope.selectorg = function () {
        $scope.FrmInfo = {

            postdata: {},
            classid: "scporg",
            backdatas: "orgs",
            sqlBlock: "stat =2 and orgtype = 5",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
           var data = [];
            var index = $scope.options_13.api.getFocusedCell().rowIndex;
            var node = $scope.options_13.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data)
            }
            data[index].org_id = result.orgid;
            data[index].org_name = result.orgname;
            $scope.options_13.api.setRowData(data)
        });
    }
    
    $scope.selectcust = function () {
		var data = [];
		var index = $scope.options_13.api.getFocusedCell().rowIndex;
		 var node = $scope.options_13.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data)
            }
		 if (data[index].org_name == undefined || data[index].org_name == "") {
			BasemanService.notice("请先选业务部门", "alert-warning");
				return;
			}
        $scope.FrmInfo = {

            postdata: {},
            backdatas: "",
            classid: "customer",
			 sqlBlock: "(org_id=" + data[index].org_id
            + " or other_org_ids like '%," + data[index].org_id + ",%')",
            classid: "customer",
        };
			

        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			var data = [];
            var index = $scope.options_13.api.getFocusedCell().rowIndex;
            var node = $scope.options_13.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data)
            }
            
            data[index].cust_code = result.sap_code;
			data[index].cust_name = result.cust_name;
            $scope.options_13.api.setRowData(data)
        });
    }
	 $scope.selectmoneyid = function () {
        $scope.FrmInfo = {
            title: "货币查询",
            thead: [{
                name: "货币代码",
                code: "currency_code",
				  show: true,
                iscond: true,
                type: 'string'

            },{
                name: "货币名称",
                code: "currency_name",
				  show: true,
                iscond: true,
                type: 'string'

            },{
                name: "备注",
                code: "note",
				  show: true,
                iscond: true,
                type: 'string'

            }],
			
			is_custom_search: true,
			is_high:true,
            classid: "base_currency"
			
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
           var data = [];
            var index = $scope.options_13.api.getFocusedCell().rowIndex;
            var node = $scope.options_13.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data)
            }
            
            data[index].currency_name = result.currency_name;
            $scope.options_13.api.setRowData(data)

        });
    }
	$scope.selectpay_type = function () {
		 var data = [];
            var index = $scope.options_13.api.getFocusedCell().rowIndex;
            var node = $scope.options_13.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data)
            }
            
		if ( data[index].cust_code == undefined ||  data[index].cust_code == "") {
           BasemanService.notice("请先选客户", "alert-warning");
				return;
			}
        $scope.FrmInfo = {
            title: "付款方式查询",
            thead: [{
                name: "付款方式编码",
                code: "payment_type_code",
				  show: true,
                iscond: true,
                type: 'string'

            },{
                name: "付款方式名称",
                code: "payment_type_name",
				  show: true,
                iscond: true,
                type: 'string'

            }],
			
			is_custom_search: true,
			is_high:true,
            classid: "payment_type",
			sqlBlock: "(payment_type_id in ( select customer_payment_type.payment_type_id from customer , customer_payment_type where "
       +" customer.cust_id=customer_payment_type.cust_id and customer.sap_Code='"+data[index].cust_code+"'))"
        };
		
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
           var data = [];
            var index = $scope.options_13.api.getFocusedCell().rowIndex;
            var node = $scope.options_13.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data)
            }
            
            data[index].payment_type_name = result.payment_type_name;
            $scope.options_13.api.setRowData(data)


        });
    }
	 $scope.selectdname = function () {
        $scope.FrmInfo = {
            title: "会计期间查询",
            thead: [{
                name: "会计期间名称",
                code: "dname",
				  show: true,
                iscond: true,
                type: 'string'

            },{
                name: "会计期间年度",
                code: "period_year",
				  show: true,
                iscond: true,
                type: 'string'

            },{
                name: "PERIOD_ID",
                code: "period_id",
				  show: true,
                iscond: true,
                type: 'string'

            }],
			postdata:{flag:3},
			is_custom_search: true,
			is_high:true,
            classid: "fin_bud_period_header"
			
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
           var data = [];
            var index = $scope.options_13.api.getFocusedCell().rowIndex;
            var node = $scope.options_13.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data)
            }
            
            data[index].dname = result.dname;
            $scope.options_13.api.setRowData(data)


        });
    }
    /***********************网格处理事件***************************/
    //增加行
    $scope.addpo = function () {
        var data = [];
        var node = $scope.options_13.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        item = {
            seq:node.length+1,
            line_id: node.length + 1,
            item_name: "0",
            item_id: 0,
            bill_no:""
        };
        data.push(item);
        $scope.options_13.api.setRowData(data);
    };

    $scope.save_before=function(postdata){

         delete postdata.bill_allinv_lineofbill_allinv_headers;
    }
	//删除行
	 $scope.delpo =function(){
		var data = $scope.gridGetData("options_13");
        var rowidx = $scope.options_13.api.getFocusedCell().rowIndex;
        data.splice(rowidx, 1);
        $scope.options_13.api.setRowData(data);
	 }
    /************************网格定义区域**************************/
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
            cellRendererParams: {
                checkbox: true
            }
        };
$scope.columns_13 = [
        {
            headerName: "形式发票单号", field: "pi_no", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "业务员", field: "sales_user_id", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
                headerName: "贸易类型", field: "sale_ent_type", editable: true, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [{value: 1, desc: '进出口贸易'}, {value: 2, desc: '香港转口贸易'}, {value: 3, desc: '香港直营'}, {value: 5, desc: '空调直营'}]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },{
            headerName: "业务部门", field: "org_name", editable: true, filter: 'set', width: 150,
            cellEditor: "弹出框",
			action:$scope.selectorg,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "客户", field: "cust_code", editable: true, filter: 'set', width: 150,
            cellEditor: "弹出框",
            action:$scope.selectcust,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "货币名称", field: "currency_name", editable: true, filter: 'set', width: 150,
            cellEditor: "弹出框",
            action:$scope.selectmoneyid,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "付款方式", field: "payment_type_name", editable: true, filter: 'set', width: 150,
            cellEditor: "弹出框",
            action:$scope.selectpay_type,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "会计期间", field: "dname", editable: true, filter: 'set', width: 150,
            cellEditor: "弹出框",
			action:$scope.selectdname,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "费用项目", field: "fee_type", editable: true, filter: 'set', width: 150,
            cellEditor: "下拉框",
             cellEditorParams: {
                    values: [{value: 0, desc: '不可用'}, {value: 1, desc: '海运费'}, {value: 2, desc: '保险费'},
							{value: 3, desc: '佣金'}, {value: 4, desc: '返利'}, {value: 5, desc: '其他'},
							{value: 6, desc: '制版费'}, {value: 7, desc: '检验费'}, {value: 8, desc: '产品认证费'},
							{value: 9, desc: '仓储费'}, {value: 10, desc: '模具费'}, {value: 11, desc: '模具费-手续费'},
							{value: 12, desc: '其他商品销售成本（返包费）'}, {value: 13, desc: '差额调整'}, {value: 14, desc: '邮件、快件费'},
							{value: 15, desc: '使馆费'}, {value: 16, desc: 'LC调账'}, {value: 17, desc: '财务费用-押汇利息'},
							{value: 18, desc: '广告费'}, {value: 19, desc: '费用赔款'}, {value: 20, desc: '应收款调整'},
							{value: 21, desc: '坏账损失'}, {value: 22, desc: '海运费（费用类）'}, {value: 23, desc: '主营业务收入-外销-折扣折让'}]
                },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "发票金额", field: "invoice_amt", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "单据号", field: "bill_no", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "单据类型", field: "billtype", editable: true, filter: 'set', width: 150,
            cellEditor: "下拉框",
            cellEditorParams: {
                    values: [{value: 1, desc: '商业发票'}, {value: 2, desc: '费用发票'}, {value: 3, desc: 'SAP引入'},
							{value: 4, desc: '商业发票收工行'}]
                },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.options_13 = {
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
                var isGrouping = $scope.options_13.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
    /************保存校验区域**********/
    $scope.validate = function () {
        var errorlist = [];
		//delete $scope.data.currItem[""];
        var data=$scope.data.currItem.bill_allinv_lineofbill_allinv_headers;
        for(var i=0;i<data.length;i++){
            var seq=i+1;
            if(data[i].pi_no==undefined||data[i].pi_no==""){
                errorlist.push("发票明细第"+seq+"行PI号不能为空");
            }
         }

		for(var i=0;i<data.length;i++){
            var seq=i+1;
            if(data[i].org_name==undefined||data[i].org_name==""){
                errorlist.push("发票明细第"+seq+"行业务部门不能为空");
            }
         }
		for(var i=0;i<data.length;i++){
            var seq=i+1;
            if(data[i].cust_code==undefined||data[i].cust_code==""){
                errorlist.push("发票明细第"+seq+"行客户不能为空");
            }
         }
		 for(var i=0;i<data.length;i++){
            var seq=i+1;
            if(data[i].payment_type_name==undefined||data[i].payment_type_name==""){
                errorlist.push("发票明细第"+seq+"行付款方式不能为空");
            }
         }
		  for(var i=0;i<data.length;i++){
            var seq=i+1;
            if(data[i].sale_ent_type==undefined||data[i].sale_ent_type==""){
                errorlist.push("发票明细第"+seq+"行贸易类型不能为空");
            }
         }
		 for(var i=0;i<data.length;i++){
            var seq=i+1;
            if(data[i].dname==undefined||data[i].dname==""){
                errorlist.push("发票明细第"+seq+"行会计期间不能为空");
            }
         }
		  for(var i=0;i<data.length;i++){
            var seq=i+1;
            if(data[i].currency_name==undefined||data[i].currency_name==""){
                errorlist.push("发票明细第"+seq+"行货币名称不能为空");
            }
         }
		  for(var i=0;i<data.length;i++){
            var seq=i+1;
            if(data[i].fee_type==undefined||data[i].fee_type==""){
                errorlist.push("发票明细第"+seq+"行费用项目不能为空");
            }
			else if((data[i].fee_type==20)||(data[i].fee_type==21)&& data[i].invoice_amt<0)
			  {errorlist.push("费用项目不为应收款调整/坏账损失时发票金额只能大于0");} 
         }
		if (errorlist.length) {
            BasemanService.notify(notify,errorlist, "alert-danger");
            return false;
        }
        return true;
    }
	 $scope.save_before=function(){
			
       }

    /****************************初始化**********************/
	var myDate= new Date();
    $scope.clearinformation = function () {
        $scope.data = {};
        if (window.userbean) {
            $scope.userbean = window.userbean;
        };
        $scope.data.currItem = {
            creator: window.strUserId,
            stat: 1,			
            create_time:myDate.toLocaleDateString(),
            bill_allinv_lineofbill_allinv_headers:[]
        };
    };
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('bill_allinv_headerEdit', bill_allinv_headerEdit);
