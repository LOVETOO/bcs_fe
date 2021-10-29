/**
 * 战略目标分解-详情页
 * date:2018-11-26
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', '$stateParams', 'BasemanService',
            //控制器函数
            function ($scope, $stateParams, BasemanService) {
                /**数据定义 */
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'org_name',
                        headerName: '部门',
                        width: 150
                    }, {
                        field: 'sales_amt',
                        headerName: '销售收入目标',
                        width: 150,
                        type: '金额'
                    }, {
                        field: 'profit_amt',
                        headerName: '利润目标',
                        width: 150,
                        type: '金额'
                    }, {
                        field: 'note',
                        headerName: '说明',
                        width: 300
                    }],
                    defaultColDef: {
                        editable: true
                    }
                };
                /**通用查询 */

                /**继承主控制器 */
                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                //更改标题
                $scope.tabs.base.title = "战略目标分解";
                //隐藏标签
                $scope.tabs.attach.hide = true;
                $scope.tabs.wf.hide = true;

                //左下按钮
                $scope.footerLeftButtons.add_line = {
                    title: '增加行',
                    click: function () {
                        $scope.add_line && $scope.add_line();
                    }
                };
                $scope.footerLeftButtons.del_line = {
                    title: '删除行',
                    click: function () {
                        $scope.del_line && $scope.del_line();
                    }
                };
                $scope.data.flag = $stateParams.isresolve;
                $scope.footerLeftButtons.add_line.hide = function () {
                    if ($scope.data.flag == 1) {
                        return true;
                    } else
                        return false;
                };
                $scope.footerLeftButtons.del_line.hide = function () {
                    if ($scope.data.flag == 1) {
                        return true;
                    } else
                        return false;
                };
                //增加行
                $scope.add_line = function () {
                    // console.log("获取的参数",$stateParams.isresolve);
                    var rowData = $scope.gridOptions.hcApi.getRowData();
                    rowData.splice(rowData.length - 1, 1);
                    rowData.push({});
                    var salesdata = 0;
                    var profitdata = 0;
                    rowData.forEach(function (data) {
                        if (!data.sales_amt) {
                            data.sales_amt = 0;
                        };
                        if (!data.profit_amt) {
                            data.profit_amt = 0;
                        };
                        salesdata += Number(data.sales_amt);
                        profitdata += Number(data.profit_amt);
                    });
                    rowData.push({
                        org_name: "合计",
                        sales_amt: salesdata,
                        profit_amt: profitdata
                    });
                    $scope.gridOptions.hcApi.setRowData(rowData);
                }
                //表格退出编辑事件
                $scope.gridOptions.onCellValueChanged = function (a) {
                    //合计
                    var rowData = $scope.gridOptions.hcApi.getRowData();
                    rowData.splice(rowData.length - 1, 1);
                    var salesdata = 0;
                    var profitdata = 0;
                    rowData.forEach(function (data) {
                        salesdata += Number(data.sales_amt);
                        profitdata += Number(data.profit_amt);
                    });
                    rowData.push({
                        org_name: "合计",
                        sales_amt: salesdata,
                        profit_amt: profitdata
                    });
                    $scope.gridOptions.hcApi.setRowData(rowData);
                };
                //删除行
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

                        },
                        okTitle: '删除成功'
                    });
                }
                //设置表格数据
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData)
                    //合计
                    var salesdata = 0;
                    var profitdata = 0;
                    bizData.fin_stratetarget_exps.forEach(function (data) {
                        salesdata += Number(data.sales_amt);
                        profitdata += Number(data.profit_amt);
                    })
                    bizData.fin_stratetarget_exps.push({
                        org_name: "合计",
                        sales_amt: salesdata,
                        profit_amt: profitdata
                    })
                    $scope.gridOptions.hcApi.setRowData(bizData.fin_stratetarget_exps);
                };
                //保存
                $scope.save = function () {
                    $scope.stopEditingAllGrid();
                    var rowdata = $scope.gridOptions.hcApi.getRowData();
                    if (rowdata[rowdata.length - 1].org_name == "合计") {
                        rowdata.splice(rowdata.length - 1, 1);
                    }
                    rowdata = rowdata.filter(function (data) {
                        return data.org_name;
                    });
                    //合计
                    var salesdata = 0;
                    var profitdata = 0;
                    rowdata.forEach(function (data) {
                        salesdata += Number(data.sales_amt);
                        profitdata += Number(data.profit_amt);
                    });
                    if (salesdata != $scope.data.currItem.sales_amt) {
                        return swalApi.info("战略目标分解金额不等于公司战略目标金额，请检查！");
                    };
                    if (profitdata != $scope.data.currItem.profit_amt) {
                        return swalApi.info("战略目标分解金额不等于公司战略目标金额，请检查！");
                    };
                    $scope.data.currItem.fin_stratetarget_exps = rowdata;
                    if (!$scope.data.currItem.stratetarget_id) {
                        requestApi.post("fin_stratetarget", "insert", $scope.data.currItem).then(function (data) {
                            //合计
                            var salesdata = 0;
                            var profitdata = 0;
                            data.fin_stratetarget_exps.forEach(function (data) {
                                salesdata += Number(data.sales_amt);
                                profitdata += Number(data.profit_amt);
                            })
                            data.fin_stratetarget_exps.push({
                                org_name: "合计",
                                sales_amt: salesdata,
                                profit_amt: profitdata
                            })
                            $scope.gridOptions.hcApi.setRowData(data.fin_stratetarget_exps);
                            return swalApi.success("保存成功");
                        })
                    } else {
                        requestApi.post("fin_stratetarget", "update", $scope.data.currItem).then(function (data) {
                              //合计
                              var salesdata = 0;
                              var profitdata = 0;
                              data.fin_stratetarget_exps.forEach(function (data) {
                                  salesdata += Number(data.sales_amt);
                                  profitdata += Number(data.profit_amt);
                              })
                              data.fin_stratetarget_exps.push({
                                  org_name: "合计",
                                  sales_amt: salesdata,
                                  profit_amt: profitdata
                              })
                            $scope.gridOptions.hcApi.setRowData(data.fin_stratetarget_exps);
                            return swalApi.success("保存成功");
                        })
                    }
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