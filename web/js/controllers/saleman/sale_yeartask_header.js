/**这是费用报销查询界面js*/
function sale_yeartask_header($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {

    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "Sale_YearTask_Head", //表名类名
        key: "", //主键
        nextStat: "sale_yeartask_head", //详情页菜单stat
        classids: "sale_yeartask_headers", //后台返回的列表名
        sqlBlock: "1=1", //初始条件
        thead: [], //固定为空
        Headergrids: [{
            optionname: 'viewOptions',
            idname: ''
        }] //网格的option列表
    };
    $scope.data = {};
    $scope.data.currItem = {};
    var create_time = new Date().toLocaleDateString();
    $scope.months = [1,2,3,4,5,6,7,8,9,10,11,12];
    $scope.crm_entids = [];
    $scope.item_type_ids =[];
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "crm_entid"})
        .then(function (data) {
            $scope.crm_entids = data.dicts;
            var crm_entids = [];
            for (var i = 0; i < data.dicts.length; i++) {
                crm_entids[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('viewColumns', 'crm_entid')) {
                $scope.viewColumns[$scope.getIndexByField('viewColumns', 'crm_entid')].options = crm_entids;
                $scope.headerGridView.setColumns($scope.viewColumns);
            }
        });
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "item_type_id"})
        .then(function (data) {
            $scope.item_type_ids = data.dicts;
            var item_type_ids = [];
            for (var i = 0; i < data.dicts.length; i++) {
                item_type_ids[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('viewColumns', 'item_type_id')) {
                $scope.viewColumns[$scope.getIndexByField('viewColumns', 'item_type_id')].options = item_type_ids;
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
    $scope.lineOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false
    };
    //列属性
    $scope.viewColumns = [
        {
            name: "任务单号",
            id: "bx_no",
            field: "bx_no",
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
            name: "任务版本号",
            id: "creator",
            field: "creator",
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
            id: "fee_apply_no",
            field: "fee_apply_no",
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
            name: "年度",
            id: "cyear",
            field: "cyear",
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
            name: "成本中心编码",
            id: "cmonth",
            field: "cmonth",
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
            id: "org_code",
            field: "org_code",
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
            name: "年度预算总额",
            id: "bud_type_code",
            field: "bud_type_code",
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
        },     {
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
            name: "品牌",
            id: "style",
            field: "style",
            editable: false,
            cellEditor: "文本框",
            width: 100,
            height: 80,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            editor: Slick.Editors.DropDownEditor,
            formatter: Slick.Formatters.SelectOption,
        }, {
            name: "年度任务总额",
            id: "adjust_amt",
            field: "adjust_amt",
            editable: true,
            width: 100,
            height: 80,
            editor: Slick.Editors.Text
        },
        {
            name: "年度预算总额",
            id: "bud_type_code",
            field: "bud_type_code",
            editable: true,
            width: 120,
            height: 80,
            editor: Slick.Editors.Text
        }, {
            name: "1月",
            id: "bud_type_name",
            field: "bud_type_name",
            editable: true,
            width: 120,
            height: 80,
            editor: Slick.Editors.Text
        }, {
            name: "2月",
            id: "object_code",
            field: "object_code",
            editable: true,
            width: 120,
            height: 80,
            editor: Slick.Editors.Text
        }, {
            name: "3月",
            id: "object_type",
            field: "object_type",
            editor: Slick.Editors.DropDownEditor,
            formatter: Slick.Formatters.SelectOption,
            editable: false,
            width: 120,
            height: 80,
        }, {
            name: "4月",
            id: "org_code",
            field: "org_code",
            editable: true,
            width: 100,
            height: 80,
            editor: Slick.Editors.Text
        },
        {
            name: "5月",
            id: "org_name",
            field: "org_name",
            editable: false,
            width: 100,
            height: 80,
            editor: Slick.Editors.Text
        },
        {
            name: "6月",
            id: "crm_entid",
            field: "crm_entid",
            editable: false,
            cellEditor: "文本框",
            width: 100,
            height: 80,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            editor: Slick.Editors.DropDownEditor,
            formatter: Slick.Formatters.SelectOption,
            options: []
        },
        {
            name: "7月",
            id: "item_type_id",
            field: "item_type_id",
            editable: false,
            cellEditor: "文本框",
            width: 100,
            height: 80,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            editor: Slick.Editors.DropDownEditor,
            formatter: Slick.Formatters.SelectOption,
            options: []
        }, {
            name: "8月",
            id: "dname",
            field: "dname",
            width: 100,
            height: 80,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            name: "9月",
            id: "dname",
            field: "dname",
            width: 100,
            height: 80,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            name: "10月",
            id: "dname",
            field: "dname",
            width: 100,
            height: 80,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            name: "11月",
            id: "dname",
            field: "dname",
            width: 100,
            height: 80,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            name: "12月",
            id: "dname",
            field: "dname",
            width: 100,
            height: 80,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            name: "操作",
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter: editDetailButton
        }
    ]

//创建Headergrid，“table”为表格生成位置的ID
    $scope.headerGridView = new Slick.Grid("#viewGrid", [], $scope.viewColumns, $scope.viewOptions);
    $scope.lineGridView = new Slick.Grid("#lineGrid", [], $scope.lineColumns, $scope.lineOptions);

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
            postData.adjust_id = args.grid.getDataItem(args.row).adjust_id;
            var bill_type = args.grid.getDataItem(args.row).bill_type;
            var adjust_no = args.grid.getDataItem(args.row).adjust_no;
            if (confirm("确定要删除 " + bill_type + "预算调整 " + adjust_no + " 吗？")) {
                //删除数据成功后再删除网格数据
                BasemanService.RequestPost("fin_bud_adjust_header", "delete", JSON.stringify(postData))
                    .then(function (data) {
                        dg.getData().splice(rowidx, 1);
                        dg.invalidateAllRows();
                        dg.render();
                        alert("删除成功！");
                    });
            }

            e.stopImmediatePropagation();
        }
    };

    function dgLineClick(e, args) {
        //点击删除按钮处理事件
        if ($(e.target).hasClass("deldetailbtn")) {
            var dg = $scope.lineGridView;
            var rowidx = args.row;
            var postData = {};
            postData.adjust_id = args.grid.getDataItem(args.row).adjust_id;
            var bill_type = args.grid.getDataItem(args.row).bill_type;
            var adjust_no = args.grid.getDataItem(args.row).adjust_no;
            dg.getData().splice(rowidx, 1);
            dg.invalidateAllRows();
            dg.render();
            alert("删除成功！");
        }
        e.stopImmediatePropagation();
    };

    //绑定点击事件
    $scope.headerGridView.onClick.subscribe(dgOnClick);
    $scope.lineGridView.onClick.subscribe(dgLineClick);


    /**
     * 查询
     */
    $scope.searchBX = function () {

        $scope.data.currItem.search_flag = 4 ;
        BasemanService.RequestPost("sale_yeartask_head","search",JSON.stringify($scope.data.currItem)).then(function (data) {
            $scope.headerGridView.setData(data.sale_yeartask_headers);
            $scope.headerGridView.render();
        })
    }
    /**
     * 查询后台数据
     */
    $scope.searchData = function () {
        var postdata = {};
        postdata.search_flag = 4;
        BasemanService.RequestPost("sale_yeartask_head", "search", JSON.stringify(postdata))
            .then(function (data) {
                $scope.headerGridView.setData([]);
                $scope.headerGridView.setData(data.sale_yeartask_heads);
                $scope.headerGridView.render();
                console.log(data);
            });
    }

    /**
     * 清空搜索框
     */
    $scope.clear = function () {
        $scope.data.currItem = {};
    }
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
            },  {
                name: "部门编码",
                code: "fee_org_code"
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
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "fin_fee_apply_headers",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: 10
            },
            searchlist: ["fee_apply_no", "fee_apply_id","cyear","cmonth","fee_org_code","bud_type_code","bud_type_name","purpose","note"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.fee_apply_no = result.fee_apply_no;
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
            },  {
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
            searchlist: ["employee_no", "employee_name","employee_id","employee_code","dept_code","dept_name"]
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
            classid: "Fin_Bud_Type_Header",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "fin_bud_type_headers",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: 10
            },
            searchlist: ["bud_type_id", "bud_type_name", "bud_type_code","Org_Level","Fee_Type_Level","Period_Type","Description"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.bud_type_name = result.bud_type_name;
            $scope.data.currItem.bud_type_code = result.bud_type_code;
            $scope.data.currItem.bud_type_id = result.bud_type_id;

        })
    };

    /**
     * gird高度自适应
     */
    $rootScope.init = function () {
        var wH = $(window).height();
        var headerH = 60;
        var navtabH = 42;
        var tittleH = $(".page-title").height() + 24;
        var searchH = $(".title-form").height();
        var gridH = wH - headerH - navtabH - tittleH - searchH - 35;
        $(".slick-grid").css("height", gridH);
    }
    $rootScope.init();

    $scope.searchData();//初始化表格数据
}

//注册控制器
angular.module('inspinia')
    .controller('sale_yeartask_header', sale_yeartask_header);