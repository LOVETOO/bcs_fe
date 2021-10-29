/**
 * 采购付款-列表页
 * 2018-12-22
 */
define(
    ['module', 'controllerApi', 'base_obj_list', 'openBizObj'],
    function (module, controllerApi, base_obj_list, openBizObj) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs : [
                        {
                            type: '序号'
                        }
                        , {
                            field: 'ordinal_no',
                            headerName: '流水号'
                        }
                        , {
                            field: 'date_fund',
                            headerName: '记账日期',
                            type: '日期'
                        }
                        , {
                            headerName: '供应商',
                            children: [
                                {
                                    field: 'vendor_code',
                                    headerName: '编码'
                                },
                                {
                                    field: 'vendor_name',
                                    headerName: '名称'
                                }
                            ]
                        }
                        , {
                            field: 'amount_credit',
                            headerName: '付款金额',
                            type: '金额'
                        }
                        , {
                            headerName: '部门',
                            children: [
                                {
                                    field: 'dept_code',
                                    headerName: '编码'
                                },
                                {
                                    field: 'dept_name',
                                    headerName: '名称'
                                }
                            ]
                        }
                        , {
                            field: 'balance_type_name',
                            headerName: '结算方式'
                        }
                        , {
                            headerName: '资金账号',
                            children: [
                                {
                                    field: 'fund_account_code',
                                    headerName: '编码'
                                },
                                {
                                    field: 'fund_account_name',
                                    headerName: '名称'
                                }
                            ]
                        }
                        , {
                            field: 'bill_no',
                            headerName: '票据号'
                        }
                        , {
                            field: 'base_ac_object_name',
                            headerName: '往来对象'
                        }
                        , {
                            field: 'crm_entid',
                            headerName: '品类',
                            hcDictCode: '*'
                        }
                        , {
                            field: 'syscreate_type',
                            headerName: '来源单据类型',
                            hcDictCode: '*'
                        }
                        , {
                            field: 'io_type_name',
                            headerName: '收支类型'
                        }
                        , {
                            field: 'note',
                            headerName: '备注'
                        }
                        , {
                            field: 'bx_no',
                            headerName: '费用报销单号'
                        }
                        , {
                            field: 'credence_no',
                            headerName: '凭证号'
                        }
                        , {
                            field: 'stat',
                            headerName: '单据状态',
                            hcDictCode: '*'
                        }
                    ],
                    hcObjType: 18122201,
                    hcBeforeRequest: function (searchObj) {
                        searchObj.searchflag = 7
                    }
                };

                $scope.data = $scope.data || {};

                controllerApi.run({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                $scope.toolButtons.open = {
                    title: '引入采购付款',
                    //icon: 'iconfont hc-refresh',
                    click: function () {
                        return openBizObj({
                            stateName: 'financeman.apman.introduce_sale_payment',
                            params: {}
                        }).result.finally(function(){$scope.gridOptions.hcApi.search()});
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
