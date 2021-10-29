/**
 * 客户资料编辑
 */
var billmanControllers = angular.module('inspinia');
function customerapplyheaderEditController($scope, $location, $timeout, $modal, $rootScope, notify, BasemanService, localeStorageService, FormValidatorService) {

    localeStorageService.pageHistory($scope, function () {
        return $scope.data.currItem
    });

    //如果是编辑objattachs
    $scope.isEdit = false;
    // $scope.EditStr = "新增";
    $scope.data = {};
    $scope.data.currItem = {};
    $scope.userbean = {};
    $scope.data.currItem.customer_apply_brandofcustomer_apply_headers = [];
    $scope.data.currItem.customer_apply_payment_typeofcustomer_apply_headers = [];
    $scope.data.currItem.customer_apply_bankofcustomer_apply_headers = [];
    $scope.data.currItem.customer_apply_seaport_inofcustomer_apply_headers = [];
    $scope.data.currItem.customer_apply_seaport_outofcustomer_apply_headers = [];
    $scope.data.currItem.customer_apply_userofcustomer_apply_headers = [];
    $scope.data.currItem.customer_apply_relamanofcustomer_apply_headers = [];
    $scope.data.currItem.customer_apply_paytype_detailofcustomer_apply_payment_types = [];
    $scope.data.currItem.customer_apply_headers = [];
    $scope.data.currItem.objattachs = [];

    //$scope.data.currItem.customer_payment_typeofcustomers=[];
    //$scope.data.currItem.customer_paytype_detailofcustomers=[];
    // 一、初始信息：1.查询基础数据 2.初始化网格 3.初始化数据
    // 二、函数方法

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

        var postdata = {
            sqlwhere: ""
        };


        // 登录用户
        $scope.userbean = window.userbean;

        // 销售组织
        var sale_org_options = [];
        var promise = BasemanService.RequestPost("base_search", "search", {flag: 2});
        promise.then(function (data) {
            $scope.dict_item_types = data.dict_sale_orgs;
            for (var i = 0; i < $scope.dict_item_types.length; i++) {
                var obj = $scope.dict_item_types[i];
                sale_org_options[i] = {value: obj.dictvalue, desc: obj.dictname};

            }
        });
        $scope.saleorg_currencychange = function (index) {
            for (var i = 0; i < $scope.base_currencys.length; i++) {
                if ($scope.base_currencys[i].currency_code == $scope.customer_apply_header.customer_salorgofcustomer_apply_headers[index].currency_code) {
                    $scope.data.currItem.customer_apply_salorgofcustomer_apply_headers[index].currency_id = $scope.base_currencys[i].currency_id;
                    $scope.data.currItem.customer_apply_salorgofcustomer_apply_headers[index].currency_id = $scope.base_currencys[i].currency_id;
                }
            }
        }

        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pay_type"}).then(function (data) {
            $scope.pay_types = data.dicts;
            var SelectOption = $scope.PaytypeDetai_Columns[1].options;
            for (var i = 0; i < data.dicts.length; i++) {
                var intoObj = new Object;
                intoObj.value = data.dicts[i].dictvalue;
                intoObj.desc = data.dicts[i].dictname;
                SelectOption.push(intoObj);
            }
        });

        //区域等级词汇值
        var promise = BasemanService.RequestPost("base_search", "searcharealevel", {});
        promise.then(function (data) {
            $scope.areaLevels = HczyCommon.stringPropToNum(data.dict_area_levels);
        });
        //信用等级
        var promise = BasemanService.RequestPost("base_search", "searcharealevel", {dictcode: "credit_rating"});
        promise.then(function (data) {
            $scope.creditRatings = HczyCommon.stringPropToNum(data.dict_area_levels);
        });
        //贸易类型
        var promise = BasemanService.RequestPost("base_search", "searchtradetype", {});
        promise.then(function (data) {
            $scope.tradeTypes = HczyCommon.stringPropToNum(data.dict_trade_types);
        });
        //客户等级类型
        var promise = BasemanService.RequestPost("base_search", "searchdict", {dictcode: "cust_level"});
        promise.then(function (data) {
            $scope.custLevels = HczyCommon.stringPropToNum(data.dicts);
        });
        //客户类型
        var promise = BasemanService.RequestPost("base_search", "searchdict", {dictcode: "custtype"});
        promise.then(function (data) {
            $scope.custTypes = HczyCommon.stringPropToNum(data.dicts);
        });
        //客户性质
        var promise = BasemanService.RequestPost("base_search", "searchdict", {dictcode: "cust_type"});
        promise.then(function (data) {
            $scope.cust_types = HczyCommon.stringPropToNum(data.dicts);
        });
        //交易货币
        //var promise = BasemanService.RequestPost("base_search", "searchdict", {dictcode:"cust_type"});
        //promise.then(function(data) {
        //    $scope.cust_types = HczyCommon.stringPropToNum(data.dicts);
        //});
        //币种
        BasemanService.RequestPostAjax("base_search", "searchcurrency", {}).then(function (data) {
            $scope.base_currencys = data.base_currencys;
        });

        $scope.mainbtn = {
            search: false,
            add: false
        };
    };

    $scope.init();


    // 付款类型
    $scope.openPaymentTypeFrm = function (item) {
        return $modal.open({
            templateUrl: "views/common/Pop_Common.html",
            controller: function ($scope, $modalInstance) {
                $scope.FrmInfo = {};
                $scope.FrmInfo.title = "付款条件查询";
                $scope.FrmInfo.thead = [{
                    name: "付款条件编码",
                    code: "payment_type_code"
                }, {
                    name: "付款条件名称",
                    code: "payment_type_name"
                }];
                $scope.ok = function () {
                    item.payment_type_id = $scope.item.payment_type_id;
                    item.payment_type_code = $scope.item.payment_type_code;
                    item.payment_type_name = $scope.item.payment_type_name;
                    $scope.addDetail();
                    $modalInstance.close($scope.item);
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.search = function () {
                    var sqlWhere = BasemanService.getSqlWhere(["payment_type_code", "payment_type_name"], $scope.searchtext);
                    var postdata = {
                        sqlwhere: sqlWhere
                    };
                    var promise = BasemanService.RequestPost("payment_type", "search", postdata);
                    promise.then(function (data) {
                        $scope.items = data.payment_types;
                    });
                };

                $scope.addLine = function (index, $event) {
                    $($event.currentTarget).addClass("info").siblings("tr").removeClass("info");
                    $scope.item = $scope.items[index];
                    $scope.addDetail();
                };
                $scope.addConfirm = function (index) {
                    item.payment_type_id = $scope.items[index].payment_type_id;
                    item.payment_type_code = $scope.items[index].payment_type_code;
                    item.payment_type_name = $scope.items[index].payment_type_name;
                    $scope.addDetail();
                    $modalInstance.close($scope.items[index]);
                }
                $scope.addDetail = function () {
                    BasemanService.RequestPost("payment_type", "select", {payment_type_id: $scope.item.payment_type_id}).then(function (result) {
                        item.customer_apply_paytype_detailofcustomer_apply_payment_types = result.payment_type_lineofpayment_types;
                        for (i = 0; i < item.customer_apply_paytype_detailofcustomer_apply_payment_types.length; i++) {
                            item.customer_apply_paytype_detailofcustomer_apply_payment_types[i].seq = i + 1;
                        }
                        $scope.PaytypeDetailOptions.grid.setData(item.customer_apply_paytype_detailofcustomer_apply_payment_types);
                        $scope.PaytypeDetailOptions.grid.resizeCanvas();

                    })

                }
            },
            scope: $scope
        });
    };


    //查询
    $scope.search = function () {
        $scope.FrmInfo = {};
        $scope.FrmInfo.title = "客户申请查询";
        $scope.FrmInfo.thead = [
            {
                name: "客户申请号",
                code: "cust_apply_no"
            }, {
                name: "申请时间",
                code: "create_time"
            }, {
                name: "客户",
                code: "cust_name"
            }, {
                name: "部门",
                code: "org_name"
            }, {
                name: "备注",
                code: "note"
            }];
        $scope.sqlwhere = ["cust_apply_no", "create_time", "cust_name", "org_name", "note"]
        $scope.classname = "customer_apply_header";
        $scope.fun = "search";
        BasemanService.openFrm("views/common/Pop_Common.html", CommonController, $scope, "", "lg")
            .result.then(function (result) {
                $scope.data.currItem.cust_apply_no = result.cust_apply_no;
                $scope.data.currItem.create_time = result.create_time;
                $scope.data.currItem.cust_name = result.cust_name;
                $scope.data.currItem.org_name = result.org_name;
                $scope.data.currItem.note = result.note;
                $scope.data.currItem.cust_apply_id = result.cust_apply_id;
                $scope.refresh(2);

            });
    };


    // 银行
    $scope.openBandFrm = function (item) {
        return $modal.open({
            templateUrl: "views/common/Pop_Common.html",
            controller: function ($scope, $modalInstance) {
                $scope.FrmInfo = {};
                $scope.FrmInfo.title = "银行查询";
                $scope.FrmInfo.thead = [{
                    name: "银行编码",
                    code: "bank_code"
                }, {
                    name: "银行名称",
                    code: "bank_name"
                }];
                $scope.ok = function () {
                    item.bank_id = $scope.item.bank_id;
                    item.bank_code = $scope.item.bank_code;
                    item.bank_name = $scope.item.bank_name;
                    item.bank_acco = $scope.item.account_no;
                    $modalInstance.close($scope.item);
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
                $scope.search = function () {
                    var sqlWhere = BasemanService.getSqlWhere(["bank_code", "bank_name"], $scope.searchtext);
                    var postdata = {
                        sqlwhere: sqlWhere
                    };
                    var promise = BasemanService.RequestPost("bank", "search", postdata);
                    promise.then(function (data) {
                        $scope.items = data.banks;
                    });
                };
                $scope.addLine = function (index, $event) {
                    $($event.currentTarget).addClass("info").siblings("tr").removeClass("info");
                    $scope.item = $scope.items[index];
                };
                $scope.addConfirm = function (index) {
                    item.bank_id = $scope.items[index].bank_id;
                    item.bank_code = $scope.items[index].bank_code;
                    item.bank_name = $scope.items[index].bank_name;
                    item.bank_acco = $scope.items[index].account_no;
                    $modalInstance.close($scope.items[index]);
                }
            },
            scope: $scope
        });
    };

    //银行
    $scope.openBandFrm1 = function () {
        $scope.FrmInfo = {
            title: "银行查询",
            thead: [{
                name: "银行编码",
                code: "bank_code"
            }, {
                name: "银行名称",
                code: "bank_name"
            }],
            classid: "bank",
            postdata: {},
            searchlist: ["bank_code", "bank_name"],
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
                $scope.data.currItem.bank_name = result.bank_name;
                $scope.data.currItem.bank_code = result.bank_code;
            });
    }

    // 业务员
    $scope.openCustomerSalesFrm = function (item) {
        return $modal.open({
            templateUrl: "views/common/Pop_Common.html",
            controller: function ($scope, $modalInstance) {
                $scope.FrmInfo = {};
                $scope.FrmInfo.title = "业务员查询";
                $scope.FrmInfo.thead = [{
                    name: "业务员ID",
                    code: "userid"
                }];
                $scope.ok = function () {

                    item.userid = $scope.items.userid;
                    $modalInstance.close($scope.item);
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.search = function () {
                    //配件信息
                    var sqlWhere = BasemanService.getSqlWhere(["userid"], $scope.searchtext);
                    if ($scope.data.currItem.cust_apply_id == undefined || $scope.data.currItem.cust_apply_id == " ") {
                        $scope.data.currItem.cust_apply_id = 0;
                    }
                    var postdata = {
                        sqlwhere: "sqlwhere",
                        flag: 2,
                        cust_apply_id: $scope.data.currItem.cust_apply_id

                    };
                    var promise = BasemanService.RequestPost("customer_apply_header", "search", postdata);
                    promise.then(function (data) {
                        $scope.items = data.customer_apply_headers;
                    });
                }

                $scope.addLine = function (index, $event) {
                    $($event.currentTarget).addClass("info").siblings("tr").removeClass("info");
                    $scope.item = $scope.items[index];
                };
                $scope.addConfirm = function (index) {
                    item.user_id = $scope.items[index].userid;
                    $modalInstance.close($scope.items[index]);
                }
            },
            scope: $scope
        });
    };

    // $scope.FrmInfo.initsql = " Stat = 5  and nvl(package_over,0) <> 2 ";
    /*
     $scope.common_Options = {
     editable: true,
     enableAddRow: true,
     enableCellNavigation: true,
     asyncEditorLoading: false,
     autoEdit: true ,
     dataItemColumnValueExtractor: getColumnValue
     };
     */

    // 联系人
    $scope.relaman_Columns = [
        {
            id: "sel",
            name: "#",
            field: "seq",
            behavior: "select",
            cssClass: "cell-selection",
            width: 40,
            cannotTriggerInsert: true,
            resizable: false,
            selectable: false,
            focusable: false
        }, {
            id: "relaman",
            name: "联系人",
            field: "relaman",
            width: 120,
            action: $scope.getproitemmodel,
            editor: Slick.Editors.Text
        }, {
            id: "position",
            name: "职务",
            field: "position",
            width: 120,
            editor: Slick.Editors.Text
        }, {
            id: "tel",
            name: "电话",
            field: "tel",
            width: 120,
            editor: Slick.Editors.Text
        }, {
            id: "fax",
            name: "传真",
            field: "fax",
            width: 120,
            editor: Slick.Editors.Text
        }, {
            id: "email",
            name: "电子邮件",
            field: "email",
            width: 120,
            editor: Slick.Editors.Text
        }, {
            id: "mobile",
            name: "手机号码",
            field: "mobile",
            width: 120,
            editor: Slick.Editors.Text
        }, {
            id: "note",
            name: "备注",
            field: "note",
            width: 200,
            editor: Slick.Editors.Text
        }];

    // 付款条件
    $scope.paytype_Columns = [
        {
            id: "sel",
            name: "序号",
            field: "seq",
            behavior: "select",
            cssClass: "cell-selection",
            width: 40,
            cannotTriggerInsert: true,
            resizable: false,
            selectable: false,
            focusable: false
        }, {
            id: "payment_type_code",
            name: "付款方式",
            field: "payment_type_code",
            width: 120,
            action: $scope.openPaymentTypeFrm,
            editor: Slick.Editors.ButtonEditor,
        }, {
            id: "payment_type_name",
            name: "付款方式名称",
            field: "payment_type_name",
            width: 220,
            editor: Slick.Editors.Text

        }, {
            id: "contract_subscrp",
            name: "默认生产定金率(%)",
            field: "contract_subscrp",
            width: 220,
            editor: Slick.Editors.Text

        }, {
            id: "shipment_subscrp",
            name: "出货定金率(%)",
            field: "shipment_subscrp",
            width: 220,
            editor: Slick.Editors.Text

        }, {
            id: "note",
            name: "备注",
            field: "note",
            width: 220,
            editor: Slick.Editors.Text

        }];

    //付款方式的明细
    $scope.PaytypeDetai_Columns = [
        {
            id: "seq",
            name: "#",
            field: "seq",
            behavior: "select",
            cssClass: "cell-selection",
            width: 40,
            cannotTriggerInsert: true,
            resizable: false,
            selectable: false,
            focusable: false
        }, {
            id: "pay_type",
            name: "基础付款方式",
            field: "pay_type",
            width: 120,
            options: [],
            editor: Slick.Editors.SelectOption,
            formatter: Slick.Formatters.SelectOption
        }, {
            id: "days",
            name: "回款期限",
            field: "days",
            width: 120,
            editor: Slick.Editors.Text
        }, {
            id: "pay_ratio",
            name: "付款比例(%)",
            field: "pay_ratio",
            width: 120,
            editor: Slick.Editors.Text
        }];
    //品牌
    $scope.brand_Columns = [
        {
            id: "seq",
            name: "#",
            field: "seq",
            behavior: "select",
            cssClass: "cell-selection",
            width: 40,
            cannotTriggerInsert: true,
            resizable: false,
            selectable: false,
            focusable: false
        }, {
            id: "brand_name",
            name: "品牌名",
            field: "brand_name",
            width: 120,
            editor: Slick.Editors.Text
        }, {
            id: "brand_addr",
            name: "品牌注册地",
            field: "brand_addr",
            width: 120,
            editor: Slick.Editors.Text
        }, {
            id: "brand_expdate",
            name: "品牌有效期",
            field: "brand_expdate",
            width: 120,
            editor: Slick.Editors.Date
        }, {
            id: "note",
            name: "备注",
            field: "note",
            width: 120,
            editor: Slick.Editors.Text
        }];

    // 银行
    $scope.bank_Columns = [
        {
            id: "sel",
            name: "#",
            field: "seq",
            behavior: "select",
            cssClass: "cell-selection",
            width: 40,
            cannotTriggerInsert: true,
            resizable: false,
            selectable: false,
            focusable: false
        }, {
            id: "bank_code",
            name: "银行编码",
            field: "bank_code",
            width: 120,
            editor: Slick.Editors.Text
        }, {
            id: "bank_name",
            name: "银行名称",
            field: "bank_name",
            width: 120,
            action: $scope.openBandFrm,
            editor: Slick.Editors.ButtonEditor
        }, {
            id: "bank_acco",
            name: "银行账号",
            field: "bank_acco",
            width: 120,
            editor: Slick.Editors.Text
        }, {
            id: "is_default",
            name: "是否默认",
            field: "is_default",
            width: 120,
            // editor: Slick.Editors.YesNoSelect
            cssClass: "rightAligned",
            headerCssClass: "rightAligned",
            //dataItemColumnValueExtractor: $scope.getCheckboxValue
            formatter: Slick.Formatters.Checkmark,
            editor: Slick.Editors.Checkbox

        }, {
            id: "note",
            name: "备注",
            field: "note",
            width: 120,
            editor: Slick.Editors.Text
        }];

    //业务员
    $scope.customersales_Columns = [
        {
            id: "sel",
            name: "序号",
            field: "seq",
            behavior: "select",
            cssClass: "cell-selection",
            width: 40,
            cannotTriggerInsert: true,
            resizable: false,
            selectable: false,
            focusable: false
        }, {
            id: "user_id",
            name: "业务员",
            field: "user_id",
            width: 120,
            action: $scope.openCustomerSalesFrm,
            editor: Slick.Editors.ButtonEditor
        }];


    // 初始化网络事件
    $scope.initGridOptions = function () {
        // 1.网络事件customer_relamanofcustomers
        // 联系人
        $scope.relamanOptions = {
            editable: true,
            enableAddRow: false,
            enableCellNavigation: true,
            asyncEditorLoading: false,
            autoEdit: true
        };


        $scope.changeLine = function (e, args) {
            //使用$scope.activeLine记录上一个行，在clearinformation中初始化值为0
            HczyCommon.commitGrid($scope.PaytypeDetailOptions.grid);
            var data = args.grid.getData();
            data[$scope.activeLine].customer_apply_paytype_detailofcustomer_apply_payment_types = $scope.PaytypeDetailOptions.grid.getData()//结尾
            //起始
            var h_item_line = data[args.row] || {};
            if (h_item_line.customer_apply_paytype_detailofcustomer_apply_payment_types == undefined) {
                h_item_line.customer_apply_paytype_detailofcustomer_apply_payment_types = [];
            }
            $scope.activeLine = args.row;
            $scope.PaytypeDetailOptions.grid.setData(h_item_line.customer_apply_paytype_detailofcustomer_apply_payment_types);
            $scope.PaytypeDetailOptions.grid.resizeCanvas();
            $scope.PaytypeDetailOptions.grid.render();
        }
        // 支付类型
        $scope.PaymentTypeOptions = {
            editable: true,
            enableAddRow: false,
            enableCellNavigation: true,
            asyncEditorLoading: false,
            autoEdit: true,
            onActiveCellChanged: $scope.changeLine,
        };
        $scope.PaytypeDetailOptions = {
            editable: true,
            enableAddRow: false,
            enableCellNavigation: true,
            asyncEditorLoading: false,
            autoEdit: true,

        };

        // 品牌
        $scope.BrandOptions = {
            editable: true,
            enableAddRow: false,
            enableCellNavigation: true,
            asyncEditorLoading: false,
            autoEdit: true
        };
        // 银行
        $scope.BankOptions = {
            editable: true,
            enableAddRow: false,
            enableCellNavigation: true,
            asyncEditorLoading: false,
            autoEdit: true
        };
        // 销售组织
        $scope.SaleOrgOptions = {
            editable: true,
            enableAddRow: false,
            enableCellNavigation: true,
            asyncEditorLoading: false,
            autoEdit: true,
        };
        //业务员
        $scope.CustomerSalesOptions = {
            editable: true,
            enableAddRow: false,
            enableCellNavigation: true,
            asyncEditorLoading: false,
            autoEdit: true
        };

    }

    $scope.initGridOptions();


    //添加明细
    //联系人relamanOptions
    $scope.addRelaman = function () {
        var item = {
            seq: 1
        };
        $scope.relamanOptions.grid.getData().push(item);
        $scope.relamanOptions.grid.resizeCanvas();
    }
    $scope.delRelaman = function () {
        var grid = $scope.relamanOptions.grid;
        var rowidx = grid.getActiveCell().row;
        $scope.relamanOptions.grid.getData().splice(rowidx, 1);
        grid.invalidateAllRows();
        grid.updateRowCount();
        grid.render();
    }

    // 支付类型PaytypeDetailOptions
    $scope.addPaymentType = function () {

        var item = {
            seq: 1
        };
        $scope.PaymentTypeOptions.grid.getData().push(item);
        $scope.PaymentTypeOptions.grid.resizeCanvas();

    }

    $scope.delPaymentType = function () {
        var grid = $scope.PaymentTypeOptions.grid;
        var rowidx = grid.getActiveCell().row;
        $scope.PaymentTypeOptions.grid.getData().splice(rowidx, 1);
        grid.invalidateAllRows();
        grid.updateRowCount();
        grid.render();
    }

    $scope.addType = function () {

        var item = {
            seq: 1
        };

        $scope.PaytypeDetailOptions.grid.getData().push(item);
        $scope.PaytypeDetailOptions.grid.resizeCanvas();

    }

    $scope.delType = function () {
        var grid = $scope.PaytypeDetailOptions.grid;
        var rowidx = grid.getActiveCell().row;
        $scope.PaytypeDetailOptions.grid.getData().splice(rowidx, 1);
        grid.invalidateAllRows();
        grid.updateRowCount();
        grid.render();
    }
    // 品牌BrandOptions
    $scope.addBrand = function () {
        var item = {
            seq: 1
        };
        $scope.BrandOptions.grid.getData().push(item);
        $scope.BrandOptions.grid.resizeCanvas();


    }
    $scope.delBrand = function (index) {

        var grid = $scope.BrandOptions.grid;
        var rowidx = grid.getActiveCell().row;
        $scope.BrandOptions.grid.getData().splice(rowidx, 1);
        grid.invalidateAllRows();
        grid.updateRowCount();
        grid.render();
    }

    // 银行  BankOptions
    $scope.addBank = function () {
        $scope.FrmInfo = {
            title: "银行查询",
            thead: [
                {
                    name: "银行名称",
                    code: "bank_name"
                }, {
                    name: "银行编码",
                    code: "bank_code"
                }],
            classid: "bank",
            postdata: {},
            sqlBlock: "",
            searchlist: ["bank_name", "bank_code"],
            type: "checkbox",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (items) {
                if (items.length) {

                    var grid = $scope.BankOptions.grid;
                    var data = grid.getData();
                    for (var i = 0; i < items.length; i++) {
                        var tempobj = new Object();
                        tempobj.bank_acco = items[i].account_no;
                        tempobj.bank_name = items[i].bank_name;
                        tempobj.bank_code = items[i].bank_code;
                        tempobj.bank_id = items[i].bank_id;
                        tempobj.sel = (i + 1);
                        data.push(tempobj);
                    }
                }
                grid.setData(data);
                grid.invalidateAllRows();
                grid.render();
            });
    }


    $scope.delBank = function (index) {


        var grid = $scope.BankOptions.grid;
        var rowidx = grid.getActiveCell().row;
        $scope.BankOptions.grid.getData().splice(rowidx, 1);
        grid.invalidateAllRows();
        grid.updateRowCount();
        grid.render();

    }
    // 销售组织CustomerSalesOptions
    $scope.addSaleOrg = function () {

        var item = {
            seq: 1,
            sale_org_id: 1
        };
        $scope.CustomerSalesOptions.grid.getData().push(item);
        $scope.CustomerSalesOptions.grid.invalidateAllRows();
        $scope.CustomerSalesOptions.grid.render();
    }
    $scope.delSaleOrg = function (index) {

        var grid = $scope.CustomerSalesOptions.grid;
        var rowidx = grid.getActiveCell().row;
        $scope.CustomerSalesOptions.grid.getData().splice(rowidx, 1);
        grid.invalidateAllRows();
        grid.updateRowCount();
        grid.render();

    }

    // 业务员customer_apply_userofcustomer_apply_headers
    $scope.addCustomerSales = function () {

        var item = {
            seq: 1,

        };
        $scope.CustomerSalesOptions.grid.getData().push(item);
        $scope.CustomerSalesOptions.grid.invalidateAllRows();
        $scope.CustomerSalesOptions.grid.render();
    }
    $scope.deletCustomerSales = function (index) {

        var grid = $scope.CustomerSalesOptions.grid;
        var rowidx = grid.getActiveCell().row;
        $scope.CustomerSalesOptions.grid.getData().splice(rowidx, 1);
        grid.invalidateAllRows();
        grid.updateRowCount();
        grid.render();

    }


    // 关闭
    $scope.closebox = function () {
        $location.path("/main/customer_apply_header");
    }

    //区域弹出窗口
    $scope.openAreaNameFrm = function () {
        $scope.FrmInfo = {};
        $scope.FrmInfo.title = "区域信息查询";
        $scope.FrmInfo.thead = [{name: "区域编码", code: "areacode"},
            {name: "区域名称", code: "areaname"}];
        $scope.FrmInfo.initsql = "areatype=2";
        $scope.sqlwhere = ["areacode", "areaname"]
        $scope.classname = "scparea";
        $scope.containers = "scpareas";
        $scope.fun = "search";
        BasemanService.openFrm("views/common/Pop_Common.html", CommonController, $scope)
            .result.then(function (result) {
                $scope.data.currItem.area_name = result.areaname;
                $scope.data.currItem.area_code = result.areacode;
                $scope.data.currItem.area_id = parseFloat(result.areaid);

            });
    };
    //中文名称
    $scope.selectCoreItem = function () {
        $scope.FrmInfo = {};
        $scope.FrmInfo.title = "中心名称查询";
        $scope.FrmInfo.thead = [{
            name: "中心名称",
            code: "core_name"
        }];
        $scope.sqlwhere = ["core_name"]

        //$scope.classname="'";
        $scope.classname = "customer_core_item";
        $scope.containers = "customer_core_items";
        $scope.fun = "search";

        BasemanService.openFrm("views/common/Pop_Common.html", CommonController, $scope)
            .result.then(function (result) {
                $scope.data.currItem.core_name = result.core_name;

            });
    };


    // 银行

    $scope.openBankFrm = function (item) {
        var FrmInfo = {};
        FrmInfo.title = "银行信息查询";
        FrmInfo.thead = [{name: "银行编码", code: "bank_code"},
            {name: "银行名称", code: "bank_name"}];

        var modalinstance = BasemanService.openCommonFrm(PopBankController, $scope, FrmInfo);
        modalinstance.result.then(function (result) {
            item.bank_id = result.bank_id;
            item.bank_code = result.bank_code;
            item.bank_name = result.bank_name;
        });
    };


    $scope.selectorg = function () {
        $scope.FrmInfo = {};
        $scope.FrmInfo.title = "销售部门查询";
        $scope.FrmInfo.thead = [{
            name: "部门",
            code: "code"
        }, {
            name: "部门名称",
            code: "orgname"
        }];
        $scope.containers = "orgs";
        $scope.sqlwhere = ["code", "orgname"]
        $scope.classname = "scporg";
        $scope.fun = "search";
        $scope.FrmInfo.initsql = "OrgType = 5";
        BasemanService.openFrm("views/common/Pop_Common.html", CommonController, $scope)
            .result.then(function (result) {
                $scope.data.currItem.org_code = result.code;
                $scope.data.currItem.org_code = result.orgname;
            });
    }

    $scope.searchorg = function () {
        $scope.FrmInfo = {};
        $scope.FrmInfo.title = "销售部门查询";
        $scope.FrmInfo.thead = [{
            name: "部门",
            code: "code"
        }, {
            name: "部门名称",
            code: "orgname"
        }];
        $scope.containers = "orgs";
        $scope.sqlwhere = ["code", "orgname"]
        $scope.classname = "scporg";
        $scope.fun = "search";
        $scope.FrmInfo.initsql = "OrgType = 5";
        BasemanService.openFrm("views/common/Pop_Common.html", CommonController, $scope)
            .result.then(function (result) {
                $scope.data.currItem.area_code = result.code;
                $scope.data.currItem.other_org_names = result.orgname;

            });
    }
    $scope.currencyChange = function () {
        for (var i = 0; i < $scope.base_currencys.length; i++) {
            if ($scope.base_currencys[i].currency_id == $scope.data.currItem.currency_id) {
                $scope.data.currItem.currency_code = $scope.base_currencys[i].currency_code;
                $scope.data.currItem.currency_name = $scope.base_currencys[i].currency_name;
                break;
            }
        }
    }

    //客户资料保存更新
    $scope.save = function () {
        $scope.currencyChange();
        // 验证通过才进行保存
        if (FormValidatorService.validatorFrom($scope)) {

            HczyCommon.commitGrid(
                $scope.relamanOptions.grid,
                $scope.PaymentTypeOptions.grid,
                $scope.PaytypeDetailOptions.grid,
                $scope.BankOptions.grid,
                $scope.CustomerSalesOptions.grid);
            if (!$scope.data.currItem.currency_id) {
                BasemanService.notice("交易币种不能为空！", "alert-warning");
                return;
            }
            //customer_apply_headers
            if ($scope.data.currItem.customer_apply_headers == undefined) {
                $scope.data.currItem.customer_apply_headers = [];
            }
            for (i = 0; i < $scope.data.currItem.customer_apply_headers.length; i++) {
                $scope.data.currItem.customer_apply_headers[i].sql = (i + 1);
            }
            //品牌
            if ($scope.data.currItem.customer_apply_brandofcustomer_apply_headers == undefined) {
                $scope.data.currItem.customer_apply_brandofcustomer_apply_headers = [];
            }
            for (i = 0; i < $scope.data.currItem.customer_apply_brandofcustomer_apply_headers.length; i++) {
                $scope.data.currItem.customer_apply_brandofcustomer_apply_headers[i].sql = (i + 1);
            }

            // customer_apply_paytype_detailofcustomer_apply_payment_types
            //  银行信息
            if ($scope.data.currItem.customer_apply_bankofcustomer_apply_headers == undefined) {
                $scope.data.currItem.customer_apply_bankofcustomer_apply_headers = [];
            }
            //银行customer_apply_bankofcustomer_apply_headers
            for (i = 0; i < $scope.data.currItem.customer_apply_bankofcustomer_apply_headers.length; i++) {
                $scope.data.currItem.customer_apply_bankofcustomer_apply_headers[i].seq = (i + 1);
            }

            //联系人
            if ($scope.data.currItem.customer_apply_relamanofcustomer_apply_headers == undefined) {
                $scope.data.currItem.customer_apply_relamanofcustomer_apply_headers = [];
            }
            //联系人customer_apply_relamanofcustomer_apply_headers
            for (i = 0; i < $scope.data.currItem.customer_apply_relamanofcustomer_apply_headers.length; i++) {
                $scope.data.currItem.customer_apply_relamanofcustomer_apply_headers[i].seq = (i + 1);
            }

            //customer_apply_seaport_inofcustomer_apply_headers
            if ($scope.data.currItem.customer_apply_seaport_inofcustomer_apply_headers == undefined) {
                $scope.data.currItem.customer_apply_seaport_inofcustomer_apply_headers = [];
            }
            for (i = 0; i < $scope.data.currItem.customer_apply_seaport_inofcustomer_apply_headers.length; i++) {
                $scope.data.currItem.customer_apply_seaport_inofcustomer_apply_headers [i].sql = (i + 1);
            }
            //customer_apply_seaport_outofcustomer_apply_headers
            if ($scope.data.currItem.customer_apply_seaport_outofcustomer_apply_headers == undefined) {
                $scope.data.currItem.customer_apply_seaport_outofcustomer_apply_headers = [];
            }
            for (i = 0; i < $scope.data.currItem.customer_apply_seaport_outofcustomer_apply_headers.length; i++) {
                $scope.data.currItem.customer_apply_seaport_outofcustomer_apply_headers [i].sql = (i + 1);
            }

            // //支付条件 customer_apply_paytype_detailofcustomer_apply_payment_types/customer_apply_payment_typeofcustomer_apply_headers
            if ($scope.data.currItem.customer_apply_payment_typeofcustomer_apply_headers == undefined) {
                $scope.data.currItem.customer_apply_payment_typeofcustomer_apply_headers = [];
            }
            for (i = 0; i < $scope.data.currItem.customer_apply_payment_typeofcustomer_apply_headers.length; i++) {
                $scope.data.currItem.customer_apply_payment_typeofcustomer_apply_headers[i].seq = (i + 1);
            }

            //支付明细

            if ($scope.data.currItem.customer_apply_paytype_detailofcustomer_apply_payment_types == undefined) {
                $scope.data.currItem.customer_apply_paytype_detailofcustomer_apply_payment_types = [];
            }
            for (i = 0; i < $scope.data.currItem.customer_apply_paytype_detailofcustomer_apply_payment_types.length; i++) {
                $scope.data.currItem.customer_apply_paytype_detailofcustomer_apply_payment_types[i].seq = (i + 1);
            }

            //业务员

            if ($scope.data.currItem.customer_apply_userofcustomer_apply_headers == undefined) {
                $scope.data.currItem.customer_apply_userofcustomer_apply_headers = [];
            }
            for (i = 0; i < $scope.data.currItem.customer_apply_userofcustomer_apply_headers.length; i++) {
                $scope.data.currItem.customer_apply_userofcustomer_apply_headers[i].sql = (i + 1);
            }
            // //objattachs
            if ($scope.data.currItem.objattachs == undefined) {
                $scope.data.currItem.objattachs = [];
            }
            for (i = 0; i < $scope.data.currItem.objattachs.length; i++) {
                $scope.data.currItem.objattachs [i].sql = (i + 1);
            }

            //业务员
            //$scope.data.currItem.customer_apply_salorgofcustomer_apply_headers = [];
            //$scope.data.currItem.customer_apply_salesofcustomer_apply_headers = [];
            // for (i = 0; i < $scope.data.currItem.customer_apply_salesofcustomer_apply_headers.length; i++) {
            //     $scope.data.currItem.customer_apply_salesofcustomer_apply_headers[i].sql = (i + 1);
            // }
            var postdata = $scope.data.currItem;

            var action = "update";
            if (postdata.cust_apply_id == undefined || postdata.cust_apply_id == 0) {
                var action = "insert";
            }
            var promise = BasemanService.RequestPost("customer_apply_header", action, postdata);
            promise.then(function (data) {
                BasemanService.notify(notify, "保存成功!", "alert-info", 1000);
                $scope.isEdit = true;
                $scope.data.currItem = data;
                $scope.refresh(2);
                //$scope.data.currItem.item_style=data.item_style;
                //$scope.data.currItem.trade_type=data.trade_type;
            });

        }
    }


    //流程处理
    $scope.wfstart = function () {
        //返回即提交
        var postdata = {
            opinion: '',
            objtypeid: 10003,
            objid: $scope.data.currItem.cust_apply_id, //单据ID
            wfid: 0 // 流程ID
        };
        BasemanService.RequestPost("base_wf", "start", postdata)
            .then(function (data) {
                BasemanService.notify(notify, "启动成功", "alert-info", 1000);
                //$scope.getwfDetail(data.wfid);
                $scope.data.currItem.wfid = data.wfid;
                $scope.data.currItem.stat = data.stat;
                //$scope.wfprocs = data.wfprocs;
                //$scope.wfprocuseropinions = data.wfprocuseropinions;

            }, function (error) {
                //alert('error');
            })

    }


    $scope.wfbreak = function () {
        $scope.data.currItem.stat = 1;
    }

    $scope.refresh = function (flag) {
        var postdata = {
            cust_apply_id: $scope.data.currItem.cust_apply_id
        };
        if (postdata.cust_apply_id == undefined || postdata.cust_apply_id == 0) {
            BasemanService.notify(notify, "单据没有保存，无法刷新", "alert-warning", 1000);
            return;
        }
        ;
        var promise = BasemanService.RequestPost("customer_apply_header", "select", postdata);
        promise.then(function (data) {
            if (flag != 2) {
                BasemanService.notify(notify, "刷新成功", "alert-info", 500);
            }
            ;
            $scope.data.currItem = data;
            // 加个定时器，否则会报错，
            // $timeout(function(){


            //联系人customer_apply_relamanofcustomer_apply_headers
            $scope.relamanOptions.grid.setData($scope.data.currItem.customer_apply_relamanofcustomer_apply_headers);
            $scope.relamanOptions.grid.invalidateAllRows();
            $scope.relamanOptions.grid.updateRowCount();
            $scope.relamanOptions.grid.render();

            //品牌
            $scope.BrandOptions.grid.setData($scope.data.currItem.customer_apply_brandofcustomer_apply_headers);
            $scope.BankOptions.grid.invalidateAllRows();
            $scope.BankOptions.grid.updateRowCount();
            $scope.BankOptions.grid.render();
            //console.log('BrandOptions：'+$scope.customer_apply_header.customer_apply_brandofcustomer_apply_headers.length);

            //银行
            $scope.BankOptions.grid.setData($scope.data.currItem.customer_apply_bankofcustomer_apply_headers);
            $scope.BankOptions.grid.invalidateAllRows();
            $scope.BankOptions.grid.updateRowCount();
            $scope.BankOptions.grid.render();
            //支付条件
            $scope.PaymentTypeOptions.grid.setData($scope.data.currItem.customer_apply_payment_typeofcustomer_apply_headers);
            $scope.PaymentTypeOptions.grid.invalidateAllRows();
            $scope.PaymentTypeOptions.grid.updateRowCount();
            $scope.PaymentTypeOptions.grid.render();
            //业务员
            $scope.CustomerSalesOptions.grid.setData($scope.data.currItem.customer_apply_userofcustomer_apply_headers);
            $scope.CustomerSalesOptions.grid.invalidateAllRows();
            $scope.CustomerSalesOptions.grid.updateRowCount();
            $scope.CustomerSalesOptions.grid.render();
			$scope.activeLine = 0;
            //支付方式明细的明细
            if ($scope.data.currItem.customer_apply_payment_typeofcustomer_apply_headers.length == 0) {
                //$scope.data.currItem.customer_apply_payment_typeofcustomer_apply_headers[0]. customer_apply_paytype_detailofcustomer_apply_payment_types=[]
                //$scope.PaytypeDetailOptions.grid.setData($scope.data.currItem.customer_apply_payment_typeofcustomer_apply_headers[0]. customer_apply_paytype_detailofcustomer_apply_payment_types);
                $scope.PaytypeDetailOptions.grid.setData([])
            }
            else {
                $scope.PaytypeDetailOptions.grid.setData($scope.data.currItem.customer_apply_payment_typeofcustomer_apply_headers[0].customer_apply_paytype_detailofcustomer_apply_payment_types);
            }
            $scope.PaytypeDetailOptions.grid.invalidateAllRows();
            $scope.PaytypeDetailOptions.grid.updateRowCount();
            $scope.PaytypeDetailOptions.grid.render();
            //grid   customer_apply_payment_typeofcustomer_apply_headers
            var grid = $scope.PaymentTypeOptions.grid;

            $scope.relamanOptions.grid.invalidateAllRows();
            $scope.relamanOptions.grid.updateRowCount();
            $scope.relamanOptions.grid.render();

            $scope.PaytypeDetailOptions.grid.invalidateAllRows();
            $scope.PaytypeDetailOptions.grid.updateRowCount();
            $scope.PaytypeDetailOptions.grid.render();

            $scope.BankOptions.grid.invalidateAllRows();
            $scope.BankOptions.grid.updateRowCount();
            $scope.BankOptions.grid.render();

            $scope.PaymentTypeOptions.grid.invalidateAllRows();
            $scope.PaymentTypeOptions.grid.updateRowCount();
            $scope.PaymentTypeOptions.grid.render();


            //$scope.SaleOrgOptions.grid.invalidateAllRows();
            //$scope.SaleOrgOptions.grid.updateRowCount();
            //$scope.SaleOrgOptions.grid.render();
            //},1000);

            $scope.CustomerSalesOptions.grid.invalidateAllRows();
            $scope.CustomerSalesOptions.grid.updateRowCount();
            $scope.CustomerSalesOptions.grid.render();


            if ($scope.flag != 1) {

                var op = $scope.relamanOptions.grid.getOptions();
                op.editable = true;
                $scope.relamanOptions.grid.setOptions(op);
                $scope.relamanOptions.grid.render();

                var op1 = $scope.BrandOptions.grid.getOptions();
                op1.editable = true;
                $scope.BrandOptions.grid.setOptions(op1);
                $scope.BrandOptions.grid.render();

                var op2 = $scope.BankOptions.grid.getOptions();
                op1.editable = true;
                $scope.BankOptions.grid.setOptions(op1);
                $scope.BankOptions.grid.render();

                var op3 = $scope.PaymentTypeOptions.grid.getOptions();
                op1.editable = true;
                $scope.PaymentTypeOptions.grid.setOptions(op1);
                $scope.PaymentTypeOptions.grid.render();

                var op4 = $scope.PaytypeDetailOptions.grid.getOptions();
                op1.editable = true;
                $scope.PaytypeDetailOptions.grid.setOptions(op1);
                $scope.PaytypeDetailOptions.grid.render();

                var op5 = $scope.CustomerSalesOptions.grid.getOptions();
                op1.editable = true;
                $scope.CustomerSalesOptions.grid.setOptions(op1);
                $scope.CustomerSalesOptions.grid.render();


            } else {
                var op = $scope.relamanOptions.grid.getOptions();
                op.editable = false;
                $scope.relamanOptions.grid.setOptions(op);
                $scope.relamanOptions.grid.render();

                var op1 = $scope.BrandOptions.grid.getOptions();
                op1.editable = false;
                $scope.BrandOptions.grid.setOptions(op1);
                $scope.BrandOptions.grid.render();

                var op2 = $scope.BankOptions.grid.getOptions();
                op1.editable = false;
                $scope.BankOptions.grid.setOptions(op1);
                $scope.BankOptions.grid.render();

                var op3 = $scope.PaymentTypeOptions.grid.getOptions();
                op1.editable = false;
                $scope.PaymentTypeOptions.grid.setOptions(op1);
                $scope.PaymentTypeOptions.grid.render();

                var op4 = $scope.PaytypeDetailOptions.grid.getOptions();
                op1.editable = false;
                $scope.PaytypeDetailOptions.grid.setOptions(op1);
                $scope.PaytypeDetailOptions.grid.render();

                var op5 = $scope.CustomerSalesOptions.grid.getOptions();
                op1.editable = false;
                $scope.CustomerSalesOptions.grid.setOptions(op1);
                $scope.CustomerSalesOptions.grid.render();
            }
        });
    }

    $scope.delete = function (index) {
        var postdata = {
            cust_apply_id: $scope.data.currItem.cust_apply_id
        };
        if (postdata.cust_apply_id == undefined || postdata.cust_apply_id == 0) {
            BasemanService.notify(notify, "单据ID不存在，不能删除", "alert-warning", 1000);
            return;
        }
        ;
        ds.dialog.confirm("您确定删除【整个单据】吗？", function () {
            var promise = BasemanService.RequestPost("customer_apply_header", "delete", postdata);
            promise.then(function (data) {
                BasemanService.notify(notify, "删除成功!", "alert-info", 1000);

                $scope.clearinformation();
            });
        });
    }

    $scope.clearinformation = function () {
        $scope.activeLine = 0;

        $scope.data.currItem = {
            objattachs: []
        };

        $scope.data.currItem.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
        $scope.data.currItem.creator = $scope.userbean.creator;
        $scope.data.currItem.org_id = $scope.userbean.org_id;
        $scope.data.currItem.org_name = $scope.userbean.org_name;
        $scope.data.currItem.sales_user_id = $scope.userbean.userid;


        //$scope.customer_apply_header.org_name =window.str
        $scope.data.currItem.stat = 1;
        $scope.data.currItem.currency_id = 4;
        $scope.data.currItem.trade_type = 1;

        //联系人
        $scope.data.currItem.customer_apply_relamanofcustomer_apply_headers = [];
        //银行
        $scope.data.currItem.customer_apply_bankofcustomer_apply_headers = [];
        //支付条件
        $scope.data.currItem.customer_apply_payment_typeofcustomer_apply_headers = [];
        //$scope.data.currItem.customer_apply_paytype_detailofcustomer_apply_payment_types= [];
        //业务员
        $scope.data.currItem.customer_apply_userofcustomer_apply_headers = [];


        if ($scope.relamanOptions.grid) {
            $scope.relamanOptions.grid.setData($scope.data.currItem.customer_apply_relamanofcustomer_apply_headers);
            $scope.relamanOptions.grid.invalidateAllRows();
            $scope.relamanOptions.grid.render();
        }
        if ($scope.BankOptions.grid) {
            $scope.BankOptions.grid.setData($scope.data.currItem.customer_apply_bankofcustomer_apply_headers);
            $scope.BankOptions.grid.invalidateAllRows();
            $scope.BankOptions.grid.render();
        }
        if ($scope.PaymentTypeOptions.grid) {
            $scope.PaymentTypeOptions.grid.setData($scope.data.currItem.customer_apply_payment_typeofcustomer_apply_headers);
            $scope.PaymentTypeOptions.grid.invalidateAllRows();
            $scope.PaymentTypeOptions.grid.render();
        }

        if ($scope.CustomerSalesOptions.grid) {
            $scope.CustomerSalesOptions.grid.setData($scope.data.currItem.customer_apply_userofcustomer_apply_headers);
            $scope.CustomerSalesOptions.grid.invalidateAllRows();
            $scope.CustomerSalesOptions.grid.render();
        }


    }
    $scope.new = function () {
        // $("a[data-target='#tab1']").trigger("click");
        $scope.clearinformation();
    };
    //处理参数，参数优先
    if ($location.search().param != undefined) {

        //var x = $location.search().param;
        $.base64.utf8encode = true;
        //var y = $.base64.atob(x, true);
        var ob = $.base64.atob($location.search().param);
        var obj1 = ob.split("|");
        var x = JSON.parse(obj1[3], true);
        if (x.userid) {
            if (x.userid != window.strUserId) {
                return;
            }
        }
        if (x) {
            $scope.data = {currItem: {}};
            $scope.data.currItem["cust_apply_id"] = x;
            $scope.refresh(-2);
        } else if (x.initsql) {
            $scope.autosearch(x.initsql);
        }

        //清除参数
    } else {
        var _stateName = $rootScope.$state.$current.name;
        var data = localeStorageService.get(_stateName);
        if (data == undefined) {
            var temp = localeStorageService.getHistoryItem($rootScope.$state.$current.name);
            if (temp) {//历史纪录
                $scope.data.currItem = temp;
            } else {
                $timeout(function () {
                    $scope.new();
                });
            }
        } else {

            $scope.isEdit = true;
            $scope.EditStr = "编辑";
            //var promise = BasemanService.RequestPost("customer_apply_header", "select", {apply_id: data.apply_id});
            //promise.then(function (data) {
            //    $scope.data.currItem = data;
            //});
            $scope.data.currItem.cust_apply_id = data.cust_apply_id;
            $scope.refresh(2)
        }

    }
}

billmanControllers
angular.module('inspinia')
    .controller("customerapplyheaderEditController", customerapplyheaderEditController)