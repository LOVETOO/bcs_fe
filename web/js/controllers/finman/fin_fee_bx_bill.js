/**
 * 费用报销单
 */
function fin_fee_bx_bill($scope, BaseService, $filter, $location, $rootScope, $modal, $timeout,
                         BasemanService, notify, $state, localeStorageService, FormValidatorService, $stateParams) {
    $scope.data = {"objtypeid": 1238, wftemps: [], bSubmit: false};
    $scope.data.currItem = {"objattachs": [], "bx_id": $stateParams.id};
    var activeRow = [];
    $scope.data.addCurrItem = {};
    var isEdit = 0;
    var lineData = [];

    //获取路由名称
    var routeName = $state.current.name;
    $scope.routeFlag = 1;  //路由标志：1 费控系统 2 工程费用报销 3 门店装修核销 4 广告投放核销 5 推广活动核销
    //工程费用申请模块
    if(routeName == 'saleman.projfeebx'){
        $scope.routeFlag = 2;
    }
    //门店装修申请
    if(routeName == 'mktman.decoratefeebx'){
        $scope.routeFlag = 3;
    }
    //广告投放申请
    if(routeName == 'mktman.advertfeebx'){
        $scope.routeFlag = 4;
    }
    //推广活动申请
    if(routeName == 'mktman.extendfeebx'){
        $scope.routeFlag = 5;
    }

    $scope.months = [
        {id: 1, name: "1月"},
        {id: 2, name: "2月"},
        {id: 3, name: "3月"},
        {id: 4, name: "4月"},
        {id: 5, name: "5月"},
        {id: 6, name: "6月"},
        {id: 7, name: "7月"},
        {id: 8, name: "8月"},
        {id: 9, name: "9月"},
        {id: 10, name: "10月"},
        {id: 11, name: "11月"},
        {id: 12, name: "12月"}
    ]

    $scope.useObjTypes = [];
    //词汇表往来对象取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "ac_object_type"})
        .then(function (data) {
            $scope.useObjTypes = data.dicts;
            var useObjTypes = [];
            for (var i = 0; i < data.dicts.length; i++) {
                useObjTypes[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('lineColumns', 'useobject_type')) {
                $scope.lineColumns[$scope.getIndexByField('lineColumns', 'useobject_type')].options = useObjTypes;
                $scope.lineGridView.setColumns($scope.lineColumns);
            }
            if ($scope.getIndexByField('lineColumns', 'receiver_type')) {
                $scope.lineColumns[$scope.getIndexByField('lineColumns', 'receiver_type')].options = useObjTypes;
                $scope.lineGridView.setColumns($scope.lineColumns);
            }
        });

    $scope.billStats = [];
    //词汇表单据状态取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            $scope.billStats = data.dicts;
            HczyCommon.stringPropToNum(data.dicts);
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

    //添加按钮
    var editlineButtons = function (row, cell, value, columnDef, dataContext) {
        if ($scope.data.currItem.stat != 1) {
            return;
        } else {
            return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>编辑</button> " +
                " <button class='btn btn-sm btn-info dropdown-toggle delbtn' " +
                "style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;' >删除</button> ";
        }

    };

    //明细网格中的本次申请报销额：不是制单状态的单据不能编辑
    $scope.editorFun = function () {
        if ($scope.getIndexByField('lineColumns', 'apply_bx_amt')) {
            if ($scope.data.currItem.stat == 1) {
                $scope.lineColumns[$scope.getIndexByField('lineColumns', 'apply_bx_amt')].editor = Slick.Editors.Text;
            }
            $scope.lineGridView.setColumns($scope.lineColumns);
        }
    }

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
            width: 100,
            formatter: editlineButtons
        }, {
            name: "费用项目编码",
            id: "fee_code",
            field: "fee_code",
            width: 100,
        }, {
            name: "费用项目名称",
            id: "fee_name",
            field: "fee_name",
            width: 100
        }, {
            name: "费用承担部门编码",
            id: "fee_org_code",
            field: "fee_org_code",
            width: 125
        }, {
            name: "费用承担部门",
            id: "fee_org_name",
            field: "fee_org_name",
            width: 140
        },/* {
            name: "使用对象类型",
            id: "useobject_type",
            field: "useobject_type",
            width: 100,
            options: [],
            formatter: Slick.Formatters.SelectOption
        }, {
            name: "使用对象编码",
            id: "useobject_code",
            field: "useobject_code",
            width: 100
        }, {
            name: "使用对象",
            id: "useobject_name",
            field: "useobject_name",
            width: 100,
        }, {
            name: "收款对象类型",
            id: "receiver_type",
            field: "receiver_type",
            width: 100,
            options: [],
            formatter: Slick.Formatters.SelectOption
        }, {
            name: "收款对象编码",
            id: "receiver_code",
            field: "receiver_code",
            width: 100
        }, {
            name: "收款对象名称",
            id: "receiver_name",
            field: "receiver_name",
            width: 100
        },*/ {
            name: "申请单批准金额",
            id: "allow_amt",
            field: "allow_amt",
            width: 120,
            cssClass:"amt",
            formatter: Slick.Formatters.Money
        }, {
            name: "本次申请报销额",
            id: "apply_bx_amt",
            field: "apply_bx_amt",
            width: 120,
            cssClass:"amt",
            formatter: Slick.Formatters.Money
        },/* {
            name: "冲销金额",
            id: "cx_amt",
            field: "cx_amt",
            width: 80,
            cssClass:"amt",
            formatter: Slick.Formatters.Money
        }, */{
            name: "本次批准报销额",
            id: "allow_bx_amt",
            field: "allow_bx_amt",
            width: 120,
            cssClass:"amt",
            formatter: Slick.Formatters.Money
        }, {
            name: "累计已报销额",
            id: "finish_bx_amt",
            field: "finish_bx_amt",
            width: 100,
            cssClass:"amt",
            formatter: Slick.Formatters.Money
        }, {
            name: "已支付金额",
            id: "pay_amt",
            field: "pay_amt",
            width: 85,
            cssClass:"amt",
            formatter: Slick.Formatters.Money
        }, {
            name: "备注",
            id: "note",
            field: "note",
            width: 100
        },
    ];
    //初始化网格
    $scope.lineGridView = new Slick.Grid("#lineViewGrid", [], $scope.lineColumns, $scope.lineOptions);


    /**
     * 明细网格点击事件
     * @param e
     * @param args
     */
    function dgLineClick(e, args) {
        if ($(e.target).hasClass("viewbtn")) {
            if ($scope.data.currItem.stat == 1) {
                $scope.editLine(e, args);
                return;
            }
        }
        if ($(e.target).hasClass("delbtn")) {
            $scope.delLineRow(args);
            e.stopImmediatePropagation();
        }
    };

    function dgLineDblClick(e, args) {
        if ($scope.data.currItem.stat == 1) {
            $scope.editLine(e, args);
        }
    }

    //明细绑定点击事件
    $scope.lineGridView.onClick.subscribe(dgLineClick);
    $scope.lineGridView.onDblClick.subscribe(dgLineDblClick);
    $scope.lineGridView.onCellChange.subscribe(cellchange);


    /**
     * 删除明细网格行
     */
    $scope.delLineRow = function (args) {
        var code = args.grid.getDataItem(args.row).fee_code;
        if ($scope.data.currItem.stat != 1) {
            BasemanService.swalWarning("提示", "此单据不是“制单”状态，不允许删除！");
            return;
        }
        BasemanService.swalDelete("删除", "确定要删除编码为 " + code + " 的费用报销单吗？", function (bool) {
            if (bool) {
                var dg = $scope.lineGridView;
                dg.getData().splice(args.row, 1);
                dg.invalidateAllRows();
                dg.render();
            } else {
                return;
            }
        });
    };


    /**
     * 增加明细触发事件
     */
    $scope.addLine = function () {
        if (!$scope.data.currItem.bud_type_id) {
            BasemanService.swalWarning("提示", "请先选择预算类别");
            return;
        }
        $scope.data.addCurrItem = {
            "fee_org_id": $scope.data.currItem.org_id,
            "fee_org_code": $scope.data.currItem.org_code,
            "fee_org_name": $scope.data.currItem.org_name
        };
        isEdit = 2;
        $("#addLineModal").modal();
    }
    /**
     * 编辑明细网格
     * @param e
     * @param args
     */
    var idx = -1;
    $scope.editLine = function (e, args) {
        idx = args.row;
        if ($scope.data.currItem.loan_id > 0) {
            if (!$scope.data.currItem.bud_type_id) {
                BasemanService.swalWarning("提示", "请先选择预算类别");
                return;
            }
        }
        if (objline.length == 0) {
            $scope.data.addCurrItem = JSON.parse(JSON.stringify($scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers[args.row]));
        } else {
            $scope.data.addCurrItem = JSON.parse(JSON.stringify(objline[args.row]));
        }

        isEdit = 1;
        $("#addLineModal").modal();
        $scope.$apply();
    }

    /**
     * 查看申请单
     */
    $scope.viewApplyBill = function () {
        BasemanService.openModal({
            url: "/index.jsp#/crmman/feeapply/" + $scope.data.currItem.fee_apply_id,
            "title": "费用申请",
            obj: $scope
        });
    }

    /**
     * 工程项目查询
     */
    $scope.searchItem = function () {
        $scope.FrmInfo = {
            title: "工程查询",
            thead: [{
                name: "工程编码",
                code: "project_code"
            }, {
                name: "工程名称",
                code: "project_name"
            }],
            classid: "proj",
            url: "/jsp/authman.jsp",
            direct: "center",
            backdatas: "projs",
            ignorecase: "true", //忽略大小写
            postdata: {},
            searchlist: ["project_code", "project_name"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.project_id = result.project_id;
            $scope.data.currItem.project_code = result.project_code;
            $scope.data.currItem.project_name = result.project_name;

            //销售渠道，可能会有多个
            $scope.sale_center = []
            var saleCenterIds = result.sale_center_id.split(",");
            var saleCenterNames = result.sale_center_name.split(",");
            for(var i = 0; i< saleCenterIds.length; i++){
                $scope.sale_center.push(
                    {id: saleCenterIds[i],
                        name: saleCenterNames[i]});
            }
            if(saleCenterIds.length == 1){    //销售渠道只有一个时不可选
                $scope.onlyOne = true;
            }else{                            //销售渠道多个时可选
                // $scope.sale_center = saleCenterNames;
                $scope.onlyOne = false;
            }
            $scope.data.currItem.sale_center = $scope.sale_center[0].name;//默认带出第一个

        })
    }

    /**
     * 申请单号查询
     */
    $scope.searchApplyNo = function () {
        $scope.sale_center = [];
        $scope.FrmInfo = {
            title: "费用申请单查询",
            thead: [{
                name: "费用申请单号",
                code: "fee_apply_no"
            }, {
                name: "年度",
                code: "cyear"
            }, {
                name: "月度",
                code: "cmonth"
            }, {
                name: "部门名称",
                code: "org_name"
            }, {
                name: "预算类别编码",
                code: "bud_type_code"
            }, {
                name: "预算类别名称",
                code: "bud_type_name"
            }, {
                name: "用途",
                code: "note"
            }, {
                name: "备注",
                code: "purpose"
            }],
            classid: "fin_fee_apply_header",
            url: "/jsp/budgetman.jsp",
            direct: "center",
            sqlBlock: "",
            backdatas: "fin_fee_apply_headers",
            ignorecase: "true", //忽略大小写
            searchlist: ["fee_apply_no", "cyear", "cmonth", "org_name", "bud_type_code", "bud_type_name", "note", "purpose"],
            postdata: {
                "sqlwhere": "nvl(is_bx, 0)<2 and fin_fee_apply_header.stat=5 " +
                "and (to_date('" + new Date().Format("yyyy-MM-dd") + "','yyyy-mm-dd') <= bx_end_date " +
                "or bx_end_date is null)"
            }
        };

        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem = result;
            $scope.data.currItem.wfid = 0;
            $scope.data.currItem.stat = 1;
            $scope.data.currItem.total_apply_amt = 0;
            $scope.data.currItem.total_allow_amt = 0;
            $scope.data.currItem.sum_allow_amt = 0;
            $scope.data.currItem.cyear = new Date().getFullYear();
            $scope.data.currItem.cmonth = new Date().getMonth() + 1;

            $scope.sale_center.push({name:$scope.data.currItem.sale_center});
            if($scope.sale_center.length == 1){
                $scope.onlyOne = true;
            }else{
                $scope.onlyOne = false;
            }
            $scope.data.currItem.project_id = result.project_id;

            var postData = {};
            postData.fee_apply_id = result.fee_apply_id;
            BasemanService.RequestPost("fin_fee_apply_header", "select", JSON.stringify(postData))
                .then(function (data) {
                    //显示工程项目编码和名称
                    $scope.data.currItem.project_code = data.project_code;
                    $scope.data.currItem.project_name = data.project_name;

                    if (!$scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers) {
                        $scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers = [];
                    }
                    //把申请单的附件带到报销单中
                    if (data.objattachs.length != 0) {
                        $scope.data.currItem.objattachs = data.objattachs;
                        for (var i = 0; i < $scope.data.currItem.objattachs.length; i++) {
                            $scope.data.currItem.objattachs[i].fee_apply_id = data.fee_apply_id;
                        }
                    }

                    for (var i = 0; i < data.fin_fee_apply_lineoffin_fee_apply_headers.length; i++) {
                        var obj = HczyCommon.extend({}, data.fin_fee_apply_lineoffin_fee_apply_headers[i]);
                        obj.apply_bx_amt = parseFloat(obj.allow_amt) - parseFloat(obj.finish_bx_amt);
                        obj.cx_amt = 0;
                        obj.allow_bx_amt = 0;
                        obj.old_bx_amt = obj.finish_bx_amt;
                        $scope.data.currItem.sum_allow_amt += parseFloat(obj.allow_amt);//申请单批准总额

                        obj.apply_bx_amt = obj.apply_bx_amt;
                        obj.allow_bx_amt = obj.allow_bx_amt;
                        obj.finish_bx_amt = obj.finish_bx_amt;
                        obj.cx_amt = obj.cx_amt;
                        obj.pay_amt = obj.pay_amt;
                        obj.allow_amt = obj.allow_amt;

                        $scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers.push(obj);
                        delete obj.prototype;
                    }

                    for (var i = 0; i < $scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers.length; i++) {
                        //已报销完的明细不带出来
                        if($scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers[i].apply_bx_amt == 0){
                            $scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers.splice(i,1);
                        }else{
                            $scope.data.currItem.total_apply_amt += parseFloat($scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers[i].apply_bx_amt);//申请报销总额
                            $scope.data.currItem.total_allow_amt += parseFloat($scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers[i].allow_bx_amt);//批准报销总额
                        }

                    }

                    $scope.lineGridView.setData([]);
                    $scope.lineGridView.setData($scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers);
                    $scope.lineGridView.render();
                });
        })
    };

    /**
     * 人员查询
     */
    $scope.searchEmployeeName = function (searchType) {
        $scope.FrmInfo = {
            title: "人员查询",
            thead: [{
                name: "人员编码",
                code: "employee_code"
            }, {
                name: "姓名",
                code: "employee_name"
            }, {
                name: "部门编码",
                code: "dept_code"
            }, {
                name: "部门名称",
                code: "dept_name"
            }],
            classid: "base_view_erpemployee_org",
            url: "/jsp/baseman.jsp",
            direct: "center",
            sqlBlock: "",
            backdatas: "base_view_erpemployee_orgs",
            ignorecase: "true", //忽略大小写
            searchlist: ["employee_code", "employee_name", "dept_code", "dept_name"],
            postdata: {}
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.chap_name = result.employee_code;
            $scope.data.currItem.org_code = result.dept_code;
            $scope.data.currItem.org_name = result.dept_name;
            if (searchType == "useObj") {
                $scope.data.addCurrItem.useObject_code = result.employee_code;
                $scope.data.addCurrItem.useObject_name = result.employee_name;
                return;
            }
            if (searchType == "ReceiveObj") {
                $scope.data.addCurrItem.receiver_code = result.employee_code;
                $scope.data.addCurrItem.receiver_name = result.employee_name;
            }


        })
    };

    /**
     * 部门查询
     */
    $scope.searchOrg = function () {
        $scope.FrmInfo = {
            title: "部门查询",
            thead: [{
                name: "部门名称",
                code: "dept_name"
            }, {
                name: "部门编码",
                code: "dept_code"
            },{
                name: "机构路径",
                code: "namepath"
            }],
            classid: "dept",
            url: "/jsp/baseman.jsp",
            direct: "center",
            sqlBlock: "",
            backdatas: "depts",
            ignorecase: "true", //忽略大小写
            searchlist: ["dept_name", "dept_code"],
            postdata: {}
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            //详情框报销部门
            if (isEdit == 1 || isEdit == 2) {
                $scope.data.addCurrItem.fee_org_code = result.dept_code;
                $scope.data.addCurrItem.fee_org_name = result.dept_name;
                $scope.data.addCurrItem.fee_org_id = result.dept_id;
            }
            //增加明细框承担部门
            if (isEdit == 0) {
                $scope.data.currItem.org_id = result.dept_id;
                $scope.data.currItem.org_name = result.dept_name;
                $scope.data.currItem.org_code = result.dept_code;
            }
        })
    };

    /**
     * 预算类别查询
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
                code: "org_level"
            }, {
                name: "费用层级",
                code: "fee_type_level"
            }, {
                name: "预算期间类别",
                code: "period_type"
            }, {
                name: "产品层级",
                code: "item_level"
            }, {
                name: "描述",
                code: "description"
            }],
            classid: "fin_bud_type_header",
            url: "/jsp/budgetman.jsp",
            direct: "center",
            sqlBlock: "",
            backdatas: "fin_bud_type_headers",
            ignorecase: "true", //忽略大小写
            searchlist: ["bud_type_name", "bud_type_code", "org_level", "fee_type_level", "period_type", "item_level", "description"],
            postdata: {
                "sqlwhere": "Fin_Bud_Type_Header.Usable=2 and Fin_Bud_Type_Header.Org_Level<>5"
            }
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.bud_type_id = result.bud_type_id;
            $scope.data.currItem.bud_type_code = result.bud_type_code;
            $scope.data.currItem.bud_type_name = result.bud_type_name;
            $scope.data.currItem.period_type = result.period_type;

            $scope.data.currItem.is_control_bud = parseInt(result.is_control_bud);//是否受预算控制

            if ($scope.data.currItem.fee_apply_id <= 0) {
                $scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers = [];
                $scope.lineGridView.setData($scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers);
                $scope.lineGridView.render();
            }

        })
    };

    /**
     * 结算方式查询
     */
    $scope.searchBalanceType = function () {
        $scope.FrmInfo = {
            title: "结算方式查询",
            thead: [{
                name: "结算方式名称",
                code: "balance_type_name"
            }, {
                name: "结算方式编码",
                code: "balance_type_code"
            }, {
                name: "备注",
                code: "remark"
            }],
            classid: "base_balance_type",
            url: "/jsp/baseman.jsp",
            direct: "center",
            sqlBlock: "",
            backdatas: "base_balance_types",
            ignorecase: "true", //忽略大小写
            searchlist: ["balance_type_name", "balance_type_code", "remark"],
            postdata: {}
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.base_balance_type_id = result.base_balance_type_id;
            $scope.data.currItem.balance_type_code = result.balance_type_code;
            $scope.data.currItem.balance_type_name = result.balance_type_name;
        })
    };

    /**
     * 费用项目查询
     */
    $scope.searchFeeItem = function () {
        $scope.FrmInfo = {
            title: "费用项目查询",
            thead: [{
                name: "费用项目编码",
                code: "fee_code"
            }, {
                name: "费用项目名称",
                code: "fee_name"
            }],
            classid: "fin_bud_type_line_obj",
            url: "/jsp/budgetman.jsp",
            direct: "center",
            sqlBlock: "",
            backdatas: "fin_bud_type_line_objs",
            ignorecase: "true", //忽略大小写
            searchlist: ["fee_code", "fee_name"],
            postdata: {
                "bud_type_id": $scope.data.currItem.bud_type_id,
                "flag": "4"
            }
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.addCurrItem.fee_id = result.fee_id;
            $scope.data.addCurrItem.fee_code = result.fee_code;
            $scope.data.addCurrItem.fee_name = result.fee_name;
        })
    };

    /**
     * 收付款类型查询
     */
    $scope.searchPayType = function () {
        $scope.FrmInfo = {
            title: "收付款类型查询",
            thead: [{
                name: "收付款类型名称",
                code: "payment_type_name"
            }, {
                name: "收付款类型编码",
                code: "payment_type_code"
            }],
            classid: "fd_payment_type",
            url: "/jsp/finman.jsp",
            direct: "center",
            sqlBlock: "",
            backdatas: "fd_payment_types",
            ignorecase: "true", //忽略大小写
            searchlist: ["payment_type_name", "payment_type_code"],
            postdata: {}
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.fd_payment_type_id = result.fd_payment_type_id;
            $scope.data.currItem.payment_type_code = result.payment_type_code;
            $scope.data.currItem.payment_type_name = result.payment_type_name;
        })
    }

    /**
     * 借款单号查询
     */
    $scope.searchLoanNo = function () {
        $scope.FrmInfo = {
            title: "借款单查询",
            thead: [{
                name: "借款单号",
                code: "loan_no"
            }, {
                name: "部门",
                code: "org_name"
            }, {
                name: "申请总额",
                code: "total_amt"
            }, {
                name: "批准总额",
                code: "total_allow_amt"
            }],
            classid: "mkt_loan_header",
            url: "/jsp/mktman.jsp",
            direct: "center",
            sqlBlock: "",
            backdatas: "mkt_loan_headers",
            ignorecase: "true", //忽略大小写
            searchlist: ["loan_no", "org_name", "total_amt", "total_allow_amt"],
            postdata: {
                "sqlwhere": "stat=5"
            }
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem = result;
            $scope.data.currItem.stat = 1;
            $scope.data.currItem.cyear = new Date().getFullYear();
            $scope.data.currItem.cmonth = new Date().getMonth() + 1;
            $scope.data.currItem.chap_name = strUserId;
            $scope.data.currItem.total_apply_amt = parseFloat(result.total_amt);
            $scope.data.currItem.bank_accno = result.bank_accno;
            $scope.data.currItem.bank_code = result.bank_code;
            $scope.data.currItem.bank_name = result.bank_name;
            $scope.data.currItem.payment_type_name = result.business_type_name;//付款类型
            $scope.data.currItem.fd_payment_type_id = result.business_type;

            $scope.data.currItem.total_allow_amt = 0;
            $scope.data.currItem.sum_allow_amt = 0;
            var postData = {};
            postData.loan_id = result.loan_id;
            BasemanService.RequestPost("mkt_loan_header", "select", JSON.stringify(postData))
                .then(function (data) {
                    if (!$scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers) {
                        $scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers = [];
                    }
                    //把借款单的附件带到报销单中
                    if (data.objattachs.length != 0) {
                        $scope.data.currItem.objattachs = data.objattachs;
                        for (var i = 0; i < $scope.data.currItem.objattachs.length; i++) {
                            $scope.data.currItem.objattachs[i].loan_id = data.loan_id;
                        }
                    }
                    for (var i = 0; i < data.mkt_loan_lineofmkt_loan_headers.length; i++) {
                        var obj = HczyCommon.extend({}, data.mkt_loan_lineofmkt_loan_headers[i]);
                        obj.apply_bx_amt = obj.allow_amt;
                        obj.cx_amt = 0;
                        obj.allow_bx_amt = 0;
                        obj.pay_amt = 0;
                        obj.finish_bx_amt = 0;

                        obj.apply_bx_amt = obj.apply_bx_amt;
                        obj.allow_bx_amt = obj.allow_bx_amt;
                        obj.finish_bx_amt = obj.finish_bx_amt;
                        obj.cx_amt = obj.cx_amt;
                        obj.pay_amt = obj.pay_amt;
                        obj.allow_amt = obj.allow_amt;

                        $scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers.push(obj);
                        delete obj.prototype;
                    }

                    $scope.lineGridView.setData([]);
                    $scope.lineGridView.setData($scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers);
                    $scope.lineGridView.render();
                });
        })
    }


    /**
     * 往来对象查询
     */
    $scope.searchAcObj = function (searchType) {
        var sqlWhere = "";
        if (searchType == "useObj") {
            if ($scope.data.addCurrItem.useobject_type == null || $scope.data.addCurrItem.useobject_type == undefined) {
                BasemanService.swal("提示", "请选择使用对象类型");
                return;
            }
            sqlWhere = "ac_object_type=" + $scope.data.addCurrItem.useobject_type;
        }
        if (searchType == "ReceiveObj") {
            if ($scope.data.addCurrItem.receiver_type == null || $scope.data.addCurrItem.receiver_type == undefined || $scope.data.addCurrItem.receiver_type == 0) {
                BasemanService.swal("提示", "请选择收款对象类型");
                return;
            }
            sqlWhere = "ac_object_type=" + $scope.data.addCurrItem.receiver_type
        }
        $scope.FrmInfo = {
            title: "往来对象查询",
            thead: [{
                name: "往来对象名称",
                code: "base_ac_object_name"
            }, {
                name: "往来对象编码",
                code: "base_ac_object_code"
            }, {
                name: "备注",
                code: "remark"
            }],
            classid: "base_ac_object",
            url: "/jsp/baseman.jsp",
            direct: "center",
            sqlBlock: "",
            backdatas: "base_ac_objects",
            ignorecase: "true", //忽略大小写
            searchlist: ["base_ac_object_name", "base_ac_object_code", "remark"],
            postdata: {
                "sqlwhere": sqlWhere
            }
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            if (searchType == "useObj") {
                $scope.data.addCurrItem.useobject_code = result.base_ac_object_code;
                $scope.data.addCurrItem.useobject_name = result.base_ac_object_name;
            }
            if (searchType == "ReceiveObj") {
                $scope.data.addCurrItem.receiver_code = result.base_ac_object_code;
                $scope.data.addCurrItem.receiver_name = result.base_ac_object_name;
            }
        })
    };

    /**
     * 保存增加明细框的内容到明细网格中
     */
    var objline = [];
    $scope.saveAddData = function () {
        lineData = $scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers;
        if ($scope.data.addCurrItem.fee_code == "" || $scope.data.addCurrItem.fee_code == undefined) {
            BasemanService.swal("提示", "费用项目编码不能为空");
            return;
        }
        // if ($scope.data.addCurrItem.useobject_code == "" || $scope.data.addCurrItem.useobject_code == undefined) {
        //     BasemanService.swal("提示", "费用使用对象编码不能为空");
        //     return;
        // }
        // if ($scope.data.addCurrItem.receiver_code == "" || $scope.data.addCurrItem.receiver_code == undefined) {
        //     BasemanService.swal("提示", "费用收款对象编码不能为空");
        //     return;
        // }
        if ($scope.data.addCurrItem.apply_bx_amt == "" || $scope.data.addCurrItem.apply_bx_amt == undefined || $scope.data.addCurrItem.apply_bx_amt <= 0) {
            BasemanService.swal("提示", "申请报销金额必须大于0");
            return;
        }

        //多次报销情况下：判断本次申请报销额不能大于（申请单批准金额-累计已报销额）
        if ($scope.data.currItem.fee_apply_id > 0) {
            if ($scope.data.addCurrItem.apply_bx_amt > ($scope.data.addCurrItem.allow_amt - $scope.data.addCurrItem.finish_bx_amt)) {
                BasemanService.swalWarning("提示", "本次申请报销额【" + $scope.data.addCurrItem.apply_bx_amt + "】大于可报销额【" + ($scope.data.addCurrItem.allow_amt - $scope.data.addCurrItem.finish_bx_amt) + "】");
                return;
            }
        }

        $scope.data.addCurrItem.old_bx_amt = 0;//原报销金额
        $scope.data.addCurrItem.canuse_amt = 0;//可用预算
        $scope.data.addCurrItem.item_type_id = 0;
        $scope.data.addCurrItem.crm_entid = 0;
        $scope.data.currItem.total_apply_amt = 0;//申请总额
        $scope.data.currItem.total_allow_amt = 0;//批准总额
        $scope.data.currItem.sum_allow_amt = 0;  //申请单批准总额
        if ($scope.data.addCurrItem.allow_bx_amt == undefined || $scope.data.addCurrItem.allow_bx_amt == null) {
            $scope.data.addCurrItem.allow_bx_amt = 0;
        }
        if ($scope.data.addCurrItem.cx_amt == undefined || $scope.data.addCurrItem.cx_amt == null) {
            $scope.data.addCurrItem.cx_amt = 0;
        }
        if ($scope.data.addCurrItem.finish_bx_amt == null) {
            $scope.data.addCurrItem.finish_bx_amt = 0;
        }
        if ($scope.data.addCurrItem.pay_amt == null) {
            $scope.data.addCurrItem.pay_amt = 0;
        }
        if (lineData.length >= 1) {
            if (lineData.length == 1 && isEdit == 1) {
                $scope.lineGridView.setData([]);
                $scope.lineGridView.setData(lineData);
                $scope.lineGridView.render();
                $("#addLineModal").modal("hide");
            }
            if (lineData.length > 1 && isEdit == 1) {
                var arr = lineData.concat();//拷贝网格数据
                delete arr[idx];//删除选中行的数据
                //删除数组中为空的项
                for (var j = 0; j < arr.length; j++) {
                    if (arr[j] == undefined) {
                        arr.splice(j, 1);
                    }
                }
                //判断除了选中行之外的其他网格数据
                for (var i = 0; i < arr.length; i++) {
                    var fee_code = arr[i].fee_code;
                    var fee_org_code = arr[i].fee_org_code;
                    var useobject_code = arr[i].useobject_code;
                    if ($scope.data.addCurrItem.fee_code == fee_code && $scope.data.addCurrItem.fee_org_code == fee_org_code && $scope.data.addCurrItem.useobject_code == useobject_code) {
                        BasemanService.swalWarning("提示", "不能重复添加相同部门、相同费用项目和相同使用对象的明细！");
                        return;
                    }
                }
            } else if (isEdit == 2) {
                //判断同一承担部门同一费用项目的报销明细不能重复添加
                for (var i = 0; i < lineData.length; i++) {
                    var fee_code = lineData[i].fee_code;
                    var fee_org_code = lineData[i].fee_org_code;
                    var useobject_code = lineData[i].useobject_code;
                    if ($scope.data.addCurrItem.fee_code == fee_code && $scope.data.addCurrItem.fee_org_code == fee_org_code && $scope.data.addCurrItem.useobject_code == useobject_code) {
                        BasemanService.swalWarning("提示", "不能重复添加相同部门、相同费用项目和相同使用对象的明细！");
                        return;
                    }
                }
            }
        }
        //如果增加明细--叠加数据
        if (isEdit == 2) {
            var a = $scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers.length;
            $scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers[a] = JSON.parse(JSON.stringify($scope.data.addCurrItem));
        } else {
            $scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers[idx] = JSON.parse(JSON.stringify($scope.data.addCurrItem));
        }
        //计算申请总额和批准总额
        if (lineData.length == 1) {
            $scope.data.currItem.total_apply_amt = parseFloat($scope.data.addCurrItem.apply_bx_amt);
        } else {
            for (var i = 0; i < lineData.length; i++) {
                $scope.data.currItem.total_apply_amt += parseFloat(lineData[i].apply_bx_amt);
                $scope.data.currItem.total_allow_amt += parseFloat(lineData[i].allow_bx_amt);
            }
        }
        for (var i = 0; i < lineData.length; i++) {
            if ($scope.data.currItem.fee_apply_id == undefined) {
                lineData[i].allow_amt = 0;
            }
        }
        $scope.lineGridView.setData([]);
        $scope.lineGridView.setData(lineData);
        $scope.lineGridView.render();
        isEdit = 0;
        $("#addLineModal").modal("hide");
        objline = lineData.concat();
    }

    /**
     * 保存数据
     */
    $scope.saveData = function (bsubmit) {
        if ($scope.lineGridView.getCellEditor() != undefined) {
            $scope.lineGridView.getCellEditor().commitChanges();
        }
        if (isEdit == 0) {
            if ($scope.data.currItem.stat != 1) {
                $("#detailModal").modal("hide");
                return;
            }
        }
        if ($scope.data.currItem.project_code == "" || !$scope.data.currItem.project_code) {
            BasemanService.swal("提示", "工程项目不能为空");
            return;
        }
        if ($scope.data.currItem.bud_type_code == "" || !$scope.data.currItem.bud_type_code) {
            BasemanService.swal("提示", "预算类别不能为空");
            return;
        }
        if ($scope.data.currItem.purpose == "" || !$scope.data.currItem.purpose) {
            BasemanService.swal("提示", "用途不能为空");
            return;
        }
        if ($scope.data.currItem.org_code == "" || !$scope.data.currItem.org_code) {
            BasemanService.swal("提示", "报销部门不能为空");
            return;
        }
        if ($scope.data.currItem.balance_type_name == "" || !$scope.data.currItem.balance_type_name) {
            BasemanService.swal("提示", "结算方式不能为空");
            return;
        }
        /*if ($scope.data.currItem.payment_type_name == "" || $scope.data.currItem.payment_type_name == undefined) {
            BasemanService.swal("提示", "付款类型不能为空" );
            return;
        }*/
        if ($scope.lineGridView.getData().length == 0) {
            BasemanService.swal("提示", "明细表不能为空");
            return;
        }

        for (var i = 0; i < $scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers.length; i++) {
            if ($scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers[i].fee_apply_id == null) {
                $scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers[i].fee_apply_id = 0;
            }
            // if ($scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers[i].receiver_code == null || $scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers[i].receiver_code == undefined || $scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers[i].receiver_code == "") {
            //     BasemanService.swalWarning("提示", "第" + (i + 1) + "行明细收款对象不能为空！");
            //     return;
            // }
            //多次报销情况下：判断本次申请报销额不能大于（申请单批准金额-累计已报销额）
            var allow_amt = $scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers[i].allow_amt;
            var apply_bx_amt = $scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers[i].apply_bx_amt;
            var finish_bx_amt = $scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers[i].finish_bx_amt;
            if ($scope.data.currItem.fee_apply_id > 0) {
                if (apply_bx_amt > (allow_amt - finish_bx_amt)) {
                    BasemanService.swalWarning("提示", "第" + (i + 1) + "行明细的本次申请报销额【" + apply_bx_amt + "】大于可报销额【" + (allow_amt - finish_bx_amt) + "】!");
                    return;
                }
            }

        }
        // if($scope.data.currItem.objattachs.length ==0 || !data.currItem.objattachs){
        //     BasemanService.swalWarning("提示","请添加附件")
        //     return;
        // }

        var action = "insert";
        if ($scope.data.currItem.bx_id > 0) {
            action = "update";
        }


        if (action == "update") {
            BasemanService.RequestPost("fin_fee_bx_header", action, JSON.stringify($scope.data.currItem))
                .then(function (data) {
                    BasemanService.swalSuccess("成功", "保存成功！");
                    if (bsubmit) {
                        $('#detailtab a:last').tab('show');
                        if (angular.element('#wfinspage').length == 0) {
                            $("#wfinsform").append("<iframe id='wfinspage' style='width: 100%;height: 100%;background-color: #e2e5ec;'></iframe>");
                        }
                        $scope.initWfIns(true);
                    }
                    //$scope.closeWindow();
                    return;
                });
        }
        if (action == "insert") {
            $scope.data.currItem.is_payed = 1;
            $scope.data.currItem.is_credence = 1;
            BasemanService.RequestPost("fin_fee_bx_header", action, JSON.stringify($scope.data.currItem))
                .then(function (data) {
                    for (var i = 0; i < data.fin_fee_bx_lineoffin_fee_bx_headers.length; i++) {
                        $scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers[i].old_bx_amt = data.fin_fee_bx_lineoffin_fee_bx_headers[i].apply_bx_amt;
                    }
                    BasemanService.swalSuccess("成功", "保存成功！");
                    //添加成功后框不消失直接Select方法查该明细
                    $scope.data.currItem.bx_id = data.bx_id;
                    $scope.selectCurrenItem();
                    if (bsubmit) {
                        $('#detailtab a:last').tab('show');
                        if (angular.element('#wfinspage').length == 0) {
                            $("#wfinsform").append("<iframe id='wfinspage' style='width: 100%;height: 100%;background-color: #e2e5ec;'></iframe>");
                        }
                        $scope.initWfIns(true);
                    }
                    // $("#save").attr('disabled',false);
                    isEdit = 0;
                });
        }
    }

    /**
     * 查询详情
     * @param args
     */
    $scope.selectCurrenItem = function () {
        $scope.sale_center = [];
        isEdit = 0;
        if ($scope.data.currItem.bx_id > 0) {
            //调用后台select方法查询详情
            BasemanService.RequestPost("fin_fee_bx_header", "select", JSON.stringify({"bx_id":$scope.data.currItem.bx_id}))
                .then(function (data) {
                    $scope.data.currItem = data;
                    $scope.data.currItem.sum_allow_amt = 0;

                    //显示销售渠道
                    $scope.sale_center.push({name:$scope.data.currItem.sale_center});
                    if($scope.sale_center.length == 1){
                        $scope.onlyOne = true;
                    }else{
                        $scope.onlyOne = false;
                    }

                    if ($scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers) {
                        for (var i = 0; i < $scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers.length; i++) {
                            //将已报销金额赋值给后台的原报销金额
                            $scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers[i].old_bx_amt = $scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers[i].finish_bx_amt;
                            //计算申请单批准总额
                            if ($scope.data.currItem.fee_apply_id > 0) {
                                $scope.data.currItem.sum_allow_amt += parseFloat($scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers[i].allow_amt);
                            }
                        }
                        //重绘网格
                        $scope.lineGridView.setData([]);
                        $scope.lineGridView.setData($scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers);
                        $scope.lineGridView.render();
                    }
                    $scope.editorFun();
                });
        } else {
            //增加报销单时初始化数据
            // $("#save").attr('disabled',false);
            $scope.data.currItem = {
                "bx_id": 0,
                "stat": 1,
                "creator": strUserId,
                "creator_view":window.userbean.username,
                "chap_name_view":window.userbean.username,
                "create_time": new Date().Format("yyyy-MM-dd hh:mm:ss"),
                "chap_name": strUserId,
                "cyear": new Date().getFullYear(),
                "cmonth": new Date().getMonth() + 1,
                "org_id" : window.userbean.loginuserifnos[0].org_id,
                "org_code":window.userbean.loginuserifnos[0].org_code,
                "org_name":window.userbean.loginuserifnos[0].org_name,
                fin_fee_bx_lineoffin_fee_bx_headers: []
            };
            $scope.lineGridView.setData($scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers);
            $scope.editorFun();
        }

    };

    /**
     * 网格修改触发事件
     */
    function cellchange() {
        $scope.data.currItem.total_apply_amt = 0;
        //修改本次申请报销额
        for (var i = 0; i < $scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers.length; i++) {
            $scope.data.currItem.total_apply_amt += parseFloat($scope.data.currItem.fin_fee_bx_lineoffin_fee_bx_headers[i].apply_bx_amt);
        }
    }

    //模态框消失时触发事件
    $('#addLineModal').on('hide.bs.modal', function () {
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
                    url: "/web/cpc/filesuploadsave2.do",
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
     * 初始化流程
     * @param bSubmit
     */
    var randomNum = new Date().getTime();
    $scope.initWfIns = function (bSubmit) {
        HczyCommon.stringPropToNum($scope.data.currItem);
        //制单后才显示流程
        if ($scope.data.currItem.bx_id && $scope.data.currItem.bx_id > 0) {
            if ($scope.data.currItem.wfid && $scope.data.currItem.wfid > 0) {
                if (angular.element('#wfinspage').attr('src') != '/web/index.jsp#/crmman/wfins//' + $scope.data.currItem.wfid + '/' + $scope.data.objtypeid + '/' + $scope.data.currItem.bx_id + '/0?showmode=2') {
                    angular.element('#wfinspage').attr('src', '/web/index.jsp?t='+randomNum+'#/crmman/wfins//' + $scope.data.currItem.wfid + '/' + $scope.data.objtypeid + '/' + $scope.data.currItem.bx_id + '/0?showmode=2');
                }
            } else if ($scope.data.currItem.stat == 1) {
                $scope.data.bSubmit = bSubmit;
                $scope.getWfTempId($scope.data.objtypeid);
            }
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
        BasemanService.RequestPost("cpcobjconf", "select", JSON.stringify(postData))
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
            angular.element('#wfinspage').attr('src', '/web/index.jsp?t='+randomNum+'#/crmman/wfins/' + wftempid + '//' + $scope.data.objtypeid + '/' + $scope.data.currItem.bx_id + '/1?showmode=2');
        } else {
            angular.element('#wfinspage').attr('src', '/web/index.jsp?t='+randomNum+'#/crmman/wfins/' + wftempid + '//' + $scope.data.objtypeid + '/' + $scope.data.currItem.bx_id + '/0?showmode=2');
        }
        $scope.data.bSubmit = false;
    }
    /**
     * 流程实例初始化
     */
    // $scope.initWfIns = function (bSubmit) {
    //     HczyCommon.stringPropToNum($scope.data.currItem);
    //     //制单后才显示流程
    //     if ($scope.data.currItem.bx_id && $scope.data.currItem.bx_id > 0) {
    //         if ($scope.data.currItem.wfid && $scope.data.currItem.wfid > 0) {
    //             if (angular.element('#wfinspage').attr('src') != '/index.jsp#/crmman/wfins//' + $scope.data.currItem.wfid + '/' + $scope.data.objtypeid + '/' + $scope.data.currItem.bx_id + '/0?showmode=2') {
    //                 angular.element('#wfinspage').attr('src', '/index.jsp#/crmman/wfins//' + $scope.data.currItem.wfid + '/' + $scope.data.objtypeid + '/' + $scope.data.currItem.bx_id + '/0?showmode=2');
    //             }
    //         } else if ($scope.data.currItem.stat == 1) {
    //             var postData = {
    //                 "objtypeid": $scope.data.objtypeid
    //             }
    //             BasemanService.RequestPost("cpcobjconf", "select", JSON.stringify(postData))
    //                 .then(function (data) {
    //                     if (data.objwftempofobjconfs && data.objwftempofobjconfs.length > 0) {
    //                         if (bSubmit) {
    //                             if (angular.element('#wfinspage').attr('src') != '/index.jsp#/crmman/wfins/' + data.objwftempofobjconfs[0].wftempid + '//' + $scope.data.objtypeid + '/' + $scope.data.currItem.bx_id + '/1?showmode=2') {
    //                                 angular.element('#wfinspage').attr('src', '/index.jsp#/crmman/wfins/' + data.objwftempofobjconfs[0].wftempid + '//' + $scope.data.objtypeid + '/' + $scope.data.currItem.bx_id + '/1?showmode=2');
    //                             }
    //                         } else {
    //                             if (angular.element('#wfinspage').attr('src') != '/index.jsp#/crmman/wfins/' + data.objwftempofobjconfs[0].wftempid + '//' + $scope.data.objtypeid + '/' + $scope.data.currItem.bx_id + '/0?showmode=2') {
    //                                 angular.element('#wfinspage').attr('src', '/index.jsp#/crmman/wfins/' + data.objwftempofobjconfs[0].wftempid + '//' + $scope.data.objtypeid + '/' + $scope.data.currItem.bx_id + '/0?showmode=2');
    //                             }
    //                         }
    //                     }
    //                 });
    //         }
    //     }
    // }

    $scope.onTabChange = function (e) {
        // 获取已激活的标签页的名称
        var tabName = $(e.target).text();
        if ('流程' == tabName) {
            if (angular.element('#wfinspage').length == 0) {
                $("#wfinsform").append("<iframe id='wfinspage' style='width: 100%;height: 100%;background-color: #e2e5ec;'></iframe>");
            }
            $scope.initWfIns($scope.data.bSubmit);
        }
    }

    //详情页面隐藏时初始化显示第一个tab页面
    /*$('#detailModal').on('hidden.bs.modal', function (e) {
        //隐藏后默认显示第一个
        $('#detailtab a:first').tab('show');
        //angular.element('#wfinspage').attr('src', '');
        $("#wfinsform").empty();
    })*/
    //modal显示时绑定切换事件
    $('#detailtab').on('shown.bs.tab', $scope.onTabChange);



    //使用对象类型下拉框值改变时触发事件
    $("#useobj").change(function () {
        $scope.data.addCurrItem.useobject_code = "";
        $scope.data.addCurrItem.useobject_name = "";
    })
    //收款对象类型下拉框值改变时触发事件
    $("#recobj").change(function () {
        $scope.data.addCurrItem.receiver_code = "";
        $scope.data.addCurrItem.receiver_name = "";
    })

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



    //对外暴露scope对象
    window.currScope = $scope;

    IncRequestCount()
    DecRequestCount()
}

//注册控制器
angular.module('inspinia')
    .controller('ctrl_fin_fee_bx_bill', fin_fee_bx_bill);