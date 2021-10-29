/**
 * 交易公司
 * 2019/8/22
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', '$modal', 'numberApi','requestApi'],
    function (module, controllerApi, base_obj_prop, swalApi, $modal, numberApi, requestApi) {


        var controller = [
            '$scope',

            function ($scope) {
                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /*----------------------------------数据定义-------------------------------------------*/
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
                $scope.gridOptionsOut = {
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
                        hcRequired : true,
                        minWidth : 80
                    }, {
                        field: 'account',
                        headerName: '银行账号',
                        hcRequired : true,
                        minWidth : 150
                    }, {
                        field: 'division_id',
                        headerName: '所属事业部',
                        hcDictCode : 'epm.division',
                        hcRequired : true,
                        minWidth : 80
                    }]
                };
                /**
                 * 表格定义
                 */
                $scope.gridOptionsIn = {
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
                        hcRequired : true,
                        minWidth : 80
                    }, {
                        field: 'account',
                        headerName: '银行账号',
                        hcRequired : true,
                        minWidth : 150
                    }, {
                        field: 'division_id',
                        headerName: '所属事业部',
                        hcDictCode : 'epm.division',
                        hcRequired : true,
                        minWidth : 80
                    }]
                };
                /*----------------------------------通用查询-------------------------------------------*/

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
                        //拼接
                        $scope.data.currItem.site = res.areaname;
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
                                $scope.data.currItem.site += "-" + result.areaname;//拼接市名称
                                $scope.data.currItem.city_name = result.areaname;//市名称
                                $scope.data.currItem.city_id = result.areaid;
                                return result.areaid
                            },function (line) {
                                if(line=="头部关闭"){//中途关闭查询则清空
                                    $scope.data.currItem.site = undefined;
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
                                    $scope.data.currItem.site += "-" + results.areaname;//拼接区名称
                                    $scope.data.currItem.area_name = results.areaname;
                                    $scope.data.currItem.area_id = results.areaid;
                                },function (line) {
                                    if(line=="头部关闭"){
                                        $scope.data.currItem.site = undefined;
                                    }
                                })
                        });
                    }
                };
                /*----------------------------------计算方法定义-------------------------------------------*/

                /**
                 * 校验编码与名称是否存在相等
                 */
                $scope.dataEquality = function (parameter){
                    //判断是否保存过
                    var id = $scope.data.currItem.trading_company_id > 0 ?
                        $scope.data.currItem.trading_company_id : 0;
                    return requestApi
                        .post({
                            classId: 'epm_trading_company',
                            action: 'search',
                            data: {
                                /* search_flag
                                 1-根据交易公司编码查询账套数据
                                 2-根据交易公司名称查询账套数据*/
                                search_flag : parameter,
                                trading_company_id : id,//存在id，需要过滤当前单据的数据
                                trading_company_code : $scope.data.currItem.trading_company_code,
                                trading_company_name : $scope.data.currItem.trading_company_name
                            }
                        })
                        .then(function (data) {
                            if(data.epm_trading_companys.length > 0){
                                //账套中存在相同编码或者名称的数据
                                var file = "";
                                var str = "";
                                if(parameter == 1) {
                                    str = "编码为【" + $scope.data.currItem.trading_company_code;
                                    file = "trading_company_code";
                                }else if(parameter == 2){
                                    str = "名称为【" + $scope.data.currItem.trading_company_name;
                                    file = "trading_company_name";
                                }
                                swalApi
                                    .error(str + "】的交易公司记录已存在，请检查。")
                                    .then(function () {
                                        $scope.data.currItem[file] = undefined
                                    });
                            }
                        });
                };

                /**
                 * 默认税率校验方法
                 */
                $scope.dataVerify = function () {
                    if(!numberApi.isNum(Number($scope.data.currItem.tax_rate))){//判断输入是否是数字
                        swalApi.info('默认税率输入的不是数字，请重新输入!');
                        $scope.data.currItem.tax_rate = undefined;
                    }else if(Number($scope.data.currItem.tax_rate) <= 0 || Number($scope.data.currItem.tax_rate) >= 1){
                        swalApi.info('默认税率范围为大于 0 小于 1，请重新输入!');
                        $scope.data.currItem.tax_rate = undefined;
                    }
                };

                /**
                 * 地址拼接展示
                 */
                function jointShow() {
                    $scope.data.currItem.site = $scope.data.currItem.province_name + "-"
                        + $scope.data.currItem.city_name + "-"
                        + $scope.data.currItem.area_name
                }

                /*----------------------------------单据方法数据定义-------------------------------------------*/
                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    bizData.epm_trading_account_outs = [];
                    bizData.epm_trading_account_ins = [];
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.initData = bizData.is_init == 2;
                    $scope.gridOptionsOut.hcApi.setRowData(bizData.epm_trading_account_outs);
                    $scope.gridOptionsIn.hcApi.setRowData(bizData.epm_trading_account_ins);
                    //省市区拼接展示
                    jointShow();
                };

                /**
                 * 保存验证
                 */
                $scope.validCheck = function (invalidBox) {
                    //判断是否保存过
                    var id = $scope.data.currItem.trading_company_id > 0 ?
                        $scope.data.currItem.trading_company_id : 0;
                    return requestApi
                        .post({
                            classId: 'epm_trading_company',
                            action: 'search',
                            data: {
                                /* search_flag
                                 1-根据交易公司编码查询账套数据*/
                                search_flag : 1,
                                trading_company_id : id,//存在id，需要过滤当前单据的数据
                                trading_company_code : $scope.data.currItem.trading_company_code
                            }
                        })
                        .then(function (data) {
                            if(data.epm_trading_companys.length > 0){
                                //账套中存在相同编码的数据
                                invalidBox.push("编码为【"
                                    + $scope.data.currItem.trading_company_code
                                    + "】的交易公司记录已存在，请检查。");
                            }
                            var postParams = {
                                classId: 'epm_trading_company',
                                action: 'search',
                                data: {
                                    /* search_flag
                                     2-根据交易公司名称查询账套数据*/
                                    search_flag : 2,
                                    trading_company_id : id,//存在id，需要过滤当前单据的数据
                                    trading_company_name : $scope.data.currItem.trading_company_name
                                }
                            };
                            return postParams;
                        })
                        .then(requestApi.post)
                        .then(function (value) {
                            if(value.epm_trading_companys.length > 0){
                                //账套中存在相同名称的数据
                                invalidBox.push("名称为【"
                                    + $scope.data.currItem.trading_company_name
                                    + "】的交易公司记录已存在，请检查。");
                            }
                        })
                        .then(function () {
                            $scope.hcSuper.validCheck(invalidBox);
                            return invalidBox;
                        });
                };

                /*----------------------------------按钮及标签 定义-------------------------------------------*/
                /*底部左边按钮*/
                $scope.footerLeftButtons.addRow.click = function () {
                    if ($scope.epm_tab.out.active) {
                        $scope.addOut && $scope.addOut();
                    }else if ($scope.epm_tab.in.active) {
                        $scope.addIn && $scope.addIn();
                    }
                };
                $scope.footerLeftButtons.addRow.hide = function (){
                    return $scope.initData;
                };
                $scope.footerLeftButtons.deleteRow.click = function () {
                    if ($scope.epm_tab.out.active) {
                        $scope.delOut && $scope.delOut();
                    }else if ($scope.epm_tab.in.active) {
                        $scope.delIn && $scope.delIn();
                    }
                };
                $scope.footerLeftButtons.deleteRow.hide = function (){
                    return $scope.initData;
                };
                /*----------------------------------按钮方法定义-------------------------------------------*/

                /**
                 * 添加打款账户
                 */
                $scope.addOut = function () {
                    $scope.gridOptionsOut.api.stopEditing();
                    $scope.data.currItem.epm_trading_account_outs.push({
                        account_type : 'OUT'
                    });
                    $scope.gridOptionsOut.hcApi.setRowData($scope.data.currItem.epm_trading_account_outs);
                };
                /**
                 * 删除行打款账户
                 */
                $scope.delOut = function () {
                    var idx = $scope.gridOptionsOut.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.epm_trading_account_outs.splice(idx, 1);
                        $scope.gridOptionsOut.hcApi.setRowData($scope.data.currItem.epm_trading_account_outs);
                    }
                };
                /**
                 * 添加收款账户
                 */
                $scope.addIn = function () {
                    $scope.gridOptionsIn.api.stopEditing();
                    $scope.data.currItem.epm_trading_account_ins.push({
                        account_type : 'IN'
                    });
                    $scope.gridOptionsIn.hcApi.setRowData($scope.data.currItem.epm_trading_account_ins);
                };
                /**
                 * 删除行收款账户
                 */
                $scope.delIn = function () {
                    var idx = $scope.gridOptionsIn.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.epm_trading_account_ins.splice(idx, 1);
                        $scope.gridOptionsIn.hcApi.setRowData($scope.data.currItem.epm_trading_account_ins);
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