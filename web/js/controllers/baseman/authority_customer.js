
define(['module', 'controllerApi'], function (module, controllerApi) {

/**这是权限管理模块js*/
authority_customer.$inject = ['$scope', 'BasemanService'];
function authority_customer($scope, BasemanService) {
    $scope.data = {};
    $scope.data.currItem = {};
    $scope.data.search_flag = 1;   //查询方式标识, 1 按人员查询, 2 ,按部门查询
    $scope.listname = '客户';
    $scope.data

    var allUser = [] //所有人员
    var accessUser = [] //能访问的人员

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
    //按用户
    $scope.headerGridColumns_user = [
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
            id: "userid",
            name: "用户编码",
            field: "userid",
            editable: false,
            width: 100,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            id: "username",
            name: "用户名称",
            field: "username",
            editable: false,
            width: 196,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];
    //按部门
    $scope.headerGridColumns_cust = [
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
            behavior: "select",
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
            width: 150,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];

    //定义网格字段（详情）
    //部门列
    $scope.Columns_dis_cust = [
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
            id: "customer_code",
            name: "客户编码",
            field: "customer_code",
            editable: false,
            width: 100,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
        {
            id: "customer_name",
            name: "客户名称",
            field: "customer_name",
            editable: false,
            width: 150,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        }
    ];
    $scope.Columns_able_cust = [
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
            id: "customer_code",
            name: "客户编码",
            field: "customer_code",
            editable: false,
            width: 100,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
        {
            id: "customer_name",
            name: "客户名称",
            field: "customer_name",
            editable: false,
            width: 150,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        }
    ];
    //人员列
    $scope.Columns_able_user = [
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
            id: "userid",
            name: "用户编码",
            field: "userid",
            editable: false,
            width: 100,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        }, {
            id: "username",
            name: "用户名称",
            field: "username",
            editable: false,
            width: 150,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        }]
    $scope.Columns_dis_user = [
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
            id: "userid",
            name: "用户编码",
            field: "userid",
            editable: false,
            width: 100,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        }, {
            id: "username",
            name: "用户名称",
            field: "username",
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

    $scope.Columns_able_cust.unshift(checkboxSelector1.getColumnDefinition());
    $scope.Columns_dis_cust.unshift(checkboxSelector2.getColumnDefinition());
    $scope.Columns_able_user.unshift(checkboxSelector1.getColumnDefinition());
    $scope.Columns_dis_user.unshift(checkboxSelector2.getColumnDefinition());

    //网格初始化
    $scope.headerGridView = new Slick.Grid("#headerGrid", [], $scope.headerGridColumns_user, $scope.headerGridOptions);
    $scope.ableGrid = new Slick.Grid("#ableGrid", [], $scope.Columns_able_cust, $scope.ListOptions1);
    $scope.disableGrid = new Slick.Grid("#disableGrid", [], $scope.Columns_dis_cust, $scope.ListOptions1);

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
            $scope.data.currItem.sysuserid = args.grid.getDataItem(args.row).sysuserid;
            $scope.getAccessCtrlCust();
        } else if ($scope.data.search_flag == 2) {
            $scope.data.currItem.customer_id = args.grid.getDataItem(args.row).customer_id;
            $scope.getAccessCtrlCust();
        }
        $scope.ableGrid.setSelectedRows([]);
        $scope.disableGrid.setSelectedRows([]);
    };

    /**
     * 将所有人员列表与能访问人员列表对比  得出不能访问人员列表
     */
    function getDisUser() {
        var allUser1 = [];
        $.each(allUser, function (i, item) {             //复制一个新的所有人员列表
            allUser1.push(item)
        })
        var accessUser1 = accessUser;                   //获得一个当前对象能访问的人员列表
        for (var i = 0; i < accessUser1.length; i++) {
            Loop2:for (var j = 0; j < allUser1.length; j++) {
                if (accessUser1 [i].userid == allUser1[j].userid) {
                    allUser1.splice(j, 1);
                    break Loop2;
                }
            }
        }
        $.each(allUser1, function (i, item) {
            item.seq = i + 1;
        })
        $scope.disableGrid.setData(allUser1);
        $scope.disableGrid.render();
    }

    /**
     * 查询方式切换
     */
    // 切换为按客户查询方式
    $scope.custMethod = function () {
        $scope.data.search_flag = 2;
        $scope.listname = '人员'
        $scope.headerGridView.setColumns($scope.headerGridColumns_cust);
        $scope.ableGrid.setColumns($scope.Columns_able_user);
        $scope.disableGrid.setColumns($scope.Columns_dis_user);
        $scope.ableGrid.setData([]);
        $scope.disableGrid.setData([]);
        $scope.ableGrid.render();
        $scope.disableGrid.render();
        $scope.searchCust();
        $scope.getAccessCtrlCust();
    }

    //切换为按人员查询方式
    $scope.uerMethod = function () {
        $scope.data.search_flag = 1;
        $scope.listname = '客户'
        $scope.headerGridView.setColumns($scope.headerGridColumns_user);
        $scope.ableGrid.setColumns($scope.Columns_able_cust);
        $scope.disableGrid.setColumns($scope.Columns_dis_cust);
        $scope.ableGrid.setData([]);
        $scope.disableGrid.setData([]);
        $scope.ableGrid.render();
        $scope.disableGrid.render();
        $scope.searchUser();
        $scope.getAccessCtrlCust();
    }

    /**
     * 查询数据
     */

    //客户查询
    $scope.searchCust = function (userid) {
        BasemanService.RequestPost("customer_org", "search", {maxsearchrltcmt:10000})
            .then(function (data) {
                //清空网格
                $scope.headerGridView.setData([]);
                //设置数据
                $.each(data.customer_orgs, function (i, item) {
                    item.seq = i + 1;
                })
                $scope.headerGridView.setData(data.customer_orgs);
                //重绘网格
                $scope.headerGridView.render();
            });
    }

    //人员查询
    $scope.searchUser = function () {
        BasemanService.RequestPost("fin_expense", "getcustomeruser", {})
            .then(function (data) {
                //清空网格
                $scope.headerGridView.setData([]);
                //设置数据
                $.each(data.fin_expenseoffin_expenses, function (i, item) {
                    item.seq = i + 1;
                })
                allUser = data.fin_expenseoffin_expenses;
                $scope.headerGridView.setData(data.fin_expenseoffin_expenses);
                //重绘网格
                $scope.headerGridView.render();
            });
    }

    //获取权限列表
    $scope.getAccessCtrlCust = function () {
        if ($scope.data.currItem.sysuserid && $scope.data.search_flag == 1) {
            var postdata = {
                sysuserid: $scope.data.currItem.sysuserid
            }
        } else if ($scope.data.currItem.customer_id && $scope.data.search_flag == 2) {
            var postdata = {
                customer_id: $scope.data.currItem.customer_id
            }
        }
        //清空网格
        $scope.ableGrid.setData([]);
        $scope.disableGrid.setData([]);
        BasemanService.RequestPost("fin_expense", "getaccessctrlcustomer", postdata)
            .then(function (data) {
                //设置数据
                if (data.customer_access_ctrloffin_expenses.length > 0) {
                    $.each(data.customer_access_ctrloffin_expenses, function (i, item) {
                        item.seq = i + 1;
                    })
                    $scope.ableGrid.setData(data.customer_access_ctrloffin_expenses);
                    $scope.ableGrid.render();
                }
                if (data.customeroffin_expenses.length > 0 ) {
                    $.each(data.customeroffin_expenses, function (i, item) {
                        if (item) {
                            item.seq = i + 1;
                        }
                    })
                    $scope.disableGrid.setData(data.customeroffin_expenses);
                    $scope.disableGrid.render();
                } else if( $scope.data.search_flag == 2){
                    accessUser = data.customer_access_ctrloffin_expenses;
                    getDisUser();
                }
            });
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
        ////将选择的对象从禁用列表中删除
        $.each(data3, function (i, item) {
            loop2:for (var j = 0; j < data2.length; j++) {
                if ($scope.data.search_flag == 2) {         //判断按人员还是按部门查找,再选择根据userid还是customer_id来删除元素
                    if (item.userid == data2[j].userid) {
                        data2.splice(j, 1)
                        break loop2;
                    }
                } else {
                    if (item.customer_id == data2[j].customer_id) {
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
                if ($scope.data.search_flag == 2) {         //判断按人员还是按部门查找,再选择根据userid还是customer_id来删除元素
                    if (item.userid == data1[j].userid) {
                        data1.splice(j, 1)
                        break loop2;
                    }
                } else {
                    if (item.customer_id == data1[j].customer_id) {
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
            customer_access_ctrloffin_expenses: ableList
        }
        if($scope.data.search_flag==1){
            postdata.sysuserid = $scope.data.currItem.sysuserid;
        }else{
            postdata.customer_id = $scope.data.currItem.customer_id;
        }
        //调用后台select方法查询详情
        BasemanService.RequestPost("fin_expense", "updatecustomerctrl", JSON.stringify(postdata))
            .then(function () {
                BasemanService.swalSuccess("成功", "保存成功!");
            });
    }

    //gird自适应高度
    BasemanService.initGird();
    $scope.searchUser()

}

    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: authority_customer
    });
});

//注册控制器s
// angular.module('inspinia')
    // .controller('authority_customer', authority_customer);



