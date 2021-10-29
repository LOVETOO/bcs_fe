/**
 * 资产负债表 fin_assets_liabilities_table
 * Created by zhl on 2019/1/8.
 */

define(['module', 'controllerApi', 'base_diy_page', 'requestApi', 'numberApi', 'loopApi', 'strApi'],
    function (module, controllerApi, base_diy_page, requestApi, numberApi, loopApi, strApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }
                    , {
                        field: 'assets_desc',
                        headerName: '资产',
                        width: 195,
                        cellStyle: function (params) {
                            var indent_level = numberApi.toNumber(params.data.page_indent_level_a);

                            switch (indent_level){
                                case 1:
                                    return {'padding-left': '10px'};
                                    break;
                                case 2:
                                    return {'padding-left': '30px'};
                                    break;
                                case 3:
                                    return {'padding-left': '50px'};
                                    break;
                                case 4:
                                    return {'padding-left': '60px'};
                                    break;
                                case 5:
                                    return {'padding-left': '80px'};
                                    break;
                            }
                        }
                    }
                    , {
                        headerName: '年初数',
                        field: 'assets_amount_first',
                        width: 150,
                        type: '金额'
                    }
                    , {
                        headerName: '期末数',
                        field: 'assets_amount_end',
                        width: 150,
                        type: '金额'
                    }
                    , {
                        field: 'liabilities_desc',
                        headerName: '负债和所有者权益（或股东权益）',
                        width: 290,
                        cellStyle: function (params) {
                            var indent_level = numberApi.toNumber(params.data.page_indent_level_l);

                            switch (indent_level){
                                case 1:
                                    return {'padding-left': '10px'};
                                    break;
                                case 2:
                                    return {'padding-left': '30px'};
                                    break;
                                case 3:
                                    return {'padding-left': '50px'};
                                    break;
                                case 4:
                                    return {'padding-left': '60px'};
                                    break;
                                case 5:
                                    return {'padding-left': '90px'};
                                    break;
                            }
                        }
                    }
                    , {
                        headerName: '年初数',
                        field: 'liabilities_amount_first',
                        width: 150,
                        type: '金额'
                    }
                    , {
                        headerName: '期末数',
                        field: 'liabilities_amount_end',
                        width: 150,
                        type: '金额'
                    }]

                };

                $scope.data = {};
                $scope.data.currItem = {
                    forced_flag: 1,
                    orgids: userbean.loginents[0].entid,
                    entnames: userbean.loginents[0].entname
                };

                //继承基础控制器
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                //通用查询
                $scope.commonSearchSetting = {
                    ent: {
                        checkbox: true,
                        afterOk: function (response) {
                            var names = [];
                            var ids = [];
                            loopApi.forLoop(response.length, function (i) {
                                ids.push(response[i].entid);
                                names.push(response[i].entname);
                            });

                            $scope.data.currItem.orgids = ids.join(',');
                            $scope.data.currItem.entnames = names.join(',');
                        }
                    }
                };

                /*----------------------------- 按钮定义 开始----------------------------------*/

                //条件查询
                $scope.searchByCon = function () {
                    var postData = {
                        year_month: $scope.data.currItem.year_month,
                        orgids: $scope.data.currItem.orgids,
                        forced_flag: $scope.data.currItem.forced_flag
                    };
                    return requestApi.post('fin_report', 'balancesheetsearch', postData)
                        .then(function (data) {
                            //计算由‘计算公式’得出的年初数和期末数
                            if(data.fin_reports.length){
                                loopApi.forLoop(data.fin_reports.length, function (i) {
                                    var assetsformula = data.fin_reports[i].assets_formula;
                                    var liabilitiesformula = data.fin_reports[i].liabilities_formula;

                                    //资产公式
                                    if(strApi.isNotNull(assetsformula)){
                                        var lineArr = assetsformula.split(',');

                                        //行号映射金额-期初
                                        var firstamtArr = lineArr.map(function (item) {
                                            if(item.indexOf('-') != -1){
                                                return -numberApi.toNumber(data.fin_reports[Math.abs(item) - 1].assets_amount_first)
                                            }else{
                                                return numberApi.toNumber(data.fin_reports[Math.abs(item) - 1].assets_amount_first)
                                            }
                                        });
                                        //行号映射金额-期末
                                        var endamtArr = lineArr.map(function (item) {
                                            if(item.indexOf('-') != -1){
                                                return -numberApi.toNumber(data.fin_reports[Math.abs(item) - 1].assets_amount_end)
                                            }else{
                                                return numberApi.toNumber(data.fin_reports[Math.abs(item) - 1].assets_amount_end)
                                            }
                                        });

                                        //金额相加（减法相当于加负数）
                                        data.fin_reports[i].assets_amount_first = numberApi.sum(firstamtArr);
                                        data.fin_reports[i].assets_amount_end = numberApi.sum(endamtArr);
                                    }

                                    //负债公式
                                    if(strApi.isNotNull(liabilitiesformula)){
                                        var lineArr = liabilitiesformula.split(',');

                                        //行号映射金额-期初
                                        var firstamtArr = lineArr.map(function (item) {
                                            if(item.indexOf('-') != -1){
                                                return -numberApi.toNumber(data.fin_reports[Math.abs(item) - 1].liabilities_amount_first)
                                            }else{
                                                return numberApi.toNumber(data.fin_reports[Math.abs(item) - 1].liabilities_amount_first)
                                            }
                                        });
                                        //行号映射金额-期末
                                        var endamtArr = lineArr.map(function (item) {
                                            if(item.indexOf('-') != -1){
                                                return -numberApi.toNumber(data.fin_reports[Math.abs(item) - 1].liabilities_amount_end)
                                            }else{
                                                return numberApi.toNumber(data.fin_reports[Math.abs(item) - 1].liabilities_amount_end)
                                            }
                                        });

                                        //金额相加（减法相当于加负数）
                                        data.fin_reports[i].liabilities_amount_first = numberApi.sum(firstamtArr);
                                        data.fin_reports[i].liabilities_amount_end = numberApi.sum(endamtArr);
                                    }
                                })
                            }

                            $scope.data.currItem.fin_reports = data.fin_reports;
                            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.fin_reports)
                        })
                };

                //初始化
                $scope.doInit = function () {
                    $scope.hcSuper.doInit().then(function () {
                        if (userbean.userents.length) {
                            if (userbean.userents.length > 1) {
                                $scope.data.currItem.is_multi_ent = 2;
                            } else {
                                $scope.data.currItem.is_multi_ent = 1;
                            }
                        }
                    }).then(function () {
                        //总账期间
                        return requestApi.post('gl_account_period', 'getglcurrperiod', {})
                    }).then(function (data) {
                        $scope.data.currItem.year_month = data.year_month;
                    }).then($scope.searchByCon);
                };

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


