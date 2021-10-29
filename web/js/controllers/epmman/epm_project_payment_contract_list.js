/**
 * 项目付款合同-列表页
 * shenguocheng
 * 2019-07-19
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'stat',
                            headerName: '单据状态',
                            hcDictCode: 'stat'
                        }, {
                            field: 'contract_code',
                            headerName: '合同编号'
                        }, {
                            field: 'contract_name',
                            headerName: '合同名称'
                        }, {
                            field: 'signed_date',
                            headerName: '签订时间',
                            type: '日期'
                        }, {
                            field: 'signed_location',
                            headerName: '签订地点'
                        }, {
                            field: 'contract_amt',
                            headerName: '合同总额(元)',
                            type: '金额'
                        }, {
                            field: 'project_name',
                            headerName: '项目名称'
                        }, {
                            headerName: '甲方信息',
                            children: [
                                {
                                    field: 'party_a_name',
                                    headerName: '甲方名称'
                                }, {
                                    field: 'party_a_legal_person',
                                    headerName: '甲方联系人'
                                }, {
                                    field: 'party_a_address',
                                    headerName: '甲方地址'
                                }, {
                                    field: 'party_a_phone',
                                    headerName: '甲方联系电话'
                                }]
                        }, {
                            headerName: '乙方信息',
                            children: [
                                {
                                    field: 'party_b_name',
                                    headerName: '乙方名称'
                                }, {
                                    field: 'party_b_legal_person',
                                    headerName: '乙方联系人'
                                }, {
                                    field: 'party_b_address',
                                    headerName: '乙方地址'
                                }, {
                                    field: 'party_b_phone',
                                    headerName: '乙方联系电话'
                                }]
                        }, {
                            headerName: '结算信息',
                            children: [
                                {
                                    field: 'billing_bank',
                                    headerName: '开户银行'
                                }, {
                                    field: 'billing_account',
                                    headerName: '银行账号'
                                }, {
                                    field: 'payment_remark',
                                    headerName: '结算说明'
                                }]
                        }, {
                            field: 'creator_name',
                            headerName: '创建人'
                        }, {
                            field: 'createtime',
                            headerName: '创建时间'
                        }, {
                            field: 'updator_name',
                            headerName: '修改人'
                        }, {
                            field: 'updatetime',
                            headerName: '修改时间'
                        }
                    ],
                    hcBeforeRequest: function (searchObj) {
                        searchObj.contract_character = 'AP' //"AP"--项目付款合同
                    }
                };

                //继承控制器
                controllerApi.run({
                    controller: base_obj_list.controller,
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
