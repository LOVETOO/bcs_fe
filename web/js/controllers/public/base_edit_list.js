/**
 * 编辑+列表页基础控制器
 * @since 2018-12-10
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'angular', 'swalApi', '$q', 'requestApi', 'promiseApi', 'numberApi', 'constant', 'openBizObj', 'specialProperty', 'directive/hcEditList'], defineFn);
})(function (module, controllerApi, angular, swalApi, $q, requestApi, promiseApi, numberApi, constant, openBizObj, specialProperty) {
    'use strict';

    BaseEditList.$inject = ['$scope'];
    function BaseEditList(   $scope) {

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

        /**
         * 切换当前行节点到焦点行，已经是焦点行则不做任何事
         */
        function toggleCurrNode() {
            var node = $scope.gridOptions.hcApi.getFocusedNode();

            if (node !== $scope.data.currRowNode)
                setCurrNode(node);
        }

        /**
         * 切换当前行节点到焦点行
         */
        function setFocusedNodeAsCurrent() {
            setCurrNode($scope.gridOptions.hcApi.getFocusedNode());
        }

        /**
         * 定义数据
         */
        function defineData() {
            /* ============================== 业务数据 ============================== */
            $scope.data = $scope.data || {};
            $scope.data.currItem = null;

            (function () {
                var objConf = $scope.$state.objConf;
                if (objConf) {
                    $scope.data.objConf = objConf;

                    var index = $scope.$state.name.lastIndexOf('_list');
                    if (index >= 0)
                        $scope.data.propStateName = $scope.$state.name.substring(0, index) + '_prop';

                    $scope.data.idField = (objConf.pkfield || '').toLowerCase();
                    $scope.data.codeField = (objConf.codefield || '').toLowerCase();
                    $scope.data.namefield = (objConf.namefield || '').toLowerCase();

                    var lastIndexOfDot = objConf.javaname.lastIndexOf('.');

                    if (lastIndexOfDot >= 0)
                        $scope.data.classId = objConf.javaname.substr(lastIndexOfDot + 1);
                    else
                        $scope.data.classId = objConf.javaname;

                    $scope.data.classId = $scope.data.classId.toLowerCase();
                }
            })();

            /* ============================== 工具栏按钮 ============================== */
            /**
             * 工具栏按钮分组
             */
            constant.defineConstProp($scope, 'toolButtonGroups', constant.getConstClone({
                more: {
                    title: '更多',
                    icon: 'iconfont hc-gengduo',
                    type: 'dropdown'
                },
                normal: {},
                save: {}
            }));

            /**
             * 工具栏按钮定义
             * id: 按钮ID，唯一，不可变 - string {
			 *     groupId: 组ID，选填 - string
			 *     title: 按钮显示名称 - string
			 *     icon: 图标，写类名，用于<i></i>标签 - string
			 *     click: 点击事件 - function({
			 *         id: 按钮ID - string
			 *         def: 按钮定义 - string
			 *         event: 事件对象 - $event
			 *     })
			 *     hide: 隐藏，布尔值或函数，设为函数可动态显隐 - boolean or function({
			 *         id: 按钮ID - string
			 *         def: 按钮定义 - string
			 *     })
			 * }
             * @since 2018-12-10
             */
            $scope.toolButtons = constant.getConstClone({
                add: {
                    groupId: 'normal',
                    title: '新增',
                    icon: 'iconfont hc-add',
                    click: function () {
                        $scope.add && $scope.add();
                    }
                },
                copy: {
                    title: '复制',
                    icon: 'iconfont hc-fuzhi',
                    click: function () {
                        //
                    },
                    hide: true
                },
                delete: {
                    groupId: 'normal',
                    title: '删除',
                    icon: 'iconfont hc-delete',
                    click: function () {
                        $scope.delete && $scope.delete();
                    }
                },
                /* refresh: {
                 title: '刷新',
                 icon: 'fa fa-refresh',
                 click: function () {
                 $scope.refresh && $scope.refresh();
                 },
                 hide: function () {
                 return $scope.form.$dirty;
                 }
                 }, */
                search: {
                    groupId: 'normal',
                    title: '筛选',
                    icon: 'iconfont hc-shaixuan',
                    click: function () {
                        $scope.search && $scope.search();
                    }
                },
                export: {
                    title: '导出',
                    icon: 'iconfont hc-daochu',
                    click: function () {
                        $scope.gridOptions.hcApi.exportToExcel();
                    }
                },
                import: {
                    title: '导入',
                    icon: 'iconfont hc-daoru',
                    click: function () {
                        openBizObj({
                            importSetting: {
                                classId: $scope.data.classId
                            }
                        }).result.finally($scope.gridOptions.hcApi.search);
                    }
                },
                downloadImportFormat: {
                    title: '下载导入模板',
                    icon: 'iconfont hc-icondownload'
                },
                doNotSave: {
                    groupId: 'save',
                    title: '不保存',
                    icon: 'iconfont hc-chehui',
                    click: function () {
                        setFocusedNodeAsCurrent();
                    },
                    hide: function () {
                        return $scope.form.$pristine;
                    }
                },
                save: {
                    groupId: 'save',
                    title: '保存',
                    icon: 'iconfont hc-baocun',
                    click: function () {
                        $scope.save && $scope.save();
                    },
                    hide: function () {
                        return $scope.form.$pristine;
                    }
                }
            });

            specialProperty.defineSameHideOnButtons(
                $scope.toolButtons,
                function hideCondition() {
                    return $scope.form.$dirty;
                },
                [
                    'add',
                    'delete',
					'search',
					'import'
                ]
			);

			$scope.toolButtons.import.hide = true;
			$scope.toolButtons.downloadImportFormat.hide = true;

            $scope.editButtons = constant.getConstClone({
                save: {
                    title: '保存',
                    icon: 'iconfont hc-baocun',
                    click: function () {
                        $scope.save && $scope.save();
                    },
                    hide: function () {
                        return $scope.form.$pristine;
                    }
                },
                doNotSave: {
                    title: '不保存',
                    icon: 'iconfont hc-chehui',
                    click: function () {
                        setFocusedNodeAsCurrent();
                    },
                    hide: function () {
                        return $scope.form.$pristine;
                    }
                }
            });

            /* ============================== 表格 ============================== */
            $scope.gridOptions = $scope.gridOptions || {};
            $scope.gridOptions.columnDefs = $scope.gridOptions.columnDefs || [];

            //列表页默认激活排序功能
            if ($scope.gridOptions.enableSorting === undefined) {
                $scope.gridOptions.enableSorting = true;
            }

            if (!$scope.gridOptions.columnDefs.length
                || $scope.gridOptions.columnDefs[0].type !== '序号')
                $scope.gridOptions.columnDefs.unshift({
                    type: '序号'
                });

            if ($scope.data.objConf)
                $scope.gridOptions.hcObjConf = $scope.data.objConf;

            $scope.gridOptions.hcEvents = $scope.gridOptions.hcEvents || {};
            $scope.gridOptions.hcEvents.cellClicked = function (params) {
                if ($scope.form.$pristine)
                    toggleCurrNode();
            };

            $scope.gridOptions.hcEvents.rowDataChanged = function () {
                $q.when().then(function () {
                    if ($scope.gridOptions.api.getModel().getRowCount()) {
                        $scope.gridOptions.hcApi.setFocusedCell(0);
                        setFocusedNodeAsCurrent();
                    }
                    else
                        setCurrNode(null);
                });
            };

            if ($scope.gridOptions.hcExcelFileName) {
            }
            else if ($scope.$state.params.title)
                $scope.gridOptions.hcExcelFileName = $scope.$state.params.title;
        }

        /**
         * 重置编辑面板
         */
        /* function resetEditPanel() {
         $scope.data.currRowNode = null;
         $scope.data.currItem = null;
         $scope.data.isInsert = false;
         $scope.form.$setPristine();
         } */

        /**
         * 定义函数，所有函数请都定义在此处
         * @param {object} target 函数定义在哪个对象上
         */
        function defineFunction(target) {

            /**
             * 查询，由查询按钮使用
             * @return {Promise}
             * @since 2018-12-10
             */
            target.search = function () {
                //用表格产生条件，并查询
                return $scope.gridOptions.hcApi.searchByGrid();
            };

            /**
             * 刷新，由刷新按钮使用
             * @return {Promise}
             * @since 2018-12-10
             */
            /* target.refresh = function () {
             //刷新即是用上此的查询条件再查询一次
             return $scope.gridOptions.hcApi.search();
             }; */

            /**
             * 查看详情，由查看详情按钮使用
             * @return {Promise}
             * @since 2018-12-10
             */
            /* target.openProp = function () {
             if (!$scope.data.currRowNode)
             return $q.reject('没有选中行');

             var data = $scope.data.currRowNode.data;

             data = angular.copy(data);

             $scope.setBizData(data);

             $scope.data.isInsert = false;

             $scope.form.$setPristine();
             }; */

            /**
             * 删除，由删除按钮使用
             * @return {Promise}
             * @since 2018-12-10
             */
            target.delete = function () {
                if (!$scope.data.idField)
                    return swalApi.error('无法' + $scope.toolButtons.delete.title + '，请检查对象配置是否定义了主键').then($q.reject);

                var node = $scope.gridOptions.hcApi.getFocusedNode();

                if (!node)
                    return swalApi.info('请先选中要删除的行').then($q.reject);

                var reason = $scope.undeletableReason({
                    node: node,
                    data: node.data
                });

                if (reason)
                    return swalApi.error(reason).then($q.reject);

                var title = '确定要删除该记录吗？';
                (function () {
                    var field = $scope.data.codeField || $scope.data.nameField;
                    if (!field) return;

                    var headerName = $scope.$eval('gridOptions.columnApi.getColumn(field).colDef.headerName', {
                        field: field
                    });

                    if (!headerName) return;

                    var value = node.data[$scope.data.codeField];
                    if (!value) return;

                    title = '确定要删除"' + headerName + '"为"' + value + '"的记录吗？';
                })();

                return swalApi.confirmThenSuccess({
                    title: title,
                    okFun: function () {
                        var postParams = {
                            classId: $scope.gridOptions.hcClassId,
                            action: 'delete',
                            data: {}
                        };

						var id = postParams.data[$scope.data.idField] = node.data[$scope.data.idField];

                        return $q
                            .when(postParams)
                            .then($scope.doBeforeDelete)
                            .then(function () {
                                return postParams;
                            })
                            .then(requestApi.post)
                            .then(function () {
                                var rowIndex = node.rowIndex;

                                $scope.gridOptions.api.updateRowData({
                                    remove: [node.data]
                                });

                                if (!$scope.gridOptions.hcApi.getFocusedNode()) {
                                    $scope.gridOptions.hcApi.setFocusedCell($scope.gridOptions.api.getModel().getRowCount() - 1, 'seq');
                                }

								setFocusedNodeAsCurrent();
								
								requestApi.post({
									classId: 'scp_action_log',
									action: 'insert',
									data: {
										action: 'delete',
										objtype: $scope.data.objConf.objtypeid,
										objid: id
									},
									noShowWaiting: true,
									noShowError: true
								});
                            });
                    },
                    okTitle: '删除成功'
                });
            };

            /**
             * 不可删除的原因
             * @param params = {
			 *     node: 行节点
			 *     data: 节点数据
			 * }
             * @return {string}
             */
            target.undeletableReason = function (params) {
                var reason;

                if (params.data.stat == 5)
                    reason = '该行记录已审核，不可删除';
                else if (params.data.stat == 3)
                    reason = '该行记录正在走工作流，不可删除';
                else
                    reason = '';

                return reason;
            };

            /**
             * 返回ID字段
             * @return {string} ID字段
             * @since 2018-12-10
             */
            target.getIdField = function () {
                return $scope.data.idField;
            };

            /**
             * 返回ID
             * @return {number} ID
             * @since 2018-12-10
             */
            target.getId = function () {
                return numberApi.toNumber($scope.data.currItem[$scope.getIdField()]);
            };

            /**
             * 刷新
             * @since 2018-12-10
             */
            target.refresh = function () {
                return $scope.setId($scope.getId());
            }

            /**
             * 设置ID
             * @param {number} id
             * @since 2018-12-10
             */
            target.setId = function (id) {
                var postParams = {
                    classId: $scope.data.classId,
                    action: 'select',
                    data: {}
                };

                postParams.data[$scope.data.idField] = id;

                var response; //响应数据

                /**
                 * 返回请求的响应数据
                 */
                function returnResponse() {
                    return response;
                }

                return promiseApi
                    .start($scope.doBeforeSelect, postParams.data)
                    .then(function () {
                        return postParams;
                    })
                    .then(requestApi.post)
                    .then(function () {
                        response = arguments[0];
                    })
                    .then(returnResponse)
                    .then($scope.doAfterSelect)
                    .then(returnResponse)
                    .then($scope.setBizData)
                    .then(returnResponse)
                    .then($scope.setRight)
                    .then(returnResponse)
                    ;
            };

            /**
             * 发select请求之前的处理
             * @param postData 请求的数据
             * @since 2018-12-10
             */
            target.doBeforeSelect = function (postData) {

            };

            /**
             * 发select请求之后的处理
             * @param responseData 响应的数据
             * @since 2018-12-10
             */
            target.doAfterSelect = function (responseData) {

            };

            /**
             * 设置业务数据
             * @param bizData 业务数据
             * @since 2018-12-10
             */
            target.setBizData = function (bizData) {
                $scope.data.currItem = bizData;
            };

            /**
             * 设置业务数据
             * @param bizData 业务数据
             * @since 2018-12-10
             */
            /*

             业务控制器重写【设置业务数据】方法的示例

             $scope.setBizData = function (bizData) {
             $scope.hcSuper.setBizData(bizData); //继承基础控制器的方法，类似Java的super
             //设置头部数据的步骤已在基础控制器实现

             //设置明细数据到表格
             $scope.明细表格选项1.hcApi.setRowData(bizData.明细数组1);
             $scope.明细表格选项2.hcApi.setRowData(bizData.明细数组2);
             };

             */

            /**
             * 设置权限
             * @param bizData 业务数据
             * @since 2018-12-10
             */
            target.setRight = function (bizData) {

            };

            /**
             * 新增
             * @since 2018-12-10
             */
            target.add = function () {
                if ($scope.data.isInsert) return $q.reject();

                return $q.when().then(function () {
                    $scope.data.isInsert = true;
                    $scope.data.lastRowNode = $scope.data.currRowNode;
                    $scope.data.currRowNode = null;
                    $scope.newBizData($scope.data.currItem = {});
                    $scope.form.$setDirty();
                });
            };

            /**
             * 新增时对业务对象的处理
             * @param bizData 新增时的数据
             * @since 2018-12-10
             */
            target.newBizData = function (bizData) {
                bizData.stat = 1; //单据状态：制单
                bizData.wfid = 0; //流程ID
                bizData.wfflag = 0; //流程标识
                bizData.creator = strUserId; //创建人
            };

            /**
             * 保存
             * @since 2018-12-10
             */
            target.save = function () {
                var postParams, response, invalidInfoBox;

                /**
                 * 接收请求的响应数据
                 * @param responseToAccept
                 */
                function acceptResponse(responseToAccept) {
                    response = responseToAccept;
                    return response;
                }

                /**
                 * 返回请求的响应数据
                 */
                function returnResponse() {
                    return response;
                }

                return $q.when()
                    .then(function () {
                        //停止所有表格的编辑
                        $scope.stopEditingAllGrid && $scope.stopEditingAllGrid();
                    })
                    .then(function () {
                        //装 验证不通过的信息 的盒子
                        return invalidInfoBox = [];
                    })
                    .then($scope.validCheck)
                    .then(function () {
                        //若盒子非空，验证不通过，弹框
                        if (invalidInfoBox.length)
                            return swalApi.error(invalidInfoBox)
                                .then(function () {
                                    return $q.reject(invalidInfoBox);
                                });
                    })
                    .then(function () {
                        postParams = {
                            classId: $scope.data.classId,
                            data: {}
                        };

                        postParams.data[$scope.data.idField] = $scope.getId();

                        if ($scope.data.isInsert)
                            postParams.action = 'insert';
                        else
                            postParams.action = 'update';

                        return postParams.data;
                    })
                    .then($scope.saveBizData)
                    .then(function () {
                        return postParams;
                    })
                    .then($scope.doBeforeSave)
                    .then(function () {
                        return postParams;
                    })
                    .then(requestApi.post)
                    .then(acceptResponse)
                    .then(function () {
                        $scope.data.isInsert = false;
                        $scope.form.$setPristine();
                    })
                    .then(returnResponse)
                    .then($scope.doAfterSave)
                    .then(function () {
                        $scope.setBizData(response);

                        var nodeData = angular.copy(response);

                        if ($scope.data.currRowNode) {
                            $scope.data.currRowNode.setData(nodeData);
                        }
                        else {
                            $scope.gridOptions.api.updateRowData({
                                add: [nodeData],
                                addIndex: 0
                            });

                            $scope.data.currRowNode = $scope.gridOptions.hcApi.getNodeOfRowIndex(0);
                        }

                        $scope.gridOptions.hcApi.setFocusedCell($scope.data.currRowNode.rowIndex, 'seq');
                    })
                    .then(function () {
						requestApi.post({
							classId: 'scp_action_log',
							action: 'insert',
							data: {
								action: postParams.action,
								objtype: $scope.data.objConf.objtypeid,
								objid: $scope.getId()
							},
							noShowWaiting: true,
							noShowError: true
						});

                        return swalApi.success('保存成功');
                    })
                    .then(returnResponse)
                    ;
            };

            /**
             * 表单验证
             * 实现方式：收集验证不通过的信息
             * @param {string[]} invalidBox 信息盒子，字符串数组，验证不通过时，往里面放入信息即可
             */
            target.validCheck = function (invalidBox) {
                //获取【必填验证不通过】的【模型控制器】数组
                var requiredInvalidModelControllers = $scope.form.$error.required;
                if (requiredInvalidModelControllers && requiredInvalidModelControllers.length) {
                    invalidBox.push('以下内容为必填项，请补充完整');
                    requiredInvalidModelControllers.forEach(function (modelController) {
                        //获取【模型控制器】的【输入组件控制器】的【文本标签】
                        invalidBox.push(modelController.getInputController().getLabel());
                    });
                }
            };

            /**
             * 保存视图数据到业务对象
             * @param saveData 保存请求的数据
             * @since 2018-12-10
             */
            target.saveBizData = function (saveData) {
                angular.extend(saveData, angular.copy($scope.data.currItem));
            };

            /**
             * 保存视图数据到业务对象
             * @param saveData 保存请求的数据
             * @since 2018-12-10
             */
            /*

             业务控制器重写【保存视图数据到业务对象】方法的示例

             $scope.saveBizData = function (bizData) {
             $scope.hcSuper.saveBizData(bizData); //继承基础控制器的方法，类似Java的super
             //保存头部数据的步骤已在基础控制器实现

             //保存表格的数据到明细数组
             bizData.明细数组1 = $scope.明细表格选项1.hcApi.getRowData();
             bizData.明细数组2 = $scope.明细表格选项2.hcApi.getRowData();
             };

             */

            /**
             * 发保存请求之后的处理
             * @param responseData 响应的数据
             * @since 2018-12-10
             */
            target.doAfterSave = function (responseData) {

            };

            /**
             * 初始化
             * @since 2018-12-10
             */
            target.doInit = function () {
                return $q.resolve();
            };

        }

        //定义数据
        defineData();

        //在作用域上定义函数
        defineFunction($scope);

        //在 hcSuper 上再定义一次函数，这样子控制器重写函数的时候可以调用父控制器的函数
        defineFunction($scope.hcSuper = $scope.hcSuper || {});

        //给window对象绑定清理对象的方法，此方法会在tab标签页关闭时调用
        window.destoryObj = function () {
            console.log("...call destoryObj function...");
            angular.forEach($scope, function (value, key, obj) {
                if ($.isFunction(obj[key])) {
                    obj[key] = null;
                }
            });
            $scope = null;
        }
    }

    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: BaseEditList
    });
});