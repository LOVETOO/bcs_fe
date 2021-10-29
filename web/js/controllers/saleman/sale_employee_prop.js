/**
 * 业务员资料属性页
 * 2018-12-03 sale_employee_prop.js
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi'],
    function (module, controllerApi, base_obj_prop, swalApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {
                //网格定义
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'sale_area_code',
                            headerName: '负责区域编码',
                            suppressSizeToFit: false,
                            minWidth: 239
                        }, {
                            field: 'sale_area_name',
                            headerName: '负责区域名称',
                            suppressSizeToFit: false,
                            minWidth: 330
                        }, {
                            field: 'remark',
                            headerName: '备注',
                            suppressSizeToFit: false,
                            minWidth: 370
                        }
                    ]
                };

                //继承基础控制器
                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /*-------------------数据定义、初始化、校验 开始----------------*/

                function getCurrItem() {
                    return $scope.data.currItem;
                }

                /**
                 * 新增时数据、网格默认设置
                 */
                $scope.newBizData = function (bizData) {
                    //$scope.hcSuper.newBizData(bizData);
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);
                    bizData.sale_employee_saleareaofsale_employees = [];
                    bizData.isuseable = 2;
                    $scope.gridOptions.hcApi.setRowData(bizData.sale_employee_saleareaofsale_employees);
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);

                    $scope.gridOptions.hcApi.setRowData(bizData.sale_employee_saleareaofsale_employees);
                };

                //明细验证(校验明细数据不能重复)
                $scope.validCheck = function (invalidBox) {
                    $scope.gridOptions.api.stopEditing();
                    $scope.hcSuper.validCheck(invalidBox);

                    var lineData = getCurrItem().sale_employee_saleareaofsale_employees;
                    var validArr = [];//装载sale_area_code
                    lineData.forEach(function (line, index) {
                        validArr[index] = line.sale_area_code;
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
                                invalidBox.push('第【' + (pointer + 1) + '行】数据与' + '【第' + (innerPointer + 1) + '行】数据重复');
                            }
                        }
                    }
                    if (tip)
                        invalidBox.push('明细数据不允许重复，请删除重复数据');
                };

                /*-------------------数据定义、初始化、校验 结束----------------*/

                /*--------------------- 通用查询 开始---------------------------*/

                //查询业务员
                $scope.commonSearchSettingOfErpemployee = {
                    afterOk: function (item) {
                        getCurrItem().employee_id = item.employee_id;
                        getCurrItem().employee_code = item.employee_code;
                        getCurrItem().employee_name = item.employee_name;
                    }
                };

                /*--------------------- 通用查询 结束---------------------------*/


                /*-----------------按钮定义及相关函数 开始----------------------*/

                //隐藏标签页
                $scope.tabs.wf.hide = true;
                $scope.tabs.attach.hide = true;
                //修改标签页标题
                $scope.tabs.base.title = '基本信息';

                $scope.tabs.other = {
                    title: "其他"
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

                //增加行
                $scope.add_line = function () {
                    $modal.openCommonSearch({
                            classId: 'sale_salearea',
                            postData: {},
                            title: "销售区域",
                            gridOptions: {
                                columnDefs: [
                                    {
                                        field: "sale_area_code",
                                        headerName: "区域编码"
                                    },
                                    {
                                        field: "sale_area_name",
                                        headerName: "行政区域名称"
                                    },
                                    {
                                        field: "remark",
                                        headerName: "备注"
                                    }
                                ]
                            },
                            ignorecase: true,
                            searchlist: ["sale_area_code", "sale_area_name"]
                        })
                        .result
                        .then(function (result) {
                            console.log(result);
                            $scope.gridOptions.api.stopEditing();
                            var line = {
                                sale_area_code: result.sale_area_code,
                                sale_area_name: result.sale_area_name,
                                sale_area_id: result.sale_area_id,
                                remark: result.remark,
                            };
                            getCurrItem().sale_employee_saleareaofsale_employees.push(line);
                            $scope.gridOptions.hcApi.setRowData(getCurrItem().sale_employee_saleareaofsale_employees);
                        });
                };

                //删除行
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        getCurrItem().sale_employee_saleareaofsale_employees.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData(getCurrItem().sale_employee_saleareaofsale_employees);
                    }
                };

                /*-----------------按钮定义及相关函数 结束----------------------*/

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






