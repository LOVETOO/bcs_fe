var salemanControllers = angular.module('inspinia');
function sale_months_invplan_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_months_invplan_headerEdit = HczyCommon.extend(sale_months_invplan_headerEdit, ctrl_bill_public);
    sale_months_invplan_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_months_invplan_header",
        key: "months_invplan_id",
        wftempid: 10160,
        FrmInfo: {},
        grids: [
            {optionname: 'options_21', idname: 'sale_months_invplan_lineofsale_months_invplan_header'},
        ]
    };
    /******************页面隐藏****************************/
    $scope.show_11 = true;
    $scope.show11 = function () {
        $scope.show_11 = !$scope.show_11;
    };
    /************************下拉值*****************************/
    //类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "line_type"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            };
            $scope.columns_21[4].cellEditorParams.values.push(newobj);
        }
    });
    //冷量
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "cool_stand"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            };
            $scope.columns_21[12].cellEditorParams.values.push(newobj);
        }
    });
    //面板
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "mb_stand"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            };
            $scope.columns_21[16].cellEditorParams.values.push(newobj);
        }
    });
    //增加当前行、删除当行前
    $scope.additem = function () {
        $scope.options_21.api.stopEditing(false);
        var data = [];
        var node = $scope.options_21.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        var item = {
            seq: node.length + 1
        };
        data.push(item);
        $scope.options_21.api.setRowData(data);
        $scope.data.currItem.sale_months_invplan_lineofsale_months_invplan_header = data;
    };
    //订单明细  工厂型号编码
    $scope.item_h_code11 = function () {
        if($scope.options_21.api.getModel().rootNode.childrenAfterSort[$scope.options_21.api.getFocusedCell().rowIndex].data.line_type==undefined||$scope.options_21.api.getModel().rootNode.childrenAfterSort[$scope.options_21.api.getFocusedCell().rowIndex].data.line_type==0){
             BasemanService.notice("请选择机型类型！", "alter-warning")
             return;
        }
		$scope.FrmInfo = {};
        $scope.FrmInfo.postdata = {},
        $scope.FrmInfo.postdata.flag = 2;
        $scope.FrmInfo.postdata.item_h_id = $scope.data.currItem.item_h_id;
        $scope.FrmInfo.postdata.pro_type=parseInt($scope.options_21.api.getModel().rootNode.childrenAfterSort[$scope.options_21.api.getFocusedCell().rowIndex].data.line_type);
        BasemanService.openFrm("views/saleman/item_h_code.html", item_h_code, $scope, "", "lg")
            .result.then(function (items) {
            var index = $scope.options_21.api.getFocusedCell().rowIndex;
            var node = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
			var data = []
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data);
            };
            data[index].item_h_id = items.item_h_id;
            data[index].item_h_code = items.item_h_code;
            data[index].item_h_name = items.item_h_name;
            data[index].seq = parseInt(node[index].data.seq);
            $scope.data.currItem.sale_months_invplan_lineofsale_months_invplan_header = data;
            $scope.options_21.api.setRowData(data);

        });
    }
    //部门options_21
     $scope.org_name = function () {
            $scope.FrmInfo = {
                classid: "scporg",
                postdata: {},
                backdatas: "orgs",
                sqlBlock:"( idpath like '%211%' or idpath like '%273%') and 1=1 and stat =2 and OrgType = 5",
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (result) {
                var data = [];
                var index = $scope.options_21.api.getFocusedCell().rowIndex;
                var node = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
                for (var i = 0; i < node.length; i++) {
                    data.push(node[i].data)
                }
                data[index].org_name = result.orgname;
                data[index].org_code = result.code;
                data[index].org_id = result.orgid;
                $scope.options_21.api.setRowData(data);
                $scope.data.currItem.sale_year_sell_cale_itemofsale_year_sell_cale = data;
                $scope.data.currItem.org_name=result.orgname;
                $scope.data.currItem.org_code=result.code;
                $scope.data.currItem.org_id=result.orgid;
            });
        };
    //大区
     $scope.area_name = function () {
            $scope.FrmInfo = {
                classid: "scporg",
                postdata: {},
                backdatas: "orgs",
                sqlBlock:"CpcOrg.Stat =2 and OrgType in (3)",
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (result) {
                var data = [];
                var index = $scope.options_21.api.getFocusedCell().rowIndex;
                var node = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
                for (var i = 0; i < node.length; i++) {
                    data.push(node[i].data)
                }
                data[index].area_name = result.orgname;
                data[index].area_code = result.code;
                data[index].area_id = result.areaid;
                $scope.options_21.api.setRowData(data);
                $scope.data.currItem.sale_year_sell_cale_itemofsale_year_sell_cale = data;
            });
        };
    /***************************弹出框********************************/
    //客户
     $scope.cust_code = function () {
            $scope.FrmInfo = {
                classid: "customer",
                postdata: {},
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (result) {
                HczyCommon.stringPropToNum(result);
                var data = [];
                var index = $scope.options_21.api.getFocusedCell().rowIndex;
                var node = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
                for (var i = 0; i < node.length; i++) {
                    data.push(node[i].data)
                }
                data[index].cust_code = result.sap_code;
                data[index].cust_name  = result.cust_name;
                data[index].cust_level=parseInt(result.cust_level);
                data[index].cust_id = result.cust_id;

                data[index].area_name = result.area_name;
                data[index].area_code = result.area_code;
                data[index].area_id = result.area_id;
                data[index].org_name = result.org_name;
                data[index].org_id = result.org_id;
                data[index].org_code = result.org_code;

                data[index].area_name = result.area_name;
                data[index].brand_name  = result.brand_name;
                data[index].part_rate_byhand=result.part_rate_byhand;
                data[index].rebate_rate = result.rebate_rate;
                data[index].contract_subscrp = result.contract_subscrp;
                data[index].shipment_subscrp  = result.shipment_subscrp;
                //area_name brand_name part_rate_byhand  //rebate_rate contract_subscrp shipment_subscrp
                $scope.options_21.api.setRowData(data);
                $scope.data.currItem.sale_months_invplan_lineofsale_months_invplan_header = data;
            });
        };
    //复制行当前
    $scope.add21 = function () {
           var select_row = $scope.selectGridGetData('options_21');
           if (!select_row.length) {
               BasemanService.notice("未选中行!", "alert-warning");
               return;
           }
           var msg = [];
           if (select_row.length > 1) {
               msg.push("不能选择拆分的行数大于1行");
           }
           if (msg.length > 0) {
               BasemanService.notice(msg)
               return
           }
           var datachose = select_row[0];
           BasemanService.openFrm("views/Pop_copy_Line.html", PopCopyLineController, $scope)
               .result.then(function (result) {
               var spiltRow = new Array(result.lines);
               for (i = 0; i < result.lines; i++) {
                   spiltRow[i] = new Object();
                   for (var name in datachose) {
                       spiltRow[i][name] = datachose[name];
                   }
               }
               $scope.selectGridDelItem('options_21');//删除勾选行的数据
               for (var i = 0; i < result.lines; i++) {
                   $scope.gridAddItem('options_21', spiltRow[i])
               }

           });
    };
    //复制明细
    $scope.additem21 = function () {
            if ($scope.data.currItem.org_id == undefined || $scope.data.currItem.org_id == "") {
                BasemanService.notice("业务部门不能为空", "alert-warning")
                return;
            }
            $scope.FrmInfo = {
                classid: "sale_months_plan_header",
                postdata: {
                    sqlBlock:"stat in (5,99) and org_id=249",
                }
            };
            $scope.FrmInfo.sqlBlock = 'stat in (5,99) and org_id='+$scope.data.currItem.org_id;
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                    var postdata={
                        plan_id:result.plan_id
                    };
                    BasemanService.RequestPost("sale_months_plan_header", "select", postdata)
                        .then(function (data) {
                          $scope.options_21.api.setRowData(data.sale_months_invplan_lineofsale_months_invplan_header);
                          $scope.data.currItem.sale_months_invplan_lineofsale_months_invplan_header=data.sale_months_invplan_lineofsale_months_invplan_header;
                    });
            });
        };
    //复制上月明细
    $scope.additem21 = function () {
        if ($scope.data.currItem.org_id == undefined || $scope.data.currItem.org_id == "") {
            BasemanService.notice("业务部门不能为空", "alert-warning")
            return;
        }
        if ($scope.data.currItem.launch_month == undefined || $scope.data.currItem.launch_month == "") {
            BasemanService.notice("发起月份不能为空", "alert-warning")
            return;
        }
        if ($scope.data.currItem.launch_year == undefined || $scope.data.currItem.launch_year == "") {
            BasemanService.notice("发起月份不能为空", "alert-warning")
            return;
        }
            $scope.FrmInfo = {
                classid: "sale_months_plan_header",
                postdata: {},
            };
            $scope.FrmInfo.sqlBlock = 'stat in (5,99) and org_id='+$scope.data.currItem.org_id+'and launch_month='+$scope.data.currItem.launch_month+"and launch_year="+$scope.data.currItem.launch_year;
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                    var postdata={
                        plan_id:result.plan_id
                    };
                    BasemanService.RequestPost("sale_months_plan_header", "select", postdata)
                        .then(function (data) {
                          $scope.options_21.api.setRowData(data.sale_months_invplan_lineofsale_months_invplan_header);
                          $scope.data.currItem.sale_months_invplan_lineofsale_months_invplan_header=data.sale_months_invplan_lineofsale_months_invplan_header;
                    });
            });
        };
    /******************网格定义区域****************************/
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
    }
   //明细

    $scope.columns_21 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "生产单", field: "prod_no", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "订单", field: "order_no", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "订单类型", field: "order_type", editable: true, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams:{values:[]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "MRP控制者", field: "mrp_ctrl", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "预计发货日期", field: "pre_ship_date", editable: true, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户代码", field: "cust_code", editable: true, filter: 'set', width: 100,
            cellEditor: "弹出框",
            action: $scope.cust_code,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "行类型", field: "line_type", editable: true, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams:{values:[]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "整机编码", field: "item_h_code", editable: true, filter: 'set', width: 100,
            cellEditor: "弹出框",
            action: $scope.item_h_code11,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "整机名称", field: "item_h_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "库存", field: "inv_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "发货日期", field: "ship_date", editable: true, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "验货日期", field: "inspect_date", editable: true, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "发货数量", field: "ship_qty", editable: true, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "发货节点", field: "ship_note", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "公司处理数量", field: "company_qty", editable: true, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },

        {
            headerName: "待定数量", field: "wait_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "线检日期", field: "line_inspect_date", editable: true, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注", field: " note", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
        ];
    $scope.options_21 = {
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
            var isGrouping = $scope.options_21.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    /******************词汇值****************************/
    //信用证类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            $scope.stats = HczyCommon.stringPropToNum(data.dicts);
        });
    //信用证类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "lc_type"})
        .then(function (data) {
            $scope.lc_types = HczyCommon.stringPropToNum(data.dicts);
        });
    //LC受益人--回款组织
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "return_ent_type"})
        .then(function (data) {
            $scope.return_ent_types = HczyCommon.stringPropToNum(data.dicts);
        });
    /******************弹出框区域****************************/
    /*********************保存校验*****************************/
        $scope.save_before=function(){
		    for(var i=0;i<$scope.data.currItem.sale_months_invplan_lineofsale_months_invplan_header.length;i++){
			    $scope.data.currItem.sale_months_invplan_lineofsale_months_invplan_header[i].cool_stand=parseInt($scope.data.currItem.sale_months_invplan_lineofsale_months_invplan_header[i].cool_stand);
			    $scope.data.currItem.sale_months_invplan_lineofsale_months_invplan_header[i].mb_stand=parseInt($scope.data.currItem.sale_months_invplan_lineofsale_months_invplan_header[i].mb_stand);
		    }
        }
    /******************界面初始化****************************/
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            stat:1,

        };
    };
    $scope.initdata();

}

//加载控制器
salemanControllers
    .controller('sale_months_invplan_headerEdit', sale_months_invplan_headerEdit);
