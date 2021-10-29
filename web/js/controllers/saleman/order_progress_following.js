/**
 * 订单进度跟踪表
 */
function order_progress_following($scope, $location, $rootScope, $modal, $timeout, BasemanService, BaseService, notify, $state, localeStorageService, FormValidatorService) {
    $scope.data = {};
    $scope.data.currItem = {};

    //获取用户登录信息
    var role = window.userbean.stringofrole.indexOf("order_clerk"); //用户角色是否为‘订单员’
    var isAdmin = window.userbean.isAdmin; //用户是否管理员

    //网格设置
    $scope.headerOptions = {
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: false, //one of [true, false]
        enableFilter: false, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowDeselection: false,
        quickFilterText: null,
        rowDoubleClicked: $scope.dgLineDblClick,
        rowClicked: $scope.dgLineClick,
        cellEditingStopped: $scope.cellchange,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        // groupColumnDef: groupColumn,
        ColumnDef: $scope.lineColumns,
        showToolPanel: false,
        toolPanelSuppressSideButtons: true,
        rowHeight: 30
    };

    //定义网格字段-列表页
    $scope.headerColumns = [
        {   id: "id",
            headerName: "序号",
            field: "id",
            width: 59
        }, {
            id: "stat",
            headerName: "状态",
            field: "stat",
            width: 60,
            cellEditor: "下拉框",
            cellEditorParams: {values:[]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            type: "list"
        }, {
            id: "customer_code",
            headerName: "客户编码",
            field: "customer_code",
            width: 90,
            type:"string"
        }, {
            id: "customer_name",
            headerName: "客户名称",
            field: "customer_name",
            width: 230,
            type:"string"
        },{
            id: "sa_salebillno",
            headerName: "订货单号",
            field: "sa_salebillno",
            width: 130,
            type:"string"
        },  {
            id: "attribute1",
            headerName: "ERP订单号",
            field: "attribute1",
            width: 110,
            type:"string"
        },{
            headerName: "产品编码",
            id: "item_code",
            field: "item_code",
            width: 100
        }, {
            headerName: "产品名称",
            id: "item_name",
            field: "item_name",
            width: 200
        },{
            id: "date_invbill",
            headerName: "订货日期",
            field: "date_invbill",
            width: 110,
            cellEditor: "年月日",
            type:"date"
        }, {
            id: "wf_date",
            headerName: "审核日期",
            field: "wf_date",
            width: 110,
            cellEditor: "年月日",
            type:"date"
        }, {
            id: "discount_before_price",
            headerName: "折前单价",
            field: "discount_before_price",
            width: 100,
            cellEditor: "浮点框",
            cssClass:"amt",
            type:"string"
        },{
            id: "price_bill",
            headerName: "折后单价",
            field: "price_bill",
            width: 100,
            cellEditor: "浮点框",
            cssClass:"amt",
            type:"string"
        },{
            headerName: "折前订货金额",
            id: "amount_bill_f",
            field: "amount_bill_f",
            width: 120,
            cssClass:"amt",
            cellEditor: "浮点框",
            type:"string"
        },{
            headerName: "折后订货金额",
            id: "attribute41",
            field: "attribute41",
            width: 120,
            cssClass:"amt",
            cellEditor: "浮点框",
            type:"string"
        },{
            id: "amount_total_f",
            headerName: "折前订货总额",
            field: "amount_total_f",
            width: 130,
            cssClass:"amt",
            cellEditor: "浮点框",
            type:"string"
        } ,{
            id: "wtamount_billing",
            headerName: "折后订货总额",
            field: "wtamount_billing",
            width: 130,
            cssClass:"amt",
            cellEditor: "浮点框",
            type:"string"
        },
        //数量
        {
            headerName: "基本单位",
            id: "uom_name",
            field: "uom_name",
            width: 100
        },{
            headerName: "订货数量",
            id: "sa_qty_bill",
            field: "sa_qty_bill",
            width: 100,
            cellEditor: "整数框",
            type:"number"
        },{
            headerName: "订单交期",
            id: "note",
            field: "note",
            width: 200
        },{
            id: "inv_qty_bill",
            headerName: "出库数量",
            field: "inv_qty_bill",
            width: 90,
            cellEditor: "整数框",
            type:"number"
        }, {
            id: "noinv_qty_bill",
            headerName: "尚未出库数量",
            field: "noinv_qty_bill",
            width: 120,
            cellEditor: "整数框",
            type:"number"
        },{
            id: "qty_recbill",
            headerName: "签收数量",
            field: "qty_recbill",
            width: 100,
            cellEditor: "整数框",
            type:"number"
        }, {
            id: "no_qty_recbill",
            headerName: "签收差异数量",
            field: "no_qty_recbill",
            width: 120,
            cellEditor: "整数框",
            type:"number"
        },
        {
            id: "wtamount_bill_f",
            headerName: "折前出库金额",
            field: "wtamount_bill_f",
            width: 120,
            cellEditor: "浮点框",
            cssClass:"amt",
            type:"string"
        },{
            id: "inv_amount_bill_f",
            headerName: "折后出库金额",
            field: "inv_amount_bill_f",
            width: 120,
            cellEditor: "浮点框",
            cssClass:"amt",
            type:"string"
        },{
            id: "confirm_out_qty",
            headerName: "开票数量",
            field: "confirm_out_qty",
            width: 100,
            cellEditor: "整数框",
            type:"number"
        },{
            id: "invoice_no",
            headerName: "发票号码",
            field: "invoice_no",
            width: 150,
            type:"string"
        }, {
            headerName: "备注",
            id: "remark",
            field: "remark",
            width: 200
        }
    ];

    var warehouse_code = {
        id: "warehouse_code",
            headerName: "出库仓编码",
        field: "warehouse_code",
        width: 110,
        type:"string"
    }
    var warehouse_name = {
        id: "warehouse_name",
            headerName: "出库仓名称",
            field: "warehouse_name",
            width:180,
            type:"string"
    }

    //加载词汇
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            HczyCommon.stringPropToNum(data.dicts);
            for (var i = 0; i < data.dicts.length; i++) {
                var object = {};
                object.value = data.dicts[i].dictvalue;
                object.desc = data.dicts[i].dictname;
                $scope.headerColumns[$scope.getIndexByField('headerColumns', 'stat')].cellEditorParams.values.push(object);
            }
        });

    //获取网格列属性对应的索引
    $scope.getIndexByField = function (columns, field) {
        for (var i = 0; i < $scope[columns].length; i++) {
            if ($scope[columns][i].field == field) {
                return i;
                break;
            }
        }
        return false
    }

    /**
     * 查询主列表数据
     */
    $scope.searchData = function (postdata) {
        if(role != -1 || isAdmin){
            var idx = $scope.getIndexByField("headerColumns","remark");
            $scope.headerColumns.splice(idx, 0, warehouse_code, warehouse_name);
        }
        if (!postdata) {
            $scope.oldPage = 1;
            $scope.currentPage = 1;
            if (!$scope.pageSize) {
                $scope.pageSize = "20";
            }
            $scope.totalCount = 1;
            $scope.pages = 1;
            postdata = {
                pagination: "pn=1,ps=20,pc=0,cn=0,ci=0"
            }
        }
        if ($scope.sqlwhere && $scope.sqlwhere !=""){
            postdata.sqlwhere = $scope.sqlwhere
        }

        BasemanService.RequestPost("order_progress_following", "search", postdata)
            .then(function (data) {
                // $scope.data.currItem = data;
                loadGridData($scope.headerOptions, data.order_progress_followings);
                BaseService.pageInfoOp($scope, data.pagination);
        });
    }

    /**
     * 选择产品
     */
    $scope.searchitem = function () {
        BasemanService.chooseItem({
            title: '选择产品',
            scope: $scope,
            then: function (data) {
                $scope.data.currItem.item_id = data.item_id;
                $scope.data.currItem.item_code = data.item_code;
                $scope.data.currItem.item_name = data.item_name;
            }
        });
    }

    //清除通用查询条件
    $scope.clearCondition = function (name) {
        if (name == 'item') {
            $scope.data.currItem.item_id = 0;
            $scope.data.currItem.item_code = undefined;
            $scope.data.currItem.item_name = undefined;
        }
        if (name == 'sabillno') {
            $scope.data.currItem.sa_salebillno = undefined;
        }
        if (name == 'erpsabillno') {
            $scope.data.currItem.attribute1 = undefined;
        }
    }

    /**
     * 按条件查询
     */
    $scope.searchByCon = function () {
        $scope.sqlwhere = "";
        var sqlwhere = "";
        var postdata = {};
        if($scope.data.currItem.sa_salebillno){
            sqlwhere += " and lower(h.sa_salebillno) like lower('%"+$scope.data.currItem.sa_salebillno+"%')";
        }
        if($scope.data.currItem.attribute1){
            sqlwhere += " and h.attribute1 like '%"+$scope.data.currItem.attribute1+"%'";
        }
        if($scope.data.currItem.item_id > 0){
            sqlwhere += " and l.item_id = "+$scope.data.currItem.item_id;
        }
        //产品编码支持手动输入查询
        if($scope.data.currItem.item_code && $scope.data.currItem.item_id <= 0){
            sqlwhere += " and item.item_code = '"+$scope.data.currItem.item_code + "' ";
        }
        if(sqlwhere != ""){
            $scope.sqlwhere = sqlwhere;

        }
        $scope.searchData();
    }

    /**
     * 产品编码值改变时触发事件
     */
    $scope.codeChange = function () {
        $scope.data.currItem.item_id = 0;
        $scope.data.currItem.item_name = undefined;
    }
    
    
    /**
     * 加载网格数据
     */
    function loadGridData(gridOptions, datas) {
        var index = $scope.pageSize*($scope.currentPage-1);
        //加序号
        if (datas.length > 0) {
            for (var i = 0; i < datas.length; i++) {
                datas[i].id = index + i + 1;
            }
        }
        //设置数据
        gridOptions.api.setRowData(datas);
    }

    //网格高度自适应 , 控制器后面调用：
    BasemanService.initGird();

    //初始化分页
    BaseService.pageGridInit($scope);
}
//注册控制器
angular.module('inspinia')
    .controller('ctrl_order_progress_following', order_progress_following)