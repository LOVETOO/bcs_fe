/**
 * 工程预算编制 列表
 * 2019/6/24
 * shenguocheng
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
                            cellStyle: function (params) {
                                return angular.extend(getDefaultCellStyle(params), {
                                    'text-align': 'center' //文本居中
                                });
                            },
                            hcDictCode: 'stat'
                        }, {
                            field: 'proj_bud_head_no',
                            headerName: '预算编制编号'
                        }, {
                            field: 'project_code',
                            headerName: '工程项目编码'
                        }, {
                            field: 'project_name',
                            headerName: '工程项目名称'
                        }, {
                            field: 'project_manager',
                            headerName: '项目经理'
                        }, {
                            field: 'org_code',
                            headerName: '所属部门编码',
                        }, {
                            field: 'org_name',
                            headerName: '所属部门',
                        }, {
                            field: 'remark',
                            headerName: '编制说明',
                            width: 200
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
                    //hcBeforeRequest: function (searchObj) {
                    //    searchObj.sqlwhere = 'h.stat = '+$scope.data.stat
                    //}
                };

                //继承控制器
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                //文本居中
                function getDefaultCellStyle(params) {
                    var style = {};

                    if ($scope.gridOptions.defaultColDef) {
                        var defaultStyle = $scope.gridOptions.defaultColDef.cellStyle;
                        if (defaultStyle) {
                            if (angular.isObject(defaultStyle))
                                style = defaultStyle;
                            else if (angular.isFunction(defaultStyle))
                                style = defaultStyle(params);
                        }
                    }
                    return style;
                };
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