/**这是预算与费用使用统计分析界面js*/
function fin_bud_fee_employ($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService,BaseService) {

    //设置标题
    $scope.headername = "预算与费用使用统计分析";

    //预留存储
    $scope.data = {
        "bud_year": new Date().getFullYear()
        // "bud_year": 2019

    };

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


    //定义网格字段
    $scope.viewColumns = [
        {
            name: "序号",
            id: "uid",
            field: "uid",
            width: 45,
        }, {
            id: "bud_type_name",
            name: "类别名称",
            field: "bud_type_name",
            width: 140,
        }, {
            id: "object_name",
            name: "费用项目",
            field: "object_name",
            width: 100,
        }, {
            id: "m0102_bud_amt",
            name: "预算额",
            field: "m0102_bud_amt",
            width: 130,
            columnGroup:"1-2月"
        },{
            id: "m0102_used_amt",
            name: "已使用额",
            field: "m0102_used_amt",
            width: 130,
            columnGroup:"1-2月"
        },{
            id: "m0102_balance",
            name: "差额",
            field: "m0102_balance",
            width: 130,
            columnGroup:"1-2月"
        },{
            id: "m03_bud_amt",
            name: "预算额",
            field: "m03_bud_amt",
            width: 130,
            columnGroup:"3月"
        },{
            id: "m03_used_amt",
            name: "已使用额",
            field: "m03_used_amt",
            width: 130,
            columnGroup:"3月"
        },{
            id: "m03_balance",
            name: "差额",
            field: "m03_balance",
            width: 130,
            columnGroup:"3月"
        },{
            id: "m04_bud_amt",
            name: "预算额",
            field: "m04_bud_amt",
            width: 130,
            columnGroup:"4月"
        },{
            id: "m04_used_amt",
            name: "已使用额",
            field: "m04_used_amt",
            width: 130,
            columnGroup:"4月"
        },{
            id: "m04_balance",
            name: "差额",
            field: "m04_balance",
            width: 130,
            columnGroup:"4月"
        },{
            id: "m05_bud_amt",
            name: "预算额",
            field: "m05_bud_amt",
            width: 130,
            columnGroup:"5月"
        },{
            id: "m05_used_amt",
            name: "已使用额",
            field: "m05_used_amt",
            width: 130,
            columnGroup:"5月"
        },{
            id: "m05_balance",
            name: "差额",
            field: "m05_balance",
            width: 130,
            columnGroup:"5月"
        },{
            id: "m06_bud_amt",
            name: "预算额",
            field: "m06_bud_amt",
            width: 130,
            columnGroup:"6月"
        },{
            id: "m06_used_amt",
            name: "已使用额",
            field: "m06_used_amt",
            width: 130,
            columnGroup:"6月"
        },{
            id: "m06_balance",
            name: "差额",
            field: "m06_balance",
            width: 130,
            columnGroup:"6月"
        },{
            id: "m07_bud_amt",
            name: "预算额",
            field: "m07_bud_amt",
            width: 130,
            columnGroup:"7月"
        },{
            id: "m07_used_amt",
            name: "已使用额",
            field: "m07_used_amt",
            width: 130,
            columnGroup:"7月"
        },{
            id: "m07_balance",
            name: "差额",
            field: "m07_balance",
            width: 130,
            columnGroup:"7月"
        },{
            id: "m08_bud_amt",
            name: "预算额",
            field: "m08_bud_amt",
            width: 130,
            columnGroup:"8月"
        },{
            id: "m08_used_amt",
            name: "已使用额",
            field: "m08_used_amt",
            width: 130,
            columnGroup:"8月"
        },{
            id: "m08_balance",
            name: "差额",
            field: "m08_balance",
            width: 130,
            columnGroup:"8月"
        },{
            id: "m09_bud_amt",
            name: "预算额",
            field: "m09_bud_amt",
            width: 130,
            columnGroup:"9月"
        },{
            id: "m09_used_amt",
            name: "已使用额",
            field: "m09_used_amt",
            width: 130,
            columnGroup:"9月"
        },{
            id: "m09_balance",
            name: "差额",
            field: "m09_balance",
            width: 130,
            columnGroup:"9月"
        },{
            id: "m10_bud_amt",
            name: "预算额",
            field: "m10_bud_amt",
            width: 130,
            columnGroup:"10月"
        },{
            id: "m10_used_amt",
            name: "已使用额",
            field: "m10_used_amt",
            width: 130,
            columnGroup:"10月"
        },{
            id: "m10_balance",
            name: "差额",
            field: "m10_balance",
            width: 130,
            columnGroup:"10月"
        },{
            id: "m11_bud_amt",
            name: "预算额",
            field: "m11_bud_amt",
            width: 130,
            columnGroup:"11月"
        },{
            id: "m11_used_amt",
            name: "已使用额",
            field: "m11_used_amt",
            width: 130,
            columnGroup:"11月"
        },{
            id: "m11_balance",
            name: "差额",
            field: "m11_balance",
            width: 130,
            columnGroup:"11月"
        },{
            id: "m12_bud_amt",
            name: "预算额",
            field: "m12_bud_amt",
            width: 130,
            columnGroup:"12月"
        },{
            id: "m12_used_amt",
            name: "已使用额",
            field: "m12_used_amt",
            width: 130,
            columnGroup:"12月"
        },{
            id: "m12_balance",
            name: "差额",
            field: "m12_balance",
            width: 130,
            columnGroup:"12月"
        },{
            id: "",
            name: "预算总额",
            field: "",
            width: 130,
            columnGroup:"累计数"
        },{
            id: "",
            name: "已使用总额",
            field: "",
            width: 130,
            columnGroup:"累计数"
        },{
            id: "",
            name: "差额",
            field: "",
            width: 130,
            columnGroup:"累计数"
        }
    ];


    //网格设置
    $scope.viewOptions = {
        // enableCellNavigation: true,
        // enableColumnReorder: false,
        // editable: false,
        // asyncEditorLoading: false,
        // autoEdit: true,
        // autoHeight: false,
        enableCellNavigation: true,
        enableColumnReorder: false,
        createPreHeaderPanel: true,
        showPreHeaderPanel: true,
        explicitInitialization: true
    };

    //初始化表格
    $scope.dataView = new Slick.Data.DataView();

    $scope.viewGrid = new Slick.Grid("#viewGrid", $scope.dataView, $scope.viewColumns, $scope.viewOptions);


    //部门查询
    $scope.deptSearch=function () {
        $scope.FrmInfo = {
            title: "部门查询",
            thead: [{
                name: "部门名称",
                code: "dept_name"
            }, {
                name: "部门编码",
                code: "dept_code"
            },  {
                name: "备注",
                code: "remark"
            }],
            classid: "dept",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "depts",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: "300"
            },
            searchlist: [""]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.dept_code = result.dept_code;
            $scope.data.dept_name = result.dept_name;
            $scope.data.dept_id=result.dept_id;
        });
    };

    //预算类别查询
    $scope.typeSearch=function () {
        $scope.FrmInfo = {
            title: "预算类别查询",
            thead: [{
                name: "类别名称",
                code: "bud_type_name"
            }, {
                name: "类别编码",
                code: "bud_type_code"
            },  {
                name: "机构层级",
                code: "org_level"
            },  {
                name: "费用层级",
                code: "fee_type_level"
            },  {
                name: "预算期间类别",
                code: "period_type",
                dicts: $scope.period_types,
                type: "list",
            }],
            classid: "fin_bud_type_header",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "fin_bud_type_headers",
            ignorecase: "true", //忽略大小写
            postdata: {
                sqlwhere: " 1=1 "
            },
            searchlist: [""]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.bud_type_code = result.bud_type_code;
            $scope.data.bud_type_name = result.bud_type_name;
            $scope.data.bud_type_id=result.bud_type_id;
        });
    };


    //查询
    $('#searchBtn').click(function () {
        $scope.searchData();
    });

    /***
     * 初始查询 分页
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

        if($scope.data.bud_year){
            postdata.bud_year = $scope.data.bud_year;
        }
        if($scope.data.dept_id){
            postdata.org_id = $scope.data.dept_id;
        }
        if($scope.data.bud_type_id){
            postdata.bud_type_id = $scope.data.bud_type_id;
        }

        BasemanService.RequestPost("fin_bud_fee_employ_search", "search", postdata)
            .then(function (data) {
                //序号
                for (var i = 0; i < data.fin_bud_fee_employs.length; i++) {
                    data.fin_bud_fee_employs[i].uid = i + 1;
                }
                // $scope.headerGridView.setData([]);
                // $scope.headerGridView.setData(data.fin_bud_fee_employs);
                // $scope.headerGridView.render();

                $scope.dataView.beginUpdate();
                $scope.dataView.setItems(data.fin_bud_fee_employs,"uid");
                $scope.dataView.endUpdate();

                BaseService.pageInfoOp($scope, data.pagination);

            });
    };




    $scope.dataView.onRowCountChanged.subscribe(function (e, args) {
        $scope.viewGrid.updateRowCount();
        $scope.viewGrid.render();
    });
    $scope.dataView.onRowsChanged.subscribe(function (e, args) {
        $scope.viewGrid.invalidateRows(args.rows);
        $scope.viewGrid.render();
    });
    $scope.viewGrid.init();
    $scope.viewGrid.onColumnsResized.subscribe(function (e, args) {
        CreateAddlHeaderRow();
    });


    CreateAddlHeaderRow();

    function CreateAddlHeaderRow() {
        var $preHeaderPanel = $($scope.viewGrid.getPreHeaderPanel())
            .empty()
            .addClass("slick-header-columns")
            .css('left','-1000px')
            .width($scope.viewGrid.getHeadersWidth());
        $preHeaderPanel.parent().addClass("slick-header");
        var headerColumnWidthDiff = $scope.viewGrid.getHeaderColumnWidthDiff();
        var m, header, lastColumnGroup = '', widthTotal = 0;

        for (var i = 0; i < $scope.viewColumns.length; i++) {
            m = $scope.viewColumns[i];
            if (lastColumnGroup === m.columnGroup && i>0) {
                widthTotal += m.width;
                header.css("width",widthTotal - headerColumnWidthDiff)
            } else {
                widthTotal = m.width;
                header = $("<div class='ui-state-default slick-header-column' />")
                    .html("<span class='slick-column-name'>" + (m.columnGroup || '') + "</span>")
                    .css("width",m.width - headerColumnWidthDiff)
                    .appendTo($preHeaderPanel);
            }
            lastColumnGroup = m.columnGroup;
        }
    }



    BasemanService.initGird();

    BaseService.pageGridInit($scope);
    BasemanService.ReadonlyGrid($scope.viewGrid);
}
//注册控制器
angular.module('inspinia')
    .controller('fin_bud_fee_employ', fin_bud_fee_employ);

