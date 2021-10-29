/**
 * 销售区域-属性页
 * 2018-12-03 sale_salearea_prop.js
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi'],
    function (module, controllerApi, base_obj_prop, swalApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', 'BasemanService', '$modal',
            //控制器函数
            function ($scope, BasemanService, $modal) {

                //$scope.data = {};
                //$scope.data.currItem = {};

                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }
                        , {
                            field: 'areacode',
                            headerName: '所辖地区编码',
                            width: 130
                        }
                        , {
                            field: 'areaname',
                            headerName: '所辖地区名称',
                            width: 130
                        }
                    ]
                };

                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                //隐藏标签页
                $scope.tabs.wf.hide = true;
                $scope.tabs.attach.hide = true;
                //修改标签页标题
                $scope.tabs.base.title = '基本信息';

                $scope.tabs.other = {
                    title: "其他"
                }

                /**
                 * 新增时数据、网格默认设置
                 */
                $scope.newBizData = function (bizData) {
                    //$scope.hcSuper.newBizData(bizData);
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);
                    bizData.sale_salearea_lineofsale_saleareas = [];
                    $scope.gridOptions.hcApi.setRowData(bizData.sale_salearea_lineofsale_saleareas);
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.sale_salearea_lineofsale_saleareas);
                };

                //明细验证(校验明细数据不能重复)
                $scope.validCheck = function (invalidBox) {
                    $scope.gridOptions.api.stopEditing();
                    $scope.hcSuper.validCheck(invalidBox);

                    var lineData = getCurrItem().sale_salearea_lineofsale_saleareas;
                    var validArr = [];//装载areacode
                    lineData.forEach(function (line, index) {
                        validArr[index] = line.areacode;
                        //console.log(index+':'+validArr[index]);
                    });

                    var len = validArr.length;
                    var tip = false;
                    for (var pointer = 0; pointer < len; pointer++) {
                        var curCompare = validArr[pointer];
                        for (var innerPointer = pointer + 1; innerPointer < len; innerPointer++) {
                            var cur = validArr[innerPointer];
                            //console.log('code + '+':'+ cur + ' ;vs; curCompare:' +curCompare);
                            if (curCompare == cur) {
                                tip = true;
                                invalidBox.push('第' + (pointer + 1) + '行数据与' + '第' + (innerPointer + 1) + '行数据重复');
                            }
                        }
                    }
                    if (tip)
                        invalidBox.push('明细数据不允许重复，请删除重复数据');
                };

                function getCurrItem() {
                    return $scope.data.currItem;
                }


                //底部左边按钮
                $scope.footerLeftButtons.add_line = {
                    title: '增加行',
                    click: function () {
                        $scope.add_line && $scope.add_line();
                    }
                };
                $scope.footerLeftButtons.del_line = {
                    title: '删除行',
                    click: function () {
                        $scope.del_line && $scope.del_line();
                    }
                };

                /**
                 * 增加行
                 */
                $scope.add_line = function () {
                    $modal.openCommonSearch({
                            classId: 'scparea',
                            postData: {},
                            title: "行政区域",
                            gridOptions: {
                                columnDefs: [
                                    {
                                        field: "areacode",
                                        headerName: "区域编码"
                                    }, {
                                        field: "areaname",
                                        headerName: "区域名称"
                                    }
                                ]
                            },
                            //ignorecase: true
                            //,searchlist: ["sale_area_code", "sale_area_name"]
                        })
                        .result
                        .then(function (result) {
                            //$scope.gridOptions.api.stopEditing();

                            console.log(result,'result');

                            var line = {
                                areacode: result.areacode,
                                areaname: result.areaname,
                            };
                            $scope.data.currItem.sale_salearea_lineofsale_saleareas.push(line);
                            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.sale_salearea_lineofsale_saleareas);
                        });
                };

                /**
                 * 删除行
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.sale_salearea_lineofsale_saleareas.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.sale_salearea_lineofsale_saleareas);
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
    }
);






