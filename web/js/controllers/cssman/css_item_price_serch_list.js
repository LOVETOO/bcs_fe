/**
 *  author: Li Meng
 *  time: 2019/7/25
 *  module:配件到款登记
 **/
define(
    ['module', 'controllerApi', 'requestApi', 'base_diy_page', 'swalApi', 'directive/hcImportConsole'],
    function (module, controllerApi, requestApi,base_diy_page, swalApi) {
        'use strict';
        var controller = [
            '$scope', '$modal',
            function ($scope,$modal) {
                $scope.data = {};
                $scope.data.currItem = {};
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });
                /*----------------------------------表格定义-------------------------------------------*/
                //
                $scope.gridOptions= {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'fix_org_code',
                        headerName: '网点编码'
                    }, {
                        field: 'fix_org_name',
                        headerName: '网点名称'
                    },{
                        field: 'org_name',
                        headerName: '所属机构'
                    } , {
                        headerName: '总额',
                        id: "zhd",
                        children: [
                            {
                                headerName: "额度总额",
                                field: "surplus_amount",
                                type:"金额"
                            },{
                                headerName: "授信总额",
                                field: "credit_amt",
                                type:"金额"
                            },{
                                headerName: "合计",
                                field: "sum_amt",
                                type:"金额"
                            },
                        ]
                    }, {
                        field: 'keeped_amount',
                        headerName: '已保留',
                        type:"金额"

                    },{
                        field: 'canused_amt',
                        headerName: '已使用额度',
                        type:"金额"

                    },{
                        field: 'fix_org_type',
                        hcDictCode:'service_store_type',
                        headerName: '网点类型'
                    },{
                        field: 'fix_org_class',
                        hcDictCode:'service_store_level',
                        headerName: '网点级别'

                    }],
                    hcClassId: "css_fix_org",
                    hcRequestAction: "searchsurplus",
                    hcBeforeRequest: function (searchObj) {
                        angular.extend(searchObj, $scope.data.currItem);
                    }
                };
                /*----------------------------------通用查询-------------------------------------------*/
                $scope.commonSearchOfScporg = {
                    afterOk: function (result) {
                        $scope.data.currItem.org_name = result.orgname;
                        $scope.data.currItem.fix_org_name = undefined;
                    }
                };
                $scope.commonSearchOfFixOrg = {
                    beforeOpen: function () {
                        if($scope.data.currItem.org_name)
                            $scope.commonSearchOfFixOrg.postData =
                                {org_code: $scope.data.currItem.org_code}
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.fix_org_name = result.fix_org_name;
                        $scope.data.currItem.org_name = result.org_name;
                        $scope.commonSearchOfFixOrg.postData.org_name=undefined;
                    }
                };
                /*---------------------按钮定义--------------------------*/

                //添加按钮
                $scope.toolButtons = {
                    search: {
                        title: '查询',
                        icon: 'fa fa-search',
                        click: function () {
                            $scope.search && $scope.search();
                        }
                    }
                };
                // 查询
                $scope.search = function () {
                    return $scope.gridOptions.hcApi.search();
                };
                $scope.refresh = function () {
                    $scope.search();
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