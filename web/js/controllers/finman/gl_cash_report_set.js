/**
 * 现金流量表 gl_cash_report_set
 * Created by zhl on 2019/1/7.
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi', 'numberApi'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi, numberApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: '合计'}],
                    columnDefs: [/*{
                        id: 'seq',
                        type: '序号'
                    },*/ {
                        id:'seq',
                        field:'line_no',
                        headerName:'序号'
                    },{
                        id: 'obj_name',
                        headerName: '项目',
                        suppressSizeToFit: true, //禁止适应宽度
                        minWidth: 400,
                        width: 600,
                        maxWidth: 400,
                        field: 'obj_name'
                    }, {
                        id: 'totalamount',
                        headerName: '金额',
                        field: 'totalamount',
                        type: '金额'
                    }
                    ]//columnDefs 列定义结束
                };

                //组织表格（小）
                $scope.gridOptionsOrg = {
                    columnDefs: [{
                        type: '序号',
                        checkboxSelection: true
                    }, {
                        field: 'entname',
                        headerName: '查询组织',
                        width: 300
                    }
                    ],
                    hcClassId: "scpent",
                    hcAfterRequest: function (data) {
                        //console.log(data);

                    },
                    hcNoPaging:true
                };

                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                //查询
                $scope.search = function () {

                    var rowData = $scope.gridOptionsOrg.api.getSelectedRows();

                    var organization_ids = '';

                    for (var i = 0; i < rowData.length; i++) {
                        organization_ids += rowData[i].organization_id + ',';

                    }

                    var lastComma = organization_ids.lastIndexOf(',');//最后一个逗号的索引

                    organization_ids =  organization_ids.substring(0,lastComma);

                    var postData = {
                         tally_flag:$scope.data.currItem.tally_flag,
                         istmodel:$scope.data.currItem.istmodel,
                        accmonstart:$scope.data.currItem.accmonstart,
                        accmonend:$scope.data.currItem.accmonend,
                         organization_ids:organization_ids
                    }

                    return requestApi.post('gl_cash_report_set', 'getcashflowrpt', postData).then(function (data) {
                        console.log(data);
                        $scope.gridOptions.api.stopEditing();
                        $scope.gridOptions.api.setRowData(data.gl_cash_report_sets);
                    })

                }

                //导出
                $scope.export = function () {
                    $scope.gridOptions.hcApi.exportToExcel();
                };

                /*
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
                 /!*  $scope.search = function () {
                 $('#tab11').tab('show');
                 $scope.data.lines = [];
                 return $scope.gridOptions.hcApi.search();
                 };*!/

                 $scope.refresh = function () {
                 $scope.search();
                 };

                 $scope.export = function () {
                 $scope.gridOptions.hcApi.exportToExcel();
                 };*/
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

