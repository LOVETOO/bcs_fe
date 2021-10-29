/**
 * 投资项目类型-列表页
 * date:2018-11-26
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
                    columnDefs: [{
                            type: '序号'
                        }, {
                            field: 'invitem_type_code',
                            headerName: '投资项目编码'
                        }, {
                            field: 'invitem_type_name',
                            headerName: '投资项目名称'
                        }, {
                            field: 'invitem_type',
                            headerName: '投资项目类型',
                            type: '词汇',
                            cellEditorParams: {
                                names: ['固定资产', '无形资产','长期待摊费用'],
                                values: [1, 2 , 3]
                            }
                        }, {
                            field: 'subject_no',
                            headerName: '会计科目编码',
                        }, {
                            field: 'subject_name',
                            headerName: '会计科目名称'
                        }, {
                            field: 'note',
                            headerName: '备注'
                        }

                    ]
                };
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });
                //屏蔽按钮
                $scope.toolButtons.openProp.hide = true;

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