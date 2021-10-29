/**
 * 经销商服务协议-列表页
 *  2019-6-20
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
                        } , {
                            field: 'dsa_code',
                            headerName: '服务合同编码',
                            pinned: 'left'
                        } , {
                            field: 'dsa_theme',
                            headerName: '服务合同名称',
                            pinned: 'left'
                        } , {
                            field: 'dsa_type',
                            headerName: '服务合同类型',
                            hcDictCode: 'epm.dsa_type',
                            pinned: 'left'
                        } , {
                            field: 'signed_date',
                            headerName: '服务合同签订时间',
                            type: '时间',
                            pinned: 'left'
                        } , {
                            field: 'remark',
                            headerName: '备注'
                        }, {
                            field: 'project_contract_code',
                            headerName: '工程合同编码'
                        }, {
                            field: 'project_contract_name',
                            headerName: '工程合同名称'
                        }, {
                            field: 'address',
                            headerName: '工程项目所在地'
                        }, {
                            field: 'project_unit',
                            headerName: '工程单位名称'
                        }, {
                            field: 'project_name',
                            headerName: '工程项目名称'
                        } ,  {
                            field: 'party_a',
                            headerName: '甲方名称'
                        }, {
                            field: 'address_a',
                            headerName: '甲方地址'
                        }, {
                            field: 'link_man_a',
                            headerName: '甲方联系人'
                        }, {
                            field: 'phone_a',
                            headerName: '甲方联系电话'
                        }, {
                            field: 'party_b',
                            headerName: '乙方名称'
                        }, {
                            field: 'address_b',
                            headerName: '乙方地址'
                        }, {
                            field: 'link_man_b',
                            headerName: '乙方联系人'
                        }, {
                            field: 'phone_b',
                            headerName: '乙方联系电话'
                        }, {
                            field: 'vat_rate',
                            headerName: '增值税票税率',
                            hcDictCode:'epm.vat_rate'
                        }, {
                            field: 'fee_remark',
                            headerName: '服务费结算备注'
                        }, {
                            field: 'creator_name',
                            headerName: '创建人'
                        }, {
                            field: 'createtime',
                            headerName: '创建时间',
                            type: '时间'
                        }, {
                            field: 'updator_name',
                            headerName: '修改人'
                        }, {
                            field: 'updatetime',
                            headerName: '修改时间',
                            type: '时间'
                        }
                    ],
                    hcBeforeRequest:function(searchObj){

                    }
                };
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                $scope.toolButtons.import.hide = false;

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