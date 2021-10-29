/**
 * 投资预算编制-详情页
 * date:2018-12-05
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi', 'dateApi', 'numberApi'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi, dateApi, numberApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', '$stateParams', '$modal',
            //控制器函数
            function ($scope, $stateParams, $modal) {
                /**数据定义 */
                $scope.data = {};
                $scope.data.currItem = {};
                //创建数组 放入1到12月的折旧预算变量名
                $scope.monthVaribleNames = [];
                for (var x = 1; x < 13; x++) {
                    $scope.monthVaribleNames[x] = "bud_amt_period" + x;
                }

                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [
                        {
                            headerName: "",
                            children: [{
                                type: '序号',
                                width: 60
                            }]
                        }, {
                            headerName: "资产投资",
                            children: [{
                                field: 'invitem_name',
                                headerName: '项目名称',
                                editable: Editable
                            }, {
                                field: 'invitem_type',
                                headerName: '项目类型'
                            }, {
                                field: 'invitem_property',
                                headerName: '项目性质',
                                hcDictCode: "invitem_property",
                                editable: Editable
                            }]
                        }, {
                            field: 'bud_type_name',
                            headerName: '预算类别',
                            onCellDoubleClicked: function (args) {
                                $scope.searchBudType(args);
                            }
                        }, {
                            field: 'fee_name',
                            headerName: '费用项目',
                            onCellDoubleClicked: function (args) {
                                $scope.chooseFee(args);
                            }
                        }, {
                            field: 'depr_method',
                            headerName: '折旧方法',
                            hcDictCode: 'depr_method',
                            editable: Editable
                        }, {
                            field: 'apportion_years',
                            headerName: '折旧分摊年限',
                            editable: Editable,
                            type: "数量"
                        }, {
                            field: 'accept_ymonth',
                            headerName: '预计验收月份',
                            editable: function (args) {
                                return Editable() && parseInt(args.data.invitem_property) == 1
                            },
                            onCellValueChanged: function (args) {
                                if (args.newValue === args.oldValue)
                                    return;

                                var newValue = parseInt(args.newValue);
                                if ((numberApi.isNum(newValue) || numberApi.isStrOfNum(newValue)) && numberApi.isInt(newValue) && (newValue > 0 && newValue < 13)) {
                                    args.data = HczyCommon.stringPropToNum(args.data);
                                    countEachMonthValue(args.data);
                                    countShareYmonth(args.data);
                                    args.api.refreshView();
                                    countTotal();
                                }
                                else {
                                    args.data.accept_ymonth = "请输入有效月份";
                                    args.api.refreshView();
                                    return swalApi.info("请输入有效月份");
                                }
                            },
                            type: "数量"
                        }, {
                            field: 'count_share_ymonth',
                            headerName: '本年折旧分摊月数',
                            editable: function (args) {
                                return Editable() && parseInt(args.data.invitem_property) == 2
                            },
                            onCellValueChanged: function (args) {
                                if (args.newValue === args.oldValue)
                                    return;
                                if (numberApi.isNum(args.newValue) || numberApi.isStrOfNum(args.newValue)) {
                                    args.data = HczyCommon.stringPropToNum(args.data);
                                    countShareYmonth(args.data);
                                    countBudAmt(args.data);
                                    countEachMonthValue(args.data);
                                    args.api.refreshView();
                                    countTotal();
                                }
                                else {
                                    return swalApi.info("请输入有效数字");
                                }
                            },
                            type: "数量"
                        }, {
                            field: 'original_value',
                            headerName: '项目原值',
                            editable: Editable,
                            type: "金额",
                            onCellValueChanged: function (args) {
                                if (args.newValue === args.oldValue)
                                    return;
                                if (numberApi.isNum(args.newValue) || numberApi.isStrOfNum(args.newValue)) {
                                    countNet_value(args.data);
                                    countBudAmt(args.data);
                                    countTotal_bud_invest_amt();
                                    countEachMonthValue(args.data);
                                    args.api.refreshView();
                                    countTotal();
                                }
                                else {
                                    return swalApi.info("请输入有效数字");
                                }
                            }
                        }, {
                            field: 'depreciated_value',
                            headerName: '累计已提折旧',
                            editable: Editable,
                            type: "金额",
                            onCellValueChanged: function (args) {
                                if (args.newValue === args.oldValue)
                                    return;
                                if (numberApi.isNum(args.newValue) || numberApi.isStrOfNum(args.newValue)) {
                                    countNet_value(args.data);
                                    countBudAmt(args.data);
                                    countTotal_bud_invest_amt();
                                    countEachMonthValue(args.data);
                                    args.api.refreshView();
                                    countTotal();
                                }
                                else {
                                    return swalApi.info("请输入有效数字");
                                }
                            }
                        }, {
                            field: 'remain_value_rate',
                            headerName: '残值率',
                            editable: Editable,
                            type: "百分比",
                            onCellValueChanged: function (args) {
                                if (args.newValue === args.oldValue)
                                    return;
                                if (numberApi.isNum(args.newValue) || numberApi.isStrOfNum(args.newValue)) {
                                    countNet_value(args.data);
                                    countBudAmt(args.data);
                                    countTotal_bud_invest_amt();
                                    countEachMonthValue(args.data);
                                    args.api.refreshView();
                                    countTotal();
                                }
                                else {
                                    return swalApi.info("请输入有效数字");
                                }
                            }
                        }, {
                            field: 'net_value',
                            headerName: '项目净值',
                            type: "金额"
                        }, {
                            field: 'bud_amt',
                            headerName: '本年折旧预算总额',
                            type: "金额",
                            onCellValueChanged: function (args) {
                                if (args.newValue === args.oldValue)
                                    return;
                                if (numberApi.isNum(args.newValue) || numberApi.isStrOfNum(args.newValue)) {
                                    countTotal_bud_invest_amt();
                                    countEachMonthValue(args.data);
                                    args.api.refreshView();
                                    countTotal();
                                }
                                else {
                                    return swalApi.info("请输入有效数字");
                                }
                            },
                            editable: Editable
                        }, {
                            field: 'project_description',
                            headerName: '项目说明',
                            editable: Editable
                        },
                        {
                            headerName: '本年折旧预算额分摊',
                            children: [
                                {
                                    field: 'bud_amt_period1',
                                    headerName: '1月',
                                    type: "金额",
                                    editable: Editable
                                },
                                {
                                    field: 'bud_amt_period2',
                                    headerName: '2月',
                                    editable: Editable,
                                    type: "金额"
                                }, {
                                    field: 'bud_amt_period3',
                                    headerName: '3月',
                                    editable: Editable,
                                    type: "金额"
                                }, {
                                    field: 'bud_amt_period4',
                                    headerName: '4月',
                                    editable: Editable,
                                    type: "金额"
                                }, {
                                    field: 'bud_amt_period5',
                                    headerName: '5月',
                                    editable: Editable,
                                    type: "金额"
                                }, {
                                    field: 'bud_amt_period6',
                                    headerName: '6月',
                                    editable: Editable,
                                    type: "金额"
                                }, {
                                    field: 'bud_amt_period7',
                                    headerName: '7月',
                                    editable: Editable,
                                    type: "金额"
                                }, {
                                    field: 'bud_amt_period8',
                                    headerName: '8月',
                                    editable: Editable,
                                    type: "金额"
                                }, {
                                    field: 'bud_amt_period9',
                                    headerName: '9月',
                                    editable: Editable,
                                    type: "金额"
                                }, {
                                    field: 'bud_amt_period10',
                                    headerName: '10月',
                                    editable: Editable,
                                    type: "金额"
                                }, {
                                    field: 'bud_amt_period11',
                                    headerName: '11月',
                                    editable: Editable,
                                    type: "金额"
                                }, {
                                    field: 'bud_amt_period12',
                                    headerName: '12月',
                                    editable: Editable,
                                    type: "金额"
                                }
                            ]
                        }
                    ],
                    hcObjType: $stateParams.objtypeid
                };
                /**通用查询 */
                /**
                 * 查询费用项目
                 */
                $scope.chooseFee = function (args) {
                    var postata = {flag: 2};
                    if (numberApi.toNumber(args.data.bud_type_id) > 0) {
                        postdata.bud_type_id = args.data.bud_type_id;
                    }
                    $modal.openCommonSearch({
                            classId: 'fin_bud_type_line_obj',
                            postData: postdata,
                            sqlWhere: 'stat = 2 and apply_type=2',
                            action: 'search',
                            title: "部门",
                            gridOptions: {
                                columnDefs: [{
                                    headerName: "费用项目编码",
                                    field: "fee_code"
                                }, {
                                    headerName: "费用项目名称",
                                    field: "fee_name"
                                }, {
                                    headerName: "预算类别编码",
                                    field: "bud_type_code"
                                }, {
                                    headerName: "预算类别名称",
                                    field: "bud_type_name"
                                }]
                            }
                        })
                        .result//响应数据
                        .then(function (response) {
                            args.data.fee_id = response.fee_id;
                            args.data.fee_code = response.fee_code;
                            args.data.fee_name = response.fee_name;
                            args.data.bud_type_id = response.bud_type_id;
                            args.data.bud_type_code = response.bud_type_code;
                            args.data.bud_type_name = response.bud_type_name;
                        })
                        .then(function () {
                            args.api.refreshView();
                        })
                };

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
                 *
                 * @constructor
                 */
                function Editable() {
                    return true;
                }

                /**======================点击事件==========================**/

                    //底部右边按钮
                $scope.footerRightButtons.submit = {
                    title: '提交',
                    click: function () {
                        $scope.submit && $scope.submit();
                    },
                };

                //左下按钮
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
                $scope.footerLeftButtons.copyAndAdd_line = {
                    title: '批量导入',
                    click: function () {
                        $scope.copyAndAdd_line && $scope.copyAndAdd_line();
                    },
                    hide: function () {
                        return !$scope.tabs_detail.grid_line.active;
                    }
                };
                $scope.add_line = function () {
                    var rowData = $scope.gridOptions.hcApi.getRowData();
                    rowData.push({});
                    $scope.data.currItem.fin_bud_invest_lines = rowData;
                    $scope.gridOptions.hcApi.setRowData(rowData);
                }
                $scope.del_line = function () {
                    var index = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (index < 0) {
                        return swalApi.info("请选中要删除的行");
                    }
                    return swalApi.confirmThenSuccess({
                        title: "确定要删除第" + (index + 1) + "行吗?",
                        okFun: function () {
                            //函数区域
                            var rowData = $scope.gridOptions.hcApi.getRowData();
                            if (index == (rowData.length - 1)) {
                                $scope.gridOptions.api.focusedCellController.clearFocusedCell();
                            }
                            rowData.splice(index, 1);
                            $scope.gridOptions.hcApi.setRowData(rowData);
                            $scope.data.currItem.fin_bud_invest_lines = rowData;
                            countTotal_bud_invest_amt();//重新计算项目折旧预算总额
                        },
                        okTitle: '删除成功'
                    });
                }

                /**
                 * 页签切换事件
                 * @param params
                 */
                $scope.onTabChange = function (params) {
                    if (params.id == "grid_collect") {
                        collect();//汇总
                    }
                }

                /**============================逻辑计算====================================**/
                /**
                 * 检查数据
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    $scope.stopEditingAllGrid();

                    countTotal_bud_invest_amt();//计算总额
                    $.each($scope.data.currItem.fin_bud_invest_lines, function (row, data) {
                        if (parseInt(data.invitem_property) != 2) {
                        }
                        else if (HczyCommon.isNotNull(data.accept_ymonth)) {
                            var start_month = parseInt(data.accept_ymonth);
                            var monthVaribleNames = $scope.monthVaribleNames.slice(parseInt(data.accept_ymonth));
                            monthVaribleNames.forEach(function (value) {
                                if (HczyCommon.isNull(data[value])) {
                                    invalidBox.push("第" + parseInt(row + 1) + "行的预计验收月份不能为空");
                                }
                            })
                        }
                    });
                    $scope.data.currItem.fin_bud_invest_lines.forEach(function (val) {
                        var index = 0;
                        index++;
                        if (val.invitem_property == 1) {
                            if (val.project_description == null || val.project_description == undefined || val.project_description == "") {
                                invalidBox.push("第" + index + "行的项目说明不能为空");
                            }
                        }
                    });
                };

                /**
                 * 计算投资项目净值;
                 * 投资项目净值 = 投资项目原值（1-残值率）-累计已提折旧
                 * @param data
                 */
                function countNet_value(data) {
                    if (HczyCommon.isNotNull(data.original_value) && HczyCommon.isNotNull(data.depreciated_value) && HczyCommon.isNotNull(data.remain_value_rate)) {
                        var rate = (1 - data.remain_value_rate);
                        data.net_value = numberApi.sub(numberApi.mutiply(data.original_value, rate).toFixed(2), data.depreciated_value);
                    }
                }

                /**
                 * 本年折旧预算总额
                 *  本年折旧预算总额= （投资项目净值/折旧分摊年限）*（折旧分摊月数/12）
                 */
                function countBudAmt(data) {
                    if (data.depr_method == 1) {
                        if (HczyCommon.isNotNull(data.net_value) && HczyCommon.isNotNull(data.apportion_years) && HczyCommon.isNotNull(data.count_share_ymonth)) {
                            data.bud_amt = numberApi.mutiply(numberApi.divide(data.original_value, data.apportion_years).toFixed(2), numberApi.divide(data.count_share_ymonth, 12).toFixed(2));
                        }
                    }
                }

                /**
                 * 计算每月折旧预算额分摊
                 * 每月分摊折旧=本年折旧预算总额/本年折旧分摊月数
                 * @param data
                 */
                function countEachMonthValue(data) {
                    if (data.depr_method == 1) {
                        if (HczyCommon.isNotNull(data.count_share_ymonth) && HczyCommon.isNotNull(data.bud_amt)) {
                            var EachMonthValue = numberApi.divide(data.bud_amt, data.count_share_ymonth);
                            var monthVaribleNames = [];
                            if (data.accept_ymonth) {
                                monthVaribleNames = $scope.monthVaribleNames.slice(parseInt(data.accept_ymonth) + 1);
                            } else {
                                monthVaribleNames = $scope.monthVaribleNames.slice(0, parseInt(data.count_share_ymonth) + 1);
                            }
                            monthVaribleNames.forEach(function (value) {
                                data[value] = EachMonthValue;
                            })
                        }
                    }
                }

                /**
                 * 计算项目折旧预算总额
                 */
                function countTotal_bud_invest_amt() {
                    var total_bud_invest_amt = numberApi.sum($scope.data.currItem.fin_bud_invest_lines, 'bud_amt');
                    if (numberApi.isNum(total_bud_invest_amt)) {
                        HczyCommon.safeApply($scope, function () {
                            $scope.data.currItem.total_bud_invest_amt = total_bud_invest_amt;
                        })
                    }
                }

                /**
                 * 计算本年折旧分摊月数
                 */
                function countShareYmonth(data) {
                    if (data.accept_ymonth)
                        data.count_share_ymonth = 12 - data.accept_ymonth;
                }

                /**
                 * 计算网格底部合计项
                 */
                function countTotal() {
                    var totalArr = [];
                    var totalObj = {}
                    $.each($scope.data.currItem.fin_bud_invest_lines, function (i, item) {
                        angular.forEach(item, function (value, key) {
                            if (['count_share_ymonth', 'accept_ymonth', 'apportion_years', 'invitem_property', 'invitem_type', 'count_share_ymonth', 'remain_value_rate'].indexOf(key) < 0) { //过滤不用计算合计的数据
                                if (numberApi.isNum(parseFloat(item[key]))) {
                                    if (!totalObj[key]) {
                                        totalObj[key] = 0;
                                    }
                                    totalObj[key] = numberApi.sum(item[key], totalObj[key]);
                                }
                            }
                        })
                    })
                    totalObj.seq = "合计";
                    totalArr.push(totalObj);
                    $scope.gridOptions.api.setPinnedBottomRowData(totalArr);
                }

                /**============================数据处理 ================================**/
                /**
                 * 新建单据时初始化数据
                 * @param bizData
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData); //继承基础控制器的方法，类似Java的super
                    angular.extend($scope.data.currItem, {
                        creator: strUserName,
                        create_time: dateApi.now(),
                        bud_year: dateApi.nowYear(),
                        fin_bud_invest_lines: [],
                        stat: 1
                    });
                    $scope.gridOptions.api.setRowData($scope.data.currItem.fin_bud_invest_lines);
                };

                /**
                 * 设置表格数据
                 * @param bizData
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);

                    $scope.gridOptions.hcApi.setRowData(bizData.fin_bud_invest_lines);
                    countTotal();
                };
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
                 * 查部门
                 */
                $scope.chooseOrg = function () {
                    $modal.openCommonSearch({
                            classId: 'dept',
                            sqlWhere: "  IsFeeCenter =2 "
                        })
                        .result//响应数据
                        .then(function (response) {
                            $scope.data.currItem.dept_id = response.dept_id;
                            $scope.data.currItem.dept_code = response.dept_code;
                            $scope.data.currItem.dept_name = response.dept_name;

                        });
                };
                $scope.chooseOrg = chooseOrg;

                /**
                 * 查询投资项目
                 * @param args
                 */
                $scope.chooseInvestItem = function (args) {
                    if (args && args.data.seq == "合计") {
                        return;
                    }
                    //过滤条件
                    if (!$scope.data.currItem.bud_type_id) {
                        swalApi.info("提示", "请先选择预算类别");
                        return;
                    } else {
                        var sql = " bud_type_id =" + $scope.data.currItem.bud_type_id;
                    }
                    $modal.openCommonSearch({
                            classId: 'fin_investitem',
                            postData: {},
                            sqlWhere: sql,
                            action: 'search',
                            title: "投资项目",
                            gridOptions: {
                                columnDefs: [{
                                    headerName: "投资项目名称",
                                    field: "invitem_name"
                                }, {
                                    headerName: "投资项目编码",
                                    field: "invitem_code"
                                }, {
                                    headerName: "投资项目类型",
                                    field: "invitem_type"
                                }, {
                                    headerName: "会计科目编码",
                                    field: "subject_no"
                                }, {
                                    headerName: "会计科目名称",
                                    field: "subject_name"
                                }, {
                                    headerName: "创建人",
                                    field: "creator"
                                }, {
                                    headerName: "创建时间",
                                    field: "create_time"
                                }, {
                                    headerName: "编制说明",
                                    field: "note"
                                }]
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            args.data.invitem_id = result.invitem_id;
                            args.data.invitem_code = result.invitem_code;
                            args.data.invitem_name = result.invitem_name;
                            args.data.invitem_type = result.invitem_type;
                            args.data.fee_code = result.fee_code;
                            args.data.fee_name = result.fee_name;
                            args.data.fee_id = result.fee_id;
                            args.api.refreshView();
                        });
                };


                /**
                 * 预算类别
                 */
                $scope.searchBudType = function (args) {
                    $modal.openCommonSearch({
                            classId: 'fin_bud_type_header',
                            postData: {maxsearchrltcmt: 10},
                            action: 'search',
                            title: "预算类别",
                            gridOptions: {
                                columnDefs: [{
                                    headerName: "类别名称",
                                    field: "bud_type_name"
                                }, {
                                    headerName: "类别编码",
                                    field: "bud_type_code"
                                }, {
                                    headerName: "机构层级",
                                    field: "org_level"
                                }, {
                                    headerName: "费用层级",
                                    field: "fee_type_level"
                                }, {
                                    headerName: "预算期间类别",
                                    field: "period_type"
                                }, {
                                    headerName: "描述",
                                    field: "description"
                                }]
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            args.data.bud_type_name = result.bud_type_name;
                            args.data.bud_type_id = result.bud_type_id;
                            /*$scope.data.currItem.fee_type_id = result.fee_type_id;
                             $scope.data.currItem.period_type = result.period_type;*///期间类型

                            //逻辑关联,预算类别改变,需要清空费用对象,让用户重新选择
                            /*delete $scope.data.currItem.fee_name;
                             delete $scope.data.currItem.fee_code;
                             delete $scope.data.currItem.fee_id;*/
                            args.api.refreshView();
                        });
                };

                /**
                 * 查询费用项目
                 */
                $scope.searchFeeObject = function (args) {
                    //过滤条件
                    if (!$scope.data.currItem.bud_type_id) {
                        swalApi.info("提示", "请先选择预算类别");
                        return;
                    } else {
                        var postdata = {
                            bud_type_id: $scope.data.currItem.bud_type_id,
                            fee_type_id: $scope.data.currItem.fee_type_id,
                            flag: 4
                        };
                    }
                    $modal.openCommonSearch({
                            classId: 'fin_bud_type_line_obj',
                            postData: postdata,
                            action: 'search',
                            title: "费用项目查询",
                            gridOptions: {
                                columnDefs: [{
                                    headerName: "费用项目编码",
                                    field: "fee_code"
                                }, {
                                    headerName: "费用项目名称",
                                    field: "fee_name"
                                }, {
                                    headerName: "费用类别",
                                    field: "object_type"
                                }]
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            args.data.fee_id = result.fee_id;
                            args.data.fee_name = result.fee_name;
                            args.data.fee_code = result.fee_code;
                            args.data.fee_type = result.object_type;
                            args.api.refreshView();
                        });
                };
                /**=====================汇总网格 ======================================**/

                $scope.gridOptions_collect = {
                    columnDefs: [
                        {
                            type: '序号',
                        }, {
                            field: 'invitem_type',
                            headerName: '投资项目类型',
                        }, {
                            field: 'collected_bud_amt',
                            headerName: '本年折旧预算总额',
                            type: "金额"
                        }
                    ]
                };

                /**
                 * 汇总
                 */
                function collect() {
                    if ($scope.data.currItem.fin_bud_invest_lines.length === undefined || $scope.data.currItem.fin_bud_invest_lines.length == 0) {
                        return;
                    }
                    var types = [];
                    //取出所有的项目类型
                    $.each($scope.data.currItem.fin_bud_invest_lines, function (i, item) {
                        types.push(item.invitem_type);
                    });
                    types = uniq(types);//去重
                    var arr = [];
                    types.forEach(function (value) {
                        arr.push({invitem_type: value});
                    });
                    var collectedLine = [];
                    $.each(arr, function (x, arrobj) {
                        arrobj.collected_bud_amt = 0;
                        $.each($scope.data.currItem.fin_bud_invest_lines, function (row, lineobj) {
                            if (arrobj.invitem_type == lineobj.invitem_type) {
                                arrobj.collected_bud_amt += numberApi.sum(arrobj.collected_bud_amt, lineobj.bud_amt);
                            }
                        })
                    })
                    $scope.gridOptions_collect.api.setRowData(arr);
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
                }

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