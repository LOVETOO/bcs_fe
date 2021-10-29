/**这是年度销售任务界面js*/
function sale_yeartask_head($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService,BaseService) {

    $scope.data = {"objtypeid": 1233};
    $scope.data.currItem = {};
    $scope.data.currItem.sale_yeartask_lineofsale_yeartask_heads = [];
    $scope.orgs = [];

    $scope.months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    $scope.getIndexByField = function (columns, field) {
        for (var i = 0; i < $scope[columns].length; i++) {
            if ($scope[columns][i].field == field) {
                return i;
                break;
            }
        }
        return false
    }

    // 添加按钮
    var editHeaderButtons = function (row, cell, value, columnDef, dataContext) {
        return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>查看</button> " +
            " <button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
    };
    var editDetailButton = function (row, cell, value, columnDef, dataContext) {
        return " <button class='btn btn-sm btn-info dropdown-toggle delbtn deldetailbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
    };

    var numberFormat = function (row, cell, value, columnDef, dataContext) {
        return  "<div style='text-align:right;vertical-align:middle;'>"+ value +"</div>"
    }

    // **********网格**********

    $scope.viewOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false
    };
    $scope.lineOptions = {
        editable: true,
        enableAddRow: false,
        enableCellNavigation: true,
        enableColumnReorder: false,
        asyncEditorLoading: false,
        autoEdit: true,
        rowHeight: 30
    };
    //列属性
    $scope.viewColumns = [
        {
            name: "任务单号",
            id: "ysaletask_no",
            field: "ysaletask_no",
            editable: false,
            cellEditor: "文本框",
            width: 100,
            height: 80,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            editor: Slick.Editors.Text
        }, {
            name: "任务版本号",
            id: "version",
            field: "version",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            width: 100,
            height: 80,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            editor: Slick.Editors.Text
        }, {
            name: "制单日期",
            id: "create_time",
            field: "create_time",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            width: 160,
            height: 80,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            editor: Slick.Editors.Text
        }, {
            name: "制单人",
            id: "creator",
            field: "creator",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            width: 80,
            height: 80,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            editor: Slick.Editors.Text
        }, {
            name: "年度",
            id: "cyear",
            field: "cyear",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            width: 60,
            height: 80,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            editor: Slick.Editors.Text
        }, {
            name: "成本中心编码",
            id: "org_code",
            field: "org_code",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            width: 100,
            height: 80,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            editor: Slick.Editors.Text
        }, {
            name: "成本中心名称",
            id: "org_name",
            field: "org_name",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            width: 150,
            height: 80,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            editor: Slick.Editors.Text
        }, {
            name: "年度任务总额",
            id: "total_task_amt",
            field: "total_task_amt",
            editable: false,
            filter: 'set',
            width: 150,
            height: 80,
            editor: Slick.Editors.Number,
            formatter:numberFormat
        }, {
            name: "年度预算总额",
            id: "total_bud_amt",
            field: "total_bud_amt",
            editable: false,
            filter: 'set',
            width: 150,
            height: 80,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            editor: Slick.Editors.Number,
            formatter:numberFormat
        }, {
            name: "备注",
            id: "note",
            field: "note",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            width: 100,
            height: 80,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            editor: Slick.Editors.Text
        }, {
            name: "操作",
            width: 90,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter: editHeaderButtons
        }
    ]
    $scope.lineColumns = [
        {
            name: "品牌/部门",
            id: "org_id",
            field: "org_id",
            editable: true,
            width: 150,
            editor: Slick.Editors.SelectOption,
            formatter: Slick.Formatters.SelectOption,
            options: $scope.orgs
        }, {
            name: "年度任务总额",
            id: "ytask_amt",
            field: "ytask_amt",
            editable: true,
            width: 150,
            height: 80,
            editor: Slick.Editors.Number,
            formatter:numberFormat
        },
        {
            name: "年度预算总额",
            id: "ybud_amt",
            field: "ybud_amt",
            editable: true,
            width: 150,
            height: 80,
            editor: Slick.Editors.Number,
            formatter:numberFormat
        },
        {
            name: "1月-2月",
            id: "task_amt_01_02",
            field: "task_amt_01_02",
            width: 120,
            height: 80,
            editable: false,
            editor: Slick.Editors.Number,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter:numberFormat
        }, {
            name: "3月",
            id: "task_amt_03",
            field: "task_amt_03",
            width: 120,
            height: 80,
            editor: Slick.Editors.Number,
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter:numberFormat
        }, {
            name: "4月",
            id: "task_amt_04",
            field: "task_amt_04",
            width: 120,
            height: 80,
            editable: false,
            editor: Slick.Editors.Number,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter:numberFormat
        },
        {
            name: "5月",
            id: "task_amt_05",
            field: "task_amt_05",
            width: 120,
            height: 80,
            editable: false,
            editor: Slick.Editors.Number,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter:numberFormat
        },
        {
            name: "6月",
            id: "task_amt_06",
            field: "task_amt_06",
            width: 120,
            height: 80,
            editable: false,
            editor: Slick.Editors.Number,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter:numberFormat
        },
        {
            name: "7月",
            id: "task_amt_07",
            field: "task_amt_07",
            width: 120,
            height: 80,
            editable: false,
            editor: Slick.Editors.Number,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter:numberFormat
        }, {
            name: "8月",
            id: "task_amt_08",
            field: "task_amt_08",
            width: 120,
            height: 80,
            editable: false,
            editor: Slick.Editors.Number,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter:numberFormat
        }, {
            name: "9月",
            id: "task_amt_09",
            field: "task_amt_09",
            width: 120,
            height: 80,
            editable: false,
            editor: Slick.Editors.Number,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter:numberFormat
        }, {
            name: "10月",
            id: "task_amt_10",
            field: "task_amt_10",
            width: 120,
            height: 80,
            editable: false,
            editor: Slick.Editors.Number,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter:numberFormat
        }, {
            name: "11月",
            id: "task_amt_11",
            field: "task_amt_11",
            width: 120,
            height: 80,
            editable: false,
            editor: Slick.Editors.Number,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter:numberFormat
        }, {
            name: "12月",
            id: "task_amt_12",
            field: "task_amt_12",
            width: 120,
            height: 80,
            editable: false,
            editor: Slick.Editors.Number,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter:numberFormat
        },
        {
            name: "操作",
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter: editDetailButton,
        }
    ]

//创建Headergrid，“table”为表格生成位置的ID
    $scope.headerGridView = new Slick.Grid("#viewGrid", [], $scope.viewColumns, $scope.viewOptions);
    $scope.lineGridView = new Slick.Grid("#lineGrid", [], $scope.lineColumns, $scope.lineOptions);

    //编辑明细表年度任务后累加
    function totalCount(e, args) {
        if ($scope.lineGridView.getCellEditor() != undefined) {
            $scope.lineGridView.getCellEditor().commitChanges();
        }
        var lineData = moneyFormatReverse($scope.lineGridView.getData());
        var t1 = 0;
        var t2 = 0;
        var totalTask = 0;
        var totalBud = 0;
        var lineRow = [];
        if ($scope.data.currItem.total_task_amt != null) {
            t1 = $scope.data.currItem.total_task_amt
        }
        if ($scope.data.currItem.total_bud_amt != null) {
            t2 = $scope.data.currItem.total_bud_amt
        }
        for (var i = 0; i < lineData.length; i++) {
            lineRow.push(HczyCommon.stringPropToNum(lineData[i]));
            if (lineRow[i].ytask_amt != null) {
                totalTask += lineRow[i].ytask_amt;
            }
            if (lineRow[i].ybud_amt != null) {
                totalBud += lineRow[i].ybud_amt;
            }
        }
        $scope.data.currItem.sale_yeartask_lineofsale_yeartask_heads = moneyFormat($scope.data.currItem.sale_yeartask_lineofsale_yeartask_heads)

        safeApply($scope, function () {
            $scope.data.currItem.total_task_amt = totalTask;
            $scope.data.currItem.total_bud_amt = totalBud;
        })
    }

    //檢查是否更新視圖
    function safeApply(scope, fn) {
        (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
    }

    //绑定点击事件
    $scope.headerGridView.onClick.subscribe(dgOnClick);
    $scope.headerGridView.onDblClick.subscribe(dgOnDblClick);  //双击查看事件
    $scope.lineGridView.onClick.subscribe(dgLineClick);
    $scope.lineGridView.onCellChange.subscribe(totalCount);

    function dgOnDblClick(e, args) {
        $scope.viewDetail(args);
    }

    /**
     * 查看详情
     * @param args
     */
    $scope.viewDetail = function (args) {
        var postData = {};
        postData.ysaletask_head_id = args.grid.getDataItem(args.row).ysaletask_head_id;
        var lineData = [];
        //调用后台select方法查询详情
        BasemanService.RequestPost("sale_yeartask_head", "select", JSON.stringify(postData))
            .then(function (data) {
                $scope.data.currItem = data;
                $scope.lineGridView.setData([]);

                // 将所有字符串数字转换为数字类型
                if ($scope.data.currItem.sale_yeartask_lineofsale_yeartask_heads) {
                    $.each($scope.data.currItem.sale_yeartask_lineofsale_yeartask_heads, function (i, item) {
                        $scope.data.currItem.sale_yeartask_lineofsale_yeartask_heads.splice(i, 1, HczyCommon.stringPropToNum(item))
                    })
                }

                //查询该单据的成本中心下的部门
                var superid = $scope.data.currItem.org_id;
                var sqlwhere = " superid =" + superid + " and orgtype =4 and isfeecenter =2";
                $scope.orgs.splice(0, $scope.orgs.length);
                BasemanService.RequestPostAjax("scporg", "search", {sqlwhere: sqlwhere})
                    .then(function (data) {
                        var orgs = [];
                        for (var i = 0; i < data.orgs.length; i++) {
                            orgs[i] = {
                                value: data.orgs[i].orgid,
                                desc: data.orgs[i].orgname
                            };
                            $scope.orgs.push(orgs[i]);
                        }
                    });
                //查询预算期间
                $scope.searchPeriod('edit');
               //金额转换为千分号形式显示
                //$scope.data.currItem.sale_yeartask_lineofsale_yeartask_heads = moneyFormat($scope.data.currItem.sale_yeartask_lineofsale_yeartask_heads);
                $scope.data.currItem.total_bud_amt = HczyCommon.formatMoney($scope.data.currItem.total_bud_amt)
                $scope.data.currItem.total_task_amt = HczyCommon.formatMoney($scope.data.currItem.total_task_amt)

                //显示模态页面
                $scope.lineGridView.setData($scope.data.currItem.sale_yeartask_lineofsale_yeartask_heads);
                $scope.lineGridView.render();
                $("#detailModal").modal();
            });
    };
    /**
     * 弹出添加框
     */
    $scope.addHeader = function () {
        $scope.orgs.splice(0, $scope.orgs.length);
        var current_time = new Date().toLocaleDateString();
        var cyear = new Date().getFullYear();
        $scope.data.currItem = {
            sale_yeartask_lineofsale_yeartask_heads: [],
            "create_time": current_time,
            "creator": 'admin',
            "stat": 1,
            "total_task_amt": 0,
            "total_bud_amt": 0,
            cyear: cyear
        };
        $scope.searchPeriod();
        $scope.lineGridView.setData($scope.data.currItem.sale_yeartask_lineofsale_yeartask_heads);
        $scope.lineGridView.render();
        $("#detailModal").modal();
    }

    /**
     * 查询该年度对应的月度预算期间
     */
    $scope.searchPeriod = function (type) {
        //正则表达式验证输入的年份
        var re = /^(19|20)\d{2}$/;
        if (!re.test($scope.data.currItem.cyear)) {
            return false;
        }
        var sqlwhere = "period_year=" + $scope.data.currItem.cyear + " and period_type = 230082";
        BasemanService.RequestPost("fin_bud_period_header", "search", JSON.stringify({sqlwhere: sqlwhere})).then(function (data) {
            if (!data.fin_bud_period_headers.length) {
                swal("提示", "该年度没有设置月度预算期间!");
                return false;
            } else {
                var period_id = data.fin_bud_period_headers[0].period_id;
                BasemanService.RequestPost("fin_bud_period_header", "select", JSON.stringify({period_id: period_id})).then(function (data) {
                    if (!data.fin_bud_period_lineoffin_bud_period_headers.length) {
                        swal("提示", "该年度没有设置月度预算期间!");
                        return false;
                    } else {
                        $.each(data.fin_bud_period_lineoffin_bud_period_headers, function (i, n) {
                            if (type == 'edit') {                                                 //判断是否属于可编辑状态
                                if (parseInt(n.res_usable) == 1) {                                //如果预算期间已结转,不可编辑
                                    $scope.lineColumns[i + 3].editable = false;
                                    $scope.lineColumns[i + 3].editor = "";
                                }
                                if (parseInt(n.res_usable) == 2) {
                                    $scope.lineColumns[i + 3].editable = true;
                                    $scope.lineColumns[i + 3].editor = Slick.Editors.Number;
                                }
                            }
                            $scope.lineColumns[i + 3].name = n.dname;
                        })
                        $scope.lineGridView.setColumns($scope.lineColumns);
                        $scope.lineGridView.render();
                    }
                })
            }
        })
    }

    /**
     * 主表点击事件
     */

    function dgOnClick(e, args) {
        if ($(e.target).hasClass("viewbtn")) {
            $scope.viewDetail(args);
            e.stopImmediatePropagation();
        }
        //点击删除按钮处理事件
        else if ($(e.target).hasClass("delbtn")) {
            var dg = $scope.headerGridView;
            var rowidx = args.row;
            var postData = {};
            postData.ysaletask_head_id = args.grid.getDataItem(args.row).ysaletask_head_id;
            var ysaletask_no = args.grid.getDataItem(args.row).ysaletask_no;
            swal({
                title: "确定要删除年度销售任务 " + ysaletask_no + " 吗?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1ab394",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false
            }, function () {
                //删除数据成功后再删除网格数据
                BasemanService.RequestPost("sale_yeartask_head", "delete", JSON.stringify(postData))
                    .then(function (data) {
                        dg.getData().splice(rowidx, 1);
                        dg.invalidateAllRows();
                        dg.render();
                        swal("删除!", "您已成功删除该任务!", "success");
                    });
            });
            e.stopImmediatePropagation();
        }
    };

    /**
     * 明细网格行
     */
    function dgLineClick(e, args) {
        //点击删除明细按钮处理事件
        if ($(e.target).hasClass("deldetailbtn")) {
            var ysaletask_head_id = args.grid.getDataItem(args.row).ysaletask_head_id;
            BasemanService.swalDelete("删除", "确定要删除明细吗？", function (bool) {
                //删除数据成功后再删除网格数据
                if (bool) {
                    var dg = $scope.lineGridView;
                    dg.getData().splice(args.row, 1);
                    dg.invalidateAllRows();
                    dg.render();
                }
            })
        }
    };

    /**
     * 明细表增加一行
     */
    $scope.addRow = function () {
        if (!$scope.data.currItem.org_id) {
            swal("提示", "请先选择成本中心", "error");
            return
        }
        if ($scope.lineGridView.getCellEditor() != undefined) {
            $scope.lineGridView.getCellEditor().commitChanges();
        }
        var dg = $scope.lineGridView;
        var rowidx = 0;
        var dataitem = [];
        var dataObj = {};
        //获取网格对象
        //var dataitem = getDgInitDataByType(dg);
        if (dg.getData()) { //防止数据空值报错，所以要做这个判断
            dg.getData().push(dataObj);
        } else {
            dataitem.push(dataObj);
            dg.setData(dataitem);
        }
        dg.resizeCanvas();
        dg.invalidateAllRows();
        dg.updateRowCount();
        dg.render();
    };
    /**
     * 保存数据
     */
    $scope.saveData = function () {
        if ($scope.lineGridView.getCellEditor() != undefined) {
            $scope.lineGridView.getCellEditor().commitChanges();
        }
        if ($scope.checkNull()) {
            return;
        }
        if (!$scope.searchPeriod()) {
            return;
        }
        var action = "insert";
        if ($scope.data.currItem.ysaletask_head_id) {
            action = "update";
        }
        if (action == "update") {
            //调用后台select方法查询详情
            $scope.data.currItem.sale_yeartask_lineofsale_yeartask_heads = moneyFormatReverse($scope.data.currItem.sale_yeartask_lineofsale_yeartask_heads)
            BasemanService.RequestPost("sale_yeartask_head", action, JSON.stringify(moneyFormatReverse($scope.data.currItem)))
                .then(function (data) {
                    $scope.searchData();
                    swal("完成!", "保存成功!", "success");
                    $("#detailModal").modal('hide');
                });
            return;
        }
        if (action == "insert") {
            //调用后台select方法查询详情
            $scope.data.currItem.sale_yeartask_lineofsale_yeartask_heads = moneyFormatReverse($scope.data.currItem.sale_yeartask_lineofsale_yeartask_heads)
            BasemanService.RequestPost("sale_yeartask_head", action, JSON.stringify(moneyFormatReverse($scope.data.currItem)))
                .then(function () {
                    $scope.searchData();
                    swal("完成!", "保存成功!", "success");
                    $("#detailModal").modal('hide');
                });
        }
    }
    /**
     * 检查明细行是否符合要求
     */
    $scope.checkNull = function () {
        if (!$scope.data.currItem.sale_yeartask_lineofsale_yeartask_heads[0]) {
            swal("提示", "请添加明细", "error");
            return true;
        }
        var linedata = moneyFormatReverse($scope.data.currItem.sale_yeartask_lineofsale_yeartask_heads)
        $.each(linedata, function (i, item) {
            var ytask_amt = item.ytask_amt;
            var ybud_amt = item.ybud_amt;
            var task_amt_01_02 = item.task_amt_01_02;
            var task_amt_03 = item.task_amt_03;
            var task_amt_04 = item.task_amt_04;
            var task_amt_05 = item.task_amt_05;
            var task_amt_06 = item.task_amt_06;
            var task_amt_07 = item.task_amt_07;
            var task_amt_08 = item.task_amt_08;
            var task_amt_09 = item.task_amt_09;
            var task_amt_10 = item.task_amt_10;
            var task_amt_11 = item.task_amt_11;
            var task_amt_12 = item.task_amt_12;
            var total = 0;
            total = task_amt_01_02 + task_amt_03 + task_amt_04 + task_amt_05 + task_amt_06 + task_amt_07 + task_amt_08 + task_amt_09 + task_amt_10 + task_amt_11 + task_amt_12;
            if (total == NaN || ytask_amt == null || ybud_amt == null) {
                swal("警告", "任务额度不能为空,请检查后重新输入", "error");
                return true;
            } else if (ytask_amt != total) {
                var j = i + 1;
                var a = "第" + j + "行明细的各月度任务的总额(" + total + "万元)没有等于年度任务总额(" + ytask_amt + "万元),请检查后重新输入";
                swal("警告", a, "error");
                return true;
            }
        })
        return false;
    }

    /**
     * 查询后台数据
     */
    $scope.searchData = function (postdata) {
        BasemanService.RequestPost("sale_yeartask_head", "search", postdata)
            .then(function (data) {
                $scope.headerGridView.setData(moneyFormat(data.sale_yeartask_heads));
                $scope.headerGridView.render();
                BaseService.pageInfoOp($scope, data.pagination);
            });
    }

    /**
     * 成本中心查询
     */
    $scope.searchOrg = function () {

        $scope.FrmInfo = {
            title: "成本中心查询  ",
            thead: [{
                name: "成本中心名称",
                code: "orgname",
            }, {
                name: "成本中心编码",
                code: "code",
            }],
            direct:"center",
            classid: "CPCOrg",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "orgs",
            ignorecase: "true", //忽略大小写
            postdata: {
                sqlwhere: "  isfeecenter = 2 and orgtype = 3",
                maxsearchrltcmt: 10
            },
            searchlist: ["code", "orgname", "orgid", "superid"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {

            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_name = result.orgname;
            $scope.data.currItem.org_id = result.orgid;

            var superid = result.orgid;
            var sqlwhere = " superid =" + superid + " and orgtype =4 and isfeecenter =2";


            $scope.orgs.splice(0, $scope.orgs.length);
            BasemanService.RequestPostAjax("scporg", "search", {sqlwhere: sqlwhere})
                .then(function (data) {
                    var orgs = [];
                    for (var i = 0; i < data.orgs.length; i++) {
                        orgs[i] = {
                            value: data.orgs[i].orgid,
                            desc: data.orgs[i].orgname
                        };
                        $scope.orgs.push(orgs[i]);
                    }

                });

        })
    };
    /**
     * 人员查询
     */
    $scope.searchEmployee = function () {
        $scope.FrmInfo = {
            title: "人员查询  ",
            thead: [{
                name: "人员编码",
                code: "employee_code",
            }, {
                name: "姓名",
                code: "employee_name",
            }, {
                name: "部门编码",
                code: "dept_code",
            }, {
                name: "部门名称",
                code: "dept_name",
            }],
            classid: "Base_View_Erpemployee_Org",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "base_view_erpemployee_orgs",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: 10
            },
            searchlist: ["employee_no", "employee_name", "employee_id", "employee_code", "dept_code", "dept_name"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.chap_name = result.employee_name;
        })
    };
    /**
     * 预算类别\
     */
    $scope.searchBudType = function () {
        $scope.FrmInfo = {
            title: "预算类别",
            thead: [{
                name: "类别名称",
                code: "bud_type_name"
            }, {
                name: "类别编码",
                code: "bud_type_code"
            }, {
                name: "机构层级",
                code: "Org_Level"
            }, {
                name: "费用层级",
                code: "Fee_Type_Level"
            }, {
                name: "预算期间类别",
                code: "Period_Type"
            }, {
                name: "产品类别",
                code: "Item_Level"
            }, {
                name: "描述",
                code: "Description"
            }],
            type:"checkbox",
            direct:"center",
            classid: "Fin_Bud_Type_Header",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "fin_bud_type_headers",
            ignorecase: "true", //忽略字母大小写
            postdata: {
                maxsearchrltcmt: 10
            },
            searchlist: ["bud_type_id", "bud_type_name", "bud_type_code", "Org_Level", "Fee_Type_Level", "Period_Type", "Description"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.bud_type_name = result.bud_type_name;
            $scope.data.currItem.bud_type_code = result.bud_type_code;
            $scope.data.currItem.bud_type_id = result.bud_type_id;

        })
    };

    /**
     * 金额千分号 方法
     */
    //添加千分号
    function moneyFormat(gridData) {
        var Data = gridData;
        var Data2 = []
        $.each(Data, function (i, item) {
            Data2.push(HczyCommon.stringPropToNum(item))
            if (Data2[i].total_bud_amt) {
                Data2[i].total_bud_amt = HczyCommon.formatMoney(Data2[i].total_bud_amt)
            }
            if (Data2[i].total_task_amt) {
                Data2[i].total_task_amt = HczyCommon.formatMoney(Data2[i].total_task_amt)
            }
            if (Data2[i].ytask_amt) {
                Data2[i].ytask_amt = HczyCommon.formatMoney(Data2[i].ytask_amt)
            }
            if (Data2[i].ybud_amt) {
                Data2[i].ybud_amt = HczyCommon.formatMoney(Data2[i].ybud_amt);
            }
            if (Data2[i].task_amt_01_02) {
                Data2[i].task_amt_01_02 = HczyCommon.formatMoney(Data2[i].task_amt_01_02);
            }
            if (Data2[i].task_amt_03) {
                Data2[i].task_amt_03 = HczyCommon.formatMoney(Data2[i].task_amt_03);
            }
            if (Data2[i].task_amt_04) {
                Data2[i].task_amt_04 = HczyCommon.formatMoney(Data2[i].task_amt_04);
            }
            if (Data2[i].task_amt_05) {
                Data2[i].task_amt_05 = HczyCommon.formatMoney(Data2[i].task_amt_05);
            }
            if (Data2[i].task_amt_06) {
                Data2[i].task_amt_06 = HczyCommon.formatMoney(Data2[i].task_amt_06);
            }
            if (Data2[i].task_amt_07) {
                Data2[i].task_amt_07 = HczyCommon.formatMoney(Data2[i].task_amt_07);
            }
            if (Data2[i].task_amt_08) {
                Data2[i].task_amt_08 = HczyCommon.formatMoney(Data2[i].task_amt_08);
            }
            if (Data2[i].task_amt_09) {
                Data2[i].task_amt_09 = HczyCommon.formatMoney(Data2[i].task_amt_09);
            }
            if (Data2[i].task_amt_10) {
                Data2[i].task_amt_10 = HczyCommon.formatMoney(Data2[i].task_amt_10);
            }
            if (Data2[i].task_amt_11) {
                Data2[i].task_amt_11 = HczyCommon.formatMoney(Data2[i].task_amt_11);
            }
            if (Data2[i].task_amt_12) {
                Data2[i].task_amt_12 = HczyCommon.formatMoney(Data2[i].task_amt_12);
            }
        });
        return Data2;
    }

    //过滤千分号
    function moneyFormatReverse(gridData) {
        var Data = gridData;
        $.each(Data, function (i, item) {
            if (item.total_bud_amt) {
                item.total_bud_amt = Reverse(item.total_bud_amt)
            }
            if (item.total_task_amt) {
                item.total_task_amt = Reverse(item.total_task_amt)
            }
            if (item.ytask_amt) {
                item.ytask_amt = Reverse(item.ytask_amt)
            }
            if (item.ybud_amt) {
                item.ybud_amt = Reverse(item.ybud_amt);
            }
            if (item.task_amt_01_02) {
                item.task_amt_01_02 = Reverse(item.task_amt_01_02);
            }
            if (item.task_amt_03) {
                item.task_amt_03 = Reverse(item.task_amt_03);
            }
            if (item.task_amt_04) {
                item.task_amt_04 = Reverse(item.task_amt_04);
            }
            if (item.task_amt_05) {
                item.task_amt_05 = Reverse(item.task_amt_05);
            }
            if (item.task_amt_06) {
                item.task_amt_06 = Reverse(item.task_amt_06);
            }
            if (item.task_amt_07) {
                item.task_amt_07 = Reverse(item.task_amt_07);
            }
            if (item.task_amt_08) {
                item.task_amt_08 = Reverse(item.task_amt_08);
            }
            if (item.task_amt_09) {
                item.task_amt_09 = Reverse(item.task_amt_09);
            }
            if (item.task_amt_10) {
                item.task_amt_10 = Reverse(item.task_amt_10);
            }
            if (item.task_amt_11) {
                item.task_amt_11 = Reverse(item.task_amt_11);
            }
            if (item.task_amt_12) {
                item.task_amt_12 = Reverse(item.task_amt_12);
            }
        })
        return Data;
    }

    function Reverse(num) {
        if (typeof(num) != "number") {
            var regexStr = /(\d{1,3})(?=(\d{3})+(?:$|\.))/g;
            var resultStr = num.replace(re, "$1,")
            num = parseFloat(num);
        }
        return num;
    }

    BaseService.pageGridInit($scope);//初始化分页和表格数据
    BasemanService.initGird();//自适应高度

    /**
     * 流程实例初始化
     */
    $scope.initWfIns = function () {
        HczyCommon.stringPropToNum($scope.data.currItem);
        //制单后才显示流程
        if ($scope.data.currItem.ysaletask_head_id && $scope.data.currItem.ysaletask_head_id > 0) {
            if ($scope.data.currItem.wfid && $scope.data.currItem.wfid > 0) {
                if (angular.element('#wfinspage').attr('src') != '/web/index.jsp#/crmman/wfins//' + $scope.data.currItem.wfid + '/' + $scope.data.objtypeid + '/' + $scope.data.currItem.ysaletask_head_id + '?showmode=2') {
                    angular.element('#wfinspage').attr('src', '/web/index.jsp#/crmman/wfins//' + $scope.data.currItem.wfid + '/' + $scope.data.objtypeid + '/' + $scope.data.currItem.ysaletask_head_id + '?showmode=2');
                }
            } else if ($scope.data.currItem.stat == 1) {
                var postData = {
                    "objtypeid": $scope.data.objtypeid
                }
                BasemanService.RequestPost("scpobjconf", "select", JSON.stringify(postData))
                    .then(function (data) {
                        if (data.objwftempofobjconfs && data.objwftempofobjconfs.length > 0) {
                            if (angular.element('#wfinspage').attr('src') != '/web/index.jsp#/crmman/wfins/' + data.objwftempofobjconfs[0].wftempid + '//' + $scope.data.objtypeid + '/' + $scope.data.currItem.ysaletask_head_id + '?showmode=2') {
                                angular.element('#wfinspage').attr('src', '/web/index.jsp#/crmman/wfins/' + data.objwftempofobjconfs[0].wftempid + '//' + $scope.data.objtypeid + '/' + $scope.data.currItem.ysaletask_head_id + '?showmode=2');
                            }
                        }
                    });
            }
        }
    }

    $scope.onTabChange = function (e) {
        // 获取已激活的标签页的名称
        if (e) {
            var tabName = $(e.target).text();
            console.log("tabName: " + tabName);
            if ('流程' == tabName) {
                $scope.initWfIns();
            } else {
                //页面也换到非流程页面时设置iframe的src为空，以便切换到frame时页面能自动刷新
                //angular.element('#wfinspage').attr('src','');
            }
        }
    }

    //详情页面隐藏时初始化显示第一个tab页面
    $('#detailModal').on('hidden.bs.modal', function (e) {
        //隐藏后默认显示第一个
        $('#detailtab a:first').tab('show');
        angular.element('#wfinspage').attr('src', '');
    })
    //modal显示时绑定切换事件
    $('#detailModal').on('shown.bs.tab', $scope.onTabChange);

    $('#detailtab a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    })
}

//注册控制器
angular.module('inspinia')
    .controller('sale_yeartask_head', sale_yeartask_head);