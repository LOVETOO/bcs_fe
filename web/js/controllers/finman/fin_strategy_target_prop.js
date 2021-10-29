/**
 * 战略目标规划-详情页
 * date:2018-11-26
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi', 'dateApi', 'numberApi', 'Decimal'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi, dateApi, numberApi, Decimal) {
        'use strict';
        var controller = [
                //声明依赖注入
                '$scope', '$modal',
                //控制器函数
                function ($scope, $modal) {
                    /**==============================数据定义========================= */
                    $scope.data = {};
                    $scope.data.currItem = {};

                    /**
                     *年份
                     */
                    $scope.dateYears = {
                        past_year1: function () {
                            return parseInt($scope.data.currItem.strategy_year) - 3;//规划年往前第3年
                        },
                        past_year2: function () {
                            return parseInt($scope.data.currItem.strategy_year) - 2;//规划年往前第2年
                        },
                        past_year3: function () {
                            return parseInt($scope.data.currItem.strategy_year) - 1;//规划年往前第1年
                        },
                        next_year1: function () {
                            return parseInt($scope.data.currItem.strategy_year);//明年/(规划年)/(第1年)
                        },
                        next_year2: function () {
                            return parseInt($scope.data.currItem.strategy_year) + 1;//后年
                        },
                        next_year3: function () {
                            return parseInt($scope.data.currItem.strategy_year) + 2;//大后年
                        }
                    };
                    /**==============================网格定义========================= */
                    $scope.gridOptions = {
                        columnDefs: [
                            {
                                field: 'strategy_item',
                                headerName: '项目',
                                type: '词汇',
                                hcDictCode: 'fin_strategy_target_item',
                                editable: false,
                                pinned: "left"
                            }, {
                                headerName: '历史数据',
                                children: [
                                    {
                                        headerName: '战略规划(万元)',
                                        children: [{
                                            field: 'past_year_exp_amt1',
                                            headerName: '规划年份值',
                                            editable: Editable,
                                            onCellValueChanged: function (args) {
                                                cellValueChangeEvent(args, [countRow1_2_past_differ_rate, countThridRowPastProfitRate, countThridRowNextProfitRate]);
                                            },
                                            valueFormatter: perWanYuanValueFormat,
                                            valueParser: perWanYuanValueParser,
                                            cellEditor: wanYuanEditor,
                                            cellStyle: cellStyle,
                                            suppressSizeToFit: false,
                                            minWidth: 95,
                                            width: 95
                                        }, {
                                            field: 'past_year_exp_amt2',
                                            headerName: '规划年份值',
                                            editable: Editable,
                                            onCellValueChanged: function (args) {
                                                cellValueChangeEvent(args, [countRow1_2_past_differ_rate, countThridRowPastProfitRate, countThridRowNextProfitRate]);
                                            },
                                            valueFormatter: perWanYuanValueFormat,
                                            valueParser: perWanYuanValueParser,
                                            cellEditor: wanYuanEditor,
                                            cellStyle: cellStyle,
                                            suppressSizeToFit: false,
                                            minWidth: 95,
                                            width: 95
                                        }, {
                                            field: 'past_year_exp_amt3',
                                            headerName: '规划年份值',
                                            editable: Editable,
                                            onCellValueChanged: function (args) {
                                                cellValueChangeEvent(args, [countRow1_2_past_differ_rate, countThridRowPastProfitRate, countThridRowNextProfitRate]);
                                            },
                                            valueFormatter: perWanYuanValueFormat,
                                            valueParser: perWanYuanValueParser,
                                            cellEditor: wanYuanEditor,
                                            cellStyle: cellStyle,
                                            suppressSizeToFit: false,
                                            minWidth: 95,
                                            width: 95
                                        }]
                                    }, {
                                        headerName: '实际执行(万元)',
                                        children: [{
                                            field: 'past_year_amt1',
                                            headerName: '规划年份值',
                                            editable: Editable,
                                            onCellValueChanged: function (args) {
                                                cellValueChangeEvent(args, [countRow1_2_past_differ_rate, countThridRowPastProfitRate, countThridRowNextProfitRate]);
                                            },
                                            valueFormatter: perWanYuanValueFormat,
                                            valueParser: perWanYuanValueParser,
                                            cellEditor: wanYuanEditor,
                                            cellStyle: cellStyle,
                                            suppressSizeToFit: false,
                                            minWidth: 95,
                                            width: 95
                                        }, {
                                            field: 'past_year_amt2',
                                            headerName: '规划年份值',
                                            editable: Editable,
                                            onCellValueChanged: function (args) {
                                                cellValueChangeEvent(args, [countRow1_2_past_differ_rate, countThridRowPastProfitRate, countThridRowNextProfitRate]);
                                            },
                                            valueFormatter: perWanYuanValueFormat,
                                            valueParser: perWanYuanValueParser,
                                            cellEditor: wanYuanEditor,
                                            cellStyle: cellStyle,
                                            suppressSizeToFit: false,
                                            minWidth: 95,
                                            width: 95
                                        }, {
                                            field: 'past_year_amt3',
                                            headerName: '规划年份值',
                                            editable: Editable,
                                            onCellValueChanged: function (args) {
                                                cellValueChangeEvent(args, [countRow1_2_past_differ_rate, countRow1_2Growth_rate, countThridRowPastProfitRate, countThridRowNextProfitRate]);
                                            },
                                            valueFormatter: perWanYuanValueFormat,
                                            valueParser: perWanYuanValueParser,
                                            cellEditor: wanYuanEditor,
                                            cellStyle: cellStyle,
                                            suppressSizeToFit: false,
                                            minWidth: 95,
                                            width: 95
                                        }]
                                    },
                                    {
                                        headerName: '执行率',
                                        children: [{
                                            field: 'past_year_differ_rate1',
                                            headerName: '第一年',
                                            editable: false,
                                            type: "百分比",
                                            suppressSizeToFit: false,
                                            minWidth: 95,
                                            width: 95
                                        }, {
                                            field: 'past_year_differ_rate2',
                                            headerName: '第二年',
                                            editable: false,
                                            type: "百分比",
                                            suppressSizeToFit: false,
                                            minWidth: 95,
                                            width: 95
                                        }, {
                                            field: 'past_year_differ_rate3',
                                            headerName: '第三年',
                                            editable: false,
                                            type: "百分比",
                                            suppressSizeToFit: false,
                                            minWidth: 95,
                                            width: 95
                                        }]
                                    }
                                ]
                            }, {
                                headerName: '未来三年',
                                children: [
                                    {
                                        headerName: '战略规划(万元)',
                                        children: [{
                                            field: 'next_year_amt1',
                                            headerName: '规划年份值',
                                            editable: Editable,
                                            onCellValueChanged: function (args) {
                                                cellValueChangeEvent(args, [countRow1_2Growth_rate, countThridRowNextProfitRate]);
                                            },
                                            valueFormatter: perWanYuanValueFormat,
                                            valueParser: perWanYuanValueParser,
                                            cellEditor: wanYuanEditor,
                                            cellStyle: cellStyle,
                                            suppressSizeToFit: false,
                                            minWidth: 95,
                                            width: 95
                                        }, {
                                            field: 'next_year_amt2',
                                            headerName: '规划年份值',
                                            editable: Editable,
                                            onCellValueChanged: function (args) {
                                                cellValueChangeEvent(args, [countRow1_2Growth_rate, countThridRowNextProfitRate]);
                                            },
                                            valueFormatter: perWanYuanValueFormat,
                                            valueParser: perWanYuanValueParser,
                                            cellEditor: wanYuanEditor,
                                            cellStyle: cellStyle,
                                            suppressSizeToFit: false,
                                            minWidth: 95,
                                            width: 95
                                        }, {
                                            field: 'next_year_amt3',
                                            headerName: '规划年份值',
                                            editable: Editable,
                                            onCellValueChanged: function (args) {
                                                cellValueChangeEvent(args, [countRow1_2Growth_rate, countThridRowNextProfitRate]);
                                            },
                                            valueFormatter: perWanYuanValueFormat,
                                            valueParser: perWanYuanValueParser,
                                            cellEditor: wanYuanEditor,
                                            cellStyle: cellStyle,
                                            suppressSizeToFit: false,
                                            minWidth: 95,
                                            width: 95
                                        }]
                                    },
                                    {
                                        headerName: '战略规划增长率',
                                        children: [{
                                            field: 'growth_rate1',
                                            headerName: '第一年',
                                            type: "百分比",
                                            editable: Editable,
                                            onCellValueChanged: function (args) {
                                                cellValueChangeEvent(args, [countRow1_2Growth_Amt, countThridRowNextProfitRate]);
                                            },
                                            suppressSizeToFit: false,
                                            minWidth: 95,
                                            width: 95
                                        }, {
                                            field: 'growth_rate2',
                                            headerName: '第二年',
                                            editable: Editable,
                                            type: "百分比",
                                            onCellValueChanged: function (args) {
                                                cellValueChangeEvent(args, [countRow1_2Growth_Amt, countThridRowNextProfitRate]);
                                            },
                                            suppressSizeToFit: false,
                                            minWidth: 95,
                                            width: 95
                                        }, {
                                            field: 'growth_rate3',
                                            headerName: '第三年',
                                            editable: Editable,
                                            type: "百分比",
                                            onCellValueChanged: function (args) {
                                                cellValueChangeEvent(args, [countRow1_2Growth_Amt, countThridRowNextProfitRate]);
                                            },
                                            suppressSizeToFit: false,
                                            minWidth: 95,
                                            width: 95
                                        }]
                                    }
                                ]
                            }
                        ]
                    };

                    /**
                     * 百分比/万元显示
                     * @param params
                     */
                    function perWanYuanValueFormat(params) {
                        if (params.value === undefined || typeof (params.value) == "NaN") {
                            return '';
                        }
                        var data = {};
                        if (params.data) {
                            data = params.data;
                        }
                        if (params.node) {
                            data = params.node.data;
                        }
                        if (parseInt(data.strategy_item) == 3) {
                            return Decimal(params.value).mul(100) + "%";
                        } else {
                            return HczyCommon.formatMoney(parseFloat(params.value / 10000));
                        }
                    }

                    /**
                     * 百分比/万元解析
                     * @param params
                     */
                    function perWanYuanValueParser(params) {
                        if (params.newValue === undefined || typeof (params.newValue) == "NaN") {
                            return '';
                        }
                        if (parseInt(params.data.strategy_item) == 3) {
                            return Decimal(params.newValue).mul(100) + "%";
                        } else {
                            return parseFloat(params.newValue * 10000);
                        }
                    }

                    /**
                     * 百分比居右显示
                     * @param params
                     * @returns {Object}
                     */
                    function cellStyle(params) {
                        return {
                            'text-align': 'right' //文本居右
                        };
                    }

                    /**
                     * 输入值改变计算事件
                     * @param args
                     * @returns {Promise|void|*}
                     */
                    function cellValueChangeEvent(args, functions) {
                        if (args.newValue === args.oldValue)
                            return;

                        if (numberApi.isNum(args.newValue) || numberApi.isStrOfNum(args.newValue)) {
                            functions.forEach(function (func) {
                                func();
                            })
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

                    //更改标题
                    $scope.tabs.base.title = "战略目标规划";

                    /**============================ 点击事件=================================**/
                    //底部右边按钮
                    /*                    $scope.footerRightButtons.submit = {
                     title: '提交',
                     click: function () {
                     $scope.submit && $scope.submit();
                     }
                     }*/
                    ;

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
                            strategy_year: dateApi.nowYear(),
                            fin_strategy_target_lines: [{strategy_item: 1}, {strategy_item: 2}, {strategy_item: 3}],
                            stat: 1
                        });
                        $scope.gridOptions.api.setRowData($scope.data.currItem.fin_strategy_target_lines);
                        createYearHeader();
                    };

                    /**
                     * 设置表格数据
                     * @param bizData
                     */
                    $scope.setBizData = function (bizData) {
                        $scope.hcSuper.setBizData(bizData)

                        $scope.gridOptions.hcApi.setRowData(bizData.fin_strategy_target_lines);
                        createYearHeader();
                    };

                    $scope.refresh = function () {
                        $scope.hcSuper.refresh(); //继承基础控制器的方法，类似Java的super
                    };

                    /**
                     * 根据年份生成表头标题
                     */
                    function createYearHeader() {

                        //战略规划
                        $scope.gridOptions.columnDefs[1].children[0].children[0].headerName = "" + $scope.dateYears.past_year1();
                        $scope.gridOptions.columnDefs[1].children[0].children[1].headerName = "" + $scope.dateYears.past_year2();
                        $scope.gridOptions.columnDefs[1].children[0].children[2].headerName = "" + $scope.dateYears.past_year3();

                        //执行数据
                        $scope.gridOptions.columnDefs[1].children[1].children[0].headerName = "" + $scope.dateYears.past_year1();
                        $scope.gridOptions.columnDefs[1].children[1].children[1].headerName = "" + $scope.dateYears.past_year2();
                        $scope.gridOptions.columnDefs[1].children[1].children[2].headerName = "" + $scope.dateYears.past_year3() + '(预计)';

                        $scope.gridOptions.columnDefs[1].children[2].children[0].headerName = "" + $scope.dateYears.past_year1();
                        $scope.gridOptions.columnDefs[1].children[2].children[1].headerName = "" + $scope.dateYears.past_year2();
                        $scope.gridOptions.columnDefs[1].children[2].children[2].headerName = "" + $scope.dateYears.past_year3();

                        $scope.gridOptions.columnDefs[2].children[0].children[0].headerName = "" + $scope.dateYears.next_year1();
                        $scope.gridOptions.columnDefs[2].children[0].children[1].headerName = "" + $scope.dateYears.next_year2();
                        $scope.gridOptions.columnDefs[2].children[0].children[2].headerName = "" + $scope.dateYears.next_year3();

                        $scope.gridOptions.columnDefs[2].children[1].children[0].headerName = "" + $scope.dateYears.next_year1();
                        $scope.gridOptions.columnDefs[2].children[1].children[1].headerName = "" + $scope.dateYears.next_year2();
                        $scope.gridOptions.columnDefs[2].children[1].children[2].headerName = "" + $scope.dateYears.next_year3();
                        $scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);
                    }

                    /**
                     * 如果年份变化，根据年份生成表头标题
                     */
                    $scope.yearChange = function () {
                        createYearHeader();
                    }

                    /**=====================输入金额 自动计算 率==========================**/

                    /**
                     * 计算第一行或第二行的历史数据规划执行率
                     */
                    function countRow1_2_past_differ_rate() {
                        //计算第一/二行数据
                        for (var i = 0; i < $scope.data.currItem.fin_strategy_target_lines.length - 1; i++) {
                            var rowdata = $scope.data.currItem.fin_strategy_target_lines[i];
                            var past_year_amt1 = rowdata.past_year_amt1 ? parseFloat(rowdata.past_year_amt1) : 0;
                            var past_year_amt2 = rowdata.past_year_amt2 ? parseFloat(rowdata.past_year_amt2) : 0;
                            var past_year_amt3 = rowdata.past_year_amt3 ? parseFloat(rowdata.past_year_amt3) : 0;

                            var past_year_exp_amt1 = rowdata.past_year_exp_amt1 ? parseFloat(rowdata.past_year_exp_amt1) : 0;
                            var past_year_exp_amt2 = rowdata.past_year_exp_amt2 ? parseFloat(rowdata.past_year_exp_amt2) : 0;
                            var past_year_exp_amt3 = rowdata.past_year_exp_amt3 ? parseFloat(rowdata.past_year_exp_amt3) : 0;

                            var past_year_differ_rate1 = rowdata.past_year_differ_rate1 ? parseFloat(rowdata.past_year_differ_rate1) : 0;
                            var past_year_differ_rate2 = rowdata.past_year_differ_rate2 ? parseFloat(rowdata.past_year_differ_rate2) : 0;
                            var past_year_differ_rate3 = rowdata.past_year_differ_rate3 ? parseFloat(rowdata.past_year_differ_rate3) : 0;

                            past_year_differ_rate1 = numberApi.isNaN(past_year_amt1 / past_year_exp_amt1) ? 0 : numberApi.divide(past_year_amt1, past_year_exp_amt1).toFixed(4);
                            past_year_differ_rate2 = numberApi.isNaN(past_year_amt2 / past_year_exp_amt2) ? 0 : numberApi.divide(past_year_amt2, past_year_exp_amt2).toFixed(4);
                            past_year_differ_rate3 = numberApi.isNaN(past_year_amt3 / past_year_exp_amt3) ? 0 : numberApi.divide(past_year_amt3, past_year_exp_amt3).toFixed(4);

                            //放回数组对象
                            rowdata.past_year_differ_rate1 = past_year_differ_rate1 ? parseFloat(past_year_differ_rate1) : 0;
                            rowdata.past_year_differ_rate2 = past_year_differ_rate2 ? parseFloat(past_year_differ_rate2) : 0;
                            rowdata.past_year_differ_rate3 = past_year_differ_rate3 ? parseFloat(past_year_differ_rate3) : 0;
                            $scope.data.currItem.fin_strategy_target_lines[i] = rowdata;
                        }
                        $scope.gridOptions.api.setRowData($scope.data.currItem.fin_strategy_target_lines);
                    }

                    /**
                     * 计算第一行或第二行的未来三年战略规划增长率
                     */
                    function countRow1_2Growth_rate() {

                        //计算第一/二行数据
                        for (var i = 0; i < $scope.data.currItem.fin_strategy_target_lines.length - 1; i++) {
                            var rowdata = $scope.data.currItem.fin_strategy_target_lines[i];

                            var past_year_amt3 = rowdata.past_year_amt3 ? parseFloat(rowdata.past_year_amt3) : 0;

                            var next_year_amt1 = rowdata.next_year_amt1 ? parseFloat(rowdata.next_year_amt1) : 0;
                            var next_year_amt2 = rowdata.next_year_amt2 ? parseFloat(rowdata.next_year_amt2) : 0;
                            var next_year_amt3 = rowdata.next_year_amt3 ? parseFloat(rowdata.next_year_amt3) : 0;
                            var growth_rate1 = rowdata.growth_rate1 ? parseFloat(rowdata.growth_rate1) : 0;
                            var growth_rate2 = rowdata.growth_rate2 ? parseFloat(rowdata.growth_rate2) : 0;
                            var growth_rate3 = rowdata.growth_rate3 ? parseFloat(rowdata.growth_rate3) : 0;

                            growth_rate1 = (numberApi.isNaN(next_year_amt1 / past_year_amt3) || (next_year_amt1 / past_year_amt3) == 0) ? 0 : numberApi.sub(numberApi.divide(next_year_amt1, past_year_amt3), 1).toFixed(4);
                            growth_rate2 = (numberApi.isNaN(next_year_amt2 / next_year_amt1) || (next_year_amt2 / next_year_amt1) == 0) ? 0 : numberApi.sub(numberApi.divide(next_year_amt2, next_year_amt1), 1).toFixed(4);
                            growth_rate3 = (numberApi.isNaN(next_year_amt3 / next_year_amt2) || (next_year_amt3 / next_year_amt2) == 0) ? 0 : numberApi.sub(numberApi.divide(next_year_amt3, next_year_amt2), 1).toFixed(4);

                            //放回数组对象
                            rowdata.growth_rate1 = growth_rate1 ? parseFloat(growth_rate1) : 0;
                            rowdata.growth_rate2 = growth_rate2 ? parseFloat(growth_rate2) : 0;
                            rowdata.growth_rate3 = growth_rate3 ? parseFloat(growth_rate3) : 0;
                            $scope.data.currItem.fin_strategy_target_lines[i] = rowdata;
                        }
                        $scope.gridOptions.api.setRowData($scope.data.currItem.fin_strategy_target_lines);
                    }

                    /**
                     * 计算第三行未来三年战略规划的利润率
                     */
                    function countThridRowNextProfitRate() {

                        var rowdata = $scope.data.currItem.fin_strategy_target_lines[0];//取第一行数据
                        var next_year_amt_r1 = rowdata.next_year_amt1 ? parseFloat(rowdata.next_year_amt1) : 0;
                        var next_year_amt2_r1 = rowdata.next_year_amt2 ? parseFloat(rowdata.next_year_amt2) : 0;
                        var next_year_amt3_r1 = rowdata.next_year_amt3 ? parseFloat(rowdata.next_year_amt3) : 0;

                        rowdata = $scope.data.currItem.fin_strategy_target_lines[1];////取第二行数据
                        var next_year_amt_r2 = rowdata.next_year_amt1 ? parseFloat(rowdata.next_year_amt1) : 0;
                        var next_year_amt2_r2 = rowdata.next_year_amt2 ? parseFloat(rowdata.next_year_amt2) : 0;
                        var next_year_amt3_r2 = rowdata.next_year_amt3 ? parseFloat(rowdata.next_year_amt3) : 0;

                        //利润率
                        var count1 = numberApi.isNaN(next_year_amt_r2 / next_year_amt_r1) ? 0 : numberApi.divide(next_year_amt_r2, next_year_amt_r1).toFixed(4);//
                        var count2 = numberApi.isNaN(next_year_amt2_r2 / next_year_amt2_r1) ? 0 : numberApi.divide(next_year_amt2_r2, next_year_amt2_r1).toFixed(4);
                        var count3 = numberApi.isNaN(next_year_amt3_r2 / next_year_amt3_r1) ? 0 : numberApi.divide(next_year_amt3_r2, next_year_amt3_r1).toFixed(4);

                        rowdata = $scope.data.currItem.fin_strategy_target_lines[2];//取第三行数据

                        //利润率的执行率
                        var past_year_amt3 = rowdata.past_year_amt3 ? parseFloat(rowdata.past_year_amt3) : 0;
                        var count4 = (numberApi.isNaN(count1 / past_year_amt3) && (count1 / past_year_amt3) != 0) ? 0 : numberApi.divide(count1, past_year_amt3).toFixed(4);
                        var count5 = (numberApi.isNaN(count2 / count1) && (count2 / count1) != 0) ? 0 : numberApi.divide(count2, count1).toFixed(4);
                        var count6 = (numberApi.isNaN(count3 / count2) && (count3 / count2) != 0) ? 0 : numberApi.divide(count3, count2).toFixed(4);

                        //放回数组对象
                        rowdata.next_year_amt1 = count1 ? parseFloat(count1) : 0;
                        rowdata.next_year_amt2 = count2 ? parseFloat(count2) : 0;
                        rowdata.next_year_amt3 = count3 ? parseFloat(count3) : 0;
                        rowdata.growth_rate1 = count4 ? parseFloat(count4) : 0;
                        rowdata.growth_rate2 = count5 ? parseFloat(count5) : 0;
                        rowdata.growth_rate3 = count6 ? parseFloat(count6) : 0;

                        $scope.data.currItem.fin_strategy_target_lines[2] = rowdata;
                        $scope.gridOptions.api.setRowData($scope.data.currItem.fin_strategy_target_lines);
                    }

                    /**
                     * 计算第三行的历史数据的利润率
                     */
                    function countThridRowPastProfitRate() {

                        var rowdata = $scope.data.currItem.fin_strategy_target_lines[0];//取第一行数据
                        var past_year_amt1_r1 = rowdata.past_year_amt1 ? parseFloat(rowdata.past_year_amt1) : 0;
                        var past_year_amt2_r1 = rowdata.past_year_amt2 ? parseFloat(rowdata.past_year_amt2) : 0;
                        var past_year_amt3_r1 = rowdata.past_year_amt3 ? parseFloat(rowdata.past_year_amt3) : 0;

                        var past_year_exp_amt1_r1 = rowdata.past_year_exp_amt1 ? parseFloat(rowdata.past_year_exp_amt1) : 0;
                        var past_year_exp_amt2_r1 = rowdata.past_year_exp_amt2 ? parseFloat(rowdata.past_year_exp_amt2) : 0;
                        var past_year_exp_amt3_r1 = rowdata.past_year_exp_amt3 ? parseFloat(rowdata.past_year_exp_amt3) : 0;

                        rowdata = $scope.data.currItem.fin_strategy_target_lines[1];////取第二行数据
                        var past_year_amt1_r2 = rowdata.past_year_amt1 ? parseFloat(rowdata.past_year_amt1) : 0;
                        var past_year_amt2_r2 = rowdata.past_year_amt2 ? parseFloat(rowdata.past_year_amt2) : 0;
                        var past_year_amt3_r2 = rowdata.past_year_amt3 ? parseFloat(rowdata.past_year_amt3) : 0;

                        var past_year_exp_amt1_r2 = rowdata.past_year_exp_amt1 ? parseFloat(rowdata.past_year_exp_amt1) : 0;
                        var past_year_exp_amt2_r2 = rowdata.past_year_exp_amt2 ? parseFloat(rowdata.past_year_exp_amt2) : 0;
                        var past_year_exp_amt3_r2 = rowdata.past_year_exp_amt3 ? parseFloat(rowdata.past_year_exp_amt3) : 0;

                        //利润率
                        var count1 = numberApi.isNaN(past_year_exp_amt1_r2 / past_year_exp_amt1_r1) ? 0 : numberApi.divide(past_year_exp_amt1_r2, past_year_exp_amt1_r1).toFixed(4);
                        var count2 = numberApi.isNaN(past_year_exp_amt2_r2 / past_year_exp_amt2_r1) ? 0 : numberApi.divide(past_year_exp_amt2_r2, past_year_exp_amt2_r1).toFixed(4);
                        var count3 = numberApi.isNaN(past_year_exp_amt3_r2 / past_year_exp_amt3_r1) ? 0 : numberApi.divide(past_year_exp_amt3_r2, past_year_exp_amt3_r1).toFixed(4);
                        var count4 = numberApi.isNaN(past_year_amt1_r2 / past_year_amt1_r1) ? 0 : numberApi.divide(past_year_amt1_r2, past_year_amt1_r1).toFixed(4);
                        var count5 = numberApi.isNaN(past_year_amt2_r2 / past_year_amt2_r1) ? 0 : numberApi.divide(past_year_amt2_r2, past_year_amt2_r1).toFixed(4);
                        var count6 = numberApi.isNaN(past_year_amt3_r2 / past_year_amt3_r1) ? 0 : numberApi.divide(past_year_amt3_r2, past_year_amt3_r1).toFixed(4);

                        //利润率的执行率
                        var count7 = (numberApi.isNaN(count4 / count1) && (count4 / count1) != 0) ? 0 : numberApi.divide(count4, count1).toFixed(4);
                        var count8 = (numberApi.isNaN(count5 / count2) && (count5 / count2) != 0) ? 0 : numberApi.divide(count5, count2).toFixed(4);
                        var count9 = (numberApi.isNaN(count6 / count3) && (count6 / count3) != 0) ? 0 : numberApi.divide(count6, count3).toFixed(4);

                        rowdata = $scope.data.currItem.fin_strategy_target_lines[2];//取第三行数据

                        //放回数组对象
                        rowdata.past_year_exp_amt1 = count1 ? parseFloat(count1) : 0;
                        rowdata.past_year_exp_amt2 = count2 ? parseFloat(count2) : 0;
                        rowdata.past_year_exp_amt3 = count3 ? parseFloat(count3) : 0;
                        rowdata.past_year_amt1 = count4 ? parseFloat(count4) : 0;
                        rowdata.past_year_amt2 = count5 ? parseFloat(count5) : 0;
                        rowdata.past_year_amt3 = count6 ? parseFloat(count6) : 0;
                        rowdata.past_year_differ_rate1 = count7 ? parseFloat(count7) : 0;
                        rowdata.past_year_differ_rate2 = count8 ? parseFloat(count8) : 0;
                        rowdata.past_year_differ_rate3 = count9 ? parseFloat(count9) : 0;

                        $scope.data.currItem.fin_strategy_target_lines[2] = rowdata;
                        $scope.gridOptions.api.setRowData($scope.data.currItem.fin_strategy_target_lines);
                    }


                    /**=====================输入 率 自动计算金额 ==========================**/
                    /**
                     * 根据第一行或第二行的未来三年战略规划增长率计算战略规划金额
                     */
                    function countRow1_2Growth_Amt() {

                        //计算第一/二行数据
                        for (var i = 0; i < $scope.data.currItem.fin_strategy_target_lines.length - 1; i++) {
                            var rowdata = $scope.data.currItem.fin_strategy_target_lines[i];

                            var past_year_amt3 = rowdata.past_year_amt3 ? parseFloat(rowdata.past_year_amt3) : 0;

                            var next_year_amt1 = rowdata.next_year_amt1 ? parseFloat(rowdata.next_year_amt1) : 0;
                            var next_year_amt2 = rowdata.next_year_amt2 ? parseFloat(rowdata.next_year_amt2) : 0;
                            var next_year_amt3 = rowdata.next_year_amt3 ? parseFloat(rowdata.next_year_amt3) : 0;
                            var growth_rate1 = rowdata.growth_rate1 ? parseFloat(rowdata.growth_rate1) : 0;
                            var growth_rate2 = rowdata.growth_rate2 ? parseFloat(rowdata.growth_rate2) : 0;
                            var growth_rate3 = rowdata.growth_rate3 ? parseFloat(rowdata.growth_rate3) : 0;

                            next_year_amt1 = numberApi.isNaN(past_year_amt3) ? 0 : numberApi.mutiply(numberApi.sum(growth_rate1, 1), past_year_amt3).toFixed(4);
                            next_year_amt2 = numberApi.isNaN(next_year_amt1) ? 0 : numberApi.mutiply(numberApi.sum(growth_rate2, 1), next_year_amt1).toFixed(4);
                            next_year_amt3 = numberApi.isNaN(next_year_amt2) ? 0 : numberApi.mutiply(numberApi.sum(growth_rate3, 1), next_year_amt2).toFixed(4);

                            //放回数组对象
                            rowdata.next_year_amt1 = next_year_amt1 ? parseFloat(next_year_amt1) : 0;
                            rowdata.next_year_amt2 = next_year_amt2 ? parseFloat(next_year_amt2) : 0;
                            rowdata.next_year_amt3 = next_year_amt3 ? parseFloat(next_year_amt3) : 0;
                            $scope.data.currItem.fin_strategy_target_lines[i] = rowdata;
                        }
                        $scope.gridOptions.api.setRowData($scope.data.currItem.fin_strategy_target_lines);
                    }

                    /**
                     * 判断明细可否编辑
                     * @param arg
                     * @constructor
                     */
                    function Editable(arg) {
                        var flag = true;
                        if (parseInt(arg.data.strategy_item) == 3) {
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
                                classId:'base_view_erpemployee_org'
                            })
                            .result//响应数据
                            .then(function(response){
                                $scope.data.currItem.creator = response.employee_name;
                            });
                    }

                    /**===============编辑器重写 ================**/
                    /**
                     * 万元编辑器
                     */
                    function wanYuanEditor() {
                    }

                    angular.extend(wanYuanEditor.prototype, {
                        init: function (params) {
                            this.params = params;
                            var dom = $('<div class="input-group ag-cell-edit-input ag-input-group"><input type="text" class="form-control">' +
                                '<span class="input-group-addon" >万元</span></>');
                            this.dom = dom;
                            var $input = dom[0].getElementsByTagName('input')[0];
                            this.$input = $input;
                            var startValue;
                            if (!params.cellStartedEdit) {
                                this.focusAfterAttached = false;

                            }
                            startValue = this.getStartValue(params);
                            if (HczyCommon.isNotNull(startValue)) {
                                this.$input.value = startValue / 10000;
                            }
                        },
                        getGui: function () {
                            return this.dom[0];
                        },
                        getInput: function () {
                            return this.$input;
                        },
                        afterGuiAttached: function () {
                            this.$input.focus();
                        },
                        getValue: function () {
                            var eInput = this.getInput();
                            return this.params.parseValue(eInput.value);
                        },
                        destroy: function () {
                            this.params.api.stopEditing(false);
                            var dom = this.dom;
                            dom.remove();
                        },
                        getStartValue: function (params) {
                            var formatValue = params.useFormatter || params.column.getColDef().refData;
                            return formatValue ? params.formatValue(params.value) : params.value;
                        }
                    });

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