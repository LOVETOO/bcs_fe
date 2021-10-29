/**
 * 销售出库单
 */
function inv_out_bill_head($scope, $location, $rootScope, $modal, $timeout, BasemanService, BaseService, notify, $state, localeStorageService, FormValidatorService) {
    $scope.data = {};
    $scope.data.currItem = {};

    //初始化数据
    $scope.ShipmodeiId = [];//发运方式
    $scope.billStat = [];//单据状态
    //添加按钮
    var editHeaderButtons = function (row, cell, value, columnDef, dataContext) {
        return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' " +
            "style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>查看</button>";
    };

    //词汇表单据状态取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            HczyCommon.stringPropToNum(data.dicts);
            $scope.billStat = data.dicts;
            var billStat = [];
            for (var i = 0; i < data.dicts.length; i++) {
                billStat[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('headerColumns', 'stat')) {
                $scope.headerColumns[$scope.getIndexByField('headerColumns', 'stat')].options = billStat;
                $scope.headerGridView.setColumns($scope.headerColumns);
            }
        });

    //词汇表发运方式取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "shipmode_id"})
        .then(function (data) {
            HczyCommon.stringPropToNum(data.dicts);
            $scope.SyscreateType = data.dicts;
            var ShipmodeiId = [];
            for (var i = 0; i < data.dicts.length; i++) {
                ShipmodeiId[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('headerColumns', 'shipmode_id')) {
                $scope.headerColumns[$scope.getIndexByField('headerColumns', 'shipmode_id')].options = ShipmodeiId;
                $scope.headerGridView.setColumns($scope.headerColumns);
            }
        });
    $scope.getIndexByField = function (columns, field) {
        for (var i = 0; i < $scope[columns].length; i++) {
            if ($scope[columns][i].field == field) {
                return i;
                break;
            }
        }
        return false;
    }

    //网格设置
    $scope.headerOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false
    };
    $scope.lineOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false
    };
    //定义网格字段(主表)
    $scope.headerColumns = [
        {   id: "id",
            name: "序号",
            field: "id",
            width: 55,
        },{
            name: "操作",
            width: 60,
            formatter: editHeaderButtons
        },{
            id: "stat",
            name: "单据状态",
            field: "stat",
            width: 70,
            formatter: Slick.Formatters.SelectOption,
            options: [],
            type:"list"
        },{
            id: "invbillno",
            name: "出库单号",
            field: "invbillno",
            width: 130,
            type:"string"
        }, {
            id: "date_invbill",
            name: "单据日期",
            field: "date_invbill",
            width: 100,
            formatter: Slick.Formatters.Date,
            type:"date"
        }, {
            id: "customer_code",
            name: "客户编码",
            field: "customer_code",
            width: 100,
            type:"string"
        }, {
            id: "customer_name",
            name: "客户名称",
            field: "customer_name",
            width: 180,
            type:"string"
        }/*, {
            id: "dept_code",
            name: "部门编码",
            field: "dept_code",
            width: 100,
            type:"string"
        },{
            id: "dept_name",
            name: "部门名称",
            field: "dept_name",
            width: 130,
            type:"string"
        },{
            id: "warehouse_code",
            name: "出库仓编码",
            field: "warehouse_code",
            width: 100,
            type:"string"
        }, {
            id: "warehouse_name",
            name: "出库仓名称",
            width: 130,
            field: "warehouse_name",
            type:"string"
        },*/, {
            id: "created_by",
            name: "制单人",
            field: "created_by",
            width: 80,
            type:"string"
        },{
            id: "qty_sum",
            name: "合计数量",
            field: "qty_sum",
            width: 80,
            type:"number"
        },{
            id: "wtamount_billing",
            name: "折前总额",
            field: "wtamount_billing",
            width: 110,
            formatter: Slick.Formatters.Money,
            cssClass:"amt",
            type:"number"
        },{
            id: "wtamount_discount",
            name: "折后总额",
            field: "wtamount_discount",
            width: 110,
            formatter: Slick.Formatters.Money,
            cssClass:"amt",
            type:"number"
        },{
            id: "is_mes",
            name: "红冲",
            field: "is_mes",
            width: 60,
            formatter: Slick.Formatters.SelectOption,
            options: [
                {value: 1, desc: "否"},
                {value: 2, desc: "是"}],
            type:"list"
        },{
            id: "invbill_sap_no",
            name: "ERP出库单号",
            field: "invbill_sap_no",
            width: 130,
            type:"string"
        },  {
            id: "mo_remark",
            name: "备注",
            field: "mo_remark",
            width: 240,
            type:"string"
        }
    ];
    //定义网格字段（细表）
    $scope.lineColumns = [
        {
            id: "sa_salebillno",
            name: "销售订单号",
            field: "sa_salebillno",
            width: 130,
            type:"string"
        },{
            id: "attribute11",
            name: "ERP订单号",
            field: "attribute11",
            width: 120,
            type:"string"
        },{
            id: "date_invbill",
            name: "订单日期",
            field: "date_invbill",
            width: 100,
            formatter: Slick.Formatters.Date,
            type:"date"
        }, {
            id: "item_code",
            name: "产品编码",
            field: "item_code",
            width: 110,
            type:"string"
        },{
            id: "item_name",
            name: "产品名称",
            field: "item_name",
            width: 200,
            type:"string"
        },
        {
            id: "qty_bill",
            name: "出库数量",
            field: "qty_bill",
            width: 80,
            type:"string"
        }, {
            id: "discount_before_price",
            name: "折前单价",
            field: "discount_before_price",
            width: 100,
            formatter: Slick.Formatters.Money,
            cssClass:"amt",
            type:"string"
        },{
            id: "price_bill",
            name: "折后单价",
            field: "price_bill",
            width: 100,
            formatter: Slick.Formatters.Money,
            cssClass:"amt",
            type:"string"
        },{
            id: "wtamount_bill_f",
            name: "折前金额",
            field: "wtamount_bill_f",
            width: 100,
            formatter: Slick.Formatters.Money,
            cssClass:"amt",
            type:"string"
        },{
            id: "amount_bill_f",
            name: "折后金额",
            field: "amount_bill_f",
            width: 100,
            formatter: Slick.Formatters.Money,
            cssClass:"amt",
            type:"string"
        }, {
            id: "uom_name",
            name: "单位",
            field: "uom_name",
            width: 50,
            type:"string"
        }, {
            id: "spec_qty",
            name: "包装数量",
            width: 100,
            field: "spec_qty",
            type:"string"
        },/* {
            id: "sa_out_qty_bill",
            name: "订单数量",
            field: "sa_out_qty_bill",
            width: 100,
            type:"string"
        },*/ {
            id: "qty_recbill",
            name: "签收数量",
            field: "qty_recbill",
            width: 100,
            type:"string"
        },{
            id: "confirm_out_qty",
            name: "开票数量",
            field: "confirm_out_qty",
            width: 100,
            type:"string"
        },{
            id: "invoice_no",
            name: "发票号码",
            field: "invoice_no",
            width: 150,
            type:"string"
        }, {
            id: "remark",
            name: "备注",
            field: "remark",
            width: 180,
            type:"string"
        }
    ];

    var warehouse_code = {
        id: "warehouse_code",
        name: "出库仓编码",
        field: "warehouse_code",
        width: 100
    }
    var warehouse_name = {
        id: "warehouse_name",
        name: "出库仓名称",
        field: "warehouse_name",
        width:180
    };

    //网格初始化
    $scope.headerGridView = new Slick.Grid("#headerGridView",[], $scope.headerColumns, $scope.headerOptions);
    $scope.lineGridView = new Slick.Grid("#lineGridView",[], $scope.lineColumns, $scope.lineOptions);

    //网格可复制
    BasemanService.ReadonlyGrid($scope.headerGridView);
    BasemanService.ReadonlyGrid($scope.lineGridView);



    /**
     * 网格单击事件
     */
    function dgOnClick(e, args) {
        if ($(e.target).hasClass("viewbtn")) {
            $scope.detail(args);
        }
    };

    /**
     * 网格双击事件
     */
    function dgDblClick(e, args) {
        $scope.detail(args,'view');
    }

    //明细绑定点击事件
    $scope.headerGridView.onClick.subscribe(dgOnClick);
    $scope.headerGridView.onDblClick.subscribe(dgDblClick);

    //-------------通用查询---------------
    /**
     * 组织客户查询
     */
    $scope.customerSearch = function () {
        $scope.FrmInfo = {
            title: "组织客户查询",
            thead: [{
                name: "客户名称",
                code: "customer_name"
            },  {
                name: "客户编码",
                code: "customer_code"
            }],
            classid: "base_view_customer_org",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            // backdatas: "fin_bud_type_headers",
            ignorecase: "true", //忽略大小写
            postdata: {
                sqlwhere: " 1=1 "
            },
            searchlist: ["customer_name","customer_code"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.customer_name = result.customer_name;
            $scope.data.currItem.customer_code = result.customer_code;
            $scope.data.currItem.customer_id = result.customer_id;
            $scope.data.currItem.dept_code = result.dept_code;
            $scope.data.currItem.dept_name = result.dept_name;
            $scope.data.currItem.address1 = result.address1;
        });
    };
    /**
     * 业务员查询
     */
    $scope.employeeSearch = function () {
        $scope.FrmInfo = {
            title: "业务员查询",
            thead: [{
                name: "业务员编码",
                code: "employee_code"
            },  {
                name: "业务员名称",
                code: "employee_name"
            }],
            classid: "sale_employee",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            ignorecase: "true", //忽略大小写
            postdata: {
                sqlwhere: " 1=1 "
            },
            searchlist: ["employee_code","employee_name"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.employee_id = result.employee_id;
            $scope.data.currItem.employee_name = result.employee_name;
        });
    };
    /**
     * 销售订单查询
     */
    $scope.salebillnoSearch = function () {
        //必须先选客户
        if($scope.data.currItem.customer_id == undefined){
            BasemanService.swalWarning("提示", "请先选择客户！");
            return;
        }
        $scope.FrmInfo = {
            title: "销售订单查询",
            thead: [{
                name: "销售订单号",
                code: "sa_salebillno"
            }, {
                name: "客户编码",
                code: "customer_code"
            }, {
                name: "客户名称",
                code: "customer_name"
            },  {
                name: "仓库编码",
                code: "warehouse_code"
            },  {
                name: "仓库名称",
                code: "warehouse_name"
            },  {
                name: "商品编码",
                code: "item_code"
            },  {
                name: "商品名称",
                code: "item_name"
            },  {
                name: "数量",
                code: "qty_sum"
            },  {
                name: "单据日期",
                code: "date_invbill"
            },  {
                name: "部门编码",
                code: "dept_code"
            },  {
                name: "部门名称",
                code: "dept_name"
            },  {
                name: "业务员",
                code: "employee_name"
            },  {
                name: "回单号",
                code: "attribute1"
            }],
            classid: "sa_out_bill_head",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            ignorecase: "true", //忽略大小写
            postdata: {
                customer_id:$scope.data.currItem.customer_id,
                search_flag:3,
                is_exprot:1,
                sale_type:2,
                sqlwhere: " 1=1 "
            },
            searchlist: ["sa_salebillno","customer_code","customer_name","warehouse_code","warehouse_name",
                "item_code","item_name","qty_sum","date_invbill","dept_code","dept_name",
                "employee_name","attribute1"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.sa_out_bill_head_id = result.sa_out_bill_head_id;
            $scope.data.currItem.sa_salebillno = result.sa_salebillno;
        });
    };
    /**
     * 仓库查询
     */
    $scope.warehouseSearch = function () {
        $scope.FrmInfo = {
            title: "仓库查询",
            thead: [{
                name: "仓库名称",
                code: "warehouse_code"
            },  {
                name: "仓库编码",
                code: "warehouse_name"
            }],
            classid: "warehouse",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            ignorecase: "true", //忽略大小写
            postdata: {
                sqlwhere: " asset_property=1  and Warehouse_property in (1,3) and Warehouse_type=1  "
            },
            searchlist: ["warehouse_code","warehouse_name"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.warehouse_pid = result.warehouse_pid;
            $scope.data.currItem.warehouse_code = result.warehouse_code;
            $scope.data.currItem.warehouse_name = result.warehouse_name;
        });
    };
    /**
     * 客户地址查询
     */
    $scope.customerOrgSearch = function () {
        //必须先选客户
        if($scope.data.currItem.customer_id == undefined){
            BasemanService.swalWarning("提示", "请先选择客户！");
            return;
        }
        $scope.FrmInfo = {
            title: "客户查询",
            thead: [{
                name: "地址",
                code: "address"
            }, {
                name: "客户名称",
                code: "customer_name"
            },  {
                name: "客户编码",
                code: "customer_code"
            }],
            classid: "customer_org",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            ignorecase: "true", //忽略大小写
            postdata: {
                search_flag:1,
                customer_id:$scope.data.currItem.customer_id
            },
            searchlist: ["address","customer_name","customer_code"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.address1 = result.address;
        });
    };
    //-------------通用查询---------------

    /**
     * 查询主表数据
     */
    $scope.searchData = function (postdata) {
        if (!postdata) {
            $scope.oldPage = 1;
            $scope.currentPage = 1;
            if (!$scope.pageSize) {
                $scope.pageSize = "20";
            }
            $scope.totalCount = 1;
            $scope.pages = 1;
            postdata = {
                pagination: "pn=1,ps=20,pc=0,cn=0,ci=0"
            }
        }
        //postdata.billtypecode = "0204";
        //postdata.attribute4 = 0;
        BasemanService.RequestPost("inv_out_bill_head", "search", postdata)
            .then(function (data) {
                $scope.data.currItem = data;
                loadGridData($scope.headerGridView, data.inv_out_bill_heads);
                BaseService.pageInfoOp($scope, data.pagination);
        });
    }

    /**
     * 条件查询
     */
    $scope.searchBySql = function () {
        $scope.FrmInfo = {
            title: "",
            thead: [],
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "inv_out_bill_head",
            ignorecase: "true", //忽略大小写
            postdata: {},
            is_high: true
        };
        $.each($scope.headerColumns, function (i, item) {
            if (item.type) {
                $scope.FrmInfo.thead.push({
                    name: item.name,
                    code: item.field,
                    type: item.type,
                    dicts: item.options
                })
            }
        })
        var obj = $scope.FrmInfo;
        var str = JSON.stringify(obj);
        sessionStorage.setItem("frmInfo",str);
        BasemanService.open(CommonPopController1, $scope).result.then(function (result) {
            $scope.oldPage = 1;
            $scope.currentPage = 1;
            if (!$scope.pageSize) {
                $scope.pageSize = "20";
            }
            $scope.totalCount = 1;
            $scope.pages = 1;
            var postdata = {
                pagination: "pn=1,ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0",
                sqlwhere: result,                                                          //result为返回的sql语句
            }
            $scope.sqlwhere = result;
            $scope.searchData(postdata)
        })
    }

    /**
     * 加载网格数据
     */
    function loadGridData(gridView, datas) {
        gridView.setData([]);
        var index = $scope.pageSize*($scope.currentPage-1);
        //加序号
        if (datas.length > 0) {
            for (var i = 0; i < datas.length; i++) {
                datas[i].id = index + i + 1;
            }
        }
        //设置数据
        gridView.setData(datas);
        gridView.render();
    }

    //获取用户登录信息
    var role = window.userbean.stringofrole.indexOf("order_clerk"); //用户角色为‘订单员’


    /**
     * 查看详细
     */
    $scope.detail = function (args) {
        //判断角色为‘订单员’才可见仓库信息
        if(role != -1){
            $scope.lineColumns.splice(5, 0, warehouse_code, warehouse_name);
            $scope.lineGridView.setColumns($scope.lineColumns);
        }

        var postdata = {};
        $scope.data.currItem = args.grid.getDataItem(args.row);
        postdata = {
            "inv_out_bill_head_id" : $scope.data.currItem.inv_out_bill_head_id,
            "billtypecode" :"0204"
        }

        BasemanService.RequestPost("inv_out_bill_head", "select", postdata)
            .then(function (data) {
                $scope.data.currItem = data;
                loadGridData($scope.lineGridView, data.inv_out_bill_lineofinv_out_bill_heads);
                $("#detailModal").modal();
            });

    }

    /**
     * 新增销售出库单（供测试）
     */
    $scope.add = function () {
        var postdata = {};
        $scope.data.currItem = {
            "date_invbill" : new Date().Format("yyyy-MM-dd"),
            "stat" :1
        };
        $scope.lineGridView.setData([]);
        $scope.lineGridView.render();
        $("#detailModal").modal();


    }

    //网格高度自适应 , 控制器后面调用：
    BasemanService.initGird();

    //初始化分页
    BaseService.pageGridInit($scope);

    //网格可复制
    BasemanService.ReadonlyGrid($scope.lineGridView);
    BasemanService.ReadonlyGrid($scope.headerGridView);
}
//注册控制器
angular.module('inspinia')
    .controller('ctrl_inv_out_bill_head', inv_out_bill_head);