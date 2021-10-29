/**这是预算审核界面js*/
function fin_bud_audit_head($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {

    //设置标题
    $scope.headername = "预算审核";
    $scope.highsql = "1=1";
    $scope.objconf = {
        classid: "fin_bud_audit_head",
        key: "fin_bud_audit_head_id",
        classids: "fin_bud_audit_heads",
        // postdata: {sqlwhere:"stat=5"},
        sqlBlock: "",
        thead: []
    };

    //预留存储
    $scope.data = {};
    //储存条件
    $scope.data.currItem = {};
    $scope.data.currItem = {contains: []};

    $scope.data.currItem.fin_bud_audit_code = '';
    $scope.data.currItem.created_by = '';
    $scope.data.currItem.finbilldate = '';
    $scope.data.currItem.year_month = '';
    $scope.data.currItem.stat = '';
    $scope.data.currItem.note = '';

    //储存点击网格
    var currGrid;

    fin_bud_audit_head = HczyCommon.extend(fin_bud_audit_head, ctrl_view_public);
    fin_bud_audit_head.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);


    $scope.billStats = [];
    //词汇表单据状态取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "wfstat"})
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
            if ($scope.getIndexByField('viewColumns', 'stat') !== false) {
                $scope.viewColumns[$scope.getIndexByField('viewColumns', 'stat')].options = billStats;
                $scope.viewGrid.setColumns($scope.viewColumns);

            }
        });


    //网格操作按钮
    var editButtons = function (row, cell, value, columnDef, dataContext) {
        return " <button class='btn btn-sm btn-info dropdown-toggle delbtn' " +
            "style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;' >删除</button> ";
    };

    var editHeaderButtons = function (row, cell, value, columnDef, dataContext) {
        return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>查看</button> " +
            " <button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
    };

    //定义网格字段
    $scope.detailColumns = [
        {
            id: "org_code",
            name: "部门编码",
            field: "org_code",
            editable: true,
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        }, {
            id: "org_name",
            name: "部门名称",
            field: "org_name",
            editable: true,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            id: "crm_entid",
            name: "品类",
            field: "crm_entid",
            editable: true,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            id: "item_type_id",
            name: "产品线",
            field: "item_type_id",
            editable: true,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            id: "object_code",
            name: "费用编码",
            field: "object_code",
            editable: true,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            id: "object_name",
            name: "费用名称",
            field: "object_name",
            editable: true,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            id: "dname",
            name: "月度",
            field: "dname",
            editable: true,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            id: "bud_amt",
            name: "期初预算",
            field: "bud_amt",
            editable: true,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            id: "fact_amt",
            name: "期末实际预算",
            field: "fact_amt",
            editable: true,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            id: "last_settle_amt",
            name: "上期结转金额",
            field: "last_settle_amt",
            editable: true,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            id: "adjust_amt",
            name: "本期调整金额",
            field: "adjust_amt",
            editable: true,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            id: "keeped_amt",
            name: "本期已保存金额",
            field: "keeped_amt",
            editable: true,
            filter: 'set',
            width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            id: "used_amt",
            name: "本期已使用金额",
            field: "used_amt",
            editable: true,
            filter: 'set',
            width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            id: "canuse_amt",
            name: "本期可使用金额",
            field: "canuse_amt",
            editable: true,
            filter: 'set',
            width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            name: "操作",
            editable: false,
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter: editButtons
        }
    ];
    //网格设置
    $scope.detailOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: true,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false,
    };

    $scope.viewColumns = [
        {
            id: "fin_bud_audit_code",
            name: "单号",
            field: "fin_bud_audit_code",
            editable: true,
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        }, {
            id: "finbilldate",
            name: "单据日期",
            field: "finbilldate",
            editable: true,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            id: "year_month",
            name: "单据月份",
            field: "year_month",
            editable: true,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            id: "created_by",
            name: "制单人",
            field: "created_by",
            editable: true,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            id: "stat",
            name: "流程状态",
            field: "stat",
            editable: true,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            options: [
            ],
            formatter: Slick.Formatters.SelectOption,
        }, {
            name: "操作",
            editable: false,
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter: editHeaderButtons
        }
    ];

    $scope.viewOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: true,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false,
    };


    //初始化网格
    $scope.viewGrid = new Slick.Grid("#viewGrid", [], $scope.viewColumns, $scope.viewOptions);
    $scope.detailGrid = new Slick.Grid("#detailGrid", [], $scope.detailColumns, $scope.detailOptions);


    //网格事件
    //主表单击事件
    function viewClick(e, args) {
        currGrid = args;
        //点击查看
        if ($(e.target).hasClass("viewbtn")) {
            $scope.viewDetail(args);
            e.stopImmediatePropagation();
        }
        //点击删除
        else if ($(e.target).hasClass("delbtn")) {
            var dg = $scope.viewGrid;
            var rowidx = args.row;
            var postData = {};
            postData.fin_bud_audit_head_id = args.grid.getDataItem(args.row).fin_bud_audit_head_id;
            if (confirm("确定要删除单号" + args.grid.getDataItem(args.row).fin_bud_audit_code + "吗？")) {
                //删除数据成功后再删除网格数据
                BasemanService.RequestPost("fin_bud_audit_head", "delete", JSON.stringify(postData))
                    .then(function (data) {
                        dg.getData().splice(rowidx, 1);
                        dg.invalidateAllRows();
                        dg.render();
                        alert("删除成功！");
                    });
            }
            e.stopImmediatePropagation();
        }
    }

    //明细表单击事件
    function detailClick(e, args) {
        if ($(e.target).hasClass("btn")) {
            delLineRow(args);
            e.stopImmediatePropagation();
        }
    }

    //主表双击事件
    function viewDblClick(e, args) {
        currGrid = args;
        $scope.viewDetail(args);
        e.stopImmediatePropagation();
    }

    //明细绑定点击事件
    $scope.viewGrid.onClick.subscribe(viewClick);
    $scope.viewGrid.onDblClick.subscribe(viewDblClick);
    $scope.detailGrid.onClick.subscribe(detailClick);


    //时间插件
    $('#time').datetimepicker({
        format: 'yyyy-mm-dd',
        language: 'zh-CN',
        pickDate: true, //选择日期
        pickTime: false, //选择时间
        todayBtn: true, //显示选择当前时间按钮
        autoclose: true, //选择一个日期之后立即关闭日期时间选择器
        todayHighlight: true, //高亮当前日期
        startView: 'month', //选择首先显示的视图:month
        minView: 'month' //最小的选择视图-选择最小单位:day
    });


    //明细-删除
    function delLineRow(args) {
        var rowidx = args.row;
        var name = args.grid.getDataItem(args.row).org_name;
        if (confirm("确定要删除明细 " + name + " 吗？")) {
            var dg = $scope.detailGrid;
            dg.getData().splice(rowidx, 1);
            dg.render();
        }
    }


    //显示明细窗
    $scope.viewDetail = function (args) {
        var postData = {};
        postData.fin_bud_audit_head_id = args.grid.getDataItem(args.row).fin_bud_audit_head_id;
        BasemanService.RequestPost("fin_bud_audit_head", "select", JSON.stringify(postData))
            .then(function (result) {
                $scope.data.currItem = result;

                $("#detailModal").modal('show');
                $scope.detailGrid.setData([]);
                $scope.detailGrid.setData(result.fin_bud_audit_lineoffin_bud_audit_heads);
                $scope.detailGrid.render();
                //显示详情模态页面
                $scope.$apply();
            });
    };


    //初始查询
    $scope.doSearch = function () {
        BasemanService.RequestPost("fin_bud_audit_head", "search", JSON.stringify({
            "maxsearchrltcmt": "300",
        }))
            .then(function (result) {
                $.each(result.fin_bud_audit_headoffin_bud_audit_heads, function (i, item) {
                    item.finbilldate = item.finbilldate.slice(0, -9);
                });
                //清空网格
                $scope.viewGrid.setData([]);
                //设置数据
                $scope.viewGrid.setData(result.fin_bud_audit_headoffin_bud_audit_heads);
                //重绘网格
                $scope.viewGrid.render();
            });
    };


    //明细-预算按钮
    $scope.budBtn = function () {
        $scope.FrmInfo = {
            title: "预算明细",
            thead: [{
                name: "部门编码",
                code: "org_code"
            }, {
                name: "部门名称",
                code: "org_name"
            }, {
                name: "费用编码",
                code: "object_code"
            }, {
                name: "费用名称",
                code: "object_name"
            }/*, {
             name: "月度",
             code: "dname"
             }, {
             name: "期初预算",
             code: "bud_amt"
             }, {
             name: "期末实际预算",
             code: "fact_amt"
             }, {
             name: "上期结转金额",
             code: "last_settle_amt"
             }, {
             name: "本期调整金额",
             code: "adjust_amt"
             }, {
             name: "本期已保留金额",
             code: "keeped_amt"
             }, {
             name: "本期已使用金额",
             code: "keeped_amt"
             }, {
             name: "本期可用金额",
             code: "canuse_amt"
             }*/],
            classid: "fin_bud_audit_head",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "fin_bud_audit_heads",
            ignorecase: "true", //忽略大小写
            postdata: {
                search_flag: "98",
                maxsearchrltcmt: "300",
                // sqlwhere:"Fin_Bud.BUD_ID not in (217,219,181,0)",
            },
            searchlist: []
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            if (JSON.stringify(result) == "{}") {
                alert('请选择类别');
            } else {
                var rows = $scope.detailGrid.getData();
                rows.push(result);
                $scope.detailGrid.setData(rows);
                $scope.detailGrid.render();
            }
        });
    };

    //增加按钮
    $scope.addBtn = function () {
        $("#detailModal").modal('show');

        $scope.data.currItem.fin_bud_audit_code = '';
        $scope.data.currItem.created_by = '';
        $scope.data.currItem.finbilldate = '';
        $scope.data.currItem.year_month = '';
        $scope.data.currItem.stat = '1';
        $scope.data.currItem.note = '';
        $scope.detailGrid.setData([]);
        $scope.detailGrid.render();

        // $scope.$apply();
    };


    //明细-确定
    $scope.saveData = function () {
        /*if ($scope.lineGridView.getCellEditor() != undefined) {
         $scope.lineGridView.getCellEditor().commitChanges();
         }*/
        var datas = $scope.detailGrid.getData();
        var data = {};
        if (datas.length == 0) {
            alert('明细不能为空');
            return;
        }
        if ($scope.data.currItem.finbilldate == '') {
            alert('制单时间不能为空');
            return;
        }
        var action = "insert";
        if ($scope.data.currItem.fin_bud_audit_code != "") {
            action = "update"
        }

        data = {
            "finbilldate": $scope.data.currItem.finbilldate,
            "year_month": $scope.data.currItem.year_month,
            "note": $scope.data.currItem.note,
            "stat": "1"
        };
        data.fin_bud_audit_lineoffin_bud_audit_heads = datas;
        if (action == "update") {
            data.stat = $scope.data.currItem.stat;
            data.fin_bud_audit_head_id = $scope.data.currItem.fin_bud_audit_head_id;
            data.fin_bud_audit_code = $scope.data.currItem.fin_bud_audit_code;
            data.created_by = $scope.data.currItem.created_by;
        }
        BasemanService.RequestPost("fin_bud_audit_head", action,
            JSON.stringify(data)
        ).then(function () {
            $scope.doSearch();
            alert("保存成功！");
            $('#detailModal').modal('hide');
        });
    };


    $scope.$watch('data.currItem.finbilldate', function (newValue, oldValue) {
        //判断是否有模态窗打开
        if ($('body').hasClass('modal-open')) {
            $scope.data.currItem.year_month = newValue.slice(0, -3);
        }
    });

    BasemanService.initGird();
}

//注册控制器
angular.module('inspinia')
    .controller('fin_bud_audit_head', fin_bud_audit_head);

