/**这是预算结转界面js*/
function fin_bud_carryover($scope, BaseService, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    $scope.data = {};
    $scope.data.currItem = {};
    $scope.Period_Types = [];
    //词汇表预算期间取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "period_type"})
        .then(function (data) {
            $scope.Period_Types = HczyCommon.stringPropToNum(data.dicts);
            var Period_Types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                Period_Types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname,
                    id: parseInt(data.dicts[i].dictvalue),
                    name: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('headerGridColumns', 'period_type')) {
                $scope.headerGridColumns[$scope.getIndexByField('headerGridColumns', 'period_type')].options = Period_Types;
                $scope.headerGridView.setColumns($scope.headerGridColumns);
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
    //定义网格内按钮
    var editHeaderButtons = function (row, cell, value, columnDef, dataContext) {
        return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>查看</button> "
    };



    //网格设置
    $scope.periodOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        //enableAddRow: true,
        asyncEditorLoading: false,
        autoEdit: true,
        editable: true,
        autoHeight: false
    };
    $scope.lineOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: true,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: false,
        autoHeight:false
    };
    //定义网格字段(浏览）
    $scope.headerGridColumns = [
        {
            name: "操作",
            width: 80,
            formatter: editHeaderButtons
        }, {
            id: "period_year",
            name: "年度",
            field: "period_year",
            width: 120,
            type:"number"
        }, {
            id: "period_type",
            name: "预算期间类别",
            field: "period_type",
            width: 170,
            options: [],
            formatter: Slick.Formatters.SelectOption,
            type:"list"
        }, {
            id: "entname",
            name: "经营单位",
            field: "entname",
            width: 200,
            type:"string"
        },{
            id: "description",
            name: "描述",
            field: "description",
            width: 170,
            type:"string"
        },
    ];
    //定义网格字段（明细）
    $scope.lineColumns = [
        {
            id: "seq",
            name: "序号",
            behavior: "select",
            field: "seq",
            width: 50,
        }, {
            id: "dname",
            name: "期间名称",
            field: "dname",
            width: 150,
        }, {
            id: "start_date",
            name: "开始日期",
            field: "start_date",
            width: 120,
            formatter: Slick.Formatters.Date,
        }, {
            id: "end_date",
            name: "结束日期",
            field: "end_date",
            width: 120,
            formatter: Slick.Formatters.Date,
        }, {
            id: "usable",
            name: "是否结转",
            field: "usable",
            width: 100,
            options: [
                {value: "1", desc: "是"},
                {value: "2", desc: "否"}
            ],
            formatter: Slick.Formatters.SelectOption
        }, {
            id: "settle_user",
            name: "结转人",
            field: "settle_user",
            width: 100,
        }, {
            id: "settle_time",
            name: "结转时间",
            field: "settle_time",
            width: 170,
        }
    ];

    //网格初始化
    $scope.headerGridView = new Slick.Grid("#headerGrid", [], $scope.headerGridColumns, $scope.periodOptions);

    //明细网格
    var checkboxSelector = new Slick.CheckboxSelectColumn({
        cssClass: "slick-cell-checkboxsel"
    });
    $scope.lineColumns.unshift(checkboxSelector.getColumnDefinition());
    $scope.lineGridView = new Slick.Grid("#linegridview", [], $scope.lineColumns, $scope.lineOptions);
    $scope.lineGridView.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
    $scope.lineGridView.registerPlugin(checkboxSelector);

    //网格可复制
    BasemanService.ReadonlyGrid($scope.headerGridView);
    BasemanService.ReadonlyGrid($scope.lineGridView);


    function dgOnClick(e, args) {
        //点击查看
        if ($(e.target).hasClass("viewbtn")) {
            $scope.viewDetail(args);
            e.stopImmediatePropagation();
        }
    };
    function dgOnDblClick(e,args) {
        $scope.viewDetail(args);
    }


    /**
     * 明细网格点击事件
     * @param e
     * @param args
     */
    function dgLineClick(e, args) {
        if ($(e.target).hasClass("btn")) {
            $scope.delLineRow(args);
            e.stopImmediatePropagation();
        }
    };

    //主表清单绑定点击事件
    $scope.headerGridView.onClick.subscribe(dgOnClick);
    $scope.headerGridView.onDblClick.subscribe(dgOnDblClick);

    //明细绑定点击事件
    $scope.lineGridView.onClick.subscribe(dgLineClick);


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
            ignorecase: "true", //忽略大小写
            postdata: {},
            is_high: true
        };
        $.each($scope.headerGridColumns, function (i, item) {
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
            $scope.searchData(postdata)
        })
    }
    /**
     * 查询详情
     * @param args
     */
    $scope.viewDetail = function (args) {
        var postData = {};
        postData.period_id = args.grid.getDataItem(args.row).period_id;
        //调用后台select方法查询详情
        BasemanService.RequestPost("fin_bud_period_header", "select", JSON.stringify(postData))
            .then(function (data) {
                $scope.data.currItem = data;
                $scope.lineGridView.setData([]);
                if ($scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers) {
                    //细表网格序号排序
                    var arr = [];
                    for(var i=0;i<data.fin_bud_period_lineoffin_bud_period_headers.length;i++){
                        arr.push(data.fin_bud_period_lineoffin_bud_period_headers[i].seq);
                    }
                    function sortNumber(a,b)
                    {
                        return a - b
                    }
                    arr.sort(sortNumber);
                    var j = 0;
                    for(var i=0;i<arr.length;i++){
                        for(;i<data.fin_bud_period_lineoffin_bud_period_headers.length;){
                            data.fin_bud_period_lineoffin_bud_period_headers[j].seq = arr[i];
                            j++;
                            break;
                        }
                    }
                    var lineData = $scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers;
                    $scope.lineGridView.setData(lineData);
                    //重绘网格
                    $scope.lineGridView.render();
                }
                //显示模态页面
                $("#detailModal").modal();
            });
    };

    /**
     * 查询后台数据
     */
    $scope.searchData = function (postdata) {
        BasemanService.RequestPost("fin_bud_period_header", "search",postdata)
            .then(function (data) {
                //清空网格
                $scope.headerGridView.setData([]);
                //设置数据
                //网格按年度排序
                var compare = function (obj1, obj2) {
                    var val1 = obj1.period_year;
                    var val2 = obj2.period_year;
                    if (val1 > val2) {
                        return -1;
                    } else if (val1 < val2) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
                data.fin_bud_period_headers.sort(compare);
                $scope.headerGridView.setData(data.fin_bud_period_headers);
                //重绘网格
                $scope.headerGridView.render();
                BaseService.pageInfoOp($scope, data.pagination);
            });
    }


    /**
     * 预算结转
     */
    $scope.doSettle = function () {
        var settleRow = $scope.lineGridView.getSelectedRows();
        if(settleRow.length == 0){
            BasemanService.swal("提示", "请勾选要进行结转的预算" );
            return;
        };
        //var selectedRows = [];
        var settleData = {};
        settleData.period_type = $scope.data.currItem.period_type;
        settleData.fin_bud_period_lineoffin_bud_period_headers = [];
        for(var i = 0; i < settleRow.length; i++) {
            //selectedRows.push(settleRow[i]);
            if ($scope.lineGridView.getDataItem(settleRow[i]).usable == 1) {
                BasemanService.swalWarning("提示", "期间"+$scope.lineGridView.getDataItem(settleRow[i]).dname+"预算已经结转,无须重复操作！" );
                return;
            }
            settleData.fin_bud_period_lineoffin_bud_period_headers.push($scope.lineGridView.getDataItem(settleRow[i]));
        }
        BasemanService.RequestPost("fin_bud_period_header", "settle", JSON.stringify(settleData))
            .then(function (data) {
                if(data.flag == 2){
                    BasemanService.swalWarning("提示", "申请单（"+data.fee_apply_nos+"）未完成审批流程，不能结转！" );
                    return;
                }
                if(data.flag == 3){
                    BasemanService.swalWarning("提示", "报销单（"+data.bx_nos+"）未完成审批流程，不能结转！" );
                    return;
                }
                if(data.flag == 4){
                    BasemanService.swalWarning("提示", "申请单（"+data.fee_apply_nos+"）未完成全部报销，不能结转！" );
                    return;
                }
                BasemanService.swalSuccess("成功", "结转成功！" );
                $scope.refreshDetails();
            });
    }

    /**
     * 预算反结转
     */
    $scope.doUnsettle = function () {
        var unSettleRow = $scope.lineGridView.getSelectedRows();
        if(unSettleRow.length == 0){
            BasemanService.swalWarning("提示", "请勾选要进行反结转的预算" );
            return;
        };
        if(unSettleRow.length > 1){
            BasemanService.swalWarning("提示", "每次只能反结转一个预算期间" );
            return;
        };
        for(var i = 0; i < unSettleRow.length; i++) {
            if ($scope.lineGridView.getDataItem(unSettleRow[i]).usable == 2) {
                BasemanService.swalWarning("提示", "该预算已经为取消结转状态，无须反结转" );
                return;
            }
        }
        var unSettleData = {};
        unSettleData.period_type = $scope.data.currItem.period_type;
        unSettleData.entid = $scope.lineGridView.getDataItem(unSettleRow).entid;
        unSettleData.period_line_id = $scope.lineGridView.getDataItem(unSettleRow).period_line_id;

        BasemanService.RequestPost("fin_bud_period_header", "unsettle",JSON.stringify(unSettleData))
            .then(function () {
                BasemanService.swalSuccess("成功", "反结转成功！" );
                $scope.refreshDetails();
            });
        // $scope.$apply();
    }
    /**
     * 保存数据
     */
    $scope.saveData = function () {
        if ($scope.lineGridView.getCellEditor() != undefined) {
            $scope.lineGridView.getCellEditor().commitChanges();
        }
        var action = "insert";
        if ($scope.data.currItem.period_id > 0) {
            action = "update";
        }
        //调用后台select方法查询详情
        BasemanService.RequestPost("fin_bud_period_header", action, JSON.stringify($scope.data.currItem))
            .then(function () {
                BasemanService.swalSuccess("成功", "保存成功！" );
                $("#detailModal").modal("hide");
            });
    }


    /**
     *调用后台Select方法刷新明细网格
     */
    $scope.refreshDetails = function () {
        BasemanService.RequestPost("fin_bud_period_header", "select", JSON.stringify($scope.data.currItem))
            .then(function (data) {
                $scope.data.currItem = data;
                $scope.lineGridView.setData([]);
                if ($scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers) {
                    var lineData = $scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers;
                    $scope.lineGridView.setData(lineData);
                }
                $scope.lineGridView.render();
            });
    }

    //主表网格自适应高度
    BasemanService.initGird();
    //初始化分页
    BaseService.pageGridInit($scope);

}

//注册控制器
angular.module('inspinia')
    .controller('ctrl_fin_bud_carryover', fin_bud_carryover);






