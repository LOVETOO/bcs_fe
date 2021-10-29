/**
 * 这是费用申请结案界面js
 * 创建时间：2018-2-5
 * */
function fin_fee_apply_header_over($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService, BaseService) {

    //设置标题
    $scope.headername = "费用申请结案";

    $scope.data = {};
    $scope.data.currItem = {};
    var currGrid = "";

    //使用对象类型 1 个人 2 客户 3 供应商 4 往来对象 5 门店 6 区域 9 其它
    $scope.useObjTypes = [];
    //词汇表往来对象取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "ac_object_type"})
        .then(function (data) {
            $scope.useObjTypes = data.dicts;
            //HczyCommon.stringPropToNum(data.dicts);
            var useObjTypes = [];
            for (var i = 0; i < data.dicts.length; i++) {
                useObjTypes[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('lineColumns', 'useobject_type')) {
                $scope.lineColumns[$scope.getIndexByField('lineColumns', 'useobject_type')].options = useObjTypes;
                $scope.lineGridView.setColumns($scope.lineColumns);
            }
        });

    //词汇表销售渠道取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "order_sale_center"})
        .then(function (data) {
            $scope.sale_center = data.dicts;
        });

    $scope.billStats = [];
    //词汇表单据状态取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            $scope.billStats = data.dicts;
            HczyCommon.stringPropToNum(data.dicts);
            var billStats = [];
            for (var i = 0; i < data.dicts.length; i++) {
                billStats[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            //修改bug:当排序为第一个(0)时不会执行
            if ($scope.getIndexByField('headerColumns', 'stat') !== false) {
                $scope.headerColumns[$scope.getIndexByField('headerColumns', 'stat')].options = billStats;
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
    };

    //主表网格设置
    $scope.headerOptions = {
        editable: true,
        enableAddRow: false,
        enableCellNavigation: true,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false
    };
    //明细表网格设置
    $scope.lineOptions = {
        editable: true,
        enableAddRow: false,
        enableCellNavigation: true,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false
    };

    //主表网格列属性
    $scope.headerColumns = [
        {
            name: "单据状态",
            id: "stat",
            field: "stat",
            width: 70,
            options: [],
            formatter: Slick.Formatters.SelectOption,
        }, {
            name: "费用申请单号",
            id: "fee_apply_no",
            field: "fee_apply_no",
            width: 140,
        }, {
            name: "年度",
            id: "cyear",
            field: "cyear",
            width: 50,
        }, {
            name: "月度",
            id: "cmonth",
            field: "cmonth",
            width: 45,
        }, {
            name: "申请部门编码",
            id: "org_code",
            field: "org_code",
            width: 95,
        }, {
            name: "申请部门名称",
            id: "org_name",
            field: "org_name",
            width: 130,
            cellEditor: "文本框"
        }, {
            name: "报销人",
            id: "chap_name",
            field: "chap_name",
            width: 100,
            cellEditor: "文本框"
        }, {
            name: "申请总额",
            id: "total_apply_amt",
            field: "total_apply_amt",
            width: 130,
            cssClass:"amt",
            formatter: Slick.Formatters.Money,
        }, {
            name: "批准总额",
            id: "total_allow_amt",
            field: "total_allow_amt",
            width: 130,
            cssClass:"amt",
            formatter: Slick.Formatters.Money,
        }, {
            name: "预算类别编码",
            id: "bud_type_code",
            field: "bud_type_code",
            width: 95,
        }, {
            name: "预算类别名称",
            id: "bud_type_name",
            field: "bud_type_name",
            width: 100,
        }, {
            name: "用途",
            id: "purpose",
            field: "purpose",
            width: 120,
        }, {
            name: "制单人",
            id: "creator",
            field: "creator",
            width: 100,
        }, {
            name: "制单时间",
            id: "create_time",
            field: "create_time",
            width: 150,
        }, {
            name: "备注",
            id: "note",
            field: "note",
            width: 200,
        }
    ];
    //明细表网格列属性
    $scope.lineColumns = [
        {
            name: "费用项目编码",
            id: "fee_code",
            field: "fee_code",
            width: 100
        }, {
            name: "费用项目名称",
            id: "fee_name",
            field: "fee_name",
            width: 100
        }, {
            name: "申请金额",
            id: "apply_amt",
            field: "apply_amt",
            width: 130,
            cssClass:"amt",
            formatter: Slick.Formatters.Money,
        }, {
            name: "批准金额",
            id: "allow_amt",
            field: "allow_amt",
            width: 130,
            cssClass:"amt",
            formatter: Slick.Formatters.Money,
        }, /*{
            name: "已申请报销金额",
            id: "applied_bx_amt",
            field: "applied_bx_amt",
            width: 130,
            cssClass:"amt",
            formatter: Slick.Formatters.Money,
        }, */{
            name: "已报销金额",
            id: "finish_bx_amt",
            field: "finish_bx_amt",
            width: 130,
            cssClass:"amt",
            formatter: Slick.Formatters.Money,
        }, /*{
            name: "可用预算",
            id: "canuse_amt",
            field: "canuse_amt",
            width: 130,
            cssClass:"amt",
            formatter: Slick.Formatters.Money,
        }, */{
            name: "费用承担部门编码",
            id: "fee_org_code",
            field: "fee_org_code",
            width: 125
        }, {
            name: "费用承担部门",
            id: "fee_org_name",
            field: "fee_org_name",
            width: 130
        }, {
            name: "会计科目编码",
            id: "subject_no",
            field: "subject_no",
            width: 100
        }, {
            name: "会计科目名称",
            id: "subject_name",
            field: "subject_name",
            width: 100
        }, {
            name: "会计科目描述",
            id: "subject_desc",
            field: "subject_desc",
            width: 100
        }, {
            name: "使用对象类型",
            id: "useobject_type",
            field: "useobject_type",
            width: 100,
            options: [],
            formatter: Slick.Formatters.SelectOption
        }, {
            name: "使用对象编码",
            id: "useobject_code",
            field: "useobject_code",
            width: 100
        }, {
            name: "使用对象名称",
            id: "useobject_name",
            field: "useobject_name",
            width: 100
        }, {
            name: "备注",
            id: "note",
            field: "note",
            width: 130
        }
    ];

    //初始化网格
    $scope.headerGridView = new Slick.Grid("#viewGrid", [], $scope.headerColumns, $scope.headerOptions);
    $scope.lineGridView = new Slick.Grid("#lineGrid", [], $scope.lineColumns, $scope.lineOptions);

    /**
     * 主表网格点击事件
     * @param e
     * @param args
     */
    function dgOnDblClick(e, args) {
        currGrid = args.grid.getDataItem(args.row);
        $scope.viewDetail(args);
    }

    //主表绑定点击事件
    $scope.headerGridView.onDblClick.subscribe(dgOnDblClick);


    /***
     * 初始查询 分页
     */
    $scope.searchData = function (postdata) {
        if (!postdata) {
            postdata = {
                pagination: "pn=1,ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0",
                flag: 2
            };
        } else {
            postdata.flag = 2
        }
        BasemanService.RequestPost("fin_fee_apply_header", "search", postdata)
            .then(function (result) {
                //清空网格
                $scope.headerGridView.setData([]);
                //设置数据
                $scope.headerGridView.setData(result.fin_fee_apply_headers);
                //重绘网格
                $scope.headerGridView.render();

                BaseService.pageInfoOp($scope, result.pagination);
            });
    };


    /**
     * 查询详情
     */
    $scope.viewDetail = function (args) {
        var postData = {};
        postData.fee_apply_id = args.grid.getDataItem(args.row).fee_apply_id;
        //调用后台select方法查询详情
        BasemanService.RequestPost("fin_fee_apply_header", "select", JSON.stringify(postData))
            .then(function (data) {
                $scope.data.currItem = data;
                $scope.lineGridView.setData([]);
                if (data.fin_fee_apply_lineoffin_fee_apply_headers) {
                    $scope.lineGridView.setData(data.fin_fee_apply_lineoffin_fee_apply_headers);
                }
                $scope.lineGridView.render();
                //显示模态页面
                $("#detailModal").modal();
                $scope.$apply();
            });
    };

    /***
     * 结案
     */
    $scope.over = function () {
        if (currGrid == "") {
            BasemanService.swalError("提示", "请先选择单据");
            return;
        }

        if ($scope.data.currItem.settle_reason == "") {
            BasemanService.swalError("提示", "请输入结案原因");
            return;
        } else {
            settle();
        }
    };

    function settle() {
        //bud_id空
        BasemanService.RequestPost("fin_fee_apply_header", "settle", JSON.stringify(currGrid))
            .then(function (data) {
                if (typeof(data) == "object") {
                    BasemanService.swalSuccess("成功", "结案成功");
                    $("#detailModal").modal("hide");
                    $scope.searchData();
                }
            });
    }




    //初始化后调用doSearch()方法
    // $scope.doSearch();
    // ng-init="doSearch()"

    BasemanService.initGird();

    BaseService.pageGridInit($scope);
}

//注册控制器
angular.module("inspinia")
    .controller("ctrl_fin_fee_apply_header_over", fin_fee_apply_header_over);