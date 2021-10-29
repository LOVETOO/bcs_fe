/**
 * 工单打印
 * 2019-1-09
 * wyh
 */
define(
    ['controllerApi', 'base_print_controller', 'requestApi', '$q', 'directive/hcImg'],
    function (controllerApi, base_print_controller, requestApi, $q) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$modalInstance', '$scope', 'printParams',
            function ($modalInstance, $scope, printParams) {
                $scope.modalInstance = $modalInstance;//模态窗实例
                $scope.printTemplate = printParams.printTemplate; //打印模板配置信息
                $scope.data = printParams.data;//数据;
                $scope.printType = "single";//打印类型


                /**==============让用户只预览（默认模式，可不写) ========**/
                $scope.printMode = 'preview';
                /**==============让用户可维护布局 =========**/
                $scope.printMode = 'setup';
                /**================= 打印设计模式 可以生成代码==============**/
                $scope.printMode = 'design';
                $scope.getPrintSetup = getPrintSetup;

                $scope.data.currItem.val = ""

                function getPrintSetup() {
                    eval($scope.data.currItem.temp_content);   
                    // $scope.LODOP.ADD_PRINT_BARCODE("5mm", "5mm", "60mm", "12mm", "128Auto","13645646");
                    // $scope.LODOP.ADD_PRINT_HTM("5mm", "70mm", "55mm", "12mm", "<h1>合格</h1>");   
                    $scope.LODOP.NEWPAGEA();  
                    if (LODOP.CVERSION) CLODOP.On_Return=function(TaskID,Value){
                        console.log(Value);
                    };
                }

                /**
                 * 设置打印任务名，打印纸张大小 
                 */
                function setPrintTitle() {
                    $scope.LODOP.PRINT_INITA(0, 0, "130mm", "110mm", "条码生成");
                    $scope.LODOP.SET_PRINT_PAGESIZE(1, 1300, 1100, "");
                }

                $scope.setPrintTitle = setPrintTitle;

                controllerApi.extend({
                    controller: base_print_controller.controller,
                    scope: $scope,
                    $modalInstance: $modalInstance
                });
            }
        ];

        /**
         * 打印前处理数据
         * @param data
         * @returns {*}
         */
        function beforePrint(data) {
            return data;
        }
        /**
         * 返回页面html
         * @returns {string}
         */
        function getPrintDomStr() {
            return "";
        }

        return {
            controller: controller,
            beforePrint: beforePrint,
            getPrintDomStr: getPrintDomStr
        }
    }
);
