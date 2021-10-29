/**
 * 仓库资料-属性页
 * 2018-10-13
 */
define(
    ['module', 'controllerApi', 'base_obj_prop'],
    function (module, controllerApi, base_obj_prop) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$stateParams',
            //控制器函数
            function ($scope, $stateParams) {

                /*-------------------数据定义开始------------------------*/
                $scope.data = {};

                $scope.data.currItem = {
                    item_class_id: $stateParams.id,
                    created_by: strUserId,
                    creation_date: new Date().Format('yyyy-MM-dd hh:mm:ss'),
                    last_updated_by: strUserId,
                    last_update_date: new Date().Format('yyyy-MM-dd hh:mm:ss'),

                    item_usable: 2
                };

                /*-------------------数据定义结束------------------------*/
                /**
                 * 查部门
                 */
                $scope.orgclick = {
                    afterOk: function (result) {
                        $scope.data.currItem.code = result.dept_code;
                        $scope.data.currItem.orgname = result.dept_name;
                        $scope.data.currItem.orgid = result.dept_id;
                    }
                };

                /**   
                 * 查客户
                 */
                $scope.customerclick = {
                    afterOk: function (result) {
                        $scope.data.currItem.customer_code = result.customer_code;
                        $scope.data.currItem.customer_name = result.customer_name;
                        $scope.data.currItem.customer_id = result.customer_id;
                    }
                };
                /**
                 * 网点
                 */
                $scope.fixclick={
                    sqlWhere:"usable=2",
                    afterOk: function (result) {
                        $scope.data.currItem.fix_org_id = result.fix_org_id;
                        $scope.data.currItem.fix_org_code = result.fix_org_code;
                        $scope.data.currItem.fix_org_name = result.fix_org_name;
                    }
                };

                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //隐藏标签页
                $scope.tabs.wf.hide = true;
                $scope.tabs.attach.hide = true;

                //修改标签页标题
                $scope.tabs.base.title = '基本信息';
                //其他
                $scope.tabs.other = {
                    title: "其他"
                }

                $scope.newBizData = function (bizData) {
                    bizData.asset_property = 1;//"资产所有权"默认位"自有资产"
                    bizData.stat = 1; //单据状态：制单
                    bizData.wfid = 0; //流程ID
                    bizData.wfflag = 0; //流程标识
                    bizData.creator = strUserId; //创建人
                    bizData.usable = 2; //创建人
                    bizData.is_service = 5;
                    bizData.warehouse_pid = $stateParams.warehouse_pid
                };

            }
        ];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);