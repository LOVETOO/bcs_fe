/**
 * 这是借款申请界面js
 * 创建时间：2018-2-02
 * */
function mkt_loan_header($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService, BaseService) {
    $scope.data = {"objtypeid": 1003};
    $scope.data.currItem = {};
    $scope.loan_search = '';
    var activeRow = [];

    // 添加按钮
    var editHeaderButtons = function (row, cell, value, columnDef, dataContext) {
        return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>查看</button> " +
            " <button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
    };

    var editlineButtons = function (row, cell, value, columnDef, dataContext) {
        return " <button class='btn btn-sm btn-info dropdown-toggle delbtn' " +
            "style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;' >删除</button> ";
    };
    var moneyFormat = function (row, cell, value, columnDef, dataContext) {         //添加千分号
        if (value != null) {
            var value1 = value
            value1 = HczyCommon.formatMoney(value1);
            return "<div style='text-align:right;vertical-align:middle;'>" + value1 + "</div>"
        } else {
            return null;
        }
    }

    var seqformatter = function (row, cell, value, columnDef, dataContext) {
        return "<div style='text-align:center;vertical-align:middle;'>" + value + "</div>"
    }

    //主表网格设置
    $scope.headerOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false
    };
    //明细表网格设置
    $scope.lineOptions = {
        editable: true,
        enableAddRow: false,
        enableCellNavigation: true,
        enableColumnReorder: false,
        asyncEditorLoading: false,
        autoEdit: true,
        rowHeight: 30
    };

    //主表网格列属性
    $scope.headerColumns = [
        {
            name: "序号",
            id: "id",
            field: "id",
            width: 50,
            formatter: seqformatter
        },
        {
            name: "单据状态",
            id: "stat",
            field: "stat",
            width: 80,
            editor: Slick.Editors.SelectOption,
            formatter: Slick.Formatters.SelectOption,
            options: [],
            type: "list"
        },
        {
            name: "申请单号",
            id: "loan_no",
            field: "loan_no",
            width: 120,
        }, {
            name: "借款类别",
            id: "loan_type",
            field: "loan_type",
            width: 80,
            editor: Slick.Editors.SelectOption,
            formatter: Slick.Formatters.SelectOption,
            options: [],
            type: "list"
        }, {
            name: "申请部门编码",
            id: "org_code",
            field: "org_code",
            width: 100,
            type: "string"
        }, {
            name: "申请部门名称",
            id: "org_name",
            field: "org_name",
            width: 120,
            type: "string"
        }, {
            name: "申请总额",
            id: "total_apply_amt",
            field: "total_apply_amt",
            width: 120,
            formatter: moneyFormat, type: "number"
        }, {
            name: "批准总额",
            id: "total_allow_amt",
            field: "total_allow_amt",
            width: 120,
            formatter: moneyFormat, type: "number"
        }, {
            name: "已付款金额",
            id: "payed_amt",
            field: "payed_amt",
            width: 120,
            formatter: moneyFormat, type: "number"
        }, {
            name: "未付款金额",
            id: "not_hk_amt",
            field: "not_hk_amt",
            width: 120,
            formatter: moneyFormat, type: "number"
        }, {
            name: "创建人",
            id: "creator",
            field: "creator",
            width: 100, type: "string"
        }, {
            name: "创建时间",
            id: "create_time",
            field: "create_time",
            width: 150, type: "date"
        }, {
            name: "借款用途",
            id: "loan_purpose",
            field: "loan_purpose",
            width: 120, type: "string"
        }, {
            name: "操作",
            width: 100,
            cellEditor: "文本框",
            formatter: editHeaderButtons
        }
    ];
    //明细表网格列属性
    $scope.lineColumns = [
        {
            name: "借款性质",
            id: "loan_type",
            field: "loan_type",
            width: 100,
            eidtable: true,
            editor: Slick.Editors.SelectOption,
            formatter: Slick.Formatters.SelectOption,
        }, {
            name: "申请金额",
            id: "loan_amt",
            field: "loan_amt",
            width: 100,
            editable: true,
            editor: Slick.Editors.Number,
            formatter: moneyFormat
        }, {
            name: "批准金额",
            id: "allow_amt",
            field: "allow_amt",
            width: 100,
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter: moneyFormat
        }, {
            name: "描述",
            id: "description",
            field: "description",
            width: 100,
            eidtable: true,
            editor: Slick.Editors.Text
        }, {
            name: "操作",
            width: 150,
            cellEditor: "文本框",
            formatter: editlineButtons
        }
    ];
    //初始化网格
    $scope.headerGridView = new Slick.Grid("#headerViewGrid", [], $scope.headerColumns, $scope.headerOptions);
    $scope.lineGridView = new Slick.Grid("#lineGridView", [], $scope.lineColumns, $scope.lineOptions);

    /** 系统词汇查询**/
    function searchdicts(dictname, field, grid, gridcolumns, columnname) {
        var dictdata = [];
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: dictname})
            .then(function (data) {
                var dicts1 = [];
                var dicts2 = [];
                for (var i = 0; i < data.dicts.length; i++) {
                    dicts1[i] = {
                        id: parseInt(data.dicts[i].dictvalue),
                        name: data.dicts[i].dictname
                    }
                    dicts2.push({
                        value: parseInt(data.dicts[i].dictvalue),
                        desc: data.dicts[i].dictname,
                    })
                    dictdata.push(dicts1[i]);
                }
                if ($scope[columnname].length) {
                    for (var i = 0; i < $scope[columnname].length; i++) {
                        if ($scope[columnname][i].field == field) {
                            gridcolumns[i].options = dicts2;
                            grid.setColumns(gridcolumns);
                            break;
                        }
                    }
                }
            });
        return dictdata;
    }

    $scope.stats = searchdicts('wfstat', 'stat', $scope.headerGridView, $scope.headerColumns, 'headerColumns');
    // $scope.receiver_types = searchdicts('receiver_types','receiver_type',$scope.headerGridView,$scope.headerColumns,'headerColumns');
    $scope.loan_types = searchdicts('LOAN_TYPE', 'loan_type', $scope.headerGridView, $scope.headerColumns, 'headerColumns')
    $scope.loan_typesofline = searchdicts('loan_typeofline', 'loan_type', $scope.lineGridView, $scope.lineColumns, 'lineColumns');     //查询


    /**
     * 主表网格点击事件
     * @param e
     * @param args
     */
    function dgOnClick(e, args) {
        activeRow = args.grid.getDataItem(args.row);

        if ($(e.target).hasClass("viewbtn")) {
            $scope.viewDetail(args);
            e.stopImmediatePropagation();
        }
        //点击删除按钮处理事件
        else if ($(e.target).hasClass("delbtn")) {
            var dg = $scope.headerGridView;
            var rowidx = args.row;
            var postData = {};
            postData.loan_id = args.grid.getDataItem(args.row).loan_id;
            var bxNo = args.grid.getDataItem(args.row).loan_no;
            var state = args.grid.getDataItem(args.row).stat;
            if (state != 1) {
                BasemanService.swal("提示", "当前单据不是制单状态,无法删除", function (bool) {
                    if (bool) {
                        return;
                    } else {
                        return;
                    }
                });
                return;
            }
            BasemanService.swalDelete("删除", "确定要删除单号为 " + bxNo + " 的借款申请单吗？", function (bool) {
                if (bool) {
                    BasemanService.RequestPost("mkt_loan_header", "delete", JSON.stringify(postData))
                        .then(function (data) {
                            dg.getData().splice(rowidx, 1);
                            dg.invalidateAllRows();
                            dg.render();
                            BasemanService.swalSuccess("成功", "删除成功");
                        });
                } else {
                    return;
                }
            });
            e.stopImmediatePropagation();
        }
    };

    /**
     * 明细网格点击事件
     * @param e
     * @param args
     */
    function dgLineClick(e, args) {
        if ($(e.target).hasClass("delbtn") && typeof(e.keyCode) == "undefined") {
            $scope.delLineRow(args);
            e.stopImmediatePropagation();
            return;
        }
    };

    function Count() {
        var lineData = $scope.data.currItem.mkt_loan_lineofmkt_loan_headers;
        var t1 = 0;
        var total_apply_amt = 0;
        var total_allow_amt = 0;
        var lineRow = [];
        for (var i = 0; i < lineData.length; i++) {
            lineRow.push(HczyCommon.stringPropToNum(lineData[i]));
            if (typeof (lineRow[i].loan_amt) != 'undefined' || lineRow[i].loan_amt != null) {
                total_apply_amt += lineRow[i].loan_amt;
            }
            if (typeof (lineRow[i].allow_amt) != 'undefined' || lineRow[i].allow_amt != null) {
                total_allow_amt += lineRow[i].allow_amt;
            }
        }
        safeApply($scope, function () {
            $scope.data.currItem.total_apply_amt = total_apply_amt;
            $scope.data.currItem.total_allow_amt = total_allow_amt;
        })
    }

    //检查是否可以执行视图更新
    function safeApply(scope, fn) {
        (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
    }

    function dgOnDblClick(e, args) {
        $scope.viewDetail(args);
    }

    //主表绑定点击事件
    $scope.headerGridView.onClick.subscribe(dgOnClick);
    $scope.headerGridView.onDblClick.subscribe(dgOnDblClick);  //双击查看事件

    //明细绑定点击事件
    $scope.lineGridView.onClick.subscribe(dgLineClick);
    $scope.lineGridView.onCellChange.subscribe(Count);

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
            backdatas: "mkt_loan_header",
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
            $scope.searchData(postdata)
        })
    }

    /**
     * 删除明细网格行
     */
    $scope.delLineRow = function (args) {
        var code = args.grid.getDataItem(args.row).fee_code;
        if ($scope.data.currItem.stat != 1) {
            BasemanService.swalError("此单据不是“制单”状态，不允许删除！")
            return;
        }
        BasemanService.swalDelete("删除", "确定要删除该明细吗？", function (bool) {
            if (bool) {
                var dg = $scope.lineGridView;
                dg.getData().splice(args.row, 1);
                dg.invalidateAllRows();
                dg.render();
            } else {
                return
            }
        });
    };

    /**
     *添加明细网格行
     */
    $scope.addLineRow = function () {
        if ($scope.lineGridView.getCellEditor() != undefined) {
            $scope.lineGridView.getCellEditor().commitChanges();
        }
        var dg = $scope.lineGridView;
        var rowidx = 0;
        var dataitem = [];
        var dataObj = {};
        //获取网格对象
        //var dataitem = getDgInitDataByType(dg);
        if (dg.getData()) { //防止数据空值报错，所以要做这个判断
            dg.getData().push(dataObj);
        } else {
            dataitem.push(dataObj);
            dg.setData(dataitem);
        }
        dg.resizeCanvas();
        dg.invalidateAllRows();
        dg.updateRowCount();
        dg.render();
    };

    /**
     * 增加框弹出
     */
    $scope.addNew = function () {
        BasemanService.openModal({"url": "/index.jsp#/crmman/mktloan/0", "title": "借款申请", "obj": $scope});
    }

    /**
     * 部门查询
     */
    $scope.searchApplyOrg = function (searchText) {
        $scope.FrmInfo = {
            title: "部门查询",
            thead: [{
                name: "部门名称",
                code: "orgname"
            }, {
                name: "部门编码",
                code: "code"
            }],
            classid: "CPCOrg",
            url: "/jsp/req.jsp",
            direct: "center",
            sqlBlock: "",
            backdatas: "orgs",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: 10
            },
            searchlist: ["orgname", "code", "orgid"]
        };

        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            if (searchText == '申请部门') {
                $scope.data.currItem.org_name = result.orgname;
                $scope.data.currItem.org_code = result.code;
                $scope.data.currItem.org_id = result.orgid;
            } else {
                $scope.data.currItem.fee_org_name = result.orgname;
                $scope.data.currItem.fee_org_code = result.code;
                $scope.data.currItem.fee_org_id = result.orgid;
            }
        })
    };
    /**
     * 借款类型查询
     */
    $scope.searchBusiness_Type = function () {
        $scope.FrmInfo = {
            title: "借款类型查询",
            thead: [{
                name: "借款类型编码",
                code: "payment_type_code"
            }, {
                name: "借款类型名称",
                code: "payment_type_name"
            }],
            classid: "fd_payment_type",
            url: "/jsp/budgetman.jsp",
            direct: "center",
            sqlBlock: "",
            backdatas: "fd_payment_types",
            ignorecase: "true", //忽略大小写
            MaxSearchRltCmt: 10,
            searchlist: ["payment_type_code", "payment_type_name", "fd_payment_type_id"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.business_type = result.fd_payment_type_id;
            $scope.data.currItem.business_type_name = result.payment_type_name;
        })
    };
    /**
     * 人员查询
     */
    $scope.searchPerson = function (searchText) {
        $scope.FrmInfo = {
            title: "人员查询",
            thead: [{
                name: "人员编码",
                code: "employee_id"
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
            postdata: {
                maxsearchrltcmt: 10
            },
            searchlist: ["employee_id", "employee_name", "dept_code", "dept_name"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            if (searchText == 'chap') {
                $scope.data.currItem.chap_name = result.employee_name;
                $scope.data.currItem.chap_id = result.employee_id;
                $scope.data.currItem.chap_code = result.employee_code;
            }
            if (searchText == 'receiver') {
                $scope.data.currItem.receiver_name = result.employee_name;
                $scope.data.currItem.receiver_id = result.employee_id;
                $scope.data.currItem.receiver_code = result.employee_code;
            }


        })
    };
    /**
     * 客户查询
     */
    $scope.searchCustomer = function () {
        $scope.FrmInfo = {
            title: "客户查询",
            thead: [{
                name: "客户编码",
                code: "customer_code"
            }, {
                name: "客户名称",
                code: "customer_name"
            }, {
                name: "客户类型",
                code: "customer_type"
            }],
            classid: "customer_org",
            url: "/jsp/baseman.jsp",
            direct: "center",
            sqlBlock: "",
            backdatas: "customer_orgs",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: 10
            },
            searchlist: ["customer_org_id", "customer_name", "customer_code", "customer_type"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.receiver_name = result.customer_name;
            $scope.data.currItem.receiver_code = result.customer_code;
            $scope.data.currItem.receiver_id = result.customer_org_id;

        })
    };
    /**
     * 用户查询
     */
    $scope.searchUser = function () {
        $scope.FrmInfo = {
            title: "用户查询  ",
            thead: [{
                name: "用户代号",
                code: "userid",
            }, {
                name: "用户名称",
                code: "username",
            }],
            classid: "CPCUser",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "users",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: 10
            },
            searchlist: ["sysuserid", "userid", "username"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.chap_name = result.username;
            $scope.data.currItem.chap_id = result.sysuserid;
        })
    };
    /**
     * 结算方式查询
     */
    $scope.searchBase_balance_type = function () {
        $scope.FrmInfo = {
            title: "结算方式查询",
            thead: [{
                name: "结算方式编码",
                code: "balance_type_code"
            }, {
                name: "结算方式名称",
                code: "balance_type_name"
            }],
            classid: "base_balance_type",
            url: "/jsp/budgetman.jsp",
            direct: "center",
            sqlBlock: "",
            backdatas: "",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: 10
            },
            searchlist: ["balance_type_code", "balance_type_name", "base_balance_type_id"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.balance_type_code = result.balance_type_code;
            $scope.data.currItem.balance_type_name = result.balance_type_name;
            $scope.data.currItem.base_balance_type_id = result.base_balance_type_id;
        })
    };

    /**
     * 保存数据
     */
    $scope.saveData = function () {
        if ($scope.lineGridView.getCellEditor() != undefined) {
            $scope.lineGridView.getCellEditor().commitChanges();
        }
        if (!FormValidatorService.validatorFrom($scope, "#mkt_loan_Form")) {
            return
        }
        if ($scope.data.currItem.mkt_loan_lineofmkt_loan_headers.length < 1) {
            BasemanService.swal("提示", "请添加明细")
            return
        }
        if (!checkNUll()) {
            BasemanService.swal("提示", $scope.str)
            return
        }
        var action = "insert";
        if ($scope.data.currItem.loan_id > 0) {
            action = "update";
        }
        //if(action == "update"){
        //调用后台select方法查询详情
        BasemanService.RequestPost("mkt_loan_header", action, JSON.stringify($scope.data.currItem))
            .then(function () {
                $scope.searchData();
                BasemanService.swalSuccess("成功", "保存成功!");   //释放保存数据按钮
            });
    }

    /**
     * 检查明细表空行
     */
    function checkNUll() {
        var str = ""
        var flag = true
        $.each($scope.data.currItem.mkt_loan_lineofmkt_loan_headers, function (i, item) {
            i += 1
            if (item.loan_type == null) {
                str += "第" + i + "行明细的借款性质不能为空 "
                flag = false
            }
            if (item.loan_amt == null) {
                str += "第" + i + "行明细的申请金额不能为空"
                flag = false
            }
            if (item.loan_amt <= 0) {
                str += "第" + i + "行明细的申请金额必须大于0"
                flag = false
            }
            str += " \n "
        })
        $scope.str = str
        return flag;
    }

    /**
     * 查询后台数据
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
                pagination: "pn=1,ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0"
            }
        }
        BasemanService.RequestPost("mkt_loan_header", "search", postdata)
            .then(function (data) {
                //清空网格
                $scope.headerGridView.setData([]);
                //设置数据
                if (data.mkt_loan_headers) {
                    $.each(data.mkt_loan_headers, function (i, item) {
                        item.id = i + 1;
                    })
                    $scope.headerGridView.setData(data.mkt_loan_headers);
                    //重绘网格
                    $scope.headerGridView.render();
                    BaseService.pageInfoOp($scope, data.pagination);
                }
            });
    }

    /**
     * 查询详情
     * @param args
     */
    $scope.viewDetail = function (args) {
        // var postData = {};
        // postData.loan_id = args.grid.getDataItem(args.row).loan_id;
        // //调用后台select方法查询详情
        // BasemanService.RequestPost("mkt_loan_header", "select", JSON.stringify(postData))
        //     .then(function (data) {
        //         $scope.data.currItem = data;
        //         $scope.lineGridView.setData([]);
        //         if ($scope.data.currItem.mkt_loan_lineofmkt_loan_headers) {
        //             var date = $scope.data.currItem.create_time;
        //             var oldTime = (new Date(date)).getTime();
        //             var curTime = new Date(oldTime).format("yyyy-MM-dd");
        //             $scope.data.currItem.create_time = curTime;
        //             var lineData = $scope.data.currItem.mkt_loan_lineofmkt_loan_headers;
        //             $scope.lineGridView.setData(lineData);
        //         }
        //         if ($scope.data.currItem.stat > 1) {
        //             $scope.lineOptions.editable = false;  //不可编辑
        //         } else {
        //             $scope.lineOptions.editable = true;
        //         }
        //         $scope.lineGridView.setOptions($scope.lineOptions)
        //         $scope.lineGridView.render();
        //         //显示模态页面
        //         $("#detailModal").modal();
        //     });
        var id = args.grid.getDataItem(args.row).loan_id;
        BasemanService.openModal({
            url: "/index.jsp#/crmman/mktloan/" + id,
            title: "借款申请",
            obj: $scope,
            ondestroy: $scope.searchData
        });
    };

    //加载时间插件
    $('#repayment_date').datetimepicker({
        format: 'yyyy-mm-dd',
        language: 'zh-CN',
        pickDate: true, //选择日期
        pickTime: false, //选择时间
        todayBtn: true, //显示选择当前时间按钮
        autoclose: true, //选择一个日期之后立即关闭日期时间选择器
        todayHighlight: true, //高亮当前日期
        startView: 'month', //选择首先显示的视图:month
        minView: 'month' //最小的选择视图-选择最小单位:day
    });
    /**
     * 日期格式化方法
     * @param fmt
     * @returns {*}
     */
    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1,                 //月份
            "d+": this.getDate(),                    //日
            "h+": this.getHours(),                   //小时
            "m+": this.getMinutes(),                 //分
            "s+": this.getSeconds(),                 //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }
    /**
     * 借款类别选中改变 事件
     */
    $scope.searchReceiver = function () {
        if ($scope.data.currItem.loan_type == null) {
            BasemanService.swal("提示", "请选择借款类别", function (bool) {
                if (bool) {
                    return
                } else {
                    return;
                }
            });
        }
        if ($scope.data.currItem.loan_type == 1) {
            $scope.searchPerson('receiver'); //执行查询个人
        }
        else if ($scope.data.currItem.loan_type == 2) {
            $scope.searchCustomer();
        }
    }


    //表格自适应
    BasemanService.initGird();

    /**
     * 流程实例初始化
     */
    $scope.initWfIns = function () {
        HczyCommon.stringPropToNum($scope.data.currItem);
        //制单后才显示流程
        if ($scope.data.currItem.loan_id && $scope.data.currItem.loan_id > 0) {
            if ($scope.data.currItem.wfid && $scope.data.currItem.wfid > 0) {
                if (angular.element('#wfinspage').attr('src') != '/index.jsp#/crmman/wfins//' + $scope.data.currItem.wfid + '/' + $scope.data.objtypeid + '/' + $scope.data.currItem.loan_id + '?showmode=2') {
                    angular.element('#wfinspage').attr('src', '/index.jsp#/crmman/wfins//' + $scope.data.currItem.wfid + '/' + $scope.data.objtypeid + '/' + $scope.data.currItem.loan_id + '?showmode=2');
                }
            } else if ($scope.data.currItem.stat == 1) {
                var postData = {
                    "objtypeid": $scope.data.objtypeid
                }
                BasemanService.RequestPost("scpobjconf", "select", JSON.stringify(postData))
                    .then(function (data) {
                        if (data.objwftempofobjconfs && data.objwftempofobjconfs.length > 0) {
                            if (angular.element('#wfinspage').attr('src') != '/index.jsp#/crmman/wfins/' + data.objwftempofobjconfs[0].wftempid + '//' + $scope.data.objtypeid + '/' + $scope.data.currItem.loan_id + '?showmode=2') {
                                angular.element('#wfinspage').attr('src', '/index.jsp#/crmman/wfins/' + data.objwftempofobjconfs[0].wftempid + '//' + $scope.data.objtypeid + '/' + $scope.data.currItem.loan_id + '?showmode=2');
                            }
                        }
                    });
            }
        }
    }

    $scope.onTabChange = function (e) {
        // 获取已激活的标签页的名称
        if (e) {
            var tabName = $(e.target).text();
            console.log("tabName: " + tabName);
            if ('流程' == tabName) {
                if (angular.element('#wfinspage').length == 0) {
                    $("#wfinsform").append("<iframe id='wfinspage' style='width: 100%;height: 100%;background-color: #e2e5ec;'></iframe>");
                }
                $scope.initWfIns();
            }
        }
    }

    //详情页面隐藏时初始化显示第一个tab页面
    $('#detailModal').on('hidden.bs.modal', function (e) {
        //隐藏后默认显示第一个
        $('#detailtab a:first').tab('show');
        //angular.element('#wfinspage').attr('src', '');
        $("#wfinsform").empty();
    })
    //modal显示时绑定切换事件
    $('#detailModal').on('shown.bs.tab', $scope.onTabChange);

    $('#detailtab a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    })

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


    //初始化分页和数据
    BaseService.pageGridInit($scope);


}

//注册控制器ss
angular.module('inspinia')
    .controller('ctrl_mkt_loan_header', mkt_loan_header);