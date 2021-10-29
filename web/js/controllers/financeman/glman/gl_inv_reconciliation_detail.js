/**
 * 存货与总账对账明细表-空白自定义页
 * 2019-03-14
 */
define(
    ['module', 'controllerApi', 'base_diy_page','requestApi', 'loopApi', 'swalApi', 'openBizObj', 'numberApi'],
    function (module, controllerApi, base_diy_page, requestApi, loopApi, swalApi, openBizObj, numberApi) {
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
                            field: 'hobject_type',
                            headerName: '匹配情况'
                        }
                        , {
                            headerName: '存货模块',
                            children:[{
                                headerName: '单据类型',
                                field: 'object_type',
                                onCellDoubleClicked: function (params) {
                                    $scope.openInvProp(params);
                                }
                            },{
                                headerName: '单据号',
                                field: 'invbillno',
                                onCellDoubleClicked: function (params) {
                                    $scope.openInvProp(params);
                                }
                            },{
                                headerName: '借方金额',
                                field: 'amount_in_f',
                                type: '金额',
                                onCellDoubleClicked: function (params) {
                                    $scope.openInvProp(params);
                                }
                            },{
                                headerName: '贷方金额',
                                field: 'amount_out_f',
                                type: '金额',
                                onCellDoubleClicked: function (params) {
                                    $scope.openInvProp(params);
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
                            headerName: '存货-总账差额',
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
                 * 打开存货模块详情页
                 */
                $scope.openInvProp = function (params) {
                    var order_id = numberApi.toNumber(params.data.order_id);
                    var billtypecode = params.data.billtypecode;
                    var is_have_order = numberApi.toNumber(params.data.is_have_order);

                    var stateName = '';

                    if(order_id > 0) {
                        switch (billtypecode){
                            case '0101': { //采购入库
                                if(is_have_order == 2){
                                    stateName = 'proman.inv_in_bill_prop';
                                }else{
                                    stateName = 'proman.inv_in_bill_none_prop';
                                }
                                break;
                            }
                            case '0204': { //销售出库
                                if(is_have_order == 2){
                                    stateName = 'invman.inv_out_bill_order_prop';
                                }else{
                                    stateName = 'invman.inv_out_bill_no_order_prop';
                                }
                                break;
                            }
                            case '0206': { //销售退货
                                stateName = 'saleman.sa_out_bill_return_prop';
                                break;
                            }
                            case '0199': {  //其他入库
                                stateName = 'invman.inv_in_ware_bill_prop';
                                break;
                            }
                            case '0299': {  //其他出库
                                stateName = 'invman.inv_out_ware_bill_prop';
                                break;
                            }
                            case '0301': {  //库存金额调整
                                stateName = 'invman.stkamountadjustbill_prop';
                                break;
                            }
                            case '0214': {  //委托代销结算
                                stateName = 'saleman.sa_out_bill_con_settle_prop';
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
                        is_object: $scope.data.currItem.is_object,
                        is_init: $scope.data.currItem.is_init,
                        search_flag: $scope.data.currItem.search_flag
                    };
                    if('module' === openBy){
                        postData.year_month = $stateParams.year_month
                    }
                    return requestApi.post('gl_account_subject_balance', 'glinvreconciliationfx', postData)
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

                            //存货期间
                            return requestApi.post('gl_account_period', 'getinvyearmonth', {})
                        })
                        .then(function (data) {
                            $scope.data.currItem.yearmonthinv = data.year_month;

                            var openBy = $stateParams.year_month ? 'module' : '';
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
