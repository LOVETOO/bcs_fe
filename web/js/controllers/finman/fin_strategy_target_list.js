/**
 * 战略目标-列表页
 * date:2018-11-26
 */
define(
    ['module', 'controllerApi', 'base_obj_list', 'swalApi', 'requestApi', 'openBizObj'],
    function (module, controllerApi, base_obj_list, swalApi, requestApi, openBizObj) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$stateParams',
            //控制器函数
            function ($scope, $stateParams) {
                $scope.data = {};
                $scope.data.currItem = {};
                //测试用例
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'strategy_no',
                        headerName: '战略规划编号',
                        width: 200
                    }, {
                        field: 'strategy_year',
                        headerName: '规划年度',
                        width: 100
                    }, {
                        field: 'creator',
                        headerName: '创建人',
                        width: 140
                    }, {
                        field: 'create_time',
                        headerName: '创建时间',
                        width: 150
                    }, {
                        field: 'note',
                        headerName: '编制说明',
                        width: 700,
                        suppressAutoSize: true,
                        suppressSizeToFit: true
                    },
                        {
                            field: 'stat',
                            headerName: '单据状态',
                            hcDictCode: "stat"
                        }],
                    hcObjType: $stateParams.objtypeid
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