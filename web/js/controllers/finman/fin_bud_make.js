/**这是预算编制界面js*/
function fin_bud_make($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {

    //设置标题
    $scope.headername = "预算编制";


    //预留存储
    $scope.data = {};
    var gridData = {};
    var active = "";
    var currItem = "";
    //储存条件
    $scope.data.currItem = {};
    //储存点击网格
    $scope.data.currGrid = {};
    //页面数据绑定
    $scope.data.currItem.bud_year = new Date().getFullYear();
    $scope.data.currItem.bud_type_code = "";
    $scope.data.currItem.bud_type_name = "";

    $scope.data.bud_type_id = "";
    $scope.data.period_type = "";

    $scope.budData = [];

    //判断是否加载过deptgrid
    var isDept = false;



    //查询下载导入格式文件id
    BasemanService.RequestPostAjax("scpsysconf", "selectref", {})
        .then(function (data) {
            var budtmpdocid = "";
            $.each(data.sysconfs,function (i,item) {
                if(item.confname == 'budtmpdocid'){
                    budtmpdocid = item.confvalue
                }
            })
            $("#budtmpdocid").attr("href","/downloadfile?docid="+budtmpdocid);
        });

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


    //费用项目
    $scope.object_ids = [];
    $scope.data.currItem.object_id = "";


    //定义网格字段
    $scope.deptColumns = [
        {
            id: "dept_code",
            name: "机构编码",
            field: "dept_code",
            width: 90
        }, {
            id: "dept_name",
            name: "机构名称",
            field: "dept_name",
            width: 160,
        }
    ];
    //网格设置
    $scope.deptOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: true,
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
            id: "bud_amt",
            name: "年初预算",
            field: "bud_amt",
            width: 130,
            editor: Slick.Editors.Text,//可编辑
            cssClass:"amt",
            formatter: Slick.Formatters.Money,
        },{
            id: "last_settle_amt",
            name: "上期结转金额",
            field: "last_settle_amt",
            width: 130,
            cssClass:"amt",
            formatter: Slick.Formatters.Money,
        }, {
            id: "adjust_amt",
            name: "本期调整金额",
            field: "adjust_amt",
            width: 130,
            cssClass:"amt",
            formatter: Slick.Formatters.Money,
        }, {
            id: "keeped_amt",
            name: "本期已占用金额",
            field: "keeped_amt",
            width: 130,
            cssClass:"amt",
            formatter: Slick.Formatters.Money,
        }, {
            id: "used_amt",
            name: "本期已使用金额",
            field: "used_amt",
            width: 130,
            cssClass:"amt",
            formatter: Slick.Formatters.Money,
        }, {
            id: "canuse_amt",
            name: "本期可使用的金额",
            field: "canuse_amt",
            width: 130,
            cssClass:"amt",
            formatter: Slick.Formatters.Money,
        },{
            id: "settle_amt",
            name: "本期可结转金额",
            field: "settle_amt",
            width: 130,
            cssClass:"amt",
            formatter: Slick.Formatters.Money,
        }, {
            id: "usable",
            name: "已结转",
            field: "usable",
            width: 60,
            options: [
                {value: "1", desc: "是"},
                {value: "2", desc: "否"},
            ],
            formatter: Slick.Formatters.SelectOption,
            cssClass:"uid"
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
    $scope.budGrid.onCellChange.subscribe(budChange);


    //dept双击事件
    function deptDblClick(e, args) {
        currItem = args;
        $scope.data.org_id = args.grid.getDataItem(args.row).dept_id;
        $scope.data.org_code = args.grid.getDataItem(args.row).dept_code;
        $scope.data.org_name = args.grid.getDataItem(args.row).dept_name;
        BasemanService.RequestPost("fin_bud", "search", {
            "sqlwhere": " Fin_Bud.Bud_Year=" + $scope.data.currItem.bud_year +
            " and Fin_Bud.bud_type_id=" + $scope.data.bud_type_id +
            " and Fin_Bud.Item_Type_Id=0 and Fin_Bud.Object_Id=" + $scope.data.currItem.object_id +//查费用项目
            " and Fin_Bud.Org_Id=" + args.grid.getDataItem(args.row).dept_id
        })
            .then(function (result) {
                if (result.fin_buds.length != 0) {
                    returnGrid(result.fin_buds);
                    active = "update";
                } else {
                    BasemanService.RequestPost("fin_bud_period_header", "search", {
                        "sqlwhere": " Fin_Bud_Period_Header.Period_Year=" + $scope.data.currItem.bud_year +
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
                                    returnGrid(result.fin_bud_period_lineoffin_bud_period_headers);
                                    active = "insert";
                                });
                        });
                }
            });
    }

    //生成表格
    function returnGrid(datas) {
        $scope.budData = datas.slice(0);
        $.each($scope.budData, function (i, item) {
            if (!item.bud_amt) {
                item.bud_amt = 0;
            }
            if (!item.fact_amt) {
                item.fact_amt = 0;
            }
            if (!item.last_settle_amt) {
                item.last_settle_amt = 0;
            }
            if (!item.adjust_amt) {
                item.adjust_amt = 0;
            }
            if (!item.keeped_amt) {
                item.keeped_amt = 0;
            }
            if (!item.used_amt) {
                item.used_amt = 0;
            }
            if (!item.canuse_amt) {
                item.canuse_amt = 0;
            }
            if (!item.amiss_amt) {
                item.amiss_amt = 0;
            }
            if (!item.settle_amt) {
                item.settle_amt = 0;
            }
            if (item.usable == 0) {
                item.usable = "2";
            }
        });

        //生成合计行
        /*var row=returnEach(datas);
         $scope.budData.push(row);*/

        $scope.budGrid.setData([]);

        var dataProvider = new TotalsDataProvider($scope.budData, $scope.budColumns);
        $scope.budGrid.setData(dataProvider);

        $scope.budGrid.render();
    }


    //bud改变事件
    function budChange(e, args) {
        var row = $scope.budData[args.row];

        //设置期初=实际,使差额始终=0
        row.fact_amt=row.bud_amt;

        //修改年初预算bud_amt
        //本期可使用金额= 上期结转金额+年初本期预算+本期调整-本期已使用-本期已保留
        row.canuse_amt = row.last_settle_amt + row.bud_amt + row.adjust_amt - row.keeped_amt - row.used_amt;
        //修改本期实际预算fact_amt
        //本期实际与年度预算的差额=本期实际预算-年初预算
        row.amiss_amt = row.fact_amt - row.bud_amt;

        //本期可结转金额=本期可使用的金额+差额
        row.settle_amt = row.canuse_amt+row.amiss_amt;


        $scope.budGrid.setData([]);

        returnGrid($scope.budData);
    }


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
                sqlwhere: " Fin_Bud_Type_Header.Usable=2 and Fin_Bud_Type_Header.Org_Level<>5 "
            },
            searchlist: ["bud_type_name","bud_type_code","fee_type_level","period_type"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.bud_type_id = result.bud_type_id;
            $scope.data.period_type = result.period_type;

            //执行$watch要放在objec_id查询之后
            // $scope.data.currItem.bud_type_code = result.bud_type_code;
            $scope.data.currItem.bud_type_name = result.bud_type_name;

            BasemanService.RequestPost(
                "fin_bud_type_header", "select",
                {
                    "bud_type_id": $scope.data.bud_type_id
                }
            ).then(function (result) {
                    /*
                     $scope.data.currItem.object_name = result.fin_bud_type_lineoffin_bud_type_headers[0].object_name;
                     $scope.data.currItem.object_id = result.fin_bud_type_lineoffin_bud_type_headers[0].object_id;
                     $scope.data.currItem.object_code = result.fin_bud_type_lineoffin_bud_type_headers[0].object_code;
                     $scope.data.currItem.object_type = result.fin_bud_type_lineoffin_bud_type_headers[0].object_type;
                     */

                    $scope.object_ids = [];
                    $scope.data.currItem.object_id = "";
                    $.each(result.fin_bud_type_lineoffin_bud_type_headers, function (i, item) {
                        $scope.object_ids[i] = item;
                        $scope.object_ids[i].name = item.object_name;
                        $scope.object_ids[i].id = item.object_id;
                    });
                    //默认选择第一个费用项目
                    $scope.data.currItem.object_id = result.fin_bud_type_lineoffin_bud_type_headers[0].object_id;

                    //执行$watch  在数组中的bud_type_code都一样
                    $scope.data.currItem.bud_type_code = result.fin_bud_type_lineoffin_bud_type_headers[0].bud_type_code;

                    deptSearch();
                }
            );
        });
    };
    //查询deptGrid
    function deptSearch() {
        //判断是否为第一次加载
        if (isDept) {
            return;
        }
        isDept = true;

        //查询机构
        BasemanService.RequestPost("dept", "search", {})
            .then(function (result) {
                //清空网格
                $scope.deptGrid.setData([]);
                //设置数据
                $scope.deptGrid.setData(result.depts, false);
                //重绘网格
                $scope.deptGrid.render();
            });
    }

    //保存按钮
    $scope.saveBtn = function () {
        //退出编辑状态
        if ($scope.budGrid.getCellEditor() != undefined) {
            $scope.budGrid.getCellEditor().commitChanges();
        }

        if (active == "") {
            // alert("请先选择预算");
            BasemanService.swalError("错误", "请先选择预算");
            return;
        }
        var fin_budoffin_bud = [];
        $.each($scope.budData, function (i, item) {
            //要考虑使用预算期间添加时,后台未传回以下数据,只能从页面获取
            var row = item;
            row.bud_year = $scope.data.currItem.bud_year;
            row.bud_type_id = $scope.data.bud_type_id;
            row.bud_type_code = $scope.data.currItem.bud_type_code;
            row.bud_type_name = $scope.data.currItem.bud_type_name;
            row.period_type = $scope.data.period_type;

            $.each($scope.object_ids, function (i, item) {
                if ($scope.data.currItem.object_id == item.object_id) {
                    row.object_id = item.object_id;
                    row.object_type = item.object_type;
                    row.object_code = item.object_code;
                    row.object_name = item.object_name;
                }
            });

            row.org_id = $scope.data.org_id;
            row.org_code = $scope.data.org_code;
            row.org_name = $scope.data.org_name;
            if (active == "update") {
                row.bud_id = item.bud_id;
            }
            fin_budoffin_bud.push(row);
        });
        var data = {
            "bud_year": $scope.data.currItem.bud_year,
            "bud_type_id": $scope.data.bud_type_id,
            "bud_type_code": $scope.data.currItem.bud_type_code,
            "bud_type_name": $scope.data.currItem.bud_type_name,
            "period_type": $scope.data.period_type,
            "object_type": $scope.data.currItem.object_type,
            "object_id": $scope.data.currItem.object_id,
            "object_code": $scope.data.currItem.object_code,
            "object_name": $scope.data.currItem.object_name,
            "org_id": $scope.data.org_id,
            "org_code": $scope.data.org_code,
            "org_name": $scope.data.org_name,
            "crm_entid" : 0
        };
        data.fin_budoffin_buds = fin_budoffin_bud;

        BasemanService.RequestPost("fin_bud", "batchupdate", JSON.stringify(data))
            .then(function (result) {
                if (result.fin_budoffin_buds.length != 0) {
                    // alert("保存成功");
                    BasemanService.swalSuccess("成功", "保存成功", function () {
                        var sqlwhere = {
                            "sqlwhere": " Fin_Bud.Bud_Year=" + $scope.data.currItem.bud_year +
                            " and Fin_Bud.bud_type_id=" + $scope.data.bud_type_id +
                            " and Fin_Bud.Item_Type_Id=0 and Fin_Bud.Object_Id=" + $scope.data.currItem.object_id +
                            " and Fin_Bud.Org_Id=" + $scope.data.org_id
                        };
                        BasemanService.RequestPost("fin_bud", "search", JSON.stringify(sqlwhere))
                            .then(function (result) {
                                returnGrid(result.fin_buds);
                            });
                    });
                } else {
                    deptDblClick(0, currItem);
                }
            });
    };

    //刷新表格
    $scope.f5=function () {
        if(currItem=="") {
            BasemanService.swalError("错误", "请先选择预算");
            return;
        }
        deptDblClick(0, currItem);
    };


    //页面数据改变事件
    //年度
    $scope.$watch("data.currItem.bud_year", function (newVal, oldVal) {
        if (currItem != "" && $scope.data.currItem.bud_type_code != "") {
            deptDblClick(0, currItem);
        }
    });
    //预算类别,预算类别变时,清空-加载费用项目,不需要监视
    $scope.$watch("data.currItem.bud_type_code", function (newVal, oldVal) {
        if (currItem != "" && $scope.data.currItem.bud_year != "" && oldVal != "") {
             deptDblClick(0, currItem);
        }
     });
    //费用项目
    $scope.$watch("data.currItem.object_id", function (newVal, oldVal) {
        if (currItem != "" && $scope.data.currItem.bud_year != "" && newVal != "") {
            deptDblClick(0, currItem);
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


                    }
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
                    data: {"classname": "com.ajerp.budget.Fin_Bud", "funcname": "doInsertBudDataFromExcel"},
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

    IncRequestCount()
    DecRequestCount()
}

//注册控制器
angular.module("inspinia")
    .controller("fin_bud_make", fin_bud_make);

