var param = {};
function setData(e){
    param = e;
}
function drp_custforecast_mth_bill($scope, BaseService, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state,
                            localeStorageService, FormValidatorService, $stateParams) {
    $scope.data = {"objtypeid": 1001, wftemps: [], bSubmit: false};
    $scope.data.currItem = {"objattachs": [], "cforecast_id": $stateParams.id};
    $scope.data.addCurrItem = {};
    //设置标题
    $scope.headername = "月度提货计划";
    var activeRow = [];
    var isEdit = 0;
    var lineData = [];
    var hasCustomerPtype = false;

    //作废
    $scope.is_cancellations = [
        {id: 1, name: "否"},
        {id: 2, name: "是"}
    ];
    //价格类型  1 正常发货价格;2 促销价;3销售订单价 ;4工程特价
    $scope.price_classs = [
        {id: 1, name: "正常发货价格"},
        {id: 2, name: "促销价"},
        {id: 3, name: "销售订单价"},
        {id: 4, name: "工程特价"}
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
            width: 50
        },
         {
            name: "操作",
            width: 100,
            formatter: editlineButtons
        },
        {
            name: "产品大类编码",
            id: "item_code",
            field: "item_code",
            width: 150
        }, {
            name: "产品大类名称",
            id: "item_name",
            field: "item_name",
            width: 200
        },
        {
            name: "产品编码",
            id: "item_code",
            field: "item_code",
            width: 150
        }, {
            name: "产品名称",
            id: "item_name",
            field: "item_name",
            width: 200
        },
        {
            name: "2月提货数量",
            id: "contract_qty3",
            field: "contract_qty3",
            width: 70
        },
        {
            name: "3月提货数量",
            id: "contract_qty2",
            field: "contract_qty2",
            width: 70
        },
        {
            name: "4月提货数量",
            id: "contract_qty1",
            field: "contract_qty1",
            width: 70
        },
        {
            name: "6月提货数量",
            id: "contract_qty",
            field: "contract_qty",
            width: 70
        },
        {
            name: "2月提货金额",
            id: "contract_amount",
            field: "contract_amount",
            width: 70,
            formatter: Slick.Formatters.Money
            ,cssClass: "amt"
        },
        {
            name: "3月提货金额",
            id: "contract_amount",
            field: "contract_amount",
            width: 70,
            formatter: Slick.Formatters.Money
            ,cssClass: "amt"
        },
        {
            name: "4月提货金额",
            id: "contract_amount",
            field: "contract_amount",
            width: 70,
            formatter: Slick.Formatters.Money
            ,cssClass: "amt"
        },
        {
            name: "6月提货金额",
            id: "contract_amount",
            field: "contract_amount",
            width: 70,
            formatter: Slick.Formatters.Money
            ,cssClass: "amt"
        },
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
        BasemanService.swalDelete("删除", "确定要删除产品 " + item_name + " 吗？", function (bool) {
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
        $scope.data.addCurrItem = {
            customer_id:0,
            base_currency_id:1,
            start_date: $scope.data.currItem.start_date,
            end_date:$scope.data.currItem.end_date,
            is_syscreate:1
        };
        $("#addLineModal").modal();

    };
    var idx = -1;
    $scope.editLine = function (e, args) {
        isEdit = 1;
        idx = args.row;
        $scope.data.addCurrItem = $scope.data.currItem.drp_custforecast_mth_lineofdrp_custforecast_mth_headers[idx];
        $("#addLineModal").modal();
        $scope.$apply();
    }

    /**
     * 保存明细到网格中
     */
    $scope.saveAddData = function () {
        if(isEdit==2){
            if (typeof ($scope.data.currItem.drp_custforecast_mth_lineofdrp_custforecast_mth_headers) == 'undefined') {
                $scope.data.currItem.drp_custforecast_mth_lineofdrp_custforecast_mth_headers = [];
            }
            var isExist = false;
            for (var i in $scope.data.currItem.drp_custforecast_mth_lineofdrp_custforecast_mth_headers) {
                if ($scope.data.currItem.drp_custforecast_mth_lineofdrp_custforecast_mth_headers[i].item_id == $scope.data.addCurrItem.item_id) {
                    isExist = true;
                    break;
                }
            }
            if (!isExist) {
                $scope.data.addCurrItem.seq = $scope.data.currItem.drp_custforecast_mth_lineofdrp_custforecast_mth_headers.length+1;
                $scope.data.currItem.drp_custforecast_mth_lineofdrp_custforecast_mth_headers.push($scope.data.addCurrItem);
            }else{
                BasemanService.notice("该产品已经添加过！", "alert-warning");//warning
            }
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

        if ($scope.data.currItem.cforecast_id>0) {

            //调用后台保存方法
            BasemanService.RequestPost("drp_custforecast_mth_header", "update", JSON.stringify($scope.data.currItem))
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
        }else{
            $scope.data.currItem.is_advance = 1;
            $scope.data.currItem.is_sale_promotion_price = 2;
            BasemanService.RequestPost("drp_custforecast_mth_header", "insert", JSON.stringify($scope.data.currItem))
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
        if ($scope.data.currItem.cforecast_id > 0) {
            //调用后台select方法查询详情
            BasemanService.RequestPost("drp_custforecast_mth_header", "select", JSON.stringify({"cforecast_id": $scope.data.currItem.cforecast_id}))
                .then(function (data) {
                    HczyCommon.stringPropToNum(data);
                    $scope.data.currItem = data;
                    //金额加千分号
                    //$scope.data.currItem.total_apply_amt = HczyCommon.formatMoney($scope.data.currItem.total_apply_amt, 2);
                    setGridData($scope.lineGridView,$scope.data.currItem.drp_custforecast_mth_lineofdrp_custforecast_mth_headers);
                    $scope.lineGridView.render();

                });
        } else {
            $scope.data.currItem = {
                "sa_saleprice_head_id": 0,
                "stat": 1,
                "is_cancellation":1,
                "crm_entid":0,
                "entorgid":0,
                "price_class":4,
                "date_invbill": new Date().Format("yyyy-MM-dd hh:mm:ss"),
                //"start_date": new Date(),
                drp_custforecast_mth_lineofdrp_custforecast_mth_headers: []
            };
            $scope.data.currItem.cyear = new Date().getFullYear();
            $scope.data.currItem.cmonth = new Date().getMonth() + 1;
            setGridData($scope.lineGridView,$scope.data.currItem.drp_custforecast_mth_lineofdrp_custforecast_mth_headers);
        }
    };

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

    //加载时间插件
    $('#date_invbill').datetimepicker({
        format: 'yyyy-mm-dd hh:mm:ss',
        language: 'ch',
        pickDate: true, //选择日期
        pickTime: false, //选择时间
        todayBtn: true, //显示选择当前时间按钮
        autoclose: true, //选择一个日期之后立即关闭日期时间选择器
        todayHighlight: true, //高亮当前日期
        startView: 'month', //选择首先显示的视图:month
        minView: 'month',//最小的选择视图-选择最小单位:day
        startDate: new Date()
    });
    $('#start_date').datetimepicker({
        format: 'yyyy-mm-dd',
        language: 'ch',
        pickDate: true, //选择日期
        pickTime: false, //选择时间
        todayBtn: true, //显示选择当前时间按钮
        autoclose: true, //选择一个日期之后立即关闭日期时间选择器
        todayHighlight: true, //高亮当前日期
        startView: 'month', //选择首先显示的视图:month
        minView: 'month',//最小的选择视图-选择最小单位:day
        startDate: new Date()
    });
    $('#end_date').datetimepicker({
        format: 'yyyy-mm-dd',
        language: 'ch',
        pickDate: true, //选择日期
        pickTime: false, //选择时间
        todayBtn: true, //显示选择当前时间按钮
        autoclose: true, //选择一个日期之后立即关闭日期时间选择器
        todayHighlight: true, //高亮当前日期
        startView: 'month', //选择首先显示的视图:month
        minView: 'month',//最小的选择视图-选择最小单位:day
        startDate: new Date()
    });
    $('#c_start_date').datetimepicker({
        format: 'yyyy-mm-dd',
        language: 'ch',
        pickDate: true, //选择日期
        pickTime: false, //选择时间
        todayBtn: true, //显示选择当前时间按钮
        autoclose: true, //选择一个日期之后立即关闭日期时间选择器
        todayHighlight: true, //高亮当前日期
        startView: 'month', //选择首先显示的视图:month
        minView: 'month',//最小的选择视图-选择最小单位:day
        startDate: new Date()
    });
    $('#c_end_date').datetimepicker({
        format: 'yyyy-mm-dd',
        language: 'ch',
        pickDate: true, //选择日期
        pickTime: false, //选择时间
        todayBtn: true, //显示选择当前时间按钮
        autoclose: true, //选择一个日期之后立即关闭日期时间选择器
        todayHighlight: true, //高亮当前日期
        startView: 'month', //选择首先显示的视图:month
        minView: 'month',//最小的选择视图-选择最小单位:day
        startDate: new Date()
    });

    /**
     * 通用查询
     */
    $scope.searchItem = function (type) {
        if(type == 'item') {
            $scope.FrmInfo = {
                title: "产品查询",
                thead: [{
                    name: "产品编码",
                    code: "item_code"
                }, {
                    name: "产品名称",
                    code: "item_name"
                }, {
                    name: "产品规格",
                    code: "specs"
                }],
                classid: "item",
                url: "/jsp/req.jsp",
                direct: "left",
                sqlBlock: "",
                backdatas: "items",
                ignorecase: "true", //忽略大小写
                postdata: {
                    maxsearchrltcmt: 300,
                    search_flag: 10
                },
                searchlist: ["item_code", "item_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.addCurrItem.item_id = result.item_id;
                $scope.data.addCurrItem.item_code = result.item_code;
                $scope.data.addCurrItem.item_name = result.item_name;
                $scope.data.addCurrItem.uom_name = result.uom_name;
            });
        }else if(type == 'item_org'){
            $scope.FrmInfo = {
                title: "产品查询",
                thead: [{
                    name: "产品编码",
                    code: "item_code"
                }, {
                    name: "产品名称",
                    code: "item_name"
                }],
                classid: "item_org",
                url: "/jsp/req.jsp",
                direct: "left",
                sqlBlock: "Io.ITEM_USABLE=2",
                backdatas: "item_orgs",
                ignorecase: "true", //忽略大小写
                postdata: {
                    maxsearchrltcmt: 300,
                },
                searchlist: ["item_code", "item_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                if(typeof ($scope.data.currItem.drp_custforecast_mth_lineofdrp_custforecast_mth_headers) == 'undefined'){
                    $scope.data.currItem.drp_custforecast_mth_lineofdrp_custforecast_mth_headers=[];
                }
                var isExist = false;
                if($scope.data.currItem.drp_custforecast_mth_lineofdrp_custforecast_mth_headers.length>0){
                    for (var i in $scope.data.currItem.drp_custforecast_mth_lineofdrp_custforecast_mth_headers) {
                        if ($scope.data.currItem.drp_custforecast_mth_lineofdrp_custforecast_mth_headers[i].item_id ==result.item_id) {
                            isExist = true;
                            break;
                        }
                    }
                }
                if (!isExist) {
                    $scope.data.addCurrItem.item_id = result.item_id;
                    $scope.data.addCurrItem.item_code = result.item_code;
                    $scope.data.addCurrItem.item_name = result.item_name;
                }else{
                    BasemanService.notice("该产品已经添加过！", "alert-warning");
                    return;
                }
                $scope.data.currItem.item_code = result.item_code;
                BasemanService.RequestPost("drp_custforecast_mth_header", "custdata",$scope.data.currItem)
                    .then(function (data) {
                            $scope.data.addCurrItem.this_mth_qty1 = data.this_mth_qty1;
                            $scope.data.addCurrItem.this_mth_qty2 = data.this_mth_qty2;
                            $scope.data.addCurrItem.this_mth_qty3 = data.this_mth_qty3;

                            $scope.data.addCurrItem.this_mth_amt1 = data.this_mth_amt1;
                            $scope.data.addCurrItem.this_mth_amt2 = data.this_mth_amt2;
                            $scope.data.addCurrItem.this_mth_amt3 = data.this_mth_amt3;
                    });
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
                direct: "left",
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
                direct: "left",
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
                direct: "left",
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
                direct: "left",
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
                direct: "left",
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
        }else if(type == 'customer'){
            $scope.FrmInfo = {
                title: "客户查询",
                thead: [{
                    name: "客户编码",
                    code: "customer_code"
                }, {
                    name: "客户名称",
                    code: "customer_name"
                }],
                classid: "base_view_customer_org",
                url: "/jsp/req.jsp",
                direct: "left",
                sqlBlock: "",
                backdatas: "base_view_customer_orgs",
                ignorecase: "true", //忽略大小写
                postdata: {
                    maxsearchrltcmt: 300,
                    search_flag:7
                },
                searchlist: ["customer_code", "customer_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {

                BasemanService.RequestPost("customer_org", "select", JSON.stringify({customer_org_id:result.customer_id}))
                    .then(function (data) {
                        if(data.sa_saleprice_type_id>0){

                            $scope.data.currItem.customer_code = result.customer_code;
                            $scope.data.currItem.customer_name = result.customer_name;
                            $scope.data.currItem.customer_id = result.customer_id;

                            hasCustomerPtype = true;
                            $scope.data.currItem.sa_saleprice_type_id = data.sa_saleprice_type_id;
                            $scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads=[];
                            setGridData($scope.lineGridView,[]);
                        }else{
                            hasCustomerPtype = false;
                            //$scope.data.currItem.customer_code = "";
                            //$scope.data.currItem.customer_name = "";
                            //$scope.data.currItem.customer_id = 0;
                            BasemanService.notice("该客户未维护销售价格类型！", "alert-warning");//success
                        }
                    });
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
                direct: "left",
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
        }else if(type == 'project'){
            $scope.FrmInfo = {
                title: "工程查询",
                thead: [{
                    name: "工程编码",
                    code: "project_code"
                }, {
                    name: "工程名称",
                    code: "project_name"
                }],
                classid: "crm_project",
                url: "/jsp/req.jsp",
                direct: "left",
                sqlBlock: "",
                backdatas: "crm_projects",
                ignorecase: "true", //忽略大小写
                postdata: {
                    maxsearchrltcmt: 300,
                },
                searchlist: ["project_code", "project_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.project_id = result.project_id;
                $scope.data.currItem.project_code = result.project_code;
                $scope.data.currItem.project_name = result.project_name;
            })
        }



    };

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
    .controller('drp_custforecast_mth_bill', drp_custforecast_mth_bill);