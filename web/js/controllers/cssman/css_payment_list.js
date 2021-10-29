/**
 *  配件到款登记
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';
        /**
         * 控制器
         */
        var EmployeeApplyHeaderList = [
            '$scope',
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'stat',
                        hcDictCode:"stat",
                        headerName: '单据状态'
                    }, {
                        field: 'payment_no',
                        headerName: '单据号'
                    }, {
                        field: 'org_code',
                        headerName: '机构编码'
                    }, {
                        field: 'org_name',
                        headerName: '机构名称'
                    }, {
                        field: 'fix_org_code',
                        headerName: '网点编码'
                    }, {
                        field: 'fix_org_name',
                        headerName: '网点名称'
                    },{
                        field: 'amount',
                        type:"金额",
                        headerName: '到款金额'
                    },{
                        field: 'source_type',
                        hcDictCode:"source_type",
                        headerName: '来源类型'
                    },{
                        field: 'source_no',
                        headerName: '来源单号'
                    },{
                        field: 'note',
                        headerName: '备注'
                    } ]
                };
                //继承列表页基础控制器
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });
            }
        ]
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: EmployeeApplyHeaderList
        });
    });

