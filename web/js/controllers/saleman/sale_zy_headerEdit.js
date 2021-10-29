var billmanControllers = angular.module('inspinia');
function sale_zy_headerEdit($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService, notify) {
    //继承基类方法
    sale_zy_headerEdit = HczyCommon.extend(sale_zy_headerEdit, ctrl_bill_public);
    sale_zy_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_pi_header",
        key: "pi_id",
        wftempid: 11014,
        FrmInfo: {
            title: "散件专用机型",
            is_high: true,
            is_custom_search: true,
            thead: [
                {
                    name: "形式发票",
                    code: "pi_no",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "客户",
                    code: "cust_name",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "产品大类",
                    code: "item_type_name",
                    show: true,
                    iscond: true,
                    type: 'string'
                },
                {
                    name: "订单日期",
                    code: "pi_date",
                    show: true,
                    iscond: true,
                    type: 'date'
                },
                {
                    name: "部门",
                    code: "org_name",
                    show: true,
                    iscond: false,
                    type: 'string'
                },
                {
                    name: "PI总金额",
                    code: "amt_total",
                    show: true,
                    iscond: false,
                    type: 'string'
                },
                {
                    name: "订单类型",
                    code: "sale_order_type",
                    show: true,
                    iscond: true,
                    type: 'list',
                    dicts: [{id: 1, name: "外销常规订单"}, {id: 2, name: "外销配件订单"}, {id: 3, name: "内销订单"}, {
                        id: 4,
                        name: "样机订单"
                    }, {id: 5, name: "散件订单"}, {id: 6, name: "散件样机订单"}, {id: 7, name: "外贸订单"}]
                },
                {
                    name: "价格条款",
                    code: "price_type_id",
                    show: true,
                    iscond: true,
                    type: 'list',
                    dicts: [{id: 79, name: "CIF"}, {id: 80, name: "CFR"}, {id: 81, name: "FOB"}]
                },
                {
                    name: "付款方式",
                    code: "payment_type_name",
                    show: true,
                    iscond: false,
                    type: 'string'
                },
                {
                    name: "品牌名",
                    code: "brand_name",
                    show: true,
                    iscond: false,
                    type: 'string'
                },
                {
                    name: "状态",
                    code: "stat",
                    show: true,
                    iscond: true,
                    type: 'list',
                    dicts: [{id: 1, name: "制单"}, {id: 3, name: "启动"}, {id: 5, name: "审核"}, {id: 99, name: "关闭"}]
                },
                {
                    name: "备注",
                    code: "note",
                    show: true,
                    iscond: true,
                    type: 'string'
                }],
            sqlBlock: "nvl(bill_flag,0)=2 and pi_no like 'ZY%'",
        },
        grids: [{optionname: 'options_15', idname: 'sale_pi_area_attributeofsale_pi_headers'},//机型参数
            {optionname: 'options_16', idname: 'sale_pi_item_mbdataofsale_pi_headers'},//机型面板

            {
                optionname: 'options_21',
                idname: 'sale_pi_item_h_lineofsale_pi_headers',
                line: {optionname: "options_22", idname: "sale_pi_item_lineofsale_pi_item_h_lines"}
            },//订单明细  分体机
            {optionname: 'options_23', idname: 'sale_pi_item_partofsale_pi_headers'},//配件清单

            {optionname: 'options_31', idname: 'sale_pi_item_conf2ofsale_pi_headers'},//当前机型
            {optionname: 'options_32', idname: 'sale_pi_item_confofsale_pi_headers'},//所有机型

            {
                optionname: 'options_41',
                idname: 'sale_pi_item_lineofsale_pi_headers',
            },
            {
                optionname: 'options_42',
                idname: 'sale_pi_item_lineofsale_pi_headers',
            },
            {
                optionname: 'options_43',
                idname: 'sale_pi_item_bom_lineofsale_pi_headers',
            }
        ]
    }

    /**导出Excel*/
    $scope.exportjy2 = function () {
        if (!$scope.data.currItem.pi_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        BasemanService.RequestPost("sale_pi_header", "exporttoexceljy2", {'pi_id': $scope.data.currItem.pi_id})
            .then(function (data) {
                if (data.docid != undefined && Number(data.docid) != 0) {
                    var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                    window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                } else {
                    BasemanService.notice("导出失败!", "alert-info");
                }
            });
    }
    $scope.exportjy3 = function () {
        if (!$scope.data.currItem.pi_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        BasemanService.RequestPost("sale_pi_header", "exporttoexceljy3", {'pi_id': $scope.data.currItem.pi_id})
            .then(function (data) {
                if (data.docid != undefined && Number(data.docid) != 0) {
                    var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                    window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                } else {
                    BasemanService.notice("导出失败!", "alert-info");
                }
            });
    }
    $scope.exportjy4 = function () {
        if (!$scope.data.currItem.pi_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        BasemanService.RequestPost("sale_pi_header", "exporttoexceljy4", {'pi_id': $scope.data.currItem.pi_id})
            .then(function (data) {
                if (data.docid != undefined && Number(data.docid) != 0) {
                    var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                    window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                } else {
                    BasemanService.notice("导出失败!", "alert-info");
                }
            });
    }

    /************************初始化页面***********************/
    /***********************保存校验区域*********************/
    $scope.validate = function () {
        var l=0,k=0,sum=0;
        var nodes=$scope.options_23.api.getModel().rootNode.childrenAfterSort;
        var nodes1=$scope.options_21.api.getModel().rootNode.childrenAfterSort;
        var errorlist = [];
        for(var i=0;i<nodes.length;i++){
            l+=parseInt(nodes[i].data.require_qty||0)*parseFloat(nodes[i].data.psale_price||0);
        }
        for(var i=0;i<nodes1.length;i++){
            if(parseInt(nodes1[i].data.line_type)!=4&&parseInt(nodes1[i].data.line_type)!=5&&parseInt(nodes1[i].data.line_type)!=8){
                if(parseFloat(nodes1[i].data.price||0)==0){
                    errorlist.push("第"+(i+1)+"行类型为整机、内机、外机、CKD、SKD时，销售价不能为0");
                }
            }
            if(parseInt(nodes1[i].line_type)!=4){
                k+=parseFloat(nodes1[i].data.sale_amt);
            }
        }
        for(var i=0;i<nodes1.length;i++){
            if(parseInt(nodes1[i].data.line_type)!=4){
                if(parseFloat(nodes1[i].data.guide_p6||0)==0||parseFloat(nodes1[i].data.p4||0)==0||parseFloat(nodes1[i].data.std_p4||0)==0){
                    errorlist.push("第"+(i+1)+"行指导价、业务结算价、标准结算价不能为0");
                }
            }
        }
        if (errorlist.length) {
            BasemanService.notify(notify,errorlist, "alert-danger");
            return false;
        }
        return true;
    }
    /***********************保存校验区域*********************/

    /**--------------------提交前校验------------------------*/
    $scope.wfstart_before =function(){
        var data=$scope.gridGetData("options_21");
        if(data.length==0){
            BasemanService.notice("标机未选","alert-warning");
            return;
        }
        for(var i=0;i<data.length;i++){
            if(parseInt(data[i].line_type)==4&&$scope.data.currItem.part_rate_byhand<=0){
                BasemanService.notice("有配件行但是配件比例小于等于0","alert-warning");
                return;
            }
        }
        var count=0;
        for(var i=0;i<data.length;i++){
            if($scope.data.currItem.part_rate_byhand>0){
                if(parseInt(data[i].line_type)==4){
                }else{
                    count++;
                }
            }
        }
        if(count==data.length){
            BasemanService.notice("没有有配件行但是配件比例大于0","alert-warning");
            return;
        }
        if($scope.data.currItem.sale_order_type==5||$scope.data.currItem.sale_order_type==6){
            var data=$scope.gridGetData("options_43");
            for(var i=0;i<data.length;i++){
                if(data[i].ptype_name==""){
                    BasemanService.notice("打散方案第"+(i+1)+"行方案类型为空","alert-warning");
                    return;
                }else{
                    continue;
                }
            }
        }
        if($scope.data.currItem.sale_order_type==5||$scope.data.currItem.sale_order_type==6){
            if($scope.data.currItem.box_send==undefined||$scope.data.currItem.box_send==""){
                BasemanService.notice("散件订单按柜发货不能为空","alert-warning");
                return;
            }
        }else{
            if(parseInt($scope.data.currItem.box_send)==2){
                BasemanService.notice("非散件订单按柜发货不能为是","alert-warning");
                return;
            }
            if(parseInt($scope.data.currItem.stand_bom)==2){
                BasemanService.notice("非散件订单散件专用机型下单不能为是","alert-warning");
                return;
            }
        }

        if(parseInt($scope.data.currItem.sale_order_type)!=2&&parseInt($scope.data.currItem.zb_amt)==0){
            ds.dialog.confirm("制版费为0,是否继续提交？", function () {
                var postdata={};
                postdata.pi_id=$scope.data.currItem.pi_id;

                var obj=BasemanService.RequestPost("sale_pi_header", "commitcheck",postdata)
                obj.then(function (data) {
                    var postdata = {
                        opinion: '',
                        objtypeid: $scope.objconf.wftempid,
                        objid: $scope.data.currItem[$scope.objconf.key], //单据ID
                        wfid: 0 // 流程ID
                    };
                    BasemanService.RequestPost("base_wf", "start", postdata)
                        .then(function (data) {
                            BasemanService.notice("启动成功", "alert-info");
                            $scope.data.currItem.wfid = data.wfid;
                            $scope.data.currItem.stat = data.stat;
                            if (e) e.currentTarget.disabled = false;

                            $scope.refresh(2);
                        }, function (error) {
                            if (e) e.currentTarget.disabled = false;
                        });
                }, function (error) {
                    return;
                })
                return obj;
            },function () {
                return;
            });
        }else{
            var postdata={};
            postdata.pi_id=$scope.data.currItem.pi_id;
            var obj=BasemanService.RequestPost("sale_pi_header", "commitcheck",postdata)
            return obj;
        }


    }
    /**--------------------提交前校验------------------------*/

    $scope.clearinformation = function () {
        $scope.data.currItem.objattachs = [];
        $scope.data.currItem.days = 0;
        $scope.data.currItem.sales_user_id = window.userbean.userid;
        $scope.data.currItem.org_id = window.userbean.org_id;
        $scope.data.currItem.org_name = window.userbean.org_name;
        $scope.data.currItem.org_code = window.userbean.org_code;
        $scope.data.currItem.total_oth = 0;
        $scope.data.currItem.cust_part_rate = 0;
        $scope.data.currItem.commission_rate = 0;
        $scope.data.currItem.currency_id = 4;
        $scope.data.currItem.sale_ent_type = 1;
        $scope.data.currItem.item_type_id = "16";
        $scope.data.currItem.item_type_name = "家用空调";
        $scope.data.currItem.item_type_no = "110";
        $scope.data.currItem.ship_type = 2;
        $scope.data.currItem.valid_date = moment().format('YYYY-MM-DD HH:mm:ss');
        $scope.data.currItem.bill_type = 0;
        $scope.data.currItem.bill_flag = 2;
        $scope.data.currItem.seaport_out_name = "NINGBO";
        $scope.data.currItem.seaport_out_code = "NINGBO";
        $scope.data.currItem.seaport_out_type = "1";
        $scope.data.currItem.seaport_out_id = "771"
        $scope.currencychange();
    }


    //复制历史
    $scope.copy = function () {
        $scope.FrmInfo = {
            classid: "sale_pi_header",
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (result) {
            $scope.data.currItem.copy = 1;
            $scope.data.currItem.pi_id = result.pi_id;
            $scope.refresh(2);
        });

    }

    $scope.save_before = function () {
        for (var i = 0; i < $scope.data.currItem.sale_pi_item_h_lineofsale_pi_headers.length; i++) {
            $scope.data.currItem.sale_pi_item_h_lineofsale_pi_headers[i].seq = parseInt(i + 1);
        }
    }

    /**********************提交前校验*************************/
    $scope.wfstart_before =function(){
        var data=$scope.gridGetData("options_21");
        if(data.length==0){
            BasemanService.notice("标机未选","alert-warning");
            return;
        }
        for(var i=0;i<data.length;i++){
            if(parseInt(data[i].line_type)==4&&$scope.data.currItem.part_rate_byhand<=0){
                BasemanService.notice("有配件行但是配件比例小于等于0","alert-warning");
                return;
            }
        }
        var count=0;
        for(var i=0;i<data.length;i++){
            if($scope.data.currItem.part_rate_byhand>0){
                if(parseInt(data[i].line_type)==4){
                }else{
                    count++;
                }
            }
        }
        if(count==data.length){
            BasemanService.notice("没有有配件行但是配件比例大于0","alert-warning");
            return;
        }
        if($scope.data.currItem.sale_order_type==5||$scope.data.currItem.sale_order_type==6){
            var data=$scope.gridGetData("options_43");
            for(var i=0;i<data.length;i++){
                if(data[i].ptype_name==""){
                    BasemanService.notice("打散方案第"+(i+1)+"行方案类型为空","alert-warning");
                    return;
                }else{
                    continue;
                }
            }
        }
        if($scope.data.currItem.sale_order_type==5||$scope.data.currItem.sale_order_type==6){
            if($scope.data.currItem.box_send==undefined||$scope.data.currItem.box_send==""){
                BasemanService.notice("散件订单按柜发货不能为空","alert-warning");
                return;
            }
        }else{
            if(parseInt($scope.data.currItem.box_send)==2){
                BasemanService.notice("非散件订单按柜发货不能为是","alert-warning");
                return;
            }
            if(parseInt($scope.data.currItem.stand_bom)==2){
                BasemanService.notice("非散件订单散件专用机型下单不能为是","alert-warning");
                return;
            }
        }

        if(parseInt($scope.data.currItem.sale_order_type)!=2&&parseInt($scope.data.currItem.zb_amt)==0){
            ds.dialog.confirm("制版费为0,是否继续提交？", function () {
                var postdata={};
                postdata.pi_id=$scope.data.currItem.pi_id;

                var obj=BasemanService.RequestPost("sale_pi_header", "commitcheck",postdata)
                obj.then(function (data) {
                    var postdata = {
                        opinion: '',
                        objtypeid: $scope.objconf.wftempid,
                        objid: $scope.data.currItem[$scope.objconf.key], //单据ID
                        wfid: 0 // 流程ID
                    };
                    BasemanService.RequestPost("base_wf", "start", postdata)
                        .then(function (data) {
                            BasemanService.notice("启动成功", "alert-info");
                            $scope.data.currItem.wfid = data.wfid;
                            $scope.data.currItem.stat = data.stat;
                            if (e) e.currentTarget.disabled = false;

                            $scope.refresh(2);
                        }, function (error) {
                            if (e) e.currentTarget.disabled = false;
                        });
                }, function (error) {
                    return;
                })
                return obj;
            },function () {
                return;
            });
        }else{
            var postdata={};
            postdata.pi_id=$scope.data.currItem.pi_id;
            var obj=BasemanService.RequestPost("sale_pi_header", "commitcheck",postdata)
            return obj;
        }


    }
    /**--------------------提交前校验------------------------*/

    /**********************下拉框值查询（系统词汇）***************/
    //贸易类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"}).then(function (data) {
        $scope.sale_ent_types = data.dicts;
    })

    //客户等级
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "cust_level"}).then(function (data) {
        $scope.cust_levels = data.dicts;
    })
    //价格条款
    var promise = BasemanService.RequestPostAjax("price_type", "search", "");
    promise.then(function (data) {
        $scope.price_types = [];
        for (var i = 0; i < data.price_types.length; i++) {
            var newobj = {
                dictvalue: parseInt(data.price_types[i].price_type_id),
                dictcode: data.price_types[i].price_type_code,
                dictname: data.price_types[i].price_type_name
            }
            $scope.price_types.push(newobj)
        }
    });
    //订单类型
    $scope.sale_order_types = [{dictvalue: 5, dictname: '散件订单'}, {dictvalue: 6, dictname: '散件样机订单'}]
    //发运方式
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "ship_type"}).then(function (data) {
        $scope.ship_types = data.dicts;
    })
    //汇率
    var promise = BasemanService.RequestPostNoWait("base_currency", "search", "");
    $scope.currencys = HczyCommon.stringPropToNum(promise.data.base_currencys);
    /**网格下拉值*/
    // 类型 line_type
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "line_type"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
            //订单明细
            $scope.columns_21[$scope.getIndexByField("columns_21", "line_type")].cellEditorParams.values.push(newobj);
        }
    })
    // 机型类别 pro_type
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pro_type"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
            //分体机
            $scope.columns_22[$scope.getIndexByField("columns_22", "pro_type")].cellEditorParams.values.push(newobj)
            $scope.columns_41[$scope.getIndexByField("columns_41", "pro_type")].cellEditorParams.values.push(newobj)
        }
    })
    //散件类型 sj_type
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "sj_type"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
            //分体机
            $scope.columns_22[$scope.getIndexByField("columns_22", "sj_type")].cellEditorParams.values.push(newobj);
            //打散-包装方案
            $scope.columns_41[$scope.getIndexByField("columns_41", "sj_type")].cellEditorParams.values.push(newobj);
        }
    })

    /**--------------------下拉框值查询（系统词汇）-------------*/

    /**********************弹出框值查询**************************/
    //部门
    $scope.selectorg = function () {
        if ($scope.data.currItem.stat != 1) {
            return;
        }
        $scope.FrmInfo = {
            classid: "scporg",
            backdatas: "orgs",
        };
        // $scope.FrmInfo.sqlBlock = $scope.getuserorg();
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_id = parseInt(result.orgid);
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_name = result.orgname;
            $scope.data.currItem.area_level = parseInt(result.lev);
        });
    }

    $scope.getuserorg = function () {
        var requestobj = BasemanService.RequestPostNoWait("scpuser", "select", {userid: $scope.data.currItem.creator});
        if (!requestobj.pass) {
            return;
        }
        var sqlwhere = "(1=1";
        var orgusers = requestobj.data.orgofusers;
        for (var i = 0; i < orgusers.length; i++) {
            if (i == 0) {
                sqlwhere = " (orgid=" + orgusers[i].orgid;
            } else {
                sqlwhere += " or orgid=" + orgusers[i].orgid;
            }
        }
        sqlwhere += ")";
        return sqlwhere;
    }

    //业务员查询
    $scope.scpuser = function () {
        if ($scope.data.currItem.stat != 1) {
            return;
        }
        if ($scope.data.currItem.org_id == undefined || $scope.data.currItem.org_id == "") {
            BasemanService.notice("请先选择业务部门", "alert-warning")
            return;
        }
        $scope.FrmInfo = {
            classid: "scpuser",
            postdata: {
                flag: 10
            },
            backdatas: "users",
            sqlBlock: " scporguser.orgid =" + $scope.data.currItem.org_id,
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.sales_user_id = result.userid;
        });
    }

    //客户
    $scope.selectcust = function () {
        if ($scope.data.currItem.stat != 1) {
            return;
        }
        if ($scope.data.currItem.org_id == undefined || $scope.data.currItem.org_id == "") {
            BasemanService.notice("请先选择业务部门", "alert-warning");
            return;
        }
        $scope.FrmInfo = {
            classid: "customer",
            commitRigthNow: true,
            postdata: {},
            sqlBlock: "(org_id=" + $scope.data.currItem.org_id
            + " or other_org_ids like '%," + $scope.data.currItem.org_id + ",%')",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.cust_id = result.cust_id;
            $scope.data.currItem.cust_code = result.sap_code;
            $scope.data.currItem.cust_name = result.cust_name;
            $scope.data.currItem.cust_level = Number(result.cust_level);

            $scope.data.currItem.rebate_rate = result.rebate_rate;// 返利率

            $scope.data.currItem.area_code = result.area_code;
            $scope.data.currItem.area_id = result.area_id;
            $scope.data.currItem.area_name = result.area_name;
            $scope.data.currItem.area_level = result.area_level;
            $scope.data.currItem.manager = result.manager;

            $scope.data.currItem.tel = result.tel;
            $scope.data.currItem.address = result.address;
            $scope.data.currItem.weburl = result.web_url;
            $scope.data.currItem.fax = result.fax;

            $scope.data.currItem.commission_rate = result.commission_rate;
            $scope.data.currItem.sale_ent_type = parseInt(result.sale_ent_type);
            $scope.data.currItem.lc_rate = result.lc_rate;

            $scope.data.currItem.xb_rate = undefined;
            $scope.data.currItem.payment_type_id = undefined;
            $scope.data.currItem.payment_type_name = undefined;
            $scope.data.currItem.payment_type_code = undefined;

            //查询客户时改变的pi(业务逻辑)
            var postdata = {cust_id: parseInt(result.cust_id)};
            $scope.cust_changepi(postdata);
        });

    };


    $scope.item_code42 = function () {
        if ($scope.data.currItem.item_code == undefined || $scope.data.currItem.item_code == "") {
            BasemanService.notice("标机机型为空!", "alert-warning");
            return;
        }
        BasemanService.RequestPost("sale_pi_header", "getdeploybom", {
            item_code: $scope.data.currItem.item_code.replace(/(^\s*)|(\s*$)/g, ""),
        }).then(function (data) {
            var datas = data.sale_pi_item_lineofsale_pi_headers;
            datas.splice(0, 0, {item_code: $scope.data.currItem.item_code, asmid2: "/"})
            var trees = $scope.setTree(datas, "item_id2", "asmid2");
            $scope.gridSetData("options_42", [trees]);
        })
    }

    $scope.item_code42a = function () {
        if ($scope.data.currItem.erpcode == undefined || $scope.data.currItem.erpcode == "") {
            BasemanService.notice("订单机型为空!", "alert-warning");
            return;
        }
        BasemanService.RequestPost("sale_pi_header", "getdeploybom", {
            erpcode: $scope.data.currItem.erpcode.replace(/(^\s*)|(\s*$)/g, ""),
        }).then(function (data) {
            var datas = data.sale_pi_item_lineofsale_pi_headers;
            datas.splice(0, 0, {item_code: $scope.data.currItem.item_code, asmid2: "/"})
            var trees = $scope.setTree(datas, "item_id2", "asmid2");
            $scope.gridSetData("options_42", [trees]);
        })
    }
    //查询目的国
    $scope.scparea = function () {
        if ($scope.data.currItem.stat != 1) {
            return;
        }
        $scope.FrmInfo = {
            classid: "scparea",
            sqlBlock: "areatype = 2",
            postdata: {},
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (data) {
            $scope.data.currItem.area_name = data.areaname;
            $scope.data.currItem.area_code = data.areacode;
            $scope.data.currItem.area_id = parseInt(data.areaid);
        });
    };

    //产品大类查询
    $scope.pro_item_type = function () {
        if ($scope.data.currItem.stat != 1) {
            return;
        }
        $scope.FrmInfo = {
            classid: "pro_item_type",
            backdatas: "pro_item_types",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.item_type_id = result.item_type_id;
            $scope.data.currItem.item_type_no = result.item_type_no;
            $scope.data.currItem.item_type_name = result.item_type_name;
        });
    }

    //目的国
    $scope.openAreaNameFrm = function () {
        if ($scope.data.currItem.stat != 1) {
            return;
        }
        var FrmInfo = {};
        $scope.FrmInfo = {
            classid: "scparea",
            postdata: {},
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.area_id = result.areaid;
            $scope.data.currItem.area_code = result.areacode;
            $scope.data.currItem.area_name = result.areaname;
        });

    }
    // 到货港
    $scope.searchSeaportInName = function () {
        if ($scope.data.currItem.stat != 1) {
            return;
        }
        $scope.FrmInfo = {
            classid: "seaport",
            postdata: {
                seaport_type: 2,
            },
        };
        if ($scope.data.currItem.area_name != undefined && $scope.data.currItem.area_name != "") {
            $scope.FrmInfo.sqlBlock = " area_id in(" + $scope.data.currItem.area_id + ",0)";
        }
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.seaport_in_id = result.seaport_id;
            $scope.data.currItem.seaport_in_name = result.seaport_name;
            $scope.data.currItem.seaport_in_code = result.seaport_code;
        });
    }
    // 出货港
    $scope.searchSeaportOut = function () {
        if ($scope.data.currItem.stat != 1) {
            return;
        }
        $scope.FrmInfo = {
            classid: "seaport",
            postdata: {
                seaport_type: 1,
            },
        };
        if ($scope.data.currItem.area_name != undefined && $scope.data.currItem.area_name != "") {
            $scope.FrmInfo.sqlBlock = " area_id in(" + $scope.data.currItem.area_id + ",0)";
        }
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.seaport_out_id = result.seaport_id;
            $scope.data.currItem.seaport_out_code = result.seaport_code;
            $scope.data.currItem.seaport_out_name = result.seaport_name;
            $scope.data.currItem.seaport_out_type = result.seaport_type;
        });
    }


    /*********网格弹出框值查询***/
    //柜型柜量 到货港
    $scope.seaport_in_name13 = function () {
        $scope.FrmInfo = {
            classid: "seaport",
            postdata: {
                seaport_type: 2,
            },
        };
        if ($scope.data.currItem.area_name != undefined && $scope.data.currItem.area_name != "") {
            $scope.FrmInfo.sqlBlock = " area_id in(" + $scope.data.currItem.area_id + ",0)";
        }
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            var data = [];
            var index = $scope.options_13.api.getFocusedCell().rowIndex;
            var node = $scope.options_13.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data)
            }
            data[index].seaport_in_name = result.seaport_name;
            data[index].seaport_in_code = result.seaport_code;
            data[index].seaport_in_id = result.seaport_id;
            $scope.options_13.api.setRowData(data);
        });
    }

    //订单明细  国家
    $scope.area_names21 = function () {
        var FrmInfo = {};
        $scope.FrmInfo = {
            type: "checkbox",
            classid: "scparea",
            postdata: {},
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            var data = [];
            var index = $scope.options_21.api.getFocusedCell().rowIndex;
            var node = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data)
            }
            data[index].area_names = "";
            data[index].area_ids = "";
            for (var i = 0; i < result.length; i++) {
                if (i == result.length - 1) {
                    data[index].area_names += result[i].telzone;
                    data[index].area_ids += result[i].areaid;
                } else {
                    data[index].area_names += result[i].telzone + ",";
                    data[index].area_ids += result[i].areaid + ",";
                }
            }
            $scope.options_21.api.setRowData(data);

        });

    }

    //订单明细  工厂型号编码
    $scope.item_h_code21 = function () {
        if ($scope.data.currItem.cust_id == undefined || $scope.data.currItem.cust_id == "") {
            BasemanService.notice("请先选择客户", "alert-warning");
            return;
        }
        $scope.FrmInfo = {};
        $scope.FrmInfo.proitem = {checkbox2: 3,}
        $scope.FrmInfo.postdata = {},
            $scope.FrmInfo.postdata.flag = 2;
        $scope.FrmInfo.postdata.cust_id = $scope.data.currItem.cust_id;
        $scope.FrmInfo.postdata.pro_type = $scope.options_21.api.getModel().rootNode.childrenAfterSort[$scope.options_21.api.getFocusedCell().rowIndex].data.line_type
        BasemanService.openFrm("views/saleman/item_h_code.html", item_h_code, $scope, "", "lg")
            .result.then(function (items) {
            var index = $scope.options_21.api.getFocusedCell().rowIndex;
            var node = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
            var data = []
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data);
            }
            ;
            //var item = {};
            if (items.cust_item_name != undefined) {
                data[index].cust_item_name = items.cust_item_name;
            }
            if (items.qty != undefined) {
                data[index].qty = parseInt(items.qty);
            }
            if (items.price != undefined) {
                data[index].price = parseFloat(items.price);
            }
            if (items.brand_name != undefined) {
                data[index].brand_name = items.brand_name;
            }
            data[index].sale_amt = parseInt(data[index].qty || 0) * parseFloat(data[index].price || 0);
            data[index].item_h_id = items.item_h_id;
            data[index].h_spec = items.h_spec;
            data[index].item_h_code = items.item_h_code;
            data[index].item_h_name = items.item_h_name;
            data[index].apply_price = items.price;
            //item.price = "";
            data[index].line_type = parseInt(items.line_type);
            data[index].pro_type = parseInt(items.pro_type);
            data[index].item_desc = items.h_spec;
            data[index].superid = parseInt(items.superid);
            data[index].seq = parseInt(node[index].data.seq);

            $scope.data.currItem.sale_pi_item_h_lineofsale_pi_headers = data;
            $scope.options_21.api.setRowData(data);
            $scope.options_31.api.setRowData([]);
            // 查询分体机(业务逻辑操作)
            $scope.proItem(data[index].pro_type, parseInt(index), parseInt(data[index].item_h_id));
        });
    }

    //打散-包装方案明细  打散方案查询
    $scope.break_name41 = function () {
        $scope.FrmInfo = {
            classid: "sale_break_header",
            postdata: {
                flag: 3
            },
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            var index = $scope.options_41.api.getFocusedCell().rowIndex;
            var node = $scope.options_41.api.getModel().rootNode.childrenAfterSort;
            var data = [];
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data);
            }
            ;
            data[index].break_id = result.break_id;
            data[index].break_name = result.break_name;
            data[index].assembly_name = result.assembly_name;

            $scope.data.currItem.sale_pi_break_headerofsale_pi_headers = data;
            $scope.options_41.api.setRowData(data);

            var promise = BasemanService.RequestPost("sale_break_header", "select", {break_id: result.break_id});
            promise.then(function (data) {
                $scope.data.currItem.sale_pi_break_headerofsale_pi_headers[index].sale_pi_break_lineofsale_pi_break_headers = data.sale_break_lineofsale_break_headers;
                $scope.options_42.api.setRowData(data.sale_break_lineofsale_break_headers);
            });


        });
    }
    //打散-包装方案明细  装配规则
    $scope.assembly_name41 = function () {
        $scope.FrmInfo = {
            classid: "sale_assembly_header",
            postdata: {
                stat: 5
            },
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            var index = $scope.options_41.api.getFocusedCell().rowIndex;
            var node = $scope.options_41.api.getModel().rootNode.childrenAfterSort;
            var data = [];
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data);
            }
            ;
            data[index].assembly_id = result.assembly_id;
            data[index].assembly_name = result.assembly_name;

            $scope.data.currItem.sale_pi_break_headerofsale_pi_headers = data;
            $scope.options_41.api.setRowData(data);
        });
    }
    //打散-包装方案明细  打散大类名称
    $scope.item_type_name41 = function () {
        $scope.FrmInfo = {
            classid: "base_make_factor",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            var index = $scope.options_41.api.getFocusedCell().rowIndex;
            var node = $scope.options_41.api.getModel().rootNode.childrenAfterSort;
            var data = [];
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data);
            }
            ;
            data[index].item_type_id = result.item_type_id;
            data[index].item_type_name = result.item_type_name;
            data[index].made_sx = result.sx;

            $scope.data.currItem.sale_pi_break_headerofsale_pi_headers = data;
            $scope.options_41.api.setRowData(data);
        });
    }

    $scope.item_code43 = function () {
        $scope.FrmInfo = {
            is_custom_search: true,
            title: "物料查询",
            thead: [{
                name: "物料名称",
                code: "item_name"
            }, {
                name: "物料编码",
                code: "item_code"
            }],

            classid: "sale_pi_header",
            postdata: {
                flag: 57,
                item_code: $scope.options_41.api.getModel().rootNode.childrenAfterSort[$scope.options_41.api.getFocusedCell().rowIndex].data.item_code
            },
            searchlist: ["item_name", "item_code"]
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            var rowidx = $scope.options_41.api.getFocusedCell().rowIndex;
            var index = $scope.options_43.api.getFocusedCell().rowIndex;
            var node = $scope.options_43.api.getModel().rootNode.childrenAfterSort;
            var data = [];
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data);
            }
            ;
            data[index].item_code = result.item_code;
            data[index].item_name = result.item_name;
            data[index].item_id = result.item_id;
            data[index].pack_name = 1;
            data[index].item_qty = (result.amt);
            data[index].item_ids = result.po_no;
            data[index].item_uom = result.pi_no;
            data[index].bom_level = result.bom_level;

            $scope.data.currItem.sale_pi_break_headerofsale_pi_headers[rowidx].sale_pi_break_itemofsale_pi_break_headers = data;
            $scope.data.currItem.sale_pi_break_headerofsale_pi_headers[rowidx].sale_pi_break_itemallofsale_pi_break_headers = data;
            $scope.options_43.api.setRowData(data);
        });
    }
    //方案类型
    $scope.ptype_name43 = function () {
        $scope.FrmInfo = {
            classid: "sale_pack_type",
            postdata: {
                flag: 1
            },
        };
        $scope.FrmInfo.sqlBlock = " usable=2";
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            var rowidx = $scope.options_41.api.getFocusedCell().rowIndex;
            var index = $scope.options_43.api.getFocusedCell().rowIndex;
            var node = $scope.options_43.api.getModel().rootNode.childrenAfterSort;
            var data = [];
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data);
            }
            ;
            data[index].ptype_id = result.pack_id;
            data[index].ptype_name = result.pack_name;

            $scope.data.currItem.sale_pi_break_headerofsale_pi_headers[rowidx].sale_pi_break_itemofsale_pi_break_headers = data;
            $scope.data.currItem.sale_pi_break_headerofsale_pi_headers[rowidx].sale_pi_break_itemallofsale_pi_break_headers = data;
            $scope.options_43.api.setRowData(data);
        });
    }
    $scope.item_code44 = function () {
        $scope.FrmInfo = {
            is_custom_search: true,
            title: "物料查询",
            thead: [{
                name: "物料名称",
                code: "item_name"
            }, {
                name: "物料编码",
                code: "item_code"
            }],

            classid: "sale_pi_header",
            postdata: {
                flag: 57,
                item_code: $scope.options_41.api.getModel().rootNode.childrenAfterSort[$scope.options_41.api.getFocusedCell().rowIndex].data.item_code
            },
            searchlist: ["item_name", "item_code"]
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            var rowidx = $scope.options_41.api.getFocusedCell().rowIndex;
            var index = $scope.options_44.api.getFocusedCell().rowIndex;
            var node = $scope.options_44.api.getModel().rootNode.childrenAfterSort;
            var data = [];
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data);
            }
            ;
            data[index].item_code = result.item_code;
            data[index].item_name = result.item_name;
            data[index].item_id = result.item_id;
            data[index].pack_name = 1;
            data[index].item_qty = (result.amt);
            data[index].item_ids = result.po_no;
            data[index].item_uom = result.pi_no;
            data[index].bom_level = result.bom_level;

            $scope.data.currItem.sale_pi_break_headerofsale_pi_headers[rowidx].sale_pi_break_itemofsale_pi_break_headers = data;
            $scope.data.currItem.sale_pi_break_headerofsale_pi_headers[rowidx].sale_pi_break_itemallofsale_pi_break_headers = data;
            $scope.options_44.api.setRowData(data);
        });
    }

    //方案类型
    $scope.ptype_name44 = function () {
        $scope.FrmInfo = {
            classid: "sale_pack_type",
            postdata: {
                flag: 1
            },
        };
        $scope.FrmInfo.sqlBlock = " usable=2";
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            var rowidx = $scope.options_41.api.getFocusedCell().rowIndex;
            var index = $scope.options_44.api.getFocusedCell().rowIndex;
            var node = $scope.options_44.api.getModel().rootNode.childrenAfterSort;
            var data = [];
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data);
            }
            ;
            data[index].ptype_id = result.pack_id;
            data[index].ptype_name = result.pack_name;

            $scope.data.currItem.sale_pi_break_headerofsale_pi_headers[rowidx].sale_pi_break_itemofsale_pi_break_headers = data;
            $scope.data.currItem.sale_pi_break_headerofsale_pi_headers[rowidx].sale_pi_break_itemallofsale_pi_break_headers = data;
            $scope.options_44.api.setRowData(data);
        });
    }
    /**--------------------弹出框值查询-------------------------------*/
    /**********************业务逻辑控制*******************************/
    //查询客户改变pi
    $scope.cust_changepi = function (postdata) {
        var promise = BasemanService.RequestPost("customer", "select", postdata);
        promise.then(function (data) {
            // 查询汇率
            $scope.currencychange();
            $scope.data.currItem.currency_id = parseInt(data.currency_id);
            $scope.data.currItem.currency_code = data.currency_code;
            $scope.data.currItem.currency_name = data.currency_name;
            $scope.data.currItem.sale_ent_type = data.trade_type;
            $scope.data.currItem.part_rate_byhand = parseFloat(data.part_rate);// 免费配件比例
            $scope.data.currItem.cust_part_rate = parseFloat(data.part_rate);// 客户配件比例
            $scope.data.currItem.rebate_rate = parseFloat(data.rebate_rate);// 返利比例
            $scope.data.commission_amt = parseFloat(data.commission_amt);// 佣金比例
            $scope.data.currItem.customer_payment_typeofcustomers = (data.customer_payment_typeofcustomers);
            for (var i = 0; i < data.customer_payment_typeofcustomers.length; i++) {
                $scope.data.currItem.customer_payment_typeofcustomers[i].payment_type_id =
                    data.customer_payment_typeofcustomers[i].payment_type_id;
            }
            $scope.data.currItem.customer_brandofcustomers = (data.customer_brandofcustomers);
            if ($scope.data.currItem.customer_brandofcustomers.length > 0)$scope.data.currItem.brand_name = $scope.data.currItem.customer_brandofcustomers[0].brand_name;
            if ($scope.data.currItem.customer_payment_typeofcustomers.length > 0) {
                $scope.data.currItem.payment_type_line_id = parseInt($scope.data.currItem.customer_payment_typeofcustomers[0].seq);
                $scope.data.currItem.payment_type_id = $scope.data.currItem.customer_payment_typeofcustomers[0].payment_type_id;
                $scope.data.currItem.payment_type_code = $scope.data.currItem.customer_payment_typeofcustomers[0].payment_type_code;
                $scope.data.currItem.payment_type_name = $scope.data.currItem.customer_payment_typeofcustomers[0].payment_type_name;
                $scope.data.currItem.contract_subscrp = parseFloat($scope.data.currItem.customer_payment_typeofcustomers[0].contract_subscrp);
                // 查询客户获取付款方式明细
                $scope.openCustPriceType();
            }
            // 产品品牌
            $scope.data.brandlist = [];
            if (data.customer_brandofcustomers.length) {
                for (var i = 0; i < data.customer_brandofcustomers.length; i++) {
                    var newobj = {
                        brand_name: data.customer_brandofcustomers[i].brand_name,
                    };
                    $scope.data.brandlist.push(newobj);
                }
            } else {
                var newobj = {brand_name: ""};
                $scope.data.brandlist.push(newobj);
            }

            // 重选客户 -- 清空 产品明细和其细表
            $scope.options_21.api.setRowData([]);
            $scope.options_22.api.setRowData([]);
            // 取配件费用额度
            $scope.getpartlimit($scope.data.currItem.cust_id);

        })
    }

    // 查询客户获取付款方式明细
    $scope.openCustPriceType = function () {
        if ($scope.data.currItem.customer_payment_typeofcustomers.length > 0) {
            var payment_type_id = $scope.data.currItem.payment_type_id;
            $scope.data.currItem.payment_type_line_id = 0;
            var cust_id = 0;
            for (var i = 0; i < $scope.data.currItem.customer_payment_typeofcustomers.length; i++) {
                if (payment_type_id != $scope.data.currItem.customer_payment_typeofcustomers[i].payment_type_id) {
                    continue;
                } else {
                    $scope.data.currItem.payment_type_line_id = $scope.data.currItem.customer_payment_typeofcustomers[i].seq;
                    cust_id = $scope.data.currItem.customer_payment_typeofcustomers[i].cust_id;
                }
                ;
            }
            var str_payment = payment_type_id;
            var postdata = {
                payment_type_id: str_payment,
                cust_id: cust_id,
                payment_type_line_id: $scope.data.currItem.payment_type_line_id

            };
            BasemanService.RequestPost("customer", "getpayline", postdata)
                .then(function (data) {
                    $scope.data.currItem.sale_pi_pay_lineofsale_pi_headers = HczyCommon.stringPropToNum(data.customer_paytype_detailofcustomers);
                    $scope.data.currItem.customer_payment_typeofcustomers = HczyCommon.stringPropToNum(data.customer_payment_typeofcustomers);
                    //对于相同付款方式不同生产定金处理
                    for (var i = 0; i < data.customer_payment_typeofcustomers.length; i++) {
                        $scope.data.currItem.customer_payment_typeofcustomers[i].payment_type_id =
                            data.customer_payment_typeofcustomers[i].payment_type_id;
                    }
                    for (var i = 0; i < $scope.data.currItem.customer_payment_typeofcustomers.length; i++) {
                        if ($scope.data.currItem.payment_type_line_id == $scope.data.currItem.customer_payment_typeofcustomers[i].seq) {
                            $scope.data.currItem.payment_type_id = $scope.data.currItem.customer_payment_typeofcustomers[i].payment_type_id;
                            $scope.data.currItem.contract_subscrp = $scope.data.currItem.customer_payment_typeofcustomers[i].contract_subscrp;
                            $scope.data.currItem.payment_type_code = $scope.data.currItem.customer_payment_typeofcustomers[i].payment_type_code;
                            $scope.data.currItem.payment_type_name = $scope.data.currItem.customer_payment_typeofcustomers[i].payment_type_name;
                        }
                    }
                    for (var j = 0; j < data.customer_paytype_detailofcustomers.length; j++) {
                        if (data.customer_paytype_detailofcustomers[j].days > 0) {
                            $scope.data.currItem.days = data.customer_paytype_detailofcustomers[j].days;
                        } else {
                            $scope.data.currItem.days = data.customer_paytype_detailofcustomers[j].days;
                        }
                        if (data.customer_paytype_detailofcustomers[j].interest_rate > 0) {
                            $scope.data.currItem.funds_rate = parseFloat(data.customer_paytype_detailofcustomers[j].interest_rate);
                        } else {
                            $scope.data.currItem.funds_rate = parseFloat(data.customer_paytype_detailofcustomers[j].interest_rate);
                        }
                    }

                });
            $scope.data.currItem.total_tt = 0;
            $scope.data.currItem.total_oa = 0;
            $scope.data.currItem.total_lc = 0;
        }
        // 查询远期汇率
        $scope.getFuture_Rate();
        //信保费率
        $scope.getxbrate();
    };
    // 根据币种查询当月汇率
    $scope.currencychange = function () {
        $scope.currency_name_change();
        var postdata = {
            currency_id: $scope.data.currItem.currency_id,
            currency_code: $scope.data.currItem.currency_code,
            rate_year: parseInt(moment().format('YYYY')),
            rate_month: parseInt(moment().format('M')),
            flag: 1

        };
        BasemanService.RequestPost("exchange_rate", "select", postdata)
            .then(function (data) {
                $scope.data.currItem.exchange_rate = data.exch_rate;

            });
        $scope.getFuture_Rate();
    };
    //根据currency_id赋值
    $scope.currency_name_change = function () {
        for (var i = 0; i < $scope.currencys.length; i++) {
            if ($scope.data.currItem.currency_id == $scope.currencys[i].currency_id) {
                $scope.data.currItem.currency_name = $scope.currencys[i].currency_name
                $scope.data.currItem.currency_code = $scope.currencys[i].currency_code
                break;
            }
        }
    }
    // 查询远期汇率
    $scope.getFuture_Rate = function () {
        if ($scope.data.currItem.pre_ship_date == undefined || $scope.data.currItem.pre_ship_date == "") {
            $scope.data.currItem.future_rate = 0;
        } else {
            var postdata = {
                create_time: $scope.data.currItem.pre_ship_date,
                currency_id: $scope.data.currItem.currency_id,
                flag: 0
            };
            BasemanService.RequestPost("exchange_rate", "select", postdata)
                .then(function (data) {
                    $scope.data.currItem.future_rate = data.exch_rate;
                });
        }
        ;
    };
    // 信保费率
    $scope.getxbrate = function () {
        var postdata = {};
        postdata.area_level = HczyCommon.stringPropToNum($scope.data.currItem.area_level);
        postdata.payment_type_id = $scope.data.currItem.payment_type_id;

        var promise = BasemanService.RequestPost("sale_pi_header", "getxbrate", postdata);
        promise.then(function (data) {
            $scope.data.currItem.xb_rate = HczyCommon.stringPropToNum(data.xb_rate);
        });
    };
    // 查询客户取配件费用额度（所有客户改变pi到此结束）
    $scope.getpartlimit = function (cust_id) {
        if (!cust_id) {
            cust_id == 0
        }
        var postdata = {
            cust_id: cust_id,
        };

        var promise = BasemanService.RequestPost("sale_pi_header", "getpartlimit", postdata);
        promise.then(function (data) {
            data.part_limit;
        });
    }

    //关联订单明细查询分体机
    $scope.proItem = function (pro_type, index, item_h_id) {
        var postdata = {};
        if (pro_type != 1) {
            var flag = 3;
            sql = "1=1 and pro_item.item_id = ";
        } else {
            var flag = 0;
            sql = "1=1 and pro_item.item_h_id = ";
        }
        postdata.item_h_id = item_h_id;
        postdata.flag = flag;
        postdata.sqlwhere = sql + item_h_id;
        var promise = BasemanService.RequestPost("pro_item", "search", postdata);
        promise.then(function (data) {
            for (var i = 0; i < data.pro_items.length; i++) {
                data.pro_items[i].seq = (i + 1);
                data.pro_items[i].item_line_seq = (index + 1);
                data.pro_items[i].qty = $scope.data.currItem.sale_pi_item_h_lineofsale_pi_headers[index].qty;
                data.pro_items[i].cust_item_name = $scope.data.currItem.sale_pi_item_h_lineofsale_pi_headers[index].cust_item_name;
                data.pro_items[i].cust_spec = data.pro_items[i].item_name;
            }
            $scope.data.currItem.sale_pi_item_h_lineofsale_pi_headers[index].sale_pi_item_lineofsale_pi_item_h_lines = data.pro_items;
            $scope.options_22.api.setRowData($scope.data.currItem.sale_pi_item_h_lineofsale_pi_headers[index].sale_pi_item_lineofsale_pi_item_h_lines);
            var l = {};
            l.sale_pi_item_h_lineofsale_pi_headers = [];
            l.sale_pi_item_h_lineofsale_pi_headers.push($scope.data.currItem.sale_pi_item_h_lineofsale_pi_headers[index]);
            var postdata = l;
            postdata.currencyid = $scope.data.currItem.currency_id;//货币
            postdata.exchange_rate = $scope.data.currItem.exchange_rate//汇率
            //查询订单明细,分体机的指导价，结算价，基准价和制造成本价
            $scope.selectprice(postdata, pro_type, $scope.data.currItem.sale_pi_item_h_lineofsale_pi_headers[index], index);

        })
    }


    //查询订单明细,分体机的指导价，结算价，基准价和制造成本价
    $scope.selectprice = function (postdata, line_type, dataheader, index) {
        if (line_type != 4) {
            var promise = BasemanService.RequestPost("sale_guide_priceapply_header", "getitemsyprice", postdata);
            promise.then(function (data) {
                for (var i = 0; i < data.sale_pi_item_h_lineofsale_pi_headers.length; i++) {
                    //内销订单要收取汇率费用
                    if ($scope.data.currItem.sale_order_type == 3) {
                        //订单明细
                        dataheader.guide_p6 = HczyCommon.toDecimal2(Number(data.sale_pi_item_h_lineofsale_pi_headers[i].guide_p6) * 1.17);
                        dataheader.p4 = HczyCommon.toDecimal2(Number(data.sale_pi_item_h_lineofsale_pi_headers[i].p4) * 1.17);
                        dataheader.std_p4 = HczyCommon.toDecimal2(Number(data.sale_pi_item_h_lineofsale_pi_headers[i].std_p4) * 1.17);
                        dataheader.make_p4 = HczyCommon.toDecimal2(Number(data.sale_pi_item_h_lineofsale_pi_headers[i].make_p4) * 1.17);
                        //分体机
                        var dataline = data.sale_pi_item_h_lineofsale_pi_headers[i].sale_pi_item_lineofsale_pi_item_h_lines;
                        for (var j = 0; j < dataline.length; j++) {
                            dataline[j].guide_p6 = HczyCommon.toDecimal2(dataline[j].guide_p6 * 1.17)
                            dataline[j].p4 = HczyCommon.toDecimal2(dataline[j].p4 * 1.17)
                            dataline[j].std_p4 = HczyCommon.toDecimal2(dataline[j].std_p4 * 1.17)
                            dataline[j].make_p4 = HczyCommon.toDecimal2(dataline[j].make_p4 * 1.17)
                        }
                    } else {
                        //订单明细
                        dataheader.guide_p6 = HczyCommon.toDecimal2(Number(data.sale_pi_item_h_lineofsale_pi_headers[i].guide_p6));
                        dataheader.p4 = HczyCommon.toDecimal2(Number(data.sale_pi_item_h_lineofsale_pi_headers[i].p4));
                        dataheader.std_p4 = HczyCommon.toDecimal2(Number(data.sale_pi_item_h_lineofsale_pi_headers[i].std_p4));
                        dataheader.make_p4 = HczyCommon.toDecimal2(Number(data.sale_pi_item_h_lineofsale_pi_headers[i].make_p4));
                        //分体机
                        var dataline = data.sale_pi_item_h_lineofsale_pi_headers[i].sale_pi_item_lineofsale_pi_item_h_lines;
                        for (var j = 0; j < dataline.length; j++) {
                            dataline[j].guide_p6 = HczyCommon.toDecimal2(dataline[j].guide_p6)
                            dataline[j].p4 = HczyCommon.toDecimal2(dataline[j].p4)
                            dataline[j].std_p4 = HczyCommon.toDecimal2(dataline[j].std_p4)
                            dataline[j].make_p4 = HczyCommon.toDecimal2(dataline[j].make_p4)
                        }

                    }
                }
                $scope.data.currItem.sale_pi_item_h_lineofsale_pi_headers[index] = dataheader;
                $scope.data.currItem.sale_pi_item_h_lineofsale_pi_headers[index].sale_pi_item_lineofsale_pi_item_h_lines = dataline;

                $scope.options_21.api.setRowData($scope.data.currItem.sale_pi_item_h_lineofsale_pi_headers);
                $scope.options_22.api.setRowData(dataline);

                $scope.computeqty(parseInt(dataheader.qty))
            })
        }
    }

    //计算价格，销售净额
    $scope.computeqty = function (qty) {
        var val = qty;
        var index = $scope.options_21.api.getFocusedCell().rowIndex;
        var nodes = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
        var itemtemp = nodes[index].data;
        var pi_item_h_lines = itemtemp.sale_pi_item_lineofsale_pi_item_h_lines;
        var qty_temp = 0;
        var sum_qty = 0;
        var sum_amt = 0;
        //itemtemp.price = itemtemp.price ? itemtemp.price : 0;
        //itemtemp.sale_amt = parseFloat(val || 0) * parseFloat(itemtemp.price);
        // $scope.options_21.api.refreshCells(nodes, ["sale_amt"]);

        if (index != undefined) {
            val = val ? val : 0;
            for (var i = 0; i < pi_item_h_lines.length; i++) {
                if (pi_item_h_lines.length > 0) {
                    pi_item_h_lines[i].qty = parseInt(val);
                }
                ;
            }
            ;
            if (pi_item_h_lines.length == 1) {
                pi_item_h_lines[0].qty = parseInt(val || 0);
                pi_item_h_lines[0].price = parseFloat(itemtemp.price || 0)
                pi_item_h_lines[0].sale_amt = parseFloat(pi_item_h_lines[0].price || 0) * parseInt(pi_item_h_lines[0].qty || 0);
            } else {
                var sale_amt1 = 0;
                var price1 = 0;
                for (var i = 0; i < pi_item_h_lines.length; i++) {
                    if (parseInt(itemtemp.guide_p6 || 0) == 0) {
                        BasemanService.notice("机型没有指导价", "alert-info");
                        return;
                    } else {
                        pi_item_h_lines[i].price = HczyCommon.toDecimal2(Number((HczyCommon.toDecimal2(pi_item_h_lines[i].guide_p6 || 0) / HczyCommon.toDecimal2(itemtemp.guide_p6 || 0) * HczyCommon.toDecimal2(itemtemp.price || 0) * 100) / 100));
                        pi_item_h_lines[i].sale_amt = HczyCommon.toDecimal2(pi_item_h_lines[i].price * parseInt(pi_item_h_lines[i].qty || 0));
                    }

                }
                if (pi_item_h_lines.length - 1 > 0) {
                    for (var j = 0; j < pi_item_h_lines.length - 1; j++) {
                        price1 = HczyCommon.toDecimal2(parseFloat(price1 || 0) + parseFloat(pi_item_h_lines[j].price || 0));
                        sale_amt1 = HczyCommon.toDecimal2(parseFloat(sale_amt1 || 0) + parseFloat(pi_item_h_lines[j].sale_amt || 0))
                    }
                    price1 = parseFloat(HczyCommon.toDecimal2(price1));
                    sale_amt1 = parseFloat(HczyCommon.toDecimal2(sale_amt1));
                    pi_item_h_lines[pi_item_h_lines.length - 1].sale_amt = HczyCommon.toDecimal2(parseFloat(itemtemp.sale_amt || 0) - sale_amt1);
                    pi_item_h_lines[pi_item_h_lines.length - 1].price = HczyCommon.toDecimal2(parseFloat(itemtemp.price || 0) - price1);
                }
            }
            $scope.options_22.api.setRowData(pi_item_h_lines);
        }
    };
    //判断是否有易损件
    $scope.is_ys = function () {
        var count = 0;
        var data = [];
        var nodes = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
        if (nodes.length == 0) {
            return false;
        }
        for (var i = 0; i < nodes.length; i++) {
            data.push(nodes[i].data);
        }
        for (var j = 0; j < data.length; j++) {
            var line_type = data[j].line_type;
            if (line_type == 4) {
                count += 1;
            }
        }
        if (count == 0) {
            return false;
        } else {
            return true;
        }
    }
    //获取易损件下标
    $scope.getindex = function (data) {
        if ($scope.is_ys()) {
            for (var j = 0; j < data.length; j++) {
                var line_type = data[j].line_type;
                if (line_type == 4) {
                    return j;
                }
            }
        }
    }
    //获取汇总的单行易损件
    $scope.getoneYS = function (sale_amt, items) {
        var object = new Object();
        if (items[0].sale_pi_item_h_lineofsale_pi_headers.length) {

            object = items[0].sale_pi_item_h_lineofsale_pi_headers[0];
            if ($scope.data.brandlist == undefined || $scope.data.brandlist.length == 0) {
                object.brand_name = "";
            } else {
                object.brand_name = $scope.data.brandlist[0].brand_name;
            }
            object.line_type = 4;
            object.qty = 1;
            object.sale_amt = parseFloat(sale_amt || 0);
            object.price = parseFloat(sale_amt || 0);

            object.sale_pi_item_lineofsale_pi_item_h_lines[0].qty = 1;
            object.sale_pi_item_lineofsale_pi_item_h_lines[0].line_type = 4;
            object.sale_pi_item_lineofsale_pi_item_h_lines[0].sale_amt = parseFloat(sale_amt || 0);
            object.sale_pi_item_lineofsale_pi_item_h_lines[0].price = parseFloat(sale_amt || 0);
        }
        return object;
    }
    //递归方法 循环递归处理树状数据结构
    $scope.callback = function (array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].childrens) {
                array[i].children = array[i].childrens;
                array[i].folder = true;
            }
            if (array[i].childrens) {
                for (var j = 0; j < array[i].childrens.length; j++) {
                    if (array[i].childrens[j].childrens) {
                        array[i].childrens[j].children = array[i].childrens[j].childrens;
                        array[i].childrens[j].folder = true;
                        $scope.callback(array[i].childrens[j].childrens);
                    }
                }
            }
        }
    }
    $scope.tree = function (array, parentkey, key) {
        var push = [];
        for (var i = 0; i < array.length; i++) {
            var object = $scope.getchildtree(array[i], parentkey, key, array);
            push.push(object);
        }
        return push;
    }
    //通用方法处理树状结构   idpath：路径，用/分割开,key：节点主键id
    $scope.getchildtree = function (dealobject, parentkey, key, array) {
        //var arraykey=dealobject[idpath].split("/");
        //获取当前节点的父节点id
        var parentid = dealobject[parentkey];
        for (var j = 0; j < array.length; j++) {

            if ($scope.tratree(parentid, key, array[j], dealobject)) {
                dealobject = array[j];
                $scope.getchildtree(dealobject, parentkey, key, array);
            }
        }

        return dealobject
    }
    $scope.tratree = function (parentid, key, parentobject, dealobject) {
        if (parseInt(parentid) == parseInt(parentobject[key])) {
            if (parentobject.children) {
                parentobject.folder = true;
                parentobject.children.push(dealobject);
                return true
            } else {
                parentobject.folder = true;
                parentobject.children = [];
                parentobject.children.push(dealobject);
                return true
            }
        } else {
            if (parentobject.children) {
                for (var k = 0; k < parentobject.children.length; k++) {
                    $scope.tratree(parentid, key, parentobject.children[k], dealobject);
                }
            }
        }
        return false;
    }

    /**------------------ 业务逻辑控制--------------------------------**/
    /***************************网格事件处理************************/


    /**网格切换事件*/
    //订单明细  关联分体机和单前机型
    $scope.defaultcoldef = $.extend(true, {}, ($scope.columns_21));
    $scope.rowClicked21 = function (event) {
        //控制网格单行只读
        var colmun = $scope.options_21.columnApi.getAllColumns();
        if ($scope.options_21.api.getModel().rootNode.childrenAfterSort[$scope.options_21.api.getFocusedCell().rowIndex].data.line_type == 4) {


            for (var i = 0; i < colmun.length; i++) {
                if (colmun[i].colDef.editable == true) {
                    colmun[i].colDef.editable = false;
                    colmun[i].colDef.flag = 2;
                }

            }
        } else {
            for (var i = 0; i < colmun.length; i++) {
                if (colmun[i].colDef.flag == 2) {
                    colmun[i].colDef.editable = true;
                }

            }
        }

        $scope.options_22.api.setFocusedCell(-1, "cust_item_name");
        //分体机==
        if (event.data) {
            if (event.data.sale_pi_item_lineofsale_pi_item_h_lines == undefined) {
                event.data.sale_pi_item_lineofsale_pi_item_h_lines = [];
            }
            if ($scope.options_22.api.getFocusedCell()) {
                if ($scope.options_22.api.getFocusedCell().rowIndex != $scope.options_21.api.getFocusedCell().rowIndex) {
                    $scope.options_22.api.setRowData(event.data.sale_pi_item_lineofsale_pi_item_h_lines);
                }
            } else {
                $scope.options_22.api.setRowData(event.data.sale_pi_item_lineofsale_pi_item_h_lines);
            }

        }
        //单前机型
        if ($scope.options_22.api.getModel().rootNode.childrenAfterSort) {
            var node = $scope.options_22.api.getModel().rootNode.childrenAfterSort;
            var postdata = {};
            if (node[0] && node[0].data) {
                postdata.pi_id = node[0].data.pi_id;
                postdata.pi_h_id = node[0].data.pi_h_id;
                postdata.pi_line_id = node[0].data.pi_line_id;
                BasemanService.RequestPost("sale_pi_header", "getsale_pi_item_conf", postdata)
                    .then(function (data) {
                        $scope.options_31.api.setRowData(data.sale_pi_item_conf2ofsale_pi_headers);
                    })
            }
        }
    }
    //分体机 关联单前机型
    $scope.rowClicked22 = function () {
        var rowidx = $scope.options_22.api.getFocusedCell().rowIndex;
        if ($scope.options_22.api.getModel().rootNode.childrenAfterSort) {
            var node = $scope.options_22.api.getModel().rootNode.childrenAfterSort;
            var postdata = {};
            if (node[rowidx] && node[rowidx].data) {
                postdata.pi_id = node[rowidx].data.pi_id;
                postdata.pi_h_id = node[rowidx].data.pi_h_id;
                postdata.pi_line_id = node[rowidx].data.pi_line_id;
                BasemanService.RequestPost("sale_pi_header", "getsale_pi_item_conf", postdata)
                    .then(function (data) {
                        $scope.options_31.api.setRowData(data.sale_pi_item_conf2ofsale_pi_headers);
                    })
            }
        }
    }

    // 设置数量、计算总数量
    $scope.qty21 = function () {

        var _this = $(this);
        var val = _this.val();
        var index = $scope.options_21.api.getFocusedCell().rowIndex;
        var nodes = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
        var itemtemp = nodes[index].data;
        var pi_item_h_lines = itemtemp.sale_pi_item_lineofsale_pi_item_h_lines;

        //var node1s=$scope.options_22.api.getModel().rootNode.childrenAfterSort;
        // var fiss_data = node1s[index].data;

        var qty_temp = 0;
        var sum_qty = 0;
        var sum_amt = 0;
        itemtemp.price = itemtemp.price ? itemtemp.price : 0;
        itemtemp.sale_amt = parseFloat(val || 0) * parseFloat(itemtemp.price);
        $scope.options_21.api.refreshCells(nodes, ["sale_amt"]);

        if (index != undefined) {
            val = val ? val : 0;
            for (var i = 0; i < pi_item_h_lines.length; i++) {
                if (pi_item_h_lines.length > 0) {
                    pi_item_h_lines[i].qty = Number(val);
                }
                ;
            }
            ;
            if (pi_item_h_lines.length == 1) {
                pi_item_h_lines[0].qty = Number(val);
                pi_item_h_lines[0].sale_amt = Number(pi_item_h_lines[0].price || 0) * parseInt(pi_item_h_lines[0].qty || 0);
            } else {
                var sale_amt1 = 0;
                var price1 = 0;
                for (var i = 0; i < pi_item_h_lines.length; i++) {
                    if (parseInt(itemtemp.guide_p6 || 0) == 0) {
                        pi_item_h_lines[i].price = 0;
                        pi_item_h_lines[i].sale_amt = 0
                    } else {
                        pi_item_h_lines[i].price = HczyCommon.toDecimal2(Number((HczyCommon.toDecimal2(pi_item_h_lines[i].guide_p6 || 0) / HczyCommon.toDecimal2(itemtemp.guide_p6 || 0) * HczyCommon.toDecimal2(itemtemp.price || 0) * 100) / 100));
                        pi_item_h_lines[i].sale_amt = HczyCommon.toDecimal2(pi_item_h_lines[i].price * parseInt(pi_item_h_lines[i].qty || 0));
                    }

                }
                if (pi_item_h_lines.length - 1 > 0) {
                    for (var j = 0; j < pi_item_h_lines.length - 1; j++) {
                        price1 = HczyCommon.toDecimal2(parseFloat(price1 || 0) + parseFloat(pi_item_h_lines[j].price || 0));
                        sale_amt1 = HczyCommon.toDecimal2(parseFloat(sale_amt1 || 0) + parseFloat(pi_item_h_lines[j].sale_amt || 0))
                    }
                    price1 = parseFloat(HczyCommon.toDecimal2(price1));
                    sale_amt1 = parseFloat(HczyCommon.toDecimal2(sale_amt1));
                    pi_item_h_lines[pi_item_h_lines.length - 1].sale_amt = HczyCommon.toDecimal2(parseFloat(itemtemp.sale_amt || 0) - sale_amt1);
                    pi_item_h_lines[pi_item_h_lines.length - 1].price = HczyCommon.toDecimal2(parseFloat(itemtemp.price || 0) - price1);
                }
            }
            $scope.options_22.api.setRowData(pi_item_h_lines);
        }
    };

    $scope.price21 = function () {
        var _this = $(this);
        var val = _this.val();
        var index = $scope.options_21.api.getFocusedCell().rowIndex;
        var nodes = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
        var itemtemp = nodes[index].data;
        var pi_item_h_lines = itemtemp.sale_pi_item_lineofsale_pi_item_h_lines;

        //var node1s=$scope.options_22.api.getModel().rootNode.childrenAfterSort;
        //var fiss_data = node1s[index].data;

        if (itemtemp.qty == undefined) {
            itemtemp.qty = 0;
        }
        itemtemp.sale_amt = Number(val) * parseInt(itemtemp.qty);
        $scope.options_21.api.refreshCells(nodes, ["sale_amt"]);
        if (index != undefined) {
            val = val ? val : 0;
            if (pi_item_h_lines.length == 1) {
                pi_item_h_lines[0].price = Number(val || 0);
                pi_item_h_lines[0].sale_amt = parseFloat(pi_item_h_lines[0].price || 0) * parseInt(pi_item_h_lines[0].qty || 0);
                pi_item_h_lines[0].sale_amt = HczyCommon.toDecimal2(pi_item_h_lines[0].sale_amt);
            } else {
                var price_1 = 0;
                var sale_amt1 = 0;
                var price1 = 0;
                for (var i = 0; i < pi_item_h_lines.length; i++) {
                    pi_item_h_lines[i].qty = pi_item_h_lines[i].qty ? pi_item_h_lines[i].qty : 0;
                    if (parseInt(itemtemp.guide_p6) == 0) {
                        pi_item_h_lines[i].price = 0;
                        pi_item_h_lines[i].sale_amt = 0;
                    } else {
                        pi_item_h_lines[i].price = HczyCommon.toDecimal2((HczyCommon.toDecimal2(pi_item_h_lines[i].guide_p6 || 0) / HczyCommon.toDecimal2(itemtemp.guide_p6 || 0)) * HczyCommon.toDecimal2(val || 0));
                        pi_item_h_lines[i].sale_amt = HczyCommon.toDecimal2(pi_item_h_lines[i].price * parseInt(pi_item_h_lines[i].qty || 0));
                        price_1 = HczyCommon.toDecimal2(parseFloat(price_1) + parseFloat(pi_item_h_lines[i].price || 0));
                    }
                }
                if (pi_item_h_lines.length - 1 > 0) {
                    for (var j = 0; j < pi_item_h_lines.length - 1; j++) {
                        price1 = (parseFloat(price1 || 0) + parseFloat(pi_item_h_lines[j].price || 0));
                        sale_amt1 = (parseFloat(sale_amt1 || 0) + parseFloat(pi_item_h_lines[j].sale_amt || 0));
                    }
                    price1 = parseFloat(HczyCommon.toDecimal2(price1));
                    sale_amt1 = parseFloat(HczyCommon.toDecimal2(sale_amt1));
                    pi_item_h_lines[pi_item_h_lines.length - 1].sale_amt = HczyCommon.toDecimal2(parseFloat(itemtemp.sale_amt || 0) - parseFloat(sale_amt1 || 0));
                    pi_item_h_lines[pi_item_h_lines.length - 1].price = HczyCommon.toDecimal2(parseFloat(val || 0) - parseFloat(price1 || 0));
                }
            }
            $scope.options_22.api.setRowData(pi_item_h_lines);
        }
    };

    //配件清单  需求数量
    $scope.require_qty23 = function () {
        var _this = $(this);
        var val = _this.val();
        var index = $scope.options_23.api.getFocusedCell().rowIndex;
        var nodes = $scope.options_23.api.getModel().rootNode.childrenAfterSort;
        nodes[index].data.amt = parseFloat(nodes[index].data.psale_price || 0) * parseInt(val);
        $scope.options_23.api.refreshCells(nodes, ["amt"]);
    }

    //配件清单  销售价格
    $scope.psale_price23 = function () {
        var _this = $(this);
        var val = _this.val();
        var index = $scope.options_23.api.getFocusedCell().rowIndex;
        var nodes = $scope.options_23.api.getModel().rootNode.childrenAfterSort;
        nodes[index].data.amt = parseInt(nodes[index].data.require_qty || 0) * parseFloat(val);
        $scope.options_23.api.refreshCells(nodes, ["amt"]);
    }
    /**网格增加删除行*/
    //机型面板 产生面板确认单
    $scope.generate16 = function () {
        var postdata = {};
        postdata.pi_id = parseInt($scope.data.currItem.pi_id);
        BasemanService.RequestPost("sale_pi_header", "creatembbill", postdata)
            .then(function (data) {
                $scope.refresh(2);
                BasemanService.notice("生成成功", "alter-warning");
            });
    }

    //订单明细  新增
    $scope.addline21 = function () {
        var brand_id = "";
        //var test=$scope.options_21.rowData;
        var data = [];
        var node = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        if ($scope.data.brandlist) {
            for (var i = 0; i < $scope.data.brandlist.length; i++) {
                if ($scope.data.brandlist[0].brand_name != undefined || $scope.data.brandlist[0].brand_name != "") {
                    brand_id = $scope.data.brandlist[0].brand_name;
                    break;
                }
                ;
            }
        } else {
            $scope.data.brandlist = []
        }

        var item = {seq: 1 + i + node.length, line_type: 1, brand_name: brand_id};
        data.push(item);
        $scope.options_21.api.setRowData(data);
    }
    //订单明细  删除
    $scope.delline21 = function () {
        var data = [];
        var rowidx = $scope.options_21.api.getFocusedCell().rowIndex;
        var node = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        data.splice(rowidx, 1);
        $scope.options_21.api.setRowData(data);
    }


    //订单明细 订单选配
    $scope.open = function () {
        if ($scope.data.currItem.pi_id == undefined || $scope.data.currItem.pi_id == 0) {
            BasemanService.notice("请先保存单据再做选配!", "alert-warning");
            return;
        }

        var h = document.body.offsetHeight,
            w = document.body.offsetWidth; //获取背景窗口大小
        if (!document.getElementById('divPIconfBg')) {
            var div = document.createElement('div'); //创建背景蒙板
            div.id = 'divPIconfBg';
            div.style.backgroundColor = 'white';
            div.style.position = 'absolute';
            // div.style.filter = 'alpha(opacity=80)';
            // div.style.opacity = '.80';
            div.style.zIndex = 100001;
            div.style.left = 0;
            div.style.top = 0;
            div.style.width = w + 'px';
            div.style.height = h + 'px';
            document.body.appendChild(div);

        }
        if (!document.getElementById('divPIconfBgClose')) {
            var div = document.createElement('div'); //创建关闭按钮在蒙板上
            div.id = 'divPIconfBgClose';
            div.style.backgroundColor = "#1ab394";
            //div.style.position = 'absolute';
            //div.style.backgroundImage = 'url(img/boxy_btn.png)';
            div.style.zIndex = 100003;
            div.style.left = 0;
            div.style.top = 0;
            div.style.width = w + "px";
            div.style.height = '36px';

            var divClose = document.createElement("a");
            divClose.id = "divPIconfCloseBtn";
            divClose.style.backgroundColur = "red";
            divClose.style.position = 'absolute';
            divClose.style.backgroundImage = 'url(img/boxy_btn.png)';
            divClose.style.zIndex = 100004;
            divClose.style.left = 0;
            divClose.style.top = 0;
            divClose.style.width = "120px";
            divClose.style.height = '36px';
            divClose.style.paddingTop = '10px';
            divClose.title = '关闭';
            divClose.innerHTML = "<<返回形式发票编辑";
            divClose.style.color = 'white';
            divClose.style.font.size = "16px";
            divClose.style.cursor = 'hand';
            divClose.onclick = function () { //点击时间 ，关闭蒙板
                fnPIconfBgClose();
            };

            div.appendChild(divClose);

            document.getElementById('divPIconfBg').appendChild(div);
        }
        if (!document.getElementById('divPIconfBgIframe')) {
            var iframe;
            iframe = document.createElement('IFRAME'); //创建蒙板内的内嵌iframe容器，用于嵌入显示其他网页
            iframe.id = 'divPIconfBgIframe';
            iframe.frameBorder = '0';
            //iframe.scrolling = "no";
            iframe.style.overflow = 'hidden';
            iframe.allowTransparency = 'true';
            iframe.style.display = 'none';
            iframe.style.width = w + 'px'; //800
            iframe.style.height = h - 36 + 'px'; //620
            iframe.style.top = '36px'; //800
            document.getElementById('divPIconfBg').appendChild(iframe);
        }

        document.getElementById('divPIconfBgClose').style.display = 'block';
        document.getElementById('divPIconfBgIframe').style.display = 'block';

        document.getElementById('divPIconfBg').style.display = 'block';
        if ($scope.data.currItem.stat > 1) {
            var pcsurl = "http://100.100.68.5:8081/ocm/login.jsp?user_id=538&randompass=AVMNOGAKKEIPSLUI&qo_id=" + $scope.data.currItem.pi_id + "&readonly=1&fullscreen=1&oms_org_id=1500&is_new=1&bill_type=40038";
        } else {
            var pcsurl = "http://100.100.68.5:8081/ocm/login.jsp?user_id=538&randompass=AVMNOGAKKEIPSLUI&qo_id=" + $scope.data.currItem.pi_id + "&readonly=0&fullscreen=1&oms_org_id=1500&is_new=1&bill_type=40038";
        }

        document.getElementById('divPIconfBgIframe').src = pcsurl;
    }

    //订单明细 数据上移
    $scope.dataup = function () {
        var cell = $scope.options_21.api.getFocusedCell();
        var rowidx = $scope.options_21.api.getFocusedCell().rowIndex;
        var nodes = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
        var data = [];
        if (rowidx == 0) {
            return;
        } else {
            var temp = {};
            HczyCommon.copyobj(nodes[rowidx - 1].data, temp);
            temp.seq = parseInt(temp.seq) + 1;
            nodes[rowidx].data.seq = parseInt(nodes[rowidx].data.seq) - 1;
            nodes[rowidx - 1].data = nodes[rowidx].data;
            nodes[rowidx].data = temp;
        }
        for (var i = 0; i < nodes.length; i++) {
            data.push(nodes[i].data);
        }
        $scope.options_21.api.setFocusedCell(rowidx - 1, cell.column.colId);
        $scope.options_21.api.setRowData(data);
    }

    //订单明细 数据下移
    $scope.datadown = function () {
        var cell = $scope.options_21.api.getFocusedCell();
        var rowidx = $scope.options_21.api.getFocusedCell().rowIndex;
        var nodes = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
        var data = [];
        if (rowidx == parseInt(nodes.length - 1)) {
            return;
        } else {
            var temp = {};
            HczyCommon.copyobj(nodes[rowidx + 1].data, temp);
            temp.seq = parseInt(temp.seq) - 1;
            nodes[rowidx].data.seq = parseInt(nodes[rowidx].data.seq) + 1;
            nodes[rowidx + 1].data = nodes[rowidx].data;
            nodes[rowidx].data = temp;
        }
        for (var i = 0; i < nodes.length; i++) {
            data.push(nodes[i].data);
        }
        $scope.options_21.api.setFocusedCell(rowidx + 1, cell.column.colId);
        $scope.options_21.api.setRowData(data);
    }


    /**-------------------------网格事件处理-----------------------**/
    /**************************网格定义******************************/
    //分组功能
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
        cellRendererParams: function (params) {
        }
    };


    //机型参数
    $scope.options_15 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        //rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_15.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_15 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "整机编码", field: "item_h_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户型号", field: "cust_item_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "参数类型", field: "row_type", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "国家名称", field: "area_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "制冷剂类型", field: "refrigerant", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "气候", field: "climate_type", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "电源", field: "power_type", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "低电压", field: "low_voltage", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "冬季最低温度", field: "low_temperature", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "夏季最高温度", field: "high_temperature", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "能效", field: "energy", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "认证", field: "certification", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];

    //机型面板
    $scope.options_16 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        //rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_16.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_16 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "整机编码", field: "item_h_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户型号", field: "cust_item_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "机型类型", field: "item_type", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "面板款式", field: "mb_style", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "面板颜色", field: "mb_color", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "装饰条颜色", field: "mb_article", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];

    //sheet页第二页订单明细
    $scope.options_21 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        rowClicked: $scope.rowClicked21,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_21 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "品牌名", field: "brand_name", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "销售国家", field: "area_names", editable: true, filter: 'set', width: 150,
            cellEditor: "弹出框",
            action: $scope.area_names21,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "类型", field: "line_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "工厂型号编码", field: "item_h_code", editable: true, filter: 'set', width: 150,
            cellEditor: "弹出框",
            action: $scope.item_h_code21,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "工厂型号", field: "item_h_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: " 客户型号", field: "cust_item_name", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            cellchange: $scope.cust_item_name21,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "数量", field: "qty", editable: true, filter: 'set', width: 100,
            cellEditor: "整数框",
            cellchange: $scope.qty21,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "FOB销售价", field: "price", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
            cellchange: $scope.price21,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "销售金额", field: "sale_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "指导价", field: "guide_p6", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "业务结算价", field: "p4", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "标准结算价", field: "std_p4", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "指导价毛利率", field: "hguide_hwmlv", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "指导选配差价", field: "std_c_price", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "业务选配结算差价", field: "c_price", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "标准选配差价", field: "std_c_cl_cb", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "资金成本", field: "S3", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "汇兑损益", field: "S4", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "返利", field: "S7", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "佣金", field: "S1", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "CKD费用", field: "ckd_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "SKD费用", field: "skd_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包装费用", field: "package_fee", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "佣金", field: "s1", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "产品技术要求", field: "item_desc", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "材料成本价", field: "cl_cb", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "材料成本差价", field: "c_cl_cb", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "标准成本", field: "std_cl_cb", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "机型装柜数量", field: "box_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];

    //分体机
    $scope.options_22 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        rowClicked: $scope.rowClicked22,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_22.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_22 = [
        {
            headerName: "机型类别", field: "pro_type", editable: false, filter: 'set', width: 150,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "散件类型", field: "sj_type", editable: true, filter: 'set', width: 150,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "分体机编码", field: "item_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "分体机描述", field: "item_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户型号", field: "cust_item_name", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户产品名称", field: "cust_spec", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "数量", field: "qty", editable: true, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "FOB销售价", field: "price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "销售金额", field: "sale_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "指导价", field: "guide_p6", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "业务结算价", field: "P4", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "标准结算价", field: "std_p4", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "指导选配差价", field: "std_c_price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "业务选配结算差价", field: "c_price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "标准选配差价", field: "std_c_cl_cb", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注", field: "note", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "压机型号", field: "comp_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "材料成本价", field: "cl_cb", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "材料成本差价", field: "c_cl_cb", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "指导成本", field: "guide_cl_cb", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "制造费用系数", field: "made_sx", editable: false, filter: 'set', width: 120,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包装费用", field: "package_fee", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];

    //配件清单
    $scope.options_23 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        //rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_23.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_23 = [
        {
            headerName: "整机编码", field: "item_h_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "整机名称", field: "item_h_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "分体机编码", field: "item_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "分体机名称", field: "item_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户型号", field: "cust_item_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "配件分类", field: "part_class", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "配件描述", field: "part_desc", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "英文名", field: "part_en_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "单台用量", field: "qty", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "需求数量", field: "require_qty", editable: true, filter: 'set', width: 100,
            cellEditor: "整数框",
            cellchange: $scope.require_qty23,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "价格", field: "price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "销售价格", field: "psale_price", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
            cellchange: $scope.psale_price23,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "金额", field: "amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注", field: "note", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];

    //当前机型
    $scope.options_31 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        //rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_31.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_31 = [
        {
            headerName: "配置项名称", field: "conf_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "可选项名称", field: "option_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "是否特殊项", field: "is_special", editable: false, filter: 'set', width: 150,
            cellEditor: "复选框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "是否标配", field: "is_default", editable: false, filter: 'set', width: 150,
            cellEditor: "复选框",
            checkbox_value: 1,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "方案号", field: "file_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "方案名称", field: "file_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "价差", field: "diff_price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "选配信息", field: "defs", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注", field: "note", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];

    //所有机型
    $scope.options_32 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        //rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_32.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_32 = [
        {
            headerName: "配置项名称", field: "conf_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "可选项名称", field: "option_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "是否特殊项", field: "is_special", editable: false, filter: 'set', width: 150,
            cellEditor: "复选框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "是否标配", field: "is_default", editable: false, filter: 'set', width: 150,
            cellEditor: "复选框",
            checkbox_value: 1,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "方案号", field: "file_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "方案名称", field: "file_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户型号", field: "item_cust_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "机型编码", field: "item_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "机型名称", field: "item_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "价差", field: "diff_price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "选配信息", field: "defs", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注", field: "note", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];

    //机型信息
    $scope.options_41 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        rowClicked: $scope.rowClicked41,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_41.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_41 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "机型类别", field: "pro_type", editable: false, filter: 'set', width: 150,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "散件类型", field: "sj_type", editable: false, filter: 'set', width: 150,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "分体机编码", field: "item_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "分体机描述", field: "Item_Name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户型号", field: "cust_item_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户产品名称", field: "cust_spec", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "专用机型编码", field: "cust_item_code", editable: false, filter: 'set', width: 120,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "专用机型整机编码", field: "item_cust_h_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];
    //机型BOM查看
    $scope.options_42 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        getNodeChildDetails: function (rowItem) {
            if (rowItem.haschild) {
                return {
                    group: true,
                    expanded: rowItem.expanded,
                    children: rowItem.children,
                };
            } else {
                return null;
            }
        },
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        cellValueChanged: $scope.cellValueChanged,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_43.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_42 = [
        {
            headerName: "编码", field: "item_code", editable: true, filter: 'set', width: 150,
            cellEditor: "树状框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "物料描述", field: "item_name", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];

    //替换明细
    $scope.options_43 = {
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
        //rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_44.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_43 = [
        {
            headerName: '序号',
            field: 'line_id',
            width: 70,
            editable: true,
            enableRowGroup: true,
            checkboxSelection: function (params) {
                // we put checkbox on the name if we are not doing no grouping
                return params.columnApi.getRowGroupColumns().length === 0;
            },
            icons: {
                sortAscending: '<i class="fa fa-sort-alpha-asc"/>',
                sortDescending: '<i class="fa fa-sort-alpha-desc"/>'
            }
        },
        {
            headerName: "机型编码", field: "item_cust_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "基准物料编码", field: "bs_item_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "基准物料名称", field: "bs_item_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "基准物料描述", field: "bs_item_desc", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "操作", field: "operate", editable: true, filter: 'set', width: 150,
            cellEditor: "弹出框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellEditorParams: {
                values: [{value: 1, desc: "新增"}, {value: 2, desc: "替换"}, {value: 3, desc: "替换"}, {value: 4, desc: "修改"}]
            }
        },
        {
            headerName: "订单物料编码", field: "as_item_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "订单物料名称", field: "as_item_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "订单物料描述", field: "as_item_desc", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];


    /**----------------网格区域-----------------------------**/

    $scope.save_before = function () {
        $scope.data.noSave = {
            sale_pi_item_lineofsale_pi_headers: $scope.data.currItem.sale_pi_item_lineofsale_pi_headers,
        }
        delete $scope.data.currItem.sale_pi_break_itemofsale_pi_headers
        delete $scope.data.currItem.sale_pi_item_lineofsale_pi_headers
        if (Number($scope.data.currItem.part_rate || 0) > Number($scope.data.currItem.cust_part_rate || 0)) {
            $scope.data.currItem.is_part_over = 2
        } else {
            $scope.data.currItem.is_part_over = 1;
        }
        delete $scope.data.currItem.sale_pi_item_lineofsale_pi_header;
    }

    $scope.refresh_after = function () {
        if ($scope.data.noSave != undefined) {
            $scope.data.currItem.sale_pi_item_lineofsale_pi_headers = $scope.data.noSave.sale_pi_item_lineofsale_pi_headers;
        }
        var datas = $scope.data.currItem.sale_pi_item_lineofsale_pi_headers
        var obj = {};
        for (var i = 0; i < $scope.data.currItem.sale_pi_item_h_lineofsale_pi_headers.length; i++) {
            obj = $scope.data.currItem.sale_pi_item_h_lineofsale_pi_headers[i];
            datas = datas.concat(obj.sale_pi_item_lineofsale_pi_item_h_lines);
        }
        $scope.gridSetData("options_41", datas);
        if ($scope.data.currItem.currprocname == "申请编码") {
            $scope.columns_41[$scope.getIndexByField("columns_41", "cust_item_code")].editable = true;
            $scope.columns_41[$scope.getIndexByField("columns_41", "item_cust_h_code")].editable = true;
        }
    }
    //数据缓存
    $scope.initdata();
}
//加载控制器
billmanControllers
    .controller('sale_zy_headerEdit', sale_zy_headerEdit)
