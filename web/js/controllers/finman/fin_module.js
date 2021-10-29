/**业务与总账对账 fin_module
 * Created by DELL on 2019/1/7.
 */

define(
    ['module', 'controllerApi', 'base_diy_page', 'openBizObj'],
    function (module, controllerApi, base_diy_page, openBizObj) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                //数据定义
                $scope.data = {};
                $scope.data.currItem = {};

                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: '合计'}],
                    columnDefs: [{
                        children:[{
                            id: 'seq',
                            type: '序号'
                        }]
                    }, {
                        headerName: '业务模块',
                        field: 'uom_name',
                        children:[{
                            id: 'unknown',
                            headerName: '借方发生数',
                            field: 'uom_name'
                        },{
                            id: 'unknown',
                            headerName: '贷方发生数',
                            field: 'uom_name'
                        },{
                            id: 'unknown',
                            headerName: '期末数',
                            field: 'uom_name'
                        }]
                    },  {
                        headerName: '财务总账',
                        field: 'uom_name',
                        children:[{
                            id: 'unknown',
                            headerName: '期初数',
                            field: 'uom_name'
                        },{
                            id: 'unknown',
                            headerName: '借方发生数',
                            field: 'uom_name'
                        },{
                            id: 'unknown',
                            headerName: '贷方发生数',
                            field: 'uom_name'
                        },{
                            id: 'unknown',
                            headerName: '期末数',
                            field: 'uom_name'
                        }]
                    },{
                        headerName: '业务-总账差异',
                        field: 'uom_name',
                        children:[{
                            id: 'unknown',
                            headerName: '期初数',
                            field: 'uom_name'
                        },{
                            id: 'unknown',
                            headerName: '借方发生数',
                            field: 'uom_name'
                        },{
                            id: 'unknown',
                            headerName: '贷方发生数',
                            field: 'uom_name'
                        },{
                            id: 'unknown',
                            headerName: '期末数',
                            field: 'uom_name'
                        }]
                    }
                    ]//columnDefs 列定义结束
                };

                //$scope.gridOptions.hcClassId = 'inv_current_inv';
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                function getCurrItem() {
                    return $scope.data.currItem;
                }

                /**
                 * 根据记账日期生成记账月份
                 */
                $scope.unknownmonthChanged = function () {
                    console.log('unknownmonthChanged()'+getCurrItem().unknownmonth);
                    getCurrItem().unknownmonth = new Date(getCurrItem().unknownmonth).Format('yyyy-MM');
                    console.log('after unknownmonthChanged()'+getCurrItem().unknownmonth);
                };

                //添加按钮
                $scope.toolButtons = {
                    search: {
                        title: '查询',
                        icon: 'fa fa-search',
                        click: function () {
                            $scope.search && $scope.search();
                        }
                    },

                    export: {
                        title: '导出',
                        icon: 'glyphicon glyphicon-log-out',
                        click: function () {
                            $scope.export && $scope.export();
                        }
                    }

                };

                // 查询
                /*  $scope.search = function () {
                 $('#tab11').tab('show');
                 $scope.data.lines = [];
                 return $scope.gridOptions.hcApi.search();
                 };*/

                $scope.refresh = function () {
                    $scope.search();
                };

                $scope.export = function () {
                    $scope.gridOptions.hcApi.exportToExcel();
                };

                //打开页面
               /* $scope.test = function() {
                    openBizObj({
                        stateName: 'finman.fin_fee_record_list',
                        params: {
                            id: 0
                        }
                    });
                }*/
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

