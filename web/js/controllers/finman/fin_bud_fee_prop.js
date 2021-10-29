/**
 * 费用预算编制-属性页
 * 2018-11-27
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'numberApi', 'loopApi', 'strApi',
        'swalApi', 'dateApi', 'fileApi'],
    function (module, controllerApi, base_obj_prop, requestApi, numberApi, loopApi, strApi,
              swalApi, dateApi, fileApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {

                /*-------------------数据定义开始------------------------*/
                $scope.data = {
                    fees: [],
                    is_import: false //是否导入操作，默认否
                };
                var bud_year;//编制年度

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
                                    pinned: 'left',
                                    editable: function (params) {
                                        if (numberApi.toNumber(params.data.feedata_line_id) > 0) {
                                            return false;
                                        } else {
                                            return editable(params);
                                        }
                                    },
                                    onCellDoubleClicked: function (params) {
                                        if (editable(params)) {
                                            if (numberApi.toNumber(params.data.feedata_line_id) > 0)
                                                return;
                                            $scope.chooseFee(params);
                                        }
                                    },
                                    onCellValueChanged: function (args) {
                                        if ($scope.data.is_import) return;//导入操作不执行下面语句
                                        if (!args.newValue || args.newValue === args.oldValue) {
                                            return;
                                        }
                                        var postdata = {
                                            flag: 1,
                                            sqlwhere: " object_code='" + args.data.fee_code + "'"
                                        };
                                        return $scope.getFocusedLineCrmEntname()
                                            .then(function () {
                                                return args;
                                            })
                                            .then(function (args) {
                                                return requestApi.post('fin_fee_header', 'search', postdata).then(function (res) {
                                                    if (res.fin_fee_headers.length) {
                                                        var data = res.fin_fee_headers[0];

                                                        var error = '';
                                                        var lines = angular.copy($scope.data.currItem.fin_bud_fee_lines);
                                                        lines.splice($scope.gridOptions.hcApi.getFocusedRowIndex(), 1);
                                                        lines.forEach(function (line) {
                                                            var crm_entid = args.data.crm_entid;
                                                            if (numberApi.toNumber(line.crm_entid) > 0) {
                                                                if (line.fee_code == args.data.fee_code && line.bud_type_id == data.bud_type_id && line.crm_entid == crm_entid) {
                                                                    args.data.crm_entid = 0;
                                                                    args.api.refreshView();
                                                                    return error = '明细已存在相同的费用项目【' + args.data.fee_code + '】、' +
                                                                        '预算类别【' + data.bud_type_name + '】、' +
                                                                        '品类【' + crm_entid_name + '】,不能重复添加！';
                                                                }
                                                            } else {
                                                                if (line.fee_code == args.data.fee_code && line.bud_type_id == data.bud_type_id) {
                                                                    return error = '明细已存在相同的费用项目【' + args.data.fee_code + '】、' +
                                                                        '预算类别【' + data.bud_type_name + '】,不能重复添加！';
                                                                }
                                                            }
                                                        });
                                                        if (strApi.isNotNull(error)) {
                                                            args.data.fee_code = '';
                                                            args.api.refreshView();
                                                            return swalApi.info(error);
                                                        } else {
                                                            args.data.fee_id = data.object_id;
                                                            args.data.fee_name = data.object_name;
                                                            args.data.object_type = data.object_type;

                                                            args.data.bud_type_id = data.bud_type_id;
                                                            args.data.bud_type_code = data.bud_type_code;
                                                            args.data.bud_type_name = data.bud_type_name;

                                                            args.data.subject_id = data.subject_id;
                                                            args.data.subject_code = data.subject_code;
                                                            args.data.subject_name = data.subject_name;

                                                            args.api.refreshView();
                                                        }
                                                    } else {
                                                        swalApi.info('编码【' + args.data.fee_code + '】不存在');
                                                        args.data.fee_id = 0;
                                                        args.data.fee_name = '';
                                                        args.data.fee_code = '';
                                                        return;
                                                    }
                                                });
                                            });
                                    }
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
                            hcDictCode: '*',
                            editable: function (params) {
                                if (numberApi.toNumber(params.data.feedata_line_id) > 0) {
                                    return false;
                                } else {
                                    return editable(params);
                                }
                            },
                            onCellValueChanged: function (params) {
                                $scope.getFocusedLineCrmEntname()
                                    .then(function () {
                                        var lines = angular.copy($scope.data.currItem.fin_bud_fee_lines);
                                        lines.splice($scope.gridOptions.hcApi.getFocusedRowIndex(), 1);
                                        lines.forEach(function (line) {
                                            var crm_entid = params.data.crm_entid;
                                            if (numberApi.toNumber(line.crm_entid) > 0) {
                                                if (line.fee_id == params.data.fee_id && line.bud_type_id == params.data.bud_type_id && line.crm_entid == crm_entid) {
                                                    params.data.crm_entid = 0;
                                                    params.api.refreshView();
                                                    return swalApi.info('明细已存在相同的费用项目【' + params.data.fee_code + '】、' +
                                                        '预算类别【' + params.data.bud_type_name + '】、' +
                                                        '品类【' + crm_entid_name + '】,不能重复添加！');
                                                }
                                            } else {
                                                if (line.fee_id == params.data.fee_id && line.bud_type_id == params.data.bud_type_id) {
                                                    return swalApi.info('明细已存在相同的费用项目【' + params.data.fee_code + '】、' +
                                                        '预算类别【' + params.data.bud_type_name + '】,不能重复添加！');
                                                }
                                            }
                                        });
                                    });
                            }
                        }
                        , {
                            headerName: '',
                            children: [
                                {
                                    field: 'tyear_feebud_amt',
                                    headerName: '费用金额',
                                    type: '金额'
                                },
                                {
                                    field: 'tyear_feebud_rate',
                                    headerName: '费用率',
                                    type: '百分比'
                                }
                            ]
                        }
                        , {
                            headerName: '',
                            children: [
                                {
                                    field: 'bud_fee_amt',
                                    headerName: '费用金额',
                                    type: '金额',
                                    editable: function (params) {
                                        return editable(params)
                                    },
                                    onCellValueChanged: function (params) {
                                        if (params.newValue == params.oldValue) {
                                            return;
                                        }
                                        var bud_fee_amt = numberApi.toNumber(params.data.bud_fee_amt);
                                        var tyear_feebud_amt = numberApi.toNumber(params.data.tyear_feebud_amt);
                                        var tyear_feebud_rate = numberApi.toNumber(params.data.tyear_feebud_rate);
                                        var comp_budyear_salesamt = numberApi.toNumber($scope.data.currItem.comp_budyear_salesamt);

                                        //计算费用率(费用金额/本部门目标销售收入)
                                        params.data.bud_fee_rate = numberApi.divide(bud_fee_amt, comp_budyear_salesamt);

                                        //计算同比增长率:
                                        //费用金额：(预算费用金额(费用金额)-本年费用预计总额(费用金额))/本年费用预计总额(费用金额)
                                        //费用率：(预算费用金额(费用率)-本年费用预计总额(费用率))/本年费用预计总额(费用率)
                                        params.data.fee_growth_amt = numberApi.divide(numberApi.sub(bud_fee_amt, tyear_feebud_amt), tyear_feebud_amt);
                                        params.data.fee_growth_rate = numberApi.divide(numberApi.sub(params.data.bud_fee_rate, tyear_feebud_rate), tyear_feebud_rate);

                                        $scope.calSum();
                                        params.api.refreshView();

                                    }
                                },
                                {
                                    field: 'bud_fee_rate',
                                    headerName: '费用率',
                                    type: '百分比'
                                }
                            ]
                        }
                        , {
                            headerName: '同比增长率',
                            children: [
                                {
                                    field: 'fee_growth_amt',
                                    headerName: '费用金额',
                                    type: '百分比'
                                },
                                {
                                    field: 'fee_growth_rate',
                                    headerName: '费用率',
                                    type: '百分比'
                                }
                            ]
                        }
                        , {
                            field: 'note',
                            headerName: '编制依据(说明)',
                            hcRequired: true,
                            editable: function (params) {
                                return editable(params)
                            }
                        }
                    ]
                };

                /*-------------------数据定义结束------------------------*/

                /*-------------------通用查询开始------------------------*/

                $scope.commonSearchSetting = {
                    bud_type: {
                        afterOk: function (response) {
                            if (response.bud_type_id != $scope.data.currItem.bud_type_id && $scope.data.currItem.fin_bud_fee_lines.length) {
                                //清空明细的费用项目及相关信息
                                loopApi.forLoop($scope.data.currItem.fin_bud_fee_lines.length, function (i) {
                                    $scope.data.currItem.fin_bud_fee_lines[i].fee_id = 0;
                                    $scope.data.currItem.fin_bud_fee_lines[i].fee_code = '';
                                    $scope.data.currItem.fin_bud_fee_lines[i].fee_name = '';
                                    $scope.data.currItem.fin_bud_fee_lines[i].object_type = '';
                                    $scope.data.currItem.fin_bud_fee_lines[i].subject_id = 0;
                                    $scope.data.currItem.fin_bud_fee_lines[i].subject_code = '';
                                    $scope.data.currItem.fin_bud_fee_lines[i].subject_name = '';
                                });
                                $scope.gridOptions.hcApi.setRowData($scope.data.currItem.fin_bud_fee_lines);
                            }
                            $scope.data.currItem.bud_type_code = response.bud_type_code;
                            $scope.data.currItem.bud_type_name = response.bud_type_name;
                            $scope.data.currItem.bud_type_id = response.bud_type_id;

                            $scope.data.currItem.period_type = response.period_type;

                            //查预算类别下的费用项目，备用于导入明细时查费用项目id
                            return requestApi.post('fin_bud_type_line_obj', 'search', {
                                bud_type_id: $scope.data.currItem.bud_type_id,
                                flag: 2
                            }).then(function (data) {
                                $scope.data.fees = data.fin_bud_type_line_objs;

                                $scope.getSalesInfo();
                            });
                        }
                    },
                    dept: {
                        sqlWhere: ' isfeecenter = 2',//成本费用中心：是
                        afterOk: function (response) {
                            $scope.data.currItem.org_id = response.dept_id;
                            $scope.data.currItem.org_code = response.dept_code;
                            $scope.data.currItem.org_name = response.dept_name;

                            $scope.getSalesInfo();
                        }
                    }
                };

                /**
                 * 查询费用项目
                 */
                $scope.chooseFee = function (args) {
                    $modal.openCommonSearch({
                            classId: 'fin_fee_header',
                            postData: {flag: 1},
                            action: 'search',
                            title: "费用类别/项目",
                            gridOptions: {
                                columnDefs: [{
                                    headerName: "费用类别/项目编码",
                                    field: "object_code"
                                }, {
                                    headerName: "费用类别/项目名称",
                                    field: "object_name"
                                }, {
                                    headerName: "对象类型",
                                    field: "object_type_name"
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
                            return $scope.getFocusedLineCrmEntname().then(function () {
                                return response;
                            });
                        })
                        .then(function (response) {
                            var flag = true;
                            var error = '';
                            var lines = angular.copy($scope.data.currItem.fin_bud_fee_lines);
                            lines.splice($scope.gridOptions.hcApi.getFocusedRowIndex(), 1);
                            lines.forEach(function (line) {
                                var crm_entid = $scope.gridOptions.hcApi.getFocusedData().crm_entid;
                                if (numberApi.toNumber(line.crm_entid) > 0) {
                                    if (line.fee_id == response.object_id && line.bud_type_id == response.bud_type_id && line.crm_entid == crm_entid) {
                                        error = '明细已存在相同的费用项目【' + response.object_code + '】、' +
                                            '预算类别【' + response.bud_type_name + '】、' +
                                            '品类【' + crm_entid_name + '】,不能重复添加！';
                                        return flag = false;
                                    }
                                } else {
                                    if (line.fee_id == response.object_id && line.bud_type_id == response.bud_type_id) {
                                        error = '明细已存在相同的费用项目【' + response.object_code + '】、' +
                                            '预算类别【' + response.bud_type_name + '】,不能重复添加！';
                                        return flag = false;
                                    }
                                }
                            });
                            if (!flag) {
                                return swalApi.info(error);
                            } else {
                                args.data.fee_id = response.object_id;
                                args.data.fee_code = response.object_code;
                                args.data.fee_name = response.object_name;
                                args.data.object_type = response.object_type;

                                args.data.bud_type_id = response.bud_type_id;
                                args.data.bud_type_code = response.bud_type_code;
                                args.data.bud_type_name = response.bud_type_name;

                                args.data.subject_id = response.subject_id;
                                args.data.subject_code = response.subject_code;
                                args.data.subject_name = response.subject_name;

                                args.api.refreshView();
                            }
                        })
                };
                /*-------------------通用查询结束---------------------*/


                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //获取当前焦点行品类名称
                var crm_entid_name;
                $scope.getFocusedLineCrmEntname = function () {
                    var crm_entid = $scope.gridOptions.hcApi.getFocusedData().crm_entid;
                    crm_entid_name = '';
                    return requestApi.getDict('crm_entid')
                        .then(function (dicts) {
                            dicts.forEach(function (dict) {
                                if (dict.dictvalue == crm_entid) {
                                    return crm_entid_name = dict.dictname;
                                }
                            })
                        });
                };

                /**
                 * 新增时数据
                 * @param bizData
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);

                    bizData.bud_year = new Date().getFullYear() + 1;
                    bizData.create_time = dateApi.now();

                    bizData.fin_bud_fee_lines = [];

                    bud_year = bizData.bud_year;

                    $scope.getSalesInfo();
                };


                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);

                    bud_year = bizData.bud_year;

                    $scope.gridOptions.hcApi.setRowData(bizData.fin_bud_fee_lines);

                    $scope.calSum();
                };

                /**
                 * 保存前验证
                 */
                $scope.validCheck = function (validBox) {
                    $scope.hcSuper.validCheck(validBox);

                    //检查是否有费用项目id
                    if ($scope.data.currItem.fin_bud_fee_lines.length) {
                        loopApi.forLoop($scope.data.currItem.fin_bud_fee_lines.length, function (i) {
                            if (!$scope.data.currItem.fin_bud_fee_lines[i].fee_id) {
                                validBox.push('第' + (i + 1) + '行费用项目不可用，请重新选择');
                            }
                        });
                    }
                };

                /**
                 * 删除预算类别/年度/部门之后做的事
                 * 1.若明细原本是由历史数据带出，则清空由历史数据带出的明细
                 * 2.若不是，删除预算类别时，则明细的费用项目及其相关信息清空
                 */
                $scope.doAfterDelete = function (type) {
                    var budLines = $scope.data.currItem.fin_bud_fee_lines.slice(0);
                    if (budLines.length) {
                        loopApi.forLoop(budLines.length, function (i) {
                            var feedata_line_id = numberApi.toNumber(budLines[i].feedata_line_id);
                            if (feedata_line_id > 0) {
                                delete budLines[i];
                            } else if ('bud_type' === type) {
                                budLines[i].fee_id = 0;
                                budLines[i].fee_code = '';
                                budLines[i].fee_name = '';
                                budLines[i].object_type = '';
                                budLines[i].subject_id = 0;
                                budLines[i].subject_code = '';
                                budLines[i].subject_name = '';
                            }
                            $scope.gridOptions.hcApi.setRowData(budLines);
                        });

                    }
                };


                /**
                 * 获取销售相关数据（从别的表取）
                 */
                $scope.getSalesInfo = function (name) {
                    $scope.data.currItem.total_bud_fee_amt = 0;
                    if ('bud_year' === name) {
                        bud_year = $scope.data.currItem.bud_year;
                        $scope.setGridHeaderName();
                    }
                    var postdata = {
                        bud_year: $scope.data.currItem.bud_year,
                        org_id: $scope.data.currItem.org_id,
                        bud_type_id: $scope.data.currItem.bud_type_id,
                        period_type: $scope.data.currItem.period_type
                    };

                    if ($scope.data.currItem.bud_year && $scope.data.currItem.org_id) {
                        return requestApi.post('fin_bud_fee_head', 'getsalesinfo', postdata)
                            .then(function (response) {
                                //取公司预算年度销售收入（条件：年度）
                                $scope.data.currItem.comp_budyear_salesamt = response.comp_budyear_salesamt;

                                //取部门目标销售收入、部门销售增长率（条件：年度、部门）
                                if ($scope.data.currItem.org_id > 0) {
                                    $scope.data.currItem.target_salesamt = response.target_salesamt;
                                    $scope.data.currItem.growth_rate = response.growth_rate;

                                    //明细
                                    $scope.data.currItem.fin_bud_fee_lines = response.fin_bud_fee_lines;

                                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.fin_bud_fee_lines);

                                    $scope.calSum();
                                } else {
                                    $scope.data.currItem.target_salesamt = 0;
                                    $scope.data.currItem.growth_rate = 0;
                                }

                            });
                    } else {
                        $scope.data.currItem.comp_budyear_salesamt = 0;
                        $scope.data.currItem.target_salesamt = 0;
                        $scope.data.currItem.growth_rate = 0;
                    }

                };

                /**
                 * 计算合计数据
                 */
                $scope.calSum = function () {
                    var amt = numberApi.sum($scope.data.currItem.fin_bud_fee_lines, 'bud_fee_amt');
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            // tyear_feebud_amt: numberApi.sum($scope.data.currItem.fin_bud_fee_lines, 'tyear_feebud_amt'),
                            bud_fee_amt: amt,
                            bud_fee_rate: numberApi.divide(amt, $scope.data.currItem.comp_budyear_salesamt)
                        }
                    ]);

                    //计算总费用预算
                    $scope.data.currItem.total_bud_fee_amt = numberApi.sum($scope.data.currItem.fin_bud_fee_lines, 'bud_fee_amt');
                };


                /**
                 * 初始化
                 */
                $scope.doInit = function () {
                    $scope.hcSuper.doInit()
                        .then(function () {
                            //查预算类别下的费用项目，备用于导入明细时查费用项目id
                            if ($scope.data.currItem.bud_type_id) {
                                return requestApi.post('fin_bud_type_line_obj', 'search', {
                                    bud_type_id: $scope.data.currItem.bud_type_id,
                                    flag: 2
                                })
                            }
                        })
                        .then(function (data) {
                            if (data)
                                $scope.data.fees = data.fin_bud_type_line_objs;

                            $scope.setGridHeaderName();
                        })
                };

                /**
                 * 设置表头名
                 */
                $scope.setGridHeaderName = function () {
                    $scope.gridOptions.columnDefs[$scope.getIdxByField('tyear_feebud_amt')].headerName
                        = "本年(" + (bud_year - 1) + ")费用预计总额";

                    $scope.gridOptions.columnDefs[$scope.getIdxByField('bud_fee_amt')].headerName
                        = bud_year + "年费用预算";

                    $scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);
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
                 * 增加行
                 */
                $scope.add_line = function () {
                    $scope.data.is_import = false;

                    $scope.gridOptions.api.stopEditing();
                    $scope.data.currItem.fin_bud_fee_lines.push({});

                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.fin_bud_fee_lines);
                };

                /**
                 * 删除行
                 */
                $scope.del_line = function () {
                    var node = $scope.gridOptions.hcApi.getFocusedNode();
                    if (!node) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();

                        $scope.data.currItem.fin_bud_fee_lines.splice(idx, 1);

                        $scope.calSum();

                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.fin_bud_fee_lines);
                    }
                };

                /**
                 * 批量导入
                 */
                $scope.batchImport = function () {
                    $scope.data.is_import = true;
                    var titleToField = {
                        '费用项目编码': 'fee_code',
                        '编制依据(说明)': 'note'
                    };
                    titleToField[bud_year + '年费用金额'] = 'bud_fee_amt';

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

                            //根据费用项目编码查id和会计科目
                            var lines = validLines;
                            loopApi.forLoop(lines.length, function (i) {
                                if (lines[i].fee_code && $scope.data.fees.length) {
                                    loopApi.forLoop($scope.data.fees.length, function (j) {
                                        if ($scope.data.fees[j].fee_code == lines[i].fee_code) {
                                            lines[i].fee_id = $scope.data.fees[j].fee_id;
                                            lines[i].fee_name = $scope.data.fees[j].fee_name;

                                            lines[i].subject_id = $scope.data.fees[j].subject_id;
                                            lines[i].subject_code = $scope.data.fees[j].subject_no;
                                            lines[i].subject_name = $scope.data.fees[j].subject_name;

                                            return true;
                                        }
                                    })
                                }
                            });

                            Array.prototype.push.apply($scope.data.currItem.fin_bud_fee_lines, lines);

                            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.fin_bud_fee_lines);

                            return $scope.data.currItem.fin_bud_fee_lines;
                        })
                        .then($scope.calSum)
                        .then(function () {
                            $scope.data.is_import = false;
                        })
                };

                /**
                 * 标签页
                 */
                $scope.tabs.attach.hide = true;

                //底部左边按钮
                $scope.footerLeftButtons.add_line = {
                    icon: 'fa fa-plus',
                    click: function () {
                        $scope.add_line && $scope.add_line();
                    },
                    hide: function () {
                        return $scope.data.currItem.stat >= 5;
                    }
                };
                $scope.footerLeftButtons.del_line = {
                    icon: 'fa fa-minus',
                    click: function () {
                        $scope.del_line && $scope.del_line();
                    },
                    hide: function () {
                        return $scope.data.currItem.stat >= 5;
                    }
                };
                $scope.footerLeftButtons.batchImport = {
                    title: '批量导入',
                    click: function () {
                        $scope.batchImport && $scope.batchImport();
                    },
                    hide: function () {
                        return $scope.data.currItem.stat >= 5;
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
