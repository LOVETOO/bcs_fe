var finmanControllers = angular.module('inspinia');
function sale_xdmxdst_search($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_xdmxdst_search = HczyCommon.extend(sale_xdmxdst_search, ctrl_bill_public);
    sale_xdmxdst_search.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_list",
        /*     key: "funds_id",*/
        wftempid: 10008,
        FrmInfo: {
            /* sqlBlock: "funds_type=2",*/
        },
        grids: [{optionname: 'options_11', idname: 'sale_lists'}, {
         optionname: 'options_12',
         idname: 'sale_lists'
         }/*, {optionname: 'options_13', idname: 'fin_funds_xypmoffin_funds_headers'}*/]
    };
    //下拉
    $scope.betd1 = [
        {
        id: 1,
        name: "",
    }, {
        id: 2,
        name: "已开票",
    }, {
        id: 3,
        name: "未开票",
    }]
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        $scope.stat = data.dicts;
    })

    /*查询*/
    $scope.search = function () {
        var date1 = $scope.data.currItem.start_date;
        var date2 = $scope.data.currItem.end_date;
        var sqlBlock = "";
        if (date1 > date2) {
            BasemanService.notice("起始日期不能大于截止日期", "alert-warning");
            return;
        }
		if( $scope.data.currItem.time_flag=="" ||  $scope.data.currItem.time_flag==undefined){
			 $scope.data.currItem.time_flag=2;
		}
        sqlBlock = "";
        //BasemanService.getSqlWhereBlock(sqlBlock);
        var postdata = {
            flag: 14,
            sqlwhere: sqlBlock,
            start_date: $scope.data.currItem.start_date,
            end_date: $scope.data.currItem.end_date,
            check_time: $scope.data.currItem.check_time,
            org_id: $scope.data.currItem.org_id,
            org_code: $scope.data.currItem.org_code,
            notice_time: $scope.data.currItem.notice_time,
            chk4: $scope.data.currItem.chk4,
            cust_id: $scope.data.currItem.cust_id,
            cust_code: $scope.data.currItem.cust_code,
			time_flag: $scope.data.currItem.time_flag,
            inspection_batchno: $scope.data.currItem.inspection_batchno
        };
        BasemanService.RequestPost("sale_list", "search", postdata)
            .then(function (data) {
                $scope.data.currItem.sale_lists = data.sale_lists;
                $scope.options_11.api.setRowData(data.sale_lists);
            });
    }

    $scope.selectcode = function () {

        $scope.FrmInfo = {

            classid: "scporg",
            postdata: {},
            sqlBlock: "scporg.Stat =2 and OrgType in (5, 14)",
            backdatas: "orgs",

        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_id = result.orgid;
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_name = result.orgname
        });

    }


    $scope.selectcust = function () {

        if ($scope.data.currItem.org_code == undefined || $scope.data.currItem.org_code == "") {
            BasemanService.notice("请先选业务部门", "alert-warning");
            return;
        }

        $scope.FrmInfo = {
            title: "客户",
            thead: [
                {
                    name: "客户编码",
                    code: "cust_code",
                    show: true,
                    iscond: true,
                    type: 'string'

                }, {
                    name: "SAP编码",
                    code: "sap_code",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "客户名称",
                    code: "cust_name",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "客户描述",
                    code: "cust_desc",
                    show: true,
                    iscond: true,
                    type: 'string'
                }],
            is_custom_search: true,
            is_high: true,
            classid: "customer",
            sqlBlock: "org_id = " + $scope.data.currItem.org_id
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (result) {
            $scope.data.currItem.cust_code = result.cust_code;
            $scope.data.currItem.cust_name = result.cust_name;
            $scope.data.currItem.cust_id = result.cust_id;
        });

    }
    /*清空*/
    $scope.clear = function () {
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
    /**********************隐藏、显示*************************/
	//汇总    

    $scope.clickchange3=function(){
        if ($scope.data.currItem.check3 != true) {
            $scope.options_12.columnApi.setColumnsVisible(["org_name"]);
        }else{
            $scope.options_12.columnApi.hideColumns(["org_name"]);
			$scope.options_12.columnApi.setColumnsVisible(["months"]);
		    $scope.options_12.columnApi.setColumnsVisible(["s12"]);
			$scope.options_12.columnApi.setColumnsVisible(["s11"]);
			$scope.options_12.columnApi.setColumnsVisible(["s6"]);
		    $scope.options_12.columnApi.setColumnsVisible(["s8"]);
			$scope.options_12.columnApi.setColumnsVisible(["s3"]);
			$scope.options_12.columnApi.setColumnsVisible(["s1"]);
            if($scope.data.currItem.check4 != true){
                $scope.options_12.columnApi.setColumnsVisible(["cust_name"]);
            }
            if($scope.data.currItem.check5 != true){
                $scope.options_12.columnApi.setColumnsVisible(["zone_name"]);
            }
            if($scope.data.currItem.check6!= true){
                $scope.options_12.columnApi.setColumnsVisible(["inspection_batchno"]);
            }
			}
    };
    $scope.clickchange4=function(){
        if ($scope.data.currItem.check4 != true) {
            $scope.options_12.columnApi.setColumnsVisible(["cust_name"]);
        }else{
            $scope.options_12.columnApi.hideColumns(["cust_name"]);
			$scope.options_12.columnApi.setColumnsVisible(["months"]);
		    $scope.options_12.columnApi.setColumnsVisible(["s12"]);
			$scope.options_12.columnApi.setColumnsVisible(["s11"]);
			$scope.options_12.columnApi.setColumnsVisible(["s6"]);
		    $scope.options_12.columnApi.setColumnsVisible(["s8"]);
			$scope.options_12.columnApi.setColumnsVisible(["s3"]);
			$scope.options_12.columnApi.setColumnsVisible(["s1"]);
            if($scope.data.currItem.check3 != true){
                $scope.options_12.columnApi.setColumnsVisible(["org_name"]);
            }
            if($scope.data.currItem.check5 != true){
                $scope.options_12.columnApi.setColumnsVisible(["zone_name"]);
            }
            if($scope.data.currItem.check6!= true){
                $scope.options_12.columnApi.setColumnsVisible(["inspection_batchno"]);
            }
			}
    };
	 $scope.clickchange5=function(){
        if ($scope.data.currItem.check5 != true) {
            $scope.options_12.columnApi.setColumnsVisible(["zone_name"]);
        }else{
            $scope.options_12.columnApi.hideColumns(["zone_name"]);
			$scope.options_12.columnApi.setColumnsVisible(["months"]);
		    $scope.options_12.columnApi.setColumnsVisible(["s12"]);
			$scope.options_12.columnApi.setColumnsVisible(["s11"]);
			$scope.options_12.columnApi.setColumnsVisible(["s6"]);
		    $scope.options_12.columnApi.setColumnsVisible(["s8"]);
			$scope.options_12.columnApi.setColumnsVisible(["s3"]);
			$scope.options_12.columnApi.setColumnsVisible(["s1"]);
            if($scope.data.currItem.check3 != true){
                $scope.options_12.columnApi.setColumnsVisible(["org_name"]);
            }
            if($scope.data.currItem.check4 != true){
                $scope.options_12.columnApi.setColumnsVisible(["cust_name"]);
            }
            if($scope.data.currItem.check6!= true){
                $scope.options_12.columnApi.setColumnsVisible(["inspection_batchno"]);
            }
			}
    };
    $scope.clickchange6=function(){
        if ($scope.data.currItem.check6 != true) {
            $scope.options_12.columnApi.setColumnsVisible(["inspection_batchno"]);
        }else{
            $scope.options_12.columnApi.hideColumns(["inspection_batchno"]);
			$scope.options_12.columnApi.setColumnsVisible(["months"]);
		    $scope.options_12.columnApi.setColumnsVisible(["s12"]);
			$scope.options_12.columnApi.setColumnsVisible(["s11"]);
			$scope.options_12.columnApi.setColumnsVisible(["s6"]);
		    $scope.options_12.columnApi.setColumnsVisible(["s8"]);
			$scope.options_12.columnApi.setColumnsVisible(["s3"]);
			$scope.options_12.columnApi.setColumnsVisible(["s1"]);
            if($scope.data.currItem.check3 != true){
                $scope.options_12.columnApi.setColumnsVisible(["org_name"]);
            }
            if($scope.data.currItem.check4 != true){
                $scope.options_12.columnApi.setColumnsVisible(["cust_name"]);
            }
            if($scope.data.currItem.check5!= true){
                $scope.options_12.columnApi.setColumnsVisible(["zone_name"]);
            }
			}
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
        if (  $scope.data.currItem.check2 == false && $scope.data.currItem.check3 == false
            && $scope.data.currItem.check4 == false && $scope.data.currItem.check5 == false) {
            BasemanService.notice("请选择条件再汇总!", "alert-warning");
            return;
        }
        $scope.sumcontainer = [];
        var arr = [], column = [];
        var sortmodel=[];
        var data = $scope.gridGetData("options_11");
     
        if ($scope.data.currItem.check3 == true) {
            arr.push("org_name");
            $scope.options_12.columnApi.hideColumns(["org_name"])
            sortmodel.push({colId:"org_name",sort:"desc"})
        }
        if ($scope.data.currItem.check4 == true) {
            arr.push("cust_name");
            $scope.options_12.columnApi.hideColumns(["cust_name"])
            sortmodel.push({colId:"cust_name",sort:"desc"})
        }
        if ($scope.data.currItem.check5 == true) {
            arr.push("zone_name");
            $scope.options_12.columnApi.hideColumns(["zone_name"])
            sortmodel.push({colId:"zone_name",sort:"desc"})
        }
        if ($scope.data.currItem.check6 == true) {
            arr.push("inspection_batchno");
            $scope.options_12.columnApi.hideColumns(["inspection_batchno"])
            sortmodel.push({colId:"cust_name",sort:"desc"})
        }
		
        column[0] = "redo_qty";            
        column[1] = "new_qty";
        column[2] = "prod_amt";
        column[3] = "require_qty";
        column[4] = "pi_no";
        column[5] = "amount2";
        column[6] = "amount1";
        column[7] = "amount0";
        column[8] = "allow_amt";
        column[9] = "rec_amount";
        column[10] = "s12";
        column[11] = "amt4";
        var sumcontainer = HczyCommon.Summary(arr,column,data);

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
        total.brand_name = "合计";
        sumcontainer.push(total);
        $scope.options_12.api.setRowData(sumcontainer);
        $scope.options_12.api.setSortModel(sortmodel)

        $scope.sum_retain();
    };
    //搜索条件清空
    $scope.areaclear = function () {

        $scope.data.currItem.area_name = "";
    }
    $scope.orgclear = function () {

        $scope.data.currItem.org_name = "";
        $scope.data.currItem.org_id = "";
    }
    $scope.custclear = function () {

        $scope.data.currItem.cust_name = "";
        $scope.data.currItem.cust_id = "";
    }

    $scope.show_11 = false;
    $scope.show11 = function () {
        $scope.show_11 = !$scope.show_11;
    };
    $scope.show_12 = false;
    $scope.show12 = function () {
        $scope.show_12 = !$scope.show_12;
    };
    $scope.cheked2 = function () {
        if ($scope.data.currItem.deliver_date) {
            $scope.data.currItem.notice_time = false;
            $scope.data.currItem.time_flag = 1;
        }
    }
    $scope.cheked = function () {
        if ($scope.data.currItem.notice_time) {
            $scope.data.currItem.deliver_date = false;
            $scope.data.currItem.time_flag = 2;
        } 
    }

    //隐藏区域
    $scope.show_11 = false;
    $scope.show_sap = function () {
        $scope.show_11 = !$scope.show_11;
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
    //单据明细
    $scope.columns_11 = [
        {
            headerName: "区域", field: "zone_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            /*            cellEditorParams: {
             values: [{value: "1", desc: "空调组织"}]
             },*/
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
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
            headerName: "商标", field: "brand_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "商标批号", field: "inspection_batchno", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "订单号", field: "pi_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "工厂标机型号", field: "item_h_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "工厂成产型号（内机）", field: "info20", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "工厂生产型号（外型）", field: "info23", editable: false, filter: 'set', width: 100,
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
            headerName: "生产内机编码", field: "info18", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "生产外机编码", field: "info19", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "数量", field: "prod_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "换算数量", field: "require_qty", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "审核产品档次", field: "bigc_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "货币", field: "currency_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "审核结算价", field: "p6", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "审核附加价", field: "c_price", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "指导价", field: "guide_p6", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "指导价价差", field: "std_c_price", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "FOB销售价", field: "price", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "FOB销售额", field: "prod_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "结算成本", field: "new_qty", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "工厂成本", field: "redo_qty", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "佣金比例（%）", field: "commission_rate", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "配件比例（%）", field: "part_rate_byhand", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "信保比率（%）", field: "xb_rate", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "结算利润率", field: "amt1", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "下单时间", field: "prod_time", editable: false, filter: 'set', width: 150,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "付款方式", field: "payment_type_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "天数", field: "days", editable: false, filter: 'set', width: 150,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "佣金", field: "s1", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "资金成本", field: "s3", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "海运费", field: "s8", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "保险费", field: "s6", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "OA投保费", field: "s11", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "其他费用", field: "s12", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "月份", field: "months", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "贸易类型", field: "sale_ent_type", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "预计出货日期", field: "pre_ship_date", editable: false, filter: 'set', width: 150,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];
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
    //产品部信息
    $scope.columns_12 = [{
            headerName: "区域", field: "zone_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            /*            cellEditorParams: {
             values: [{value: "1", desc: "空调组织"}]
             },*/
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "部门", field: "org_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "业务员", field: "sales_user_id", editable: false, filter: 'set', width: 150,
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
            headerName: "商品批号", field: "inspection_batchno", editable: false, filter: 'set', width: 100,
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
        }
        , {
            headerName: "数量", field: "prod_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "换算数量", field: "require_qty", editable: false, filter: 'set', width: 100,
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
            headerName: "资金成本", field: "s3", editable: false, filter: 'set', width: 100,
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
            headerName: "月份", field: "months", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];
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
    .controller('sale_xdmxdst_search', sale_xdmxdst_search);