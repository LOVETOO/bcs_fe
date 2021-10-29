/**
 * 利润表 fin_profit_table
 * Created by zhl on 2019/1/8.
 */

define(
    ['module', 'controllerApi', 'base_diy_page', 'loopApi', 'requestApi', 'numberApi', 'strApi'],
    function (module, controllerApi, base_diy_page, loopApi, requestApi, numberApi, strApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'obj_desc',
                        headerName: '项目',
                        suppressSizeToFit: true, //禁止适应宽度
                        minWidth: 300,
                        width: 400,
                        maxWidth: 500,
                        cellStyle: function (params) {
                            var indent_level = numberApi.toNumber(params.data.page_indent_level);

                            switch (indent_level) {
                                case 1:
                                    return {'padding-left': '17px'};
                                    break;
                                case 2:
                                    return {'padding-left': '44px'};
                                    break;
                                case 3:
                                    return {'padding-left': '60px'};
                                    break;
                                case 4:
                                    return {'padding-left': '100px'};
                                    break;
                                default:
                                    return {'padding-left': '0'};
                                    break;
                            }
                        }
                    }, {
                        field: 'this_amount',
                        headerName: '本月数',
                        type: '金额',
                        width: 120
                    }, {
                        field: 'sum_amount',
                        headerName: '本年累计数',
                        type: '金额',
                        width: 120
                    }]
                };

                //定义数据
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

                //条件查询
                $scope.searchByCon = function () {
                    var postData = {
                        year_month: $scope.data.currItem.year_month,
                        orgids: $scope.data.currItem.orgids,
                        forced_flag: $scope.data.currItem.forced_flag
                    };
                    return requestApi.post('fin_report', 'profitsearch', postData)
                        .then(function (data) {
                            //计算由‘计算公式’得出的本月数和本年累计数
                            if(data.fin_reports.length){
                                loopApi.forLoop(data.fin_reports.length, function (i) {
                                    var firstrun = data.fin_reports[i].assets_first_run;
                                    var endrun = data.fin_reports[i].assets_end_run;
                                    var firstformula = data.fin_reports[i].assets_first_formula;
                                    var endformula = data.fin_reports[i].assets_end_formula;

                                    //本期
                                    if(firstrun == 5 && strApi.isNotNull(firstformula)){
                                        var lineArr = firstformula.split(',');

                                        //行号映射金额
                                        var amtArr = lineArr.map(function (item) {
                                            if(item.indexOf('-') != -1){
                                                return -numberApi.toNumber(data.fin_reports[Math.abs(item) - 1].this_amount)
                                            }else{
                                                return numberApi.toNumber(data.fin_reports[Math.abs(item) - 1].this_amount)
                                            }
                                        });

                                        //金额相加（减法相当于加负数）
                                        data.fin_reports[i].this_amount = numberApi.sum(amtArr);
                                    }

                                    //本年累计
                                    if(endrun == 5 && strApi.isNotNull(endformula)){
                                        var lineArr = endformula.split(',');

                                        //行号映射金额
                                        var amtArr = lineArr.map(function (item) {
                                            if(item.indexOf('-') != -1){
                                                return -numberApi.toNumber(data.fin_reports[Math.abs(item) - 1].sum_amount)
                                            }else{
                                                return numberApi.toNumber(data.fin_reports[Math.abs(item) - 1].sum_amount)
                                            }
                                        });

                                        //金额相加（减法相当于加负数）
                                        data.fin_reports[i].sum_amount = numberApi.sum(amtArr);
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
