/**
 * 科目余额表-空白自定义页
 * 2019-03-06
 */
define(
    ['module', 'controllerApi', 'base_diy_page','requestApi', 'loopApi', 'swalApi', 'openBizObj', 'numberApi'],
    function (module, controllerApi, base_diy_page, requestApi, loopApi, swalApi, openBizObj, numberApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                //科目余额列表网格设置
                $scope.balanceGridOptions = {
                    hcEvents: {
                        rowDoubleClicked: function (params) {
                            var km_id = numberApi.toNumber(params.data.gl_account_subject_id);
                            if(km_id > 0) {
                                return openBizObj({
                                    stateName: 'financeman.glman.gl_credence_detail',
                                    params: {
                                        km_id: km_id,
                                        year_month_start: $scope.data.currItem.year_month_start,
                                        organization_id: $scope.data.currItem.organization_ids,
                                        organization_name: $scope.data.currItem.organization_names
                                    }
                                }).result;
                            }
                        }
                    },
                    columnDefs : [
                        {
                            type: '序号'
                        }
                        , {
                            field: 'km_code',
                            headerName: '科目编码'
                        }
                        , {
                            field: 'km_name',
                            headerName: '科目名称'
                        }
                        , {
                            field: 'amount_first',
                            headerName: '期初余额',
                            type: '金额'
                        }
                        , {
                            field: 'first_balance_dir',
                            headerName: '期初余额方向',
                            hcDictCode: 'balance_dir'
                        }
                        , {
                            field: 'amount_this_debit',
                            headerName: '借方金额',
                            type: '金额'
                        }
                        , {
                            field: 'amount_this_credit',
                            headerName: '贷方金额',
                            type: '金额'
                        }
                        , {
                            field: 'amount_end',
                            headerName: '期末余额',
                            type: '金额'
                        }
                        , {
                            field: 'end_balance_dir',
                            headerName: '期末余额方向',
                            hcDictCode: 'balance_dir'
                        }
                    ]
                };

                //往来明细列表网格设置
                $scope.acdetailGridOptions = {
                    hcEvents: {
                        rowDoubleClicked: function (params) {
                            var credence_id = numberApi.toNumber(params.data.gl_credence_head_id);
                            if(credence_id > 0) {
                                return openBizObj({
                                    stateName: 'financeman.glman.gl_credence_prop',
                                    params: {
                                        id: credence_id
                                    }
                                }).result;
                            }
                        }
                    },
                    columnDefs : [
                        {
                            type: '序号'
                        }
                        , {
                            field: 'credence_date',
                            headerName: '日期',
                            type: '日期'
                        }
                        , {
                            field: 'credence_no',
                            headerName: '凭证号'
                        }
                        , {
                            field: 'docket_name',
                            headerName: '摘要'
                        }
                        , {
                            field: 'amount_this_debit_f',
                            headerName: '原币借方金额',
                            type: '金额'
                        }
                        , {
                            field: 'amount_this_credit_f',
                            headerName: '原币贷方金额',
                            type: '金额'
                        }
                        , {
                            field: 'amount_end_f',
                            headerName: '原币期末余额',
                            type: '金额'
                        }
                        , {
                            field: 'end_balance_dir',
                            headerName: '余额方向',
                            hcDictCode: 'balance_dir'
                        }
                    ]
                };

                //数据定义
                $scope.data = {
                    is_balancetab: 2 //是否【科目余额列表】标签页,是则显示查询按钮 1否 2是
                };
                $scope.data.currItem = {
                    tally_flag: 1, //含未过账凭证
                    is_object: 1, //含核算科目
                    year_month_start: new Date().getFullYear() + '-01', //科目期间-开始
                    organization_ids: userbean.loginents[0].entid,  //组织id
                    organization_names: userbean.loginents[0].entname, //组织名称
                    km_level_start: 1,  //科目级别-开始
                    km_level_end: 1,    //科目级别-结束
                    attribute1: 1   //查询核算科目标志
                };


                /*---------------------通用查询开始------------------------*/

                //通用查询
                $scope.commonSearchSetting = {
                    gl_account_subject_start: {
                        afterOk: function (result) {
                            $scope.data.currItem.km_code_start = result.km_code;
                        }
                    },
                    gl_account_subject_end: {
                        afterOk: function (result) {
                            $scope.data.currItem.km_code_end = result.km_code;
                        }
                    },
                    ent: {
                        afterOk: function (response) {
                            $scope.data.currItem.organization_ids = response.entid;
                            $scope.data.currItem.organization_names = response.entname;
                        }
                    }
                };

                /*---------------------通用查询结束------------------------*/

                controllerApi.run({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                /**
                 * 条件查询
                 */
                $scope.searchByCon = function () {
                    $scope.searchBalanceList();
                };

                /**
                 * 查询科目余额表
                 */
                $scope.searchBalanceList = function () {
                    var searchObj = {};
                    searchObj.organization_ids = $scope.data.currItem.organization_ids;
                    searchObj.year_month_start = $scope.data.currItem.year_month_start;
                    searchObj.year_month_end = $scope.data.currItem.year_month_end;
                    searchObj.km_level_start = $scope.data.currItem.km_level_start;
                    searchObj.km_level_end = $scope.data.currItem.km_level_end;
                    searchObj.km_code_start = $scope.data.currItem.km_code_start;
                    searchObj.km_code_end = $scope.data.currItem.km_code_end;
                    searchObj.tally_flag = $scope.data.currItem.tally_flag;
                    searchObj.is_object = $scope.data.currItem.is_object;
                    searchObj.attribute1 = $scope.data.currItem.attribute1;

                    return requestApi.post('gl_account_subject_balance', 'subjectlevelreport', searchObj)
                        .then(function (data) {
                            $scope.data.currItem.gl_account_subject_balances = data.gl_account_subject_balances;
                            $scope.balanceGridOptions.hcApi.setRowData(data.gl_account_subject_balances);
                        })
                };

                /**
                 * 查询往来明细列表
                 */
                $scope.searchForAcDetailList = function () {
                    return requestApi.post('gl_account_subject_balance', 'subjectobjectdetailreport', {
                        organization_ids: $scope.data.currItem.organization_ids,
                        year_month_start: $scope.data.currItem.year_month_start,
                        year_month_end: $scope.data.currItem.year_month_end,
                        km_level_start: $scope.data.currItem.km_level_start,
                        gl_account_subject_id: $scope.data.currItem.gl_account_subject_id
                    }).then(function (data) {
                        $scope.data.currItem.ac_details = data.ac_details;
                        $scope.acdetailGridOptions.hcApi.setRowData(data.ac_details);
                    })
                };

                /**
                 * tab页切换事件
                 */
                $scope.tabChangeEvent = function (name) {
                    if('ac' === name){
                        $scope.data.is_balancetab = 1;
                        //判断是否选中科目余额列表行
                        var focusedNode = $scope.balanceGridOptions.hcApi.getFocusedNode();
                        if(!focusedNode){
                            return swalApi.info('请在【科目余额列表】选中要查询的行');
                        }
                        var focusedData = $scope.balanceGridOptions.hcApi.getFocusedData();
                        if($scope.data.currItem.gl_account_subject_id && $scope.data.currItem.gl_account_subject_id == focusedData.gl_account_subject_id){
                            return;
                        }
                        $scope.data.currItem.gl_account_subject_id = focusedData.gl_account_subject_id;
                        $scope.searchForAcDetailList();
                    }
                    if('balance' === name){
                        $scope.data.is_balancetab = 2;
                    }
                };

                /**
                 * 初始化
                 */
                $scope.doInit = function () {
                    $scope.hcSuper.doInit()
                        .then($scope.initData)
                        .then(function () {
                            if (userbean.userents.length) {
                                if (userbean.userents.length > 1) {
                                    $scope.data.currItem.is_multi_ent = 2;
                                } else {
                                    $scope.data.currItem.is_multi_ent = 1;
                                }
                            }
                        })
                        .then(function () {
                            //总账期间
                            return requestApi.post('gl_account_period', 'getglcurrperiod', {})
                        })
                        .then(function (data) {
                            $scope.data.currItem.year_month_end = data.year_month;
                        })
                        .then($scope.searchBalanceList)
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
