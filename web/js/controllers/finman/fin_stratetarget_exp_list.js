/**
 * 战略目标分解-列表页
 * date:2018-11-26
 */
define(
    ['module', 'controllerApi', 'base_obj_list', 'swalApi', 'requestApi','openBizObj'],
    function (module, controllerApi, base_obj_list, swalApi, requestApi,openBizObj) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$stateParams',
            //控制器函数
            function ($scope, $stateParams) {
                $scope.data = {};
                $scope.data.currItem = {};
                //测试用例
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'strate_year',
                        headerName: '年度',
                    }, {
                        field: 'entorgid',
                        headerName: '品类',
                    }, {
                        field: 'sales_amt',
                        headerName: '销售收入目标/元',
                    }, {
                        field: 'profit_amt',
                        headerName: '利润目标/元',
                    }, {
                        field: 'note',
                        headerName: '说明'
                    }]
                };
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                $scope.toolButtons.add.hide = function () {
                    if($stateParams.isresolve == 2){
                        return true;
                    }else 
                    return false;
                };

                $scope.toolButtons.delete.hide = function () {
                    if($stateParams.isresolve == 2){
                        return true;
                    }else 
                    return false;
                };
                //获取参数
                $scope.add = function () {
                    // console.log("获取的参数",$stateParams.isresolve);
                    openBizObj({
                        stateName: 'finman.fin_stratetarget_exp_prop',
                        //给属性页传递参数,item_class_pid为路由中指定的参数
                        params: {
                            isresolve:$stateParams.isresolve
                        }
                    });
                }
                $scope.openProp = function () {
                    // console.log("获取的参数",$stateParams.isresolve);
                    var rowdata = $scope.gridOptions.hcApi.getFocusedData();
                    if(!rowdata)
							return swalApi.info('请先选中要查看详情的行').then($q.reject);
                    openBizObj({
                        stateName: 'finman.fin_stratetarget_exp_prop',
                        //给属性页传递参数,item_class_pid为路由中指定的参数
                        params: {
                            id:rowdata.stratetarget_id,
                            isresolve:$stateParams.isresolve
                        }
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