/**
 * 业务与总账对账总表-空白自定义页
 * 2019-03-12
 */
define(
    ['module', 'controllerApi', 'base_diy_page','requestApi', 'loopApi', 'swalApi', 'openBizObj', 'numberApi', 'strApi'],
    function (module, controllerApi, base_diy_page, requestApi, loopApi, swalApi, openBizObj, numberApi, strApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$stateParams',
            //控制器函数
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs : [
                        {
                            type: '序号'
                        }
                        ,{
                            headerName: '对账内容',
                            field: 'module_name'
                        }
                        , {
                            headerName: '业务模块',
                            children:[{
                                headerName: '期初数',
                                field: 'amount_lm_y',
                                type: '金额',
                                onCellDoubleClicked: function (params) {
                                    $scope.openReconciliationDetail(params);
                                }
                            },{
                                headerName: '借方发生数',
                                field: 'amount_in_y',
                                type: '金额',
                                onCellDoubleClicked: function (params) {
                                    $scope.openReconciliationDetail(params);
                                }
                            },{
                                headerName: '贷方发生数',
                                field: 'amount_out_y',
                                type: '金额',
                                onCellDoubleClicked: function (params) {
                                    $scope.openReconciliationDetail(params);
                                }
                            },{
                                headerName: '期末数',
                                field: 'amount_blnc_y',
                                type: '金额',
                                onCellDoubleClicked: function (params) {
                                    $scope.openReconciliationDetail(params);
                                }
                            }]
                        }
                        , {
                            headerName: '财务总账',
                            children:[{
                                headerName: '期初数',
                                field: 'amount_lm_f',
                                type: '金额',
                                onCellDoubleClicked: function (params) {
                                    $scope.openCredenceDetail(params);
                                }
                            },{
                                headerName: '借方发生数',
                                field: 'amount_in_f',
                                type: '金额',
                                onCellDoubleClicked: function (params) {
                                    $scope.openCredenceDetail(params);
                                }
                            },{
                                headerName: '贷方发生数',
                                field: 'amount_out_f',
                                type: '金额',
                                onCellDoubleClicked: function (params) {
                                    $scope.openCredenceDetail(params);
                                }
                            },{
                                headerName: '期末数',
                                field: 'amount_blnc_f',
                                type: '金额',
                                onCellDoubleClicked: function (params) {
                                    $scope.openCredenceDetail(params);
                                }
                            }]
                        }
                        ,{
                            headerName: '业务-总账差异',
                            children:[{
                                headerName: '期初数',
                                field: 'amount_adp',
                                type: '金额',
                                onCellDoubleClicked: function (params) {
                                    $scope.openReconciliation(params);
                                }
                            },{
                                headerName: '借方发生数',
                                field: 'amount_debit',
                                type: '金额',
                                onCellDoubleClicked: function (params) {
                                    $scope.openReconciliation(params);
                                }
                            },{
                                headerName: '贷方发生数',
                                field: 'amount_credit',
                                type: '金额',
                                onCellDoubleClicked: function (params) {
                                    $scope.openReconciliation(params);
                                }
                            },{
                                headerName: '期末数',
                                field: 'amount_udna',
                                type: '金额',
                                onCellDoubleClicked: function (params) {
                                    $scope.openReconciliation(params);
                                }
                            }]
                        }
                        ,{
                            headerName: '总账对应科目(多个科目用‘,’分隔)',
                            field: 'module_cfmp',
                            editable: true
                        }
                    ]
                };

                //数据定义
                $scope.data = {};
                $scope.data.currItem = {
                    is_sa: 1 //是否模拟过账（1否2是），默认否
                };

                controllerApi.run({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                /**
                 * 打开业务与总账对账明细表
                 */
                $scope.openReconciliationDetail = function (params) {
                    var module_code = params.data.module_code;
                    var year_month = $scope.data.year_month;

                    var stateName = '';
                    var args = { year_month: year_month };

                    switch (module_code){
                        case 'R1': {    //应收账款
                            stateName = 'financeman.glman.gl_ar_reconciliation_detail';
                            break;
                        }
                        case 'R2': {    //应付账款
                            stateName = 'financeman.glman.gl_ap_reconciliation_detail';
                            break;
                        }
                        case 'R3': {    //现金
                            stateName = 'financeman.glman.gl_fund_reconciliation_detail';
                            args.fund_account_type = 1;
                            break;
                        }
                        case 'R4': {    //银行存款
                            stateName = 'financeman.glman.gl_fund_reconciliation_detail';
                            args.fund_account_type = 2;
                            break;
                        }
                        case 'R5': {    //存货
                            stateName = 'financeman.glman.gl_inv_reconciliation_detail';
                            break;
                        }
                    }
                    return openBizObj({
                        stateName: stateName,
                        params: args
                    }).result;
                };

                /**
                 * 打开明细分类账
                 */
                $scope.openCredenceDetail = function (params) {
                    var year_month = params.data.year_month;

                    //取对应科目的第一个
                    var kms = params.data.module_cfmp.split(',');
                    var km_code = kms.length ? kms[0] : '';
                    var km_id = 0;

                    if(strApi.isNull(km_code)){
                        return swalApi.info('请设置总账对应科目');
                    }

                    //根据编码查科目id
                    requestApi.post('gl_account_subject', 'search', {sqlwhere: "km_code = '" + km_code + "'"})
                        .then(function (data) {
                            if(data.gl_account_subjects.length){
                                km_id = data.gl_account_subjects[0].gl_account_subject_id;
                            }else{
                                return swalApi.info('不存在编码【'+km_code+'】的会计科目');
                            }

                            return openBizObj({
                                stateName: 'financeman.glman.gl_credence_detail',
                                params: {
                                    year_month_start: year_month,
                                    km_id: km_id
                                }
                            }).result;
                        });
                };

                /**
                 * 打开业务与总账对账表
                 */
                $scope.openReconciliation = function (params) {
                    var module_code = params.data.module_code;
                    var year_month = $scope.data.year_month;

                    var stateName = '';
                    var args = { year_month: year_month };

                    switch (module_code){
                        case 'R1': {    //应收账款
                            stateName = 'financeman.glman.gl_ar_reconciliation';
                            break;
                        }
                        case 'R2': {    //应付账款
                            stateName = 'financeman.glman.gl_ap_reconciliation';
                            break;
                        }
                        case 'R3': {    //现金
                            stateName = 'financeman.glman.gl_fund_reconciliation';
                            args.fund_account_type = 1;
                            break;
                        }
                        case 'R4': {    //银行存款
                            stateName = 'financeman.glman.gl_fund_reconciliation';
                            args.fund_account_type = 2;
                            break;
                        }
                        case 'R5': {    //存货
                            stateName = 'baseman.base_report_execute';
                            args.code = 'gl_inv_reconciliation';
                            args.title = '存货与总账对账表';
                            args.sqlWhere = "year_month = '" + year_month + "'";
                            break;
                        }
                    }
                    return openBizObj({
                        stateName: stateName,
                        params: args
                    }).result;
                };

                /**
                 * 条件查询
                 */
                $scope.searchByCon = function () {
                    var postData = {
                        year_month: $scope.data.currItem.year_month,
                        is_sa: $scope.data.currItem.is_sa
                    };
                    return requestApi.post('fin_module', 'reconciliation', postData)
                        .then(function (data) {
                            $scope.data.year_month = data.year_month;

                            $scope.data.currItem.fin_modules = data.fin_modules;
                            $scope.gridOptions.hcApi.setRowData(data.fin_modules);
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
                            $scope.data.currItem.year_month = data.year_month;
                        })
                        .then($scope.searchByCon)
                };

                //按钮
                $scope.toolButtons = {
                    save: {
                        title: '保存',
                        icon: 'iconfont hc-save',
                        click: function () {
                            $scope.gridOptions.api.stopEditing();
                            return requestApi.post('fin_module', 'saveset', $scope.data.currItem)
                                .then(function () {
                                    return swalApi.success('保存设置成功！');
                                })
                                .then($scope.searchByCon)
                        }
                    }
                }
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
