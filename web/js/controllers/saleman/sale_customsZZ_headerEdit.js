var billmanControllers = angular.module('inspinia');
function sale_customsZZ_headerEdit($scope, $location, $http, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {

    //继承基类方法
    sale_customsZZ_headerEdit = HczyCommon.extend(sale_customsZZ_headerEdit, ctrl_bill_public);
    sale_customsZZ_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_customs_header",
        key: "customs_id",
        wftempid: 10079,
        FrmInfo: {
            sqlBlock: " bill_type=2 and stat=5 ",
        },
        grids: [
            {//船务信息
                optionname: 'cntoptions',
                idname: 'sale_customs_h_lineofsale_customs_headers',
                line: {
                    optionname: 'cntlineoptions',
                    idname: 'sale_customs_lineofsale_customs_h_lines'
                }
            }, {//单证信息
                optionname: 'aoptions',
                idname: 'sale_ship_notice_sap_lineofsale_customs_headers'
            }
        ]
    };
    // 预报关单
    $scope.headername = "预报关单转正";

    if ($scope.$state.current.url == "/sale_customsDJ_headerEdit") {
        $scope.ExpandValue = 1;
        $scope.MenuTag = 9;
        $scope.objconf.FrmInfo.sqlBlock = "stat  in (2,3,4,5) and bill_type=1 ";
        $scope.headername = "登记报关单号";
    }

    $scope.save_before = function () {
        if ($scope.ExpandValue = 1 && $scope.MenuTag == 9) {
            $scope.data.currItem.flag = 10
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


        //cntoptions
        {

            $scope.getMaxId = function (datas) {
                var maxid = -9;
                for (var i = 0; i < datas.length; i++) {
                    if (Number(datas[i].customs_h_id) < maxid) {
                        maxid = datas[i].customs_h_id;
                    }
                }
                return maxid
            }

            $scope.delcntitem = function () {
                var data = $scope.gridGetRow('cntoptions')
                if (ExpandValue != 2) {
                    if (data.contract_no != undefined && data.contract_no != "") {
                        return;
                    }
                }
                $scope.gridDelItem('cntoptions')
                $scope.gridSetData('cntlineoptions', []);
            }
            $scope.addcntitem = function () {

                if ($scope.data.currItem.warn_no == "" || $scope.data.currItem.warn_no == undefined) {
                    BasemanService.notice("请先选择出货预告号!", "alter-warning");
                    return;
                }
                $scope.FrmInfo = {
                    is_high: true,
                    title: "产品查询",
                    is_custom_search: true,
                    thead: [
                        {
                            name: "AB票",
                            code: "ab_votes",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "产品名称",
                            code: "item_h_name",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "数量",
                            code: "qty",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }],
                    classid: "sale_customs_header",
                    postdata: {
                        flag: 12,
                    },
                    type: "checkbox",
                    action: "baoguangzjnew3",
                    searchlist: ["ab_votes", "item_name", "qty"],
                    backdatas: "sale_customs_h_lineofsale_customs_headers",
                };
                if ($scope.data.currItem.warn_id != undefined) {
                    $scope.FrmInfo.postdata.warn_id = $scope.data.currItem.warn_id;
                }
                if ($scope.data.currItem.notice_id != undefined) {
                    $scope.FrmInfo.postdata.notice_ids = $scope.data.currItem.notice_id;
                }
                if ($scope.data.currItem.ab_votes != undefined) {
                    $scope.FrmInfo.postdata.ab_votes = $scope.data.currItem.ab_votes;
                }

                BasemanService.open(CommonPopController, $scope, "", "lg")
                    .result.then(function (items) {
                    if (items.length) {
                        if (items.length = undefined || items.length == 0) {
                            return;
                        }
                        var datas = $scope.gridGetData("cntoptions")
                        var totaldatas = datas.concat(items)
                        for (var i = 0; i < items.length; i++) {
                            items[i].new_row = 2
                            items[i].line_type = items[i].pro_type
                            items[i].item_h_name = items[i].item_name
                            items[i].customs_h_id = $scope.getMaxId(totaldatas)
                            items[i].customs_qty = items[i].qty
                            items[i].x_qty = items[i].box_qty
                            items[i].tj = items[i].amt
                            items[i].gw = items[i].unit_gw
                            items[i].nw = items[i].unit_nw
                            items[i].unit_tj = Number(items[i].qty || 0) * Number(items[i].tj || 0);
                            items[i].unit_gw = Number(items[i].qty || 0) * Number(items[i].unit_gw || 0);
                            items[i].unit_nw = Number(items[i].qty || 0) * Number(items[i].unit_nw || 0);
                        }
                        HczyCommon.pushUniqueRow(datas, items, ["customs_h_id", "pi_id", "item_h_code"])

                        for (var i = 0; i < data.length; i++) {
                            data[i].seq = i + 1;
                        }
                        $scope.gridGetData("cntoptions", datas)
                        //合计
                        $scope.partSummary();

                    }
                });

            }

            $scope.addnullrow = function () {
                $scope.gridAddItem("cntoptions", {new_row: 2});
            }

            $scope.mixCol = function (e) {
                var labelTxt = e.target.innerText.replace(/(^\s*)|(\s*$)/g, "");
                if (labelTxt == "冻结列") {
                    $scope["cntoptions"].columnApi.setColumnPinned("line_type", "left")
                    $scope["cntoptions"].columnApi.setColumnPinned("ab_votes", "left")
                    $scope["cntoptions"].columnApi.setColumnPinned("item_h_name", "left")
                    e.target.innerText = "解除冻结"
                } else if (labelTxt == "解除冻结") {
                    $scope["cntoptions"].columnApi.setColumnPinned("line_type", null)
                    $scope["cntoptions"].columnApi.setColumnPinned("ab_votes", null)
                    $scope["cntoptions"].columnApi.setColumnPinned("item_h_name", null)
                    e.target.innerText = "冻结列"
                }
            }

            $scope.copyother = function () {
                $scope.FrmInfo = {
                    classid: "sale_customs_header",
                    sqlBlock: "stat =99 and warn_id=" + $scope.data.currItem.warn_id || 0,
                };
                BasemanService.open(CommonPopController, $scope, "", "lg")
                    .result.then(function (items) {
                    if (items.customs_id == undefined || items.customs_id < 1) {
                        return;
                    }

                    var price_type_name = $scope.data.currItem.price_type_name;
                    var area_name = $scope.data.currItem.area_name;
                    var seaport_in_name = $scope.data.currItem.seaport_in_name;
                    var brand_name = $scope.data.currItem.brand_name;
                    var cpi_no = $scope.data.currItem.cpi_no;
                    var foby_amt = $scope.data.currItem.foby_amt;
                    var fobb_amt = $scope.data.currItem.fobb_amt;

                    $scope.data.currItem.customs_id = items.customs_id;
                    var obj = BasemanService.RequestPostNoWait("sale_customs_header", "select", {customs_id: items.customs_id})
                    $scope.data.currItem = obj.data;

                    $scope.data.currItem.copy_code = items.customs_no;
                    var msg = []
                    if (price_type_name != $scope.data.currItem.price_type_name) {
                        msg.push("当前价格条款与引用报关单的价格条款不同,引用报关单的价格条款:" + price_type_name)
                    }
                    if (area_name != $scope.data.currItem.area_name) {
                        msg.push("当前国家与引用报关单的国家不同,引用报关单的国家:" + area_name)
                    }
                    if (seaport_in_name != $scope.data.currItem.seaport_in_name) {
                        msg.push("当前目的港与引用报关单的目的港不同,引用报关单的目的港:" + seaport_in_name)
                    }
                    if (brand_name != $scope.data.currItem.brand_name) {
                        msg.push("当前品名与引用报关单的品名不同,引用报关单的品名:" + brand_name)
                    }
                    if (cpi_no != $scope.data.currItem.cpi_no) {
                        msg.push("当前合同号与引用报关单的合同号不同,引用报关单的合同号:" + cpi_no)
                    }
                    if (foby_amt != $scope.data.currItem.foby_amt) {
                        msg.push("当前FOB运费与引用报关单的FOB运费不同,引用报关单的FOB运费:" + foby_amt)
                    }
                    if (fobb_amt != $scope.data.currItem.fobb_amt) {
                        msg.push("当前FOB保费与引用报关单的FOB保费不同,引用报关单的FOB保费:" + fobb_amt)
                    }
                    if (msg.length > 0) {
                        BasemanService.notice(msg)
                    }

                });

            }
            
            //获取工厂型号
            $scope.getfacitemcode = function () {
                var data = $scope.gridGetData("cntoptions");
                var postdata = {};
                if (data.length > 0) {
                    postdata.sale_customs_h_lineofsale_customs_headers = data;
                }
                BasemanService.RequestPost("sale_customs_header", "getfacitemcode", postdata)
                    .then(function (data) {
                        $scope.gridSetData('cntoptions', data.sale_customs_h_lineofsale_customs_headers);
                    })
            };
            $scope.rowClicked = function (e) {
                if (e.data) {
                    if (e.data.sale_customs_lineofsale_customs_h_lines == undefined||e.data.sale_customs_lineofsale_customs_h_lines.length==0) {
                        var obj={}
                        HczyCommon.copyobj(e.data,obj);
                        delete obj.line_type;
                        delete obj.sale_customs_lineofsale_customs_h_lines;
                        e.data.sale_customs_lineofsale_customs_h_lines = [obj]
                    }
                    $scope.gridSetData('cntlineoptions', e.data.sale_customs_lineofsale_customs_h_lines);
                }
                //控制明细行的可编辑
                var cols=$scope.cntlineoptions.columnApi.getAllColumns();
                if (e.data.new_row == '2') {
                    for(var i=0;i<cols.length;i++){
                        cols[i].colDef.editable=true;
                    }
                    var field = "";

                    for (var i = 1; i < $scope.cntcolumns.length; i++) {
                        field = $scope.cntcolumns[i].field;
                        if (field == "customs_uom" || field == "customs_amt" || field == "cust_spec") {
                            continue;
                        }
                        e.colDef.editable=true;
                    }
                } else {
                    e.colDef.editable=$scope.cntcolumns[$scope.getIndexByField("cntcolumns",e.colDef.field)].editable;
                    for(var i=0;i<cols.length;i++){
                        cols[i].colDef.editable=$scope.cntlinecolumns[$scope.getIndexByField("cntlinecolumns",cols[i].colDef.field)].editable;
                    }
                }

            };

            $scope.cntoptions = {
                rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
                pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
                groupKeys: undefined,
                groupHideGroupColumns: false,
                enableColResize: true, //one of [true, false]
                enableSorting: true, //one of [true, false]g
                enableFilter: true, //one of [true, false]
                enableStatusBar: false,
                enableRangeSelection: true,
                rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
                rowDeselection: false,
                quickFilterText: null,
                rowClicked: $scope.rowClicked,
                groupSelectsChildren: false, // one of [true, false]
                suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
                groupColumnDef: groupColumn,
                showToolPanel: false,
                checkboxSelection: function (params) {
                    var isGrouping = $scope.cntoptions.columnApi.getRowGroupColumns().length > 0;
                    return params.colIndex === 0 && !isGrouping;
                },
                icons: {
                    columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                    filter: '<i class="fa fa-filter"/>',
                    sortAscending: '<i class="fa fa-long-arrow-down"/>',
                    sortDescending: '<i class="fa fa-long-arrow-up"/>',
                },
                getRowHeight: function (params) {
                    if (params.data.rowHeight == undefined) {
                        params.data.rowHeight = 25;
                    }
                    return params.data.rowHeight;
                }
            };


            $scope.selectname_yw = function (item) {
                $scope.FrmInfo = {
                    classid: "customs_name",
                    sqlBlock: " usable = 2",
                    postdata: {flag: 5},
                };
                BasemanService.open(CommonPopController, $scope, "", "lg")
                    .result.then(function (data) {
                    var griddata = $scope.gridGetRow('cntoptions');
                    griddata.name_yw = data.name_yw;
                    griddata.hs_code = data.hs_code;
                    griddata.brand_name = data.brand_name;//要素品名
                    griddata.elements_name = data.elements_name;
                    $scope.gridUpdateRow("cntoptions", griddata)

                });
            }
            $scope.selectbrand_name = function (item) {
                $scope.FrmInfo = {
                    classid: "custom_elements",
                    postdata: {flag: 5},
                    sqlBlock: " usable = 2",
                };
                BasemanService.open(CommonPopController, $scope, "", "lg")
                    .result.then(function (data) {
                    var griddata = $scope.gridGetRow('cntoptions');
                    griddata.brand_name = data.brand_name;
                    griddata.elements_name = data.elements_name;
                    $scope.gridUpdateRow("cntoptions", griddata)
                });
            }

            $scope.getqty = function (h_detail) {
                if (h_detail.customs_uom == "2") {
                    h_detail.customs_qty = h_detail.unit_nw;
                }
                if (h_detail.customs_uom == "1") {
                    h_detail.customs_qty = 0;
                    h_detail.customs_amt = 0;
                    h_detail.customs_amt = Number(h_detail.customs_qty || 0) * Number(h_detail.customs_price || 0)
                    for (var i = 0; i < h_detail.sale_customs_lineofsale_customs_h_lines.length; i++) {
                        var obj = h_detail.sale_customs_lineofsale_customs_h_lines[i];
                        obj.customs_qty = 0;
                        obj.customs_amt = 0
                    }
                }
            }


            $scope.cntcellchange = function () {
                var options = "cntoptions"
                var _this = $(this);
                var val = _this.val();

                var nodes = $scope[options].api.getModel().rootNode.childrenAfterGroup;
                var cell = $scope[options].api.getFocusedCell()
                var field = cell.column.colDef.field;

                var h_detail = nodes[cell.rowIndex].data;
                var key = [];

                var lines = h_detail.sale_customs_lineofsale_customs_h_lines;
                h_detail[field] = val;

                if (field == "cust_spec") {
                    for (var i = 0; i < lines.length; i++) {
                        lines[i].customs_uom = val;
                    }
                }
                if (field == "customs_uom") {
                    for (var i = 0; i < lines.length; i++) {
                        lines[i].customs_uom = Number(val || 0);
                    }
                    $scope.getqty(h_detail);
                }
                if (field == "customs_qty") {
                    var qty = 0, unit_nw = 0, unit_gw = 0, unit_tj = 0;
                    for (var i = 0; i < lines.length; i++) {
                        lines[i].customs_qty = h_detail.customs_qty;
                        lines[i].customs_amt = (Number(lines[i].customs_qty || 0) * Number(lines[i].customs_price || 0)).toFixed(4);
                        qty = Number(lines[i].customs_qty || 0);
                        unit_nw += Number(lines[i].unit_nw || 0) * qty
                        unit_gw += Number(lines[i].unit_gw || 0) * qty
                        unit_tj += Number(lines[i].unit_tj || 0) * qty
                    }
                    h_detail.customs_amt = Number(h_detail.customs_price || 0) * Number(h_detail.customs_qty || 0)
                    h_detail.unit_nw = unit_nw;
                    h_detail.unit_gw = unit_gw;
                    h_detail.unit_tj = unit_tj;
                    if (h_detail.item_h_code != 'T15180184600') {
                        h_detail.x_qty = h_detail.customs_qty;
                    }
                    key = ["customs_amt", "unit_nw", "unit_gw", "unit_tj", "x_qty"]
                }
                if (field == "customs_price") {
                    h_detail.print_price = h_detail.customs_price
                    var price_h = h_detail.price;
                    var price = h_detail.customs_price
                    if (price_h > 0) {
                        var aprice = 0;
                        for (var i = 0; i < lines.length; i++) {
                            if (i + 1 == lines.length) {
                                lines[i].customs_price = Number(price || 0) - Number(aprice || 0);
                                lines[i].print_price = Number(lines[i].customs_price || 0);
                                lines[i].customs_amt = (Number(lines[i].customs_price || 0) * Number(lines[i].customs_price || 0)).toFixed(4);
                            } else {
                                var price_1 = lines[i].price;
                                lines[i].customs_price = (Number(price_h || 0) / Number(h_detail.customs_price)).toFixed(4);
                                lines[i].customs_amt = (Number(lines[i].customs_price || 0) * Number(lines[i].customs_qty || 0)).toFixed(4);
                                aprice += lines[i].customs_price;
                            }
                        }

                    } else {
                        for (var i = 0; i < lines.length; i++) {
                            lines[i].customs_price = (Number(price) / (lines.length - i)).toFixed(4);
                            price = price - lines[i].customs_price;
                            lines[i].print_price = Number(lines[i].customs_price || 0);
                            lines[i].customs_amt = (Number(lines[i].customs_price || 0) * Number(lines[i].customs_price || 0)).toFixed(4);
                        }
                    }
                    h_detail.customs_amt = Number(h_detail.customs_qty || 0) * Number(h_detail.customs_price || 0)
                    key = ["print_price", "customs_amt"]
                }
                if (h_detail.new_row == "2") {
                    for (var i = 0; i < lines.length; i++) {
                        lines[i].pi_no = h_detail.pi_no;
                        lines[i].inspection_batchno = h_detail.inspection_batchno;
                        lines[i].erp_code = h_detail.item_h_code;
                        lines[i].cust_item_name = h_detail.item_h_name;
                        lines[i].cust_spec = h_detail.cust_spec;
                        lines[i].out_qty = h_detail.qty;
                        lines[i].price = h_detail.price;
                        lines[i].line_amt = h_detail.line_amt;
                        lines[i].customs_uom = h_detail.customs_uom;
                        lines[i].customs_qty = h_detail.customs_qty;
                        lines[i].customs_price = h_detail.customs_price;
                    }
                    if (h_detail.customs_h_id == "0") {
                        h_detail.customs_h_id = $scope.getMaxId();
                        for (var i = 0; i < lines.length; i++) {
                            lines[i].customs_h_id = h_detail.customs_h_id
                        }
                    }
                    if (field == "customs_qty") {
                        for (var i = 0; i < lines.length; i++) {
                            lines[i].customs_h_id = h_detail.customs_h_id
                        }
                    }

                }
                if (field == "customs_qty") {
                    if (h_detail.customs_uom == "2") {
                        h_detail.unit_nw = h_detail.customs_qty;
                        lines[0].customs_qty = h_detail.customs_qty;
                        h_detail.cusmtoms_amt = Number(h_detail.customs_qty || 0) * Number(h_detail.customs_price || 0);
                        lines[0].cusmtoms_amt = h_detail.cusmtoms_amt;
                        key = ["cusmtoms_amt", "unit_nw"]
                    }
                }
                if (field == "unit_gw") {
                    if (h_detail.customs_uom == "2") {
                        h_detail.customs_qty = h_detail.unit_nw
                        lines[0].customs_qty = h_detail.customs_qty;
                        h_detail.cusmtoms_amt = Number(h_detail.customs_qty || 0) * Number(h_detail.customs_price || 0);
                        lines[0].cusmtoms_amt = h_detail.cusmtoms_amt;
                        key = ["cusmtoms_amt", "cusmtoms_amt"]
                    }
                }
                if(field == "qty"){
                    for(var i=0;i<lines.length;i++){
                        lines[i]["out_qty"]=h_detail[field]
                    }
                }
                $scope.cntoptions.api.refreshCells($scope.gridGetNodes("cntoptions"), key);
                key = ["cusmtoms_amt", "customs_qty", "unit_nw", "unit_gw", "unit_tj"]
                $scope.cntlineoptions.api.refreshCells($scope.gridGetNodes("cntlineoptions"), key);
                $scope.partSummary();

            }

            $scope.cntcolumns = [
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
                    floatCell: true,
                    pinned: "left"
                }, {
                    headerName: "类型",
                    field: "line_type",
                    editable: true,
                    filter: 'set',
                    width: 100,
                    cellEditor: "下拉框",
                    enableRowGroup: true,
                    enablePivot: true,
                    cellEditorParams: {
                        values: []
                    },
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "分票",
                    field: "ab_votes",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "产品名称",
                    field: "item_h_name",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "品名",
                    field: "name_yw",
                    editable: true,
                    filter: 'set',
                    width: 120,
                    cellEditor: "弹出框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    non_empty: true,
                    action: $scope.selectname_yw,
                }, {
                    headerName: "品名(英文)",
                    field: "brand_name_en",
                    editable: true,
                    filter: 'set',
                    width: 120,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "HS编码",
                    field: "hs_code",
                    editable: false,
                    filter: 'set',
                    width: 120,
                    cellEditor: "文本狂",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "要素品名",
                    field: "brand_name",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "弹出框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false,
                    non_empty: true,
                    action: $scope.selectbrand_name,
                }, {
                    headerName: "报关要素",
                    field: "elements_name",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "弹出框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false,
                    action: $scope.selectbrand_name,
                }, {
                    headerName: "报关单位",
                    field: "customs_uom",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "下拉框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false,
                    cellEditorParams: {
                        values: [{desc: "UNIT", value: 1}, {desc: "KGS", value: 2}]
                    },
                    cellchange: $scope.cntcellchange,
                }, {
                    headerName: "件数",
                    field: "x_qty",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false,
                    cellchange: $scope.cntcellchange,
                }, {
                    headerName: "报关数量",
                    field: "customs_qty",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false,
                    cellchange: $scope.cntcellchange,
                }, {
                    headerName: "财务单价",
                    field: "customs_price",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false,
                    cellchange: $scope.cntcellchange,
                }, {
                    headerName: "打印价格",
                    field: "print_price",
                    width: 100,
                    editable: false,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false
                }, {
                    headerName: "报关金额",
                    field: "customs_amt",
                    width: 100,
                    editable: false,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false
                }, {
                    headerName: "单位体积",
                    field: "tj",
                    width: 100,
                    editable: false,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false
                }, {
                    headerName: "总体积",
                    field: "unit_tj",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false
                }, {
                    headerName: "单位毛重",
                    field: "gw",
                    width: 100,
                    editable: false,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false
                }, {
                    headerName: "总毛重",
                    field: "unit_gw",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false
                }, {
                    headerName: "单位净重",
                    field: "nw",
                    width: 100,
                    editable: false,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false
                }, {
                    headerName: "总净重",
                    field: "unit_nw",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false
                }, {
                    headerName: "备注",
                    field: "note",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false
                }, {
                    headerName: "形式发票号",
                    field: "pi_no",
                    width: 100,
                    editable: false,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false
                }, {
                    headerName: "生产单号",
                    field: "prod_no",
                    width: 100,
                    editable: false,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false
                }, {
                    headerName: "商检批号",
                    field: "inspection_batchno",
                    width: 100,
                    editable: false,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false
                }, {
                    headerName: "产品编码",
                    field: "item_h_code",
                    width: 100,
                    editable: false,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false
                }, {
                    headerName: "客户机型",
                    field: "cust_spec",
                    width: 100,
                    editable: false,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false
                }, {
                    headerName: "发货数量",
                    field: "qty",
                    width: 100,
                    editable: false,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false
                }, {
                    headerName: "发货单价",
                    field: "price",
                    width: 100,
                    editable: false,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false
                }, {
                    headerName: "发货金额",
                    field: "line_amt",
                    width: 100,
                    editable: false,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false
                }, {
                    headerName: "报关型号",
                    field: "bg_name",
                    width: 100,
                    editable: false,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false
                }];

        }

        //cntlineoptions
        {

            $scope.cntlineoptions = {
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
                    var isGrouping = $scope.cntoptions.columnApi.getRowGroupColumns().length > 0;
                    return params.colIndex === 0 && !isGrouping;
                },
                icons: {
                    columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                    filter: '<i class="fa fa-filter"/>',
                    sortAscending: '<i class="fa fa-long-arrow-down"/>',
                    sortDescending: '<i class="fa fa-long-arrow-up"/>',
                },
            };

            $scope.cellchange = function () {
                var options = 'cntlineoptions'
                var _this = $(this);
                var val = _this.val();

                var nodes = $scope[options].api.getModel().rootNode.childrenAfterGroup;
                var cell = $scope[options].api.getFocusedCell()
                var field = cell.column.colDef.field;

                var index = $scope[options].api.getFocusedCell().rowIndex;
                var linedata = nodes[cell.rowIndex].data;

                var h_detail = $scope.gridGetRow("cntoptions");

                var key = [], ckey = [];
                var lines = $scope.gridGetData(options)
                if (field == "unit_nw" || field == "unit_gw" || field == "unit_tj") {
                    lines[j][field] = Number(val || 0);
                    var nw = 0, gw = 0, tj = 0, qty = 0, nw2 = 0, gw2 = 0, tj2 = 0;
                    for (var j = 0; j < lines.length; j++) {
                        qty = Number(lines[j].customs_qty || 0);
                        nw += (lines[j].unit_nw || 0) * qty;
                        gw += (lines[j].unit_gw || 0) * qty;
                        tj += (lines[j].unit_tj || 0) * qty;
                        nw2 += (lines[j].unit_nw || 0);
                        gw2 += (lines[j].unit_gw || 0);
                        tj2 += (lines[j].unit_tj || 0);
                    }
                    h_detail.unit_nw = nw;
                    h_detail.unit_gw = gw;
                    h_detail.unit_tj = tj;
                    h_detail.nw = nw2;
                    h_detail.gw = gw2;
                    h_detail.tj = tj2;

                    key = ["nw", "gw", "tj"];
                    ckey = key;
                }
                h_detail.customs_amt = Number(h_detail.customs_qty || 0) * Number(h_detail.customs_price || 0).toFixed(4);

                if (field == "customs_price") {
                    var price = Number(h_detail.customs_price || 0);
                    if (lines.length == 1) {
                        h_detail.customs_price = val;
                    } else {
                        for (var j = 0; j < lines.length; j++) {
                            if (j != index) {
                                lines[j].customs_price = price - Number(linedata.customs_price || 0);
                                lines[j].customs_amt = lines[j].qty * lines[j].customs_price;
                            }
                            lines[j].print_price = lines[j].customs_price;
                        }
                    }
                    key = ["print_price", "customs_amt", "customs_price"];
                    key = ["print_price", "customs_amt"];
                    linedata.cusmtoms_amt = Number(linedata.customs_price || 0) * Number(linedata.customs_qty || 0);

                    h_detail.customs_price = price;
                    h_detail.print_price = price;
                    h_detail.customs_amt = price * Number(h_detail.customs_qty || 0);
                }
                if (field == "customs_qty") {
                    linedata.cusmtoms_qty = h_detail.customs_qty;
                }

                if (h_detail.new_row == "2") {//h_detail为空行，相应的line只有一行
                    h_detail.pi_no = linedata.pi_no;
                    h_detail.inspection_batchno = linedata.inspection_batchno;
                    h_detail.item_h_code = linedata.erp_code;
                    h_detail.item_h_name = linedata.cust_item_name;
                    h_detail.cust_spec = linedata.cust_item_name;
                    h_detail.cust_spec = linedata.cust_spec;
                    h_detail.qty = linedata.out_qty;
                    h_detail.price = linedata.price;
                    h_detail.line_amt = linedata.line_amt;
                    h_detail.customs_uom = linedata.customs_uom;
                    h_detail.customs_qty = linedata.customs_qty;
                    h_detail.customs_price = linedata.customs_price;
                    h_detail.comminspec_qty = linedata.comminspec_qty;
                    h_detail.pro_type = 4;
                    linedata.pro_type = 4;

                    if (h_detail.customs_h_id == undefined || h_detail.warn_h_id == 0) {
                        h_detail.customs_h_id = $scope.getMaxId();
                        linedata.customs_h_id = h_detail.customs_h_id;
                    }
                    if (h_detail == "customs_price" || h_detail == "customs_qty") {
                        linedata.customs_amt = (Number(linedata.customs_qty || 0) * Number(linedata.customs_price || 0)).toFixed(4);
                        h_detail.customs_amt = linedata.customs_amt;
                        key = ["customs_amt"];
                    }
                    if (field == "customs_qty") {
                        qty = Number(lines[i].customs_qty || 0);
                        h_detail.unit_nw = Number(lines[i].unit_nw || 0) * qty;
                        h_detail.unit_gw += Number(lines[i].unit_gw || 0) * qty;
                        h_detail.unit_tj += Number(lines[i].unit_tj || 0) * qty;
                    }
                }
                if(field == "out_qty"){
                    for(var i=0;i<lines.length;i++){
                        lines[i][field]=val;
                    }
                    h_detail["qty"]=val;
                }

                $scope.gridUpdateRow("cntoptions", h_detail);
                $scope.partSummary();
                if (key.length == 0) {
                    return;
                }
                for (var i = 0; i < nodes.length; i++) {
                    if (i != cell.rowIndex) {
                        $scope[options].api.refreshCells([nodes[i]], key);
                    } else {
                        $scope[options].api.refreshCells([nodes[i]], ckey);
                    }
                }
            }

            $scope.showzero = true;

            $scope.showZero = function () {
                var data = $scope.gridGetData("cntoptions");
                data.forEach(function (dataItem, index) {
                    if (dataItem.customs_qty == 0 && !$scope.showzero) {
                        dataItem.rowHeight = 0
                    } else if (dataItem.customs_qty != 0 || $scope.showzero) {
                        dataItem.rowHeight = 25
                    }
                })
                $scope.cntoptions.api.setRowData(data);
            }

            $scope.cntlinecolumns = [
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
                }, {
                    headerName: "类型",
                    field: "line_type",
                    editable: true,
                    filter: 'set',
                    width: 100,
                    cellEditor: "下拉框",
                    enableRowGroup: true,
                    enablePivot: true,
                    cellEditorParams: {
                        values: []
                    },
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "客户产品名称",
                    field: "cust_spec",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "报关单位",
                    field: "customs_uom",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellEditorParams: {
                        values: [{desc: "UNIT", value: 1}, {desc: "KGS", value: 2}]
                    },
                }, {
                    headerName: "报关数量",
                    field: "customs_qty",
                    width: 100,
                    editable: false,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false,
                    cellchange: $scope.cellchange,
                }, {
                    headerName: "报关单价",
                    field: "customs_price",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false,
                    cellchange: $scope.cellchange,
                }, {
                    headerName: "报关金额",
                    field: "customs_amt",
                    width: 100,
                    editable: false,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false
                }, {
                    headerName: "单位毛重",
                    field: "unit_gw",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false,
                    cellchange: $scope.cellchange,
                }, {
                    headerName: "单位净重",
                    field: "unit_nw",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false,
                    cellchange: $scope.cellchange,
                }, {
                    headerName: "单位体积",
                    field: "unit_tj",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false,
                    cellchange: $scope.cellchange,
                }, {
                    headerName: "备注",
                    field: "note",
                    width: 100,
                    editable: false,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false
                }, {
                    headerName: "形式发票号",
                    field: "pi_no",
                    width: 100,
                    editable: false,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false
                }, {
                    headerName: "生产单号",
                    field: "prod_no",
                    width: 100,
                    editable: false,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false
                }, {
                    headerName: "商检批号",
                    field: "inspection_batchno",
                    width: 100,
                    editable: false,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false
                }, {
                    headerName: "ERP产品编码",
                    field: "erp_code",
                    width: 100,
                    editable: false,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false
                }, {
                    headerName: "客户机型",
                    field: "cust_item_name",
                    width: 100,
                    editable: false,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false
                }, {
                    headerName: "发货数量",
                    field: "out_qty",
                    width: 100,
                    editable: false,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false
                }, {
                    headerName: "发货单价",
                    field: "price",
                    width: 100,
                    editable: false,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false
                }, {
                    headerName: "发货金额",
                    field: "line_amt",
                    width: 100,
                    editable: false,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false
                }, {
                    headerName: "打印价格",
                    field: "print_price",
                    width: 100,
                    editable: false,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false
                }, {
                    headerName: "报关型号",
                    field: "bg_name",
                    width: 100,
                    editable: false,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: false
                }];

        }

        //aoptions,根据是否是空白行，判断列的可编辑
        {
            $scope.aoptions = {
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
                    var isGrouping = $scope.aoptions.columnApi.getRowGroupColumns().length > 0;
                    return params.colIndex === 0 && !isGrouping;
                },
                icons: {
                    columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                    filter: '<i class="fa fa-filter"/>',
                    sortAscending: '<i class="fa fa-long-arrow-down"/>',
                    sortDescending: '<i class="fa fa-long-arrow-up"/>',
                }
            };

            $scope.acolumns = [
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
                    floatCell: true,
                }, {
                    headerName: "SAP销售订单号",
                    field: "sale_sap",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "SAP交货订单号",
                    field: "delorder_sap",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "SAP发票号",
                    field: "fapiao_sap",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "SAP发票凭证号",
                    field: "kaipiao_sap",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "SAP公司间发票号",
                    field: "company_fapiao",
                    editable: true,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "SAP公司间发票凭证号",
                    field: "company_kaipiao",
                    editable: true,
                    filter: 'set',
                    width: 300,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    action: $scope.qty,
                }];
        }

    }

    //合计
    $scope.partSummary = function () {
        $timeout(function () {
            var griddata = $scope.gridGetData('cntoptions')
            $scope.data.currItem.tl_xqty = 0;
            $scope.data.currItem.total_qty = 0;
            $scope.data.currItem.tl_price = 0;
            $scope.data.currItem.total_amt = 0;
            $scope.data.currItem.total_unit_gw = 0;
            $scope.data.currItem.total_unit_nw = 0;
            $scope.data.currItem.total_unit_tj = 0;
            //件数x_qty
            for (var i = 0; i < griddata.length; i++) {
                if (parseFloat(griddata[i].x_qty) != undefined) {
                    $scope.data.currItem.tl_xqty += parseFloat(griddata[i].x_qty || 0);
                }
            }
            $scope.data.currItem.tl_xqty = $scope.data.currItem.tl_xqty.toFixed(2);
            //报关数量customs_qty
            for (var i = 0; i < griddata.length; i++) {
                if (parseFloat(griddata[i].customs_qty) != undefined) {
                    $scope.data.currItem.total_qty += parseFloat(griddata[i].customs_qty || 0);
                }
            }
            $scope.data.currItem.total_qty = $scope.data.currItem.total_qty.toFixed(2);
            //打印价格print_price
            for (var i = 0; i < griddata.length; i++) {
                if (parseFloat(griddata[i].print_price) != undefined) {
                    $scope.data.currItem.tl_price += parseFloat(griddata[i].print_price || 0);
                }
            }
            $scope.data.currItem.tl_price = $scope.data.currItem.tl_price.toFixed(2);
            //报关金额customs_amt
            for (var i = 0; i < griddata.length; i++) {
                if (parseFloat(griddata[i].customs_amt) != undefined) {
                    $scope.data.currItem.total_amt += parseFloat(griddata[i].customs_amt || 0);
                }
            }
            $scope.data.currItem.total_amt = $scope.data.currItem.total_amt.toFixed(2);
            //总毛重unit_gw
            for (var i = 0; i < griddata.length; i++) {
                if (parseFloat(griddata[i].unit_gw) != undefined) {
                    $scope.data.currItem.total_unit_gw += parseFloat(griddata[i].unit_gw || 0);
                }
            }
            $scope.data.currItem.total_unit_gw = $scope.data.currItem.total_unit_gw.toFixed(2);
            //总净重unit_nw
            for (var i = 0; i < griddata.length; i++) {
                if (parseFloat(griddata[i].unit_nw) != undefined) {
                    $scope.data.currItem.total_unit_nw += parseFloat(griddata[i].unit_nw || 0);
                }
            }
            $scope.data.currItem.total_unit_nw = $scope.data.currItem.total_unit_nw.toFixed(2);
            //总体积unit_tj
            for (var i = 0; i < griddata.length; i++) {
                if (parseFloat(griddata[i].unit_tj) != undefined) {
                    $scope.data.currItem.total_unit_tj += parseFloat(griddata[i].unit_tj || 0);
                }
            }
            $scope.data.currItem.total_unit_tj = $scope.data.currItem.total_unit_tj.toFixed(3);


        }, 1);
    };


    {
        $scope.selectprice = function () {
            $scope.FrmInfo = {
                classid: "price_type",
                sqlBlock: "usable=2",
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (data) {
                $scope.data.currItem.price_type_name = data.price_type_name;
                $scope.data.currItem.price_type_id = parseInt(data.price_type_id);
                $scope.data.currItem.price_type_code = data.price_type_code;
            });
        }

        //查询到货港
        $scope.searchinport = function () {
            $scope.FrmInfo = {
                classid: "seaport",
                postdata: {
                    flag: 2
                },
                sqlBlock: "seaport_type=2",
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (data) {
                $scope.data.currItem.seaport_in_name = data.seaport_name;
                $scope.data.currItem.seaport_in_id = parseInt(data.seaport_id);
                $scope.data.currItem.seaport_in_code = data.seaport_code;
            });
        }


        //查询出货预告
        $scope.selectwarn_no = function () {

            if ($scope.data.currItem.org_id == "" || $scope.data.currItem.org_id == undefined) {
                BasemanService.notice("请先选择销售区域", "alert-info");
                return;
            }

            $scope.FrmInfo = {
                classid: "sale_ship_warn_header",
                postdata: {
                    flag: 11,
                    stat: 5
                },
                sqlBlock: " stat = 5 and update_time>=to_date('2012-12-08','yyyy-mm-dd') ",
            };

            BasemanService.open(CommonPopController, $scope)
                .result.then(function (data) {


                for (name in result) {
                    if (name != "stat") {
                        $scope.data.currItem[name] = result[name];
                    }
                }
                $scope.data.currItem.cpi_no = result.pi_no;
                $scope.data.currItem.brand_name = result.brand_name;
                $scope.data.currItem.ab_votes = result.ab_votes;
                $scope.data.currItem.ship_type = parseInt(result.ship_type);
                $scope.data.currItem.trade_type = parseInt(result.trade_type);

                BasemanService.RequestPost("sale_comminspec_header", "getothermsg", {warn_id: $scope.data.currItem.warn_id})
                    .then(function (data) {
                        $scope.data.currItem.brand_name = data.brand_name;
                        $scope.data.currItem.ab_votes = data.ab_votes;
                    });


            });
        };


    }


    /*系统词汇*/
    {

        //贸易类型系统词汇值
        BasemanService.RequestPost("base_search", "searchdict", {dictcode: "trade_type"})
            .then(function (data) {
                $scope.sale_ent_types = HczyCommon.stringPropToNum(data.dicts);
            });
        BasemanService.RequestPost("base_search", "searchdict", {dictcode: "ship_type"})
            .then(function (data) {
                $scope.ship_types = HczyCommon.stringPropToNum(data.dicts);
            });
        $scope.buyer_names = [{
            id: "DE ZE COMPANY LTD",
            name: "DE ZE COMPANY LTD"
        }, {
            id: "AUX ELECTRIC (HONG KONG) COMPANY LIMITED",
            name: "AUX ELECTRIC (HONG KONG) COMPANY LIMITED"
        }];
        //需要查询  -- 柜型信息
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pro_type"})
            .then(function (data) {
                var pro_types = [];
                for (var i = 0; i < data.dicts.length; i++) {
                    pro_types[i] = {
                        value: data.dicts[i].dictvalue,
                        desc: data.dicts[i].dictname,
                    }
                }
                if ($scope.getIndexByField('cntcolumns', 'line_type')) {
                    $scope.cntcolumns[$scope.getIndexByField('cntcolumns', 'line_type')].cellEditorParams.values = pro_types;
                }
                if ($scope.getIndexByField('cntlinecolumns', 'line_type')) {
                    $scope.cntlinecolumns[$scope.getIndexByField('cntlinecolumns', 'line_type')].cellEditorParams.values = pro_types;
                }
            })

        $scope.package_types = [{id: 1, name: "PACKAGES"}, {id: 2, name: "CARTONS"}];
    }
    /*选择框*/
    {
        $scope.selectwarn_no = function () {
            $scope.FrmInfo = {
                classid: "sale_ship_warn_header",
                postdata: {
                    flag: 11,
                    stat: 5
                },
            };
            BasemanService.open(CommonPopController, $scope, "", "lg")
                .result.then(function (result) {
                for (name in result) {
                    if (name != "stat") {
                        $scope.data.currItem[name] = result[name];
                    }
                }
                $scope.data.currItem.cpi_no = result.pi_no;
                $scope.data.currItem.brand_name = result.brand_name;
                $scope.data.currItem.ab_votes = result.ab_votes;
                $scope.data.currItem.ship_type = parseInt(result.ship_type);
                $scope.data.currItem.trade_type = parseInt(result.trade_type);
                BasemanService.RequestPost("sale_comminspec_header", "getothermsg", {warn_id: $scope.data.currItem.warn_id})
                    .then(function (data) {
                        $scope.data.currItem.brand_name = data.brand_name;
                        $scope.data.currItem.ab_votes = data.ab_votes;
                    });
            });

        }
        //scporg
        $scope.scporg = function () {
            $scope.FrmInfo = {
                classid: "scporg",
                postdata: {},
                sqlBlock: " orgtype=5 ",
                backdatas: "orgs",
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (result) {
                $scope.data.currItem.org_id = result.orgid;
                $scope.data.currItem.org_code = result.code;
                $scope.data.currItem.org_name = result.orgname;
            });
        }

        //customer
        $scope.customer = function () {

            var sqlBlock = {}
            if ($scope.data.currItem.org_id == undefined || $scope.data.currItem.org_id == "") {
                BasemanService.notice("请先选择业务部门", "alert-warning");
                return;
            } else {
                sqlBlock = "(org_id=" + $scope.data.currItem.org_id
                    + " or other_org_ids like '%," + $scope.data.currItem.org_id + ",%')";
            }
            $scope.FrmInfo = {
                classid: "customer",
                postdata: {},
                sqlBlock: sqlBlock,
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (result) {
                $scope.data.currItem.cust_id = result.cust_id;
                $scope.data.currItem.cust_code = result.sap_code;
                $scope.data.currItem.cust_name = result.cust_name;
            });
        }


        $scope.selectnotice = function () {
            if ($scope.data.currItem.warn_id == "" || $scope.data.currItem.warn_id == undefined) {
                BasemanService.notice("请先选择出货预告", "alert-info");
                return;
            }
            $scope.FrmInfo = {
                classid: "sale_ship_notice_header",
                postdata: {
                    flag: 1,
                },
                type: 'checkbox',
                sqlBlock: "  stat in (1,2,3,4,5) and nvl(is_customs,0)<>2 and warn_id =" + $scope.data.currItem.warn_id,
            };
            if ($scope.data.currItem.inspection_batchnos != '' && $scope.data.currItem.inspection_batchnos != undefined) {
                $scope.FrmInfo.sqlBlock += " and exists (select 1 from sale_ship_item_line l where" +
                    " l.notice_id=sale_ship_notice_header.notice_id " +
                    "and nvl(l.is_customs,0)<>2 and (l.contract_no=" + $scope.data.currItem.contract_no +
                    "or l.contract_no is  null)) "
            }
            BasemanService.open(CommonPopController, $scope, "", "lg")
                .result.then(function (items) {

                if (items.length) {

                    var notice_ids = '', names = '', codes = '';
                    for (var i = 0; i < items.length; i++) {
                        if (i == items.length - 1) {
                            //names+=items[i].notice_name;
                            notice_ids += items[i].notice_id;
                            codes += items[i].notice_no;
                        } else {
                            //names+=items[i].notice_name;
                            //names+=',';
                            notice_ids += items[i].notice_id;
                            notice_ids += ',';
                            codes += items[i].notice_no;
                            codes += ','
                        }
                    }
                }

                $scope.data.currItem.notice_id = notice_ids;
                $scope.data.currItem.notice_no = codes;

                var postdata = {};
                postdata.notice_ids = $scope.data.currItem.notice_ids;
                postdata.flag = 2;
                postdata.warn_id = $scope.data.currItem.warn_id;
                postdata.ab_votes = $scope.data.currItem.ab_votes;
                postdata.contract_no = $scope.data.currItem.contract_no;
                BasemanService.RequestPost("sale_ship_notice_header", "baoguangzj2", postdata).then(function (data) {
                    $scope.data.currItem.sale_customs_h_lineofsale_customs_headers
                        = data.sale_ship_item_h_lineofsale_ship_notice_headers;
                })
            });
        }

        //商检批号
        $scope.selectbatchno = function () {
            if ($scope.data.currItem.warn_id == "" || $scope.data.currItem.warn_id == undefined) {
                BasemanService.notice("请先选择出货预告", "alert-info");
                return;
            }
            $scope.FrmInfo = {
                classid: "sale_comminspec_header",
                postdata: {
                    flag: 1,
                    warn_id: $scope.data.currItem.warn_id,
                    stat: 5
                },
            };
            BasemanService.open(CommonPopController, $scope, "", "lg")
                .result.then(function (result) {
                $scope.data.currItem.inspection_batchnos = result.inspection_batchnos;
            });
        }

        //AB票
        $scope.selectAB = function () {
            if ($scope.data.currItem.warn_no == "" || $scope.data.currItem.warn_no == undefined) {
                BasemanService.notice("请先选择出货预告号!", "alter-warning");
                return;
            }

            $scope.FrmInfo = {
                is_high: true,
                is_custom_search: true,
                title: "AB票查询",
                thead: [
                    {
                        name: "AB票",
                        code: "ab_votes",
                        iscond: true,
                        type: 'string',
                    }],
                classid: "sale_ship_warn_header",
                postdata: {
                    flag: 17,
                },
                searchlist: ["ab_votes"],
            };
            if ($scope.data.currItem.warn_id != undefined) {
                $scope.FrmInfo.postdata.warn_id = $scope.data.currItem.warn_id;
            }
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (result) {
                $scope.data.currItem.ab_votes = result.ab_votes;
            });
        }

        //出货预告
        $scope.buttonClick = function () {
            if ($scope.data.currItem.warn_id == undefined) {
                BasemanService.notice("出货预告为空!");
                return;
            }
            $scope.FrmInfo = {
                title: "出货预告",
                classid: "sale_ship_warn_header",
                postdata: {
                    warn_id: $scope.data.currItem.warn_id
                },
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (data) {
                localeStorageService.set("crmman.sale_ship_warn_headerEdit", {
                    notice_id: data.notice_id,
                    flag: 3
                });
                $state.go("crmman.sale_ship_warn_headerEdit");
            })
        };

        $scope.scparea = function () {
            $scope.FrmInfo = {
                classid: "scparea",
                sqlBlock: "areatype = 2",
                postdata: {},
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (data) {
                $scope.data.currItem.area_name = data.areaname;
                $scope.data.currItem.area_code = data.areacode;
                $scope.data.currItem.area_id = parseInt(data.areaid);
            });
        };

        $scope.back_print = function () {
            var h_detail = $scope.gridGetData("cntoptions");
            var lines;
            for (var i = 0; i < h_detail.length; i++) {
                if (h_detail[i].pro_type != "1" && h_detail[i].pro_type != "2"
                    && h_detail[i].pro_type != "3" && h_detail[i].line_type != "1") {
                    continue;
                }
                h_detail[i].print_price = h_detail[i].customs_price;
                h_detail[i].customs_amt = Number(h_detail[i].customs_price || 0) * Number(h_detail[i].customs_qty || 0)

                lines = h_detail[i].sale_customs_lineofsale_customs_h_lines
                for (var j = 0; j < lines.length; j++) {
                    lines[j].print_price = lines[j].customs_price;
                    lines[j].customs_amt = Number(lines[j].customs_price || 0) * Number(lines[j].customs_qty || 0)

                }
            }
            $scope.data.currItem.price_changed2 = 1;
            $scope.cntoptions.api.refreshCells($scope.gridGetNodes("cntoptions"), ["customs_amt", "customs_price", "print_price"])
            $scope.cntlineoptions.api.refreshCells($scope.gridGetNodes("cntlineoptions"), ["customs_amt", "customs_price", "print_price"])
        }

        $scope.print_change = function () {
            if ($scope.data.currItem.print_amt == undefined || $scope.data.currItem.print_amt == "") {
                BasemanService.notice("运保费金额为0,不需调整价格!")
                return;
            }
            if ($scope.data.currItem.price_changed2 == 2) return;
            var partamt = Number($scope.data.currItem.print_amt);
            var qty = 0
            var h_detail = $scope.gridGetData("cntoptions");
            var lines = [];
            for (var i = 0; i < h_detail.length; i++) {
                if (h_detail[i].new_row == "2") continue;
                if (h_detail[i].pro_type == "4") continue;
                lines = h_detail[i].sale_customs_lineofsale_customs_h_lines;
                for (var j = 0; j < lines.length; j++) {
                    if (lines[j].pro_type == "2" || lines[j].pro_type == "3") {
                        qty += Number(lines[j].customs_qty || 0);
                    }
                }
            }
            $scope.data.currItem.price_qty = qty;
            var price = 0;
            for (var i = 0; i < h_detail.length; i++) {
                if (h_detail[i].new_row == "2") continue;
                if (h_detail[i].pro_type == "4") continue;
                price = 0;
                lines = h_detail[i].sale_customs_lineofsale_customs_h_lines
                for (var j = 0; j < lines.length; j++) {
                    if (lines[j].pro_type == "2" || lines[j].pro_type == "3") {
                        lines[j].print_price = Number(lines[j].customs_price || 0) - (partamt / qty).toFixed(4);
                        lines[j].customs_amt = lines[j].print_price * Number(lines[j].customs_qty)
                        price += Number(lines[j].print_price || 0);
                    }
                }
                h_detail[i].customs_price = Number(price || 0);
                h_detail[i].print_price = h_detail[i].customs_price
                h_detail[i].cusmtoms_amt = h_detail[i].customs_price * Number(h_detail[i].customs_qty || 0);
            }
            $scope.cntoptions.api.refreshCells($scope.gridGetNodes("cntoptions"), ["customs_amt", "print_price"])
            $scope.cntlineoptions.api.refreshCells($scope.gridGetNodes("cntlineoptions"), ["customs_amt", "print_price"])

            $scope.data.currItem.price_changed2 = 2;
        }

        $scope.back_part = function () {
            var h_detail = $scope.gridGetData("cntoptions");
            var lines;
            for (var i = 0; i < h_detail.length; i++) {
                if (h_detail[i].pro_type != "1" && h_detail[i].pro_type != "2"
                    && h_detail[i].pro_type != "3" && h_detail[i].line_type != "1") {
                    continue;
                }
                h_detail[i].customs_price = h_detail[i].price;
                if ($scope.data.currItem.price_changed2 != "2") {
                    h_detail[i].print_price = h_detail[i].customs_price;
                    h_detail[i].customs_amt = Number(h_detail[i].customs_price || 0) * Number(h_detail[i].customs_qty || 0)
                }
                lines = h_detail[i].sale_customs_lineofsale_customs_h_lines
                for (var j = 0; j < lines.length; j++) {
                    lines[j].customs_price = lines[j].price;
                    if ($scope.data.currItem.price_changed2 != "2") {
                        lines[j].print_price = lines[j].customs_price;
                        lines[j].customs_amt = Number(lines[j].customs_price || 0) * Number(lines[j].customs_qty || 0)
                    }
                }
            }
            $scope.data.currItem.price_changed = 1;
            $scope.cntoptions.api.refreshCells($scope.gridGetNodes("cntoptions"), ["customs_amt", "customs_price", "print_price"])
            $scope.cntlineoptions.api.refreshCells($scope.gridGetNodes("cntlineoptions"), ["customs_amt", "customs_price", "print_price"])
        }

        $scope.part_change = function () {
            if ($scope.data.currItem.part_amt == undefined || $scope.data.currItem.part_amt == "") {
                BasemanService.notice("免费配件金额为0,不需调整价格!")
                return;
            }
            if ($scope.data.currItem.price_change == 2) return;
            var partamt = Number($scope.data.currItem.part_amt);
            var qty = 0
            var h_detail = $scope.gridGetData("cntoptions");
            var lines = [];
            for (var i = 0; i < h_detail.length; i++) {
                if (h_detail[i].new_row == "2") continue;
                if (h_detail[i].pro_type == "4") continue;
                lines = h_detail[i].sale_customs_lineofsale_customs_h_lines;
                for (var j = 0; j < lines.length; j++) {
                    if (lines[j].pro_type == "2" || lines[j].pro_type == "3") {
                        qty += Number(lines[j].customs_qty || 0);
                    }
                }
            }
            $scope.data.currItem.price_qty = qty;
            var price = 0;
            for (var i = 0; i < h_detail.length; i++) {
                if (h_detail[i].new_row == "2") continue;
                if (h_detail[i].pro_type == "4") continue;
                price = 0;
                lines = h_detail[i].sale_customs_lineofsale_customs_h_lines
                for (var j = 0; j < lines.length; j++) {
                    if (lines[j].pro_type == "2" || lines[j].pro_type == "3") {
                        lines[j].customs_price = Number(lines[j].customs_price || 0) - (partamt / qty).toFixed(4);
                        lines[j].customs_amt = lines[j].customs_price * Number(lines[j].customs_qty)
                        lines[j].print_price = lines[j].customs_price;
                        price += Number(lines[j].customs_price || 0);
                    }
                }
                h_detail[i].customs_price = Number(price || 0);
                h_detail[i].print_price = h_detail[i].customs_price
                h_detail[i].cusmtoms_amt = h_detail[i].customs_price * Number(h_detail[i].customs_qty || 0);
            }
            $scope.cntoptions.api.refreshCells($scope.gridGetNodes("cntoptions"), ["customs_amt", "customs_price", "print_price"])
            $scope.cntlineoptions.api.refreshCells($scope.gridGetNodes("cntlineoptions"), ["customs_amt", "customs_price", "print_price"])
            $scope.data.currItem.price_changed = 2;
        }
    }
    $scope.to_formal = function (e) {
        try {
            e.target.disabled = true;
            if ($scope.data.currItem.customs_code == undefined || $scope.data.currItem.customs_code == "") {
                BasemanService.notice("报关单号不能为空!");
                e.target.disabled = false;
                return
            }
            BasemanService.RequestPost("sale_customs_header", "updatebilltype", {
                customs_id: $scope.data.currItem.customs_id || "",
                customs_date: $scope.data.currItem.customs_date || "",
                customs_code: $scope.data.currItem.customs_code,
            }).then(function (result) {
                BasemanService.notice("预报关单转正完成!");
            })

        } catch (error) {
            BasemanService.notice(error.message);
        } finally {
            e.target.disabled = false;
        }
    }
    $scope.undo_edit = function (e) {
        try {
            e.target.disabled = true;
            if ($scope.data.currItem.customs_id == undefined || $scope.data.currItem.customs_id == "") {
                BasemanService.notice("报关单号不能为空!");
                e.target.disabled = false;
                return
            }
            ds.dialog.confirm("你将作废该报关单，是否继续?", function () {
                BasemanService.RequestPost("sale_customs_header", "cancel", {
                    customs_id: $scope.data.currItem.customs_id
                }).then(function (result) {
                    BasemanService.notice("作废成功!");
                    $scope.refresh(2);
                })
            })

        } catch (error) {
            BasemanService.notice(error.message);
        } finally {
            e.target.disabled = false;
        }
    }


    {

        $scope.export = function () {
            if (!$scope.data.currItem.customs_id) {
                BasemanService.notice("未识别单据", "alert-info");
                return;
            }
            BasemanService.RequestPost("sale_customs_header", "exporttoexcel", {'customs_id': $scope.data.currItem.customs_id})
                .then(function (data) {
                    if (data.docid != undefined && Number(data.docid) != 0) {
                        var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                        window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                    } else {
                        BasemanService.notice("导出失败!", "alert-info");
                    }
                });
        }

        $scope.export1 = function () {
            if (!$scope.data.currItem.customs_id) {
                BasemanService.notice("未识别单据", "alert-info");
                return;
            }
            BasemanService.RequestPost("sale_customs_header", "exporttoexcel1", {'customs_id': $scope.data.currItem.customs_id})
                .then(function (data) {
                    if (data.docid != undefined && Number(data.docid) != 0) {
                        var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                        window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                    } else {
                        BasemanService.notice("导出失败!", "alert-info");
                    }
                });
        }

        $scope.export2 = function () {
            if (!$scope.data.currItem.customs_id) {
                BasemanService.notice("未识别单据", "alert-info");
                return;
            }
            BasemanService.RequestPost("sale_customs_header", "exporttoexcel2", {'customs_id': $scope.data.currItem.customs_id})
                .then(function (data) {
                    if (data.docid != undefined && Number(data.docid) != 0) {
                        var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                        window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                    } else {
                        BasemanService.notice("导出失败!", "alert-info");
                    }
                });
        }
    }
    $scope.validate = function () {
        var msg = [], obj = {};
        for (var i = 0; i < $scope.data.currItem.sale_customs_h_lineofsale_customs_headers.length; i++) {
            obj = $scope.data.currItem.sale_customs_h_lineofsale_customs_headers[i];
            if (Number(obj.customs_qty) == 0) {
                continue;
            }
            if (obj.name_yw == undefined || obj.name_yw == "") {
                msg.push("第" + obj.seq + "品名不能为空!")
            }
            if (obj.brand_name == undefined || obj.brand_name == "") {
                msg.push("第" + obj.seq + "要素品名不能为空!")
            }
        }
        if (msg.length > 0) {
            BasemanService.notice(msg);
            return false;
        }
        return true;
    }
    $scope.wfstart_validDate = function () {
        if (!$scope.validate()) {
            return false;
        }
        var msg = "";
        if ($scope.data.currItem.customs_code == undefined || $scope.data.currItem.customs_code == "") {
            msg = " 报关单号";
        }
        if ($scope.data.currItem.customs_date == undefined || $scope.data.currItem.customs_date == "") {
            msg += " 报关日期";
        }
        if (msg.length > 0) {
            BasemanService.notice("请填写:" + msg);
            return false;
        }
        return true;
    }

    $scope.clearinformation = function () {
        $scope.data.currItem.stat = 1;
        $scope.data.currItem.create_time = new Date();
        $scope.data.currItem.creator = window.userbean.userid;
        $scope.data.currItem.org_id = window.userbean.org_id;
        $scope.data.currItem.org_name = window.userbean.org_name;
        $scope.data.currItem.seaport_out_id = 771;
        $scope.data.currItem.bill_type = 1; //正式报关单
        $scope.data.currItem.seaport_out_code = "NINGBO";
        $scope.data.currItem.seaport_out_name = "NINGBO";
    }
    $scope.initdata();
}//加载控制器
billmanControllers
    .controller('sale_customsZZ_headerEdit', sale_customsZZ_headerEdit)

