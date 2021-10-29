/**
 * 创建帐套
 * 2018-12-11 add by qch
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'promiseApi', 'requestApi', 'jquery', 'swalApi', 'directive/hcObjProp'],
    function (module, controllerApi, base_diy_page, promiseApi, requestApi, $, swalApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$q','$modal',
            //控制器函数
            function ($scope, $q, $modal) {

                /*--------------------数据定义------------------------*/
                $scope.data = {};
                $scope.data.currItem = {};

                /**
                 * 继承主控制器
                 */
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                /**
                 * 组织类型
                 */
                $scope.data.ent_type_options = [
                    { name: '法人帐套', value: '1' },
                    { name: '合并账套', value: '3' }
                ];

                /**
                 * 业务类型
                 */
                $scope.data.account_type_options = [
                    { name: '价税合并', value: '1' },
                    { name: '价税分离', value: '2' }
                ];

                /**
                 * 收入确认方式
                 */
                $scope.data.ar_type_options = [
                    { name: '出库确认', value: '1' },
                    { name: '开票确认', value: '2' }
                ];

                /**
                 * 成本核算方式
                 */
                $scope.data.cost_calu_options = [
                    { name: '总仓核算', value: '1' },
                    { name: '分组核算', value: '2' }
                ];


                /*-------------------通用查询------------------------*/
                /**
                 * 省份查询 从scparea选择，sqlwhere=scparea.superid = 1
                 */
                $scope.chooseArea = function (args) {
                    /*$scope.FrmInfo = {
                        title: "省份查询",
                        thead: [{
                            name: "编码",
                            code: "areacode"
                        }, {
                            name: "省份",
                            code: "areaname"
                        }],
                        classid: "scparea",
                        url: "jsp/budgetman.jsp",
                        direct: "center",
                        sqlBlock: "scparea.superid = 1",
                        backdatas: "scpareas",
                        ignorecase: true,
                        searchlist: ["areacode", "areaname"],
                        postdata: ""
                    };
                    return BasemanService.open(CommonPopController, $scope).result.then(function (response) {
                        $scope.data.currItem.areacode = response.areacode;
                        $scope.data.currItem.areaname = response.areaname;
                        $scope.data.currItem.areaid = response.areaid;
                    })*/
                    $modal.openCommonSearch({
                        classId: 'scparea',
                        actions: 'search',
                        title: '省份查询',
                        sqlWhere:'scparea.superid = -1',
                        dataRelationName: 'scpareas',
                        gridOptions: {
                            columnDefs: [{
                                headerName: "编码",
                                field: "areacode"
                            }, {
                                headerName: "省份",
                                field: "areaname"
                            }]
                        }
                    }).result.then(function (response) {
                        $scope.data.currItem.areacode = response.areacode;
                        $scope.data.currItem.areaname = response.areaname;
                        $scope.data.currItem.areaid = response.areaid;
                    });
                };


                /*-------------------顶部右边按钮------------------------*/
                $scope.toolButtons = {
                    create: {
                        title: '生成组织',
                        icon: 'fa fa-plus',
                        click: function () {
                            $scope.create && $scope.create();
                        }
                    },
                    empty: {
                        title: '清空',
                        icon: 'fa fa-eraser',
                        click: function () {
                            $scope.empty && $scope.empty();
                        }
                    }
                };


                /*---------------------事件------------------------*/
                /**
                 * 模块启动月份精确到月份
                 */
                /*$scope.$watch("data.currItem.statmonth", function (newVal, oldVal) {
                    if (newVal && newVal.split('-').length == 3) {
                        $scope.data.currItem.statmonth = newVal.split('-')[0] + "-" + newVal.split('-')[1];
                    }
                });*/

                /**
                 * 生产组织
                 */
                $scope.create = function () {
                    if ($scope.data.currItem.statmonth && $scope.data.currItem.statmonth.toString().split('-').length == 3) {
                        $scope.data.currItem.statmonth = $scope.data.currItem.statmonth.toString().split('-')[0]
                            + "-"
                            + $scope.data.currItem.statmonth.toString().split('-')[1];
                    }
                    requestApi.post("basecreateent", "insertent", $scope.data.currItem).then(function (data) {
                        return swalApi.success('保存成功!');
                    });
                };

                /**
                 * 清空
                 */
                $scope.empty = function () {
                    $scope.data.currItem = {};
                };
            }
        ]
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);