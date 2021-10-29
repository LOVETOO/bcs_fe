/**
 * 法人客户
 * 2019/7/5
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', '$modal', 'requestApi', 'directive/hcImg'],
    function (module, controllerApi, base_obj_prop, swalApi, $modal, requestApi) {


        var controller = [
            '$scope',

            function ($scope) {
                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /*----------------------------------数据定义-------------------------------------------*/
                //财务信息可见系统参数
                $scope.showTaxCodeMode = 0;

                //表格切换定义
                $scope.epm_tab = {};
                $scope.epm_tab.out = {
                    title: '打款账户',
                    active: true
                };
                $scope.epm_tab.in = {
                    title: '收款账户'
                };
                //是否为导入的数据,默认不是
                $scope.initData = false;
                /*----------------------------------表格定义-------------------------------------------*/
                /**
                 * 表格定义
                 */
                $scope.gridOptions = {
                    defaultColDef:{
                        editable:function () {
                            return (!$scope.initData);
                        }
                    },
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'bank',
                        headerName: '开户银行',
                        hcRequired : true
                    }, {
                        field: 'account',
                        headerName: '银行账号',
                        hcRequired : true
                    }]
                };
                /**
                 * 表格定义
                 */
                $scope.gridOptions_in = {
                    defaultColDef:{
                        editable:function () {
                            return (!$scope.initData);
                        }
                    },
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'bank',
                        headerName: '开户银行',
                        hcRequired : true
                    }, {
                        field: 'account',
                        headerName: '银行账号',
                        hcRequired : true
                    }]
                };
                /*----------------------------------通用查询-------------------------------------------*/

                /**
                 * 结算货币
                 */
                $scope.commonSearchCurrency = {
                    afterOk: function (result) {
                        $scope.data.currItem.base_currency_id = result.base_currency_id;
                        $scope.data.currItem.currency_name = result.currency_name;
                    }
                };

                /**
                 * 地址省市区 查询
                 */
                $scope.commonSearchSettingOfOrigin = {
                    title: '请选择省级行政区',
                    postData: {
                        areatype: 4
                    },
                    afterOk: function (res) {
                        $scope.data.currItem.province_name = res.areaname;//省名称
                        $scope.data.currItem.province_id = res.areaid;
                        $scope.data.currItem.area_full_name = res.areaname;//省名称
                        $modal.openCommonSearch({
                            classId: 'scparea',
                            postData:{
                                areatype: 5,
                                superid : res.areaid
                            },
                            action: 'search',
                            title: '请选择市级行政区'
                        })
                            .result//响应数据
                            .then(function (result) {
                                $scope.data.currItem.city_name = result.areaname;//市名称
                                $scope.data.currItem.area_full_name += "-" + result.areaname;//拼接市名称
                                $scope.data.currItem.city_id = result.areaid;
                                return result.areaid
                            },function (line) {
                                if(line=="头部关闭"){
                                    $scope.data.currItem.area_full_name = undefined;
                                    return -99;
                                }
                            }).then(function (id) {
                                if(id == -99){
                                    return;
                                }
                                $modal.openCommonSearch({
                                    classId: 'scparea',
                                    postData:{
                                        areatype: 6,
                                        superid : id
                                    },
                                    action: 'search',
                                    title: '请选择区级行政区'
                                }).result//响应数据
                                    .then(function (results) {
                                        $scope.data.currItem.district_name = results.areaname;//区名称
                                        $scope.data.currItem.area_full_name += "-" + results.areaname;//区名称
                                        $scope.data.currItem.district_id = results.areaid;
                                    },function (line) {
                                        if(line=="头部关闭"){
                                            $scope.data.currItem.area_full_name = undefined;
                                        }
                                    })
                        });


                    }
                };

                /*----------------------------------按钮方法数据 定义-------------------------------------------*/
                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    bizData.customer_accounts = [];
                    bizData.customer_account_ins = [];
                    bizData.valid = 1;
                };

                /**
                 * 查询系统参数
                 */
                var showTaxCode = function showTaxCodeModeFunc(){
                    return requestApi
                        .post({
                            classId: 'customer_org',
                            action: 'search',
                            data: {
                                search_flag : 131
                            }
                        })
                        .then(function (response) {
                            $scope.showTaxCodeMode =response.customer_accounts[0].confvalue;
                        });
                }();


                /**
                 * 修改税种名称，带出其他数据
                 */
                $scope.changeTaxName = function () {
                    if($scope.data.currItem.tax_name == undefined || $scope.data.currItem.tax_name == null || $scope.data.currItem.tax_name == ""){
                        $scope.data.currItem.tax_rate = undefined;
                        $scope.data.currItem.tax_code = undefined;
                        return;
                    }
                    $scope.data.currItem.tax_rate = $scope.data.currItem.tax_name;
                    return requestApi
                        .post({
                            classId: 'customer_org',
                            action: 'search',
                            data: {
                                search_flag : 132 ,
                                dictvalue : $scope.data.currItem.tax_name
                            }
                        })
                        .then(function (response) {
                            $scope.data.currItem.tax_code =response.customer_accounts[0].dictcode;
                        });
                };

                /**
                 * 保存前的数据处理
                 */
                $scope.saveBizData = function (bizData) {
                    $scope.hcSuper.saveBizData(bizData);
                    bizData.customer_kind = 4;
                };
                /**
                 * 保存验证
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    return invalidBox;
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.initData = bizData.is_init == 2;
                    //地址拼接
                    $scope.data.currItem.area_full_name = $scope.data.currItem.province_name + "-"
                        + $scope.data.currItem.city_name + "-"
                        + $scope.data.currItem.district_name;
                    $scope.gridOptions.hcApi.setRowData(bizData.customer_accounts);
                    $scope.gridOptions_in.hcApi.setRowData(bizData.customer_account_ins);
                };

                /*----------------------------------按钮及标签 定义-------------------------------------------*/

                /*底部左边按钮*/

                $scope.footerLeftButtons.addRow.click = function () {
                    if ($scope.epm_tab.out.active) {
                        $scope.addEducation && $scope.addEducation();
                    }else if ($scope.epm_tab.in.active) {
                        $scope.addInAccount && $scope.addInAccount();
                    }
                };
                $scope.footerLeftButtons.addRow.hide = function () {
                    return $scope.initData;
                };
                $scope.footerLeftButtons.deleteRow.click = function () {
                    if ($scope.epm_tab.out.active) {
                        $scope.delEducation && $scope.delEducation();
                    }else if ($scope.epm_tab.in.active) {
                        $scope.delInAccount && $scope.delInAccount();
                    }
                };
                $scope.footerLeftButtons.deleteRow.hide = function () {
                    return $scope.initData;
                };
                /**
                 * 定义按钮生效或再次生效
                 */
                $scope.footerLeftButtons.effectButtom = {
                    title: function () {
                        return $scope.data.currItem.valid == 3 ? "恢复生效" : "生效"
                    },
                    click: function () {
                        $scope.effectMethod(2, "生效");
                    },
                    hide: function () {
                        return (!$scope.tabs.base.active)
                            || ($scope.data.currItem.valid == 2)
                            || (!$scope.data.currItem.customer_org_id > 0)
                            || $scope.initData;
                    }
                };

                /**
                 * 定义按钮失效
                 */
                $scope.footerLeftButtons.loseEffectButtom = {
                    title: "失效",
                    click: function () {
                        $scope.effectMethod(3,"失效");
                    },
                    hide: function () {
                        return (!$scope.tabs.base.active)
                            || ($scope.data.currItem.valid != 2)
                            || (!$scope.data.currItem.customer_org_id > 0)
                            || $scope.initData;
                    }
                };
                /*----------------------------------按钮方法 定义-------------------------------------------*/
                /**
                 * 生效或者失效档案
                 */
                $scope.effectMethod = function (valid, reminder) {
                    return swalApi.confirmThenSuccess({
                        title: "确定要" + reminder + "吗?",
                        okFun: function () {
                            //函数区域
                           return requestApi.post("customer_org", "takeeffect", {
                                "valid": valid,
                                "customer_org_id" : $scope.getId()
                            }).then(function () {
                                $scope.data.currItem.valid = valid;
                            });
                        },
                        okTitle: reminder + '成功'
                    });
                };

                /**
                 * 添加打款账户
                 */
                $scope.addEducation = function () {
                    $scope.gridOptions.api.stopEditing();
                    var data = $scope.data.currItem.customer_accounts;
                    data.push({
                        account_type : 'out'
                    });
                    $scope.gridOptions.hcApi.setRowData(data);
                };
                /**
                 * 删除行打款账户
                 */
                $scope.delEducation = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.customer_accounts.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.customer_accounts);
                    }
                };
                /**
                 * 添加收款账户
                 */
                $scope.addInAccount = function () {
                    $scope.gridOptions_in.api.stopEditing();
                    $scope.data.currItem.customer_account_ins.push({
                        account_type : 'in'
                    });
                    $scope.gridOptions_in.hcApi.setRowData($scope.data.currItem.customer_account_ins);
                };
                /**
                 * 删除行收款账户
                 */
                $scope.delInAccount = function () {
                    var idx = $scope.gridOptions_in.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.customer_account_ins.splice(idx, 1);
                        $scope.gridOptions_in.hcApi.setRowData($scope.data.currItem.customer_account_ins);
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

    });