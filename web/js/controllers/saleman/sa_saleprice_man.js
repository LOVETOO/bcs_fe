/**
 * 销售价格关闭/打开
 */
function sa_saleprice_man($scope, $location, $rootScope, $modal, $timeout, BasemanService, BaseService, notify, $state, localeStorageService, FormValidatorService) {
    $scope.data = {"objtypeid": 1206};
    $scope.data.currItem = {};
    $scope.sqlwhere = "";
    //初始化数据
    $scope.IsCancellation = [];//价格状态
    $scope.CrmEntId =[];//品类
    $scope.EntOrgOd = [];//产品线

    //网格设置(双表头）
    $scope.headerOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        createPreHeaderPanel: true,
        showPreHeaderPanel: true,
        explicitInitialization: true
    };
    //定义网格字段
    $scope.headerColumns = [
        {   id: "id",
            name: "序号",
            field: "id",
            width: 45
        }, {
            id: "saleorder_no",
            name: "单号",
            field: "saleorder_no",
            width: 120,
            type:"string"
        }, {
            id: "is_cancellation",
            name: "已作废",
            field: "is_cancellation",
            width: 80,
            formatter: Slick.Formatters.SelectOption,
            options: [{value:"0",desc:"所有品类"}],
            type:"list"
        // {value: "1", desc: '否'},
        // {value: "2", desc: '是'}
        }, {
            id: "customer_code",
            name: "编码",
            field: "customer_code",
            width: 120,
            columnGroup:"客户",
            type:"string"
        },{
            id: "customer_name",
            name: "名称",
            field: "customer_name",
            width: 200,
            columnGroup:"客户",
            type:"string"
        }, {
            id: "item_code",
            name: "编码",
            field: "item_code",
            width: 120,
            columnGroup:"产品",
            type:"string"
        }, {
            id: "item_name",
            name: "名称",
            field: "item_name",
            width: 200,
            columnGroup:"产品",
            type:"string"
        },/*{
            id: "crm_entid",
            name: "品类",
            field: "crm_entid",
            width: 100,
            formatter: Slick.Formatters.SelectOption,
            options: [{value:0,desc:'所有品类'}],
            type:"list"
        }, {
            id: "entorgid",
            name: "产品线",
            field: "entorgid",
            width: 100,
            formatter: Slick.Formatters.SelectOption,
            options: [],
            type:"list"
        }*/  {
            id: "uom_name",
            name: "单位",
            field: "uom_name",
            width: 60,
            // type:"string"
        },  {
            id: "start_date",
            name: "生效日期",
            field: "start_date",
            width: 110,
            formatter: Slick.Formatters.Date,
            type:"date"
        },  {
            id: "end_date",
            name: "失效日期",
            field: "end_date",
            width: 110,
            formatter: Slick.Formatters.Date,
            type:"date"
        },  {
            id: "price_bill",
            name: "开单价/合同价",
            field: "price_bill",
            width: 130,
            formatter: Slick.Formatters.Money,
            type:"number",
            cssClass: "amt"
        },  {
            id: "inside_balance_price",
            name: "开单底价/结算价",
            field: "inside_balance_price",
            width: 130,
            formatter: Slick.Formatters.Money,
            type:"number",
            cssClass: "amt"
        },  {
            id: "saleprice_type_code",
            name: "价格类型编码",
            field: "saleprice_type_code",
            width: 120,
            type:"string"
        },  {
            id: "saleprice_type_name",
            name: "价格类型名称",
            field: "saleprice_type_name",
            width: 120,
            type:"string"
        },  {
            id: "remark",
            name: "备注",
            field: "remark",
            width: 200,
            type:"string"
        }/*, {
            name: "操作",
            width: 80,
            formatter: editHeaderButtons
        }*/
    ];

    //网格初始化
    $scope.dataView = new Slick.Data.DataView();
    //网格加复选框
    var checkboxSelector = new Slick.CheckboxSelectColumn({
        cssClass: "slick-cell-checkboxsel"
    });
    $scope.headerColumns.unshift(checkboxSelector.getColumnDefinition());
    $scope.headerGridView = new Slick.Grid("#headerGridView", $scope.dataView, $scope.headerColumns, $scope.headerOptions);
    $scope.headerGridView.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
    $scope.headerGridView.registerPlugin(checkboxSelector);


    /**
     * 取词汇值方法
     */
    function searchdicts(dictname, field, grid, gridcolumns, columnname) {
        var dictdata = [];
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: dictname})
            .then(function (data) {
                var dicts = [];
                var gridnames = [];
                for (var i = 0; i < data.dicts.length; i++) {
                    if(data.dicts[i].dictname == "已关闭"){
                        gridnames[i] = "是";
                    }
                    if(data.dicts[i].dictname == "已打开"){
                        gridnames[i] = "否";
                    }
                    dicts[i] = {
                        value: parseInt(data.dicts[i].dictvalue),
                        desc: data.dicts[i].dictname,
                        id: parseInt(data.dicts[i].dictvalue),
                        name: data.dicts[i].dictname
                    };
                    if(dictname == "is_cancellation") {
                        dicts[i] = {
                            value: parseInt(data.dicts[i].dictvalue),
                            desc: gridnames[i],
                            id: parseInt(data.dicts[i].dictvalue),
                            name: data.dicts[i].dictname
                        }
                    }
                    dictdata.push(dicts[i]);
                }
                if ($scope.getIndexByField(columnname, field)) {
                    gridcolumns[$scope.getIndexByField(columnname, field)].options = dicts;
                    grid.setColumns(gridcolumns);
                }
            });
        return dictdata;
    }

    $scope.getIndexByField = function (columns, field) {
        for (var i = 0; i < $scope[columns].length; i++) {
            if ($scope[columns][i].field == field) {
                return i;
                break;
            }
        }
        return false
    }
    //取词汇值
    $scope.IsCancellation = searchdicts("is_cancellation", "is_cancellation",
        $scope.headerGridView, $scope.headerColumns, "headerColumns");
    $scope.CrmEntId = searchdicts("crm_entid", "crm_entid",
        $scope.headerGridView, $scope.headerColumns, "headerColumns");
    $scope.EntOrgId = searchdicts("entorgid", "entorgid",
        $scope.headerGridView, $scope.headerColumns, "headerColumns");

    //-------------通用查询---------------
    /**
     * 销售价格单查询
     */
    $scope.salePriceBillSearch=function () {
        $scope.FrmInfo = {
            title: "销售价格单查询",
            thead: [{
                name: "价格单据号",
                code: "saleorder_no"
            }, {
                name: "客户名称",
                code: "customer_name"
            },  {
                name: "客户编码",
                code: "customer_code"
            },  {
                name: "备注",
                code: "note"
            }],
            classid: "sa_saleprice_head",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            // backdatas: "fin_bud_type_headers",
            ignorecase: "true", //忽略大小写
            postdata: {
                search_flag:3,
                sqlwhere: " 1=1 "
            },
            searchlist: ["saleorder_no","customer_name","customer_code","ssh.note"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.saleorder_no = result.saleorder_no;
            $scope.data.currItem.sa_saleprice_head_id = result.sa_saleprice_head_id;
        });
    };
    /**
     * 组织客户查询
     */
    $scope.customerSearch=function (searchwhere) {
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
            if(searchwhere == 'from'){
                $scope.data.currItem.customer_code_from = result.customer_code;
            }
            if(searchwhere == 'to'){
                $scope.data.currItem.customer_code_to = result.customer_code;
            }

        });
    };

    /**
     * 价格类型查询
     */
    $scope.salePriceTypeSearch=function () {
        $scope.FrmInfo = {
            title: "销售价格类型查询",
            thead: [{
                name: "销售价格类型名称",
                code: "saleprice_type_name"
            }, {
                name: "销售价格类型编码",
                code: "saleprice_type_code"
            }],
            classid: "sa_saleprice_type",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            // backdatas: "fin_bud_type_headers",
            ignorecase: "true", //忽略大小写
            postdata: {
                sqlwhere: " 1=1 "
            },
            searchlist: ["saleprice_type_name","saleprice_type_code"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.saleprice_type_name = result.saleprice_type_name;
            $scope.data.currItem.saleprice_type_code = result.saleprice_type_code;
            $scope.data.currItem.sa_saleprice_type_id = result.sa_saleprice_type_id;
        });
    };
    /**
     * 组织产品查询
     */
    $scope.itemSearch=function (searchwhere) {
        $scope.FrmInfo = {
            title: "组织产品查询",
            thead: [{
                name: "产品名称",
                code: "item_name"
            },  {
                name: "产品编码",
                code: "item_code"
            }],
            classid: "item_org",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            // backdatas: "fin_bud_type_headers",
            ignorecase: "true", //忽略大小写
            postdata: {
                sqlwhere: " 1=1 "
            },
            searchlist: ["item_name","item_code"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.item_name = result.item_name;
            if(searchwhere == 'from'){
                $scope.data.currItem.item_code_from = result.item_code;
            }
            if(searchwhere == 'to'){
                $scope.data.currItem.item_code_to = result.item_code;
            }

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
        postdata.sqlwhere = $scope.sqlwhere;
        BasemanService.RequestPost("sa_saleprice_head", "getpriceinfo", postdata)
            .then(function (data) {
                loadGridData($scope.headerGridView, data.sa_saleprice_lineofsa_saleprice_heads);
                BaseService.pageInfoOp($scope, data.pagination);
        });
    }

    /**
     * 关闭/打开价格
     */
    $scope.cancelNew = function (action) {
        var selectedRow = $scope.headerGridView.getSelectedRows();
        if(selectedRow.length == 0){
            BasemanService.swalWarning("提示", "请选择一条记录！" );
            return;
        };
        var selectedData = {};
        selectedData.sa_saleprice_lineofsa_saleprice_heads = [];
        for(var i = 0; i < selectedRow.length; i++) {
            if(action == 'close') {
                if ($scope.headerGridView.getDataItem(selectedRow[i]).is_cancellation == 2) {
                    BasemanService.swalWarning("提示",
                        "销售价格单" + $scope.headerGridView.getDataItem(selectedRow[i]).saleorder_no + "已关闭！");
                    return;
                }
            }
            if(action == 'open'){
                if ($scope.headerGridView.getDataItem(selectedRow[i]).is_cancellation == 1) {
                    BasemanService.swalWarning("提示",
                        "销售价格单" + $scope.headerGridView.getDataItem(selectedRow[i]).saleorder_no + "已打开！");
                    return;
                }
            }
            selectedData.sa_saleprice_lineofsa_saleprice_heads.push($scope.headerGridView.getDataItem(selectedRow[i]));
        }
        var postdata = {};
        // postdata.search_flag = 1;
        if(action == 'open'){
            postdata.is_cancellation = 1;
        }
        if(action == 'close'){
            postdata.is_cancellation = 2;
        }
        postdata.sa_saleprice_lineofsa_saleprice_heads = selectedData.sa_saleprice_lineofsa_saleprice_heads;
        BasemanService.RequestPost("sa_saleprice_head", "cancelnew", postdata)
            .then(function (data) {
                $scope.searchData();
                BasemanService.swalSuccess("成功", "操作成功！" );
            });
    }

    /**
     * 刷新
     */
    $scope.refresh = function () {
        $scope.searchData();
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
        $scope.headerGridView.setData(datas);
        $scope.headerGridView.render();
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
            backdatas: "sa_saleprice_head",
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
                    dicts: item.options,
                    columnGroup: item.columnGroup//双表头分组
                })
            }
        })
        //双表头分组情况
        for(var i=0;i<$scope.FrmInfo.thead.length;i++){
            if($scope.FrmInfo.thead[i].columnGroup){
                $scope.FrmInfo.thead[i].name = $scope.FrmInfo.thead[i].columnGroup + $scope.FrmInfo.thead[i].name;
            }
        }
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
                sqlwhere: result,  //result为返回的sql语句
                flag:1
            }
            $scope.sqlwhere = result;
            $scope.searchData(postdata)
        })
    }

    //双表头实现方法
    $scope.dataView.onRowCountChanged.subscribe(function (e, args) {
        $scope.headerGridView.updateRowCount();
        $scope.headerGridView.render();
    });
    $scope.dataView.onRowsChanged.subscribe(function (e, args) {
        $scope.headerGridView.invalidateRows(args.rows);
        $scope.headerGridView.render();
    });
    $scope.headerGridView.init();
    $scope.headerGridView.onColumnsResized.subscribe(function (e, args) {
        CreateAddlHeaderRow();
    });

    CreateAddlHeaderRow();
    function CreateAddlHeaderRow() {
        var $preHeaderPanel = $($scope.headerGridView.getPreHeaderPanel())
            .empty()
            .addClass("slick-header-columns")
            .css('left','-1000px')
            .width($scope.headerGridView.getHeadersWidth());
        $preHeaderPanel.parent().addClass("slick-header");
        var headerColumnWidthDiff = $scope.headerGridView.getHeaderColumnWidthDiff();
        var m, header, lastColumnGroup = '', widthTotal = 0;

        for (var i = 0; i < $scope.headerColumns.length; i++) {
            m = $scope.headerColumns[i];
            if (lastColumnGroup === m.columnGroup && i>0) {
                widthTotal += m.width;
                header.css("width",widthTotal - headerColumnWidthDiff)
            } else {
                widthTotal = m.width;
                header = $("<div class='ui-state-default slick-header-column' />")
                    .html("<span class='slick-column-name'>" + (m.columnGroup || '') + "</span>")
                    .css("width",m.width - headerColumnWidthDiff)
                    .appendTo($preHeaderPanel);
            }
            lastColumnGroup = m.columnGroup;
        }
    }

    //网格高度自适应 , 控制器后面调用：
    BasemanService.initGird();
    //网格可复制
    BasemanService.ReadonlyGrid($scope.headerGridView);

    //初始化分页
    BaseService.pageGridInit($scope);
}
//注册控制器
angular.module('inspinia')
    .controller('ctrl_sa_saleprice_man', sa_saleprice_man)