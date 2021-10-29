/**
 * 网点档案
 * 2020/03/04
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';
        /**
         * 控制器
         */
        var controller = [
            '$scope',
            function ($scope) {
                $scope.gridOptions = {
                    hcPostData: {
                        /* 档案查询标识 */
                        search_flag: 1
                    },
                    columnDefs: [{
                        type: '序号'
                    },
                    {
                        field: 'branch_valid',
                        headerName: '有效状态',
                        hcDictCode: 'valid',
                        cellStyle: function (params) {
                            var style = {
                                'text-align': 'center'
                            };
    
                            var color = Switch(params.value, '==')
                                .case(1, 'gray')		//未失效
                                .case(2, 'green')		//已生效
                                .case(3, 'red')			//已失效
                                .result;
    
                            if (color) {
                                style['color'] = color;
                            }
    
                            return style;
                        }
                    },
                    {
                        field: 'branch_message_code',
                        headerName: '网点编码'
                    },
                    {
                        field: 'branch_message_name',
                        headerName: '网点名称'
                    },
                    {
                        field: 'createtime',
                        headerName: '申请日期',
                        type : '日期'
                    },
                    {
                        field: 'auditor_name',
                        headerName: '申请人'
                    },
                    {
                        field: 'linkman',
                        headerName: '联系人'
                    },
                    {
                        field: 'phone',
                        headerName: '联系人电话'
                    },
                    {
                        field: 'business_name',
                        headerName: '营业执照名称'
                    },
                    {
                        field: 'branch_legal_name',
                        headerName: '网点法人'
                    },
                    {
                        field: 'customer_code',
                        headerName: '经销商编码'
                    },
                    {
                        field: 'customer_name',
                        headerName: '经销商名称'
                    },
                    {
                        field: 'address',
                        headerName: '地址'
                    },
                    {
                        field: 'note',
                        headerName: '备注'
                    },
                    {
                        field: 'creator_name',
                        headerName: '创建人'
                    },
                    {
                        field: 'createtime',
                        headerName: '创建时间',
                        type:'时间'
                    },
                    {
                        field: 'updator_name',
                        headerName: '修改人'
                    },
                    {
                        field: 'updatetime',
                        headerName: '修改时间',
                        type:'时间'
                    }]
                };
                //继承列表页基础控制器
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                ['add', 'delete'].forEach(function (buttonId) {
                    $scope.toolButtons[buttonId].hide = true;
                });
            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    });

