var finmanControllers = angular.module('inspinia');
function sale_list($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_list = HczyCommon.extend(sale_list, ctrl_bill_public);
    sale_list.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_list",
        FrmInfo: {},
        grids: [
            {optionname: 'options_11', idname: 'sale_lists'},
            {optionname: 'options_12', idname: 'sale_lists2'}
        ]
    };
    /**********************初始化*************************/
    $scope.clearinformation = function () {
        $scope.data.currItem.notice_time = true;
        $scope.data.currItem.check6= true;
        $scope.data.currItem.check1= true;
        $scope.data.currItem.check2= true;
        $scope.data.currItem.check3= true;
        $scope.data.currItem.check4= true;
        $scope.data.currItem.check5= true;
        $scope.data.currItem.end_date = moment().format('YYYY-MM-DD HH:mm:ss');
    };
    $scope.clearSelection = function () {
        $("#sqlWhereBlock").find("select").each(function () {
            this.value = "";                                          //清空查询使用值
            $("#sqlWhereBlock").find("select").each(function () {  //清空界面显示值
                var id = "#" + this.id + "_chosen";
                $(id).find("span").each(function () {
                    this.textContent = "";
                })
            });
        });

        $("#sqlWhereBlock").find("input").each(function () {
            this.value = "";
        })
        for(var name in $scope.data.currItem){
            if($scope.data.currItem[name]!=undefined&&$scope.data.currItem[name]!=""&&!($scope.data.currItem[name] instanceof Array)){
                $scope.data.currItem[name]=undefined;
            }
        }

    }
    $scope.cheked2 = function () {
        if ($scope.data.currItem.notice_time) {
            $scope.data.currItem.check_time = false;
            $scope.data.currItem.time_flag = 2;
        }
    }
    $scope.cheked = function () {
        if ($scope.data.currItem.check_time) {
            $scope.data.currItem.notice_time = false;
            $scope.data.currItem.time_flag = 1;
        } else {
            $scope.data.currItem.time_flag = 2;
        }
    }
    /**********************网格下拉*************************/
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "line_type"})
        .then(function (data) {
            var line_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                line_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('columns_11', 'line_type')) {
                $scope.columns_11[$scope.getIndexByField('columns_11', 'line_type')].cellEditorParams.values = line_types;
            }
        });
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"})
        .then(function (data) {
            var trade_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                trade_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('columns_11', 'sale_ent_type')) {
                $scope.columns_11[$scope.getIndexByField('columns_11', 'sale_ent_type')].cellEditorParams.values = trade_types;
            }
            if ($scope.getIndexByField('columns_12', 'sale_ent_type')) {
                $scope.columns_12[$scope.getIndexByField('columns_12', 'sale_ent_type')].cellEditorParams.values = trade_types;
            }
        });
    /**********************查询、弹出框*************************/
    $scope.clear = function () {
        $scope.gridSetData("options_11", []);
        $scope.gridSetData("options_12", []);
    }
    $scope.getpostdata = function (postdata) {
        $(sqlWhereBlock).find("input[name='postdata']").each(function () {
            var id = this.id;
            if (this.id.indexOf("OMS") > 0) {
                id = this.id.substr(0, this.id.indexOf("OMS"))
            }
            if (this.value.length > 0) {
                postdata[id] = this.value;
            } else {
                postdata[id] = "";
            }
        });
    }
    $scope.search = function () {
		if($scope.data.currItem.time_flag =="" || $scope.data.currItem.time_flag ==undefined){
			$scope.data.currItem.time_flag=2;
		}
        if ($scope.data.currItem.start_date > $scope.data.currItem.end_date) {
            BasemanService.notice("起始日期不能大于截止日期", "alert-warning");
            return;
        }
        $scope.clear;
        var postdata = {};
        postdata.time_flag = $scope.data.currItem.time_flag;
        postdata.info19 = "";
        postdata.info20 = "";
        postdata.info21 = "";
        postdata.info22 = "";
        postdata.info23 = "";
        postdata.flag = 6;
        postdata.area_code = $scope.data.currItem.superid;
        postdata.time_flag = $scope.data.currItem.time_flag ;
		postdata.start_date = $scope.data.currItem.start_date;
		postdata.end_date = $scope.data.currItem.end_date;
        postdata.org_id=$scope.data.currItem.org_id;
        postdata.cust_id=$scope.data.currItem.cust_id;
        $scope.getpostdata(postdata);
        BasemanService.RequestPost("sale_list", "search", postdata)
            .then(function (data) {
                $scope.data.currItem.sale_lists = data.sale_lists;
                $scope.options_11.api.setRowData(data.sale_lists);
            });
    };
    $scope.selectarea = function () {
        $scope.FrmInfo = {
            classid: "scporg",
            postdata: {},
            sqlBlock: "CpcOrg.Stat =2 and OrgType in (3) ",
            backdatas: "orgs",
            // type: "checkbox"
        };
        BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (result) {
            $scope.data.currItem.area_name = result.orgname;
            $scope.data.currItem.area_code = result.code;
            $scope.data.currItem.superid = result.orgid;
        })
    };
    $scope.selectcode = function () {
        // if($scope.data.currItem.area_name==undefined||$scope.data.currItem.area_name==""){
        //     BasemanService.notice("请先选择大区", "alert-warning");
        //     return;
        // }
        $scope.FrmInfo = {
            classid: "scporg",
            postdata:{superid:$scope.data.currItem.superid},
            sqlBlock: "scporg.Stat =2 and OrgType in (5, 14)",
            backdatas: "orgs",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_id = result.orgid;
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_name = result.orgname
        });

    };
    $scope.selectcust = function () {
        if ($scope.data.currItem.org_code == undefined || $scope.data.currItem.org_code == "") {
            BasemanService.notice("请先选业务部门", "alert-warning");
            return;
        }
        $scope.FrmInfo = {
            classid: "customer",
            sqlBlock: "org_id = " + $scope.data.currItem.org_id
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (result) {
            $scope.data.currItem.cust_code = result.cust_code;
            $scope.data.currItem.cust_name = result.cust_name;
            $scope.data.currItem.cust_id = result.cust_id;
        });

    };

    /****************************汇总**********************************/
    //业务部门
    $scope.changeAreaName = function () {

        $scope.data.currItem.org_name = "";
        $scope.data.currItem.org_id = "";
    };
    //客户
    $scope.change_customer = function () {

        $scope.data.currItem.cust_name = "";
        $scope.data.currItem.cust_id = "";
    };
    //大区
    $scope.changeAreaCode = function () {
        $scope.data.currItem.area_name = "";
     
        $scope.data.currItem.areaid = "";
    };
    //隐藏、显示列
    $scope.clickchange1=function(){
        if ($scope.data.currItem.check1 == true) {
            $scope.options_12.columnApi.hideColumns(["sale_ent_type"]);
            var model=[{colId:"sale_ent_type",sort:"desc"}]//asc desc
            $scope.options_12.api.setSortModel(model)
        }else{$scope.options_12.columnApi.setColumnsVisible(["sale_ent_type"])}
    };
    $scope.clickchange2=function(){
        if ($scope.data.currItem.check2 == true) {
            $scope.options_12.columnApi.hideColumns(["zone_name"])
        }else{$scope.options_12.columnApi.setColumnsVisible(["zone_name"])}
    };
    $scope.clickchange3=function(){
        if ($scope.data.currItem.check3 == true) {
            $scope.options_12.columnApi.hideColumns(["org_name"])
        }else{$scope.options_12.columnApi.setColumnsVisible(["org_name"])}
    };
    $scope.clickchange4=function(){
        if ($scope.data.currItem.check4 == true) {
            $scope.options_12.columnApi.hideColumns(["cust_code"])
        }else{$scope.options_12.columnApi.setColumnsVisible(["cust_code"])}
    };
    $scope.clickchange5=function(){
        if ($scope.data.currItem.check5 == true) {
            $scope.options_12.columnApi.hideColumns(["inspection_batchno"])
        }else{$scope.options_12.columnApi.setColumnsVisible(["inspection_batchno"])}
    };
    $scope.clickchange6=function(){
        if ($scope.data.currItem.check6 == true) {
            $scope.options_12.columnApi.hideColumns(["currency_code"])
        }else{$scope.options_12.columnApi.setColumnsVisible(["currency_code"])}
    };
    //汇总保留2位
    $scope.sum_retain = function () {
        var nodes=$scope.options_12.api.getModel().rootNode.childrenAfterSort;
        var data = $scope.gridGetData("options_12");
        for(var i=0;i<$scope.columns_12.length;i++){
            for (var j = 0; j < data.length; j++) {
                if($scope.columns_12[i].field=="prod_amt"){
                    if(data[j].prod_amt!= undefined){
                        data[j].prod_amt=parseFloat( data[j].prod_amt||0).toFixed(2);
                    }
                }
                if($scope.columns_12[i].field=="new_qty"){
                    if(data[j].new_qty!= undefined){
                        data[j].new_qty=parseFloat(data[j].new_qty||0).toFixed(2);
                    }
                }
                if($scope.columns_12[i].field=="redo_qty"){
                    if(data[j].redo_qty!= undefined){
                        data[j].redo_qty=parseFloat( data[j].redo_qty||0).toFixed(2);
                    }
                }
                if($scope.columns_12[i].field=="s1"){
                    if(data[j].s1!= undefined){
                        data[j].s1=parseFloat(data[j].s1||0).toFixed(2);
                    }
                }
                if($scope.columns_12[i].field=="s3"){
                    if(data[j].s3!= undefined){
                        data[j].s3=parseFloat( data[j].s3||0).toFixed(2);
                    }
                }
                if($scope.columns_12[i].field=="s8"){
                    if(data[j].s8!= undefined){
                        data[j].s8=parseFloat(data[j].s8||0).toFixed(2);
                    }
                }
                if($scope.columns_12[i].field=="s6"){
                    if(data[j].s6!= undefined){
                        data[j].s6=parseFloat( data[j].s6||0).toFixed(2);
                    }
                }
                if($scope.columns_12[i].field=="s11"){
                    if(data[j].s11!= undefined){
                        data[j].s11=parseFloat(data[j].s11||0).toFixed(2);
                    }
                }
                if($scope.columns_12[i].field=="s12"){
                    if(data[j].s12!= undefined){
                        data[j].s12=parseFloat( data[j].s12||0).toFixed(2);
                    }
                }
                if($scope.columns_12[i].field=="amt4"){
                    if(data[j].amt4!= undefined){
                        data[j].amt4=parseFloat(data[j].amt4||0).toFixed(2);
                    }
                }
            }

        }
        $scope.options_12.api.refreshCells(nodes, ["prod_amt","amt4","s12","s11","s6","s8","s3","s1","redo_qty","new_qty","prod_amt"]);
    };
    //汇总列
    $scope.groupby = function (arr,column,datas) {
        if ($scope.data.currItem.check1 == false && $scope.data.currItem.check2 == false && $scope.data.currItem.check3 == false
            && $scope.data.currItem.check4 == false && $scope.data.currItem.check5 == false && $scope.data.currItem.check6 == false) {
            BasemanService.notice("请选择条件再汇总!", "alert-warning");
            return;
        }
        $scope.sumcontainer = [];
        var arr = [], column = [];
        var sortmodel=[];
        var datas = $scope.gridGetData("options_11");
        // var datas=$scope.data.currItem.sale_lists;
        if ($scope.data.currItem.check1 == true) {
            arr.push("sale_ent_type");
            sortmodel.push({colId:"sale_ent_type",sort:"desc"})
        }
        if ($scope.data.currItem.check2 == true) {
            arr.push("zone_name");
            $scope.options_12.columnApi.hideColumns(["zone_name"])
            sortmodel.push({colId:"zone_name",sort:"desc"})
        }
        if ($scope.data.currItem.check3 == true) {
            arr.push("org_name");
            $scope.options_12.columnApi.hideColumns(["org_name"])
            sortmodel.push({colId:"org_name",sort:"desc"})
        }
        if ($scope.data.currItem.check4 == true) {
            arr.push("cust_code");
            $scope.options_12.columnApi.hideColumns(["cust_code"])
            sortmodel.push({colId:"cust_code",sort:"desc"})
        }
        if ($scope.data.currItem.check5 == true) {
            arr.push("inspection_batchno");
            $scope.options_12.columnApi.hideColumns(["inspection_batchno"])
            sortmodel.push({colId:"inspection_batchno",sort:"desc"})
        }
        if ($scope.data.currItem.check6 == true) {
            arr.push("currency_code");
            $scope.options_12.columnApi.hideColumns(["currency_code"])
            sortmodel.push({colId:"currency_code",sort:"desc"})
        }
        column[0] = "require_qty";
        column[1] = "prod_qty";
        column[2] = "prod_amt";
        column[3] = "new_qty";
        column[4] = "redo_qty";
        column[5] = "s1";
        column[6] = "s3";
        column[7] = "s8";
        column[8] = "s6";
        column[9] = "s11";
        column[10] = "s12";
        column[11] = "amt4";
        var sumcontainer = HczyCommon.Summary(arr,column,datas);

        //汇总最后一行
        var total = {};
        for (var j = 0; j < column.length; j++) {
            var arr = column[j];
            total[arr] = 0;
        }
        for (var i = 0; i < sumcontainer.length; i++) {
            for (var j = 0; j < column.length; j++) {
                var arr = column[j];
                if (sumcontainer[i][arr] != undefined) {
                    total[arr] += parseFloat(sumcontainer[i][arr]);
                }
            }
        }
        for (var j = 0; j < column.length; j++) {
            var arr = column[j];
            total[arr] = parseFloat(total[arr]).toFixed(2);
        }
        total.currency_code = "合计";
        sumcontainer.push(total);
        $scope.options_12.api.setRowData(sumcontainer);
        $scope.options_12.api.setSortModel(sortmodel)

        $scope.sum_retain();
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
    //明细
    $scope.columns_11 = [
        {
            headerName: "区域", field: "zone_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "部门", field: "org_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "业务员", field: "sales_user_id", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "商标", field: "brand_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "商检批号", field: "inspection_batchno", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "订单号", field: "pi_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "类型", field: "line_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: []
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "工厂机型号", field: "item_h_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "工厂机型号（内机）", field: "info20", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "工厂机型号（外机）", field: "info23", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "内机编码", field: "erp_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "外机编码", field: "erp_code1", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "生产内机编码", field: "info18", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "生产外机编码", field: "info19", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "数量", field: "prod_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "换算数量", field: "require_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "审核产品档次", field: "bigc_name", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "货币", field: "currency_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "指导价", field: "guide_p6", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "指导价价差", field: "std_c_price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "指导总额RMB", field: "amt7", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "标准价", field: "std_p4", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "标准价价差", field: "std_c_cl_cb", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "标准成本额RMB", field: "amt6", editable: false, filter: 'set', width: 130,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "业务结算价", field: "p6", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "业务选配结算差价", field: "c_price", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "业务选配结算成本额", field: "new_qty", editable: false, filter: 'set', width: 200,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "FOB销售价", field: "price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "FOB销售额", field: "prod_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "FOB销售额RMB", field: "amt5", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "佣金比例（%）", field: "commission_rate", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "配件比例（%）", field: "part_rate_byhand", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "信保比率（%）", field: "xb_rate", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "返利率（%）", field: "rebate_rate", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "免费广告物料比率（%）", field: "material_rate", editable: false, filter: 'set', width: 200,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "结算利润率", field: "amt1", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "指导毛利率（%）", field: "hguide_hwmlv", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "下单时间", field: "prod_time", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",
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
        }, {
            headerName: "付款方式", field: "payment_type_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "天数", field: "days", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "佣金", field: "s1", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "资本成本", field: "s3", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "海运费", field: "s8", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "保险费", field: "s6", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "OA投保费", field: "s11", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "其他费用", field: "s12", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "制造费用", field: "amt4", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "月份", field: "months", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "贸易类型", field: "sale_ent_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "预计出货日期", field: "pre_ship_date", editable: false, filter: 'set', width: 130,
            cellEditor: "年月日",
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
    //汇总
    $scope.columns_12 = [
        {
            headerName: "贸易类型", field: "sale_ent_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: [{value: 1, desc: '进出口贸易'}, {value: 2, desc: '香港转口贸易'}, {value: 3, desc: '香港直营'}]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide:false
        },{
            headerName: "区域", field: "zone_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide:false
        }, {
            headerName: "部门", field: "org_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide:false
        }, {
            headerName: "客户", field: "cust_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide:false
        }, {
            headerName: "商检批号", field: "inspection_batchno", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide:false
        }, {
            headerName: "币种", field: "currency_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide:false
        }, {
            headerName: "数量", field: "prod_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "换算数量", field: "require_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "FOB销售额", field: "prod_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "结算成本", field: "new_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "工厂成本", field: "redo_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "佣金", field: "s1", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "资本成本", field: "s3", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "海运费", field: "s8", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "保险费", field: "s6", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "OA投保费", field: "s11", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "其他费用", field: "s12", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "制造费用", field: "amt4", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.options_12 = {
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
            var isGrouping = $scope.options_12.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.initdata();
}

//加载控制器
finmanControllers
    .controller('sale_list', sale_list);
