/**
 * 网点授权(详情页)
 * @since 2018-08-02
 */
function mkt_terminal_manager_pro($scope, BaseService, $filter, $location, $rootScope, $modal, $timeout,
                                  BasemanService, notify, $state, localeStorageService, FormValidatorService, $stateParams, AgGridService, Magic, $q, WfService) {
    console.log('控制器开始：mkt_terminal_manager_pro');
    console.log('$scope = ');
    console.log($scope);

    /*--------------------------数据定义--------------开始--------*/
    mkt_terminal_manager_pro = HczyCommon.extend(mkt_terminal_manager_pro, ctrl_bill_public);
    mkt_terminal_manager_pro.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, AgGridService]);
    $scope.userbean = userbean;
    $scope.data = {"objtypeid": 180814, "objid": $stateParams.id, wftemps: [], bSubmit: false, canmodify: true}
    $scope.data.currItem = {objattachs: [], terminal_apply_id: $stateParams.id};

    /**
     * 当前业务对象
     * @return {Object}
     */
    function currItem() {
        return $scope.data.currItem;
    }

    /**
     *系统词汇池
     */
    $scope.dictPool = {
        // 'auth_type': {},
        'business_scope': {},
        'dealer_property': {},
        'stat': {},
        'crm_terminal_type': {},
        'grade_market': {},
        "terminal_kind": {}
    }

    var randomNum = (new Date()).getTime();
    /*--------------------------数据定义--------------结束--------*/


    //定义明细列属性
    $scope.lineColumns = [
        {
            type: "序号",
            checkboxSelection: true,
            headerCheckboxSelection: true
        },
        // {
        //     id: "auth_type",
        //     headerName: "渠道类型",
        //     field: "auth_type",
        //     hcDictCode: "dot_channel_type",
        //     width: 110,
        //     type: '词汇',
        //     editable: initBillRight,
        //     cellEditorParams: {
        //         values: []
        //     }
        // },
        {
            id: "crm_brand",
            headerName: "品牌",
            field: "crm_brand",
            hcDictCode: "crm_brand",
            width: 110,
            type: '词汇',
            editable: initBillRight,
            cellEditorParams: {
                values: []
            }
        }, {
            id: "terminal_code",
            headerName: "网点编号",
            field: "terminal_code",
            width: 155,
            type: "string",
            editable: initBillRight,
            cellStyle: function (params) {
                console.log('cellStyle.item_code:', params);
                var style = $scope.lineOptions.hcApi.getDefaultCellStyle(params);
                return style;
            },
            onCellDoubleClicked: function (args) {
                if (!initBillRight())
                    return;
                if (HczyCommon.isNull($scope.data.currItem.dept_id)) {

                    return Magic.swalInfo("请先选择运营中心");
                }
                var arr = $scope.data.currItem.mkt_terminal_manager_lineofmkt_terminal_managers;
                var row = args.rowIndex;
                $scope.lineOptions.api.stopEditing();
                $scope.FrmInfo = {
                    title: "网点查询",
                    thead: [
                        {
                            name: "网点编码",
                            code: "terminal_code"
                        },
                        {
                            name: "店面名称",
                            code: "terminal_name"
                        },
                        {
                            name: "经销商编码",
                            code: "cust_code"
                        },
                        {
                            name: "经销商名称",
                            code: "cust_name"
                        }],
                    classid: "mkt_terminal",
                    url: "/jsp/req.jsp",
                    sqlBlock: "",
                    backdatas: "mkt_terminals",
                    ignorecase: "true", //忽略大小写
                    postdata: {
                        flag: 99,
                        search_flag: 1,
                        sqlwhere: " dept_id =" + $scope.data.currItem.dept_id
                    },
                    searchlist: ["terminal_code", "terminal_name", "cust_code", "cust_name"]
                };

                BasemanService.open(CommonPopController, $scope).result
                    .then(function (item) {
                        $scope.customer_id = item.cust_id;
                        arr[row] = item;
                        arr[row].crm_brand = args.data.crm_brand;
                        arr[row].branch_address = item.addr;
                        arr[row].branch_propertys = item.branch_propertys;

                    })
                    .then(function () {
                        return BasemanService.RequestPost('customer_org', 'select', {'customer_id': $scope.customer_id})
                    })
                    .then(function (item) {
                        arr[row].cust_code = item.customer_code;
                        arr[row].cust_name = item.customer_name;
                        arr[row].customer_org_id = item.customer_org_id;
                        arr[row].customer_id = item.customer_id;
                        arr[row].dealer_property = item.dealer_property;
                        arr[row].cust_area = item.authorize_area;
                        arr[row].dept_name = item.dept_name;
                        arr[row].business_address = item.business_address;
                        $scope.lineOptions.api.setRowData($scope.data.currItem.mkt_terminal_manager_lineofmkt_terminal_managers)
                    })
            }
        },
        {
            id: "terminal_name",
            headerName: "店面名称",
            field: "terminal_name",
            width: 110,
            type: "string",
            editable: initBillRight
        }
        , {
            id: "terminal_kind",
            headerName: "网点类别",
            field: "terminal_kind",
            width: 110,
            hcDictCode: "terminal_kind",
            type: "词汇",
            cellEditorParams: {
                values: []
            }
        }, {
            headerName: "店面性质",
            field: "branch_propertys",
            hcDictCode: "branch_property",
            type: "多选",
            width: 200
        }
        , {
            id: "cust_code",
            headerName: "经销商编码",
            field: "cust_code",
            width: 140,
            cellStyle: function (params) {
                console.log('cellStyle.item_code:', params);
                var style = $scope.lineOptions.hcApi.getDefaultCellStyle(params);
                return style;
            }
        }, {
            id: "cust_name",
            headerName: "经销商名称",
            field: "cust_name",
            width: 140,
            type: "string",
            editable: function () {
                return $scope.data.canmodify;
            }
        }, {
            id: "dealer_property",
            headerName: "经销商性质",
            field: "dealer_property",
            hcDictCode: "dealer_property",
            width: 140,
            type: "词汇",
            editable: true,
            cellEditorParams: {
                values: []
            },
        },
        // {
        //     id: "dept_name",
        //     headerName: "公司名称",
        //     field: "dept_name",
        //     width: 140,
        //     type: "string",
        //     editable: true
        // },
        {
            id: "business_address",
            headerName: "营业执照地址",
            field: "business_address",
            width: 140,
            type: "string",
            editable: initBillRight
        },
        {
            id: "cust_area",
            headerName: "授权经营区域",
            field: "cust_area",
            width: 140,
            type: "string",
            editable: initBillRight
        }
        , {
            id: "branch_address",
            headerName: "店面地址",
            field: "branch_address",
            width: 110,
            type: "string",
        }
        , {
            id: "grade_market",
            headerName: "分级市场",
            field: "grade_market",
            hcDictCode: "grade_market",
            type: "词汇",
            width: 110,
        },
        {
            id: "authority_code",
            headerName: "授权编码",
            field: "authority_code",
            width: 110,
        }, {
            id: "note",
            headerName: "备注",
            field: "note",
            width: 360,
            editable: initBillRight
        }
    ]

    //网格设置
    $scope.lineOptions = {
        columnDefs: $scope.lineColumns,
        rowSelection: "multiple",
        rowMultiSelectWithClick: true,
        cellRendererParams: {
            checkbox: true
        }
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

    //网格初始化
    AgGridService.createAgGrid("#lineGridView", $scope.lineOptions)


    /**------------加载词汇 ----------**/

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
                $scope.dictPool[dictCode] = HczyCommon.stringPropToNum(dictHead.dicts);

            });
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

    /**------------------- -------------点击事件--------/
     */

    //删除明细
    function delLineData(o) {
        var flag = 0;//是否空行
        var idx = $scope.lineOptions.api.getFocusedCell().rowIndex;

        var lines = $scope.gridGetData('lineOptions');
        var agentid = lines[idx].agentid;
        var wftempid = lines[idx].wftempid;

        if (!agentid || !wftempid) {
            flag = 1;
        }

        if (flag == 1) {
            $scope.gridDelItem('lineOptions');
        } else { //非空行先询问
            BasemanService.swalDelete("删除", "确定删除？", function (bool) {
                if (bool) {
                    $scope.gridDelItem('lineOptions');
                } else {
                    return;
                }
            })
        }
    }

    $scope.delLineData = delLineData

    /**
     *添加明细网格行
     */
    $scope.addLine = function () {
        swal({
            title: '请输入要增加的行数',
            type: 'input', //类型为输入框
            inputValue: 1, //输入框默认值
            closeOnConfirm: false, //点击确认不关闭，由后续代码判断是否关闭
            showCancelButton: true //显示【取消】按钮
        }, function (inputValue) {
            if (inputValue === false) {
                swal.close();
                return;
            }

            var rowCount = Magic.toNum(inputValue);
            if (rowCount <= 0) {
                swal.showInputError('请输入有效的行数');
                return;
            }
            else if (rowCount > 1000) {
                swal.showInputError('请勿输入过大的行数(1000以内为宜)');
                return;
            }

            swal.close();

            var data = $scope.gridGetData("lineOptions");
            $scope.data.currItem.mkt_terminal_manager_lineofmkt_terminal_managers = data;

            for (var i = 0; i < rowCount; i++) {
                var newLine = {};
                $scope
                    .lineColumns
                    .forEach(function (column) {
                        newLine[column.field] = '';
                    });
                $scope.data.currItem.mkt_terminal_manager_lineofmkt_terminal_managers.push(newLine);
            }

            $scope.lineOptions.hcApi.setRowData($scope.data.currItem.mkt_terminal_manager_lineofmkt_terminal_managers);
            $scope.lineOptions.hcApi.setFocusedCell($scope.data.currItem.mkt_terminal_manager_lineofmkt_terminal_managers.length - rowCount, 'cust_code');
        });
    };

    $scope.delLine = function () {
        var selections = $scope.lineOptions.api.getRangeSelections();
        if (selections.length === 1) {
            var oldIndex = selections[0].start.rowIndex;
            var delCount = selections[0].end.rowIndex - oldIndex + 1;
            var field = selections[0].columns[0].colDef.field;
            var data = $scope.data.currItem.mkt_terminal_manager_lineofmkt_terminal_managers;
            data.splice(oldIndex, delCount);
            $scope.lineOptions.hcApi.setRowData(data);
            if (data.length) {
                var newIndex;
                if (oldIndex < data.length) {
                    newIndex = oldIndex;
                }
                else {
                    newIndex = data.length - 1;
                }
                $scope.lineOptions.hcApi.setFocusedCell(newIndex, field);
            }
        }
    };

    /**
     * 关闭窗体
     */
    $scope.closeWindow = function () {
        // isEdit = 0;
        // if (window.parent != window) {
        //     BasemanService.closeModal();
        // } else {
        //     window.close();
        // }
        localeStorageService.closeCurrtab()
    }

    /***--------增删改查方法 -------**/
    function save(bsubmit) {
        $q.when()
            .then(checkData)//校验数据
            .then(function () {
                $scope.lineOptions.api.stopEditing();
                var action = "insert";
                if ($scope.data.currItem.terminal_apply_id > 0) {
                    action = "update"
                }
                return BasemanService.RequestPost("mkt_terminal_manager", action, $scope.data.currItem);
            })
            .then(
                function (result) {
                    if (result.terminal_apply_id) {
                        result = HczyCommon.stringPropToNum(result);
                        currItem().terminal_apply_id = result.terminal_apply_id;
                        BasemanService.swalSuccess("成功", "保存成功!");
                        //重绘网格
                        if (bsubmit) {
                            $('#detailtab a:last').tab('show');
                            if (angular.element('#wfinspage').length == 0) {
                                $("#wfinsform").append("<iframe id='wfinspage' style='width: 100%;height: 100%;background-color: #e2e5ec;'></iframe>");
                            }
                            $scope.initWfIns(true);
                        }

                        init();

                    }
                })
    }

    $scope.save = save;


    /**
     * 检查空值
     */
    function checkData() {
        $scope.lineOptions.api.stopEditing();

        if (!FormValidatorService.validatorFrom($scope, "#entityForm")) {
            return $q.reject();
        }

        /**
         * 明细的空值字段信息
         * @return {string[]}
         */
        function fundEmptyMsg() {
            //缓存函数执行结果，使函数只执行一次
            if (fundEmptyMsg.msg)
                return fundEmptyMsg.msg;

            fundEmptyMsg.msg = [];

            // if (!HczyCommon.isNotNull($scope.data.currItem.grade_market)) {
            //     fundEmptyMsg.msg.push("分级市场")
            // }
            currItem().mkt_terminal_manager_lineofmkt_terminal_managers.forEach(function (mkt_terminal_manager_lineofmkt_terminal_managers, index) {
                var msgOfOneRow = '';

                /**
                 * 增加空值字段信息
                 * @param {string} fieldCaption 空值字段中文名
                 */
                function addEmptyFieldMsg(fieldCaption) {
                    if (msgOfOneRow)
                        msgOfOneRow += '、';
                    else
                        msgOfOneRow += '第' + (index + 1) + '行的';

                    msgOfOneRow += fieldCaption;
                };

                if (HczyCommon.isNull(mkt_terminal_manager_lineofmkt_terminal_managers.crm_brand)) {
                    addEmptyFieldMsg('品牌');
                }

                if (HczyCommon.isNull(mkt_terminal_manager_lineofmkt_terminal_managers.terminal_code)) {
                    addEmptyFieldMsg('网点编号');
                }
                if (HczyCommon.isNull(mkt_terminal_manager_lineofmkt_terminal_managers.terminal_name)) {
                    addEmptyFieldMsg('店面名称');
                }
                if (HczyCommon.isNull(mkt_terminal_manager_lineofmkt_terminal_managers.terminal_kind)) {
                    addEmptyFieldMsg('网点类别');
                }

                if (HczyCommon.isNull(mkt_terminal_manager_lineofmkt_terminal_managers.cust_code)) {
                    addEmptyFieldMsg('经销商编码');
                }
                if (HczyCommon.isNull(mkt_terminal_manager_lineofmkt_terminal_managers.cust_name)) {
                    addEmptyFieldMsg('经销商名称');
                }
                if (HczyCommon.isNull(mkt_terminal_manager_lineofmkt_terminal_managers.dealer_property)) {
                    addEmptyFieldMsg('经销商性质');
                }
                if (HczyCommon.isNull(mkt_terminal_manager_lineofmkt_terminal_managers.dept_name)) {
                    addEmptyFieldMsg('公司名称');
                }
                if (HczyCommon.isNull(mkt_terminal_manager_lineofmkt_terminal_managers.business_address)) {
                    addEmptyFieldMsg('营业执照地址');
                }
                if (HczyCommon.isNull(mkt_terminal_manager_lineofmkt_terminal_managers.cust_area)) {
                    addEmptyFieldMsg('授权经营区域');
                }
                if (HczyCommon.isNull(mkt_terminal_manager_lineofmkt_terminal_managers.branch_address)) {
                    addEmptyFieldMsg('店面地址');
                }
                if (HczyCommon.isNull(mkt_terminal_manager_lineofmkt_terminal_managers.grade_market)) {
                    addEmptyFieldMsg('分级市场');
                }
                if (msgOfOneRow) fundEmptyMsg.msg.push(msgOfOneRow);
            });

            return fundEmptyMsg.msg;
        }


        if (fundEmptyMsg().length)
            return FormValidatorService
                .noEmptyAlert(fundEmptyMsg())
                .then($q.reject)
                ;
    }

    /** ------------------通用查询方法 -------------------**/
    /**
     * 查询经销商资料
     */
    function searchFranchiserInfo() {
        $scope.FrmInfo = {
            title: "经销商资料",
            thead: [{
                name: "经销商编号",
                code: "customer_code"
            }, {
                name: "经销商名称",
                code: "customer_name"
            }, {
                name: "经销商姓名",
                code: "manager"
            }],
            classid: "mkt_franchiser_info_head",
            url: "/jsp/req.jsp",
            sqlBlock: "",
            backdatas: "mkt_franchiser_info_heads",
            ignorecase: "true", //忽略大小写
            postdata: {},
            searchlist: ["customer_code", "customer_name", "manager"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            var data = $scope.gridGetRow("lineOptions");
            data.customer_code = result.customer_code;
            data.customer_name = result.customer_name;
            data.manager = result.manager;
            $scope.gridUpdateRow("lineOptions", data);
        });
    }

    /**
     * 通用查询 - 销售业务员
     */
    $scope.searchEmployee = function (searchtext) {
        $scope.FrmInfo = {
            title: "销售业务员查询",
            thead: [{
                name: "销售业务员编码",
                code: "sale_employee_code"
            }, {
                name: "销售业务员名称",
                code: "sale_employee_name"
            }],
            classid: "base_view_sale_employee",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "base_view_sale_employees",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: 300
            },
            searchlist: ["sale_employee_code", "sale_employee_name"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            if (searchtext == 'receiver') {
                $scope.data.currItem.receiver_id = result.sale_employee_id;
                $scope.data.currItem.receiver_code = result.sale_employee_code;
                $scope.data.currItem.receiver_name = result.sale_employee_name;
            } else {
                $scope.data.currItem.chap_id = result.sale_employee_id;
                $scope.data.currItem.chap_code = result.sale_employee_code;
                $scope.data.currItem.chap_name = result.sale_employee_name;
            }
        })
    }


    /**
     * 选择地区
     */
    $scope.searchArea = searchArea;

    function searchArea(areatype) {
        var title = "";
        var superid = 0;
        if (4 == areatype) {
            superid = 1;
            title = "选择省份"
        }
        if (5 == areatype) {
            superid = $scope.data.currItem.province_areaid;
            title = "选择城市"
        }
        if (6 == areatype) {
            superid = $scope.data.currItem.city_areaid;
            title = "选择区县"
        }
        if (("undefined" == typeof(superid) || 0 == superid) && 4 != areatype) {
            BasemanService.swalWarning("提示", "请先选择上级地区");
            return;
        }
        BasemanService.chooseArea({
            scope: $scope,
            title: title,
            areatype: areatype,
            superid: superid,
            then: function (data) {
                if (4 == areatype) {
                    $scope.data.currItem.province_areaid = data.areaid;
                    $scope.data.currItem.province_areacode = data.areacode;
                    $scope.data.currItem.province_areaname = data.areaname;

                    $scope.data.currItem.city_areaid = 0;
                    $scope.data.currItem.city_areacode = "";
                    $scope.data.currItem.city_areaname = "";

                    $scope.data.currItem.county_areaid = 0;
                    $scope.data.currItem.county_areacode = "";
                    $scope.data.currItem.county_areaname = "";
                }
                if (5 == areatype) {
                    $scope.data.currItem.city_areaid = data.areaid;
                    $scope.data.currItem.city_areacode = data.areacode;
                    $scope.data.currItem.city_areaname = data.areaname;

                    $scope.data.currItem.county_areaid = 0;
                    $scope.data.currItem.county_areacode = "";
                    $scope.data.currItem.county_areaname = "";
                }
                if (6 == areatype) {
                    $scope.data.currItem.county_areaid = data.areaid;
                    $scope.data.currItem.county_areacode = data.areacode;
                    $scope.data.currItem.county_areaname = data.areaname;
                }
            }
        });
    }

    /**
     * 查询运营中心
     */
    $scope.searchDept = searchDept

    function searchDept() {
        $scope.FrmInfo = {
            title: "运营中心",
            thead: [{
                name: "运营中心编号",
                code: "dept_code"
            }, {
                name: "运营中心名称",
                code: "dept_name"
            }],
            classid: "dept",
            url: "/jsp/req.jsp",
            sqlBlock: "",
            backdatas: "depts",
            ignorecase: "true", //忽略大小写
            postdata: {},
            searchlist: ["dept_code", "dept_name"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.dept_id = result.dept_id
            $scope.data.currItem.dept_code = result.dept_code
            $scope.data.currItem.dept_name = result.dept_name
        });
    }

    /**
     * 通用查询 - 销售区域
     */
    $scope.searchSaleArea = function () {
        $scope.FrmInfo = {
            title: "销售区域查询",
            thead: [{
                name: "销售区域编码",
                code: "sale_area_code"
            }, {
                name: "销售区域名称",
                code: "sale_area_name"
            }],
            classid: "sale_salearea",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "sale_saleareas",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: 300
            },
            searchlist: ["sale_area_code", "sale_area_name"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.sale_area_code = result.sale_area_code;
            $scope.data.currItem.sale_area_name = result.sale_area_name;
        })
    }

    /**
     * 通用查询 - 总公司
     */
    $scope.searchGroupmkt_terminal = function () {
        $scope.FrmInfo = {
            title: "客户查询",
            thead: [{
                name: "客户编码",
                code: "mkt_terminal_code"
            }, {
                name: "客户名称",
                code: "mkt_terminal_name"
            }],
            classid: "mkt_terminal",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "nvl(Is_Groupmkt_terminal,0)=2",
            backdatas: "mkt_terminals",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: 300
            },
            searchlist: ["mkt_terminal_code", "mkt_terminal_name"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.group_mkt_terminal_id = result.mkt_terminal_id;
            $scope.data.currItem.group_mkt_terminal_code = result.mkt_terminal_code;
            $scope.data.currItem.group_mkt_terminal_name = result.mkt_terminal_name;
        })
    }

    /** --------初始化数据 -------------------**/
    function init() {
        if ($scope.data.currItem.terminal_apply_id > 0) {
            BasemanService.RequestPost("mkt_terminal_manager", "select", $scope.data.currItem).then(
                function (result) {
                    result = HczyCommon.stringPropToNum(result);
                    setData(result)
                    initBillRight()
                })
        } else {
            IncRequestCount()
            DecRequestCount()
            $scope.data.currItem = {
                "create_time": moment().format('YYYY-MM-DD HH:mm:ss'),
                "stat": 1,
                "chap_name": strUserName,
                "chap_code": strUserId,
                "mkt_terminal_manager_lineofmkt_terminal_managers": [],
                "objattachs": [],
            };

            //带出运营中心
            BasemanService.RequestPost("dept", "select", {dept_id: UserOrgId})
                .then(function (value) {
                    angular.extend(currItem(), {
                        "dept_id": value.dept_id,
                        "dept_code": value.dept_code,
                        "dept_name": value.dept_name,
                    })
                })
            $scope.data.currItem.usable = 2;
            $scope.gridSetData('lineOptions', $scope.data.currItem.mkt_terminal_manager_lineofmkt_terminal_managers)
            lineMaxSeq = 0;
        }
    }

    $scope.init = init

    /**
     * 初始化单据权限
     */
    function initBillRight() {
        $scope.data.currItem.stat = parseInt($scope.data.currItem.stat);
        if ($scope.data.currItem.stat < 2 && (HczyCommon.isNull($scope.data.currItem.wfid) || parseInt($scope.data.currItem.wfid) == 0)) {
            $scope.data.canmodify = true;
        } else if ($scope.data.currItem.stat > 1 && $scope.data.currItem.stat < 5) {
            $scope.data.canmodify = $scope.data.currItem.wfright > 1;
        } else {
            $scope.data.canmodify = false;
        }
        return $scope.data.canmodify
    }


    /**
     * 设置数据
     * @param data
     */
    function setData(data) {
        $scope.data.currItem = data;

        $scope.data.objid = data.terminal_apply_id
        //附件
        attachGridOptions.hcApi.setRowData(data.objattachs);
        $scope.lineOptions.hcApi.setRowData(data.mkt_terminal_manager_lineofmkt_terminal_managers)
    }


    /**-----------------流程实例化 ------------**/

    WfService.initWf($scope);
    $scope.onTabChange = function (e) {
        // 获取已激活的标签页的名称
        // var tabName = $(e.target).text();
        // if ('审批流程' == tabName) {
        var tabName = $(e.target).text();
        if (' 审核流程' == tabName) {
            if (angular.element('#wfinspage').length == 0) {
                $("#wfinsform").append("<iframe id='wfinspage' style='width: 100%;height: 100%;background-color: #e2e5ec;'></iframe>");
            }
            $scope.initWfIns();
        }
        if (' 附件' == tabName) {
            attachGridOptions.api.sizeColumnsToFit();
        }
    }

    //modal显示时绑定切换事件
    $('#detailtab').on('shown.bs.tab', $scope.onTabChange);


    /** ---------------------------------附件服务------------------ **/
    /* ==============================附件表格 - 开始============================== */
    var attachGridColumnDefs = [{
        type: '序号'
    }, {
        field: 'docname',
        headerName: '附件名称',
        width: 500,
        pinned: "left"
    }];

    var attachGridOptions = {
        columnDefs: attachGridColumnDefs,
        hcEvents: {
            cellDoubleClicked: function (params) {
                console.log('cellDoubleClicked', params.colDef.field, params);

                var lowerDocName = params.data.docname.toLowerCase();

                var isPicture = ['.jpg', '.jpeg', '.png', '.bmp'].some(function (suffix) {
                    return lowerDocName.endsWith(suffix);
                });

                if (isPicture)
                    btnViewAttachClick();
                else
                    btnDownloadAttachClick();
            }
        }
    };

    AgGridService.createAgGrid('grid_attach', attachGridOptions);

    $scope.btnUploadAttachClick = btnUploadAttachClick;

    /**
     * 上传附件
     */
    function btnUploadAttachClick() {
        return $q.when()
            .then(Magic.uploadFile)
            .then(function (response) {
                Array.prototype.push.apply(currItem().objattachs, response.data);
                attachGridOptions.hcApi.setRowData(currItem().objattachs);
            });
    }

    $scope.btnDownloadAttachClick = btnDownloadAttachClick;

    /**
     * 下载附件
     */
    function btnDownloadAttachClick() {
        var doc = attachGridOptions.hcApi.getFocusedData();
        if (!doc) {
            Magic.swalInfo('请先选中要下载的附件')
            return;
        }

        window.open('/downloadfile.do?docid=' + doc.docid);
    }

    $scope.btnViewAttachClick = btnViewAttachClick;

    /**
     * 查看附件
     */
    function btnViewAttachClick() {
        var doc = attachGridOptions.hcApi.getFocusedData();
        if (!doc) {
            Magic.swalInfo('请先选中要查看的附件')
            return;
        }

        window.open('/viewImage.jsp?filecode=' + doc.downloadcode + '&filename=' + doc.docname);
    }

    $scope.btnDeleteAttachClick = btnDeleteAttachClick;

    /**
     * 删除附件
     */
    function btnDeleteAttachClick() {
        var node = attachGridOptions.hcApi.getFocusedNode();
        if (!node) {
            Magic.swalInfo('请先选中要删除的附件')
            return;
        }

        return Magic
            .swalConfirmThenSuccess({
                title: '确定要删除附件【' + node.data.docname + '】吗？',
                okTitle: '成功删除',
                okFun: function () {
                    currItem().objattachs.splice(node.rowIndex, 1);
                    attachGridOptions.hcApi.setRowData(currItem().objattachs);
                }
            });
    }

    /* ==============================附件信息表格 - 结束============================== */

    //对外暴露scope对象，让流程控制器使用刷新方法
    window.currScope = $scope;

    /**=======================打印测试 =========================================*/
    function CreatePrintPage() {
        var beforeurl = window.location.protocol + "//" + window.location.host + "/web/images/mtm_print_template/";
        /**------------- 计算打印所需信息 ---------**/

        var start_time = new Date(currItem().start_time).Format('yyyy年MM月dd日');
        var end_time = new Date(currItem().end_time).Format('yyyy年MM月dd日');
        var sqdate = start_time + " - " + end_time + "";
        /**------------- 计算打印所需信息 ---------**/

        var printData = $scope.gridGetSelectedData('lineOptions', true); //获取所需的明细数据
        if (printData.length == 0) {
            printData = $scope.data.currItem.mkt_terminal_manager_lineofmkt_terminal_managers;
        }
        var LODOP = getLodop();
        LODOP.PRINT_INITA(0, 0, "210mm", "297mm", "雷士专卖店授权书");
        LODOP.SET_PRINT_MODE("POS_BASEON_PAPER",true);
        LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A8");
        // LODOP.ADD_PRINT_SETUP_BKIMG("<img border='0' src='" + url + "'>");
        // LODOP.SET_SHOW_MODE("BKIMG_WIDTH", "210mm");
        // LODOP.SET_SHOW_MODE("BKIMG_HEIGHT", "297mm");
        // LODOP.SET_SHOW_MODE("BKIMG_LEFT", 1);
        // LODOP.SET_SHOW_MODE("BKIMG_TOP", 1);
        // LODOP.SET_SHOW_MODE("BKIMG_IN_PREVIEW", true);
        // LODOP.SET_SHOW_MODE("BKIMG_PRINT", true);
        console.log(window.screen.height);
        console.log(window.screen.width);
        // $.each(printData, function (i, item) {
        $.each(printData, function (i, item) {
            var url = '';
            switch (item.crm_brand) {
                case 1:
                    url = beforeurl + '普通专卖店.png';
                    break;
                case 2:
                    url = beforeurl + '伯克丽授权书.png';
                    break;
                case 3:
                    url = beforeurl + '利兹城堡授权书.png';
                    break;
                case 4:
                    url = beforeurl + '致东方授权书.png';
                    break;
            }
            LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
            // LODOP.ADD_PRINT_IMAGE(1, 1, 794, 1122, "<img  border='0' style='width: 1200px;height: 1900px' src='" + url + "'>");
            // LODOP.ADD_PRINT_HTML(1, 1, "210.08mm", "290.86mm", "<img  border='0' style='width: 794px;height: 1095px' src='" + url + "'>");
            LODOP.ADD_PRINT_HTML(1, 1, "794px", "1100px", "<img  border='0' style='width: 794px;height: 1095px' src='" + url + "'>");
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
            if (item.crm_brand === 2) { //因为伯克丽的模板图片里的行高度和其他的不一样，需要单独处理
                LODOP.SET_PRINT_STYLE("Stretch", 1);
                LODOP.ADD_PRINT_TEXT("99.01mm", "60.85mm", "113.51mm", "10.58mm", item.terminal_name);
                LODOP.SET_PRINT_STYLEA(0, "FontSize", 22);
                LODOP.ADD_PRINT_TEXT("155.18mm", "53.18mm", "70.96mm", "6.88mm", item.authority_code ? item.authority_code : '');
                LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                LODOP.ADD_PRINT_TEXT("161.79mm", "53mm", "70.64mm", "6.61mm", sqdate);
                LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                LODOP.ADD_PRINT_TEXT("169.02mm", "52.65mm", "130.97mm", "6.61mm", item.branch_address);
                LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                LODOP.ADD_PRINT_TEXT("241.06mm", "139.46mm", "45.24mm", "6.88mm", Magic.today());
                LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
                LODOP.ADD_PRINT_TEXT("174.63mm", "52.92mm", "130.18mm", "47.1mm", item.cust_area);
                LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                var html = '<span style="width: 50px; font-size: 9px; writing-mode:horizontal-tb; letter-spacing: 20px;">说明:该授权书仅适用于线下经销商 如需电商模式经营使用需想雷士电子商务公司申请 报备 单独出具授权书'
                    +'</>';
                LODOP.ADD_PRINT_HTML("168.54mm","189.44mm","4.76mm","101.34mm", html);
                LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
            } else if (item.crm_brand === 4)//因为至东方的模板图片里的字体间距和其他的不一样，需要单独处理
            {
                LODOP.SET_PRINT_STYLE("Stretch", 1);
                LODOP.ADD_PRINT_TEXT("108.51mm", "60.33mm", "113.51mm", "10.58mm", item.terminal_name);
                LODOP.SET_PRINT_STYLEA(0, "FontSize", 22);
                LODOP.ADD_PRINT_TEXT("161.9mm", "57.5mm", "70.96mm", "5.56mm", item.authority_code ? item.authority_code : '');
                LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                LODOP.ADD_PRINT_TEXT("168.51mm", "57.24mm", "70.64mm", "6.61mm", sqdate);
                LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                LODOP.ADD_PRINT_TEXT("175.13mm", "57.03mm", "129.99mm", "6.61mm", item.branch_address);
                LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                LODOP.ADD_PRINT_TEXT("241.35mm", "144.46mm", "45.24mm", "6.88mm", Magic.today());
                LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
                LODOP.ADD_PRINT_TEXT("182.01mm", "57.5mm", "130.18mm", "39.16mm", item.cust_area);
                LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
            }
            else {
                LODOP.SET_PRINT_STYLE("Stretch", 1);
                LODOP.ADD_PRINT_TEXT("108.51mm", "60.33mm", "113.51mm", "10.58mm", item.terminal_name);
                LODOP.SET_PRINT_STYLEA(0, "FontSize", 22);
                LODOP.ADD_PRINT_TEXT("161.9mm", "54.5mm", "70.96mm", "5.56mm", item.authority_code ? item.authority_code : '');
                LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                LODOP.ADD_PRINT_TEXT("168.51mm", "54.24mm", "70.64mm", "6.61mm", sqdate);
                LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                LODOP.ADD_PRINT_TEXT("175.13mm", "54.03mm", "129.99mm", "6.61mm", item.branch_address);
                LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                LODOP.ADD_PRINT_TEXT("241.35mm", "144.46mm", "45.24mm", "6.88mm", Magic.now());
                LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
                LODOP.ADD_PRINT_TEXT("182.01mm", "54.5mm", "130.18mm", "39.16mm", item.cust_area);
                LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
            }
            if (i < printData.length) {
                LODOP.NewPageA();
                LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
            }
        });
//         var code = LODOP.PREVIEW();
        LODOP.PRINT_DESIGN();
        // LODOP.PREVIEW();
    }

    $scope.CreatePrintPage = CreatePrintPage

}

//注册控制器
angular.module('inspinia')
    .controller('mkt_terminal_manager_pro', mkt_terminal_manager_pro)