/**这是预算类别界面js*/
function fin_bud_type_header($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService, BaseService) {
    $scope.data = {};
    $scope.data.currItem = {};
    $scope.data.currItem.fee_type_level = "1";
    $scope.data.currItem.maxseq = 0;  //明细行最大序列号

    var editHeaderButtons = function (row, cell, value, columnDef, dataContext) {
        return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn'>查看</button> " +
            " <button class='btn btn-sm btn-info dropdown-toggle delbtn'>删除</button>";
    };

    var editButtons = function (row, cell, value, columnDef, dataContext) {
        return " <button class='btn btn-sm btn-info dropdown-toggle delbtn' " +
            "style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;' >删除</button> ";
    };
    /**
     * 主表网格配置
     * @type {{enableCellNavigation: boolean, enableColumnReorder: boolean, editable: boolean, asyncEditorLoading: boolean, autoEdit: boolean, autoHeight: boolean}}
     */
    $scope.headerGridOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false
    };

    /**
     * 明细网格配置
     * @type {{enableCellNavigation: boolean, enableColumnReorder: boolean, editable: boolean, enableAddRow: boolean, asyncEditorLoading: boolean, autoEdit: boolean, autoHeight: boolean}}
     */
    $scope.lineGridOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: false,
        autoHeight: false
    };

    //定义网格字段(浏览）
    $scope.headerGridColumns = [
        {
            name: "操作",
            width: 105,
            formatter: editHeaderButtons
        },{
            id: "bud_type_code",
            name: "类别编码",
            field: "bud_type_code",
            width: 100,
            type:"string"
        }, {
            id: "bud_type_name",
            name: "类别名称",
            field: "bud_type_name",
            width: 150,
            type:"string"
        }, {
            id: "fee_type_code",
            name: "费用大类编码",
            field: "fee_type_code",
            width: 100,
            type:"string"
        }, {
            id: "fee_type_name",
            name: "费用项目名称",
            field: "fee_type_name",
            width: 180,
            type:"string"
        }, {
            id: "fee_type_level",
            name: "费用项目层级",
            field: "fee_type_level",
            width: 100,
            options: [],
            formatter: Slick.Formatters.SelectOption,
            type:"list"

        }, {
            id: "period_type",
            name: "预算期间类别",
            field: "period_type",
            width: 100,
            formatter: Slick.Formatters.SelectOption,
            type:"list"
        }, {
            id: "feenames",
            name: "包含费用项目",
            width: 200,
            field: "feenames",
            type:"string"
        }, {
            id: "description",
            name: "描述",
            field: "description",
            width: 170,
            type:"string"
        }, {
            id: "is_control_bud",
            name: "受预算控制",
            field: "is_control_bud",
            width: 100,
            options: [
                {value: "1", desc: '否'},
                {value: "2", desc: '是'}],
            formatter: Slick.Formatters.SelectOption,
            type:"list"
        },
    ];

    //定义网格字段（详情）
    $scope.lineGridColumns = [
        {
            id: "seq",
            name: "序号",
            behavior: "select",
            field: "seq",
            width: 70,
        }, {
            name: "操作",
            width: 100,
            formatter: editButtons
        }, {
            id: "object_code",
            name: "费用类别或项目编码",
            field: "object_code",
            width: 150,
        }, {
            id: "object_name",
            name: "费用类别或项目名称",
            field: "object_name",
            width: 200
        }, {
            id: "object_type",
            name: "分类",
            field: "object_type",
            width: 150,
            options: [
                {value: "1", desc: '费用类别'},
                {value: "2", desc: '费用项目'}],
            formatter: Slick.Formatters.SelectOption
        }
    ];

    //网格初始化
    $scope.headerGridView = new Slick.Grid("#headergrid", [], $scope.headerGridColumns, $scope.headerGridOptions);

    //明细网格
    $scope.lineGridView = new Slick.Grid("#linegrid", [], $scope.lineGridColumns, $scope.lineGridOptions);

    /**系统词汇查询***/

    //查询方法
    function searchdicts(dictname, grid, gridcolumns, columnname) {
        var dictdata = [];
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: dictname})
            .then(function (data) {
                var dicts = [];
                for (var i = 0; i < data.dicts.length; i++) {
                    dicts[i] = {
                        value: data.dicts[i].dictvalue,
                        desc: data.dicts[i].dictname,
                        id: parseInt(data.dicts[i].dictvalue),
                        name: data.dicts[i].dictname
                    };
                    dictdata.push(dicts[i]);
                }
                if ($scope.getIndexByField(columnname, dictname)) {
                    gridcolumns[$scope.getIndexByField(columnname, dictname)].options = dicts;
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

    $scope.period_types = searchdicts('period_type', $scope.headerGridView, $scope.headerGridColumns, 'headerGridColumns')
    $scope.fee_type_levels = searchdicts('fee_type_level', $scope.headerGridView, $scope.headerGridColumns, 'headerGridColumns')

    /**
     * 主表网格点击事件
     * @param e
     * @param args
     */
    function gridHeaderOnClick(e, args) {
        if ($(e.target).hasClass("viewbtn")) {
            viewDetail(e, args);
            e.stopImmediatePropagation();
        }
        //点击删除按钮处理事件
        else if ($(e.target).hasClass("delbtn")) {
            var dg = $scope.headerGridView;
            var rowidx = args.row;
            var postData = {};
            postData.bud_type_id = args.grid.getDataItem(args.row).bud_type_id;
            BasemanService.swalDelete("删除", "确定要删除该类别吗？", function (bool) {
                if (bool) {
                    BasemanService.RequestPost("fin_bud_type_header", "delete", JSON.stringify(postData))
                        .then(function (data) {
                            dg.getData().splice(rowidx, 1);
                            dg.invalidateAllRows();
                            dg.render();
                        }).then(function () {
                        swal("删除!", "您已成功删除该类别!", "success");
                    }, function () {
                        swal("出错!", "删除时出现错误!", "error");
                    })
                }
            })
            e.stopImmediatePropagation();
        }
    };

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

    //双击查看详情
    $scope.headerGridView.onDblClick.subscribe(viewDetail);
    //主表网格绑定点击事件
    $scope.headerGridView.onClick.subscribe(gridHeaderOnClick);
    //明细绑定点击事件
    $scope.lineGridView.onClick.subscribe(dgLineClick);

    /**
     * 查询详情
     * @param args
     */
    function viewDetail(e, args) {
        var postData = {};
        postData.bud_type_id = args.grid.getDataItem(args.row).bud_type_id;
        postData.fee_type_id = args.grid.getDataItem(args.row).fee_type_id;
        //调用后台select方法查询详情
        BasemanService.RequestPost("fin_bud_type_header", "select", JSON.stringify(postData))
            .then(function (data) {
                $scope.data.currItem = data;
                $scope.lineGridView.setData([]);
                if ($scope.data.currItem.fin_bud_type_lineoffin_bud_type_headers) {
                    $scope.lineGridView.setData($scope.data.currItem.fin_bud_type_lineoffin_bud_type_headers);
                    $scope.data.currItem.maxseq = parseInt($scope.data.currItem.fin_bud_type_lineoffin_bud_type_headers[$scope.data.currItem.fin_bud_type_lineoffin_bud_type_headers.length - 1].seq);
                }
                $scope.lineGridView.render();
                //显示模态页面
                $("#detailModal").modal();
            });
    };
    /**
     * 条件查询
     */
    $scope.searchBySql = function () {
        $scope.FrmInfo = {
            title: "",
            thead: [],
            url: "/jsp/req.jsp",
            direct: "center",
            sqlBlock: "",
            backdatas: "fin_bud_type_header",
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
        BasemanService.open(CommonPopController1, $scope).result.then(function (result) {
            $scope.sqlwhere = result;
            $scope.searchData()
        })
    }
    /**
     * 查询数据
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
        if($scope.sqlwhere && $scope.sqlwhere != ""){
            postdata.sqlwhere = $scope.sqlwhere;
        }
        BasemanService.RequestPost("fin_bud_type_header", "search", postdata)
            .then(function (data) {
                //清空网格
                $scope.headerGridView.setData([]);
                //设置数据
                $scope.headerGridView.setData(data.fin_bud_type_headers);
                //重绘网格
                $scope.headerGridView.render();
                BaseService.pageInfoOp($scope, data.pagination);
            });
    }


    /**
     * 删除明细网格行
     */
    $scope.delLineRow = function (args) {
        var name = args.grid.getDataItem(args.row).object_name;
        var dg = $scope.lineGridView;
        BasemanService.swalDelete("删除", "确定要删除该明细吗？", function (bool) {
            if (bool) {
                $scope.data.currItem.maxseq = 0;
                dg.getData().splice(args.row, 1);
                $.each(dg.getData(), function (i, n) {
                    n.seq = parseInt(n.seq);
                    n.seq = $scope.data.currItem.maxseq + 1;
                    $scope.data.currItem.maxseq += 1;
                })
                dg.invalidateAllRows();
                dg.render();
            } else {
                return
            }
        });
    };

    function checkNull() {
        var str = ""
        var flag = true;
        if ($scope.data.currItem.fee_type_code == null) {
            str += "请添加费用大类";
            flag = false
        }
        if ($scope.data.currItem.fee_type_level == null) {
            str += "\n 请添加费用项目层级";
            flag = false
        }
        if ($scope.data.currItem.period_type == null) {
            str += "\n 请添加预算期间类别";
            flag = false
        }
        $scope.str = str
        return flag;
    }

    /**
     *添加明细行
     */
    $scope.addLineRow = function () {
        if (!checkNull()) {
            BasemanService.swal("提示", $scope.str)
            return
        } else {
            $scope.FrmInfo = {
                title: "费用类别或项目查询",
                thead: [{
                    name: "费用类别或项目编码",
                    code: "object_code"
                }, {
                    name: "费用类别或项目名称",
                    code: "object_name"
                }, {
                    name: "备注",
                    code: "note"
                }],
                type: "checkbox",
                classid: "fin_fee_type_obj",
                url: "/jsp/req.jsp",
                direct: "center",
                sqlBlock: "",
                backdatas: "fin_fee_type_objs",
                ignorecase: "true", //忽略大小写
                postdata: {
                    idpath: $scope.data.currItem.idpath,
                    lev: $scope.data.currItem.fee_type_level,
                    flag: 1,
                    fee_type_id: $scope.data.currItem.fee_type_id
                },
                searchlist: ["object_code", "object_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.lineGridView.setData([]);
                if ($scope.data.currItem.fin_bud_type_lineoffin_bud_type_headers) {
                    $.each(result, function (i, item) {                                             // 遍历用户选中的项目
                        var flag = false
                        for (var j = 0; j < $scope.data.currItem.fin_bud_type_lineoffin_bud_type_headers.length; j++) {
                            if ($scope.data.currItem.fin_bud_type_lineoffin_bud_type_headers[j] && $scope.data.currItem.fin_bud_type_lineoffin_bud_type_headers[j].object_code === item.object_code) {
                                flag = true;
                                break;
                            }
                        }
                        if (flag == false) {
                            item.seq = $scope.data.currItem.maxseq += 1;
                            $scope.data.currItem.fin_bud_type_lineoffin_bud_type_headers.push(item);
                        }
                    })
                    // $scope.data.currItem.fin_bud_type_lineoffin_bud_type_headers.push(result);
                    // $scope.data.currItem.fin_bud_type_lineoffin_bud_type_headers[$scope.data.currItem.fin_bud_type_lineoffin_bud_type_headers.length - 1].seq = $scope.data.currItem.maxseq += 1;
                    $scope.lineGridView.setData($scope.data.currItem.fin_bud_type_lineoffin_bud_type_headers);
                }
                $scope.lineGridView.render();
            })
        }
    };

    /**
     * 弹出新增页面
     */
    $scope.addBudType = function () {
        $scope.data.currItem = {
            "bud_type_id": 0,
            "is_control_bud": 2,
            "is_change_fee": 1,
            "usable": 2,
            "is_resource" : 1,
            fin_bud_type_lineoffin_bud_type_headers: []
        };
        $scope.data.currItem.maxseq = 0;
        $scope.lineGridView.setData($scope.data.currItem.fin_bud_type_lineoffin_bud_type_headers);
        $scope.lineGridView.render();
        //显示模态页面
        $("#detailModal").modal();
    }

    /**
     * 监控费用层级下拉选中值,层级改变时清空明细,避免层级不一致
     */
    $scope.changelevel = function () {
        var dg = $scope.lineGridView;
        dg.getData().splice(0, dg.getData().length);
        dg.invalidateAllRows();
        dg.render();
    }
    /**
     * 保存数据
     */
    $scope.saveData = function () {
        if ($scope.lineGridView.getCellEditor() != undefined) {
            $scope.lineGridView.getCellEditor().commitChanges();
        }
        if (FormValidatorService.validatorFrom($scope, "#addForm")) {
            if ($scope.data.currItem.fin_bud_type_lineoffin_bud_type_headers[0] == null) {
                swal("警告", "明细行不能为空!", "error");
                return
            }
            var action = "insert";
            if ($scope.data.currItem.bud_type_id > 0) {
                action = "update";
            }
            //调用后台select方法查询详情
            BasemanService.RequestPost("fin_bud_type_header", action, JSON.stringify($scope.data.currItem))
                .then(function () {
                    $scope.data.currItem.maxseq = 0;
                    BasemanService.swalSuccess("成功", "保存成功!");
                    $scope.searchData();
                    $("#detailModal").modal('hide');
                });
        }
    }

    //费用大类类别查询
    $scope.feeTypeSearch = function () {
        $scope.FrmInfo = {
            title: "费用类别查询",
            thead: [{
                name: "费用类别编码",
                code: "fee_type_code"
            }, {
                name: "费用类别名称",
                code: "fee_type_name"
            }, {
                name: "备注",
                code: "note"
            }],
            classid: "fin_fee_type",
            url: "/jsp/budgetman.jsp",
            direct: "center",
            sqlBlock: "",
            backdatas: "fin_fee_types",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: 30,
                sqlwhere: " fin_fee_type.usable=2 and fin_fee_type.lev=1 "
            },
            searchlist: ["sqlwhere", "maxsearchrltcmt"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.fee_type_code = result.fee_type_code;
            $scope.data.currItem.fee_type_name = result.fee_type_name;
            $scope.data.currItem.fee_type_id = result.fee_type_id;
            $scope.data.currItem.lev = result.lev;
            $scope.data.currItem.idpath = result.idpath;
        })
    };
    //gird自适应高度
    BasemanService.initGird();

    //初始化分页
    BaseService.pageGridInit($scope);

}

//注册控制器s
angular.module('inspinia')
    .controller('fin_bud_type_header', fin_bud_type_header)



