/**
 * 月度提货计划
 * 2018年5月10日 by mjl
 */
function drp_custforecast_mth_header($scope, $location, $rootScope, $modal, $timeout, BasemanService, BaseService, notify, $state, localeStorageService, FormValidatorService) {
    $scope.data = {};
    $scope.data.currItem = {};
    //设置标题
    $scope.headername = "月度提货计划";

    //添加按钮
    var editHeaderButtons = function (row, cell, value, columnDef, dataContext) {
        return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>查看</button>" +
            "<button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
    };

    $scope.yeorno = [
        {id: 1, name: "否"},
        {id: 2, name: "是"}
    ];
    //价格类型  1 正常发货价格;2 促销价;3销售订单价 ;4工程特价
    $scope.price_classs = [
        {value: 1, desc: "正常发货价格"},
        {value: 2, desc: "促销价"},
        {value: 3, desc: "销售订单价"},
        {value: 4, desc: "工程特价"}
    ];
    //产品线
    $scope.entorgids = [];
    //词汇表单据状态取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "entorgid"})
        .then(function (data) {
            HczyCommon.stringPropToNum(data.dicts);
            $scope.entorgids = data.dicts;
        });

    //品类
    $scope.entids = [];
    //词汇表单据状态取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "crm_entid"})
        .then(function (data) {
            HczyCommon.stringPropToNum(data.dicts);
            $scope.entids = data.dicts;
        });

    //词汇表单据状态
    $scope.billStats =[]
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            HczyCommon.stringPropToNum(data.dicts);
            $scope.billStats = data.dicts;
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
        return false
    }

    //作废
    $scope.is_cancellations = [
        {id: 1, name: "否"},
        {id: 2, name: "是"}
    ];

    //网格设置
    $scope.headerOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false
        //onClick:dgOnClick
    };
    //定义网格字段
    $scope.headerColumns = [
        {   id: "seq",
            name: "序号",
            field: "seq",
            width: 45,
        },
        {
            name: "操作",
            width: 82,
            formatter: editHeaderButtons
        },
        {
            id: "stat",
            name: "流程状态",
            field: "stat",
            width: 75,
            options: $scope.billStats,
            formatter: Slick.Formatters.SelectOption
        },
        {
            id: "cforecast_no",
            name: "提货计划单",
            field: "cforecast_no",
            width: 150,
        },
        {
            id: "cforecast_name",
            name: "提货计划名称",
            field: "cforecast_name",
            width: 150,
        },
        {
            id: "entid",
            name: "品类",
            field: "entid",
            width: 80,
            options:$scope.entids,
            formatter: Slick.Formatters.SelectOption
        },
        {
            id: "entorgid",
            name: "产品线",
            field: "entorgid",
            width: 80,
            options:$scope.entorgids,
            formatter: Slick.Formatters.SelectOption
        },
        {
            id: "entid",
            name: "经营单位",
            field: "entid",
            width: 80
        },
        {
            id: "cyear",
            name: "年度",
            field: "cyear",
            width: 80
        },
        {
            id: "cmonth",
            name: "月度",
            field: "cmonth",
            width: 80
        },
        {
            id: "thismth_qty",
            name: "本月预计销量",
            field: "thismth_qty",
            width: 110
        },
        {
            id: "thismth_amt",
            name: "本月预计销售总额",
            field: "thismth_amt",
            width: 125
        },
        {
            id: "is_import_crm",
            name: "执行状态",
            field: "is_import_crm",
            options: [
                {value: 1, desc: '否'},
                {value: 2, desc: '是'},
            ],
            formatter: Slick.Formatters.SelectOption
        },
        {
            id: "creator",
            name: "制单人",
            field: "creator",
            width: 80
        },
        {
            id: "create_time",
            name: "制单时间",
            field: "create_time",
            width: 80
        },
        {
            id: "creator",
            name: "审核人",
            field: "checkor",
            width: 80
        },
        {
            id: "check_time",
            name: "审核时间",
            field: "check_time",
            width: 110,
            formatter: Slick.Formatters.Date
        },
        {
            id: "note",
            name: "备注",
            field: "note",
            width: 200,
        }
    ];

    //网格初始化
    $scope.headerGridView = new Slick.Grid("#headerGrid", [], $scope.headerColumns, $scope.headerOptions);

    //主表清单绑定点击事件
    $scope.headerGridView.onClick.subscribe(dgOnClick);
    //双击事件
    $scope.headerGridView.onDblClick.subscribe(function(e,args){$scope.viewDetail(args)});

    /**
     * 事件判断
     */
    function dgOnClick(e, args) {
        if ($(e.target).hasClass("viewbtn")) {
            $scope.viewDetail(args);
            e.stopImmediatePropagation();
        }
        //点击删除按钮处理事件
        else if ($(e.target).hasClass("delbtn")) {
            del(args);
            e.stopImmediatePropagation();
        }
    };

    /**
     * 查询
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
        postdata.search_flag = 4 ;
        //postdata.sqlwhere = "price_class = 4 "
        BasemanService.RequestPost("drp_custforecast_mth_header", "search", postdata).then(function (data) {
            BaseService.pageInfoOp($scope, data.pagination);
            HczyCommon.stringPropToNum(data.drp_custforecast_mth_headers);
            setGridData($scope.headerGridView, data.drp_custforecast_mth_headers);
            //重绘网格
            $scope.headerGridView.render();
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
    function setGridData(gridView, datas) {
        gridView.setData([]);
        var index = $scope.pageSize*($scope.currentPage-1);
        //加序号
        if (datas.length > 0) {
            for (var i = 0; i < datas.length; i++) {
                datas[i].seq = index + i + 1;
            }
        }
        //设置数据
        gridView.setData(datas);
        //重绘网格
        gridView.render();
    }

    /**
     * 详情
     * @param args
     */
    $scope.viewDetail = function (args) {
        BasemanService.openModal({"style":{width:1050,height:600},"url": "/index.jsp#/saleman/drp_custforecast_mth_bill/" + args.grid.getDataItem(args.row).cforecast_id,
            "title":$scope.headername,"obj":$scope,"action":"update",ondestroy: $scope.refresh});
    };

    /**
     * 添加
     * @param args
     */
    $scope.add = function (args) {
        $scope.data.currItem.stat = 1;
        $scope.data.currItem.is_cancellation = 1;
        $scope.data.currItem.stat = 1;
        BasemanService.openModal({"style":{width:1050,height:600},"url": "/index.jsp#/saleman/drp_custforecast_mth_bill/0","title":$scope.headername,
            "obj":$scope,"action":"insert",ondestroy: $scope.refresh});
    };


    /**
     * 删除
     */
    function del(args){
        var dg = $scope.headerGridView;
        var rowidx = args.row;
        var postData = {};
        postData.item_org_id = args.grid.getDataItem(args.row).item_org_id;
        var item_name = args.grid.getDataItem(args.row).item_name;
        if(confirm("确定要删除"+item_name+" 吗？")){
            //删除数据成功后再删除网格数据
            BasemanService.RequestPost("item_og", "delete", JSON.stringify(postData))
                .then(function (data) {
                    dg.getData().splice(rowidx, 1);
                    dg.invalidateAllRows();
                    dg.render();
                    BasemanService.notice("删除成功！", "alert-success");//warning
                });
        }
    };


    //网格高度自适应 , 控制器后面调用：
    BasemanService.initGird();

    //初始化分页
    BaseService.pageGridInit($scope);
}
//注册控制器
angular.module('inspinia')
    .controller('drp_custforecast_mth_header', drp_custforecast_mth_header)