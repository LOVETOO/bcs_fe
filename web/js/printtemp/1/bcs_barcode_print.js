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
                $scope.printType = printParams.printType;//打印类型


                /**==============让用户只预览（默认模式，可不写) ========**/
                //   $scope.printMode = 'preview';
                /**==============让用户可维护布局 =========**/
                //   $scope.printMode = 'setup';
                /**================= 打印设计模式 可以生成代码==============**/
                $scope.printMode = 'design';
                $scope.getPrintSetup = getPrintSetup;

                $scope.data.currItem.val = ""
                $scope.data.currItem.jobCode = '1';
                $scope.data.currItem.printStatus = 0;

                function getPrintSetup() {
                    //console.time("初始化加载数据时间")
                    if ($scope.data.currItem.barcodes == null || $scope.data.currItem.barcodes.length == 0) {
                        return;
                    }
                    var val
                    $scope.data.currItem.barcodes.forEach(function (e) {
                        var serialno = e.serialno;
                        var productname = e.productname;
                        var packsize = e.packsize;
                        var waterconsumption = e.waterconsumption;
                        var waterefficiency = e.waterefficiency;
                        var pitdistance = e.pitdistance;
                        var units = e.units;

                        $q
                            .when()
                            .then(function () {
                                var strStyle = "<style> table,td,th {border-width: 1px;}</style>";
                                var req = /\"\[/g
                                var req0 = /\]\"/g
                                eval(($scope.data.currItem.temp_content).replace(req, "").replace(req0, ""));
                                $scope.LODOP.NEWPAGEA();
                            }).then(function () {
                                if (LODOP.CVERSION) LODOP.On_Return = function (TaskID, Value) {
                                    console.log("TaskID:" + TaskID);
                                    console.log("Value:" + Value);//job代码
                                    $scope.data.currItem.jobCode = Value;
                                };
                            }).then(function () {
                                requestApi.post({
                                    classId: "bcs_mo",
                                    action: "print",
                                    data: {
                                        serialno: e.serialno
                                    }
                                }).then(function () {
                                    $scope.data.currItem.can_print_qty = $scope.data.currItem.can_print_qty - 1
                                })
                            })
                    })
                    //console.timeEnd("初始化加载数据时间")
                }
                $scope.getStatusValue = function (job) {
                    LODOP.On_Return = function (TaskID, Value) {
                        console.log("TaskID:" + TaskID);
                        console.log("打印成功状态:" + Value);//打印成功状态
                        $scope.data.currItem.printStatus = Value;
                    };
                    LODOP.GET_VALUE("PRINT_STATUS_OK", job);
                }

                /**
                 * 设置打印任务名，打印纸张大小 
                 */
                function setPrintTitle() {
                    var width = $scope.data.currItem.temp_width;
                    var height = $scope.data.currItem.temp_height;
                    $scope.LODOP.PRINT_INITA(0, 0, width + "mm", height + "mm", "条码生成");
                    // $scope.LODOP.SET_PRINT_PAGESIZE(1, 1300, 1100, "");
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
            return requestApi.post({
                classId: "bcs_mo",
                action: "getbarcode",
                data: {
                    mono: data.mono,
                    rownum: data.rownum,
                    num: data.num
                }
            }).then(function (val) {
                data['barcodes'] = val.barcodes;
                return data;
            })
        }
        /**
         * 返回页面html
         * @returns {string}
         */
        function getPrintDomStr(e) {
            return '<div id="div_print">\n' +
                '        <div id="div_2">\n' +
                '               <table >' +
                '                  <tr>' +
                '                      <td >产品名称：</td>' +
                '                      <td>' + e.productno + '</td>' +
                '                      <td>名义用水量：</td>' +
                '                      <td>4.0L</td>' +
                '                   </tr >' +
                '                  <tr>' +
                '                      <td>产品类别：</td>' +
                '                      <td>瓷质</td>' +
                '                      <td>水效：</td>' +
                '                      <td>1级</td>' +
                '                  </tr>' +
                '                  <tr>' +
                '                      <td rowspan="2">执行标准：</td>' +
                '                      <td rowspan="2">GB/T6950-2015</td>' +
                '                      <td>坑距：</td>' +
                '                      <td>M(305mm)</td>' +
                '                  </tr>' +
                '                  <tr>' +
                '                      <td>数量：</td>' +
                '                      <td>一套</td>' +
                '                  </tr>' +
                '                  <tr>' +
                '                      <td>包装尺寸：</td>' +
                '                      <td>780*485*805mm</td>' +
                '                      <td>工号：</td>' +
                '                      <td>GM223</td>' +
                '                  </tr>' +
                '                  <tr>' +
                '                      <td>毛重：</td>' +
                '                      <td>53KG</td>' +
                '                      <td>日期：</td>' +
                '                      <td>2019-10-25</td>' +
                '                  </tr>' +
                '        </table>' +
                '        </div>\n' +
                '    </div>';
        }

        return {
            controller: controller,
            beforePrint: beforePrint,
            getPrintDomStr: getPrintDomStr
        }
    }
);
