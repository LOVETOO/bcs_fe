/**
 * 合同完成率分析--自定义页面
 * Created by whl
 * Date:2019-08-26
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
                        epm_project_contracts: []//定义后台关联数组
                    }
                };

                //是否第一次渲染
                //$scope.noFirst = true;

                //是否收起查询面板
                $scope.notPackQuery = false;

                //改变查询面板
                var panelChange = true;

                //搜索条件
                var arrsSearch = ["project_code", "project_name", "project_id", "contract_type", 
                "completed_type", 'contract_month', "contract_code", "contract_name", 
                "contract_id", "valid", 'customer_code', 'customer_name', 'short_name'];

                var dataSum = [
                    {/* 按年 */
                        valid_contract_qty : 0,
                        deliver_qty : 0,
                        sum_percentage : 0
                    },
                    {/* 按合同 */
                        valid_contract_qty : 0,
                        deliver_qty : 0,
                        sum_percentage : 0
                    },
                    {/* 按项目 */
                        valid_contract_qty : 0,
                        deliver_qty : 0,
                        sum_percentage : 0
                    }
                ];

                /**
                 * tab标签页
                 */
                $scope.contract_tab = {
                    data: {
                        title: '数据汇总',
                        active: true
                    },
                    line: {
                        title: '合同明细'
                    }
                };

                //定义表格
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        },{
                            headerName: "工程项目编码",
                            field: "project_code",
                            cellStyle: function (params) {
                                if(params.data.seq == '小计'){
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'font-weight': 'bold'
                                    });
                                }else{
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'background-color': params.data.backg_color
                                    });
                                }
                            },
                            onCellDoubleClicked: function (args) {
                                $scope.openProject(args.data.project_id);
                            }
                        }, {
                            headerName: "工程项目名称",
                            field: "project_name",
                            cellStyle: function (params) {
                                if(params.data.seq == '小计'){
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'font-weight': 'bold'
                                    });
                                }else{
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'background-color': params.data.backg_color
                                    });
                                }
                            }
                            // ,
                            // cellStyle: {'text-align': 'center'},
                            // rowSpan: function (params) {
                            //     if (params.node.data.span_contract) {
                            //         return params.node.data.span_contract;
                            //     }
                            // }
                        },{
                            headerName: "合同编码",
                            field: "contract_code",
                            cellStyle: function (params) {
                                if(params.data.seq == '小计'){
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'font-weight': 'bold'
                                    });
                                }else{
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'background-color': params.data.backg_color
                                    });
                                }
                            },
                            onCellDoubleClicked: function (args) {
                                $scope.openContract(args.data.contract_id, args.data.contract_type);
                            }
                        }, {
                            headerName: "合同名称",
                            field: "contract_name",
                            cellStyle: function (params) {
                                if(params.data.seq == '小计'){
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'font-weight': 'bold'
                                    });
                                }else{
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'background-color': params.data.backg_color
                                    });
                                }
                            }
                        }, {
                            headerName: "结案状态",
                            field: "completed_type",
                            hcDictCode:"epm.contract_completed_type",
                            cellStyle: function (params) {
                                if(params.data.seq == '小计'){
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'font-weight': 'bold'
                                    });
                                }else{
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'background-color': params.data.backg_color
                                    });
                                }
                            }
                        }, {
                            headerName: "有效状态",
                            field: "valid",
                            hcDictCode:"valid",
                            cellStyle: function (params) {
                                if(params.data.seq == '小计'){
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'font-weight': 'bold'
                                    });
                                }else{
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'background-color': params.data.backg_color
                                    });
                                }
                            }
                        }, {
                            headerName: "客户编码",
                            field: "customer_code",
                            cellStyle: function (params) {
                                if(params.data.seq == '小计'){
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'font-weight': 'bold'
                                    });
                                }else{
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'background-color': params.data.backg_color
                                    });
                                }
                            }
                        }, {
                            headerName: "客户名称",
                            field: "customer_name",
                            cellStyle: function (params) {
                                if(params.data.seq == '小计'){
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'font-weight': 'bold'
                                    });
                                }else{
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'background-color': params.data.backg_color
                                    });
                                }
                            }
                        }, {
                            headerName: "客户简称",
                            field: "short_name",
                            cellStyle: function (params) {
                                if(params.data.seq == '小计'){
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'font-weight': 'bold'
                                    });
                                }else{
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'background-color': params.data.backg_color
                                    });
                                }
                            }
                        }, {
                            headerName: "合同类型",
                            field: "contract_type",
                            hcDictCode:"epm.contract_type",
                            cellStyle: function (params) {
                                if(params.data.seq == '小计'){
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'font-weight': 'bold'
                                    });
                                }else{
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'background-color': params.data.backg_color
                                    });
                                }
                            }
                        }, {
                            headerName: "折扣单号",
                            field: "discount_apply_code",
                            cellStyle: function (params) {
                                if(params.data.seq == '小计'){
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'font-weight': 'bold'
                                    });
                                }else{
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'background-color': params.data.backg_color
                                    });
                                }
                            }
                        }, {
                            headerName: "折扣有效期",
                            field: "discount_valid_date",
                            type:"日期",
                            cellStyle: function (params) {
                                if(params.data.seq == '小计'){
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'font-weight': 'bold'
                                    });
                                }else{
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'background-color': params.data.backg_color
                                    });
                                }
                            }
                        }, {
                            headerName: "产品序号",
                            field: "seq",
                            cellStyle: function (params) {
                                if(params.data.seq == '小计'){
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'font-weight': 'bold'
                                    });
                                }else{
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'text-align': 'center',
                                        'background-color': params.data.backg_color
                                    });
                                }
                            }
                        }, {
                            headerName: "产品编码",
                            field: "item_code",
                            cellStyle: function (params) {
                                if(params.data.seq == '小计'){
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'font-weight': 'bold'
                                    });
                                }else{
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'background-color': params.data.backg_color
                                    });
                                }
                            }
                        }, {
                            headerName: "产品名称",
                            field: "item_name",
                            cellStyle: function (params) {
                                if(params.data.seq == '小计'){
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'font-weight': 'bold'
                                    });
                                }else{
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'background-color': params.data.backg_color
                                    });
                                }
                            }
                        }, {
                            headerName: "产品规格",
                            field: "spec",
                            cellStyle: function (params) {
                                if(params.data.seq == '小计'){
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'font-weight': 'bold'
                                    });
                                }else{
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'background-color': params.data.backg_color
                                    });
                                }
                            }
                        }, {
                            headerName: "产品颜色",
                            field: "color",
                            cellStyle: function (params) {
                                if(params.data.seq == '小计'){
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'font-weight': 'bold'
                                    });
                                }else{
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'text-align': 'center',
                                        'background-color': params.data.backg_color
                                    });
                                }
                            }
                        }, {
                            headerName: "原合同数量",
                            field: "contract_qty",
                            type:"数量",
                            cellStyle: function (params) {
                                if(params.data.seq == '小计'){
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'text-align': 'center',
                                        'font-weight': 'bold'
                                    });
                                }else{
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'text-align': 'center',
                                        'background-color': params.data.backg_color
                                    });
                                }

                            }
                        }, {
                            headerName: "已替换数量",
                            field: "replaced_qty",
                            type:"数量",
                            cellStyle: function (params) {
                                if(params.data.seq == '小计'){
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'text-align': 'center',
                                        'font-weight': 'bold'
                                    });
                                }else{
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'text-align': 'center',
                                        'background-color': params.data.backg_color
                                    });
                                }
                            }
                        }, {
                            headerName: "已延期数量",
                            field: "delayed_qty",
                            type:"数量",
                            cellStyle: function (params) {
                                if(params.data.seq == '小计'){
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'text-align': 'center',
                                        'font-weight': 'bold'
                                    });
                                }else{
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'text-align': 'center',
                                        'background-color': params.data.backg_color
                                    });
                                }
                            }
                        }, {
                            headerName: "有效合同数量",
                            field: "valid_qty",
                            type:"数量",
                            cellStyle: function (params) {
                                if(params.data.seq == '小计'){
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'text-align': 'center',
                                        'font-weight': 'bold'
                                    });
                                }else{
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'text-align': 'center',
                                        'background-color': params.data.backg_color
                                    });
                                }
                            }
                        }, {
                            headerName: "已发货数量",
                            field: "qty_bill",
                            type:"数量",
                            cellStyle: function (params) {
                                if(params.data.seq == '小计'){
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'text-align': 'center',
                                        'font-weight': 'bold'
                                    });
                                }else{
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'text-align': 'center',
                                        'background-color': params.data.backg_color
                                    });
                                }
                            }
                        }, {
                            headerName: "出货完成率",
                            field: "inv_rate",
                            type:"百分比",
                            cellStyle: function (params) {
                                if(params.data.seq == '小计'){
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'text-align': 'center',
                                        'font-weight': 'bold'
                                    });
                                }else{
                                    return angular.extend(getDefaultCellStyle(params), {
                                        'text-align': 'center',
                                        'background-color': params.data.backg_color
                                    });
                                }
                            }
                        }
                    ],hcAfterRequest:function(response){
                        var isOdd = true;
                        var span_count = 0;
                        response.epm_project_contracts.forEach(function (value ,index) {
                            if(index == 0){
                                span_count = value.span_contract;
                                value.backg_color = oddEvenColor(isOdd);
                                span_count = numberApi.sub(span_count, 1);
                            }else if(span_count > 0){
                                value.backg_color = oddEvenColor(isOdd);
                                span_count = numberApi.sub(span_count, 1);
                            }else{
                                span_count = value.span_contract;
                                isOdd = isOdd ? false : true;
                                value.backg_color = oddEvenColor(isOdd);
                                span_count = numberApi.sub(span_count, 1);
                            }
                        });
                        $scope.gridOptions.hcApi.setRowData(response.epm_project_contracts);
                    },
                    hcBeforeRequest: function (searchObj) {//发送查询条件
                        arrsSearch.forEach(function (data) {
                            searchObj[data] = $scope.data.currItem[data];
                        });
                        searchObj.contract_year = $scope.data.currItem.contract_year;
                    },
                    //取消分页
                    //hcNoPaging:true
                    //定义查询类与方法
                    hcRequestAction:'contract_inv_rate',
                    hcDataRelationName:'epm_project_contracts',
                    hcClassId:'epm_project_contract'
                };

                 //定义表格
                 $scope.gridOptions_contract = {
                    columnDefs: [
                        {
                            type: '序号'
                        },{
                            headerName: "工程项目编码",
                            field: "project_code",
                            onCellDoubleClicked: function (args) {
                                $scope.openProject(args.data.project_id);
                            }
                        },
                        {
                            headerName: "工程项目名称",
                            field: "project_name"
                        },
                        {
                            headerName: "合同编码",
                            field: "contract_code",
                            onCellDoubleClicked: function (args) {
                                $scope.openContract(args.data.contract_id, args.data.contract_type);
                            }
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
                            headerName: "有效合同数量",
                            field: "valid_qty",
                            type : '数量'
                        },
                        {
                            headerName: "已发货数量",
                            field: "confirm_out_qty",
                            type : '数量'
                        },
                        {
                            headerName: "出货完成率",
                            field: "inv_rate",
                            type:"百分比"
                        }
                    ],hcAfterRequest:function(response){
                        dataSum[1].valid_contract_qty
                                = numberApi.formatNumber(''+ response.valid_contract_qty, 2);
                        dataSum[1].deliver_qty
                                = numberApi.formatNumber(''+ response.deliver_qty, 2);
                        if(response.valid_contract_qty > 0){
                            dataSum[1].sum_percentage = numberApi.divide(response.deliver_qty, response.valid_contract_qty);
                        }else{
                            dataSum[1].sum_percentage = 0;
                        }
                        $scope.gridOptions_contract.hcApi.setRowData(response.epm_project_contracts);
                        ['valid_contract_qty', 'deliver_qty', 'sum_percentage'].forEach(function(field){
                            $scope[field] = dataSum[$scope.data.currItem.search_flag - 2][field];
                        });
                    },
                    hcBeforeRequest: function (searchObj) {//发送查询条件
                        arrsSearch.forEach(function (data) {
                            searchObj[data] = $scope.data.currItem[data];
                        });
                        searchObj.contract_year = $scope.data.currItem.contract_year;
                    },
                    //取消分页
                    //hcNoPaging:true
                    //定义查询类与方法
                    hcRequestAction:'searchcontractrate',
                    hcDataRelationName:'epm_project_contracts',
                    hcClassId:'epm_project_contract'
                }

                //定义表格
                $scope.gridOptions_project = {
                    columnDefs: [
                        {
                            type: '序号'
                        },{
                            headerName: "工程项目编码",
                            field: "project_code",
                            onCellDoubleClicked: function (args) {
                                $scope.openProject(args.data.project_id);
                            }
                        },
                        {
                            headerName: "工程项目名称",
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
                            headerName: "有效合同数量",
                            field: "valid_qty",
                            type : '数量'
                        },
                        {
                            headerName: "已发货数量",
                            field: "confirm_out_qty",
                            type : '数量'
                        },
                        {
                            headerName: "出货完成率",
                            field: "inv_rate",
                            type:"百分比"
                        }
                    ],hcAfterRequest:function(response){
                        dataSum[2].valid_contract_qty
                                = numberApi.formatNumber(''+ response.valid_contract_qty, 2);
                        dataSum[2].deliver_qty
                                = numberApi.formatNumber(''+ response.deliver_qty, 2);
                        if(response.valid_contract_qty > 0){
                            dataSum[2].sum_percentage = numberApi.divide(response.deliver_qty, response.valid_contract_qty);
                        }else{
                            dataSum[2].sum_percentage = 0;
                        }
                        $scope.gridOptions_project.hcApi.setRowData(response.epm_project_contracts);
                        ['valid_contract_qty', 'deliver_qty', 'sum_percentage'].forEach(function(field){
                            $scope[field] = dataSum[$scope.data.currItem.search_flag - 2][field];
                        });
                    },
                    hcBeforeRequest: function (searchObj) {//发送查询条件
                        arrsSearch.forEach(function (data) {
                            searchObj[data] = $scope.data.currItem[data];
                        });
                        searchObj.contract_year = $scope.data.currItem.contract_year;
                    },
                    //取消分页
                    //hcNoPaging:true
                    //定义查询类与方法
                    hcRequestAction:'searchprojectrate',
                    hcDataRelationName:'epm_project_contracts',
                    hcClassId:'epm_project_contract'
                }

                //继承控制器
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                /*===============打开模态框===============*/
                /**
                 * 打开项目
                 */
                $scope.openProject = function (project_id){
                    //可以打开，默认不可以
                    var canOpan = false;
                    if(user.userid == 'admin'){//判断登陆用户
                        canOpan = true;
                    }else{//判断用的角色代号
                        user.roleofusers.some(function(value){
                            if(value.roleid == 'htwcl_epm_report' || value.roleid == 'admins'){
                                canOpan = true;
                                return true;
                            }
                        });
                    }
                    if(canOpan){
                        openBizObj({
                            stateName: 'epmman.epm_project_prop',
                            params: {
                                id: project_id,
                                readonly: true
                            }
                        });
                    }
                }
                /**
                 * 打开合同
                 */
                $scope.openContract = function (contract_id, contract_type){
                    //可以打开，默认不可以
                    var canOpan = false;
                    if(user.userid == 'admin'){//判断登陆用户
                        canOpan = true;
                    }else{//判断用的角色代号
                        user.roleofusers.some(function(value){
                            if(value.roleid == 'htwcl_epm_contract' || value.roleid == 'admins'){
                                canOpan = true;
                                return true;
                            }
                        });
                    }
                    if(canOpan){
                        openBizObj({
                            stateName: contract_type == 2?'epmman.epm_project_contract_prop' : 'epmman.epm_autotrophy_contract_prop',
                            params: {
                                id: contract_id,
                                readonly: true
                            }
                        });
                    }
                }
                

                //获取颜色
                function oddEvenColor (isOdd) {
                    return isOdd? "papayawhip":"lightgreen";
                }

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
                            $scope.data.currItem.search_flag = 2;
                        }
                        var arr = [];
                        arr.push($scope.search.line());
                        arr.push($scope.search.year());
                        arr.push($scope.search.contract());
                        arr.push($scope.search.project());
                        $q.all(arr).then(function(){
                            panelChange = false;
                            ['valid_contract_qty', 'deliver_qty', 'sum_percentage'].forEach(function(field){
                                $scope[field] = dataSum[0][field];
                            });
                        });
                    }else{
                        if (params.id == 'data') {
                            $scope.press_year = 2;
                            $scope.press_contract = 1;
                            $scope.press_project = 1;
                            ['valid_contract_qty', 'deliver_qty', 'sum_percentage'].forEach(function(field){
                                $scope[field] = dataSum[0][field];
                            });
                        } else if (params.id == 'line') {}
                    }
                    
                };

                $scope.changePattern = function (value){
                    if(value == 'year'){
                        $scope.press_year = 2;
                        $scope.press_contract = 1;
                        $scope.press_project = 1;
                        ['valid_contract_qty', 'deliver_qty', 'sum_percentage'].forEach(function(field){
                            $scope[field] = dataSum[0][field];
                        });
                        $scope.data.currItem.search_flag = 2;
                    }else if (value == 'contract'){
                        $scope.press_year = 1;
                        $scope.press_contract = 2;
                        $scope.press_project = 1;
                        ['valid_contract_qty', 'deliver_qty', 'sum_percentage'].forEach(function(field){
                            $scope[field] = dataSum[1][field];
                        });
                        $scope.data.currItem.search_flag = 3;
                    }else{
                        $scope.press_year = 1;
                        $scope.press_contract = 1;
                        $scope.press_project = 2;
                        $scope.data.currItem.search_flag = 4;
                        ['valid_contract_qty', 'deliver_qty', 'sum_percentage'].forEach(function(field){
                            $scope[field] = dataSum[2][field];
                        });
                    }
                    if(panelChange ){
                        var arr = [];
                        arr.push($scope.search.line());
                        arr.push($scope.search.year());
                        arr.push($scope.search.contract());
                        arr.push($scope.search.project());
                        $q.all(arr).then(function(){
                            panelChange = false;
                            ['valid_contract_qty', 'deliver_qty', 'sum_percentage'].forEach(function(field){
                                $scope[field] = dataSum[$scope.data.currItem.search_flag - 2][field];
                            });
                        });
                    }
                }

                //获取默认样式
                function getDefaultCellStyle(params) {
                    var style = {};
                    if ($scope.gridOptions.defaultColDef) {
                        var defaultStyle = $scope.gridOptions.defaultColDef.cellStyle;
                        if (defaultStyle) {
                            if (angular.isObject(defaultStyle))
                                style = defaultStyle;
                            else if (angular.isFunction(defaultStyle))
                                style = defaultStyle(params);
                        }
                    }
                    return style;
                }

                /**
                 * 网格完成事件
                 */
                gridApi.execute($scope.gridOptions_project, function () {
                    $scope.data.currItem.contract_year = new Date().getFullYear();
                    $scope.press_year = 2;
                    $scope.press_contract = 1;
                    $scope.press_project = 1;
                    $scope.data.currItem.search_flag = 2;
                    var arr = [];
                    //arr.push($scope.search.line());
                    arr.push($scope.search.year());
                    //arr.push($scope.search.contract());
                    //arr.push($scope.search.project());
                    $q.all(arr).then(function(){
                        panelChange = false;
                        ['valid_contract_qty', 'deliver_qty', 'sum_percentage'].forEach(function(field){
                            $scope[field] = dataSum[$scope.data.currItem.search_flag - 2][field];
                        });
                    });
                });

                // $scope.showProvinces = function ($chart){
                //     $chart.on('click', function (param) {
                //         if($scope.is_pro){
                //             $scope.is_pro = false;
                //             $scope.search();
                //         }else{
                //             $scope.pro_name = param.name;
                //             $scope.is_pro = true;
                //             $scope.search();
                //         }
                //     });
                // };

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
                                ['valid_contract_qty', 'deliver_qty', 'sum_percentage'].forEach(function(field){
                                    $scope[field] = dataSum[$scope.data.currItem.search_flag - 2][field];
                                });
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

                //工程项目 查询
                $scope.commonSearchSetting = {
                    epmProject : {
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
                    epmProjectContract : {
                        sqlWhere: " contract_type in(1, 2)",
                        afterOk: function (result) {
                            $scope.data.currItem.contract_id = result.contract_id;
                            $scope.data.currItem.contract_code = result.contract_code;
                            $scope.data.currItem.contract_name = result.contract_name;
                            $scope.changePanel();
                        }
                    },
                    epmCustomer: {
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
                        var str = $scope.data.currItem.contract_year + "年";
                        if($scope.data.currItem.contract_month > 0){
                            str += $scope.data.currItem.contract_month + "月";
                        }
                        str +='合同出货完成率分析(按数量统计):';
                        $('#year_show').text(str);
                        return requestApi.post("epm_project_contract", "searchyearcontractrate", $scope.data.currItem)
                            .then(function (response) {
                                var validQty = numberApi.sum(response.epm_project_contracts, 'valid_qty');
                                var deliverQty = numberApi.sum(response.epm_project_contracts, 'confirm_out_qty');
                                dataSum[0].valid_contract_qty
                                     = numberApi.formatNumber(''+ validQty, 2);
                                dataSum[0].deliver_qty
                                     = numberApi.formatNumber(''+ deliverQty, 2);
                                if(validQty > 0){
                                    dataSum[0].sum_percentage = numberApi.divide(deliverQty, validQty);
                                }else{
                                    dataSum[0].sum_percentage = 0;
                                }
                                //展示柱状图
                                var arrName = [];
                                var arrValue = [];
                                var year = new Date().getFullYear();
                                if(response.contract_year > 0){
                                    year = response.contract_year;
                                }
                                var month = 12;
                                for (var i = 1; i <= month; i++){
                                    var year_month = year + '-';
                                    if(i < 10){
                                        year_month += 0;
                                        year_month += i;
                                    }else{
                                        year_month += i;
                                    }
                                    arrName.push(i + "月");
                                    var exist = false;
                                    response.epm_project_contracts.some(function(value){
                                        if($scope.data.currItem.contract_month > 0 && $scope.data.currItem.contract_month != i){
                                            return true;
                                        }
                                        if(value.year_month == year_month){
                                            exist = true;
                                            arrValue.push(numberApi.mutiply(100,value.inv_rate));
                                            return true;
                                        }
                                    });
                                    if(!exist){
                                        arrValue.push(0);
                                    }
                                }
                                var arrValueBig = arrValue.map(function(value){
                                    return numberApi.sum(value, 10);
                                });
                                $scope.chartOption = {
                                    color: ['#3398DB'],
                                    xAxis: {
                                        type: 'category',
                                        data: arrName
                                    },
                                    yAxis: {
                                        type: 'value',
                                        name: '完成率',
                                        axisLabel: {
                                            formatter: '{value}%'
                                        }
                                    },
                                    series: [{
                                        data: arrValue,
                                        label: { //文本标签
                                            show: true, //显示
                                            position: 'top', //显示位置
                                            formatter: '{c}%'
                                        },
                                        type: 'bar',
                                        itemStyle: {   
                                            //通常情况下：
                                            normal:{  
                                                color: function (params){
                                                    var colorList = [
                                                        '#6c808d',
                                                        '#e46c68',
                                                        '#51a5ff',
                                                        '#6c808d',
                                                        '#e46c68',
                                                        '#51a5ff',
                                                        '#6c808d',
                                                        '#e46c68',
                                                        '#51a5ff',
                                                        '#6c808d',
                                                        '#e46c68',
                                                        '#51a5ff'];
                                                    return colorList[params.dataIndex];
                                                }
                                            },
                                            //鼠标悬停时：
                                            emphasis: {
                                                    shadowBlur: 10,
                                                    shadowOffsetX: 0,
                                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                            }
                                        }
                                    },{
                                        data: arrValueBig,
                                        type: 'line'
                                    }]
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