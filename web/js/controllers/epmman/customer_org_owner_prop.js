/**
 * 工程客户档案
 *  2019/5/20.
 *  zengjinhua
 *  update:2019/7/5
 *  update_by:zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'openBizObj', 'swalApi', '$q', 'numberApi', 'dateApi', 'fileApi', '$modal', 'directive/hcImg'],
    function (module, controllerApi, base_obj_prop, requestApi, openBizObj, swalApi, $q, numberApi, dateApi, fileApi, $modal) {


        var CustomerOrgCorproateProp = [
            '$scope',

            function ($scope) {
                /*----------------------------------能否编辑-------------------------------------------*/
                function editable() {
                    return $scope.data.currItem.stat == 1;
                }

                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /*----------------------------------表格定义-------------------------------------------*/
                //表格定义
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'bank',
                        headerName: '开户银行',
                        editable: editable,
                        hcRequired : true
                    }, {
                        field: 'account',
                        headerName: '银行账号',
                        editable: editable,
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
                    postData:{
                        search_flag : 99,
                        superid : -1
                    },
                    afterOk: function (res) {
                        $scope.data.currItem.province_name = res.areaname;//省名称
                        $scope.data.currItem.province_id = res.areaid;
                        $modal.openCommonSearch({
                            classId: 'scparea',
                            postData:{
                                search_flag : 99,
                                superid : res.areaid
                            },
                            action: 'search',
                            title: "所属市选择",
                            gridOptions: {
                                columnDefs: [
                                    {
                                        headerName: "所属市名称",
                                        field: "areaname"
                                    }, {
                                        headerName: "区号",
                                        field: "telzone"
                                    }
                                ]
                            }
                        })
                            .result//响应数据
                            .then(function (result) {
                                $scope.data.currItem.province_name += "-" + result.areaname;//市名称
                                $scope.data.currItem.city_id = result.areaid;
                                return result.areaid
                            },function (line) {
                                if(line=="头部关闭"){
                                    $scope.data.currItem.province_name = undefined;
                                    return -99;
                                }
                            }).then(function (id) {
                            if(id == -99){
                                return;
                            }
                            $modal.openCommonSearch({
                                classId: 'scparea',
                                postData:{
                                    search_flag : 99,
                                    superid : id
                                },
                                action: 'search',
                                title: "所属区选择",
                                gridOptions: {
                                    columnDefs: [
                                        {
                                            headerName: "所属区名称",
                                            field: "areaname"
                                        }, {
                                            headerName: "区号",
                                            field: "telzone"
                                        }
                                    ]
                                }
                            }).result//响应数据
                                .then(function (results) {
                                    $scope.data.currItem.province_name += "-" + results.areaname;//区名称
                                    $scope.data.currItem.district_id = results.areaid;
                                },function (line) {
                                    if(line=="头部关闭"){
                                        $scope.data.currItem.province_name = undefined;
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
                };
                /**
                 * 保存前的数据处理
                 */
                $scope.saveBizData = function (bizData) {
                    $scope.hcSuper.saveBizData(bizData);
                    bizData.customer_kind = 3;
                };
                //保存验证
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    return invalidBox;
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.customer_accounts);
                };

                /*----------------------------------按钮及标签 定义-------------------------------------------*/

                /*底部左边按钮*/

                $scope.footerLeftButtons.addRow.click = function () {
                    $scope.addEducation && $scope.addEducation();
                };
                $scope.footerLeftButtons.addRow.hide = function () {
                    return $scope.data.currItem.stat > 1;
                };
                $scope.footerLeftButtons.deleteRow.click = function () {
                    $scope.delEducation && $scope.delEducation();
                };
                $scope.footerLeftButtons.deleteRow.hide = function () {
                    return $scope.data.currItem.stat > 1;
                };
                /*----------------------------------按钮方法 定义-------------------------------------------*/
                /**
                 * 添加教育经历
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
                 * 删除行教育经历
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

            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: CustomerOrgCorproateProp
        });

    });