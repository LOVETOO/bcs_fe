/**
 * 客户回款单
 */
function fd_rebate_head($scope,BasemanService, BaseService ) {
    $scope.data = {};
    $scope.data.currItem = {};
    //初始化数据
    $scope.billStats = [];

    //添加按钮
    var editHeaderButtons =  function (row, cell, value, column, rowData) {
        var buttonHtml = '<button class="btn btn-sm btn-info dropdown-toggle viewbtn" style="padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;">查看</button>';
        if (rowData.stat <= 1){
            buttonHtml += '<button class="btn btn-sm btn-info dropdown-toggle delbtn" style="padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;">删除</button>';
            //buttonHtml += '<button class="btn btn-sm btn-info dropdown-toggle checkbtn" style="padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;">审核</button>';
        }
        return buttonHtml;
    };

    //网格设置
    $scope.headerOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false
    };
    //定义网格字段
    $scope.headerColumns = [
        {   id: "seq",
            name: "序号",
            field: "seq",
            width: 60
        },{
            name: "操作",
            width: 90,
            formatter: editHeaderButtons
        },{
            id: "stat",
            name: "状态",
            field: "stat",
            width: 80,
            formatter: Slick.Formatters.SelectOption,
            type:'list'
        },{
            id: "rebate_code",
            name: "返利单号",
            field: "rebate_code",
            width: 120,
            type:"string"
        },{
            id: "rebate_type",
            name: "返利方式",
            field: "rebate_type",
            width: 80,
            formatter: Slick.Formatters.SelectOption,
            type:"list"
        },{
            id: "write_off_amt",
            name: "应冲总金额",
            field: "rebate_amt",
            width: 90,
            formatter: Slick.Formatters.Money,
            cssClass: "amt",
            type:"number"
        },{
            id: "order_amt",
            name: "订货金额",
            field: "order_amt",
            width: 80,
            formatter: Slick.Formatters.Money,
            cssClass: "amt",
            type:"number"
        },{
            id: "dept_name",
            name: "运营中心",
            field: "dept_name",
            width: 100,
            type:"string"
        },{
            id: "project_code",
            name: "项目编码",
            field: "project_code",
            width: 130,
            type:"string"
        }, {
            id: "project_name",
            name: "项目名称",
            field: "project_name",
            width: 200,
            type:"string"
        },{
            id: "customer_code",
            name: "客户编码",
            field: "customer_code",
            width: 100,
            type:"string"
        }, {
            id: "customer_name",
            name: "客户名称",
            field: "customer_name",
            width: 200,
            type:"string"
        }, {
            id: "creation_date",
            name: "制单日期",
            field: "creation_date",
            width: 130,
            formatter: Slick.Formatters.Date,
            type:"date"
        },{
            id: "note",
            name: "备注",
            field: "note",
            width: 240,
            type:"string"
        }
    ];

    //网格初始化
    $scope.headerGridView = new Slick.Grid("#headerGridView",[], $scope.headerColumns, $scope.headerOptions);

    //明细绑定点击事件
    $scope.headerGridView.onClick.subscribe(dgOnClick);
    $scope.headerGridView.onDblClick.subscribe(dgDblClick);



    /**
     * 取词汇值方法
     */
    function searchDict(dictname, field, grid, gridcolumns, columnname) {
        var dictdata = [];
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: dictname})
            .then(function (data) {
                var dicts = [];
                var gridnames = [];
                for (var i = 0; i < data.dicts.length; i++) {
                    dicts[i] = {
                        value: parseInt(data.dicts[i].dictvalue),
                        desc: data.dicts[i].dictname,
                        id: parseInt(data.dicts[i].dictvalue),
                        name: data.dicts[i].dictname
                    };
                    dictdata.push(dicts[i]);
                }
                if ($scope.getIndexByField(columnname, field)) {
                    gridcolumns[$scope.getIndexByField(columnname, field)].options = dicts;
                    grid.setColumns(gridcolumns);
                }
            });
        return dictdata;
    }

    $scope.getIndexByField = function (columns, field) {
        for (var i = 0; i < $scope[columns].length; i++) {
            if ($scope[columns][i].field == field) {
                return i;
                break;
            }
        }
        return false
    }

    //取词汇值
    $scope.RebateTypes = searchDict("rebate_type", "rebate_type", $scope.headerGridView, $scope.headerColumns, "headerColumns");

    $scope.billStats = searchDict("stat", "stat", $scope.headerGridView, $scope.headerColumns, "headerColumns");

    /**
     * 网格单击事件
     */
    function dgOnClick(e, args) {
        var dg = $scope.headerGridView;
        if ($(e.target).hasClass("viewbtn")) {
            $scope.detail(args,'view');
            e.stopImmediatePropagation();
        }
        //点击删除按钮处理事件
        else if ($(e.target).hasClass("delbtn")) {
            var rowidx = args.row;
            var postData = {};
            postData.fd_rebate_head_id = args.grid.getDataItem(rowidx).fd_rebate_head_id;
            var rebate_code = args.grid.getDataItem(rowidx).rebate_code;
            BasemanService.swalWarning("删除", "确定要删除单号 " + rebate_code + " 吗？", function (bool) {
                if (bool) {
                    BasemanService.RequestPost("fd_rebate_head", "delete", JSON.stringify(postData))
                        .then(function (data) {
                            dg.getData().splice(rowidx, 1);
                            dg.invalidateAllRows();
                            dg.render();
                            BasemanService.notice("删除成功！", "alert-success");
                        });
                } else {
                    return;
                }
            })
            e.stopImmediatePropagation();
        }else if ($(e.target).hasClass("checkbtn")) {
            var rowidx = args.row;
            var postData = {};
            postData.fd_rebate_head_id = args.grid.getDataItem(rowidx).fd_rebate_head_id;
            var rebate_code = args.grid.getDataItem(rowidx).rebate_code;
            BasemanService.swalWarning("审核", "确定要审核单号 " + rebate_code + " 吗？", function (bool) {
                if (bool) {
                    BasemanService.RequestPost("fd_rebate_head", "check", JSON.stringify(postData))
                        .then(function (data) {
                            $scope.searchData();
                            BasemanService.notice("审核成功！", "alert-success");
                        });
                } else {
                    return;
                }
            })
            e.stopImmediatePropagation();
        }
    };

    /**
     * 网格双击事件
     */
    function dgDblClick(e, args) {
        $scope.detail(args,'view');
    }

    /**
     * 查询主表数据
     */
    $scope.searchData = function (postdata) {
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
        if ($scope.sqlwhere && $scope.sqlwhere !=""){
            postdata.sqlwhere = $scope.sqlwhere
        }
        BasemanService.RequestPost("fd_rebate_head", "search", postdata).then(function (data) {
            BaseService.pageInfoOp($scope, data.pagination);
            setGridData($scope.headerGridView, data.fd_rebate_heads);
        });
    }


    /**
     * 查看详细/新增
     */
    $scope.detail = function (args,type) {

        if(type == 'view'){
            BasemanService.openModal({"style":{width:1050,height:580},"url": "/index.jsp#/finman/fd_rebate_pro/" + args.grid.getDataItem(args.row).fd_rebate_head_id,
                "title":"工程返利申请","obj":$scope,"action":"update",ondestroy: $scope.refresh});
        }
        if(type == 'add'){
            BasemanService.openModal({"style":{width:1050,height:580},"url": "/index.jsp#/finman/fd_rebate_pro/0","title":"工程返利申请",
                "obj":$scope,"action":"insert",ondestroy: $scope.refresh});
        }
    }

    $scope.refresh = function () {
        $scope.searchData();
    }

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
            lineMaxSeq = datas.length;
        }
        //设置数据
        gridView.setData(datas);
        //重绘网格
        gridView.render();
    }

    /**
     * 条件查询
     */
    $scope.searchBySql = function () {
        $scope.FrmInfo = {
            title: "",
            thead: [],
            url: "/jsp/req.jsp",
            sqlBlock: "",
            backdatas: "fd_rebate_head",
            ignorecase: "true", //忽略大小写
            postdata: {},
            is_high: true
        };
        $.each($scope.headerColumns, function (i, item) {
            if (item.type) {
                $scope.FrmInfo.thead.push({
                    name: item.name,
                    code: item.field,
                    type: item.type,
                    dicts: item.options
                })
            }
        })
        var obj = $scope.FrmInfo;
        var str = JSON.stringify(obj);
        sessionStorage.setItem("frmInfo",str);
        BasemanService.open(CommonPopController1, $scope).result.then(function (result) {
            $scope.oldPage = 1;
            $scope.currentPage = 1;
            if (!$scope.pageSize) {
                $scope.pageSize = "20";
            }
            $scope.totalCount = 1;
            $scope.pages = 1;
            var postdata = {
                pagination: "pn=1,ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0",
                sqlwhere: result,                                                          //result为返回的sql语句
            }
            $scope.sqlwhere = result;
            $scope.searchData(postdata)
        })
    }


    //网格高度自适应 , 控制器后面调用：
    BasemanService.initGird();

    //初始化分页
    BaseService.pageGridInit($scope);
}
//注册控制器
angular.module('inspinia')
    .controller('fd_rebate_head', fd_rebate_head);