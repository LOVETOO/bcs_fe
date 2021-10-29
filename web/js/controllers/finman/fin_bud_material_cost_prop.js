/**
 * 销售预算编制-属性页
 * 2018-11-27
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'openBizObj', 'swalApi', '$q', 'numberApi', 'fileApi', 'loopApi'],
    function (module, controllerApi, base_obj_prop, requestApi, openBizObj, swalApi, $q, numberApi, fileApi, loopApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {

                function editable(args) {
                    if (!arguments[0].node.id) {
                        return false;
                    }
                    if ($scope.data.currItem.stat == 1 && (args.data.salesdata_line_id == undefined || args.data.salesdata_line_id == 0))
                        return true;
                    return false;
                }

                function editable_v1(args) {
                    if ($scope.data.currItem.stat == 1)
                        return true;
                    return false;
                }

                /*-------------------数据定义开始------------------------*/
                $scope.LineName = 'fin_bud_material_cost_lines';

                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [
                        {
                            type: '序号'
                        }
                        , {
                            field: 'item_code',
                            headerName: '产品编码',
                            editable: editable,
                            pinned: 'left',
                            hcRequired: true,
                            onCellDoubleClicked: function (args) {
                                if (editable(args)) {
                                    $scope.chooseItem(args).then(function (args) {
                                        args.api.refreshView();
                                    });
                                }
                            },
                            onCellValueChanged: function (args) {

                                if (args.newValue === args.oldValue)
                                    return;

                                getItem(args.newValue)
                                    .catch(function (reason) {
                                        return {
                                            item_id: 0,
                                            item_code: '',
                                            item_name: reason
                                        };
                                    })
                                    .then(function (line) {
                                        angular.extend(args.data, line);
                                        args.api.refreshCells();
                                    });
                            }
                        }
                        , {
                            field: 'item_name',
                            headerName: '产品名称'
                        }
                        , {
                            field: 'crm_entid',
                            headerName: '所属品类',
                            hcDictCode: 'crm_entid'
                        }
                        , {
                            field: 'uom_name',
                            headerName: '计量单位',
                            type: '单位'
                        }, {
                            field: 'avg_material_cost',
                            headerName: '年平均材料成本/单台',
                            editable: editable,
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, [countBud_material_cost, countGrowth_rate]);
                            },
                            type: '金额',
                            width: 190,
                            hcRequired: true
                        },
                        {
                            field: 'bud_material_cost',
                            headerName: '预算材料成本/单台',
                            editable: editable,
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, [countGrowth_rate]);

                            },
                            type: '金额',
                            width: 200,
                            maxWidth: 200,
                            hcRequired: true
                        }, {
                            field: 'growth_rate',
                            headerName: '增长率',
                            // editable: true,
                            // onCellValueChanged: function (args) {
                            //     checkGridMoneyInput(args, [countBud_material_cost]);
                            // }
                            type: '百分比'
                        }
                        , {
                            field: 'note',
                            headerName: '编制说明',
                            editable: editable
                        }
                    ]
                };

                /*-------------------数据定义结束------------------------*/

                /*-------------------通用查询开始------------------------*/

                //获取销售预算编制明细
                function getSalesDataLine() {
                    if ($scope.data.currItem.org_id && !isNaN($scope.data.currItem.org_id) && $scope.data.currItem.org_id > 0
                        && $scope.data.currItem.bud_year && !isNaN($scope.data.currItem.bud_year) && $scope.data.currItem.bud_year > 0) {
                        var postData = {
                            classId: "fin_salesdata_head",
                            action: 'getsalesdataline',
                            data: {org_id: $scope.data.currItem.org_id, sales_year: $scope.data.currItem.bud_year}
                        };
                        return requestApi.post(postData)
                            .then(function (data) {
                                if (data.fin_salesdata_lines.length > 0) {
                                    $scope.data.currItem.fin_bud_material_cost_lines = data.fin_salesdata_lines;
                                } else {
                                    swalApi.info('未找到' + $scope.data.currItem.bud_year + '年的历史销售数据！');
                                    $scope.data.currItem.fin_bud_material_cost_lines = [];
                                }
                                $scope.gridOptions.hcApi.setRowData($scope.data.currItem.fin_bud_material_cost_lines);
                            });
                    }
                }

                /**
                 * 查产品
                 */
                $scope.chooseItem = function (args) {
                    $modal.openCommonSearch({
                            classId: 'item_org',
                            postData: {},
                            action: 'search',
                            title: "产品资料",
                            gridOptions: {
                                columnDefs: [{
                                    headerName: "产品编码",
                                    field: "item_code"
                                }, {
                                    headerName: "产品名称",
                                    field: "item_name"
                                }, {
                                    headerName: "计量单位",
                                    field: "uom_name"
                                }]
                            }
                        })
                        .result//响应数据
                        .then(function (response) {
                            if (checkItem(response.item_code)) {
                                return swalApi.info("产品已存在列表中，不能重复添加！");
                            }
                            args.data.item_id = response.item_id;
                            args.data.item_code = response.item_code;
                            args.data.item_name = response.item_name;
                            args.data.uom_id = response.uom_id;
                            args.data.uom_name = response.uom_name;
                            args.data.crm_entid = response.crm_entid;
                            return args;
                        });
                };

                function checkItem(item_code) {
                    var flag = false;
                    $scope.data.currItem.fin_bud_material_cost_lines.forEach(function (value) {
                        if (value.item_code == item_code && value.item_id > 0) {
                            flag = true;
                            return false;
                        }
                    });
                    return flag;
                }

                function getItem(code) {
                    if (checkItem(code)) {
                        return $q.reject("产品已存在列表中，不能重复添加！");
                    }
                    var postData = {
                        classId: "item_org",
                        action: 'search',
                        data: {sqlwhere: "item_code = '" + code + "'"}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            if (data.item_orgs.length > 0) {
                                return data.item_orgs[0];
                            } else {
                                return $q.reject("产品编码【" + code + "】不可用");
                            }
                        });
                }

                /*-------------------通用查询结束---------------------*/
                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /**
                 * 底部左边按钮隐藏事件
                 * @returns {boolean}
                 */
                $scope.footerLeftButtonsHide = function () {
                    if ($scope.data.currItem.stat != 1)
                        return true;
                    return false;
                };
                $scope.addRow = function () {
                    $scope.gridOptions.api.stopEditing();
                    swal({
                        title: '请输入要增加的行数',
                        type: 'input', //类型为输入框
                        inputValue: 1, //输入框默认值
                        closeOnConfirm: false, //点击确认不关闭，由后续代码判断是否关闭
                        showCancelButton: true //显示【取消】按钮
                    }, function (inputValue) {
                        if (inputValue === false) {
                            swal.close();
                            return;
                        }

                        var rowCount = Number(inputValue);
                        if (rowCount <= 0) {
                            swal.showInputError('请输入有效的行数');
                            return;
                        }
                        else if (rowCount > 1000) {
                            swal.showInputError('请勿输入过大的行数(1000以内为宜)');
                            return;
                        }
                        swal.close();

                        var data = $scope.data.currItem[$scope.LineName];

                        for (var i = 0; i < rowCount; i++) {
                            var newLine = {
                                // warehouse_code: $scope.data.currItem.warehouse_code,
                                // warehouse_id: $scope.data.currItem.warehouse_id,
                                // warehouse_name: $scope.data.currItem.warehouse_name
                            };
                            data.push(newLine);
                        }
                        $scope.gridOptions.hcApi.setRowData(data);
                        $scope.gridOptions.hcApi.setFocusedCell(data.length - rowCount, 'item_code');
                    });
                }
                $scope.deleteRow = function () {
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
                            $scope.data.currItem[$scope.LineName] = rowData;
                        },
                        okTitle: '删除成功'
                    });
                }

                $scope.footerLeftButtons.addRow.hide = $scope.footerLeftButtonsHide;
                $scope.footerLeftButtons.deleteRow.hide = $scope.footerLeftButtonsHide;

                $scope.footerLeftButtons.addRow.click = $scope.addRow;
                $scope.footerLeftButtons.deleteRow.click = $scope.deleteRow;


                /** ==========================数据校验、逻辑计算开始 =============================**/
                function checkGridMoneyInput(args, functions) {
                    if (args.newValue === args.oldValue)
                        return;
                    if (numberApi.isNum(args.newValue) || numberApi.isStrOfNum(args.newValue)) {
                        functions.forEach(function (fun) {
                            fun(args);
                        });
                        args.api.refreshView();
                    }
                    else {
                        return swalApi.info("请输入有效数字");
                    }
                }

                /**
                 * 计算均价增长率
                 */
                function setRate1(args) {
                    if (args.data.sales_price1 && !isNaN(args.data.sales_price1)
                        && args.data.sales_price2 && !isNaN(args.data.sales_price2) && args.data.sales_price1 > 0) {
                        args.data.growth_rate1 = ((args.data.sales_price2 - args.data.sales_price1) / args.data.sales_price1).toFixed(4);
                    }
                }

                /**
                 * 增长率改变或 上年末材料成本改变 计算预算材料成本/单台 计算公式=（1+增长率）*上年末材料成本；
                 */
                function countBud_material_cost(args) {
                    if (args.data.avg_material_cost && !isNaN(args.data.avg_material_cost) && args.data.avg_material_cost > 0
                        && args.data.growth_rate && !isNaN(args.data.growth_rate) && args.data.growth_rate > 0) {
                        args.data.bud_material_cost = numberApi.mutiply(numberApi.sum(1, args.data.growth_rate), args.data.avg_material_cost)
                    }
                }

                /**
                 * 预算材料成本/单台改变或 上年末材料成本改变 计算增长率
                 */
                function countGrowth_rate(args) {
                    if (args.data.avg_material_cost && !isNaN(args.data.avg_material_cost) && args.data.avg_material_cost > 0
                        && args.data.bud_material_cost && !isNaN(args.data.bud_material_cost) && args.data.bud_material_cost > 0) {
                        args.data.growth_rate = numberApi.divide(numberApi.sub(args.data.bud_material_cost, args.data.avg_material_cost), args.data.avg_material_cost);
                    }
                }

                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    checkData(invalidBox);
                };


                function checkData(reason) {
                    $scope.gridOptions.api.stopEditing();
                    if ($scope.data.currItem.fin_bud_material_cost_lines.length == 0) {
                        reason.push('请添加明细！');
                    }
                    // var lineData = $scope.data.currItem.fin_bud_material_cost_lines;
                    //
                    // lineData.forEach(function (line, index) {
                    //     var row = index + 1;
                    //     if (!line.item_id)
                    //         reason.push('第' + row + '行产品不能为空');
                    // });

                }


                /**
                 * 新增时初始化数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);
                    bizData.bud_year = new Date().getFullYear() + 1;
                    bizData.stat = 1;
                    bizData.according_to = 1;
                    bizData.create_time = new Date().Format('yyyy-MM-dd hh:mm:ss');
                    bizData.fin_bud_material_cost_lines = [];
                    $scope.gridOptions.hcApi.setRowData(bizData.fin_bud_material_cost_lines);

                    $scope.getFin_bud_sale_data();
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.fin_bud_material_cost_lines);
                    $scope.calSum();
                };

                /**
                 * 初始化
                 */
                $scope.doInit = function () {
                    $scope.hcSuper.doInit().then($scope.initHeader);
                };

                /**
                 * 初始化表头
                 */
                $scope.initHeader = function () {
                    return $q.when().then(function () {
                        var last_year = Number($scope.data.currItem.bud_year) - 1;
                        $scope.data.currItem.according_to = parseInt($scope.data.currItem.according_to);
                        switch ($scope.data.currItem.according_to) {
                            case 1://手工编制
                                $scope.gridOptions.columnDefs[5].headerName = "(" + last_year + ")年材料成本/单台";
                                break;
                            case 2 ://上年末材料成本
                                $scope.gridOptions.columnDefs[5].headerName = "(" + last_year + ")年末材料成本/单台";
                                break;
                            case 3://上年平均材料成本
                                $scope.gridOptions.columnDefs[5].headerName = "(" + last_year + ")年平均材料成本/单台";
                                break;
                        }
                        $scope.gridOptions.columnDefs[6].headerName = "" + $scope.data.currItem.bud_year + "年预算材料成本/单台";
                        $scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);
                    });

                };

                /**
                 * 获取销售预算编制的产品数据
                 */
                $scope.getFin_bud_sale_data = function () {
                    $scope.data.currItem.fin_bud_material_cost_lines = [];
                    $scope.gridOptions.api.setRowData($scope.data.currItem.fin_bud_material_cost_lines);
                    var sqlwhere = ' bud_year=' + $scope.data.currItem.bud_year + ' and stat = 5 ';
                    requestApi.post('fin_bud_sales_head', 'search', {sqlwhere: sqlwhere})
                        .then(function (response) {
                            if (response.fin_bud_sales_heads.length && response.fin_bud_sales_heads.length > 0) {
                                // if (response.fin_bud_sales_heads.length > 1) {
                                //     swalApi.info('该年份存在多个销售预算编制,请检查');
                                //     return $q.reject();
                                // }
                                return response.fin_bud_sales_heads;
                            }
                            return $q.reject();
                        })
                        .then(function (fin_bud_sales_heads) {
                            var defers = [];
                            fin_bud_sales_heads.forEach(function (fin_bud_sales_head) {
                                defers.push(requestApi.post('fin_bud_sales_head', 'select', {sales_bud_head_id: fin_bud_sales_head.sales_bud_head_id}));
                            });

                            $q.all(defers)
                                .then(function (responses) {
                                    $scope.data.currItem.fin_bud_material_cost_lines = [];
                                    responses.forEach(function (response) {
                                        response.fin_bud_sales_lines.forEach(function (fin_bud_sales_line) {
                                            var flag = true;
                                            for (var i = 0; i < $scope.data.currItem.fin_bud_material_cost_lines.length; i++) {
                                                if (parseInt($scope.data.currItem.fin_bud_material_cost_lines[i].item_id) == parseInt(fin_bud_sales_line.item_id)) {
                                                    flag = false;
                                                    break;
                                                }
                                            }
                                            if (flag) {
                                                $scope.data.currItem.fin_bud_material_cost_lines.push({
                                                    item_id: fin_bud_sales_line.item_id,
                                                    item_code: fin_bud_sales_line.item_code,
                                                    item_name: fin_bud_sales_line.item_name,
                                                    uom_id: fin_bud_sales_line.uom_id,
                                                    uom_name: fin_bud_sales_line.uom_name,
                                                    crm_entid: fin_bud_sales_line.crm_entid
                                                })
                                            }
                                        });
                                    });
                                    $scope.gridOptions.api.setRowData($scope.data.currItem.fin_bud_material_cost_lines);
                                })
                        })
                };

                /**
                 * 编制年度改变事件
                 */
                $scope.bud_yearChange = function () {
                    $scope.initHeader()
                        .then($scope.getFin_bud_sale_data)
                }
                /**
                 * 计算合计数据
                 */
                $scope.calSum = function () {
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            avg_material_cost: numberApi.sum($scope.data.currItem.fin_bud_material_cost_lines, 'avg_material_cost'),
                            bud_material_cost: numberApi.sum($scope.data.currItem.fin_bud_material_cost_lines, 'bud_material_cost')
                        }
                    ]);
                };


                /**
                 * 编制方式改变事件
                 */
                $scope.according_toChange = function () {
                    $scope.initHeader()
                        .then(getSalesDataLine)
                    // .then(getDeptStrategyAmt);
                }

                /**
                 * 批量导入
                 */
                $scope.copyAndAdd_line = function () {
                    var titleToField = {
                        '产品编码': 'item_code'

                    };
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

                            var lines = validLines;
                            loopApi.forLoop(lines.length, function (i) {
                                if (lines[i].fee_code && $scope.data.fees.length) {
                                    loopApi.forLoop($scope.data.fees.length, function (j) {
                                        if ($scope.data.fees[j].fee_code == lines[i].fee_code) {
                                            lines[i].fee_id = $scope.data.fees[j].fee_id;
                                            lines[i].fee_name = $scope.data.fees[j].fee_name;

                                            return requestApi.post('fin_fee_header', 'select',
                                                {fee_id: lines[i].fee_id})
                                                .then(function (response) {
                                                    lines[i].subject_id = response.subject_id;
                                                    lines[i].subject_code = response.subject_no;
                                                    lines[i].subject_name = response.subject_name;

                                                    Array.prototype.push.apply($scope.data.currItem.fin_bud_fee_lines, validLines);

                                                    $scope.calSum();

                                                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.fin_bud_fee_lines);
                                                })
                                        }
                                    })
                                }
                            });
                        })
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
