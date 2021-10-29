/**
 * 业务员资料属性页
 * 2018-10-11 sale_employee_prop.js
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi'],
    function (module, controllerApi ,base_obj_prop, swalApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope','BasemanService','$stateParams','Magic',
            //控制器函数
            function ($scope, BasemanService, $stateParams,Magic) {

                $scope.data = {};
                $scope.data.currItem = {};

                $scope.gridOptions = {
                    columnDefs : [
                        {
                            type: '序号'
                        },{
                            field: 'sale_area_code',
                            headerName: '负责区域编码',
                            width: 130,
                        },{
                            field: 'sale_area_name',
                            headerName: '负责区域名称',
                            width: 130,
                        },{
                            field: 'remark',
                            headerName: '备注',
                            width: 130,
                        }
                    ]
                };

                //查业务员
                $scope.chooseEmployee = function () {
                    $scope.FrmInfo = {
                        title: "业务员信息",
                        thead: [{
                            name: "业务员编码",
                            code: "employee_code"
                        }, {
                            name: "业务员名称",
                            code: "employee_name"
                        }],
                        classid: "erpemployee",
                        url: "/jsp/authman.jsp",
                        direct: "center",
                        //sqlBlock: "km_type = 1",//科目类型：资产
                        ignorecase: true,
                        searchlist: ["employee_code", "employee_name", "employee_id"]
                    };
                    BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                        $scope.data.currItem.employee_id = result.employee_id;
                        $scope.data.currItem.employee_code = result.employee_code;
                        $scope.data.currItem.employee_name = result.employee_name;
                    })
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

                $scope.tabs.other = {
                    title:"其他"
                }


                /**
                 * 新增时数据、网格默认设置
                 */
                $scope.newBizData = function (bizData) {
                    //$scope.hcSuper.newBizData(bizData);
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);
                    bizData.sale_employee_saleareaofsale_employees = [];
                    bizData.isuseable = 2;
                    $scope.gridOptions.hcApi.setRowData(bizData.sale_employee_saleareaofsale_employees);
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);

                    $scope.gridOptions.hcApi.setRowData(bizData.sale_employee_saleareaofsale_employees);
                };


                //底部左边按钮
                $scope.footerLeftButtons.add_line = {
                    title: '增加行',
                    click: function() {
                        $scope.add_line && $scope.add_line();
                    }
                };
                $scope.footerLeftButtons.del_line = {
                    title: '删除行',
                    click: function() {
                        $scope.del_line && $scope.del_line();
                    }
                };

                /**
                 * 增加行
                 */
                $scope.add_line = function () {
                    $scope.FrmInfo = {
                        title: "销售区域",
                        thead: [{
                            name: "区域编码",
                            code: "sale_area_code"
                        }, {
                            name: "区域名称",
                            code: "sale_area_name"
                        }, {
                            name: "备注",
                            code: "remark"
                        }/*, {
                            name: "区域id",
                            code: "sale_area_id"
                        }*/],
                        classid: "sale_salearea",
                        url: "/jsp/authman.jsp",
                        direct: "center",
                        //sqlBlock: "km_type = 1",//科目类型：资产
                        ignorecase: true,
                        searchlist: ["sale_area_code", "sale_area_name", "sale_area_id","remark"]
                    };
                    BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                        $scope.gridOptions.api.stopEditing();
                        var line = {
                            sale_area_code: result.sale_area_code,
                            sale_area_name: result.sale_area_name,
                            sale_area_id: result.sale_area_id,
                            remark: result.remark,
                        };
                        $scope.data.currItem.sale_employee_saleareaofsale_employees.push(line);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.sale_employee_saleareaofsale_employees);
                    })

                };

                /**
                 * 删除行
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if(idx < 0){
                        swalApi.info('请选中要删除的行');
                    }else{
                        $scope.data.currItem.sale_employee_saleareaofsale_employees.splice(idx,1);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.sale_employee_saleareaofsale_employees);
                    }
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






