/**
 * 经销商工程合同
 * 2019/6/21
 * zengjinhua
 */
define(
	['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'swalApi', 'numberApi', 'gridApi', 'openBizObj', 'angular', '$modal', 'controllers/epmman/epmman', 'directive/hcModal'],
	function (module, controllerApi, base_obj_prop, requestApi, swalApi, numberApi, gridApi, openBizObj, angular, $modal, epmman) {

        var controller = [
            '$scope', '$stateParams', '$q',

            function ($scope, $stateParams, $q) {
                /*------------------------------继承基础控制器------------------------------------------*/
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
				});

                //定义经销商是否可编辑
                $scope.data.DealerShow = 1;
                //定义产品取消判断数据
                $scope.data.cancel = 0;
                //定义增补合同的可编辑参数
                $scope.data.supplementaryRead = 1;
                //是否多个折扣单
                $scope.isMultipleDiscountTickets = false;

                //定义状态可见参数 1-可见单据状态 2-可见有效状态
                $scope.data.statShow = 1;

                $scope.examineShow = $stateParams.openedByListPage;

                //userbean数据放入$scope作用域
				$scope.userbean = userbean;

                //标签定义
                $scope.tabs.base = {
                    title: '基本信息',
                    active: true
                };
                $scope.tabs.product = {
                    title: '合同清单'
                };
                //表格切换定义
                $scope.item_date = {};
                $scope.item_date.detailed = {
                    title: '产品清单',
                    active: true
                };
                $scope.item_date.deliveryPlan = {
                    title: '提货计划'
                };
                /**
                 * 合同打开主合同不可见流程
                 */
                $scope.tabs.wf.hide = function(){
                    return $scope.examineShow == 1
                };

                /*----------------------------------表格定义-------------------------------------------*/
                /**
                 * 表格定义  "产品清单"
                 */
                $scope.gridOptions_product = epmman.getGridOptionsOfDiscountLine({
                    $scope: $scope
                });

                /**
                 * 表格定义  "产品清单_取消"
                 */
                $scope.gridOptions_cancel = epmman.getGridOptionsOfDiscountLine({
                    $scope: $scope
                });

                /**
                 * 提货计划
                 */
                $scope.gridOptionDseliveryPlan = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'item_code',
                        headerName: '产品编码',
                        rowSpan: function (params) {
                            if (params.node.data.span_count) {
                                return params.node.data.span_count;
                            }
                        }
                    }, {
                        field: 'item_name',
                        headerName: '产品名称',
                        rowSpan: function (params) {
                            if (params.node.data.span_count) {
                                return params.node.data.span_count;
                            }
                        }
                    }, {
                        field: 'contract_qty',
                        headerName: '合同数量',
                        type : '数量',
                        rowSpan: function (params) {
                            if (params.node.data.span_count) {
                                return params.node.data.span_count;
                            }
                        }
                    }, {
                        field: 'active_qty',
                        headerName: '未分配数量',
                        type : '数量',
                        rowSpan: function (params) {
                            if (params.node.data.span_count) {
                                return params.node.data.span_count;
                            }
                        }
                    }, {
                        field: 'plan_qty',
                        headerName: '预计提货数量',
                        type : '数量'
                    }, {
                        field: 'plan_date',
                        headerName: '预计提货时间',
                        type : '日期'
                    }],
                    hcEvents: {
                        cellDoubleClicked: function (params) {
                            if ($scope.isFormReadonly() || !$scope.form.editing) {
                                return;
                            }
                            if(params.data.contract_qty > 0){
                                $scope.dateOfDelivery.open({//打开模态框
                                    resolve: {
                                        before_line: params.data,
                                        gridApi : gridApi
                                    },
                                    size: 'lg',
                                    controller: ['$scope', '$q', 'before_line', 'gridApi',
                                        function ($modalScope, $q, before_line, gridApi) {
                                            $modalScope.title = "提货计划设置";
                                            $modalScope.before_line = before_line;
                                            $modalScope.saveExecute = true;
                                            $modalScope.gridOptionDseliveryPlanLine = {
                                                columnDefs: [
                                                    {
                                                        type: '序号'
                                                    },
                                                    {
                                                        field: 'plan_qty',
                                                        headerName: '预计提货数量',
                                                        hcRequired: true,
                                                        editable : function (args) {
                                                            return !args.node.rowPinned;
                                                        },
                                                        type : '数量',
                                                        onCellValueChanged: function (args) {
                                                            if($modalScope.saveExecute){
                                                                if (args.newValue === args.oldValue) {
                                                                    return;
                                                                }
                                                                if(args.data.plan_qty <= 0){
                                                                    swalApi.info('输入不合法!输入大于零的数字');
                                                                    args.data.plan_qty = undefined;
                                                                }
                                                            }
                                                            $modalScope.calSum();
                                                        }
                                                    },
                                                    {
                                                        field: 'plan_date',
                                                        headerName: '预计提货时间',
                                                        hcRequired: true,
                                                        editable : function (args) {
                                                            return !args.node.rowPinned;
                                                        },
                                                        type : '日期',
                                                        onCellValueChanged: function (args) {
                                                            if($modalScope.saveExecute){
                                                                if (args.newValue === args.oldValue) {
                                                                    return;
                                                                }
                                                                if(new Date(args.data.plan_date).getTime() < new Date().getTime()){
                                                                    swalApi.info('预计提货时间需大于当天');
                                                                    args.data.plan_date = undefined;
                                                                }else if(new Date(args.data.plan_date).Format('yyyy-MM-dd')
                                                                    == new Date().Format('yyyy-MM-dd')){
                                                                    swalApi.info('预计提货时间需大于当天');
                                                                    args.data.plan_date = undefined;
                                                                }
                                                            }
                                                        }
                                                    }
                                                ],
                                                pinnedBottomRowData: [{ seq: '合计' }],
                                                //定义表格增减行按钮
                                                hcButtons: {
                                                    businessAdd: {
                                                        icon: 'iconfont hc-add',
                                                        click: function () {
                                                            $modalScope.gridOptionDseliveryPlanLine.api.stopEditing();
                                                            $modalScope.discount_apply_plans;
                                                            $modalScope.discount_apply_plans.push({
                                                                seq : $modalScope.before_line.seq,
                                                                item_id : $modalScope.before_line.item_id,
                                                                item_code : $modalScope.before_line.item_code,
                                                                item_name : $modalScope.before_line.item_name,
                                                                contract_qty : $modalScope.before_line.contract_qty,
                                                                discount_apply_id : $modalScope.before_line.discount_apply_id,
                                                                discount_apply_line_id : $modalScope.before_line.discount_apply_line_id
                                                            });
                                                            $modalScope.gridOptionDseliveryPlanLine.hcApi.setRowData(
                                                                $modalScope.discount_apply_plans);
                                                        }
                                                    },
                                                    invoiceDel: {
                                                        icon: 'iconfont hc-reduce',
                                                        click: function () {
                                                            var idx = $modalScope.gridOptionDseliveryPlanLine.hcApi
                                                                .getFocusedRowIndex();
                                                            if (idx < 0) {
                                                                swalApi.info('请选中要删除的行');
                                                            } else {
                                                                $modalScope.discount_apply_plans.splice(idx, 1);
                                                                $modalScope.gridOptionDseliveryPlanLine.hcApi.setRowData(
                                                                    $modalScope.discount_apply_plans);
                                                            }
                                                        }
                                                    }
                                                }
                                            };
                                            //合计数据
                                            $modalScope.calSum = function () {
                                                $modalScope.gridOptionDseliveryPlanLine.api.setPinnedBottomRowData([
                                                    {
                                                        seq: '合计',
                                                        plan_qty: numberApi.sum($modalScope.discount_apply_plans, 'plan_qty')
                                                    }
                                                ]);
                                            };
                                            $modalScope.discount_apply_plans = [];//定义一个数组
                                            $scope.data.currItem.epm_discount_apply_plans.forEach(function (value) {//设置同一个产品数据
                                                if(value.seq == $modalScope.before_line.seq){
                                                    $modalScope.discount_apply_plans.push(value)
                                                }
                                            });
                                            gridApi.execute($modalScope.gridOptionDseliveryPlanLine, function () {
                                                $modalScope.gridOptionDseliveryPlanLine.hcApi.setRowData(
                                                    $modalScope.discount_apply_plans);
                                                $modalScope.calSum();
                                            });
                                            angular.extend($modalScope.footerRightButtons, {
                                                ok: {
                                                    title: '确定',
                                                    click: function () {
                                                        return $q
                                                            .when()
                                                            .then(function () {
                                                                $modalScope.saveExecute = false;
                                                                $modalScope.gridOptionDseliveryPlanLine.api.stopEditing();
                                                                $modalScope.saveExecute = true;
                                                                var arr = [];
                                                                var isExecute = true;
                                                                //合计分配数量
                                                                var sum = 0;
                                                                $modalScope.discount_apply_plans.forEach(function (value) {
                                                                    sum = numberApi.sum(value.plan_qty, sum);
                                                                });
                                                                //校验合计数量
                                                                if(sum > $modalScope.before_line.contract_qty){
                                                                    arr.push('当前预计提货合计数量超出合同数量，请重新输入');
                                                                    isExecute = false;
                                                                }
                                                                //进行数据校验
                                                                $modalScope.discount_apply_plans.forEach(function (value, index) {
                                                                    /*==========校验日期=========*/
                                                                    if(value.plan_date == undefined || value.plan_date == null || value.plan_date == ""){
                                                                        arr.push("第" + (index+1) + "行,未维护提货时间");
                                                                        isExecute = false;
                                                                    }else if(new Date(value.plan_date).getTime() < new Date().getTime()){
                                                                        arr.push("第" + (index+1) + "行,预计提货时间需大于当天");
                                                                        isExecute = false;
                                                                    }else if(new Date(value.plan_date).Format('yyyy-MM-dd')
                                                                        == new Date().Format('yyyy-MM-dd')){
                                                                        arr.push("第" + (index+1) + "行,预计提货时间需大于当天");
                                                                        isExecute = false;
                                                                    }
                                                                    /*==========校验天数=========*/
                                                                    if(value.plan_qty <= 0 || value.plan_qty == undefined){
                                                                        arr.push("第" + (index+1) + "行,输入不合法!输入大于零的数字");
                                                                        isExecute = false;
                                                                    }
                                                                });
                                                                if(arr.length){
                                                                    swalApi.error(arr);
                                                                    return isExecute;
                                                                }
                                                                if(isExecute){
                                                                    var active_qty = 0;
                                                                    //合计提货数量
                                                                    $modalScope.discount_apply_plans.forEach(function (value) {
                                                                        active_qty = numberApi.sum(value.plan_qty, active_qty);
                                                                    });
                                                                    //计算未分配数量
                                                                    active_qty = numberApi
                                                                        .sub($modalScope.before_line.contract_qty, active_qty);
                                                                    var mapArr = [];
                                                                    $scope.data.currItem.epm_discount_apply_plans.forEach(function (value) {
                                                                        if(value.seq != $modalScope.before_line.seq){
                                                                            mapArr.push(value);
                                                                        }
                                                                    });
                                                                    $scope.data.currItem.epm_discount_apply_plans = mapArr;
                                                                    if($modalScope.discount_apply_plans.length > 0){
                                                                        //排序
                                                                        $modalScope.discount_apply_plans.sort(function (a, b) {
                                                                            return new Date(a.plan_date).getTime() - new Date(b.plan_date).getTime();
                                                                        });
                                                                        //定义累计数量
                                                                        var totalPlanQty = 0;
                                                                        $modalScope.discount_apply_plans.forEach(function (value) {
                                                                            //计算累计数量
                                                                            totalPlanQty = numberApi.sum(totalPlanQty, value.plan_qty);
                                                                            value.total_plan_qty = totalPlanQty;
                                                                            //计算未分配数量
                                                                            value.active_qty = active_qty;
                                                                            $scope.data.currItem.epm_discount_apply_plans.push(value);
                                                                        });
                                                                    }else{
                                                                        $scope.data.currItem.epm_discount_apply_plans.push({
                                                                            seq : $modalScope.before_line.seq,
                                                                            item_id : $modalScope.before_line.item_id,
                                                                            item_code : $modalScope.before_line.item_code,
                                                                            item_name : $modalScope.before_line.item_name,
                                                                            active_qty : active_qty,
                                                                            discount_apply_id : $modalScope.before_line.discount_apply_id,
                                                                            discount_apply_line_id : $modalScope.before_line.discount_apply_line_id,
                                                                            plan_id : $modalScope.before_line.plan_id,
                                                                            contract_qty : $modalScope.before_line.contract_qty
                                                                        });
                                                                    }
                                                                    //排序
                                                                    $scope.data.currItem.epm_discount_apply_plans.sort(function (a, b) {
                                                                        return a.seq - b.seq;
                                                                    });
                                                                    /* 行合并 */
                                                                    var rowProj = {};
                                                                    var seq = 0;
                                                                    $scope.data.currItem.epm_discount_apply_plans.forEach(function (value, index) {
                                                                        if(index == 0){
                                                                            rowProj[value.seq] = 1;
                                                                        }else if(rowProj[value.seq] == undefined){
                                                                            rowProj[value.seq] = 1;
                                                                        }else{
                                                                            rowProj[value.seq] = numberApi.sum(rowProj[value.seq], 1);
                                                                        }
                                                                    });
                                                                    $scope.data.currItem.epm_discount_apply_plans.forEach(function (value, index) {
                                                                        if(index == 0){
                                                                            seq = value.seq;
                                                                            value.span_count = rowProj[value.seq];
                                                                        }else if(value.seq != seq){
                                                                            seq = value.seq;
                                                                            value.span_count = rowProj[value.seq];
                                                                        }else{
                                                                            value.span_count = undefined;
                                                                        }
                                                                    });
                                                                    //设置数据
                                                                    $scope.gridOptionDseliveryPlan.hcApi.setRowData(
                                                                        $scope.data.currItem.epm_discount_apply_plans);
                                                                    return true;
                                                                }
                                                            })
                                                            .then(function (isExecute) {
                                                                if(isExecute){//关闭窗口
                                                                    $modalScope.$close();
                                                                }
                                                            });
                                                    }
                                                }
                                            });
                                        }]
                                })
                            }else{
                                swalApi.info('请先维护合同数量');
                            }
                        }
                    }
                };

                /**
                 * 表格定义  "折扣申请"
                 */
                $scope.gridOptionsDiscount = {
                    columnDefs: [{
                        type: '序号'
                    },
                    {
                        field: 'stat',
                        headerName: '审核状态',
                        hcDictCode: 'stat',
                        cellStyle: {
                            'text-align': 'center' //文本居中
                        }
                    },
                    {
                        field: 'discount_apply_code',
                        headerName: '申请单号'
                    },
                    {
                        field: 'creator_name',
                        headerName: '申请人'
                    },
                    {
                        field: 'createtime',
                        headerName: '申请时间'
                    },
    
                    {
                        field: 'division_id',
                        headerName: '所属事业部',
                        hcDictCode: 'epm.division'
                    },
                    {
                        field: 'order_pdt_line',
                        headerName: '订单产品线',
                        hcDictCode: 'epm.order_pdt_line'
                    },
                    {
                        field: 'contract_type',
                        headerName: '签约方式',
                        hcDictCode: 'epm.contract_type'
                    },
                    {
                        field: 'discount_valid_date',
                        headerName: '折扣有效期',
                        type: '日期'
                    },
                    {
                        field: 'source_from_delay',
                        headerName: '延期生成',
                        type: '是否'
                    },
                    {
                        field: 'source_discount_apply_code',
                        headerName: '源折扣单号'
                    }],
                    hcEvents: {  
                        cellDoubleClicked: function (params) {
                            openBizObj({
                                stateName: 'epmman.epm_discount_apply_prop',
                                params: {
                                    id: params.data.discount_apply_id,
                                    readonly: true
                                }
                            });
                        }  
                    }  
                        
                };

                /*------------------------------网格方法------------------------------------------*/

                /**
                 * 计算折后单价
                 */
                function calData(args) {
                    if(args.data.discount_rate != undefined && args.data.discount_rate != "" && args.data.discount_rate != null){//判断应用折扣率是否为空
                        if(args.data.stand_price != undefined && args.data.stand_price != "" && args.data.stand_price != null){//判断标准单价是否为空值
                            //计算折后单价
                            args.data.discounted_price = numberApi.mutiply(args.data.discount_rate, args.data.stand_price);
                            if(args.data.apply_qty != undefined && args.data.apply_qty != "" && args.data.apply_qty != null){//判断申请数量是否为空
                                //计算折后金额
                                args.data.discounted_amount = numberApi.mutiply(args.data.discount_rate, args.data.stand_price, args.data.apply_qty);
                            }
                        }
                        if(args.data.apply_qty != undefined && args.data.apply_qty != "" && args.data.apply_qty != null){//判断申请数量是否为空
                            if(args.data.weight != undefined && args.data.weight != "" && args.data.weight != null){//判断重量是否为空
                                //计算总重量
                                args.data.total_weight = numberApi.mutiply(args.data.weight, args.data.discount_rate, args.data.apply_qty);
                            }
                        }
                    }
                    if(args.data.cubage != undefined && args.data.cubage != "" && args.data.cubage != null){//判断体积是否为空
                        if(args.data.apply_qty != undefined && args.data.apply_qty != "" && args.data.apply_qty != null){//判断申请数量是否为空
                            //计算总体积
                            args.data.total_volume = numberApi.mutiply(args.data.cubage, args.data.apply_qty);
                        }
                    }

                }

                /**
                 * 网格复制产品数据方法
                 */
                function getItem(code,args) {
                    var postData = {
                        classId: "item_org",
                        action: 'search',
                        data: {sqlwhere : "item_code = '"+code+"'"}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            if(data.item_orgs.length>0){
                                var a = 1;
                                args.data.item_code = undefined;
                                $scope.data.currItem.epm_contract_items.forEach(function (val) {
                                    if(val.item_code == data.item_orgs[0].item_code){
                                        swalApi.info('不能选择重复产品，请重新选择!');
                                        a = 0;
                                    }
                                });
                                if(a==1){
                                    args.data.item_id = data.item_orgs[0].item_id;
                                    args.data.item_code = data.item_orgs[0].item_code;
                                    args.data.item_name = data.item_orgs[0].item_name;
                                    args.data.model = data.item_orgs[0].item_model;//型号
                                    args.data.unit = data.item_orgs[0].uom_name;//单位
                                }
                            }else{
                                swalApi.info("产品编码【"+code+"】不可用");
                            }
                        });
                }

                /**
                 * 网格复制型号数据方法
                 */
                function getModelItem(code,args) {
                    var postData = {
                        classId: "item_org",
                        action: 'search',
                        data: {sqlwhere : "item_model = '"+code+"'"}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            if(data.item_orgs.length>0){
                                var a = 1;
                                $scope.data.currItem.epm_contract_items.forEach(function (val) {
                                    if(val.item_code == data.item_orgs[0].item_code){
                                        swalApi.info('不能选择重复产品，请重新选择!');
                                        args.data.item_code = "";
                                        args.data.item_id = 0;
                                        a = 0;
                                    }
                                });
                                if(a==1){
                                    args.data.item_id = data.item_orgs[0].item_id;
                                    args.data.item_code = data.item_orgs[0].item_code;
                                    args.data.item_name = data.item_orgs[0].item_name;
                                    args.data.model = data.item_orgs[0].item_model;//型号
                                    args.data.unit = data.item_orgs[0].uom_name;//单位
                                }
                            }else{
                                swalApi.info("产品型号【"+code+"】不可用");
                            }
                        });
                }
                /*----------------------------------计算方法-------------------------------------------*/

                /**
                 * 折扣有效期时间校验
                 */
                $scope.changeDiscountDate = function (){
                    if($scope.data.currItem.valid_date != undefined && $scope.data.currItem.valid_date != "" && $scope.data.currItem.valid_date !=null){
                        if(new Date().getTime() > new Date($scope.data.currItem.valid_date).getTime()){
                            $scope.data.currItem.valid_date = undefined;
                            swalApi.info('折扣有效期不能早于当天');
                        }
                    }
                };

                /**
                 * 修改时间方法
                 */
                $scope.changeDate = function(){
                    if(($scope.data.currItem.contract_effect_date != ""
                        && $scope.data.currItem.contract_effect_date != undefined
                        && $scope.data.currItem.contract_effect_date != null)
                        && ($scope.data.currItem.contract_expire_date != ""
                            && $scope.data.currItem.contract_expire_date != undefined
                            && $scope.data.currItem.contract_expire_date != null)){
                        if(new Date($scope.data.currItem.contract_effect_date).getTime()>=
                            new Date($scope.data.currItem.contract_expire_date).getTime()){
                            swalApi.info("合作结束时间应大于合作开始时间，请重新选择");
                            $scope.data.currItem.contract_expire_date = undefined;
                            return;
                        }
                        if(new Date($scope.data.currItem.contract_effect_date).Format('yyyy-MM-dd') ==
                            new Date($scope.data.currItem.contract_expire_date).Format('yyyy-MM-dd')){
                            swalApi.info("合作结束时间应大于合作开始时间，请重新选择");
                            $scope.data.currItem.contract_expire_date = undefined;
                        }
                    }
                };

                /**
                 * 计算总价
                 */
                function sumPrice(args){
                    if(args.data.price!=null
                        &&args.data.price!=undefined
                        &&args.data.price!=""
                        &&args.data.qty!=null
                        &&args.data.qty!=undefined
                        &&args.data.qty!=""){
                        if(!numberApi.isNum(Number(args.data.qty))){
                            swalApi.info('数量输入不是数字，请重新输入!');
                            args.data.qty = undefined;
                            return;
                        }
                        if(!numberApi.isNum(Number(args.data.price))){
                            swalApi.info('单价输入不是数字，请重新输入!');
                            args.data.price = undefined;
                            return;
                        }
                        args.data.amount=numberApi.mutiply(args.data.price,args.data.qty);
                        args.api.refreshView();//刷新网格视图
                    }
                }

                /**
                 * 修改纯定制
                 */
                $scope.changeCustom = function () {
                    if($scope.data.currItem.is_custom == 2){//勾选纯定制
                        $scope.data.currItem.is_custom = 1;
                        return swalApi
                            .confirm("选择纯定制,将清空单据对应的折扣信息,确定选择纯定制吗?")
                            .then(function () {
                                $scope.data.currItem.is_custom = 2;
                                $scope.tabs.product.hide = true;
                            });
                    }else{
                        $scope.tabs.product.hide = false;
                    }
                };
                /**
                 * 计算产品合计数据
                 */
                // function calSum() {
                //     //合计折后总金额
                //     $scope.data.currItem.discounted_amount
                //         = numberApi.sum($scope.data.currItem.epm_discount_apply_lines, 'discounted_amount');
                //     //合计折前总金额
                //     $scope.data.currItem.undiscounted_amount
                //         = numberApi.sum($scope.data.currItem.epm_discount_apply_lines, 'undiscounted_amount');
                //     //合计总体积
                //     $scope.data.currItem.total_volume
                //         = numberApi.sum($scope.data.currItem.epm_discount_apply_lines, 'cubage');
                //     //合计总数量
                //     $scope.data.currItem.total_qty
                //         = numberApi.sum($scope.data.currItem.epm_discount_apply_lines, 'apply_qty');
                //     $scope.gridOptions_product.api.setPinnedBottomRowData([
                //         {
                //             seq: '合计',
                //             cubage: numberApi.sum($scope.data.currItem.epm_contract_items, 'cubage'),
                //             apply_qty: numberApi.sum($scope.data.currItem.epm_contract_items, 'apply_qty'),
                //             discounted_amount: numberApi.sum($scope.data.currItem.epm_contract_items, 'discounted_amount'),
                //             undiscounted_amount: numberApi.sum($scope.data.currItem.epm_contract_items, 'undiscounted_amount')
                //         }
                //     ]);
                // }
                /**
                 * 计算合计数据
                 */
                $scope.calSum = function () {
                    //计算取消产品
                    $scope.gridOptions_cancel.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            qty: numberApi.sum($scope.data.currItem.epm_contract_item_cancels, 'qty'),//数量
                            amount: numberApi.sum($scope.data.currItem.epm_contract_item_cancels, 'amount')//总价
                        }
                    ]);
                };

                /*----------------------------------通用查询-------------------------------------------*/

                /**
                 * 币别查询
                 */
                $scope.searchObjectBaseCurrency = {
                    afterOk: function (customer) {
                        $scope.data.currItem.base_currency_id = customer.base_currency_id;
                        $scope.data.currItem.currency_name = customer.currency_name;
                    }
                };

                /**
                 * 经销商查询
                 */
                $scope.commonSearch = {
                    customer_code: {
                        postData: {
                            search_flag: 124
                        },
                        sqlWhere : ' valid = 2 ',
                        afterOk: function (customer) {
							['customer_id', 'customer_code', 'customer_name'].forEach(function (field) {
								$scope.data.currItem[field] = customer[field];
							});

							epmman.doAfterGetCustomerInDiscount({
								customer: customer,
								gridOptions: $scope.gridOptions_product
							});
                        }
                    }
                };

                /**
                 * 修改工程项目通用查询
                 */
                $scope.changeProject = function () {
                    $scope.data.currItem.trading_company_id = undefined;
                    $scope.data.currItem.trading_company_name = undefined;
                    $scope.data.currItem.billing_unit_name = undefined;
                    if($scope.data.currItem.project_code == undefined || $scope.data.currItem.project_code == null || $scope.data.currItem.project_code ==""){
                        $scope.data.currItem.strategic_related = 1;
                        //清空数据
                        ['strategic_contract_id', 'strategic_contract_code', 'strategic_contract_name', 'predict_sales_amount', 'report_time',
                        'strategic_project_id', 'strategic_project_code', 'strategic_project_name', 'cost_rate'].forEach(function (value) {
                            $scope.data.currItem[value] = undefined;
                        });
                    }
                };

                /**
                 * 工程项目查询
                 */
                $scope.searchObjectEpmProject = {
					postData: function () {
						return {
							report_type: 1,
                            customer_id: user.isCustomer ? customer.customer_id : 0
						};
					},
                    afterOk: function (proj) {
						var fields = [
							'project_id',					//项目ID
							'project_code',					//项目编码
							'project_name',					//项目名称
							'report_time',					//报备时间
							'address',						//地址
							'stage_id',						//阶段ID
							'stage_name',					//阶段名称
							'trading_company_id',			//交易公司ID
							'trading_company_name',			//交易公司名称
                            'is_local',						//本地/异地
                            'cost_rate',
                            'predict_sales_amount'
						];

						//若不是经销商账号，还需填充经销商信息
						if (!user.isCustomer) {
							fields.push(
								'customer_id',				//经销商ID
								'customer_code',			//经销商编码
								'customer_name',			//经销商名称
								'division_id',				//事业部ID
								'division_name'				//事业部名称
							);
						}

						fields.forEach(function (field) {
							$scope.data.currItem[field] = proj[field];
						});
                        $scope.data.currItem.trading_company_id = undefined;
                        $scope.data.currItem.trading_company_name = undefined;
                        $scope.data.currItem.billing_unit_name = undefined;
                        if (proj.rel_project_id > 0) {
                            $scope.data.currItem.strategic_related = 2;
                            $scope.data.currItem.strategic_project_id = proj.rel_project_id;
                            $scope.data.currItem.strategic_project_code = proj.rel_project_code;
                            $scope.data.currItem.strategic_project_name = proj.rel_project_name;
                            setStasData(proj.rel_project_id);
                        }
                        else {
                            $scope.data.currItem.strategic_related = 1;
                            ['strategic_contract_id', 'strategic_contract_code', 'strategic_contract_name',
                                'strategic_project_id', 'strategic_project_code', 'strategic_project_name'].forEach(function (value) {
                                $scope.data.currItem[value] = undefined;
                            });
                        }

						return epmman.doAfterGetCustomerInDiscount({
							gridOptions: $scope.gridOptions_product,
							customer: proj
						});
                    }
                };

                /**
                 * 乙方机构名称查询
                 */
                $scope.searchObjectScporg = {
                    postData : function(){
                        return {
                            /** 4-通用查询 */
                            search_flag : 4,
                            customer_id : $scope.data.currItem.customer_id
                        }
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.trading_company_id = result.trading_company_id;
                        $scope.data.currItem.trading_company_name = result.trading_company_name;
                    },
                    beforeOpen:function() {
                        if ($scope.data.currItem.project_code == undefined || $scope.data.currItem.project_code == "") {
                            swalApi.info('请先选择项目');
                            return false;
                        }
                    }
                };

                /**
                 * 开票单位查询
                 */
                $scope.searchObjectBillingUnitName = {
                    postData : function () {
                        return {
                            flag : 9,
                            customer_id : $scope.data.currItem.customer_id,
                            trading_company_id : $scope.data.currItem.trading_company_id
                        }
                    },
                    title : '开票单位',
                    dataRelationName:'epm_project_contracts',
                    gridOptions:{
                        columnDefs:[
                            {
                                headerName: "开票单位编码",
                                field: "legal_entity_code"
                            },{
                                headerName: "开票单位名称",
                                field: "legal_entity_name"
                            }
                        ]
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.billing_unit_id = result.legal_entity_id;
                        $scope.data.currItem.billing_unit_name = result.legal_entity_name;

                        $scope.data.currItem.tax_identify_num = result.tax_no;
                        $scope.data.currItem.billing_bank = result.bank;
                        $scope.data.currItem.billing_account = result.bank_accno;
                    },
                    beforeOpen:function() {
                        if ($scope.data.currItem.trading_company_name == undefined || $scope.data.currItem.trading_company_name == "") {
                            swalApi.info('请先选择交易公司');
                            return false;
                        }
                    }
                };

                /**
                 * 产品查询查询
                 */
                $scope.chooseItem = function (args) {
                    if(args.rowPinned){
                        return;
                    }
                    $modal.openCommonSearch({
                        classId:'item_org'
                    })
                        .result//响应数据
                        .then(function(result){
                            var a = 1;
                            args.data.item_code = undefined;
                            $scope.data.currItem.epm_contract_items.forEach(function (val) {
                                if(val.item_code == result.item_code){
                                    swalApi.info('不能选择重复产品，请重新选择!');
                                    a = 0;
                                }
                            });
                            if(a == 1){
                                args.data.item_id = result.item_id;
                                args.data.item_code = result.item_code;
                                args.data.item_name = result.item_name;
                                args.data.model = result.item_model;//型号
                                args.data.unit = result.uom_name;//单位
                                //args.data.unit = result.uom_name;//申请数量
                                args.data.entorgid = result.entorgid;//产品线
                                //args.data.unit = result.uom_name;//标准单价
                                args.data.spec = result.specs;//规格
                                args.data.item_color = result.item_color;//颜色
                                args.data.cubage = result.cubage;//体积
                                args.data.weight = result.net_weigth;//重量
                            }
                            return args
                        })
                        .then(function () {
                        args.api.refreshView();//刷新网格视图
                    });
                };

                /*----------------------------------按钮方法数据 定义-------------------------------------------*/

				/**
				 * 初始化
				 * @override
				 */
				$scope.doInit = function () {
					return $q
						.when()
						.then($scope.hcSuper.doInit)
						.then(function () {
							return $q.all([
								requestApi.getDict('epm.order_pdt_line'),
								requestApi.post({
									classId: 'order_pdt_line',
									data: {
										bill_type: 4, //订单类型：折扣申请单
										organization_id: ent.entid
									}
								}),
							]);
						})
						.then(function (responses) {
							var order_pdt_lines = responses[0];
							var active_order_pdt_lines = responses[1].order_pdt_lines;

							$scope.order_pdt_lines = order_pdt_lines.map(function (order_pdt_line) {
								return {
									value: order_pdt_line.dictvalue,
									name: order_pdt_line.dictname,
									disabled: active_order_pdt_lines.every(function (active_order_pdt_line) {
										return active_order_pdt_line.order_pdt_line_id != order_pdt_line.dictvalue;
									})
								};
							});

							//若是新增，且下拉值只有一个，赋值
							if ($scope.data.isInsert) {
								active_order_pdt_lines = $scope.order_pdt_lines.filter(function (order_pdt_line) {
									return !order_pdt_line.disabled;
								});

								if (active_order_pdt_lines.length === 1) {
									$scope.data.currItem.order_pdt_line = active_order_pdt_lines[0].value;
								}
							}
						});
				};

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    //产品清单
                    bizData.epm_contract_items = [];
                    //产品清单取消
                    bizData.epm_contract_item_cancels = [];
                    //预计提货
                    bizData.epm_discount_apply_plans = [];
					bizData.contract_character = 'AR'; //"AR"--项目收款合同
					bizData.channel = 4; //渠道：工程
                    $scope.data.currItem.contract_type = 2;//签约方式
                    $scope.data.currItem.discount_type = 1;//折扣类型
					$scope.data.currItem.valid = 1;
                    $scope.data.currItem.base_currency_id = 1;
                    $scope.data.currItem.currency_name = "人民币";
					//若当前账号是【经销商】
					if (user.isCustomer) {
						['customer_id', 'customer_code', 'customer_name', 'division_name'].forEach(function (field) {
							$scope.data.currItem[field] = customer[field];
						});
					}

                    //是否为经销商账号登陆
                    //isDealerLog();
                };

                /**
                 * 是否为经销商账号登陆
                 */
                function isDealerLog (){
                    requestApi
                        .post({
                            classId: 'scpuser',
                            action: 'search',
                            data: {
                                sqlwhere : ' actived = 2 and usertype = 4 and SYSUSERID = ' + userbean.sysuserid
                            }
                        })
                        .then(function (data) {
                            if(data.users.length > 0){//当前登陆账号为经销商
                                $scope.data.DealerShow = 2;
                                requestApi
                                    .post({
                                        classId: 'epm_project_contract',
                                        action: 'selectdealer',
                                        data: {
                                            customer_name :  userbean.userid
                                        }
                                    })
                                    .then(function (val) {
                                        if(val.flag == 111){
                                            swalApi.info('当前所登录的经销商账户无效').then(function () {
                                                this.window.opener = null;
                                                window.close();
                                            });
                                        }else{
                                            $scope.data.currItem.customer_id = val.epm_project_contracts[0].customer_id;
                                            $scope.data.currItem.customer_code = val.epm_project_contracts[0].customer_code;
                                            $scope.data.currItem.customer_name = val.epm_project_contracts[0].customer_name;
                                            $scope.data.currItem.division_name = val.epm_project_contracts[0].division_name;
                                        }
                                    });
                            }else {//当前登陆账号不是经销商
                                $scope.data.DealerShow = 1;
                            }
                        });
                }

                /**
                 *  保存验证
                 */
                $scope.validCheck = function (invalidBox) {
					return $q
						.when(invalidBox)
						.then($scope.hcSuper.validCheck)
						.then(function () {
							return epmman.validCheckInDiscount({
								gridOptions: $scope.gridOptions_product,
								invalidBox: invalidBox
							});
						})
                        .then(function () {
                            //生成提货计划行数据
                            //定义一个容器
                            var arr = [];
                            $scope.data.currItem.epm_contract_items.forEach(function (value, index) {
                                //排序
                                value.seq = index + 1;
                                var notExist = true;
                                $scope.data.currItem.epm_discount_apply_plans.forEach(function (val) {
                                    if(value.item_id == val.item_id){
                                        val.seq = value.seq;
                                        val.contract_qty = value.contract_qty;
                                        notExist = false;
                                        arr.push(val);
                                    }
                                });
                                if(notExist){//不存在
                                    arr.push({//新增一行数据
                                        seq : value.seq,
                                        item_id : value.item_id,
                                        item_code : value.item_code,
                                        item_name : value.item_name,
                                        contract_qty : value.contract_qty,
                                        active_qty : value.contract_qty
                                    });
                                }
                            });
                            arr.sort(function (a, b) {
                                return a.seq - b.seq;
                            });
                            $scope.data.currItem.epm_discount_apply_plans = arr;
                            $scope.gridOptionDseliveryPlan.hcApi.setRowData(arr);
                            var proj = {};
                            $scope.data.currItem.epm_discount_apply_plans.forEach(function (value, index) {
                                if(index == 0){
                                    proj[value.seq] = value.plan_qty;
                                }else{
                                    if(proj[value.seq] == undefined){
                                        proj[value.seq] = value.plan_qty;
                                    }else{
                                        proj[value.seq] = numberApi.sum(value.plan_qty, proj[value.seq]);
                                    }
                                }
                            });
                            $scope.data.currItem.epm_discount_apply_plans.forEach(function (value) {
                                value.active_qty = numberApi.sub(value.contract_qty, proj[value.seq]);
                            });
                            $scope.gridOptionDseliveryPlan.hcApi.setRowData($scope.data.currItem.epm_discount_apply_plans);
                            //校验提货计划数据
                            // var seq = 0;
                            // var accord = true;
                            // var incompleteBox = [];
                            // var nonidentityBox = [];
                            // $scope.data.currItem.epm_discount_apply_plans.some(function(value){
                            //     if(value.active_qty != undefined 
                            //         && value.active_qty != null 
                            //         && value.plan_qty != undefined){
                            //         accord = false;
                            //         return true;
                            //     }
                            // });
                            // if(accord && $scope.data.currItem.epm_discount_apply_plans.length > 0){
                            //     invalidBox.push('请维护产品的“提货计划”（具体日期+预提货数量)');
                            // }else{
                            //     $scope.data.currItem.epm_discount_apply_plans.forEach(function (value, index) {
                            //         if(index == 0){
                            //             seq = value.seq;
                            //             if(value.active_qty != undefined && value.active_qty != null && value.active_qty != ""){
                            //                 if(value.active_qty > 0){
                            //                     incompleteBox.push(index + 1);
                            //                 }else if(value.active_qty < 0){
                            //                     nonidentityBox.push(index + 1);
                            //                 }
                            //             }
                            //         }else if(value.seq != seq){
                            //             seq = value.seq;
                            //             if(value.active_qty != undefined && value.active_qty != null && value.active_qty != ""){
                            //                 if(value.active_qty > 0){
                            //                     incompleteBox.push(index + 1);
                            //                 }else if(value.active_qty < 0){
                            //                     nonidentityBox.push(index + 1);
                            //                 }
                            //             }
                            //         }
                            //     });
                            // }
                            // if(incompleteBox.length){
                            //     invalidBox.push(
                            //         '',
                            //         '产品的提货计划需要全部计划完毕，以下行不合法，',
                            //         '第' + incompleteBox.join('、') + '行'
                            //     );
                            // }
                            // if(nonidentityBox.length){
                            //     invalidBox.push(
                            //         '',
                            //         '产品的预提货数量不能大于合同数量，以下行不合法：',
                            //         '第' + nonidentityBox.join('、') + '行'
                            //     );
                            // }
                        });
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    supplement(bizData);
                    if(bizData.stat == 5){
                        $scope.data.statShow = 2;
                    }
                    if(bizData.is_custom == 2){
                        $scope.tabs.product.hide = true;
                    }else{
                        $scope.tabs.product.hide = false;
                    }
                    $scope.hcSuper.setBizData(bizData);
                    if(bizData.epm_discount_applys.length > 1){//多个折扣单
                        $scope.isMultipleDiscountTickets = true;
                        //设置多个折扣单数据
                        gridApi.execute($scope.gridOptionsDiscount, function () {
                            $scope.gridOptionsDiscount.hcApi.setRowData(bizData.epm_discount_applys);
                        });
                    }else{
                        $scope.isMultipleDiscountTickets = false;
                    }
                    //设置产品清单                    
					epmman.setDiscountLineData({
						gridOptions: $scope.gridOptions_product
                    });
                    //设置提货计划
                    gridApi.execute( $scope.gridOptionDseliveryPlan, function () {
                        var proj = {};
                        bizData.epm_discount_apply_plans.forEach(function (value, index) {
                            if(index == 0){
                                proj[value.seq] = value.plan_qty;
                            }else{
                                if(proj[value.seq] == undefined){
                                    proj[value.seq] = value.plan_qty;
                                }else{
                                    proj[value.seq] = numberApi.sum(value.plan_qty, proj[value.seq]);
                                }
                            }
                        });
                        bizData.epm_discount_apply_plans.forEach(function (value) {
                            value.active_qty = numberApi.sub(value.contract_qty, proj[value.seq]);
                        });
                        /* 行合并 */
                        var rowProj = {};
                        var seq = 0;
                        bizData.epm_discount_apply_plans.forEach(function (value, index) {
                            if(index == 0){
                                rowProj[value.seq] = 1;
                            }else if(rowProj[value.seq] == undefined){
                                rowProj[value.seq] = 1;
                            }else{
                                rowProj[value.seq] = numberApi.sum(rowProj[value.seq], 1);
                            }
                        });
                        bizData.epm_discount_apply_plans.forEach(function (value, index) {
                            if(index == 0){
                                seq = value.seq;
                                value.span_count = rowProj[value.seq];
                            }else if(value.seq != seq){
                                seq = value.seq;
                                value.span_count = rowProj[value.seq];
                            }else{
                                value.span_count = undefined;
                            }
                        });
                        $scope.gridOptionDseliveryPlan.hcApi.setRowData(bizData.epm_discount_apply_plans);
                    });
                    gridApi.execute( $scope.gridOptions_cancel, function () {
                        //设置产品清单取消
                        $scope.gridOptions_cancel.hcApi.setRowData(bizData.epm_contract_item_cancels);
                        if(bizData.epm_contract_item_cancels.length>0){
                            $scope.data.cancel = 1;
                        }
                        $scope.calSum();
                    });
                    selectStaData ();
                    judgeIsExamine();
                    if($scope.data.currItem.discount_rate == 0){
                        $scope.data.currItem.discount_rate = undefined;
                    }
                };

                /**
                 * 查工程项目是否为战略项目
                 */
                function selectStaData () {
                    if ($scope.data.currItem.strategic_project_id > 0) {//单体项目属于战略项目，带出战略协议数据
                        $scope.data.currItem.strategic_related = 2;
                        setStasData($scope.data.currItem.strategic_project_id);
                    }
                    else {
                        $scope.data.currItem.strategic_related = 1;
                    }
                }

                /**
                 * 判断是否为增补合同
                 */
                function supplement(bizData) {
                    if(bizData.main_contract_id > 0){//为增补合同
                        $scope.data.supplementaryRead = 2;
                    }else if(bizData.main_contract_id == -1){//新增增补合同
                        $scope.form.editing = true;
                        $scope.data.supplementaryRead = 2;
                        //将源合同的主id修改为0
                        requestApi
                            .post({
                                classId: "epm_project_contract",
                                action: 'modifysource',
                                data: {
                                    main_contract_id : 0,
                                    contract_id : bizData.contract_id
                                }
                            });
                        /*---将主合同的信息赋值给增补合同---*/
                        bizData.main_contract_id = bizData.contract_id;
                        bizData.main_contract_code = bizData.contract_code;
                        bizData.main_contract_name = bizData.contract_name;
                        /*---当源id为-1时，以下数据进行重新维护---*/
                        //主表数据重置
                        bizData.valid = 1;
                        bizData.stat = 1;
                        //主表数据清空
                        var fields = [
                            'contract_id',
                            'contract_code',
                            'contract_name',
                            'wfflag',
                            'wfid',
                            'audit_stat',
                            'ext_contract_id',
                            'is_init',
                            'signed_date',               //签订时间
                            'signed_location',           //签订地点
                            'contract_effect_date',      //合作开始时间
                            'contract_expire_date',      //合作结束时间
                            'contract_amt',              //合同总额
                            'remark',                    //备注
                            'discount_valid_date',       //折扣有效期
                            'total_volume',              //总体积
                            'total_qty',                 //总数量
                            'discounted_amount',         //总金额
                            'discount_rate',             //折扣率
                            'dealer_gm',                 //工程服务商毛利率
                            'division_gm',               //事业部内结毛利率
                            'value_chain_gm',            //价值链毛利率
                            'apply_reason',              //申请说明
                            'price_contain_tax',         //价格含税
                            'price_contain_tax_desc',    //含税说明
                            'price_contain_freight',     //价格含运费
                            'price_contain_freight_desc',//含运费说明
                            'first_delivery_date',       //首次发货日期
                            'completed_date',            //结案时间
                            'completed_type',            //结案状态
                            'oa_audit_stat'              //OA审批状态
                        ];
                        fields.forEach(function (field) {//将其中字段进行置空
                            bizData[field] = undefined;
                        });
                        bizData.epm_contract_items = [];                //产品
                        bizData.epm_project_attachs = [];               //附件
                        bizData.epm_discount_applys = [];               //多个折扣单
                        bizData.epm_discount_apply_plans = [];          //多个折扣单
                    }
                }

                /**
                 * 复制
                 */
                $scope.copyBizData = function (bizData) {
                    $scope.hcSuper.copyBizData(bizData);
                    $scope.form.editing = true;
                    bizData.completed_type = undefined;
                    bizData.completed_date = undefined;
                    bizData.discount_rate = undefined;
                    bizData.dealer_gm = undefined;
                    bizData.division_gm = undefined;
                    bizData.value_chain_gm = undefined;
                    bizData.oa_audit_stat = undefined;
                    bizData.discount_valid_date = undefined;
                    bizData.discount_apply_code = undefined;
                    bizData.discount_apply_id = undefined;
                    bizData.audit_stat = undefined;
                    bizData.contract_name = undefined;
                    bizData.epm_project_attachs = [];               //附件
                    bizData.epm_contract_items.forEach(function(value){
                        value.contract_item_line_id = undefined;
                        value.discount_apply_id = undefined;
                        value.discount_apply_line_id = undefined;
                    });
                    bizData.epm_discount_apply_plans.forEach(function (value) {
                        value.discount_apply_id = undefined;
                        value.discount_apply_line_id = undefined;
                        value.plan_id = undefined;
                    })
                };

                /**
                 * 判断是否审批
                 */
                function judgeIsExamine(){
                    if($scope.data.currItem.stat == 5){
                        gridApi.execute( $scope.gridOptions_product, function () {
                            $scope.gridOptions_product.columnDefs[6].hide = false;
                            $scope.gridOptions_product.columnDefs[7].hide = false;
                            $scope.gridOptions_product.api.setColumnDefs($scope.gridOptions_product.columnDefs);
                        })
                    }
                }

                /**
                 * 设置战略协议关联数据
                 */
                function setStasData (id){
                    requestApi
                        .post({
                            classId: 'epm_project_contract',
                            action: 'strategicprojects',
                            data: {
                                project_id : id
                            }
                        })
                        .then(function (values) {
                            if(values.contract_code != undefined && values.contract_code != null && values.contract_code !=""){
                                $scope.data.currItem.strategic_contract_code_name = values.contract_code + " " + values.contract_name;
                                $scope.data.currItem.strategic_contract_code = values.contract_code;
                                $scope.data.currItem.strategic_contract_id = values.contract_id;
                                $scope.data.currItem.strategic_contract_name = values.contract_name;
                                $scope.data.currItem.manager = values.manager;
                            }else{
                                $scope.data.currItem.strategic_contract_code = undefined;
                                $scope.data.currItem.strategic_contract_id = undefined;
                                $scope.data.currItem.strategic_contract_name = undefined;
                            }
                        });
                }
                /*----------------------------------按钮及标签 定义-------------------------------------------*/

                /*底部左边按钮*/
                $scope.footerLeftButtons.addRow.click = function () {
                    if ($scope.tabs.product.active) {
						//$scope.addProduct && $scope.addProduct();
						return epmman.addDiscountLine({
							gridOptions: $scope.gridOptions_product
						});
                    }
                };
                $scope.footerLeftButtons.addRow.hide = function () {
                    return (!$scope.tabs.product.active) || ($scope.tabs.product.active && $scope.item_date.deliveryPlan.active);
                };
                $scope.footerLeftButtons.deleteRow.click = function () {
                    if ($scope.tabs.product.active) {
						$scope.delProduct && $scope.delProduct();
						return epmman.calDiscountData({
							gridOptions: $scope.gridOptions_product
						});
                    }
                };
                $scope.footerLeftButtons.deleteRow.hide = function () {
                    return (!$scope.tabs.product.active) || ($scope.tabs.product.active && $scope.item_date.deliveryPlan.active);
                };
                /*----------------------------------按钮方法 定义-------------------------------------------*/
                /**s
                 * 页签改变事件
                 * @param params
                 */
                $scope.onObjTabChange = function (params) {
                    $q.when()
                        .then(function () {
                            if(params.tab.title == '提货计划'){
                                //定义一个容器
                                var arr = [];
                                $scope.data.currItem.epm_contract_items.forEach(function (value, index) {
                                    //排序
                                    value.seq = index + 1;
                                    var notExist = true;
                                    $scope.data.currItem.epm_discount_apply_plans.forEach(function (val) {
                                        if(value.item_id == val.item_id && value.discount_apply_line_id == val.discount_apply_line_id){
                                            val.seq = value.seq;
                                            val.contract_qty = value.contract_qty;
                                            notExist = false;
                                            arr.push(val);
                                        }
                                    });
                                    if(notExist){//不存在
                                        arr.push({//新增一行数据
                                            seq : value.seq,
                                            discount_apply_line_id : value.discount_apply_line_id,
                                            item_id : value.item_id,
                                            item_code : value.item_code,
                                            item_name : value.item_name,
                                            contract_qty : value.contract_qty,
                                            active_qty : value.contract_qty
                                        });
                                    }
                                });
                                arr.sort(function (a, b) {
                                    return a.seq - b.seq;
                                });
                                $scope.data.currItem.epm_discount_apply_plans = arr;
                                /* 行合并 */
                                var rowProj = {};
                                var seq = 0;
                                $scope.data.currItem.epm_discount_apply_plans.forEach(function (value, index) {
                                    if(value.active_qty == null || value.active_qty == undefined || value.active_qty === ""){
                                        value.active_qty = value.contract_qty;
                                    }
                                    if(index == 0){
                                        rowProj[value.seq] = 1;
                                    }else if(rowProj[value.seq] == undefined){
                                        rowProj[value.seq] = 1;
                                    }else{
                                        rowProj[value.seq] = numberApi.sum(rowProj[value.seq], 1);
                                    }
                                });
                                $scope.data.currItem.epm_discount_apply_plans.forEach(function (value, index) {
                                    if(index == 0){
                                        seq = value.seq;
                                        value.span_count = rowProj[value.seq];
                                    }else if(value.seq != seq){
                                        seq = value.seq;
                                        value.span_count = rowProj[value.seq];
                                    }else{
                                        value.span_count = undefined;
                                    }
                                });
                                $scope.gridOptionDseliveryPlan.hcApi.setRowData($scope.data.currItem.epm_discount_apply_plans);
                            }
                        });
                };
                /**
                 * 添加产品清单
                 */
                $scope.addProduct = function () {
                    $scope.gridOptions_product.api.stopEditing();
                    var data = $scope.data.currItem.epm_contract_items;
                    data.push({});
                    $scope.gridOptions_product.hcApi.setRowData(data);
                };
                /**
                 * 删除行产品清单
                 */
                $scope.delProduct = function () {
                    var idx = $scope.gridOptions_product.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        var data = $scope.data.currItem.epm_contract_items.splice(idx, 1);
                        $scope.gridOptions_product.hcApi.setRowData($scope.data.currItem.epm_contract_items);
                        var arr = [];
                        $scope.data.currItem.epm_discount_apply_plans.forEach(function (value) {
                            if(value.item_id != data[0].item_id){
                                arr.push(value);
                            }
                        });
                        $scope.data.currItem.epm_discount_apply_plans = arr;
                    }
                };
            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });

    });