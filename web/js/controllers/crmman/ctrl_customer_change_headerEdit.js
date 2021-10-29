/**
 * 客户资料变更编辑
 */
'use strict';
function ctrl_customer_change_headerEdit($scope, $location, $timeout, $modal, $rootScope, notify, BasemanService, localeStorageService, FormValidatorService) {

    localeStorageService.pageHistory($scope, function () {
        return $scope.data.currItem
    });

    //如果是编辑objattachs
    $scope.isEdit = false;
    $scope.EditStr = "新增";
    $scope.activeLine = 0
    $scope.data = {};
    $scope.data.currItem = {};
    $scope.userbean = {};


    $scope.data.currItem.customer_addressofcustomers = [];
    $scope.data.currItem.customer_change_bankofcustomer_change_headers = [];
    $scope.data.currItem.customer_brandofcustomers = [];
    $scope.data.currItem.customer_change_bankofcustomer_change_headers = [];
    $scope.data.currItem.customer_change_brandofcustomer_change_headers = [];
    $scope.data.currItem.customer_change_headers = [];
    $scope.data.currItem.customer_change_payment_typeofcustomer_change_headers = [];
    $scope.data.currItem.customer_change_paytype_detailofcustomer_change_headers = [];
    $scope.data.currItem.customer_change_relamanofcustomer_change_headers = [];
    $scope.data.currItem.customer_change_seaport_inofcustomer_change_headers = [];
    $scope.data.currItem.customer_change_seaport_outofcustomer_change_headers = [];
    $scope.data.currItem.objattachs = [];

    // 一、初始信息：1.查询基础数据 2.初始化网格 3.初始化数据
    // 二、函数方法

    $scope.init = function () {
        var postdata = {
            sqlwhere: ""
        };
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
        var promise = BasemanService.RequestPostAjax("base_currency", "search", postdata);
        promise.then(function (data) {
            $scope.base_currencys = HczyCommon.stringPropToNum(data.base_currencys);
            //currency_code,currency_id currency_name 都要传
            $scope.edi_currencys = data.edi_currencys;
            $scope.currency_code = data.currency_code;
            $scope.currency_id = data.currency_id;
            $scope.currency_name = data.currency_name;

        });
        $scope.currency_change = function () {
            for (var i = 0; i < $scope.base_currencys.length; i++) {
                if ($scope.base_currencys[i].currency_code == $scope.data.currItem.currency_code) {
                    $scope.data.currItem.currency_id = $scope.base_currencys[i].currency_id;
                    $scope.data.currItem.currency_name = $scope.base_currencys[i].currency_name;
                }
            }
        }
        $scope.saleorg_currencychange = function (index) {
            for (var i = 0; i < $scope.base_currencys.length; i++) {
                if ($scope.base_currencys[i].currency_code == $scope.customer_change_header.customer_salorgofcustomer_change_headers[index].currency_code) {
                    $scope.data.currItem.customer_change_salorgofcustomer_change_headers[index].currency_id = $scope.base_currencys[i].currency_id;
                    $scope.data.currItem.customer_change_salorgofcustomer_change_headers[index].currency_name = $scope.base_currencys[i].currency_name;
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
        })

        // 登录用户
        $scope.userbean = window.userbean;
        $scope.mainbtn = {
            search: false,
            add: false
        };
    };

    $scope.init();

    BasemanService.pageInit($scope);
    //贸易类型new_trade_type
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"}).then(function (data) {
        $scope.trade_types = data.dicts;
    });
    //区域等级area_levels
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "area_level"}).then(function (data) {
        $scope.area_levels = data.dicts;
    });
    //信用等级
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "credit_rating"}).then(function (data) {
        $scope.credit_ratings = data.dicts;
    });
    //客户性质cust_types
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "cust_type"}).then(function (data) {
        $scope.cust_types = data.dicts;
    });
    //客户等级new_cust_level
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "cust_level"}).then(function (data) {
        $scope.cust_levels = data.dicts;
    });
    //单据状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        $scope.stats = data.dicts;
    });


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
                        item.customer_change_paytype_detailofcustomer_change_payment_types = result.payment_type_lineofpayment_types;
                        //item.customer_change_paytype_detailofcustomer_change_headers = result.payment_type_levelofpayment_types;
                        for (var i = 0; i < item.customer_change_paytype_detailofcustomer_change_payment_types.length; i++) {
                            item.customer_change_paytype_detailofcustomer_change_payment_types[i].seq = i + 1;
                        }
                        $scope.PaytypeDetailOptions.grid.setData(item.customer_change_paytype_detailofcustomer_change_payment_types);
                        $scope.PaytypeDetailOptions.grid.resizeCanvas();

                    })

                }
            },
            scope: $scope
        });
    };
    // 客户资料变更查询
    $scope.openCustFrm = function () {
        $scope.FrmInfo = {
            title: "客户资料查询",
            thead: [
                {
                    name: "客户编码",
                    code: "cust_code"
                }, {
                    name: "SAP编码",
                    code: "sap_code"
                }, {
                    name: "客户名称",
                    code: "cust_name"
                }, {
                    name: "客户描述",
                    code: "cust_desc"
                }],
            classid: "customer",
            postdata: {flag: 11,},
            sqlBlock: " not exists (select 1 from customer_change_header c where c.cust_id=Customer.cust_id and c.stat<>5) ",
            searchlist: ["cust_code", "sap_code", "cust_name", "cust_desc"],
        };
        BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (result) {
            BasemanService.RequestPost("customer", "select", {cust_id: result.cust_id}).then(function (result) {
                result.stat = $scope.data.currItem.stat;
                result.creator = $scope.data.currItem.creator;
                result.creat_time = $scope.data.currItem.creat_time;
                $scope.data.currItem.note = undefined;
                result = HczyCommon.stringPropToNumAll(result);
                for (var name in result) {
                    if (!(result[name] instanceof Array)) {
                        $scope.data.currItem[name] = result[name];
                    }
                }
                $scope.data.currItem.new_cust_name = result.cust_name;
                $scope.data.currItem.new_org_code = result.org_code;
                $scope.data.currItem.new_org_id = result.org_id;
                $scope.data.currItem.new_org_name = result.org_name;
                $scope.data.currItem.new_idpath = result.idpath;
                $scope.data.currItem.new_currency_code = result.currency_code;
                $scope.data.currItem.new_currency_id = result.currency_id;
                $scope.data.currItem.new_currency_name = result.currency_name;
                $scope.data.currItem.new_area_code = result.area_code;
                $scope.data.currItem.new_area_id = result.area_id;
                $scope.data.currItem.new_area_name = result.area_name;
                $scope.data.currItem.new_lawman = result.lawman;
                $scope.data.currItem.new_bank_accno = result.bank_accno;
                $scope.data.currItem.new_cust_type = result.cust_type;
                $scope.data.currItem.new_cust_level = result.cust_level;
                $scope.data.currItem.new_part_rate = result.part_rate;
                $scope.data.currItem.new_part_rate = result.part_rate;
                $scope.data.currItem.new_invoice_address = result.invoice_address;
                $scope.data.currItem.new_address = result.address;
                $scope.data.currItem.new_tel = result.tel;
                $scope.data.currItem.new_fax = result.fax;
                $scope.data.currItem.new_area_level = result.area_level;
                $scope.data.currItem.new_trade_type = result.trade_type;
                $scope.data.currItem.new_email = result.email;
                $scope.data.currItem.new_core_name = result.core_name;
                $scope.data.currItem.oa_change = result.oa_change;
                $scope.data.currItem.new_credit_rating = result.credit_rating;
                //数组赋值
                $scope.data.currItem.customer_change_brandofcustomer_change_headers = result.customer_brandofcustomers;
                $scope.data.currItem.customer_change_bankofcustomer_change_headers = result.customer_bankofcustomers;
                $scope.data.currItem.customer_change_relamanofcustomer_change_headers = result.customer_relamanofcustomers;
                $scope.data.currItem.customer_change_oa_lineofcustomer_change_headers = result.customer_oa_lineofcustomers;
                $scope.data.currItem.customer_change_payment_typeofcustomer_change_headers = result.customer_payment_typeofcustomers || [];
                $scope.data.currItem.customer_change_paytype_detailofcustomer_change_headers = result.customer_paytype_detailofcustomers;
                //不需要的类型
                $scope.data.currItem.customer_change_payment_toofcustomer_change_headers = result.customer_payment_toofcustomers || [];
                $scope.data.currItem.customer_change_paytype_toofcustomer_change_headers = result.customer_paytype_toofcustomers || [];
                var payment = $scope.data.currItem.customer_change_payment_typeofcustomer_change_headers;
                for (var i = 0; i < payment.length; i++) {
                    payment[i].customer_change_paytype_detailofcustomer_change_payment_types = payment[i].customer_paytype_detailofcustomer_payment_types;
                    delete payment[i].customer_paytype_detailofcustomer_payment_types;
                }
                if (payment.length > 0) {
                    $scope.data.currItem.customer_change_paytype_detailofcustomer_change_payment_types = payment[0].customer_change_paytype_detailofcustomer_change_payment_types;
                }
                $scope.putDetail();
            });
        });
    }


    $scope.changeLine = function (e, args) {
        if ($scope.isDelete) {  //删除行的时候不执行change
            $scope.isDelete = false;
            return;
        }
        //使用$scope.activeLine记录上一个行，在clearinformation中初始化值为0
        HczyCommon.commitGrid($scope.PaytypeDetailOptions.grid);
        var data = args.grid.getData();
        if (data[$scope.activeLine] == undefined) {
            $scope.activeLine = 0;
        }
        data[$scope.activeLine].customer_change_paytype_detailofcustomer_change_payment_types
            = $scope.PaytypeDetailOptions.grid.getData()//结尾
        //起始
        var h_item_line = data[args.row] || {};
        if (h_item_line.customer_change_paytype_detailofcustomer_change_payment_types == undefined) {
            h_item_line.customer_change_paytype_detailofcustomer_change_payment_types = [];
        }
        $scope.activeLine = args.row;
        $scope.PaytypeDetailOptions.grid.setData(h_item_line.customer_change_paytype_detailofcustomer_change_payment_types);
        $scope.PaytypeDetailOptions.grid.resizeCanvas();
        $scope.PaytypeDetailOptions.grid.render();
    }

    //业务部门
    $scope.selectorg = function () {
        $scope.FrmInfo = {
            title: "机构查询",
            thead: [{
                name: "结构编码",
                code: "code"
            }, {
                name: "机构名称",
                code: "orgname"
            }, {
                name: "备注",
                code: "note"
            }],
            classid: "scporg",
            postdata: {},
            sqlBlock: " orgtype=5 ",
            backdatas: "orgs",
            searchlist: ["code", "orgname", "note"],
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
                $scope.data.currItem.new_org_name = result.orgname;
                $scope.data.currItem.new_org_code = result.code;
                $scope.data.currItem.org_id = result.orgid;
                //$scope.data.currItem.org_name = result.orgname;
            });
    }


    // 联系人
    $scope.relaman_Columns = [
        {
            id: "seq",
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
            id: "seq",
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
            id: "seq",
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
    // 初始化网络事件
    $scope.initGridOptions = function () {
        // 1.网络事件
        // 联系人
        $scope.relamanOptions = {
            editable: true,
            enableAddRow: false,
            enableCellNavigation: true,
            asyncEditorLoading: false,
            autoEdit: true
        };
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


    }
    $scope.initGridOptions();


    //添加明细
    //联系人relamanOptions
    $scope.addRelaman = function () {
        var item = {
            seq: 1,
            ischangedadd: 1,
        };
        $scope.relamanOptions.grid.getData().push(item);
        $scope.relamanOptions.grid.resizeCanvas();
    }
    $scope.delRelaman = function () {
        var grid = $scope.relamanOptions.grid;
        var rowidx = grid.getActiveCell().row;
        if (grid.getData()[rowidx].ischangedadd != 1) {
            BasemanService.notice
            BasemanService.notice("客户原有联系不能删除只能变更", "alter-warning");
            return;
        }
        $scope.relamanOptions.grid.getData().splice(rowidx, 1);
        grid.invalidateAllRows();
        grid.updateRowCount();
        grid.render();
    }
    // 支付类型PaytypeDetailOptions
    $scope.addPaymentType = function () {
        var item = {
            seq: 1,
            ischangedadd: 1,
        };
        $scope.PaymentTypeOptions.grid.getData().push(item);
        $scope.PaymentTypeOptions.grid.resizeCanvas();

    }
    $scope.delPaymentType = function () {
        var grid = $scope.PaymentTypeOptions.grid;
        var rowidx = grid.getActiveCell().row;
        if (grid.getData()[rowidx].ischangedadd != 1) {
            BasemanService.notice("客户原有付款方式不能删除只能变更", "alter-warning");
            return;
        }
        grid.getData().splice(rowidx, 1);
        $scope.isDelete = true;
        grid.resizeCanvas();
        grid.render();
        var row = 0
        if (grid.getActiveCell() == undefined) {
            row = 0
        } else {
            row = grid.getActiveCell().row
        }
        $scope.activeLine = row || 0;
        var intoData = grid.getData()[$scope.activeLine].customer_change_paytype_detailofcustomer_change_payment_types;
        $scope.PaytypeDetailOptions.grid.setData(intoData);
        $scope.PaytypeDetailOptions.grid.resizeCanvas();
        $scope.PaytypeDetailOptions.grid.render();

    }

    $scope.addType = function () {
        var item = {
            seq: 1,
            ischangedadd: 1,
        };
        $scope.PaytypeDetailOptions.grid.getData().push(item);
        $scope.PaytypeDetailOptions.grid.resizeCanvas();
        //$scope.PaytypeDetailOptions.grid.getData().push(item);
        //$scope.PaytypeDetailOptions.grid.invalidateAllRows();
        //$scope.PaytypeDetailOptions.grid.updateRowCount();
        //$scope.PaytypeDetailOptions.grid.render();
    }
    $scope.delType = function () {
        var grid = $scope.PaytypeDetailOptions.grid;
        var rowidx = grid.getActiveCell().row;
        if (grid.getData()[rowidx].ischangedadd != 1) {
            BasemanService.notice("客户原有付款方式详情不能删除只能变更", "alter-warning");
            return;
        }
        $scope.PaytypeDetailOptions.grid.getData().splice(rowidx, 1);
        grid.invalidateAllRows();
        grid.updateRowCount();
        grid.render();
    }
    // 品牌BrandOptions
    $scope.addBrand = function () {
        var item = {
            seq: 1,
            ischangedadd: 1,
        };
        $scope.BrandOptions.grid.getData().push(item);
        $scope.BrandOptions.grid.resizeCanvas();


    }
    $scope.delBrand = function (index) {
        var grid = $scope.BrandOptions.grid;
        var rowidx = grid.getActiveCell().row;
        if (grid.getData()[rowidx].ischangedadd != 1) {
            BasemanService.notice("客户原有商标不能删除只能变更", "alter-warning");
            return;
        }

        $scope.BrandOptions.grid.getData().splice(rowidx, 1);
        grid.invalidateAllRows();
        grid.updateRowCount();
        grid.render();
    }
    // 银行  BankOptions
    $scope.addBank = function () {

        $scope.FrmInfo = {};
        // var FrmInfo = {};
        $scope.FrmInfo.title = "银行查询";
        $scope.FrmInfo.thead = [{
            name: "银行名称",
            code: "bank_name"
        }, {
            name: "银行编码",
            code: "bank_code"
        }];
        $scope.sqlwhere = ["bank_name", "bank_code"]; //弹出窗体查询条件
        $scope.classname = "bank";   //需要查询的后台类
        $scope.fun = "search";//查询方法
        BasemanService.openFrm("views/common/Pop_CommonAdd.html", CommonAddController, $scope, "")
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
                        tempobj.ischangedadd = 1;
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
        if (grid.getData()[rowidx].ischangedadd != 1) {
            BasemanService.notice("客户原有银行不能删除只能变更", "alter-warning");
            return;
        }
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

    // 关闭
    $scope.closebox = function () {
        $location.path("/main/customer_change_header");
    }
    //区域弹出窗口
    $scope.openAreaNameFrm = function () {
        $scope.FrmInfo = {
            title: "国家编码查询",
            thead: [
                {name: "地区编码", code: "areacode"},
                {name: "地区名称", code: "areaname"},
                {name: "电话区号", code: "telzone"},
                {name: "备注", code: "note"}],
            classid: "scparea",
            postdata: {},
            sqlBlock: "areatype=2",
            searchlist: ["areacode", "areaname", "telzone", "note"],
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
                $scope.data.currItem.new_area_name = result.areaname;
                $scope.data.currItem.new_area_code = result.areacode;
                $scope.data.currItem.area_id = parseFloat(result.areaid);
            });
    }

    //中文名称
    $scope.selectCoreItem = function () {
        $scope.FrmInfo = {
            title: "机构查询",
            thead: [
                {
                    name: "中心名称",
                    code: "core_name"
                }],
            classid: "customer_core_item",
            postdata: {},
            searchlist: ["core_name"],
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
                $scope.data.currItem.new_core_name = result.core_name;

            });
    }

    //货币
        $scope.currency = function () {
        $scope.FrmInfo = {
            title: "货币编码",
            thead: [{
                name: "货币代码",
                code: "currency_code"
            }, {
                name: "货币名称",
                code: "currency_name"
            }, {
                name: "备注",
                code: "note"
            }],
            classid: "base_currency",
            postdata: {},
            searchlist: ["currency_code", "currency_name", "note"],
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
                $scope.data.currItem.new_currency_code = result.currency_code;

                $scope.data.currItem.new_currency_name = result.currency_name;

                $scope.data.currItem.new_currency_id = result.currency_id;

            });
    }
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

    //查询
    $scope.search = function () {
        $scope.FrmInfo = {
            title: "客户资料变更查询",
            thead: [
                {
                    name: "变更单号",
                    code: "cust_change_no"
                }, {
                    name: "创建人",
                    code: "creator"
                }, {
                    name: "创建时间",
                    code: "create_time"
                }, {
                    name: "客户",
                    code: "cust_name"
                }, {
                    name: "客户编码",
                    code: "sap_code"
                }, {
                    name: "变更说明",
                    code: "note"
                }],
            classid: "customer_change_header",
            postdata: {},
            searchlist: ["cust_change_no", "creator", "create_time", "cust_name", "sap_code", "note"],
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (result) {
                $scope.data.currItem.cust_change_no = result.cust_change_no;
                $scope.data.currItem.create_time = result.create_time;
                $scope.data.currItem.cust_name = result.cust_name;
                $scope.data.currItem.creator = result.creator;
                $scope.data.currItem.note = result.note;
                $scope.data.currItem.cust_change_id = result.cust_change_id;
                $scope.refresh(2);

            });
    }


    //客户资料保存更新
    $scope.save = function () {
        // 验证通过才进行保存
        if (FormValidatorService.validatorFrom($scope)) {
            $scope.data.currItem.new_part_rate = $scope.data.currItem.new_part_rate || 0;
            $scope.data.currItem.oa_change = $scope.data.currItem.oa_change || 0;
            $scope.data.currItem.new_rebate_rate = $scope.data.currItem.new_rebate_rate || 0;
            HczyCommon.commitGrid_GetData_setSeq($scope);
            var postdata = {}
            for (var name in $scope.data.currItem) {
                if (name != "customer_change_paytype_detailofcustomer_change_payment_types") {
                    postdata[name] = $scope.data.currItem[name]
                }
            }
			//支付条件
            for (i = 0; i < $scope.data.currItem.customer_change_payment_typeofcustomer_change_headers.length; i++) {
				var sum=0;
                $scope.data.currItem.customer_change_payment_typeofcustomer_change_headers[i].seq = (i + 1);
			for(var j=0;j<$scope.data.currItem.customer_change_payment_typeofcustomer_change_headers[i].customer_change_paytype_detailofcustomer_change_payment_types.length;j++){
				sum+=parseFloat($scope.data.currItem.customer_change_payment_typeofcustomer_change_headers[i].customer_change_paytype_detailofcustomer_change_payment_types[j].pay_ratio);
				}
				if(sum!=100){
				 BasemanService.notify(notify, "付款条件下第"+(i+1)+"行的下的付款比例相加不是100", "alert-info", 1000);	
				 return;
				}
            }
            var action = "update";
            if (postdata.cust_change_id == undefined || postdata.cust_change_id == 0) {
                var action = "insert";
            }
            var promise = BasemanService.RequestPost("customer_change_header", action, postdata);
            promise.then(function (data) {
                BasemanService.notify(notify, "保存成功!", "alert-info", 1000);
                $scope.isEdit = true;
                $scope.data.currItem = data;
                $scope.refresh(2);
            });
            $scope.putDetail()

        }
    }
    $scope.putDetail = function () {
        var grid = $scope.PaymentTypeOptions.grid;
        if (grid.getActiveCell() != null) {
            $scope.activeLine = grid.getActiveCell().row;
        } else {
            $scope.activeLine = 0;
        }
        $scope.data.currItem.customer_change_paytype_detailofcustomer_change_payment_types
            = $scope.data.currItem.customer_change_payment_typeofcustomer_change_headers[$scope.activeLine].customer_change_paytype_detailofcustomer_change_payment_types;
        HczyCommon.pushGrid($scope);
    }


    //流程处理
    $scope.wfstart = function () {
        //返回即提交
        var postdata = {
            opinion: '',
            objtypeid: 10071,
            objid: $scope.data.currItem.cust_change_id, //单据ID
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

    //流程处理
    $scope.deleteWfUser = function () {
        //返回即提交
        var postdata = {
            opinion: '',
            objtypeid: 10003,
            objid: 0, //单据ID
            wfid: $scope.data.currItem.wfid
        };
        BasemanService.RequestPost("base_wf", "deleteuser", postdata)
            .then(function (data) {
                BasemanService.notify(notify, "成功", "alert-info", 1000);
                //$scope.getwfDetail(data.wfid);
                $scope.data.currItem.wfid = data.wfid;
                $scope.data.currItem.stat = data.stat;
                //$scope.wfprocs = data.wfprocs;
                //$scope.wfprocuseropinions = data.wfprocuseropinions;

            })

    }

    $scope.wfbreak = function () {
        $scope.data.currItem.stat = 1;
    }

    $scope.refresh = function (flag) {
        var postdata = {
            cust_change_id: $scope.data.currItem.cust_change_id
        };
        if (postdata.cust_change_id == undefined || postdata.cust_change_id == 0) {
            BasemanService.notify(notify, "单据没有保存，无法刷新", "alert-warning", 1000);
            return;
        }
        ;
        var promise = BasemanService.RequestPost("customer_change_header", "select", postdata);
        promise.then(function (data) {
            if (flag != 2) {
                BasemanService.notify(notify, "刷新成功", "alert-info", 500);
            }
            ;
            $scope.data.currItem = data;
            $scope.putDetail();

        });
    }

    $scope.delete = function (index) {
        var postdata = {
            cust_change_id: $scope.data.currItem.cust_change_id,
        };
        if (postdata.cust_change_id == undefined || postdata.cust_change_id == 0) {
            BasemanService.notify(notify, "单据ID不存在，不能删除", "alert-warning", 1000);
            return;
        }
        ;
        ds.dialog.confirm("您确定删除【整个单据】吗？", function () {
            var promise = BasemanService.RequestPost("customer_change_header", "delete", postdata);
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
        $scope.data.currItem.creator = window.strUserId;
        $scope.data.currItem.org_id = $scope.userbean.org_id;
        $scope.data.currItem.org_name = $scope.userbean.org_name;
        $scope.data.currItem.sales_user_id = $scope.userbean.userid;

        //$scope.customer_change_header.org_name =window.str
        $scope.data.currItem.stat = 1;


        //联系人
        $scope.data.currItem.customer_change_relamanofcustomer_change_headers = [];
        //银行
        $scope.data.currItem.customer_change_bankofcustomer_change_headers = [];
        //支付条件
        $scope.data.currItem.customer_change_payment_typeofcustomer_change_headers = [];

        //支付明细
        $scope.data.currItem.customer_change_paytype_detailofcustomer_change_payment_types = [];
        //$scope.data.currItem.customer_change_userofcustomer_change_headers =[];


        if ($scope.relamanOptions.grid) {
            $scope.relamanOptions.grid.setData($scope.data.currItem.customer_change_relamanofcustomer_change_headers);
            $scope.relamanOptions.grid.invalidateAllRows();
            $scope.relamanOptions.grid.render();
        }
        if ($scope.BankOptions.grid) {
            $scope.BankOptions.grid.setData($scope.data.currItem.customer_change_bankofcustomer_change_headers);
            $scope.BankOptions.grid.invalidateAllRows();
            $scope.BankOptions.grid.render();
        }
        if ($scope.PaymentTypeOptions.grid) {
            $scope.PaymentTypeOptions.grid.setData($scope.data.currItem.customer_change_payment_typeofcustomer_change_headers);
            $scope.PaymentTypeOptions.grid.invalidateAllRows();
            $scope.PaymentTypeOptions.grid.render();
        }


    }
    $scope.new = function () {
        // $("a[data-target='#tab1']").trigger("click");
        $scope.clearinformation();
    };


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
            $scope.data.currItem["cust_change_id"] = x;
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
            //var promise = BasemanService.RequestPost("customer_change_header", "select", {apply_id: data.apply_id});
            //promise.then(function (data) {
            //    $scope.data.currItem = data;
            //});
            $scope.data.currItem.cust_change_id = data.cust_change_id;
            $scope.refresh(2)
        }
    }




}

angular.module('inspinia')
    .controller("ctrl_customer_change_headerEdit", ctrl_customer_change_headerEdit)