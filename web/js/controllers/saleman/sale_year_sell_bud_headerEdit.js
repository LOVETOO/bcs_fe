var salemanControllers = angular.module('inspinia');
function sale_year_sell_bud_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_year_sell_bud_headerEdit = HczyCommon.extend(sale_year_sell_bud_headerEdit, ctrl_bill_public);
    sale_year_sell_bud_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_year_sell_bud_header",
        key: "bud_id",
        wftempid: 10118,
        FrmInfo: {},
        grids: [
            {optionname: 'options_21', idname: 'sale_year_sell_bud_lineofsale_year_sell_bud_headers'},
            {optionname: 'options_22', idname: 'sale_year_sell_bud_line2ofsale_year_sell_bud_headers'}
        ]
    };
    $scope.beforClearInfo = function () {
        if ($rootScope.$state.$current.self.name == "crmman.sale_year_sell_bud_headerEdit") {
            $scope.s_flag = 1;
            $scope.objconf.FrmInfo = {sqlBlock: "1=1"}
        } else if ($rootScope.$state.$current.self.name == "crmman.sale_year_sell_bud_header_zfEdit") {
            $scope.s_flag = 2;
            $scope.objconf.FrmInfo = {sqlBlock: "stat=5"}
        }
    };
    $scope.beforClearInfo();
    /*********************作废********************/
    $scope.cancel = function () {
        if ($scope.data.currItem.modify_note == "" || $scope.data.currItem.modify_note == undefined) {
            BasemanService.notice("作废原因为空，请填写", "alter-warning")
            return;
        }
        ds.dialog.confirm("确定作废整单？", function () {
            var postdata = {};
            postdata.bud_id = $scope.data.currItem.bud_id;
            postdata.modify_note = $scope.data.currItem.modify_note;
            postdata.flag = 10;
            BasemanService.RequestPost("sale_year_sell_bud_header", "update", postdata).then(function (data) {
                BasemanService.notice("作废成功", "alter-warning");
                $scope.refresh(2);
            })
        })
    };
    /***************************系统词汇值********/
    {
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
            .then(function (data) {
                $scope.stats = HczyCommon.stringPropToNum(data.dicts);
            });
        //信用证类型
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "lc_type"})
            .then(function (data) {
                $scope.lc_types = HczyCommon.stringPropToNum(data.dicts);
            });
        //LC受益人--回款组织
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "return_ent_type"})
            .then(function (data) {
                $scope.return_ent_types = HczyCommon.stringPropToNum(data.dicts);
            });
        /*************网格下拉**********/
        //客户等级
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "cust_level"})
            .then(function (data) {
                var cust_levels = [];
                for (var i = 0; i < data.dicts.length; i++) {
                    cust_levels[i] = {
                        value: data.dicts[i].dictvalue,
                        desc: data.dicts[i].dictname
                    };
                }
                if ($scope.getIndexByField('columns_21', 'cust_level')) {
                    $scope.columns_21[$scope.getIndexByField('columns_21', 'cust_level')].cellEditorParams.values = cust_levels;
                }
            });
        //类型line_type
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "line_type"})
            .then(function (data) {
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
        //冷量cool_stand
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "cool_stand"})
            .then(function (data) {
                var cool_stands = [];
                for (var i = 0; i < data.dicts.length; i++) {
                    cool_stands[i] = {
                        value: data.dicts[i].dictvalue,
                        desc: data.dicts[i].dictname
                    };
                }
                if ($scope.getIndexByField('columns_21', 'cool_stand')) {
                    $scope.columns_21[$scope.getIndexByField('columns_21', 'cool_stand')].cellEditorParams.values = cool_stands;
                }
                if ($scope.getIndexByField('columns_22', 'cool_stand')) {
                    $scope.columns_21[$scope.getIndexByField('columns_22', 'cool_stand')].cellEditorParams.values = cool_stands;
                }
            });
        //面板
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "mb_stand"})
            .then(function (data) {
                var mb_stands = [];
                for (var i = 0; i < data.dicts.length; i++) {
                    mb_stands[i] = {
                        value: data.dicts[i].dictvalue,
                        desc: data.dicts[i].dictname
                    };
                }
                if ($scope.getIndexByField('columns_21', 'mb_stand')) {
                    $scope.columns_21[$scope.getIndexByField('columns_21', 'mb_stand')].cellEditorParams.values = mb_stands;
                }
            });
        //机型类别
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pro_type"})
            .then(function (data) {
                var pro_types = [];
                for (var i = 0; i < data.dicts.length; i++) {
                    pro_types[i] = {
                        value: data.dicts[i].dictvalue,
                        desc: data.dicts[i].dictname
                    };
                }
                if ($scope.getIndexByField('columns_21', 'pro_type')) {
                    $scope.columns_21[$scope.getIndexByField('columns_21', 'pro_type')].cellEditorParams.values = pro_types;
                }
            });
    }
    /***************************网格事件*********/
    {
        //excel导入
        $scope.importComplete = function () {
            var stringofrole = window.userbean.stringofrole;
            if (stringofrole.indexOf("销售人员") != -1 && stringofrole.indexOf("admin") != -1) {
                $scope.data.currItem.data_from = 1
            } else if (stringofrole.indexOf("财务部") != -1) {
                $scope.data.currItem.data_from = 2
            }
            var dataline = $scope.gridGetData("options_22");
            for (var i = 0; i < dataline.length; i++) {
                if ($scope.data.currItem.data_from > 0) {
                    if (dataline[i].line_type == ("整机")) {
                        dataline[i].line_type = 1
                    }
                    ;
                    if (dataline[i].line_type == ("内机")) {
                        dataline[i].line_type = 2
                    }
                    ;
                    if (dataline[i].line_type == ("外机")) {
                        dataline[i].line_type = 3
                    }
                    ;
                    if (dataline[i].line_type == ("配件")) {
                        dataline[i].line_type = 4
                    }
                    ;
                    if (dataline[i].line_type == ("样机")) {
                        dataline[i].line_type = 5
                    }
                    ;
                    if (dataline[i].line_type == ("SKD")) {
                        dataline[i].line_type = 6
                    }
                    ;
                    if (dataline[i].line_type == ("CKD")) {
                        dataline[i].line_type = 7
                    }
                    ;
                    if (dataline[i].line_type == ("支架或木托")) {
                        dataline[i].line_type = 8
                    }
                    ;
                    if (dataline[i].line_type == 1) {
                        dataline[i].pro_type = 1
                    }
                    ;
                    if (dataline[i].line_type == 2) {
                        dataline[i].pro_type = 2
                    }
                    ;
                    if (dataline[i].line_type == 3) {
                        dataline[i].pro_type = 3
                    }
                    ;
                    if (dataline[i].line_type == 4) {
                        dataline[i].pro_type = 4
                    }
                    ;

                    //款式
                    if (dataline[i].mb_stand == ("N")) {
                        dataline[i].mb_stand = 1
                    }
                    ;
                    if (dataline[i].mb_stand == ("K")) {
                        dataline[i].mb_stand = 2
                    }
                    ;
                    if (dataline[i].mb_stand == ("E")) {
                        dataline[i].mb_stand = 3
                    }
                    ;
                    if (dataline[i].mb_stand == ("S")) {
                        dataline[i].mb_stand = 4
                    }
                    ;
                    if (dataline[i].mb_stand == ("Q")) {
                        dataline[i].mb_stand = 5
                    }
                    ;
                    if (dataline[i].mb_stand == ("P")) {
                        dataline[i].mb_stand = 6
                    }
                    ;
                    if (dataline[i].mb_stand == ("V")) {
                        dataline[i].mb_stand = 7
                    }
                    ;
                    if (dataline[i].mb_stand == ("默认")) {
                        dataline[i].line_type = 8
                    }
                    ;
                    if (dataline[i].mb_stand == ("L")) {
                        dataline[i].mb_stand = 9
                    }
                    ;
                    if (dataline[i].mb_stand == ("F")) {
                        dataline[i].mb_stand = 10
                    }
                    ;
                    if (dataline[i].mb_stand == ("Y")) {
                        dataline[i].mb_stand = 11
                    }
                    ;
                    if (dataline[i].mb_stand == ("M")) {
                        dataline[i].mb_stand = 12
                    }
                    ;
                    if (dataline[i].mb_stand == ("A")) {
                        dataline[i].mb_stand = 13
                    }
                    ;
                    if (dataline[i].mb_stand == ("U")) {
                        dataline[i].mb_stand = 14
                    }
                    ;
                    if (dataline[i].mb_stand == ("AK")) {
                        dataline[i].mb_stand = 15
                    }
                    ;
                    if (dataline[i].mb_stand == ("其他")) {
                        dataline[i].mb_stand = 16
                    }
                    ;
                    //冷量
                    if (dataline[i].cool_stand == ("5K")) {
                        dataline[i].cool_stand = 1
                    }
                    ;
                    if (dataline[i].cool_stand == ("7K")) {
                        dataline[i].cool_stand = 2
                    }
                    ;
                    if (dataline[i].cool_stand == ("9K")) {
                        dataline[i].cool_stand = 3
                    }
                    ;
                    if (dataline[i].cool_stand == ("12K")) {
                        dataline[i].cool_stand = 4
                    }
                    ;
                    if (dataline[i].cool_stand == ("18K")) {
                        dataline[i].cool_stand = 5
                    }
                    ;
                    if (dataline[i].cool_stand == ("24K")) {
                        dataline[i].cool_stand = 6
                    }
                    ;
                    if (dataline[i].cool_stand == ("30K")) {
                        dataline[i].cool_stand = 7
                    }
                    ;
                    if (dataline[i].cool_stand == ("36K")) {
                        dataline[i].cool_stand = 8
                    }
                    ;
                    if (dataline[i].cool_stand == ("42K")) {
                        dataline[i].cool_stand = 9
                    }
                    ;
                    if (dataline[i].cool_stand == ("48K")) {
                        dataline[i].cool_stand = 10
                    }
                    ;
                    if (dataline[i].cool_stand == ("60K")) {
                        dataline[i].cool_stand = 11
                    }
                    ;
                    //是否新品
                    if (dataline[i].new_item == ("否")) {
                        dataline[i].new_item = 1
                    }
                    ;
                    if (dataline[i].new_item == ("是")) {
                        dataline[i].new_item = 2
                    }
                    ;
                }
                dataline[i].c_flag=0;
                dataline[i].g_flag=0;
                dataline[i].c_flag=0;
                dataline[i].i_flag=0;
            };
            BasemanService.RequestPost("sale_year_sell_bud_header", "checkline", {
                sale_year_sell_bud_lineofsale_year_sell_bud_headers: dataline,
                usd_rate:$scope.data.currItem.usd_rate,
                eur_rate:$scope.data.currItem.eur_rate,
            }).then(function (data) {
                $scope.gridSetData("options_21", data.sale_year_sell_bud_lineofsale_year_sell_bud_headers);
                $scope.data.currItem.sale_year_sell_bud_lineofsale_year_sell_bud_headers =  data.sale_year_sell_bud_lineofsale_year_sell_bud_headers;
                $scope.gridSetData('options_22', []);
                alert('导入成功！', "alert-info");
            })
          
        };
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
                line_type: 1
            };
            data.push(item);
            $scope.options_21.api.setRowData(data);
            $scope.data.currItem.sale_year_sell_bud_lineofsale_year_sell_bud_headers = data;
        };
        //部门
        $scope.selectorg = function () {
            if ($scope.data.currItem.stat != 1 && $scope.data.currItem.stat != 3) {
                return;
            }
            $scope.FrmInfo = {
                classid: "scporg",
                postdata: {},
                backdatas: "orgs",
                sqlBlock: "( idpath like '%211%' or idpath like '%273%') and 1=1 and stat =2 and OrgType = 5",
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (result) {
                $scope.data.currItem.org_name = result.orgname;
                $scope.data.currItem.org_code = result.code;
                $scope.data.currItem.org_id = result.orgid;
            });
        };
        //客户
        $scope.cust_code = function () {
            $scope.FrmInfo = {
                classid: "customer",
                postdata: {},
            };
            if ($scope.data.currItem.org_id > 0) {
                $scope.FrmInfo.sqlBlock = "(org_id = " + $scope.data.currItem.org_id
                    + " or other_org_ids like '%," + $scope.data.currItem.org_id + ",%')";
            }

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
                //配件比例、信保率、返利率
                data[index].xb_rate = result.insurance_rate;
                data[index].part_rate_byhand = result.part_rate;
                data[index].rebate_rate = result.rebate_rate;

                data[index].area_name = result.area_name;
                data[index].area_code = result.area_code;
                data[index].area_id = result.area_id;
                data[index].org_name = result.org_name;
                data[index].org_id = result.org_id;
                data[index].org_code = result.org_code;
                data[index].brand_name = result.brand_name;
                data[index].contract_subscrp = result.contract_subscrp;
                data[index].shipment_subscrp = result.shipment_subscrp;
                //area_name brand_name part_rate_byhand  //rebate_rate contract_subscrp shipment_subscrp
                $scope.options_21.api.setRowData(data);
                $scope.data.currItem.sale_year_sell_bud_lineofsale_year_sell_bud_headers = data;
//                $scope.data.currItem.org_name=result.org_name;
//                $scope.data.currItem.org_code=result.org_code;
//                $scope.data.currItem.org_id=result.org_id;
            });
        };
        //目的国
        $scope.to_area_name = function () {
            $scope.FrmInfo = {
                classid: "scparea",
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
                data[index].areaid = result.areaid;
                data[index].to_area_name = result.areaname;
                data[index].areacode = result.areacode;
                $scope.options_21.api.setRowData(data);
                $scope.data.currItem.sale_year_sell_bud_lineofsale_year_sell_bud_headers = data;
            });
        };
        //货币
        $scope.currency_name = function () {
            $scope.FrmInfo = {
                classid: "base_currency",
                postdata: {},
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (result) {
                var data = [];
                var index = $scope.options_21.api.getFocusedCell().rowIndex;
                var node = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
                for (var i = 0; i < node.length; i++) {
                    data.push(node[i].data)
                }
                data[index].currency_name = result.currency_name;
                data[index].currency_code = result.currency_code;
                data[index].currency_id = parseFloat(result.currency_id || 0);
                $scope.options_21.api.setRowData(data);
                $scope.data.currItem.sale_year_sell_bud_lineofsale_year_sell_bud_headers = data;
            });
        };
        //付款方式
        $scope.payment_type_name = function () {
            var focusRow = $scope.gridGetRow("options_21");
            if (focusRow.cust_code == undefined || focusRow.cust_code == "") {
                BasemanService.notice("请选择客户！", "alter-warning")
                return;
            }
            $scope.FrmInfo = {
                title: "付款方式",
                is_high: true,
                is_custom_search: true,
                thead: [
                    {
                        name: "付款方式编码",
                        code: "payment_type_code",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "付款方式名称",
                        code: "payment_type_name",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }],
                classid: "payment_type",
                postdata: {},
                searchlist: ["payment_type_code", "payment_type_name"],
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (result) {
                focusRow.payment_type_id = result.payment_type_id;
                focusRow.payment_type_code = result.payment_type_code;
                focusRow.payment_type_name = result.payment_type_name;
                $scope.gridUpdateRow("options_21", focusRow);
                //发货定金率
                $scope.GetSubscrpo(result);
            });
        };
        //发货定金率
        $scope.GetSubscrpo = function (result) {
            var focusRow = $scope.gridGetRow("options_21");
            $scope.data.currItem.sale_year_sell_pay_lineofsale_year_sell_bud_headers = [];
            var postdata = {};
            postdata.cust_id = Number(focusRow.cust_id || 0);
            postdata.payment_type_id = Number(focusRow.payment_type_id || 0);
            postdata.payment_type_line_id = Number(focusRow.payment_type_line_id || 0);
            BasemanService.RequestPost("customer", "getpayline", postdata)
                .then(function (data) {
                    // var pay = data.customer_payment_typeofcustomers;
                    var requestobj = BasemanService.RequestPostNoWait("payment_type", "select", {payment_type_id: focusRow.payment_type_id});
                    if (requestobj.pass) {
                        var data = requestobj.data.payment_type_lineofpayment_types;
                        for (var j = 1; j < data.length; j++) {
                            if (Number(result.pdays || 0) <= 90 || Number(data[j].interest_rate) <= 0) {
                                continue;
                            }
                            data[j].days = Number(result.pdays);
                            focusRow.interest_rate = Number(data[j].interest_rate);
                        }
                        $scope.data.currItem.sale_year_sell_pay_lineofsale_year_sell_bud_headers = data;
                    }
                });
            //计算Seq
            /*var data = $scope.gridGetData("options_21");
             var datapay = result.sale_year_sell_pay_lineofsale_year_sell_bud_headers;
             var seq = Number(focusRow.seq) || 0;
             if (seq == 0) {
             for (var i = 0; i < data.length; i++) {
             var tmp = Number(data[i].seq);
             if (tmp > seq) {
             seq = tmp;
             }
             focusRow.seq = Number(seq + 1);
             for (var i = 0; i < datapay.length; i++) {
             datapay[i].bud_id = result.bud_id;
             datapay[i].seq = Number(seq + 1);
             }
             }
             } else {
             for (var i = 0; i < datapay.length; i++) {
             datapay[i].bud_id = result.bud_id;
             datapay[i].seq = Number(seq);
             }
             }*/
            //取信保比率
            var postdata = {};
            postdata.sap_code = focusRow.cust_code;
            postdata.payment_type_id = Number(focusRow.payment_type_id);
            postdata.flag = 101;
            BasemanService.RequestPost("sale_year_sell_bud_header", "search", postdata)
                .then(function (data) {
                    if (data.sale_year_sell_bud_headers.length > 0) {
                        focusRow.xb_rate = parseFloat(data.sale_year_sell_bud_headers[0].xb_rate);
                        $scope.gridUpdateRow("options_21", focusRow);
                    }
                });

        };
        //订单明细  工厂型号编码
        $scope.item_h_code11 = function () {
            var focusRow = $scope.gridGetRow("options_21");
            if (focusRow.new_item == 1) {
                //替代机型编码
                $scope.columns_21[$scope.getIndexByField("columns_21", "rep_item_code")].editable = false;
            } else if (focusRow.new_item == 2) {
                $scope.columns_21[$scope.getIndexByField("columns_21", "rep_item_code")].editable = true;
            }
            if (focusRow.line_type == undefined || focusRow.line_type == 0) {
                BasemanService.notice("请选择机型类型！", "alter-warning")
                return;
            }
            if (focusRow.currency_name == undefined || focusRow.currency_name == 0) {
                BasemanService.notice("请选择货币！", "alter-warning")
                return;
            }
            if (parseInt(focusRow.new_item) == 2) {
                $scope.FrmInfo = {
                    title: "整机查询",
                    is_high: true,
                    thead: [
                        {
                            name: "物料编码", code: "item_code",
                            show: true, iscond: true, type: 'string'
                        }, {
                            name: "物料描述", code: "product_name",
                            show: true, iscond: true, type: 'string'
                        }, {
                            name: "压缩机", code: "compressor",
                            show: true, iscond: true, type: 'string'
                        }, {
                            name: "款式", code: "style",
                            show: true, iscond: true, type: 'string'
                        }, {
                            name: "冷凝器规格", code: "cool_spec",
                            show: true, iscond: true, type: 'string'
                        }],
                    classid: "pro_new_products",
                    postdata: {},
                    action: "search",
                    is_custom_search: true,
                    sqlBlock: "1=1",
                    searchlist: ["product_name", "item_type_name", "guide_price", "settle_price", "base_price"]
                };
                BasemanService.open(CommonPopController, $scope)
                    .result.then(function (result) {
                    result = HczyCommon.stringPropToNum(result);
                    // 自动带出平台、机型分类（默认赋值为整机）、冷量、压缩机、冷凝器规格、款式、内机平台；是否新品=否 则取标准机型维护表的数据
                    focusRow.item_h_code = result.item_code;
                    focusRow.item_h_name = result.product_name;
                    focusRow.item_h_id = parseFloat(result.item_h_id || 0);
                    focusRow.pt_spec = result.wclass_code;
                    focusRow.cool_stand = Number(result.cool_stand) || 0;
                    focusRow.comp_drawid = result.compressor;
                    focusRow.cond_spec = result.cool_spec;
                    focusRow.mb_stand = result.style;
                    focusRow.n_size = result.nclass_code;
                    focusRow.item_type_no = result.item_type_no;
                    focusRow.item_type_name = result.item_type_name;
                    focusRow.item_type_id = result.item_type_id;
                    $scope.gridUpdateRow("options_21", focusRow);
                });
            } else {
                $scope.columns_21[$scope.getIndexByField("columns_21", "rep_item_code")].editable = false;
                $scope.FrmInfo = {};
                $scope.FrmInfo.postdata = {},
                    $scope.FrmInfo.postdata.flag = 2;
                $scope.FrmInfo.postdata.pro_type = parseInt(focusRow.line_type);
                BasemanService.openFrm("views/saleman/item_h_code.html", item_h_codes, $scope, "", "lg")
                    .result.then(function (result) {
                    focusRow.item_h_id = result.item_h_id;
                    focusRow.item_h_code = result.item_h_code;
                    focusRow.item_h_name = result.item_h_name;
                    focusRow.sheet_metal = result.sheet_metal || "";
                    focusRow.n_size = result.n_size || "";
                    focusRow.rep_item_code = result.rep_item_code || "";
                    focusRow.adver_mater_rate = result.adver_mater_rate || 0;
                    // 自动带出平台、机型分类（默认赋值为整机）、冷量、压缩机、冷凝器规格、款式、内机平台；是否新品=否 则取标准机型维护表的数据
                    focusRow.item_spec = result.item_type_name || "";//大类
                    focusRow.cool_stand = parseInt(result.cool_stand || 0);//冷量
                    focusRow.comp_drawid = result.comp_name || "";//压缩机
                    focusRow.molded_case = result.molded_case || "";//塑壳
                    focusRow.cond_spec = result.condenser || "";//冷凝器
                    focusRow.pt_spec = result.standinfo || "";//外机平台
                    focusRow.mb_stand = Number(result.mb_stand) || "";//款式
                    focusRow.n_size = result.item_platform || "";//内机平台
                    focusRow.superid = Number(result.superid);
                    $scope.gridUpdateRow("options_21", focusRow);
                    if (Number(result.pro_type) > 0) {
                        focusRow.pro_type = Number(result.pro_type);
                    }
                    if (Number(result.superid) > 0) {
                        superid = Number(result.item_h_id);
                        BasemanService.RequestPost("pro_item_header", "select", {item_h_id: superid})
                            .then(function (data) {
                                focusRow.item_type_id = Number(result.item_type_id) || "";
                                focusRow.item_type_no = result.item_type_no || "";
                                focusRow.item_type_name = result.item_type_name || "";
                            })
                    }
                    //指导价
                    $scope.GetItemPrice(result);
                    //预算价
                    $scope.GetItemPrice2(result);
                    //标准价
                    $scope.GetItemPrice3(result);

                });
            }
        };
        $scope.item_h_code12 = function () {
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
                // focusRow.item_h_id = result.superid;
                focusRow.rep_item_code = result.item_h_code || "";
                focusRow.rep_item_name = result.item_h_name||"";
                focusRow.sheet_metal = result.sheet_metal || "";
                focusRow.n_size = result.n_size || "";
                focusRow.adver_mater_rate = result.adver_mater_rate || 0;
                $scope.gridUpdateRow("options_21", focusRow);
                //指导价
                $scope.GetItemPrice(result);
                //预算价
                $scope.GetItemPrice2(result);
                //标准价
                $scope.GetItemPrice3(result);
            });
        };
        $scope.GetItemPrice = function (result) {
            if (result.item_h_id == 0) {
                return;
            }
            var focusRow = $scope.gridGetRow("options_21");
            var ipro_type = focusRow.pro_type;
            var linetype = focusRow.line_type;
            var postdata = {};
            postdata.item_id = parseFloat(focusRow.item_h_id || 0);
            postdata.item_h_id = parseFloat(focusRow.superid || 0);
            postdata.pro_type = ipro_type;
            postdata.exchange_rate = parseFloat($scope.data.currItem.usd_rate) || 0;
            postdata.p4_cn = parseFloat($scope.data.currItem.eur_rate) || 0;
            postdata.currencyid = parseFloat(focusRow.currency_id) || 0;
            postdata.flag = 100;
            BasemanService.RequestPost("sale_guide_priceapply_header", "getitemprice", postdata)
                .then(function (data) {
                    if (Number(linetype) == 8 || Number(linetype) == 9) {
                        focusRow.guide_p6 = (parseFloat(data.base_price) * 1.17 * 1.02).toFixed(2);
                    } else {
                        focusRow.guide_p6 = parseFloat(data.base_price).toFixed(2);
                    }
                    if (data.settle_price == 0 || data.base_price == 0) {
                        BasemanService.notice("还未维护" + focusRow.item_h_name + "的指导价,请先维护!", "alter-warning")
                    }
                    $scope.gridUpdateRow("options_21", focusRow);
                })
        };
        $scope.GetItemPrice2 = function (result) {
            if (Number(result.item_h_id) == 0) {
                return;
            }
            var focusRow = $scope.gridGetRow("options_21");
            var ipro_type = focusRow.pro_type;
            var linetype = focusRow.line_type;
            var postdata = {};
            postdata.item_id = parseFloat(focusRow.item_h_id || 0);
            postdata.item_h_id = parseFloat(focusRow.superid || 0);
            postdata.pro_type = ipro_type;
            postdata.exchange_rate = parseFloat($scope.data.currItem.usd_rate) || 0;
            postdata.p4_cn = parseFloat($scope.data.currItem.eur_rate) || 0;
            postdata.currencyid = parseFloat(focusRow.currency_id) || 0;
            postdata.flag = 100;
            BasemanService.RequestPost("sale_pi_priceapply_header", "getitemprice", postdata)
                .then(function (data) {
                    if (Number(linetype) == 8 || Number(linetype) == 9) {
                        focusRow.p4 = parseFloat(data.settle_price).toFixed(2);

                    } else {
                        if (data.Currencyid == 5) {
                            focusRow.p4 = (parseFloat(data.settle_price) * 1.17 * 1.02).toFixed(2);

                        } else {
                            focusRow.p4 = parseFloat(data.settle_price).toFixed(2);
                        }
                    }

                    if (focusRow.settle_price == 0 || focusRow.base_price == 0) {
                        BasemanService.notice("还未维护" + focusRow.item_h_name + "的指导价,请先维护!", "alter-warning")
                    }
                    $scope.gridUpdateRow("options_21", focusRow);
                })
        };
        $scope.GetItemPrice3 = function (result) {
            if (result.item_h_id == 0) {
                return;
            }
            var focusRow = $scope.gridGetRow("options_21");
            var ipro_type = focusRow.pro_type;
            var linetype = focusRow.line_type;
            var postdata = {};
            postdata.item_id = parseFloat(focusRow.item_h_id || 0);
            postdata.item_h_id = parseFloat(focusRow.superid || 0);
            postdata.pro_type = ipro_type;
            postdata.exchange_rate = parseFloat($scope.data.currItem.usd_rate) || 0;
            postdata.p4_cn = parseFloat($scope.data.currItem.eur_rate) || 0;
            postdata.currencyid = parseFloat(focusRow.currency_id) || 0;
            postdata.flag = 100;
            BasemanService.RequestPost("sale_std_priceapply_header", "getitemprice", postdata)
                .then(function (data) {
                    if (Number(linetype) == 8 || Number(linetype) == 9) {
                        focusRow.std_cl_cb = parseFloat(data.settle_price).toFixed(2);
                    } else {
                        if (focusRow.currencyid == 5) {
                            focusRow.std_cl_cb = (parseFloat(data.settle_price) * 1.17 * 1.02).toFixed(2);
                        } else {
                            focusRow.std_cl_cb = parseFloat(data.settle_price).toFixed(2);
                        }

                    }
                    if (data.settle_price == 0) {
                        BasemanService.notice("还未维护" + focusRow.item_h_name + "的指导价,请先维护!", "alter-warning")
                    }
                    $scope.gridUpdateRow("options_21", focusRow);
                })
        };
        var item_h_codes = function item_h_code($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
            localeStorageService.pageHistory($scope, function () {
                $scope.pro_item.page_info = {
                    oldPage: $scope.oldPage,
                    currentPage: $scope.currentPage,
                    pageSize: $scope.pageSize,
                    totalCount: $scope.totalCount,
                    pages: $scope.pages
                };
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
        // 价格条款
        $scope.brand_name = function () {
            $scope.FrmInfo = {
                classid: "price_type",
                postdata: {},
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (result) {
                var data = [];
                var index = $scope.options_21.api.getFocusedCell().rowIndex;
                var node = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
                for (var i = 0; i < node.length; i++) {
                    data.push(node[i].data)
                }
                data[index].price_type_name = result.price_type_name;
                data[index].price_type_code = result.price_type_code;
                data[index].price_type_id = result.price_type_id;
                $scope.options_21.api.setRowData(data);
                $scope.data.currItem.sale_year_sell_bud_lineofsale_year_sell_bud_headers = data;
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
//               var sumTotal = datachose.qty;
                $scope.selectGridDelItem('options_21');//删除勾选行的数据
                for (var i = 0; i < result.lines; i++) {
//                   spiltRow[i].qty=parseInt(sumTotal);
                    $scope.gridAddItem('options_21', spiltRow[i])
                }

            });
        };
        //复制清单
        $scope.additem21 = function () {
            if ($scope.data.currItem.org_id == undefined || $scope.data.currItem.org_id == "") {
                BasemanService.notice("部门不能为空!", "alert-warning");
                return;
            }
            $scope.FrmInfo = {
                classid: "sale_year_sell_bud_header",
                postdata: {}
            };
            $scope.FrmInfo.sqlBlock = 'stat in (5,99) and org_id=' + $scope.data.currItem.org_id;
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                var postdata = {
                    bud_id: result.bud_id,
                }
                BasemanService.RequestPost("sale_year_sell_bud_header", "select", postdata)
                    .then(function (data) {
                        $scope.options_21.api.setRowData(data.sale_year_sell_bud_lineofsale_year_sell_bud_headers);
                        $scope.data.currItem.sale_year_sell_bud_lineofsale_year_sell_bud_headers = data.sale_year_sell_bud_lineofsale_year_sell_bud_headers;
                    });
            });
        };
        //盈利测算
        $scope.profit = function () {
            var data_from = 0;
            var mystring = window.userbean.stringofrole;
            if ($scope.user_auth.saleman_auth == false && $scope.user_auth.admin_auth == false) {
                $scope.data.currItem.data_from = 1
            }
            ;
            if ($scope.user_auth.infance_auth == true) {
                $scope.data.currItem.data_from = 2
            }
            ;
            if ($scope.data.currItem.data_from == 1) {
                $scope.CalcPay();
            }
            ;
            if ($scope.data.currItem.data_from == 2) {
                $scope.CalcPay2();
            }
            ;
        };
        //付款pay赋值到toPay
        $scope.SetPay2ToPay = function () {
            var focusRow = $scope.gridGetRow("options_21");
            var bud_id, seq;
            // $scope.data.currItem.sale_year_sell_pay_lineofsale_year_sell_bud_headers= [];
            bud_id = Number(focusRow.bud_id);
            seq = Number(focusRow.seq);
            var PayTo = $scope.data.currItem.sale_year_sell_pay_lineofsale_year_sell_bud_headers;
            var paydata = [];
            for (var i = 0; i < PayTo.length; i++) {
                if (PayTo[i].bud_id == bud_id && PayTo[i].seq == seq) {
                    paydata.push(PayTo[i]);
                    ;
                }
            }
            $scope.data.currItem.payment_type_lineofpayment_types = paydata;
        };
        //检查是否有空值
        $scope.CheckItemIsNull = function () {
            var focusRow = $scope.gridGetRow("options_21");
            var str, order_year, order_month, pro_year, pro_month, sell_year, sell_month, qty, sell_price;
            order_year = focusrow.order_year;
            order_month = focusrow.order_month;
            pro_year = focusrow.pro_year;
            pro_month = focusrow.pro_month;
            sell_year = focusrow.sell_year;
            sell_month = focusrow.sell_month;
            qty = focusrow.qty;
            sell_price = focusrow.sell_price;
            if (order_year != "") {
                str = "接单年度"
            }
            if (order_month != "") {
                str = "接单月度"
            }
            if (pro_year != "") {
                str = "生产年度"
            }
            if (pro_month != "") {
                str = "生产月度"
            }
            if (sell_year != "") {
                str = "销售年度"
            }
            if (sell_month != "") {
                str = "销售月度"
            }
            if (str != "") {
                str = str + '为空 ';
            }
            if (qty <= 0 || sell_price <= 0) {
                if (str != "") {
                    // str = str + #10#13;
                }
                if (qty != "") {
                    str = str + '数量 ';
                }
                if (sell_price != "") {
                    str = str + '销价 ';
                }
                str = str + '需大于0！';
            }
            result = str;
        };
        //判断年份
        function CheckYear(str, year) {
            var result = "";
            if (Number(year || 0) == 0)
                return result;
            if (Number(year || 0) > 1900 && Number(year || 0) < 2199) {
                result = "";
            } else {
                result = str + "";
            }
            return result;
        };
        //判断月份
        function CheckMonth(str, month) {
            var result = "";
            if (Number(month || 0) == 0)
                return result;
            if (Number(month || 0) > 0 && Number(month || 0) <= 12) {
                result = "";
            } else {
                result = str + "";
            }
            return result;
        };
        //是否新品
        $scope.acellchange = function () {
            var focusRow = $scope.gridGetRow("options_21");
            if (focusRow.new_item == 2) {
                focusRow.item_h_code = "";
                focusRow.item_h_name = "";
                focusRow.item_h_id = "";
                focusRow.pt_spec = "";
                focusRow.cool_stand = "";
                focusRow.comp_drawid = "";
                focusRow.cond_spec = "";
                focusRow.mb_stand = "";
                focusRow.n_size = "";
                focusRow.pro_type = "";
                $scope.gridUpdateRow("options_21", focusRow);
                $scope.columns_21[$scope.getIndexByField("columns_21", "rep_item_code")].editable = true;
            }
            if (focusRow.new_item == 1) {
                $scope.columns_21[$scope.getIndexByField("columns_21", "rep_item_code")].editable = false;
            }

        };
        //机型变化
        $scope.linecellchange = function () {
            var focusRow = $scope.gridGetRow("options_21");
            focusRow.item_h_code = "";
            focusRow.item_h_name = "";
            focusRow.item_h_id = "";
            focusRow.pt_spec = "";
            focusRow.cool_stand = "";
            focusRow.comp_drawid = "";
            focusRow.cond_spec = "";
            focusRow.mb_stand = "";
            focusRow.n_size = "";
            focusRow.pro_type = "";
            $scope.gridUpdateRow("options_21", focusRow);
        };
        /********计算*********/
        $scope.CalcPay = function () {
            var ckd, skd, mfee, sell_price;
            var qty, bud_id, seq, day;
            var sell_price, sales, guide_p6, P4, std_cl_cb, print_amt;
            var sum_p6, commission_rate, rebate_rate, amt_fee, interest_rate, xb_rate, sum_p4, part_cost, sum_p5;
            var ckd_amt, skd_amt, mfee;
            var ckd, skd;
            var Pay_Ratio, Interest_Rate2, Base_Fee;
            var tsales, tprint_amt, tsjamt;
            var tsum_p6, tcommission_rate, trebate_rate, tinterest_rate, txb_rate, tsum_p4, tpart_cost, tsum_p5;
            var usd_rate, eur_Rate, rate, rate2;
            BasemanService.RequestPost("sale_year_sell_bud_header", "search", {flag: 102})
                .then(function (data) {
                    if (data.sale_year_sell_bud_headers.length > 0) {
                        ckd = parseFloat(data.sale_year_sell_bud_headers[0].ckd || 0);
                        skd = parseFloat(data.sale_year_sell_bud_headers[0].skd || 0);
                        mfee = parseFloat(data.sale_year_sell_bud_headers[0].mfee || 0);
                    }
                    var usd_rate = parseFloat($scope.data.currItem.usd_rate || 0);
                    var eur_Rate = parseFloat($scope.data.currItem.eur_rate || 0);
                    var tsales = 0, tprint_amt = 0, tsjamt = 0;
                    var tsum_p6 = 0, tcommission_rate = 0;
                    var trebate_rate = 0, tinterest_rate = 0, txb_rate = 0;
                    var tsum_p4 = 0, tpart_cost = 0, tsum_p5 = 0;
                    var Dataline = $scope.data.currItem.sale_year_sell_bud_lineofsale_year_sell_bud_headers;
                    for (var i = 0; i < Dataline.length; i++) {
                        //销价
                        sell_price = parseFloat(Dataline[i].sell_price || 0);
                        //数量
                        qty = parseFloat(Dataline[i].qty || 0);
                        if (sell_price == 0 || qty == 0) {
                            Dataline[i].pay1 = "";
                            Dataline[i].pay2 = "";
                            Dataline[i].pay3 = "";
                        }
                        //销售额
                        sales = sell_price * qty;
                        //保险费
                        print_amt = parseFloat(Dataline[i].print_amt || 0);
                        //指导价
                        guide_p6 = parseFloat(Dataline[i].guide_p6 || 0);
                        //预算价
                        var p4 = parseFloat(Dataline[i].p4 || 0);
                        //标准价
                        std_cl_cb = parseFloat(Dataline[i].std_cl_cb || 0);
                        //指导价金额
                        sum_p6 = guide_p6 * qty;
                        //结算价金额
                        sum_p4 = p4 * qty;
                        //标准结算价金额
                        sum_p5 = std_cl_cb * qty;
                        //佣金
                        commission_rate = parseFloat(Dataline[i].commission_rate || 0) * 0.01 * sales;
                        //返利
                        rebate_rate = parseFloat(Dataline[i].rebate_rate || 0) * 0.01 * sales;
                        //海运费
                        amt_fee = parseFloat(Dataline[i].amt_fee || 0)
                        //资金成本
                        //interest_rate := StrToFloatDef((dgDetail.CellByField2['interest_rate', i]), 0) * 0.01* sales;
                        //信保比率
                        xb_rate = parseFloat(Dataline[i].xb_rate || 0) * 0.01 * sales;
                        //配件成本
                        part_cost = parseFloat(Dataline[i].part_rate_byhand || 0) * 0.01 * sales;
                        ckd_amt = 0;
                        skd_amt = 0;
                        if (Dataline[i].line_type == "CKD") {
                            ckd_amt = sales * ckd * 0.01;
                        }
                        if (Dataline[i].line_type == "SKD") {
                            skd_amt = sales * skd * 0.01;
                        }
                        bud_id = Number(Dataline[i].bud_id || 0);
                        seq = Number(Dataline[i].seq || 0);
                        if (sales != 0) {
                            var isexists = False;
                            var Datapayto = $scope.data.currItem.sale_year_sell_pay_lineofsale_year_sell_bud_headers;
                            for (var j = 0; j < Datapayto.length; j++) {
                                if (Number(Datapayto[j].bud_id || 0) && Number(Datapayto[j].seq || 0) && Number(Datapayto[j].bud_id || 0) > 90) {
                                    isexists = true;
                                }

                            }
                            interest_rate = 0;
                            for (var j = 0; j < Datapayto.length; j++) {
                                if (Number(Datapayto[j].bud_id || 0)) {
                                    seq = Number(Datapayto[j].seq || 0);
                                }
                                day = Datapayto[j].days
                                if (Number(Datapayto[j].days || 0) <= 90) {
                                    continue;
                                }
                                Pay_Ratio = parseFloat(Datapayto[j].pay_ratio || 0);
                                Interest_Rate2 = parseFloat(Datapayto[j].interest_rate || 0);
                                Base_Fee = parseFloat(Datapayto[j].base_fee || 0);

                                Pay_Ratio = 100 - parseFloat(Datapayto[j].shipment_subscrp || 0);
                                ;

                                interest_rate = interest_rate + (Interest_Rate2 / day) * (day - 90) * Pay_Ratio / 100 * sales;
                            }
                            if (!(isexists)) {
                                interest_rate = 0;
                            }
                            if (parseFloat(Dataline[i].commission_rate || 0) == 4) {
                                rate = usd_rate;
                                rate2 = 1
                            } else if (parseFloat(Dataline[i].commission_rate || 0) == 5) {
                                rate = 1;
                                rate2 = 1.17;
                            } else if (parseFloat(Dataline[i].commission_rate || 0) == 6) {
                                rate = eur_Rate;
                                rate2 = 1;
                            }
                            tprint_amt = tprint_amt + print_amt * rate / rate2;
                            tsales = tsales + sales * rate / rate2;
                            tsum_p6 = tsum_p6 + sum_p6 * rate / rate2;
                            tsum_p4 = tsum_p4 + sum_p4 * rate / rate2;
                            tsum_p5 = tsum_p5 + sum_p5 * rate / rate2;
                            tcommission_rate = tcommission_rate + commission_rate * rate / rate2;
                            trebate_rate = trebate_rate + rebate_rate * rate / rate2;
                            txb_rate = txb_rate + xb_rate * rate / rate2;
                            tpart_cost = tpart_cost + part_cost * rate / rate2;
                            tsjamt = tsjamt + skd_amt + ckd_amt * rate / rate2;
                            tinterest_rate = tinterest_rate + interest_rate * rate / rate2;
                            //指导价毛利率 = 销售金额 - 指导价金额 - 佣金  - 返利 - 资金成本 - 配件成本- CKD- SKD - 销售金额*信保比率
                            $scope.data.currItem.guide_rate = parseFloat((sales - sum_p6 - commission_rate - rebate_rate - interest_rate - part_cost - ckd_amt - skd_amt - xb_rate) * 100 / (sales)).toFixed(2);
                            //海外毛利率 =（销售额 - 标准结算价金额- 佣金 - 返利  - 资金成本 - 配件成本 - CKD- SKD - 销售金额*信保比率
                            $scope.data.currItem.ys_rate = parseFloat((sales - sum_p4 - rebate_rate - part_cost / 1.3 ) * 100 / (sales - rebate_rate)).toFixed(2);
                            //海外价值链毛利率 =（销售额 - 标准结算价金额- 佣金 - 返利  - 资金成本 - 配件成本 - CKD- SKD - 销售金额*信保比率
                            $scope.data.currItem.std_rate = parseFloat((sales - sum_p5 / mfee - commission_rate - rebate_rate - interest_rate - part_cost / 1.3 - ckd_amt - skd_amt - xb_rate) * 100 / (sales)).toFixed(2);
                            data[i].pay3 = "";
                            data[i].yj_cost = String(commission_rate);
                            data[i].fl_cost = String(rebate_rate);
                            data[i].zjcb_cost = String(interest_rate);
                            data[i].part_cost = String(part_cost);
                            data[i].sj_cost = String(ckd_amt + skd_amt);
                            data[i].xb_cost = String(xb_rate);

                        } else {
                            Dataline[i].pay1 = "";
                            Dataline[i].pay2 = "";
                            Dataline[i].pay3 = "";
                        }
                        //指导价毛利率 = 销售金额 - 指导价金额 - 佣金  - 返利 - 资金成本 - 配件成本- CKD- SKD - 销售金额*信保比率
                        $scope.data.currItem.guide_rate = parseFloat((sales - sum_p6 - commission_rate - rebate_rate - interest_rate - part_cost - ckd_amt - skd_amt - xb_rate) * 100 / (sales) || 0).toFixed(2);
                        //海外毛利率 =（销售额 - 标准结算价金额- 佣金 - 返利  - 资金成本 - 配件成本 - CKD- SKD - 销售金额*信保比率
                        $scope.data.currItem.ys_rate = parseFloat(((sales - sum_p4 - rebate_rate - part_cost / 1.3 ) * 100 / (sales - rebate_rate)) || 0).toFixed(2);
                        //海外价值链毛利率 =（销售额 - 标准结算价金额- 佣金 - 返利  - 资金成本 - 配件成本 - CKD- SKD - 销售金额*信保比率
                        $scope.data.currItem.std_rate = parseFloat((sales - sum_p5 / mfee - commission_rate - rebate_rate - interest_rate - part_cost / 1.3 - ckd_amt - skd_amt - xb_rate) * 100 / (sales)).toFixed(2);
                    }
                    //指导价毛利率 = 销售金额 - 指导价金额 - 佣金  - 返利 - 资金成本 - 配件成本- CKD- SKD - 销售金额*信保比率
                    $scope.data.currItem.guide_rate = parseFloat((tsales - tsum_p6 - tcommission_rate - trebate_rate - tinterest_rate - tpart_cost - tsjamt - txb_rate) * 100 / (sales)).toFixed(2);
                    //海外毛利率 =（销售额 - 标准结算价金额- 佣金 - 返利  - 资金成本 - 配件成本 - CKD- SKD - 销售金额*信保比率
                    $scope.data.currItem.ys_rate = parseFloat((tsales - tsum_p4 - trebate_rate - -tpart_cost / 1.3) * 100 / (tsales - trebate_rate)).toFixed(2);
                    //海外价值链毛利率 =（销售额 - 标准结算价金额- 佣金 - 返利  - 资金成本 - 配件成本 - CKD- SKD - 销售金额*信保比率
                    $scope.data.currItem.std_rate = parseFloat(((tsales - tsum_p5 / mfee - tcommission_rate - trebate_rate - tinterest_rate - tpart_cost / 1.3 - tsjamt - txb_rate) * 100 / (tsales) || 0)).toFixed(2);
                });
        };
        $scope.CalcPay2 = function () {
            var ckd, skd, mfee, sell_price;
            var qty, bud_id, seq, day;
            var sell_price, sales, guide_p6, P4, std_cl_cb, print_amt;
            var sum_p6, commission_rate, rebate_rate, amt_fee, interest_rate, xb_rate, sum_p4, part_cost, sum_p5;
            var ckd_amt, skd_amt, mfee;
            var ckd, skd;
            var Pay_Ratio, Interest_Rate2, Base_Fee;
            var tsales, tprint_amt, tsjamt;
            var tsum_p6, tcommission_rate, trebate_rate, tinterest_rate, txb_rate, tsum_p4, tpart_cost, tsum_p5;
            var usd_rate, eur_Rate, rate, rate2;
            BasemanService.RequestPost("sale_year_sell_bud_header", "search", {flag: 102})
                .then(function (data) {
                    if (data.sale_year_sell_bud_headers.length > 0) {
                        ckd = data.sale_year_sell_bud_lineofsale_year_sell_bud_headers[0].ckd;
                        skd = data.sale_year_sell_bud_lineofsale_year_sell_bud_headers[0].skd;
                        mfee = data.sale_year_sell_bud_lineofsale_year_sell_bud_headers[0].mfee;
                    }
                    usd_rate = parseFloat(data.usd_rate || 0);
                    eur_Rate = parseFloat(data.eur_rate || 0);
                    tsales = 0, tprint_amt = 0, tsjamt = 0;
                    tsum_p6 = 0, tcommission_rate = 0;
                    trebate_rate = 0, tinterest_rate = 0, txb_rate = 0;
                    tsum_p4 = 0, tpart_cost = 0, tsum_p5 = 0;
                    Dataline = $scope.data.currItem.sale_year_sell_bud_lineofsale_year_sell_bud_headers;
                    for (var i = 0; i < Dataline.length; i++) {
                        //销价
                        sell_price = parseFloat(Dataline[i].sell_price || 0);
                        //数量
                        qty = parseFloat(Dataline[i].qty || 0);
                        //销售额
                        sales = sell_Price * qty;
                        //保险费
                        print_amt = parseFloat(Dataline[i].print_amt || 0);
                        //指导价
                        guide_p6 = parseFloat(Dataline[i].guide_p6 || 0);
                        //预算价
                        p4 = parseFloat(Dataline[i].p4 || 0);
                        //标准价
                        std_cl_cb = parseFloat(Dataline[i].std_cl_cb || 0);
                        //指导价金额
                        sum_p6 = guide_p6 * qty;
                        //结算价金额
                        sum_p4 = p4 * qty;
                        //标准结算价金额
                        sum_p5 = std_cl_cb * qty;
                        //佣金
                        commission_rate = parseFloat(Dataline[i].yj_cost || 0) * 0.01 * sales;
                        //返利
                        rebate_rate = parseFloat(Dataline[i].fl_cost || 0) * 0.01 * sales;
                        //海运费
                        amt_fee = parseFloat(Dataline[i].amt_fee || 0);
                        //信保比率
                        xb_rate = parseFloat(Dataline[i].xb_cost || 0);
                        //配件成本
                        part_cost = parseFloat(Dataline[i].part_cost || 0);
                        ckd_amt = parseFloat(Dataline[i].sj_cost || 0);
                        skd_amt = 0;
                        //资金成本
                        interest_rate = parseFloat(Dataline[i].zjcb_cost || 0);
                        if (parseFloat(Dataline[i].commission_rate || 0) == 4) {
                            rate = usd_rate;
                            rate2 = 1
                        } else if (parseFloat(Dataline[i].commission_rate || 0) == 5) {
                            rate = 1;
                            rate2 = 1.17;
                        } else if (parseFloat(Dataline[i].commission_rate || 0) == 6) {
                            rate = eur_Rate;
                            rate2 = 1;
                        }
                        tprint_amt = tprint_amt + print_amt * rate / rate2;
                        tsales = tsales + sales * rate / rate2;
                        tsum_p6 = tsum_p6 + sum_p6 * rate / rate2;
                        tsum_p4 = tsum_p4 + sum_p4 * rate / rate2;
                        tsum_p5 = tsum_p5 + sum_p5 * rate / rate2;
                        tcommission_rate = tcommission_rate + commission_rate * rate / rate2;
                        trebate_rate = trebate_rate + rebate_rate * rate / rate2;
                        txb_rate = txb_rate + xb_rate * rate / rate2;
                        tpart_cost = tpart_cost + part_cost * rate / rate2;
                        tsjamt = tsjamt + skd_amt + ckd_amt * rate / rate2;
                        tinterest_rate = tinterest_rate + interest_rate * rate / rate2;
                    }
                    //指导价毛利率 = 销售金额 - 指导价金额 - 佣金  - 返利 - 资金成本 - 配件成本- CKD- SKD - 销售金额*信保比率
                    $scope.data.currItem.guide_rate = parseFloat((tsales - tsum_p6 - tcommission_rate - trebate_rate - tinterest_rate - tpart_cost - tsjamt - txb_rate) * 100 / (tsales)).toFixed(2);
                    //海外毛利率 =（销售额 - 标准结算价金额- 佣金 - 返利  - 资金成本 - 配件成本 - CKD- SKD - 销售金额*信保比率
                    $scope.data.currItem.ys_rate = parseFloat((tsales - tsum_p4 - trebate_rate - tpart_cost / 1.3 ) * 100 / (tsales - trebate_rate)).toFixed(2);
                    //海外价值链毛利率 =（销售额 - 标准结算价金额- 佣金 - 返利  - 资金成本 - 配件成本 - CKD- SKD - 销售金额*信保比率
                    $scope.data.currItem.std_rate = parseFloat((tsales - tsum_p5 / mfee - tcommission_rate - trebate_rate - tinterest_rate - tpart_cost / 1.3 - tsjamt - txb_rate) * 100 / (tsales)).toFixed(2);
                });
        };
        $scope.CalQty = function () {
            var data = $scope.data.currItem.sale_year_sell_bud_lineofsale_year_sell_bud_headers;
            var yjdqty = 0, yxsqty = 0, tjdqty = 0, txsqty = 0;
            var years = $scope.data.currItem.sell_year;
            for (var i = 0; i < data.length; i++) {
                if (data[i].order_year == years) {
                    if (data[i].uom_name == "套") {
                        yjdqty = yjdqty + Number(data[i].qty) || 0;
                    } else {
                        yjdqty = yjdqty + Number(data[i].qty) / 2 || 0;
                    }
                }
                if (data[i].sell_year == years) {
                    if (data[i].uom_name == "套") {
                        yxsqty = yjdqty + Number(data[i].qty) || 0;
                    } else {
                        yxsqty = yjdqty + Number(data[i].qty) / 2 || 0;
                    }
                }
                if (data[i].uom_name == "套") {
                    tjdqty = tjdqty + Number(data[i].qty) || 0;
                } else {
                    tjdqty = tjdqty + Number(data[i].qty) / 2 || 0;
                }
                if (data[i].uom_name == "套") {
                    txsqty = txsqty + Number(data[i].qty) || 0;
                } else {
                    txsqty = txsqty + Number(data[i].qty) / 2 || 0;
                }

            }
            $scope.data.currItem.year_jd_qty = Number(yjdqty);
            $scope.data.currItem.year_xs_qty = Number(yxsqty);
            $scope.data.currItem.total_jd_qty = Number(tjdqty);
            $scope.data.currItem.total_xs_qty = Number(txsqty);
        };
    }
    /******************网格定义区域**************/
    {
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
        //颜色提示
        function colorRenderer(params){
            if(parseInt(params.data.c_flag)==2){
                params.eGridCell.style.color="red";
            }
            if(parseInt(params.data.g_flag)==2){
                params.eGridCell.style.color="red";
            }
            if(parseInt(params.data.p_flag)==2){
                params.eGridCell.style.color="red";
            }
            if(parseInt(params.data.s_flag)==2){
                params.eGridCell.style.color="red";
            }
            if(parseInt(params.data.i_flag)==2){
                params.eGridCell.style.color="red";
            }
            if(parseInt(params.data.ix_flag)==2){
                params.eGridCell.style.color="red";
            }
            if(parseInt(params.data.ib_flag)==2){
                params.eGridCell.style.color="red";
            }
            if(params.value==undefined){
                return ""
            }else{
                return params.value;
            }

        }
        //明细
        $scope.columns_21 = [
            // 1、	基础信息
            {
                headerName: "客户编码", field: "cust_code", editable: true, filter: 'set', width: 85,
                cellEditor: "弹出框",
                action: $scope.cust_code,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                cellRenderer:function(params){return colorRenderer(params)},
                checkboxSelection: function (params) {
                    return params.columnApi.getRowGroupColumns().length === 0;
                }
            },
            {
                headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            }, {
                headerName: "是否新品", field: "new_item", editable: true, filter: 'set', width: 100,
                cellEditor: "复选框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                cellRenderer:function(params){return colorRenderer(params)},
                cellchange: $scope.acellchange
            },
            {
                headerName: "货币", field: "currency_name", editable: true, filter: 'set', width: 85,
                cellEditor: "弹出框",
                action: $scope.currency_name,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            }, {
                headerName: "类型", field: "line_type", editable: true, filter: 'set', width: 85,
                cellEditor: "下拉框",
                cellEditorParams: {values: []},
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true,
                cellchange: $scope.linecellchange
            }, {
                headerName: "整机编码", field: "item_h_code", editable: true, filter: 'set', width: 110,
                cellEditor: "弹出框",
                action: $scope.item_h_code11,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            },
            {
                headerName: "整机名称", field: "item_h_name", editable: false, filter: 'set', width: 200,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            }, {
                headerName: "外机平台", field: "pt_spec", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            },
            {
                headerName: "机型分类", field: "pro_type", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {values: []},
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            }, {
                headerName: "冷量", field: "cool_stand", editable: true, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {values: []},
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            },
            {
                headerName: "压缩机", field: "comp_drawid", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            },
            {
                headerName: "冷凝器规格", field: "cond_spec", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            },
            {
                headerName: "款式", field: "mb_stand", editable: true, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {values: []},
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            },
            {
                headerName: "内机平台", field: "n_size", editable: false, filter: 'set', width: 110,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            },
            {
                headerName: "替代机型编码", field: "rep_item_code", editable: false, filter: 'set', width: 150,
                cellEditor: "弹出框",
                action: $scope.item_h_code12,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            },
            {
                headerName: "替代机型描述", field: "rep_item_name", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            },
//2、	预测信息
            {
                headerName: "接单年度", field: "order_year", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            },
            {
                headerName: "接单月度", field: "order_month", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            },
            {
                headerName: "生产年度", field: "pro_year", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            },
            {
                headerName: "生产月度", field: "pro_month", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            },
            {
                headerName: "销售年度", field: "sell_year", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            },
            {
                headerName: "销售月度", field: "sell_month", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            },
            // 3、	价格信息
            {
                headerName: "付款方式", field: "payment_type_name", editable: true, filter: 'set', width: 100,
                cellEditor: "弹出框",
                action: $scope.payment_type_name,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            }, {
                headerName: "价格条款", field: "price_type_name", editable: true, filter: 'set', width: 100,
                cellEditor: "弹出框",
                action: $scope.brand_name,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            }, {
                headerName: "数量", field: "qty", editable: true, filter: 'set', width: 100,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            }, {
                headerName: "销价", field: "sell_price", editable: true, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            }, {
                headerName: "海运费", field: "amt_fee", editable: true, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            },
            {
                headerName: "保险费", field: "print_amt", editable: true, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            },

            {
                headerName: "指导价", field: "guide_p6", editable: true, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            }, {
                headerName: "业务结算价", field: "p4", editable: true, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            },
            {
                headerName: "标准结算价", field: "std_cl_cb", editable: true, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            }, {
                headerName: "指导价毛利率", field: "pay1", editable: true, filter: 'set', width: 120,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            },
            {
                headerName: "业务结算毛利率", field: "pay2", editable: true, filter: 'set', width: 130,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            },
            {
                headerName: "海外价值链毛利率", field: "pay3", editable: true, filter: 'set', width: 140,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            }, {
                headerName: "信保比率", field: "xb_rate", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            }, {
                headerName: "生产定金率", field: "contract_subscrp", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            }, {
                headerName: "发货定金率", field: "shipment_subscrp", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            },

            {
                headerName: "资金成本率", field: "interest_rate", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            }, {
                headerName: "返利率", field: "rebate_rate", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            },
            // 4、	成本信息
            {
                headerName: "佣金比率", field: "commission_rate", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            }, /*, {
             headerName: "免费配件比例", field: "part_rate_byhand", editable: false, filter: 'set', width: 120,
             cellEditor: "浮点框",
             enableRowGroup: true,
             enablePivot: true,
             enableValue: true,
             floatCell: true
             }, {
             headerName: "广告物料比例", field: "adver_mater_rate", editable: false, filter: 'set', width: 120,
             cellEditor: "浮点框",
             enableRowGroup: true,
             enablePivot: true,
             enableValue: true,
             floatCell: true
             }*/
            {
                headerName: "配件成本", field: "part_cost", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            },
            {
                headerName: "资金成本", field: "zjcb_cost", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            },
            {
                headerName: "信保费用", field: "xb_cost", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            },
            {
                headerName: "佣金", field: "yj_cost", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            },
            {
                headerName: "返利", field: "fl_cost", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
            },
            {
                headerName: "CKD/SKD费用", field: "sj_cost", editable: false, filter: 'set', width: 120,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                cellRenderer:function(params){return colorRenderer(params)},
                floatCell: true
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
        $scope.columns_22 = [
            // 1、	基础信息
            {
                headerName: "客户编码", field: "cust_code", editable: true, filter: 'set', width: 85,
                cellEditor: "弹出框",
                action: $scope.cust_code,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                checkboxSelection: function (params) {
                    return params.columnApi.getRowGroupColumns().length === 0;
                }
            },
            {
                headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "是否新品", field: "new_item", editable: true, filter: 'set', width: 100,
                cellEditor: "复选框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "货币", field: "currency_name", editable: true, filter: 'set', width: 85,
                cellEditor: "弹出框",
                action: $scope.currency_name,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "类型", field: "line_type", editable: true, filter: 'set', width: 85,
                cellEditor: "下拉框",
                cellEditorParams: {values: []},
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "整机编码", field: "item_h_code", editable: true, filter: 'set', width: 110,
                cellEditor: "弹出框",
                action: $scope.item_h_code11,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "整机名称", field: "item_h_name", editable: false, filter: 'set', width: 200,
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
            },
            {
                headerName: "机型分类", field: "pro_type", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {values: []},
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "冷量", field: "cool_stand", editable: true, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {values: []},
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "压缩机", field: "comp_drawid", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "冷凝器规格", field: "cond_spec", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "款式", field: "mb_stand", editable: true, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {values: []},
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "内机平台", field: "n_size", editable: false, filter: 'set', width: 110,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "替代机型编码", field: "rep_item_code", editable: false, filter: 'set', width: 150,
                cellEditor: "弹出框",
                action: $scope.item_h_code12,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "替代机型描述", field: "rep_item_name", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
//2、	预测信息
            {
                headerName: "接单年度", field: "order_year", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "接单月度", field: "order_month", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "生产年度", field: "pro_year", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "生产月度", field: "pro_month", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "销售年度", field: "sell_year", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "销售月度", field: "sell_month", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            // 3、	价格信息
            {
                headerName: "付款方式", field: "payment_type_name", editable: true, filter: 'set', width: 100,
                cellEditor: "弹出框",
                action: $scope.payment_type_name,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "价格条款", field: "price_type_name", editable: true, filter: 'set', width: 100,
                cellEditor: "弹出框",
                action: $scope.brand_name,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "数量", field: "qty", editable: true, filter: 'set', width: 100,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "销价", field: "sell_price", editable: true, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "海运费", field: "amt_fee", editable: true, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "保险费", field: "print_amt", editable: true, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },

            {
                headerName: "指导价", field: "guide_p6", editable: true, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "业务结算价", field: "p4", editable: true, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "标准结算价", field: "std_cl_cb", editable: true, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "指导价毛利率", field: "pay1", editable: true, filter: 'set', width: 120,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "业务结算毛利率", field: "pay2", editable: true, filter: 'set', width: 130,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "海外价值链毛利率", field: "pay3", editable: true, filter: 'set', width: 140,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "信保比率", field: "xb_rate", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "生产定金率", field: "contract_subscrp", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "发货定金率", field: "shipment_subscrp", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },

            {
                headerName: "资金成本率", field: "interest_rate", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "返利率", field: "rebate_rate", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            // 4、	成本信息
            {
                headerName: "佣金比率", field: "commission_rate", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, /*, {
             headerName: "免费配件比例", field: "part_rate_byhand", editable: false, filter: 'set', width: 120,
             cellEditor: "浮点框",
             enableRowGroup: true,
             enablePivot: true,
             enableValue: true,
             floatCell: true
             }, {
             headerName: "广告物料比例", field: "adver_mater_rate", editable: false, filter: 'set', width: 120,
             cellEditor: "浮点框",
             enableRowGroup: true,
             enablePivot: true,
             enableValue: true,
             floatCell: true
             }*/
            {
                headerName: "配件成本", field: "part_cost", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "资金成本", field: "zjcb_cost", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "信保费用", field: "xb_cost", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "佣金", field: "yj_cost", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "返利", field: "fl_cost", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "CKD/SKD费用", field: "sj_cost", editable: false, filter: 'set', width: 120,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];
        $scope.options_22 = {
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
                var isGrouping = $scope.options_22.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
    }
    /*********************界面初始化/保存********/
    {
      
        //校验
        $scope.validate = function () {
            var l = 0, k = 0, sum = 0;
            var nodes1 = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < nodes1.length; i++) {
                Order_Year = nodes1[i].data.order_year;
                Pro_Year = nodes1[i].data.pro_year;
                Sell_Year = nodes1[i].data.sell_year;
                Order_Month = nodes1[i].data.order_month;
                Pro_Month = nodes1[i].data.pro_month;
                Sell_Month = nodes1[i].data.sell_month;
                tmp = "";
                tmp = tmp + CheckYear("接单年度", Order_Year);
                tmp = tmp + CheckYear("生产年度", Pro_Year);
                tmp = tmp + CheckYear("销售年度", Sell_Year);
                tmp = tmp + CheckMonth("接单月度", Order_Month);
                tmp = tmp + CheckMonth("生产月度", Pro_Month);
                tmp = tmp + CheckMonth("销售月度", Sell_Month);
                if (tmp != "") {
                    BasemanService.notice('明细第' + (i + 1) + '行' + tmp + '有误！', "alert-warning");
                    return false;
                }
            }
            //导入明细校验
            var dataline = $scope.gridGetData("options_22");
            for(var i=0;i<dataline.length;i++){
                if(Number(dataline[i].c_flag||0)==2){
                    BasemanService.notice("明细中第"+(i+1)+"'货币'有错误！", "alter-warning")
                    return;
                }
                if(Number(dataline[i].g_flag||0)==2){
                    BasemanService.notice("明细中第"+(i+1)+"标机价的指导价没有维护", "alter-warning")
                    return;
                }
                if(Number(dataline[i].p_flag||0)==2){
                    BasemanService.notice("明细中第"+(i+1)+"标机价的业务结算价没有维护", "alter-warning")
                    return;
                }
                if(Number(dataline[i].s_flag||0)==2){
                    BasemanService.notice("明细中第"+(i+1)+"标机价的标准结算价没有维护", "alter-warning")
                    return;
                }
                if(Number(dataline[i].ix_flag||0)==2){
                    BasemanService.notice("明细中第"+(i+1)+"表示机型编码有错误", "alter-warning")
                    return;
                }
                if(Number(dataline[i].ib_flag||0)==2){
                    BasemanService.notice("明细中第"+(i+1)+"表示机型编码有错误", "alter-warning")
                    return;
                }
            }
            return true;
        };
        $scope.save_before = function () {
            delete $scope.data.currItem.sale_year_sell_bud_line2ofsale_year_sell_bud_headers;
            delete $scope.data.currItem.sale_year_sell_bud_headers;
            delete $scope.data.currItem.sale_year_sell_pay_lineofsale_year_sell_bud_headers;
            delete $scope.data.currItem.sale_year_sell_cale_itemofsale_year_sell_cale;
            delete $scope.data.currItem.payment_type_lineofpayment_types;
            var dataline = $scope.data.currItem.sale_year_sell_bud_lineofsale_year_sell_bud_headers;
            for (var i = 0; i < dataline.length; i++) {
                if ($scope.data.currItem.data_from < 0) {
                    dataline[i].cool_stand = Number(dataline[i].cool_stand || 0);
                    dataline[i].mb_stand = Number(dataline[i].mb_stand || 0);
                }
                if (dataline[i].item_h_code == "" || dataline[i].item_h_code == undefined) {
                    continue;
                }
            }
            if ($scope.data.currItem.data_from == 0) {
                $scope.CalcPay();
            }
            ;
            $scope.CalQty();
        };
        //刷新
        $scope.refresh_after = function () {
            if ($scope.data.currItem.stat == 3) {
                //客户编码、是否新品、类型、整机编码、替代机型编码、接单年度、接单月度、生产年度、生产月度、销售年度、销售月度、
                // 数量、销价、海运费、保险费、生产定金率、发货定金率
                $scope.columns_21[$scope.getIndexByField("columns_21", "cust_code")].editable = true;
                $scope.columns_21[$scope.getIndexByField("columns_21", "new_item")].editable = true;
                $scope.columns_21[$scope.getIndexByField("columns_21", "line_type")].editable = true;
                $scope.columns_21[$scope.getIndexByField("columns_21", "item_h_code")].editable = true;
                $scope.columns_21[$scope.getIndexByField("columns_21", "rep_item_code")].editable = true;
                $scope.columns_21[$scope.getIndexByField("columns_21", "order_year")].editable = true;
                $scope.columns_21[$scope.getIndexByField("columns_21", "order_month")].editable = true;
                $scope.columns_21[$scope.getIndexByField("columns_21", "pro_year")].editable = true;
                $scope.columns_21[$scope.getIndexByField("columns_21", "pro_month")].editable = true;
                $scope.columns_21[$scope.getIndexByField("columns_21", "sell_year")].editable = true;
                $scope.columns_21[$scope.getIndexByField("columns_21", "sell_month")].editable = true;
                $scope.columns_21[$scope.getIndexByField("columns_21", "qty")].editable = true;
                $scope.columns_21[$scope.getIndexByField("columns_21", "sell_price")].editable = true;
                $scope.columns_21[$scope.getIndexByField("columns_21", "amt_fee")].editable = true;
                $scope.columns_21[$scope.getIndexByField("columns_21", "print_amt")].editable = true;
                $scope.columns_21[$scope.getIndexByField("columns_21", "contract_subscrp")].editable = true;
                $scope.columns_21[$scope.getIndexByField("columns_21", "shipment_subscrp")].editable = true;
                //价格条款、付款方式、货币
                $scope.columns_21[$scope.getIndexByField("columns_21", "price_type_name")].editable = true;
                $scope.columns_21[$scope.getIndexByField("columns_21", "payment_type_name")].editable = true;
                $scope.columns_21[$scope.getIndexByField("columns_21", "currency_name")].editable = true;
                $scope.updateColumns();
            }
            if (window.userbean.stringofrole.indexOf("销售人员") != -1 && window.userbean.stringofrole.indexOf("admin") == -1) {
                $scope.columns_21[$scope.getIndexByField("columns_21", "p4")].editable = false;
                $scope.columns_21[$scope.getIndexByField("columns_21", "std_cl_cb")].editable = false;
                $scope.columns_21[$scope.getIndexByField("columns_21", "pay2")].editable = false;
                $scope.columns_21[$scope.getIndexByField("columns_21", "pay3")].editable = false;
                //3、	价格信息：付款条件、销售价格，业务在填报时手工填写
                $scope.columns_21[$scope.getIndexByField("columns_21", "sell_price")].editable = true;
                $scope.columns_21[$scope.getIndexByField("columns_21", "payment_type_name")].editable = true;
            }
            ;
            //佣金、返利、配件比例、广告物料比例、信保比率从客户资料带出，不允许更改
        };
        $scope.clearinformation = function () {
            $scope.data = {};
            $scope.data.currItem = {
                stat: 1,
                creator: window.strUserId,
                create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                sale_year_sell_bud_lineofsale_year_sell_bud_headers: [],
                sale_year_sell_bud_line2ofsale_year_sell_bud_headers: [],
                sale_year_sell_pay_lineofsale_year_sell_bud_headers: [],
                payment_type_lineofpayment_types: []
            };
        };
    }
    $scope.initdata();
}
//加载控制器
salemanControllers
    .controller('sale_year_sell_bud_headerEdit', sale_year_sell_bud_headerEdit);
