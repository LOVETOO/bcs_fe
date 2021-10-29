/**
 * 费用申请单
 * @param $scope
 * @param BaseService
 * @param $location
 * @param $rootScope
 * @param $modal
 * @param $timeout
 * @param BasemanService
 * @param notify
 * @param $state
 * @param localeStorageService
 * @param FormValidatorService
 */
function fin_fee_apply_bill($scope, BaseService, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state,
                            localeStorageService, FormValidatorService, $stateParams) {
    $scope.data = {"objtypeid": 1280, wftemps: [], bSubmit: false, canmodify: true};
    $scope.data.currItem = {"objattachs": [], "fee_apply_id": $stateParams.id};
    $scope.data.addCurrItem = {};
    var activeRow = [];
    var isEdit = 0;
    var canuseAmt = 0;
    var lineData = [];

    //获取路由名称
    var routeName = $state.current.name;
    $scope.routeFlag = 1;  //路由标志：1 费控系统 2 工程费用申请 3 门店装修申请 4 广告投放申请 5 推广活动申请
    //工程费用申请模块
    if(routeName == 'saleman.projfeeapply'){
        $scope.routeFlag = 2;
    }
    //门店装修申请
    if(routeName == 'mktman.decoratefeeapply'){
        $scope.routeFlag = 3;
    }
    //广告投放申请
    if(routeName == 'mktman.advertfeeapply'){
        $scope.routeFlag = 4;
    }
    //推广活动申请
    if(routeName == 'mktman.extendfeeapply'){
        $scope.routeFlag = 5;
    }

    $scope.is_fin = false;//登录用户是否财务人员,默认不是

    $scope.print = false;

    //月份
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

    /*$scope.crmEntids = [
        {value: 1, desc: "所有品类"}
    ]*/

    $scope.useObjTypes = [];
    //词汇表往来对象取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "ac_object_type"})
        .then(function (data) {
            $scope.useObjTypes = data.dicts;
            //HczyCommon.stringPropToNum(data.dicts);
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
        });

    $scope.billStats = [];

    //词汇表单据状态取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            $scope.billStats = data.dicts;
            HczyCommon.stringPropToNum(data.dicts);
        });

    //费用类别词汇值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "apply_type"})
        .then(function (data) {
            $scope.apply_type = data.dicts;
            HczyCommon.stringPropToNum(data.dicts);
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
        if ($scope.data.currItem.stat != 1) {
            return;
        } else {
            return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>编辑</button> " +
                " <button class='btn btn-sm btn-info dropdown-toggle delbtn' " +
                "style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;' >删除</button> ";
        }
    };


    //明细网格中的申请额：不是制单状态的单据不能编辑
    $scope.editorFun = function () {
        if ($scope.getIndexByField('lineColumns', 'apply_amt')) {
            if ($scope.data.currItem.stat == 1) {
                $scope.lineColumns[$scope.getIndexByField('lineColumns', 'apply_amt')].editor = Slick.Editors.Text;
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

    //其他占用预算额列表网格设置
    $scope.otherAmtOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false
    };


    //明细表网格列属性
    $scope.lineColumns = [
        {
            name: "操作",
            width: 100,
            formatter: editlineButtons
        },{
            name: "费用项目编码",
            id: "fee_code",
            field: "fee_code",
            width: 100
        }, {
            name: "费用项目名称",
            id: "fee_name",
            field: "fee_name",
            width: 100
        }, {
            name: "费用承担部门编码",
            id: "fee_org_code",
            field: "fee_org_code",
            width: 130
        }, {
            name: "费用承担部门",
            id: "fee_org_name",
            field: "fee_org_name",
            width: 180
        }, /*{
            name: "使用对象类型",
            id: "useobject_type",
            field: "useobject_type",
            width: 120,
            options: [],
            formatter: Slick.Formatters.SelectOption
        }, {
            name: "使用对象编码",
            id: "useobject_code",
            field: "useobject_code",
            width: 120
        }, {
            name: "使用对象",
            id: "useobject_name",
            field: "useobject_name",
            width: 120
        },*/ {
            name: "申请金额",
            id: "apply_amt",
            field: "apply_amt",
	        cssClass: "amt",
            formatter: Slick.Formatters.Money,
            width: 100
        }, {
            name: "批准金额",
            id: "allow_amt",
            field: "allow_amt",
            cssClass: "amt",
            formatter: Slick.Formatters.Money,
            width: 100
        }/*, {
            name: "已申请报销金额",
            id: "applied_bx_amt",
            field: "applied_bx_amt",
            cssClass:"amt",
            width: 100
        }*/, {
            name: "已报销金额",
            id: "finish_bx_amt",
            field: "finish_bx_amt",
            cssClass: "amt",
            formatter: Slick.Formatters.Money,
            width: 100
        },/* {
            name: "可使用预算",
            id: "canuse_amt",
            field: "canuse_amt",
            cssClass: "amt",
            width: 100
        },*/ {
            name: "备注",
            id: "note",
            field: "note",
            width: 100
        }
    ];

    //其他占用预算额列表网格列属性
    $scope.otherAmtColumns = [
        {
            name: "单据类型",
            id: "bill_type",
            field: "bill_type",
            width: 100
        }, {
            name: "单据号",
            id: "fee_apply_no",
            field: "fee_apply_no",
            width: 150,
        }, {
            name: "年度",
            id: "cyear",
            field: "cyear",
            width: 60,
        }, {
            name: "月度",
            id: "cmonth",
            field: "cmonth",
            width: 60,
        }, {
            name: "申请金额",
            id: "apply_amt",
            field: "apply_amt",
            cssClass: "amt",
            width: 100
        }, {
            name: "预算类别编码",
            id: "bud_type_code",
            field: "bud_type_code",
            width: 120
        }, {
            name: "预算类别名称",
            id: "bud_type_name",
            field: "bud_type_name",
            width: 140
        }, {
            name: "费用项目编码",
            id: "fee_code",
            field: "fee_code",
            width: 120
        }, {
            name: "费用项目名称",
            id: "fee_name",
            field: "fee_name",
            width: 140
        }, {
            name: "费用承担部门",
            id: "fee_org_name",
            field: "fee_org_name",
            width: 140
        }, {
            name: "制单人",
            id: "creator",
            field: "creator",
            width: 100,
        }, {
            name: "制单时间",
            id: "create_time",
            field: "create_time",
            width: 180,
        }
    ];

    //初始化网格
    $scope.lineGridView = new Slick.Grid("#lineViewGrid", [], $scope.lineColumns, $scope.lineOptions);
    $scope.otherAmtGridView = new Slick.Grid("#otherAmtViewGrid", [], $scope.otherAmtColumns, $scope.otherAmtOptions);
    //网格可复制
    BasemanService.ReadonlyGrid($scope.otherAmtGridView);
    /**
     * 明细网格点击事件
     * @param e
     * @param args
     */
    var activeRow = "";

    function dgLineClick(e, args) {
        activeRow = args.grid.getDataItem(args.row);
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

    /**
     * 明细网格双击事件
     */
    function dgLineDblClick(e, args) {
        if ($scope.data.currItem.stat == 1) {
            $scope.editLine(e, args);
        }
    }

    //明细绑定点击事件
    $scope.lineGridView.onClick.subscribe(dgLineClick);
    $scope.lineGridView.onDblClick.subscribe(dgLineDblClick);

    /**
     * 删除明细网格行
     * 备注：已审核或已结案，不允许修改
     */
    $scope.delLineRow = function (args) {
        var code = args.grid.getDataItem(args.row).fee_code;
        if ($scope.data.currItem.stat == 5 || $scope.data.currItem.stat == 98) {
            BasemanService.swalWarning("提示", "此单据已审核或已结案，不允许修改");
            return;
        }
        BasemanService.swalDelete("删除", "确定要删除编码为 " + code + " 的费用项目吗吗？", function (bool) {
            if (bool) {
                var dg = $scope.lineGridView;
                dg.getData().splice(args.row, 1);
                $scope.data.currItem.total_apply_amt = 0;
                for (var i = 0; i < dg.getData().length; i++) {
                    $scope.data.currItem.total_apply_amt += parseFloat(dg.getData()[i].apply_amt);
                }
                dg.invalidateAllRows();
                dg.render();
            } else {
                return;
            }
        })
    };

    /**
     * 增加/编辑明细事件
     */
    $scope.addLine = function () {
        if ($scope.data.currItem.bud_type_code == null || $scope.data.currItem.bud_type_code == undefined) {
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
    };
    var idx = -1;
    $scope.editLine = function (e, args) {
        idx = args.row;
        if (objline.length == 0) {
            $scope.data.addCurrItem = JSON.parse(JSON.stringify($scope.data.currItem.fin_fee_apply_lineoffin_fee_apply_headers[args.row]));
        } else {
            $scope.data.addCurrItem = JSON.parse(JSON.stringify(objline[args.row]));
        }
        // $scope.data.addCurrItem.apply_amt = $scope.data.addCurrItem.apply_amt;
        $scope.data.addCurrItem.apply_amt = parseFloat($scope.data.addCurrItem.apply_amt);

        isEdit = 1;
        $("#addLineModal").modal()
        $scope.$apply();
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
     * 部门查询
     */
    $scope.searchOrg = function (routeFlag) {
        if (isEdit != 0) {
            if ($scope.data.addCurrItem.fee_code == undefined || $scope.data.addCurrItem.fee_code == null) {
                BasemanService.swal("提示", "请选择项目编码");
                return;
            }
        }
        var sqlBlock = "";
        if(routeFlag > 2){
            sqlBlock = "dept_type = 6"
        }
        $scope.FrmInfo = {
            title: "部门查询",
            thead: [{
                name: "部门名称",
                code: "dept_name"
            }, {
                name: "部门编码",
                code: "dept_code"
            }],
            classid: "dept",
            url: "/jsp/baseman.jsp",
            direct: "center",
            sqlBlock: sqlBlock,
            backdatas: "depts",
            ignorecase: "true", //忽略大小写
            searchlist: ["dept_name", "dept_code"],
            postdata: {}
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            //增加明细框承担部门
            if (isEdit == 1 || isEdit == 2) {
                $scope.data.addCurrItem.fee_org_name = result.dept_name;
                $scope.data.addCurrItem.fee_org_code = result.dept_code;
                $scope.data.addCurrItem.fee_org_id = result.dept_id;
            }
            //详情框申请部门
            if (isEdit == 0) {
                $scope.data.currItem.org_id = result.dept_id;
                $scope.data.currItem.org_code = result.dept_code;
                $scope.data.currItem.org_name = result.dept_name;
            } else {
                $scope.getCanuseAmt();
            }

        })
    };


    /**
     * 终端网点查询
     */
    $scope.searchTerminal = function () {
        $scope.FrmInfo = {
            title: "终端网点查询",
            thead: [{
                name: "网点编码",
                code: "terminal_code"
            }, {
                name: "网点名称",
                code: "terminal_name"
            }],
            classid: "mkt_terminal",
            url: "/jsp/baseman.jsp",
            direct: "center",
            sqlBlock: "",
            ignorecase: "true", //忽略大小写
            searchlist: ["terminal_code", "terminal_name"],
            postdata: {"flag": 99}
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.terminal_id = result.terminal_id;
            $scope.data.currItem.terminal_code = result.terminal_code;
            $scope.data.currItem.terminal_name = result.terminal_name;
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
            postdata: {}
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.bud_type_code = result.bud_type_code;
            $scope.data.currItem.bud_type_name = result.bud_type_name;
            $scope.data.currItem.bud_type_id = result.bud_type_id;
            $scope.data.currItem.period_type = result.period_type;

            $scope.data.currItem.is_control_bud = parseInt(result.is_control_bud);//是否受预算控制

            $scope.data.currItem.fin_fee_apply_lineoffin_fee_apply_headers = []
            $scope.lineGridView.setData($scope.data.currItem.fin_fee_apply_lineoffin_fee_apply_headers);
            $scope.lineGridView.render();
        })
    };

    /**
     * 人员查询
     */
    $scope.searchApplyMan = function () {
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
            $scope.data.currItem.chap_name_view = result.employee_name;
            $scope.data.currItem.org_code = result.dept_code;
            $scope.data.currItem.org_name = result.dept_name;
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
                "flag": "4",
                "sqlwhere":" apply_type = '1' "
            }
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.addCurrItem.fee_id = result.fee_id;
            $scope.data.addCurrItem.fee_code = result.fee_code;
            $scope.data.addCurrItem.fee_name = result.fee_name;
            if ($scope.data.addCurrItem.fee_org_code != undefined) {
                $scope.getCanuseAmt();
            }
        })
    };

    /**
     * 往来对象查询
     */
    $scope.searchAcObj = function () {
        if ($scope.data.addCurrItem.useobject_type == "" || $scope.data.addCurrItem.useobject_type == undefined) {
            BasemanService.swal("提示", "请选择使用对象类型");
            return;
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
                "sqlwhere": "ac_object_type=" + $scope.data.addCurrItem.useobject_type
            }
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.addCurrItem.useobject_code = result.base_ac_object_code;
            $scope.data.addCurrItem.useobject_name = result.base_ac_object_name;
        })
    };

    /**
     * 保存明细到网格中
     */
    var objline = [];
    $scope.saveAddData = function () {
        // $scope.data.addCurrItem.apply_amt = delMoney($scope.data.addCurrItem.apply_amt);
        // $scope.data.addCurrItem.canuse_amt = delMoney($scope.data.addCurrItem.canuse_amt);
        if ($scope.data.currItem.stat != 1) {
            $("#addLineModal").modal("hide");
            return;
        }
        if ($scope.data.addCurrItem.fee_code == "" || $scope.data.addCurrItem.fee_code == undefined) {
            BasemanService.swal("提示", "费用项目编码不能为空");
            return;
        }
        // if ($scope.data.addCurrItem.useobject_code == "" || $scope.data.addCurrItem.useobject_code == undefined) {
        //     BasemanService.swal("提示", "费用使用对象编码不能为空");
        //     return;
        // }
        if ($scope.data.addCurrItem.apply_amt == "" || $scope.data.addCurrItem.apply_amt == undefined || parseFloat($scope.data.addCurrItem.apply_amt) <= 0) {
            BasemanService.swal("提示", "申请金额必须大于0");
            return;
        }

        $scope.data.addCurrItem.item_type_id = 0;
        $scope.data.addCurrItem.crm_entid = 0;
        $scope.data.currItem.total_apply_amt = 0;
        $scope.data.currItem.total_allow_amt = 0;
        if ($scope.data.addCurrItem.finish_bx_amt == null) {
            $scope.data.addCurrItem.finish_bx_amt = 0;
        }
        if ($scope.data.addCurrItem.applied_bx_amt == null) {
            $scope.data.addCurrItem.applied_bx_amt = 0;
        }
        if ($scope.data.addCurrItem.allow_amt == null) {
            $scope.data.addCurrItem.allow_amt = 0;
        }
        lineData = $scope.data.currItem.fin_fee_apply_lineoffin_fee_apply_headers;
        //添加或修改明细表时做条件判断
        if (lineData.length) {
            if ((1 == lineData.length && isEdit == 1)) {
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
                    var useobject_code = lineData[i].useobject_code;   //暂时不校验useobject_code
                    if ($scope.data.addCurrItem.fee_code == fee_code && $scope.data.addCurrItem.fee_org_code == fee_org_code) {
                        BasemanService.swalWarning("提示", "不能重复添加相同部门、相同费用项目的明细！");
                        return;
                    }

                }
            } else if (isEdit == 2) {
                //判断同一承担部门同一费用项目及同一使用对象的报销明细不能重复添加
                if (lineData.length != 0) {
                    for (var i = 0; i < lineData.length; i++) {
                        var fee_code = lineData[i].fee_code;
                        var fee_org_code = lineData[i].fee_org_code;
                        var useobject_code = lineData[i].useobject_code;   //暂时不校验useobject_code
                        if ($scope.data.addCurrItem.fee_code == fee_code && $scope.data.addCurrItem.fee_org_code == fee_org_code) {
                            BasemanService.swalWarning("提示", "不能重复添加相同部门、相同费用项目的明细！");
                            return;
                        }
                    }
                }
            }
        }
        //检验申请金额是否小于等于可用预算
        if($scope.data.currItem.is_control_bud == 2){
            $scope.getCanuseAmt();
            if ($scope.data.addCurrItem.apply_amt > $scope.data.addCurrItem.canuse_amt) {
                BasemanService.swalWarning("提示", "申请金额必须小于等于可用预算");
                return;
            }
        }

        //如果增加明细--叠加数据
        if (isEdit == 2) {
            var a = $scope.data.currItem.fin_fee_apply_lineoffin_fee_apply_headers.length;
            $scope.data.currItem.fin_fee_apply_lineoffin_fee_apply_headers[a] = JSON.parse(JSON.stringify($scope.data.addCurrItem));
        } else {
            $scope.data.currItem.fin_fee_apply_lineoffin_fee_apply_headers[idx] = JSON.parse(JSON.stringify($scope.data.addCurrItem));
        }
        //计算申请总额和批准总额
        if (lineData.length == 1) {
            $scope.data.currItem.total_apply_amt = parseFloat($scope.data.addCurrItem.apply_amt);
        } else {
            for (var i = 0; i < lineData.length; i++) {
                // lineData[i].apply_amt = lineData[i].apply_amt;
                // lineData[i].allow_amt = lineData[i].allow_amt;
                $scope.data.currItem.total_apply_amt += parseFloat(lineData[i].apply_amt);
                $scope.data.currItem.total_allow_amt += parseFloat(lineData[i].allow_amt);
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
        //检验报销截止日期不能在今天之前
        if(new Date($scope.data.currItem.bx_end_date).getTime() <= new Date().getTime()){
            BasemanService.swalWarning("提示","报销截止日期必须晚于今天！");
            return;
        }
        if ($scope.lineGridView.getCellEditor() != undefined) {
            $scope.lineGridView.getCellEditor().commitChanges();
        }
        if (isEdit == 1 || isEdit == 3) {
            if ($scope.data.currItem.stat != 1) {
                $("#detailModal").modal("hide");
                return;
            }
        }
        if($scope.routeFlag == 2){
            if ($scope.data.currItem.project_code == "" || !$scope.data.currItem.project_code) {
                BasemanService.swal("提示", "工程项目不能为空");
                return;
            }
        }

        if ($scope.data.currItem.bud_type_code == "" || !$scope.data.currItem.bud_type_code) {
            BasemanService.swal("提示", "预算类别不能为空");
            return;
        }
        if ($scope.data.currItem.chap_name == "" || !$scope.data.currItem.chap_name) {
            BasemanService.swal("提示", "申请人不能为空");
            return;
        }
        if ($scope.data.currItem.org_code == "" || !$scope.data.currItem.org_code) {
            BasemanService.swal("提示", "申请部门编码不能为空");
            return;
        }
        if ($scope.data.currItem.purpose == "" || !$scope.data.currItem.purpose) {
            BasemanService.swal("提示", "用途不能为空");
            return;
        }
        if ($scope.lineGridView.getData().length == 0) {
            BasemanService.swal("提示", "明细表不能为空");
            return;
        }
        var action = "insert";
        if ($scope.data.currItem.fee_apply_id > 0) {
            action = "update";
        }

        if (action == "update") {
            var sum = 0;
            var canuse = 0;
            var object = "";
            var org = "";
            if ($scope.data.currItem.fin_fee_apply_headers) {
                delete $scope.data.currItem.fin_fee_apply_headers;
            }
            if ($scope.data.currItem.cpcwfuseropinions) {
                delete $scope.data.currItem.cpcwfuseropinions;
            }
            //修改明细时比较对应预算的申请金额之和是否大于可用预算
            if($scope.data.currItem.is_control_bud == 2){ //受预算控制时才检验
                var arr = [];
                for (var i = 0; i < $scope.data.currItem.fin_fee_apply_lineoffin_fee_apply_headers.length; i++) {
                    if ($scope.data.addCurrItem.fee_code == $scope.data.currItem.fin_fee_apply_lineoffin_fee_apply_headers[i].fee_code
                        && $scope.data.addCurrItem.fee_org_code == $scope.data.currItem.fin_fee_apply_lineoffin_fee_apply_headers[i].fee_org_code) {
                        sum += $scope.data.currItem.fin_fee_apply_lineoffin_fee_apply_headers[i].apply_amt;
                        object = $scope.data.currItem.fin_fee_apply_lineoffin_fee_apply_headers[i].fee_name;
                        org = $scope.data.currItem.fin_fee_apply_lineoffin_fee_apply_headers[i].fee_org_name;

                        arr.push($scope.data.currItem.fin_fee_apply_lineoffin_fee_apply_headers[i]);
                    }
                }
                for (var j = 0; j < arr.length; j++) {  //遍历同一预算下的申请单明细，取明细中可使用预算的最大值
                    canuse = arr[0].canuse_amt;
                    if (arr[j].canuse_amt > arr[0].canuse_amt) {
                        canuse = arr[j];
                    }
                }
                if (sum > canuse) {
                    BasemanService.swalWarning("提示", "费用项目【" + object + "】和部门【" + org + "】的申请金额之和【" + sum + "】大于该预算的可用预算【" + canuse + "】！");
                    return;
                }
            }

            //调用后台保存方法
            BasemanService.RequestPost("fin_fee_apply_header", action, JSON.stringify($scope.data.currItem))
                .then(function (data) {
                    BasemanService.swalSuccess("成功", "保存成功！");
                    if (bsubmit) {
                        if (angular.element('#wfinspage').length == 0) {
                            $("#wfinsform").append("<iframe id='wfinspage' style='width: 100%;height: 100%;background-color: #e2e5ec;'></iframe>");
                        }
                        $scope.initWfIns(true);
                        $('#detailtab a:last').tab('show');
                    }
                    //$scope.closeWindow();
                });
        }
        if (action == "insert") {
            $scope.data.currItem.is_advance = 1;
            BasemanService.RequestPost("fin_fee_apply_header", action, JSON.stringify($scope.data.currItem))
                .then(function (data) {
                    BasemanService.swalSuccess("成功", "保存成功！");
                    //添加成功后框不消失直接Select方法查该明细
                    $scope.data.currItem.fee_apply_id = data.fee_apply_id;
                    $scope.selectCurrenItem();
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
    $scope.selectCurrenItem = function () {
        isEdit = 0;
        $scope.sale_center = [];

        //控制用户权限
        var loginrole = window.userbean.stringofrole.indexOf("engineering_fin");
        if(loginrole != -1 || window.userbean.isAdmin){
            $scope.is_fin = true;
        }
        if(userbean.isAdmin){
            $scope.admin = true;
        }

        if ($scope.data.currItem.fee_apply_id > 0) {
            //调用后台select方法查询详情
            BasemanService.RequestPost("fin_fee_apply_header", "select", JSON.stringify({"fee_apply_id": $scope.data.currItem.fee_apply_id}))
                .then(function (data) {
                    $scope.data.currItem = data;

                    //显示销售渠道
                    $scope.sale_center.push({name:$scope.data.currItem.sale_center});
                    if($scope.sale_center.length == 1){
                        $scope.onlyOne = true;
                    }else{
                        $scope.onlyOne = false;
                    }

                    if ($scope.data.currItem.fin_fee_apply_lineoffin_fee_apply_headers) {
                        //重绘网格
                        $scope.lineGridView.setData([]);
                        $scope.lineGridView.setData($scope.data.currItem.fin_fee_apply_lineoffin_fee_apply_headers);
                        $scope.lineGridView.render();
                    }
                    //权限初始化
                    $scope.initBillRight();
                    getprint();//加载审核流程信息
                    $scope.editorFun();
                });
        } else {
            //初始化新增的默认数据
            $scope.data.currItem = {
                "fee_apply_id": 0,
                "stat": 1,
                "create_time": new Date().Format("yyyy-MM-dd hh:mm:ss"),
                "employee_name": strUserId,
                "cyear": new Date().getFullYear(),
                "cmonth": new Date().getMonth() + 1,
                "creator": strUserId,
                "creator_view": window.userbean.username,
                "chap_name": strUserId,
                "chap_name_view": window.userbean.username,
                "org_id" : window.userbean.loginuserifnos[0].org_id,
                "org_code":window.userbean.loginuserifnos[0].org_code,
                "org_name":window.userbean.loginuserifnos[0].org_name,
                fin_fee_apply_lineoffin_fee_apply_headers: []
            };
            $scope.lineGridView.setData($scope.data.currItem.fin_fee_apply_lineoffin_fee_apply_headers);
            $scope.editorFun();
        }
    };

    /**
     * 查看其他占用预算额
     */
    $scope.viewOtherAmt = function () {
        var postData = {};
        if (activeRow == "" || activeRow == null) {
            BasemanService.swalWarning("提示", "请选择一行费用项目");
            return;
        }
        if (activeRow.bud_id) {
            postData.bud_id = activeRow.bud_id;
        } else {
            // postData.bud_id = 0;
            //制单时查看其他占用预算额
            postData.flag = 5;
            postData.bud_year = $scope.data.currItem.cyear;
            postData.cmonth = $scope.data.currItem.cmonth;
            postData.period_type = $scope.data.currItem.period_type;
            postData.org_id = activeRow.fee_org_id;
            postData.bud_type_id = $scope.data.currItem.bud_type_id;
            postData.object_id = activeRow.fee_id;
        }

        BasemanService.RequestPost("fin_bud", "queryotherapplyamt", postData)
            .then(function (data) {
                //清空网格
                $scope.otherAmtGridView.setData([]);
                //设置数据
                for (var i = 0; i < data.fin_budoffin_buds.length; i++) {
                }
                //生成合计行
                var dataProvider = new TotalsDataProvider(data.fin_budoffin_buds, $scope.otherAmtColumns);
                $scope.otherAmtGridView.setData(dataProvider);
                //重绘网格
                $scope.otherAmtGridView.render();
                $("#otherAmtModal").modal();
            });
    }

    /**
     * 获取可用预算
     */
    $scope.getCanuseAmt = function () {
        //检验申请金额是否小于等于可用预算
        if (isEdit == 2 || isEdit == 1) {
            var postdata = {};
            if ($scope.data.currItem.fee_apply_id > 0) {
                postdata.fee_apply_id = $scope.data.currItem.fee_apply_id;
                postdata.period_line_id = $scope.data.currItem.period_line_id;
            }
            postdata.cyear = $scope.data.currItem.cyear;
            postdata.cmonth = $scope.data.currItem.cmonth;
            postdata.bud_type_id = $scope.data.currItem.bud_type_id;
            postdata.period_type = $scope.data.currItem.period_type;
            postdata.fee_org_id = $scope.data.addCurrItem.fee_org_id;
            postdata.fee_id = $scope.data.addCurrItem.fee_id;
            postdata.item_type_id = 0;
            BasemanService.RequestPost("fin_fee_apply_header", "getCanuseAmt", JSON.stringify(postdata))
                .then(function (data) {
                    canuseAmt = data.canuseamt;
                    var sumApplyAmt = 0;
                    if (canuseAmt > 0) {
                        for (var i = 0; i < $scope.data.currItem.fin_fee_apply_lineoffin_fee_apply_headers.length; i++) {
                            if ($scope.data.addCurrItem.fee_code == $scope.data.currItem.fin_fee_apply_lineoffin_fee_apply_headers[i].fee_code
                                && $scope.data.addCurrItem.fee_org_code == $scope.data.currItem.fin_fee_apply_lineoffin_fee_apply_headers[i].fee_org_code) {
                                sumApplyAmt += $scope.data.currItem.fin_fee_apply_lineoffin_fee_apply_headers[i].apply_amt;
                            }
                        }
                    }
                    //金额加千分号
                    if (parseFloat(canuseAmt - sumApplyAmt) <= 0) {
                        $scope.data.addCurrItem.canuse_amt = 0;
                    } else {
                        $scope.data.addCurrItem.canuse_amt = parseFloat(canuseAmt - sumApplyAmt);
                    }
                });
        }
    }

    //使用对象类型下拉框值改变时触发事件
    $("#useobj").change(function () {
        $scope.data.addCurrItem.useobject_code = "";
        $scope.data.addCurrItem.useobject_name = "";
    })
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

    /**
     * 流程实例初始化
     */
    var randomNum = new Date().getTime();
    $scope.initWfIns = function (bSubmit) {
        HczyCommon.stringPropToNum($scope.data.currItem);
        //制单后才显示流程
        if ($scope.data.currItem.fee_apply_id && $scope.data.currItem.fee_apply_id > 0) {
            if ($scope.data.currItem.wfid && $scope.data.currItem.wfid > 0) {
                if (angular.element('#wfinspage').attr('src') != '/web/index.jsp#/crmman/wfins//' + $scope.data.currItem.wfid + '/' + $scope.data.objtypeid + '/' + $scope.data.currItem.fee_apply_id + '/0?showmode=2') {
                    angular.element('#wfinspage').attr('src', '/web/index.jsp?t='+randomNum+'#/crmman/wfins//' + $scope.data.currItem.wfid + '/' + $scope.data.objtypeid + '/' + $scope.data.currItem.fee_apply_id + '/0?showmode=2');
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
            $scope.initWfIns($scope.data.bSubmit);
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
            angular.element('#wfinspage').attr('src', '/web/index.jsp?t='+randomNum+'#/crmman/wfins/' + wftempid + '//' + $scope.data.objtypeid + '/' + $scope.data.currItem.fee_apply_id + '/1?showmode=2');
        } else {
            angular.element('#wfinspage').attr('src', '/web/index.jsp?t='+randomNum+'#/crmman/wfins/' + wftempid + '//' + $scope.data.objtypeid + '/' + $scope.data.currItem.fee_apply_id + '/0?showmode=2');
        }
        $scope.data.bSubmit = false;
    }

    //详情页面隐藏时初始化显示第一个tab页面
    // $('#detailModal').on('hidden.bs.modal', function (e) {
    //     //隐藏后默认显示第一个
    //     $('#detailtab a:first').tab('show');
    //     //angular.element('#wfinspage').attr('src', '');
    //     $("#wfinsform").empty();
    // })
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
                        total += parseFloat(data[i][columnId] || 0);
                    }
                    //合计添加千分号
                    if (columnId == "apply_amt") {
                        totals[columnId] = total;
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
    $scope.PreviewMytable = function () {
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
    };

    //加载打印项所需文本
    function getprint() {
        if ($scope.data.currItem.wfid) {
            BasemanService.RequestPost("cpcwf", "select", {"wfid": $scope.data.currItem.wfid}).then(function (data) {
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
    }

    //对外暴露scope
    window.currScope = $scope;

    IncRequestCount()
    DecRequestCount()
}

//注册控制器
angular.module('inspinia')
    .controller('ctrl_fin_fee_apply_bill', fin_fee_apply_bill);