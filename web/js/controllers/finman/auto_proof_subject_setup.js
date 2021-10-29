/**
 * 自动凭证科目设置 auto_proof_subject_setup
 * Created by zhl on 2019/1/23.
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'fileApi', 'swalApi', 'requestApi', 'angular', 'directive/hcButtons'],
    function (module, controllerApi, base_diy_page, fileApi, swalApi, requestApi, angular) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$q',
            //控制器函数
            function ($scope, $q) {

                //继承基础控制器
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                /*-------------------数据定义、初始化 开始----------------*/

                $scope.data = {};
                $scope.userbean = {};
                $scope.data.currItem = {};
                //临时储存的数据，点击【不保存】时，恢复所以数据。在doInit中初始化
                $scope.originalData = {};

                //获取绑定数据
                function getCurrItem() {
                    return $scope.data.currItem;
                }

                /**
                 * 初始化
                 * @return {Promise}
                 */
                $scope.doInit = function () {
                    return $q
                        .when()
                        .then($scope.hcSuper.doInit)
                        .then(function () {
                            return requestApi.post("gl_auto_km_set", "search", {});
                        })
                        .then(function (data) {
                            $scope.data.currItem = data;

                            //初始化临时数据
                            $scope.originalData = angular.copy(data);
                            console.log($scope.originalData,"init:$scope.originalData");
                        });
                };

                /*-------------------数据定义、初始化、校验 结束----------------*/

                /*--------------------- 通用查询 开始---------------------------*/

                //科目查询
                $scope.commonSearchSettingOfSubject = {
                    //应交税金-销项税会计科目
                    xx: {
                        sqlWhere: 'is_freeze <> 2 and end_km = 2 ',
                        afterOk: function (result) {
                            getCurrItem().gl_account_subject_id_xx = result.gl_account_subject_id;
                            getCurrItem().gl_account_subject_code_xx = result.km_code;
                            getCurrItem().gl_account_subject_name_xx = result.km_name;
                        }
                    },
                    //商品结存差异调整会计科目
                    dtzspcy: {
                        sqlWhere: 'is_freeze <> 2 and end_km = 2 ',
                        afterOk: function (result) {
                            getCurrItem().gl_account_subject_id_dtzspcy = result.gl_account_subject_id;
                            getCurrItem().km_code_dtzspcy = result.km_code;
                            getCurrItem().km_name_dtzspcy = result.km_name;
                        }
                    },
                    //应交税金-进项税会计科目
                    jx: {
                        sqlWhere: 'is_freeze <> 2 and end_km = 2 ',
                        afterOk: function (result) {
                            getCurrItem().gl_account_subject_id_jx = result.gl_account_subject_id;
                            getCurrItem().gl_account_subject_code_jx = result.km_code;
                            getCurrItem().gl_account_subject_name_jx = result.km_name;
                        }
                    },
                    //仓库盘亏费用科目
                    ckpk: {
                        sqlWhere: 'is_freeze <> 2 and end_km = 2 ',
                        afterOk: function (result) {
                            getCurrItem().gl_account_subject_id_ckpk = result.gl_account_subject_id;
                            getCurrItem().gl_account_subject_code_ckpk = result.km_code;
                            getCurrItem().gl_account_subject_name_ckpk = result.km_name;
                        }
                    },
                    //委托代销科目
                    wt: {
                        sqlWhere: 'is_freeze <> 2 and end_km = 2 ',
                        afterOk: function (result) {
                            getCurrItem().gl_account_subject_id_wt = result.gl_account_subject_id;
                            getCurrItem().km_code_wt = result.km_code;
                            getCurrItem().km_name_wt = result.km_name;
                        }
                    },
                    //银行扣费科目
                    yhkf: {
                        sqlWhere: 'is_freeze <> 2 and end_km = 2 ',
                        afterOk: function (result) {
                            getCurrItem().gl_account_subject_id_yhkf = result.gl_account_subject_id;
                            getCurrItem().gl_account_subject_code_yhkf = result.km_code;
                            getCurrItem().gl_account_subject_name_yhkf = result.km_name;
                        }
                    },
                    //预付账款科目
                    yf: {
                        sqlWhere: 'is_freeze <> 2 and end_km = 2 ',
                        afterOk: function (result) {
                            getCurrItem().gl_account_subject_id_yf = result.gl_account_subject_id;
                            getCurrItem().km_code_yf = result.km_code;
                            getCurrItem().km_name_yf = result.km_name;
                        }
                    },
                    //预收账款科目
                    ys: {
                        sqlWhere: 'is_freeze <> 2 and end_km = 2 ',
                        afterOk: function (result) {
                            getCurrItem().gl_account_subject_id_ys = result.gl_account_subject_id;
                            getCurrItem().km_code_ys = result.km_code;
                            getCurrItem().km_name_ys = result.km_name;
                        }
                    },
                    //损益结转科目（对应字段未确定）
                    profit: {
                        sqlWhere: 'is_freeze <> 2 and end_km = 2 ',
                        afterOk: function (result) {
                            getCurrItem().gl_account_subject_id_profit = result.gl_account_subject_id;
                            getCurrItem().gl_account_subject_code_profit = result.km_code;
                            getCurrItem().gl_account_subject_name_profit = result.km_name;
                        }
                    },
                    //发出商品科目
                    fcsp: {
                        sqlWhere: 'is_freeze <> 2 and end_km = 2 ',
                        afterOk: function (result) {
                            getCurrItem().gl_account_subject_id_fcsp = result.gl_account_subject_id;
                            getCurrItem().gl_account_subject_code_fcsp = result.km_code;
                            getCurrItem().gl_account_subject_name_fcsp = result.km_name;
                        }
                    },
                    //固定资产减值准备对方科目(对应字段未确定)
                    ayq: {
                        sqlWhere: 'is_freeze <> 2 and end_km = 2 ',
                        afterOk: function (result) {
                            getCurrItem().gl_account_subject_id_ayq = result.gl_account_subject_id;
                            getCurrItem().km_code_ayq = result.km_code;
                            getCurrItem().km_name_ayq = result.km_name;
                        }
                    },
                    //应付工资科目(对应字段未确定)
                    yfgz: {
                        sqlWhere: 'is_freeze <> 2 and end_km = 2 ',
                        afterOk: function (result) {
                            getCurrItem().gl_account_subject_id_yfgz = result.gl_account_subject_id;
                            getCurrItem().km_code_yfgz = result.km_code;
                            getCurrItem().km_name_yfgz = result.km_name;
                        }
                    },
                    //应收票据科目
                    ar: {
                        sqlWhere: 'is_freeze <> 2 and end_km = 2 ',
                        afterOk: function (result) {
                            getCurrItem().gl_account_subject_id_ar = result.gl_account_subject_id;
                            getCurrItem().gl_account_subject_code_ar = result.km_code;
                            getCurrItem().gl_account_subject_name_ar = result.km_name;
                        }
                    },
                    //应付票据科目
                    ap: {
                        sqlWhere: 'is_freeze <> 2 and end_km = 2 ',
                        afterOk: function (result) {
                            getCurrItem().gl_account_subject_id_ap = result.gl_account_subject_id;
                            getCurrItem().gl_account_subject_code_ap = result.km_code;
                            getCurrItem().gl_account_subject_name_ap = result.km_name;
                        }
                    }
                }

                /*--------------------- 通用查询 结束---------------------------*/

                /*--------------按钮定义、按钮事件、按钮相关函数 开始-----------------*/

                //隐藏头部工具栏
                $scope.hideToolButtons = true;

                $scope.editButtons = {
                    save: {
                        title: '保存',
                        icon: 'fa fa-save',
                        click: function () {
                            $scope.save && $scope.save();
                            $scope.form.$setPristine();
                        },
                        hide: function () {
                            return $scope.form.$pristine;
                        }
                    },
                    doNotSave: {
                        title: '不保存',
                        icon: 'fa fa-undo',
                        click: function () {
                            $scope.data.currItem = angular.copy($scope.originalData);

                            $scope.form.$setPristine();
                        },
                        hide: function () {
                            return $scope.form.$pristine;
                        }
                    }
                };

                //保存
                $scope.save = function () {
                    requestApi.post("gl_auto_km_set", "insert", $scope.data.currItem)
                        .then(function (data) {
                            //$scope.refresh();
                            return swalApi.success('保存成功');
                        })
                        .then(function () {
                            $scope.research();
                            //保存后更新临时数据
                            //$scope.originalData = angular.copy(getCurrItem());
                        });
                }

                // 刷新
            /*    $scope.refresh = function () {
                    //刷新即是用上此的查询条件再查询一次
                    return $scope.doInit;
                };*/

                /*
                 * “科目”相关的按钮[x]点击后触发事件。
                 * @param suffix : 后缀名称
                 * */
                $scope.clearSubjectAfterDelete = function (suffix) {
                    var target = '';

                    //依次删除对应id、code、name
                    target = 'gl_account_subject_id_' + suffix;
                    getCurrItem()[target] = '';
                    target = 'gl_account_subject_code_' + suffix;
                    getCurrItem()[target] = '';
                    target = 'gl_account_subject_name_' + suffix;
                    getCurrItem()[target] = '';

                    target = 'km_code_' + suffix;
                    getCurrItem()[target] = '';
                    target = 'km_name_' + suffix;
                    getCurrItem()[target] = '';

                }

                /*--------------按钮定义、按钮事件、按钮相关函数 结束-----------------*/

                $scope.research = function () {
                    return requestApi.post("gl_auto_km_set", "search", {})
                        .then(function (data) {
                            console.log(data,"data");

                            $scope.data.currItem = data;

                            $scope.originalData = angular.copy(data);
                            console.log($scope.originalData, "初始化临时数据");
                        });
                }


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