/**
 * 经销商工程合同
 * 2019/6/21
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_list', 'requestApi', 'swalApi', 'openBizObj', 'fileApi'],
    function (module, controllerApi, base_obj_list, requestApi, swalApi, openBizObj, fileApi) {
        'use strict';
        /**
         * 控制器
         */
        var EpmProjectContractList = [
            '$scope',
            function ($scope) {

                //定义可见参数
                $scope.visibleParameter = 1;

                //定义失效id
                $scope.ecn_id = 0;

                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    } /*, {
                        field: 'stat',
                        headerName: '审核状态',
                        hcDictCode:'stat'
                    } */, {
                        field: 'audit_stat',
                        headerName: '审核状态',
                        cellStyle: {
                            'text-align': 'center'
                        }
                    }, {
                        field: 'oa_audit_stat',
                        headerName: 'OA审核状态',
                        hcDictCode:'epm.oa_audit_stat',
                        valueFormatter: function (params) {//格式化
                            var value = $scope.gridOptions.columnTypes['词汇'].valueFormatter(params);
                            if(params.data.is_custom == 2){
                                value = "无需审核";
                            }
                            return value;
                        }
                    }, {
                        field: 'valid',
                        headerName: '有效状态',
                        hcDictCode : 'valid',
                        cellStyle:function (args) {
                            return {
                                'color':args.data.valid == 2 ? "green" : args.data.valid == 1 ? "gray" : "red"
                            }
                        }
                    },{
                        field: 'contract_code',
                        headerName: '合同编码'
                    }, {
                        field: 'contract_name',
                        headerName: '合同名称'
                    },  {
                        field: 'signed_date',
                        headerName: '签订时间',
                        type:'日期'
                    }, {
                        field: 'signed_location',
                        headerName: '签订地点'
                    }, {
                        field: 'project_code',
                        headerName: '报备项目编码'
                    }, {
                        field: 'customer_code',
                        headerName: '经销商编码'
                    }, {
                        field: 'customer_name',
                        headerName: '经销商名称'
                    }, {
                        field: 'short_name',
                        headerName: '经销商简称'
                    }, {
                        field: 'is_local',
                        headerName: '本地/异地',
                        hcDictCode: 'epm.is_local'
                    }, {
                        field: 'project_name',
                        headerName: '报备项目名称'
                    }, {
                        field: 'address',
                        headerName: '工程地址'
                    }, {
                        field: 'report_time',
                        headerName: '项目申报日期',
                        type : '时间'
                    }, {
                        field: 'contract_amt',
                        headerName: '合同总额(元)',
                        type:'金额'
                    }, {
                        field: 'predict_sales_amount',
                        headerName: '报备预估金额(元)',
                        type:'金额'
                    }, {
                        field: 'currency_name',
                        headerName: '币别'
                    }, {
                        field: 'contract_unit',
                        headerName: '工程签约单位'
                    }, {
                        field: 'trading_company_name',
                        headerName: '交易公司'
                    }, {
                        field: 'billing_unit_name',
                        headerName: '开票单位'
                    }, {
                        field: 'contract_effect_date',
                        headerName: '合作开始时间',
                        type:'日期'
                    }, {
                        field: 'contract_expire_date',
                        headerName: '合作结束时间',
                        type:'日期'
                    }, {
                        field: 'first_delivery_date',
                        headerName: '首次发货日期',
                        type:'日期'
                    }, {
                        field: 'completed_date',
                        headerName: '结案日期',
                        type:'日期'
                    }, {
                        field: 'completed_type',
                        headerName: '结案状态',
                        hcDictCode : 'epm.contract_completed_type'
                    }, {
                        field: 'is_custom',
                        headerName: '纯定制',
                        type : '是否'
                    }, {
                        field: 'strategic_related',
                        headerName: '战略工程相关',
                        type : '是否'
                    }, {
                        field: 'remark',
                        headerName: '备注'
                    }, {
                        field: 'main_contract_code',
                        headerName: '主合同编码'
                    }, {
                        field: 'main_contract_name',
                        headerName: '主合同名称'
                    }, {
                        field: 'creator_name',
                        headerName: '创建人'
                    }, {
                        field: 'createtime',
                        headerName: '创建时间',
                        type:'时间'
                    }, {
                        field: 'updator_name',
                        headerName: '修改人'
                    }, {
                        field: 'updatetime',
                        headerName: '修改时间',
                        type:'时间'
                    }],
                    hcPostData: {
                        contract_type : 2
                    },
                    hcAfterRequest:function(response){//请求完表格事件后触发
                        $scope.data.epm_project_contracts = [];
                        $scope.data.epm_project_contracts = response.epm_project_contracts;
                        //$scope.gridOptions.columnApi.setColumnsVisible(['oa_audit_stat'], $scope.filterSetting.filters.stat.options[0].active != true);
                    }
                };
                //继承列表页基础控制器
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                $(function () {
                    var intervalId = setInterval(function () {		
                        if ($scope.searchPanelVisible === false) {//符合条件
                            clearInterval(intervalId);//销毁
                            $scope.searchPanelVisible = true;
                        }
                    }, 300);
                });

                delete $scope.filterSetting.filters.stat;
                /* $scope.filterSetting.filters.audit_stat = {
                    options: [
                        { name: '新建', value: '新建' },
                        { name: '已提交', value: '已提交' },
                        { name: '审核通过', value: '审核通过' },
                        { name: '审核拒绝', value: '审核拒绝' },
                        { name: '已送签OA', value: '已送签OA' }
                    ]
                }; */

                /**
                 * 定义按钮
                 */
                $scope.toolButtons.loseEfficacyButtom = {
                    title: '失效',
                    icon: 'glyphicon glyphicon-ban-circle',
                    click: function () {
                        $scope.loseEfficacy && $scope.loseEfficacy();
                    },
                    hide : function () {
                        return $scope.$eval("visibleParameter == 1 || currItem.valid != 2");
                    }
                };

                /**
                 * 定义按钮增补
                 */
                $scope.toolButtons.append = {
                    title: '合同增补',
                    groupId: 'base',
                    icon: 'iconfont hc-add',
                    click: function () {
                        $scope.supplementContract && $scope.supplementContract();
                    },
                    hide : function () {
                        return !$scope.$eval('currItem.main_contract_id <= 0 && currItem.stat == 5 && currItem.valid == 2');
                    }
                };

                /**
                 * 失效方法
                 */
                $scope.loseEfficacy = function () {
                    var node = $scope.gridOptions.hcApi.getFocusedNode();

                    if (!node){
                        swalApi.info('请选中要失效的行');
                        return;
                    }
                    var id =  node.data[$scope.data.idField];

                    return swalApi.confirm("确定要发起失效吗?").then(function () {
                        return requestApi.post("epm_project_contract", "efficacy", {
                            "contract_id": id
                        }).then(function (data) {
                            $scope.ecn_id = data.flag;
                        }).then(function () {
                            var modalResultPromise = openBizObj({
                                stateName: 'epmman.epm_project_contract_ecn_prop',
                                params: {
                                    id: $scope.ecn_id,
                                    readonly: false
                                }
                            }).result;
                            modalResultPromise.finally($scope.gridOptions.hcApi.search);
                        });
                    });
                };

                /**
                 * 增补方法
                 */
                $scope.supplementContract = function () {
                    return requestApi
                        .post({
                            classId: "epm_project_contract",
                            action: 'modifysource',
                            data: {
                                main_contract_id : -1,
                                contract_id : $scope.currItem.contract_id
                            }
                        })
                        .then(function () {
                            $scope.hcSuper.openProp();
                        });
                };

                /**
                 * 查询角色权限是否可以失效
                 */
                var jurisdiction = function jurisdictionShow() {
                    return requestApi
                        .post({
                            classId: "epm_project_contract",
                            action: 'search',
                            data: {
                                flag : 2
                            }
                        })
                        .then(function (data) {
                            if(data.flag == 99){
                                $scope.visibleParameter = 2;
                            }else{
                                $scope.visibleParameter = 1;
                            }
                        });
				}();

                //按钮显示
                $scope.toolButtons.downloadImportFormat.hide = false;
                $scope.toolButtons.import.hide = false;

                $scope.toolButtons.downloadImportFormat.click = function () {
                    fileApi.downloadFile(7314);
                };

            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: EpmProjectContractList
        });
    });

