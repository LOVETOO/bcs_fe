/**
 * 薪资计算属性表
 * Created by sgc
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi', 'directive/hcTab', 'directive/hcTabPage'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$q',
            //控制器函数


            function ($scope, $q) {
                /*----------------------------------定义数据-------------------------------------------*/
                $scope.data = {
                    currItem: {}
                };

                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: "employee_code",
                        headerName: "员工编码",
                        editable: true,
                        hcRequired: true
                    }, {
                        field: "employee_name",
                        headerName: "员工姓名",
                        hcRequired: true
                    }, {
                        field: "hr_position_id",
                        headerName: "职位"
                    }, {
                        field: "is_dimission",
                        headerName: "员工状态"
                    }, {
                        field: "dept_name",
                        headerName: "所属部门"
                    }, {
                        field: "idcard",
                        headerName: "身份证号"
                    }, {
                        field: "bank_acc",
                        headerName: "银行账号"
                    }, {
                        field: "bank",
                        headerName: "开户银行"
                    }, {
                        field: "acc_name",
                        headerName: "开户名"
                    }, {
                        field: "is_stop_pay",
                        headerName: "停发",
                        type: "是否"
                    }, {
                        field: "remark",
                        headerName: "备注",
                        editable: true
                    }]
                };

                $scope.gridOptions_budget = {
                    columnDefs: [
                        {
                            field: "appraiseman_type",
                            headerName: "薪资项目编码",
                            editable: true
                        }, {
                            field: "appraiseman_userid",
                            headerName: "薪资项名称",
                            hcRequired: true
                        }, {
                            field: "scale_value",
                            headerName: "预算期间"
                        }, {
                            field: "appraiseman_empid",
                            headerName: "预算类别"
                        }, {
                            field: "appraiseman_empid",
                            headerName: "费用项目名称"
                        }, {
                            field: "appraiseman_empid",
                            headerName: "部门名称"
                        }, {
                            field: "appraiseman_empid",
                            headerName: "品类"
                        }, {
                            field: "appraiseman_empid",
                            headerName: "产品线"
                        }, {
                            field: "appraiseman_empid",
                            headerName: "申请金额"
                        }, {
                            field: "appraiseman_empid",
                            headerName: "审核金额"
                        }
                    ]
                };

                $scope.gridOptions_salary = {
                    columnDefs: [
                        {
                            field: "kpiitem_type",
                            headerName: "结算方式",
                            editable: true
                        }, {
                            field: "graded_value",
                            headerName: "单据类型",
                            editable: true
                        }, {
                            field: "graded_value",
                            headerName: "单据号",
                            editable: true
                        }, {
                            field: "graded_value",
                            headerName: "日期",
                            type: "日期",
                            editable: true
                        }, {
                            field: "pay_amount",
                            headerName: "金额",
                            type: "金额",
                            editable: true
                        }, {
                            field: "graded_value",
                            headerName: "付款人"
                        }, {
                            field: "is_credence",
                            headerName: "生成凭证",
                            type: "是否"
                        }, {
                            field: "credence_no",
                            headerName: "凭证号"
                        }
                    ]
                };
                /*----------------------------------指定网格对象-------------------------------------------*/
                $scope.data.currGridModel = 'data.currItem.hr_count_salary_lineofhr_count_salary_heads';
                $scope.data.currGridOptions = $scope.gridOptions;

                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
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
                    bizData.is_credence = 1;
                    bizData.is_stop_pay = 1;
                    bizData.year_month = new Date().Format('yyyy-MM');
                    bizData.creation_date = new Date().Format('yyyy-MM-dd hh:mm:ss');
                    $scope.gridOptions.hcApi.setRowData([{}]);
                    $scope.gridOptions_salary.hcApi.setRowData([{}]);
                    $scope.gridOptions_budget.hcApi.setRowData([{}]);
                };

                /**
                 * 查看时设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.hr_count_salary_lineofhr_count_salary_heads);
                };
                /*----------------------------------按钮及标签 定义-------------------------------------------*/
                /**
                 * tab标签页
                 */
                $scope.kpi_tab = {};
                $scope.kpi_tab.salary = {
                    title: '薪资发放',
                    active: true
                };
                $scope.kpi_tab.budget = {
                    title: '预算明细',
                };

                //隐藏其他按钮，只保留增减按钮
                $scope.footerLeftButtons.topRow.hide = true;
                $scope.footerLeftButtons.upRow.hide = true;
                $scope.footerLeftButtons.downRow.hide = true;
                $scope.footerLeftButtons.bottomRow.hide = true;

                /*隐藏底部右边边按钮*/
                $scope.footerRightButtons.saveThenSubmit.hide = true;
                $scope.footerRightButtons.saveThenAdd.hide = true;

                //右边删除行
                $scope.footerRightButtons.del_line = {
                    icon: 'fa fa-minus',
                    click: function () {
                        return $scope.del_line && $scope.del_line();
                    }
                };
                //右边增加行
                $scope.footerRightButtons.add_line = {
                    icon: 'fa fa-plus',
                    click: function () {
                        return $scope.add_line && $scope.add_line();
                    }
                };

                /**
                 * 授权方式页签改变事件
                 * @param params
                 */
                //$scope.onTabChange = function (params) {
                //    $q.when()
                //        .then(function () {
                //        })
                //        .then(function () {
                //            $scope.refresh();
                //        })
                //}

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