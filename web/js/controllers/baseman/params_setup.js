/**
 * 模块参数设置 params_setup
 * Created by zhl on 2019/1/16.
 */

define(
    //['module', 'controllerApi', 'base_edit_list',  'swalApi', 'directive/hcDiyPage'],
    //function (module, controllerApi, base_edit_list, swalApi) {
    ['module', 'controllerApi', 'base_edit_list', 'openBizObj', 'promiseApi', 'requestApi', 'swalApi', 'constant', 'directive/hcEditList'],
    function (module, controllerApi, base_edit_list, openBizObj, promiseApi, requestApi, swalApi, constant) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$q',
            //控制器函数
            function ($scope, $q) {
                //初始化类名
                var className = 'inv_param';
                //默认焦点放在第一行
                var currentCellIndex = 0;
                //“财务总账模块”零时数据,用于【不保存】时恢复绑定数据到视图
                $scope.gl_temp = {};

                //数据定义
                $scope.data = {};
                $scope.data.currItem = {};

                //网格定义
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'param_code',
                        headerName: '参数编码',
                        width: 200
                    }, {
                        field: 'param_name',
                        headerName: '参数名称',
                        width: 494
                    }, {
                        field: 'param_value',
                        headerName: '参数值',
                        type: 'number',
                        width: 300
                    }]
                };

                //继承基础控制器
                controllerApi.extend({
                    controller: base_edit_list.controller,
                    scope: $scope
                });

                //初始化
                $scope.doInit = function () {
                    $scope.hcSuper.doInit().then(
                        function () {
                            $scope.search && $scope.search();
                            //将焦点置于第一行
                            $scope.gridOptions.hcApi.setFocusedCell(0, 'param_code');
                        }
                    );
                }

                /*--------------------- 事件 ----------------------------*/

                //单元格点击事件
                $scope.gridOptions.onCellClicked = function (node) {
                    //设置当前行索引为当前焦点单元格行索引
                    currentCellIndex = node.rowIndex;
                    setCurrNode($scope.gridOptions.hcApi.getFocusedNode());
                    $scope.setBizData(angular.copy(node.data));
                    $scope.$apply();//强制更新页面上绑定的数据
                };

                //标签点击事件
                $scope.tabClicked = function (tab) {
                    className = tab;
                    $scope.search && $scope.search();
                    currentCellIndex = 0;
                }

                /*--------------------- 数据模型、网格相关函数定义 ----------------------------*/

                //获取数据模型对象
                function getCurrItem() {
                    return $scope.data.currItem;
                }

                //设置数据
                $scope.setBizData = function (bizData) {
                    $scope.data.currItem = bizData;
                };

                /**
                 * 切换当前行节点到焦点行
                 */
                function setFocusedNodeAsCurrent() {
                    setCurrNode($scope.gridOptions.hcApi.getFocusedNode());
                }

                /**
                 * 设置当前行节点
                 * @param {Node} node
                 */
                function setCurrNode(node) {
                    $scope.data.currRowNode = node;

                    if (node)
                        $scope.setBizData(angular.copy(node.data));
                    else
                        $scope.data.currItem = null;

                    $scope.data.isInsert = false;

                    $scope.form.$setPristine();
                }

                /*--------------------- 按钮定义 ----------------------------*/

                /*左侧编辑按钮*/
                $scope.editButtons = constant.getConstClone({
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
                            if (className == 'gl_account_param')
                                $scope.gridOptions.hcApi.getFocusedNode().data = angular.copy($scope.gl_temp);

                            setFocusedNodeAsCurrent();
                        },
                        hide: function () {
                            return $scope.form.$pristine;
                        }
                    }
                });

                /*右侧工具按钮*/
                $scope.toolButtons = {
                    search: {
                        title: '筛选',
                        icon: 'fa fa-filter',
                        click: function () {
                            $scope.search && $scope.search('filter');
                        }
                    }
                };

                /**
                 * 查询
                 * @param filter 是否筛选查询
                 * @returns {*}
                 */
                $scope.search = function (filter) {
                    $scope.gridOptions.hcClassId = className;

                    if (filter) {
                        if (className == 'gl_account_param')
                            return;
                        return $scope.gridOptions.hcApi.searchByGrid().then(function (result) {
                            //设置焦点单元格
                            $scope.gridOptions.hcApi.setFocusedCell(currentCellIndex, 'param_code');
                            //设置绑定数据为当前焦点行数据
                            //setFocusedNodeAsCurrent();
                        });
                    } else {
                        return $scope.gridOptions.hcApi.search().then(function (result) {
                            if (className == 'gl_account_param') {
                                $scope.gridOptions.hcApi.getFocusedNode();

                                var data = result[className + "s"][0];
                                $scope.setBizData(angular.copy(data));
                                getCurrItem().gl_created_by = data.created_by;
                                getCurrItem().gl_creation_date = data.creation_date;
                                getCurrItem().gl_last_updated_by = data.last_updated_by;
                                getCurrItem().gl_last_update_date = data.last_update_date;

                                //必须进行拷贝，不然会指向绑定的数据模型
                                $scope.gl_temp = angular.copy(data);

                                return;
                            }

                            var data = result[className + "s"][0];
                            //设置焦点
                            $scope.gridOptions.hcApi.setFocusedCell(currentCellIndex, 'param_code');
                            //设置绑定数据
                            //setFocusedNodeAsCurrent();
                        });

                    }

                };

                //保存
                $scope.save = function () {
                    requestApi.post(className, "update", $scope.data.currItem)
                        .then(function (data) {
                            return swalApi.success('保存成功!').then($scope.refresh);
                        });
                }

                //刷新
                $scope.refresh = function () {
                    $scope.search();
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

