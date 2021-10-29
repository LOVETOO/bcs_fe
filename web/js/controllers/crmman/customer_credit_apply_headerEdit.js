var billmanControllers = angular.module('inspinia');
function customer_credit_apply_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    customer_credit_apply_headerEdit = HczyCommon.extend(customer_credit_apply_headerEdit, ctrl_bill_public);
    customer_credit_apply_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "customer_credit_apply_header",
        key: "apply_id",
        wftempid:10171,
        FrmInfo: {},
        grids: [{optionname: 'options_11', idname: 'customer_credit_apply_lineofcustomer_credit_apply_headers'}]
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
    });
    /***************************弹出框***********************/
    //大区
    $scope.Zone_Name = function () {
        $scope.FrmInfo = {
            classid: "scporg",
            postdata: {},
            backdatas: "orgs",
            sqlBlock:"1=1 and stat =2 and OrgType = 3"
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            var focusRow=$scope.gridGetRow("options_11");
            focusRow.zone_code=result.code;
            focusRow.zone_name=result.orgname;
            focusRow.org_id=result.orgid;
            focusRow.superid=result.orgid;
            $scope.gridUpdateRow("options_11",focusRow);
        });
    };
    //部门
    $scope.Org_Name = function () {
        var focusRow=$scope.gridGetRow("options_11");
        if(focusRow.zone_name==""||focusRow.zone_name==undefined){
            BasemanService.notice("请选择大区！", "alter-warning")
            return;
        }
        $scope.FrmInfo = {
            classid: "scporg",
            postdata:{superid:focusRow.superid},
            backdatas: "orgs",
            sqlBlock:"1=1 and stat =2 and OrgType = 5"
        };
//         $scope.FrmInfo.sqlBlock="1=1 and stat =2 and OrgType = 5 and org_id="+focusRow.org_id;
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            var focusRow=$scope.gridGetRow("options_11");
            focusRow.org_code=result.code;
            focusRow.org_name=result.orgname;
            focusRow.org_id=result.orgid;
            $scope.gridUpdateRow("options_11",focusRow);
        });
    };
    //客户编码
    $scope.Cust_Code = function () {
        var focusRow=$scope.gridGetRow("options_11");
        if(focusRow.org_name==""||focusRow.org_name==undefined){
            BasemanService.notice("请选择部门！", "alter-warning")
            return;
        }
        $scope.FrmInfo = {
            classid: "customer",
            postdata: {}
        };
        if(focusRow.org_id > 0) {
            $scope.FrmInfo.sqlBlock = "(org_id =" + focusRow.org_id
                + " or other_org_ids like '%," + focusRow.org_id + ",%')";
        }else{
            $scope.FrmInfo.sqlBlock = "1=1";
        }
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {

            BasemanService.RequestPost("customer", "select", {cust_id: result.cust_id})
                .then(function (data) {
                    focusRow.old_oa_standard_amt=data.customer_oa_lineofcustomers[0].oa_standard_amt;
                    focusRow.cust_code=result.sap_code;
                    focusRow.cust_name=result.cust_name;
                    focusRow.cust_id=result.cust_id;
                    $scope.gridUpdateRow("options_11",focusRow);
                })
        });
    };
    //付款方式
    $scope.Payment_type_name = function () {
        var focusRow=$scope.gridGetRow("options_11");
        if(focusRow.cust_id==""||focusRow.cust_id==undefined){
            BasemanService.notice("请选择客户！", "alter-warning")
            return;
        }
        $scope.FrmInfo = {
            classid: "customer",
            is_custom_search: true,
            title: "客户",
            is_high: true,
            thead: [
                {
                    name: "客户编码",
                    code: "cust_code",
                    show: true,
                    iscond: true,
                    type: 'string'

                }, {
                    name: "付款方式",
                    code: "payment_type_name",
                    show: true,
                    iscond: true,
                    type: 'string'
                }],
            postdata:{cust_id:focusRow.cust_id},
            action:"getpayline",
            backdatas:"customer_payment_typeofcustomers"
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            focusRow.payment_type_name=result.payment_type_name;
            focusRow.payment_type_code=result.payment_type_code;
            focusRow.payment_type_id=result.payment_type_id;
            $scope.gridUpdateRow("options_11",focusRow);
        });
    };
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
    $scope.columns_11= [
        {
            headerName: "大区", field: "zone_name", editable: true, filter: 'set', width: 120,
            cellEditor: "弹出框",
            action: $scope.Zone_Name,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
        ,{
            headerName: "部门", field: "org_name", editable: true, filter: 'set', width: 150,
            cellEditor: "弹出框",
            action: $scope.Org_Name,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "客户编码", field: "cust_code", editable: true, filter: 'set', width: 150,
            cellEditor: "弹出框",
            action: $scope.Cust_Code,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
        ,{
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "付款方式", field: "payment_type_name", editable: true, filter: 'set', width: 150,
            cellEditor: "弹出框",
            action: $scope.Payment_type_name,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "原授信额度", field: "old_oa_standard_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "申请授信额度", field: "oa_standard_amt", editable: true, filter: 'set', width: 120,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "调整原因", field: "note", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.options_11={
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
 /***********************保存校验区域*********************/
    $scope.validate = function () {
        var errorlist = [];
        if (errorlist.length) {
            BasemanService.notify(notify,errorlist, "alert-danger");
            return false;
        }
        return true;
    };
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
            customer_credit_apply_lineofcustomer_credit_apply_headers:[]
        };
    };
    $scope.initdata();
}

//加载控制器
billmanControllers
    .controller('customer_credit_apply_headerEdit', customer_credit_apply_headerEdit);
