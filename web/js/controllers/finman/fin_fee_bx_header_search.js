/**这是费用报销查询js*/
function fin_fee_bx_header_search($scope, BaseService,$location, $rootScope, $modal, $timeout,
                                  BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    $scope.data = {"objtypeid": 1238};
    var cyear = new Date().getFullYear();
    $scope.data.currItem = {
        "cyear": cyear
    };
    $scope.months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    $scope.status = [];
    $scope.billStats = [
        {id:1,name:"制单"},
        {id:3,name:"已启动"},
        {id:5,name:"已审核"},
    ];

    $scope.useObjTypes = [];
    //词汇表往来对象取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "ac_object_type"})
        .then(function (data) {
            $scope.useObjTypes = data.dicts;
            // SinoccCommon.stringPropToNum(data.dicts);
            var useObjTypes = [];
            for (var i = 0; i < data.dicts.length; i++) {
                useObjTypes[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
                if ($scope.getIndexByField('viewColumns', 'receiver_type')) {
                    $scope.viewColumns[$scope.getIndexByField('viewColumns', 'receiver_type')].options = useObjTypes;
                    $scope.headerGridView.setColumns($scope.viewColumns);
                }
                if ($scope.getIndexByField('viewColumns', 'useobject_type')) {
                    $scope.viewColumns[$scope.getIndexByField('viewColumns', 'useobject_type')].options = useObjTypes;
                    $scope.headerGridView.setColumns($scope.viewColumns);
                }
            }
        });


    //词汇表单据状态取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            var billStats = [];
            for (var i = 0; i < data.dicts.length; i++) {
                billStats[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('viewColumns', 'stat')) {
                $scope.viewColumns[$scope.getIndexByField('viewColumns', 'stat')].options = billStats;
                $scope.headerGridView.setColumns($scope.viewColumns);
            }
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

    // **********网格**********

    $scope.viewOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        enableAddRow: true,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false
    };

    $scope.cmonths = {}
    //列属性
    $scope.viewColumns = [
        {
            name: "报销单号",
            id: "bx_no",
            field: "bx_no",
            width: 130
        }, {
            name: "制单人",
            id: "creator",
            field: "creator",
            width: 100
        }, {
            name: "制单时间",
            id: "create_time",
            field: "create_time",
            width: 160
        }, {
            name: "单据状态",
            id: "stat",
            field: "stat",
            width: 80,
            options:[],
            formatter: Slick.Formatters.SelectOption
        }, {
            name: "申请单号",
            id: "fee_apply_no",
            field: "fee_apply_no",
            width: 150
        }, {
            name: "年度",
            id: "cyear",
            field: "cyear",
            width: 100
        }, {
            name: "月度",
            id: "cmonth",
            field: "cmonth",
            width: 50
        }, {
            name: "报销部门编码",
            id: "org_code",
            field: "org_code",
            width: 120
        }, {
            name: "报销部门名称",
            id: "org_name",
            field: "org_name",
            width: 140
        }, {
            name: "预算类别编码",
            id: "bud_type_code",
            field: "bud_type_code",
            width: 100
        }, {
            name: "预算类别名称",
            id: "bud_type_name",
            field: "bud_type_name",
            width: 150
        }, {
            name: "报销人",
            id: "chap_name",
            field: "chap_name",
            width: 100
        }, {
            name: "结算方式",
            id: "balance_type_name",
            field: "balance_type_name",
            width: 120
        },{
            name: "费用用途",
            id: "purpose",
            field: "purpose",
            width: 200
        }, {
            name: "费用项目编码",
            id: "fee_code",
            field: "fee_code",
            width: 110
        }, {
            name: "费用项目名称",
            id: "fee_name",
            field: "fee_name",
            width: 180
        },
        {
            name: "费用承担部门编码",
            id: "fee_org_code",
            field: "fee_org_code",
            width: 130
        }, {
            name: "费用承担部门",
            id: "fee_org_name",
            field: "fee_org_name",
            width: 120
        },/* {
            name: "费用使用对象类型",
            id: "useobject_type",
            field: "useobject_type",
            width: 130,
            options:[],
            formatter: Slick.Formatters.SelectOption
        }, {
            name: "费用使用对象编码",
            id: "useobject_code",
            field: "useobject_code",
            width: 130
        }, {
            name: "费用使用对象",
            id: "useobject_name",
            field: "useobject_name",
            width: 150
        }, {
            name: "收款对象类型",
            id: "receiver_type",
            field: "receiver_type",
            width: 100,
            options:[],
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
            width: 150
        }, */{
            name: "申请单申请总额",
            id: "total_apply",
            field: "total_apply",
            width: 130,
            cssClass: "amt",
            formatter: Slick.Formatters.Money,
        },{
            name: "申请单批准总额",
            id: "total_apply_allow",
            field: "total_apply_allow",
            width: 130,
            cssClass: "amt",
            formatter: Slick.Formatters.Money,
        }, {
            name: "申请单已报销总额",
            id: "total_apply_finish",
            field: "total_apply_finish",
            width: 140,
            cssClass: "amt",
            formatter: Slick.Formatters.Money,
        }, {
            name: "本次报销申请金额",
            id: "apply_bx_amt",
            field: "apply_bx_amt",
            width: 130,
            cssClass: "amt",
            formatter: Slick.Formatters.Money,
        }, {
            name: "本次报销批准金额",
            id: "allow_bx_amt",
            field: "allow_bx_amt",
            width: 130,
            cssClass: "amt",
            formatter: Slick.Formatters.Money,
        }, {
            name: "本次报销申请总额",
            id: "total_bx",
            field: "total_bx",
            width: 140,
            cssClass: "amt",
            formatter: Slick.Formatters.Money,
        }, {
            name: "本次报销批准总额",
            id: "total_bx_allow",
            field: "total_bx_allow",
            width: 140,
            cssClass: "amt",
            formatter: Slick.Formatters.Money,
        },/* {
            name: "可用预算",
            id: "canuse_amt",
            field: "canuse_amt",
            width: 100,
            cssClass: "amt",
            formatter: Slick.Formatters.Money,
        }, {
            name: "借方会计科目编码",
            id: "subject_no",
            field: "subject_no",
            width: 130
        }, {
            name: "借方会计科目名称",
            id: "subject_name",
            field: "subject_name",
            width: 130
        }, */ {
            name: "开户银行名称",
            id: "bank_name",
            field: "bank_name",
            width: 100
        }, {
            name: "开户名称",
            id: "bank_code",
            field: "bank_code",
            width: 100
        }, {
            name: "开户行账号",
            id: "bank_accno",
            field: "bank_accno",
            width: 180
        },{
            name: "备注",
            id: "note",
            field: "note",
            width: 200
        },
    ]

    $scope.headerGridView = new Slick.Grid("#viewGrid", [], $scope.viewColumns, $scope.viewOptions);
    // $scope.headerGridView.onDblClick.subscribe(OnDblClick);

    //双击事件 查看详情
    function OnDblClick(e,args) {
        BasemanService.openModal({
            //url: "/index.jsp#/crmman/feebx/" + args.grid.getDataItem(args.row).bx_id,
            url: "/web/mt_index.jsp?rt=crmman.feebx#/crmman/feebx/" + args.grid.getDataItem(args.row).bx_id+"?showmode=3",
            title: "费用报销",
            obj: $scope,
            ondestroy: $scope.refreshGridView
        });
    }
    /**
     * 页面刷新
     */
    $scope.refreshGridView = function () {
        $scope.sqlwhere = ""
        $scope.searchData();
    }
    /**
     * 查询
     */
    $scope.searchBX = function () {
        if(!$scope.oldPage ){
            $scope.oldPage = 1;
        }
        if(!$scope.currentPage){
            $scope.currentPage = 1;
        }
        if (!$scope.pageSize) {
            $scope.pageSize = "20";
        }
        $scope.totalCount = 1;
        $scope.pages = 1;

        $scope.data.currItem.pagination = "pn=" + $scope.currentPage + ",ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0";
        $scope.searchData($scope.data.currItem);

    }
    /**
     * 查询后台数据
     */
    var a = 0;//调用searchdata的次数
    var creators = [];//制单人集合
    var chap_names = [];//报销人集合
    var fee_apply_nos = [];//申请单号集合
    $scope.searchData = function (postdata) {
        a = a + 1;
        if (!postdata) {
            if(!$scope.oldPage ){
                $scope.oldPage = 1;
            }
            if(!$scope.currentPage){
                $scope.currentPage = 1;
            }
            if (!$scope.pageSize) {
                $scope.pageSize = "20";
            }
            $scope.totalCount = 1;
            $scope.pages = 1;
            postdata = {
                pagination:"pn=" + $scope.currentPage + ",ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0"
            }
        }
        postdata.search_flag = 4;
        BasemanService.RequestPost("fin_fee_bx_header", "search", JSON.stringify(postdata))
            .then(function (data) {
                $scope.data.currItem.fin_fee_bx_headers = data.fin_fee_bx_headers;
                $scope.headerGridView.setData([]);
                $scope.headerGridView.setData(data.fin_fee_bx_headers);
                $scope.headerGridView.render();
                BaseService.pageInfoOp($scope, data.pagination);

                //第一次默认查询时获取制单人、报销人、申请单号集合
                if(a == 1){
                    for(var i = 0; i < $scope.data.currItem.fin_fee_bx_headers.length; i++){
                        if(creators.indexOf($scope.data.currItem.fin_fee_bx_headers[i].creator) == -1){
                            creators.push($scope.data.currItem.fin_fee_bx_headers[i].creator);
                        }
                        if(chap_names.indexOf($scope.data.currItem.fin_fee_bx_headers[i].chap_name) == -1){
                            chap_names.push($scope.data.currItem.fin_fee_bx_headers[i].chap_name);
                        }
                        if(fee_apply_nos.indexOf($scope.data.currItem.fin_fee_bx_headers[i].fee_apply_no) == -1){
                            fee_apply_nos.push($scope.data.currItem.fin_fee_bx_headers[i].fee_apply_no);
                        }
                    }
                }
            });
    }
    /**
     * 清空搜索框
     */
    $scope.clear = function () {
        $scope.data.currItem = {
            "cyear" :cyear
        };
    }
    //网格自适应高度
    BasemanService.initGird();
    //初始化分页
    BaseService.pageGridInit($scope);
    // $scope.searchData();
    /**
     * 申请单号查询
     */
    $scope.searchFee_apply_no = function () {
        $scope.FrmInfo = {
            title: "申请单号查询  ",
            thead: [{
                name: "费用申请单号",
                code: "fee_apply_no"
            }, {
                name: "年度",
                code: "cyear"
            }, {
                name: "月度",
                code: "cmonth",
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
                code: "purpose"
            }, {
                name: "备注",
                code: "note"
            }],
            classid: "Fin_Fee_Apply_Header",
            action: "searchforbxlist",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "fin_fee_apply_headers",
            ignorecase: "true", //忽略大小写
            postdata: {
                "sqlwhere": " fee_apply_no in ('"
                                +fee_apply_nos.join("','")
                                + "') "
            },
            searchlist: ["fee_apply_no", "cyear", "cmonth", "org_name", "bud_type_code", "bud_type_name", "purpose", "note"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.fee_apply_no = result.fee_apply_no;
        })
    };


    /**
     * 人员查询
     */
    $scope.searchEmployee = function (name) {
        var sqlwhere = "";
        if (name == "creator") {
            sqlwhere = " employee_code in ('"
                + creators.join("','")
                + "') ";
        }
        if (name == "chap_name") {
            sqlwhere = " employee_code in ('"
                + chap_names.join("','")
                + "') ";
        }
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
                "sqlwhere":sqlwhere
            },
            searchlist: ["employee_name",  "employee_code", "dept_code", "dept_name"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            if(name == 'chap_name'){
                $scope.data.currItem.chap_name_view = result.employee_name;
                $scope.data.currItem.chap_name = result.employee_code;
            }
            if(name == 'creator'){
                $scope.data.currItem.creator_view = result.employee_name;
                $scope.data.currItem.creator = result.employee_code;
            }
        })
    };
    /**
     * 预算类别
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
                name: "产品类别",
                code: "item_level"
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
            postdata: {},
            searchlist: [ "bud_type_name", "bud_type_code", "org_level", "fee_type_level", "period_type", "item_level","Description"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.bud_type_name = result.bud_type_name;
            $scope.data.currItem.bud_type_code = result.bud_type_code;
            $scope.data.currItem.bud_type_id = result.bud_type_id;

        })
    };

    BasemanService.ReadonlyGrid($scope.headerGridView);

}

//注册控制器
angular.module('inspinia')
    .controller('fin_fee_bx_header_search', fin_fee_bx_header_search);