/**
 * zengjinhua
 * 2020/02/13.
 * 提货计划分析
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'numberApi'],
    function (module, controllerApi, base_diy_page, numberApi) {

    var EpmStageDef=[
        '$scope',
        function ($scope){
            /**
             * 数据定义
             */
            $scope.data = {};
            $scope.data.currItem = {

            };

            //查询面板参数
            $scope.notPackQuery = false;

            /**
             * tab标签页
             */
            $scope.contract_tab = {
                data: {
                    title: '产品维度',
                    active: true
                },
                line: {
                    title: '合同维度'
                }
            };

            //字段名称数字
            var arrsSearch = ['year','month','customer_code','customer_name','item_code','contract_code','contract_name'];

            /**
             * 定义表格'产品维度'
             */
            $scope.gridOptionsItem={
                hcName : '产品维度',
                columnDefs:[{
                    type:'序号'
                },
                {
                    field:'item_code',
                    headerName:'产品编码'
                },
                {
                    field:'item_name',
                    headerName:'产品名称'
                },
                {
                    headerName:'预提货计划(数量)',
                    children:[
                        {
                            field: 'this_total_plan_qty',
                            headerName: '月',
                            type:'数量'
                        },
                        {
                            field: 'next_total_plan_qty',
                            headerName: '月',
                            type:'数量'
                        },
                        {
                            field: 'two_total_plan_qty',
                            headerName: '月',
                            type:'数量'
                        }
                    ]
                },
                {
                    headerName:'实际下单/发货(数量)',
                    children:[
                        {
                            field: 'this_qty_bill',
                            headerName: '月常规订单',
                            type:'数量'
                        },
                        {
                            field: 'this_confirm_out_qty',
                            headerName: '发货进度',
                            cellStyle: {
                                'text-align': 'center'
                            },
                            valueFormatter: function (params) {
                                if(params.data.this_qty_bill > 0){
                                    return numberApi.formatNumber(params.data.this_confirm_out_qty, 0) + "(" +
                                    numberApi.formatNumber(numberApi.mutiply(
                                            numberApi.divide(params.data.this_confirm_out_qty, params.data.this_qty_bill), 100), 2) + "%)";
                                }else{
                                    return params.data.this_confirm_out_qty;
                                }
                            }
                        },
                        {
                            field: 'this_plan_qty_bill',
                            headerName: '月计划订单',
                            type:'数量'
                        },
                        {
                            field: 'this_plan_confirm_out_qty',
                            headerName: '发货进度',
                            cellStyle: {
                                'text-align': 'center'
                            },
                            valueFormatter: function (params) {
                                if(params.data.this_plan_qty_bill > 0){
                                    return numberApi.formatNumber(params.data.this_plan_confirm_out_qty, 0) + "(" +
                                    numberApi.formatNumber(numberApi.mutiply(
                                            numberApi.divide(params.data.this_plan_confirm_out_qty, params.data.this_plan_qty_bill), 100), 2) + "%)";
                                }else{
                                    return params.data.this_plan_confirm_out_qty;
                                }
                            }
                        },
                        {
                            field: 'next_plan_qty_bill',
                            headerName: '月计划订单',
                            type:'数量'
                        },
                        {
                            field: 'next_plan_confirm_out_qty',
                            headerName: '发货进度',
                            cellStyle: {
                                'text-align': 'center'
                            },
                            valueFormatter: function (params) {
                                if(params.data.next_plan_qty_bill > 0){
                                    return numberApi.formatNumber(params.data.next_plan_confirm_out_qty, 0) + "(" +
                                    numberApi.formatNumber(numberApi.mutiply(
                                            numberApi.divide(params.data.next_plan_confirm_out_qty, params.data.next_plan_qty_bill), 100), 2) + "%)";
                                }else{
                                    return params.data.next_plan_confirm_out_qty;
                                }
                            }
                        },
                        {
                            field: 'two_plan_qty_bill',
                            headerName: '月计划订单',
                            type:'数量'
                        },
                        {
                            field: 'two_plan_confirm_out_qty',
                            headerName: '发货进度',
                            cellStyle: {
                                'text-align': 'center'
                            },
                            valueFormatter: function (params) {
                                if(params.data.two_plan_qty_bill > 0){
                                    return numberApi.formatNumber(params.data.two_plan_confirm_out_qty, 0) + "(" +
                                    numberApi.formatNumber(numberApi.mutiply(
                                            numberApi.divide(params.data.two_plan_confirm_out_qty, params.data.two_plan_qty_bill), 100), 2) + "%)";
                                }else{
                                    return params.data.two_plan_confirm_out_qty;
                                }
                            }
                        }
                    ]
                },
                {
                    field:'yield_accomplish',
                    headerName:'月提货计划达成率',
                    cellStyle: {
                        'text-align': 'right'
                    },
                    valueFormatter: function (params) {
                        if(params.data.this_total_plan_qty > 0){
                            var sumNum = numberApi.sum(params.data.this_qty_bill, params.data.this_plan_qty_bill);
                            return numberApi.formatNumber(numberApi.mutiply(
                                    numberApi.divide(sumNum, params.data.this_total_plan_qty), 100), 2) + "%";
                        }else{
                            return params.data.yield_accomplish;
                        }
                    }
                }],hcAfterRequest:function(args){//请求后调用
                    //获取网格数组
                    var colDefArr = $scope.gridOptionsItem.columnApi.getAllColumns().map(function(proj){
                        return proj.colDef;
                    });

                    //字段名称
                    var project = {
                        3 : '月(预提货数量)',
                        4 : '月(预提货数量)',
                        5 : '月(预提货数量)',
                        6 : '月常规订单',
                        8 : '月计划订单',
                        10 : '月计划订单',
                        12 : '月计划订单',
                        14 : '月提货计划达成率',
                    };

                    //本月字段
                    [3, 6 , 8, 14].forEach(function(idx){
                        colDefArr[idx].headerName = $scope.data.currItem.month + "" + project[idx];
                    });

                    //下月字段
                    var yearMonth = 0;
                    if($scope.data.currItem.month == 12){
                        //下一年1月份
                        yearMonth = numberApi.sum($scope.data.currItem.year, 1) + "年1";
                    }else{
                        yearMonth = numberApi.sum($scope.data.currItem.month, 1);
                    }
                    [4, 10].forEach(function(idx){
                        colDefArr[idx].headerName = yearMonth + "" + project[idx];
                    });

                    //下两个月
                    if($scope.data.currItem.month >= 11){
                        if($scope.data.currItem.month == 11){
                            yearMonth = numberApi.sum($scope.data.currItem.year, 1) + "年1";
                        }else{
                            yearMonth = numberApi.sum($scope.data.currItem.year, 1) + "年2";
                        }
                    }else{
                        yearMonth = numberApi.sum($scope.data.currItem.month, 2);
                    }

                    [5, 12].forEach(function(idx){
                        colDefArr[idx].headerName = yearMonth + "" + project[idx];
                    });

                    //网格数组放入网格进行渲染
                    $scope.gridOptionsItem.api.setColumnDefs(colDefArr);

                    //设置单元格焦点
                    $scope.gridOptionsItem.hcApi.setFocusedCell(0, 'item_code');
                },
                hcBeforeRequest: function (searchObj) {//发送查询条件
                    arrsSearch.forEach(function (data) {
                        searchObj[data] = $scope.data.currItem[data];
                    });
                },
                hcRequestAction:'selectitem',
                hcDataRelationName:'epm_plan_view_items',
				hcClassId:'epm_discount_apply_plan_view'
            };

            /**
             * 定义表格'合同维度'
             */
            $scope.gridOptionsCustomer={
                hcName : '合同维度',
                columnDefs:[{
                    type:'序号'
                },
                {
                    field:'customer',
                    headerName:'客户信息'
                },
                {
                    field:'contract',
                    headerName:'合同信息'
                },
                {
                    field:'discount_apply_code',
                    headerName:'折扣单号'
                },
                {
                    field:'item_code',
                    headerName:'产品编码'
                },
                {
                    field:'item_name',
                    headerName:'产品名称'
                },
                {
                    headerName:'预提货计划(数量)',
                    children:[
                        {
                            field: 'this_total_plan_qty',
                            headerName: '月',
                            type : '数量'
                        },
                        {
                            field: 'next_total_plan_qty',
                            headerName: '月',
                            type : '数量'
                        },
                        {
                            field: 'two_total_plan_qty',
                            headerName: '月',
                            type : '数量'
                        }
                    ]
                },
                {
                    headerName:'实际下单/发货(数量)',
                    children:[
                        {
                            field: 'this_qty_bill',
                            headerName: '月常规订单',
                            type : '数量'
                        },
                        {
                            field: 'this_confirm_out_qty',
                            headerName: '发货进度',
                            cellStyle: {
                                'text-align': 'center'
                            },
                            valueFormatter: function (params) {
                                if(params.data.this_qty_bill > 0){
                                    return numberApi.formatNumber(params.data.this_confirm_out_qty, 0) + "(" +
                                    numberApi.formatNumber(numberApi.mutiply(
                                            numberApi.divide(params.data.this_confirm_out_qty, params.data.this_qty_bill), 100), 2) + "%)";
                                }else{
                                    return params.data.this_confirm_out_qty;
                                }
                            }
                        },
                        {
                            field: 'this_plan_qty_bill',
                            headerName: '月计划订单',
                            type : '数量'
                        },
                        {
                            field: 'this_plan_confirm_out_qty',
                            headerName: '发货进度',
                            cellStyle: {
                                'text-align': 'center'
                            },
                            valueFormatter: function (params) {
                                if(params.data.this_plan_qty_bill > 0){
                                    return numberApi.formatNumber(params.data.this_plan_confirm_out_qty, 0) + "(" +
                                    numberApi.formatNumber(numberApi.mutiply(
                                            numberApi.divide(params.data.this_plan_confirm_out_qty, params.data.this_plan_qty_bill), 100), 2) + "%)";
                                }else{
                                    return params.data.this_plan_confirm_out_qty;
                                }
                            }
                        },
                        {
                            field: 'next_plan_qty_bill',
                            headerName: '月计划订单',
                            type : '数量'
                        },
                        {
                            field: 'next_plan_confirm_out_qty',
                            headerName: '发货进度',
                            cellStyle: {
                                'text-align': 'center'
                            },
                            valueFormatter: function (params) {
                                if(params.data.next_plan_qty_bill > 0){
                                    return numberApi.formatNumber(params.data.next_plan_confirm_out_qty, 0) + "(" +
                                    numberApi.formatNumber(numberApi.mutiply(
                                            numberApi.divide(params.data.next_plan_confirm_out_qty, params.data.next_plan_qty_bill), 100), 2) + "%)";
                                }else{
                                    return params.data.next_plan_confirm_out_qty;
                                }
                            }
                        },
                        {
                            field: 'two_plan_qty_bill',
                            headerName: '月计划订单',
                            type : '数量'
                        },
                        {
                            field: 'two_plan_confirm_out_qty',
                            headerName: '发货进度',
                            cellStyle: {
                                'text-align': 'center'
                            },
                            valueFormatter: function (params) {
                                if(params.data.two_plan_qty_bill > 0){
                                    return numberApi.formatNumber(params.data.two_plan_confirm_out_qty, 0) + "(" +
                                    numberApi.formatNumber(numberApi.mutiply(
                                            numberApi.divide(params.data.two_plan_confirm_out_qty, params.data.two_plan_qty_bill), 100), 2) + "%)";
                                }else{
                                    return params.data.two_plan_confirm_out_qty;
                                }
                            }
                        }
                    ]
                },
                {
                    field:'yield_accomplish',
                    headerName:'月提货计划达成率',
                    cellStyle: {
                        'text-align': 'center'
                    },
                    valueFormatter: function (params) {
                        if(params.data.this_total_plan_qty > 0){
                            var sumNum = numberApi.sum(params.data.this_qty_bill, params.data.this_plan_qty_bill);
                            return numberApi.formatNumber(numberApi.mutiply(
                                    numberApi.divide(sumNum, params.data.this_total_plan_qty), 100), 2) + "%";
                        }else{
                            return params.data.yield_accomplish;
                        }
                    }
                }],hcAfterRequest:function(args){//请求后调用
                    //获取网格数组
                    var colDefArr = $scope.gridOptionsCustomer.columnApi.getAllColumns().map(function(proj){
                        return proj.colDef;
                    });

                    //字段名称
                    var project = {
                        6 : '月(预提货数量)',
                        7 : '月(预提货数量)',
                        8 : '月(预提货数量)',
                        9 : '月常规订单',
                        11 : '月计划订单',
                        13 : '月计划订单',
                        15 : '月计划订单',
                        17 : '月提货计划达成率',
                    };

                    //本月字段
                    [6, 9 , 11, 17].forEach(function(idx){
                        colDefArr[idx].headerName = $scope.data.currItem.month + "" + project[idx];
                    });

                    //下月字段
                    var yearMonth = 0;
                    if($scope.data.currItem.month == 12){
                        //下一年1月份
                        yearMonth = numberApi.sum($scope.data.currItem.year, 1) + "年1";
                    }else{
                        yearMonth = numberApi.sum($scope.data.currItem.month, 1);
                    }
                    [7, 13].forEach(function(idx){
                        colDefArr[idx].headerName = yearMonth + "" + project[idx];
                    });

                    //下两个月
                    if($scope.data.currItem.month >= 11){
                        if($scope.data.currItem.month == 11){
                            yearMonth = numberApi.sum($scope.data.currItem.year, 1) + "年1";
                        }else{
                            yearMonth = numberApi.sum($scope.data.currItem.year, 1) + "年2";
                        }
                    }else{
                        yearMonth = numberApi.sum($scope.data.currItem.month, 2);
                    }

                    [8, 15].forEach(function(idx){
                        colDefArr[idx].headerName = yearMonth + "" + project[idx];
                    });

                    //网格数组放入网格进行渲染
                    $scope.gridOptionsCustomer.api.setColumnDefs(colDefArr);

                    //设置单元格焦点
                    $scope.gridOptionsCustomer.hcApi.setFocusedCell(0, 'customer');
                },
                hcBeforeRequest: function (searchObj) {//发送查询条件
                    arrsSearch.forEach(function (data) {
                        searchObj[data] = $scope.data.currItem[data];
                    });
                },
                hcRequestAction:'selectcustomer',
                hcDataRelationName:'epm_plan_view_customers',
				hcClassId:'epm_discount_apply_plan_view'
            };

            controllerApi.extend({
                controller:base_diy_page.controller,
                scope:$scope
            });

            /**
             * 数据初始化
             */
            $scope.doInit = function () {
                $scope.hcSuper.doInit();
                resetYearMonth();
            }

            /**
             * 重置年月
             */
            function resetYearMonth(){
                $scope.data.currItem.year = new Date().getFullYear();
                $scope.data.currItem.month = numberApi.sum(1, new Date().getMonth());
            }

            /**
             * 通用查询
             */
            $scope.commonSearchSetting = {
                contract : {/* 合同查询 */
                    sqlWhere: " contract_type in(1, 2)",
                    afterOk: function (result) {
                        $scope.data.currItem.contract_id = result.contract_id;
                        $scope.data.currItem.contract_code = result.contract_code;
                        $scope.data.currItem.contract_name = result.contract_name;
                    }
                },
                customer: {
                    title: '客户',
                    postData: {
                        search_flag: 124
                    },
                    gridOptions:{
                        columnDefs:[
                            {
                                headerName: "客户编码",
                                field: "customer_code"
                            },{
                                headerName: "客户名称",
                                field: "customer_name"
                            },{
                                headerName: "客户简称",
                                field: "short_name"
                            }
                        ]
                    },
                    afterOk: function (customer) {
                        ['customer_code', 'customer_name'].forEach(function (field) {
                            $scope.data.currItem[field] = customer[field];
                        });
                    }
                }
            }

            //定义按钮
            $scope.toolButtons = {
                query : {
                    title: function () {
                        return ($scope.notPackQuery ? '收起' : '展开') + '查询面板';
                    },
                    icon: function () {
                        return 'iconfont ' + ($scope.notPackQuery ? 'hc-less' : 'hc-moreunfold');
                    },
                    click: function () {
                        $scope.notPackQuery = !$scope.notPackQuery;
                    },
                },
                search: {
                    title: '查询',
                    icon: 'iconfont hc-search',
                    click: function () {
                        search();
                    },
                    hide: function(){
                        return !$scope.notPackQuery;
                    }
                },
                next: {
                    title: '下月',
                    icon: 'iconfont hc-search',
                    click: function () {
                        if($scope.data.currItem.month == 12){//下一年1月
                            $scope.data.currItem.month = 1;
                            $scope.data.currItem.year = numberApi.sum($scope.data.currItem.year, 1);
                        }else{
                            $scope.data.currItem.month = numberApi.sum($scope.data.currItem.month, 1);
                        }
                        //发送查询条件
                        search();
                    },
                    hide: function(){
                        return !$scope.notPackQuery;
                    }
                },
                this: {
                    title: '本月',
                    icon: 'iconfont hc-search',
                    click: function () {
                        $scope.data.currItem.month = numberApi.sum(1, new Date().getMonth());
                        //发送查询条件
                        search();
                    },
                    hide: function(){
                        return !$scope.notPackQuery;
                    }
                },
                up: {
                    title: '上月',
                    icon: 'iconfont hc-search',
                    click: function () {
                        if($scope.data.currItem.month == 1){//上一年12月
                            $scope.data.currItem.month = 12;
                            $scope.data.currItem.year = numberApi.sub($scope.data.currItem.year, 1);
                        }else{
                            $scope.data.currItem.month = numberApi.sub($scope.data.currItem.month, 1);
                        }
                        //发送查询条件
                        search();
                    },
                    hide: function(){
                        return !$scope.notPackQuery;
                    }
                },
                clear: {
                    title: '清除',
                    icon: 'iconfont hc-qingsao',
                    click: function () {
                        reset();
                    },
                    hide: function(){
                        return !$scope.notPackQuery;
                    }
                },
                
            };

            /**
             * 发送查询条件
             */
            function search(){
                $scope.gridOptionsItem.hcApi.search();
                $scope.gridOptionsCustomer.hcApi.search();
            }

            /**
             * 清空查询条件
             */
            function reset(){
                arrsSearch.forEach(function (data) {
                    $scope.data.currItem[data] = undefined;
                });
                resetYearMonth();
            }
        }
    ];

    return controllerApi.controller({
        module:module,
        controller:EpmStageDef
    });

});