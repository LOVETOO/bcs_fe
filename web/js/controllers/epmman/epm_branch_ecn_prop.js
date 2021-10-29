/**
 * 网点变更申请
 * 2020/03/05
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi) {

        var controller = [
            '$scope',

            function ($scope) {
                /*------------------------------继承基础控制器------------------------------------------*/
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //是否经销商登陆
                $scope.isCustomerCode = user.isCustomer;

                //不可见生效失效按钮
                $scope.notVisible = true;
                if(user.userid == 'admin'){//判断登陆用户
                    $scope.notVisible = false;
                }else{//判断用的角色代号
                    user.roleofusers.some(function(value){
                        if(value.roleid == 'admins' || value.roleid == 'branch_visible_effect'){
                            $scope.notVisible = false;
                            return true;
                        }
                    });
                }

                //通用查询
                $scope.commonSearch = {
                    customercode :{/* 客户查询 */
                        title: '客户',
                        postData: {
                            search_flag: 142
                        },
                        afterOk: function (customer) {
                            ['customer_id', 'customer_code', 'customer_name'].forEach(function (field) {
                                $scope.data.currItem[field] = customer[field];
                            });
                        }
                    },
                    branch_message_code : {
                        postData: {
                            search_flag: 2
                        },
                        afterOk: function (data) {
                            requestApi
                                .post({
                                    classId: 'epm_branch_message',
                                    action: 'select',
                                    data: {
                                        branch_message_id: data.branch_message_id
                                    }
                                })
                                .then(function(data){
                                    $scope.projAttachController.setAttaches(data.epm_project_attachs);
                                    ['branch_message_id', 'branch_message_code', 'branch_message_name',
                                    'branch_legal_name', 'branch_valid', 'business_name', 'customer_id',
                                    'customer_code', 'customer_name', 'linkman', 'phone'].forEach(function(field){
                                        $scope.data.currItem[field] = data[field];
                                    });
                                });
                        },
                        beforeOk : function (result) {
                            return requestApi
                                .post({
                                    classId: 'epm_branch_ecn',
                                    action: 'verify',
                                    data: {
                                        branch_message_id : result.branch_message_id
                                    }
                                })
                                .then(function (data) {
                                    if (data.flag == 1) {
                                        swalApi.error('该网点正在走流程，请检查！');
                                        return false;
                                    }else{
                                        return result;
                                    }
                                });
                        }
                    }
                }

                $scope.footerLeftButtons.addRow.hide = true;
                $scope.footerLeftButtons.deleteRow.hide = true;

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    //经销商账户登陆
                    if(customer){
                        $scope.data.currItem.customer_id = customer.customer_id;
                        $scope.data.currItem.customer_code = customer.customer_code;
                        $scope.data.currItem.customer_name = customer.customer_name;
                    }
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
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