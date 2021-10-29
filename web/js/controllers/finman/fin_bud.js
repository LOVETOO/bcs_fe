/**
 * 预算编制
 *  2018-11-12
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'openBizObj', 'requestApi', 'promiseApi', 'swalApi'],
    function (module, controllerApi, base_diy_page, openBizObj, requestApi, promiseApi, swalApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {
                var active;
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.object_ids = [];
                $scope.sumcolumn = {
                    dname: '合计',
                    usable: ""
                };
                var isDept = false;
                //初始化默认给值
                $scope.load = function () {
                    $scope.data.currItem.bud_year = new Date().getFullYear();
                }
                //主页面的表列数据
                $scope.gridOptions1 = {
                    columnDefs: [{
                        headerName: "机构编码",
                        field: "dept_code",
                        suppressAutoSize: true,
                        width: 100
                    }, {
                        headerName: "机构名称",
                        field: "dept_name",
                        suppressAutoSize: true,
                        width: 120
                    }]
                };
                $scope.gridOptions1.rowData = [];

                $scope.gridOptions2 = {
                    columnDefs: [{
                        headerName: "预算期间",
                        field: "dname",
                        suppressAutoSize: true,
                        width: 116
                    }, {
                        headerName: "年初预算",
                        field: "bud_amt",
                        type: "金额"/*,
                         editable: function (param) {
                         if (param.data.usable == 2 && parseInt($scope.data.fee_property) == 2) {
                         return true;
                         }
                         return false
                         }*/
                    }, {
                        headerName: "上期结转金额",
                        field: "last_settle_amt",
                        type: "金额",
                        suppressAutoSize: true,
                        width: 116
                    }, {
                        headerName: "本期调整金额",
                        field: "adjust_amt",
                        type: "金额",
                        suppressAutoSize: true,
                        width: 116
                    }, {
                        headerName: "本期已占用金额",
                        field: "keeped_amt",
                        type: "金额",
                        suppressAutoSize: true,
                        width: 125
                    }, {
                        headerName: "本期已使用金额",
                        field: "used_amt",
                        type: "金额",
                        suppressAutoSize: true,
                        width: 125
                    }, {
                        headerName: "本期可使用的金额",
                        field: "canuse_amt",
                        type: "金额",
                        suppressAutoSize: true,
                        width: 142
                    }, {
                        headerName: "本期可结转金额",
                        field: "settle_amt",
                        type: "金额",
                        suppressAutoSize: true,
                        width: 125
                    }, {
                        headerName: "已结转",
                        field: "usable",
                        type: '词汇',
                        cellEditorParams: {
                            names: ['是', '否'],
                            values: [1, 2]
                        }
                    }]
                };
                $scope.gridOptions2.rowData = [];

                /**
                 * 根据预算类别变更右边表显示列
                 */
                $scope.changeGrid2Header = function () {
                    $scope.data.fee_property = parseInt($scope.data.fee_property);//1:变动 2固定
                    $scope.gridOptions2.columnDefs[1].headerName = $scope.data.fee_property == 1 ? "初始预算" : "年初预算";
                    $scope.gridOptions2.api.setColumnDefs($scope.gridOptions2.columnDefs);
                    if ($scope.data.fee_property == 1)//当预算类别的费用类型为“变动费用”时，隐藏“上期结转金额、本期可结转金额、是否结转”；
                        $scope.gridOptions2.columnApi.setColumnsVisible(["last_settle_amt", "settle_amt", "usable"], false);
                    else
                        $scope.gridOptions2.columnApi.setColumnsVisible(["last_settle_amt", "settle_amt", "usable"], true);
                }


                //继承主控制器    
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                $scope.toolButtons = {
                    refresh: {
                        title: '刷新',
                        icon: 'fa fa-refresh',
                        click: function () {
                            $scope.refresh && $scope.refresh();
                        }
                    },
                    save: {
                        title: '保存',
                        icon: 'fa fa-save',
                        click: function () {
                            $scope.save && $scope.save();
                        },
                        hide: function () {
                            return parseInt($scope.data.fee_property) == 1
                        }
                    },
                    downloadImportFormat: {
                        title: '下载导入格式',
                        icon: 'fa fa-plus-square-o',
                        click: function () {
                            $scope.downloadImportFormat && $scope.downloadImportFormat();
                        }
                    },
                    import: {
                        title: '导入',
                        icon: 'glyphicon glyphicon-log-in',
                        click: function () {
                            $scope.import && $scope.import();
                        }
                    },
                    export: {
                        title: '导出',
                        icon: 'glyphicon glyphicon-log-out',
                        click: function () {
                            $scope.export && $scope.export();
                        }
                    }
                };
                //刷新
                $scope.refresh = function () {
                    $scope.gridOptions1.onRowDoubleClicked();
                };

                //页面-预算类别查询
                $scope.viewTypeSearch = function () {
                    $modal.openCommonSearch({
                            classId: 'fin_bud_type_header',
                            postData: {},
                            sqlWhere: " Fin_Bud_Type_Header.Usable=2 and Fin_Bud_Type_Header.Org_Level<>5 ",
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
                                    headerName: "费用层级",
                                    field: "fee_type_level"
                                }, {
                                    headerName: "预算期间类别",
                                    field: "period_type",
                                    dicts: $scope.period_types,
                                    type: "list"
                                }, {
                                    headerName: "描述",
                                    field: "description"
                                }]
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            $scope.data.bud_type_id = result.bud_type_id;
                            $scope.data.period_type = result.period_type;
                            $scope.data.fee_property = result.fee_property;
                            $scope.changeGrid2Header();

                            //执行$watch要放在objec_id查询之后
                            // $scope.data.currItem.bud_type_code = result.bud_type_code;
                            $scope.data.currItem.bud_type_name = result.bud_type_name;

                            requestApi.post(
                                "fin_bud_type_header", "select", {
                                    "bud_type_id": $scope.data.bud_type_id
                                }
                            ).then(function (result) {
                                var arr = result.fin_bud_type_lineoffin_bud_type_headers.map(function (data) {
                                    return {
                                        name: data.object_name,
                                        value: data.object_id,
                                        data: data
                                    }
                                });

                                $scope.object_ids.splice(0);
                                $.each(arr, function (i, item) {
                                    $scope.object_ids[i] = {
                                        name: item.name,
                                        value: item.value,
                                        data: item.data
                                    };
                                });

                                $scope.data.currItem.object_id = 0;

                                //执行$watch  在数组中的bud_type_code都一样
                                $scope.data.currItem.bud_type_code = result.fin_bud_type_lineoffin_bud_type_headers[0].bud_type_code;

                            });
                        });
                };

                //页面-费用类别/项目类别查询
                $scope.FeeTypeSearch = function () {
                    $modal.openCommonSearch({
                            classId: 'fin_bud_type_line_obj',
                            postData: {
                                "bud_type_id": $scope.data.bud_type_id,
                                "flag": 2
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            $scope.data.currItem.object_id = result.fee_id;
                            $scope.data.currItem.object_code = result.fee_code;
                            $scope.data.currItem.object_name = result.fee_name;
                            $scope.refresh();
                        });
                };

                //查询机构
                //查询deptGrid
                function deptSearch() {
                    //判断是否为第一次加载
                    if (isDept) {
                        return;
                    }
                    isDept = true;

                    //查询机构
                    requestApi.post("dept", "search", {sqlwhere: " isfeecenter = 2 "})
                        .then(function (result) {
                            //清空网格
                            $scope.gridOptions1.api.setRowData([]);
                            //设置数据
                            $scope.gridOptions1.api.setRowData(result.depts);
                            $scope.gridOptions1.hcApi.setFocusedCell(0, 'dept_code');

                        });
                }

                //双击左边表格
                $scope.gridOptions1.onRowDoubleClicked = function () {
                    var info = [];
                    if (!$scope.data.currItem.object_id) {
                        info.push('费用项目');
                    }
                    // if (!$scope.data.currItem.entorgid) {
                    //     $scope.data.currItem.entorgid = 0;
                    // }
                    var sqlwhere = " Fin_Bud.Bud_Year=" + $scope.data.currItem.bud_year +
                        " and Fin_Bud.bud_type_id=" + $scope.data.bud_type_id +
                        " and Fin_Bud.Item_Type_Id=0 " +
                        " and Fin_Bud.Object_Id=" + $scope.data.currItem.object_id  //查费用项目
                    // +" and entorgid = " + $scope.data.currItem.entorgid;

                    if ($scope.data.currItem.crm_entid && parseInt($scope.data.currItem.crm_entid) != 99) { //查所有品类
                        sqlwhere += " and crm_entid = " + $scope.data.currItem.crm_entid;
                    }

                    if (info.length) {
                        info.unshift('请选择以下查询条件：');
                        return swalApi.info(info);
                    }
                    var a = $scope.gridOptions1.hcApi.getFocusedData();
                    $scope.data.org_id = a.dept_id;
                    $scope.data.org_code = a.dept_code;
                    $scope.data.org_name = a.dept_name;

                    sqlwhere += " and Fin_Bud.Org_Id=" + a.dept_id;

                    requestApi.post("fin_bud", "search", {
                            "sqlwhere": sqlwhere
                        })
                        .then(function (result) {
                            console.log("查询结果", result);
                            if (result.fin_buds.length != 0) {

                                if (result.hascrment == 2 && !$scope.data.currItem.crm_entid) {
                                    swalApi.info('该预算存在多个品类，请选择品类');
                                    return;
                                }
                                $scope.setNewData(result.fin_buds);
                                active = "update";
                            } else {
                                requestApi.post("fin_bud_period_header", "search", {
                                        "sqlwhere": " Fin_Bud_Period_Header.Period_Year=" + $scope.data.currItem.bud_year +
                                        " and Fin_Bud_Period_Header.Period_Type=" + $scope.data.period_type
                                    })
                                    .then(function (result) {
                                        if (result.fin_bud_period_headers.length == 0) {
                                            $scope.gridOptions1.api.setRowData([]);
                                            return swalApi.info('未查询到符合条件的预算期间').then($q.reject);
                                        }
                                        requestApi.post("fin_bud_period_header", "select", {
                                                "period_id": result.fin_bud_period_headers[0].period_id
                                            })
                                            .then(function (result) {
                                                $scope.setNewData(result.fin_bud_period_lineoffin_bud_period_headers)
                                                active = "insert";
                                            });
                                    });
                            }
                        });
                };
                //把数据插入到表
                $scope.setNewData = function (result) {
                    //合计置零
                    $scope.sumcolumn.bud_amt = 0;
                    $scope.sumcolumn.last_settle_amt = 0;
                    $scope.sumcolumn.adjust_amt = 0;
                    $scope.sumcolumn.keeped_amt = 0;
                    $scope.sumcolumn.used_amt = 0;
                    $scope.sumcolumn.canuse_amt = 0;
                    $scope.sumcolumn.amiss_amt = 0;
                    $scope.sumcolumn.settle_amt = 0;

                    var data = result.map(function (data) {
                        if (!data.bud_amt) {
                            data.bud_amt = 0;
                        }
                        if (!data.last_settle_amt) {
                            data.last_settle_amt = 0;
                        }
                        if (!data.adjust_amt) {
                            data.adjust_amt = 0;
                        }
                        if (!data.keeped_amt) {
                            data.keeped_amt = 0;
                        }
                        if (!data.used_amt) {
                            data.used_amt = 0;
                        }
                        if (!data.canuse_amt) {
                            data.canuse_amt = 0;
                        }
                        if (!data.amiss_amt) {
                            data.amiss_amt = 0;
                        }
                        if (!data.settle_amt) {
                            data.settle_amt = 0;
                        }
                        if (data.usable == 0) {
                            data.usable = "2";
                        }
                        //转为数字格式
                        data.bud_amt = Number(data.bud_amt);
                        data.last_settle_amt = Number(data.last_settle_amt);
                        data.adjust_amt = Number(data.adjust_amt);
                        data.keeped_amt = Number(data.keeped_amt);
                        data.used_amt = Number(data.used_amt);
                        data.canuse_amt = Number(data.canuse_amt);
                        data.amiss_amt = Number(data.amiss_amt);
                        data.settle_amt = Number(data.settle_amt);

                        //合计
                        $scope.sumcolumn.bud_amt += data.bud_amt;
                        $scope.sumcolumn.last_settle_amt += data.last_settle_amt;
                        $scope.sumcolumn.adjust_amt += data.adjust_amt;
                        $scope.sumcolumn.keeped_amt += data.keeped_amt;
                        $scope.sumcolumn.used_amt += data.used_amt;
                        $scope.sumcolumn.canuse_amt += data.canuse_amt;
                        $scope.sumcolumn.amiss_amt += data.amiss_amt;
                        $scope.sumcolumn.settle_amt += data.settle_amt;
                        return data;
                    });
                    data.push($scope.sumcolumn);
                    $scope.gridOptions2.api.setRowData([]);
                    $scope.gridOptions2.api.setRowData(data);
                };
                //表格编辑后更新表格
                $scope.gridOptions2.onCellValueChanged = function (a) {
                    console.log("ces a", a);
                    console.log("表格数据", $scope.gridOptions2.hcApi.getRowData());
                    var arr = $scope.gridOptions2.hcApi.getRowData();
                    var row = arr[a.rowIndex];
                    //设置期初=实际,使差额始终=0
                    row.bud_amt = Number(row.bud_amt);
                    row.fact_amt = row.bud_amt;

                    //修改年初预算bud_amt
                    //本期可使用金额= 上期结转金额+年初本期预算+本期调整-本期已使用-本期已保留
                    row.canuse_amt = row.last_settle_amt + row.bud_amt + row.adjust_amt - row.keeped_amt - row.used_amt;
                    //修改本期实际预算fact_amt
                    //本期实际与年度预算的差额=本期实际预算-年初预算
                    row.amiss_amt = row.fact_amt - row.bud_amt;

                    //本期可结转金额=本期可使用的金额+差额
                    row.settle_amt = row.canuse_amt + row.amiss_amt;
                    //删除最后一行
                    arr.splice(arr.length - 1, 1);
                    //重新合计
                    $scope.sumcolumn.bud_amt = 0;
                    $scope.sumcolumn.last_settle_amt = 0;
                    $scope.sumcolumn.adjust_amt = 0;
                    $scope.sumcolumn.keeped_amt = 0;
                    $scope.sumcolumn.used_amt = 0;
                    $scope.sumcolumn.canuse_amt = 0;
                    $scope.sumcolumn.amiss_amt = 0;
                    $scope.sumcolumn.settle_amt = 0;
                    arr.map(function (data) {
                        $scope.sumcolumn.bud_amt += data.bud_amt;
                        $scope.sumcolumn.last_settle_amt += data.last_settle_amt;
                        $scope.sumcolumn.adjust_amt += data.adjust_amt;
                        $scope.sumcolumn.keeped_amt += data.keeped_amt;
                        $scope.sumcolumn.used_amt += data.used_amt;
                        $scope.sumcolumn.canuse_amt += data.canuse_amt;
                        $scope.sumcolumn.amiss_amt += data.amiss_amt;
                        $scope.sumcolumn.settle_amt += data.settle_amt;
                    });
                    arr.push($scope.sumcolumn);
                    $scope.gridOptions2.api.setRowData([]);
                    $scope.gridOptions2.api.setRowData(arr);
                };


                //保存按钮
                $scope.save = function () {
                    if (active == "") {
                        return swalApi.info('请先选择预算').then($q.reject);
                    }
                    var data = {
                        "bud_year": $scope.data.currItem.bud_year,
                        "bud_type_id": $scope.data.bud_type_id,
                        "bud_type_code": $scope.data.currItem.bud_type_code,
                        "bud_type_name": $scope.data.currItem.bud_type_name,
                        "period_type": $scope.data.period_type,
                        "object_type": $scope.data.currItem.object_type,
                        "object_id": $scope.data.currItem.object_id,
                        "object_code": $scope.data.currItem.object_code,
                        "object_name": $scope.data.currItem.object_name,
                        "org_id": $scope.data.org_id,
                        "org_code": $scope.data.org_code,
                        "org_name": $scope.data.org_name,
                        "crm_entid": $scope.data.currItem.crm_entid,
                        // "entorgid": $scope.data.currItem.entorgid
                    };
                    data.fin_budoffin_buds = $scope.gridOptions2.hcApi.getRowData().map(function (data) {
                        data.bud_year = $scope.data.currItem.bud_year;
                        data.bud_type_id = $scope.data.bud_type_id;
                        data.bud_type_code = $scope.data.currItem.bud_type_code;
                        data.bud_type_name = $scope.data.currItem.bud_type_name;
                        data.period_type = $scope.data.period_type;
                        data.org_id = $scope.data.org_id;
                        data.org_code = $scope.data.org_code;
                        data.org_name = $scope.data.org_name;
                        data.crm_entid = $scope.data.currItem.crm_entid;
                        // data.entorgid = $scope.data.currItem.entorgid;
                        if (active == "update") {
                            data.bud_id = data.bud_id;
                        }

                        $.each($scope.object_ids, function (i, item) {
                            if ($scope.data.currItem.object_id == item.value) {
                                data.object_id = item.data.object_id;
                                data.object_type = item.data.object_type;
                                data.object_code = item.data.object_code;
                                data.object_name = item.data.object_name;
                            }
                        });
                        return data;
                    });
                    data.fin_budoffin_buds.splice(data.fin_budoffin_buds.length - 1, 1);
                    requestApi.post("fin_bud", "batchupdate", JSON.stringify(data))
                        .then(function (result) {
                            if (result.fin_budoffin_buds.length != 0) {

                                swalApi.success("成功", "保存成功", function () {
                                    var sqlwhere = {
                                        "sqlwhere": " Fin_Bud.Bud_Year=" + $scope.data.currItem.bud_year +
                                        " and Fin_Bud.bud_type_id=" + $scope.data.bud_type_id +
                                        " and Fin_Bud.Item_Type_Id=0 and Fin_Bud.Object_Id=" + $scope.data.currItem.object_id +
                                        " and Fin_Bud.Org_Id=" + $scope.data.org_id
                                    };
                                    requestApi.post("fin_bud", "search", JSON.stringify(sqlwhere))
                                        .then(function (result) {
                                            $scope.setNewData(result.fin_buds);
                                            active = "insert";
                                        });
                                });
                            } else {
                                $scope.gridOptions1.onRowDoubleClicked();
                                return swalApi.info('失败').then($q.reject);
                            }
                        });
                };

                $scope.yearChange = function () {
                    if ($scope.data.currItem.object_id) {
                        $scope.refresh();
                    }
                }
                deptSearch();
                /**======================onchange事件=========================== **/

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