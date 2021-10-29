/**
 * 商品动销率
 * Created by zhl on 2019/3/8.
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
                    pinnedBottomRowData: [{seq: '合计'}],
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'item_code',
                        headerName: '产品编码'
                    }, {
                        field: 'item_name',
                        headerName: '产品名称'
                    }, {
                        field: 'crm_entid',
                        headerName: '品类',
                        hcDictCode: 'crm_entid'
                    }, {
                        field: 'item_class1_name',
                        headerName: '产品大类',
                    }, {
                        field: 'item_class2_name',
                        headerName: '产品中类'
                    }, {
                        field: 'item_class3_name',
                        headerName: '产品小类'
                    }, {
                        field: 'total_dynamic_sale_number',
                        headerName: '动销数',
                        type: '数量'
                    }, {
                        //field: 'total_qty_lm',
                        field: 'qty_plan',
                        headerName: '库存数',
                        type: '数量'
                    }, {
                        field: 'dynamic_sale_rate',
                        headerName: '动销率',
                        type: '百分比'
                    }],
                    hcClassId: "item_org",
                    hcRequestAction: "getdynamicsalerate",
                    hcBeforeRequest: function (searchObj) {

                        if ($scope.data.currItem.hide_zero_dynamic_sale_rate == 2)
                            searchObj.sqlwhere = ' dynamic_sale_rate <> 0 ';

                        //searchObj.sqlwhere =

                        angular.extend(searchObj, $scope.data.currItem);
                    },
                    hcSearchWhenReady: false
                };

                $scope.groupGridOptions = {
                    pinnedBottomRowData: [{seq: '合计'}],
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'item_code',
                        headerName: '产品编码'
                    }, {
                        field: 'item_name',
                        headerName: '产品名称'
                    }, {
                        field: 'crm_entid',
                        headerName: '品类',
                        hcDictCode: 'crm_entid'
                    }, {
                        id: 'item_class1_name',
                        field: 'item_class1_name',
                        headerName: '产品大类'
                    }, {
                        id: 'item_class2_name',
                        field: 'item_class2_name',
                        headerName: '产品中类'
                    }, {
                        id: 'item_class3_name',
                        field: 'item_class3_name',
                        headerName: '产品小类'
                    }, {
                        field: 'total_dynamic_sale_number',
                        headerName: '动销数',
                        type: '数量'
                    }, {
                        field: 'total_qty_lm',
                        headerName: '库存数',
                        type: '数量'
                    }, {
                        field: 'dynamic_sale_rate',
                        headerName: '动销率',
                        type: '百分比'
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

                            getCurrItem().start_date = date_value;//起始日期 默认 当前月第一天
                            getCurrItem().end_date = new Date().Format('yyyy-MM-dd');//终止日期 默认 今天
                        })
                }

                //计算合计
                $scope.calSum = function (dataArr) {
                    console.log(dataArr);
                    $scope.groupGridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            total_dynamic_sale_number: numberApi.sum(dataArr, 'total_dynamic_sale_number'),
                            total_qty_lm: numberApi.sum(dataArr, 'total_qty_lm'),
                            dynamic_sale_rate: numberApi.sum(dataArr, 'dynamic_sale_rate')
                        }
                    ]);
                }

                /*--------------------- 数据定义 开始---------------------------*/

                /*--------------------- 通用查询 开始---------------------------*/
                //查产品分类(大中小类)
                $scope.commonSearchSettingOfItemClass = {
                    big: {
                        sqlWhere: ' item_class_level = 1 and item_usable =2 ',
                        afterOk: function (result) {
                            getCurrItem().item_class1 = result.item_class_id;
                            getCurrItem().item_class1_code = result.item_class_code;
                            getCurrItem().item_class1_name = result.item_class_name;
                        }
                    },
                    mid: {
                        beforeOpen: function () {
                            if (!getCurrItem().item_class1) {
                                swalApi.info("请先选择产品大类");
                                return false;
                            }
                        },
                        sqlWhere: function () {
                            if (getCurrItem().item_class1)
                                return ' item_class_level = 2 and item_usable =2 and item_class_pid = ' + getCurrItem().item_class1;
                            return ' item_class_level = 2 and item_usable =2 ';
                        },
                        afterOk: function (result) {
                            getCurrItem().item_class2 = result.item_class_id;
                            getCurrItem().item_class2_code = result.item_class_code;
                            getCurrItem().item_class2_name = result.item_class_name;
                        }
                    },
                    small: {
                        beforeOpen: function () {
                            if (!getCurrItem().item_class2) {
                                swalApi.info("请先选择产品中类");
                                return false;
                            }
                        },
                        sqlWhere: function () {
                            if (getCurrItem().item_class2)
                                return ' item_class_level = 3 and item_usable =2 and item_class_pid = ' + getCurrItem().item_class2;
                            return ' item_class_level = 3 and item_usable =2 ';
                        },
                        afterOk: function (result) {
                            getCurrItem().item_class3 = result.item_class_id;
                            getCurrItem().item_class3_code = result.item_class_code;
                            getCurrItem().item_class3_name = result.item_class_name;
                        }
                    }
                };

                //查产品
                $scope.commonSearchSettingOfItem = {
                    sqlWhere: ' item_usable = 2',
                    afterOk: function (result) {
                        getCurrItem().item_id = result.item_id;
                        getCurrItem().item_code = result.item_code;
                        getCurrItem().item_name = result.item_name;

                        if (result.item_class1 && result.item_class1 != '') {
                            getCurrItem().item_class1 = result.item_class1;
                            getCurrItem().item_class1_code = result.item_class1_code;
                            getCurrItem().item_class1_name = result.item_class1_name;
                        }

                        if (result.item_class2 && result.item_class2 != '') {
                            getCurrItem().item_class2 = result.item_class2;
                            getCurrItem().item_class2_code = result.item_class2_code;
                            getCurrItem().item_class2_name = result.item_class2_name;
                        }

                        if (result.item_class3 && result.item_class3 != '') {
                            getCurrItem().item_class3 = result.item_class3;
                            getCurrItem().item_class3_code = result.item_class3_code;
                            getCurrItem().item_class3_name = result.item_class3_name;
                        }

                        if (result.crm_entid && result.crm_entid != 0) {
                            getCurrItem().crm_entid = result.crm_entid;
                        }

                    }
                };

                /*--------------------- 通用查询 结束---------------------------*/

                /*--------------------- 事件函数定义 开始-----------------------*/

                //清楚产品分类的关联字段
                $scope.clearItemClass = function (type) {
                    switch (type) {
                        case 'big':
                            getCurrItem().item_class1 = '';
                            getCurrItem().item_class1_code = '';
                            getCurrItem().item_class1_name = '';

                            getCurrItem().item_class2 = '';
                            getCurrItem().item_class2_code = '';
                            getCurrItem().item_class2_name = '';

                            getCurrItem().item_class3 = '';
                            getCurrItem().item_class3_code = '';
                            getCurrItem().item_class3_name = '';
                            break;
                        case 'mid':
                            getCurrItem().item_class2 = '';
                            getCurrItem().item_class2_code = '';
                            getCurrItem().item_class2_name = '';

                            getCurrItem().item_class3 = '';
                            getCurrItem().item_class3_code = '';
                            getCurrItem().item_class3_name = '';
                            break;
                        case 'small':
                            getCurrItem().item_class3 = '';
                            getCurrItem().item_class3_code = '';
                            getCurrItem().item_class3_name = '';
                            break;
                        default:
                            console.log('clear nothig');
                    }
                };

                /*--------------------- 事件函数定义 开始----------------------*/

                /*------------按钮定义、按钮事件、按钮相关函数 开始-----------*/

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

                    if (getCurrItem().start_date == '' || !getCurrItem().start_date)
                        validTip += '【起始日期】';

                    if (getCurrItem().end_date == '' || !getCurrItem().end_date)
                        validTip += '【终止日期】';

                    if (validTip != '')
                        return swalApi.info('请先填写以下内容：' + validTip);

                    $('#tab11').tab('show');

                    return $scope.gridOptions.hcApi.search();
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

                //汇总功能
                $scope.initGroup = function () {

                    $scope.data.lines = $scope.gridOptions.hcApi.getRowData();

                    var columns = [];

                    if ($scope.summaryBasis.crm_entid == 2) {
                        columns.push("品类");
                    }
                    if ($scope.summaryBasis.item_class1_name == 2) {
                        columns.push("产品大类");
                    }
                    if ($scope.summaryBasis.item_class2_name == 2)
                        columns.push("产品中类");

                    if ($scope.summaryBasis.item_class3_name == 2) {
                        columns.push("产品小类");
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

                    //隐藏模态框
                    $("#groupModal").modal('hide');
                    //切换到“汇总”标签页
                    $('#tab22').tab('show');

                    //数据分组
                    groupData($scope.data.lines, columns);
                }

                /**
                 * 将数据分组
                 * @param lines 关联数据数组
                 * @param columns 分类依据数组
                 */
                function groupData(lines, columns) {
                    console.log(lines, "数据分组");

                    var map = {};
                    var key = "";
                    var group_data = [];
                    for (var i = 0; i < lines.length; i++) {
                        //关联数据数组中的一个元素
                        var item = lines[i];
                        //初始化key
                        key = "";
                        //赋值key
                        columns.forEach(function (v) {
                            if (v == '品类')key += item.crm_entid;
                            if (v == '产品大类')key += item.item_class1_name;
                            if (v == '产品中类')key += item.item_class2_name;
                            if (v == '产品小类')key += item.item_class3_name;
                        });
                        if (!map[key]) {
                            map[key] = [item];
                        } else {
                            map[key].push(item);
                        }
                    }

                    Object.keys(map).forEach(function (key) {
                        var row = map[key][0];

                        row.total_dynamic_sale_number = numberApi.sum(map[key], 'total_dynamic_sale_number');//动销数
                        row.total_qty_lm = numberApi.sum(map[key], 'total_qty_lm');//库存数
                        //动销率=动销数÷库存数
                        row.dynamic_sale_rate = numberApi.divide(row.total_dynamic_sale_number, row.total_qty_lm);

                        group_data.push(row);
                    });

                    //计算合计
                    $scope.calSum(group_data);

                    //设置数据
                    $scope.groupGridOptions.hcApi.setRowData(group_data);
                }

                /*------------按钮定义、按钮事件、按钮相关函数 结束-----------*/

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