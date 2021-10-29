/**
 * 费用预算编制-属性页
 * 2018-11-27
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'numberApi', 'loopApi',
        'swalApi', 'dateApi', 'fileApi'],
    function (module, controllerApi, base_obj_prop, requestApi, numberApi, loopApi,
              swalApi, dateApi, fileApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {

                /*-------------------数据定义开始------------------------*/
                var initialColDefsLength = 0;

                $scope.data = $scope.data || {};
                $scope.data.currItem = $scope.data.currItem || {};


                function editable(args) {
                    if (!arguments[0].node.id) {
                        return false;
                    }
                    if ($scope.$eval('data.currItem.stat') == 1)
                        return true;
                    return false;
                }

                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [
                        {
                            type: '序号'
                        }
                        , {
                            headerName: '费用类别/项目',
                            children: [
                                {
                                    field: 'fee_code',
                                    headerName: '编码',
                                    pinned: 'left'
                                }
                                , {
                                    field: 'fee_name',
                                    headerName: '名称',
                                    pinned: 'left'

                                }, {
                                    field: 'object_type',
                                    headerName: '类型',
                                    type: '词汇',
                                    cellEditorParams: {
                                        names: ['费用类别', '费用项目'],
                                        values: [1, 2]
                                    },
                                    pinned: 'left'
                                }
                            ]
                        }
                        , {
                            field: 'subject_name',
                            headerName: '会计核算科目'
                        }
                        , {
                            headerName: '预算类别',
                            children: [
                                {
                                    field: 'bud_type_code',
                                    headerName: '编码'
                                },
                                {
                                    field: 'bud_type_name',
                                    headerName: '名称'
                                }
                            ]
                        }
                        , {
                            field: 'crm_entid',
                            headerName: '品类',
                            hcDictCode: '*'
                        }
                        , {
                            headerName: '预算费用金额',
                            children: [
                                {
                                    field: 'bud_fee_amt',
                                    headerName: '费用金额',
                                    type: '金额'
                                },
                                {
                                    field: 'bud_fee_rate',
                                    headerName: '费用率',
                                    type: '百分比'
                                }
                            ]
                        }
                        // , {
                        //     headerName: '同比增长率',
                        //     children:[
                        //         {
                        //             field: 'fee_growth_amt',
                        //             headerName: '费用金额',
                        //             type: '百分比'
                        //         },
                        //         {
                        //             field: 'fee_growth_rate',
                        //             headerName: '费用率',
                        //             type: '百分比'
                        //         }
                        //     ]
                        // }
                        , {
                            field: 'note',
                            headerName: '编制依据(说明)'
                        }
                    ]
                };

                //按月度显示12个期间
                var resolve_byMonth = [
                    {
                        headerName: "1月分解预算",
                        children: [
                            {
                                field: 'lyear_period1_amt',
                                headerName: '去年同期',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            },
                            {
                                field: 'tyear_period1_amt',
                                headerName: '本期预算',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            }
                        ]
                    }, {
                        headerName: "2月分解预算",
                        children: [
                            {
                                field: 'lyear_period2_amt',
                                headerName: '去年同期',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            },
                            {
                                field: 'tyear_period2_amt',
                                headerName: '本期预算',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            }
                        ]
                    }, {
                        headerName: "3月分解预算",
                        children: [
                            {
                                field: 'lyear_period3_amt',
                                headerName: '去年同期',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            },
                            {
                                field: 'tyear_period3_amt',
                                headerName: '本期预算',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            }
                        ]
                    }, {
                        headerName: "4月分解预算",
                        children: [
                            {
                                field: 'lyear_period4_amt',
                                headerName: '去年同期',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            },
                            {
                                field: 'tyear_period4_amt',
                                headerName: '本期预算',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            }
                        ]
                    }, {
                        headerName: "5月分解预算",
                        children: [
                            {
                                field: 'lyear_period5_amt',
                                headerName: '去年同期',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            },
                            {
                                field: 'tyear_period5_amt',
                                headerName: '本期预算',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            }
                        ]
                    }, {
                        headerName: "6月分解预算",
                        children: [
                            {
                                field: 'lyear_period6_amt',
                                headerName: '去年同期',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            },
                            {
                                field: 'tyear_period6_amt',
                                headerName: '本期预算',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            }
                        ]
                    }, {
                        headerName: "7月分解预算",
                        children: [
                            {
                                field: 'lyear_period7_amt',
                                headerName: '去年同期',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            },
                            {
                                field: 'tyear_period7_amt',
                                headerName: '本期预算',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            }
                        ]
                    }, {
                        headerName: "8月分解预算",
                        children: [
                            {
                                field: 'lyear_period8_amt',
                                headerName: '去年同期',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            },
                            {
                                field: 'tyear_period8_amt',
                                headerName: '本期预算',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            }
                        ]
                    }, {
                        headerName: "9月分解预算",
                        children: [
                            {
                                field: 'lyear_period9_amt',
                                headerName: '去年同期',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            },
                            {
                                field: 'tyear_period9_amt',
                                headerName: '本期预算',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            }
                        ]
                    }, {
                        headerName: "10月分解预算",
                        children: [
                            {
                                field: 'lyear_period10_amt',
                                headerName: '去年同期',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            },
                            {
                                field: 'tyear_period10_amt',
                                headerName: '本期预算',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            }
                        ]
                    }, {
                        headerName: "11月分解预算",
                        children: [
                            {
                                field: 'lyear_period11_amt',
                                headerName: '去年同期',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            },
                            {
                                field: 'tyear_period11_amt',
                                headerName: '本期预算',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            }
                        ]
                    }, {
                        headerName: "12月分解预算",
                        children: [
                            {
                                field: 'lyear_period12_amt',
                                headerName: '去年同期',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            },
                            {
                                field: 'tyear_period12_amt',
                                headerName: '本期预算',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            }
                        ]
                    }
                ];

                //按年度显示前四个期间
                var resolve_byQuarter = [
                    {
                        headerName: "1季度分解预算",
                        children: [
                            {
                                field: 'lyear_period1_amt',
                                headerName: '去年同期',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            },
                            {
                                field: 'tyear_period1_amt',
                                headerName: '本期预算',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            }
                        ]
                    }
                    , {
                        headerName: "2季度分解预算",
                        children: [
                            {
                                field: 'lyear_period2_amt',
                                headerName: '去年同期',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            },
                            {
                                field: 'tyear_period2_amt',
                                headerName: '本期预算',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            }
                        ]
                    }
                    , {
                        headerName: "3季度分解预算",
                        children: [
                            {
                                field: 'lyear_period3_amt',
                                headerName: '去年同期',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            },
                            {
                                field: 'tyear_period3_amt',
                                headerName: '本期预算',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            }
                        ]
                    }
                    , {
                        headerName: "4季度分解预算",
                        children: [
                            {
                                field: 'lyear_period4_amt',
                                headerName: '去年同期',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            },
                            {
                                field: 'tyear_period4_amt',
                                headerName: '本期预算',
                                type: '金额',
                                editable: function (args) {
                                    return editable(args);
                                }
                            }
                        ]
                    }];

                /*-------------------数据定义结束------------------------*/

                /*-------------------通用查询开始------------------------*/

                /**
                 * 查费用预算编制单
                 */
                $scope.chooseFeeBud = function (args) {
                    $modal.openCommonSearch({
                            classId: 'fin_bud_fee_head',
                            postData: {},
                            sqlWhere: ' stat = 5 ' +
                            'and fee_bud_head_id not in(select source_fee_bud_head_id from fin_bud_fee_month_head)',
                            action: 'search',
                            title: "费用预算编制",
                            gridOptions: {
                                columnDefs: [{
                                    headerName: "预算单号",
                                    field: "fee_bud_head_no"
                                }, {
                                    headerName: "编制年度",
                                    field: "bud_year"
                                }, {
                                    headerName: "部门",
                                    field: "org_name"
                                }]
                            }
                        })
                        .result//响应数据
                        .then(function (response) {
                            var curr_id = $scope.data.currItem.curr_id;
                            $scope.data.currItem = angular.extend({}, response);

                            $scope.data.currItem.source_fee_bud_head_id = response.fee_bud_head_id;

                            $scope.data.currItem.fee_bud_head_id = curr_id;
                            $scope.data.currItem.create_time = dateApi.now();
                            $scope.data.currItem.stat = 1;
                            $scope.data.currItem.wfid = 0;
                            $scope.data.currItem.wfflag = 0;

                            return requestApi.post('fin_bud_fee_head', 'select', {
                                fee_bud_head_id: $scope.data.currItem.source_fee_bud_head_id
                            })
                        })
                        .then(function (response) {
                            $scope.data.currItem.fin_bud_fee_month_lines = response.fin_bud_fee_lines;
                            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.fin_bud_fee_month_lines);

                            $scope.calSum();
                        })
                        .then($scope.setResolveCol)
                        .then($scope.setGridHeaderName)
                };
                /*-------------------通用查询结束---------------------*/


                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /**
                 * 新增时数据
                 * @param bizData
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);

                    bizData.create_time = dateApi.now();
                    bizData.curr_id = 0;

                    bizData.fin_bud_fee_month_lines = [];

                    $scope.gridOptions.hcApi.setRowData(bizData.fin_bud_fee_month_lines);
                };


                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);

                    bizData.curr_id = bizData.fee_bud_head_id;//临时保存当前表id
                    $scope.gridOptions.hcApi.setRowData(bizData.fin_bud_fee_month_lines);

                    $scope.calSum();
                };

                $scope.setPercent = function () {
                    doSetPercent();
                }

                //period_type 3 月度,1 年度,2 季度
                // control_type 1-时间进度 2-销售进度 3-产值进度
                function doSetPercent() {
                    var tasks = [];
                    //取行
                    $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                        var data = node.data;
                        tasks.push({node: node, data: data});
                    });
                    tasks.forEach(function (value) {
                        $scope.searchPercent(value).then(function (result) {
                            if (result.percents.length > 0) {
                                var percent = result.percents[0];
                                //1-时间进度
                                if (value.data.control_type == 1) {
                                    //按季度 1-3季度=总费用/4，有小数点的四舍五入保留两位小数，4季度=总费用-（1-3季度费用）；
                                    if (value.data.period_type == 2) {
                                        var month_1_3 = numberApi.divide(value.data.bud_fee_amt, 4).toFixed(2);
                                        var month_4 = numberApi.sum(value.data.bud_fee_amt, -numberApi.mutiply(month_1_3, 3));
                                        resolve_byQuarter.forEach(function (field, index) {
                                            if (index < 3) {
                                                value.data[field.children[1].field] = month_1_3;
                                            } else if (index == 3) {
                                                value.data[field.children[1].field] = month_4;
                                            }
                                        });
                                    }
                                    //按月度 1-11月=总费用/12，有小数点的四舍五入保留两位小数，12月=总费用-（1-11月费用）；
                                    else if (value.data.period_type == 3) {
                                        var month_1_11 = numberApi.divide(value.data.bud_fee_amt, 12).toFixed(2);
                                        var month_12 = numberApi.sum(value.data.bud_fee_amt, -numberApi.mutiply(month_1_11, 11));
                                        resolve_byMonth.forEach(function (field, index) {
                                            if (index < 11) {
                                                value.data[field.children[1].field] = month_1_11;
                                            } else if (index == 11) {
                                                value.data[field.children[1].field] = month_12;
                                            }
                                        });
                                    }
                                }
                                //2-销售进度 3-产值进度
                                else if (value.data.control_type == 2 || value.data.control_type == 3) {
                                    //按季度 1-3季度费用金额按进度比例分解，有小数点的四舍五入保留两位小数，4季度=总费用-（1-3季度费用）；
                                    // （预算进度设置只按月份设置，如果费用是按照季度做的，那么1季度=1月进度+2月进度+3月进度…）
                                    if (value.data.period_type == 2) {
                                        var total_1_3 = 0, ind = 0;
                                        resolve_byQuarter.forEach(function (field, index) {
                                            ind = index * 3 + 1
                                            if (index < 3) {
                                                value.data[field.children[1].field] =
                                                    numberApi.sum(numberApi.mutiply(value.data.bud_fee_amt, percent["percent_month" + ind]),
                                                        numberApi.mutiply(value.data.bud_fee_amt, percent["percent_month" + (ind + 1)]),
                                                        numberApi.mutiply(value.data.bud_fee_amt, percent["percent_month" + (ind + 2)])).toFixed(2);
                                                total_1_3 = numberApi.sum(total_1_3, value.data[field.children[1].field]);
                                            } else if (index == 3) {
                                                value.data[field.children[1].field] = numberApi.sum(value.data.bud_fee_amt, -total_1_3);
                                            }
                                        });
                                    }
                                    //按月度 1-11月费用金额按进度比例分解，有小数点的四舍五入保留两位小数，12月=总费用-（1-11月费用）
                                    else if (value.data.period_type == 3) {
                                        var total_1_11 = 0;
                                        resolve_byMonth.forEach(function (field, index) {
                                            index = index + 1;
                                            if (index < 12) {
                                                value.data[field.children[1].field] =
                                                    numberApi.mutiply(value.data.bud_fee_amt, percent["percent_month" + index]).toFixed(2);
                                                total_1_11 = numberApi.sum(total_1_11, value.data[field.children[1].field]);
                                            } else if (index == 12) {
                                                value.data[field.children[1].field] = numberApi.sum(value.data.bud_fee_amt, -total_1_11);
                                            }
                                        });
                                    }
                                }
                            }
                            return result;
                        }).then(function (v) {
                            $scope.gridOptions.api.refreshCells({
                                rowNodes: [v.node]
                            });
                        })
                    });

                }

                //查询预算进度
                $scope.searchPercent = function (value) {
                    var postData = {
                        classId: "month_bud_percent",
                        action: 'search',
                        data: {
                            dept_id: $scope.data.currItem.org_id,
                            bud_year: $scope.data.currItem.bud_year,
                            crm_entid: value.data.crm_entid
                        }
                    };
                    return requestApi.post(postData).then(
                        function (data) {
                            value.percents = data.month_bud_percents;
                            return value;
                        }
                    );
                };

                /**
                 * 保存前验证
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);

                    var lines = $scope.data.currItem.fin_bud_fee_month_lines;

                    loopApi.forLoop(lines.length, function (i) {
                        var tyear_sum = numberApi.sum(lines[i].tyear_period1_amt, lines[i].tyear_period2_amt,
                            lines[i].tyear_period3_amt, lines[i].tyear_period4_amt,
                            lines[i].tyear_period5_amt, lines[i].tyear_period6_amt,
                            lines[i].tyear_period7_amt, lines[i].tyear_period8_amt,
                            lines[i].tyear_period9_amt, lines[i].tyear_period10_amt,
                            lines[i].tyear_period11_amt, lines[i].tyear_period12_amt);

                        var bud_fee_amt = lines[i].bud_fee_amt;

                        if (tyear_sum != bud_fee_amt) {
                            invalidBox.push(
                                '第' + (i + 1) + '行期间分解预算之和【' + tyear_sum + '】不等于总预算费用金额【' + bud_fee_amt + '】！');
                        }
                    });
                };

                /**
                 * 计算合计数据
                 */
                $scope.calSum = function () {
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            tyear_feebud_amt: numberApi.sum($scope.data.currItem.fin_bud_fee_month_lines, 'tyear_feebud_amt'),
                            bud_fee_amt: numberApi.sum($scope.data.currItem.fin_bud_fee_month_lines, 'bud_fee_amt')
                        }
                    ]);
                };

                /**
                 * 初始化
                 */
                $scope.doInit = function () {
                    $scope.hcSuper.doInit()
                        .then(function () {
                            return initialColDefsLength = $scope.gridOptions.columnDefs.length;
                        })
                        .then($scope.setResolveCol)
                        .then($scope.setGridHeaderName);
                };

                /**
                 * 设置分解列
                 */
                $scope.setResolveCol = function () {
                    //季度
                    if ($scope.data.currItem.period_type == 2) {
                        $scope.gridOptions.columnDefs.splice(initialColDefsLength);
                        Array.prototype.push.apply($scope.gridOptions.columnDefs, resolve_byQuarter);
                    }
                    //月度
                    if ($scope.data.currItem.period_type == 3) {
                        $scope.gridOptions.columnDefs.splice(initialColDefsLength);
                        Array.prototype.push.apply($scope.gridOptions.columnDefs, resolve_byMonth);
                    }

                    $scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);

                    return $scope.gridOptions;
                };

                /**
                 * 设置表头名
                 */
                $scope.setGridHeaderName = function () {
                    if ($scope.data.currItem.bud_year) {
                        var bud_year = numberApi.toNumber($scope.data.currItem.bud_year);

                        $scope.gridOptions.columnDefs[$scope.getIdxByField('bud_fee_amt')].headerName
                            = bud_year + "年费用预算";

                        $scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);
                    }
                };

                /**
                 * 获取网格列索引
                 */
                $scope.getIdxByField = function (fieldname) {
                    var idx;
                    var colDefs = $scope.gridOptions.columnDefs;
                    loopApi.forLoop(colDefs.length, function (i) {
                        if (colDefs[i].children && colDefs[i].children.length) {
                            loopApi.forLoop(colDefs[i].children.length, function (j) {
                                if (colDefs[i].children[j].field === fieldname) {
                                    idx = i;
                                    return true;
                                }
                            })
                        } else {
                            if (colDefs[i].field === fieldname) {
                                idx = i;
                                return true;
                            }
                        }
                    });

                    return idx;
                };


                /**
                 * 批量导入
                 */
                $scope.batchImport = function () {
                    if (!$scope.data.currItem.fee_bud_head_no) {
                        return swalApi.info('请先选择费用预算单');
                    }
                    var titleToField = {};
                    //季度
                    if ($scope.data.currItem.period_type == 2) {
                        for (var i = 1; i <= 4; i++) {
                            titleToField[i + '季度去年同期'] = 'lyear_period' + i + '_amt';
                            titleToField[i + '季度本期预算'] = 'tyear_period' + i + '_amt';
                        }
                    }
                    //月度
                    if ($scope.data.currItem.period_type == 3) {
                        for (var i = 1; i <= 12; i++) {
                            titleToField[i + '月去年同期'] = 'lyear_period' + i + '_amt';
                            titleToField[i + '月本期预算'] = 'tyear_period' + i + '_amt';
                        }
                    }

                    fileApi.chooseExcelAndGetData()
                        .then(function (excelData) {
                            var importLines = excelData.rows;
                            var validLines = [];

                            loopApi.forLoop(importLines.length, function (i) {
                                var data = {};
                                Object.keys(titleToField).forEach(function (key) {
                                    var field = titleToField[key];
                                    var value = importLines[i][key];

                                    data[field] = value;
                                });

                                validLines.push(data);
                            });

                            //赋值分解数据
                            if ($scope.data.currItem.fin_bud_fee_month_lines.length) {
                                loopApi.forLoop($scope.data.currItem.fin_bud_fee_month_lines.length, function (i) {
                                    if ($scope.data.currItem.period_type == 3) {
                                        loopApi.forLoop(12, function (k) {
                                            var field_lyear = 'lyear_period' + (k + 1) + '_amt';
                                            var field_tyear = 'tyear_period' + (k + 1) + '_amt';
                                            if (validLines[i]) {
                                                $scope.data.currItem.fin_bud_fee_month_lines[i][field_lyear]
                                                    = validLines[i][field_lyear];
                                                $scope.data.currItem.fin_bud_fee_month_lines[i][field_tyear]
                                                    = validLines[i][field_tyear];
                                            }
                                        });
                                    }
                                    if ($scope.data.currItem.period_type == 2) {
                                        loopApi.forLoop(4, function (k) {
                                            var field_lyear = 'lyear_period' + (k + 1) + '_amt';
                                            var field_tyear = 'tyear_period' + (k + 1) + '_amt';
                                            if (validLines[i]) {
                                                $scope.data.currItem.fin_bud_fee_month_lines[i][field_lyear]
                                                    = validLines[i][field_lyear];
                                                $scope.data.currItem.fin_bud_fee_month_lines[i][field_tyear]
                                                    = validLines[i][field_tyear];
                                            }
                                        });
                                    }
                                });
                            }

                            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.fin_bud_fee_month_lines);

                            return $scope.data.currItem.fin_bud_fee_month_lines;
                        })
                        .then($scope.calSum)
                };


                /**
                 * 按钮
                 * @type {{title: string, click: click, hide: hide}}
                 */
                $scope.footerLeftButtons = {
                    batchImport: {
                        title: '批量导入',
                        click: function () {
                            $scope.batchImport && $scope.batchImport();
                        },
                        hide: function () {
                            return $scope.data.currItem.stat >= 5;
                        }
                    },
                    setPercent: {
                        title: '按进度分解',
                        click: function () {
                            $scope.setPercent && $scope.setPercent();
                        },
                        hide: function () {
                            return $scope.data.currItem.stat > 1;
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
