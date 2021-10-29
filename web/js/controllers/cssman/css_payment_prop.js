/**
 *  配件到款登记
 *
 */
define(
    ['module', 'controllerApi', 'requestApi', 'base_obj_prop', 'openBizObj', 'swalApi','numberApi', 'fileApi','directive/hcImg'],
    function (module, controllerApi, requestApi, base_obj_prop, openBizObj, swalApi,numberApi,fileApi) {
        'use strict';
        var controller = [
            '$scope', '$modal',
            function ($scope,$modal) {
                /*----------------------------------能否编辑-------------------------------------------*/
                function editable() {
                    return $scope.data.currItem.stat == 1;
                }

                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /*----------------------------------表格定义-------------------------------------------*/
                //可替换配件
                $scope.gridOptions_css_item_alt = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'css_item_alt_code',
                        headerName: '编码',
                        onCellDoubleClicked:function(args){
                            $scope.search_item(args);
                        },
                        editable: true,
                        width:350

                    }, {
                        field: 'css_item_alt_name',
                        headerName: '名称',
                        onCellDoubleClicked:function(args){
                            $scope.search_item(args);
                        },
                        editable: true,
                        width:350
                    }
                    ]
                };
                /*----------------------------------通用查询-------------------------------------------*/
                $scope.commonSearchOfScporg = {
                    sqlWhere: "",
                    afterOk: function (result) {
                        $scope.data.currItem.org_code = result.code;
                        $scope.data.currItem.org_id = result.orgid;
                        $scope.data.currItem.org_name = result.orgname;
                        $scope.data.currItem.fix_org_id = undefined;
                        $scope.data.currItem.fix_org_code = undefined;
                        $scope.data.currItem.fix_org_name = undefined;
                    }
                };
                $scope.commonSearchOfFixOrg = {
                    beforeOpen: function () {
                        if($scope.data.currItem.org_code)
                        $scope.commonSearchOfFixOrg.postData =
                            {org_code: $scope.data.currItem.org_code}
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.fix_org_id = result.fix_org_id;
                        $scope.data.currItem.fix_org_code = result.fix_org_code;
                        $scope.data.currItem.fix_org_name = result.fix_org_name;
                        $scope.data.currItem.org_code = result.org_code;
                        $scope.data.currItem.org_id = result.org_id;
                        $scope.data.currItem.org_name = result.org_name;
                        $scope.commonSearchOfFixOrg.postData.org_code=undefined;
                    }
                };
                /*----------------------------------按钮方法数据 定义-------------------------------------------*/
                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                };
                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                };
                /*----------------------------------按钮及标签 定义-------------------------------------------*/


                /*----------------------------------顶部按钮-------------------------------------------*/

                $scope.tabs.base = {
                    title: '基本信息',
                    active: true
                };
                $scope.tabs.extra = {
                    title: '其他'
                };

            }
        ]
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });

    });