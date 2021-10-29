/**
 * 部门绩效排名表
 * Created by sgc
 */
define(
    ['module', 'controllerApi', 'base_diy_page'],
    function (module, controllerApi, base_diy_page) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {

                $scope.data = {
                    currItem: {}
                };
                $scope.gridOptions = {
                    columnDefs: [{
                        id: 'seq',
                        type: '序号'
                    }, {
                        headerName: "考核方案名称",
                        field: "kpicase_name"
                    }, {
                        headerName: "部门名称",
                        field: "org_name"
                    }, {
                        headerName: "总评分",
                        field: "totvalue",
                    }, {
                        headerName: "加分",
                        field: "add_value"
                    }, {
                        headerName: "扣分",
                        field: "deduct_value"
                    }, {
                        headerName: "综合得分",
                        field: "total_value"
                    }],
                    hcDataRelationName: 'kpi_kpicase_lineofkpi_deptsort_headers',
                    hcClassId: 'kpi_deptsort_header'
                };

                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });
                /*----------------------------------通用查询-------------------------------------------*/
                //员工信息 查询
                $scope.commonSearchSettingOfEmployee = {
                    afterOk: function (result) {
                        $scope.data.currItem.employee_id = result.employee_id;
                        $scope.data.currItem.employee_code = result.employee_code;
                        $scope.data.currItem.employee_name = result.employee_name;
                    }
                };

                /**
                 * 新增时初始化数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);
                    $scope.gridOptions.hcApi.setRowData([{}]);
                };

                /**
                 * 查看时设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.kpi_kpicase_lineofkpi_deptsort_headers);
                };

                //添加按钮
                $scope.toolButtons = {
                    search: {
                        title: '查询',
                        icon: 'fa fa-search',
                        click: function () {
                            $scope.search && $scope.search();
                        }
                    }
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