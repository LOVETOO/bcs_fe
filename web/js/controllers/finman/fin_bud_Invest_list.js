/**
 * 投资预算编制-列表页
 * date:2018-11-26
 */
define(
    ['module', 'controllerApi', 'base_obj_list', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_obj_list, swalApi, requestApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$stateParams',
            //控制器函数
            function ($scope, $stateParams) {
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'invest_bud_head_no',
                        headerName: '投资预算单号',
                    }, {
                        field: 'bud_year',
                        headerName: '年度',
                    }, {
                        field: 'dept_code',
                        headerName: '部门编码',
                    }, {
                        field: 'dept_name',
                        headerName: '部门名称',
                    },
                    /*, {
                        field: 'bud_type_code',
                        headerName: '预算类别编码',
                    }, {
                        field: 'bud_type_name',
                        headerName: '预算类别名称',
                    }, */
                    {
                        field: 'total_bud_invest_amt',
                        headerName: '投资预算总额',
                        type: '金额'
                    }, {
                        field: 'note',
                        headerName: '编制说明'
                    }, {
                        field: 'creator',
                        headerName: '创建人'
                    }, {
                        field: 'create_time',
                        headerName: '创建日期'
                    }, {
                        field: 'stat',
                        headerName: '单据状态',
                        hcDictCode: "stat"
                    }
                    ],
                    hcObjType: $stateParams.objtypeid
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