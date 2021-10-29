/**
 * 试算平衡表
 */

define(['module', 'controllerApi', 'base_diy_page', 'requestApi', 'numberApi', 'loopApi'],
    function (module, controllerApi, base_diy_page, requestApi, numberApi, loopApi) {
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
                            field: 'km_code',
                            headerName: '科目代码'
                        }, {
                            field: 'km_name',
                            headerName: '科目名称'
                        }, {
                            headerName: '期初余额',
                            field: 'amount_first',
                            width: 150,
                            type: '金额'
                        }, {
                            headerName: '期初余额方向',
                            field: 'first_balance_dir',
                            hcDictCode:'balance_dir'
                        }, {
                            field: 'amount_this_debit',
                            headerName: '本月借方',
                            type: '金额'
                        }, {
                            headerName: '本月贷方',
                            field: 'amount_this_credit',
                            type: '金额'
                        }, {
                            headerName: '期末余额',
                            field: 'amount_end',
                            type: '金额'
                        }, {
                            headerName: '期末余额方向',
                            field: 'end_balance_dir',
                            hcDictCode:'balance_dir'
                        }]

                };

                $scope.data = {};
                $scope.data.currItem = {
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
                        gridOptions: {
                            "columnDefs": [
                                {
                                    headerName: "组织",
                                    field: "entname"
                                }
                            ]
                        },
                        afterOk: function (response) {
                            var names = [];
                            var ids = [];
                            loopApi.forLoop(response.length, function (i) {
                                ids.push(response[i].organization_id);
                                names.push(response[i].entname);
                            });

                            $scope.data.currItem.orgids = ids.join(',');
                            $scope.data.currItem.entnames = names.join(',');
                        }
                    }
                };

                /*----------------------------- 按钮定义 开始----------------------------------*/

                //条件查询
                $scope.search = function () {
                    var postData = {
                        year_month: $scope.data.currItem.year_month,
                        organization_ids: $scope.data.currItem.orgids,
                        tally_flag: $scope.data.currItem.flag
                    };
                    return requestApi.post('gl_account_subject_balance', 'balancereport', postData)
                        .then(function (data) {
                            $scope.gridOptions.hcApi.setRowData(data.gl_account_subject_balances);
                        })
                };

                //初始化
                $scope.doInit = function () {
                    $scope.hcSuper.doInit().then(function () {
                        //会计期间
                        return requestApi.post('gl_account_period', 'gettwoyearmonth', {modparam:'gl'})
                    }).then(function (data) {
                        $scope.data.currItem.year_month = data.cur_year_month;
                    });
                };
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


