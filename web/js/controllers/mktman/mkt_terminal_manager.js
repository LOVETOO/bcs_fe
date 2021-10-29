/**
 * 终端网点授权申请
 * 2018-07-31 by huderong
 */
function mkt_terminal_manager($scope, BaseService, $filter, $location, $rootScope, $modal, $timeout,
                              BasemanService, notify, $state, localeStorageService, FormValidatorService, $stateParams, AgGridService) {

    mkt_terminal_manager = HczyCommon.extend(mkt_terminal_manager, ctrl_bill_public);
    mkt_terminal_manager.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    $scope.data = {};
    $scope.data.currItem = {};
    $scope.data.searchItem = {};
    $scope.data.mkt_terminal_org_data = {};
    //明细序号
    var lineMaxSeq = 0;

    /**
     * 词汇池
     */
    $scope.dictPool = {
        'crm_terminal_type': {},
        'terminal_kind': {},
        'stat': {},
        'grade_market': {},
        'position_class': {},
        'branch_form': {},
        'branch_property': {},
        'nvc_acreage_class': {},
        'decoration_plan': {},
        'branch_brand': {},
    };

    /**
     * 加载词汇
     */
    /**
     * 加载词汇
     */
    angular.forEach($scope.dictPool, function (dictOption, dictCode) {
        BasemanService.RequestPostAjax('base_search', 'searchdict', {dictcode: dictCode})
            .then(function (dictHead) {
                if (!dictOption.isStr) {
                    dictHead.dicts.forEach(function (dict) {
                        dict.value = parseInt(dict.value);
                    });
                }
                $scope.dictPool[dictCode] = dictHead.dicts;
            });
    });

    //定义网格字段wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
    $scope.headerColumns = [
        {
            id: "seq",
            headerName: "序号",
            field: "seq",
            width: 65
        },
        {
            headerName: "操作", field: "", editable: false, filter: 'set', width: 58,
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            pinned: 'right',
        }
        , {id: "terminal_apply_no", headerName: "申请单号", field: "terminal_apply_no", width: 140, type: "string"}
        , {id: "create_time", headerName: "制单日期", field: "create_time", width: 140, type: "string", cellEditor: "年月日"},
        {id: "chap_name", headerName: "申请人姓名", field: "chap_name", width: 140, type: "string"},
        {id: "chap_tel", headerName: "申请人电话", field: "chap_tel", width: 140, type: "string"},
        {id: "", headerName: "所属运营中心", field: "", width: 140, type: "string"},
        {id: "receiver_name", headerName: "收件人姓名", field: "receiver_name", width: 140, type: "string"}
        , {id: "receiver_tel", headerName: "收件人电话", field: "receiver_tel", width: 140, type: "string"}
    ];

    //网格设置
    $scope.headerOptions = {
        columnDefs: $scope.headerColumns,
        rowDoubleClicked: showDetail,
        rowClicked: dgOnClick
    };

    //定义明细列属性
    $scope.lineColumns = [
        {
            id: "seq",
            headerName: "序号",
            field: "seq",
            width: 65
        },
        {
            headerName: "操作",
            editable: false,
            width: 60,
        }
        , {id: "cust_code", headerName: "经销商编号", field: "cust_code", width: 140, type: "string", editable: true}
        , {id: "cust_name", headerName: "经销商姓名", field: "cust_name", width: 140, type: "string", editable: true},
        {id: "dept_name", headerName: "公司名称", field: "dept_name", width: 140, type: "string", editable: true},
        {id: "", headerName: "营业执照地址", field: "", width: 140, type: "string", editable: true},
        {id: "", headerName: "经销商性质", field: "", width: 140, type: "string", editable: true},
        {id: "cust_area", headerName: "授权经营区域", field: "cust_area", width: 140, type: "string", editable: true}
        , {id: "terminal_code", headerName: "网点编号", field: "terminal_code", width: 140, type: "string", editable: true}
        , {
            id: "crm_terminal_code",
            headerName: "终端代码",
            field: "crm_terminal_code",
            width: 110,
            type: "string",
            editable: true
        }
        , {
            id: "crm_terminal_type",
            headerName: "终端类别",
            field: "crm_terminal_type",
            width: 110,
            type: "string",
            editable: true
        }
        // , {
        //     id: "crm_terminal_type",
        //     headerName: "终端类别",
        //     field: "crm_terminal_type",
        //     width: 110,
        // }
        // , {
        //     id: "terminal_kind",
        //     headerName: "网点类别",
        //     field: "terminal_kind",
        //     width: 110,
        // }
        , {id: "terminal_name", headerName: "店面名称", field: "terminal_name", width: 140, type: "string", editable: true}
        , {id: "addr", headerName: "店面地址", field: "addr", width: 110, type: "string", editable: true}
        , {
            id: "grade_market",
            headerName: "分级市场",
            field: "grade_market",
            width: 110,
            editable: true
        }, {
            id: "note",
            headerName: "备注",
            field: "note",
            width: 110,
            editable: true
        }
    ]

    //网格设置
    $scope.lineOptions = {
        columnDefs: $scope.lineColumns
    };

    //定义网格字段 - 附件
    $scope.attachColumns = [
        {
            id: "seq",
            name: "序号",
            field: "seq",
            width: 65
        },
        {
            name: "操作",
            editable: false,
            width: 120,
            // formatter: lineButtons
        }
        , {id: "atta_code", name: "附件名", field: "atta_code", width: 240, type: "string"}
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

    //网格初始化
    AgGridService.createAgGrid("#headerGridView", $scope.headerOptions)
    //网格初始化
    AgGridService.createAgGrid("#lineGridView", $scope.lineOptions)

    //主表清单绑定点击事件


    /**
     * 明细网格点击事件
     */
    function dgLineClick(e, args) {
        if ($(e.target).hasClass("btn")) {
            $scope.delLineRow(args);
            e.stopImmediatePropagation();
        }
    };

    /**
     *添加明细网格行
     */
    $scope.addLineRow = function () {
        $scope.gridAddLine('lineOptions', $scope.data.currItem.mkt_terminal_apply_lineofmkt_terminal_applys)
    };

    // //细表-绑定点击事件mkt_terminal_ADDRESS_TEMP
    // $scope.lineGridView.onClick.subscribe(ldgOnClick);

    /**
     * 事件判断
     */
    function dgOnClick(e, args) {
        if ($(e.target).hasClass("viewbtn")) {
            edit(args);
            e.stopImmediatePropagation();
        }
        //点击删除按钮处理事件
        else if ($(e.target).hasClass("delbtn")) {
            del(args);
            e.stopImmediatePropagation();
        }
    };

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
     * 加载工作区
     */
    function searchData  (postdata) {
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
        postdata.flag = 99;
        BasemanService.RequestPost("mkt_terminal_manager", "search", postdata).then(function (data) {
            $scope.gridSetData('headerOptions', data.mkt_terminal_managers)
            BaseService.pageInfoOp($scope, data.pagination);
        });
    }
    $scope.searchData = searchData;
    /**
     * 刷新
     */
    $scope.refresh = function () {
        $scope.data.searchItem = {};
        $scope.searchData();
    }


    /**
     * 增加
     */
    function addData() {
        return showDetail(0);
    }
    $scope.addData = addData
    /**
     * 编辑
     */
    function showDetail(id) {
        BasemanService.openModal({
            url: '/index.jsp#/mktman/mkt_terminal_manager_pro/' + id,
            title: '网点授权管理详情',
            obj: $scope,
            // ondestroy: $scope.searchData
        });
    };

    /**
     * 保存
     */
    $scope.save = function () {
        if ($scope.lineGridView.getCellEditor() != undefined) {
            $scope.lineGridView.getCellEditor().commitChanges();
        }
        if (!FormValidatorService.validatorFrom($scope, "#entityForm")) {
            return;
        } else {
            if ($scope.data.currItem.terminal_id > 0) {
                BasemanService.RequestPost("mkt_terminal_manager", "update", JSON.stringify($scope.data.currItem))
                    .then(function (data) {
                        $scope.searchData();
                        BasemanService.swalSuccess("成功", "保存成功！");
                        $("#attributeModal").modal("hide");
                    });
            } else {
                BasemanService.RequestPost("mkt_terminal_manager", "insert", JSON.stringify($scope.data.currItem))
                    .then(function (data) {
                        $scope.searchData();
                        BasemanService.swalSuccess("成功", "保存成功！");
                        $("#attributeModal").modal("hide");
                    });
            }
        }

    };

    /**
     * 删除
     */
    function del(args) {
        var dg = $scope.headerGridView;
        var rowidx = args.row;
        var postData = {};
        postData.mkt_terminal_id = args.grid.getDataItem(args.row).mkt_terminal_id;
        var name = args.grid.getDataItem(args.row).mkt_terminal_name;
        BasemanService.swalDelete("删除", "确定要删除 " + name + " 吗？", function (bool) {
            if (bool) {
                BasemanService.RequestPost("mkt_terminal_manager", "delete", JSON.stringify(postData))
                    .then(function (data) {
                        dg.getData().splice(rowidx, 1);
                        dg.invalidateAllRows();
                        dg.render();
                        BasemanService.swalSuccess("成功", "保存成功！");
                    });
            } else {
                return;
            }
        });
    };

    /**
     * 删除 - 明细
     */
    function delLine(args) {
        var dg = $scope.lineGridView;
        var rowidx = args.row;
        BasemanService.swalDelete("删除", "确定要删除吗？", function (bool) {
            if (bool) {
                dg.getData().splice(rowidx, 1);
                dg.invalidateAllRows();
                dg.render();
                lineMaxSeq = lineMaxSeq - 1;
            } else {
                return;
            }
        });
    };

    /**
     * 查询方法
     */
    $scope.searchBySql = function () {
        $scope.FrmInfo = {
            title: "",
            thead: [],
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "mkt_terminal_manager",
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
        sessionStorage.setItem("frmInfo", str);
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
     * 通用查询 - 销售价格类型
     */
    $scope.searchSpt = function () {
        $scope.FrmInfo = {
            title: "销售价格类型查询",
            thead: [{
                name: "销售价格类型编码",
                code: "saleprice_type_code"
            }, {
                name: "销售价格类型名称",
                code: "saleprice_type_name"
            }],
            classid: "sa_saleprice_type",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "sa_saleprice_types",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: 300
            },
            searchlist: ["saleprice_type_code", "saleprice_type_name"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.sa_saleprice_type_id = result.sa_saleprice_type_id;
            $scope.data.currItem.saleprice_type_name = result.saleprice_type_name;
            $scope.data.currItem.saleprice_type_code = result.saleprice_type_code;
        })
    }


    //复选框选择
    $scope.check_is_groupmkt_terminal = function (e) {
        var checkTarget = e.target;
        if (checkTarget.checked) {
            $scope.data.currItem.is_groupmkt_terminal = 2;
        } else {
            $scope.data.currItem.is_groupmkt_terminal = 1;
        }
    };
    $scope.check_is_relation = function (e) {
        var checkTarget = e.target;
        if (checkTarget.checked) {
            $scope.data.currItem.is_relation = 2;
        } else {
            $scope.data.currItem.is_relation = 1;
        }
    };
    $scope.check_usable = function (e) {
        var checkTarget = e.target;
        if (checkTarget.checked) {
            $scope.data.currItem.usable = 2;
        } else {
            $scope.data.currItem.usable = 1;
        }
    };
    $scope.check_crebit_ctrl = function (e) {
        var checkTarget = e.target;
        if (checkTarget.checked) {
            $scope.data.currItem.crebit_ctrl = 2;
        } else {
            $scope.data.currItem.crebit_ctrl = 1;
        }
    };

    //检查必填项是否为空 dept_code
    $scope.checkNull = function () {
        /*  if (typeof ($scope.data.currItem.short_name) == "undefined" || $scope.data.currItem.short_name == null) {
         swal("提示!", "请填写简称!");
         return true;
         }*/
        if (typeof ($scope.data.currItem.mkt_terminal_name) == "undefined" || $scope.data.currItem.mkt_terminal_name == null) {
            swal("提示!", "请填写客户名称!");
            return true;
        }
        if (typeof ($scope.data.currItem.dept_code) == "undefined" || $scope.data.currItem.dept_code == null) {
            swal("提示!", "请选择部门!");
            return true;
        }
        return false;
    }


    /**
     * 流程url
     * @param {} args
     */
    function wfSrc(args) {
        //默认值
        var urlParams = {
            wftempid: '',
            wfid: $scope.data.currItem.wfid,
            objtypeid: $scope.data.objtypeid,
            objid: $scope.data.currItem.sa_saleprice_head_id,
            submit: $scope.data.bSubmit
        }

        //传入值覆盖默认值
        if (angular.isObject(args))
            angular.extend(urlParams, args);

        //0转为""
        angular.forEach(urlParams, function (value, key, obj) {
            if (value == 0)
                obj[key] = '';
        });

        return '/web/index.jsp'
            + '?t=' + randomNum               //随机数，请求唯一标识，加上这个Google浏览器才会发出请求
            + '#/crmman/wfins'
            + '/' + urlParams.wftempid        //流程模板ID
            + '/' + urlParams.wfid            //流程实例ID
            + '/' + urlParams.objtypeid       //对象类型ID
            + '/' + urlParams.objid           //对象ID
            + '/' + (urlParams.submit ? 1 : 0) //是否提交流程
            + '?showmode=2';
    }

    /**
     * 流程实例初始化
     */
    $scope.initWfIns = function (bSubmit) {
        HczyCommon.stringPropToNum($scope.data.currItem);
        //制单后才显示流程
        if ($scope.data.currItem.sa_saleprice_head_id && $scope.data.currItem.sa_saleprice_head_id > 0) {
            if ($scope.data.currItem.wfid && $scope.data.currItem.wfid > 0) {
                var theSrc = wfSrc();
                var theElement = angular.element('#wfinspage');

                if (theElement.attr('src') !== theSrc) {
                    theElement.attr('src', theSrc);
                }
            } else if ($scope.data.currItem.stat == 1) {
                $scope.data.bSubmit = bSubmit;
                $scope.getWfTempId($scope.data.objtypeid);
            }
        }
    }


    $scope.onTabChange = function (e) {
        // 获取已激活的标签页的名称
        var tabId = e.target.id;
        if ('towfins' == tabId) {
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
                            //用正则表达式替换变量
                            var regexp = new RegExp("<item>", "gm");
                            var sexeccond = data.objwftempofobjconfs[i].execcond.replace(regexp, "$scope.data.currItem");
                            //运行表达式 不符合条件的移除
                            if (!eval(sexeccond)) {
                                data.objwftempofobjconfs.splice(i, 1);
                            }
                        }
                    }

                    if (data.objwftempofobjconfs && data.objwftempofobjconfs.length > 1) {
                        $scope.data.wftemps = data.objwftempofobjconfs;
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
     * 选择流程模版ID
     * @param wftempid
     */
    $scope.selectWfTemp = function (wftempid) {
        $("#selectWfTempModal").modal("hide");
        angular
            .element('#wfinspage')
            .attr('src', wfSrc({
                wftempid: wftempid
            }));
        $scope.data.bSubmit = false;
    }

    //modal显示时绑定切换事件
    $('#detailtab').on('shown.bs.tab', $scope.onTabChange);

    /**
     * 通用查询
     */
    $scope.searchEmployee = function () {
        $scope.FrmInfo = {
            title: "员工查询",
            thead: [{
                name: "员工编码",
                code: "employee_code"
            }, {
                name: "员工名称",
                code: "employee_name"
            }],
            classid: "erpemployee",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "erpemployees",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: 300
            },
            searchlist: ["employee_code", "employee_name"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.chap_id = result.employee_id;
            $scope.data.currItem.chap_code = result.employee_code;
            $scope.data.currItem.chap_name = result.employee_name;
        })
    };

    //网格高度自适应
    BasemanService.initGird();

    // BasemanService.ReadonlyGrid($scope.headerGridView);
    //初始化分页
    BaseService.pageGridInit($scope);

}

//注册控制器
angular.module('inspinia')
    .controller('mkt_terminal_manager', mkt_terminal_manager)