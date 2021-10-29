/**这是信息查询界面js*/
function fin_bud_make_change($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {



    //设置标题
    $scope.headername = "预算编制-变动费用(旧-依据年度销售任务)";

    //备用
    BasemanService.RequestPost("base_search", "searchdict", {dictcode: "crm_entid"})
        .then(function (data) {
        });

    //预留存储
    $scope.data = {};

    $scope.budData = [];

    //储存点击网格
    var currGrid = "";

    //新增/修改
    var active = "";
    var activeData = "";


    //页面数据绑定
    //预算年度
    $scope.data.bud_year = new Date().getFullYear();
    //预算类别
    $scope.data.bud_type_name = "";
    //费用项目
    $scope.object_ids = [];
    $scope.data.object_id = "";
    //预算释放比
    $scope.data.bud_free_amt = "";
    //超任务释放系数
    $scope.data.bud_norm_amt = 0.5;
    //年度销售总任务
    $scope.data.sale_task = "";
    //年度标准总预算
    $scope.data.standard_task = "";

    //保存去千分号数据
    //plan_task_year年度计划任务
    var plan_task_year;
    //plan_task_year年度计划预算
    var plan_bud_year;

    //结尾
    var endMon = [
        "0102", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"
    ];
    var endSea = [
        "sea01", "sea02", "sea03", "sea04"
    ];

    //定义网格字段
    $scope.deptColumns = [
        {
            name: "序号",
            id: "id",
            field: "id",
            width: 43,
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
            width: 130
        }, {
            id: "plan_bud_year",
            name: "年度计划预算",
            field: "plan_bud_year",
            width: 130,
        }
    ];
    //网格设置
    $scope.deptOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false,
        //check
        multiSelect: true,
        autowidth: true
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
            editor: Slick.Editors.Text//可编辑
        }, {
            id: "finish_bud_amt",
            name: "本期实际完成任务额",
            field: "finish_bud_amt",
            width: 135,
            editor: Slick.Editors.Text//可编辑
        }, {
            id: "last_settle_amt",
            name: "上期结转金额",
            field: "last_settle_amt",
            editable: false,
            width: 130
        }, {
            id: "bud_amt",
            name: "期初可用预算",
            field: "bud_amt",
            width: 130
        }, {
            id: "fact_amt",
            name: "本期实际预算",
            field: "fact_amt",
            width: 130
        }, {
            id: "adjust_amt",
            name: "本期调整金额",
            field: "adjust_amt",
            editable: false,
            width: 130
        }, {
            id: "keeped_amt",
            name: "本期已占用金额",
            field: "keeped_amt",
            editable: false,
            width: 130
        }, {
            id: "used_amt",
            name: "本期已使用金额",
            field: "used_amt",
            editable: false,
            width: 130
        }, {
            id: "canuse_amt",
            name: "本期可使用的金额",
            field: "canuse_amt",
            editable: false,
            width: 130
        }, {
            id: "amiss_amt",
            name: "本期实际与年度预算的差额",
            field: "amiss_amt",
            editable: false,
            width: 175
        }, {
            id: "settle_amt",
            name: "本期结转金额",
            field: "settle_amt",
            editable: false,
            width: 130
        }, {
            id: "usable",
            name: "已结转",
            field: "usable",
            editable: true,
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
        //check
        multiSelect: true,
        autowidth: true
    };


    //初始化表格
    $scope.deptGrid = new Slick.Grid("#deptGrid", [], $scope.deptColumns, $scope.deptOptions);
    $scope.budGrid = new Slick.Grid("#budGrid", [], $scope.budColumns, $scope.budOptions);


    //网格绑定事件
    $scope.deptGrid.onDblClick.subscribe(deptDblClick);
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
                code: "period_type"
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
                maxsearchrltcmt: 10,
                sqlwhere: " Fin_Bud_Type_Header.Usable=2 and Fin_Bud_Type_Header.Org_Level<>5 "
            },
            searchlist: ["Bud_Type_Name"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.bud_type_id = result.bud_type_id;//预算类别数据
            // $scope.data.bud_type_code = result.bud_type_code;
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
                    $scope.data.bud_type_code = result.fin_bud_type_lineoffin_bud_type_headers[0].bud_type_code;

                    //查询机构
                    deptSearch();
                }
            );
        });
    };
    //查询deptGrid
    function deptSearch() {
        var postData = {
            "search_flag": 3,
            "bud_type_id": $scope.data.bud_type_id,
            "bud_year": $scope.data.bud_year
        };
        BasemanService.RequestPost("fin_bud", "search", postData)
            .then(function (data) {
                $scope.deptGrid.setData([]);

                var numSale_task = 0, numStandard_task = 0;
                var before=[],back=[];
                $.each(data.fin_buds, function (i, item) {
                    if (!item.plan_task_year) {
                        item.plan_task_year = 0;
                    }
                    if (!item.plan_bud_year) {
                        item.plan_bud_year = 0;
                    }
                    numSale_task += parseFloat(item.plan_task_year);
                    numStandard_task += parseFloat(item.plan_bud_year);
                    item.plan_task_year = insMoney(item.plan_task_year);
                    item.plan_bud_year = insMoney(item.plan_bud_year);
                    if(item.plan_task_year == 0&&item.plan_bud_year == 0){
                        back.push(item);
                    }else{
                        before.push(item);
                    }
                });
                //年度标准总预算
                $scope.data.standard_tasks = insMoney(numStandard_task);//页面数据
                $scope.data.standard_task = numStandard_task;
                //年度销售总任务
                $scope.data.sale_tasks = insMoney(numSale_task);//页面数据
                $scope.data.sale_task = numSale_task;

                //排序
                before = before.concat(back);

                //序号
                for (var i = 0; i < before.length; i++) {
                    before[i].id = i + 1;
                }

                $scope.deptGrid.setData(before);
                $scope.deptGrid.render();
                $scope.$apply();
            });
    }

    //dept双击事件
    function deptDblClick(e, args) {
        currGrid = args;
        $scope.data.org_id = args.grid.getDataItem(args.row).dept_id;
        $scope.data.org_code = args.grid.getDataItem(args.row).dept_code;
        $scope.data.org_name = args.grid.getDataItem(args.row).dept_name;
        var postData = {
            "flag": 8,
            "org_id": $scope.data.org_id,
            "differentiate": 1,//查变动
            "bud_year": $scope.data.bud_year,
            "bud_type_id": $scope.data.bud_type_id,
            "period_type": $scope.data.period_type,
            "sqlwhere": "Fin_Bud.Item_Type_Id=0 and Fin_Bud.Object_Id=" + $scope.data.object_id
        };
        BasemanService.RequestPost("fin_bud", "search", JSON.stringify(postData))
            .then(function (data) {
                $scope.budGrid.setData([]);

                if (data.fin_budoffin_buds.length == 0) {
                    BasemanService.swalError("错误", "请先建立对应预算期间");
                    return;
                }

                //预算释放比$scope.data.bud_free_amt
                //被除数不能为0
                plan_bud_year=delMoney(args.grid.getDataItem(args.row).plan_bud_year);
                plan_task_year=delMoney(args.grid.getDataItem(args.row).plan_task_year);
                if (plan_task_year!= 0) {
                    $scope.data.bud_free_amt =(plan_bud_year / plan_task_year * 100).toFixed(2);
                } else {
                    $scope.data.bud_free_amt = 0;
                }

                //拼接数据
                if (data.fin_budoffin_buds[0].task_amt) {//1.预算表取值
                    activeData = "bud";
                    active = "update";
                    //超任务释放系数$scope.data.bud_norm_amt
                    $scope.data.bud_norm_amt = data.bud_norm_amt;
                } else if (data.fin_budoffin_buds[0].amt0102 || data.fin_budoffin_buds[0].amtsea01 || data.fin_budoffin_buds[0].amtyear) {//2.销售任务单明细表取值
                    activeData = "amt";
                    active = "insert";
                } else if (data.fin_budoffin_buds[0].sum0102 || data.fin_budoffin_buds[0].sumsea01 || data.fin_budoffin_buds[0].sumyear) {//3.销售任务单主表取值
                    activeData = "sum";
                    active = "insert";
                } else {//4.activeData="0" 没有销售任务单,取预算期间,赋值0
                    activeData = 0;
                    active = "";
                }

                /*if (activeData==0) {
                    BasemanService.swalError("错误", "请先建立销售任务");
                    return;
                }*/

                $.each(data.fin_budoffin_buds, function (i, item) {
                    if (activeData != "bud") {
                        if (active == "insert") {
                            if (activeData == 0) {
                                item.task_amt = 0;
                            } else if ($scope.data.period_type == 230082) {//月度
                                item.task_amt = item[activeData + endMon[i]];
                            } else if ($scope.data.period_type == 230022) {//季度
                                item.task_amt = item[activeData + endSea[i]];
                            } else if ($scope.data.period_type == 230142) {//年度
                                item.task_amt = item[activeData + "year"];
                            }
                        }
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
                        // item.usable = 2;
                    }
                });
                //生成表格
                returnGrid(data.fin_budoffin_buds);
            });
    }


    //bud改变事件
    function budChange(e, args) {
        //自动获取输入数据?
        $scope.budData = deleteMoney($scope.budData);

        var row = $scope.budData[args.row];


        //修改本期任务额task_amt
        //期初可用预算=本期任务额task_amt*预算释放比(%)
        row.bud_amt = (row.task_amt * $scope.data.bud_free_amt / 100);

        //修改本期实际完成任务额finish_bud_amt
        //本期实际预算=本期实际完成任务额*预算释放比
        if (row.finish_bud_amt <= row.task_amt) {
            row.fact_amt = (row.finish_bud_amt * $scope.data.bud_free_amt / 100);
        } else {//超任务时
            //本期实际预算=期初可用预算+(实际完成任务额-本期任务额)*超任务释放系数
            // row.fact_amt = (row.bud_amt + (row.finish_bud_amt - row.task_amt) * $scope.data.bud_norm_amt / 100).toFixed(2);
            row.fact_amt = (row.finish_bud_amt - row.task_amt) * $scope.data.bud_norm_amt / 100;
            row.fact_amt = parseFloat(row.bud_amt) + parseFloat(row.fact_amt);
        }

        //修改期初可用预算bud_amt
        //本期可使用金额= 上期结转金额+期初预算+本期调整-本期已占用-本期已保留
        // 本期可使用金额=上期结转金额+年初本期预算+本期调整-本期已使用-本期已保留
        row.canuse_amt = parseFloat(row.last_settle_amt) + parseFloat(row.bud_amt) + parseFloat(row.adjust_amt) - row.keeped_amt - row.used_amt;

        //修改本期实际预算fact_amt
        //本期实际与年度预算的差额=本期实际预算-期初预算
        row.amiss_amt = (row.fact_amt - row.bud_amt);

        //本期结转金额=本期可使用的金额-本期实际与年度预算的差额
        row.settle_amt = parseFloat(row.canuse_amt) + parseFloat(row.amiss_amt);

        $scope.budGrid.setData([]);
        returnGrid($scope.budData);
    }

    //生成表格
    function returnGrid(datas) {
        //拷贝数组
        $scope.budData = datas.slice(0);
        $scope.budGrid.setData([]);
        var dataProvider = new TotalsDataProvider($scope.budData, $scope.budColumns);
        $scope.budGrid.setData(dataProvider);
        $scope.budGrid.render();
    }


    //保存按钮
    $scope.saveBtn = function () {
        if ($scope.budGrid.getCellEditor() != undefined) {
            $scope.budGrid.getCellEditor().commitChanges();
        }

        if (active == "") {
            BasemanService.swalError("错误", "请先选择预算");
            return;
        }

        //去除千分号
        $scope.budData = deleteMoney($scope.budData);

        //判断任务额之和
        var sum=0;
        $.each($scope.budData,function (i,item) {
            sum+=parseFloat(item.task_amt);
        });
        if(plan_task_year!=sum){
            BasemanService.swalError("错误", "本期任务额("+sum+")不等于年度计划任务("+plan_task_year+")");
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
                        var postdata = {
                            "flag": 8,
                            "org_id": $scope.data.org_id,
                            "differentiate": 1,//查变动
                            "bud_year": $scope.data.bud_year,
                            "bud_type_id": $scope.data.bud_type_id,
                            "period_type": $scope.data.period_type,
                            "sqlwhere": "Fin_Bud.Item_Type_Id=0 and Fin_Bud.Object_Id=" + $scope.data.object_id
                            // " and Fin_Bud.crm_entid=" + $scope.data.crm_entid//是否还需要品牌
                        };
                        BasemanService.RequestPost("fin_bud", "search", JSON.stringify(postdata))
                            .then(function (result) {
                                returnGrid(result.fin_budoffin_buds);
                            });
                    });
                }
            });
    };


    //页面数据改变事件
    //年度
    $scope.$watch("data.bud_year", function (newVal, oldVal) {
        if (currGrid != "" && $scope.data.bud_type_code != "") {
            deptSearch();
            deptDblClick(0, currGrid);
        }
    });
    //预算类别
    $scope.$watch("data.bud_type_code", function (newVal, oldVal) {
        if (currGrid != "" && $scope.data.bud_year != "" && oldVal != undefined) {
            deptSearch();
            deptDblClick(0, currGrid);
        }
    });
    //费用项目
    $scope.$watch("data.object_id", function (newVal, oldVal) {
        if (currGrid != "" && $scope.data.bud_year != "") {
            deptSearch();
            deptDblClick(0, currGrid);
        }
    });
    //超任务释放系数
    $scope.$watch("data.bud_norm_amt", function (newVal, oldVal) {
        if (currGrid != "" && $scope.data.bud_year != "" && $scope.data.bud_type_code != "") {
            budChange(0, $scope.budData);
        }
    });


    //网格样式控制
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

    //去除千分号
    function delMoney(num) {
        num = num.toString().replace(/\,/ig, "");
        return parseFloat(num);
    }
    function deleteMoney(data) {
        var data = data.slice(0);
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
    function insMoney(num){
        var i=2;
        return HczyCommon.formatMoney(num, i);
    }


    BasemanService.initGird();


}
//注册控制器
angular.module("inspinia")
    .controller("fin_bud_make_change", fin_bud_make_change);

