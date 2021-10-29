/**
 * 网点档案
 * 2020/03/04
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

                //隐藏流程标签
                $scope.tabs.wf.hide = true;

                //定义标签
                $scope.tabs.project = {
                    title: '报备项目'
                };

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

                /**
                 * 表格定义
                 */
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, 
                    {
                        field: 'project_valid',
                        headerName: '有效状态',
                        hcDictCode: 'valid',
                        cellStyle: function (params) {
                            var style = {
                                'text-align': 'center'
                            };
    
                            var color = Switch(params.value, '==')
                                .case(1, 'gray')		//未失效
                                .case(2, 'green')		//已生效
                                .case(3, 'red')			//已失效
                                .case(4, 'blue')		//已冻结
                                .result;
    
                            if (color) {
                                style['color'] = color;
                            }
    
                            return style;
                        }
                    },
                    {
                        field: 'report_type',
                        headerName: '报备类型',
                        minWidth : 80,
                        type:'词汇',
                        cellEditorParams: {
                            names: ['战略报备', '单体报备'],
                            values: [3, 4]
                        }
                    },
                    {
                        field: 'project_code',
                        headerName: '家装编码编码',
                        minWidth : 80
                    },
                    {
                        field: 'project_name',
                        headerName: '家装公司名称',
                        minWidth : 80
                    },
                    {
                        field: 'pdt_line',
                        headerName: '产品线',
                        minWidth : 80,
                        hcDictCode : 'epm.pdt_line'
                    },
                    {
                        field: 'trading_company_name',
                        headerName: '交易公司',
                        minWidth : 80
                    }]
                };

                $scope.footerLeftButtons.deleteRow.click = function () {
                    $scope.del_line && $scope.del_line();
                };

                /**
                 * 生效按钮
                 */
                $scope.footerRightButtons.effect = {
                    title: '失效',
                    click : function(){
                        return branchStatChanges(3);
                    },
                    hide : function(){
                        return $scope.$eval('notVisible || data.currItem.branch_valid == 3');
                    }
                }

                /**
                 * 失效按钮
                 */
                $scope.footerRightButtons.loseEffect = {
                    title: '恢复生效',
                    click : function(){
                        return branchStatChanges(2);
                    },
                    hide : function(){
                        return $scope.$eval('notVisible || data.currItem.branch_valid == 2');
                    }
                }

                /**
                 * 生效/失效网点
                 */
                function branchStatChanges(branch_valid){
                    return swalApi.confirm("确定要" + branch_valid == 2 ? "恢复生效" : "失效" + "吗?")
                        .then(function () {
                            return requestApi
                                .post({
                                    classId: 'epm_branch_message',
                                    action: 'branchstatchanges',
                                    data: {
                                        branch_message_id: $scope.data.currItem.branch_message_id,
                                        branch_valid: branch_valid
                                    }
                                })
                                .then($scope.setBizData)
                                .then(function(){
                                    return swalApi.info(branch_valid == 2 ? "恢复生效" : "失效" + '成功');
                                });
                        });
                }


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
                    $scope.gridOptions.hcApi.setRowData(bizData.epm_branch_projects);
                };

                /**
                 * 档案只读
                 * @override
                 */
                $scope.isFormReadonly = function () {
                    return true;
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