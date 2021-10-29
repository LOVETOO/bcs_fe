/**
 * 销售统计分析报表
 */
function sale_statistics_analysis($scope, $q, $location, $rootScope, $modal, $timeout, BasemanService, BaseService, notify, $state, localeStorageService, FormValidatorService) {
    $scope.data = {};
    $scope.data.currItem = {};
    $scope.sum = {};
    $scope.searchOrCount = 1; //查询：1 汇总 2
    $scope.isCount = true; //‘查询’按钮初始状态为显示，切换到汇总标签页不显示

    //初始化数据
    $scope.isinvoice = [
        {id: 1, name: '未开票'},
        {id: 2, name: '已开票'},
        {id: '', name: '全部'}]
    //汇总网格字段
    $scope.lineColumns_count = [];
    $scope.count = {};
    $scope.gridData = [];



    /**
     * 清空条件
     */
    $scope.clearsql = function () {
        $scope.data.currItem = {};
    }

    /**
     * 关闭查询框
     */
    $scope.closeSearch = function () {
        $("#sqlwhereModal").modal('hide');
    }

    //网格设置
    $scope.lineOptions = {
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

    $scope.countOptions = {
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

    //定义网格字段
    $scope.lineColumns = [
        {
            id: "id",
            headerName: "序号",
            field: "id",
            width: 59
        },  {
            id: "dept_code",
            headerName: "运营中心",
            field: "dept_name",
            width: 100,
            type: "string"
        }, {
            id: "customer_code",
            headerName: "客户编码",
            field: "customer_code",
            width: 100,
            type: "string"
        }, {
            id: "customer_name",
            headerName: "客户名称",
            field: "customer_name",
            width: 250,
            type: "string"
        },{
            id: "sa_salebillno",
            headerName: "订单号",
            field: "sa_salebillno",
            width: 120,
            type: "string"
        }, {
            id: "date_sabill",
            headerName: "订单日期",
            field: "date_sabill",
            width: 87,
            cellEditor: "年月日",
            type: "date"
        },{
            id: "invbillno",
            headerName: "出库单号",
            field: "invbillno",
            width: 120,
            type: "string"
        }, {
            id: "date_invbill",
            headerName: "出库日期",
            field: "date_invbill",
            width: 100,
            cellEditor: "年月日",
            type: "date"
        },  {
            id: "item_code",
            headerName: "产品编码",
            field: "item_code",
            width: 110,
            type: "string"
        }, {
            id: "item_name",
            headerName: "产品名称",
            field: "item_name",
            width: 250,
            type: "string"
        }, {
            id: "qty_bill",
            headerName: "出库数量",
            field: "qty_bill",
            width: 90,
            type: "number",
            cellEditor: "整数框"
        },
        {
            id: "sal_price_bill",
            headerName: "单价",
            field: "sal_price_bill",
            width: 80,
            type: "number",
            cellEditor: "浮点框",
        },{
            id: "wtamount_bill_f",
            headerName: "折前金额",
            field: "wtamount_bill_f",
            width: 110,
            cellEditor: "浮点框",
            cssClass: "amt",
            type: "string"
        }, {
            id: "amount_bill_f",
            headerName: "折后金额",
            field: "amount_bill_f",
            width: 110,
            cellEditor: "浮点框",
            cssClass: "amt",
            type: "string"
        }, {
            id: "dhl_no",
            headerName: "销售渠道",
            field: "dhl_no",
            width: 120,
            cellEditor: "下拉框",
            cellEditorParams: {values:[]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            type: "list"
        }, {
            id: "warehouse_code",
            headerName: "出库仓编码",
            field: "warehouse_code",
            width: 110,
            type: "string"
        }, {
            id: "warehouse_name",
            headerName: "出库仓名称",
            field: "warehouse_name",
            width: 130,
            type: "string"
        }, {
            id: "entorgname",
            headerName: "产品组",
            field: "entorgname",
            width: 110,
            type: "string"
        }, {
            id: "item_class1_name",
            headerName: "产品大类",
            field: "item_class1_name",
            width: 110,
            type: "string"
        }, {
            id: "item_class2_name",
            headerName: "产品中类",
            field: "item_class2_name",
            width: 130,
            type: "string"
        }, {
            id: "item_class3_name",
            headerName: "产品小类",
            field: "item_class3_name",
            width: 150,
            type: "string"
        },{
            id: "is_invoice",
            headerName: "是否开票",
            field: "is_invoice",
            width: 90,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: [{value: 1, desc: "否"},
                    {value: 2, desc: "是"}]
            },
            type: "list"
        }, {
            id: "confirm_out_qty",
            headerName: "开票数量",
            field: "confirm_out_qty",
            width: 90,
            type: "number",
            cellEditor: "整数框",
        }, {
            id: "invoice_no",
            headerName: "发票号",
            field: "invoice_no",
            width: 120,
            type: "string"
        }
    ];

    /**
     * 取词汇表值
     */
    // $scope.sale_center = [];
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "order_sale_center"})
        .then(function (data) {
            HczyCommon.stringPropToNum(data.dicts);
            for (var i = 0; i < data.dicts.length; i++) {
                var object = {};
                object.value = data.dicts[i].dictvalue;
                object.desc = data.dicts[i].dictname;
                $scope.lineColumns[$scope.getIndexByField('lineColumns', 'dhl_no')].cellEditorParams.values.push(object);
            }
            // if ($scope.getIndexByField('lineColumns', 'dhl_no')) {
            //     $scope.lineColumns[$scope.getIndexByField('lineColumns', 'dhl_no')].cellEditorParams.values = $scope.sale_center;
            //     // $scope.lineGridView.setColumns($scope.lineColumns);
            // }

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
     * 点击查询弹出查询条件框
     */
    $scope.sqlwheremodal = function () {
        if (JSON.stringify($scope.data.currItem) == "{}") {
            $scope.data.currItem.is_invoice = "";
        }
        //获取当前月份第一天，当天
        var date_ = new Date();
        var year = date_.getFullYear();
        var month = date_.getMonth() + 1;
        if(month<10){
            month = '0'+month
        }
        var day = date_.getDate();
        var   firstdate = year + '-' + month + '-01';
        var nowdate =  year + '-' + month + '-'+day
        $scope.data.currItem.date_invbill_from = firstdate
        $scope.data.currItem.date_invbill_to = nowdate


        BasemanService.RequestPost("scpuser","select",{"userid":strUserId}).then(function (data) {
            if(data.orgofusers.length>0){
                BasemanService.RequestPost("scporg","select",{"orgid":data.orgofusers[0].orgid}).then(function (result) {
                    if(result.orgtype == 6){
                        $scope.data.currItem.orgid = data.orgofusers[0].orgid
                    }
                    $("#sqlwhereModal").modal();
                })
            }else {
                $("#sqlwhereModal").modal();
            }
        })
    }

    /**
     * 获取查询条件
     */
    $scope.getsqlwhere = function () {
        var sqlwhere = "";
        if ($scope.data.currItem.date_invbill_from && !$scope.data.currItem.date_invbill_to) {
            sqlwhere += " and to_char(invh.date_invbill,'yyyy-MM-dd') = '" + $scope.data.currItem.date_invbill_from + "' ";
        }
        if ($scope.data.currItem.date_invbill_to && !$scope.data.currItem.date_invbill_from) {
            sqlwhere += " and to_char(invh.date_invbill,'yyyy-MM-dd') = '" + $scope.data.currItem.date_invbill_to + "' ";
        }
        if ($scope.data.currItem.date_invbill_from && $scope.data.currItem.date_invbill_to) {
            sqlwhere += " and to_char(invh.date_invbill,'yyyy-MM-dd') >= '" + $scope.data.currItem.date_invbill_from + "' "
                + " and to_char(invh.date_invbill,'yyyy-MM-dd') <= '" + $scope.data.currItem.date_invbill_to + "' ";
        }
        if ($scope.data.currItem.is_invoice) {
            if ($scope.data.currItem.is_invoice == 1) {//无开票
                sqlwhere += " and invl.invoice_no is null ";
            }
            if ($scope.data.currItem.is_invoice == 2) {//已开票
                sqlwhere += " and invl.invoice_no is not null ";
            }
        }
        if ($scope.data.currItem.customer_code) {
            sqlwhere += " and invh.customer_id=" + $scope.data.currItem.customer_id;
        }
        if ($scope.data.currItem.item_code) {
            sqlwhere += " and invl.item_id=" + $scope.data.currItem.item_id;
        }
        if ($scope.data.currItem.item_class1_code) {
            sqlwhere += " and ic1.item_class_id=" + $scope.data.currItem.item_class1_id;
        }
        if ($scope.data.currItem.item_class3_code) {
            sqlwhere += " and ic3.item_class_id=" + $scope.data.currItem.item_class3_id;
        }
        if ($scope.data.currItem.sale_center_code) {
            sqlwhere += " and sah.sale_center_id=" + $scope.data.currItem.sale_center_id;
        }
        return sqlwhere;
    }

    /**
     * 查询
     */
    var a = 0; //调用searchdata方法的次数
    $scope.searchData = function (postdata) {
        a = a + 1;
        if (!postdata) {
            if(!$scope.oldPage ){
                $scope.oldPage = 1;
            }
            if(!$scope.currentPage){
                $scope.currentPage = 1;
            }
            if (!$scope.pageSize) {
                $scope.pageSize = "1000";
            }
            $scope.totalCount = 1;
            $scope.pages = 1;
            postdata = {
                pagination:"pn=" + $scope.currentPage + ",ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0"
            }
        }

        postdata.sqlwhere = $scope.getsqlwhere();

        if ($scope.sqlwhere && $scope.sqlwhere !=""){
            postdata.sqlwhere = $scope.sqlwhere
        }

        // 查询汇总表数据
        if($scope.searchOrCount == 2){
            postdata.search_flag = 1;
            postdata.condition = condition;
            BasemanService.RequestPost("sale_statistics_analysis", "search", postdata)
                .then(function (data) {
                    $scope.sum.sum_qty_bill = data.sum_qty_bill;
                    $scope.sum.sum_confirm_out_qty = data.sum_confirm_out_qty;
                    $scope.sum.sum_amount_bill_f = data.sum_amount_bill_f;
                    $scope.sum.sum_wtamount_bill_f = data.sum_wtamount_bill_f;

                    loadGridData($scope.countOptions, data.sale_statistics_analysiss);
                    $("#sqlwhereModal").modal('hide');
                    BaseService.pageInfoOp(pageInfoOfCount, data.pagination);
                    //将分页缓存信息填充到$scope
                    angular.extend($scope,pageInfoOfCount);
                });
        }
        //查询明细数据
        if($scope.searchOrCount == 1){
            BasemanService.RequestPost("sale_statistics_analysis", "search", postdata)
                .then(function (data) {
                    loadGridData($scope.lineOptions, data.sale_statistics_analysiss);
                    // if(a == 1){
                    loadGridData($scope.countOptions, data.sale_statistics_analysiss);
                        // BaseService.pageInfoOp(pageInfoOfCount, data.pagination);
                    // }

                    $scope.sum.sum_confirm_out_qty = data.sum_confirm_out_qty;
                    $scope.sum.sum_qty_bill = data.sum_qty_bill;
                    $scope.sum.sum_amount_bill_f = data.sum_amount_bill_f;
                    $scope.sum.sum_wtamount_bill_f = data.sum_wtamount_bill_f;

                    $("#sqlwhereModal").modal('hide');
                    BaseService.pageInfoOp(pageInfoOfLine, data.pagination);
                    angular.extend($scope,pageInfoOfLine);

                });
        }

    }

    //分页信息缓存对象
    var pageInfoOfLine = {};
    var pageInfoOfCount = {};

    /**
     * 条件查询
     */
    $scope.searchbycon = function () {
        $scope.searchOrCount = 1;
        angular.extend($scope, pageInfoOfLine);
        $scope.searchData();
    }

    /**
     * 汇总列和数据
     */
    var condition = "";
    $scope.searchbycount = function () {
        $scope.arr = [];
        //网格列汇总
        $scope.lineColumns_count = [];
        $scope.lineColumns_count.push($scope.lineColumns[0]);
        var bool = false;
        for (var k in $scope.count) {
            if ($scope.count[k]) {
                bool = true;
                for (var i = 0; i < $scope.lineColumns.length; i++) {
                    if (k == $scope.lineColumns[i].field) {
                        $scope.lineColumns_count.push($scope.lineColumns[i]);
                        //将条件放在数组中
                        $scope.arr.push($scope.lineColumns[i].field);

                        if ($scope.lineColumns[i].field == 'customer_code') {
                            $scope.lineColumns_count.push($scope.lineColumns[$scope.getIndexByField('lineColumns', 'customer_name')]);
                            $scope.arr.push($scope.lineColumns[$scope.getIndexByField('lineColumns', 'customer_name')].field);
                        }
                        if ($scope.lineColumns[i].field == 'item_code') {
                            $scope.lineColumns_count.push($scope.lineColumns[$scope.getIndexByField('lineColumns', 'item_name')]);
                            $scope.arr.push($scope.lineColumns[$scope.getIndexByField('lineColumns', 'item_name')].field);
                        }
                        if ($scope.lineColumns[i].field == 'warehouse_code') {
                            $scope.lineColumns_count.push($scope.lineColumns[$scope.getIndexByField('lineColumns', 'warehouse_name')]);
                            $scope.arr.push($scope.lineColumns[$scope.getIndexByField('lineColumns', 'warehouse_name')].field);
                        }
                        //数组内容逗号拼接成字符串
                        condition = HczyCommon.appendComma($scope.arr);
                    }
                }
            }
        }
        if (!bool) {
            BasemanService.swalError("提示", "请先选择汇总条件");
            return;
        }
        for (var i = 0; i < $scope.lineColumns.length; i++) {
            if ($scope.lineColumns[i].field == "confirm_out_qty" || $scope.lineColumns[i].field == "wtamount_bill_f" || $scope.lineColumns[i].field == "amount_bill_f") {
                $scope.lineColumns_count.push($scope.lineColumns[i]);
            }
        }
        $scope.changeColumns($scope.lineColumns_count);
        $('#sqlwhereModal').modal('hide');

        //数据汇总
        $scope.searchOrCount = 2;
        angular.extend($scope, pageInfoOfCount);
        $scope.searchData();
    }
    
    $scope.changeColumns = function (data) {
        $scope.countOptions.api.setColumnDefs(data.slice(0));
        $scope.countOptions.api.setRowData($scope.gridData);
    }

    /**
     * 加载网格数据
     */
    function loadGridData(gridOptions, datas) {
        var index = $scope.pageSize * ($scope.currentPage - 1);
        //加序号
        if (datas.length > 0) {
            for (var i = 0; i < datas.length; i++) {
                datas[i].id = index + i + 1;
            }
        }
        //设置数据
        gridOptions.api.setRowData(datas);
    }

    /*------------------------------------通用查询-----------------------------------------------*/
    /**
     * 选择渠道销售中心
     */
    $scope.searchSaleCenter = function () {
        BasemanService.chooseSaleCenter({
            title: '选择所属渠道',
            scope: $scope,
            then: function (data) {
                $scope.data.currItem.sale_center_id = data.dept_id;
                $scope.data.currItem.sale_center_code = data.dept_code;
                $scope.data.currItem.sale_center_name = data.dept_name;
            }
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
    /**
     * 组织客户查询
     */
    $scope.customerSearch = function () {
        var postdata = {}
        if ($scope.data.currItem.orgid || $scope.data.currItem.orgid >0){
          postdata ={
                "sqlwhere":" dept_id ="+$scope.data.currItem.orgid+" "
            }
        }
        BasemanService.chooseCustomer({
            title: '选择客户',
            scope: $scope,
            then: function (result) {
                $scope.data.currItem.customer_name = result.customer_name;
                $scope.data.currItem.customer_code = result.customer_code;
                $scope.data.currItem.customer_id = result.customer_id;
            },
            postdata:postdata
        })
    };
    /**
     * 产品大类查询
     */
    $scope.item_class1Search = function () {
        $scope.FrmInfo = {
            title: "产品分类查询",
            thead: [{
                name: "产品类别名称",
                code: "item_class_name"
            }, {
                name: "产品类别编码",
                code: "item_class_code"
            }],
            classid: "item_class",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            ignorecase: "true", //忽略大小写
            postdata: {
                sqlwhere: " ic.item_class_level=1 "
            },
            searchlist: ["item_class_name", "item_class_code"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.item_class1_code = result.item_class_code;
            $scope.data.currItem.item_class1_name = result.item_class_name;
            $scope.data.currItem.item_class1_id = result.item_class_id;
        });
    };
    /**
     * 产品小类查询
     */
    $scope.item_class3Search = function () {
        $scope.FrmInfo = {
            title: "产品分类查询",
            thead: [{
                name: "产品类别名称",
                code: "item_class_name"
            }, {
                name: "产品类别编码",
                code: "item_class_code"
            }],
            classid: "item_class",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            ignorecase: "true", //忽略大小写
            postdata: {
                sqlwhere: " ic.item_class_level=3 "
            },
            searchlist: ["item_class_name", "item_class_code"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.item_class3_code = result.item_class_code;
            $scope.data.currItem.item_class3_name = result.item_class_name;
            $scope.data.currItem.item_class3_id = result.item_class_id;
        });
    };

    //清除通用查询条件
    $scope.clearCondition = function (name) {
        if (name == 'cus') {
            $scope.data.currItem.customer_code = undefined;
            $scope.data.currItem.customer_name = undefined;
        }
        if (name == 'item') {
            $scope.data.currItem.item_code = undefined;
            $scope.data.currItem.item_name = undefined;
        }
        if (name == 'itemClass1') {
            $scope.data.currItem.item_class1_code = undefined;
            $scope.data.currItem.item_class1_name = undefined;
        }
        if (name == 'itemClass3') {
            $scope.data.currItem.item_class3_code = undefined;
            $scope.data.currItem.item_class3_name = undefined;
        }
        if (name == 'salecenter') {
            $scope.data.currItem.sale_center_code = undefined;
            $scope.data.currItem.sale_center_name = undefined;
        }
    }

    /**
     * 标签切换事件
     */
    $scope.onTabChange = function (e) {
        // 获取已激活的标签页的名称
        var tabName = $(e.target).text();
        if ('销售明细' == tabName) {
            $scope.isCount = true;
            $scope.searchOrCount = 1;
            angular.extend($scope,pageInfoOfLine);
        }
        if ('汇总分析' == tabName) {
            $scope.isCount = false;
            $scope.searchOrCount = 2;
            angular.extend($scope,pageInfoOfCount);
        }
        console.log(tabName);
    }
    //modal显示时绑定切换事件
    $('#tab').on('shown.bs.tab', $scope.onTabChange);




    //网格高度自适应 , 控制器后面调用：
    BasemanService.initGird();

    //初始化分页
    $scope.pageSize = "1000"
    BaseService.pageGridInit($scope);
    //网格可复制
}

//注册控制器
angular.module('inspinia')
    .controller('ctrl_sale_statistics_analysis', sale_statistics_analysis)