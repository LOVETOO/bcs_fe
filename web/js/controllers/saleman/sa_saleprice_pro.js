
var param = {};
function setData(e){
    param = e;
}

function sa_saleprice_pro($scope, BaseService, BasemanService,$stateParams) {
    $scope.data = {"objtypeid": 1001, wftemps: [], bSubmit: false};
    $scope.data.currItem = {"objattachs": [], "sa_saleprice_head_id": $stateParams.id};
    $scope.data.addCurrItem = {};
    var activeRow = [];
    var isEdit = 0;

    IncRequestCount();
    DecRequestCount();

    $scope.is_cancellations = [
        {id: 1, name: "否"},
        {id: 2, name: "是"}
    ];

    $scope.billStats = [];

    //词汇表单据状态取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            $scope.billStats = data.dicts;
            HczyCommon.stringPropToNum(data.dicts);
        });


    // 添加按钮
    var editlineButtons = function (row, cell, value, columnDef, dataContext) {
        if ($scope.data.currItem.stat != 1) {
            return;
        } else {
            return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>编辑</button> " +
                " <button class='btn btn-sm btn-info dropdown-toggle delbtn' " +
                "style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;' >删除</button> ";
        }
    };


    //明细表网格设置
    $scope.lineOptions = {
        editable: true,
        enableAddRow: false,
        enableCellNavigation: true,
        asyncEditorLoading: false,
        autoEdit: true,
        rowHeight: 30
    };


    //明细表网格列属性
    $scope.lineColumns = [
        {
            name: "序号",
            id: "seq",
            field: "seq",
            width: 40
        }, {
            name: "操作",
            id: "op",
            field: "op",
            width: 100,
            formatter: editlineButtons
        }, {
            name: "产品编码",
            id: "item_code",
            field: "item_code",
            width: 150
        }, {
            name: "产品名称",
            id: "item_name",
            field: "item_name",
            width: 200
        }, {
            name: "价格类型编码",
            id: "saleprice_type_code",
            field: "saleprice_type_code",
            width: 100
        }, {
            name: "价格类型名称",
            id: "saleprice_type_name",
            field: "saleprice_type_name",
            width: 150
        }, {
            name: "单位",
            id: "uom_name",
            field: "uom_name",
            width: 50,
            options: [],
            formatter: Slick.Formatters.SelectOption
        }, {
            name: "生效日期",
            id: "start_date",
            field: "start_date",
            width: 100,
            formatter: Slick.Formatters.Date
        }, {
            name: "失效日期",
            id: "end_date",
            field: "end_date",
            width: 100,
            formatter: Slick.Formatters.Date
        }, {
            name: "开单价",
            id: "price_bill",
            field: "price_bill",
            width: 100,
            formatter: Slick.Formatters.Money,
            cssClass: "amt"
        },
        // {
        //     name: "底价/结算价",
        //     id: "inside_balance_price",
        //     field: "inside_balance_price",
        //     width: 100,
        //     formatter: Slick.Formatters.Money
        // },
        {
            name: "备注",
            id: "remark",
            field: "remark",
            width: 100
        }
    ];


    //初始化网格
    $scope.lineGridView = new Slick.Grid("#lineViewGrid", [], $scope.lineColumns, $scope.lineOptions);
    //明细绑定点击事件
    $scope.lineGridView.onClick.subscribe(dgLineClick);
    $scope.lineGridView.onDblClick.subscribe(dgLineDblClick);

    /**
     * 明细网格点击事件
     * @param e
     * @param args
     */
    function dgLineClick(e, args) {
        activeRow = args.grid.getDataItem(args.row);
        if ($(e.target).hasClass("viewbtn")) {
            $scope.editLine(e, args);
            e.stopImmediatePropagation();

        }
        if ($(e.target).hasClass("delbtn")) {
            $scope.delLineRow(args);
            e.stopImmediatePropagation();
        }
    };

    /**
     * 明细网格双击事件
     */
    function dgLineDblClick(e, args) {
        if ($scope.data.currItem.stat == 1) {
            $scope.editLine(e, args);
        }
    }


    /**
     * 删除明细网格行
     */
    $scope.delLineRow = function (args) {
        var item_name = args.grid.getDataItem(args.row).item_name;
        BasemanService.swalWarning("删除", "确定要删除产品 " + item_name + " 吗？", function (bool) {
            if (bool) {
                var dg = $scope.lineGridView;
                dg.getData().splice(args.row, 1);
                dg.invalidateAllRows();
                dg.render();
            } else {
                return;
            }
        })
    };

    /**
     * 加载网格数据
     */
    function setGridData(gridView, datas) {
        gridView.setData([]);
        //加序号
        if (datas.length > 0) {
            for (var i = 0; i < datas.length; i++) {
                datas[i].seq = i + 1;
            }
        }
        //设置数据
        gridView.setData(datas);
        //重绘网格
        gridView.render();
    }

    /**
     * 增加/编辑明细事件
     */
    $scope.addLine = function () {
        isEdit = 2;
        $scope.data.addCurrItem = {customer_id:0,base_currency_id:1,saleprice_type_name:$scope.data.currItem.saleprice_type_name,
            sa_saleprice_type_id:$scope.data.currItem.sa_saleprice_type_id,saleprice_type_code:$scope.data.currItem.saleprice_type_code,
            start_date:$scope.data.currItem.start_date,end_date:$scope.data.currItem.end_date,entorgcode:$scope.data.currItem.entorgcode
            ,entorgname:$scope.data.currItem.entorgname};
        $("#addLineModal").modal();
    };


    var idx = -1;
    $scope.editLine = function (e, args) {
        isEdit = 1;
        idx = args.row;
        $scope.data.addCurrItem = $scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads[idx];
        HczyCommon.stringPropToNum($scope.data.addCurrItem);
        $("#addLineModal").modal();
        $scope.$apply();
    }


    /**
     * 保存明细到网格中
     */
    $scope.saveAddData = function () {
        if(isEdit==2){
            $scope.data.addCurrItem.seq = $scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads.length+1;
            $scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads.push($scope.data.addCurrItem);
        }
        $scope.lineGridView.invalidateAllRows();
        $scope.lineGridView.render();
        $("#addLineModal").modal("hide");
    }

    /**
     * 保存数据
     */
    $scope.saveData = function (bsubmit) {
        var action = param.action;

        if (action == "update") {
            //调用后台保存方法
            BasemanService.RequestPost("sa_saleprice_head", action, JSON.stringify($scope.data.currItem))
                .then(function (data) {
                    BasemanService.swalSuccess("成功", "保存成功！");
                    if (bsubmit) {
                        if (angular.element('#wfinspage').length == 0) {
                            $("#wfinsform").append("<iframe id='wfinspage' style='width: 100%;height: 100%;background-color: #e2e5ec;'></iframe>");
                        }
                        $scope.initWfIns(true);
                        $('#detailtab a:last').tab('show');
                    }
                });
        }
        if (action == "insert") {
            $scope.data.currItem.is_advance = 1;
            BasemanService.RequestPost("sa_saleprice_head", action, JSON.stringify($scope.data.currItem))
                .then(function (data) {
                    BasemanService.swalSuccess("成功", "保存成功！");
                    //添加成功后框不消失直接Select方法查该明细
                    $scope.data.currItem.sa_saleprice_head_id = data.sa_saleprice_head_id;
                    $scope.init();
                    //如果是保存并提交则提交流程
                    if (bsubmit) {
                        $('#detailtab a:last').tab('show');
                        if (angular.element('#wfinspage').length == 0) {
                            $("#wfinsform").append("<iframe id='wfinspage' style='width: 100%;height: 100%;background-color: #e2e5ec;'></iframe>");
                        }
                        $scope.initWfIns(true);
                    }
                    isEdit = 0;
                });

        }
    }

    /**
     * 查询详情
     * @param args
     */
    $scope.init = function () {
        if ($scope.data.currItem.sa_saleprice_head_id > 0) {
            //调用后台select方法查询详情
            BasemanService.RequestPost("sa_saleprice_head", "select", JSON.stringify({"sa_saleprice_head_id": $scope.data.currItem.sa_saleprice_head_id}))
                .then(function (data) {
                    $scope.data.currItem = data;
                    $scope.data.currItem.start_date = $scope.data.currItem.start_date.substring(0, $scope.data.currItem.start_date.indexOf(" "));
                    $scope.data.currItem.end_date = $scope.data.currItem.end_date.substring(0, $scope.data.currItem.end_date.indexOf(" "));

                    //金额加千分号
                    //$scope.data.currItem.total_apply_amt = HczyCommon.formatMoney($scope.data.currItem.total_apply_amt, 2);
                    setGridData($scope.lineGridView,$scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads);
                    $scope.lineGridView.render();
                    if($scope.data.currItem.stat>1) BasemanService.hiddenColumns($scope.lineGridView,["op"]);
                });
        } else {
            $scope.data.currItem = {
                "sa_saleprice_head": 0,
                "stat": 1,
                "date_invbill": new Date().format("yyyy-MM-dd hh:mm:ss"),
                "start_date": new Date().format("yyyy-MM-dd"),
                "end_date":"9999-12-31",
                sa_saleprice_lineofsa_saleprice_heads: []
            };
            setGridData($scope.lineGridView,$scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads);
        }
    };

    /**
     * 日期格式化方法
     * @param fmt
     * @returns {*}
     */
    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1,                 //月份
            "d+": this.getDate(),                    //日
            "h+": this.getHours(),                   //小时
            "m+": this.getMinutes(),                 //分
            "s+": this.getSeconds(),                 //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }

    /**
     * 触发上传文件
     */
    $scope.addFile = function () {
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
                    url: "/web/scp/filesuploadsave2.do",
                    type: 'post',
                    secureuri: false,
                    fileElementId: 'file1',//file标签的id
                    dataType: 'text',//返回数据的类型
                    success: function (data, status) {
                        console.log(data);
                        data = JSON.parse($(data)[0].innerText);
                        if (data.data) {
                            if (!$scope.data.currItem.objattachs) {
                                $scope.data.currItem.objattachs = [];
                            }
                            $scope.data.currItem.objattachs.push({
                                "docid": data.data[0].docid + "",
                                "docname": data.data[0].docname,
                                "url": window.URL.createObjectURL(o.target.files[0])
                            });
                            $scope.$apply();
                        }
                    },
                    error: function (data, status, e) {
                        console.log(data);
                    }
                });
            } finally {
                // $showMsg.loading.close();
            }
        }
    }

    /**
     * 下载文件
     * @param file
     */
    $scope.downloadAttFile = function (file) {
        window.open("/downloadfile.do?docid=" + file.docid);
    }
    /**
     * 删除文件
     * @param file
     */
    $scope.deleteFile = function (file) {
        console.log("deleteFile...")
        if (file && file.docid > 0) {
            for (var i = 0; i < $scope.data.currItem.objattachs.length; i++) {
                if ($scope.data.currItem.objattachs[i].docid == file.docid) {
                    $scope.data.currItem.objattachs.splice(i, 1);
                    break;
                }
            }
        }
    }

    /**
     * 流程实例初始化
     */
    $scope.initWfIns = function (bSubmit) {
        HczyCommon.stringPropToNum($scope.data.currItem);
        //制单后才显示流程
        if ($scope.data.currItem.sa_saleprice_head_id && $scope.data.currItem.sa_saleprice_head_id > 0) {
            if ($scope.data.currItem.wfid && $scope.data.currItem.wfid > 0) {
                if (angular.element('#wfinspage').attr('src') != '/index.jsp#/crmman/wfins//' + $scope.data.currItem.wfid + '/' + $scope.data.objtypeid + '/' + $scope.data.currItem.sa_saleprice_head_id + '/0?showmode=2') {
                    angular.element('#wfinspage').attr('src', '/index.jsp#/crmman/wfins//' + $scope.data.currItem.wfid + '/' + $scope.data.objtypeid + '/' + $scope.data.currItem.sa_saleprice_head_id + '/0?showmode=2');
                }
            } else if ($scope.data.currItem.stat == 1) {
                $scope.data.bSubmit = bSubmit;
                $scope.getWfTempId($scope.data.objtypeid);
            }
        }
    }

    $scope.onTabChange = function (e) {
        // 获取已激活的标签页的名称
        var tabName = $(e.target).text();
        if ('流程' == tabName) {
            if (angular.element('#wfinspage').length == 0) {
                $("#wfinsform").append("<iframe id='wfinspage' style='width: 100%;height: 100%;background-color: #e2e5ec;'></iframe>");
            }
            $scope.initWfIns();
        }
    }

    /**
     * 获取流程模版ID
     * @param objtypeid
     */
    $scope.getWfTempId = function (objtypeid) {
        var iWftempId = 0;
        var postData = {
            "objtypeid": objtypeid
        }
        BasemanService.RequestPost("scpobjconf", "select", JSON.stringify(postData))
            .then(function (data) {
                if (data.objwftempofobjconfs && data.objwftempofobjconfs.length > 1) {
                    for (var i = data.objwftempofobjconfs.length - 1; i > -1; i--) {
                        //条件过滤
                        if (data.objwftempofobjconfs[i].execcond != '') {
                            //用正则表达式替换变量
                            var regexp = new RegExp("<item>", "gm");
                            var sexeccond = data.objwftempofobjconfs[i].execcond.replace(regexp, "$scope.data.currItem");
                            //运行表达式 不符合条件的移除
                            if (!eval(sexeccond)) {
                                data.objwftempofobjconfs.splice(i, 1);
                            }
                        }
                    }

                    if (data.objwftempofobjconfs && data.objwftempofobjconfs.length > 1) {
                        $scope.data.wftemps = data.objwftempofobjconfs;
                        //弹出模态框供用户选择
                        $("#selectWfTempModal").modal();
                    } else if (data.objwftempofobjconfs && data.objwftempofobjconfs.length == 1) {
                        $scope.selectWfTemp(data.objwftempofobjconfs[0].wftempid);
                    }
                } else if (data.objwftempofobjconfs && data.objwftempofobjconfs.length == 1) {
                    $scope.selectWfTemp(data.objwftempofobjconfs[0].wftempid);
                }
            });
    }

    /**
     * 选择流程模版ID
     * @param wftempid
     */
    $scope.selectWfTemp = function (wftempid) {
        $("#selectWfTempModal").modal("hide");
        if ($scope.data.bSubmit) {
            angular.element('#wfinspage').attr('src', '/index.jsp#/crmman/wfins/' + wftempid + '//' + $scope.data.objtypeid + '/' + $scope.data.currItem.sa_saleprice_head_id + '/1?showmode=2');
        } else {
            angular.element('#wfinspage').attr('src', '/index.jsp#/crmman/wfins/' + wftempid + '//' + $scope.data.objtypeid + '/' + $scope.data.currItem.sa_saleprice_head_id + '/0?showmode=2');
        }
        $scope.data.bSubmit = false;
    }

    //modal显示时绑定切换事件
    $('#detailtab').on('shown.bs.tab', $scope.onTabChange);

    /**
     * 通用查询
     */
    $scope.searchItem = function (type) {
        if(type == 'item'){
            $scope.FrmInfo = {
                title: "产品查询",
                thead: [{
                    name: "产品编码",
                    code: "item_code"
                }, {
                    name: "产品名称",
                    code: "item_name"
                },{
                    name: "产品规格",
                    code: "specs"
                }],
                classid: "item",
                url: "/jsp/req.jsp",
                sqlBlock: "",
                backdatas: "items",
                ignorecase: "true", //忽略大小写
                postdata: {
                    maxsearchrltcmt: 300,
                    search_flag:10
                },
                searchlist: ["item_code", "item_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.select_item_org(result);
            });
        }else if(type == 'sa_saleprice_type'){
            $scope.FrmInfo = {
                title: "价格类型",
                thead: [{
                    name: "类型编码",
                    code: "saleprice_type_code"
                }, {
                    name: "类型名称",
                    code: "saleprice_type_name"
                }],
                classid: "sa_saleprice_type",
                url: "/jsp/req.jsp",
                sqlBlock: "",
                backdatas: "sa_saleprice_types",
                ignorecase: "true", //忽略大小写
                postdata: {
                    maxsearchrltcmt: 300,
                    search_flag:1
                },
                searchlist: ["saleprice_type_code", "saleprice_type_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.addCurrItem.sa_saleprice_type_id = result.sa_saleprice_type_id;
                $scope.data.addCurrItem.saleprice_type_code = result.saleprice_type_code;
                $scope.data.addCurrItem.saleprice_type_name = result.saleprice_type_name;
            })
        }else if(type == 'sa_saleprice_type1'){
            $scope.FrmInfo = {
                title: "价格类型",
                thead: [{
                    name: "类型编码",
                    code: "saleprice_type_code"
                }, {
                    name: "类型名称",
                    code: "saleprice_type_name"
                }],
                classid: "sa_saleprice_type",
                url: "/jsp/req.jsp",
                sqlBlock: "",
                backdatas: "sa_saleprice_types",
                ignorecase: "true", //忽略大小写
                postdata: {
                    maxsearchrltcmt: 300,
                    search_flag:1
                },
                searchlist: ["saleprice_type_code", "saleprice_type_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.sa_saleprice_type_id = result.sa_saleprice_type_id;
                $scope.data.currItem.saleprice_type_code = result.saleprice_type_code;
                $scope.data.currItem.saleprice_type_name = result.saleprice_type_name;
            })
        }else if(type == 'item_class1'){
            $scope.FrmInfo = {
                title: "产品分类",
                thead: [{
                    name: "分类编码",
                    code: "item_class_code"
                }, {
                    name: "分类名称",
                    code: "item_class_name"
                }],
                classid: "item_class",
                url: "/jsp/req.jsp",
                sqlBlock: "",
                backdatas: "item_classs",
                ignorecase: "true", //忽略大小写
                postdata: {
                    maxsearchrltcmt: 300,
                    search_flag:7
                },
                searchlist: ["item_class_code", "item_class_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.item_class1 = result.item_class_id;
                $scope.data.currItem.item_class1_code = result.item_class_code;
                $scope.data.currItem.item_class1_name = result.item_class_name;
            })
        }else if(type == 'item_class2'){
            $scope.FrmInfo = {
                title: "产品分类",
                thead: [{
                    name: "分类编码",
                    code: "item_class_code"
                }, {
                    name: "分类名称",
                    code: "item_class_name"
                }],
                classid: "item_class",
                url: "/jsp/req.jsp",
                sqlBlock: "",
                backdatas: "item_classs",
                ignorecase: "true", //忽略大小写
                postdata: {
                    maxsearchrltcmt: 300,
                    search_flag:7
                },
                searchlist: ["item_class_code", "item_class_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.item_class2 = result.item_class_id;
                $scope.data.currItem.item_class2_code = result.item_class_code;
                $scope.data.currItem.item_class2_name = result.item_class_name;
            })
        }else if(type == 'item_class3'){
            $scope.FrmInfo = {
                title: "产品分类",
                thead: [{
                    name: "分类编码",
                    code: "item_class_code"
                }, {
                    name: "分类名称",
                    code: "item_class_name"
                }],
                classid: "item_class",
                url: "/jsp/req.jsp",
                sqlBlock: "",
                backdatas: "item_classs",
                ignorecase: "true", //忽略大小写
                postdata: {
                    maxsearchrltcmt: 300,
                    search_flag:7
                },
                searchlist: ["item_class_code", "item_class_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.item_class3 = result.item_class_id;
                $scope.data.currItem.item_class3_code = result.item_class_code;
                $scope.data.currItem.item_class3_name = result.item_class_name;
            })
        }else if(type == 'uom'){
            $scope.FrmInfo = {
                title: "计量单位",
                thead: [{
                    name: "单位编码",
                    code: "uom_code"
                }, {
                    name: "单位名称",
                    code: "uom_name"
                }],
                classid: "uom",
                url: "/jsp/req.jsp",
                sqlBlock: "",
                backdatas: "uoms",
                ignorecase: "true", //忽略大小写
                postdata: {
                    maxsearchrltcmt: 300,
                    search_flag:7
                },
                searchlist: ["uom_code", "uom_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.uom_id = result.uom_id;
                $scope.data.currItem.uom_code = result.uom_code;
                $scope.data.currItem.uom_name = result.uom_name;
            })
        }else if(type == 'pack_uom'){
            $scope.FrmInfo = {
                title: "计量单位",
                thead: [{
                    name: "单位编码",
                    code: "uom_code"
                }, {
                    name: "单位名称",
                    code: "uom_name"
                }],
                classid: "uom",
                url: "/jsp/req.jsp",
                sqlBlock: "",
                backdatas: "uoms",
                ignorecase: "true", //忽略大小写
                postdata: {
                    maxsearchrltcmt: 300,
                    search_flag:7
                },
                searchlist: ["uom_code", "uom_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.pack_uom = result.uom_name;
            })
        }else if(type == 'entorgs'){
            $scope.FrmInfo = {
                title: "销售组织",
                thead: [{
                    name: "编码",
                    code: "entorgcode"
                }, {
                    name: "名称",
                    code: "entorgname"
                }],
                classid: "item_org",
                url: "/jsp/req.jsp",
                sqlBlock: "",
                backdatas: "item_orgs",
                ignorecase: "true", //忽略大小写
                postdata: {
                    maxsearchrltcmt: 300,
                    searchflag:23
                },
                searchlist: ["entorgcode", "entorgname"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.entorgcode = result.entorgcode;
                $scope.data.currItem.entorgname = result.entorgname;
            })
        }


    };

    $scope.select_item_org = function (result) {
        var flag = true;
        $.each($scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads,function (index,item) {
            if(result.item_code == item.item_code){
                flag = false;
            }
        });
        if(flag==true){
            $scope.data.addCurrItem.item_id = result.item_id;
            $scope.data.addCurrItem.item_code = result.item_code;
            $scope.data.addCurrItem.item_name = result.item_name;
            $scope.data.addCurrItem.uom_name = result.uom_name;
        }else{
            BasemanService.swal("提示", "不能添加重复产品！");
        }
    }

    /**
     * 关闭窗体
     */
    $scope.closeWindow = function () {
        if (window.parent != window) {
            BasemanService.closeModal();
        } else {
            window.close();
        }
    }

    /**
     * 去除千分号
     */
    function delMoney(i) {
        if (typeof(i) == "undefined") {
            i = 0;
        }
        if (typeof(i) == "string") {
            i = i.replace(/\,/ig, '');
            return parseFloat(i);
        } else {
            i = i.toString().replace(/\,/ig, '');
            return parseFloat(i);
        }
    }

    /**
     * 网格列数据合计
     * @param data
     * @param columns
     * @constructor
     */
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
                        total += (delMoney(data[i][columnId]) || 0);
                    }
                    //合计添加千分号
                    if (columnId == "apply_amt") {
                        totals[columnId] = HczyCommon.formatMoney(total);
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
    //对外暴露scope
    window.currScope = $scope;
}

//注册控制器
angular.module('inspinia')
    .controller('sa_saleprice_pro', sa_saleprice_pro);