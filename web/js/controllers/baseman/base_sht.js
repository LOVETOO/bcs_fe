
/**
 * 表单显示控制器
 * date:2019-01-16
 */
define(
    ['module', 'controllerApi' ,'base_diy_page', 'swalApi', 'requestApi','openBizObj'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi, openBizObj) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope','$stateParams','BasemanService',
            //控制器函数
            function ($scope, $stateParams,BasemanService) {
                /**数据定义 */
                $scope.data = {};
                // 初始化通过页面传递过来的参数
                $scope.data.shtid = $stateParams.shtid;
                $scope.data.shtinsid = $stateParams.id;
                //如果只有流程实例ID则需要通过实例ID查询出模板ID
                if(!$stateParams.shtid && $stateParams.id){
                    var sql = "select shtid from scpshtins where shtinsid ="+$stateParams.id;
                    var returnData = BasemanService.RequestPostSync("sqltool", "execsql", {"sql": sql});
                    $scope.data.url = '/web/sht/instance/sht_' + returnData.sqlresult + '.jsp?id='+$stateParams.id;
                }else{
                    $scope.data.url = '/web/sht/instance/sht_'+$stateParams.shtid+'.jsp';
                }

                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                //启动流程
                window.startwf = function(shtid,shtinsid,wftempid,shtname,onReload){
                    openBizObj({
                        objType: 999,
                        objId: shtinsid,
                        wfTempId: wftempid,
                        startWf: true
                    });
                }

                //打开流程
                window.openwf = function(iwfid){
                    openBizObj({
                        wfId: iwfid
                    });
                }
            }
        ];

        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);