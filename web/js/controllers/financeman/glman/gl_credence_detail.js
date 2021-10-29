/**
 * 明细分类账-空白自定义页
 * 2019-03-07
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
                            field: 'year_month',
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
                            headerName: '借方金额',
                            type: '金额'
                        }
                        , {
                            field: 'amount_this_credit_f',
                            headerName: '贷方金额',
                            type: '金额'
                        }
                        , {
                            field: 'amount_end_f',
                            headerName: '余额',
                            type: '金额'
                        }
                        , {
                            field: 'km_property',
                            headerName: '余额方向',
                            hcDictCode: 'balance_dir'
                        }
                        , {
                            field: 'km_code',
                            headerName: '会计科目编码'
                        }
                        , {
                            field: 'km_name',
                            headerName: '会计科目名称'
                        }
                    ]
                };

                //数据定义
                $scope.data = {
                    openOtherList: $stateParams.year_month_start ? true : false,
                    selectOption_km: [] //会计科目下拉选项
                };
                $scope.data.currItem = {
                    tally_flag: 0,
                    year_month_start: $stateParams.year_month_start ?
                        $stateParams.year_month_start : new Date().getFullYear() + '-01', //科目期间-开始
                    organization_id: numberApi.toNumber($stateParams.organization_id) > 0 ?
                        numberApi.toNumber($stateParams.organization_id) : userbean.loginents[0].entid,  //组织id
                    organization_name: $stateParams.organization_name ?
                        $stateParams.organization_name : userbean.loginents[0].entname //组织名称
                };


                /*---------------------通用查询开始------------------------*/

                //通用查询
                $scope.commonSearchSetting = {
                    gl_account_subject_start: {
                        afterOk: function (result) {
                            if($scope.data.currItem.km_code_start != result.km_code){
                                var sqlwhere = "km_code >= '" + result.km_code + "'";
                                if($scope.data.currItem.km_code_end){
                                    sqlwhere += " and km_code <= '" + $scope.data.currItem.km_code_end + "'";
                                }
                                $scope.data.selectOption_km.splice(0, $scope.data.selectOption_km.length);
                                $scope.filterKmOptions(sqlwhere);
                            }
                            $scope.data.currItem.km_code_start = result.km_code;
                        }
                    },
                    gl_account_subject_end: {
                        sqlWhere: function () {
                            return $scope.data.currItem.km_code_start ? "km_code >= '" + $scope.data.currItem.km_code_start + "'" : ''
                        },
                        afterOk: function (result) {
                            if($scope.data.currItem.km_code_end != result.km_code){
                                var sqlwhere = "km_code <= '" + result.km_code + "'";
                                if($scope.data.currItem.km_code_start){
                                    sqlwhere += " and km_code >= '" + $scope.data.currItem.km_code_start + "'";
                                }
                                $scope.data.selectOption_km.splice(0, $scope.data.selectOption_km.length);
                                $scope.filterKmOptions(sqlwhere);

                            }
                            $scope.data.currItem.km_code_end = result.km_code;
                        }
                    },
                    gl_account_subject: {
                        afterOk: function (result) {
                            $scope.data.currItem.gl_account_subject_id = result.gl_account_subject_id;
                            $scope.data.currItem.km_code = result.km_code;
                            $scope.data.currItem.km_name = result.km_name;
                        }
                    },
                    ent: {
                        afterOk: function (response) {
                            $scope.data.currItem.organization_id = response.entid;
                            $scope.data.currItem.organization_name = response.entname;
                        }
                    }
                };

                /*---------------------通用查询结束------------------------*/

                controllerApi.run({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                /**
                 * 过滤会计科目下拉值
                 */
                $scope.filterKmOptions = function (sqlwhere) {
                    return requestApi.post('gl_account_subject', 'search', {sqlwhere: sqlwhere})
                        .then(function (data) {
                            for(var i = 0; i < data.gl_account_subjects.length; i++) {
                                var km_obj = {name: data.gl_account_subjects[i].km_code + ' ' + data.gl_account_subjects[i].km_name,
                                    value: data.gl_account_subjects[i].gl_account_subject_id};

                                //会计科目下拉项
                                $scope.data.selectOption_km.push(km_obj);
                            }
                            $scope.data.currItem.gl_account_subject_id = $scope.data.selectOption_km[0].value;
                        })
                };

                /**
                 * 开始科目删除之后事件
                 */
                $scope.afterDeleteKmStart = function () {
                    var sqlwhere = '';

                    if($scope.data.currItem.km_code_end){
                        sqlwhere = " km_code <= '" + $scope.data.currItem.km_code_end + "'";
                    }
                    $scope.data.selectOption_km.splice(0, $scope.data.selectOption_km.length);
                    $scope.filterKmOptions(sqlwhere);
                };
                /**
                 * 结束科目删除之后事件
                 */
                $scope.afterDeleteKmEnd = function () {
                    var sqlwhere = '';

                    if($scope.data.currItem.km_code_start){
                        sqlwhere = " km_code >= '" + $scope.data.currItem.km_code_start + "'";
                    }
                    $scope.data.selectOption_km.splice(0, $scope.data.selectOption_km.length);
                    $scope.filterKmOptions(sqlwhere);
                };

                /**
                 * 条件查询
                 */
                $scope.searchByCon = function (openBy) {
                    var searchObj = {};

                    searchObj.organization_id = $scope.data.currItem.organization_id;
                    searchObj.year_month_start = $scope.data.currItem.year_month_start;
                    searchObj.year_month_end = $scope.data.currItem.year_month_end;
                    searchObj.km_code_start = $scope.data.currItem.km_code_start;
                    searchObj.km_code_end = $scope.data.currItem.km_code_end;
                    searchObj.tally_flag = $scope.data.currItem.tally_flag;
                    searchObj.gl_account_subject_id = $scope.data.currItem.gl_account_subject_id;

                    //由其他页面打开的查询条件
                    var km_id = numberApi.toNumber($stateParams.km_id);
                    var org_id = numberApi.toNumber($stateParams.organization_id);
                    var year_month_start = $stateParams.year_month_start;

                    if(strApi.isNotNull(openBy)){
                        searchObj.gl_account_subject_id = km_id;
                        searchObj.year_month_start = year_month_start;

                        if('balance' === openBy){
                            searchObj.organization_id = org_id;
                        }
                    }

                    return requestApi.post('gl_credence_head', 'credencedetaillist', searchObj)
                        .then(function (data) {
                            $scope.data.currItem.gl_credence_heads = data.gl_credence_heads;
                            $scope.gridOptions.hcApi.setRowData(data.gl_credence_heads);
                        })
                };

                /**
                 * 初始化
                 */
                $scope.doInit = function () {
                    $scope.hcSuper.doInit()
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

                            //默认查询第一条会计科目的明细分类账
                            return requestApi.post('gl_account_subject', 'search', {})
                        })
                        .then(function (data) {
                            //由其他页面打开
                            if(numberApi.toNumber($stateParams.km_id) > 0){
                                $scope.data.currItem.gl_account_subject_id = $stateParams.km_id;
                                return requestApi.post('gl_account_subject', 'select', {gl_account_subject_id: $scope.data.currItem.gl_account_subject_id})
                                    .then(function (data) {
                                        $scope.data.currItem.km_code = data.km_code;
                                        $scope.data.currItem.km_name = data.km_name;
                                    })
                            }else{
                                if(data.gl_account_subjects.length){
                                    $scope.data.currItem.gl_account_subject_id = data.gl_account_subjects[0].gl_account_subject_id;
                                    $scope.data.currItem.km_code = data.gl_account_subjects[0].km_code;
                                    $scope.data.currItem.km_name = data.gl_account_subjects[0].km_name;
                                }
                            }
                        })
                        .then(function () {
                            //由其他页面打开
                            var openBy = '';
                            if($stateParams.year_month_start){
                                if(numberApi.toNumber($stateParams.organization_id) > 0){
                                    openBy = 'balance'; //由科目余额表打开
                                }else{
                                    openBy = 'module';  //由对账总表打开
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
