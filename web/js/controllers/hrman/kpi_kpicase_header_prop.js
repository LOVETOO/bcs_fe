/**
 * 绩效考核方案属性表
 * Created by sgc
 */
define(
    ['module', 'controllerApi', 'base_obj_prop'],
    function (module, controllerApi, base_obj_prop) {
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
                        field: "kpiitem_type",
                        headerName: "指标类别",
                        editable: true,
                        hcRequired: true
                    }, {
                        field: "kpiitem_type_scale",
                        headerName: "指标类别权重",
                        hcRequired: true
                    }, {
                        field: "kpiitem_no",
                        headerName: "考核指标编码"
                    }, {
                        field: "kpiitem_name",
                        headerName: "考核指标名称"
                    }, {
                        field: "kpiitem_scale",
                        headerName: "考核指标权重",
                    }, {
                        field: "scale_value",
                        headerName: "参评人权重",
                    }, {
                        field: "kpiitem_scale",
                        headerName: "评分值(百分制)"
                    }, {
                        field: "note",
                        headerName: "备注",
                        editable: true
                    }]
                };

                $scope.gridOptions_appraise = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: "appraiseman_type",
                        headerName: "参评人类别",
                        editable: true,
                        width: 200
                    }, {
                        field: "appraiseman_userid",
                        headerName: "参评人",
                        hcRequired: true
                    }, {
                        field: "collscore",
                        headerName: "评分值"
                    }
                    ]
                };

                $scope.gridOptions_score = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: "kpiitem_type",
                        headerName: "评分标准",
                        editable: true,
                        width: 319
                    }, {
                        field: "collscore",
                        headerName: "分值",
                        editable: true
                    }
                    ]
                };
                //指定网格对象
                $scope.data.currGridModel = 'data.currItem.kpi_kpicase_lineofkpi_kpicase_headers';
                $scope.data.currGridOptions = $scope.gridOptions;

                controllerApi.extend({
                    controller: base_obj_prop.controller,
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
                //绩效考核方案 查询
                $scope.commonSearchSettingOfKpiCaseHeader = {
                    afterOk: function (result) {
                        $scope.data.currItem.kpicase_id = result.kpicase_id;
                        $scope.data.currItem.kpicase_name = result.kpicase_name;
                    }
                };

                /**
                 * 新增时初始化数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);
                    bizData.create_time = new Date().Format('yyyy-MM-dd hh:mm:ss');
                    $scope.gridOptions.hcApi.setRowData([{}]);
                };

                /**
                 * 查看时设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.kpi_kpicase_lineofkpi_kpicase_headers);
                };
                //验证表头信息是否填完
                //$scope.validHead = function (invalidBox) {
                //    $scope.hcSuper.validCheck(invalidBox);
                //    return invalidBox;
                //};
                /*----------------------------------按钮及标签 定义-------------------------------------------*/
                //员工关键事件按钮
                $scope.footerLeftButtons.empkeyevents = {
                    title: '员工关键事件',
                    click: function () {
                        return $scope.empkeyevents && $scope.empkeyevents();
                    }
                };
                //隐藏其他按钮，只保留增减按钮
                $scope.footerLeftButtons.topRow.hide = true;
                $scope.footerLeftButtons.upRow.hide = true;
                $scope.footerLeftButtons.downRow.hide = true;
                $scope.footerLeftButtons.bottomRow.hide = true;

                /*隐藏底部右边边按钮*/
                $scope.footerRightButtons.saveThenAdd.hide = true;
                //$scope.footerRightButtons.saveThenSubmit.hide = true;
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