/**
 * 战略目标分解-详情页
 * date:20181204
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi', 'dateApi', 'numberApi'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi, dateApi, numberApi) {
        'use strict';
        var controller = [
                //声明依赖注入
                '$scope', '$modal', '$q',
                //控制器函数
                function ($scope, $modal, $q) {
                    /**==============================数据定义========================= */
                    $scope.data = {collectByDept: 2};
                    $scope.data.currItem = {};
                    /**==============================网格定义========================= */
                    $scope.gridOptions = {
                        pinnedBottomRowData: [{seq: "合计:"}],
                        columnDefs: [
                            {
                                type: '序号'
                            },
                            {
                                field: 'dept_code',
                                headerName: '部门编码',
                                editable: Editable,
                                onCellDoubleClicked: chooseOrg,
                                suppressSizeToFit: false,
                                minWidth: 85,
                                width: 85
                            },
                            {
                                field: 'dept_name',
                                headerName: '部门名称',
                                width: 150,
                                editable: Editable,
                                onCellDoubleClicked: chooseOrg
                            },
                            {
                                field: 'response_man',
                                headerName: '责任人',
                                editable: Editable,
                                onCellDoubleClicked: chooseResponseman,
                                suppressSizeToFit: false,
                                minWidth: 85,
                                width: 85
                            }, {
                                field: 'item_type',
                                headerName: '所属品类',
                                hcDictCode: 'crm_entid',
                                type: '词汇',
                                editable: Editable
                            }, {
                                field: 'sale_in_amt',
                                headerName: '销售收入目标(万元)',
                                editable: Editable,
                                onCellValueChanged: cellValueChangeEvent,
                                type: '万元',
                                width: 150
                            }, {
                                field: 'profit_amt',
                                headerName: '利润目标(万元)',
                                editable: Editable,
                                onCellValueChanged: cellValueChangeEvent,
                                type: '万元'
                            }, {
                                field: 'profit_percent',
                                headerName: '利润率',
                                editable: false,
                                type: '百分比',
                                suppressSizeToFit: false,
                                minWidth: 85,
                                width: 85
                            },
                            {
                                field: 'note',
                                headerName: '备注',
                                editable: Editable,
                                suppressSizeToFit: false,
                                minWidth: 90,
                                width: 130
                            }
                        ]
                    };

                    /**
                     * 输入值改变计算事件
                     * @param args
                     * @returns {Promise|void|*}
                     */
                    function cellValueChangeEvent(args) {
                        if (!Editable(args)) {
                            return;
                        }
                        if (args.newValue === args.oldValue)
                            return;

                        if (numberApi.isNum(args.newValue) || numberApi.isStrOfNum(args.newValue)) {
                            args.data = HczyCommon.stringPropToNum(args.data);
                            countProfitPecent(args.data);
                            count();

                            args.api.refreshView();
                        } else {
                            return swalApi.info("请输入有效数字");
                        }
                    }

                    /**继承主控制器 */
                    controllerApi.run({
                        controller: base_obj_prop.controller,
                        scope: $scope
                    });

                    //明细标签名称
                    $scope.tabs_detail = {
                        grid_line: {
                            title: '明细',
                            active: true
                        },
                        grid_collect: {
                            title: '汇总'
                        }
                    };

                    /**
                     * 页签切换事件
                     * @param params
                     */
                    $scope.onTabChange = function (params) {
                        if (params.id == "grid_collect") {
                            if ($scope.data.collectByItem == 2) {
                                collect('item_type');//汇总
                            } else {
                                collect('dept_name');//汇总
                            }
                        }
                    }

                    /**
                     * 切换汇总方式
                     * @param collectType
                     * @constructor
                     */
                    $scope.SwitchCollect = function () {
                        if ($scope.data.collectByItem == 2 && $scope.data.collectByDept == 2) {
                            collectByAll();//汇总
                        }
                        else if ($scope.data.collectByItem == 2) {
                            collect('item_type');//汇总
                        }
                        else if ($scope.data.collectByDept == 2) {
                            collect('dept_name');//汇总
                        }
                    }

                    /**============================ 明细行逻辑计算=================================**/
                    /**
                     * 计算合计
                     */
                    function count() {
                        $scope.total_sale_in_amt = numberApi.sum($scope.data.currItem.fin_strategy_target_exp_lines, 'sale_in_amt');
                        $scope.total_profit_amt = numberApi.sum($scope.data.currItem.fin_strategy_target_exp_lines, 'profit_amt');

                        //var total = [{
                        //    seq: "合计:",
                        //    sale_in_amt: $scope.total_sale_in_amt,
                        //    profit_amt: $scope.total_profit_amt
                        //}];
                        //$scope.gridOptions.api.setPinnedBottomRowData(total);


                        $scope.gridOptions.api.setPinnedBottomRowData([
                            {
                                seq: '合计',
                                sale_in_amt: $scope.total_sale_in_amt,
                                profit_amt: $scope.total_profit_amt,

                                profit_percent: numberApi.divide($scope.total_profit_amt, $scope.total_sale_in_amt)
                            }
                        ]);


                    }

                    /**
                     * 计算利润率
                     */
                    function countProfitPecent(data) {
                        if (data.profit_amt && data.sale_in_amt && data.profit_amt != 0 && data.sale_in_amt != 0) {
                            data.profit_percent = parseFloat(numberApi.divide(data.profit_amt, data.sale_in_amt).toFixed(2));
                        }
                    }

                    /**============================ 点击事件=================================**/

                    /**
                     * 增加行
                     */
                    $scope.add_line = function () {
                        $scope.gridOptions.api.stopEditing();
                        var line = {};
                        $scope.data.currItem.fin_strategy_target_exp_lines.push(line);

                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.fin_strategy_target_exp_lines);
                    };

                    /**
                     * 删除行
                     */
                    $scope.del_line = function () {
                        var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                        if (idx < 0) {
                            swalApi.info('请选中要删除的行');
                        } else {
                            $scope.data.currItem.fin_strategy_target_exp_lines.splice(idx, 1);
                            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.fin_strategy_target_exp_lines);
                        }
                    };

                    //底部左边按钮
                    $scope.footerLeftButtons.add_line = {
                        title: '增加行',
                        click: function () {
                            $scope.add_line && $scope.add_line();
                        },
                        hide: function () {
                            return !$scope.tabs_detail.grid_line.active;
                        }
                    };
                    $scope.footerLeftButtons.del_line = {
                        title: '删除行',
                        click: function () {
                            $scope.del_line && $scope.del_line();
                        },
                        hide: function () {
                            return !$scope.tabs_detail.grid_line.active;
                        }
                    };
                    // //底部右边按钮
                    // $scope.footerRightButtons.submit = {
                    //     title: '提交',
                    //     click: function () {
                    //         $scope.submit && $scope.submit();
                    //     }
                    // };
                    /**
                     * 选择新的战略目标规划
                     */
                    $scope.selectNewStrate = function () {
                        $q.when()
                            .then($scope.searchStrategyTarget)
                            .then(function (result) {
                                return requestApi.post("fin_strategy_target_head", "select", {"strategy_head_id": result.strategy_head_id})
                            })
                            .then(function (result) {
                                result = HczyCommon.stringPropToNum(result)
                                $scope.data.currItem.strategy_head_id = result.strategy_head_id;
                                $scope.data.currItem.strategy_no = result.strategy_no;
                                $scope.data.currItem.strategy_year = result.strategy_year;
                                $scope.data.currItem.total_sale_in_amt = result.fin_strategy_target_lines[0].next_year_amt1;
                                $scope.data.currItem.total_profit_amt = result.fin_strategy_target_lines[1].next_year_amt1;
                            })
                            .then(function () {
                                    angular.extend($scope.data.currItem, {
                                        creator: strUserName,
                                        create_time: dateApi.now(),
                                        fin_strategy_target_exp_lines: [],
                                        stat: 1
                                    });
                                    $scope.gridOptions.api.setRowData($scope.data.currItem.fin_strategy_target_exp_lines);
                                }
                            )
                    }
                    /**============================ 点击事件结束=================================**/

                    /**============================数据处理 ================================**/

                    $scope.setBizData = function (bizData) {
                        // $scope.aa=JSON.stringify(bizData);
                        // $scope.hcSuper.setBizData(bizData); //继承基础控制器的方法，类似Java的super
                        //设置头部数据的步骤已在基础控制器实现
                        $scope.hcSuper.setBizData(bizData);
                        //设置明细数据到表格
                        // $scope.明细表格选项1.hcApi.setRowData(bizData.明细数组1);
                        // $scope.明细表格选项2.hcApi.setRowData(bizData.明细数组2);
                        $scope.gridOptions.api.setRowData(bizData.fin_strategy_target_exp_lines);
                        count();//计算合计
                    };

                    /**
                     * 新建单据时初始化数据
                     * @param bizData
                     */
                    $scope.newBizData = function (bizData) {
                        $scope.hcSuper.newBizData(bizData); //继承基础控制器的方法，类似Java的super

                        $scope.selectNewStrate();

                    };

                    /**
                     * 检查数据
                     */
                    $scope.validCheck = function (invalidBox) {
                        $scope.hcSuper.validCheck(invalidBox);
                        if (numberApi.notEqual($scope.data.currItem.total_sale_in_amt, $scope.total_sale_in_amt)) {
                            invalidBox.push("明细行销售收入目标合计必须等于总销售收入目标;");
                        }
                        if (numberApi.notEqual($scope.data.currItem.total_profit_amt, $scope.total_profit_amt)) {
                            invalidBox.push("明细行利润目标合计必须等于总利润目标;");
                        }
                    }

                    /**
                     * 刷新
                     */
                    $scope.refresh = function () {
                        $scope.hcSuper.refresh(); //继承基础控制器的方法，类似Java的super
                    };


                    /**
                     * 判断明细可否编辑
                     * @param args
                     * @constructor
                     */
                    function Editable(args) {
                        var flag = true;
                        if (args.data.seq === "合计") {
                            flag = false;
                        }
                        return flag;
                    }

                    /**============================通用查询 ===================**/

                    /**
                     * 人员查询
                     */
                    $scope.chooseUser = function () {
                        $modal.openCommonSearch({
                                classId: 'base_view_erpemployee_org'
                            })
                            .result//响应数据
                            .then(function (response) {
                                $scope.data.currItem.creator = response.employee_name;
                            });
                    };

                    /**
                     * 查询战略目标规划
                     */
                    $scope.searchStrategyTarget = function (args) {
                        return $modal.openCommonSearch({
                            classId: 'fin_strategy_target_head'
                        }).result; //响应数据
                    };

                    /**
                     * 查部门
                     */
                    function chooseOrg(args) {
                        if (!args.colDef.editable) {
                            return;
                        }
                        $modal.openCommonSearch({
                                classId: 'dept',
                                sqlWhere: " isfeecenter = 2"
                            })
                            .result//响应数据
                            .then(function (response) {
                                if (args) {
                                    args.data.dept_id = response.dept_id;
                                    args.data.dept_code = response.dept_code;
                                    args.data.dept_name = response.dept_name;

                                } else {
                                    $scope.data.currItem.org_id = response.dept_id;
                                    $scope.data.currItem.org_code = response.dept_code;
                                    $scope.data.currItem.org_name = response.dept_name;
                                }
                                args.api.refreshView();
                            })
                    };

                    /**
                     * 查用户
                     */
                    function chooseResponseman(args) {
                        if (!args.data.dept_id) {
                            return swalApi.info('请先选择部门');
                        }
                        return $modal.openCommonSearch({
                                classId: 'base_view_erpemployee_org',
                                sqlWhere: " dept_id = " + args.data.dept_id
                            })
                            .result//响应数据
                            .then(function (response) {
                                args.data.response_man = response.employee_name;
                                args.api.refreshView();
                            });
                    };
                    /**=====================汇总网格 ======================================**/

                    $scope.gridOptions_collect = {
                        columnDefs: [
                            {
                                type: '序号',
                            }, {
                                field: 'item_type',
                                headerName: '所属品类',
                                hcDictCode: 'crm_entid',
                                type: '词汇'
                            }, {
                                field: 'collected_sale_in_amt',
                                headerName: '销售收入目标',
                                type: "万元"
                            }, {
                                field: 'collected_profit_amt',
                                headerName: '利润目标',
                                type: "万元"
                            }
                        ]
                    };

                    /**
                     * 汇总
                     * @param collctTypeName
                     */
                    function collect(collctTypeName) {
                        if ($scope.data.currItem.fin_strategy_target_exp_lines.length === undefined || $scope.data.currItem.fin_strategy_target_exp_lines.length == 0) {
                            return;
                        }

                        $scope.gridOptions_collect.columnDefs = [{
                            type: '序号',
                        }];

                        if (collctTypeName == 'item_type') {
                            $scope.gridOptions_collect.columnDefs[1] = $scope.gridOptions.columnDefs[3];
                        }

                        if (collctTypeName == 'dept_name') {
                            $scope.gridOptions_collect.columnDefs[1] = {
                                field: 'dept_name',
                                headerName: '部门'
                            }
                        }

                        $scope.gridOptions_collect.columnDefs.push({
                            field: 'collected_sale_in_amt',
                            headerName: '销售收入目标',
                            type: "金额"
                        });
                        $scope.gridOptions_collect.columnDefs.push({
                            field: 'collected_profit_amt',
                            headerName: '利润目标',
                            type: "金额"
                        });


                        $scope.gridOptions_collect.api.setColumnDefs($scope.gridOptions_collect.columnDefs)

                        var types = [];
                        //取出所有的项目类型
                        $.each($scope.data.currItem.fin_strategy_target_exp_lines, function (i, item) {
                            types.push(item[collctTypeName]);
                        });
                        types = uniq(types);//去重
                        var arr = [];
                        types.forEach(function (value) {
                            arr.push({collctType: value});
                        });
                        var collectedLine = [];
                        $.each(arr, function (x, arrobj) {
                            arrobj.collected_sale_in_amt = 0;
                            arrobj.collected_profit_amt = 0;
                            $.each($scope.data.currItem.fin_strategy_target_exp_lines, function (row, lineobj) {
                                if (arrobj.collctType == lineobj[collctTypeName]) {
                                    arrobj[collctTypeName] = lineobj[collctTypeName];
                                    arrobj.collected_sale_in_amt += numberApi.sum(arrobj.collected_sale_in_amt, lineobj.sale_in_amt);
                                    arrobj.collected_profit_amt += numberApi.sum(arrobj.collected_profit_amt, lineobj.profit_amt);
                                }
                            })
                        })
                        $scope.gridOptions_collect.api.setRowData(arr);
                    }

                    /**根据品类和部门一起汇总 **/
                    function collectByAll() {
                        if ($scope.data.currItem.fin_strategy_target_exp_lines.length === undefined || $scope.data.currItem.fin_strategy_target_exp_lines.length == 0) {
                            return;
                        }
                        $scope.gridOptions_collect.columnDefs = [{
                            type: '序号',
                        }];
                        $scope.gridOptions_collect.columnDefs[1] = $scope.gridOptions.columnDefs[3];

                        $scope.gridOptions_collect.columnDefs.push({
                            field: 'dept_name',
                            headerName: '部门'
                        });

                        $scope.gridOptions_collect.columnDefs.push({
                            field: 'collected_sale_in_amt',
                            headerName: '销售收入目标',
                            type: "金额"
                        });
                        $scope.gridOptions_collect.columnDefs.push({
                            field: 'collected_profit_amt',
                            headerName: '利润目标',
                            type: "金额"
                        });

                        $scope.gridOptions_collect.api.setColumnDefs($scope.gridOptions_collect.columnDefs);

                        $.each($scope.data.currItem.fin_strategy_target_exp_lines, function (row, lineobj) {
                            lineobj.collected_sale_in_amt = lineobj.sale_in_amt
                            lineobj.collected_profit_amt = lineobj.profit_amt
                        })
                        $scope.gridOptions_collect.api.setRowData($scope.data.currItem.fin_strategy_target_exp_lines);
                    }

                    /**
                     * 数组去重
                     * @param array
                     * @returns {Array}
                     */
                    function uniq(array) {
                        var temp = [];
                        for (var i = 0; i < array.length; i++) {
                            //如果当前数组的第i项在当前数组中第一次出现的位置是i，才存入数组；否则代表是重复的
                            if (array.indexOf(array[i]) == i) {
                                temp.push(array[i])
                            }
                        }
                        return temp;
                    };

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
);