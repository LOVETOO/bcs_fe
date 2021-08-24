/**
 * 客户单据详情
 * @since 2019-12-06
 * 巫奕海
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', "swalApi"],
    function (module, controllerApi, base_obj_prop, swalApi) {


        var controller = [
            '$scope',
            function ($scope) {
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /**搜索部门 */
                $scope.searchScporg = {
                    afterOk: function (result) {
                        $scope.data.currItem.orgid = result.orgid;
                        $scope.data.currItem.orgname = result.orgname;
                        $scope.data.currItem.orgname = result.orgname;
                    }
                }

                /**搜索批次号 */
                // $scope.searchStock={
                //     action:"dosearchstock",
                //     afterOk: function (result) {
                //         $scope.data.currItem.bclotsid = result.bclotsid;
                //         $scope.data.currItem.code = result.code;
                //         $scope.data.currItem.pagesize = result.pagesize;
                //         $scope.data.currItem.pagenos = result.pagenos;
                //         $scope.data.currItem.invqty = result.quantity;
                //         $scope.data.currItem.qty = 0 
                //     }
                // } 

                /**搜索领用人 */
                $scope.searchScpuser = {
                    afterOk: function (result) {
                        $scope.data.currItem.sysuserid = result.sysuserid;
                        $scope.data.currItem.userid = result.userid;
                        $scope.data.currItem.username = result.username;
                    }
                }


                // $scope.checkQty= function(){
                //     $scope.data.currItem.pageno=""
                //     if($scope.data.currItem.code==undefined||$scope.data.currItem.code==""){
                //         $scope.data.currItem.qty=0
                //         swalApi.error("请先选择批次号")
                //         return;
                //     }
                //     if((parseInt($scope.data.currItem.qty))<0){
                //         $scope.data.currItem.qty=0
                //         swalApi.error("领用数量不能小于0")
                //         return;
                //     }
                //     var check= /^\d+$/ ;
                //     if(!Number.isInteger(parseInt($scope.data.currItem.qty))||!check.test($scope.data.currItem.qty)){
                //         $scope.data.currItem.qty=0
                //         swalApi.error("请输入整数") 
                //         return;
                //     }
                //     if($scope.data.currItem.invqty/1<$scope.data.currItem.qty/1){
                //         $scope.data.currItem.qty=0
                //         swalApi.error("领用数量不能大于库存数量")
                //         return;
                //     }

                //     const _pagenos=$scope.data.currItem.pagenos
                //     const index1=Math.ceil($scope.data.currItem.invqty/$scope.data.currItem.pagesize)
                //     const last=_pagenos.slice(-index1)


                //     const index2=Math.ceil($scope.data.currItem.qty/$scope.data.currItem.pagesize)
                //     const last2= last.slice(0,index2)
                //     last2.forEach(function(e) {
                //         if($scope.data.currItem.pageno==""){
                //             $scope.data.currItem.pageno=e.pageno
                //         }else{
                //             $scope.data.currItem.pageno=$scope.data.currItem.pageno+","+e.pageno
                //         }
                //     });
                // } 

                //保存数据
                $scope.saveBizData = function (bizData) {
                    $scope.hcSuper.saveBizData(bizData);
                };

                //打开新增页面时执行的方法,可以用于初始化值
                $scope.newBizData = function (bizData) {
                    $scope.data.currItem.pagenos = []
                    $scope.hcSuper.newBizData(bizData);
                    $scope.data.currItem.qty = 0;
                };
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                }
                //校验领用数量
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    if ((parseInt($scope.data.currItem.qty)) <= 0) {
                        $scope.data.currItem.qty = 0
                        invalidBox.push("领用数量必须大于0");
                        return invalidBox;
                    }
                    var check = /^\d+$/;
                    if (!Number.isInteger(parseInt($scope.data.currItem.qty)) || !check.test($scope.data.currItem.qty)) {
                        $scope.data.currItem.qty = 0
                        invalidBox.push("请输入整数");
                        return invalidBox;
                    }

                };
            }];


        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    });