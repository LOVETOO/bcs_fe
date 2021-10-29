/**
 * 客户往来明细 customer_contacts_detail
 * Created by zhl on 2019/1/22.
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi', 'numberApi'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi, numberApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.data = {};
                $scope.data.currItem = {};

                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'customer_code',
                        headerName: "客户编码"
                    }, {
                        field: 'customer_name',
                        headerName: "客户名称"
                    }, {
                        field: 'date_sum',
                        headerName: "日期",
                        type: '日期'
                    }, {
                        field: 'brief',
                        headerName: "摘要",
                    }, {
                        field: 'crm_entid',
                        headerName: "品类",
                        hcDictCode: "crm_entid"
                    }, {
                        field: 'dept_code',
                        headerName: "部门编码"
                    }, {
                        field: 'dept_name',
                        headerName: "部门名称"
                    }, {
                        field: 'group_customer_code',
                        headerName: "总公司编码"
                    }, {
                        field: 'group_customer_name',
                        headerName: "总公司名称"
                    }, {
                        field: 'sale_area_name',
                        headerName: "销售区域"
                    }, {
                        field: 'debit',
                        headerName: "应收",
                        type: '金额'
                    }, {
                        field: 'creditor',
                        headerName: "实收",
                        type: '金额'
                    }, {
                        field: 'balance',
                        headerName: "余额",
                        type: '金额'
                    }, {
                        field: 'remark',
                        headerName: "备注"
                    }],
                    hcClassId: "ar_month_invoice_business",
                    hcRequestAction: "getdata3",
                    hcBeforeRequest: function (searchObj) {
                        angular.extend(searchObj, $scope.data.currItem);
                    },
                    hcSearchWhenReady: false
                };//gridOptions 结束网格定义

                $scope.groupGridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [{
                        type: '序号'
                    }, {
                        id: 'customer_code',
                        field: 'customer_code',
                        headerName: "客户编码"
                    }, {
                        id: 'customer_name',
                        field: 'customer_name',
                        headerName: "客户名称"
                    }, {
                        id: 'dept_code',
                        field: 'dept_code',
                        headerName: "部门编码"
                    }, {
                        id: 'dept_name',
                        field: 'dept_name',
                        headerName: "部门名称"
                    }, {
                        id: 'sale_area_name',
                        field: 'sale_area_name',
                        headerName: "销售区域"
                    }, {
                        id: 'group_customer_code',
                        field: 'group_customer_code',
                        headerName: "总公司编码"
                    }, {
                        id: 'group_customer_name',
                        field: 'group_customer_name',
                        headerName: "总公司名称"
                    }, {
                        field: 'account',
                        headerName: "期初"
                    }, {
                        field: 'debit',
                        headerName: "应收",
                        type: '金额'
                    }, {
                        field: 'creditor',
                        headerName: "实收",
                        type: '金额'
                    }, {
                        field: 'balance',
                        headerName: "余额",
                        type: '金额'
                    }]
                };//groupGridOptions 结束网格定义


                //继承基础控制器
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                /*--------------------- 数据定义 开始---------------------------*/

                //获取绑定数据
                function getCurrItem() {
                    return $scope.data.currItem;
                }

                $scope.doInit = function () {
                    $scope.hcSuper.doInit()
                        .then(function () {
                            var date = new Date(), y = date.getFullYear(), m = date.getMonth();
                            var firstDay = new Date(y, m, 1);//当前月第一天
                            //格式化firstDay
                            date = new Date(firstDay);
                            var year, month, date;
                            year = date.getFullYear();
                            month = date.getMonth() + 1;
                            if (month <= 9)
                                month = '0' + month;
                            date = date.getDate();
                            if (date <= 9)
                                date = '0' + date;
                            var date_value = year + '-' + month + '-' + date + '';

                            getCurrItem().beginyear_month = date_value;//起始日期 默认 当前月第一天
                            getCurrItem().endyear_month = new Date().Format('yyyy-MM-dd');//终止日期 默认 今天
                        })
                }

                /**
                 * 计算合计行
                 * @param relationData 关联数据(数组)
                 */
                $scope.calSum = function (relationData) {
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            debit: numberApi.sum(relationData, 'debit'),
                            creditor: numberApi.sum(relationData, 'creditor'),
                            balance: numberApi.sum(relationData, 'balance')
                        }
                    ]);
                }

                //计算合计
                $scope.calSum = function (dataArr) {
                    $scope.groupGridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            debit: numberApi.sum(dataArr, 'debit'),
                            creditor: numberApi.sum(dataArr, 'creditor'),
                            balance: numberApi.sum(dataArr, 'balance')
                        }
                    ]);
                }

                /*--------------------- 数据定义 结束---------------------------*/

                /*--------------------- 通用查询 开始---------------------------*/
                //查业销售区域
                $scope.commonSearchSettingOfSalearea = {
                    afterOk: function (result) {
                        getCurrItem().sale_area_id = result.sale_area_id;
                        getCurrItem().sale_area_code = result.sale_area_code;
                        getCurrItem().sale_area_name = result.sale_area_name;
                    }
                };

                //查询总公司
                $scope.commonSearchSettingOfGroupCustomer = {
                    sqlWhere: " is_groupcustomer = 2",
                    afterOk: function (result) {
                        getCurrItem().group_customer_id = result.customer_id;
                        getCurrItem().group_customer_code = result.customer_code;
                        getCurrItem().group_customer_name = result.customer_name;
                    }
                }

                //查询 客户
                $scope.commonSearchSettingOfCustomer = {
                    afterOk: function (result) {
                        getCurrItem().customer_id = result.customer_id;
                        getCurrItem().customer_name = result.customer_name;
                        getCurrItem().customer_code = result.customer_code;
                    }
                }

                //查询 部门
                $scope.commonSearchSettingOfDept = {
                    afterOk: function (result) {
                        getCurrItem().dept_id = result.dept_id;
                        getCurrItem().dept_name = result.dept_name;
                        getCurrItem().dept_code = result.dept_code;
                    }
                }

                /*--------------------- 通用查询 结束---------------------------*/

                /*--------------按钮定义、按钮事件、按钮相关函数 开始-----------------*/

                //添加按钮
                $scope.toolButtons = {
                    search: {
                        title: '查询',
                        icon: 'fa fa-search',
                        click: function () {
                            $scope.search && $scope.search();
                        }
                    },

                    export: {
                        title: '导出',
                        icon: 'glyphicon glyphicon-log-out',
                        click: function () {
                            $scope.export && $scope.export();
                        }
                    },

                    show_group: {
                        title: '显示汇总',
                        icon: 'glyphicon glyphicon-indent-right',
                        click: function () {
                            $scope.group && $scope.group(this.title);
                        }
                    }
                };


                // 查询
                $scope.search = function () {
                    var validTip = '';

                    if (getCurrItem().beginyear_month == '' || !getCurrItem().beginyear_month)
                        validTip += '【起始日期】';

                    if (getCurrItem().endyear_month == '' || !getCurrItem().endyear_month)
                        validTip += '【终止日期】';

                    if (validTip != '')
                        return swalApi.info('请先填写以下内容：' + validTip);

                    return $scope.gridOptions.hcApi.search();
                    $('#tab11').tab('show');
                };

                $scope.refresh = function () {
                    $scope.search();
                };

                $scope.export = function () {
                    $scope.gridOptions.hcApi.exportToExcel();
                }


                $scope.group = function (title) {
                    $("#groupModal").modal();
                }

                //分组依据
                $scope.columns = [];
                //要被进行分组汇总的数据（即表格gridOptions的数据）
                $scope.data.lines = [];

                $scope.initGroup = function () {

                    $scope.data.lines = $scope.gridOptions.hcApi.getRowData();

                    var columns = [];

                    if ($scope.summaryBasis.customer == 2) {
                        columns.push("客户编码");
                        columns.push("客户名称");
                    }
                    if ($scope.summaryBasis.dept == 2) {
                        columns.push("部门编码");
                        columns.push("部门名称")
                    }
                    if ($scope.summaryBasis.area == 2)columns.push("销售区域");
                    if ($scope.summaryBasis.group_customer == 2) {
                        columns.push("总公司编码");
                        columns.push("总公司名称")
                    }

                    if (columns.length == 0) {
                        swalApi.info("请选择汇总项");
                        return;
                    }

                    //汇总：列的显示与隐藏
                    $scope.columns = columns;
                    $scope.groupGridOptions.columnDefs.forEach(function (column) {
                        if (columns.indexOf(column.headerName) >= 0) {
                            $scope.groupGridOptions.columnApi.setColumnVisible(column.id, true);
                            if (column.children) {
                                column.children.forEach(function (child) {
                                    $scope.groupGridOptions.columnApi.setColumnVisible(child.id, true);
                                });
                            }
                        } else {
                            $scope.groupGridOptions.columnApi.setColumnVisible(column.id, false);
                            if (column.children) {
                                column.children.forEach(function (child) {
                                    $scope.groupGridOptions.columnApi.setColumnVisible(child.id, false);
                                });
                            }
                        }
                    });

                    /*  if ($scope.data.currItem.plan_flag == 2) {
                     $scope.groupGridOptions.columnApi.setColumnsVisible(['qty_keep', 'qty_plan'], true);
                     }
                     $scope.groupGridOptions.columnApi.setColumnsVisible(['qty_onhand', 'seq'], true);*/

                    $("#groupModal").modal('hide');

                    $('#tab22').tab('show');

                    //数据分组
                    groupData($scope.data.lines, columns);
                }

                function groupData(lines, columns) {
                    var map = {};
                    var key = "";
                    var group_data = [];
                    for (var i = 0; i < lines.length; i++) {
                        var arr_element = lines[i];
                        key = "";
                        //设置key
                        columns.forEach(function (v) {
                            if (v == '客户编码')key += arr_element.customer_code;
                            if (v == '部门编码')key += arr_element.dept_code;
                            if (v == '销售区域')key += arr_element.sale_area_name;
                            if (v == '总公司编码')key += arr_element.group_customer_code;
                        });
                        if (!map[key]) {
                            map[key] = [arr_element];
                        } else {
                            map[key].push(arr_element);
                        }
                    }
                    Object.keys(map).forEach(function (key) {
                        var row = map[key][0];
                        row.balance = numberApi.sum(map[key], 'balance');//余额
                        row.debit = numberApi.sum(map[key], 'debit');//应收
                        row.creditor = numberApi.sum(map[key], 'creditor');//实收

                        //期初() = 余额 + 应收 - 实收
                        row.account = row.balance + row.debit - row.creditor;

                        group_data.push(row);
                    });
                    $scope.groupGridOptions.hcApi.setRowData(group_data);

                    //计算合计
                    $scope.calSum(group_data);
                }

                /*--------------按钮定义、按钮事件、按钮相关函数 结束-----------------*/

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