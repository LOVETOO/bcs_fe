/**
 * 应付与总账对账明细表-空白自定义页
 * 2019-03-13
 */
define(
    ['module', 'controllerApi', 'base_diy_page','requestApi', 'loopApi', 'swalApi', 'openBizObj', 'numberApi', 'strApi'],
    function (module, controllerApi, base_diy_page, requestApi, loopApi, swalApi, openBizObj, numberApi, strApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$stateParams',
            //控制器函数
            function ($scope, $stateParams) {
                $scope.gridOptions = {
                    columnDefs : [
                        {
                            type: '序号'
                        }
                        , {
                            headerName: '供应商',
                            children:[{
                                headerName: '编码',
                                field: 'vendor_code'
                            },{
                                headerName: '名称',
                                field: 'vendor_name',
                                width: 120
                            }]
                        }
                        , {
                            field: 'hobject_type',
                            headerName: '匹配情况'
                        }
                        , {
                            headerName: '应付模块',
                            children:[{
                                headerName: '单据类型',
                                field: 'object_type',
                                onCellDoubleClicked: function (params) {
                                    $scope.openApProp(params);
                                }
                            },{
                                headerName: '单据号',
                                field: 'invbillno',
                                onCellDoubleClicked: function (params) {
                                    $scope.openApProp(params);
                                }
                            },{
                                headerName: '借方金额',
                                field: 'amount_in_f',
                                type: '金额',
                                onCellDoubleClicked: function (params) {
                                    $scope.openApProp(params);
                                }
                            },{
                                headerName: '贷方金额',
                                field: 'amount_out_f',
                                type: '金额',
                                onCellDoubleClicked: function (params) {
                                    $scope.openApProp(params);
                                }
                            }]
                        }
                        , {
                            headerName: '总账模块',
                            children:[{
                                headerName: '凭证类型',
                                field: 'credence_name',
                                onCellDoubleClicked: function (params) {
                                    $scope.openGlProp(params);
                                }
                            },{
                                headerName: '凭证号',
                                field: 'credence_no',
                                onCellDoubleClicked: function (params) {
                                    $scope.openGlProp(params);
                                }
                            },{
                                headerName: '科目代码',
                                field: 'km_code',
                                onCellDoubleClicked: function (params) {
                                    $scope.openGlProp(params);
                                }
                            },{
                                headerName: '科目名称',
                                field: 'km_name',
                                onCellDoubleClicked: function (params) {
                                    $scope.openGlProp(params);
                                }
                            },{
                                headerName: '借方金额',
                                field: 'amount_debit_f',
                                type: '金额',
                                onCellDoubleClicked: function (params) {
                                    $scope.openGlProp(params);
                                }
                            },{
                                headerName: '贷方金额',
                                field: 'amount_credit_f',
                                type: '金额',
                                onCellDoubleClicked: function (params) {
                                    $scope.openGlProp(params);
                                }
                            }]
                        }
                        , {
                            headerName: '应付-总账差额',
                            children:[{
                                headerName: '借方',
                                field: 'v_damount1',
                                type: '金额'
                            },{
                                headerName: '贷方',
                                field: 'v_damount2',
                                type: '金额'
                            }]
                        }
                    ]
                };

                //数据定义
                $scope.data = {};
                $scope.data.currItem = {
                    tally_flag: 2, //含未过账
                    search_flag: $stateParams.year_month ? 1 : 2, //只显示匹配差异的数据
                    is_object: 0,  //对账类型：0往来 1暂估 2全部
                    organization_ids: userbean.loginents[0].entid,  //组织id
                    organization_names: userbean.loginents[0].entname //组织名称
                };

                controllerApi.run({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                /**
                 * 获取网格列索引
                 */
                $scope.getIdxByField = function (fieldname) {
                    var idx;
                    var colDefs = $scope.gridOptions.columnDefs;
                    loopApi.forLoop(colDefs.length, function (i) {
                        if(colDefs[i].children && colDefs[i].children.length){
                            loopApi.forLoop(colDefs[i].children.length, function (j) {
                                if(colDefs[i].children[j].field === fieldname){
                                    idx = i;
                                    return true;
                                }
                            })
                        }else{
                            if(colDefs[i].field === fieldname){
                                idx = i;
                                return true;
                            }
                        }
                    });

                    return idx;
                };

                /**
                 * 打开应付模块详情页
                 */
                $scope.openApProp = function (params) {
                    var order_id = numberApi.toNumber(params.data.order_id);
                    var order_type = params.data.object_type.trim();
                    var stateName = '';

                    if(order_id > 0) {
                        switch (order_type){
                            case '本月开票': {
                                stateName = 'financeman.apman.finap_invoice_match_prop';
                                break;
                            }
                            case '本月已付': {
                                stateName = 'financeman.apman.finap_pro_pay_prop';
                                break;
                            }
                        }
                        return openBizObj({
                            stateName: stateName,
                            params: {
                                id: order_id
                            }
                        }).result;
                    }
                };

                /**
                 * 打开记账凭证详情页
                 */
                $scope.openGlProp = function (params) {
                    var gl_credence_head_id = numberApi.toNumber(params.data.gl_credence_head_id);

                    if(gl_credence_head_id > 0) {
                        return openBizObj({
                            stateName: 'financeman.glman.gl_credence_prop',
                            params: {
                                id: gl_credence_head_id
                            }
                        }).result;
                    }
                };

                /**
                 * 条件查询
                 */
                $scope.searchByCon = function (openBy) {
                    var postData = {
                        organization_ids: $scope.data.currItem.organization_ids,
                        year_month: $scope.data.currItem.year_month,
                        // is_object: $scope.data.currItem.is_object,
                        search_flag: $scope.data.currItem.search_flag
                    };
                    //由其他页面双击打开
                    if(strApi.isNotNull(openBy)){
                        postData.year_month = $stateParams.year_month;

                        if('reconciliation' === openBy){
                            postData.object_id = numberApi.toNumber($stateParams.object_id) > 0 ? numberApi.toNumber($stateParams.object_id) : 0;
                            $scope.gridOptions.columnDefs[$scope.getIdxByField('vendor_code')].headerName
                                = "供应商[" + $stateParams.object_name + "]";
                            //重设表头名
                            $scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);
                        }
                    }else{
                        $scope.gridOptions.columnDefs[$scope.getIdxByField('vendor_code')].headerName = "供应商";
                        //重设表头名
                        $scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);
                    }

                    return requestApi.post('gl_account_subject_balance', 'glapreconciliationfx', postData)
                        .then(function (data) {
                            $scope.data.currItem.gl_account_subject_balances = data.gl_account_subject_balances;
                            $scope.gridOptions.hcApi.setRowData(data.gl_account_subject_balances);
                        })
                };

                /**
                 * 初始化
                 */
                $scope.doInit = function () {
                    $scope.hcSuper.doInit()
                        .then(function () {
                            //总账期间
                            return requestApi.post('gl_account_period', 'getglcurrperiod', {})
                        })
                        .then(function (data) {
                            $scope.data.currItem.year_month = $stateParams.year_month ? $stateParams.year_month : data.year_month;
                            $scope.data.currItem.yearmonthgl = data.year_month;

                            //应付期间
                            return requestApi.post('gl_account_period', 'getcuryearmonthap', {})
                        })
                        .then(function (data) {
                            $scope.data.currItem.yearmonthap = data.year_month;

                            var openBy = '';
                            if($stateParams.year_month){
                                if(numberApi.toNumber($stateParams.object_id) > 0){
                                    openBy = 'reconciliation'; //由对账表打开
                                }else{
                                    openBy = 'module';  //由总表打开
                                }
                            }
                            $scope.searchByCon(openBy);
                        })
                };

                //隐藏头部工具栏
                $scope.hideToolButtons = true;
            }
        ];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);
