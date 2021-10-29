/**
 * 预算调整js
 */
function fin_bud_adjust_bill($scope, BaseService, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state,
                             localeStorageService, FormValidatorService, $stateParams) {
    $scope.data = {"objtypeid": 1106,wftemps: [], bSubmit: false, canmodify: true};
    $scope.data.currItem = {"objattachs": [], bSubmit: false, "adjust_id": $stateParams.id};
    var current_time = new Date()
    var current_year = new Date().getFullYear();
    $scope.AddDisabled = "";
    $scope.DecreaseDisabled = "";
    $scope.data.AddItem = {};
    $scope.data.DecreaseItem = {};
    $scope.addTotal = 0;
    $scope.decTotal = 0;
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

    $scope.canuseamt = ""

    //获取路由名称
    var routeName = $state.current.name;
    $scope.routeFlag = 1;  //路由标志：1 费控系统 2 市场资源预算调整
    //市场资源预算调整
    if(routeName == 'mktman.mktbudadjust'){
        $scope.routeFlag = 2;
    }


    // 添加按钮
    var editDetailButton = function (row, cell, value, columnDef, dataContext) {
        return " <button class='btn btn-sm btn-info dropdown-toggle delbtn deldetailbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
    };


    //明细表网格设置
    $scope.lineOptions = {
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
            formatter: editDetailButton
        }, {
            name: "调整类型",
            id: "style",
            field: "style",
            width: 80,
            height: 80,
            editor: Slick.Editors.DropDownEditor,
            formatter: Slick.Formatters.SelectOption,
        }, {
            name: "调整金额",
            id:"adjust_amt",
            field: "adjust_amt",
            width: 100,
            editor: Slick.Editors.Text,
            cssClass:"amt",
            formatter: Slick.Formatters.Money
        }, {
            name: "预算期间",
            id: "dname",
            field: "dname",
            width: 100,
            editor: Slick.Editors.DropDownEditor,
            options: $scope.dnames,
        }, {
            name: "预算类别编码",
            id: "bud_type_code",
            field: "bud_type_code",
            width: 120,
            editor: Slick.Editors.Text
        }, {
            name: "预算类别名称",
            id: "bud_type_name",
            field: "bud_type_name",
            width: 120,
            editor: Slick.Editors.Text
        }, {
            name: "费用项目编码",
            id: "object_code",
            field: "object_code",
            width: 120,
            editor: Slick.Editors.Text
        }, {
            name: "费用项目名称",
            id: "object_name",
            field: "object_name",
            width: 200,
        }, {
            name: "费用对象类别",
            id: "object_type",
            field: "object_type",
            editor: Slick.Editors.DropDownEditor,
            formatter: Slick.Formatters.SelectOption,
            width: 120,
            options: [
                {value: "1", desc: '费用项目'},
                {value: "2", desc: '费用类别'}],
        }, {
            name: "机构编码",
            id: "org_code",
            field: "org_code",
            width: 100,
            editor: Slick.Editors.Text
        }, {
            name: "机构名称",
            id: "org_name",
            field: "org_name",
            width: 100,
            editor: Slick.Editors.Text
        },
    ]

    //初始化网格
    $scope.lineGridView = new Slick.Grid("#lineGrid", [], $scope.lineColumns, $scope.lineOptions)


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

    searchdicts('style', 'style', $scope.lineGridView, $scope.lineColumns, 'lineColumns', $scope);
    $scope.bill_type = searchdicts('bill_type', 'bill_type', $scope.lineGridView, $scope.lineColumns, 'lineColumns', $scope);    //单据类型
    $scope.stats = searchdicts('stat', 'stat', $scope.lineGridView, $scope.lineColumns, 'lineColumns', $scope);              //单据状态
    $scope.styles = searchdicts('style', 'style', $scope.lineGridView, $scope.lineColumns, 'lineColumns', $scope);             //调整类型
    searchdicts('style', 'style', $scope.lineGridView, $scope.lineColumns, 'lineColumns');

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
        //点击删除按钮处理事件
        if ($(e.target).hasClass("deldetailbtn")) {
            if ($scope.data.currItem.stat != 1) {
                BasemanService.swalError("此单据不是“制单”状态，不允许删除")
                return;
            }
            BasemanService.swalDelete("删除", "确定要删除该明细吗", function (bool) {
                if (bool) {
                    var dg = $scope.lineGridView;
                    var rowidx = args.row;
                    var postData = {};
                    postData.adjust_id = args.grid.getDataItem(args.row).adjust_id;
                    var bill_type = args.grid.getDataItem(args.row).bill_type;
                    var adjust_no = args.grid.getDataItem(args.row).adjust_no;
                    dg.getData().splice(rowidx, 1);
                    dg.invalidateAllRows();
                    dg.render();
                    swal("删除!", "删除成功!", "success");
                } else {
                    return
                }
            });
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

    /**
     * 弹出添加明细框
     */
    $scope.newDetail = function () {
        $scope.data.AddItem = {};
        $scope.data.DecreaseItem = {};
        $scope.data.AddItem.style = "";
        $scope.data.DecreaseItem.style = ""
        $scope.AddDisabled = true;
        $scope.DecreaseDisabled = true;
        if ($scope.data.currItem.style == 1) {
            $scope.AddDisabled = false;
            $scope.data.AddItem.style = $scope.data.currItem.style;
        } else if ($scope.data.currItem.style == 2) {
            $scope.DecreaseDisabled = false;
            $scope.data.DecreaseItem.style = $scope.data.currItem.style;
            $scope.DecItemForm.$setPristine();
        } else if ($scope.data.currItem.style = 3) {
            $scope.AddDisabled = false;
            $scope.DecreaseDisabled = false;
            $scope.AddItemForm.$setPristine();
            $scope.DecItemForm.$setPristine();
            $scope.data.DecreaseItem.style = 2;
            $scope.data.AddItem.style = 1;
        }
        $("#AddDetailModal").modal();
    };

    /**
     * 保存
     */
    $scope.saveAll = function (bsubmit) {
        if ($scope.checkNull()) {
            return;
        } else {
            var saction = "insert";
            if ($scope.data.currItem.adjust_id>0) {
                saction = "update";
                $scope.data.currItem.bill_date = current_time;
            }
            BasemanService.RequestPost("fin_bud_adjust_header", saction, JSON.stringify($scope.data.currItem)).then(
                function (data) {
                    BasemanService.swalSuccess("成功", "保存成功!");
                    if (bsubmit) {
                        if (angular.element('#wfinspage').length == 0) {
                            $("#wfinsform").append("<iframe id='wfinspage' style='width: 100%;height: 100%;background-color: #e2e5ec;'></iframe>");
                        }
                        $scope.initWfIns(true);
                        $('#detailtab a:last').tab('show');
                    }
                }
            );
        }
    }

    //检查明细表是否为空
    $scope.checkNull = function () {
        if (typeof ($scope.data.currItem.org_code) == "undefined" || $scope.data.currItem.org_code == null) {
            swal("提示!", "请选择制单部门!");
            return true;
        }
        if (typeof ($scope.data.currItem.fin_bud_adjust_lineoffin_bud_adjust_headers[0]) == "undefined" || $scope.data.currItem.fin_bud_adjust_lineoffin_bud_adjust_headers == null) {
            swal("提示!", "请添加明细!");
            return true;
        }
        return false;
    }

    //双向调整时 金额保持一致
    $scope.same = function (item) {
        if ($scope.data.currItem.style == 3) {
            if (item == 'addItem') {
                $scope.data.DecreaseItem.adjust_amt = $scope.data.AddItem.adjust_amt;
            }
            if (item == "decItem") {
                $scope.data.AddItem.adjust_amt = $scope.data.DecreaseItem.adjust_amt;
            }
        }
    }

    //如果改变调整类型下拉窗口,必须清空已添加的明细重新输入
    $scope.onChangeClear = function () {
        if ($scope.data.currItem.fin_bud_adjust_lineoffin_bud_adjust_headers.length > 0) {
            $scope.data.currItem.fin_bud_adjust_lineoffin_bud_adjust_headers = []
            $scope.lineGridView.setData($scope.data.currItem.fin_bud_adjust_lineoffin_bud_adjust_headers);
            $scope.lineGridView.render();
            $scope.addTotal = 0;
            $scope.decTotal = 0;
        }
    }
    /**
     * 将明细暂时放入表中
     */
    $scope.saveDetail = function () {
        $scope.lineGridView.setData([]);
        if ($scope.data.currItem.style == 1) {
            if (FormValidatorService.validatorFrom($scope, "#AddItemForm")) {                   //非空校验
                $scope.data.currItem.fin_bud_adjust_lineoffin_bud_adjust_headers.push($scope.data.AddItem);
                $scope.lineGridView.setData($scope.data.currItem.fin_bud_adjust_lineoffin_bud_adjust_headers);
                $scope.lineGridView.render();
                totalCount($scope.data.currItem.fin_bud_adjust_lineoffin_bud_adjust_headers);
                $("#AddDetailModal").modal('hide');
            }
        } else if ($scope.data.currItem.style == 2) {
            if (FormValidatorService.validatorFrom($scope, "#DecItemForm")) {     //非空校验
                checkDec_atm();
                if ($scope.canuseamt < $scope.data.DecreaseItem.adjust_amt) {
                    swal("提示!", $scope.data.DecreaseItem.dname + "期间," + $scope.data.DecreaseItem.org_name + "的" + $scope.data.DecreaseItem.object_name + " 的可调整金额<= " + $scope.canuseamt + ",无法调减");
                    return;
                }
                $scope.data.currItem.fin_bud_adjust_lineoffin_bud_adjust_headers.push($scope.data.DecreaseItem);
                $scope.data.currItem.De_adjust_amt = $scope.data.DecreaseItem.adjust_amt;
                $scope.lineGridView.setData($scope.data.currItem.fin_bud_adjust_lineoffin_bud_adjust_headers);
                $scope.lineGridView.render();
                totalCount($scope.data.currItem.fin_bud_adjust_lineoffin_bud_adjust_headers);
                $("#AddDetailModal").modal('hide');
            }
        } else if ($scope.data.currItem.style == 3) {
            if (FormValidatorService.validatorFrom($scope, "#AddItemForm") && FormValidatorService.validatorFrom($scope, "#DecItemForm")) {          //非空校验
                checkDec_atm();
                if ($scope.data.AddItem.bud_type_code == $scope.data.DecreaseItem.bud_type_code && $scope.data.AddItem.object_code == $scope.data.DecreaseItem.object_code && $scope.data.AddItem.org_code == $scope.data.DecreaseItem.org_code) {
                    swal("提示!", "双向调整的预算类别|费用对象|预算机构不能全部完全一致,必须有一项不同");
                    return;
                }
                if ($scope.canuseamt < $scope.data.DecreaseItem.adjust_amt) {
                    swal("提示!", $scope.data.DecreaseItem.dname + "期间," + $scope.data.DecreaseItem.org_name + "的" + $scope.data.DecreaseItem.object_name + " 的可调整金额<= " + $scope.canuseamt + ",无法调减");
                    return;
                }
                $scope.data.currItem.fin_bud_adjust_lineoffin_bud_adjust_headers.push($scope.data.AddItem);
                $scope.data.currItem.fin_bud_adjust_lineoffin_bud_adjust_headers.push($scope.data.DecreaseItem);
                $scope.lineGridView.setData($scope.data.currItem.fin_bud_adjust_lineoffin_bud_adjust_headers);
                $scope.lineGridView.render();
                totalCount($scope.data.currItem.fin_bud_adjust_lineoffin_bud_adjust_headers);
                $("#AddDetailModal").modal('hide');
            }
        }
    }

    //校验调减金额是否在可用范围之内
    function checkDec_atm() {
        var sqlwhere = " Fin_Bud.Bud_Year=" + $scope.data.currItem.bud_year +
            " and Fin_Bud.bud_type_id=" + $scope.data.DecreaseItem.bud_type_id +
            " and Fin_Bud.Item_Type_Id=0 and Fin_Bud.Object_Id=" + $scope.data.DecreaseItem.object_id +//查费用项目
            " and Fin_Bud.Org_Id=" + $scope.data.DecreaseItem.org_id +
            " and Fin_Bud.dname= '" + $scope.data.DecreaseItem.dname + "'"
        var data = BasemanService.RequestPostSync("fin_bud", "search", {"sqlwhere": sqlwhere})
        if (data.fin_buds.length == 1) {
            var bud_id = data.fin_buds[0].bud_id
            var result = BasemanService.RequestPostSync("fin_fee_apply_header", "checkbudbeforeflow", {"bud_id": bud_id})
            if (result.canuseamt >= 0) {
                $scope.canuseamt = result.canuseamt
                return $scope.canuseamt;
            }
        }
    }

    //编辑调整调减后 累加 并显示到表单框事件
    function totalCount(cdata) {
        var lineData = cdata;
        var addTotal = 0;
        var decTotal = 0;
        var lineRow = [];
        for (var i = 0; i < lineData.length; i++) {
            lineRow.push(SinoccCommon.stringPropToNum(lineData[i]));
            if (lineRow[i].adjust_amt != null && lineRow[i].style == 1) {
                addTotal += lineRow[i].adjust_amt;
            }
            if (lineRow[i].adjust_amt != null && lineRow[i].style == 2) {
                decTotal += lineRow[i].adjust_amt;
            }
        }
        safeApply($scope, function () {
            $scope.addTotal = SinoccCommon.formatMoney(addTotal);
            $scope.decTotal = SinoccCommon.formatMoney(decTotal);
        })
    }

    //檢查是否更新視圖
    function safeApply(scope, fn) {
        (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
    }

    /**
     * 预算类别
     */
    $scope.searchBudType = function (searchType) {
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
                code: "Fee_Type_Level",
            }, {
                name: "预算期间类别",
                code: "Period_Type"
            }, {
                name: "描述",
                code: "Description"
            }],
            classid: "Fin_Bud_Type_Header",
            url: "/jsp/req.jsp",
            direct: "center",
            sqlBlock: "",
            backdatas: "fin_bud_type_headers",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: 10
            },
            searchlist: ["bud_type_id", "bud_type_name", "bud_type_code"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            if (searchType == 'AddDetail') {
                $scope.data.AddItem.bud_type_name = result.bud_type_name;
                $scope.data.AddItem.bud_type_code = result.bud_type_code;
                $scope.data.AddItem.bud_type_id = result.bud_type_id;
                $scope.data.AddItem.fee_type_id = result.fee_type_id;
                $scope.data.AddItem.period_type = result.period_type;

                //逻辑关联,预算类别改变,需要清空费用对象,让用户重新选择
                delete $scope.data.AddItem.object_name;
                delete $scope.data.AddItem.object_code;
                delete $scope.data.AddItem.object_type;
                delete $scope.data.AddItem.object_id;
            } else if (searchType == 'DecreaseDetail') {
                $scope.data.DecreaseItem.bud_type_name = result.bud_type_name;
                $scope.data.DecreaseItem.bud_type_code = result.bud_type_code;
                $scope.data.DecreaseItem.bud_type_id = result.bud_type_id;
                $scope.data.DecreaseItem.fee_type_id = result.fee_type_id;
                $scope.data.DecreaseItem.period_type = result.period_type;

                delete $scope.data.DecreaseItem.object_name
                delete $scope.data.DecreaseItem.object_code
                delete $scope.data.DecreaseItem.object_type
                delete $scope.data.DecreaseItem.object_id;
            }
        })
    };

    /**
     * 查询费用项目
     */
    $scope.searchFeeObject = function (name, postdata) {
        //过滤条件
        if (name == 'AddItem') {
            if (!$scope.data.AddItem.bud_type_id) {
                BasemanService.swal("提示", "请先选择预算类别")
                return
            } else {
                postdata = {
                    bud_type_id: $scope.data.AddItem.bud_type_id,
                    fee_type_id: $scope.data.AddItem.fee_type_id,
                    flag:4
                }
            }
        } else if (name == 'DecreaseItem') {
            if (!$scope.data.DecreaseItem.bud_type_id) {
                BasemanService.swal("提示", "请先选择预算类别")
                return
            }else {
                postdata = {
                    bud_type_id: $scope.data.DecreaseItem.bud_type_id,
                    fee_type_id: $scope.data.DecreaseItem.fee_type_id,
                    flag:4
                }
            }
        }
        $scope.FrmInfo = {
            title: "费用项目查询",
            thead: [{
                name: "费用项目编码",
                code: "fee_code"
            }, {
                name: "费用项目名称",
                code: "fee_name"
            },{
                name: "费用类别",
                code: "object_type"
            }],
            classid: "fin_bud_type_line_obj",
            url: "/jsp/budgetman.jsp",
            direct: "center",
            sqlBlock: "",
            backdatas: "fin_bud_type_line_objs",
            ignorecase: "true", //忽略大小写
            searchlist: ["fee_code", "fee_name","object_type"],
            postdata: postdata
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            if (name == 'AddItem') {
                $scope.data.AddItem.object_id = result.fee_id;
                $scope.data.AddItem.object_name = result.fee_name;
                $scope.data.AddItem.object_code = result.fee_code;
                $scope.data.AddItem.object_type = result.object_type;
            } else if (name == 'DecreaseItem') {
                $scope.data.DecreaseItem.object_id = result.fee_id;
                $scope.data.DecreaseItem.object_name = result.fee_name;
                $scope.data.DecreaseItem.object_code = result.fee_code;
                $scope.data.DecreaseItem.object_type = result.object_type;
                if($scope.data.DecreaseItem.org_id && $scope.data.DecreaseItem.dname){
                    checkDec_atm();
                }

            }

        })
    };

    /**
     * 部门查询
     */
    $scope.searchDept = function (searchType) {
        $scope.FrmInfo = {
            title: "部门或机构查询  ",
            thead: [{
                name: "部门或机构名称",
                code: "dept_name",
            }, {
                name: "部门或机构编码",
                code: "dept_code",
            },{
                name: "机构路径",
                code: "namepath"
            }],
            classid: "Dept",
            url: "/jsp/req.jsp",
            direct: "center",
            sqlBlock: "",
            backdatas: "depts",
            ignorecase: "true", //忽略大小写
            postdata: {},
            searchlist: ["dept_code", "dept_name", "dept_id"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            if (searchType == 'AddDetail') {

                $scope.data.AddItem.org_id = result.dept_id;
                $scope.data.AddItem.org_code = result.dept_code;
                $scope.data.AddItem.org_name = result.dept_name;

                //逻辑关联,预算类别改变,需要清空预算期间,让用户重新选择
                delete $scope.data.AddItem.dname;
            } else if (searchType == 'DecreaseDetail') {
                $scope.data.DecreaseItem.org_code = result.dept_code;
                $scope.data.DecreaseItem.org_name = result.dept_name;
                $scope.data.DecreaseItem.org_id = result.dept_id;
                if($scope.data.DecreaseItem.object_id && $scope.data.DecreaseItem.dname){
                    checkDec_atm();
                }
                delete $scope.data.DecreaseItem.dname;
            }
            else if (searchType == 'checkDetail') {
                $scope.data.currItem.org_code = result.dept_code;
                $scope.data.currItem.org_name = result.dept_name;
                $scope.data.currItem.org_id = result.dept_id;
            }

        })
    }

    //查询预算期间
    $scope.searchBudPeriod = function (name, postdata) {
        if ((name == 'AddItem' && !$scope.data.AddItem.org_id) || (name == 'DecreaseItem' && !$scope.data.DecreaseItem.org_id)) {
            BasemanService.swal("提示", "请先选择预算机构")
            return
        }
        postdata = {
            period_year: $scope.data.currItem.bud_year,
            flag:3
        }
        postdata.period_type = name == 'AddItem'?$scope.data.AddItem.period_type:$scope.data.DecreaseItem.period_type
        $scope.FrmInfo = {
            title: "预算期间",
            thead: [{
                name: "预算期间名称",
                code: "dname"
            }, {
                name: "开始日期",
                code: "start_date"
            }, {
                name: "结束日期",
                code: "end_date"
            }, {
                name: "预算期间描述",
                code: "description"
            }],
            classid: "Fin_Bud_Period_Header",
            url: "/jsp/req.jsp",
            direct: "center",
            sqlBlock: "",
            backdatas: "fin_bud_period_lineoffin_bud_period_headers",
            ignorecase: "true", //忽略大小写
            postdata: postdata,
            searchlist: ["dname", "start_date", "end_date","description"],
            action: "getbeforeperiod"
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            if (name == 'AddItem') {
                var data = BasemanService.RequestPostSync("fin_bud", "getbudid", {
                    "org_id": $scope.data.AddItem.org_id,
                    "bud_type_id": $scope.data.AddItem.bud_type_id,
                    "object_id": $scope.data.AddItem.object_id,
                    "dname": result.dname
                })
                if (data.no_bud == 1) {
                    BasemanService.swal("提示", "所调整的预算没有编制")
                    return
                } else {
                    $scope.data.AddItem.dname = result.dname
                }
            } else if (name == 'DecreaseItem') {
                var data = BasemanService.RequestPostSync("fin_bud", "getbudid", {
                    "org_id": $scope.data.DecreaseItem.org_id,
                    "bud_type_id": $scope.data.DecreaseItem.bud_type_id,
                    "object_id": $scope.data.DecreaseItem.object_id,
                    "dname": result.dname
                })
                if (data.no_bud == 1) {
                    BasemanService.swal("提示", "所调整的预算没有编制")
                    return
                }
                $scope.data.DecreaseItem.dname = result.dname
                if($scope.data.DecreaseItem.object_id && $scope.data.DecreaseItem.org_id){
                    checkDec_atm();
                }


            }
        })
    }

    /**
     * 流程实例初始化
     */
    $scope.initWfIns = function (bSubmit) {
        SinoccCommon.stringPropToNum($scope.data.currItem);
        //制单后才显示流程
        if ($scope.data.currItem.adjust_id && $scope.data.currItem.adjust_id > 0) {
            if ($scope.data.currItem.wfid && $scope.data.currItem.wfid > 0) {
                if (angular.element('#wfinspage').attr('src') != '/web/index.jsp?t='+(new Date()).getTime()+'#/crmman/wfins//' + $scope.data.currItem.wfid + '/' + $scope.data.objtypeid + '/' + $scope.data.currItem.adjust_id + '/0?showmode=2') {
                    angular.element('#wfinspage').attr('src', '/web/index.jsp?t='+(new Date()).getTime()+'#/crmman/wfins//' + $scope.data.currItem.wfid + '/' + $scope.data.objtypeid + '/' + $scope.data.currItem.adjust_id + '/0?showmode=2');
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
        console.log("tabName: " + tabName);
        if ('流程' == tabName) {
            if (angular.element('#wfinspage').length == 0) {
                $("#wfinsform").append("<iframe id='wfinspage' style='width: 100%;height: 100%;background-color: #e2e5ec;'></iframe>");
            }
            $scope.initWfIns();
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
        BasemanService.RequestPost("scpobjconf", "select", JSON.stringify(postData))
            .then(function (data) {
                if (data.objwftempofobjconfs && data.objwftempofobjconfs.length > 1) {
                    for (var i = data.objwftempofobjconfs.length - 1; i > -1; i--) {
                        //条件过滤
                        if (data.objwftempofobjconfs[i].execcond != '') {
                            //用正则表达式替换变量<item>
                            var regexp = new RegExp("<item>", "gm");
                            var sexeccond = data.objwftempofobjconfs[i].execcond.replace(regexp, "$scope.data.currItem");
                            regexp = new RegExp("<objid>", "gm");
                            //执行对象ID替换
                            sexeccond = sexeccond.replace(regexp, $scope.data.currItem.adjust_id);
                            //如果有SQL语句则通过后台执行SQL
                            if (sexeccond.indexOf("<sql:") > -1) {
                                sexeccond = $scope.execSQLCond(sexeccond);
                            }
                            //运行表达式 不符合条件的移除
                            if (!eval(sexeccond)) {
                                data.objwftempofobjconfs.splice(i, 1);
                            }
                        }
                    }
                    if (data.objwftempofobjconfs && data.objwftempofobjconfs.length > 1) {
                        $scope.data.wftemps = []
                        for(var i =0;i<data.objwftempofobjconfs.length;i++){
                            $scope.data.wftemps.push(data.objwftempofobjconfs[i])
                        }
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
     *调用后台方法执行SQL语句，依据后台返回替换变量值
     * @returns {*}
     */
    $scope.execSQLCond = function (condstr) {
        var reg = /<sql:(.*?)(?=[>])/g;//匹配任意字母
        var t = condstr.match(reg);
        var tmp = "";
        if (t && t.length > 0) {
            for (var i = 0; i < t.length; i++) {
                console.log(t[i]);
                tmp = t[i].replace("<sql:", "").replace(">", "");
                var data = BasemanService.RequestPostSync("sqltool", "execsql", {"sql": tmp});
                condstr = condstr.replace(t[i], data.sqlresult);
            }
        }
        var regexp = new RegExp(">", "gm");
        condstr = condstr.replace(regexp, "");
        return condstr;
    }

    /**
     * 选择流程模版ID
     * @param wftempid
     */
    $scope.selectWfTemp = function (wftempid) {
        $("#selectWfTempModal").modal("hide");
        if ($scope.data.bSubmit) {
            angular.element('#wfinspage').attr('src', '/web/index.jsp?t='+(new Date()).getTime()+'#/crmman/wfins/' + wftempid + '//' + $scope.data.objtypeid + '/' + $scope.data.currItem.adjust_id + '/1?showmode=2');
        } else {
            angular.element('#wfinspage').attr('src', '/web/index.jsp?t='+(new Date()).getTime()+'#/crmman/wfins/' + wftempid + '//' + $scope.data.objtypeid + '/' + $scope.data.currItem.adjust_id + '/0?showmode=2');
        }
        $scope.data.bSubmit = false;
    }


    //modal显示时绑定切换事件
    $('#detailtab').on('shown.bs.tab', $scope.onTabChange);

    /**
     * 查询后台数据
     */
    $scope.searchData = function () {
        BasemanService.RequestPost("fin_bud_adjust_header", "select", JSON.stringify($scope.data.currItem))
            .then(function (data) {
                $scope.data.currItem = data;
                totalCount(data.fin_bud_adjust_lineoffin_bud_adjust_headers)
                $scope.lineGridView.setData([]);
                if ($scope.data.currItem.fin_bud_adjust_lineoffin_bud_adjust_headers &&$scope.data.currItem.fin_bud_adjust_lineoffin_bud_adjust_headers.length>0) {
                    var lineData = $scope.data.currItem.fin_bud_adjust_lineoffin_bud_adjust_headers;
                    getprint();  //加载打印项
                }
                $scope.lineGridView.setData($scope.data.currItem.fin_bud_adjust_lineoffin_bud_adjust_headers);
                $scope.lineGridView.render();
            })
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
     * 查询当前对象
     */
    $scope.selectCurrenItem = function () {
        if (Number($scope.data.currItem.adjust_id) > 0 ) {
            $scope.searchData();
        } else {
            $scope.data.currItem = {
                fin_bud_adjust_lineoffin_bud_adjust_headers: [],
                "create_time": current_time,
                "creator": strUserId,
                "creator_view": strUserName,
                "stat": 1,
                "bill_date": current_time,
                "bud_year": current_year
            };
            $scope.lineGridView.setData($scope.data.currItem.fin_bud_adjust_lineoffin_bud_adjust_headers);
            $scope.lineGridView.invalidateAllRows();
            $scope.lineGridView.render();
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
        LODOP.PRINT_INIT("预算调整单打印");
        LODOP.SET_PRINT_PAGESIZE(0, 0, 0, "A4");
        var strStyle = "<style> table,td,th {border-width: 1px;border-style: solid;border-collapse: collapse}</style>"
        LODOP.SET_PRINT_STYLE("ItemType", 0)
        LODOP.ADD_PRINT_HTM(30, "2%", "97%", 180, document.getElementById("div1").innerHTML);
        LODOP.SET_PRINT_STYLE("ItemType", 0)
        LODOP.ADD_PRINT_TABLE(230, "2%", "97%", $scope.data.currItem.fin_bud_adjust_lineoffin_bud_adjust_headers.length * 25, strStyle + document.getElementById("div2").innerHTML);
        LODOP.SET_PRINT_STYLE("ItemType", 0)
        LODOP.ADD_PRINT_TABLE(280 + $scope.data.currItem.fin_bud_adjust_lineoffin_bud_adjust_headers.length * 25, "2%", "98%", 40 + $scope.opinions.length * 25, document.getElementById("div3").innerHTML, document.getElementById("div3").innerHTML);
        LODOP.SET_PRINT_STYLE("ItemType", 1)
        LODOP.SET_PRINT_STYLE("FontSize", 10)
        LODOP.ADD_PRINT_TEXT("97%", "60%", "RightMargin:1%", "BottomMargin:1%", "打印人:" + strUserName + " 打印时间:" + printTime)
        $scope.print = false;
        LODOP.PREVIEW();
    };

    //加载打印项所需文本
    function getprint() {
        if ($scope.data.currItem.wfid) {
            BasemanService.RequestPost("scpwf", "select", {"wfid": $scope.data.currItem.wfid}).then(function (data) {
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

    //对外暴露scope对象，让流程控制器使用刷新方法
    window.currScope = $scope;

    IncRequestCount();
    DecRequestCount();
}

//注册控制器
angular.module('inspinia')
    .controller('fin_bud_adjust_bill', fin_bud_adjust_bill);