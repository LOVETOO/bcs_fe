/**
 * 预算调整 （新)-属性页
 * 2019-02-27
 * huderong
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi', 'numberApi', 'strApi', 'dateApi', '$q'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi, numberApi, strApi, dateApi, $q) {
        'use strict';

        var controller = [
                //声明依赖注入
                '$scope',
                //控制器函数
                function ($scope) {

                    /*-------------------数据定义开始------------------------*/
                    $scope.LineName = 'fin_bud_release_lines';

                    $scope.expect_progress_rate_name = "预计销售进度";

                    $scope.editable = function (args) {
                        if ($scope.data.currItem.stat == 1)
                            return true;
                        return false;
                    }
                    /*-------------------数据定义结束------------------------*/

                    /*-------------------网格定义 开始------------------------*/

                    $scope.gridOptions = {
                        columnDefs: [
                            {
                                type: '序号'
                            },
                            {
                                field: 'bud_type_name',
                                headerName: '预算类别',
                                hcRequired: true,
                                pinned: 'left'
                            },
                            {
                                headerName: '费用类别/项目',
                                children: [
                                    {
                                        field: 'object_code',
                                        headerName: '编码',
                                        hcRequired: true,
                                        pinned: 'left'
                                    },
                                    {
                                        field: 'object_name',
                                        headerName: '名称',
                                        pinned: 'left'
                                    }
                                ]
                            },
                            {
                                field: 'subject_name',
                                headerName: '会计核算科目'
                            },
                            {
                                field: 'crm_entid',
                                headerName: '品类',
                                hcDictCode: 'crm_entid',
                                width: 100
                            },
                            {
                                field: 'bud_amt',
                                headerName: '年度预算',
                                type: "金额"
                            },
                            {
                                field: 'adjust_amt',
                                headerName: '年度预算调整（截止到上月）',
                                type: "金额"
                            },
                            {
                                field: 'after_bud_amt',
                                headerName: '调整后年度预算',
                                type: "金额"
                            },
                            {
                                field: 'expect_add_up_amt',
                                headerName: '截至本月预计预算',
                                type: "金额"
                            },
                            {
                                field: 'ls_expect_add_up_amt',
                                headerName: '截至上月执行金额',
                                type: "金额"
                            },
                            {
                                field: 'fact_can_rel_amt',
                                headerName: '本月实际可释放预算',
                                type: "金额"
                            }
                        ]
                    }

                    controllerApi.run({
                        controller: base_obj_prop.controller,
                        scope: $scope
                    });

                    /*-------------------网格定义 结束------------------------*/

                    /**
                     * 新增时初始化数据
                     */
                    $scope.newBizData = function (bizData) {
                        $scope.hcSuper.newBizData(bizData);
                        bizData.bud_year = dateApi.nowYear();
                        bizData.stat = 1;
                        bizData.period_type = 3;
                        bizData.expect_progress_rate = 0;
                        bizData.create_time = dateApi.now();
                        bizData[$scope.LineName] = [];
                        $scope.gridOptions.hcApi.setRowData(bizData[$scope.LineName]);
                    };

                    /**
                     * 设置数据
                     */
                    $scope.setBizData = function (bizData) {
                        $scope.hcSuper.setBizData(bizData);
                        $scope.gridOptions.hcApi.setRowData(bizData[$scope.LineName]);
                        $scope.intPage();
                        $scope.intGrid();
                    };

                    $scope.onControlChange = function () {
                        $scope.intPage();
                        $scope.getFeeBudLine();
                    }

                    $scope.onPeriod_TypeChange = function () {
                        $scope.intGrid();
                        $scope.getFeeBudLine();
                    }

                    $scope.on_expect_progress_rate_change = function () {
                        $scope.getFeeBudLine();
                    }

                    $scope.onBud_YearChange = function () {
                        $scope.getFeeBudLine();
                    }

                    $scope.intPage = function () {
                        if ($scope.data.currItem.bud_control_type == 1) {
                            $scope.expect_progress_rate_name = "预计时间进度";
                        } else if ($scope.data.currItem.bud_control_type == 2) {
                            $scope.expect_progress_rate_name = "预计销售进度";
                        } else if ($scope.data.currItem.bud_control_type == 3) {
                            $scope.expect_progress_rate_name = "预计产值进度";
                        }
                    }

                    $scope.intGrid = function () {
                        return $q.when().then(function () {
                            var h1 = "";
                            //年度
                            if ($scope.data.currItem.period_type == 1) {
                                h1 = "年";
                            }
                            //季度
                            else if ($scope.data.currItem.period_type == 2) {
                                h1 = "季";
                            }
                            //月度
                            else if ($scope.data.currItem.period_type == 3) {
                                h1 = "月";
                            }
                            $scope.gridOptions.columnDefs[6].headerName = "年度预算调整（截止至上" + h1 + "）";
                            $scope.gridOptions.columnDefs[8].headerName = "截至本" + h1 + "预计预算";
                            $scope.gridOptions.columnDefs[9].headerName = "截至上" + h1 + "执行金额";
                            $scope.gridOptions.columnDefs[10].headerName = "本" + h1 + "实际可释放预算";
                            $scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);
                        }).then(function () {
                            $scope.gridOptions.columnApi.autoSizeAllColumns();
                        });
                    }

                    /**
                     * 查部门
                     */
                    $scope.commonSearchSetting = {
                        dept: {
                            sqlWhere: "isfeecenter = 2",
                            afterOk: function (item) {
                                $scope.data.currItem.dept_id = item.dept_id;
                                $scope.data.currItem.dept_code = item.dept_code;
                                $scope.data.currItem.dept_name = item.dept_name;

                                $scope.getFeeBudLine();
                            }
                        },
                        period: {
                            classId: "fin_bud_period_header",
                            beforeOpen: function () {
                                $scope.commonSearchSetting.period.postData =
                                {
                                    period_year: $scope.data.currItem.bud_year,
                                    period_type: $scope.data.currItem.period_type,
                                    flag: 3,
                                    search_flag: 1
                                };
                            },
                            gridOptions: {
                                "columnDefs": [
                                    {
                                        headerName: "预算期间",
                                        field: "dname"
                                    },
                                    {
                                        headerName: "开始日期",
                                        field: "start_date"
                                    },
                                    {
                                        headerName: "结束日期",
                                        field: "end_date"
                                    }
                                ]
                            },
                            afterOk: function (item) {
                                $scope.data.currItem.period_line_id = item.period_line_id;
                                $scope.data.currItem.dname = item.dname;
                                $scope.getFeeBudLine();
                            }
                        }
                    }

                    /*-------------------通用查询结束---------------------*/

                    /*------------------- 按钮定义 ---------------------*/
                    $scope.footerLeftButtons.addRow.hide = true;
                    $scope.footerLeftButtons.deleteRow.hide = true;
                    /**=========================== 逻辑计算、 校验===================**/

                    /**
                     * 保存前校验
                     * @param bizdata
                     */
                    $scope.validCheck = function (invalidBox) {
                        $scope.hcSuper.validCheck(invalidBox);
                    };


                    $scope.getFeeBudLine = function () {
                        if ($scope.data.currItem.dept_id > 0 &&
                            $scope.data.currItem.bud_year > 0 &&
                            $scope.data.currItem.period_type > 0 &&
                            $scope.data.currItem.bud_control_type > 0 &&
                            $scope.data.currItem.period_line_id > 0) {
                            return requestApi.post("fin_bud_release_head", "getfeebud", {
                                "dept_id": $scope.data.currItem.dept_id,
                                "bud_year": $scope.data.currItem.bud_year,
                                "period_type": $scope.data.currItem.period_type,
                                "bud_control_type": $scope.data.currItem.bud_control_type,
                                "rate": $scope.data.currItem.expect_progress_rate,
                                "period_line_id": $scope.data.currItem.period_line_id
                            }).then(function (data) {
                                $scope.data.currItem[$scope.LineName] = data[$scope.LineName];
                                $scope.gridOptions.hcApi.setRowData($scope.data.currItem[$scope.LineName]);
                            });
                        }
                    }

                }

            ]
            ;

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
)
;
