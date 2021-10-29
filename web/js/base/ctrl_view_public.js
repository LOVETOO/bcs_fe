define(
    ['module', 'controllerApi'],
    function (module, controllerApi) {

var ctrl_view_public = [
    '$rootScope', '$scope', '$location', '$modal', '$timeout', 'BasemanService', 'notify', '$state', 'localeStorageService', 'FormValidatorService',
    function ($rootScope, $scope, $location, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    //设置当前对象名及主键名，放在控制器的第一行
    //$scope.objconf = {
    //    classid: "fin_lc_allot_m_header",
    //    key: "lc_allot_m_id",
    //    classids: "fin_lc_allot_m_headers",
    //    nextStat:"gallery.fin_lc_allot_m_header",
    //    hasStats:true     //默认为true，限制是否有流程状态
    //     postdata:{
    //         sqlwhere:" confirm_stat = '2' and Funds_Type = 1 "
    //     },
    //    searchAction:"search"//查询动作
    //}

    $scope._stat_name_ = $rootScope.$state.$current.name;
    $scope.data = {};
    //初始化值转换
    if ($scope.objconf == undefined) $scope.objconf = {}; //如果$scope.objconf没有提前定义，先置为空的
    localeStorageService.pageHistory($scope, function () {
        $scope.data.currItem.page_info = {
            oldPage: $scope.oldPage,
            currentPage: $scope.currentPage,
            pageSize: $scope.pageSize,
            totalCount: $scope.totalCount,
            pages: $scope.pages
        }
        return $scope.data.currItem
    });

    $rootScope.currScope = $scope;

    BasemanService.pageInit($scope);

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
    if ($scope.filed) {
        groupColumn.field = $scope.filed;
    }

    $scope.set_stat = function () {
        var index = 0;
        for (var i = 0; i < $scope.viewColumns.length; i++) {
            if ($scope.viewColumns[i].field == "stat"&&!$scope.viewColumns[i].is_define) {
                $scope.viewColumns[i].cellEditorParams = {}
                $scope.viewColumns[i].cellEditorParams.values = [];
                BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
                    for (var k = 0; k < data.dicts.length; k++) {
                        $scope.viewColumns[i].cellEditorParams.values[k] = {
                            value: data.dicts[k].dictvalue,
                            desc: data.dicts[k].dictname,
                        }
                    }
                })
                break;
                ;
            }
        }
    }

    $scope.setitemline1 = function (data) {
        if (!data) return;
        for (var i = 0; i < $scope.objconf.grids.length; i++) {

            if ($scope[$scope.objconf.grids[i].optionname].api) {
                if ($scope.objconf.grids[i].line) {
                    if (data[$scope.objconf.grids[i].idname] && data[$scope.objconf.grids[i].idname][0] && data[$scope.objconf.grids[i].idname][0][$scope.objconf.grids[i].line.idname]) {
                        var griddata = data[$scope.objconf.grids[i].idname][0][$scope.objconf.grids[i].line.idname];
                        $scope[$scope.objconf.grids[i].line.optionname].api.setRowData(griddata);
                    }
                }
                var griddata = data[$scope.objconf.grids[i].idname];
                $scope[$scope.objconf.grids[i].optionname].api.setRowData(griddata);

            }
        }

    };
    $scope.rowDoubleClicked_view = function () {
        var index = $scope.viewOptions.api.getFocusedCell().rowIndex;
        var node = $scope.viewOptions.api.getModel().rootNode.childrenAfterSort;
        var url_param = node[index].data.url_param;
        var href = "#/crmman/" + $scope.objconf.nextStat + "?param=" + url_param;
        for (var i = 0; i < $scope.viewColumns.length; i++) {
            if ($scope.viewColumns[i].cellRenderer) {
                window.location.href = href;
            }
        }

    }
    $scope.viewOptions = {
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
        rowDoubleClicked: $scope.rowDoubleClicked_view,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.viewOptions.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    //新增
    $scope.new = function () {
        //跳转
        $scope.objconf.nextStat = "crmman." + $scope.objconf.nextStat;
        localeStorageService.remove($scope.objconf.nextStat);
        //localeStorageService.set($scope.objconf.nextStat);
        $state.go($scope.objconf.nextStat);
    };

    //跳转编辑
    $scope.edit = function () {
        if ($scope.viewOptions.api.getFocusedCell() == undefined) {
            BasemanService.notice("请先选中一行", "alert-warning")
            return;
        }
        var rowIndex = $scope.viewOptions.api.getFocusedCell().rowIndex
        var data = $scope.data.currItem.contains[rowIndex];
        /**
         if (data.stat != 1 && data.stat != undefined) {
            BasemanService.notice("该单据在流程中，不可编辑", "alert-warning")
            return;
        }
         if ($scope.userbean.userid != data.creator && data.creator != undefined && data.creator.length > 0) {
            BasemanService.notice("该单据是【" + data.creator + "】所创建，请不要编辑", "alert-warning")
            return;
        }*/

        $scope.editobj = data;
        $scope.editobj.isEdit = true; //编辑设置为true
        //$scope.editobj.identify=1;
        if ($scope.objconf.editData != undefined) {
            for (var name in $scope.objconf.editData) {
                $scope.editobj[name] = $scope.objconf.editData[name];
            }
        }
        localeStorageService.set($scope.objconf.nextStat, $scope.editobj);
        $state.go($scope.objconf.nextStat);
    };
    //高级查询方法
    $scope.init_table = function () {
        $scope.FrmInfo = {
            is_high: true,
            classid: $scope.objconf.classid, //Search请求类---主表
            type: 'sqlback', //单选或多选，默认''单选
            sqlBlock: $scope.objconf.sqlBlock //强制性的过滤条件，默认空
        }
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            if (result.sqlwhere) {
                $scope.highsql = result.sqlwhere;
            }
            $scope.search();
        });
    };

    $scope.getIndexByField = function (columns, field) {
        for (var i = 0; i < $scope[columns].length; i++) {
            if ($scope[columns][i].field == field) {
                return i;
                break;
            }
        }
        return false

    }
    /**
     * 占用refresh_after 方法 在刷新之后会被调用
     */
    //查询
    $scope._pageLoad = function (postdata, e, init_sql) {
        if (e != undefined) e.target.disable = true;
        var action = $scope.objconf.searchAction || "search";
        if ($scope.search_before && typeof $scope.search_before == "function") {
            $scope.search_before();
        }
        postdata = postdata || {};
        if ($scope.objconf.postdata != undefined) {
            for (name in $scope.objconf.postdata) {
                postdata[name] = $scope.objconf.postdata[name];
            }
        }

        if (postdata && !init_sql) {
            if ($scope.highsql) {
                //高级查询
                postdata.sqlwhere = '(' + $scope.highsql + ')';
            } else {
                /**获取查询条件*/
                var array_condition = [];
                var allcolmun = $scope.viewOptions.columnApi.getAllColumns();
                for (var i = 1; i < allcolmun.length; i++) {
                    if (allcolmun[i].colId != "queue") { //序号列不做为条件
                        array_condition.push(allcolmun[i].colId);
                    }
                }
                if (BasemanService.getSqlWhere(array_condition, $scope.searchtext)) {
                    // postdata.sqlwhere = '(' + BasemanService.getSqlWhere(array_condition, $scope.searchtext) + ')';
                    postdata.sqlwhere = '(' + $scope.getSqlWhere() + ')';
                }
            }
        }

        if ($scope.objconf.postdata && $scope.objconf.postdata.sqlwhere) {
            if (postdata.sqlwhere) {
                postdata.sqlwhere = '(' + postdata.sqlwhere + ') and (' + $scope.objconf.postdata.sqlwhere + ')'
            } else {
                postdata.sqlwhere = $scope.objconf.postdata.sqlwhere;
            }
        }

        postdata.sqlwhere = postdata.sqlwhere || '(1=1)';
        if (init_sql) {
            postdata.sqlwhere = postdata.sqlwhere + ' and (' + init_sql + ')';
        }
        $(".desabled-window").css("display", "flex");
        BasemanService.RequestPost($scope.objconf.classid, action, postdata)
            .then(function (data) {
                $scope.data.currItem.contains = data[$scope.objconf.classids];
                for (var i = 0; i < $scope.data.currItem.contains.length; i++) {
                    $scope.data.currItem.contains[i].queue = (i + 1); //序号列赋值
                    $scope.data.currItem.contains[i].nextStat = $scope.objconf.nextStat;
                    var dph = $scope.data.currItem.contains[i];

                    $.base64.utf8encode = true;
                    var param = {id: $scope.data.currItem.contains[i][$scope.objconf.key], userid: window.strUserId}
                    dph.url_param = $.base64.btoa(JSON.stringify(param), true);

                }
                //$scope.viewOptions.api.setRowData($scope.data.currItem.contains);
                $scope.viewGrid.setRowData([]);
                $scope.viewGrid.setRowData($scope.data.currItem.contains);
                //重绘网格
                $scope.viewGrid.render();
                if (data.pagination.length > 0) {
                    BasemanService.pageInfoOp($scope, data.pagination);
                }
                //高级查询结束，销毁语句
                delete $scope.highsql;
                if (e != undefined) e.target.disable = false;
                $(".desabled-window").css("display", "none");
            }, function (error) {
                if (e != undefined) e.target.disable = false;
                $(".desabled-window").css("display", "none");
            });
    };
    $scope.getSqlWhere = function () {
        var sqlWhere = "";
        var col;
        var searchText=$scope.searchtext.trim().toLowerCase();
        for (var i = 0; i < $scope.viewColumns.length; i++) {
            col=$scope.viewColumns[i];
            if($scope.viewColumns[i].children){
                for(var j=0;j<$scope.viewColumns[i].children.length;j++){
                    col=$scope.viewColumns[i].children[j];
                    if (col.cellEditor.name == "DateCellEditor" || col.cellEditor.name == "DatetimeCellEditor") {
                        sqlWhere += " or lower(to_char(" + col.field + ",'yyyy-mm-dd hh24:mi:ss')) like '%" + searchText + "%'"
                        continue;
                    }
                    sqlWhere += " or lower(" + col.field + ") like '%" + searchText + "%'";

                }
                continue;}
            if ($scope.viewColumns[i].cellRenderer == "链接渲染" || $scope.viewColumns[i].field == "queue" || $scope.viewColumns[i].field.length == 0) {
                continue;
            }
            if (col.cellEditor.name == "DateCellEditor" || col.cellEditor.name == "DatetimeCellEditor") {
                sqlWhere += " or lower(to_char(" + col.field + ",'yyyy-mm-dd hh24:mi:ss')) like '%" + searchText + "%'"
                continue;
            }
            sqlWhere += " or lower(" + col.field + ") like '%" + searchText + "%'";
        }
        if (sqlWhere.length == 0) {
            sqlWhere = " 1=1 ";
        } else {
            sqlWhere = sqlWhere.substring(3, sqlWhere.length);
        }
        return sqlWhere;

    }

    if (window.userbean) {
        $scope.userbean = window.userbean;
    }

    $scope.initData = function () {
        //处理参数，参数优先
        if ($location.search().param != undefined) {

            //var x = $location.search().param;
            $.base64.utf8encode = true;
            //var y = $.base64.atob(x, true);

            var x = JSON.parse($.base64.atob($location.search().param, true));
            if (x) { //记录参数
                $scope.page_param = x;
                if ($scope.page_param.showmode != undefined) { //如果含有showmode则记录下root
                    $rootScope.showmode = $scope.page_param.showmode;
                }
            }
            if (x.initsql) {
                //$scope.autosearch(x.initsql);

                $scope._pageLoad({}, undefined, x.initsql);
            }

            //清除参数
        } else {
            $scope.set_stat();
            var temp = localeStorageService.getHistoryItem($rootScope.$state.$current.name);
            if (temp) {
                $scope.data.currItem = temp;
                $timeout(function () {
                    $scope.setitemline1($scope.data.currItem);
                })

                $scope.oldPage = temp.page_info.oldPage;
                $scope.currentPage = temp.page_info.currentPage;
                $scope.pageSize = temp.page_info.pageSize;
                $scope.totalCount = temp.page_info.totalCount;
                $scope.pages = temp.page_info.pages;
            }
        }
    }
}];

        return controllerApi.controller({
            module: module,
            controller: ctrl_view_public
        });
});