/**
 * 客户回款单
 */
function fd_fund_business($scope, $location, $rootScope, $modal, $timeout, BasemanService, BaseService, notify, $state, localeStorageService, FormValidatorService) {
    $scope.data = {};
    $scope.data.currItem = {};
    $scope.sqlwhere = ""
    //初始化数据
    $scope.ReturnType = [];//回款类型
    $scope.SyscreateType = [];//来源单据类型

    //添加按钮
    var editHeaderButtons = function (row, cell, value, columnDef, dataContext) {
        return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' " +
            "style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>查看</button>";
            //+" <button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;' >删除</button> ";
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
        {   id: "id",
            name: "序号",
            field: "id",
            width: 60
        },{
            name: "操作",
            width: 80,
            formatter: editHeaderButtons
        },{
            id: "ordinal_no",
            name: "回款单号",
            field: "ordinal_no",
            width: 150,
            type:"string"
        }, {
            id: "customer_code",
            name: "客户编码",
            field: "customer_code",
            width: 150,
            type:"string"
        }, {
            id: "customer_name",
            name: "客户名称",
            field: "customer_name",
            width: 130,
            type:"string"
        }, {
            id: "date_fund",
            name: "回款日期",
            field: "date_fund",
            width: 130,
            formatter: Slick.Formatters.Date,
            type:"date"
        }, {
            id: "return_type",
            name: "回款类型",
            field: "return_type",
            width: 110,
            formatter: Slick.Formatters.SelectOption,
            dictcode:"return_type",
            type:"list"
        },{
            id: "bill_no",
            name: "票据号",
            field: "bill_no",
            width: 110,
            type:"string"
        },{
            id: "syscreate_type",
            name: "来源单据类型",
            field: "syscreate_type",
            width: 110,
            formatter: Slick.Formatters.SelectOption,
            dictcode:"syscreate_type",
            type:"list"
        },{
            id: "amount_debit",
            name: "回款金额",
            field: "amount_debit",
            width: 130,
            type:"number",
            formatter: Slick.Formatters.Money,
            cssClass: "amt"
        },{
            id: "amount_cancel_ivc",
            name: "已核销金额",
            field: "amount_cancel_ivc",
            width: 130,
            type:"number",
            formatter: Slick.Formatters.Money,
            cssClass: "amt"
        },  {
            id: "credence_no",
            name: "分配编号",
            field: "credence_no",
            width: 180,
            type:"string"
        }, {
            id: "note",
            name: "备注",
            field: "note",
            width: 240,
            type:"string"
        }
    ];

    //网格初始化
    $scope.headerGridView = new Slick.Grid("#headerGridView",[], $scope.headerColumns, $scope.headerOptions);

    //网格可复制
    BasemanService.ReadonlyGrid($scope.headerGridView);

    //加载词汇
    BasemanService.loadDictToColumns({columns: $scope.headerColumns});

    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "return_type"})
        .then(function (data) {
            $scope.ReturnType = data.dicts;
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

    /**
     * 网格单击事件
     */
    function dgOnClick(e, args) {
        if ($(e.target).hasClass("viewbtn")) {
            $scope.detail(args,'view');
        }
        //点击删除按钮处理事件
        else if ($(e.target).hasClass("delbtn")) {
            var rowidx = args.row;
            //erp引入的客户回款单不允许删除
            if(args.grid.getDataItem(rowidx).syscreate_type == 1){
                BasemanService.swalWarning("提示","ERP引入的回款单不允许删除！");
                return;
            }
            var postData = {};
            postData.fd_fund_business_id = args.grid.getDataItem(rowidx).fd_fund_business_id;
            postData.searchflag = 6;
            var ordinal_no = args.grid.getDataItem(rowidx).ordinal_no;
            BasemanService.swalDelete("删除", "确定要删除单号为 " + ordinal_no + " 的回款单吗？", function (bool) {
                if (bool) {
                    BasemanService.RequestPost("fd_fund_business", "delete", JSON.stringify(postData))
                        .then(function (data) {
                            $scope.headerGridView.getData().splice(args.row, 1);
                            $scope.headerGridView.invalidateAllRows();
                            $scope.headerGridView.render();
                            // $scope.searchData();
                        });
                } else {
                    return;
                }
            })

        }
    };

    /**
     * 网格双击事件
     */
    function dgDblClick(e, args) {
        $scope.detail(args,'view');
    }

    //明细绑定点击事件
    $scope.headerGridView.onClick.subscribe(dgOnClick);
    $scope.headerGridView.onDblClick.subscribe(dgDblClick);

    //-------------通用查询---------------
    /**
     * 组织客户查询
     */
    $scope.customerSearch = function () {
        BasemanService.chooseCustomer({
            title: '选择客户',
            scope: $scope,
            then : function (result) {
                $scope.data.currItem.customer_name = result.customer_name;
                $scope.data.currItem.customer_code = result.customer_code;
                $scope.data.currItem.customer_id = result.customer_id;
            }
        })
    };
    //-------------通用查询---------------

    /**
     * 查询主表数据
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
        postdata.sqlwhere= $scope.sqlwhere;
        BasemanService.RequestPost("fd_fund_business", "search", postdata)
            .then(function (data) {
                var date = [];
                $scope.data.currItem.fd_fund_businesss = data.fd_fund_businesss;
                loadGridData($scope.headerGridView, data.fd_fund_businesss);
                BaseService.pageInfoOp($scope, data.pagination);
        });
    }

    /**
     * 条件查询
     */
    $scope.searchBySql = function () {
        $scope.FrmInfo = {
            title: "",
            thead: [],
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "fd_fund_business",
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


    /**
     * 加载网格数据
     */
    function loadGridData(gridView, datas) {
        gridView.setData([]);
        var index = $scope.pageSize*($scope.currentPage-1);
        //加序号
        if (datas.length > 0) {
            for (var i = 0; i < datas.length; i++) {
                datas[i].id = index + i + 1;
            }
        }
        //设置数据
        gridView.setData(datas);
        gridView.render();
    }

    /**
     * 查看详细/新增
     */
    $scope.detail = function (args,type) {
        if(type == 'add'){
            $scope.data.currItem = {
                "syscreate_type" : "0",
                "date_fund" : new Date().Format("yyyy-MM-dd")
            };
        }
        if(type == 'view'){
            $scope.data.currItem = args.grid.getDataItem(args.row);
        }
        $("#detailModal").modal();
        $scope.$apply();
    }

    /**
     * 保存数据
     */
    $scope.saveData = function () {
        var action = "insert";
        if ($scope.data.currItem.fd_fund_business_id > 0) {
            action = "update";
        }
        var postdata = {
            "customer_id" : $scope.data.currItem.customer_id,
            "fd_fund_business_id" : $scope.data.currItem.fd_fund_business_id,
            "base_balance_type_id" : $scope.data.currItem.base_balance_type_id,
            "date_fund" : $scope.data.currItem.date_fund,
            "searchflag" : 6,
            "syscreate_type" : $scope.data.currItem.syscreate_type,
            "bill_no" : $scope.data.currItem.bill_no,
            "return_type" : $scope.data.currItem.return_type,
            "amount_debit" : $scope.data.currItem.amount_debit,
            "note" : $scope.data.currItem.note,
        };
        BasemanService.RequestPost("fd_fund_business", action, postdata)
            .then(function (data) {
                $("#detailModal").modal('hide');
                $scope.searchData();
                BasemanService.swalSuccess("成功","保存成功！")
            });

    }

    //网格高度自适应 , 控制器后面调用：
    BasemanService.initGird();

    //初始化分页
    BaseService.pageGridInit($scope);
}
//注册控制器
angular.module('inspinia')
    .controller('ctrl_fd_fund_business', fd_fund_business);