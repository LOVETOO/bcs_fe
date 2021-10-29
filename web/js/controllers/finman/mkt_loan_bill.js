/**
 * 这是借款申请详情js
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
function mkt_loan_bill($scope, BaseService, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state,
                       localeStorageService, FormValidatorService, $stateParams) {
    $scope.data = {"objtypeid": 1003};
    $scope.data.currItem = {"objattachs": [], "loan_id": $stateParams.id};
    var current_time = new Date().toLocaleDateString();
    var current_year = new Date().getFullYear();

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

    $scope.loan_typesofline = searchdicts('loan_typeofline', 'loan_type')
    // 添加按钮
    var editlineButtons = function (row, cell, value, columnDef, dataContext) {
        return " <button class='btn btn-sm btn-info dropdown-toggle delbtn' " +
            "style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;' >删除</button> ";
    };

    var moneyFormat = function (row, cell, value, columnDef, dataContext) {//添加千分号
        if (value != null) {
            var value1 = value
            value1 = HczyCommon.formatMoney(value1);
            return value1;
        } else {
            return null;
        }
    }

    //明细表网格设置
    $scope.lineOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: true,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: false,
        autoHeight:false
    };

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
            options:$scope.loan_typesofline
        }, {
            name: "申请金额",
            id: "loan_amt",
            field: "loan_amt",
            width: 100,
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
            formatter: moneyFormat,
            cssClass:"slick-fobbiden"
        }, {
            id: "description",
            name: "描述",
            field: "description",
            width: 150,
            editor: Slick.Editors.Text
        }, {
            name: "操作",
            width: 50,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter: editlineButtons
        }
    ];

    //初始化网格
    $scope.lineGridView = new Slick.Grid("#lineGridView", [], $scope.lineColumns, $scope.lineOptions)

    function searchdicts(dictname, field, grid, gridcolumns, columnname) {
        var dictdata = [];
        var dicts2 = [];
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: dictname})
            .then(function (data) {
                var dicts1 = [];

                for (var i = 0; i < data.dicts.length; i++) {
                    dicts2.push({
                        id: parseInt(data.dicts[i].dictvalue),
                        name: data.dicts[i].dictname,
                        value: parseInt(data.dicts[i].dictvalue),
                        desc: data.dicts[i].dictname,
                    })
                }
                // if( grid && typeof ($scope[columnname].length) !="undefined"){
                //     for (var i = 0; i < $scope[columnname].length; i++) {
                //         if ($scope[columnname][i].field == field) {
                //             gridcolumns[i].options = dicts2;
                //             grid.setColumns(gridcolumns);
                //             break;
                //         }
                //     }
                //     console.log(gridcolumns[i].options)
                // }
            });
        return dicts2;
    }

    $scope.stats = searchdicts('wfstat', 'stat');
    // $scope.receiver_types = searchdicts('receiver_types','receiver_type',$scope.headerGridView,$scope.headerColumns,'headerColumns');
    $scope.loan_types = searchdicts('LOAN_TYPE', 'loan_type')

        // , $scope.lineGridView, $scope.lineColumns, 'lineColumns');     //查询


    /**
     * 主表网格双击事件
     */
    function dgOnDblClick(e, args) {
        $scope.viewDetail(args);
    }

    /**
     * 明细网格点击事件
     * @param e
     * @param args
     */
    function dgLineClick(e, args) {
        console.log("  " + !e.keyCode + "  " + e.keyCode + " " + (typeof(e.keyCode) == "undefined"))

        if ($(e.target).hasClass("delbtn") && !e.keyCode) {
            $scope.delLineRow(args);
            e.stopImmediatePropagation();
            return;
        }
    };


    //明细绑定点击事件
    $scope.lineGridView.onClick.subscribe(dgLineClick);
    $scope.lineGridView.onCellChange.subscribe(Count);
    /**
     * 删除明细网格行
     */
    $scope.delLineRow = function (args) {
        var code = args.grid.getDataItem(args.row).fee_code;
        if ($scope.data.currItem.stat != 1) {
            BasemanService.swalError("此单据不是“制单”状态，不允许删除")
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
     * 保存数据
     */
    $scope.saveData = function (bSubmit) {
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
        if (!checkNull()) {
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
            .then(function (data) {
                $scope.data.currItem.loan_id = data.loan_id;
                $scope.searchData();
                BasemanService.swalSuccess("成功", "保存成功!");
                if ($scope.data.currItem.stat = 1) {
                    $('#detailtab a:last').tab('show');
                    if (angular.element('#wfinspage').length == 0) {
                        $("#wfinsform").append("<iframe id='wfinspage' style='width: 100%;height: 100%;background-color: #e2e5ec;'></iframe>");
                    }
                    $scope.initWfIns(true);
                }
            });
    }

    /**
     * 检查明细表空行
     */
    function checkNull() {
        var str = ""
        var flag = true
        $.each($scope.data.currItem.mkt_loan_lineofmkt_loan_headers, function (i, item) {
            i += 1
            if (item.loan_type == null) {
                str += "第" + i + "行明细的借款性质不能为空 "+ "\n"
                flag = false
            }
            if (item.loan_amt == null) {
                str += "第" + i + "行明细的申请金额不能为空" +"\n"
                flag = false
            }
            if (item.loan_amt <= 0) {
                str += "第" + i + "行明细的申请金额必须大于0"
                flag = false
            }
        })
        $scope.str = str
        return flag;
    }

    function Count() {
        var lineData = $scope.data.currItem.mkt_loan_lineofmkt_loan_headers;
        var t1 = 0;
        var total_apply_amt = 0;
        var total_allow_amt = 0;
        var lineRow = [];
        for (var i = 0; i < lineData.length; i++) {
            lineRow.push(HczyCommon.stringPropToNum(lineData[i]));
            if (lineRow[i].loan_amt != null) {
                total_apply_amt += lineRow[i].loan_amt;
            }
            if (lineRow[i].allow_amt != null) {
                total_allow_amt += lineRow[i].allow_amt;
            }
        }

        $scope.data.currItem.total_apply_amt = total_apply_amt;
        $scope.data.currItem.total_allow_amt = total_allow_amt;
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

    $scope.clearReceiver = function () {                 //逻辑控制,当选中的借款类别改变时要清空借款主体让用户重新选择
        delete $scope.data.currItem.receiver_name
        delete $scope.data.currItem.receiver_id
        delete $scope.data.currItem.receiver_code
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
            classid: "customer",
            url: "/jsp/baseman.jsp",
            direct: "center",
            sqlBlock: "",
            backdatas: "customer_orgs",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: 10
            },
            searchlist: ["customer_id", "customer_name", "customer_code", "customer_type"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.receiver_name = result.customer_name;
            $scope.data.currItem.receiver_code = result.customer_code;
            $scope.data.currItem.receiver_id = result.customer_id;

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
     * 流程实例初始化
     */
    $scope.initWfIns = function (bSubmit) {
        HczyCommon.stringPropToNum($scope.data.currItem);
        //制单后才显示流
        if ($scope.data.currItem.loan_id && $scope.data.currItem.loan_id > 0) {
            if ($scope.data.currItem.wfid && $scope.data.currItem.wfid > 0) {
                if (angular.element('#wfinspage').attr('src') != '/index.jsp#/crmman/wfins//' + $scope.data.currItem.wfid + '/' + $scope.data.objtypeid + '/' + $scope.data.currItem.loan_id + '/0?showmode=2') {
                    angular.element('#wfinspage').attr('src', '/index.jsp#/crmman/wfins//' + $scope.data.currItem.wfid + '/' + $scope.data.objtypeid + '/' + $scope.data.currItem.loan_id + '/0?showmode=2');
                }
            } else if ($scope.data.currItem.stat == 1) {
                var postData = {
                    "objtypeid": $scope.data.objtypeid
                }
                BasemanService.RequestPost("scpobjconf", "select", JSON.stringify(postData))
                    .then(function (data) {
                        if (data.objwftempofobjconfs && data.objwftempofobjconfs.length > 0) {
                            // if (angular.element('#wfinspage').attr('src') != '/index.jsp#/crmman/wfins/' + data.objwftempofobjconfs[0].wftempid + '//' + $scope.data.objtypeid + '/' + $scope.data.currItem.loan_id + '/0?showmode=2') {
                            if(bSubmit){
                                angular.element('#wfinspage').attr('src', '/index.jsp#/crmman/wfins/' + data.objwftempofobjconfs[0].wftempid + '//' + $scope.data.objtypeid + '/' + $scope.data.currItem.loan_id + '/1?showmode=2');
                            } else{
                                angular.element('#wfinspage').attr('src', '/index.jsp#/crmman/wfins/' + data.objwftempofobjconfs[0].wftempid + '//' + $scope.data.objtypeid + '/' + $scope.data.currItem.loan_id + '/0?showmode=2');
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
    // $('#detailModal').on('hidden.bs.modal', function (e) {
    //     //隐藏后默认显示第一个
    //     $('#detailtab a:first').tab('show');
    //     //angular.element('#wfinspage').attr('src', '');
    //     $("#wfinsform").empty();
    // })
    //modal显示时绑定切换事件
    $('#detailtab').on('shown.bs.tab', $scope.onTabChange);

    /**
     * 查询后台数据
     */
    $scope.searchData = function () {
        BasemanService.RequestPost("mkt_loan_header", "select", JSON.stringify($scope.data.currItem))
            .then(function (data) {
                $scope.data.currItem = data;
                $scope.lineGridView.setData([]);
                if ($scope.data.currItem.mkt_loan_lineofmkt_loan_headers) {
                    var date = $scope.data.currItem.create_time;
                    var oldTime = (new Date(date)).getTime();
                    var curTime = new Date(oldTime).format("yyyy-MM-dd");
                    $scope.data.currItem.create_time = curTime;
                    var lineData = $scope.data.currItem.mkt_loan_lineofmkt_loan_headers;
                    $scope.lineGridView.setData(lineData);
                }
                if ($scope.data.currItem.stat > 1) {
                    $scope.lineOptions.editable = false;  //不可编辑
                } else {
                    $scope.lineOptions.editable = true;
                }
                $scope.lineGridView.setOptions($scope.lineOptions)
                $scope.lineGridView.render();
            });
    }
    //初始化后调用查询方法
    BasemanService.initGird();//自适应高度

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
        if (file && file.docid > 0) {
            for (var i = 0; i < $scope.data.currItem.objattachs.length; i++) {
                if ($scope.data.currItem.objattachs[i].docid == file.docid) {
                    $scope.data.currItem.objattachs.splice(i, 1);
                    break;
                }
            }
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
     * 查询当前对象
     */
    $scope.selectCurrenItem = function () {
        $scope.searchData();
    }
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
     * 打印功能
     */
    $scope.printPreview = function () {
        var LODOP=getLodop();
        LODOP.PRINT_INIT("打印控件功能演示_Lodop功能_分页打印综合表格");
        var strStyle=" <style> table,td,th {border-width: 1px;border-style: solid;border-collapse: collapse}</style> ";
        LODOP. SET_PRINT_PAGESIZE (2, 0, 0,"A4");
        LODOP.ADD_PRINT_TABLE(128,"5%","90%",314,strStyle+document.getElementById("div2").innerHTML);
        LODOP.SET_PRINT_STYLEA(0,"Vorient",3);
        LODOP.ADD_PRINT_HTM(26,"5%","90%",109,document.getElementById("div1").innerHTML);
        LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
        LODOP.SET_PRINT_STYLEA(0,"LinkedItem",1);
        LODOP.ADD_PRINT_HTM(444,"5%","90%",54,document.getElementById("div3").innerHTML);
        LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
        LODOP.SET_PRINT_STYLEA(0,"LinkedItem",1);
        LODOP.NewPageA();
        LODOP.ADD_PRINT_TABLE(128,"5%","90%",328,strStyle+document.getElementById("div2").innerHTML);
        LODOP.SET_PRINT_STYLEA(0,"Vorient",3);
        LODOP.ADD_PRINT_HTM(26,"5%","90%",80,document.getElementById("div4").innerHTML);
        LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
        LODOP.SET_PRINT_STYLEA(0,"LinkedItem",4);
        LODOP.ADD_PRINT_TEXT(460,96,"76.25%",20,"真诚祝您好远，欢迎下次再来！(发货单02的表格外“页脚”，紧跟表格)");
        LODOP.SET_PRINT_STYLEA(0,"LinkedItem",4);
        LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
        LODOP.SET_PRINT_STYLEA(0,"FontColor","#FF0000");
        LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
        LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
        LODOP.SET_PRINT_STYLEA(0,"Horient",3);
        LODOP.ADD_PRINT_HTM(1,600,300,100,"总页号：<font color='#0000ff' format='ChineseNum'><span tdata='pageNO'>第##页</span>/<span tdata='pageCount'>共##页</span></font>");

        LODOP.SET_PRINT_STYLEA(0,"ItemType",1);

        LODOP.SET_PRINT_STYLEA(0,"Horient",1);
        LODOP.ADD_PRINT_TEXT(3,34,196,20,"总页眉：《两个发货单的演示》");
        LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
        LODOP.PREVIEW();
    }
    /**
     * 关闭窗体
     */
    $scope.closeWindow = function () {
        if (window.parent != window) {
            BasemanService.closeModal();
        } else {
            window.close();
        }
    }
    $scope.init = function () {
        if ($scope.data.currItem.loan_id == 0) {
            $scope.data.currItem = {
                "loan_id":0,
                "stat": 1,
                "creator": strUserId,//需动态加载
                "create_time": new Date().format("yyyy-MM-dd"),
                "organization_id": 1,
                mkt_loan_lineofmkt_loan_headers: []
            };
            $scope.lineGridView.setData($scope.data.currItem.mkt_loan_lineofmkt_loan_headers);
            $scope.lineGridView.invalidateAllRows();
            $scope.lineGridView.render();
        } else {
            $scope.searchData();
        }
    }
    $scope.init()

    //对外暴露scope
    window.currScope = $scope;
}

//注册控制器
angular.module('inspinia')
    .controller('mkt_loan_bill', mkt_loan_bill);