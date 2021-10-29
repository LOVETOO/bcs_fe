var salemanControllers = angular.module('inspinia');
function sale_months_plan_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_months_plan_headerEdit = HczyCommon.extend(sale_months_plan_headerEdit, ctrl_bill_public);
    sale_months_plan_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_months_plan_header",
        key: "plan_id",
        wftempid: 10153,
        FrmInfo: {},
        grids: [
            {optionname: 'options_21', idname: 'sale_months_plan_lineofsale_months_plan_headers'},
        ]
    };
    /******************词汇值****************************/
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
            $scope.stats = HczyCommon.stringPropToNum(data.dicts);
        });
    /************************下拉值*****************************/
    //类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "line_type"}).then(function (data) {
            var line_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                line_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('columns_21', 'line_type')) {
                $scope.columns_21[$scope.getIndexByField('columns_21', 'line_type')].cellEditorParams.values = line_types;
            }
        });
    //冷量
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "cool_stand"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }

            $scope.columns_21[6].children[1].cellEditorParams.values.push(newobj);
        }
    })
    //面板
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "mb_stand"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }

            $scope.columns_21[6].children[6].cellEditorParams.values.push(newobj);
        }
    })
    $scope.data_froms = [
        {id: 1, name: "业务员导入"},
        {id: 2, name: "计划导入"}
    ];
    /******************页面隐藏****************************/
    $scope.show_11 = true;
    $scope.show11 = function () {
        $scope.show_11 = !$scope.show_11;
    };
    /*************************弹出框*******************************/
    //增加当前行、删除当行前
    $scope.additem = function () {
        $scope.options_21.api.stopEditing(false);
        var data = [];
        var node = $scope.options_21.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        var item = {
            seq: node.length + 1,
           line_type:2
        };
        data.push(item);
        $scope.options_21.api.setRowData(data);
        $scope.data.currItem.sale_months_plan_lineofsale_months_plan_headers = data;
    };
    //订单明细  工厂型号编码
    $scope.item_h_code11 = function () {
        var focusRow = $scope.gridGetRow("options_21");
        if (focusRow.line_type == undefined || focusRow.line_type == 0) {
            BasemanService.notice("请选择机型类型！", "alter-warning")
            return;
        }
        $scope.FrmInfo = {};
        $scope.FrmInfo.postdata = {},
            $scope.FrmInfo.postdata.flag = 2;
        $scope.FrmInfo.postdata.pro_type = parseInt(focusRow.line_type);
        BasemanService.openFrm("views/saleman/item_h_code.html", item_h_codes, $scope, "", "lg")
            .result.then(function (result) {
            focusRow.bigc_name = result.item_type_name || "";//大类
            focusRow.coolcap = parseInt(result.cool_stand||0);//冷量
            focusRow.comp_name = result.comp_name || "";//压缩机
            focusRow.molded_case = result.molded_case || "";//塑壳
            focusRow.condenser = result.condenser || "";//冷凝器
            focusRow.pt_spec = result.standinfo || "";//外机平台
            focusRow.panel = Number(result.mb_stand) || "";//款式
            focusRow.n_class = result.item_platform || "";//内机平台

            focusRow.item_h_id = result.item_h_id;
            focusRow.item_h_code = result.item_h_code;
            focusRow.item_h_name = result.item_h_name;
            $scope.gridUpdateRow("options_21", focusRow);
        });
    };
    var item_h_codes = function item_h_code($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
        localeStorageService.pageHistory($scope, function () {
            $scope.pro_item.page_info = {
                oldPage: $scope.oldPage,
                currentPage: $scope.currentPage,
                pageSize: $scope.pageSize,
                totalCount: $scope.totalCount,
                pages: $scope.pages
            }
            return $scope.pro_item
        });
        BasemanService.pageInit($scope);
        // 类型 line_type
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "line_type"}).then(function (data) {
            for (var i = 0; i < data.dicts.length; i++) {
                var newobj = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                }
                $scope.columns[2].cellEditorParams.values.push(newobj);
            }
            $scope.typelist = data.dicts;
        });
        //
        $scope.ok = function () {
            $scope.options.api.stopEditing(false);
            var data = [];
            var rowidx = $scope.options.api.getFocusedCell().rowIndex;
            var node = $scope.options.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data);
            }
            if ($scope.proitem.cust_item_name != undefined) {
                data[rowidx].cust_item_name = $scope.proitem.cust_item_name;
            }
            if ($scope.proitem.qty != undefined) {
                data[rowidx].qty = $scope.proitem.qty;
            }
            if ($scope.proitem.price != undefined) {
                data[rowidx].price = $scope.proitem.price;
            }
            if ($scope.proitem.brand_name != undefined) {
                data[rowidx].brand_name = $scope.proitem.brand_name;
            }
            if ($scope.proitem.pro_type != undefined) {
                data[rowidx].line_type = $scope.proitem.pro_type;
            }
            $scope.items = data[rowidx];
            $scope.tempArr = $scope.items;
            $modalInstance.close($scope.tempArr);
        };
        $scope.changetype = function () {
            if ($scope.proitem.pro_type == 4) {
                $scope.proitem.qty = 1;
            }

        };
        $scope.rowDoubleClicked = function () {
            $scope.options.api.stopEditing(false);
            var data = [];
            var rowidx = $scope.options.api.getFocusedCell().rowIndex;
            var node = $scope.options.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data);
            }
            if ($scope.proitem.cust_item_name != undefined) {
                data[rowidx].cust_item_name = $scope.proitem.cust_item_name;
            }
            if ($scope.proitem.qty != undefined) {
                data[rowidx].qty = $scope.proitem.qty;
            }
            if ($scope.proitem.price != undefined) {
                data[rowidx].price = $scope.proitem.price;
            }
            if ($scope.proitem.brand_name != undefined) {
                data[rowidx].brand_name = $scope.proitem.brand_name;
            }
            if ($scope.proitem.pro_type != undefined) {
                data[rowidx].line_type = $scope.proitem.pro_type;
            }
            $scope.items = data[rowidx];
            $scope.tempArr = $scope.items;
            $modalInstance.close($scope.tempArr);
        }
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.isEdit = false;
        $scope.proitem = {};
        $scope.EditStr = "新增";
        $scope.objattachs = [];

        $scope.proitem.pro_type = parseInt($scope.options_21.api.getModel().rootNode.allLeafChildren[$scope.options_21.api.getFocusedCell().rowIndex].data.line_type);
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
        $scope.options = {
            rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
            pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
            groupKeys: undefined,
            groupHideGroupColumns: false,
            enableColResize: true, //one of [true, false]
            enableSorting: true, //one of [true, false]
            enableFilter: true, //one of [true, false]
            enableStatusBar: false,
            enableRangeSelection: true,
            rowDoubleClicked: $scope.rowDoubleClicked,
            rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
            rowDeselection: false,
            quickFilterText: null,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            groupColumnDef: groupColumn,
            showToolPanel: false,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
        $scope.columns = [

            {
                headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "指导价", field: "pdm_price2", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "机型类型", field: "pro_type", editable: true, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {values: []},
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "整机编码", field: "item_h_code", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "整机名称", field: "item_h_name", editable: false, filter: 'set', width: 250,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "内机名称", field: "item_name_nj", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "外机名称", field: "item_name_wj", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "内机大小", field: "item_platform", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "压缩机型号", field: "comp_name", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "冷凝器规格", field: "condenser", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "箱体大小", field: "standinfo", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "截止阀规格", field: "jzfgg", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "工况", field: "gk", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "电源", field: "power", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "冷量等级", field: "cool_ability", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "制冷量", field: "item_cool", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "适用面板", field: "stand_conf", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "EER", field: "eer", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "冷量等级", field: "cool_ability", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "制热量", field: "item_hot", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "内外机噪音", field: "voice", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "塑壳", field: "molded_case", editable: false, filter: 'set', width: 250,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "认证", field: "authen", editable: false, filter: 'set', width: 250,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "内机风量", field: "in_air", editable: false, filter: 'set', width: 250,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "制冷剂", field: "refrigerant", editable: false, filter: 'set', width: 250,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "定速/变频", field: "power_frequency", editable: false, filter: 'set', width: 250,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "备注", field: "note", editable: false, filter: 'set', width: 250,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }


        ];
        $scope.profit_stat = true;
        $scope.show_profit = function () {
            $scope.profit_stat = !$scope.profit_stat;
        }
        $scope.show_11 = true;
        $scope.show11 = function () {
            $scope.show_11 = !$scope.show_11;
        };
        $scope._pageLoad = function (postdata) {
            if ($scope.FrmInfo.postdata) {
                for (var name in $scope.FrmInfo.postdata) {
                    postdata[name] = $scope.FrmInfo.postdata[name];
                }
            }
            if ($scope.postdata) {
                for (var name in $scope.postdata) {
                    postdata[name] = $scope.postdata[name];
                }
            }
            if ($scope.proitem.pro_type != undefined) {

                if ($scope.proitem.pro_type == 6) {
                    postdata.line_type = 6;
                    postdata.pro_type = 1;
                } else if ($scope.proitem.pro_type == 7) {
                    postdata.line_type = 7;
                    postdata.pro_type = 1;
                } else if ($scope.proitem.pro_type == 8) {
                    postdata.line_type = 8;
                    postdata.pro_type = 4;
                } else {
                    postdata.pro_type = $scope.proitem.pro_type;
                }

            }
            postdata.sqlwhere = "1=1";
            if ($scope.proitem.refrigerant != undefined) {
                postdata.sqlwhere += " and upper(pro_item_header.refrigerant) like '%" + $scope.proitem.refrigerant + "%'";
            }
            if ($scope.proitem.power_frequency != undefined) {
                postdata.sqlwhere += " and upper(pro_item_header.power_frequency) like '%" + $scope.proitem.power_frequency + "%'";
            }
            if ($scope.proitem.power != undefined) {
                postdata.sqlwhere += " and upper(pro_item_header.power) like '%" + $scope.proitem.power + "%'";
            }
            if ($scope.proitem.cool_stand != undefined) {
                postdata.sqlwhere = " and upper(pro_item_header.cool_stand) like '%" + $scope.proitem.cool_stand + "%'";
            }

            if ($scope.proitem.eer != undefined) {
                postdata.sqlwhere += " and upper(pro_item_header.eer) like '%" + $scope.proitem.eer + "%'";
            }
            if ($scope.proitem.item_hot != undefined) {
                postdata.sqlwhere += " and upper(pro_item_header.item_hot) like '%" + $scope.proitem.item_hot + "%'";
            }
            if ($scope.proitem.cop != undefined) {
                postdata.sqlwhere += " and upper(pro_item_header.cop) like '%" + $scope.proitem.cop + "%'";
            }
            if ($scope.proitem.voice != undefined) {
                postdata.sqlwhere += " and upper(pro_item_header.voice) like '%" + $scope.proitem.voice + "%'";
            }

            if ($scope.proitem.molded_case != undefined) {
                postdata.sqlwhere += " and upper(pro_item_header.molded_case) like '%" + $scope.proitem.molded_case + "%'";
            }
            if ($scope.proitem.authen != undefined) {
                postdata.sqlwhere += " and upper(pro_item_header.authen) like '%" + $scope.proitem.authen + "%'";
            }
            if ($scope.proitem.in_air != undefined) {
                postdata.sqlwhere += " and upper(pro_item_header.in_air) like '%" + $scope.proitem.in_air + "%'";
            }
            if ($scope.proitem.item_platform != undefined) {
                postdata.sqlwhere += " and upper(pro_item_header.item_platform) like '%" + $scope.proitem.item_platform + "%'";
            }
            if ($scope.proitem.item_h_code != undefined) {
                postdata.sqlwhere += " and upper(pro_item_header.item_h_code) like '%" + $scope.proitem.item_h_code + "%'";
            }
            if ($scope.proitem.item_h_name != undefined) {
                postdata.sqlwhere += " and upper(pro_item_header.item_h_name) like '%" + $scope.proitem.item_h_name + "%'";
            }
            if ($scope.proitem.item_code != undefined) {
                postdata.sqlwhere += " and  exists(select 1 from pro_item where pro_item_header.item_h_id = pro_item.item_h_id and  Upper(pro_item.item_code) like'%" + $scope.proitem.item_code + "%')";
            }
            if ($scope.proitem.item_name != undefined) {
                postdata.sqlwhere += " and  exists(select 1 from pro_item where pro_item_header.item_h_id = pro_item.item_h_id and  Upper(pro_item.item_name) like'%" + $scope.proitem.item_name + "%')";
            }

            if ($scope.proitem.condenser != undefined) {
                postdata.sqlwhere += " and upper(pro_item_header.condenser) like '%" + $scope.proitem.condenser + "%'";
            }
            if ($scope.proitem.item_cool != undefined) {
                postdata.sqlwhere += " and upper(pro_item_header.item_cool) like '%" + $scope.proitem.item_cool + "%'";
            }

            if ($scope.proitem.stand_conf != undefined) {
                postdata.sqlwhere += " and upper(pro_item_header.stand_conf) like '%" + $scope.proitem.stand_conf + "%'";
            }
            BasemanService.RequestPost("pro_item_header", "search", postdata)
                .then(function (data) {
                    for (var i = 0; i < data.pro_item_headers.length; i++) {
                        data.pro_item_headers[i].seq = (i + 1);
                    }
                    $scope.options.api.setRowData(data.pro_item_headers);
                    BasemanService.pageInfoOp($scope, data.pagination);
                });
        }
    };
    //部门options_21
    $scope.org_name = function () {
        $scope.FrmInfo = {
            classid: "scporg",
            postdata: {},
            backdatas: "orgs",
            sqlBlock: "( idpath like '%211%' or idpath like '%273%') and 1=1 and stat =2 and OrgType = 5",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            var data = [];
            var index = $scope.options_21.api.getFocusedCell().rowIndex;
            var node = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data)
            }
            data[index].org_name = result.orgname;
            data[index].org_code = result.code;
            data[index].org_id = result.orgid;
            $scope.options_21.api.setRowData(data);
            $scope.data.currItem.sale_year_sell_cale_itemofsale_year_sell_cale = data;
            $scope.data.currItem.org_name = result.orgname;
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_id = result.orgid;
        });
    };
    //大区
    $scope.area_name = function () {
        $scope.FrmInfo = {
            classid: "scporg",
            postdata: {},
            backdatas: "orgs",
            sqlBlock: "CpcOrg.Stat =2 and OrgType in (3)",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            var data = [];
            var index = $scope.options_21.api.getFocusedCell().rowIndex;
            var node = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data)
            }
            data[index].area_name = result.orgname;
            data[index].area_code = result.code;
            data[index].area_id = result.areaid;
            $scope.options_21.api.setRowData(data);
            $scope.data.currItem.sale_year_sell_cale_itemofsale_year_sell_cale = data;
        });
    };
    /***************************弹出框********************************/
    //客户
    $scope.cust_code = function () {
        $scope.FrmInfo = {
            classid: "customer",
            postdata: {},
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            HczyCommon.stringPropToNum(result);
            var data = [];
            var index = $scope.options_21.api.getFocusedCell().rowIndex;
            var node = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data)
            }
            data[index].cust_code = result.sap_code;
            data[index].cust_name = result.cust_name;
            data[index].cust_level = parseInt(result.cust_level);
            data[index].cust_id = result.cust_id;

            data[index].area_name = result.area_name;
            data[index].area_code = result.area_code;
            data[index].area_id = result.area_id;
            data[index].org_name = result.org_name;
            data[index].org_id = result.org_id;
            data[index].org_code = result.org_code;

            data[index].area_name = result.area_name;
            data[index].brand_name = result.brand_name;
            data[index].part_rate_byhand = result.part_rate_byhand;
            data[index].rebate_rate = result.rebate_rate;
            data[index].contract_subscrp = result.contract_subscrp;
            data[index].shipment_subscrp = result.shipment_subscrp;
            //area_name brand_name part_rate_byhand  //rebate_rate contract_subscrp shipment_subscrp
            $scope.options_21.api.setRowData(data);
            $scope.data.currItem.sale_months_plan_lineofsale_months_plan_headers = data;
        });
    };
    //复制行当前
    $scope.add21 = function () {
        var select_row = $scope.selectGridGetData('options_21');
        if (!select_row.length) {
            BasemanService.notice("未选中行!", "alert-warning");
            return;
        }
        var msg = [];
        if (select_row.length > 1) {
            msg.push("不能选择拆分的行数大于1行");
        }
        if (msg.length > 0) {
            BasemanService.notice(msg)
            return
        }
        var datachose = select_row[0];
        BasemanService.openFrm("views/Pop_copy_Line.html", PopCopyLineController, $scope)
            .result.then(function (result) {
            var spiltRow = new Array(result.lines);
            for (i = 0; i < result.lines; i++) {
                spiltRow[i] = new Object();
                for (var name in datachose) {
                    spiltRow[i][name] = datachose[name];
                }
            }
            $scope.selectGridDelItem('options_21');//删除勾选行的数据
            for (var i = 0; i < result.lines; i++) {
                $scope.gridAddItem('options_21', spiltRow[i])
            }

        });
    };
    //复制明细
    $scope.additem21 = function () {
        if ($scope.data.currItem.org_id == undefined || $scope.data.currItem.org_id == "") {
            BasemanService.notice("业务部门不能为空", "alert-warning")
            return;
        }
        $scope.FrmInfo = {
            classid: "sale_months_plan_header",
            postdata: {
                sqlBlock: "stat in (5,99) and org_id=249",
            }
        };
        $scope.FrmInfo.sqlBlock = 'stat in (5,99) and org_id=' + $scope.data.currItem.org_id;
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            var postdata = {
                plan_id: result.plan_id
            };
            BasemanService.RequestPost("sale_months_plan_header", "select", postdata)
                .then(function (data) {
                    $scope.options_21.api.setRowData(data.sale_months_plan_lineofsale_months_plan_headers);
                    $scope.data.currItem.sale_months_plan_lineofsale_months_plan_headers = data.sale_months_plan_lineofsale_months_plan_headers;
                });
        });
    };
    //复制上月明细
    $scope.addmonth = function () {
        if ($scope.data.currItem.org_id == undefined || $scope.data.currItem.org_id == "") {
            BasemanService.notice("业务部门不能为空", "alert-warning")
            return;
        }
        if ($scope.data.currItem.launch_month == undefined || $scope.data.currItem.launch_month == "") {
            BasemanService.notice("发起月份不能为空", "alert-warning")
            return;
        }
        if ($scope.data.currItem.launch_year == undefined || $scope.data.currItem.launch_year == "") {
            BasemanService.notice("发起月份不能为空", "alert-warning")
            return;
        }
        $scope.FrmInfo = {
            classid: "sale_months_plan_header",
            postdata: {},
        };
        $scope.FrmInfo.sqlBlock = 'stat in (5,99) and org_id=' + $scope.data.currItem.org_id + 'and launch_month=' + $scope.data.currItem.launch_month + "and launch_year=" + $scope.data.currItem.launch_year;
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            var postdata = {
                plan_id: result.plan_id
            };
            BasemanService.RequestPost("sale_months_plan_header", "select", postdata)
                .then(function (data) {
                    $scope.options_21.api.setRowData(data.sale_months_plan_lineofsale_months_plan_headers);
                    $scope.data.currItem.sale_months_plan_lineofsale_months_plan_headers = data.sale_months_plan_lineofsale_months_plan_headers;
                });
        });
    };
    /***************************网格事件***********************/
    $scope.changetotal= function () {
        var options = "options_21";
        var _this = $(this);
        var val = _this.val();
        var nodes = $scope[options].api.getModel().rootNode.childrenAfterGroup;
        var cell = $scope[options].api.getFocusedCell()
        var field = cell.column.colDef.field;
        // var boxs = $scope.gridGetData("Cabinetoptions");
        var data = nodes[cell.rowIndex].data;
        var key = [];
        //第一月
        if (field == "o_xd_qty1") {
            data.total_qty1 = Number(val||0)+Number(data.o_xd_qty2||0)+Number(data.o_xd_qty3||0);
            key = ["total_qty1"];
        }
        if (field == "o_xd_qty2") {
            data.total_qty1 = Number(val||0)+Number(data.o_xd_qty3||0)+Number(data.o_xd_qty1||0);
            key = ["total_qty1"];
        }
        if (field == "o_xd_qty3") {
            data.total_qty1 = Number(val||0)+Number(data.o_xd_qty2)+Number(data.o_xd_qty1||0);
            key = ["total_qty1"];
        }
        //第二月
        if (field == "tw_xd_qty1") {
            data.total_qty2 = Number(val||0)+Number(data.tw_xd_qty2||0);
            key = ["total_qty2"];
        }
        if (field == "tw_xd_qty2") {
            data.total_qty2 =  Number(val||0)+Number(data.tw_xd_qty1||0);
            key = ["total_qty2"];
        }
        $scope[options].api.refreshCells(nodes, key);
    };
    /******************网格定义区域****************************/
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
    }
    //明细
    $scope.columns_21 = [
        //基本信息
        {
            headerName: "客户代码", field: "cust_code", editable: true, filter: 'set', width: 100,
            cellEditor: "弹出框",
            action: $scope.cust_code,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            checkboxSelection: function (params) {
                return params.columnApi.getRowGroupColumns().length === 0;
            },
        },
        {
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "机型类型", field: "line_type", editable: true, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "整机编码", field: "item_h_code", editable: false, filter: 'set', width: 110,
            cellEditor: "文本框",
            cellEditor: "弹出框",
            action: $scope.item_h_code11,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "整机名称", field: "item_h_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },

        {
            headerName: '压缩机',
            children: [
                {
                    headerName: "型号", field: "comp_name", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "数量", field: "comp_qty", editable: true, filter: 'set', width: 100,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "是否通用", field: "is_same", editable: true, filter: 'set', width: 100,
                    cellEditor: "复选框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }
            ]
        },

        //机型信息
        {
            headerName: '机型信息',
            children: [
                {
                    headerName: "大类", field: "bigc_name", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "冷量", field: "coolcap", editable: false, filter: 'set', width: 100,
                    cellEditor: "下拉框",
                    cellEditorParams: {values: []},
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "压缩机", field: "comp_name", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "塑壳", field: "molded_case", editable: false, filter: 'set', width: 150,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "冷凝器", field: "condenser", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "外机平台", field: "pt_spec", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "款式", field: "panel", editable: false, filter: 'set', width: 100,
                    cellEditor: "下拉框",
                    cellEditorParams: {values: []},
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "内机平台", field: "n_class", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }
            ]
        },
//预测信息
        {
            headerName: '第一月下单',
            children: [
                {
                    headerName: "上旬", field: "o_xd_qty1", editable: true, filter: 'set', width: 100,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellchange: $scope.changetotal
                },
                {
                    headerName: "中旬", field: "o_xd_qty2", editable: true, filter: 'set', width: 100,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellchange: $scope.changetotal
                },
                {
                    headerName: "下旬", field: "o_xd_qty3", editable: true, filter: 'set', width: 100,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellchange: $scope.changetotal
                },
                {
                    headerName: "合计", field: "total_qty1", editable: false, filter: 'set', width: 100,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }
            ]
        },
        {
            headerName: '排产数据',
            children: [
                {
                    headerName: "第1月", field: "o_prod_qty1", editable: true, filter: 'set', width: 100,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "发货月份", field: "o_ship_month1", editable: true, filter: 'set', width: 100,
                    cellEditor: "整数框    ",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "第2月", field: "o_prod_qty2", editable: true, filter: 'set', width: 100,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "发货月份", field: "o_ship_month2", editable: true, filter: 'set', width: 100,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "第3月", field: "o_prod_qty3", editable: true, filter: 'set', width: 100,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "发货月份", field: "o_ship_month3", editable: true, filter: 'set', width: 100,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "第4月以及以后", field: "o_prod_qty4", editable: true, filter: 'set', width: 120,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "发货月份", field: "o_ship_month4", editable: true, filter: 'set', width: 100,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }
            ]
        },

        {
            headerName: '第二月下单',
            children: [
                {
                    headerName: "上半旬", field: "tw_xd_qty1", editable: true, filter: 'set', width: 100,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellchange: $scope.changetotal
                },
                {
                    headerName: "下半旬", field: "tw_xd_qty2", editable: true, filter: 'set', width: 100,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellchange: $scope.changetotal
                },
                {
                    headerName: "合计", field: "total_qty2", editable: false, filter: 'set', width: 100,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }
            ]
        },
        {
            headerName: '排产数据',
            children: [
                {
                    headerName: "第1月", field: "tw_prod_qty1", editable: true, filter: 'set', width: 100,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "发货月份", field: "tw_ship_month1", editable: true, filter: 'set', width: 100,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "第2月", field: "tw_prod_qty2", editable: true, filter: 'set', width: 100,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "发货月份", field: "tw_ship_month2", editable: true, filter: 'set', width: 100,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "第3月以及以后", field: "tw_prod_qty3", editable: true, filter: 'set', width: 120,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "发货月份", field: "tw_ship_month3", editable: true, filter: 'set', width: 100,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }
            ]
        },

        {
            headerName: '第三月下单',
            children: [
                {
                    headerName: "下单", field: "th_xd_qty1", editable: true, filter: 'set', width: 100,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
            ]
        },
        {
            headerName: '排产数据',
            children: [
                {
                    headerName: "第1月", field: "th_prod_qty1", editable: true, filter: 'set', width: 100,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "发货月份", field: "th_ship_month1", editable: true, filter: 'set', width: 100,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "第2月及以后", field: "th_prod_qty2", editable: true, filter: 'set', width: 120,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "发货月份", field: "th_ship_month2", editable: true, filter: 'set', width: 100,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }
            ]
        }];
    $scope.options_21 = {
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
            var isGrouping = $scope.options_21.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    
 
    /*********************保存校验*****************************/
    $scope.save_before = function () {
        for (var i = 0; i < $scope.data.currItem.sale_months_plan_lineofsale_months_plan_headers.length; i++) {
            $scope.data.currItem.sale_months_plan_lineofsale_months_plan_headers[i].cool_stand = parseInt($scope.data.currItem.sale_months_plan_lineofsale_months_plan_headers[i].cool_stand);
            $scope.data.currItem.sale_months_plan_lineofsale_months_plan_headers[i].mb_stand = parseInt($scope.data.currItem.sale_months_plan_lineofsale_months_plan_headers[i].mb_stand);
        }
    };
    $scope.refresh_after = function () {
        if ($scope.data.currItem.stat == 3) {
            for (var i = 0; i < $scope.columns_21.length; i++) {
                if ($scope.columns_21[i].field == "cust_code") {
                    $scope.columns_21[i].editable = true;
                }
                if ($scope.columns_21[i].field == "line_type") {
                    $scope.columns_21[i].editable = true;
                }
                if ($scope.columns_21[i].field == "item_h_code") {
                    $scope.columns_21[i].editable = true;
                }
                var col = $scope.columns_21[i].children;
                if (col == undefined) {
                    continue;
                } else {
                    for (var j = 0; j < $scope.columns_21[i].children.length; j++) {
                        if ($scope.columns_21[i].children[j]) {
                            $scope.columns_21[i].children[j].editable = true;
                        }

                        if ($scope.columns_21[i].children[j].field == "comp_name") {
                            $scope.columns_21[i].children[j].editable = false;
                        }
                        if ($scope.columns_21[i].children[j].field == "bigc_name") {
                            $scope.columns_21[i].children[j].editable = false;
                        }
                        if ($scope.columns_21[i].children[j].field == "coolcap") {
                            $scope.columns_21[i].children[j].editable = false;
                        }
                        if ($scope.columns_21[i].children[j].field == "comp_name") {
                            $scope.columns_21[i].children[j].editable = false;
                        }
                        if ($scope.columns_21[i].children[j].field == "molded_case") {
                            $scope.columns_21[i].children[j].editable = false;
                        }
                        if ($scope.columns_21[i].children[j].field == "condenser") {
                            $scope.columns_21[i].children[j].editable = false;
                        }
                        if ($scope.columns_21[i].children[j].field == "pt_spec") {
                            $scope.columns_21[i].children[j].editable = false;
                        }
                        //panel
                        if ($scope.columns_21[i].children[j].field == "panel") {
                            $scope.columns_21[i].children[j].editable = false;
                        }
                        //n_class
                        if ($scope.columns_21[i].children[j].field == "n_class") {
                            $scope.columns_21[i].children[j].editable = false;
                        }
                        if ($scope.columns_21[i].children[j].field == "total_qty1") {
                            $scope.columns_21[i].children[j].editable = false;
                        }
                        if ($scope.columns_21[i].children[j].field == "total_qty2") {
                            $scope.columns_21[i].children[j].editable = false;
                        }
                    }
                }

            }
        }
        ;
    };
    /******************界面初始化****************************/
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            stat: 1,
            cust_id: 0,

        };
    };
    $scope.initdata();

}

//加载控制器
salemanControllers
    .controller('sale_months_plan_headerEdit', sale_months_plan_headerEdit);
