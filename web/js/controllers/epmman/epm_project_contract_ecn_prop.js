/**
 * 项目合同变更 =》工程合同失效
 * 2019/6/28
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'swalApi', 'numberApi', '$modal'],
    function (module, controllerApi, base_obj_prop, requestApi, swalApi, numberApi, $modal) {

        var controller = [
            '$scope',

            function ($scope) {
                /*------------------------------继承基础控制器------------------------------------------*/
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //定义操作参数, 1-项目变更,2-项目失效
                $scope.parameter = 1;

                //是否为经销商,默认不是
                //$scope.isDealer = 1;
                $scope.tabs.outstanding = {
                    title : '',
                    hide : true
                };

                /*-----------------------------------数据编辑------------------------------------------*/
                /**
                 * 产参考节点为其他日期的可编辑
                 */
                function editaadd(args) {
                    return args.ref_time_node != 99 && args.ref_time_node != undefined;
                }

                /**
                 * 产参考节点为指定日期的可编辑
                 */
                function editatime(args) {
                    return args.ref_time_node == 99;
                }

                /**
                 * 参考金额的比列可编辑
                 */
                function edittyperate(args) {
                    if(args.ref_amt_type == undefined){
                        return false;
                    }else if(args.ref_amt_type == 1){
                        return true;
                    }else{
                        return args.plan_amt == undefined;
                    }
                }

                /**
                 * 参考金额的金额可编辑
                 */
                function edittypeamt(args) {
                    if(args.ref_amt_type == undefined){
                        return false;
                    }else if(args.ref_amt_type == 1){
                        return true;
                    }else{
                        return args.rate == undefined;
                    }
                }
                /*----------------------------------表格定义-------------------------------------------*/
                /**
                 * 表格定义  "原合同周期条件
                 */
                $scope.gridOptions_line_sta = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'payment_type',
                        headerName: '款项类别',
                        hcDictCode : 'epm.payment_type'
                    }, {
                        headerName: '时间设置',
                        children: [
                            {
                                field: 'ref_time_node',
                                headerName: '参考节点',
                                hcDictCode: 'epm.ref_time_node'
                            },{
                                field: 'adddel',
                                headerName: '加减',
                                hcDictCode : 'operators'
                            },{
                                field: 'numbers',
                                headerName: '天数',
                                cellStyle: {
                                    'text-align': 'center'
                                }
                            },{
                                field: 'times',
                                headerName: '指定日期',
                                type : '日期'
                            }]
                    }, {
                        headerName: '回款金额',
                        children: [
                            {
                                field: 'ref_amt_type',
                                headerName: '参考金额',
                                hcDictCode : 'epm.ref_amt_type'
                            },
                            {
                                field: 'rate',
                                headerName: '比例',
                                type : '百分比'
                            },
                            {
                                field: 'plan_amt',
                                headerName: '金额',
                                type : '金额'
                            }
                        ]
                    }, {
                        field: 'is_auto_plan',
                        headerName: '生成回款计划',
                        type : '是否'
                    }]
                };

                /**
                 * 表格定义  "周期条件"
                 */
                $scope.gridOptions_line = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'payment_type',
                        headerName: '款项类别',
                        editable: true,
                        hcDictCode : 'epm.payment_type'
                    }, {
                        headerName: '时间设置',
                        children: [
                            {
                                field: 'ref_time_node',
                                headerName: '参考节点',
                                editable: true,
                                hcDictCode: 'epm.ref_time_node',
                                onCellValueChanged: function (args) {
                                    if (args.oldValue == args.newValue) {
                                        return;
                                    }
                                    $scope.timeChange(args);
                                }
                            },{
                                field: 'adddel',
                                headerName: '加减',
                                editable: function (args){
                                    return editaadd(args.data);
                                },
                                hcDictCode : 'operators'
                            },{
                                field: 'numbers',
                                headerName: '天数',
                                editable: function (args){
                                    return editaadd(args.data);
                                },
                                cellStyle: {
                                    'text-align': 'center'
                                },
                                onCellValueChanged: function (args) {
                                    if (args.oldValue == args.newValue) {
                                        return;
                                    }
                                    if(!numberApi.isNum(Number(args.data.numbers))){
                                        args.data.numbers = undefined;
                                        swalApi.info('请输入正确的数字');
                                        return;
                                    }
                                    if(Number(args.data.numbers)<0){
                                        args.data.numbers = undefined;
                                        swalApi.info('请输入大于零的数字');
                                        return;
                                    }
                                    if(Number(args.data.numbers)==0){
                                        args.data.numbers = undefined;
                                        return;
                                    }
                                }
                            },{
                                field: 'times',
                                headerName: '指定日期',
                                editable: function (args){
                                    return editatime(args.data);
                                },
                                type : '日期'
                            }]
                    }, {
                        headerName: '回款金额',
                        children: [
                            {
                                field: 'ref_amt_type',
                                headerName: '参考金额',
                                editable: true,
                                hcDictCode : 'epm.ref_amt_type',
                                onCellValueChanged: function (args) {
                                    if (args.oldValue == args.newValue) {
                                        return;
                                    }
                                    $scope.typeAmtChange(args);
                                }
                            },
                            {
                                field: 'rate',
                                headerName: '比例',
                                editable: function (args){
                                    return edittyperate(args.data);
                                },
                                type : '百分比',
                                onCellValueChanged: function (args) {
                                    if (args.oldValue == args.newValue) {
                                        return;
                                    }
                                    if(args.newValue == 0 && args.data.ref_amt_type != 1){
                                        args.data.rate = undefined;
                                    }
                                    $scope.sumRate(args);
                                }
                            },
                            {
                                field: 'plan_amt',
                                headerName: '金额',
                                editable: function (args){
                                    return edittypeamt(args.data);
                                },
                                type : '金额',
                                onCellValueChanged: function (args) {
                                    if (args.oldValue == args.newValue) {
                                        return;
                                    }
                                    if(args.newValue == 0 && args.data.ref_amt_type != 1){
                                        args.data.plan_amt = undefined;
                                    }
                                    $scope.sumAmt(args);
                                }
                            }
                        ]
                    }, {
                        field: 'is_auto_plan',
                        headerName: '生成回款计划',
                        editable: true,
                        type : '是否'
                    }],
                    hcButtons: {
                        addButton: {
                            icon: 'iconfont hc-add',
                            click: function () {
                                $scope.addPlan && $scope.addPlan();
                            }
                        },
                        delButton: {
                            icon: 'iconfont hc-reduce',
                            click: function () {
                                $scope.delPlan && $scope.delPlan();
                            }
                        }
                    }
                };

                /**
                 * 表格定义  "产品清单变更"
                 */
                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'item_code',
                        headerName: '产品编码'
                    }, {
                        field: 'item_name',
                        headerName: '产品名称'
                    }, {
                        field: 'model',
                        headerName: '产品型号'
                    }, {
                        field: 'stand_price',
                        headerName: '标准单价(元)',
                        type: '金额'
                    }, {
                        field: 'proj_unit_price',
                        headerName: '合同价(元)',
                        type: '金额'
                    }, {
                        field: 'discount_rate',
                        headerName: '应用折扣率'
                    }, {
                        field: 'discounted_price',
                        headerName: '折扣单价(元)',
                        type: '金额'
                    }, {
                        field: 'contract_qty',
                        headerName: '合同数量',
                        type: '数量'
                    }, {
                        field: 'ordered_qty',
                        headerName: '已下单数量',
                        type: '数量'
                    }]
                };

                /**
                 * 表格定义  "未出库完毕明细单"
                 */
                $scope.gridOptionsOutstanding = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'sa_salebillno',
                        headerName: '要货单号',
                        pinned:'left'
                    }, {
                        field: 'discount_apply_code',
                        headerName: '折扣单号',
                        pinned:'left'
                    }, {
                        field: 'date_invbill',
                        headerName: '订单日期',
                        type : '日期',
                        pinned:'left'
                    }, {
                        field: 'item_code',
                        headerName: '产品编码',
                        pinned:'left'
                    }, {
                        field: 'item_name',
                        headerName: '产品名称'
                    }, {
                        field: 'qty_bill',
                        headerName: '要货数量',
                        type:'数量'
                    }, {
                        field: 'confirm_out_qty',
                        headerName: '出库数量',
                        type:'数量'
                    }, {
                        field: 'cancel_qty',
                        headerName: '取消数量',
                        type: '数量'
                    }, {
                        field: 'outstanding_qty',
                        headerName: '未清数量',
                        type: '数量'
                    }]
                };

                /*------------------------------网格方法------------------------------------------*/

                /**
                 * 修改参考节点
                 */
                $scope.timeChange = function(args){
                    if(args.data.ref_time_node!=undefined && args.data.ref_time_node!=null && args.data.ref_time_node!=""){
                        if(args.data.ref_time_node == 99){
                            args.data.adddel = undefined;
                            args.data.numbers = undefined;
                        }else{
                            args.data.times = undefined;
                        }
                    }else {
                        args.data.ref_time_node = undefined;
                    }
                };
                /**
                 * 修改参考金额
                 */
                $scope.typeAmtChange = function(args){
                    if(args.data.ref_amt_type!=undefined && args.data.ref_amt_type!=null && args.data.ref_amt_type!=""){
                        if(args.data.ref_amt_type == 1){
                            args.data.rate = undefined;
                            args.data.plan_amt = undefined;
                        }else{
                            args.data.rate = undefined;
                            args.data.plan_amt = undefined;
                        }
                    }else {
                        args.data.ref_amt_type = undefined;
                    }
                };

                /**
                 * 计算周期条件金额与比例
                 */
                $scope.sumRate = function(args){
                    if(args.data.ref_amt_type == 1){
                        if(args.data.rate == undefined || args.data.rate == 0){
                            reutrn;
                        }
                        if($scope.data.currItem.contract_amt == undefined
                            || $scope.data.currItem.contract_amt == null
                            ||$scope.data.currItem.contract_amt == ""
                            ||$scope.data.currItem.contract_amt == 0){//没有合同总额
                            swalApi.info("该合同请先维护合同总额");
                            args.data.rate = undefined;
                            return;
                        }
                        if(args.data.rate  < 0){
                            swalApi.info("请输入大于零的数");
                            args.data.rate = undefined;
                            args.data.plan_amt = undefined;
                            return;
                        }
                        if(args.data.rate  > 1){
                            swalApi.info("请输入小于等于100%的数");
                            args.data.rate = undefined;
                            args.data.plan_amt = undefined;
                            return;
                        }
                        var rates = 0;
                        $scope.data.currItem.epm_payment_plan_ecn.forEach(function (value) {
                            if(value.ref_amt_type == 1){
                                rates = numberApi.sum(rates, value.rate);
                            }
                        });
                        if(rates > 1){
                            swalApi.info("当前回款总额以超出合同总额，请重新输入");
                            args.data.rate = undefined;
                            args.data.plan_amt = undefined;
                            return;
                        }
                        args.data.plan_amt = numberApi.mutiply(args.data.rate,$scope.data.currItem.contract_amt);
                    }
                };

                /**
                 * 计算周期条件金额与比例
                 */
                $scope.sumAmt = function(args){
                    if(args.data.ref_amt_type == 1){
                        if(args.data.plan_amt == undefined || args.data.plan_amt == 0){
                            reutrn;
                        }
                        if($scope.data.currItem.contract_amt == undefined
                            || $scope.data.currItem.contract_amt == null
                            ||$scope.data.currItem.contract_amt == ""
                            ||$scope.data.currItem.contract_amt == 0){//没有合同总额
                            swalApi.info("该合同请先维护合同总额");
                            args.data.rate = undefined;
                            args.data.plan_amt = undefined;
                            return;
                        }
                        if(args.data.plan_amt  < 0){
                            swalApi.info("请输入大于零的数");
                            args.data.rate = undefined;
                            args.data.plan_amt = undefined;
                            return;
                        }
                        if(args.data.plan_amt  > $scope.data.currItem.contract_amt){
                            swalApi.info("请输入小于等于合同总额的金额数");
                            args.data.rate = undefined;
                            args.data.plan_amt = undefined;
                            return;
                        }
                        var plans = 0;
                        $scope.data.currItem.epm_payment_plan_ecn.forEach(function (value) {
                            if(value.ref_amt_type == 1){
                                plans = numberApi.sum(plans, value.plan_amt);
                            }
                        });
                        if(plans > $scope.data.currItem.contract_amt){
                            swalApi.info("当前回款总额以超出合同总额，请重新输入");
                            args.data.plan_amt = undefined;
                            args.data.rate = undefined;
                            return;
                        }
                        args.data.rate = numberApi.divide(args.data.plan_amt,$scope.data.currItem.contract_amt);
                    }
                };
                /*----------------------------------按钮方法数据 定义-------------------------------------------*/

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    //产品清单变更
                    bizData.epm_contract_item_ecn_lines = [];
                    //原合同周期条件
                    bizData.epm_payment_plan_set = [];
                    //变更周期条件
                    bizData.epm_payment_plan_ecn = [];
                    bizData.ecn_type = 1;
                    //$scope.chooseData();
                    $scope.searchContro();
                };

                /**
                 * 判断是否为经销商
                 */
                /*$scope.chooseData = function () {
                    //判断是否为经销商账户登陆
                    if(user.actived == 2 && user.usertype == 4){
                        $scope.isDealer = 2;
                        //为经销商登陆,查询当前账户的相关客户资料
                        requestApi
                            .post({
                                classId: 'epm_project_contract',
                                action: 'selectdealer',
                                data: {
                                    customer_code :  userbean.userid
                                }
                            }).then(function (val) {
                                if(val.flag == 111){
                                    swalApi
                                        .info('系统不存在与当前登录用户有关的客户资料信息，无法发起兑现业务，请联系管理员。')
                                        .then(function () {
                                            this.window.opener = null;
                                            window.close();
                                        });
                                }else{
                                    $scope.data.currItem.customer_id = val.epm_project_contracts[0].customer_id;
                                    $scope.data.currItem.customer_code = val.epm_project_contracts[0].customer_code;
                                    $scope.data.currItem.customer_name = val.epm_project_contracts[0].customer_name;
                                    $scope.searchContro();
                                }
                            });
                    }else{
                        $scope.isDealer = 1;
                        $scope.searchContro();
                    }
                };*/

                /**
                 * 项目查询
                 */
                $scope.searchContro = function () {
                    $modal.openCommonSearch({
                        classId: 'epm_project_contract',
                        sqlWhere: function () {
                            return ' valid = 2 and ( contract_type = 1 or is_frame = 2) '
                        },
                        gridOptions:{
                            columnDefs:[
                                {
                                    headerName: "工程合同编码",
                                    field: "contract_code"
                                },{
                                    headerName: "工程合同名称",
                                    field: "contract_name"
                                },{
                                    headerName: "工程编码",
                                    field: "project_code"
                                },{
                                    headerName: "工程名称",
                                    field: "project_name"
                                },{
                                    headerName: "签约类型",
                                    field: "contract_type",
                                    hcDictCode : 'epm.contract_type'
                                },{
                                    headerName: "签约时间",
                                    field: "signed_date",
                                    type : '日期'
                                }
                            ]
                        },
                        beforeOk: function (result) {
                            return requestApi
                                .post({
                                    classId: 'epm_project_contract_ecn',
                                    action: 'select',
                                    data: {
                                        flag: 3,
                                        contract_id: result.contract_id
                                    }
                                })
                                .then(function (data) {
                                    if(data.epm_contract_item_ecn_lines.length > 0){
                                        swalApi.info('与该合同相关的变更单【'
                                                + data.epm_contract_item_ecn_lines[0].ecn_code
                                                + '】尚未审核完毕，暂时不能发起新变更，请检查。');
                                        return false;
                                    }else{
                                        return result;
                                    }
                                });
                        }
                    })
                        .result//响应数据
                        .then(function (result) {
                            var fileds = [
                                'contract_id',              //合同id
                                'contract_code',            //合同编码
                                'contract_name',            //合同名称
                                'contract_amt',             //合同金额
                                'signed_date',              //签约时间
                                'trading_company_name',     //交易公司
                                'customer_code',            //客户编码
                                'customer_name',            //客户名称
                                'contract_type',            //签约方式
                                'project_code',             //项目编码
                                'project_name',             //项目名称
                                'address',                  //项目地址
                                'billing_unit_name'         //开票单位
                            ];

                            fileds.forEach(function (filed) {
                                $scope.data.currItem[filed] = result[filed];
                            });
                            requestApi
                                .post({
                                    classId: 'epm_project_contract_ecn',
                                    action: 'select',
                                    data: {
                                        flag: 4,
                                        contract_id: $scope.data.currItem.contract_id
                                    }
                                })
                                .then(function (data) {
                                    data.epm_payment_plan_set.forEach(function (value) {
                                        if(value.ref_time_node == 99){
                                            value.times = value.timeset;
                                        }else{
                                            if(value.timeset != undefined){
                                                var str = value.timeset.substr(0,1);
                                                value.numbers = value.timeset.substr(1);
                                                if(str == "+"){
                                                    value.adddel = 1;
                                                }else if(str == "-"){
                                                    value.adddel = 2;
                                                }
                                            }
                                        }
                                        if(value.rate == 0){
                                            value.rate = undefined;
                                        }
                                        if(value.plan_amt == 0){
                                            value.plan_amt = undefined;
                                        }
                                    });
                                    $scope.data.currItem.epm_payment_plan_set = data.epm_payment_plan_set;
                                    $scope.gridOptions_line_sta.hcApi.setRowData(data.epm_payment_plan_set);
                                });
                        })
                        .then(function () {}, function (line) {
                            if (line == "头部关闭") {
                                this.window.opener = null;
                                window.close();
                            }
                        });
                };
                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    if(bizData.ecn_type == 2){
                        //由项目失效生成的单据
                        $scope.parameter = 2;
                        $scope.hcSuper.setBizData(bizData);
                        //设置产品清单
                        $scope.gridOptions.hcApi.setRowData(bizData.epm_contract_item_ecn_lines);
                        $scope.gridOptionsOutstanding.hcApi.setRowData(bizData.outstanding_indents);
                        $scope.tabs.outstanding.title = '未清订单明细(' + bizData.outstanding_indents.length + ')';
                        $scope.tabs.outstanding.hide = false;
                        bizData.epm_payment_plan_set = [];
                        bizData.epm_payment_plan_ecn = [];
                    }else if(bizData.ecn_type == 1){//由认为新建的单据
                        $scope.hcSuper.setBizData(bizData);
                        bizData.epm_contract_item_ecn_lines = [];
                        $scope.setDataConstructionPayment();
                        //设置原合同周期条件
                        $scope.gridOptions_line_sta.hcApi.setRowData($scope.data.currItem.epm_payment_plan_set);
                        //设置变更周期条件
                        $scope.gridOptions_line.hcApi.setRowData($scope.data.currItem.epm_payment_plan_ecn);
                    }else if(bizData.ecn_type == 3){//发起失效
                        $scope.form.editing = true;
                        $scope.parameter = 2;
                        bizData.ecn_type = 2;
                        bizData.ecn_code = undefined;
                        $scope.hcSuper.setBizData(bizData);
                        //设置产品清单
                        $scope.gridOptions.hcApi.setRowData(bizData.epm_contract_item_ecn_lines);
                        $scope.gridOptionsOutstanding.hcApi.setRowData(bizData.outstanding_indents);
                        $scope.tabs.outstanding.title = '未清订单明细(' + bizData.outstanding_indents.length + ')';
                        $scope.tabs.outstanding.hide = false;
                        bizData.epm_payment_plan_set = [];
                        bizData.epm_payment_plan_ecn = [];
                        requestApi//发起失效时，数据库暂时不保存
                            .post({
                                classId: 'epm_project_contract_ecn',
                                action: 'delete',
                                data: {
                                    ecn_id: $scope.data.currItem.ecn_id
                                }
                            }).then(function () {
                                $scope.data.currItem.ecn_id = undefined;
                            });
                    }
                };

                /**
                 * 保存数据前处理数据
                 */
                $scope.saveBizData = function (bizData) {
                    $scope.hcSuper.saveBizData(bizData);
                    bizData.epm_payment_plan_ecn.forEach(function (value) {
                        if(value.ref_time_node == 99){
                            value.timeset = value.times;
                        }else{
                            if(value.adddel == 1){
                                value.timeset = "+"+value.numbers;
                            }else if(value.adddel == 2){
                                value.timeset = "-"+value.numbers;
                            }else{
                                value.timeset = "";
                            }
                        }
                    });
                };

                 /**
                 * 保存验证
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck
					
                    $scope.data.currItem.epm_payment_plan_ecn.forEach(function (value, index) {
                        if (value.ref_time_node != 99) {
                            if ((value.adddel != undefined && value.adddel != null && value.adddel != "")
                                && (value.numbers == undefined || value.numbers == null || value.numbers == "")) {
                                invalidBox.push("新周期条件，第" + (index + 1) + "行，请明确加减的天数");
                            } else if ((value.adddel == undefined || value.adddel == null || value.adddel == "")
                                && (value.numbers != undefined && value.numbers != null && value.numbers != "")) {
                                invalidBox.push("新周期条件，第" + (index + 1) + "行，请明确是加天数还是减天数");
                            }
                        }
                    });

                    return invalidBox;
                }

                /**
                 * 数据结构重组
                 */
                $scope.setDataConstructionPayment = function () {
                    $scope.data.currItem.epm_payment_plan_set.forEach(function (value) {
                        if(value.ref_time_node == 99){
                            value.times = value.timeset;
                        }else{
                            if(value.timeset != undefined){
                                var str = value.timeset.substr(0,1);
                                value.numbers = value.timeset.substr(1);
                                if(str == "+"){
                                    value.adddel = 1;
                                }else if(str == "-"){
                                    value.adddel = 2;
                                }
                            }
                        }
                        if(value.rate == 0){
                            value.rate = undefined;
                        }
                        if(value.plan_amt == 0){
                            value.plan_amt = undefined;
                        }
                    });
                    $scope.data.currItem.epm_payment_plan_ecn.forEach(function (value) {
                        if(value.ref_time_node == 99){
                            value.times = value.timeset;
                        }else{
                            if(value.timeset != undefined){
                                var str = value.timeset.substr(0,1);
                                value.numbers = value.timeset.substr(1);
                                if(str == "+"){
                                    value.adddel = 1;
                                }else if(str == "-"){
                                    value.adddel = 2;
                                }
                            }
                        }
                        if(value.rate == 0){
                            value.rate = undefined;
                        }
                        if(value.plan_amt == 0){
                            value.plan_amt = undefined;
                        }
                    })
                };

                /*----------------------------------网格按钮方法-------------------------------------------*/
                /**
                 * 添加周期条件
                 */
                $scope.addPlan = function () {
                    $scope.gridOptions_line.api.stopEditing();
                    $scope.data.currItem.epm_payment_plan_ecn.push({});
                    $scope.gridOptions_line.hcApi.setRowData($scope.data.currItem.epm_payment_plan_ecn);
                };
                /**
                 * 删除行周期条件
                 */
                $scope.delPlan = function () {
                    var idx = $scope.gridOptions_line.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.epm_payment_plan_ecn.splice(idx, 1);
                        $scope.gridOptions_line.hcApi.setRowData($scope.data.currItem.epm_payment_plan_ecn);
                    }
                };

                /*----------------------------------按钮及标签 定义-------------------------------------------*/

                /*底部左边按钮*/
                $scope.footerLeftButtons.addRow.hide = true;
                $scope.footerLeftButtons.deleteRow.hide = true;

            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });

    });