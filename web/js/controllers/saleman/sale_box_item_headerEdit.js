var basemanControllers = angular.module('inspinia');
function sale_box_item_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_box_item_headerEdit = HczyCommon.extend(sale_box_item_headerEdit, ctrl_bill_public);
    sale_box_item_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_box_item_header",
        key: "box_item_id",
        //wftempid:
        FrmInfo: {},
        wftempid: 10134,
        grids: [
            {
                optionname: 'line_options',
                idname: 'sale_box_item_lineofsale_box_item_headers'
            }, {
                optionname: 'line2_options',
                idname: 'sale_box_item_line2ofsale_box_item_headers'
            }]
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
        })
    }
    //客户
    $scope.customer = function () {
        $scope.FrmInfo = {
            classid: "customer",
            sqlBlock: "usable=2",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.cust_id = result.cust_id;
            $scope.data.currItem.cust_code = result.sap_code;
            $scope.data.currItem.cust_name = result.cust_name;
        });
    };
    $scope.getitem = function () {
        $scope.FrmInfo = {
            is_high: true,
            title: "产品查询",
            is_custom_search: true,
            thead: [
                {
                    name: "产品编码",
                    code: "item_code",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "产品名称",
                    code: "item_name",
                    show: true,
                    iscond: true,
                    type: 'string'
                },
                {
                    name: "产品型号",
                    code: "spec",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "产品简称",
                    code: "item_short_name",
                    show: true,
                    iscond: true,
                    type: 'string'
                }],
            classid: "pro_item",
            postdata: {
                flag: 4,
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


    $scope.set_as_item_seq=function () {
        var selectdatas=$scope.selectGridGetData("line_options");
        var nodes=$scope.gridGetNodes("line_options");
        for(var i=0;i<selectdatas.length;i++){
            for(var j=0;j<nodes.length;j++){
                if(nodes[j].data.item_seq==selectdatas[i].item_seq){
                    nodes[j].setSelected(true);
                }
            }
        }
    }
    /**拆分行*/
    $scope.split = function () {
        $scope.set_as_item_seq();
        var line = $scope.gridGetRow('line_options');
        var msg = [];
        if (line.box_item_qty == undefined || line.box_item_qty < 1) {
            msg.push("装箱数量不能小于1");
        }
        if (line.package_id != undefined && line.package_id > 0) {
            msg.push('该机型已经获取包装方案,不能拆分!')
        }
        if (msg.length > 0) {
            BasemanService.notice(msg)
            return
        }
        BasemanService.openFrm("views/Pop_copy_one_line.html", PopCopyLineController, $scope)
            .result.then(function (result) {
            if (result.qty == undefined || result.qty < 1) {
                return;
            }
            var spiltRow = {};
            for (var name in line) {
                spiltRow[name] = line[name];
            }
            //数量拆分
            if (Number(line.box_item_qty || 0) > Number(result.qty || 0)) {
                spiltRow.box_item_qty = Number(result.qty || 0);
                line.box_item_qty = Number(line.box_item_qty || 0) - Number(result.qty || 0);
            } else {
                spiltRow.box_item_qty = Number(line.box_item_qty || 0);
                line.box_item_qty = 0;
            }
            $scope.gridUpdateRow("line_options", line);
            $scope.gridAddItem("line_options", spiltRow);
        });
    }

    $scope.del_line=function () {
        $scope.set_as_item_seq();
        $scope.selectGridDelItem("line_options");
    }
    //获取包装方案
    $scope.get_package_name = function () {
        $scope.set_as_item_seq();
        var msg = []
        if ($scope.data.currItem.order_qty == undefined || $scope.data.currItem.order_qty < 1) {
            msg.push('请填写装柜数量!');
        }
        if ($scope.gridGetData("line_options").length == 0) {
            msg.push("没有可取的包装方案!");
        }
        if ($scope.data.currItem.box_item_id == undefined || $scope.data.currItem.box_item_id == "") {
            msg.push("请先保存!");
        }
        if (msg.length > 0) {
            BasemanService.notice(msg);
            return;
        }
        $scope.save(2);
        BasemanService.RequestPost("sale_box_item_header", "matchpackage", {
            box_item_id: $scope.data.currItem.box_item_id,
            box_item_no: $scope.data.currItem.box_item_no,
        }).then(function (result) {
            $scope.refresh(2);
            BasemanService.notice("操作完成!");
        })
    }

    //按原包装数量拆分行
    $scope.spilt_by_num = function () {
        $scope.set_as_item_seq();
        var msg = []
        if ($scope.data.currItem.order_qty == undefined || $scope.data.currItem.order_qty < 1) {
            msg.push('请填写装柜数量!');
        }
        if ($scope.gridGetData("line_options").length == 0) {
            msg.push("没有可取的包装方案!");
        }
        if ($scope.data.currItem.box_item_id == undefined || $scope.data.currItem.box_item_id == "") {
            msg.push("请先保存!");
        }
        if (msg.length > 0) {
            BasemanService.notice(msg);
            return;
        }
        $scope.save(2);
        BasemanService.RequestPost("sale_box_item_header", "matchpackage", {
            box_item_id: $scope.data.currItem.box_item_id,
            box_item_no: $scope.data.currItem.box_item_no,
            stat: 5,
        }).then(function (result) {
            $scope.refresh(2);
            BasemanService.notice("操作完成!");
        })
    }

    //汇总清单
    $scope.sum_line = function () {
        $scope.set_as_item_seq();
        var msg = [];
        if ($scope.data.currItem.box_item_id == undefined || $scope.data.currItem.box_item_id == "") {
            msg.push("请先保存!");
        }
        if ($scope.data.currItem.prod_no == undefined || $scope.data.currItem.prod_no == "") {
            msg.push("生产单号不能为空!");
        }
        if (msg.length > 0) {
            BasemanService.notice(msg);
            return;
        }
        $scope.save(2);
        BasemanService.RequestPost("sale_box_item_header", "calpackage", {
            box_item_id: $scope.data.currItem.box_item_id,
            item_code: $scope.data.currItem.item_code,
            order_qty: $scope.data.currItem.order_qty||0,
            prod_no: $scope.data.currItem.prod_no||"",
        }).then(function (result) {
            $scope.gridSetData("line_options", result.sale_box_item_lineofsale_box_item_headers);
        })
    }

    $scope.set_line_pack_name = function (flag) {
        $scope.set_as_item_seq();
        var nodes;
        if (flag == 1) {//指定选中行
            nodes = $scope.line_options.api.getSelectedNodes();
        }
        if (flag == 2) {//指定整单
            nodes = $scope.gridGetNodes("line_options");
        }
        if (nodes.length == 0) {
            return;
        }
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].data.ptype_name = $scope.data.currItem.pack_name;
        }
        $scope.line_options.api.refreshCells(nodes, ["ptype_name"])

    }

    //提取包装物料
    $scope.get_bom_line = function () {
        $scope.set_as_item_seq();
        var msg = [];
        if ($scope.data.currItem.box_item_id == undefined || $scope.data.currItem.box_item_id == "") {
            msg.push("请先保存!");
        }
        if ($scope.data.currItem.prod_no == undefined || $scope.data.currItem.prod_no == "") {
            msg.push("生产单号不能为空!");
        }
        if (msg.length > 0) {
            BasemanService.notice(msg);
            return;
        }
        $scope.save(2);
        BasemanService.RequestPost("sale_box_item_header", "getbom", {
            box_item_id: $scope.data.currItem.box_item_id,
            item_code: $scope.data.currItem.item_code,
            order_qty: $scope.data.currItem.order_qty||0,
            prod_no: $scope.data.currItem.prod_no||"",
        }).then(function (result) {
            $scope.gridSetData("line_options", result.sale_box_item_lineofsale_box_item_headers);
        })
    }

    //拆分物料
    $scope.get_split_item_code = function () {
        $scope.set_as_item_seq();
        var msg = [];
        if ($scope.data.currItem.box_item_id == undefined || $scope.data.currItem.box_item_id == "") {
            msg.push("请先保存!");
        }
        if ($scope.data.currItem.prod_no == undefined || $scope.data.currItem.prod_no == "") {
            msg.push("生产单号不能为空!");
        }
        if (msg.length > 0) {
            BasemanService.notice(msg);
            return;
        }
        $scope.save(2);
        BasemanService.RequestPost("sale_box_item_header", "getsplit", {
            box_item_id: $scope.data.currItem.box_item_id,
            item_code: $scope.data.currItem.item_code,
            order_qty: $scope.data.currItem.order_qty||0,
            prod_no: $scope.data.currItem.prod_no||"",
        }).then(function (result) {
            $scope.gridSetData("line_options", result.sale_box_item_lineofsale_box_item_headers);
        })
    }


    //取消包装方案
    $scope.del_package = function () {
        $scope.set_as_item_seq();
        if ($scope.line_options.api.getSelectedRows().length == 0) {
            BasemanService.notice("请先选择要取消包装方案的行!");
            return;
        }
        var nodes = $scope.gridGetNodes("line_options");
        var data = {}, num = 0;
        for (var i = 0; i < nodes.length; i++) {
            if (!nodes[i].selected) {
                continue;
            }
            data = nodes[i].data;
            if (data.package_id > 0) {
                num++;
            }
            data.package_name = 0;
            data.qty = 0;
            data.package_long = 0;
            data.package_wide = 0;
            data.package_high = 0;
            data.item_code2 = "";
            data.item_desc2 = "";
            data.item_qty2 = 0;
            data.package_desc = "";
            data.made_type = "";
            data.package_qty = 0;
            data.item_type = "";
            data.row_type = "";
            data.package_id = "";
            data.package_code = "";
            nodes[i].setSelected(false);
            for (var j = 0; j < nodes.length; j++) {
                if (nodes[j].data.item_code == data.item_code && i != j && nodes[j].data.item_seq == data.Item_seq) {
                    nodes[j].setSelected(true);
                }
            }
        }
        var key = ["package_name", "qty", "package_long", "package_wide", "package_high", "item_code2", "item_desc2"
            , "item_qty2", "package_desc", "made_type", "package_qty", "item_type", "row_type", "package_id", "package_code"]
        $scope.line_options.api.refreshCells(nodes, key)
        $scope.selectGridDelItem("line_options");
    }
    //取消当前机型包装方案
    $scope.cancel_package = function () {
        $scope.set_as_item_seq();
        if ($scope.line_options.api.getFocusedCell() == null) {
            return;
        }
        ;
        var nodes = $scope.gridGetNodes("line_options");
        var data = $scope.gridGetData("line_options"), num = 0;

        data.package_name = 0;
        data.qty = 0;
        data.package_long = 0;
        data.package_wide = 0;
        data.package_high = 0;
        data.item_code2 = "";
        data.item_desc2 = "";
        data.item_qty2 = 0;
        data.package_desc = "";
        data.made_type = "";
        data.package_qty = 0;
        data.item_type = "";
        data.row_type = "";
        data.package_id = "";
        data.package_code = "";
        var i = $scope.line_options.api.getFocusedCell().rowIndex;
        nodes[i].setSelected(false);
        for (var j = 0; j < nodes.length; j++) {
            if (nodes[j].data.item_code == data.item_code && i != j && nodes[j].data.item_seq == data.Item_seq) {
                nodes[j].setSelected(true);
            }
        }
        var key = ["package_name", "qty", "package_long", "package_wide", "package_high", "item_code2", "item_desc2"
            , "item_qty2", "package_desc", "made_type", "package_qty", "item_type", "row_type", "package_id", "package_code"]
        $scope.line_options.api.refreshCells(nodes, key)
        $scope.selectGridDelItem("line_options");
    }


    $scope.rowDoubleClicked43 = function (e) {
        if (e.api.getFocusedCell().column.colId == "package_name") {
            var h = document.body.offsetHeight,
                w = document.body.offsetWidth; //获取背景窗口大小
            if (!document.getElementById('divPIconfBg')) {
                var div = document.createElement('div'); //创建背景蒙板
                div.id = 'divPIconfBg';
                div.style.backgroundColor = 'white';
                div.style.position = 'absolute';
                // div.style.filter = 'alpha(opacity=80)';
                // div.style.opacity = '.80';
                div.style.zIndex = 100001;
                div.style.left = 0;
                div.style.top = 0;
                div.style.width = w + 'px';
                div.style.height = h + 'px';
                document.body.appendChild(div);

            }
            if (!document.getElementById('divPIconfBgClose')) {
                var div = document.createElement('div'); //创建关闭按钮在蒙板上
                div.id = 'divPIconfBgClose';
                div.style.backgroundColor = "#1ab394";
                //div.style.position = 'absolute';
                //div.style.backgroundImage = 'url(img/boxy_btn.png)';
                div.style.zIndex = 100003;
                div.style.left = 0;
                div.style.top = 0;
                div.style.width = w + "px";
                div.style.height = '36px';

                var divClose = document.createElement("a");
                divClose.id = "divPIconfCloseBtn";
                divClose.style.backgroundColur = "red";
                divClose.style.position = 'absolute';
                divClose.style.backgroundImage = 'url(img/boxy_btn.png)';
                divClose.style.zIndex = 100004;
                divClose.style.right = 0;
                divClose.style.top = 0;
                divClose.style.width = "120px";
                divClose.style.height = '36px';
                divClose.style.paddingTop = '10px';
                divClose.title = '关闭';
                divClose.innerHTML = "<<返回";
                divClose.style.color = 'white';
                divClose.style.font.size = "16px";
                divClose.style.cursor = 'hand';
                divClose.onclick = function () { //点击时间 ，关闭蒙板
                    fnPIconfBgClose1();
                };

                div.appendChild(divClose);

                document.getElementById('divPIconfBg').appendChild(div);
            }
            if (!document.getElementById('divPIconfBgIframe')) {
                var iframe;
                iframe = document.createElement('IFRAME'); //创建蒙板内的内嵌iframe容器，用于嵌入显示其他网页
                iframe.id = 'divPIconfBgIframe';
                iframe.frameBorder = '0';
                //iframe.scrolling = "no";
                iframe.style.overflow = 'hidden';
                iframe.allowTransparency = 'true';
                iframe.style.display = 'none';
                iframe.style.width = w + 'px'; //800
                iframe.style.height = h - 36 + 'px'; //620
                iframe.style.top = '36px'; //800
                document.getElementById('divPIconfBg').appendChild(iframe);
            }

            document.getElementById('divPIconfBgClose').style.display = 'block';
            document.getElementById('divPIconfBgIframe').style.display = 'block';

            document.getElementById('divPIconfBg').style.display = 'block';
            var data = $scope.gridGetData("line_options");
            var index = $scope.line_options.api.getFocusedCell().rowIndex;
            var pcsurl = "http://100.100.10.167:8080/web/index.jsp#/crmman/sale_package_headerEdit?package_id=" + data[index].package_id + "&item_code=" + data[index].item_code + "&item_name=" + data[index].item_name + "&item_id=" + data[index].item_id;
            document.getElementById('divPIconfBgIframe').src = pcsurl;
        }
    }

    $scope.line_cellchange = function () {
        var options = "line_options"
        var _this = $(this);
        var val = _this.val();

        var nodes = $scope[options].api.getModel().rootNode.childrenAfterGroup;
        var cell = $scope[options].api.getFocusedCell()
        var field = cell.column.colDef.field;

        var data = nodes[cell.rowIndex].data;
        var key = [];
        var refreshNodes = [];
        data[field] = val;
        if (field == "union_seq") {
            for (var i = 0; i < nodes.length; i++) {
                if (i != cell.rowIndex && nodes[i].data.item_seq == data.item_seq) {
                    nodes[i].data.union_seq = val;
                    refreshNodes.push(nodes[i]);
                }
            }
        }
        $scope[options].api.refreshCells(refreshNodes, ["union_seq"]);
    }

    //明细
    $scope.line_options = {
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
        rowDoubleClicked: $scope.rowDoubleClicked43,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.line_options.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };

    $scope.line_columns = [
        {
            headerName: "箱序号",
            field: "union_seq",
            editable: true,
            filter: 'set',
            width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            checkboxSelection: function (params) {
                // we put checkbox on the name if we are not doing no grouping
                return params.columnApi.getRowGroupColumns().length === 0;
            },
        },
        {
            headerName: "方案类型", field: "ptype_name", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
        {
            headerName: "物料编码", field: "item_code",
            editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "物料描述", field: "item_name", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "单位", field: "item_uom", editable: true, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "单台用量", field: "item_qty", editable: true, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "订单数量", field: "order_qty", editable: true, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包装方案名称", field: "package_name", editable: false, filter: 'set', width: 120,
            cellEditor: "弹出框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            // action:打开包装方案,
        },
        {
            headerName: "装箱数量", field: "box_item_qty", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
        {
            headerName: "原包装数量", field: "qty", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
        {
            headerName: "长", field: "package_long", editable: true, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
        {
            headerName: "宽", field: "package_wide", editable: true, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
        {
            headerName: "高", field: "package_high", editable: true, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
        {
            headerName: "包辅料编码", field: "item_code2", editable: true, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
        {
            headerName: "包辅料描述", field: "item_desc2", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
        {
            headerName: "包辅料用量", field: "item_qty2", editable: true, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
        {
            headerName: "包辅料所需用量", field: "package_qty", editable: true, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
        {
            headerName: "所属类型", field: "row_type", editable: true, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
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
        },
        {
            headerName: "BOM包类型", field: "package_ware", editable: true, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        }
    ]
    //BOM查询
    $scope.getBOM = function () {
        if ($scope.data.currItem.item_code == "" || $scope.data.currItem.item_code == undefined) {
            BasemanService.notice("请先选择机型编码!");
            return;
        }
        BasemanService.RequestPost("sale_pi_header", "getdeploybom", {
            item_code: String($scope.data.currItem.item_code).replace(/(^\s*)|(\s*$)/g, ""),
        }).then(function (data) {
            var bom_tree = [];
            bom_tree[0] = {};
            bom_tree[0].item_code = $scope.data.currItem.item_code;
            bom_tree[0].expanded = true;//展开
            bom_tree[0].children = [];
            for (var i = 0; i < data.sale_pi_item_h_lineofsale_pi_headers.length; i++) {
                data.sale_pi_item_h_lineofsale_pi_headers[i].expanded =false;
            }
            bom_tree[0].children = data.sale_pi_item_h_lineofsale_pi_headers;
            $scope.bom_options.api.setRowData(bom_tree);
        });
    }

    //移入打散清单
    $scope.to_break = function () {
        var boms = $scope.selectGridGetData('bom_options');
        var lines = $scope.gridGetData('line_options');
        var isexists = false;
        for (var k = 0; k < boms.length; k++) {
            isexists = false;
            for (var i = 0; i < lines.length; i++) {
                if (lines[i].item_code == boms[k].item_code && lines[i].bom_level == boms[k].pi_id) {
                    isexists = true;
                    break;
                }
            }
            if (isexists) {
                return;
            }
            $scope.gridAddItem('line_options', boms[k], undefined, true)
        }
    }

    var getNodeChildDetails = function (rowItem) {
        if (rowItem.children!=undefined&&rowItem.children.length>0) {
            return {
                group: true,
                expanded: rowItem.expanded,
                children: rowItem.children,
            };
        } else {
            return null;
        }
    }
    $scope.bom_options = {
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
        getNodeChildDetails: getNodeChildDetails,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.bom_options.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };

    $scope.bom_columns = [
        {
            headerName: "物料编码",
            field: "item_code",
            editable: false,
            filter: 'set',
            width: 300,
            cellEditor: "树状结构",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            checkboxSelection: function (params) {
                // we put checkbox on the name if we are not doing no grouping
                return params.columnApi.getRowGroupColumns().length === 0;
            },
        },
        {
            headerName: "物料名称", field: "item_name",
            editable: true, filter: 'set', width: 250,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "数量", field: "qty", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ]
    $scope.line2_options = {
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
            var isGrouping = $scope.line2_options.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.line2_columns = [
        {
            headerName: "箱序号",
            field: "union_seq",
            editable: false,
            filter: 'set',
            width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
        {
            headerName: "方案类型", field: "ptype_name", editable: false, filter: 'set', width: 100,
            cellEditor: "弹出框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
        {
            headerName: "物料编码", field: "item_code",
            editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "物料描述", field: "item_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "单位", field: "item_uom", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "单台用量", field: "item_qty", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "订单数量", field: "order_qty", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包装方案名称", field: "package_name", editable: false, filter: 'set', width: 120,
            cellEditor: "弹出框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
        {
            headerName: "原包装数量", field: "qty", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
        {
            headerName: "长", field: "package_long", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
        {
            headerName: "宽", field: "package_wide", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
        {
            headerName: "高", field: "package_high", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
        {
            headerName: "包辅料编码", field: "item_code2", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
        {
            headerName: "包辅料描述", field: "item_desc2", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
        {
            headerName: "包辅料用量", field: "item_qty2", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
        {
            headerName: "包辅料所需用量", field: "package_qty", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
        {
            headerName: "所属类型", field: "row_type", editable: true, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
        {
            headerName: "所属箱型", field: "item_type", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
        {
            headerName: "BOM包类型", field: "package_ware", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        }
    ]
    /**----弹出框区域*---------------*/
    //界面初始化
    $scope.clearinformation = function () {
    };

    /**------保存校验区域-----*/
    //数据缓存
    $scope.initdata();

}

//加载控制器
basemanControllers
    .controller('sale_box_item_headerEdit', sale_box_item_headerEdit);
