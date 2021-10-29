/**这是预算调整界面js*/
function fin_bud_adjust_header($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService, BaseService) {
    "use strict"
    $scope.data = {"objtypeid": 1106};
    $scope.data.currItem = {};
    var current_time = new Date().toLocaleDateString();
    var current_year = new Date().getFullYear();
    $scope.AddDisabled = "";
    $scope.DecreaseDisabled = "";
    $scope.data.AddItem = {};
    $scope.data.DecreaseItem = {};
    $scope.addTotal = 0;
    $scope.decTotal = 0;
    // 初始化通过页面传递过来的参数
    $scope.canuseamt = ""

    //获取路由名称
    var routeName = $state.current.name;
    $scope.routeFlag = 1;  //路由标志：1 费控系统 2 市场资源预算调整
    //市场资源预算调整
    if(routeName == 'mktman.mkt_bud_adjust_header'){
        $scope.routeFlag = 2;
    }

    //详情页面url
    var url;
    if($scope.routeFlag == 1){
        url = "/index.jsp#/crmman/finbudadjust/"
    }
    if($scope.routeFlag == 2){
        url = "/index.jsp#/mktman/mktbudadjust/"
    }

    // 添加按钮
    var editHeaderButtons = function (row, cell, value, columnDef, dataContext) {
        return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>查看</button> " +
            " <button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
    };
    var editDetailButton = function (row, cell, value, columnDef, dataContext) {
        return " <button class='btn btn-sm btn-info dropdown-toggle delbtn deldetailbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
    };

    var seqformatter = function (row, cell, value, columnDef, dataContext) {
        return "<div style='text-align:center;vertical-align:middle;'>" + value + "</div>"
    }


    // **********网格**********
    $scope.headerOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false
    };

    //列属性
    $scope.headerColumns = [
        {
            name: "操作",
            width: 90,
            formatter: editHeaderButtons
        }, {
            name: "序号",
            id: "id",
            field: "id",
            width: 45,
            formatter: seqformatter
        }, {
            name: "单据状态",
            id: "stat",
            field: "stat",
            width: 80,
            editor: Slick.Editors.DropDownEditor,
            formatter: Slick.Formatters.SelectOption,
            options:[],
            type:"list"
        }, {
            name: "调整类型",
            id: "style",
            field: "style",
            width: 80,
            editor: Slick.Editors.DropDownEditor,
            formatter: Slick.Formatters.SelectOption,
            options:[],
            type:"list"
        }, {
            name: "调整单编码",
            id: "adjust_no",
            field: "adjust_no",
            width: 150,
            type:"string"
        }, {
            name: "单据类型",
            id: "bill_type",
            field: "bill_type",
            width: 100,
            editor: Slick.Editors.DropDownEditor,
            formatter: Slick.Formatters.SelectOption,
            options:[],
            type:"list"
        }, {
            name: "调整日期",
            id: "bill_date",
            field: "bill_date",
            width: 160,
            editor: Slick.Editors.Date,
            type:"date"
        }, {
            name: "制单人",
            id: "creator",
            field: "creator",
            width: 60,
            type:"string"
        }, {
            name: "制单时间",
            id: "create_time",
            field: "create_time",
            width: 160,
            editor: Slick.Editors.Date,
            formatter: Slick.Formatters.Date,
            type:"date"
        }, {
            name: "制单部门编码",
            id: "org_code",
            field: "org_code",
            width: 100,
            type:"string"
        }, {
            name: "制单部门",
            id: "org_name",
            field: "org_name",
            width: 160,
            type:"string"
        }, {
            name: "预算年度",
            id: "bud_year",
            field: "bud_year",
            width: 80,
            type:"number"
        }, {
            name: "备注",
            id: "note",
            field: "note",
            width: 150,
            type:"string"
        },
    ]

    //创建Headergrid，“table”为表格生成位置的ID
    $scope.headerGridView = new Slick.Grid("#viewGrid", [], $scope.headerColumns, $scope.headerOptions);

    $scope.getIndexByField = function (columns, field) {
        for (var i = 0; i < $scope[columns].length; i++) {
            if ($scope[columns][i].field == field) {
                return i;
                break;
            }
        }
        return false
    }

    /** 系统词汇查询**/
    function searchdicts(dictname, grid, gridcolumns, columnname) {
        var dictdata = [];
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: dictname})
            .then(function (data) {
                var dicts = [];
                for (var i = 0; i < data.dicts.length; i++) {
                    dicts[i] = {
                        value: parseInt(data.dicts[i].dictvalue),
                        desc: data.dicts[i].dictname,
                        id: parseInt(data.dicts[i].dictvalue),
                        name: data.dicts[i].dictname
                    };
                    dictdata.push(dicts[i]);
                }
                if ($scope.getIndexByField(columnname, dictname)) {
                    gridcolumns[$scope.getIndexByField(columnname, dictname)].options = dicts;
                    grid.setColumns(gridcolumns);
                }
            });
        return dictdata;
    }


    searchdicts('bill_type', $scope.headerGridView, $scope.headerColumns, 'headerColumns');    //单据类型
    searchdicts('stat',  $scope.headerGridView, $scope.headerColumns, 'headerColumns');              //单据状态
    searchdicts('style', $scope.headerGridView, $scope.headerColumns, 'headerColumns');             //调整类型

    //点击事件
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
            BasemanService.swalDelete("删除","确定要删除 " + "预算调整单【" + adjust_no + "】吗？", function (bool) {
                if (bool) {
                    BasemanService.RequestPost("fin_bud_adjust_header", "delete", JSON.stringify(postData))
                        .then(function (data) {
                            dg.getData().splice(rowidx, 1);
                            dg.invalidateAllRows();
                            dg.render();
                            e.stopImmediatePropagation();
                        })
                } else {
                    return;
                }
            })
        }
    };

    //双击查看
    function dgOnDblClick(e, args) {
        $scope.viewDetail(args);
    }

    function dgLineClick(e, args) {
        //点击删除按钮处理事件
        if ($(e.target).hasClass("deldetailbtn")) {
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
        }
        e.stopImmediatePropagation();
    };

    //绑定点击事件
    $scope.headerGridView.onClick.subscribe(dgOnClick);
    $scope.headerGridView.onDblClick.subscribe(dgOnDblClick);


    /**
     * 保存
     */
    $scope.saveAll = function () {
        if ($scope.checkNull()) {
            return;
        } else {
            var saction = "insert";
            if ($scope.data.currItem.adjust_id) {
                saction = "update";
                $scope.data.currItem.bill_date = current_time;
            }
            BasemanService.RequestPost("fin_bud_adjust_header", saction, JSON.stringify($scope.data.currItem)).then(
                function (data) {
                    $scope.headerGridView.setData(data.fin_bud_adjust_headers);
                    $scope.headerGridView.render();
                    BasemanService.swalSuccess("成功", "保存成功!", function (bool) {
                        $scope.closeWindow();
                    });
                    $scope.searchData();
                }
            );
        }
    }

    //检查明细表是否为空
    $scope.checkNull = function () {
        if (typeof ($scope.data.currItem.org_code) == "undefined" || $scope.data.currItem.org_code == null) {
            swal("提示!", "请添加制单部门!");
            return true;
        }
        if (typeof ($scope.data.currItem.fin_bud_adjust_lineoffin_bud_adjust_headers[0]) == "undefined" || $scope.data.currItem.fin_bud_adjust_lineoffin_bud_adjust_headers == null) {
            swal("提示!", "请添加明细!");
            return true;
        }
        return false;
    }
    /**
     * 查看详情
     * @param args
     */
    $scope.viewDetail = function (args) {
        var id = args.grid.getDataItem(args.row).adjust_id;
        BasemanService.openModal({
            url: url + id,
            title: "预算调整",
            obj: $scope,
            ondestroy: $scope.searchData
        });
    };

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

    //使用对象类型下拉框值改变时触发事件
    $("#useobj").change(function () {
        $scope.data.addCurrItem.useobject_code = "";
        $scope.data.addCurrItem.useobject_name = "";
    })
    //模态框取消事件
    $scope.hide = function () {
        $("#addLineModal").modal("hide");
       var isEdit = 0;
    }

    /**
     * 弹出添加框
     */
    $scope.addHeader = function () {
        BasemanService.openModal({
            url: url + "0",
            title: "预算调整",
            obj: $scope,
            ondestroy: $scope.searchData
        });
    }

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
        $scope.canuseamt = ""
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
            if (FormValidatorService.validatorFrom($scope, "#DecItemForm")) {                             //非空校验
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
        BasemanService.RequestPost("fin_bud", "search", {"sqlwhere": sqlwhere}).then(function (data) {
            if (data.fin_buds.length == 1) {
                var bud_id = data.fin_buds[0].bud_id
                BasemanService.RequestPost("fin_fee_apply_header", "docheckbudbeforeflow", {"bud_id": bud_id}).then(function (result) {
                    if (result.canuseamt >= 0) {
                        $scope.canuseamt = result.canuseamt
                        return $scope.canuseamt;
                    }
                })
            }
        })
    }

    //编辑调整调减后 累加 并显示到表单框事件
    function totalCount(cdata) {
        var lineData = cdata;
        var addTotal = 0;
        var decTotal = 0;
        var lineRow = [];
        for (var i = 0; i < lineData.length; i++) {
            lineRow.push(HczyCommon.stringPropToNum(lineData[i]));
            if (lineRow[i].adjust_amt != null && lineRow[i].style == 1) {
                addTotal += lineRow[i].adjust_amt;
            }
            if (lineRow[i].adjust_amt != null && lineRow[i].style == 2) {
                decTotal += lineRow[i].adjust_amt;
            }
        }
        safeApply($scope, function () {})
    }

    //檢查是否更新視圖
    function safeApply(scope, fn) {
        (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
    }


    /**
     * 高级条件查询
     */
    $scope.getsql = function () {
        $scope.FrmInfo = {
            title: "预算调整",
            thead: [],
            classid: "Fin_Bud_Adjust_Header",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "fin_bud_adjust_headers",
            ignorecase: "true", //忽略大小写
            postdata: {},
            is_high:true
        };
        $.each($scope.headerColumns,function (i,item) {
            if(item.type){
                $scope.FrmInfo.thead.push({
                    name:item.name,
                    code:item.field,
                    type:item.type,
                    dicts:item.options
                })
            }
        })
        BasemanService.open(CommonPopController1, $scope).result.then(function (result) {
            $scope.sqlwhere = result;
            $scope.searchData()
        })
    }




    /**
     * 流程实例初始化
     */
    $scope.initWfIns = function () {
        HczyCommon.stringPropToNum($scope.data.currItem);
        //制单后才显示流程
        if ($scope.data.currItem.adjust_id && $scope.data.currItem.adjust_id > 0) {
            if ($scope.data.currItem.wfid && $scope.data.currItem.wfid > 0) {
                if (angular.element('#wfinspage').attr('src') != '/index.jsp#/crmman/wfins//' + $scope.data.currItem.wfid + '/' + $scope.data.objtypeid + '/' + $scope.data.currItem.adjust_id + '/0?showmode=2') {
                    angular.element('#wfinspage').attr('src', '/index.jsp#/crmman/wfins//' + $scope.data.currItem.wfid + '/' + $scope.data.objtypeid + '/' + $scope.data.currItem.adjust_id + '/0?showmode=2');
                }
            } else if ($scope.data.currItem.stat == 1) {
                var postData = {
                    "objtypeid": $scope.data.objtypeid
                }
                BasemanService.RequestPost("scpobjconf", "select", JSON.stringify(postData))
                    .then(function (data) {
                        if (data.objwftempofobjconfs && data.objwftempofobjconfs.length > 0) {
                            if (angular.element('#wfinspage').attr('src') != '/index.jsp#/crmman/wfins/' + data.objwftempofobjconfs[0].wftempid + '//' + $scope.data.objtypeid + '/' + $scope.data.currItem.adjust_id + '/0?showmode=2') {
                                angular.element('#wfinspage').attr('src', '/index.jsp#/crmman/wfins/' + data.objwftempofobjconfs[0].wftempid + '//' + $scope.data.objtypeid + '/' + $scope.data.currItem.adjust_id + '/0?showmode=2');
                            }
                        }
                    });
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

    //详情页面隐藏时初始化显示第一个tab页面
    $('#detailModal').on('hidden.bs.modal', function (e) {
        //隐藏后默认显示第一个
        $('#detailtab a:first').tab('show');
        //angular.element('#wfinspage').attr('src', '');
        $("#wfinsform").empty();
    })
    //modal显示时绑定切换事件
    $('#detailModal').on('shown.bs.tab', $scope.onTabChange);

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
        if($scope.sqlwhere && $scope.sqlwhere != ""){
            postdata.sqlwhere = $scope.sqlwhere;
        }
        BasemanService.RequestPost("fin_bud_adjust_header", "search", postdata)
            .then(function (data) {
                $scope.headerGridView.setData([]);
                if (data.fin_bud_adjust_headers) {
                    $.each(data.fin_bud_adjust_headers, function (i, item) {
                        item.id = i + 1;
                    })
                    $scope.headerGridView.setData(data.fin_bud_adjust_headers);
                }
                $scope.headerGridView.render();
                BaseService.pageInfoOp($scope, data.pagination);
            });
    }
    //初始化后调用查询方法
    BasemanService.initGird();//自适应高度
    BaseService.pageGridInit($scope);

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
}


//注册控制器
angular.module('inspinia')
    .controller('fin_bud_adjust_header', fin_bud_adjust_header);