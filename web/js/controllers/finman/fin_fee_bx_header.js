/**
 * 这是费用报销界面js
 * 创建时间：2018-1-27
 * */
function fin_fee_bx_header($scope, BaseService, $filter, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    $scope.data = {"objtypeid": 1238};
    $scope.data.currItem = {"objattachs": []};
    var activeRow = [];
    $scope.data.applyCurrItem = {};
    $scope.data.addCurrItem = {};
    var isEdit = 0;
    var lineData = [];

    //获取路由名称
    var routeName = $state.current.name;
    $scope.routeFlag = 1;  //路由标志：1 费控系统 2 工程费用报销 3 门店装修核销 4 广告投放核销 5 推广活动核销
    //工程费用申请模块
    if(routeName == 'saleman.proj_fee_bx_header'){
        $scope.routeFlag = 2;
    }
    //门店装修申请
    if(routeName == 'mktman.decorate_fee_bx_header'){
        $scope.routeFlag = 3;
    }
    //广告投放申请
    if(routeName == 'mktman.advert_fee_bx_header'){
        $scope.routeFlag = 4;
    }
    //推广活动申请
    if(routeName == 'mktman.extend_fee_bx_header'){
        $scope.routeFlag = 5;
    }

    //详情页面url
    var url;
    if($scope.routeFlag == 1){
        url = "/index.jsp#/crmman/finfeebx/"
    }
    if($scope.routeFlag == 2){
        url = "/index.jsp#/saleman/projfeebx/"
    }
    if($scope.routeFlag == 3){
        url = "/index.jsp#/mktman/decoratefeebx/"
    }
    if($scope.routeFlag == 4){
        url = "/index.jsp#/mktman/advertfeebx/"
    }
    if($scope.routeFlag == 5){
        url = "/index.jsp#/mktman/extendfeebx/"
    }

    $scope.months = [
        {id: 1, name: "1月"},
        {id: 2, name: "2月"},
        {id: 3, name: "3月"},
        {id: 4, name: "4月"},
        {id: 5, name: "5月"},
        {id: 6, name: "6月"},
        {id: 7, name: "7月"},
        {id: 8, name: "8月"},
        {id: 9, name: "9月"},
        {id: 10, name: "10月"},
        {id: 11, name: "11月"},
        {id: 12, name: "12月"}
    ]


    $scope.useObjTypes = [];
    //词汇表往来对象取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "ac_object_type"})
        .then(function (data) {
            $scope.useObjTypes = data.dicts;
            var useObjTypes = [];
            for (var i = 0; i < data.dicts.length; i++) {
                useObjTypes[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
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
            if ($scope.getIndexByField('headerColumns', 'stat')) {
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
    }

    // 添加按钮
    var editHeaderButtons = function (row, cell, value, columnDef, dataContext) {
        return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>查看</button> " +
            " <button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
    };


    //主表网格设置
    $scope.headerOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false
    };

    //主表网格列属性
    var projCode = {
        name: "工程项目编码",
        id: "project_code",
        field: "project_code",
        width: 140,
        type:"string"
    }
    var projName = {
        name: "工程项目名称",
        id: "project_name",
        field: "project_name",
        width: 170,
        type:"string"
    }
    var saleCenter = {
        name: "销售渠道",
        id: "sale_center",
        field: "sale_center",
        width: 100,
        type:"string"
    };

    $scope.headerColumns = [
        {
            name: "序号",
            id: "id",
            field: "id",
            width: 45,
        }, {
            name: "操作",
            width: 100,
            formatter: editHeaderButtons
        }, {
            name: "单据状态",
            id: "stat",
            field: "stat",
            width: 70,
            options: [],
            formatter: Slick.Formatters.SelectOption,
            type:"list"
        }, {
            name: "报销单号",
            id: "bx_no",
            field: "bx_no",
            width: 130,
            type:"string"
        }, {
            name: "费用申请单号",
            id: "fee_apply_no",
            field: "fee_apply_no",
            width: 150,
            type:"string"
        }, {
            name: "年度",
            id: "cyear",
            field: "cyear",
            width: 60,
            type:"string"
        }, {
            name: "月度",
            id: "cmonth",
            field: "cmonth",
            width: 60,
            type:"string"
        },{
            name: "报销部门编码",
            id: "org_code",
            field: "org_code",
            width: 100,
            type:"string"
        }, {
            name: "报销部门名称",
            id: "org_name",
            field: "org_name",
            width: 140,
            type:"string"
        }, {
            name: "报销人",
            id: "chap_name",
            field: "chap_name",
            width: 120,
            type:"string"
        }, {
            name: "申请总额",
            id: "total_apply_amt",
            field: "total_apply_amt",
            width: 80,
            type:"string",
            formatter: Slick.Formatters.Money,
            cssClass:"amt"
        }, {
            name: "批准总额",
            id: "total_allow_amt",
            field: "total_allow_amt",
            width: 80,
            type:"string",
            formatter: Slick.Formatters.Money,
            cssClass:"amt"
        }, {
            name: "预算类别编码",
            id: "bud_type_code",
            field: "bud_type_code",
            width: 100,
            type:"string"
        }, {
            name: "预算类别名称",
            id: "bud_type_name",
            field: "bud_type_name",
            width: 100,
            type:"string"
        }, {
            name: "用途",
            id: "purpose",
            field: "purpose",
            width: 250,
            type:"string"
        },/* {
            name: "费用转返利",
            id: "is_feeToZK",
            field: "is_feeToZK",
            options: [
                {value: 1, desc: "否"},
                {value: 2, desc: "是"}
            ],
            formatter: Slick.Formatters.SelectOption,
            width: 110,
            type:"list"
        },*/ {
            name: "制单人",
            id: "creator",
            field: "creator",
            width: 80,
            type:"string"
        }, {
            name: "制单时间",
            id: "create_time",
            field: "create_time",
            width: 180,
            type:"date"
        }, {
            name: "已生成凭证",
            id: "is_credence",
            field: "is_credence",
            width: 100,
            options: [
                {value: 1, desc: "否"},
                {value: 2, desc: "是"}
            ],
            formatter: Slick.Formatters.SelectOption,
            type:"list"
        }, {
            name: "凭证号",
            id: "credence_no",
            field: "credence_no",
            width: 150,
            type:"string"
        }, {
            name: "支付状态",
            id: "is_payed",
            field: "is_payed",
            width: 90,
            options: [
                {value: 1, desc: "未支付"},
                {value: 2, desc: "已支付"}
            ],
            formatter: Slick.Formatters.SelectOption,
            type:"list"
        },
    ];

    //初始化网格
    $scope.headerGridView = new Slick.Grid("#headerViewGrid", [], $scope.headerColumns, $scope.headerOptions);

    /**
     * 主表网格点击事件
     * @param e
     * @param args
     */
    function dgOnClick(e, args) {
        activeRow = args.grid.getDataItem(args.row);
        if (activeRow && activeRow.stat != 98) {
            $scope.isUnchecked = true;
        } else {
            $scope.isUnchecked = false;
        }
        if ($(e.target).hasClass("viewbtn")) {
            isEdit = 3;
            $scope.viewDetail(args);
            e.stopImmediatePropagation();
        }
        //点击删除按钮处理事件
        else if ($(e.target).hasClass("delbtn")) {
            var dg = $scope.headerGridView;
            var rowidx = args.row;
            var postData = {};
            postData.bx_id = args.grid.getDataItem(args.row).bx_id;
            var bxNo = args.grid.getDataItem(args.row).bx_no;
            var state = args.grid.getDataItem(args.row).stat;
            if (state != 1 && state != 0) {
                BasemanService.swalWarning("提示", "当前单据状态不是“制单”状态，不能删除！");
                return;
            }
            BasemanService.swalDelete("删除", "确定要删除单号为 " + bxNo + " 的费用报销单吗？", function (bool) {
                if (bool) {
                    //删除数据成功后再删除网格数据
                    BasemanService.RequestPost("fin_fee_bx_header", "delete", JSON.stringify(postData))
                        .then(function (data) {
                            dg.getData().splice(rowidx, 1);
                            dg.invalidateAllRows();
                            dg.render();
                            $scope.refreshGridView();
                        });
                } else {
                    return;
                }
            });
            e.stopImmediatePropagation();
        }
    };

    function dgOnDblClick(e, args) {
        $scope.viewDetail(args);
    }


    //主表绑定点击事件
    $scope.headerGridView.onClick.subscribe(dgOnClick);
    $scope.headerGridView.onDblClick.subscribe(dgOnDblClick);



    /**
     * 增加费用报销单
     */
    $scope.addFeeBx = function () {
        BasemanService.openModal({
            url: url + "0",
            title: "费用报销",
            obj: $scope,
            ondestroy: $scope.refreshGridView
        });
        isEdit = 0;
    }

    /**
     * 查询后台数据
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
        if($scope.routeFlag == 2){
            $scope.headerColumns.splice(7, 0, projCode,projName,saleCenter);
            $scope.headerGridView.setColumns($scope.headerColumns);
        }
        BasemanService.RequestPost("fin_fee_bx_header", "search", postdata)
            .then(function (data) {
                $scope.data.currItem = data;
                //清空网格
                $scope.headerGridView.setData([]);
                //设置数据
                for (var i = 0; i < $scope.data.currItem.fin_fee_bx_headers.length; i++) {
                    $scope.data.currItem.fin_fee_bx_headers[i].id = i + 1;
                }

                $scope.headerGridView.setData($scope.data.currItem.fin_fee_bx_headers);
                //重绘网格
                $scope.headerGridView.render();
                BaseService.pageInfoOp($scope, data.pagination);
            });
    }

    /**
     * 查询详情
     * @param args
     */
    $scope.viewDetail = function (args) {
        BasemanService.openModal({
            url: url + args.grid.getDataItem(args.row).bx_id,
            title: "费用报销",
            obj: $scope,
            ondestroy: $scope.refreshGridView
        });
    };

    //模态框取消事件
    $scope.hideModal = function () {
        $("#addLineModal").modal("hide");
        isEdit = 0;
    }
    $('#addLineModal').on('hide.bs.modal', function () {
        isEdit = 0;
    });

    //网格自适应高度
    BasemanService.initGird();
    //初始化分页
    BaseService.pageGridInit($scope);

    /**
     * 页面刷新
     */
    $scope.refreshGridView = function () {
        $scope.searchData();
    }

    /**
     * 高级查询
     */
    $scope.searchBySql = function () {
        $scope.FrmInfo = {
            title: "",
            thead: [],
            url: "/jsp/authman.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "fin_fee_bx_header",
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
}

//注册控制器
angular.module('inspinia')
    .controller('ctrl_fin_fee_bx_header', fin_fee_bx_header);