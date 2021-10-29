/**
 * 供应商档案-属性页
 * 2018-12-5
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

                /*-------------------数据定义开始------------------------*/
                $scope.data = {};
                $scope.data.currItem = {};

                /**继承主控制器 */
                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                function getCurrItem() {
                    return $scope.data.currItem;
                }

                /**
                 * 新增时数据设置
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);

                    bizData.usable = 2;//默认"有效"勾选
                    $scope.data.currItem.vendor_type = 1;
                    bizData.base_currency_id = 1;//默认"结算货币"为‘人民币’
                    bizData.currency_name = '人民币';

                };

                /**
                 * 复制
                 */
                $scope.copyBizData = function (bizData) {
                    $scope.hcSuper.copyBizData(bizData);

                    bizData.vendor_id = 0;
                    bizData.vendor_code = '';
                    bizData.usable = 2;
                };

                /*-------------------数据定义结束------------------------*/

                /*---------------------通用查询开始-------------------------*/

                //查会计科目
                $scope.commonSearchSettingOfAccountSubject = {
                    //无票应付科目
                    noinv: {
                        sqlWhere: " end_km = 2 ",
                        afterOk: function (result) {
                            getCurrItem().gl_account_subject_id_noinv = result.gl_account_subject_id;
                            getCurrItem().code_noinv = result.km_code;
                            getCurrItem().name_noinv = result.km_name;
                        }
                    },
                    //应付票据科目
                    ap: {
                        sqlWhere: " end_km = 2 ",
                        afterOk: function (result) {
                            getCurrItem().gl_account_subject_id_ap = result.gl_account_subject_id;
                            getCurrItem().code_ap = result.km_code;
                            getCurrItem().name_ap = result.km_name;
                        }
                    },
                    //有票应付科目
                    inv: {
                        sqlWhere: " end_km = 2 ",
                        afterOk: function (result) {
                            getCurrItem().gl_account_subject_id_inv = result.gl_account_subject_id;
                            getCurrItem().code_inv = result.km_code;
                            getCurrItem().name_inv = result.km_name;
                        }
                    }
                }

                //查询货币
                $scope.commonSearchSettingOfCurrency = {
                    afterOk: function (result) {
                        getCurrItem().base_currency_id = result.base_currency_id;
                        getCurrItem().currency_name = result.currency_name;
                    }
                }
                /*---------------------通用查询结束-------------------------*/

                /*---------------------事件开始-------------------------*/
                /*
                 * “科目”相关的按钮[x]点击后触发事件。
                 * @param suffix : 后缀名称
                 * */
                $scope.clearSubjectAfterDelete = function (suffix) {
                    var target = '';

                    //依次删除对应id、code、name
                    target = 'gl_account_subject_id_' + suffix;
                    getCurrItem()[target] = '';
                    target = 'code_' + suffix;
                    getCurrItem()[target] = '';
                    target = 'name_' + suffix;
                    getCurrItem()[target] = '';
                }

                /*---------------------事件结束-------------------------*/

                //标签页
                $scope.tabs.base.title = "基本信息";

                /*$scope.tabs.finance = {
                 title:"财务属性"
                 };*/
                $scope.tabs.other = {
                    title: "其他"
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