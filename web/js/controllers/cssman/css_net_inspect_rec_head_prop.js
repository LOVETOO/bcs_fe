/*
 * @Descripttion: 网点巡检记录属性页
 * @version: 
 * @Author: TSL
 * @Date: 2019-08-06 09:22:05
 * @LastEditors: TSL
 * @LastEditTime: 2019-08-06 17:34:59
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', '$modal'],
    function (module, controllerApi, base_obj_prop, $modal) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {


                /*----------------------------------定义数据-------------------------------------------*/

                $scope.data = {
                    currItem: {}
                }

                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });


                /*----------------------------------定义模态框标签标题--------------------------------*/

                $scope.tabs.base = {
                    title: '基本信息',
                    active: true
                };

                /*--------------------------------------定义按钮--------------------------------------*/

                /*底部左边按钮*/

                /**
                 * @Descripttion: 添加行点击事件
                 * @name: TSL
                 * @test: test font
                 * @msg: 
                 * @param {type} 
                 * @return: 
                 */
                $scope.footerLeftButtons.addRow.click = function () {
                    if ($scope.tabs.base.active) {//明细
                        $scope.add_inspect && $scope.add_inspect();
                    }
                };

                /**
                 * @Descripttion: 隐藏添加行
                 * @name: TSL
                 * @test: test font
                 * @msg: 
                 * @param {type} 
                 * @return: 
                 */
                $scope.footerLeftButtons.addRow.hide = function () {
                    if (!$scope.tabs.base.active) {
                        return true;
                    }
                }

                /**
                 * @Descripttion: 删除行点击事件
                 * @name: TSL
                 * @test: test font
                 * @msg: 
                 * @param {type} 
                 * @return: 
                 */
                $scope.footerLeftButtons.deleteRow.click = function () {
                    if ($scope.tabs.base.active) {//明细
                        $scope.del_inspect && $scope.del_inspect();
                    }
                };

                /**
                 * @Descripttion: 隐藏删除行
                 * @name: TSL
                 * @test: test font
                 * @msg: 
                 * @param {type} 
                 * @return: 
                 */
                $scope.footerLeftButtons.deleteRow.hide = function () {
                    if (!$scope.tabs.base.active) {
                        return true;
                    }
                }

                /*----------------------------------表格定义开始-----------------------------------------*/


                // 收货地址明细
                $scope.gridOptions_inspect = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'fix_org_code',
                        headerName: '网点编码',
                        editable: true,
                        width: 150,
                        onCellDoubleClicked: function (args) {
                            $scope.selectOrg(args);
                        }
                    }, {
                        field: 'fix_org_name',
                        headerName: '网点名称',
                        width: 150
                    }, {
                        field: 'inspert_man',
                        headerName: '巡检人',
                        editable: true,
                        width: 150
                    }, {
                        field: 'inspert_time',
                        headerName: '巡检日期',
                        type: '日期',
                        editable: true,
                        width: 150
                    }, {
                        field: 'inspert_record',
                        headerName: '巡检结果',
                        editable: true,
                        width: 150
                    }, {
                        field: 'note',
                        headerName: '备注',
                        editable: true,
                        width: 150
                    }]
                };



                /*----------------------------------表格定义结束-------------------------------------------*/



                /*------------------------------------数据处理开始------------------------------------------*/

                /**
                 * @Descripttion: 新增时数据初始化
                 * @name: TSL
                 * @test: test font
                 * @msg: 
                 * @param {type} 
                 * @return: 
                 */
                $scope.newBizData = function (bizData) {
                    $scope.now = new Date();
                    $scope.hcSuper.newBizData(bizData);
                    bizData.stat = 1; // 默认为制单状态
                    bizData.input_name = strUserName; // 默认为当前登陆用户
                    bizData.input_time = $scope.now.toLocaleDateString(); // 获取当前时间
                    bizData.cyear = $scope.now.getFullYear(); // 获取今年年份
                    bizData.cmonth = $scope.now.getMonth() + 1; // 获取当前月份 
                    bizData.dept_id = userbean.loginuserifnos[0].org_id; // 部门id
                    bizData.dept_code = userbean.loginuserifnos[0].org_code; // 部门编码
                    bizData.dept_name = userbean.loginuserifnos[0].org_name; // 部门名称
                    $scope.data.currItem.css_net_inspect_rec_lines = []; // 明细
                    var line = {};
                    $scope.data.currItem.css_net_inspect_rec_lines.push(line);
                    $scope.gridOptions_inspect.hcApi.setRowData(bizData.css_net_inspect_rec_lines);
                };

                /**
                  * @Descripttion: 查看详情时设置数据
                  * @name: TSL
                  * @test: test font
                  * @msg: 
                  * @param {type} 
                  * @return: 
                  */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions_inspect.hcApi.setRowData(bizData.css_net_inspect_rec_lines); // 明细
                }

                /**
                 * @Descripttion: 保存前数据处理
                 * @name: TSL
                 * @test: test font
                 * @msg: 
                 * @param {type} 
                 * @return: 
                 */
                $scope.saveBizData = function (bizData) {
                    $scope.hcSuper.saveBizData(bizData);
                };

                /*------------------------------------数据处理结束------------------------------------------*/

                /*------------------------------------通用查询开始------------------------------------------*/

                /**
                 * @Descripttion: 部门通用查询
                 * @name: TSL
                 * @test: test font
                 * @msg: 
                 * @param {type} 
                 * @return: 
                 */
                $scope.commonSearchSettingOfDept = {
                    afterOk: function (result) {
                        $scope.data.currItem.dept_id = result.dept_id;
                        $scope.data.currItem.dept_code = result.dept_code;
                        $scope.data.currItem.dept_name = result.dept_name;
                    }
                };


                /*------------------------------------通用查询结束------------------------------------------*/

                /*-------------------------------------开始定义函数-----------------------------------------*/

                /**
                 * @Descripttion: 添加明细行
                 * @name: TSL
                 * @test: test font
                 * @msg: 
                 * @param {type} 
                 * @return: 
                 */
                $scope.add_inspect = function () {
                    $scope.gridOptions_inspect.api.stopEditing();
                    var line = {};
                    $scope.data.currItem.css_net_inspect_rec_lines.push(line);
                    $scope.gridOptions_inspect.hcApi.setRowData($scope.data.currItem.css_net_inspect_rec_lines);
                }

                /**
                 * @Descripttion: 删除明细行
                 * @name: TSL
                 * @test: test font
                 * @msg: 
                 * @param {type} 
                 * @return: 
                 */
                $scope.del_inspect = function () {
                    var idx = $scope.gridOptions_inspect.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选择要删除的行');
                    } else {
                        $scope.data.currItem.css_net_inspect_rec_lines.splice(idx, 1);
                        $scope.gridOptions_inspect.hcApi.setRowData($scope.data.currItem.css_net_inspect_rec_lines);
                    }
                }


                /**
                 * @Descripttion: 网点通用查询函数
                 * @name: TSL
                 * @test: test font
                 * @msg: 
                 * @param {type} 
                 * @return: 
                 */
                $scope.selectOrg = function (args) {
                    $scope.gridOptions_inspect.api.stopEditing();
                    $modal.openCommonSearch({
                        classId: 'css_fix_org',
                        postData: {

                        }
                    })
                        .result// 响应数据
                        .then(function (response) {
                            args.data.fix_org_id = response.fix_org_id;
                            args.data.fix_org_code = response.fix_org_code;
                            args.data.fix_org_name = response.fix_org_name;
                            $scope.gridOptions_inspect.api.refreshView();
                        });
                }

                /*-------------------------------------定义函数结束-----------------------------------------*/

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
