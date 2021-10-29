var salemanControllers = angular.module('inspinia');
function base_userright($scope, $location, $http, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {
    //继承基类方法
    base_userright = HczyCommon.extend(base_userright, ctrl_bill_public);
    base_userright.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "base_userright",
        key: "sysuserid",
        // wftempid: 10082,
        FrmInfo: {},
        grids: [
            {
                optionname: 'options_11',
                istree:true,
                idname: 'orgs'
            },
            {
                optionname: 'options_12',
                idname: 'userofscporgs'
            }]
    };
    $scope.search = function () {
        BasemanService.RequestPost("scporg", "getorguserlev", {})
            .then(function (data) {
                var shift = [];
                shift[0] = {};
                shift[0].folder = true;
                shift[0].open = true;
                shift[0].children = [];
                //循环递归处理树状数据结构
                $scope.callback(data.orgs);
                for (var i = 0; i < data.orgs.length; i++) {
                    if (data.orgs[i].childrens) {
                        delete data.orgs[i].childrens;
                    }
                }
                shift[0].children = data.orgs;
                $scope.options_11.api.setRowData(shift[0].children);
                $scope.data.currItem.orgs = shift[0].children;
            });
    };
    $scope.rowClicked11 = function (e) {
        if (e == undefined) {
            var forcusRow = $scope.gridGetRow('options_11');
            if (!forcusRow) {
                $scope.gridSetData('options_12', []);
                return;
            }
            $scope.gridSetData('options_12', forcusRow.userofscporgs);
            return
        }
        if (e.data) {
            if (e.data.userofscporgs == undefined) {
                e.data.userofscporgs = []
            }
            $scope.gridSetData('options_12', e.data.userofscporgs);
        }
    };
    //权限
    $scope.rowClicked12 = function (e) {
        if (e == undefined) {
            var forcusRow = $scope.gridGetRow('options_11');
            if (!forcusRow) {
                $scope.gridSetData('options_12', []);
                return;
            }
            $scope.gridSetData('options_12', forcusRow.orgs);
            return
        }
        if (e.data) {
            $scope.postdata = {};
            $scope.postdata.sysuserid = e.data.sysuserid;
            $scope.postdata.orgid = e.data.orgid;
            $scope.postdata.userid = e.data.userid;
            BasemanService.openFrm("views/baseman/userright.html", userright, $scope, "", "lg")
                .result.then(function (items) {

            });
        }
    };
    var userright = function userright($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
        userright = HczyCommon.extend(userright, ctrl_bill_public);
        userright.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
        $scope.objconf = {
            name: "base_userright",
            key: "sysuserid",
            FrmInfo: {},
            grids: [
                {
                    optionname: 'options_13',
                    idname: 'base_userrights'
                },
                {
                    optionname: 'options_14',
                    idname: 'base_userright3s'
                }, {
                    optionname: 'options_15',
                    idname: 'base_userright2s'
                },
                {
                    optionname: 'options_16',
                    idname: 'base_userright4s'
                }]
        };
        localeStorageService.pageHistory($scope, function () {
            $scope.data.currItem.page_info = {
                postdata: $scope.postdata
            };
            return $scope.data.currItem
        });
        BasemanService.pageInit($scope);
        //分组功能
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
            cellRendererParams: function (params) {
            }
        };
        $scope.options_13 = {
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
            rowClicked: undefined,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            groupColumnDef: groupColumn,
            showToolPanel: false,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_13.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
        $scope.columns_13 = [
            {
                headerName: "部门",
                field: "org_code",
                editable: false,
                filter: 'set',
                width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "部门名称",
                field: "org_name",
                editable: false,
                filter: 'set',
                width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "更新人",
                field: "updator",
                editable: true,
                filter: 'set',
                width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "更新时间",
                field: "update_time",
                editable: true,
                filter: 'set',
                width: 120,
                cellEditor: "年月日",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];
        $scope.options_14 = {
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
            rowClicked: undefined,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            groupColumnDef: groupColumn,
            showToolPanel: false,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_14.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
        $scope.columns_14 = [
            {
                headerName: "客户编码",
                field: "cust_code",
                editable: false,
                filter: 'set',
                width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "客户名称",
                field: "cust_name",
                editable: false,
                filter: 'set',
                width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "更新人",
                field: "updator",
                editable: true,
                filter: 'set',
                width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "更新时间",
                field: "update_time",
                editable: true,
                filter: 'set',
                width: 120,
                cellEditor: "年月日",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];
        $scope.options_15 = {
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
            rowClicked: undefined,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            groupColumnDef: groupColumn,
            showToolPanel: false,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_15.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
        $scope.columns_15 = [
            {
                headerName: "用户",
                field: "userid",
                editable: false,
                filter: 'set',
                width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "更新人",
                field: "updator",
                editable: true,
                filter: 'set',
                width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "更新时间",
                field: "update_time",
                editable: true,
                filter: 'set',
                width: 120,
                cellEditor: "年月日",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];
        $scope.options_16 = {
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
            rowClicked: undefined,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            groupColumnDef: groupColumn,
            showToolPanel: false,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_16.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
        $scope.columns_16 = [
            {
                headerName: "仓库编码",
                field: "wh_code",
                editable: true,
                filter: 'set',
                width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "仓库名称",
                field: "wh_name",
                editable: true,
                filter: 'set',
                width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "更新人",
                field: "updator",
                editable: true,
                filter: 'set',
                width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "更新时间",
                field: "update_time",
                editable: true,
                filter: 'set',
                width: 120,
                cellEditor: "年月日",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];
        $scope.profit_stat = true;
        $scope.show_profit = function () {
            $scope.profit_stat = !$scope.profit_stat;
        };

        //部门
        $scope.addline13 = function () {
            $scope.FrmInfo = {
                classid: "scporg",
                postdata: {},
                backdatas: "orgs",
                sqlBlock: "OrgType = 5",
                type: "checkbox"
            };
            BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (items) {
                var lcs = $scope.gridGetData("options_13");
                var isExists = false;
                for (var i = 0; i < items.length; i++) {
                    var isExists = HczyCommon.isExist(lcs, items[i], ["org_name"], ["orgname"]).exist;
                    if (isExists) {
                        continue;
                    }
                    items[i].org_name = items[i].orgname;
                    items[i].org_code = items[i].code;
                    items[i].org_id = items[i].right_id;
                    items[i].right_type = 3;
                    $scope.gridAddItem('options_13', items[i]);
                }

            })
        };
        //客户
        $scope.addline14 = function () {
            $scope.FrmInfo = {
                classid: "customer",
                postdata: {},
                // backdatas: "users",
                type: "checkbox"
            };
            BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (items) {
                var lcs = $scope.gridGetData("options_14");
                var isExists = false;
                for (var i = 0; i < items.length; i++) {
                    var isExists = HczyCommon.isExist(lcs, items[i], ["cust_id", "cust_name"], ["cust_id", "cust_name"]).exist;
                    if (isExists) {
                        continue;
                    }
                    items[i].cust_name = items[i].cust_name;
                    items[i].cust_code = items[i].cust_code;
                    items[i].cust_id = items[i].right_id;
                    items[i].right_type = 3;
                    // items[i].sysuserid = items[i].sysuserid;
                    $scope.gridAddItem('options_14', items[i]);
                }

            })
        };
        //用户
        $scope.addline15 = function () {
            $scope.FrmInfo = {
                classid: "scpuser",
                postdata: {},
                type: "checkbox",
                backdatas: "users",
            };
            BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (items) {
                var lcs = $scope.gridGetData("options_15");
                var isExists = false;
                for (var i = 0; i < items.length; i++) {
                    var isExists = HczyCommon.isExist(lcs, items[i], ["userid", "username"], ["userid", "username"]).exist;
                    if (isExists) {
                        continue;
                    }
                    items[i].username = items[i].username;
                    items[i].userid = items[i].userid;
                    items[i].sysuserid = items[i].right_id;
                    items[i].right_type = 3;
                    $scope.gridAddItem('options_15', items[i]);
                }

            })
        };
        //仓库
        $scope.addline16 = function () {
            $scope.FrmInfo = {
                classid: "po_warehouse",
                postdata: {},
                type: "checkbox",
                backdatas: "po_warehouses"
            };
            BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (items) {
                var lcs = $scope.gridGetData("options_16");
                var isExists = false;
                for (var i = 0; i < items.length; i++) {
                    var isExists = HczyCommon.isExist(lcs, items[i], ["wh_id"], ["wh_id"]).exist;
                    if (isExists) {
                        continue;
                    }
                    items[i].wh_code = items[i].wh_code;
                    items[i].wh_name = items[i].wh_name;
                    items[i].wh_id = items[i].right_id;
                    items[i].right_type = 3;
                    // items[i].sysuserid = items[i].sysuserid;
                    $scope.gridAddItem('options_16', items[i]);
                }

            })
        };
        $scope.clearinformation = function () {
            $scope.search();
        };
        $scope.search = function () {
            var postdata = {
                sysuserid: $scope.postdata.sysuserid
            };
            BasemanService.RequestPost("base_userright", "getuserright", postdata)
                .then(function (data) {
                    $scope.options_13.api.setRowData(data.base_userrights);
                    $scope.data.currItem.base_userrights = data.base_userrights;
                    $scope.options_14.api.setRowData(data.base_userright3s);
                    $scope.data.currItem.base_userright3s = data.base_userright3s;
                    $scope.options_15.api.setRowData(data.base_userright2s);
                    $scope.data.currItem.base_userright2s = data.base_userright2s;
                    $scope.options_16.api.setRowData(data.base_userright4s);
                    $scope.data.currItem.base_userright4s = data.base_userright4s;
                    if(data.flag1==2){$scope.data.currItem.usable_orgid=2;}
                    if(data.flag2==2){$scope.data.currItem.usable_custid=2;}
                    if(data.flag3==2){$scope.data.currItem.usable_userid=2;}
                    if(data.flag4==2){ $scope.data.currItem.usable_lev=2;}
                  
                });
        };
        //保存
        $scope.save = function () {
            var postdata={};
            postdata.base_userrights=$scope.gridGetData("options_13")||[];
            postdata.base_userright3s=$scope.gridGetData("options_14")||[];
            postdata.base_userright2s=$scope.gridGetData("options_15")||[];
            postdata.base_userright4s=$scope.gridGetData("options_16")||[];
            if($scope.data.currItem.usable_orgid==2){
                postdata.flag1=2;
            }else{postdata.flag1=0;}
            if($scope.data.currItem.usable_custid==2){
                postdata.flag2=2;
            }else{postdata.flag2=0;}
            if($scope.data.currItem.usable_userid==2){
                postdata.flag3=2;
            }else{postdata.flag3=0;}
            if($scope.data.currItem.usable_lev==2){
                postdata.flag4=2;
            }else{postdata.flag4=0;}
            postdata.sysuserid = $scope.postdata.sysuserid;
            BasemanService.RequestPost("base_userright", "update", postdata)
                .then(function (data) {
                    BasemanService.notice("保存成功！", "alert-info");
                });
        };
        $scope.initdata();
    };
    //初始化
    $scope.clearinformation = function () {
        $scope.search();
    };
    //递归方法 循环递归处理树状数据结构
    $scope.callback = function (array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].childrens) {
                array[i].children = array[i].childrens;
                array[i].folder = true;
            }
            if (array[i].childrens) {
                for (var j = 0; j < array[i].childrens.length; j++) {
                    if (array[i].childrens[j].childrens) {
                        array[i].childrens[j].children = array[i].childrens[j].childrens;
                        array[i].childrens[j].folder = true;
                        $scope.callback(array[i].childrens[j].childrens);
                    }
                }
            }
        }
    }
    /**网格配置*/
    {
        //分组功能
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
            cellRendererParams: function (params) {
            }
        };


        $scope.options_11 = {
            rowSelection: 'multiple',
            enableColResize: true,
            enableSorting: true,
            rowClicked: $scope.rowClicked11,
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            rowHeight: 25,
            getNodeChildDetails: function (file) {
                if (file.folder) {
                    return {
                        group: true,
                        children: file.children,
                        expanded: file.open
                    };
                } else {
                    return null;
                }
            },
            icons: {
                groupExpanded: '<i class="fa fa-minus-square-o"/>',
                groupContracted: '<i class="fa fa-plus-square-o"/>',
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
        $scope.columns_11 = [
            {
                headerName: "部门编码", field: "code", editable: false, filter: 'set', width: 120,
                // checkboxSelection: function (params) {
                //     // we put checkbox on the name if we are not doing no grouping
                //     return params.columnApi.getRowGroupColumns().length === 0;
                // },
                cellEditor: "树状结构"
            }, {
                headerName: "部门名称", field: "orgname", editable: false, filter: 'set', width: 240,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];
        $scope.options_12 = {
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
            // rowClicked: $scope.rowClicked12,
            rowDoubleClicked: $scope.rowClicked12,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            groupColumnDef: groupColumn,
            showToolPanel: false,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_12.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
        $scope.columns_12 = [
            {
                headerName: "名称",
                field: "username",
                editable: false,
                filter: 'set',
                width: 125,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "代号",
                field: "userid",
                editable: false,
                filter: 'set',
                width: 125,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "用户",
                field: "itype",
                editable: false,
                filter: 'set',
                width: 110,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [
                        {
                            value: 1,
                            desc: "机构"
                        }, {
                            value: 2,
                            desc: "用户"
                        }]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];

    }
    $scope.initdata();
}//加载控制器
salemanControllers
    .controller('base_userright', base_userright);
