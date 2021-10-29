/**
 * 工程-销售区域属性表
 * Created by sgc
 */
define(
    ['module', 'controllerApi', 'base_obj_prop'],
    function (module, controllerApi, base_obj_prop) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {

                $scope.data = {
                    currItem: {}
                };

                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'areacode',
                            headerName: '所辖地区编码',
                            width: 300,
                            editable: true,
                            onCellDoubleClicked: function (args) {
                                $scope.chooseSaleArea(args);
                            }
                        }, {
                            field: 'areaname',
                            headerName: '所辖地区名称',
                            width: 500
                        }
                    ]
                };
                $scope.data.currGridModel = 'data.currItem.sale_salearea_lineofsale_saleareas';
                $scope.data.currGridOptions = $scope.gridOptions;

                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /**
                 * 新增时数据、网格默认设置
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);
                    bizData.isuseable = 2;
                    bizData.use_type = 2;
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    bizData.isuseable = $scope.data.currItem.isuseable;
                    $scope.gridOptions.hcApi.setRowData(bizData.sale_salearea_lineofsale_saleareas);
                };

                //隐藏底部左边按钮，只保留增减行
                $scope.footerLeftButtons.topRow.hide = true;
                $scope.footerLeftButtons.upRow.hide = true;
                $scope.footerLeftButtons.downRow.hide = true;
                $scope.footerLeftButtons.bottomRow.hide = true;

                /**
                 * 查询销售区域
                 */
                $scope.chooseSaleArea = function (args) {
                    $modal.openCommonSearch({
                            classId: 'scparea',
                            postData: {orgid: args.data.org_id},
                            backdatas: "scpareas",
                            title: "行政区域",
                            gridOptions: {
                                columnDefs: [
                                    {
                                        headerName: "区域编码",
                                        field: "areacode"
                                    }, {
                                        headerName: "区域名称",
                                        field: "areaname"
                                    }
                                ]
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            args.data.areacode = result.areacode;
                            args.data.areaname = result.areaname;
                        }).then(function () {
                        args.api.refreshView();
                    });
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






