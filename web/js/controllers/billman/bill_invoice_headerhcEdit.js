var billmanControllers = angular.module('inspinia');
function bill_invoice_headerhcEdit($scope, $http, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {

    localeStorageService.pageHistory($scope, function () {
        return $scope.data.currItem
    });
//	var temp = localeStorageService.getHistoryItem($rootScope.$state.$current.name);


    $scope.data = {};
    $scope.currencys = [];
    $scope.userbean = {};
    $scope.currItem = {
        sale_pi_item_lineofsale_pi_headers: [],
        sale_pi_box_lineofsale_pi_headers: [],
        sale_pi_feeofsale_pi_headers: [],
        objattachs: []
    };
    if (window.userbean) {
        $scope.userbean = window.userbean;
    }

    //贸易类型系统词汇值
    var promise = BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"});
    promise.then(function (data) {
        $scope.sale_ent_types = HczyCommon.stringPropToNum(data.dicts);
    });
    var promise = BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "ship_type"});
    promise.then(function (data) {
        $scope.ship_types = HczyCommon.stringPropToNum(data.dicts);
    });
    //需要查询--机型
    var promise = BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "inv_fee_type"});
    promise.then(function (data) {
        //$scope.areaLevels = HczyCommon.stringPropToNum(data.Dict_Area_Levels);

        var fee_types = [];
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
            fee_types.push(newobj);
        }
        $scope.acolumns[3].options = fee_types;
    });
    //中信保支付方式(Pay_Type)
    var promise = BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pay_type"});
    promise.then(function (data) {
        var pay_types = [];
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
            pay_types.push(newobj);
        }
    });


    var promise = BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "box_type"});
    promise.then(function (data) {
        var box_types = [];
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
            box_types.push(newobj);
        }
        $scope.Cabinetcolumns[1].options = box_types;
    });


    var promise = BasemanService.RequestPost("base_search", "searchdict", {dictcode: "funds_type"});
    promise.then(function (data) {
        var funds_type = [];
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
            funds_type.push(newobj);
        }
        $scope.feeriskcolumns[5].options = funds_type;
    });

    $scope.init = function () {
        BasemanService.pageInit($scope);
        $scope.stats = [{
            id: 1,
            name: "制单"
        }, {
            id: 2,
            name: "提交"
        }, {
            id: 3,
            name: "启动"
        }, {
            id: 4,
            name: "驳回"
        }, {
            id: 5,
            name: "审核"
        }, {
            id: 99,
            name: "关闭"
        }];

        $scope.sale_types = [{
            id: 1,
            name: "外销常规订单"
        }, {
            id: 2,
            name: "外销散件订单"
        }, {
            id: 3,
            name: "配件订单"
        }
//        , {
//            id: 4,
//            name: "外销样机订单"
//        }
        ];
        $scope.ship_types = [{
            id: 1,
            name: "海运"
        }, {
            id: 2,
            name: "汽运"
        }, {
            id: 3,
            name: "空运"
        }, {
            id: 4,
            name: "铁运"
        }];

        var postdata = {
            sqlwhere: ""
        };

        var promise = BasemanService.RequestPost("base_currency", "search", postdata);
        promise.then(function (data) {
            $scope.currencys = HczyCommon.stringPropToNum(data.base_currencys);
        });

        var promise = BasemanService.RequestPost("price_type", "search", postdata);
        promise.then(function (data) {
            $scope.price_types = HczyCommon.stringPropToNum(data.price_types);
        });

        $scope.mainbtn = {
            search: false,
            add: false
        };
    };

    $scope.init();

    $scope.addnoticeitem = function () {
        var postdata = {};
        postdata.warn_id = $scope.data.currItem.warn_id;
        var data = $scope.aoptions.grid.getData();
        for (var i = 0; i < data.length; i++) {
            if (data[i].ref_box_no == undefined) {
                data[i].ref_box_no = "";
            }
            if (i == 0) {
                postdata.sql = data[i].ref_box_no;
            } else {
                postdata.sql = postdata.sql + "," + data[i].ref_box_no
            }
        }
        var promise = BasemanService.RequestPost("sale_ship_warn_header", "doseleteitemline_c", postdata);
        promise.then(function (data) {
            $scope.data.currItem.sale_ship_item_line_cofsale_ship_notice_headers = data.sale_ship_warn_lineofsale_ship_warn_headers;
            $scope.fissoptions.grid.setData($scope.data.currItem.sale_ship_item_line_cofsale_ship_notice_headers);
            $scope.fissoptions.grid.resizeCanvas();
        });

    };
    $scope.delnoticeitem = function () {

        var grid = $scope.fissoptions.grid;
        if (grid.getActiveCell()) {
            var rowidx = grid.getActiveCell().row;
            $scope.fissoptions.grid.getData().splice(rowidx, 1);
            grid.invalidateAllRows();
            grid.updateRowCount();
            grid.render();
        }

    };
    $scope.addcntitem = function () {
        var box_type_id = "";
        for (var i = 0; i < $scope.box_line_types.length; i++) {
            if ($scope.box_line_types[i].desc == '40HQ') {
                box_type_id = $scope.box_line_types[i].value;
                break;
            }
        }
        var item = {
            seq: 1,
            box_type: box_type_id
        };

        $scope.cntoptions.grid.getData().push(item);
        $scope.cntoptions.grid.resizeCanvas();
    };

    $scope.delcntitem = function () {

        var grid = $scope.cntoptions.grid;
        if (grid.getActiveCell()) {
            var rowidx = grid.getActiveCell().row;
            $scope.cntoptions.grid.getData().splice(rowidx, 1);
            grid.invalidateAllRows();
            grid.updateRowCount();
            grid.render();
        }

    };

    $scope.delitem = function () {

        var grid = $scope.aoptions.grid;
        if (grid.getActiveCell()) {
            var rowidx = grid.getActiveCell().row;
            $scope.aoptions.grid.getData().splice(rowidx, 1);
            grid.invalidateAllRows();
            grid.updateRowCount();
            grid.render();
        }
        $scope.aggreate();
    };
    //查询目的港
    $scope.searchinport = function (item) {
        return $modal.open({
            templateUrl: "views/common/Pop_Common.html",
            controller: function ($scope, $modalInstance) {
                $scope.FrmInfo = {};
                $scope.FrmInfo.title = "港口查询";
                $scope.FrmInfo.thead = [{
                    name: "港口名称",
                    code: "seaport_name"
                }, {
                    name: "英文名称",
                    code: "english_name"
                }];
                $scope.ok = function () {
                    item.seaport_in_id = $scope.item.seaport_id;
                    item.seaport_in_code = $scope.item.seaport_code;
                    item.seaport_in_name = $scope.item.seaport_code;

                    $modalInstance.close($scope.item);
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
                $scope.enter = function (e) {
                    var keycode = window.event ? e.keyCode : e.which;
                    if (keycode == 13) {
                        $scope.search();
                    }
                }
                $scope.search = function () {
                    var sqlWhere = BasemanService.getSqlWhere(["seaport_name", "seaport_type", "english_name"], $scope.searchtext);
                    var postdata = {
                        seaport_type: 2,
                        sqlwhere: sqlWhere
                    };
                    var promise = BasemanService.RequestPost("seaport", "search", postdata);
                    promise.then(function (data) {
                        $scope.items = data.seaports;
                    });
                };
                $scope.addLine = function (index, $event) {
                    $($event.currentTarget).addClass("info").siblings("tr").removeClass("info");
                    $scope.item = $scope.items[index];
                };
                $scope.addConfirm = function (index) {

                    item.seaport_in_id = $scope.items[index].seaport_id;
                    item.seaport_in_code = $scope.item.seaport_code;
                    item.seaport_in_name = $scope.items[index].seaport_code;
                    $modalInstance.close($scope.items[index]);
                }
            },
            scope: $scope
        });
    };
    //查询会计区间
    $scope.selectperiod = function () {
        $scope.FrmInfo = {
            title: "会计区间查询",
            thead: [{
                name: "会计期间名称",
                code: "dname"
            }, {
                name: "会计期间年度",
                code: "period_year"
            }, {
                name: "备注",
                code: "note"
            }],
            classid: "fin_bud_period_header",
            searchlist: ["dname", "period_year", "note"],
            postdata: {flag: 3},
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.dname = result.dname;
            $scope.data.currItem.period_year = result.period_year;
        })
    };


    $scope.fission_stat = false;
    $scope.show_fission = function () {
        $scope.fission_stat = !$scope.fission_stat;
        if ($scope.fissoptions.grid.getCellEditor() != undefined) {
            $scope.fissoptions.grid.getCellEditor().commitChanges();
        }
        ;
        $timeout(function () {
            $scope.fissoptions.grid.resizeCanvas();

        })
    };
     $scope.invoice_qty = function () {
        var _this = $(this);
        var val = _this.val();
        var grid = $scope.aoptions.grid;
        var index = _this.attr('index');
		var sum=0;
        var data = grid.getData();
        if (index != undefined) {
            $scope.itemtemp = grid.getData()[index];
            val = val ? val : 0;
            $scope.itemtemp.other_amt = Number($scope.itemtemp.other_price) * Number(val);
            if ($scope.data.currItem.have_lc == 2) {
                $scope.itemtemp.invoice_amt = $scope.itemtemp.other_amt / (1 - parseFloat($scope.itemtemp.lc_rate))
            } else {
                $scope.itemtemp.invoice_amt = $scope.itemtemp.other_amt;
            }
        }
        var cell1 = 0, cell2 = 0;
        for (var i = 0; i < $scope.acolumns.length; i++) {
            if ($scope.acolumns[i].field == "other_amt") {
                cell1 = i;
                continue;
            }
            if ($scope.acolumns[i].field == "invoice_amt") {
                cell2 = i;
                continue;
            }
        }
        grid.updateCell(Number(index), cell1);
        grid.updateCell(Number(index), cell2);
		$timeout(function(){
	    var data=grid.getData();
		for(var i=0;i<data.length;i++){			
			sum+=parseFloat(data[i].invoice_amt||0);
		}
		$scope.data.currItem.invoice_amt=HczyCommon.toDecimal2(sum);
		})
		
    }
    $scope.other_price = function () {
        var _this = $(this);
        var val = _this.val();
        var grid = $scope.aoptions.grid;
        var index = _this.attr('index');
		var sum=0;
        var data = grid.getData();
        if (index != undefined) {
            $scope.itemtemp = grid.getData()[index];
            val = val ? val : 0;
            $scope.itemtemp.other_amt = Number($scope.itemtemp.invoice_qty) * Number(val);
            if ($scope.data.currItem.have_lc == 2) {
                $scope.itemtemp.invoice_amt = $scope.itemtemp.other_amt / (1 - parseFloat($scope.itemtemp.lc_rate))
            } else {
                $scope.itemtemp.invoice_amt = $scope.itemtemp.other_amt;
            }
        }
        var cell1 = 0, cell2 = 0;
        for (var i = 0; i < $scope.acolumns.length; i++) {
            if ($scope.acolumns[i].field == "other_amt") {
                cell1 = i;
                continue;
            }
            if ($scope.acolumns[i].field == "invoice_amt") {
                cell2 = i;
                continue;
            }
        }
        grid.updateCell(Number(index), cell1);
        grid.updateCell(Number(index), cell2);
		$timeout(function(){
	    var data=grid.getData();
		for(var i=0;i<data.length;i++){			
			sum+=parseFloat(data[i].invoice_amt||0);
		}
		$scope.data.currItem.invoice_amt=HczyCommon.toDecimal2(sum);
		})
    }

    $scope.aoptions = {
        editable: true,
        enableAddRow: false,
        enableCellNavigation: true,
        asyncEditorLoading: false,
        autoEdit: true
    };
    $scope.acolumns = [{
        id: "sel",
        name: "序号",
        field: "seq",
        behavior: "select",
        cssClass: "cell-selection",
        width: 40
    }, {
        id: "item_code",
        name: "产品编码",
        field: "item_code",
        width: 100
    }, {
        id: "item_name",
        name: "产品名称",
        field: "item_name",
        width: 120

    }, {
        id: "fee_type",
        name: "费用项目",
        field: "fee_type",
        width: 120,
        options: [],
        editor: Slick.Editors.SelectOption,
        formatter: Slick.Formatters.SelectOption
    }, {
        id: "item_code",
        name: "工厂型号编码",
        field: "item_code",
        width: 120,
    }, {
        id: "item_name",
        name: "工厂型号",
        field: "item_name",
        width: 80
    }, {
        id: "cust_item_name",
        name: "客户型号",
        field: "cust_item_name",
        width: 80
    }, {
        id: "cust_spec",
        name: "客户产品名称",
        field: "cust_spec",
        width: 80
    }, {
        id: "qty",
        name: "装柜数量",
        field: "qty",
        width: 80
    }, {
        id: "price",
        name: "销售价",
        field: "price",
        width: 120
    }, {
        id: "line_amt",
        name: "金额",
        field: "line_amt",
        width: 120
    }, {
        id: "actual_out_qty",
        name: "已发货确认数量",
        field: "actual_out_qty",
        width: 120
    }, {
        id: "allready_invoice_qty",
        name: "已开发票数量",
        field: "allready_invoice_qty",
        width: 80
    }, {
        id: "other_price",
        name: "开票单价",
        field: "other_price",
        width: 150,
		headerCssClass: 'not-null',
        action: $scope.other_price
    }, {
        id: "invoice_qty",
        name: "开票数量",
        field: "invoice_qty",
        width: 120,
		headerCssClass: 'not-null',
        action: $scope.invoice_qty
    }, {
        id: "other_amt",
        name: "开票金额",
        field: "other_amt",
		headerCssClass: 'not-null',
        width: 80
    }, {
        id: "invoice_amt",
        name: "实际金额",
        field: "invoice_amt",
		headerCssClass: 'not-null',
        width: 80
    }, {
        id: "jd_qty",
        name: "交单数量",
        field: "jd_qty",
        width: 80
    }, {
        id: "jd_amt",
        name: "交单金额",
        field: "jd_amt",
        width: 80
    }, {
        id: "pack_style",
        name: "箱数",
        field: "pack_style",
        width: 80
    }, {
        id: "pack_rule",
        name: "体积",
        field: "pack_rule",
        width: 80
    }, {
        id: "unit_gw",
        name: "毛重",
        field: "unit_gw",
        width: 80
    }, {
        id: "nw",
        name: "净重",
        field: "nw",
        width: 120
    }, {
        id: "notice_no",
        name: "通知单号",
        field: "notice_no",
        width: 120
    }];
    //柜型柜量
    $scope.cntline = [];
    $scope.Cabinetoptions = {
        editable: true,
        enableAddRow: false,
        enableCellNavigation: true,
        asyncEditorLoading: false,
        autoEdit: true
    };
    $scope.Cabinetcolumns = [{
        id: "sel",
        name: "序号",
        field: "seq",
        behavior: "select",
        cssClass: "cell-selection",
        width: 40
    }, {
        id: "box_type",
        name: "柜型",
        field: "box_type",
        width: 100,
        options: [],
        editor: Slick.Editors.SelectOption
    }, {
        id: "ref_box_no",
        name: "参考柜号",
        field: "ref_box_no",
        width: 80
        //editor: Slick.Editors.Text
    }, {
        id: "actual_box_no",
        name: "实际柜号",
        field: "actual_box_no",
        width: 80
        //editor: Slick.Editors.Text
    }, {
        id: "box_address",
        name: "装柜地点",
        field: "box_address",
        width: 150
    },
        {
            id: "total_pack_rule",
            name: "总体积",
            field: "total_pack_rule",
            width: 150
            //editor: Slick.Editors.Number
        },
        {
            id: "total_unit_gw",
            name: "总毛重",
            field: "total_unit_gw",
            width: 150
            //editor: Slick.Editors.Number
        },
        {
            id: "total_unit_nw",
            name: "总净重",
            field: "total_unit_nw",
            width: 150
            //editor: Slick.Editors.Number
        },
        {
            id: "zuiz_box_date",
            name: "最总到柜时间",
            field: "zuiz_box_date",
            width: 150
            //editor: Slick.Editors.Number
        },
        {
            id: "pre_box_date",
            name: "预计到柜时间",
            field: "pre_box_date",
            width: 150
            //editor: Slick.Editors.Number
        },
        {
            id: "acyual_box_date",
            name: "确认到柜时间",
            field: "acyual_box_date",
            width: 150
            //editor: Slick.Editors.Number
        }];
   

    $scope.cntoptions = {
        editable: true,
        enableAddRow: false,
        enableCellNavigation: true,
        asyncEditorLoading: false,
        autoEdit: true
    };
    $scope.cntcolumns = [{
        id: "sel",
        name: "序号",
        field: "seq",
        behavior: "select",
        cssClass: "cell-selection",
        width: 40
    }, {
        id: "item_h_code",
        name: "整机编码",
        field: "item_h_code",
        width: 100
    }, {
        id: "item_h_name",
        name: "整机名称",
        field: "item_h_name",
        width: 120
    }, {
        id: "cust_item_name",
        name: "客户机型",
        field: "cust_item_name",
        width: 120
    }, {
        id: "qty",
        name: "发货通知数量",
        field: "qty",
        width: 120
    }, {
        id: "price",
        name: "单价",
        field: "price",
        width: 120
    }, {
        id: "line_amt",
        name: "金额",
        field: "line_amt",
        width: 150
    },
        {
            id: "actual_out_qty",
            name: "已发货确认数量",
            field: "actual_out_qty",
            width: 150
        },
        {
            id: "other_price",
            name: "开票单价",
            field: "other_price",
            width: 150
        },
        {
            id: "invoice_qty",
            name: "开票数量",
            field: "invoice_qty",
            width: 120
        },
        {
            id: "other_amt",
            name: "开票金额",
            field: "other_amt"
        },
        {
            id: "invoice_amt",
            name: "实际金额",
            field: "invoice_amt"
        },
        {
            id: "nw",
            name: "净重",
            field: "nw",
        },
        {
            id: "gw",
            name: "毛重",
            field: "gw"
        }
        ,
        {
            id: "volume",
            name: "体积",
            field: "volume"
        }
        ,
        {
            id: "brand_name",
            name: "品牌",
            field: "brand_name"
        }
    ];


    $scope.boxsumoptions = {
        editable: true,
        enableAddRow: false,
        enableCellNavigation: true,
        asyncEditorLoading: false,
        autoEdit: true
    };
    $scope.boxsumcolumns = [{
        id: "sel",
        name: "序号",
        field: "seq",
        behavior: "select",
        cssClass: "cell-selection",
        width: 40
    }, {
        id: "order_fee_code",
        name: "订单费用编码",
        field: "order_fee_code",
        width: 150
    }, {
        id: "order_fee_name",
        name: "订单费用名称",
        field: "order_fee_name",
        width: 150
    }, {
        id: "notice_fee",
        name: "费用",
        field: "notice_fee",
        width: 120
        //options: [{desc:"高端机",value:1},{desc:"常规机",value:2},{desc:"包销机",value:3},{desc:"特价机",value:4}],
        // editor: Slick.Editors.SelectOption,
        //formatter: Slick.Formatters.SelectOption
    }, {
        id: "amt_fee",
        name: "PI费用",
        field: "amt_fee",
        width: 150
    }]
    $scope.feeriskoptions = {
        editable: true,
        enableAddRow: false,
        enableCellNavigation: true,
        asyncEditorLoading: false,
        autoEdit: true
    };
    $scope.feeriskcolumns = [{
        id: "sel",
        name: "序号",
        field: "seq",
        behavior: "select",
        cssClass: "cell-selection",
        width: 40
    }, {
        id: "allo_no",
        name: "分配单号",
        field: "allo_no",
        width: 150
    }, {
        id: "other_no ",
        name: "资金系统单号",
        field: "other_no ",
        width: 150
    }, {
        id: "allo_amt",
        name: "本次分配金额",
        field: "allo_amt",
        width: 120
        //options: [{desc:"高端机",value:1},{desc:"常规机",value:2},{desc:"包销机",value:3},{desc:"特价机",value:4}],
        // editor: Slick.Editors.SelectOption,
        //formatter: Slick.Formatters.SelectOption
    }, {
        id: "create_time",
        name: "制单时间",
        field: "create_time",
        width: 150
    }, {
        id: "funds_type",
        name: "到款类型",
        field: "funds_type",
        options: [],
        // editor: Slick.Editors.SelectOption,
        formatter: Slick.Formatters.SelectOption
    }]

    $scope.search = function () {
        $scope.FrmInfo = {
            title: "商业发票查询",
            thead: [{
                name: "商业发票号",
                code: "invoice_no"
            }, {
                name: "形式发票单号",
                code: "pi_no"
            }, {
                name: "客户名称",
                code: "cust_name"
            }],
            classid: "bill_invoice_header",
            searchlist: ["invoice_no", "pi_no", "cust_name"],
            postdata: {},
            sqlBlock: "bill_type=2"
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem = result;
            $scope.refresh(2);
        })
    };


    $scope.delete = function (index) {
        var postdata = {
            invoice_id: $scope.data.currItem.invoice_id
        };
        if (postdata.invoice_id == undefined || postdata.invoice_id == 0) {
            BasemanService.notice("单据ID不存在，不能删除", "alert-warning");
            return;
        }
        ;
        ds.dialog.confirm("您确定删除【整个单据】吗？", function () {
            var promise = BasemanService.RequestPost("bill_invoice_header", "delete", postdata);
            promise.then(function (data) {
                BasemanService.notice("删除成功!", "alert-info");

                $scope.clearinformation();
            });

        });
    }


    $scope.refresh = function (flag) {
        var _this = this;
        var postdata = {
            invoice_id: $scope.data.currItem.invoice_id
        };
        if (postdata.invoice_id == undefined || postdata.invoice_id == 0) {
            BasemanService.notice("单据没有保存，无法刷新", "alert-warning");
            return;
        }
        ;
        var promise = BasemanService.RequestPost("bill_invoice_header", "select", postdata);
        promise.then(function (data) {
            if (flag != 2) {
                BasemanService.notice("刷新成功", "alert-info");
                $timeout(function () {
                    angular.element('div.wf_container').find("button.wfrefresh").triggerHandler('click');
                });
            }
            ;
            $scope.data.currItem = data;
            $scope.data.currItem.lc_bill_id = parseInt(data.lc_bill_id);
            $scope.data.currItem.splitorwhole = 2;

            if ($scope.data.currItem.stat != 1) {
                $("#bank_id").attr("disabled", true);
            }
            //整机信息
            $scope.cntoptions.grid.setData($scope.data.currItem.bill_invoice_h_lineofbill_invoice_headers);
            $scope.cntoptions.grid.invalidateAllRows();
            $scope.cntoptions.grid.updateRowCount();
            $scope.cntoptions.grid.render();
            //产品明细
            $scope.aoptions.grid.setData($scope.data.currItem.bill_invoice_lineofbill_invoice_headers);
            $scope.aoptions.grid.invalidateAllRows();
            $scope.aoptions.grid.updateRowCount();
            $scope.aoptions.grid.render();
            //核销
            $scope.feeriskoptions.grid.setData($scope.data.currItem.bill_invoice_funds_lineofbill_invoice_headers);
            $scope.feeriskoptions.grid.invalidateAllRows();
            $scope.feeriskoptions.grid.updateRowCount();
            $scope.feeriskoptions.grid.render();
            //费用
            $scope.boxsumoptions.grid.setData($scope.data.currItem.bill_invoice_feeofbill_invoice_headers);
            $scope.boxsumoptions.grid.invalidateAllRows();
            $scope.boxsumoptions.grid.updateRowCount();
            $scope.boxsumoptions.grid.render();


        });


    }

    $scope.save = function (flag) {
        //$scope.data.currItem.sale_ship_item_lineofsale_ship_notice_headers=[];
        var postdata = $scope.data.currItem;
        
        if ($scope.aoptions.grid.getCellEditor() != undefined) {
            $scope.aoptions.grid.getCellEditor().commitChanges();
        }
        ;
        if ($scope.cntoptions.grid.getCellEditor() != undefined) {
            $scope.cntoptions.grid.getCellEditor().commitChanges();
        }
        ;
        if($scope.data.currItem.red_note==""||$scope.data.currItem.red_note==undefined){
		BasemanService.notice("红冲理由未填，请填写!", "alert-info");
        return;
		}
		if($scope.data.currItem.fpjz_date==""||$scope.data.currItem.fpjz_date==undefined){
		BasemanService.notice("发票记账日期未填，请填写!", "alert-info");
        return;
		}
		if($scope.data.currItem.dname==""||$scope.data.currItem.dname==undefined){
		BasemanService.notice("会计区间未填，请填写!", "alert-info");
        return;
		}
        // $scope.data.currItem.bill_invoice_h_lineofbill_invoice_headers= $scope.aoptions.grid.getData();
        //$scope.data.currItem.sale_ship_item_line_cofsale_ship_notice_headers= $scope.fissoptions.grid.getData();
        // $scope.data.currItem.bill_invoice_h_lineofbill_invoice_headers= $scope.boxsumoptions.grid.getData();

        for (i = 0; i < $scope.data.currItem.bill_invoice_h_lineofbill_invoice_headers.length; i++) {
            $scope.data.currItem.bill_invoice_h_lineofbill_invoice_headers[i].seq = (i + 1);
        }
        for (i = 0; i < $scope.data.currItem.bill_invoice_lineofbill_invoice_headers.length; i++) {
            $scope.data.currItem.bill_invoice_lineofbill_invoice_headers[i].seq = (i + 1);
        }
        for (i = 0; i < $scope.data.currItem.bill_invoice_feeofbill_invoice_headers.length; i++) {
            $scope.data.currItem.bill_invoice_feeofbill_invoice_headers[i].seq = (i + 1);
        }
		postdata.bill_type = 2;
        if (FormValidatorService.validatorFrom($scope)) {
            var action = "update";
            if (postdata.invoice_id == undefined || postdata.invoice_id == 0) {
                action = "insert";
            }
			postdata.flag=10;
            var promise = BasemanService.RequestPost("bill_invoice_header", action, postdata);
            promise.then(function (data) {
                if(flag!=2){
                BasemanService.notice("保存成功!", "alert-info");}
                $scope.data.currItem = data;
				$scope.refresh(2);
                $scope.data.currItem.lc_bill_id = data.lc_bill_id;

            })
        }
    }


    //业务员查询
    $scope.selectSaleUserId = function () {
        var FrmInfo = {};
        FrmInfo.flag = 2;

        if ($scope.data.currItem.cust_id == undefined)FrmInfo.cust_id = 0

        FrmInfo.org_id = $scope.data.currItem.org_id

        FrmInfo.title = "查询业务员";

        FrmInfo.thead = [{
            name: "业务员ID",
            code: "userid"
        }];
        BasemanService.openCommonFrm(PopCustController, $scope, FrmInfo)
            .result.then(function (result) {
            $scope.data.currItem.sales_user_id = result.userid;
            //$scope.data.currItem.cust_code = result.cust_code;
            //$scope.data.currItem.cust_name = result.cust_name;

        });
    }

    $scope.selectnotice = function () {
        $scope.FrmInfo = {
            title: "商业发票查询",
            thead: [{
                name: "商业发票号",
                code: "invoice_no"
            }, {
                name: "形式发票单号",
                code: "pi_no"
            }, {
                name: "客户名称",
                code: "cust_name"
            }],
            classid: "bill_invoice_header",
            searchlist: ["invoice_no", "pi_no", "cust_name"],
            postdata: {
				s_flag:1
			},
            sqlBlock: "stat = 5 and nvl(bill_type,1) <> 2 and nvl(is_red,1) <> 2 and nvl(invoice_type,0) <> 2 and not exists (select 1 from bill_invoice_header ih where ih.old_invoice_id = bill_invoice_header.invoice_id and nvl(ih.bill_type,0)=2) "
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			var postdata={};
            postdata.invoice_id = result.invoice_id;
            var promise = BasemanService.RequestPost("bill_invoice_header", "select", postdata);
        promise.then(function (data) {
            $scope.data.currItem = data;
            $scope.data.currItem.lc_bill_id = parseInt(data.lc_bill_id);
            $scope.data.currItem.stat=1;
            $scope.data.currItem.old_invoice_no= $scope.data.currItem.invoice_no;
			$scope.data.currItem.old_invoice_id= $scope.data.currItem.invoice_id;
			$scope.data.currItem.invoice_no="";
			$scope.data.currItem.invoice_id=0;
            //整机信息
            $scope.cntoptions.grid.setData($scope.data.currItem.bill_invoice_h_lineofbill_invoice_headers);
            $scope.cntoptions.grid.invalidateAllRows();
            $scope.cntoptions.grid.updateRowCount();
            $scope.cntoptions.grid.render();
            //产品明细
			for(var i=0;i<$scope.data.currItem.bill_invoice_lineofbill_invoice_headers.length;i++){
				$scope.data.currItem.bill_invoice_lineofbill_invoice_headers[i].invoice_qty=-parseInt($scope.data.currItem.bill_invoice_lineofbill_invoice_headers[i].invoice_qty);
				$scope.data.currItem.bill_invoice_lineofbill_invoice_headers[i].other_amt=-parseFloat($scope.data.currItem.bill_invoice_lineofbill_invoice_headers[i].other_amt);
				$scope.data.currItem.bill_invoice_lineofbill_invoice_headers[i].invoice_amt=-parseFloat($scope.data.currItem.bill_invoice_lineofbill_invoice_headers[i].invoice_amt);
			}
            $scope.aoptions.grid.setData($scope.data.currItem.bill_invoice_lineofbill_invoice_headers);
            $scope.aoptions.grid.invalidateAllRows();
            $scope.aoptions.grid.updateRowCount();
            $scope.aoptions.grid.render();
            //核销
            $scope.feeriskoptions.grid.setData($scope.data.currItem.bill_invoice_funds_lineofbill_invoice_headers);
            $scope.feeriskoptions.grid.invalidateAllRows();
            $scope.feeriskoptions.grid.updateRowCount();
            $scope.feeriskoptions.grid.render();
            //费用
            $scope.boxsumoptions.grid.setData($scope.data.currItem.bill_invoice_feeofbill_invoice_headers);
            $scope.boxsumoptions.grid.invalidateAllRows();
            $scope.boxsumoptions.grid.updateRowCount();
            $scope.boxsumoptions.grid.render();


        });
        })
    }


    $scope.resizegrid = function(){
        if ($scope.aoptions.grid.getCellEditor() != undefined) {
            $scope.aoptions.grid.getCellEditor().commitChanges();
        };
        if ($scope.cntoptions.grid.getCellEditor() != undefined) {
            $scope.cntoptions.grid.getCellEditor().commitChanges();
        };
        $timeout(function(){
            $scope.aoptions.grid.resizeCanvas();
            $scope.cntoptions.grid.resizeCanvas();

        })
    }


    $scope.additem = function () {
        $scope.FrmInfo = {};
        $scope.FrmInfo.title = "产品查询";
        $scope.FrmInfo.thead = [{
            name: "出货预告号",
            code: "warn_no"
        }, {
            name: "整机名称",
            code: "cust_item_name"
        }, {
            name: "erp产品编码",
            code: "erp_code"
        }, {
            name: "参考柜号",
            code: "ref_box_no"
        }, {
            name: "数据状态",
            code: "csh"
        }, {
            name: "装柜数量",
            code: "qty"
        }, {
            name: "单价",
            code: "price"
        }, {
            name: "备注",
            code: "note"
        }];
        $scope.sqlwhere = ["warn_no", "cust_item_name", "ref_box_no", "csh", "qty", "price", "note"]; //弹出窗体查询条件
        $scope.flag = 2;
        $scope.classname = "sale_ship_warn_header";   //需要查询的后台类
        $scope.fun = "search";//查询方法
        $scope.containers = "sale_ship_warn_lineofsale_ship_warn_headers"
        $scope.postdata = {};
        $scope.postdata.warn_id = $scope.data.currItem.warn_id;
        $scope.postdata.pi_id = $scope.data.currItem.pi_id;
        //注意注意 前台接收容器在CommonAddController中定义，需要将新写的类的的容器写上
        BasemanService.openFrm("views/common/Pop_CommonAdd.html", CommonAddController, $scope, "", "lg")
            .result.then(function (items) {
            if (items.length) {

                var postdata = {};
                var data1 = [];
                var data = $scope.aoptions.grid.getData()
                if (data == undefined) {
                    data = [];
                }

                for (var i = 0; i < items.length; i++) {
                    var count3 = 0;
                    for (var j = 0; j < data.length; j++) {
                        if (items[i].warn_line_id == data[j].warn_line_id) {
                            count3 = count3 + 1;
                        }
                    }
                    if (count3 == 0) {
                        data.push(items[i]);
                    }

                }

                var promise = BasemanService.RequestPost("sale_ship_notice_header", "getpgflag", {
                    warn_id: $scope.data.currItem.warn_id,
                    pi_id: $scope.data.currItem.pi_id
                });
                promise.then(function (data) {
                    $scope.data.currItem.is_pg = data.is_pg
                })
                var promise = BasemanService.RequestPost("sale_pi_header", "getboxqty", {
                    warn_id: $scope.data.currItem.warn_id,
                    pi_id: $scope.data.currItem.pi_id
                });
                promise.then(function (data) {
                    $scope.data.currItem.sale_pi_box_lineofsale_ship_notice_headers = data.sale_pi_box_lineofsale_pi_headers;
                    $scope.data.currItem.sale_pi_feeofsale_ship_notice_headers = data.sale_pi_feeofsale_pi_headers
                })

                var promise = BasemanService.RequestPost("sale_ship_notice_header", "search", {notice_id: $scope.data.currItem.notice_id});
                promise.then(function (data) {
                    $scope.data.currItem.sale_ship_item_h_lineofsale_ship_notice_headers = data.sale_ship_item_h_lineofsale_ship_notice_headers;
                })
                $scope.aoptions.grid.setData(data);
                $scope.aoptions.grid.resizeCanvas();
            }

            $scope.aggreate();
        });
    }
    $scope.aggreate = function () {
        var data2 = [], identify = [];
        var data = $scope.aoptions.grid.getData();
        for (var i = 0; i < data.length; i++) {
            var count = 0;
            if (i == 0) {
                identify.push(data[i].erp_code)
            } else {
                for (var j = 0; j < identify.length; j++) {
                    if (data[i].erp_code == identify[j]) {
                        count = count + 1;
                    }
                }
            }
            if (count == 0 && i != 0) {
                identify.push(data[i].erp_code);
            }
        }
        for (var i = 0; i < identify.length; i++) {
            var count1 = 0;
            for (var j = 0; j < data.length; j++) {
                if (identify[i] == data[j].erp_code) {
                    if (count1 == 0) {
                        var object = $.extend({}, data[j])
                        count1 = count1 + 1;

                    } else {
                        object.qty = parseInt(object.qty) + parseInt(data[j].qty);
                        object.line_amt = parseInt(object.line_amt) + parseInt(data[j].line_amt);
                        object.total_gw = parseInt(object.total_gw) + parseInt(data[j].total_gw);
                        object.total_nw = parseInt(object.total_nw) + parseInt(data[j].total_nw);
                    }
                }
            }
            data2.push(object);
        }
        $scope.boxsumoptions.grid.setData(data2);
        $scope.boxsumoptions.grid.resizeCanvas();
    }

    $scope.export = function () {
        if (!$scope.data.currItem.invoice_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        BasemanService.RequestPost("bill_invoice_header", "exporttoexcel", {'invoice_id': $scope.data.currItem.invoice_id,'splitorwhole': $scope.data.currItem.splitorwhole
																			,'istransfer': 1})
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
        if (!$scope.data.currItem.invoice_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        BasemanService.RequestPost("bill_invoice_header", "exporttoexcel1", {'invoice_id': $scope.data.currItem.invoice_id,'splitorwhole': $scope.data.currItem.splitorwhole
																			,'istransfer': 1})
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
        if (!$scope.data.currItem.invoice_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        BasemanService.RequestPost("bill_invoice_header", "exporttoexcel", {'invoice_id': $scope.data.currItem.invoice_id,'splitorwhole': $scope.data.currItem.splitorwhole
																			,'istransfer': 2})
            .then(function (data) {
                if (data.docid != undefined && Number(data.docid) != 0) {
                    var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                    window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                } else {
                    BasemanService.notice("导出失败!", "alert-info");
                }
            });
    }

    $scope.export3 = function () {
        if (!$scope.data.currItem.invoice_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        BasemanService.RequestPost("bill_invoice_header", "exporttoexcel1", {'invoice_id': $scope.data.currItem.invoice_id,'splitorwhole': $scope.data.currItem.splitorwhole
																			,'istransfer': 2})
            .then(function (data) {
                if (data.docid != undefined && Number(data.docid) != 0) {
                    var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                    window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                } else {
                    BasemanService.notice("导出失败!", "alert-info");
                }
            });
    }

    $scope.wfstart = function () {
	   $scope.save(2);
	   $timeout(function(){
		   BasemanService.RequestPost("bill_invoice_header", "redcheck", {'invoice_id': $scope.data.currItem.invoice_id})
            .then(function (data) { 
            $scope.data.currItem.invoice_id= data.invoice_id;	
			$scope.refresh(2);
            BasemanService.notice("红冲成功", "alert-info");
            });
	   })
       

    }

    $scope.clearinformation = function () {
        //console.log('clearinformation:'+$scope.userbean.username);
        $scope.data = {};
        $scope.data.currItem = {
            creator: $scope.userbean.userid,
            //org_id:$scope.userbean.org_id,
            //org_name: $scope.userbean.org_name,
            sales_user_id: $scope.userbean.userid,

			splitorwhole: 2,
			
            stat: 1,
            seaport_out_id: 1,
            seaport_out_code: "nansha",
            seaport_out_name: "nansha",
            pi_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            delivery_date: moment().add('days', 35).format('YYYY-MM-DD HH:mm:ss'),
            objattachs: []
        };
        //console.log($scope); //OK
        //console.log($scope.currencys);
        //if ($scope.currencys.length > 0) {
        $scope.data.currItem.currency_id = 4; //$scope.currencys[0].currency_id;
        //};

        $scope.data.currItem.order_type_id = 1;
        $scope.data.currItem.price_type_id = 1;
        $scope.data.currItem.ship_type = 1;
        $scope.data.currItem.customer_bankofcustomers = [];
        $scope.data.currItem.customer_payment_typeofcustomers = [];

        $scope.data.currItem.sale_pi_item_lineofsale_pi_headers = [];
        $scope.data.currItem.sale_pi_box_lineofsale_pi_headers = [];

        if ($scope.aoptions.grid) {
            $scope.aoptions.grid.setData($scope.data.currItem.sale_pi_item_lineofsale_pi_headers);
            $scope.aoptions.grid.invalidateAllRows();
            $scope.aoptions.grid.render();
        }
        if ($scope.cntoptions.grid) {
            $scope.cntoptions.grid.setData($scope.data.currItem.sale_pi_box_lineofsale_pi_headers);
            $scope.cntoptions.grid.invalidateAllRows();
            $scope.cntoptions.grid.render();
        }
    };

    $scope.new = function () {
        $("a[data-target='#tab1']").trigger("click");
        $scope.clearinformation();
    };

    var _stateName = $rootScope.$state.$current.name;
    var data = localeStorageService.get(_stateName);
    if (data == undefined) { //非编辑
        var temp = localeStorageService.getHistoryItem($rootScope.$state.$current.name);
        if (temp) {//历史纪录
            $scope.data.currItem = temp;
        } else {
            //需加增加，定时器，否则取不到登录用户信息
            $timeout(function () {
                $scope.new();
            });
        }
    } else {
        if (!$scope.data.currItem) {
            $scope.data.currItem = {};
        }
        $scope.flag = data.flag;
        if (data.flag == 2) {
            $scope.new();
        } else {
            $scope.data.currItem.invoice_id = data.invoice_id;
            if (data.flag != undefined) {
                $scope.data.currItem.notice_id = data.notice_id;
                var promise = BasemanService.RequestPost("fin_lc_allot_header", "search", {
                    flag: 2,
                    sqlwhere: "sale_ship_notice_money_line.notice_id=" + parseInt($scope.data.currItem.notice_id)
                })
                promise.then(function (result) {
                    $scope.lc_nos = result.fin_lc_allot_headers;
                    for (var i = 0; i < $scope.lc_nos.length; i++) {
                        $scope.lc_nos[i].lc_bill_id = parseInt($scope.lc_nos[i].lc_bill_id)
                    }

                });

            }
            $scope.refresh(2);
        }
    }
}

//加载控制器
billmanControllers
    .controller('bill_invoice_headerhcEdit', bill_invoice_headerhcEdit)

