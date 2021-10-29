var basemanControllers = angular.module('inspinia');
function sale_package_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_package_headerEdit = HczyCommon.extend(sale_package_headerEdit, ctrl_bill_public);
    sale_package_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_package_header",
        key: "package_id",
        FrmInfo: {},
        wftempid: 10111,
        grids: [{optionname: 'options1', idname: 'sale_package_lineofsale_package_headers'},
            {optionname: 'options_21', idname: 'sale_package_headers'}]
    };
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
    $scope.headername = "包装方案制单";
    if ($scope.$state.params.ExpandValue || $scope.$state.current.url == "/sale_package_headerEdit1") {
        $scope.ExpandValue = 2;
        $scope.objconf.FrmInfo.sqlBlock = " stat in(5,99)";
        $scope.headername = "包装方案作废";
    }

    //作废方法
    $scope.docancel = function (e) {
        if ($scope.data.currItem.modify_note == undefined || $scope.data.currItem.modify_note == "") {
            BasemanService.notice("请填写作废原因!")
            return;
        }
        try {
            var msg = '确定要将' + $scope.data.currItem.package_name + '单据作废!'
            ds.dialog.confirm(msg, function () {
                if (e) e.currentTarget.disabled = true;
                $(".desabled-window").css("display", "flex");
                var postdata = {
                    package_id: $scope.data.currItem.package_id,
                    modify_note: $scope.data.currItem.modify_note,
                }
                BasemanService.RequestPost($scope.objconf.name, "cancel", postdata)
                    .then(function (data) {
                        BasemanService.notice("作废成功!");
                        $scope.data.currItem.stat = 99;
                        $(".desabled-window").css("display", "none");
                        if (e) e.currentTarget.disabled = false;
                    }, function () {
                        $(".desabled-window").css("display", "none");
                        if (e) e.currentTarget.disabled = false;
                    });
            }, function () {
                $(".desabled-window").css("display", "none");
                if (e) e.currentTarget.disabled = false;
            })
        } finally {
            $(".desabled-window").css("display", "none");
            if (e) e.currentTarget.disabled = false;
        }
    };

    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            object = {};
            object.value = data.dicts[i].dictvalue;
            object.desc = data.dicts[i].dictname;
            $scope.columns_21[3].cellEditorParams.values.push(object);
        }
    });
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "package_ware"})
        .then(function (data) {
            $scope.package_factorys = data.dicts
        })
    $scope.make_types = [{id: 1, name: "外购件"}, {id: 2, name: "自制件"}]
    $scope.package_wares = [{id: 2, name: "电子"}, {id: 3, name: "总装"}]

    $scope.pack_name = function () {
        $scope.FrmInfo = {
            classid: "sale_pack_type",
            postdata: {
                flag: 1,
            },
            sqlBlock: " usable=2 ",
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (data) {
            if (data.pack_id == undefined) {
                return
            }
            $scope.data.currItem.pack_name = data.pack_name;
            $scope.data.currItem.pack_id = data.pack_id;
            $scope.made_type_change();
        })
    }
    $scope.made_type_change = function () {
        if ($scope.data.currItem.make_type != "1") {
            return;
        }
        if ($scope.data.currItem.pack_name == "木箱") {
            $scope.data.currItem.package_desc = '原厂包装放入标准木箱';
        }
        $scope.data.currItem.inner_desc = '原厂包装';
        BasemanService.RequestPost("sale_box_maintain", "search", {
            flag: 2
        }).result.then(function (data) {
            if (data.reflist.length < 1) {
                return;
            }
            var obj = {}
            var isexists = false;
            var packlines = $scope.gridGetData("options1")
            for (var i = 0; i < data.reflist.length; i++) {
                obj = data.reflist[i]
                if (obj.flag == 1 && obj.pack_name == '木箱') {
                } else if (obj.flag == 3 && obj.pack_name == '蜂窝纸箱') {
                    $scope.data.currItem.out_code = obj.box_code;
                    $scope.data.currItem.out_desc = obj.box_name;
                    $scope.data.currItem.out_long = obj.box_long;
                    $scope.data.currItem.out_wide = obj.box_wide;
                    $scope.data.currItem.out_high = obj.box_high;
                    $scope.data.currItem.package_desc = '原厂包装放入蜂窝纸箱';
                } else if ((obj.flag == 2 || obj.flag == 4) && obj.pack_name == '蜂窝纸箱') {
                    isexists = false;
                    for (var j = 0; j < packlines.length; i++) {
                        if (packlines[j].item_code == obj.box_code) {
                            isexists = true;
                            break;
                        }
                    }
                    if (!isexists) {
                        obj.item_type = "2";
                        if (obj.box_code == "11326029000020") {
                            obj.item_type = "1";
                        }
                        obj.row_type = "1";
                    }
                    obj.seq = packlines.length + 1;
                    packlines.push(obj);
                }
            }
            $scope.gridSetData('options1', packlines);
        })
    }
    $scope.wfallstart = function () {
        var data=$scope.gridGetData("options_21");
        for(var i=0;i<data.length;i++){
            data[i].seq=i+1;
        }
        var data = $scope.selectGridGetData("options_21");
        if (!data.length) {
            BasemanService.notice("请选中要审核的数据!");
            return
        }
        var msg=[];
        for(var i=0;i<data.length;i++){
            data[i].inner_code = data[i].inner_code || "";
            data[i].inner_desc = data[i].inner_desc || "";
            data[i].out_code = data[i].out_code || "";
            data[i].out_code = data[i].out_code || "";
            data[i].package_desc = data[i].package_desc || "";
            data[i].made_type = data[i].made_type || "";
            data[i].out_long = Number(data[i].out_long || 0);
            data[i].out_wide = Number(data[i].out_wide || 0);
            data[i].out_long = Number(data[i].out_long || 0);
            data[i].out_qty = data[i].out_qty || "";
            if (data[i].inner_code == "" && data[i].inner_desc != ""
                && data[i].out_code == "" && data[i].out_code != "") {
                msg.push("第" + data[i].seq + "行的方案不能内箱和外箱都是原厂包装!")
            }else if (data[i].package_desc == "") {
                msg.push("第" + data[i].seq + "行的方案请填写包装方式!");
            }else if (data[i].made_type == "") {
                msg.push("第" + data[i].seq + "行的方案请填写生产类型!");
            }else if (data[i].inner_desc == "" && data[i].out_desc == "") {
                msg.push("第" + data[i].seq + "行的方案请填写包装箱信息!");
            }else if (data[i].inner_desc == "") {
                msg.push("第" + data[i].seq + "行的方案内箱信息请填写正确!");
            }else if (data[i].out_desc == "") {
                msg.push("第" + data[i].seq + "行的方案外箱信息请填写正确!");
            }else if (data[i].inner_desc != "" && data[i].inner_qty == ""
                && (data[i].inner_long == 0 || data[i].inner_wide == 0 || data[i].inner_hight == 0)) {
                msg.push("第" + data[i].seq + "行的方案内箱信息请填写正确!");
            }else if (data[i].out_desc != "" && data[i].out_qty == ""
                && (data[i].out_long == 0 || data[i].out_wide == 0 || data[i].out_hight == 0)) {
                msg.push("第" + data[i].seq + "行的方案外箱信息请填写正确!");
            }else if (data[i].made_type == "1") {
                if (data[i].out_code != "") {
                    if (data[i].inner_long == 0 || data[i].inner_wide == 0 || data[i].inner_hight == 0) {
                        msg.push("第" + data[i].seq + "行的方案内箱信息请填写正确!");
                    }else {
                        var requestobj = BasemanService.RequestPostNoWait("sale_package_header", "check", {package_id: data[i].package_id})
                        if (requestobj.pass) {
                            data[i].stat = 5;
                            data[i].check = 1;
                            msg.push(data[i].seq+"行提交成功");
                            $scope.options_21.api.refreshCells($scope.gridGetNodes("options_21"), ["stat", "check"]);
                        }
                    }
                } else if (data[i].out_long == 0 || data[i].out_wide == 0 || data[i].out_hight == 0) {
                    msg.push("第" + data[i].seq + "行的方案外箱信息请填写正确!");
                }else{
                    var requestobj = BasemanService.RequestPostNoWait("sale_package_header", "check", {package_id: data[i].package_id})
                    if (requestobj.pass) {
                        data[i].stat = 5;
                        data[i].check = 1;
                        msg.push(data[i].seq+"行提交成功");
                        $scope.options_21.api.refreshCells($scope.gridGetNodes("options_21"), ["stat", "check"]);
                    }
                }
            }else if (data[i].inner_desc != "" && data[i].out_desc == "" && (data[i].inner_qty || 0) < 1) {
                msg.push("第" + data[i].seq + "行的方案内箱原包装数量必须大于0!")
            }else if (data[i].out_desc != "" && data[i].inner_desc == "" && (data[i].out_qty || 0) < 1) {
                msg.push("第" + data[i].seq + "行的方案外箱原包装数量必须大于0!")
            }else{
                var requestobj = BasemanService.RequestPostNoWait("sale_package_header", "check", {package_id: data[i].package_id})
                if (requestobj.pass) {
                    data[i].stat = 5;
                    data[i].check = 1;
                    msg.push(data[i].seq+"行提交成功");
                    $scope.options_21.api.refreshCells($scope.gridGetNodes("options_21"), ["stat", "check"]);
                }
            }
        }
        if(msg.length>0){
            BasemanService.notice(msg);
        }

    }

    $scope.wfallstart1 = function () {
        var data = $scope.selectGridGetData("options_21");
        if (!data.length) {
            BasemanService.notice("请选中要审核的数据!");
            return
        }
        $scope.a_data=data;
        $scope.cur_i=0;
        $scope.wfstart_check_line();

    }
    $scope.wfstart_check_line = function () {
        var i=$scope.cur_i;
        var data= $scope.a_data;
        var str="";
        data[i].inner_code = data[i].inner_code || "";
        data[i].inner_desc = data[i].inner_desc || "";
        data[i].out_code = data[i].out_code || "";
        data[i].out_code = data[i].out_code || "";
        data[i].package_desc = data[i].package_desc || "";
        data[i].made_type = data[i].made_type || "";
        data[i].out_long = Number(data[i].out_long || 0);
        data[i].out_wide = Number(data[i].out_wide || 0);
        data[i].out_long = Number(data[i].out_long || 0);
        data[i].out_qty = data[i].out_qty || "";

        if (data[i].inner_code == "" && data[i].inner_desc != ""
            && data[i].out_code == "" && data[i].out_code != "") {
            str="第" + data[i].seq + "行的方案不能内箱和外箱都是原厂包装!";
            ds.dialog.confirm(str, function (i, data) {
                $scope.cur_i++;
                $scope.wfstart_check_line()
            }, function () {
            })
        }else if (data[i].package_desc == "") {
            str="第" + data[i].seq + "行的方案请填写包装方式!";
            ds.dialog.confirm(str, function (i, data) {
                $scope.cur_i++;
                $scope.wfstart_check_line()
            }, function () {
            })
        }else if (data[i].made_type == "") {
            str="第" + data[i].seq + "行的方案请填写生产类型!";
            ds.dialog.confirm(str, function (i, data) {
                $scope.cur_i++;
                $scope.wfstart_check_line()
            }, function () {
            })
        }else if (data[i].inner_desc == "" && data[i].out_desc == "") {
            str="第" + data[i].seq + "行的方案请填写包装箱信息!";
            ds.dialog.confirm(str, function (i, data) {
                $scope.cur_i++;
                $scope.wfstart_check_line()
            }, function () {
            })
        }else if (data[i].inner_desc == "") {
            str="第" + data[i].seq + "行的方案内箱信息请填写正确!";
            ds.dialog.confirm(str, function (i, data) {
                $scope.cur_i++;
                $scope.wfstart_check_line()
            }, function () {
            })
        }else if (data[i].out_desc == "") {
            str="第" + data[i].seq + "行的方案内箱信息请填写正确!";
            ds.dialog.confirm(str, function (i, data) {
                $scope.cur_i++;
                $scope.wfstart_check_line()
            }, function () {
            })
        }else if (data[i].inner_desc != "" && data[i].inner_qty == ""
            && (data[i].inner_long == 0 || data[i].inner_wide == 0 || data[i].inner_hight == 0)) {
            str="第" + data[i].seq + "行的方案内箱信息请填写正确!"
            ds.dialog.confirm(str, function (i, data) {
                $scope.cur_i++;
                $scope.wfstart_check_line()
            }, function () {
            })
        }else if (data[i].out_desc != "" && data[i].out_qty == ""
            && (data[i].out_long == 0 || data[i].out_wide == 0 || data[i].out_hight == 0)) {
            str="第" + data[i].seq + "行的方案外箱信息请填写正确!"
            ds.dialog.confirm(str, function (i, data) {
                $scope.cur_i++;
                $scope.wfstart_check_line()
            }, function () {
            })
        }else if (data[i].made_type == "1") {
            if (data[i].out_code != "") {
                if (data[i].inner_long == 0 || data[i].inner_wide == 0 || data[i].inner_hight == 0) {
                    str="第" + data[i].seq + "行的方案内箱信息请填写正确!";
                    ds.dialog.confirm(str, function (i, data) {
                        $scope.cur_i++;
                        $scope.wfstart_check_line();
                    }, function () {
                    })
                }
            } else if (data[i].out_long == 0 || data[i].out_wide == 0 || data[i].out_hight == 0) {
                str="第" + data[i].seq + "行的方案外箱信息请填写正确!"
                ds.dialog.confirm(str, function (i, data) {
                    $scope.cur_i++;
                    $scope.wfstart_check_line()
                }, function () {
                })
            }
        }else if (data[i].inner_desc != "" && data[i].out_desc == "" && (data[i].inner_qty || 0) < 1) {
            str="第" + data[i].seq + "行的方案内箱原包装数量必须大于0!"
            ds.dialog.confirm(str, function (i, data) {
                $scope.cur_i++;
                $scope.wfstart_check_line()
            }, function () {
            })
        }else if (data[i].out_desc != "" && data[i].inner_desc == "" && (data[i].out_qty || 0) < 1) {
            str="第" + data[i].seq + "行的方案外箱原包装数量必须大于0!"
            ds.dialog.confirm(str, function (i, data) {
                $scope.cur_i++;
                $scope.wfstart_check_line()
            }, function () {
            })
        }else{
            $scope.do_check();
        }

    }
    $scope.do_check = function () {
        var i=$scope.cur_i;
        var data=$scope.a_data;
        var requestobj = BasemanService.RequestPostNoWait("sale_package_header", "check", {package_id: data[i].package_id})
        if (requestobj.pass) {
            data[i].stat = 5;
            data[i].check = 1;
            $scope.options_21.api.refreshCells($scope.gridGetNodes("options_21"), ["stat", "check"]);
        }
        $scope.cur_i++
        if ($scope.cur_i < data.length) {
            $scope.wfstart_check_line()
        } else if ($scope.cur_i == data.length) {
            $scope.options_21.api.refreshCells($scope.gridGetNodes("options_21"), ["stat", "check"]);
            BasemanService.notice("审核完成!");
            return;
        }
    }


    $scope.getitem = function () {
        $scope.FrmInfo = {
            is_high: true,
            title: "物料查询",
            is_custom_search: true,
            thead: [
                {
                    name: "物料编码",
                    code: "itemcode",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "物料名称",
                    code: "itemname",
                    show: true,
                    iscond: true,
                    type: 'string'
                }],
            classid: "sale_package_header",
            postdata: {
                flag: 1,
            },
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (data) {
            if (data.itemid == undefined) {
                return
            }
            $scope.data.currItem.item_id = data.itemid;
            $scope.data.currItem.item_code = data.itemcode;
            $scope.data.currItem.item_desc = data.itemname;
            $scope.data.currItem.item_uom = data.itemunit;
            $scope.data.currItem.package_name = $scope.data.currItem.item_code;
        })
    }
    /*弹出框*/
    $scope.seleitem_code = function () {
        $scope.FrmInfo = {
            is_high: true,
            title: "物料查询",
            is_custom_search: true,
            thead: [
                {
                    name: "物料编码",
                    code: "itemcode",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "物料名称",
                    code: "itemname",
                    show: true,
                    iscond: true,
                    type: 'string'
                }],
            classid: "sale_package_header",
            postdata: {
                flag: 1,
            },
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (result) {
            if (result.itemid == undefined) {
                return
            }
            var data = $scope.gridGetRow("options1")
            data.item_id = result.itemid;
            data.item_code = result.itemcode;
            data.item_desc = result.itemname;
            $scope.gridUpdateRow("options1", data);
        })
    }
    $scope.additem = function () {
        var item = {
            row_type: 1,
        }
        $scope.gridAddItem("options1", item)

    }
    /*复制历史*/
    $scope.copy_history = function (flag) {
        $scope.FrmInfo = {
            classid: "sale_package_header",
            postdata: {},
        };
        if (flag == "usable") {
            $scope.FrmInfo.sqlBlock = " stat<>99"
        } else if (flag == "nousable") {
            $scope.FrmInfo.sqlBlock = " stat=99"
        }

        $scope.objTemp = {};
        HczyCommon.copyobj($scope.data.currItem, $scope.objTemp);
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (data) {
            if (data.package_id == undefined) {
                return
            }
            $scope.data.copy_history = true;
            $scope.data.currItem.package_id = data.package_id
            $scope.refresh(2);
        })
    }
    $scope.in_out_code = function (flag) {
        $scope.FrmInfo = {
            classid: "sale_box_maintain",
            postdata: {
                flag: 1,
            },
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (data) {
            if (data.box_code == undefined) {
                return
            }
            if (flag == "inner") {
                $scope.data.currItem.inner_code = data.box_code;
                $scope.data.currItem.inner_desc = data.box_name;
                $scope.data.currItem.inner_long = data.box_long;
                $scope.data.currItem.inner_wide = data.box_wide;
                $scope.data.currItem.inner_high = data.box_high;
            } else if (flag == "out") {
                $scope.data.currItem.out_code = data.box_code;
                $scope.data.currItem.out_desc = data.box_name;
                $scope.data.currItem.out_long = data.box_long;
                $scope.data.currItem.out_wide = data.box_wide;
                $scope.data.currItem.out_high = data.box_high;
            }
        })
    }
    //资金预览
    $scope.options1 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options1.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns1 = [
        {
            headerName: "序号",
            field: "seq",
            editable: false,
            filter: 'set',
            width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包辅物料", field: "item_code", editable: true, filter: 'set', width: 100,
            cellEditor: "弹出框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            action: $scope.seleitem_code,
        },
        {
            headerName: "包装辅料描述", field: "item_desc",
            editable: true, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包辅用量", field: "item_qty", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "所属箱型", field: "item_type", editable: true, filter: 'set', width: 100,
            cellEditor: "下拉框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellEditorParams: {
                values: [
                    {value: 1, desc: "内箱"}, {value: 2, desc: "外箱"}, {value: 3, desc: "单个零部件用量"}]
            },
        }
    ]

    //浏览页
    $scope.options_21 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        selectAll: true,
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
    $scope.columns_21 = [
        {
            headerName: "序号",
            field: "seq",
            editable: false,
            filter: 'set',
            width: 60,
            cellEditor: "选择框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "方案号", field: "package_id", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "方案名称", field: "package_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "状态", field: "stat", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "物料编码", field: "item_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "物料描述", field: "item_desc", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "方案类型", field: "pack_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包装方式", field: "package_desc", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "BOM包类型", field: "package_ware",
            editable: false, filter: 'set', width: 200,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: [
                    {value: 1, desc: "塑胶"}, {value: 2, desc: "电子"}, {value: 3, desc: "总装"}, {
                        value: 4,
                        desc: "两器"
                    }, {value: 5, desc: "钣金"}]
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包装工厂", field: "package_factory", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: [
                    {value: 1, desc: "塑胶"}, {value: 2, desc: "电子"}, {value: 3, desc: "总装"}, {
                        value: 4,
                        desc: "两器"
                    }, {value: 5, desc: "钣金"}]
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "生产类型", field: "made_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellEditorParams: {
                values: [
                    {value: 1, desc: "外购件"}, {value: 2, desc: "自制件"}]
            },
        },
        {
            headerName: "方案类型", field: "pack_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "内箱原包装数量", field: "inner_qty", editable: false, filter: 'set', width: 150,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "内箱包装箱编码", field: "inner_code", editable: false, filter: 'set', width: 150,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "内箱箱型名称", field: "inner_desc", editable: false, filter: 'set', width: 150,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "内箱长", field: "inner_long", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "内箱宽", field: "inner_wide", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "内箱高", field: "inner_high", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "外箱原包装数量", field: "out_qty", editable: false, filter: 'set', width: 150,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "外箱包装箱编码", field: "out_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "外箱箱型名称", field: "out_desc", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "外箱长", field: "out_long", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "外箱宽", field: "out_wide", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "外箱高", field: "out_high", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ]

    $scope.validate = function () {
        var msg = [];
        if ($scope.data.currItem.package_ware == "电子" && $scope.data.currItem.package_factory != "电子") {
            msg.push("包装工厂选择了电子,BOM包类型必须选择电子!");
        }
        if ($scope.data.currItem.package_ware == "总装" && $scope.data.currItem.package_factory == "电子") {
            msg.push("BOM包类型选择了总装,包装工厂不能选择电子");
        }
        if($scope.data.currItem.inner_code!=undefined){
            if($scope.data.currItem.inner_desc==undefined||$scope.data.currItem.inner_desc==""){
                msg.push("内机箱型名称不能为空")
            }
            if($scope.data.currItem.inner_qty==undefined||$scope.data.currItem.inner_qty==""){
                msg.push("内箱-原包装数量不能为空")
            }
            if($scope.data.currItem.inner_long==undefined||$scope.data.currItem.inner_long==""){
                msg.push("内箱-长不能为空")
            }
            if($scope.data.currItem.inner_wide==undefined||$scope.data.currItem.inner_wide==""){
                msg.push("内箱-宽不能为空")
            }
            if($scope.data.currItem.inner_high==undefined||$scope.data.currItem.inner_high==""){
                msg.push("内箱-高不能为空")
            }
        }
        if($scope.data.currItem.out_code!=undefined){
            if($scope.data.currItem.out_desc==undefined||$scope.data.currItem.out_desc==""){
                msg.push("外机箱型名称不能为空")
            }
            if($scope.data.currItem.out_qty==undefined||$scope.data.currItem.out_qty==""){
                msg.push("外箱-原包装数量不能为空")
            }
            if($scope.data.currItem.out_long==undefined||$scope.data.currItem.out_long==""){
                msg.push("外箱-长不能为空")
            }
            if($scope.data.currItem.out_wide==undefined||$scope.data.currItem.out_wide==""){
                msg.push("外箱-宽不能为空")
            }
            if($scope.data.currItem.out_high==undefined||$scope.data.currItem.out_high==""){
                msg.push("外箱-高不能为空")
            }
        }
        if (msg.length > 0) {
            BasemanService.notice(msg);
            return false;
        }
        return true;
    }

    /**----弹出框区域*---------------*/
    //界面初始化
    $scope.clearinformation = function () {
        $scope.data.currItem.stat = 1;
        $scope.data.currItem.wfid = 0;
        $scope.data.currItem.wfflag = 0;
        $scope.data.currItem.creator = window.userbean.userid;
        $scope.data.currItem.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
    };

    $scope.refresh_after = function () {
        if ($scope.data.copy_history) {
            $scope.data.currItem.package_name = $scope.objTemp.package_name;
            $scope.data.currItem.package_id = $scope.objTemp.package_id;
            $scope.data.currItem.item_uom = $scope.objTemp.item_uom;
            $scope.data.currItem.stat = $scope.objTemp.stat;
            $scope.data.currItem.wfid = $scope.objTemp.wfid;
            $scope.data.currItem.wfflag = $scope.objTemp.wfflag;
            $scope.data.currItem.creator = $scope.objTemp.creator;
            $scope.data.currItem.create_time = $scope.objTemp.create_time;
            $scope.data.currItem.item_code = $scope.objTemp.item_code;
            $scope.data.currItem.item_name = $scope.objTemp.item_name;
            $scope.data.copy_history = false;

        }
        $scope.gridSetData("options1", $scope.data.currItem.sale_package_lineofsale_package_headers);
        $scope.setgridstat($scope.data.currItem.stat);
    }
    /**------保存校验区域-----*/
    //数据缓存
    $scope.initdata();

    if ($location.search()) {
        if ($location.search().package_id == "undefined" || Number($location.search().package_id) == 0) {
            $scope.data.currItem.item_code = $location.search().item_code;
            $scope.data.currItem.item_desc = $location.search().item_name;
            $scope.data.currItem.item_id = $location.search().item_id;
            $scope.data.currItem.package_name = $location.search().item_code;
			$scope.data.currItem.item_uom="PC"
            var data = [];
            var object = {};
            object.seq = 1;
            object.item_code = "11326037000024";
            object.item_desc = "11326037000024";
            object.item_qty = "11326037000024";
			
            object.item_type = 2;
            data.push(object);
            $timeout(function () {
                $scope.options1.api.setRowData(data);
            })


        } else if ($location.search().package_id == undefined) {

        } else {

            $scope.data.currItem[$scope.objconf.key] = Number($location.search().package_id);
            $scope.refresh(2);

        }
    }
}

//加载控制器
basemanControllers
    .controller('sale_package_headerEdit', sale_package_headerEdit);
