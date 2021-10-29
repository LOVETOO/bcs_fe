/**
 * 应收与总账对账表-空白自定义页
 * 2019-03-15
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
                    hcEvents: {
                        rowDoubleClicked: function (params) {
                            $scope.openDetail(params);
                        }
                    },
                    columnDefs : [
                        {
                            type: '序号'
                        }
                        , {
                            headerName: '客户',
                            children:[{
                                headerName: '编码',
                                field: 'customer_code'
                            },{
                                headerName: '名称',
                                field: 'customer_name'
                            }]
                        }
                        , {
                            headerName: '应收模块',
                            children:[{
                                headerName: '期初余额',
                                field: 'amount_lm_f',
                                type: '金额'
                            },{
                                headerName: '借方金额',
                                field: 'amount_in_f',
                                type: '金额'
                            },{
                                headerName: '贷方金额',
                                field: 'amount_out_f',
                                type: '金额'
                            },{
                                headerName: '期末结余',
                                field: 'amount_blnc_f',
                                type: '金额'
                            }]
                        }
                        , {
                            headerName: '总账模块',
                            children:[{
                                headerName: '期初余额',
                                field: 'amount_first',
                                type: '金额'
                            },{
                                headerName: '借方金额',
                                field: 'amount_this_debit',
                                type: '金额'
                            },{
                                headerName: '贷方金额',
                                field: 'amount_this_credit',
                                type: '金额'
                            },{
                                headerName: '期末结余',
                                field: 'amount_end',
                                type: '金额'
                            }]
                        }
                        , {
                            headerName: '应收-总账',
                            children:[{
                                headerName: '期初差额',
                                field: 'amount_lm_var',
                                type: '金额'
                            },{
                                headerName: '借方差额',
                                field: 'amount_debit',
                                type: '金额'
                            },{
                                headerName: '贷方差额',
                                field: 'amount_credit',
                                type: '金额'
                            },{
                                headerName: '期末差额',
                                field: 'amount_var',
                                type: '金额'
                            }]
                        }
                    ]
                };

                //数据定义
                $scope.data = {};
                $scope.data.currItem = {
                    tally_flag: $stateParams.year_month ? 1 : 2, //含未过账
                    search_flag: 2, //显示小差额
                    organization_ids: userbean.loginents[0].entid,  //组织id
                    organization_names: userbean.loginents[0].entname //组织名称
                };

                controllerApi.run({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                /**
                 * 打开应收与总账对账明细表
                 */
                $scope.openDetail = function (params) {
                    var object_id = numberApi.toNumber(params.data.object_id);
                    var object_name = params.data.customer_name;

                    if(object_id > 0){
                        return openBizObj({
                            stateName: 'financeman.glman.gl_ar_reconciliation_detail',
                            params: {
                                object_id: object_id,
                                year_month: $scope.data.year_month,
                                object_name: object_name
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
                        search_flag: $scope.data.currItem.search_flag,
                        tally_flag: $scope.data.currItem.tally_flag
                    };
                    //由对账总表打开
                    if('module' === openBy){
                        postData.year_month = $stateParams.year_month;
                    }

                    return requestApi.post('gl_account_subject_balance', 'glarreconciliation', postData)
                        .then(function (data) {
                            $scope.data.year_month = data.year_month;

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

                            //应收期间
                            return requestApi.post('gl_account_period', 'getcuryearmonthar', {})
                        })
                        .then(function (data) {
                            $scope.data.currItem.yearmonthar = data.year_month;

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
