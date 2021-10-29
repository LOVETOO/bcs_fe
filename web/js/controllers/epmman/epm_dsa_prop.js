/**
 * 经销商服务协议-属性页
 *  2019-6-20
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi'],
    function (module, controllerApi, base_obj_prop, requestApi) {
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

                //继承控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /*----------------------------------定义网格-------------------------------------------*/
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'signed_date',
                        headerName: '签署时间',
                        width: 150,
                        editable: true,
                        hcRequired: true,
                        type: '日期'
                    }, {
                        field: 'settle_amt',
                        headerName: '结算费用金额',
                        width: 150,
                        editable: true,
                        hcRequired: true,
                        type: '金额'
                    }, {
                        field: 'remark',
                        headerName: '备注',
                        width: 400,
                        editable: true
                    }]
                };


                //指定网格对象,否则左下按钮出不来
                $scope.data.currGridModel = 'data.currItem.epm_side_dsaofepm_dsas';
                $scope.data.currGridOptions = $scope.gridOptions;
                /*----------------------------------通用查询-------------------------------------------*/

                //工程合同 查询
                $scope.commonSearchSettingOfEpmProjectContract = {
                    postData: {
                        //search_flag: 120
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.epm_contract_id = result.contract_id;
                        $scope.data.currItem.project_id = result.project_id;
                        $scope.data.currItem.project_contract_code = result.contract_code;
                        $scope.data.currItem.project_contract_name = result.contract_name;
                        /**
                         * 异步请求
                         */
                        return requestApi.post({
                            classId: 'epm_project',
                            action: 'select',
                            data: {
                                project_id: $scope.data.currItem.project_id
                            }
                        }).then(function (response) {
                            $scope.data.currItem.address = response.address;
                            $scope.data.currItem.project_name = response.project_name;
                        });
                    }
                };

                // 乙方名称 查询
                $scope.commonSearchSettingOfCustomerOrg = {
                    afterOk: function (result) {
                        $scope.data.currItem.party_b = result.customer_name;
                    }
                };

                /**
                 * 新增时初始化数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    $scope.data.currItem.epm_side_dsaofepm_dsas = [{dsa_id: $scope.data.currItem.dsa_id}];
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_side_dsaofepm_dsas);
                };
                /**
                 * 查看时设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.epm_side_dsaofepm_dsas);
                };

                /*----------------------------------按钮及标签 -------------------------------------------*/

                /*删除明细按钮*/
                $scope.footerLeftButtons.deleteRow.click = function () {
                    $scope.del_line && $scope.del_line();
                };

                /*隐藏底部左边按钮*/
                $scope.footerLeftButtons.topRow.hide = true;
                $scope.footerLeftButtons.upRow.hide = true;
                $scope.footerLeftButtons.downRow.hide = true;
                $scope.footerLeftButtons.bottomRow.hide = true;

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