/**
 * 客户回款单
 */
function fd_verification_head($scope, BasemanService, BaseService) {
    $scope.data = {};
    $scope.data.currItem = {};
    //初始化数据
    $scope.ReturnType = [];//回款类型
    $scope.billStats = [];
   //明细序号
    var lineMaxSeq = 0;
    //添加按钮
    var editHeaderButtons =  function (row, cell, value, column, rowData) {
        var buttonHtml = '<button class="btn btn-sm btn-info dropdown-toggle viewbtn" style="padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;">查看</button>';
        if (rowData.stat <= 1){
            buttonHtml += '<button class="btn btn-sm btn-info dropdown-toggle delbtn" style="padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;">删除</button>';
            buttonHtml += '<button class="btn btn-sm btn-info dropdown-toggle checkbtn" style="padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;">审核</button>';
        }
        return buttonHtml;
    };

    // 添加按钮
    var editLineButtons = function (row, cell, value, columnDef, dataContext) {
        if ($scope.data.currItem.stat != 1) {
            return;
        } else {
            return "<button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;' >删除</button> ";
        }
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
            width: 120,
            formatter: editHeaderButtons
        },{
            id: "stat",
            name: "状态",
            field: "stat",
            width: 60,
            formatter: Slick.Formatters.SelectOption,
            type:'list'
        },{
            id: "verification_code",
            name: "核销单号",
            field: "verification_code",
            width: 120,
            type:'string'
        }, {
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
            id: "verificate_date",
            name: "核销日期",
            field: "verificate_date",
            width: 100,
            formatter: Slick.Formatters.Date,
            type:'date'
        },{
            id: "verificate_amt",
            name: "核销金额",
            field: "verificate_amt",
            width: 100,
            formatter: Slick.Formatters.Money,
            cssClass: "amt",
            type:'number'
        },{
            id: "fund_amt",
            name: "回款金额",
            field: "fund_amt",
            width: 100,
            type:"string",
            formatter: Slick.Formatters.Money,
            cssClass: "amt",
            type:'number'
        },{
            id: "verificated_amt",
            name: "已核销金额",
            field: "verificated_amt",
            width: 100,
            type:"string",
            formatter: Slick.Formatters.Money,
            cssClass: "amt",
            type:'number'
        },{
            id: "fd_fund_business_code",
            name: "回款单号",
            field: "fd_fund_business_code",
            width: 120,
            type:"string"
        },{
            id: "fund_date",
            name: "回款日期",
            field: "fund_date",
            width: 100,
            formatter: Slick.Formatters.Date,
            type:"date"
        }, {
            id: "fund_type",
            name: "回款类型",
            field: "fund_type",
            width: 100,
            formatter: Slick.Formatters.SelectOption,
            type:"list"
        },
        // {
        //     id: "erp_bill_no",
        //     name: "ERP回款单号",
        //     field: "erp_bill_no",
        //     width: 120,
        //     type:"string"
        // },
        {
            id: "note",
            name: "备注",
            field: "note",
            width: 250,
            type:"string"
        }
    ];


    //网格设置
    $scope.lineOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: true,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight:false
    };


    //明细表网格列属性
    $scope.lineColumns = [
        {
            name: "序号",
            id: "seq",
            field: "seq",
            width: 50
        }, {
            name: "操作",
            width: 50,
            formatter: editLineButtons
        }, {
            name: "出库单号",
            id: "inv_billno",
            field: "inv_billno",
            width: 120
        }, {
            name: "出库日期",
            id: "inv_bill_date",
            field: "inv_bill_date",
            width: 100,
            formatter:Slick.Formatters.Date
        }, {
            name: "产品编码",
            id: "item_code",
            field: "item_code",
            width: 100
        }, {
            name: "产品名称",
            id: "item_name",
            field: "item_name",
            width: 150
        },{
            name: "出库数量",
            id: "qty",
            field: "qty",
            width: 80,
            cssClass:"amt"
        }, {
            name: "单价",
            id: "price",
            field: "price",
            width: 80,
            cssClass:"amt",
            formatter: Slick.Formatters.Money
        },{
            name: "出库金额",
            id: "amount",
            field: "amount",
            cssClass:"amt",
            width: 100,
            formatter: Slick.Formatters.Money
        }, {
            name: "已核销金额",
            id: "verificated_amt",
            field: "verificated_amt",
            cssClass:"amt",
            width: 100,
            formatter: Slick.Formatters.Money
        },{
            name: "本次核销金额",
            id: "verificate_amt",
            field: "verificate_amt",
            cssClass:"amt",
            width: 100,
            formatter: Slick.Formatters.Money,
            editor:Slick.Editors.Text
        },{
            name: "工程编码",
            id: "project_code",
            field: "project_code",
            width: 140
        }, {
            name: "订货单号",
            id: "sa_billno",
            field: "sa_billno",
            width: 120
        }, {
            name: "备注",
            id: "note",
            field: "note",
            editor:Slick.Editors.Text,
            width: 150
        }
    ];


    //初始化网格
    $scope.lineGridView = new Slick.Grid("#lineViewGrid", [], $scope.lineColumns, $scope.lineOptions);

    //网格初始化
    $scope.headerGridView = new Slick.Grid("#headerGridView",[], $scope.headerColumns, $scope.headerOptions);

    //明细绑定点击事件
    $scope.headerGridView.onClick.subscribe(dgOnClick);
    $scope.headerGridView.onDblClick.subscribe(dgDblClick);

    $scope.lineGridView.onCellChange.subscribe(sumTotal);

    //细表-绑定点击事件
    $scope.lineGridView.onClick.subscribe(ldgOnClick);


    /**
     * 事件判断 - 细表
     */
    function ldgOnClick(e, args) {
        //点击删除按钮处理事件
        if ($(e.target).hasClass("delbtn")) {
            delLine(args);
            e.stopImmediatePropagation();
        }
    };

    /**
     * 删除 - 明细
     */
    function delLine(args){
        var dg = $scope.lineGridView;
        var rowidx = args.row;
        BasemanService.swalDelete("删除", "确定要删除吗？", function (bool) {
            if (bool) {
                dg.getData().splice(rowidx, 1);
                dg.invalidateAllRows();
                dg.render();
                lineMaxSeq = lineMaxSeq-1;
            } else {
                return;
            }
        });
    };

    function sumTotal() {
        var check =true;
        var total = 0;
        if ($scope.lineGridView.getCellEditor() != undefined) {
            $scope.lineGridView.getCellEditor().commitChanges();
        }
        $scope.data.currItem.fd_verification_lineoffd_verification_heads = $scope.lineGridView.getData();
        if($scope.data.currItem.fd_verification_lineoffd_verification_heads.length>0){
            $.each($scope.data.currItem.fd_verification_lineoffd_verification_heads,function (index,item) {
                if((parseFloat(item.verificate_amt)+parseFloat(item.verificated_amt))>parseFloat(item.amount)){
                    BasemanService.swal("提示",item.item_name+" 本次核销金额不能大于"+(item.amount-item.verificated_amt));
                    check =false;
                    return;
                }
                total+= Number(item.verificate_amt);
            });
        }
        if(check==true){
            $scope.data.currItem.verificate_amt = total;
        }
    }

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
    $scope.ReturnType = searchDict("return_type", "fund_type", $scope.headerGridView, $scope.headerColumns, "headerColumns");
    $scope.billStats = searchDict("stat", "stat", $scope.headerGridView, $scope.headerColumns, "headerColumns");
    $scope.SyscreateType = searchDict("syscreate_type", "syscreate_type", $scope.headerGridView, $scope.headerColumns, "headerColumns");


    /**
     * 网格单击事件
     */
    function dgOnClick(e, args) {
        if ($(e.target).hasClass("viewbtn")) {
            $scope.detail(args,'view');
            e.stopImmediatePropagation();
        }
        //点击删除按钮处理事件
        else if ($(e.target).hasClass("delbtn")) {
            var rowidx = args.row;
            var postData = {};
            postData.verification_head_id = args.grid.getDataItem(rowidx).verification_head_id;
            var verification_code = args.grid.getDataItem(rowidx).verification_code;
            BasemanService.swalWarning("删除", "确定要删除单号为 " + verification_code + " 的核销单吗？", function (bool) {
                if (bool) {
                    BasemanService.RequestPost("fd_verification_head", "delete", JSON.stringify(postData))
                        .then(function (data) {
                            var dg = $scope.headerGridView;
                            dg.getData().splice(rowidx, 1);
                            dg.invalidateAllRows();
                            dg.render();
                        });
                } else {
                    return;
                }
            })
            e.stopImmediatePropagation();
        }else if ($(e.target).hasClass("checkbtn")) {
            var rowidx = args.row;
            var postData = {};
            postData.verification_head_id = args.grid.getDataItem(rowidx).verification_head_id;
            var verification_code = args.grid.getDataItem(rowidx).verification_code;
            BasemanService.swalWarning("审核", "确定要审核单号为 " + verification_code + " 的核销单吗？", function (bool) {
                if (bool) {
                    BasemanService.RequestPost("fd_verification_head", "check", JSON.stringify(postData))
                        .then(function (data) {
                            $scope.searchData();
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


    //-------------通用查询---------------
    $scope.businessSearch = function () {
        $scope.FrmInfo = {
            title: "客户回款单",
            thead: [{
                name: "回款单号",
                code: "fd_fund_business_code"
            },  {
                name: "客户编码",
                code: "customer_code"
            },  {
                name: "客户名称",
                code: "customer_name"
            },  {
                name: "回款金额",
                code: "fund_amt"
            },  {
                name: "已核销金额",
                code: "verificated_amt"
            }],
            classid: "fd_fund_business",
            url: "/jsp/req.jsp",
            sqlBlock: "",
            backdatas: "fd_fund_businesss",
            ignorecase: "true", //忽略大小写
            postdata: {
                sqlwhere: " 1=1 ",
                searchflag : 1
            },
            searchlist: ["customer_name","customer_code","ordinal_no"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.fd_fund_business_id = result.fd_fund_business_id;
            $scope.data.currItem.fd_fund_business_code = result.fd_fund_business_code;
            $scope.data.currItem.fund_date = result.fund_date.substring(0,10);
            $scope.data.currItem.fund_type = Number(result.fund_type);
            $scope.data.currItem.fund_amt = result.fund_amt;
            $scope.data.currItem.verificated_amt = result.verificated_amt;
            $scope.data.currItem.erp_bill_no= result.erp_bill_no;
            $scope.data.currItem.customer_id= result.customer_id;
            $scope.data.currItem.customer_code= result.customer_code;
            $scope.data.currItem.customer_name= result.customer_name;
        });
    };

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
        BasemanService.RequestPost("fd_verification_head", "search", postdata).then(function (data) {
            BaseService.pageInfoOp($scope, data.pagination);
            setGridData($scope.headerGridView, data.fd_verification_heads);
        });
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
                "verification_head_id":0,
                "verificate_date" : new Date().Format("yyyy-MM-dd"),
                "stat":1,
                "fd_verification_lineoffd_verification_heads" : []
            };
            $scope.lineGridView.setData([]);
            $scope.lineGridView.render();
        }
        if(type == 'view'){
            //调用后台select方法查询详情
            $scope.data.currItem = args.grid.getDataItem(args.row);
            BasemanService.RequestPost("fd_verification_head", "select", JSON.stringify({"verification_head_id": $scope.data.currItem.verification_head_id}))
                .then(function (data) {
                    $scope.data.currItem = data;
                    setGridData($scope.lineGridView,$scope.data.currItem.fd_verification_lineoffd_verification_heads);
                    $scope.lineGridView.render();

                });
        }
        $("#detailModal").modal();
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
     * 保存数据
     */
    $scope.saveData = function () {
        var check =true;
        var f = $scope.data.currItem.fund_amt-$scope.data.currItem.verificate_amt-$scope.data.currItem.verificated_amt;
        if(f<0){
            BasemanService.swal("提示","本次核销总金额不能大于回款金额减去已核销金额");
            return;
        }
        $.each($scope.data.currItem.fd_verification_lineoffd_verification_heads,function (index,item) {
            if((parseFloat(item.verificate_amt)+parseFloat(item.verificated_amt))>parseFloat(item.amount)){
                BasemanService.swal("提示",item.item_name+" 本次核销金额不能大于"+(item.amount-item.verificated_amt));
                check = false;
                return;
            }
        });
        if(check==false){
            return;
        }
        var action = "insert";
        if ($scope.data.currItem.verification_head_id > 0) {
            action = "update";
        }
        BasemanService.RequestPost("fd_verification_head", action, JSON.stringify($scope.data.currItem))
            .then(function (data) {
                $("#detailModal").modal('hide');
                $scope.searchData();
            });
    }
    /**
     *添加明细行
     */
    $scope.addLine = function () {
        var flag = 0;
        $scope.FrmInfo = {
            title: "销售出库单",
            thead: [
                {
                    name: "出库单号",
                    code: "inv_billno"
                }, {
                    name: "出库日期",
                    code: "inv_bill_date"
                }, {
                    name: "产品编码",
                    code: "item_code"
                }, {
                    name: "产品名称",
                    code: "item_name"
                },{
                    name: "出库数量",
                    code: "qty"
                }, {
                    name: "单价",
                    code: "price"
                },{
                    name: "出库金额",
                    code: "amount"
                }, {
                    name: "已核销金额",
                    code: "verificated_amt"
                },{
                    name: "工程编码",
                    code: "project_code"
                }, {
                    name: "订货单号",
                    code: "sa_billno"
                }
            ],
            type: "checkbox",
            classid: "fd_fund_business",
            url: "/jsp/req.jsp",
            sqlBlock: "",
            backdatas: "inv_out_bills",
            ignorecase: "true", //忽略大小写
            postdata: {
                searchflag:2,
                customer_id:$scope.data.currItem.customer_id
            },
            searchlist: ["inv_billno", "item_code", 'item_name', 'project_code', 'sa_billno']
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            if ($scope.data.currItem.fd_verification_lineoffd_verification_heads) {
                $.each(result, function (i, item) {
                    $.each($scope.data.currItem.fd_verification_lineoffd_verification_heads,function (index,it) {
                        if(item.inv_out_bill_line_id == it.inv_out_bill_line_id){
                            flag = 1;
                        }
                    });
                    if(flag==0){
                        lineMaxSeq = lineMaxSeq+1;
                        item.seq = lineMaxSeq;
                        item.verificate_amt = item.amount - item.verificated_amt;
                        $scope.data.currItem.fd_verification_lineoffd_verification_heads.push(item);
                    }
                });
                $scope.lineGridView.setData($scope.data.currItem.fd_verification_lineoffd_verification_heads);
            }
            $scope.lineGridView.render();

            //统计表头本次核销金额
            sumTotal();
        });
    };

    /**
     * 条件查询
     */
    $scope.searchBySql = function () {
        $scope.FrmInfo = {
            title: "",
            thead: [],
            url: "/jsp/req.jsp",
            sqlBlock: "",
            backdatas: "fd_verification_head",
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
    .controller('fd_verification_head', fd_verification_head);