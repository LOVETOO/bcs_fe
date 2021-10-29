var billmanControllers = angular.module('inspinia');
function edi_nolcquotaapplyinfo($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService, notify) {
    //继承基类方法
    edi_nolcquotaapplyinfo = HczyCommon.extend(edi_nolcquotaapplyinfo, ctrl_bill_public);
    edi_nolcquotaapplyinfo.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息

    $scope.objconf = {
        name: "edi_nolcquotaapplyinfo",
        key: "corpserialid",
        wftempid: 10143,
        FrmInfo: {sqlBlock: "stat=5"},
        grids: [{optionname: 'options_4', idname: 'edi_nolcquotaapplyinfo_flowofedi_nolcquotaapplyinfos'}]
    };

    /************************初始化页面***********************/
    var myDate = new Date();
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            stat: 1,
            tradenamecode: 0,
            tradeelsename: "空调器",
            create_time: myDate.toLocaleDateString(),
            kusable: 2
        };
    };
    /**---------------------初始化页面----------------------*/
    /***********************保存校验区域*********************/
    $scope.validate = function () {
        var errorlist = [];
        $scope.data.currItem.areaname == undefined ? errorlist.push("销售区域为空") : 0;
        $scope.data.currItem.buyerengname == undefined ? errorlist.push("买方名称为空") : 0;
        $scope.data.currItem.sinosurebuyerno == undefined ? errorlist.push("买方代码为空") : 0;
        $scope.data.currItem.cust_code == undefined ? errorlist.push("客户编码为空") : 0;

        $scope.data.currItem.contractpaymode == undefined ? errorlist.push("合同支付方式为空") : 0;
        $scope.data.currItem.paytermapply == undefined ? errorlist.push("信用期限为空") : 0;
        $scope.data.currItem.quotasumapply == undefined ? errorlist.push("申请限额为空") : 0;
        $scope.data.currItem.ordersum == undefined ? errorlist.push("当前在手订单金额为空") : 0;

        $scope.data.currItem.tradenamecode == undefined ? errorlist.push("商品代码为空") : 0;
        $scope.data.currItem.tradeelsename == undefined ? errorlist.push("商品名称为空") : 0;

        if (errorlist.length) {
            BasemanService.notify(notify, errorlist, "alert-danger");
            return false;
        }
        return true;
    }

    $scope.save_before = function () {
        $scope.data.currItem.flag=2;
        delete $scope.data.currItem.edi_nolcquotaapplyinfo_flowofedi_nolcquotaapplyinfos;
    }

    /**----------------------保存校验区域-------------------*/


    $scope.refresh_after = function () {
        $scope.options_4.api.setRowData($scope.data.currItem.edi_nolcquotaapplyinfo_flowofedi_nolcquotaapplyinfos);
    }
    /**********************下拉框值查询（系统词汇）***************/

    //状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        var stats = [];
        for (var i = 0; i < data.dicts.length; i++) {
            object = {};
            object.id = data.dicts[i].dictvalue;
            object.name = data.dicts[i].dictname;
            stats.push(object);
        }
        $scope.stats = stats;
    })
    BasemanService.RequestPostAjax("base_search", "searchdict3", {dictcode: "Edi_commoditygroup_type"}).then(function (data) {
        $scope.tradecode = data.dicts;
    })
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "lastpaymode1"}).then(function (data) {
        $scope.lastpaymode = data.dicts;
    })
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "paymode"}).then(function (data) {
        $scope.paymode = data.dicts;
    })
    //$scope.paymode = [{dictvalue: 4, dictname: "OA"}, {dictvalue: 2, dictname: "D/P"}];
    $scope.warrantor = [{dictvalue: 0, dictname: "无"}, {dictvalue: 1, dictname: "有"}];
    $scope.ifhisttrade = [{dictvalue: 0, dictname: "无"}, {dictvalue: 1, dictname: "有"}];
    // $scope.lastpaymode=[{dictvalue:1,dictname:"L/C"},{dictvalue:2,dictname:"D/P"},{dictvalue:4,dictname:"OA"}];

    /**********************弹出框值查询**************************/
    $scope.selectorg = function () {
        if($scope.data.currItem.stat!=1){
            return
        }
        $scope.FrmInfo = {

            classid: "scporg",
            postdata: {},
            sqlBlock: "stat =2 and OrgType = 5",
            backdatas: "orgs",

        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.areano = result.code;
            $scope.data.currItem.areaname = result.orgname;
            $scope.data.currItem.applicant = result.orgname;

        });
    }
    $scope.selectsource_code = function () {
        if($scope.data.currItem.stat!=1){
            return
        }
        $scope.FrmInfo = {
            title: "历史申请单号",
            is_custom_search: true,
            is_high: true,
            thead: [
                {
                    name: "限额单申请号",
                    code: "corpserialno",
                    show: true,
                    iscond: true,
                    type: 'string'

                }, {
                    name: "买方代码",
                    code: "sinosurebuyerno",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "客户编码",
                    code: "cust_code",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "客户名称",
                    code: "cust_name",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "买方名称",
                    code: "buyerengname",
                    show: true,
                    iscond: true,
                    type: 'string'
                }],
            classid: "edi_nolcquotaapplyinfo",

        };
        if ($scope.data.currItem.cust_code == undefined || $scope.data.currItem.cust_code == "") {
        }
        else {
            $scope.FrmInfo.sqlBlock = "cust_code=" + $scope.data.currItem.cust_code
        }
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (result) {
            for (name in result) {
                $scope.data.currItem[name] = result[name];
            }
            $scope.data.currItem.source_code = result.corpserialno;//
            $scope.data.currItem.quotasum = 0;
        });
    }

    $scope.selectbuyerno = function () {
        if($scope.data.currItem.stat!=1){
            return
        }
        if ($scope.data.currItem.areano == undefined || $scope.data.currItem.areano == "") {
            BasemanService.notice("请先选销售区域", "alert-warning");
            return;
        }

        $scope.FrmInfo = {
            title: "买方代码",
            thead: [
                {
                    name: "买方中信代码",
                    code: "buyerno",
                    show: true,
                    iscond: true,
                    type: 'string'

                }, {
                    name: "客户编码",
                    code: "cust_code",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "客户名称",
                    code: "cust_name",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "买方英文名称",
                    code: "engname",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "买方英文地址",
                    code: "engaddress",
                    show: true,
                    iscond: true,
                    type: 'string'
                }],
            is_custom_search: true,
            is_high: true,
            classid: "edi_buyerinfo",
            sqlBlock: "areano=" + $scope.data.currItem.areano
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (result) {
            $scope.data.currItem.sinosurebuyerno = result.buyerno;
            $scope.data.currItem.shtname = result.shtname;
            $scope.data.currItem.cust_code = result.cust_code;
            $scope.data.currItem.cust_id = result.cust_id;
            $scope.data.currItem.cust_name = result.cust_name;
            $scope.data.currItem.buyerengname = result.engname;
            $scope.data.currItem.buyerengaddress = result.engaddress;
            $scope.data.currItem.buyercountrycode = result.countrycode

        });

    }
    $scope.selectbuyercountry = function () {
    }
    $scope.selectwarrantorno = function () {
        if($scope.data.currItem.stat!=1){
            return
        }
        $scope.FrmInfo = {
            is_high: true,
            is_custom_search: true,
            title: "担保人代码",
            thead: [{
                name: "中信买方代码",
                code: "buyerno",
                show: true,
                iscond: true,
                type: 'string'

            }, {
                name: "客户编码",
                code: "cust_code",
                show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "客户名称",
                code: "cust_name",
                show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "买方英文名称",
                code: "engname",
                show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "买方英文地址",
                code: "engaddress",
                show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "买方中文地址",
                code: "chnaddress",
                show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "买方中文名称",
                code: "chnname",
                show: true,
                iscond: true,
                type: 'string'
            }],
            classid: "edi_buyerinfo",
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (result) {
            $scope.data.currItem.sinosurewarrantorno = result.buyerno;
            $scope.data.currItem.warrantorengname = result.cust_name;
            $scope.data.currItem.warrantorengaddress = result.engaddress;
            $scope.data.currItem.warrantorcountrycode = result.countrycode
        });
    }
    //查询
    $scope.getsendamt = function () {
        if ($scope.data.currItem.cust_id == 0 || $scope.data.currItem.cust_id == undefined) {
            BasemanService.notice("请选择买方代码", "alert-warning");
        }
        if (($scope.data.currItem.lastyear1 == 0 || $scope.data.currItem.lastyear1 == undefined) &&
            ($scope.data.currItem.lastyear2 == 0 || $scope.data.currItem.lastyear2 == undefined) &&
            ($scope.data.currItem.lastyear3 == 0 || $scope.data.currItem.lastyear3 == undefined)) {
            BasemanService.notice("请选择交易年份", "alert-warning");
        }
        var postdata = {
            cust_id: $scope.data.currItem.cust_id || 0,
            invoice_id: $scope.data.currItem.lastyear1 || 0,
            old_invoice_id: $scope.data.currItem.lastyear2 || 0,
            pi_id: $scope.data.currItem.lastyear3 || 0
        };
        BasemanService.RequestPost("bill_invoice_split_header", "getsendamt", postdata)
            .then(function (data) {
                $scope.data.currItem.lastsum1 = data.invoice_amt;
                $scope.data.currItem.lastsum2 = data.send_amt;
                $scope.data.currItem.lastsum3 = data.jd_totalamt
            });
    }
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
    //网格定义
    $scope.options_4 = {
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
            var isGrouping = $scope.options_4.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_4 = [
        {
            headerName: "单据号", field: "bill_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "单据时间", field: "bill_date", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "单据金额", field: "bill_amt", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注", field: "note", editable: false, filter: 'set', width: 300,
            cellEditor: "文本框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    //数据缓存
    $scope.initdata();
}
//加载控制器
billmanControllers
    .controller('edi_nolcquotaapplyinfo', edi_nolcquotaapplyinfo)
