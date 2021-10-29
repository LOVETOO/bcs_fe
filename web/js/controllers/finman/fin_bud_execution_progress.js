/**这是预算执行进度统计界面js*/
function fin_bud_execution_progress($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService, BaseService) {

    $scope.data = {};
    $scope.data.currItem = {};
    $scope.objects = [];
    $scope.crm_entids = [];
    $scope.item_type_ids_grid = []
    $scope.item_type_ids = []
    var budyear = new Date().getFullYear();
    $scope.data.currItem.bud_year = budyear;
    $scope.months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

    //通用词汇查询
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "crm_entid"})
        .then(function (data) {
            var crm_entids = [];
            for (var i = 0; i < data.dicts.length; i++) {
                crm_entids[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
                $scope.crm_entids.push(crm_entids[i]);
            }
            if ($scope.getIndexByField('viewColumns', 'crm_entid')) {
                $scope.viewColumns[$scope.getIndexByField('viewColumns', 'crm_entid')].options = crm_entids;
                $scope.headerGridView.setColumns($scope.viewColumns);
            }
        });
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "item_type_id"})
        .then(function (data) {
            var item_type_ids = [];
            for (var i = 0; i < data.dicts.length; i++) {
                item_type_ids[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
                $scope.item_type_ids_grid.push(item_type_ids[i]);
            }
            if ($scope.getIndexByField('viewColumns', 'item_type_ids_grid')) {
                $scope.viewColumns[$scope.getIndexByField('viewColumns', 'item_type_ids_grid')].options = item_type_ids;
                $scope.headerGridView.setColumns($scope.viewColumns);
            }
        });

    //选项词汇通用查询用到的方法
    $scope.getIndexByField = function (columns, field) {
        for (var i = 0; i < $scope[columns].length; i++) {
            if ($scope[columns][i].field == field) {
                return i;
                break;
            }
        }
        return false
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
    //列属性
    $scope.viewColumns = [
        {
            name: "部门编码",
            id: "org_code",
            field: "org_code",
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
            name: "部门名称",
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
            name: "费用编码",
            id: "object_code",
            field: "object_code",
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
            name: "费用名称",
            id: "object_name",
            field: "object_name",
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
            name: "月度",
            id: "dname",
            field: "dname",
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
            name: "期初预算",
            id: "bud_amt",
            field: "bud_amt",
            editable: false,
            filter: 'set',
            width: 120,
            height: 80,
            editor: Slick.Editors.Number
        }, {
            name: "期末实际预算",
            id: "fact_amt",
            field: "fact_amt",
            editable: false,
            filter: 'set',
            width: 120,
            height: 80,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            editor: Slick.Editors.Number
        }, {
            name: "上期结转金额",
            id: "last_settle_amt",
            field: "last_settle_amt",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            width: 120,
            height: 80,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            editor: Slick.Editors.Text
        }, {
            name: "本期调整金额",
            id: "adjust_amt",
            field: "adjust_amt",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            width: 120,
            height: 80,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            editor: Slick.Editors.Text
        }, {
            name: "本期已使用金额",
            id: "used_amt",
            field: "used_amt",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            width: 140,
            height: 80,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            editor: Slick.Editors.Text
        }, {
            name: "本期可使用金额",
            id: "canuse_amt",
            field: "canuse_amt",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            width: 140,
            height: 80,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            editor: Slick.Editors.Text
        }
    ]

//创建Headergrid，“table”为表格生成位置的ID
    $scope.headerGridView = new Slick.Grid("#viewGrid", [], $scope.viewColumns, $scope.viewOptions);

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
            if (confirm("确定要删除年度销售任务 " + ysaletask_no + " 吗？")) {
                //删除数据成功后再删除网格数据
                BasemanService.RequestPost("sale_yeartask_head", "delete", JSON.stringify(postData))
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


    /**
     * 查询后台数据
     */
    $scope.searchData = function (postdata) {
        $scope.data.currItem.flag = 3;
        if (postdata) {
            $scope.data.currItem.pagination = postdata.pagination;
        } else {
            $scope.oldPage = 1;
            $scope.currentPage = 1;
            if (!$scope.pageSize) {
                $scope.pageSize = "20";
            }
            $scope.totalCount = 1;
            $scope.pages = 1;
            $scope.data.currItem.pagination = "pn=1,ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0"
        }
        BasemanService.RequestPost("fin_bud", "search", $scope.data.currItem)
            .then(function (data) {
                $scope.headerGridView.setData([]);
                $scope.headerGridView.setData(data.fin_buds);
                $scope.headerGridView.render();
                BaseService.pageInfoOp($scope, data.pagination);
            });
    }

    /**
     * 清空搜索条件
     */
    $scope.clear = function () {
        $scope.data.currItem = {};
    }
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
            searchlist: ["bud_type_id", "bud_type_name", "bud_type_code", "Org_Level", "Fee_Type_Level", "Period_Type", "Description"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.bud_type_name = result.bud_type_name;
            $scope.data.currItem.bud_type_code = result.bud_type_code;
            $scope.data.currItem.bud_type_id = result.bud_type_id;
            var bud_type_id = result.bud_type_id;
            BasemanService.RequestPostAjax("fin_bud_type_header", "select", {"bud_type_id": bud_type_id}).then(function (data) {
                $scope.objects.splice(0, $scope.objects.length);
                var objects = [];
                for (var i = 0; i < data.fin_bud_type_lineoffin_bud_type_headers.length; i++) {
                    objects[i] = {
                        value: data.fin_bud_type_lineoffin_bud_type_headers[i].object_id,
                        desc: data.fin_bud_type_lineoffin_bud_type_headers[i].object_name
                    };
                    $scope.objects.push(objects[i]);
                }
            })
        })
    };
    /**
     * 部门查询
     */
    $scope.searchOrg = function () {

        $scope.FrmInfo = {
            title: "部门查询  ",
            thead: [{
                name: "部门名称",
                code: "dept_name",
            }, {
                name: "部门编码",
                code: "dept_code",
            }],
            classid: "dept",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "depts",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: 15
            },
            searchlist: ["dept_name", "dept_code", "dept_id"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.org_code = result.dept_code;
            $scope.data.currItem.org_name = result.dept_name;
            $scope.data.currItem.org_id = result.dept_id;
        })
    };

    /**
     * 品类选中 改变产品线 事件
     */
    $scope.$watch('data.currItem.crm_entid', function () {
        BasemanService.RequestPostAjax("mis_crm_collate", "getentorgid", {crm_entid: $scope.data.currItem.crm_entid})
            .then(function (data) {
                var item_type_ids = [];
                for (var i = 0; i < data.mis_crm_collate_entofmis_crm_collates.length; i++) {
                    item_type_ids[i] = {
                        value: data.mis_crm_collate_entofmis_crm_collates[i].entorgid,
                        desc: data.mis_crm_collate_entofmis_crm_collates[i].entorgid_name,
                    };
                    $scope.item_type_ids.push(item_type_ids[i]);
                }
            });
    })
    BaseService.pageGridInit($scope);//初始化表格数据
    BasemanService.initGird();//自适应高度
}

//注册控制器
angular.module('inspinia')
    .controller('fin_bud_execution_progress', fin_bud_execution_progress);