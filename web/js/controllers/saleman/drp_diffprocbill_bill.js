/**
 * 送货签收单详情
 */
function drp_diffprocbill_bill($scope, BaseService, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state,
                            localeStorageService, FormValidatorService, $stateParams,$filter) {
    $scope.data = {"objtypeid": 1723, wftemps: [], bSubmit: false, canmodify: true};
    $scope.data.currItem = {"objattachs": [], "diffbill_id": $stateParams.id};
    $scope.data.addCurrItem = {};
    $scope.is_orderClerk = 1; //登录用户角色：默认不是订单员
    var activeRow = [];
    var isEdit = 0;
    var lineData = [];

    $scope.print = false;

    $scope.shipmodId = [];
    //词汇表往来对象取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "shipmode_id"})
        .then(function (data) {
            $scope.shipmodId = data.dicts;
        });

    $scope.billStats = [];
    //词汇表单据状态取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            $scope.billStats = data.dicts;
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
    // 添加按钮
    var editlineButtons = function (row, cell, value, columnDef, dataContext) {
        return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' " +
                "style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>查看</button> ";
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
            name: "操作",
            width: 60,
            formatter: editlineButtons
        }, {
            name: "产品编码",
            id: "item_code",
            field: "item_code",
            width: 110
        }, {
            name: "产品名称",
            id: "item_name",
            field: "item_name",
            width: 200
        },
        {
            name: "价格",
            id: "price",
            field: "price",
            width: 120,
            cssClass:"amt",
            formatter: Slick.Formatters.Money
        }, {
            name: "金额",
            id: "amount",
            field: "amount",
            width: 120,
            cssClass:"amt",
            formatter: Slick.Formatters.Money
        }, {
            name: "送货数量",
            id: "qty",
            field: "qty",
            width: 100,
        }, {
            name: "实收数量",
            id: "received_qty",
            field: "received_qty",
            width: 100
        }, {
            name: "差异数量",
            id: "diff_qty",
            field: "diff_qty",
            width: 100
        }, {
            name: "差异原因",
            id: "reason",
            field: "reason",
            width: 180
        },{
            name: "销售订单号",
            id: "sa_salebill_no",
            field: "sa_salebill_no",
            width: 150,
            type: "string"
        },{
            name: "备注",
            id: "note",
            field: "note",
            width: 180
        }
    ];
    var warehouse_code = {
        name: "出库仓编码",
        id: "warehouse_code",
        field: "warehouse_code",
        width: 110
    }

    var warehouse_name = {
        name: "出库仓名称",
        id: "warehouse_name",
        field: "warehouse_name",
        width: 160
    }

    //初始化网格
    $scope.lineGridView = new Slick.Grid("#lineViewGrid", [], $scope.lineColumns, $scope.lineOptions);

    //网格可复制
    BasemanService.ReadonlyGrid($scope.lineGridView);
    /**
     * 明细网格点击事件
     * @param e
     * @param args
     */
    var activeRow = "";

    function dgLineClick(e, args) {
        activeRow = args.grid.getDataItem(args.row);
        if ($(e.target).hasClass("viewbtn")) {
            $scope.editLine(e, args);
        }
    };

    /**
     * 明细网格双击事件
     */
    function dgLineDblClick(e, args) {
        $scope.editLine(e, args);
    }

    //明细绑定点击事件
    $scope.lineGridView.onClick.subscribe(dgLineClick);
    $scope.lineGridView.onDblClick.subscribe(dgLineDblClick);

    var idx = -1;
    $scope.editLine = function (e, args) {
        idx = args.row;
        if (objline.length == 0) {
            $scope.data.addCurrItem = JSON.parse(JSON.stringify($scope.data.currItem.drp_diffprocbill_lineofdrp_diffprocbill_headers[args.row]));
        } else {
            $scope.data.addCurrItem = JSON.parse(JSON.stringify(objline[args.row]));
        }

        isEdit = 1;
        $("#lineModal").modal()
        $scope.$apply();
    }

    /**
     * 销售出库单查询
     */
    $scope.searchoutbill = function () {
        $scope.FrmInfo = {
            title: "销售出库单查询",
            thead: [{
                name: "单据号",
                code: "invbillno"
            }, {
                name: "客户编码",
                code: "customer_code"
            }, {
                name: "客户名称",
                code: "customer_name"
            }],
            classid: "inv_out_bill_head",
            url: "/jsp/budgetman.jsp",
            direct: "center",
            sqlBlock: "",
            backdatas: "inv_out_bill_heads",
            ignorecase: "true", //忽略大小写
            searchlist: ["invbillno", "customer_code","customer_name"],
            postdata: {
                "search_flag": 33,
                "sqlwhere": " BLUERED='B' "
            }
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {

            $scope.data.currItem.inv_out_bill_head_id = result.inv_out_bill_head_id;//销售出库id
            $scope.data.currItem.outbill_no = result.invbillno;//销售出库单号
            $scope.data.currItem.cust_id = result.customer_id;//客户id
            $scope.data.currItem.cust_code = result.customer_code;//客户编码
            $scope.data.currItem.cust_name = result.customer_name;//客户名称
            $scope.data.currItem.send_date = result.date_invbill; //发货日期
            $scope.data.currItem.mo_remark = result.mo_remark;//备注
            $scope.data.currItem.total_amount = result.wtamount_discount;//总金额-取出库单折后总额
            //客户信息
            BasemanService.RequestPost("customer_org", "getCustomerInfo",
                {"customer_id":result.customer_id}).then(function (info) {
                $scope.data.currItem.receive_address = info.customer_orgs[0].address1;//收货地址
                $scope.data.currItem.in_area_code = info.customer_orgs[0].areacode;//收货城市编码
                $scope.data.currItem.in_area_name = info.customer_orgs[0].areaname;//收货城市名称
                $scope.data.currItem.receive_phone = info.customer_orgs[0].phone_code;//收货人电话
            }).then(function () {
                //出库单明细
                BasemanService.RequestPost("inv_out_bill_head", "select",
                    {"inv_out_bill_head_id":$scope.data.currItem.inv_out_bill_head_id})
                    .then(function (data) {
                        $scope.data.currItem.drp_diffprocbill_lineofdrp_diffprocbill_headers = [];

                        for (var i = 0; i < data.inv_out_bill_lineofinv_out_bill_heads.length; i++) {
                            var obj = HczyCommon.extend({}, data.inv_out_bill_lineofinv_out_bill_heads[i]);
                            obj.out_warehouse_code = obj.warehouse_code;//发货仓编码
                            obj.out_warehouse_name = obj.warehouse_name;//发货仓名称
                            obj.sa_salebill_no = obj.sa_salebillno;//销售订单号
                            obj.item_code = obj.item_code;//产品编码
                            obj.item_name = obj.item_name;//产品名称
                            obj.qty = obj.qty_bill;//送货数量
                            obj.received_qty = obj.qty_bill;//实收数量-默认送货数量
                            obj.diff_qty = 0;//差异数量
                            obj.price = obj.price_bill;//价格-取出库单折后单价
                            obj.amount = obj.amount_bill_f;//金额-取出库单折后金额
                            obj.source_bill_id = obj.inv_out_bill_line_id;//明细行id-对应出库单明细行id

                            $scope.data.currItem.drp_diffprocbill_lineofdrp_diffprocbill_headers.push(obj);
                            delete obj.prototype;
                        }
                        $scope.lineGridView.setData([]);
                        $scope.lineGridView.setData($scope.data.currItem.drp_diffprocbill_lineofdrp_diffprocbill_headers);
                        $scope.lineGridView.render();

                        //判断是否无差异数量
                        $scope.is_nodiff = 1; //是否无差异数量，初始为否
                        var sum_diff_qty = 0; //明细差异数量之和
                        //明细表差异数量都为0时可直接保存并审核
                        for(var i = 0;i < $scope.data.currItem.drp_diffprocbill_lineofdrp_diffprocbill_headers.length; i++){
                            sum_diff_qty += parseFloat($scope.data.currItem.drp_diffprocbill_lineofdrp_diffprocbill_headers[i].diff_qty);
                            if(parseFloat(sum_diff_qty) == 0){
                                $scope.is_nodiff = 2; //无差异数量标志
                            }
                        }
                    })
            });
        })
    };



    /**
     * 保存明细到网格中
     */
    var objline = [];
    $scope.saveAddData = function () {
        //差异数量大于0时差异原因不能为空
        if(Number($scope.data.addCurrItem.diff_qty) > 0){
            if(!$scope.data.addCurrItem.reason || $scope.data.addCurrItem.reason == "" ){
                BasemanService.swalWarning("提示","差异原因不能为空！");
                return;
            }
        }
        if(!Number($scope.data.addCurrItem.received_qty) || Number($scope.data.addCurrItem.received_qty) == ""){
            BasemanService.swalWarning("提示","实收数量不能为空！");
            return;
        }
        lineData = $scope.data.currItem.drp_diffprocbill_lineofdrp_diffprocbill_headers;
        //如果增加明细--叠加数据
        if (isEdit == 2) {
            var a = $scope.data.currItem.drp_diffprocbill_lineofdrp_diffprocbill_headers.length;
            $scope.data.currItem.drp_diffprocbill_lineofdrp_diffprocbill_headers[a] = JSON.parse(JSON.stringify($scope.data.addCurrItem));
        } else {
            $scope.data.currItem.drp_diffprocbill_lineofdrp_diffprocbill_headers[idx] = JSON.parse(JSON.stringify($scope.data.addCurrItem));
        }
        $scope.lineGridView.setData([]);
        $scope.lineGridView.setData(lineData);
        $scope.lineGridView.render();
        isEdit = 0;
        $("#lineModal").modal("hide");
        objline = lineData.concat();

        //判断是否无差异数量
        $scope.is_nodiff = 1; //是否无差异数量，初始为否
        var sum_diff_qty = 0; //明细差异数量之和
        //明细表差异数量都为0时可直接保存并审核
        for(var i = 0;i < $scope.data.currItem.drp_diffprocbill_lineofdrp_diffprocbill_headers.length; i++){
            sum_diff_qty += parseFloat($scope.data.currItem.drp_diffprocbill_lineofdrp_diffprocbill_headers[i].diff_qty);
            if(parseFloat(sum_diff_qty) == 0){
                $scope.is_nodiff = 2; //无差异数量标志
            }
        }
    }


    /**
     * 保存数据
     */
    $scope.saveData = function (bsubmit) {
        if($scope.lineGridView.length == 0){
            BasemanService.swalWarning("提示", "明细不能为空！");
            return;
        }
        if ($scope.lineGridView.getCellEditor() != undefined) {
            $scope.lineGridView.getCellEditor().commitChanges();
        }
        var action = "insert";
        if ($scope.data.currItem.diffbill_id > 0) {
            action = "update";
        }

        if("insert" == action){
            $scope.data.currItem.year_month = new Date().Format("yyyy-MM");
        }

        //调用后台更新或新增方法
        BasemanService.RequestPost("drp_diffprocbill_header", action, JSON.stringify($scope.data.currItem))
            .then(function (data) {
                $scope.data.currItem.diffbill_id = data.diffbill_id;
                //保存并审核
                if (bsubmit) {
                    var postData = {};
                    postData.diffbill_id = $scope.data.currItem.diffbill_id;

                    BasemanService.swalSuccess("成功", "保存并审核成功！");
                    BasemanService.RequestPost("drp_diffprocbill_header", "check", JSON.stringify(postData))
                        .then(function (data) {
                            $scope.is_nodiff = 1;
                            $scope.selectCurrenItem();
                            isEdit = 0;
                        });
                }else{
                    //保存
                    BasemanService.swalSuccess("成功", "保存成功！");
                }
                if("insert" == action){
                    //添加成功后框不消失直接Select方法查该明细
                    $scope.selectCurrenItem();
                    isEdit = 0;
                }
            });
    }

    //获取用户登录信息
    var role = window.userbean.stringofrole.indexOf("order_clerk"); //用户角色是否为‘订单员’
    var isAdmin = window.userbean.isAdmin; //用户是否管理员

    /**
     * 查询详情
     * @param args
     */
    $scope.selectCurrenItem = function () {
        //判断角色为‘订单员’才可见仓库信息
        if(role != -1 || isAdmin){
            $scope.lineColumns.splice(3, 0, warehouse_code, warehouse_name);
            $scope.lineGridView.setColumns($scope.lineColumns);

            $scope.is_orderClerk = 2;
        }

        isEdit = 0;
        $scope.is_nodiff = 1; //是否无差异数量，初始为否
        if ($scope.data.currItem.diffbill_id > 0) {
            //调用后台select方法查询详情
            BasemanService.RequestPost("drp_diffprocbill_header", "select", JSON.stringify({"diffbill_id": $scope.data.currItem.diffbill_id}))
                .then(function (data) {
                    $scope.data.currItem = data;
                    //重绘网格
                    $scope.lineGridView.setData([]);
                    $scope.lineGridView.setData($scope.data.currItem.drp_diffprocbill_lineofdrp_diffprocbill_headers);
                    $scope.lineGridView.render();

                    //判断是否无差异数量
                    var sum_diff_qty = 0; //明细差异数量之和
                    //明细表差异数量都为0时可直接保存并审核
                    for(var i = 0;i < $scope.data.currItem.drp_diffprocbill_lineofdrp_diffprocbill_headers.length; i++){
                        sum_diff_qty += parseFloat($scope.data.currItem.drp_diffprocbill_lineofdrp_diffprocbill_headers[i].diff_qty);
                        if(parseFloat(sum_diff_qty) == 0){
                            $scope.is_nodiff = 2; //无差异数量标志
                        }
                    }

                    //权限初始化
                    $scope.initBillRight();
                    // getprint();//加载审核流程信息
                });
        } else {
            //初始化新增的默认数据
            $scope.data.currItem = {
                "diffbill_id": 0,
                "stat": 1,
                "anticipate_date" :new Date().Format("yyyy-MM-dd"),
                "create_time": new Date().Format("yyyy-MM-dd hh:mm:ss"),
                "creator": strUserId,
                drp_diffprocbill_lineofdrp_diffprocbill_headers: []
            };
            $scope.lineGridView.setData($scope.data.currItem.drp_diffprocbill_lineofdrp_diffprocbill_headers);
        }
    };

    /**
     * 实收数量值改变时触发事件
     */
    $scope.factqtychange = function () {
        if($scope.data.addCurrItem.received_qty){
            if(Number($scope.data.addCurrItem.received_qty) < 0){
                BasemanService.swalWarning("提示","实收数量不能小于0！");
                return;
            }
            if(Number($scope.data.addCurrItem.received_qty) > Number($scope.data.addCurrItem.qty)){
                BasemanService.swalWarning("提示","实收数量不能大于送货数量！");
                $scope.data.addCurrItem.diff_qty = 0;
                $scope.data.addCurrItem.received_qty = 0;
                return;
            }
        }
        //计算差异数量
        if($scope.data.addCurrItem.received_qty == "" || !$scope.data.addCurrItem.received_qty){
            $scope.data.addCurrItem.diff_qty = 0;
        }else{
            $scope.data.addCurrItem.diff_qty = Number($scope.data.addCurrItem.qty) - Number($scope.data.addCurrItem.received_qty);
        }

        if(Number($scope.data.addCurrItem.diff_qty) == 0){
            $scope.data.addCurrItem.reason = "";
        }
    }
    
    //模态框消失时触发事件
    $('#lineModal').on('hide.bs.modal', function () {
        isEdit = 0;
    });

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
        // inputObj.setAttribute("accept", "*");
        // inputObj.setAttribute("capture", "camera");
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
                    dataType: 'json',//返回数据的类型
                    success: function (data, status) {
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

    //modal显示时绑定切换事件
    $('#detailtab').on('shown.bs.tab', $scope.onTabChange);


    /**
     * 关闭窗体
     */
    $scope.closeWindow = function () {
        isEdit = 0;
        if (window.parent != window) {
            BasemanService.closeModal();
        } else {
            window.close();
        }
    }



    /**
     * 初始化单据权限
     */
    $scope.initBillRight = function () {
        if ($scope.data.currItem.stat < 2 && $scope.data.currItem.wfid == 0) {
            $scope.data.canmodify = true;
        } else if ($scope.data.currItem.stat > 1 && $scope.data.currItem.stat < 5) {
            $scope.data.canmodify = $scope.data.currItem.wfright > 1;
        } else {
            $scope.data.canmodify = false;
        }
    }

    /**
     * 打印功能
     */
    /*$scope.PreviewMytable = function () {
        var printTime = new Date().format("yyyy-MM-dd hh:mm:ss")
        $scope.print = true;
        var opinionStr = ""
        var strStyle = "<style> table,td,th {border-width: 1px;border-style: solid;border-collapse: collapse}</style>"
        //加载打印
        var LODOP = getLodop();
        LODOP.PRINT_INIT("费用申请单打印");
        LODOP.SET_PRINT_PAGESIZE(0, 0, 0, "A4");
        var strStyle = "<style> table,td,th {border-width: 1px;border-style: solid;border-collapse: collapse}</style>"
        LODOP.SET_PRINT_STYLE("ItemType", 0)
        LODOP.ADD_PRINT_HTM(30, "2%", "97%", 180, document.getElementById("div1").innerHTML);
        LODOP.SET_PRINT_STYLE("ItemType", 0)
        LODOP.ADD_PRINT_TABLE(230, "2%", "97%", $scope.data.currItem.fin_fee_apply_lineoffin_fee_apply_headers.length * 25, strStyle + document.getElementById("div2").innerHTML);
        LODOP.SET_PRINT_STYLE("ItemType", 0)
        LODOP.ADD_PRINT_TABLE(280 + $scope.data.currItem.fin_fee_apply_lineoffin_fee_apply_headers.length * 25, "2%", "98%", 40 + $scope.opinions.length * 25, document.getElementById("div3").innerHTML, document.getElementById("div3").innerHTML);
        LODOP.SET_PRINT_STYLE("ItemType", 1)
        LODOP.SET_PRINT_STYLE("FontSize", 10)
        LODOP.ADD_PRINT_TEXT("97%", "60%", "RightMargin:1%", "BottomMargin:1%", "打印人:" + strUserName + " 打印时间:" + printTime)
        $scope.print = false;
        LODOP.PREVIEW();
    };*/

    //加载打印项所需文本
    /*function getprint() {
        if ($scope.data.currItem.wfid) {
            BasemanService.RequestPost("scpwf", "select", {"wfid": $scope.data.currItem.wfid}).then(function (data) {
                $scope.opinions = [];
                var wfprocofwfs = data.wfprocofwfs
                for (var i = wfprocofwfs.length - 1; i > -1; i--) {
                    var proc = wfprocofwfs[i];
                    if (proc.useropinionofwfprocs && proc.useropinionofwfprocs.length > 0) {
                        for (var j = 0; j < proc.useropinionofwfprocs.length; j++) {
                            var useropinion = proc.useropinionofwfprocs[j];
                            var stat = "";
                            switch (proc.stat) {
                                case "4":
                                    stat = "待审"
                                    break;
                                case "5":
                                    stat = "驳回"
                                    break;
                                case "7":
                                    stat = "通过"
                                    break;
                            }
                            $scope.opinions.push({
                                "stat": stat,
                                "procname": proc.procname,
                                "username": useropinion.username,
                                "signtime": useropinion.signtime,
                                "opinion": useropinion.opinion,
                            });
                            $scope.opinions.sort(function (a, b) {
                                return a.signtime > b.signtime ? 1 : -1
                            });
                        }
                    }
                }
                if ($scope.data.currItem.stat < 5) {
                    for (var x = 0; x < 4; x++) {
                        $scope.opinions.push({
                            "procname": "核实签字",  //如果没走完流程,增加4行空行供签字使用
                        });
                    }
                }
            })
        }
    }*/

    //解决进度动画不消失的问题
    IncRequestCount();
    DecRequestCount();

    //对外暴露scope
    window.currScope = $scope;

    IncRequestCount()
    DecRequestCount()
}

//注册控制器
angular.module('inspinia')
    .controller('ctrl_drp_diffprocbill_bill', drp_diffprocbill_bill);