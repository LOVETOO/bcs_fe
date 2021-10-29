/**
 * 变动薪资导入属性表
 * Created by sgc
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                /*----------------------------------定义数据-------------------------------------------*/
                $scope.data = {
                    currItem: {}
                };
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: "line_no",
                        headerName: "行号",
                        editable: true,
                        hcRequired: true
                    }, {
                        field: "employee_code",
                        headerName: "员工编码",
                        hcRequired: true
                    }, {
                        field: "employee_name",
                        headerName: "姓名"
                    }, {
                        field: "position_name",
                        headerName: "职位"
                    }, {
                        field: "line_remark",
                        headerName: "备注",
                        editable: true
                    }]
                };
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /*----------------------------------指定网格对象-------------------------------------------*/
                $scope.data.currGridModel = 'data.currItem.hr_employee_vsalary_lineofhr_employee_vsalary_heads';
                $scope.data.currGridOptions = $scope.gridOptions;

                /*----------------------------------通用查询-------------------------------------------*/
                //薪资组 查询
                $scope.commonSearchSettingOfSalaryGroup = {
                    afterOk: function (result) {
                        $scope.data.currItem.hr_salary_group_id = result.hr_salary_group_id;
                        $scope.data.currItem.salary_group_code = result.salary_group_code;
                        $scope.data.currItem.salary_group_name = result.salary_group_name;
                    }
                };

                /**
                 * 新增时初始化数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);
                    bizData.creation_date = new Date().Format('yyyy-MM-dd hh:mm:ss');
                    bizData.year_month = new Date().Format('yyyy-MM');
                    $scope.gridOptions.hcApi.setRowData([{}]);
                };

                /**
                 * 查看时设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.hr_employee_vsalary_lineofhr_employee_vsalary_heads);
                };
                /*----------------------------------按钮及标签 定义-------------------------------------------*/
                //隐藏其他按钮，只保留增减按钮
                $scope.footerLeftButtons.topRow.hide = true;
                $scope.footerLeftButtons.upRow.hide = true;
                $scope.footerLeftButtons.downRow.hide = true;
                $scope.footerLeftButtons.bottomRow.hide = true;

                /*隐藏底部右边边按钮*/
                $scope.footerRightButtons.saveThenSubmit.hide = true;
                $scope.footerRightButtons.saveThenAdd.hide = true;

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