/**这是仓库权限管理模块js*/
function warehouse_authority($scope,BasemanService) {
    $scope.data = {};
    $scope.data.currItem = {};
    $scope.data.search_flag = 1;   //查询方式标识, 1 按客户查询, 2 ,按仓库查询
    $scope.listname = '仓库';
    $scope.data

    var allCustomer = [] //所有客户
    var accessCustomer = [] //能访问的客户

    var format = function (row, cell, value, columnDef, dataContext) {
        return "<div style='text-align:center;vertical-align:middle;'>" + value + "</div>"
    }
    /**
     * 网格配置
     *
     */
    $scope.headerGridOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false
    };

    $scope.ListOptions1 = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false,
        multiSelect: true,
    };
    $scope.ListOptions2 = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false,
        multiSelect: true,
    };

    /**
     *网格columns
     */
    //定义主网格字段(浏览）
    //按客户
    $scope.headerGridColumns_ct = [
        {
            id: "seq",
            name: "序号",
            behavior: "select",
            field: "seq",
            editable: false,
            width: 50,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter: format
        },
        {
            id: "customer_code",
            name: "客户编码",
            field: "customer_code",
            editable: false,
            width: 100,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            id: "customer_name",
            name: "客户名称",
            field: "customer_name",
            editable: false,
            width: 196,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];
    //按仓库
    $scope.headerGridColumns_wh = [
        {
            id: "seq",
            name: "序号",
            behavior: "select",
            field: "seq",
            editable: false,
            width: 50,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter: format
        },
        {
            id: "warehouse_code",
            name: "仓库编码",
            behavior: "select",
            field: "warehouse_code",
            editable: false,
            width: 100,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            id: "warehouse_name",
            name: "仓库名称",
            field: "warehouse_name",
            editable: false,
            width: 150,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            id: "factory_code",
            name: "工厂名称",
            field: "factory_code",
            width: 150,
        },{
            id: "factory_name",
            name: "工厂名称",
            field: "factory_name",
            width: 150,
        }
    ];

    //定义网格字段（详情）
    //仓库列
    $scope.Columns_dis_wh = [
        {
            id: "seq",
            name: "序号",
            field: "seq",
            editable: false,
            width: 50,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter: format
        }, {
            id: "warehouse_code",
            name: "仓库编码",
            field: "warehouse_code",
            editable: false,
            width: 75,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
        {
            id: "warehouse_name",
            name: "仓库名称",
            field: "warehouse_name",
            editable: false,
            width: 150,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },{
            id: "factory_code",
            name: "工厂编码",
            field: "factory_code",
            width: 75,
        },{
            id: "factory_name",
            name: "工厂名称",
            field: "factory_name",
            width: 150,
        }
    ];
    $scope.Columns_able_wh = [
        {
            id: "seq",
            name: "序号",
            field: "seq",
            editable: false,
            width: 50,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter: format
        }, {
            id: "warehouse_code",
            name: "仓库编码",
            field: "warehouse_code",
            editable: false,
            width: 75,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
        {
            id: "warehouse_name",
            name: "仓库名称",
            field: "warehouse_name",
            editable: false,
            width: 150,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },{
            id: "factory_code",
            name: "工厂编码",
            field: "factory_code",
            width: 75,
        },{
            id: "factory_name",
            name: "工厂名称",
            field: "factory_name",
            width: 150,
        }
    ];
    //客户列
    $scope.Columns_able_ct = [
        {
            id: "seq",
            name: "序号",
            behavior: "select",
            field: "seq",
            editable: false,
            width: 50,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter: format
        }, {
            id: "customer_code",
            name: "客户编码",
            field: "customer_code",
            editable: false,
            width: 100,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        }, {
            id: "customer_name",
            name: "客户名称",
            field: "customer_name",
            editable: false,
            width: 150,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        }]
    $scope.Columns_dis_ct = [
        {
            id: "seq",
            name: "序号",
            behavior: "select",
            field: "seq",
            editable: false,
            width: 50,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter: format
        }, {
            id: "customer_code",
            name: "客户编码",
            field: "customer_code",
            editable: false,
            width: 100,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        }, {
            id: "customer_name",
            name: "客户名称",
            field: "customer_name",
            editable: false,
            width: 150,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        }]


    /**
     * 复选框定义
     */
    var checkboxSelector1 = new Slick.CheckboxSelectColumn({
        cssClass: "slick-cell-checkboxsel"
    });
    var checkboxSelector2 = new Slick.CheckboxSelectColumn({
        cssClass: "slick-cell-checkboxsel"
    });
    var checkboxSelector3 = new Slick.CheckboxSelectColumn({
        cssClass: "slick-cell-checkboxsel"
    });
    var checkboxSelector4 = new Slick.CheckboxSelectColumn({
        cssClass: "slick-cell-checkboxsel"
    });

    $scope.Columns_able_wh.unshift(checkboxSelector1.getColumnDefinition());
    $scope.Columns_dis_wh.unshift(checkboxSelector2.getColumnDefinition());
    $scope.Columns_able_ct.unshift(checkboxSelector1.getColumnDefinition());
    $scope.Columns_dis_ct.unshift(checkboxSelector2.getColumnDefinition());

    //网格初始化
    $scope.headerGridView = new Slick.Grid("#headerGrid", [], $scope.headerGridColumns_ct, $scope.headerGridOptions);
    $scope.ableGrid = new Slick.Grid("#ableGrid", [], $scope.Columns_able_wh, $scope.ListOptions1);
    $scope.disableGrid = new Slick.Grid("#disableGrid", [], $scope.Columns_dis_wh, $scope.ListOptions1);

    //加载复选框
    $scope.ableGrid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
    $scope.ableGrid.registerPlugin(checkboxSelector1)
    $scope.disableGrid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
    $scope.disableGrid.registerPlugin(checkboxSelector2);

    //网格绑定事件
    $scope.headerGridView.onClick.subscribe(gridHeaderOnClick);

    /**
     * 主表网格点击事件
     * @param e
     * @param args
     */
    function gridHeaderOnClick(e, args) {
        var item = args;
        if ($scope.data.search_flag == 1) {
            $scope.data.currItem.customer_code = args.grid.getDataItem(args.row).customer_code;
            $scope.data.currItem.customer_id = args.grid.getDataItem(args.row).customer_id;
            $scope.getAccessCtrlSaWh()
        } else if ($scope.data.search_flag == 2) {
            $scope.data.currItem.warehouse_id = args.grid.getDataItem(args.row).warehouse_id;
            $scope.data.currItem.customer_id = args.grid.getDataItem(args.row).customer_id;
            $scope.getAccessCtrlSaWh();
        }
        $scope.ableGrid.setSelectedRows([]);
        $scope.disableGrid.setSelectedRows([]);
    };

    /**
     * 将所有客户列表与能访问客户列表对比  得出不能访问客户列表
     */
    function getDisCustomer() {
        var allCustomer1 = [];
        $.each(allCustomer, function (i, item) {             //复制一个新的所有客户列表
            allCustomer1.push(item)
        })
        var accessCustomer1 = accessCustomer;                   //获得一个当前对象能访问的客户列表
        for (var i = 0; i < accessCustomer1.length; i++) {
            Loop2:for (var j = 0; j < allCustomer1.length; j++) {
                if (accessCustomer1 [i].customer_code == allCustomer1[j].customer_code) {
                    allCustomer1.splice(j, 1);
                    break Loop2;
                }
            }
        }
        $.each(allCustomer1, function (i, item) {
            item.seq = i + 1;
        })
        $scope.disableGrid.setData(allCustomer1);
        $scope.disableGrid.render();
    }

    /**
     * 查询方式切换
     */
    // 切换为按仓库查询方式
    $scope.whMethod = function () {
        $scope.data.search_flag = 2;
        $scope.listname = '客户';
        $scope.headerGridView.setColumns($scope.headerGridColumns_wh);
        $scope.ableGrid.setColumns($scope.Columns_able_ct);
        $scope.disableGrid.setColumns($scope.Columns_dis_ct);
        $scope.ableGrid.setData([]);
        $scope.disableGrid.setData([]);
        $scope.ableGrid.render();
        $scope.disableGrid.render();
        $scope.searchWh();
        $scope.getAccessCtrlSaWh();
    }

    //切换为按客户查询方式
    $scope.uerMethod = function () {
        $scope.data.search_flag = 1;
        $scope.listname = '仓库';
        $scope.headerGridView.setColumns($scope.headerGridColumns_ct);
        $scope.ableGrid.setColumns($scope.Columns_able_wh);
        $scope.disableGrid.setColumns($scope.Columns_dis_wh);
        $scope.ableGrid.setData([]);
        $scope.disableGrid.setData([]);
        $scope.ableGrid.render();
        $scope.disableGrid.render();
        $scope.searchCustomer();
        $scope.getAccessCtrlSaWh();
    }

    /**
     * 查询数据
     */

    //仓库查询
    $scope.searchWh = function () {
        BasemanService.RequestPost("warehouse", "search", {search_flag: 2})
            .then(function (data) {
                //清空网格
                $scope.headerGridView.setData([]);
                //设置数据
                $.each(data.warehouses, function (i, item) {
                    item.seq = i + 1;
                })
                $scope.headerGridView.setData(data.warehouses);
                //重绘网格
                $scope.headerGridView.render();
            });
    }

    //客户查询
    $scope.searchCustomer = function () {
        BasemanService.RequestPost("customer_org", "search", {maxsearchrltcmt:10000})
            .then(function (data) {
                //清空网格
                $scope.headerGridView.setData([]);
                //设置数据
                $.each(data.customer_orgs, function (i, item) {
                    item.seq = i + 1;
                })
                allCustomer = data.customer_orgs;
                $scope.headerGridView.setData(data.customer_orgs);
                //重绘网格
                $scope.headerGridView.render();
            });
    }

    //获取权限列表
    $scope.getAccessCtrlSaWh = function () {
        if ($scope.data.currItem.customer_code && $scope.data.search_flag == 1) {
            var postdata = {
                customer_code: $scope.data.currItem.customer_code,
                customer_id: $scope.data.currItem.customer_id
            }
            //清空网格
            $scope.ableGrid.setData([]);
            $scope.disableGrid.setData([]);
            BasemanService.RequestPost("fin_expense", "getwarehouseforcustomer", postdata)
                .then(function (data) {
                    //设置数据
                    if (data.fin_expenses.length > 0) {
                        $.each(data.fin_expenses, function (i, item) {
                            item.seq = i + 1;
                        })
                        $scope.ableGrid.setData(data.fin_expenses);
                        $scope.ableGrid.render();
                    }
                    if (data.dis_fin_expenses.length > 0 ) {
                        $.each(data.dis_fin_expenses, function (i, item) {
                            if (item) {
                                item.seq = i + 1;
                            }
                        })
                        $scope.disableGrid.setData(data.dis_fin_expenses);
                        $scope.disableGrid.render();
                    }
                });
        } else if ($scope.data.currItem.warehouse_id && $scope.data.search_flag == 2) {
            var postdata = {
                warehouse_id: $scope.data.currItem.warehouse_id,
                customer_id: $scope.data.currItem.customer_id
            }
            //清空网格
            $scope.ableGrid.setData([]);
            $scope.disableGrid.setData([]);
            BasemanService.RequestPost("fin_expense", "getcustomerforwarehouse", postdata)
                .then(function (data) {
                    //设置数据
                    if (data.fin_expenses.length > 0) {
                        $.each(data.fin_expenses, function (i, item) {
                            item.seq = i + 1;
                        })
                        $scope.ableGrid.setData(data.fin_expenses);
                        $scope.ableGrid.render();
                    }
                    if (data.dis_fin_expenses.length > 0 ) {
                        $.each(data.dis_fin_expenses, function (i, item) {
                            if (item) {
                                item.seq = i + 1;
                            }
                        })
                        $scope.disableGrid.setData(data.dis_fin_expenses);
                        $scope.disableGrid.render();
                    }
                });
        }

    }

    /**
     * 授权按钮
     */

    //全部授权
    $scope.allAccess = function () {
        var data1 = $scope.ableGrid.getData();
        var data2 = $scope.disableGrid.getData();
        $.each(data2, function (i, item) {
            data1.push(item)
        })
        $.each(data1, function (i, item) {
            item.seq = i + 1;
        })
        $scope.ableGrid.invalidateAllRows();
        $scope.ableGrid.setData(data1);
        $scope.ableGrid.render();
        $scope.ableGrid.setSelectedRows([]);
        $scope.disableGrid.invalidateAllRows();
        $scope.disableGrid.setData([]);
        $scope.disableGrid.render();
    }

    //授权
    $scope.Access = function () {
        var rows = $scope.disableGrid.getSelectedRows();  //获取未授权列表中选择的行号
        var data1 = $scope.ableGrid.getData();
        var data2 = $scope.disableGrid.getData();
        var data3 = []                                 //暂时存放选择授权的对象列表
        $scope.disableGrid.setSelectedRows([]);
        $scope.ableGrid.setSelectedRows([]);

        //将选择的授权对象行放到授权列表中
        $.each(rows, function (i, rowid) {
            var item = data2[rowid]
            data1.push(item)
            data3.push(item)
        })
        //将选择的对象从禁用列表中删除
        $.each(data3, function (i, item) {
            loop2:for (var j = 0; j < data2.length; j++) {
                if ($scope.data.search_flag == 2) {         //判断按客户还是按仓库查找,再选择根据customer_code还是warehouse_id来删除元素
                    if (item.customer_code == data2[j].customer_code) {
                        data2.splice(j, 1)
                        break loop2;
                    }
                } else {
                    if (item.warehouse_id == data2[j].warehouse_id) {
                        data2.splice(j, 1)
                        break loop2;
                    }
                }
            }
        })

        //更新序号
        $.each(data2, function (i, item) {
            item.seq = i + 1;
        })
        $.each(data1, function (i, item) {
            item.seq = i + 1;
        })
        $scope.ableGrid.invalidateAllRows();
        $scope.ableGrid.setData(data1);
        $scope.ableGrid.render();
        $scope.disableGrid.invalidateAllRows();
        $scope.disableGrid.setData(data2);
        $scope.disableGrid.render();
    }

    //全部取消
    $scope.allCancel = function () {
        var data1 = $scope.ableGrid.getData();
        var data2 = $scope.disableGrid.getData();

        $.each(data1, function (i, item) {
            data2.push(item)
        })
        $.each(data2, function (i, item) {
            item.seq = i + 1;
        })
        $scope.ableGrid.invalidateAllRows();
        $scope.ableGrid.setData([]);
        $scope.ableGrid.render();
        $scope.ableGrid.setSelectedRows([]);
        $scope.disableGrid.invalidateAllRows();
        $scope.disableGrid.setData(data2);
        $scope.disableGrid.render();
    }

    //取消
    $scope.Cancel = function () {

        var rows = $scope.ableGrid.getSelectedRows();  //获取已授权列表中选择的行号
        var data1 = $scope.ableGrid.getData();
        var data2 = $scope.disableGrid.getData();
        var data3 = []                                 //暂时存放选择的对象列表
        $scope.ableGrid.setSelectedRows([]);

        //将选择的列表行从中删除并放到禁用列表中
        $.each(rows, function (i, rowid) {
            var item = data1[rowid]         //添加元素
            data2.push(item)
            data3.push(item)
        })
        $.each(data3, function (i, item) {
            loop2:for (var j = 0; j < data1.length; j++) {
                if ($scope.data.search_flag == 2) {         //判断按客户还是按仓库查找,再选择根据customer_code还是warehouse_id来删除元素
                    if (item.customer_code == data1[j].customer_code) {
                        data1.splice(j, 1)
                        break loop2;
                    }
                } else {
                    if (item.warehouse_id == data1[j].warehouse_id) {
                        data1.splice(j, 1)
                        break loop2;
                    }
                }
            }
        })

        //更新 授权列表序号
        $.each(data1, function (i, item) {
            item.seq = i + 1;
        })
        $.each(data2, function (i, item) {
            item.seq = i + 1;
        })
        $scope.ableGrid.invalidateAllRows();
        $scope.ableGrid.setData(data1);
        $scope.ableGrid.render();
        $scope.disableGrid.setSelectedRows([]);
        $scope.disableGrid.invalidateAllRows();
        $scope.disableGrid.setData(data2);
        $scope.disableGrid.render();
    }

    /**
     * 保存数据
     */
    $scope.saveData = function () {
        var ableList = $scope.ableGrid.getData();
        var postdata = {
            search_flag: $scope.data.search_flag,
            fin_expenses: ableList,
            customer_code: $scope.data.currItem.customer_code,
            customer_id:$scope.data.currItem.customer_id,
        };
        var action = "";
        if($scope.data.search_flag==1){
            //按客户保存
            action = "update_customer_wh_ctrl_customer";
            postdata.fin_expenseoffin_expenses = [{"customer_id": $scope.data.currItem.customer_id}];
        }else{
            //按仓库保存
            action = "update_customer_wh_ctrl_wh";
            postdata.fin_expenseoffin_expenses = [{"warehouse_id": $scope.data.currItem.warehouse_id}];
        }
        BasemanService.RequestPost("fin_expense", action, JSON.stringify(postdata))
            .then(function () {
                BasemanService.swalSuccess("成功", "保存成功!");
            });
    }

    //gird自适应高度
    BasemanService.initGird();
    $scope.searchCustomer()

}

//注册控制器s
angular.module('inspinia')
    .controller('warehouse_authority', warehouse_authority)



