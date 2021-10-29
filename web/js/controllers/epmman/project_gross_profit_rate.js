/**
 * zengjinhua
 * 工程毛利分析
 * 2019/12/03
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'openBizObj', 'requestApi', 'numberApi', 'gridApi', '$q', 'directive/hcInput','directive/hcBox', 'directive/hcChart'],
    function (module, controllerApi, base_diy_page, openBizObj, requestApi, numberApi, gridApi, $q) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {

                $scope.data = {
                    currItem: {
                        inv_out_bill_heads: []//定义后台关联数组
                    }
                };

                //是否收起查询面板
                $scope.notPackQuery = false;

                //改变查询面板
                var panelChange = true;

                //搜索条件
                var arrsSearch = ["project_code", "project_name", "project_id", 'inv_month',
                "contract_code", "contract_name", "delivery_base", 'inv_year', 'short_name',
                "contract_id", 'customer_code', 'customer_name'];

                /**
                 * tab标签页
                 */
                $scope.contract_tab = {
                    data: {
                        title: '汇总',
                        active: true
                    },
                    line: {
                        title: '明细'
                    }
                };

                //定义表格
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        },{
                            headerName: "项目编码",
                            field: "project_code"
                        }, {
                            headerName: "项目名称",
                            field: "project_name"
                        },{
                            headerName: "合同编码",
                            field: "contract_code"
                        }, {
                            headerName: "合同名称",
                            field: "contract_name"
                        }, {
                            headerName: "合同类型",
                            field: "contract_type",
                            hcDictCode:"epm.contract_type"
                        }, {
                            headerName: "客户编码",
                            field: "customer_code"
                        }, {
                            headerName: "客户名称",
                            field: "customer_name"
                        }, {
                            headerName: "客户简称",
                            field: "short_name"
                        }, {
                            headerName: "出库单号",
                            field: "invbillno"
                        }, {
                            headerName: "发货基地",
                            field: "delivery_base"
                        }, {
                            headerName: "出库日期",
                            field: "outbill_date",
                            type : '日期'
                        }, {
                            headerName: "产品编码",
                            field: "item_code"
                        }, {
                            headerName: "产品名称",
                            field: "item_name"
                        }, {
                            headerName: "产品型号",
                            field: "item_model"
                        }, {
                            headerName: "出库数量",
                            field: "qty_bill",
                            type : '数量'
                        }, {
                            headerName: "标准单价",
                            field: "stand_price",
                            type : '金额'
                        }, {
                            headerName: "工程方单价",
                            field: "contract_price",
                            type : '金额'
                        }, {
                            headerName: "折后单价",
                            field: "wtpricec_bill_f",
                            type : '金额'
                        }, {
                            headerName: "内结单价",
                            field: "cost_price",
                            type : '金额'
                        }, {
                            headerName: "实际成本单价",
                            field: "item_cost",
                            type : '金额'
                        }, {
                            headerName: "工程方金额",
                            field: "contract_amt",
                            type : '金额'
                        }, {
                            headerName: "折后金额",
                            field: "wtamount_bill_f",
                            type : '金额'
                        }, {
                            headerName: "内结金额",
                            field: "cost_amt",
                            type : '金额'
                        }, {
                            headerName: "实际成本金额",
                            field: "item_amt",
                            type : '金额'
                        }, {
                            headerName: "毛利额",
                            children: [
                                {
                                    headerName: "工程服务商",
                                    field: "service_gross_margin",
                                    type : '金额'
                                },{
                                    headerName: "事业部内结",
                                    field: "division_gross_margin",
                                    type : '金额'
                                },{
                                    headerName: "价值链",
                                    field: "chain_gross_margin",
                                    type : '金额'
                                }
                            ]
                        }, {
                            headerName: "毛利率",
                            children: [
                                {
                                    headerName: "工程服务商",
                                    field: "service_gross_rate",
                                    type : '数量'
                                },{
                                    headerName: "事业部内结",
                                    field: "division_gross_rate",
                                    type : '数量'
                                },{
                                    headerName: "价值链",
                                    field: "chain_gross_rate",
                                    type : '数量'
                                }
                            ]
                        }
                    ],hcAfterRequest:function(response){
                        $scope.gridOptions.hcApi.setRowData(response.inv_out_bill_heads);
                    },
                    hcBeforeRequest: function (searchObj) {//发送查询条件
                        arrsSearch.forEach(function (data) {
                            searchObj[data] = $scope.data.currItem[data];
                        });
                    },
                    //取消分页
                    //hcNoPaging:true
                    //定义查询类与方法
                    hcRequestAction:'searchmarginanalyze',
                    hcDataRelationName:'inv_out_bill_heads',
                    hcClassId:'inv_out_bill_head'
                };

                 //定义表格
                 $scope.gridOptions_contract = {
                    columnDefs: [
                        {
                            type: '序号'
                        },{
                            headerName: "项目编码",
                            field: "project_code"
                        },
                        {
                            headerName: "项目名称",
                            field: "project_name"
                        },
                        {
                            headerName: "合同编码",
                            field: "contract_code"
                        },
                        {
                            headerName: "合同名称",
                            field: "contract_name"
                        },
                        {
                            headerName: "客户编码",
                            field: "customer_code"
                        },
                        {
                            headerName: "客户名称",
                            field: "customer_name"
                        },
                        {
                            headerName: "客户简称",
                            field: "short_name"
                        },
                        {
                            headerName: "工程方金额",
                            field: "contract_amt",
                            type : '金额'
                        },
                        {
                            headerName: "折后金额",
                            field: "wtamount_bill_f",
                            type : '金额'
                        },
                        {
                            headerName: "内结金额",
                            field: "cost_amt",
                            type:"金额"
                        },
                        {
                            headerName: "实际成本金额",
                            field: "item_amt",
                            type:"金额"
                        }, {
                            headerName: "毛利额",
                            children: [
                                {
                                    headerName: "工程服务商",
                                    field: "service_gross_margin",
                                    type : '金额'
                                },{
                                    headerName: "事业部内结",
                                    field: "division_gross_margin",
                                    type : '金额'
                                },{
                                    headerName: "价值链",
                                    field: "chain_gross_margin",
                                    type : '金额'
                                }
                            ]
                        }, {
                            headerName: "毛利率",
                            children: [
                                {
                                    headerName: "工程服务商",
                                    field: "service_gross_rate",
                                    type : '数量'
                                },{
                                    headerName: "事业部内结",
                                    field: "division_gross_rate",
                                    type : '数量'
                                },{
                                    headerName: "价值链",
                                    field: "chain_gross_rate",
                                    type : '数量'
                                }
                            ]
                        }
                    ],hcAfterRequest:function(response){
                        $scope.gridOptions_contract.hcApi.setRowData(response.inv_out_bill_heads);
                    },
                    hcBeforeRequest: function (searchObj) {//发送查询条件
                        arrsSearch.forEach(function (data) {
                            searchObj[data] = $scope.data.currItem[data];
                        });
                    },
                    //取消分页
                    //hcNoPaging:true
                    //定义查询类与方法
                    hcRequestAction:'searchsummarizcontract',
                    hcDataRelationName:'inv_out_bill_heads',
                    hcClassId:'inv_out_bill_head'
                }

                //定义表格
                $scope.gridOptions_project = {
                    columnDefs: [
                        {
                            type: '序号'
                        },{
                            headerName: "项目编码",
                            field: "project_code"
                        },
                        {
                            headerName: "项目名称",
                            field: "project_name"
                        },
                        {
                            headerName: "客户编码",
                            field: "customer_code"
                        },
                        {
                            headerName: "客户名称",
                            field: "customer_name"
                        },
                        {
                            headerName: "客户简称",
                            field: "short_name"
                        },
                        {
                            headerName: "工程方金额",
                            field: "contract_amt",
                            type : '金额'
                        },
                        {
                            headerName: "折后金额",
                            field: "wtamount_bill_f",
                            type : '金额'
                        },
                        {
                            headerName: "内结金额",
                            field: "cost_amt",
                            type:"金额"
                        },
                        {
                            headerName: "实际成本金额",
                            field: "item_amt",
                            type:"金额"
                        }, {
                            headerName: "毛利额",
                            children: [
                                {
                                    headerName: "工程服务商",
                                    field: "service_gross_margin",
                                    type : '金额'
                                },{
                                    headerName: "事业部内结",
                                    field: "division_gross_margin",
                                    type : '金额'
                                },{
                                    headerName: "价值链",
                                    field: "chain_gross_margin",
                                    type : '金额'
                                }
                            ]
                        }, {
                            headerName: "毛利率",
                            children: [
                                {
                                    headerName: "工程服务商",
                                    field: "service_gross_rate",
                                    type : '数量'
                                },{
                                    headerName: "事业部内结",
                                    field: "division_gross_rate",
                                    type : '数量'
                                },{
                                    headerName: "价值链",
                                    field: "chain_gross_rate",
                                    type : '数量'
                                }
                            ]
                        }
                    ],hcAfterRequest:function(response){
                        $scope.gridOptions_project.hcApi.setRowData(response.inv_out_bill_heads);
                    },
                    hcBeforeRequest: function (searchObj) {//发送查询条件
                        arrsSearch.forEach(function (data) {
                            searchObj[data] = $scope.data.currItem[data];
                        });
                    },
                    //取消分页
                    //hcNoPaging:true
                    //定义查询类与方法
                    hcRequestAction:'searchsummarizproject',
                    hcDataRelationName:'inv_out_bill_heads',
                    hcClassId:'inv_out_bill_head'
                }

                //继承控制器
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                /**
                 * 改变查询条件
                 */
                $scope.changePanel = function(){
                    panelChange = true;
                }

                /**
                 * 基本信息中标签页改变事件
                 * @param params
                 */
                $scope.onContractTabChange = function (params) {
                    if(panelChange ){
                        if (params.id == 'data') {
                            $scope.press_year = 2;
                            $scope.press_contract = 1;
                            $scope.press_project = 1;
                        }
                        var arr = [];
                        arr.push($scope.search.line());
                        arr.push($scope.search.year());
                        arr.push($scope.search.contract());
                        arr.push($scope.search.project());
                        $q.all(arr).then(function(){
                            panelChange = false;
                        });
                    }else{
                        if (params.id == 'data') {
                            $scope.press_year = 2;
                            $scope.press_contract = 1;
                            $scope.press_project = 1;
                        }
                    }
                    
                };

                $scope.changePattern = function (value){
                    if(value == 'year'){
                        $scope.press_year = 2;
                        $scope.press_contract = 1;
                        $scope.press_project = 1;
                    }else if (value == 'contract'){
                        $scope.press_year = 1;
                        $scope.press_contract = 2;
                        $scope.press_project = 1;
                    }else{
                        $scope.press_year = 1;
                        $scope.press_contract = 1;
                        $scope.press_project = 2;
                    }
                    if(panelChange ){
                        var arr = [];
                        arr.push($scope.search.line());
                        arr.push($scope.search.year());
                        arr.push($scope.search.contract());
                        arr.push($scope.search.project());
                        $q.all(arr).then(function(){
                            panelChange = false;
                        });
                    }
                }

                /**
                 * 网格完成事件
                 */
                gridApi.execute($scope.gridOptions_project, function () {
                    $scope.data.currItem.inv_year = new Date().getFullYear();
                    $scope.press_year = 2;
                    $scope.press_contract = 1;
                    $scope.press_project = 1;
                    var arr = [];
                    arr.push($scope.search.year());
                    $q.all(arr).then(function(){
                        panelChange = false;
                    });
                });

                //定义按钮
                $scope.toolButtons = {
                    search: {
                        title: '查询',
                        icon: 'iconfont hc-search',
                        click: function () {
                            var arr = [];
                            arr.push($scope.search.line());
                            arr.push($scope.search.year());
                            arr.push($scope.search.contract());
                            arr.push($scope.search.project());
                            $q.all(arr).then(function(){
                                panelChange = false;
                            });
                        }
                    },
                    clear: {
                        title: '清除',
                        icon: 'iconfont hc-qingsao',
                        click: function () {
                            $scope.reset && $scope.reset();
                        }
                    },
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
                    }
                };

                /**
                 * 通用查询查询
                 * */
                $scope.commonSearchSetting = {
                    epmProject : {//项目查询
                        postData: {
                            report_type:1
                        },
                        sqlWhere: 'stat = 5',
                        afterOk: function (result) {
                            $scope.data.currItem.project_id = result.project_id;
                            $scope.data.currItem.project_code = result.project_code;
                            $scope.data.currItem.project_name = result.project_name;//工程名称
                            $scope.changePanel();
                        }
                    },
                    epmProjectContract : {//合同查询
                        sqlWhere: " contract_type in(1, 2)",
                        afterOk: function (result) {
                            $scope.data.currItem.contract_id = result.contract_id;
                            $scope.data.currItem.contract_code = result.contract_code;
                            $scope.data.currItem.contract_name = result.contract_name;
                            $scope.changePanel();
                        }
                    },
                    epmCustomer: {//客户查询
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
                            ['customer_code', 'customer_name', 'short_name'].forEach(function (field) {
                                $scope.data.currItem[field] = customer[field];
                            });
                            $scope.changePanel();
                        }
                    },
                    epmCelivery: {//发货基地
                        title: '发货基地',
                        postData: {
                            search_flag: 124
                        },
                        gridOptions:{
                            columnDefs:[
                                {
                                    headerName: "发货基地编码",
                                    field: "trading_company_code"
                                },{
                                    headerName: "发货基地名称",
                                    field: "trading_company_name"
                                }
                            ]
                        },
                        afterOk: function (result) {
                            $scope.data.currItem.delivery_base = result.trading_company_name;
                            $scope.changePanel();
                        }
                    }
                };

                /**
                 * 重置方法,将过滤条件清空
                 */
                $scope.reset = function () {
                    arrsSearch.forEach(function (data) {
                        $scope.data.currItem[data] = undefined;
                        panelChange = true;
                    });
                };

                /**
                 * 查询按钮方法定义
                 */
                $scope.search = {
                    line : function () {
                        $scope.gridOptions.hcApi.search();
                    },
                    year : function () {
                        var str = $scope.data.currItem.inv_year + "年";
                        if($scope.data.currItem.inv_month > 0){
                            str += $scope.data.currItem.inv_month + "月";
                        }
                        $('#year_show_columnar').text(str + '工程项目毛利额');
                        $('#year_show_graph').text(str + '工程项目毛利率');
                        return requestApi.post("inv_out_bill_head", "searchyearmargin", $scope.data.currItem)
                            .then(function (response) {
                                var arrValue = {
                                    rateName : [],
                                    serviceRate : [],
                                    divisionRate : [],
                                    chainRate : [],
                                    dataMargin : []
                                };
                                for (var i = 1; i <= 12; i++){
                                    var year_month = $scope.data.currItem.inv_year + '-';
                                    if(i < 10){
                                        year_month += 0;
                                        year_month += i;
                                    }else{
                                        year_month += i;
                                    }
                                    arrValue.rateName.push(i + "月");
                                    var exist = false;
                                    response.inv_out_bill_heads.some(function(value){
                                        if($scope.data.currItem.inv_month > 0 && $scope.data.currItem.inv_month != i){
                                            return true;
                                        }
                                        if(value.year_month == year_month){
                                            exist = true;
                                            arrValue.serviceRate.push(value.service_gross_rate);
                                            arrValue.divisionRate.push(value.division_gross_rate);
                                            arrValue.chainRate.push(value.chain_gross_rate);
                                            arrValue.dataMargin.push({
                                                product : i + '月',
                                                '工程服务商毛利额' : value.service_gross_margin,
                                                '事业部内结毛利额': value.division_gross_margin,
                                                '价值链毛利额': value.chain_gross_margin
                                            });
                                            return true;
                                        }
                                    });
                                    if(!exist){
                                        arrValue.serviceRate.push(0);
                                        arrValue.divisionRate.push(0);
                                        arrValue.chainRate.push(0);
                                        arrValue.dataMargin.push({
                                            product : i + '月',
                                            '工程服务商毛利额' : 0,
                                            '事业部内结毛利额': 0,
                                            '价值链毛利额': 0
                                        });
                                    }
                                }

                                $scope.chartOptionMargin = {
                                    legend: {},
                                    tooltip: {},
                                    //下载图片
                                    toolbox: {
                                        feature: {
                                            saveAsImage: {}
                                        }
                                    },
                                    dataset: {
                                        dimensions: ['product', '工程服务商毛利额', '事业部内结毛利额', '价值链毛利额'],
                                        source: arrValue.dataMargin
                                    },
                                    grid:{
                                        left:"15%",//grid 组件离容器左侧的距离
                                    },
                                    xAxis: {
                                        type: 'category'
                                    },
                                    yAxis: {
                                        name: '万元'
                                    },
                                    // Declare several bar series, each will be mapped
                                    // to a column of dataset.source by default.
                                    series: [
                                        {
                                            type: 'bar'
                                        },
                                        {
                                            type: 'bar'
                                        },
                                        {
                                            type: 'bar'
                                        }
                                    ]
                                };

                                $scope.chartOptionRate = {
                                    tooltip: {
                                        trigger: 'axis'
                                    },
                                    legend: {
                                        data:['工程服务商毛利率','事业部内结毛利率','价值链毛利率']
                                    },
                                    grid: {
                                        left: '3%',
                                        right: '4%',
                                        bottom: '3%',
                                        containLabel: true
                                    },
                                    //下载图片
                                    toolbox: {
                                        feature: {
                                            saveAsImage: {}
                                        }
                                    },
                                    xAxis: {
                                        type: 'category',
                                        boundaryGap: false,
                                        data: arrValue.rateName
                                    },
                                    yAxis: {
                                        type: 'value',
                                        axisLabel: {
                                            formatter: '{value}%'
                                        }

                                    },
                                    series: [
                                        {
                                            name:'工程服务商毛利率',
                                            type:'line',
                                            smooth: true,
                                            data:arrValue.serviceRate
                                        },
                                        {
                                            name:'事业部内结毛利率',
                                            type:'line',
                                            smooth: true,
                                            data:arrValue.divisionRate
                                        },
                                        {
                                            name:'价值链毛利率',
                                            type:'line',
                                            stack: '总量',
                                            data:arrValue.chainRate
                                        }
                                    ]
                                };
                            });
                    },
                    contract : function () {
                        $scope.gridOptions_contract.hcApi.search();
                    },
                    project : function () {
                        $scope.gridOptions_project.hcApi.search();
                    }
                }
            }];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);