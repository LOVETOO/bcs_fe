/**这是工程费用项目界面js*/


/**
 * 工程费用项目页
 *  2019-6-15
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
                        }
                        , {
                            field: 'fee_code',
                            headerName: '费用项目编码',
                            pinned: 'left'
                        }
                        , {
                            field: 'fee_name',
                            headerName: '费用项目名称',
                            pinned: 'left'
                        }
                        , {
                            field: 'subject_no',
                            headerName: '会计科目编码',
                            pinned: 'left',
                            editable:true
                        }
                        , {
                            field: 'subject_name',
                            headerName: '会计科目名称',
                            pinned: 'left',
                            editable:true
                        }
                        , {
                            field: 'subject_desc',
                            headerName: '报销提示'
                        }
                        , {
                            field: 'fee_property',
                            headerName: '费用类型',
                            hcDictCode:'fee_property'
                        }
                        , {
                            field: 'apply_type',
                            headerName: '报销方式',
                            hcDictCode:'fin_fee_header_apply_type',
                            type:'list'
                        }
                        , {
                            field: 'stat',
                            headerName: '状态',
                            hcDictCode:'fin_fee_header_stat',
                            type:'list'
                        }
                        , {
                            field: 'note',
                            headerName: '备注'
                        }
                    ]
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