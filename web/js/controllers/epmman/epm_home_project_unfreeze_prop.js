/**
 * 家装单体解冻申请
 * 2020/3/23
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', '$modal', 'requestApi'],
    function (module, controllerApi, base_obj_prop, $modal, requestApi) {

        var controller = [
            '$scope',

            function ($scope) {
                /*------------------------------继承基础控制器------------------------------------------*/
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //经销商id
                $scope.data.customer_id = 0;

                var fileds = [
                    'project_id',   /* 项目id */
                    'project_code', /* 项目编码 */
                    'project_name', /* 项目名称 */
                    'area_full_name',/* 项目省市区 */
                    'address', /* 项目地址 */
                    'freeze_time',
                    'report_id',
                    'report_time',
                    'pdt_line',
                    'trading_company_name', 
                    'competitive_brand',
                    'cooperation_area', 
                    'project_valid_date', 
                    'agent_opinion', 
                    'agent',
                    'strac_coop_inv_region',
                    'customer_code', 
                    'customer_name',
                    'dealer_follower', 
                    'dealer_follower_phone', 
                    'natureb_usiness', 
                    'line_business',
                    'background',
                    'own_follower', 
                    'follow_people_duty',
                    'own_follower_phone', 
                    'predict_sales_amount', 
                    'business_name', 
                    'project_legal_name',
                    'intent_product'];
                /*----------------------------------计算方法-------------------------------------------*/

                /**
                 * 表格：家装网点信息
                 */
                $scope.stageGridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        },
                        {
                            field: 'branch_message_name',
                            headerName: '网点名称'
                        },
                        {
                            field: 'business_name',
                            headerName: '营业执照名称'
                        },
                        {
                            field: 'branch_legal_name',
                            headerName: '网点法人',
                            width: 300
                        },
                        {
                            field: 'address',
                            headerName: '地址'
                        },
                        {
                            field: 'linkman',
                            headerName: '联系人',
                            minWidth: 146
                        },
                        {
                            field: 'phone',
                            headerName: '联系人电话'
                        }
                    ]
                };
                
                /*----------------------------------通用查询-------------------------------------------*/
 
                /**
                 * 工程项目查询
                 */
                $scope.searchObjectEpmProject = function () {
                    $modal.openCommonSearch({
                        classId: 'epm_project',
                        postData : {
                            /* 项目解冻申请通用查询 */
                            search_flag : 8,
                            primary_key_id :
                                $scope.data.currItem.proj_unfreeze_id > 0 ?
                                    $scope.data.currItem.proj_unfreeze_id : 0,
                            customer_id : $scope.data.customer_id > 0 ? $scope.data.customer_id : 0
                        }
                    })
                        .result//响应数据
                        .then(function (response) {
                            fileds.forEach(function (filed) {
                                $scope.data.currItem[filed] = response[filed];
                            });
                            //查询当前组织的事业部
                            return requestApi
                                .post({
                                    classId: 'epm_project_unfreeze',
                                    action: 'selectline',
                                    data: {
                                        report_id : response.report_id
                                    }
                                })
                                .then(function (data) {
                                    $scope.data.currItem.epm_report_auth_branchs = data.epm_report_auth_branchs;
                                    $scope.stageGridOptions.hcApi.setRowData($scope.data.currItem.epm_report_auth_branchs);
                                });
                            
                            
                        });
                };

                /*----------------------------------按钮方法数据 定义-------------------------------------------*/

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    //家装单体报备解冻
                    bizData.monomer_type = 2;
                    //经销商账户登陆
                    if(customer){
                        $scope.data.customer_id = customer.customer_id;
                    }
                    bizData.epm_report_auth_branchs = [];
                    $scope.searchObjectEpmProject();
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    //经销商账户登陆
                    if(customer){
                        $scope.data.customer_id = customer.customer_id;
                    }

                    $scope.stageGridOptions.hcApi.setRowData(bizData.epm_report_auth_branchs);
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