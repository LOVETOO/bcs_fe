var basemanControllers = angular.module('inspinia');
function fin_funds_am_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    fin_funds_am_headerEdit = HczyCommon.extend(fin_funds_am_headerEdit, ctrl_bill_public);
    fin_funds_am_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "fin_funds_am_header",
        key: "am_id",
        // wftempid: 10046,
        FrmInfo: {},
        grids: [{optionname: 'options_11', idname: 'fin_funds_am_lineoffin_funds_am_headers'}]
    };
    /**-------网格定义区域 ------*/
    var groupColumn = {
        headerName: "Group",
        width: 200,
        field: 'name',
        valueGetter: function (params) {
            if (params.node.group) {
                return params.node.key;
            } else {
                return params.data[params.colDef.field];
            }
        },
        comparator: agGrid.defaultGroupComparator,
        cellRenderer: 'group',
        cellRendererParams: {
            checkbox: true
        }
    };
    $scope.columns_11 = [
        {
            headerName: "到款单号", field: "funds_no", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "分配单号", field: "allo_no", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "PI号", field: "pi_no", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "生产单号", field: "prod_no", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "系统资金单号", field: "other_no", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }/*, {
            headerName: "到款类型", field: "funds_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }*/, {
            headerName: "到款日期", field: "funds_date", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "业务名称", field: "org_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }/*, {
            headerName: "实收金额", field: "amt", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }*/, {
            headerName: "到款总额", field: "fact_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "调整金额", field: "modify_amt", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            non_empty: true,
            floatCell: true
        },{
            headerName: "可清金额", field: "clear_amount", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            non_empty: true,
            floatCell: true
        }, {
            headerName: "已分配金额", field: "allocated_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "是否写SAP", field: "is_yin", editable: false, filter: 'set', width: 100,
            // cellEditor: "复选框",
            cellEditor: "下拉框",
            cellEditorParams: {values: [{value: 1, desc: '否'}, {value: 2, desc: '是'}]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "数据源", field: "new_bill", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: [{value: 0, desc: '老数据'}, {value: 1, desc: '老数据'}, {value: 2, desc: '新数据'}]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "写SAP状态", field: "sap_custnote", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.options_11 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: true,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_11.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    /********************************弹出框区域**************************************/
    //会计期间
    $scope.fin_bud_period_header = function () {
        $scope.FrmInfo = {
            classid: "fin_bud_period_header",
            commitRigthNow: true,
            postdata: {
                flag: 3
            },
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.period_year = result.period_year;
            $scope.data.currItem.period_id = result.period_id;
            $scope.data.currItem.period_line_id = result.period_line_id;
            $scope.data.currItem.dname = result.dname;
        })
    };
    //到款单号
    $scope.additem = function () {
        $scope.FrmInfo = {
            title: "到款单查询",
            is_high: true,
            type: "checkbox",
            thead: [
                {
                    name: "到款单号", code: "funds_no",
                    show: true, iscond: true, type: 'string'
                },{
                    name: "资金系统单号", code: "other_no",
                    show: true, iscond: true, type: 'string'
                }, {
                    name: "实际到款", code: "fact_amt",
                    show: true, iscond: true, type: 'string'
                },{
                    name: "分配单号", code: "allo_no",
                    show: true, iscond: true, type: 'string'
                }, {
                    name: "已分配金额", code: "allocated_amt",
                    show: true, iscond: true, type: 'string'
                }, {
                    name: "业务部门", code: "org_name",
                    show: true, iscond: true, type: 'string'
                }, {
                    name: "客户名称", code: "cust_name",
                    show: true, iscond: true, type: 'string'
                }],
            classid: "fin_funds_header",
            is_custom_search: "true",
            postdata:{flag:16},
            sqlBlock: "funds_type=1 and stat=5 and (amt >0 or fact_amt>0)",
            searchlist: ["funds_no", "allo_no","other_no", "fact_amt",
                "allocated_amt",  "org_name", "cust_name"],
        };
        BasemanService.open(CommonPopController, $scope, '', 'lg').result.then(function (items) {
            items = HczyCommon.stringPropToNum(items);
            var lcs = $scope.gridGetData("options_11");
            var isExists = false;
            for (var i = 0; i < items.length; i++) {
                if(Number(items[i].allo_id||0)==0){
                    var isExists = HczyCommon.isExist(lcs, items[i], ["funds_no", "funds_id"], ["funds_no", "funds_id"]).exist;
                    items[i].clear_amount =parseFloat(items[i].fact_amt||0)-parseFloat(items[i].allocated_amt||0);
                    items[i].modify_amt =-(parseFloat(items[i].fact_amt||0)-parseFloat(items[i].allocated_amt||0));
                }else{
                    var isExists = HczyCommon.isExist(lcs, items[i], ["allo_id", "allo_no"], ["allo_id", "allo_no"]).exist;
                    items[i].clear_amount=parseFloat(items[i].allo_amt||0);
                    items[i].modify_amt=-(parseFloat(items[i].clear_amount||0));
                }
                if (isExists) {
                    continue;
                }
                $scope.gridAddItem('options_11', items[i]);
            }
        })
    };
    /********************************系统词汇**************************************/
    //状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        $scope.stats =   HczyCommon.stringPropToNum(data.dicts);
    });
    //到款类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "tt_type"})
        .then(function (data) {
            var funds_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                funds_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('columns_11', 'funds_type')) {
                $scope.columns_11[$scope.getIndexByField('columns_11', 'funds_type')].cellEditorParams.values = funds_types;
            }
        });
    /**********************保存校验*************************/
    $scope.validate = function () {
        //校验金额
        var GridData = $scope.gridGetData("options_11");
        for (var i = 0; i < GridData.length; i++) {
            //校验提前到款调整金额、生产定金分配金额
            modify_amt = parseFloat(GridData[i].modify_amt || 0);
            clear_amount = parseFloat(GridData[i].clear_amount|| 0);
            if(modify_amt>0){
                BasemanService.notice('第' + (i + 1) + '行的调整金额不能大于0', "alert-warning");
                return false;
            }
            if (Math.abs(modify_amt) > Math.abs(clear_amount)) {
                BasemanService.notice('第' + (i + 1) + '行的调整金额大于可清金额', "alert-warning");
                return false;
            }
        }
        return true;
    };
    $scope.refresh_after=function(){
        var data=$scope.gridGetData("options_11");
        $scope.data.currItem.fin_funds_am_lineoffin_funds_am_headers=data;
    }
    /******************************提交**************************/
    $scope.wfstart = function (e) {
        if (e) e.currentTarget.disabled = true;
        BasemanService.RequestPost("fin_funds_am_header", "check", {am_id: $scope.data.currItem.am_id}).then(function (data) {
            BasemanService.notice("提交成功", "alert-info");
            if (e) e.currentTarget.disabled = false;
            $scope.refresh(2);
        }, function (error) {
            if (e) e.currentTarget.disabled = false;
        })
    };
    /**------界面初始化-----*/
    //刷新数据并且设置初始化$scope.userbean
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            objattachs: [],
            stat: 1,
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            sales_user_id: window.strUserId,
        };
    };
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('fin_funds_am_headerEdit', fin_funds_am_headerEdit);
