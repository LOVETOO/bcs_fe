var basemanControllers = angular.module('inspinia');
function customer_user_relation($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    customer_user_relation = HczyCommon.extend(customer_user_relation, ctrl_bill_public);
    customer_user_relation.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "customer_user_relation",
        key: "sysuserid",
        wftempid: 10124,
        FrmInfo: {},
        grids: [{optionname: 'options_7', idname: 'customer_user_relations'},
            {optionname: 'options_3', idname: 'customer_user_relationofcustomer_user_relations'}]
    };
    //查询所有
    $scope.search = function () {
        var postdata = {flag: 20};
        BasemanService.RequestPost("customer", "search", postdata)
            .then(function (data) {
                $scope.gridSetData("options_7", data.customers);

                var postdata1 = {cust_id: data.customers[0].cust_id};
                BasemanService.RequestPost("customer_user_relation", "search", postdata1)
                    .then(function (result) {
                        $scope.gridSetData("options_3", result.customer_user_relations);
                    });
            });
    }
    $scope.clearinformation = function () {
        $scope.search();
    };
    /***********************按钮处理***************************/
    //点击事件
    $scope.setdata = function (e) {
        var postdata = {cust_id: e.data.cust_id};
        BasemanService.RequestPost("customer_user_relation", "search", postdata)
            .then(function (data) {
                $scope.gridSetData("options_3", data.customer_user_relations);
            });
    }
    //客户查询
    $scope.selectcust = function () {
        var datas = $scope.gridGetData("options_7");
        var temp = [], i = 0;
        while (i < datas.length) {
            if ($scope.data.currItem.cust_name == datas[i].cust_code || $scope.data.currItem.cust_name == datas[i].cust_name) {
                datas[i].color = "yellow";
                temp.push(datas[i]);
                datas.splice(i, 1);
            } else {
                datas[i].color = "";
                i++
            }
        }
        if (temp.length == 0) {//未找到
            return
        }
        datas = temp.concat(datas);
        var postdata = {cust_id: datas[0].cust_id};
        BasemanService.RequestPost("customer_user_relation", "search", postdata)
            .then(function (data) {
                $scope.gridSetData("options_3", data.customer_user_relations);
            });
        $scope.gridSetData("options_7", datas);
        $scope.options_7.api.ensureIndexVisible(0);

    }
    //业务员查询
    $scope.selectuser = function () {
        $scope.gridSetData("options_3", {});
        var datas = $scope.gridGetData("options_7");
        var temp = [], i = 0;
        while (i < datas.length) {
            if (datas[i].creator.indexOf($scope.data.currItem.applicant) != -1) {
                datas[i].color = "yellow";
                temp.push(datas[i]);
                datas.splice(i, 1);
            } else {
                datas[i].color = "";
                i++
            }
        }
        if (temp.length == 0) {//未找到
            return
        }
        datas = temp.concat(datas);
        var postdata = {cust_id: datas[0].cust_id};
        BasemanService.RequestPost("customer_user_relation", "search", postdata)
            .then(function (data) {
                $scope.gridSetData("options_3", data.customer_user_relations);
            });
        $scope.gridSetData("options_7", datas);
        $scope.options_7.api.ensureIndexVisible(0);

    }
    //网格颜色设置
    function colorRenderer(params) {
        params.eGridCell.style.backgroundColor = params.data.color;
        return params.value;
    }

    /***********************网格处理事件***************************/
    //增加行
    $scope.addpo = function () {
        $scope.gridSetData("options_3", {});
        var data = $scope.gridGetData("options_7");
        var selectRows = $scope.selectGridGetData('options_7');
        if (!selectRows.length) {
            BasemanService.notice("请先选择业务部门", "alert-warning");
            return;
        }
        $scope.FrmInfo = {
            title: "客户业务员关系",
            is_custom_search: true,
            is_high: true,
            thead: [{
                name: "业务员",
                code: "userid",
                show: true,
                iscond: true,
                type: 'string'

            }, {
                name: "业务部门",
                code: "orgname",
                show: true,
                iscond: true,
                type: 'string'
            }],
            classid: "customer_user_relation",
            postdata: {flag: 2, cust_id: selectRows[0].cust_id},
            type: "checkbox"
        };
        BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (items) {
            var lcs = $scope.gridGetData("options_3");
            var isExists = false;
            for (var i = 0; i < items.length; i++) {
                var isExists = HczyCommon.isExist(lcs, items[i], ["userid"], ["userid"]).exist;
                if (isExists) {
                    continue;
                }
                items[i].userid = items[i].userid;
                items[i].org_name = items[i].org_name;
                items[i].org_id = items[i].org_id;
                items[i].usable = 2;
                $scope.gridAddItem('options_3', items[i]);
            }

        })
    };
    //保存明细
    $scope.saveline = function () {
        var selectRows = $scope.selectGridGetData('options_7');
        var datas = $scope.gridGetData("options_3");
        var temp = [];
        for (var i = 0; i < datas.length; i++) {
            temp.push(datas[i]);
        }
        var postdata = {cust_id: selectRows[0].cust_id};
        postdata.customer_user_relationofcustomer_user_relations = temp;
        BasemanService.RequestPost("customer_user_relation", "insert", postdata)
            .then(function (data) {
                var index = $scope.options_7.api.getFocusedCell().rowIndex;
                var nodes = $scope.options_7.api.getModel().rootNode.childrenAfterSort;
                data1 = $scope.gridGetData("options_3");
                var userid = "";
                for (var i = 0; i < data1.length; i++) {
                    if (data1[i].userid != undefined) {
                        userid = data1[i].userid + "," + userid;
                    }
                }
                userid = userid.substr(0, userid.length - 1);
                nodes[index].data.creator = userid;
                $scope.options_7.api.refreshCells(nodes, ["creator"]);
            });
    }
    $scope.refresh = function () {
        $scope.search();
    }
    //删除行
    $scope.delpo = function () {
        var data = $scope.gridGetData("options_3");
        var selectRows1 = $scope.selectGridGetData('options_7');
        if (!selectRows1.length) {
            BasemanService.notice("请选择需要删除的客户", "alert-warning");
            return;
        }
        var selectRows2 = $scope.selectGridGetData('options_3');
        if (!selectRows2.length) {
            BasemanService.notice("请选择需要删除的业务员", "alert-warning");
            return;
        }
        ds.dialog.confirm("是否删除？", function () {
            data.splice(selectRows1, selectRows1.length);
            $scope.options_3.api.setRowData(data);
            $scope.saveline();
        }, function () {
            $scope.newWindow.close();
        });
    }
    //把客户分配给业务员
    $scope.custtouser = function () {
        if ($scope.data.currItem.applicant == "" || $scope.data.currItem.applicant == undefined) {
            BasemanService.notice("请输入要分配给的业务员", "alert-warning");
            return;
        }
        var selectRows = $scope.selectGridGetData('options_7');
        if (!selectRows.length) {
            BasemanService.notice("请选择客户", "alert-warning");
            return;
        }
        var custids = "";
        for (var i = 0; i < selectRows.length; i++) {
            custids = selectRows[i].cust_id + "," + custids;
        }
        custids = custids.substr(0, custids.length - 1);
        var postdata = {
            cust_code: custids,
            userid: $scope.data.currItem.applicant
        };
        BasemanService.RequestPost("customer_user_relation", "insertcust", postdata)
            .then(function (data) {
                BasemanService.notice("分配完成", "alert-warning");
            });
    }
    //复制业务员到客户
    $scope.usertocust = function () {
        var selectRows = $scope.selectGridGetData('options_3');
        if (!selectRows.length) {
            BasemanService.notice("请选择业务员", "alert-warning");
            return;
        }
        var sysuserid="";
        for (var i = 0; i < selectRows.length; i++) {
            sysuserid = selectRows[i].sysuserid + "," + sysuserid;
        }
        sysuserid = sysuserid.substr(0, sysuserid.length-1);

        $scope.FrmInfo = {
            title: "复制业务员到客户",
            is_custom_search: true,
            is_high: true,
            thead: [{
                name: "SAP编码",
                code: "sap_code",
                show: true,
                iscond: true,
                type: 'string'

            },{
                name: "客户编码",
                code: "cust_code",
                show: true,
                iscond: true,
                type: 'string'

            }, {
                name: "客户名称",
                code: "cust_name",
                show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "业务部门",
                code: "org_name",
                show: true,
                iscond: true,
                type: 'string'

            }, {
                name: "国家",
                code: "creator",
                show: true,
                iscond: true,
                type: 'string'
            }],
            classid: "customer_user_relation",
            postdata: {flag: 3,
                userid:sysuserid,
                cust_id: selectRows[0].cust_id,
            },
            type: "checkbox"
        };
        BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (items) {
            var cust_id="";
            for (var i = 0; i < items.length; i++) {
                cust_id = items[i].cust_id + "," + cust_id;
            }
            cust_id = cust_id.substr(0, cust_id.length - 1);
            var postdata = {
                cust_id: selectRows[0].cust_id,
                userid: cust_id,
                sysuserid: sysuserid
            }
            BasemanService.RequestPost("customer_user_relation", "insertuser", postdata)
                .then(function (data) {

                });
        })
    }
    /************************网格定义区域**************************/
    var groupColumn = {
        headerName: "Group",
        width: 200,
        field: 'name',
        valueGetter: function (params) {
            if (params.node.group) {
                return params.node.key;
            } else {
                return params.data[params.colDef.field];
            }
        },
        comparator: agGrid.defaultGroupComparator,
        cellRenderer: 'group',
        cellRendererParams: {
            checkbox: true
        }
    };
    // $scope.selectcust=function () {
    //     var selectRows = $scope.selectGridGetData('options_7');
    //     var postdata = {cust_id: selectRows[0].cust_id};
    //     BasemanService.RequestPost("customer_user_relation", "search", postdata)
    //         .then(function (data) {
    //             $scope.gridSetData("options_3", data.customer_user_relations);
    //         });
    // }
    //客户表
    $scope.columns_7 = [{
        headerName: "序号", field: "seq", editable: false, filter: 'set', width: 70,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
        // action:$scope.selectcust,
        cellRenderer: function (params) {
            return colorRenderer(params)
        },
        checkboxSelection: function (params) {
            return params.columnApi.getRowGroupColumns().length === 0;
        },
        icons: {
            sortAscending: '<i class="fa fa-sort-alpha-asc"/>',
            sortDescending: '<i class="fa fa-sort-alpha-desc"/>'
        }

    }, {
        headerName: "客户id", field: "cust_id", editable: false, filter: 'set', width: 100, hide: true,
        cellEditor: "文本框",
        cellRenderer: function (params) {
            return colorRenderer(params)
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        cellRenderer: function (params) {
            return colorRenderer(params)
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        cellRenderer: function (params) {
            return colorRenderer(params)
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "业务部门", field: "org_name", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        cellRenderer: function (params) {
            return colorRenderer(params)
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "兼营部门", field: "other_org_names", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        cellRenderer: function (params) {
            return colorRenderer(params)
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "业务员", field: "creator", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        cellRenderer: function (params) {
            return colorRenderer(params)
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "国家", field: "area_name", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        cellRenderer: function (params) {
            return colorRenderer(params)
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }];
    $scope.options_7 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: true,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        rowClicked: $scope.setdata,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_7.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    //业务员表
    $scope.columns_3 = [{
        headerName: "业务员", field: "userid", editable: true, filter: 'set', width: 150,
        cellEditor: "弹出框",
        action: $scope.selectcust,
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
        checkboxSelection: function (params) {
            return params.columnApi.getRowGroupColumns().length === 0;
        },
    }, {
        headerName: "部门", field: "org_name", editable: true, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "是否有效", field: "usable", editable: false, filter: 'set', width: 150,
        cellEditor: "复选框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }];
    $scope.options_3 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: true,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_3.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('customer_user_relation', customer_user_relation);
