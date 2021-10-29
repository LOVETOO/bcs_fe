/**
 * 工程预算编制-属性页
 *  2019-6-21
 */
define(
    ['module', 'controllerApi', 'base_obj_prop'],
    function (module, controllerApi, base_obj_prop) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                /*----------------------------------定义数据-------------------------------------------*/
                $scope.data = {
                    currItem: {}
                };

                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'signed_date',
                        headerName: '预算类别',
                        width: 200,
                        editable: true,
                        hcRequired: true
                    }, {
                        field: 'settle_amt',
                        headerName: '费用项目/类别编码',
                        editable: true,
                        hcRequired: true
                    } , {
                        field: 'remark',
                        headerName: '费用项目/类别名称',
                        editable: true
                    } , {
                        field: 'remark',
                        headerName: '预算金额',
                        editable: true
                    } , {
                        field: 'remark',
                        headerName: '备注',
                        editable: true
                    }]
                };

                //继承控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //指定网格对象,否则左下按钮出不来
                $scope.data.currGridModel = 'data.currItem.epm_side_dsaofepm_dsas';
                $scope.data.currGridOptions = $scope.gridOptions;
                /*----------------------------------通用查询-------------------------------------------*/

                //工程项目名称 查询
                $scope.commonSearchSettingOfEpmProjectContract = {
                    postData: {
                        //search_flag: 120
                    },
                    sqlWhere: "project_status = '已立项'",
                    afterOk: function (result) {
                        $scope.data.currItem.epm_contract_id = result.epm_contract_id;
                        $scope.data.currItem.contract_code = result.contract_code;
                        $scope.data.currItem.contract_name = result.contract_name;
                        $scope.data.currItem.project_address = result.project_address;
                        $scope.data.currItem.project_name = result.project_name;
                    }
                };

                // 所属部门 查询
                $scope.commonSearchSettingOfEpmProject = {
                    postData: {
                        //search_flag: 120
                    },
                    sqlWhere: "project_status = '已立项'",
                    afterOk: function (result) {
                        $scope.data.currItem.project_id = result.project_id;
                    }
                };

                // 项目经理 查询
                $scope.commonSearchSettingOfEpmProject = {
                    postData: {
                        //search_flag: 120
                    },
                    sqlWhere: "project_status = '已立项'",
                    afterOk: function (result) {
                        $scope.data.currItem.project_id = result.project_id;
                    }
                };

                /**
                 * 新增时初始化数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    $scope.data.currItem.epm_side_dsaofepm_dsas = [{dsa_id:$scope.data.currItem.dsa_id}];
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_side_dsaofepm_dsas);
                };
                /**
                 * 查看时设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.epm_side_dsaofepm_dsas);
                };
                /*----------------------------------按钮及标签 定义-------------------------------------------*/

                /*删除明细按钮*/
                $scope.footerLeftButtons.deleteRow.click = function () {
                    $scope.del_line && $scope.del_line();
                };

                /*隐藏底部左边按钮*/
                $scope.footerLeftButtons.topRow.hide = true;
                $scope.footerLeftButtons.upRow.hide = true;
                $scope.footerLeftButtons.downRow.hide = true;
                $scope.footerLeftButtons.bottomRow.hide = true;

                /*显示底部右侧按钮*/
                $scope.footerRightButtons.print.hide = false;
                $scope.footerRightButtons.saveThenSubmit.hide = false;

                /**
                 * 删除行明细
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.epm_side_dsaofepm_dsas.splice(idx, 1);
                        if ($scope.data.currItem.epm_side_dsaofepm_dsas.length == 0) {
                            $scope.data.currItem.epm_side_dsaofepm_dsas.push({});
                        }
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_side_dsaofepm_dsas);
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