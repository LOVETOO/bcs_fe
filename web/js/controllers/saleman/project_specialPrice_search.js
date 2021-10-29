/**
 * 订单进度跟踪表
 */
function project_specialPrice_search($scope, $location, $rootScope, $modal, $timeout, BasemanService, BaseService, notify, $state, localeStorageService, FormValidatorService) {
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
            id: "saleorder_no",
            headerName: "特价单号",
            field: "saleorder_no",
            width: 110,
            type:"string"
        }, {
            id: "start_date",
            headerName: "有效起始日期",
            field: "start_date",
            width: 125,
            cellEditor: "年月日",
            type:"date"
        }, {
            id: "end_date",
            headerName: "有效结束日期",
            field: "end_date",
            width: 125,
            cellEditor: "年月日",
            type:"date"
        }, {
            headerName: "编码",
            id: "item_code",
            field: "item_code",
            width: 80
        }, {
            headerName: "名称",
            id: "item_name",
            field: "item_name",
            width: 200
        },{
            id: "prj_price",
            headerName: "申请价格",
            field: "prj_price",
            width: 90,
            cellEditor: "浮点框",
            cssClass:"amt",
            type:"string"
        },{
            headerName: "申请数量",
            id: "contract_qty",
            field: "contract_qty",
            width: 100,
            cellEditor: "整数框",
            type:"number"
        },{
            id: "can_order_qty",
            headerName: "剩余可下单数量",
            field: "can_order_qty",
            width: 130,
            cellEditor: "整数框",
            type:"number"
        }
    ];

    /**
     * 查询主列表数据
     */
    $scope.searchData = function (postdata) {
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

        BasemanService.RequestPost("project_specialPrice_search", "search", postdata)
            .then(function (data) {
                // $scope.data.currItem = data;
                loadGridData($scope.headerOptions, data.project_specialprice_searchs);
                BaseService.pageInfoOp($scope, data.pagination);
        });
    }

    /**
     * 选择客户
     */
    $scope.searchCustomer = function () {
        BasemanService.chooseCustomer({
            title: '选择客户',
            scope: $scope,
            then: function (data) {
                $scope.data.currItem.customer_id = data.customer_id;
                $scope.data.currItem.customer_code = data.customer_code;
                $scope.data.currItem.customer_name = data.customer_name;
            }
        });
    }

    //清除通用查询条件
    $scope.clearCondition = function (name) {
        if (name == 'cus') {
            $scope.data.currItem.customer_id = 0;
            $scope.data.currItem.customer_code = undefined;
            $scope.data.currItem.customer_name = undefined;
        }
        if (name == 'billno') {
            $scope.data.currItem.saleorder_no = undefined;
        }
    }

    /**
     * 按条件查询
     */
    $scope.searchByCon = function () {
        $scope.sqlwhere = "";
        var sqlwhere = "";
        var postdata = {};
        if($scope.data.currItem.saleorder_no){
            sqlwhere += " and b.saleorder_no like '%"+$scope.data.currItem.saleorder_no+"%'";
        }
        if($scope.data.currItem.customer_id > 0){
            sqlwhere += " and b.customer_id = "+$scope.data.currItem.customer_id;
        }
        //客户编码支持手动输入查询
        if($scope.data.currItem.customer_code && $scope.data.currItem.customer_id <= 0){
            sqlwhere += " and b.customer_code = "+$scope.data.currItem.customer_code;
        }
        if(sqlwhere != ""){
            $scope.sqlwhere = sqlwhere;

        }
        $scope.searchData();
    }

    /**
     * 客户编码值改变时触发事件
     */
    $scope.codeChange = function () {
        $scope.data.currItem.customer_id = 0;
        $scope.data.currItem.customer_name = undefined;
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
    .controller('ctrl_project_specialPrice_search', project_specialPrice_search)