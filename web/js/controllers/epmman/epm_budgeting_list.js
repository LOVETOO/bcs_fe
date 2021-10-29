/**
 * 工程预算编制-列表页
 *  2019-6-21
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
                            headerName: '单据状态',
                            pinned: 'left'
                        } , {
                            field: 'dsa_theme',
                            headerName: '预算编制编号',
                            pinned: 'left'
                        } , {
                            field: 'dsa_type',
                            headerName: '工程项目名称',
                            hcDictCode: 'epm.dsa_type',
                            pinned: 'left'
                        } , {
                            field: 'signed_date',
                            headerName: '工程合同编号',
                            type: '时间',
                            pinned: 'left'
                        } , {
                            field: 'remark',
                            headerName: '工程合同名称'
                        } , {
                            field: 'fee_property',
                            headerName: '签约金额',
                            hcDictCode:'fee_property'
                        } ,  {
                            field: 'party_a',
                            headerName: '所属部门'
                        }, {
                            field: 'address_a',
                            headerName: '编制说明'
                        }, {
                            field: 'link_man_a',
                            headerName: '创建人'
                        }, {
                            field: 'phone_a',
                            headerName: '创建时间'
                        }, {
                            field: 'party_b',
                            headerName: '修改人'
                        }, {
                            field: 'address_b',
                            headerName: '修改时间'
                        }
                    ],
                    hcBeforeRequest:function(searchObj){

                    }
                };
                controllerApi.extend({
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