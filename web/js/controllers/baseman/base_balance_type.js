/**
 * 结算方式-编辑+列表页
 * 2018-11-26
 */
define(
    ['module', 'controllerApi' ,'base_edit_list' ],
    function (module, controllerApi, base_edit_list) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                /**数据定义 */
                $scope.data = {};
                $scope.data.currItem = {};

                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }
                        , {
                            field: 'balance_type_code',
                            headerName: '结算方式编码'
                        }
                        , {
                            field: 'balance_type_name',
                            headerName: '结算方式名称'
                        }
                        , {
                            field: 'subject_code',
                            headerName: '会计科目编码'
                        }
                        , {
                            field: 'subject_name',
                            headerName: '会计科目名称'
                        }
                        , {
                            field: 'settlement_type',
                            headerName: '结算类型',
                            hcDictCode: '*'
                        }
                        , {
                            field: 'feebx_create_bill_type',
                            headerName: '费用报销生成单据类型',
                            hcDictCode: '*'
                        }
                        , {
                            field: 'is_fee',
                            headerName: '费用报销',
                            type: '是否'
                        }
                        , {
                            field: 'is_ap',
                            headerName: '采购付款',
                            type: '是否'
                        }
                        , {
                            field: 'is_ar',
                            headerName: '销售回款',
                            type: '是否'
                        }
                        , {
                            field: 'remark',
                            headerName: '备注'
                        }

                    ]
                };

                /*-------------------通用查询开始------------------------*/
                $scope.commonSearchSetting = {
                    //会计科目
                    gl_account_subject: {
                        sqlWhere: ' end_km = 2',
                        afterOk: function (response) {
                            $scope.data.currItem.gl_account_subject_id = response.gl_account_subject_id;
                            $scope.data.currItem.subject_code = response.km_code;
                            $scope.data.currItem.subject_name = response.km_name;
                        }
                    }
                };

                controllerApi.extend({
                    controller: base_edit_list.controller,
                    scope: $scope
                });



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