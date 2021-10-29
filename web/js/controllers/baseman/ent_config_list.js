/**
 * 企业设置
 * @hzj 2019-06-3
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
                    hcDataRelationName: 'ent_configs',
                    columnDefs: [
                        {
                            type: '序号'
                        },
                        {
                            field: 'entname',
                            headerName: '名称'
                        },
                        {
                            field: 'entcode',
                            headerName: '编码'
                        },
                        {
                            field: 'entid',
                            headerName: '代号'
						},
						{
							field: 'app_title',
							headerName: '应用标题'
						},
                        {
                            field: 'home_page',
                            headerName: '登录首页'
                        },
                        {
                            field: 'enable_saas',
                            headerName: '启用SAAS',
                            type:'是否'
                        },
                        {
                            field: 'enable_oa',
                            headerName: '启用OA',
                            type:'是否'
						},
						{
							field: 'creator',
							headerName: '创建人'
						},
						{
							field: 'createtime',
							headerName: '创建时间'
						},
						{
							field: 'updator',
							headerName: '修改人'
						},
						{
							field: 'updatetime',
							headerName: '修改时间'
						}
                    ],
                };

                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

				//隐藏部分按钮
				['add', 'delete'].forEach(function (name) {
					$scope.toolButtons[name].hide = true;
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
