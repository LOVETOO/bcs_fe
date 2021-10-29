/*
 * 模块启动 modular_start
 *  date:2019-1-7
 * */
define(
    ['module', 'controllerApi', 'base_diy_page', 'requestApi', 'swalApi','directive/hcBox'],
    function (module, controllerApi, base_diy_page, requestApi, swalApi) {
        'use strict';

        var modular_start = [
            //声明依赖注入
            '$scope', '$q',
            //控制器函数
            function ($scope, $q) {
                $scope.data = {};
                $scope.data.currItem = {};

                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                function getCurrItem() {
                    return $scope.data.currItem;
                }

                /**
                 * 初始化（搜索）
                 * @return {Promise}
                 * @since 2019-01-14
                 */
                $scope.doInit = function () {
                    return $q
                        .when()
                        .then($scope.hcSuper.doInit)
                        .then(function () {
                            //存货模块数据查询、设置
                            $scope.setData("inv_param");
                        })
                        .then(function () {
                            //应收模块数据查询、设置
                            $scope.setData("ar_param");
                        })
                        .then(function () {
                            //应付模块数据查询、设置
                            $scope.setData("ap_param");
                        })
                        .then(function () {
                            //出纳模块数据查询、设置
                            $scope.setData("fd_param");
                        })
                        .then(function () {
                            //固定资产模块数据查询、设置
                            $scope.setData("ad_param");
                        })
                        .then(function () {
                            //预算管理模块数据查询、设置
                            $scope.setData("fin_fee_param");
                        })
                        .then(function () {
                            //总账账套模块数据查询、设置
                            $scope.setData("gl_account_start_option");
                        })
                }


                //复选框点击事件
                $scope.modularStart = function (className) {
                    var currItem = getCurrItem();
                    //用于重置复选框值为1，只有点击并确认后才允许值变更为2
                    var targetItemString = '';
                    //与复选框对应的“启用月份”
                    var preYearMonth = '';
                    //模块中文名称，用于提示时显示中文
                    var modularChinese = '';

                    switch (className) {
                        case 'inv_param':
                            console.log('inv start');
                            targetItemString = 'inv_is_start';
                            preYearMonth = getCurrItem().inv_year_month;
                            modularChinese = '存货模块';
                            break;
                        case 'ar_param':
                            console.log('ar start');
                            targetItemString = 'ar_is_start';
                            preYearMonth = getCurrItem().ar_year_month;
                            modularChinese = '应收模块';
                            break;
                        case 'ap_param':
                            console.log('ap start');
                            targetItemString = 'ap_is_start';
                            preYearMonth = getCurrItem().ap_year_month;
                            modularChinese = '应付模块';
                            break;
                        case 'fd_param':
                            console.log('fd start');
                            targetItemString = 'fd_is_start';
                            preYearMonth = getCurrItem().fd_year_month;
                            modularChinese = '出纳模块';
                            break;
                        case 'ad_param':
                            console.log('ad start');
                            targetItemString = 'ad_is_start';
                            preYearMonth = getCurrItem().ad_year_month;
                            modularChinese = '固定资产模块';
                            break;
                        case 'fin_fee_param':
                            console.log('fin_fee start');
                            targetItemString = 'fin_fee_is_start';
                            preYearMonth = getCurrItem().fin_fee_year_month;
                            modularChinese = '预算管理模块';
                            break;
                        case 'gl_account_start_option':
                            console.log('gl_account_start...');
                            targetItemString = 'gl_account_is_start'
                            preYearMonth = getCurrItem().gl_account_year_month;
                            modularChinese = '总账账套模块';
                            break;
                        default:
                            console.log('nothing start');
                            break;
                    }
                    //点击复选框后再点击确定才能选中
                    currItem[targetItemString] = 1;

                    console.log(preYearMonth + 'is preYearMonth');
                    if (preYearMonth == '' || !preYearMonth)
                        return swalApi.info('请先填写\'【' + modularChinese + '】的启用月份\'').then(function () {
                            $scope.refresh && $scope.refresh();
                        });

                    return swalApi.confirmThenSuccess({

                        title: "确定要启用【" + modularChinese + "】吗?",
                        okFun: function () {
                            console.log('启用' + className + '并勾选对应选框');
                            if (className == 'gl_account_start_option') {
                                var postdata = {
                                    is_start: 2,
                                    year_month: preYearMonth
                                };
                                //总账账套模块启用相关的类和其它类并不类似
                                requestApi.post('gl_account_start_option', "insert", postdata).then(function (data) {
                                    //刷新数据
                                    $scope.setData('gl_account_start_option', data);
                                });
                            } else {
                                var postdata = {
                                    isstart: 2,
                                    year_month: preYearMonth
                                };
                                requestApi.post(className, "start", postdata).then(function (data) {
                                    //刷新数据
                                    $scope.setData(className, data);
                                });
                            }
                        },
                        okTitle: '启用成功'
                    });
                }//结束复选框点击事件

                //请求后设置数据
                $scope.setData = function (className) {
                    switch (className) {
                        case 'inv_param':
                            return requestApi.post("inv_param", "select", {}).then(function (data) {
                                getCurrItem().inv_is_start = data.param_value;//是否启用
                                getCurrItem().inv_created_by = data.created_by;//创建人
                                getCurrItem().inv_creation_date = data.creation_date;//创建时间
                                getCurrItem().inv_last_updated_by = data.last_updated_by;//最后修改人
                                getCurrItem().inv_last_update_date = data.last_update_date;//最后修改时间
                                getCurrItem().inv_year_month = data.year_month;//启用月份
                            });
                            break;
                        case 'ar_param':
                            return requestApi.post("ar_param", "select", {}).then(function (data) {
                                getCurrItem().ar_is_start = data.param_value;//是否启用
                                getCurrItem().ar_created_by = data.created_by;//创建人
                                getCurrItem().ar_creation_date = data.creation_date;//创建时间
                                getCurrItem().ar_last_updated_by = data.last_updated_by;//最后修改人
                                getCurrItem().ar_last_update_date = data.last_update_date;//最后修改时间
                                getCurrItem().ar_year_month = data.year_month;//启用月份
                            });
                            break;
                        case 'ap_param':
                            return requestApi.post("ap_param", "select", {}).then(function (data) {
                                getCurrItem().ap_is_start = data.param_value;//是否启用
                                getCurrItem().ap_created_by = data.created_by;//创建人
                                getCurrItem().ap_creation_date = data.creation_date;//创建时间
                                getCurrItem().ap_last_updated_by = data.last_updated_by;//最后修改人
                                getCurrItem().ap_last_update_date = data.last_update_date;//最后修改时间
                                getCurrItem().ap_year_month = data.year_month;//启用月份
                            });
                            break;
                        case 'fd_param':
                            return requestApi.post("fd_param", "select", {}).then(function (data) {
                                getCurrItem().fd_is_start = data.param_value;//是否启用
                                getCurrItem().fd_created_by = data.created_by;//创建人
                                getCurrItem().fd_creation_date = data.creation_date;//创建时间
                                getCurrItem().fd_last_updated_by = data.last_updated_by;//最后修改人
                                getCurrItem().fd_last_update_date = data.last_update_date;//最后修改时间

                                getCurrItem().fd_year_month = data.year_month;//启用月份

                            });
                            break;
                        case 'ad_param':
                            return requestApi.post("ad_param", "select", {}).then(function (data) {
                                getCurrItem().ad_is_start = data.param_value;//是否启用
                                getCurrItem().ad_created_by = data.created_by;//创建人
                                getCurrItem().ad_creation_date = data.creation_date;//创建时间
                                getCurrItem().ad_last_updated_by = data.last_updated_by;//最后修改人
                                getCurrItem().ad_last_update_date = data.last_update_date;//最后修改时间

                                getCurrItem().ad_year_month = data.year_month;//启用月份

                            });
                            break;
                        case 'fin_fee_param':
                            return requestApi.post("fin_fee_param", "select", {}).then(function (data) {;
                                getCurrItem().fin_fee_is_start = data.param_value;//是否启用
                                getCurrItem().fin_fee_created_by = data.created_by;//创建人
                                getCurrItem().fin_fee_creation_date = data.creation_date;//创建时间
                                getCurrItem().fin_fee_last_updated_by = data.last_updated_by;//最后修改人
                                getCurrItem().fin_fee_last_update_date = data.last_update_date;//最后修改时间
                                getCurrItem().fin_fee_year_month = data.year_month;//启用月份
                            });
                            break;
                        case 'gl_account_start_option':
                            return requestApi.post("gl_account_start_option", "select", {}).then(function (data) {
                                getCurrItem().gl_account_is_start = data.is_start;//是否启用
                                getCurrItem().gl_account_created_by = data.created_by;//创建人
                                getCurrItem().gl_account_creation_date = data.creation_date;//创建时间
                                getCurrItem().gl_account_last_updated_by = data.last_updated_by;//最后修改人
                                getCurrItem().gl_account_last_update_date = data.last_update_date;//最后修改时间
                                getCurrItem().gl_account_year_month = data.year_month;//启用月份
                            });
                            break;
                        default:
                            console.log('nothing set');
                            break;
                    }
                }

            }
        ];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: modular_start
        });
    }
);

