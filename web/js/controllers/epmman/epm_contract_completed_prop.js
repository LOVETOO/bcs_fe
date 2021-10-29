/**
 * 工程项目结案
 * 2019/6/26
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'swalApi', 'numberApi'],
    function (module, controllerApi, base_obj_prop, requestApi, swalApi, numberApi) {


        var controller = [
            '$scope',

            function ($scope) {

                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /*----------------------------------表格定义-------------------------------------------*/
                /**
                 * 表格定义
                 */
                $scope.gridOptions_project = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'contract_code',
                        headerName: '合同编码'
                    }, {
                        field: 'contract_name',
                        headerName: '合同名称'
                    }, {
                        field: 'signed_date',
                        headerName: '合同签订日期',
                        type: '日期'
                    }, {
                        field: 'contract_effect_date',
                        headerName: '合作开始时间',
                        type: '日期'
                    }, {
                        field: 'contract_expire_date',
                        headerName: '合作结束时间',
                        type: '日期'
                    }, {
                        field: 'contract_amt',
                        headerName: '合同金额',
                        type: '金额'
                    }]
                };
                /*----------------------------------通用查询-------------------------------------------*/

                /**
                 * 查询项目
                 */
                $scope.commonSearchOfEpmProjectContract = {
                    sqlWhere: " valid = 2 and main_contract_id = 0 "
                        + " and completed_date is null and is_frame <> 2 and contract_character = 'AR'",
                    gridOptions:{
                        columnDefs:[
                            {
                                headerName: "工程合同编码",
                                field: "contract_code"
                            },{
                                headerName: "工程合同名称",
                                field: "contract_name"
                            },{
                                headerName: "工程编码",
                                field: "project_code"
                            },{
                                headerName: "工程名称",
                                field: "project_name"
                            },{
                                headerName: "签约类型",
                                field: "contract_type",
                                hcDictCode : 'epm.contract_type'
                            },{
                                headerName: "签约时间",
                                field: "signed_date",
                                type : '日期'
                            }
                        ]
                    },
                    beforeOk : function (result) {
                        return requestApi
                            .post({
                                classId: 'epm_contract_completed',
                                action: 'search',
                                data: {
                                    flag: 1,
                                    contract_completed_id: $scope.data.currItem.contract_completed_id,
                                    contract_id: result.contract_id
                                }
                            })
                            .then(function (data) {
                                if (data.epm_contract_completeds.length > 0) {
                                    swalApi.error('合同【' + data.epm_contract_completeds[0].contract_code
                                        + '|| ' + data.epm_contract_completeds[0].contract_name + '】已存在工程结案单【'
                                        + data.epm_contract_completeds[0].completed_code + '】，请检查。');
                                    return false;
                                }else{
                                    return result;
                                }
                            });
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.contract_id = result.contract_id;
                        $scope.data.currItem.contract_code = result.contract_code;
                        $scope.data.currItem.contract_name = result.contract_name;
                        $scope.data.currItem.project_id = result.project_id;
                        $scope.data.currItem.project_code = result.project_code;
                        $scope.data.currItem.project_name = result.project_name;
                        $scope.data.currItem.contract_amt = result.contract_amt;
                        $scope.data.currItem.signed_date = result.signed_date;
                        $scope.data.currItem.expiry_date = result.expiry_date;
                        $scope.data.currItem.stage_name = result.stage_name;
                        $scope.data.currItem.contract_effect_date = result.contract_effect_date;                          //合作开始时间
                        $scope.data.currItem.contract_expire_date = result.contract_expire_date;                          //合作结束
                        $scope.data.currItem.contract_amt_received = result.contract_amt_received;
                        selectAddProject(result.contract_id);
                    }
                };

                /**
                 * 查询项目的增补项目
                 */
                function selectAddProject(id) {
                    return requestApi
                        .post({
                            classId: 'epm_contract_completed',
                            action: 'select',
                            data: {
                                flag: 9,
                                contract_id: id
                            }
                        })
                        .then(function (data) {
                            if (data.epm_project_contracts.length > 0) {
                                $scope.showLine = 2;
                                $scope.data.currItem.epm_project_contracts = data.epm_project_contracts;
                                $scope.gridOptions_project.hcApi.setRowData($scope.data.currItem.epm_project_contracts);
                                $scope.calSum();
                            } else {
                                $scope.showLine = 1;
                            }
                        });
                }

                /**
                 * 当清空所选合同编码时
                 */
                $scope.changeNull = function () {
                    if ($scope.data.currItem.contract_code == undefined || $scope.data.currItem.contract_code == null || $scope.data.currItem.contract_code == "") {
                        $scope.showLine = 1;
                    }
                };
                /**
                 * 合计行
                 */
                $scope.calSum = function () {
                    $scope.gridOptions_project.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            contract_amt: numberApi.sum($scope.data.currItem.epm_project_contracts, 'contract_amt')

                        }
                    ]);
                };
                /*----------------------------------按钮方法数据 定义-------------------------------------------*/
                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    bizData.epm_project_contracts = [];
                    bizData.completed_type = 2;
                };
                /**
                 * 定义可见列表参数
                 */
                $scope.showLine = 1;
                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    selectAddProject($scope.data.currItem.contract_id);
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