define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'swalApi'],
    function (module, controllerApi, base_obj_prop, requestApi, swalApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', '$modal', '$q', '$stateParams',
            //控制器函数
            function ($scope, $modal, $q, $stateParams) {
                //定义数据
                $scope.data = {};
                //$scope.data.currItem = {isvisible: 2};
                // $scope.data.currItem.menuofroles = [];
                // $scope.data.currItem.menuofroles = [];
                $scope.gridOptions_users = {
                    columnDefs: [{
                        type: '序号',
                        minWidth: 100
                    }, {
                        headerName: "用户",
                        field: "username",
                        minWidth: 150
                    }, {
                        headerName: "任职机构",
                        field: "namepath",
                        minWidth: 300
                    }],
                };

                //继承主控制器
                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /**
                 * 新增业务数据时
                 * @override
                 * @since 2019-01-16
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);

                    bizData.isvisible = 2;//默认可见
                };

                /**
                 * 设置业务数据时
                 * @override
                 * @since 2019-01-16
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions_users.hcApi.setRowData(bizData.positionuserofpositions); //用户
                };

                /**
                 * 保存业务数据时
                 * @override
                 * @since 2019-01-16
                 */
                $scope.saveBizData = function (bizData) {
                    $scope.hcSuper.saveBizData(bizData);
                    //保存 选中的模块和菜单
                    bizData.positionuserofpositions = $scope.gridOptions_users.hcApi.getRowData();
                    bizData.fdrid = $stateParams.fdrId;
                    bizData.orgid = $stateParams.orgid;
                };

                /**
                 * 表单验证
                 * 实现方式：收集验证不通过的信息
                 * @param {string[]} invalidBox 信息盒子，字符串数组，验证不通过时，往里面放入信息即可
                 * @override
                 * @since 2019-01-16
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                };

                //标签定义
                //隐藏标签页
                $scope.tabs.wf.hide = true;
                $scope.tabs.attach.hide = true;
                //修改标签页标题
                $scope.tabs.base.title = '常规';
                //增加标签页
                $scope.tabs.users = {
                    title: '包含机构用户'
                };
                $scope.tabs.other = {
                    title: '其他'
                };

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

                // 添加行按钮在不需要的时候隐藏
                $scope.footerLeftButtons.add_line.hide = function () {
                    if ($scope.tabs.base.active == true) {
                        return true;
                    } else {
                        return false;
                    }
                }
                // 删除行按钮在不需要的时候隐藏
                $scope.footerLeftButtons.del_line.hide = function () {
                    if ($scope.tabs.base.active == true) {
                        return true;
                    } else {
                        return false;
                    }
                }
                $scope.add_line = function () {
                    if ($scope.tabs.users.active == true) {
                        $scope.addLineRow1();
                    }
                }
                $scope.del_line = function () {
                    if ($scope.tabs.users.active == true) {
                        $scope.deleteLineRow1();
                    }
                }
                // 用户查询/增加行
                $scope.addLineRow1 = function (args){
                    $modal.openCommonSearch({
                        classId:'scpuser',
                        postData:{},
                        action:'search',
                        title:"用户查询",
                        dataRelationName:'users',
                        gridOptions:{
                            columnDefs:[
                                {
                                    headerName: "用户编码",
                                    field: "userid"
                                },{
                                    headerName: "用户名称",
                                    field: "username"
                                },{
                                    headerName: "机构路径",
                                    field: "namepath"
                                }
                            ]
                        }
                    })
                        .result//响应数据
                        .then(function(result){
                            var a = $scope.gridOptions_users.hcApi.getRowData();
                            var b = $scope.gridOptions_users.hcApi.getRowData().map(function (data) {
                                return data.sysuserid;
                            });
                            if (b.indexOf(result.sysuserid) < 0) {
                                a.push(result);
                            }
                            $scope.gridOptions_users.hcApi.setRowData(a);
                        });
                };

                //删除行/用户数据
                $scope.deleteLineRow1 = function () {
                    var index = $scope.gridOptions_users.hcApi.getFocusedRowIndex();
                    if (index < 0) {
                        return swalApi.info('请先选中要删除的行').then($q.reject);
                    }
                    return swalApi.confirmThenSuccess({
                        title: "确定要删除第" + (index + 1) + "行的数据吗?",
                        okFun: function () {
                            // console.log("选中行", $scope.gridOptions_users.hcApi.getFocusedData())
                            var a = $scope.gridOptions_users.hcApi.getRowData();
                            a.splice(index, 1);
                            $scope.gridOptions_users.hcApi.setRowData(a);
                            $scope.gridOptions_users.api.focusedCellController.clearFocusedCell();
                        },
                        okTitle: '删除成功'
                    });

                }

                //岗位查询
                $scope.commonSearchSetting = {
                    superposition: {//上级
                        afterOk: function (result) {
                            $scope.data.currItem.superposition = result.positionid;
                            $scope.data.currItem.syssuperpositionid = result.syspositionid;
                        }
                    },
                    lowerposition: {//下级
                        afterOk: function (result) {
                            $scope.data.currItem.lowerposition = result.positionid;
                        }
                    }
                }
            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    });