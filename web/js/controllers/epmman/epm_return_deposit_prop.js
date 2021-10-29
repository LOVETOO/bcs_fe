/**
 * author：zengjinhua
 * since：2020/2/20
 * Description：保证金退还
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'swalApi'],
    function (module, controllerApi, base_obj_prop, requestApi, swalApi) {

        var controller = [
            '$scope',

            function ($scope) {
                /*======================继承基础控制器======================*/
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /*============================通用查询============================*/
                /**
                 * 通用查询
                 */
                $scope.searchObject = {
                    epm_project : {/* 查询报备 */
                        postData: function () {
                            return {
                                report_type: 1, /* 单体项目 */
                                customer_id: user.isCustomer ? customer.customer_id : 0,
                                is_local : 1 /* 异地报备 */
                            };
                        },
                        afterOk: function (proj) {
                            var fields = [
                                'project_id',					//项目ID
                                'project_code',					//项目编码
                                'project_name',					//项目名称
                                'area_full_name',			    //项目地址
                                'need_deposit'                  //缴纳保证金
                            ];
    
                            //若不是经销商账号，还需填充经销商信息
                            if (!user.isCustomer) {
                                fields.push(
                                    'customer_id',				//经销商ID
                                    'customer_code',			//经销商编码
                                    'customer_name' 			//经销商名称
                                );
                            }

                            //若同意缴纳保证金，【汇款金额】默认为【保证金金额】
                            if(proj.need_deposit == 2){
                                $scope.data.currItem.remittance_bond = $scope.data.currItem.deposit_amount;
                            }else{
                                $scope.data.currItem.remittance_bond = undefined;
                            }
    
                            fields.forEach(function (field) {
                                $scope.data.currItem[field] = proj[field];
                            });
                            //清空交易公司
                            $scope.data.currItem.trading_company_id = undefined;
                            $scope.data.currItem.trading_company_name = undefined;
                            //清空开票单位
                            $scope.data.currItem.trading_company_id = undefined;
                            $scope.data.currItem.billing_unit_name = undefined;
                        },
                        beforeOk: function (result) {
                            return requestApi
                                .post({
                                    classId: 'epm_return_deposit',
                                    action: 'verify',
                                    data: {
                                        project_id: result.project_id
                                    }
                                })
                                .then(function (data) {
                                    if(data.autotrophy == 'N' && data.sell == 'N'){
                                        swalApi.info('该报备项目还未做合同');
                                        return false;
                                    }else{
                                        $scope.data.currItem.autotrophy = data.autotrophy;
                                        $scope.data.currItem.sell = data.sell;
                                        contractType();
                                        return result;
                                    }
                                });
                        }
                    },
                    trading_company_name : {/* 查询交易公司 */
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
                            //清空开票单位
                            $scope.data.currItem.trading_company_id = undefined;
                            $scope.data.currItem.billing_unit_name = undefined;
                        },
                        beforeOpen:function() {
                            if ($scope.data.currItem.project_code == undefined || $scope.data.currItem.project_code == "") {
                                swalApi.info('请先选择项目');
                                return false;
                            }
                        }
                    },
                    billing_unit_name : {/* 查询开票单位 */
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
                        },
                        beforeOpen:function() {
                            if ($scope.data.currItem.trading_company_name == undefined || $scope.data.currItem.trading_company_name == "") {
                                swalApi.info('请先选择交易公司');
                                return false;
                            }
                        }
                    },
                    customer_code : {/* 查询客户资料 */
                        title: '客户',
                        postData: {
                            search_flag: 124
                        },
                        afterOk: function (customer) {
                            $scope.data.currItem.local_customer_id = customer.customer_id;
                            $scope.data.currItem.local_customer_name = customer.customer_name;
                        }
                    }
                };

                /*============================ 方法定义 ============================*/
                /**
                 * 修改退还方式
                 */
                $scope.changeReturn = function(){
                    if($scope.data.currItem.return_type != 2){
                        /**
                         * 退还方式为本地售后时
                         * 置空以下字段
                         */
                        ['task_amount', 'after_sale_amount', 'cfm_task_amount', 'cfm_after_sale_amount']
                        .forEach(function(field){
                            $scope.data.currItem[field] = undefined;
                        });
                    }
                }

                /**
                 * 赋值签约方式
                 */
                function contractType(){
                    if($scope.data.currItem.autotrophy == 'Y' && $scope.data.currItem.sell == 'Y'){
                        /**
                         * 即存在自营合同
                         * 也存在经销商合同
                         */
                        $scope.data.currItem.contract_type = '直销、经销';
                    }else if($scope.data.currItem.autotrophy == 'Y'){
                        //存在自营合同
                        $scope.data.currItem.contract_type = '直销';
                    }else if($scope.data.currItem.sell == 'Y'){
                        //存在经销商合同
                        $scope.data.currItem.contract_type = '经销';
                    }else{
                        /**
                         * 即没有自营合同
                         * 也没有经销商合同
                         * TODO:可能后续删除了数据
                         */
                        $scope.data.currItem.contract_type = '发生未知错误，请联系管理员';
                    }
                }

                /*============================方法数据 定义============================*/

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    //若当前账号是【经销商】
					if (user.isCustomer) {
						['customer_id', 'customer_code', 'customer_name'].forEach(function (field) {
							$scope.data.currItem[field] = customer[field];
						});
					}
                    //查询当前组织的事业部
                    requestApi
                        .post({
                            classId: 'epm_division',
                            action: 'select',
                            data: {}
                        })
                        .then(function (data) {
                            ['division_id', 'division_code', 'division_name'].forEach(function (field) {
                                $scope.data.currItem[field] = data[field];
                            });
                        });
                };

                /**
                 * 保存验证
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    
                    if ($scope.data.currItem.return_type == 1){
                        /**
                         * 异地售后方式
                         * 附件必须上传
                         */
                        if($scope.projAttachController.getAttaches().length <= 0 ){
                            //没有附件
                            invalidBox.push("请上传'情况说明表'附件！");
                        }else {
                            var whether = true;
                            $scope.projAttachController.getAttaches().forEach(function (value) {
                                if(value.attach_type == "情况说明表"){
                                    whether = false;
                                }
                            });
                            if(whether){
                                invalidBox.push("请上传'情况说明表'附件！");
                            }
                        }
                    }else if($scope.data.currItem.return_type == 3){
                        /**
                         * 双方协商退还
                         * 附件必须上传
                         */
                        if($scope.projAttachController.getAttaches().length <= 0 ){
                            invalidBox.push("请上传'协调函'附件！");
                        }else {
                            var whether = true;
                            $scope.projAttachController.getAttaches().forEach(function (value) {
                                if(value.attach_type == "协调函"){
                                    whether = false;
                                }
                            });
                            if(whether){
                                invalidBox.push("请上传'协调函'附件！");
                            }
                        }
                    }
                    /**
                     * 审核中并且
                     * 退还方式为本地售后
                     * 核实任务划拨与核实售后服务费
                     * 需大于零
                     */
                    if($scope.data.currItem.stat == 3 && $scope.data.currItem.return_type == 2){
                        if(! $scope.data.currItem.cfm_task_amount > 0){
                            invalidBox.push('请填写核实任务划拨');
                        }
                        if(! $scope.data.currItem.cfm_after_sale_amount > 0){
                            invalidBox.push('请填写核实售后服务费');
                        }
                    }

                    return invalidBox;
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    contractType();
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