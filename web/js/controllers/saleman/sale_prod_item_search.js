var basemanControllers = angular.module('inspinia');
function sale_prod_item_search($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_prod_item_search = HczyCommon.extend(sale_prod_item_search, ctrl_bill_public);
    sale_prod_item_search.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_months_plan_list",
        key: "plan_id",
        //  wftempid:10008,
        FrmInfo: {},
        grids: [{optionname: 'options_70', idname: 'sale_months_plan_lineofsale_months_plan_headers'},
            {optionname: 'options_7', idname: 'sale_months_plan_lineofsale_months_plan_headers'}]
    };
    /**********************初始化**************/
//搜索条件清空
    $scope.areaclear = function () {

        $scope.data.currItem.area_name = "";
		  $scope.data.currItem.area_ids = "";
    }
    $scope.orgclear = function () {
        $scope.data.currItem.org_codea = "";
        $scope.data.currItem.org_name = "";
    }
    $scope.custclear = function () {
        $scope.data.currItem.cust_codea = "";
        $scope.data.currItem.cust_name = "";
    }
    /***************************弹出框***********************/
    $scope.selectarea = function () {
        $scope.FrmInfo = {
            type: "checkbox",
            backdatas: "orgs",
            classid: "scporg",
            sqlBlock: "stat =2 and orgtype in (3)"
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (items) {
            if (items.length == 0) {
                return
            }
            var ids = '', names = '', ids = [], codes = [];
            for (var i = 0; i < items.length; i++) {
                names += items[i].orgname + ',';
                ids += items[i].orgid + ',';
                codes += items[i].code + ',';
            }
            names = names.substring(0, names.length - 1);
            ids = ids.substring(0, ids.length - 1);
            codes = codes.substring(0, ids.length - 1);
            $scope.data.currItem.area_name = names;
            $scope.data.currItem.area_code = codes;
            $scope.data.currItem.area_ids = ids;
        });
    }
	
    $scope.selectorg = function () {
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
            $scope.data.currItem.org_codea = result.code;
            $scope.data.currItem.org_name = result.orgname
        });

    }
    $scope.selectcust = function () {
        $scope.FrmInfo = {
            classid: "customer",
        };
        if ($scope.data.currItem.org_id == undefined || $scope.data.currItem.org_id == "") {
            $scope.FrmInfo.sqlBlock = "1=1"
        }
        else {
            $scope.FrmInfo.sqlBlock = "(org_id=" + $scope.data.currItem.org_id
                + " or other_org_ids like '%," + $scope.data.currItem.org_id + ",%')";
        }
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.cust_codea = result.sap_code;
            $scope.data.currItem.cust_code = result.sap_code;
            $scope.data.currItem.cust_name = result.cust_name;

        });
    }
    //查询
    $scope.search = function () {
        var sqlBlock = " 1=1 ";
       // sqlBlock = BasemanService.getSqlWhereBlock(sqlBlock);
        if($scope.data.currItem.cust_codea!="" && $scope.data.currItem.cust_codea!=undefined){
            sqlBlock+="and Cust_Code like '%"+$scope.data.currItem.cust_codea+"%'";
        }
        if($scope.data.currItem.org_codea!="" && $scope.data.currItem.org_codea!=undefined){
            sqlBlock+="and Org_Code like '%"+$scope.data.currItem.org_codea+"%'";
        }
        if($scope.data.currItem.notice_no!="" && $scope.data.currItem.notice_no!=undefined){
            sqlBlock+="and Notice_No like '%"+$scope.data.currItem.notice_no+"%'";
        }
        if($scope.data.currItem.warn_no!="" && $scope.data.currItem.warn_no!=undefined){
            sqlBlock+="and warn_no like '%"+$scope.data.currItem.warn_no+"%'";
        }
        if($scope.data.currItem.pi_no!="" && $scope.data.currItem.pi_no!=undefined){
            sqlBlock+="and pi_no like '%"+$scope.data.currItem.pi_no+"%'";
        }
        if($scope.data.currItem.pino_new!="" && $scope.data.currItem.pino_new!=undefined){
            sqlBlock+="and Pino_New like '%"+$scope.data.currItem.pino_new+"%'";
        }
        if($scope.data.currItem.pino_new!="" && $scope.data.currItem.pino_new!=undefined){
            sqlBlock+="and Pino_New like '%"+$scope.data.currItem.pino_new+"%'";
        }
        if($scope.data.currItem.startdate!="" && $scope.data.currItem.startdate!=undefined){
            sqlBlock+=" and Check_Time >= to_date('"+$scope.data.currItem.startdate+"',"+"'YYYY-MM-DD')";
        }
        if($scope.data.currItem.startdate!="" && $scope.data.currItem.startdate!=undefined){
            sqlBlock+=" and to_char(Check_Time,'YYYY-MM-DD') <= "+"'"+$scope.data.currItem.enddate+"'";
        }
        var postdata={flag:101,
            sqlwhere:sqlBlock,
            org_code:$scope.data.currItem.area_ids
        };
        BasemanService.RequestPost("sale_ship_notice_header", "search", postdata)
            .then(function (data) {
                var datas=data.sale_prod_itemofsale_ship_notice_headers;
                var mfee=0,d_usd_rate=0,d_eur_rate=0,p_eur_rate=0,y_usd_rate=0,amt=0,
                    namt=0,wamt=0,ncprice=0,wcprice=0,nqty=0,wqty=0;
                for(var i=0 ;i<datas.length;i++ ){
                     mfee=Number(datas[i].mfee);
                     d_usd_rate=Number(datas[i].d_usd_rate);
                     d_eur_rate=Number(datas[i].d_eur_rate);
                     p_eur_rate=Number(datas[i].p_eur_rate);
                     y_usd_rate=Number(datas[i].y_usd_rate);
                     currencyid=Number(datas[i].currency_id);
                   if(datas[i].item_h_name==""&&datas[i].item_h_code==""){
                         namt=Number(datas[i].line_amt);
                         wamt=Number(datas[i].line_amt_to);
                        amt=namt+wamt;
                       {
                           if(currencyid==4||currencyid==5){
                           if(currencyid==4){
                               amt=amt*d_usd_rate;
                           }
                           if(currencyid==5){
                               amt=amt;
                           }
                       }
                       else {
                           amt=amt*d_eur_rate;
                       }
                           datas[i].sendamtrmb=amt;
                       }
                       {
                           if(currencyid==4||currencyid==5){
                               if(currencyid==4){
                                   amt=namt+wamt;
                               }
                               if(currencyid==5){
                                   amt=(amt)/d_usd_rate
                               }
                           }
                           else {
                               amt=amt*d_eur_rate/d_usd_rate;
                           }
                           datas[i].sendamtusd=amt;
                           datas[i]["sendamt3"]=0
                           // datas[i].sendamt3=0;
                       }
                   }
                 if(datas[i].item_h_code!=""){
                      namt=Number(datas[i].line_amt);
                      wamt=Number(datas[i].line_amt_to);
                      amt=namt+wamt;
                     {
                         if(currencyid==4||currencyid==5){
                             if(currencyid==4){
                                 amt=amt*d_usd_rate;
                             }
                             if(currencyid==5){
                                 amt=amt/1.17;
                             }
                         }
                         else {
                             amt=amt*d_eur_rate;
                         }
                         datas[i].sendamtrmb=amt;
                     }
                     {
                         if(currencyid==4||currencyid==5){
                             if(currencyid==4){
                                 amt=namt+wamt;
                             }
                             if(currencyid==5){
                                 amt=(amt)/d_usd_rate/1.17;
                             }
                         }
                         else {
                             amt=amt*d_eur_rate/d_usd_rate;
                         }
                         datas[i].sendamtusd=amt;
                     }
                     {
                         namt=Number(datas[i].total_guide_p6);
                         wamt=Number(datas[i].total_guide_p6_to);
                         nqty=Number(datas[i].out_qty);

                         wqty=Number(datas[i].out_qty_to);
                         ncprice=Number(datas[i].std_c_price);
                         wcprice=Number(datas[i].std_c_price_to);
                         amt=namt +wamt + nqty*ncprice + wqty*wcprice;

                         if(currencyid==4||currencyid==5){
                             if(currencyid==4){
                                 amt=amt*y_usd_rate
                             }
                             if(currencyid==5){
                                 amt=(amt/1.17)
                             }
                         }
                         else {
                             amt=amt*p_eur_rate
                         }
                         datas[i].guideamtrmb=amt;
                     }
                     {
                         namt=Number(datas[i].std_p6);
                         wamt=Number(datas[i].std_p6_to);
                         nqty=Number(datas[i].out_qty);

                         wqty=Number(datas[i].out_qty_to);
                         ncprice=Number(datas[i].std_c_cl_cb);
                         wcprice=Number(datas[i].std_c_cl_cb_to);

                         if(currencyid==4||currencyid==5){
                             if(currencyid==4){
                                 amt=amt*y_usd_rate
                             }
                             if(currencyid==5){
                                 amt=(amt/1.17)
                             }
                         }
                         else {
                             amt=amt*p_eur_rate
                         }
                         datas[i].stdamtrmb=amt;
                     }
                     {
                         namt=Number(datas[i].p4);
                         wamt=Number(datas[i].p4_to);
                         nqty=Number(datas[i].out_qty);

                         wqty=Number(datas[i].out_qty_to);
                         ncprice=Number(datas[i].c_price);
                         wcprice=Number(datas[i].c_price_to);
                         namt=namt*nqty ;
                         wamt=wamt*wqty;
                         amt =namt +wamt + nqty*ncprice + wqty*wcprice;
                         if(currencyid==4||currencyid==5){
                             if(currencyid==4){
                                 amt=amt*y_usd_rate
                             }
                             if(currencyid==5){
                                 amt=(amt/1.17)
                             }
                         }
                         else {
                             amt=amt*p_eur_rate
                         }
                         datas[i].ysamtrmb2=amt;
                     }
                     {
                         ncprice=Number(datas[i].n_price+datas[i].n_p1);
                         wcprice=Number(datas[i].w_price+datas[i].w_p1);
                         amt = Number(nqty*ncprice + wqty*wcprice);
                         datas[i]["sendamt3"]=amt;
                     }
                 }
                }
                $scope.gridSetData("options_70", data.sale_prod_itemofsale_ship_notice_headers);
            })
    }
    //汇总
    $scope.clickchange1=function(){
        if ($scope.data.currItem.k1 == 2) {
            $scope.options_7.columnApi.hideColumns(["zone_name"]);
            var model=[{colId:"zone_name",sort:"desc"}]//asc desc
            $scope.options_7.api.setSortModel(model)
        }else{$scope.options_7.columnApi.setColumnsVisible(["zone_name"])}
    };
    $scope.sum_line = function (arr, column, datas) {
        $scope.gridSetData("options_7", "");
        $scope.sumcontainer = [];
        var arr = [], column = [];
        var data = $scope.gridGetData("options_70");
        if ($scope.data.currItem.k1 == 2) {//大区
            arr.push("zone_name");
        }
        if ($scope.data.currItem.k2 == 2) {//部门
            arr.push("org_name");
        }
        if ($scope.data.currItem.k3 == 2) {//客户
            arr.push("cust_code");
        }
        column[0] = "h_num";
        column[1] = "out_qty";
        column[2] = "out_qty_to";
        var sumcontainer = HczyCommon.Summary(arr, column, data);

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
        total.org_code = "合计";
        sumcontainer.push(total);
        $scope.options_7.api.setRowData(sumcontainer);
        // $scope.num2();
    };
    /************************网格定义区域**************************/
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
    $scope.columns_70 = [{
        headerName: "发货通知单号", field: "notice_no", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "出货预告号", field: "warn_no", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "PI号", field: "pi_no", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "合同号", field: "pino_new", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "商检批次", field: "inspection_batchnos", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "业务部门", field: "org_name", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
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
        headerName: "客户等级", field: "cust_level", editable: false, filter: 'set', width: 100,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: 'S'}, {value: 2, desc: 'A'}, {value: 3, desc: 'B'},
                {value: 4, desc: 'C'}, {value: 5, desc: 'D'}, {value: 6, desc: 'O'},
                {value: 7, desc: 'E'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "业务员", field: "sales_user_id", editable: false, filter: 'set', width: 120,
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
        headerName: "价格条款", field: "price_type_name", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "品牌名", field: "brand_name", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "发货日期", field: "check_time", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "大区", field: "zone_name", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "国家", field: "area_name", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "目的国", field: "to_area_name", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "币种", field: "currency_name", editable: false, filter: 'set', width: 100,
        cellEditor: "复选框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "贸易类型", field: "sale_ent_type", editable: false, filter: 'set', width: 120,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: '进出口贸易'}, {value: 2, desc: '香港转口贸易'}, {value: 3, desc: '香港直营'},
                {value: 5, desc: '工厂直营'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "行类型", field: "pro_type", editable: false, filter: 'set', width: 120,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: '整机'}, {value: 2, desc: '内机'}, {value: 3, desc: '外机'},
                {value: 4, desc: '配件'}, {value: 5, desc: '样机'}, {value: 6, desc: 'SKD'},
                {value: 7, desc: 'CKD'}, {value: 8, desc: '支架或木托'}, {value: 9, desc: '促销品'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "整机编码", field: "item_h_code", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "整机描述", field: "item_h_name", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "整机数量", field: "h_num", editable: false, filter: 'set', width: 90,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "整机价格", field: "h_price", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "发货总额(RMB)", field: "sendamtrmb", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "发货总额(USD)", field: "sendamtusd", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "指导价总额(RMB)", field: "guideamtrmb", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "标准价值链总额(RMB)", field: "stdamtrmb", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "预算价总额(RMB)", field: "ysamtrmb2", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "发货成本总额(RMB)", field: "sendamt3", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "信保比率", field: "xb_rate", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "佣金比率", field: "commission_rate", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "资金成本率", field: "interest_rate", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "返利率", field: "rebate_rate", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "免费广告物料比率(%)", field: "material_rate", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "回款期限", field: "days", editable: false, filter: 'set', width: 100,
        cellEditor: "复选框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "免费配件比率", field: "part_rate_byhand", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "生产定金比率", field: "contract_subscrp", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "发货定金比率", field: "shipment_subscrp", editable: false, filter: 'set', width: 120,
        cellEditor: "复选框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: '内机信息',
        children: [
            {
                headerName: "ERP编码", field: "erp_code", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "客户产品描述", field: "updator", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "发货数量", field: "out_qty", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "发货价格", field: "price", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "发货金额", field: "line_amt", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "指导价", field: "guide_p6", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "指导价总额", field: "total_guide_p6", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "预算价", field: "p4", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "标准价", field: "std_p6", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "发货成本(RMB)", field: "n_price", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "制造费用", field: "n_p1", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "指导价选配差价", field: "std_c_price", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "预算选配差价", field: "c_price", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "标准选配差价", field: "std_c_cl_cb", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }, {
        headerName: '外机信息',
        children: [
            {
                headerName: "ERP产品编码", field: "erp_code_to", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "发货数量", field: "out_qty_to", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "发货价格", field: "price_to", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "发货金额", field: "line_amt_to", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "指导价", field: "guide_p6_to", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "指导价总额", field: "total_guide_p6_to", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "预算价", field: "p4_to", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "标准价", field: "std_p6_to", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "发货成本(RMB)", field: "w_price", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "制造费用", field: "w_p1", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "指导价选配差价", field: "std_c_price_to", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "预算选配差价", field: "c_price_to", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "标准选配差价", field: "std_c_cl_cb_to", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }];
    $scope.options_70 = {
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
            var isGrouping = $scope.options_70.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_7 = [{
        headerName: "大区", field: "zone_name", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "业务部门", field: "org_name", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "整机数量", field: "h_num", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "内机发货数量", field: "out_qty", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "外机发货数量", field: "out_qty_to", editable: false, filter: 'set', width: 170,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }];
    $scope.options_7 = {
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
            var isGrouping = $scope.options_7.columnApi.getRowGroupColumns().length > 0;
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
basemanControllers
    .controller('sale_prod_item_search', sale_prod_item_search);
