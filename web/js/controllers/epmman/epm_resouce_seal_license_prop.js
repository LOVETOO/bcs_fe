/**
 * 印章信息
 *  2019/5/24
 *  zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi'],
    function (module, controllerApi, base_obj_prop, swalApi) {
        'use strict';
        var controller = [
            '$scope',
            function ($scope) {
                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /*----------------------------------通用查询-------------------------------------------*/

                /**
                 * 证照类别
                 */
                $scope.commonSearchEpmResouceCategory = {
                    postData : {
                        search_flag : 1,
                        resouce_type : 3
                    },
                    title:"印章类别",
                    dataRelationName:'epm_resouce_archivess',
                    gridOptions:{
                        columnDefs:[
                            {
                                headerName: "印章类别编码",
                                field: "resouce_category_code"
                            },{
                                headerName: "印章类别名称",
                                field: "resouce_category_name"
                            }
                        ]
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.resouce_category_id = result.resouce_category_id;
                        $scope.data.currItem.resouce_category_name = result.resouce_category_name;
                    }
                };

                /**
                 * 保管人
                 */
                $scope.commonSearchrefOfScporgScpuser = {
                    sqlWhere:'actived = 2',
                    afterOk: function (result) {
                        $scope.data.currItem.keeper = result.sysuserid;
                        $scope.data.currItem.keeper_name = result.username;
                    }
                };

                /*----------------------------------按钮方法数据 定义-------------------------------------------*/

                /**
                 * 失效日期、生效日期校验
                 */
                $scope.setSubtractDays = function () {
                    var exp_date = new Date($scope.data.currItem.exp_date).getTime();
                    var effective_date = new Date($scope.data.currItem.effective_date).getTime();
                    var subtract_days = exp_date - effective_date;
                    if (parseInt(subtract_days / 1000 / 60 / 60 / 24) < 0) {
                        swalApi.info("失效日期必须大于生效日期");
                        $scope.data.currItem.exp_date = '';
                        $scope.data.currItem.effective_date = '';
                    }
                };

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    bizData.is_usable=2;
                    bizData.stat = '在库';
                };

                /**
                 *  保持前数据处理
                 */
                $scope.saveBizData = function(bizData){
                    $scope.hcSuper.saveBizData(bizData);
                    bizData.resouce_type = 3;
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
    }
);