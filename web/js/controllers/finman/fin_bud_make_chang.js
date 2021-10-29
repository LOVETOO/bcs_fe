/**这是信息查询界面js*/
function fin_bud_make_chang($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {



    //设置标题
    $scope.headername = "预算编制-变动费用";


    //预留存储
    $scope.data = {};

    $scope.budData = [];
    $scope.deptData = [];

    //储存点击网格
    var currGriddept = "";
    var beyond_amt_database = false;

    //新增/修改
    var active = "";

    //页面数据绑定
    //预算年度
    $scope.data.bud_year = new Date().getFullYear();
    //预算类别
    $scope.data.bud_type_name = "";
    $scope.data.bud_type_code="";
    //费用项目
    $scope.object_ids = [];
    $scope.data.object_id = "";
    //预算释放比
    $scope.data.bud_free_amt = "";
    //超任务释放系数
    $scope.data.beyond_amt = "";
    //年度销售总任务
    $scope.data.sale_task = "";
    //年度标准总预算
    $scope.data.standard_task = "";

    //保存去千分号数据
    //plan_task_year年度计划任务
    var plan_task_year = "";
    //plan_bud_year年度计划预算
    var plan_bud_year = "";


    //查询预算期间类别
    $scope.period_types = [];
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "period_type"})
        .then(function (data) {
            $.each(data.dicts,function (i,item) {
                $scope.period_types.push(
                    {
                        value:item.dictvalue,
                        desc:item.dictname
                    }
                )
            })
        });

    //查询下载导入格式文件id
     BasemanService.RequestPostAjax("scpsysconf", "selectref", {})
            .then(function (data) {
                var vbudtmpdocid = "";
                $.each(data.sysconfs,function (i,item) {
                    if(item.confname == 'vbudtmpdocid'){
                        vbudtmpdocid = item.confvalue
                    }
                })
                $("#vbudtmpdocid").attr("href","/downloadfile?docid="+vbudtmpdocid);
            });

    //定义网格字段
    $scope.deptColumns = [
        {
            name: "序号",
            id: "uid",
            field: "uid",
            width: 43,
            cssClass: "uid",
        }, {
            id: "dept_code",
            name: "机构编码",
            field: "dept_code",
            width: 75
        }, {
            id: "dept_name",
            name: "机构名称",
            field: "dept_name",
            width: 130
        }, {
            id: "plan_task_year",
            name: "年度计划任务",
            field: "plan_task_year",
            width: 130,
            cssClass: "amt",
            editor: Slick.Editors.Text//可编辑
        }, {
            id: "plan_bud_year",
            name: "年度计划预算",
            field: "plan_bud_year",
            width: 130,
            cssClass: "amt",
            editor: Slick.Editors.Text//可编辑
        }
    ];
    //网格设置
    $scope.deptOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: true,//可编辑
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false,
    };
    //定义网格字段
    $scope.budColumns = [
        {
            id: "dname",
            name: "预算期间",
            field: "dname",
            width: 100,
        }, {
            id: "task_amt",
            name: "本期任务额",
            field: "task_amt",
            width: 130,
            cssClass: "amt",
            editor: Slick.Editors.Text//可编辑
        }, {
            id: "finish_bud_amt",
            name: "本期实际完成任务额",
            field: "finish_bud_amt",
            width: 135,
            cssClass: "amt",
            editor: Slick.Editors.Text//可编辑
        }, {
            id: "last_settle_amt",
            name: "上期结转金额",
            field: "last_settle_amt",
            editable: false,
            cssClass: "amt",
            width: 130
        }, {
            id: "bud_amt",
            name: "期初可用预算",
            field: "bud_amt",
            editable: false,
            cssClass: "amt",
            width: 130
        }, {
            id: "fact_amt",
            name: "本期实际预算",
            field: "fact_amt",
            editable: false,
            cssClass: "amt",
            width: 130
        }, {
            id: "adjust_amt",
            name: "本期调整金额",
            field: "adjust_amt",
            editable: false,
            cssClass: "amt",
            width: 130
        }, {
            id: "keeped_amt",
            name: "本期已占用金额",
            field: "keeped_amt",
            editable: false,
            cssClass: "amt",
            width: 130
        }, {
            id: "used_amt",
            name: "本期已使用金额",
            field: "used_amt",
            editable: false,
            cssClass: "amt",
            width: 130
        }, {
            id: "canuse_amt",
            name: "本期可使用的金额",
            field: "canuse_amt",
            editable: false,
            cssClass: "amt",
            width: 130
        }, {
            id: "amiss_amt",
            name: "本期实际与年度预算的差额",
            field: "amiss_amt",
            editable: false,
            cssClass: "amt",
            width: 175
        }, {
            id: "settle_amt",
            name: "本期可结转金额",
            field: "settle_amt",
            editable: false,
            cssClass: "amt",
            width: 130
        }, {
            id: "usable",
            name: "已结转",
            field: "usable",
            editable: true,
            cssClass: "uid",
            width: 60,
            options: [
                {value: "1", desc: "是"},
                {value: "2", desc: "否"},
            ],
            formatter: Slick.Formatters.SelectOption,
        }
    ];
    //网格设置
    $scope.budOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: true,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false,
    };


    //初始化表格
    $scope.deptGrid = new Slick.Grid("#deptGrid", [], $scope.deptColumns, $scope.deptOptions);
    $scope.budGrid = new Slick.Grid("#budGrid", [], $scope.budColumns, $scope.budOptions);


    //网格绑定事件
    $scope.deptGrid.onDblClick.subscribe(deptDblClick);
    $scope.deptGrid.onCellChange.subscribe(deptChange);
    $scope.budGrid.onCellChange.subscribe(budChange);

    //页面-预算类别查询
    $scope.viewTypeSearch = function () {
        $scope.FrmInfo = {
            title: "预算类别",
            thead: [{
                name: "类别名称",
                code: "bud_type_name"
            }, {
                name: "类别编码",
                code: "bud_type_code"
            }, {
                name: "费用层级",
                code: "fee_type_level"
            }, {
                name: "预算期间类别",
                code: "period_type",
                dicts: $scope.period_types,
                type: "list",
            }, {
                name: "描述",
                code: "description"
            }],
            classid: "Fin_Bud_Type_Header",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "fin_bud_type_headers",
            ignorecase: "true", //忽略大小写
            postdata: {
                sqlwhere: " Fin_Bud_Type_Header.Usable=2 and Fin_Bud_Type_Header.Org_Level<>5 " +
                " and Fin_Bud_Type_Header.is_change_fee=2 "//预算类别变动
            },
            searchlist: ["Bud_Type_Name"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.bud_type_id = result.bud_type_id;//预算类别数据
            $scope.data.bud_type_code = result.bud_type_code;//在获取费用项目信息后再执行
            $scope.data.bud_type_name = result.bud_type_name;
            $scope.data.period_type = result.period_type;//期间类型


            BasemanService.RequestPost(
                "fin_bud_type_header", "select",
                {
                    "bud_type_id": $scope.data.bud_type_id
                }
            ).then(function (result) {
                    $scope.object_ids = [];
                    $scope.data.object_id = "";
                    $.each(result.fin_bud_type_lineoffin_bud_type_headers, function (i, item) {
                        $scope.object_ids[i] = item;
                        $scope.object_ids[i].name = item.object_name;
                        $scope.object_ids[i].id = item.object_id;
                    });
                    //默认选择第一个费用项目
                    $scope.data.object_id = result.fin_bud_type_lineoffin_bud_type_headers[0].object_id;

                    //执行$watch  在数组中的bud_type_code都一样
                    // $scope.data.bud_type_code = result.fin_bud_type_lineoffin_bud_type_headers[0].bud_type_code;

                    //查询机构
                    deptSearch();
                }
            );
        });
    };
    //查询deptGrid
    function deptSearch(bool) {
        var postData = {
            "search_flag": 3,
            "sqlwhere": " Fin_Bud.Bud_Year=" + $scope.data.bud_year +
            " and Fin_Bud.bud_type_id=" + $scope.data.bud_type_id +
            " and Fin_Bud.Item_Type_Id=0 and Fin_Bud.Object_Id=" + $scope.data.object_id +//查费用项目
            " and Fin_Bud.differentiate=1"//查变动
        };
        BasemanService.RequestPost("fin_bud", "search", postData)
            .then(function (data) {
                $scope.deptGrid.setData([]);
                active = "update";
                var numSale_task = 0, numStandard_task = 0;
                $.each(data.fin_buds, function (i, item) {
                    if (!item.plan_bud_year && !item.plan_task_year) {
                        item.plan_bud_year = 0;
                        item.plan_task_year = 0;
                        active = "insert";
                    }
                    numSale_task += parseFloat(item.plan_task_year);
                    numStandard_task += parseFloat(item.plan_bud_year);
                });
                //年度标准总预算
                $scope.data.standard_tasks = insMoney(numStandard_task);//页面数据
                $scope.data.standard_task = numStandard_task;//用于传参
                //年度销售总任务
                $scope.data.sale_tasks = insMoney(numSale_task);//页面数据
                $scope.data.sale_task = numSale_task;//用于传参

                //序号
                for (var i = 0; i < data.fin_buds.length; i++) {
                    data.fin_buds[i].uid = i + 1;
                }
                returndeptGrid(data.fin_buds);

                if (bool) {
                    deptDblClick(0, currGriddept);
                }

            });
    }

    //dept双击事件
    function deptDblClick(e, args) {
        currGriddept = args;
        $scope.data.org_id = args.grid.getDataItem(args.row).dept_id;
        $scope.data.org_code = args.grid.getDataItem(args.row).dept_code;
        $scope.data.org_name = args.grid.getDataItem(args.row).dept_name;
        plan_task_year = delMoney(args.grid.getDataItem(args.row).plan_task_year);
        plan_bud_year = delMoney(args.grid.getDataItem(args.row).plan_bud_year);

        //使每次都进$watch
        $scope.data.beyond_amt = "";

        BasemanService.RequestPost("fin_bud", "search", {
            "sqlwhere": " Fin_Bud.Bud_Year=" + $scope.data.bud_year +
            " and Fin_Bud.bud_type_id=" + $scope.data.bud_type_id +
            " and Fin_Bud.Item_Type_Id=0 and Fin_Bud.Object_Id=" + $scope.data.object_id +
            " and Fin_Bud.Org_Id=" + $scope.data.org_id +
            " and Fin_Bud.differentiate=1"
        })
            .then(function (data) {
                if (data.fin_buds.length != 0) {
                    active = "update";
                    $scope.data.beyond_amt = parseFloat(data.fin_buds[0].beyond_amt);
                    beyond_amt_database = true;
                    //生成表格
                    returnBudGrid(data.fin_buds);
                } else {
                    BasemanService.RequestPost("fin_bud_period_header", "search", {
                        "sqlwhere": " Fin_Bud_Period_Header.Period_Year=" + $scope.data.bud_year +
                        " and Fin_Bud_Period_Header.Period_Type=" + $scope.data.period_type
                    })
                        .then(function (result) {
                            if (result.fin_bud_period_headers.length == 0) {
                                $scope.budGrid.setData([]);
                                $scope.budGrid.render();
                                BasemanService.swalError("错误", "未查询到符合条件的预算期间");
                                return;
                            }
                            BasemanService.RequestPost("fin_bud_period_header", "select", {
                                "period_id": result.fin_bud_period_headers[0].period_id
                            })
                                .then(function (result) {
                                    active = 'insert';
                                    $scope.data.beyond_amt = 0;
                                    beyond_amt_database = true;
                                    $.each(result.fin_bud_period_lineoffin_bud_period_headers, function (i, item) {
                                        item.task_amt = 0;
                                        item.finish_bud_amt = 0;
                                        item.last_settle_amt = 0;
                                        item.bud_amt = 0;
                                        item.fact_amt = 0;
                                        item.adjust_amt = 0;
                                        item.keeped_amt = 0;
                                        item.used_amt = 0;
                                        item.canuse_amt = 0;
                                        item.amiss_amt = 0;
                                        item.settle_amt = 0;
                                    });
                                    returnBudGrid(result.fin_bud_period_lineoffin_bud_period_headers);
                                });
                        });
                }
            });
    }

    //dept改变事件
    function deptChange(e, args) {
        if (!args) {
            return;
        }
        $scope.deptData = deleteMoneyDept($scope.deptData);

        returndeptGrid($scope.deptData);

        //修改的值为正在显示的内容时
        if (args.row == currGriddept.row) {
            plan_task_year = delMoney(args.grid.getDataItem(args.row).plan_task_year);
            plan_bud_year = delMoney(args.grid.getDataItem(args.row).plan_bud_year);

            //同步修改bud网格内容
            $scope.budData = deleteMoney($scope.budData);
            $.each($scope.budData, function (i, item) {
                budUpdate(item);
            });
            returnBudGrid($scope.budData);
        }
    }

    //生成dept表格
    function returndeptGrid(datas) {
        //拷贝数组
        $scope.deptData = datas;
        $scope.deptGrid.setData([]);
        var dataProvider = new TotalsDataProviderDept($scope.deptData, $scope.deptColumns);
        $scope.deptGrid.setData(dataProvider);
        $scope.deptGrid.render();
    }

    //bud改变事件
    function budChange(e, args) {
        if (!args) {
            return;
        }
        //自动获取输入数据?
        $scope.budData = deleteMoney($scope.budData);
        var row = $scope.budData[args.row];
        budUpdate(row);
        returnBudGrid($scope.budData);
    }

    //计算bud数据
    function budUpdate(row) {
        //修改本期任务额task_amt
        //期初可用预算=本期任务额task_amt*预算释放比(%)
        row.bud_amt = Math.floor((row.task_amt * plan_bud_year / plan_task_year )*100)/100;

        //修改本期实际完成任务额finish_bud_amt
        //本期实际预算=本期实际完成任务额*预算释放比
        if (row.finish_bud_amt <= row.task_amt) {
            row.fact_amt = Math.floor((row.finish_bud_amt * plan_bud_year / plan_task_year )*100)/100;
        } else {//超任务时
            //本期实际预算=期初可用预算+(实际完成任务额-本期任务额)*超任务释放系数
            // row.fact_amt = (row.bud_amt + (row.finish_bud_amt - row.task_amt) * $scope.data.beyond_amt / 100).toFixed(2);
            row.fact_amt = Math.floor(((row.finish_bud_amt - row.task_amt) * $scope.data.beyond_amt / 100 )*100)/100;
            row.fact_amt = row.bud_amt + row.fact_amt;
        }

        //修改期初可用预算bud_amt
        //本期可使用金额=上期结转金额+年初本期预算+本期调整-本期已使用-本期已保留
        row.canuse_amt = row.last_settle_amt + row.bud_amt + row.adjust_amt - row.keeped_amt - row.used_amt;

        //修改本期实际预算fact_amt
        //本期实际与年度预算的差额=本期实际预算-期初预算
        row.amiss_amt = (row.fact_amt - row.bud_amt);

        //本期可结转金额=本期可使用的金额+差额
        row.settle_amt = row.canuse_amt + row.amiss_amt;
    }

    //生成bud表格
    function returnBudGrid(datas) {

        //预算释放比$scope.data.bud_free_amt
        //被除数不能为0
        if (plan_task_year != 0) {
            $scope.data.bud_free_amt=Math.floor((plan_bud_year / plan_task_year*100) * 100) / 100
        } else {
            $scope.data.bud_free_amt = 0;
        }

        //拷贝数组
        $scope.budData = datas;
        $scope.budGrid.setData([]);
        var dataProvider = new TotalsDataProvider($scope.budData, $scope.budColumns);
        $scope.budGrid.setData(dataProvider);
        $scope.budGrid.render();

        $scope.$apply();
    }


    //保存按钮
    $scope.saveBtn = function () {
        if ($scope.deptGrid.getCellEditor() != undefined) {
            $scope.deptGrid.getCellEditor().commitChanges();
        }
        if ($scope.budGrid.getCellEditor() != undefined) {
            $scope.budGrid.getCellEditor().commitChanges();
        }

        if (currGriddept == "") {
            BasemanService.swalError("错误", "请先选择预算");
            return;
        }

        //去除千分号
        $scope.budData = deleteMoney($scope.budData);

        //判断任务额之和
        var sum = 0;
        $.each($scope.budData, function (i, item) {
            sum += parseFloat(item.task_amt);
        });
        if (plan_task_year != sum) {
            BasemanService.swalError(
                "错误",
                $scope.deptGrid.getDataItem(currGriddept.row).dept_name +
                ":本期任务额合计(" + insMoney(sum) + ")不等于年度计划任务(" + insMoney(plan_task_year) + ")"
            );
            return;
        }

        var fin_budoffin_bud = [];
        $.each($scope.budData, function (i, item) {
            //要考虑使用预算期间添加时,后台未传回以下数据,只能从页面获取
            var row = item;
            row.bud_year = $scope.data.bud_year;
            row.bud_type_id = $scope.data.bud_type_id;
            row.bud_type_code = $scope.data.bud_type_code;
            row.bud_type_name = $scope.data.bud_type_name;
            row.period_type = $scope.data.period_type;

            row.org_id = $scope.data.org_id;
            row.org_code = $scope.data.org_code;
            row.org_name = $scope.data.org_name;

            row.plan_task_year = plan_task_year;
            row.plan_bud_year = plan_bud_year;
            row.beyond_amt = $scope.data.beyond_amt;

            //获取项目对象对应的数据
            $.each($scope.object_ids, function (i, item) {
                if ($scope.data.object_id == item.object_id) {
                    row.object_id = item.object_id;
                    row.object_type = item.object_type;
                    row.object_code = item.object_code;
                    row.object_name = item.object_name;
                }
            });

            if (active == "update") {
                row.bud_id = item.bud_id;
            }
            fin_budoffin_bud.push(row);
        });
        var data = $scope.data;
        data.search_flag = 3;
        data.fin_budoffin_buds = fin_budoffin_bud;

        BasemanService.RequestPost("fin_bud", "batchupdate", JSON.stringify(data))
            .then(function (result) {
                if (result.fin_budoffin_buds.length != 0) {
                    BasemanService.swalSuccess("成功", "保存成功", function () {
                        deptSearch(true);
                    });
                }
            });
    };

    //刷新表格
    $scope.f5 = function () {
        if (currGriddept == "") {
            BasemanService.swalError("错误", "请先选择预算");
            return;
        }
        deptSearch(true);
    };


    //页面数据改变事件
    //年度
    $scope.$watch("data.bud_year", function (newVal, oldVal) {
        if (currGriddept != "" && $scope.data.bud_type_code != "" &&oldVal!="") {
            deptSearch(true);
            // deptDblClick(0, currGriddept);
        }else if($scope.deptData!=[]&& $scope.data.bud_type_code != "" &&oldVal!=""){
            deptSearch();
        }
    });
    //预算类别
    //费用项目会变,不需要
    // $scope.$watch("data.bud_type_code", function (newVal, oldVal) {
    //     if (currGriddept != "" && $scope.data.bud_year != "" && oldVal != undefined) {
    //         deptSearch(true);
    //         // deptDblClick(0, currGriddept);
    //     }
    // });
    //费用项目
    $scope.$watch("data.object_id", function (newVal, oldVal) {
        if (currGriddept != "" && $scope.data.bud_year != "" && newVal != "") {
            deptSearch(true);
            // deptDblClick(0, currGriddept);
        }else if($scope.deptData!=[]&& $scope.data.bud_year != "" && newVal != "" && oldVal!=""){
            deptSearch();
        }
    });
    //超任务释放系数
    $scope.$watch("data.beyond_amt", function (newVal, oldVal) {//str与num类型
        if (
            currGriddept != "" && $scope.data.bud_year != "" &&
            $scope.data.bud_type_code != "" && beyond_amt_database == false && newVal !== ""
        ) {
            budbeyondChange();
        }
        //beyond_amt是否来自数据库:使加载数据库内容时不会budUpdate()
        beyond_amt_database = false;
    });
    function budbeyondChange() {
        $scope.budData = deleteMoney($scope.budData);
        for (var i = 0; i < $scope.budData.length; i++) {
            budUpdate($scope.budData[i]);
        }
        returnBudGrid($scope.budData);
    }


    //bud网格样式控制
    function TotalsDataProvider(data, columns) {
        var totals = {};
        var totalsMetadata = {
            // Style the totals row differently.
            cssClasses: "totals",
            columns: {}
        };
        // Make the totals not editable.
        for (var i = 0; i < columns.length; i++) {
            totalsMetadata.columns[i] = {editor: null};
        }
        this.getLength = function () {
            return data.length + 1;
        };
        this.getItem = function (index) {
            return (index < data.length) ? data[index] : totals;
        };
        this.updateTotals = function () {
            var columnIdx = columns.length;
            while (columnIdx--) {
                if (columnIdx == columns.length - 1) {
                }
                else if (columnIdx == 0) {
                    var columnId = columns[columnIdx].id;
                    var total = 0;
                    var i = data.length;
                    while (i--) {
                        total += (parseFloat(data[i][columnId], 10) || 0);
                    }
                    totals[columnId] = "合计";
                } else {
                    var columnId = columns[columnIdx].id;
                    var total = 0;
                    var i = data.length;
                    while (i--) {
                        total += (parseFloat(data[i][columnId]) || 0);

                        //数值添加千分号
                        data[i][columnId] = insMoney(parseFloat(data[i][columnId]) || 0);
                    }
                    //合计添加千分号
                    totals[columnId] = insMoney(total);
                }
            }
        };
        this.getItemMetadata = function (index) {
            // return (index != data.length) ? null : totalsMetadata;
            if (index == data.length) {
                return totalsMetadata;
            } else if (data[index].usable == 1) {
                return totalsMetadata;
            } else {
                return null;
            }
        };
        this.updateTotals();
    }

    //dept网格样式
    function TotalsDataProviderDept(data, columns) {
        var totals = {};
        var totalsMetadata = {
            // Style the totals row differently.
            cssClasses: "totals",
            columns: {}
        };
        // Make the totals not editable.
        for (var i = 0; i < columns.length; i++) {
            totalsMetadata.columns[i] = {editor: null};
        }
        this.getLength = function () {
            return data.length;
        };
        this.getItem = function (index) {
            return data[index];
        };
        this.updateTotals = function () {
            var columnIdx = columns.length;
            while (columnIdx--) {
                if (columnIdx == 0 || columnIdx == 1 || columnIdx == 2) {
                } else {
                    var columnId = columns[columnIdx].id;
                    var total = 0;
                    var i = data.length;
                    while (i--) {
                        //数值添加千分号
                        data[i][columnId] = insMoney(parseFloat(data[i][columnId]) || 0);
                    }
                }
            }
        };
        this.getItemMetadata = function (index) {
            if (data[index].usable == 1) {
                return totalsMetadata;
            } else {
                return null;
            }
        };
        this.updateTotals();
    }

    //去除千分号
    function delMoney(num) {
        num = num.toString().replace(/\,/ig, "");
        return parseFloat(num);
    }

    function deleteMoney(data) {
        var data = data.slice(0);//消去引用关系
        $.each(data, function (i, item) {
            item.task_amt = delMoney(item.task_amt);
            item.finish_bud_amt = delMoney(item.finish_bud_amt);
            item.last_settle_amt = delMoney(item.last_settle_amt);
            item.bud_amt = delMoney(item.bud_amt);
            item.fact_amt = delMoney(item.fact_amt);
            item.adjust_amt = delMoney(item.adjust_amt);
            item.keeped_amt = delMoney(item.keeped_amt);
            item.used_amt = delMoney(item.used_amt);
            item.canuse_amt = delMoney(item.canuse_amt);
            item.amiss_amt = delMoney(item.amiss_amt);
            item.settle_amt = delMoney(item.settle_amt);
        });
        return data;
    }

    function deleteMoneyDept(data) {
        var data = data.slice(0);//消去引用关系
        $.each(data, function (i, item) {
            item.plan_task_year = delMoney(item.plan_task_year);
            item.plan_bud_year = delMoney(item.plan_bud_year);
        });
        return data;
    }

    function insMoney(num) {
        var i = 2;
        return HczyCommon.formatMoney(num, i);
    }



    /**
     * 触发上传文件
     */
    $scope.doUploadFile = function () {
        if (document.getElementById("file1")) {
            document.getElementById("file1").parentNode.removeChild(document.getElementById("file1"));
        }
        var inputObj = document.createElement('input');
        inputObj.setAttribute('id', 'file1');
        inputObj.setAttribute('type', 'file');
        inputObj.setAttribute('name', 'docFile0');
        inputObj.setAttribute("style", 'visibility:hidden');
        inputObj.setAttribute("nv-file-select", '');
        inputObj.setAttribute("uploader", 'uploader');
        //inputObj.setAttribute("accept", "image/*");
        inputObj.setAttribute("capture", "camera");
        document.body.appendChild(inputObj);
        inputObj.onchange = $scope.uploadFile;
        inputObj.click();
    }

    /**
     * 上传附件
     * @param o
     */
    $scope.uploadFile = function (o) {
        if (o.target.files) {
            try {
                $.ajaxFileUpload({
                    url: "/web/scp/filesuploadexcel.do",
                    type: 'post',
                    secureuri: false,
                    fileElementId: 'file1',//file标签的id
                    dataType: 'text',//返回数据的类型
                    data: {"classname": "com.ajerp.budget.Fin_Bud", "funcname": "doInsertChangeBudDataFromExcel"},
                    success: function (data, status) {
                        console.log(data);
                        var objdata = eval("(" + data + ")");
                        if (objdata.data && objdata.data.errmsg.length > 0) {
                            toastr.error(objdata.data.errmsg);
                        } else {
                            toastr.success("导入成功！");
                        }
                    },
                    error: function (data, status, e) {
                        console.log(data);
                    }
                });
            } finally {

            }
        }
    };



    BasemanService.initGird();


}
//注册控制器
angular.module("inspinia")
    .controller("fin_bud_make_chang", fin_bud_make_chang);

