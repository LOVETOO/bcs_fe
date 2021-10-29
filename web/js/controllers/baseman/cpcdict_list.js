/**
 * 系统词汇列表页
 * @since 2018-11-05
 */
define(
    ['module', 'controllerApi', 'base_obj_list','requestApi','swalApi'],
    function (module, controllerApi, base_obj_list,requestApi,swalApi) {
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
                        },
                        {
                            field: 'dictcode',
                            headerName: '词汇分类编码',
                            pinned: 'left'
                        },
                        {
                            field: 'dictname',
							headerName: '词汇分类名称',
                            pinned: 'left'
                        },
                        {
                            field: 'overview',
                            headerName: '词汇选项概览'
                        },
                        {
                            field: 'note',
                            headerName: '备注'
                        },
                        {
                            field: 'useinvorg',
                            headerName: '区分组织',
                            type: '是否'
                        },
                        {
                            field: 'usable',
                            headerName: '可用',
                            type:'是否'
                        }
                    ],
                    hcObjType: 181105
                };

                controllerApi.run({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

				if (!userbean.isAdmin) {
					['add', 'delete'].forEach(function (buttonId) {
						$scope.toolButtons[buttonId].hide = true;
					});
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
