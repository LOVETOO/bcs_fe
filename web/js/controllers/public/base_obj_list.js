/**
 * 对象列表页基础控制器
 * @since 2018-09-14
 */
define(['module', 'controllerApi', 'jquery', 'angular', 'swalApi', '$q', 'requestApi', 'numberApi', 'openBizObj', 'constant', 'specialProperty', 'gridApi', 'directive/hcObjList'], function (module, controllerApi, $, angular, swalApi, $q, requestApi, numberApi, openBizObj, constant, specialProperty, gridApi) {
    'use strict';

    BaseObjList.$inject = ['$scope'];
    function BaseObjList(   $scope) {

        var printApi = {};

        /**
         * 定义数据
         */
        function defineData() {
            /* ============================== 业务数据 ============================== */
            $scope.data = $scope.data || {};

            (function () {
                var objConf = $scope.$state.objConf;
                if (objConf) {
                    $scope.data.objConf = objConf;

                    (function () {
                        var index = $scope.$state.name.lastIndexOf('_list');
                        if (index >= 0)
                            $scope.data.propStateName = $scope.$state.name.substring(0, index) + '_prop';
                        else
                            $scope.data.propStateName = $scope.$state.name + '_prop';
                    })();

                    (function () {
                        var index = objConf.javaname.lastIndexOf('.');
                        if (index >= 0)
                            $scope.data.classId = objConf.javaname.substr(index + 1);
                        else
                            $scope.data.classId = objConf.javaname;

                        $scope.data.classId = $scope.data.classId.toLowerCase();
                    })();

                    $scope.data.idField = (objConf.pkfield || '').toLowerCase();
                    $scope.data.codeField = (objConf.codefield || '').toLowerCase();
                    $scope.data.namefield = (objConf.namefield || '').toLowerCase();
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
				base: {},
				searchPanel: {}
            }));

            /**
             * 工具栏按钮定义
             * id: 按钮ID，唯一，不可变 - string {
			 *     groupId: 组ID，选填 - string
			 *     title: 按钮显示名称 - string
			 *     icon: 图标，写类名，用于<i></i>标签 - string
			 *     click: 点击事件 - function({
			 *         id: 按钮ID - string
			 *         button: 按钮定义 - object
			 *         event: 事件对象 - $event
			 *     })
			 *     hide: 隐藏，布尔值或函数，设为函数可动态显隐 - boolean or function({
			 *         id: 按钮ID - string
			 *         button: 按钮定义 - object
			 *     })
			 * }
             * @since 2018-09-29
             */
            $scope.toolButtons = constant.getConstClone({
                add: {
                    groupId: 'base',
                    title: '新增',
                    icon: 'iconfont hc-add',
                    click: function () {
                        return $scope.add && $scope.add();
                    }
                },
                copy: {
                    title: '复制',
                    icon: 'iconfont hc-fuzhi',
                    click: function () {
                        return $scope.copy && $scope.copy();
                    }
                },
                delete: {
                    groupId: 'base',
                    title: '删除',
                    icon: 'iconfont hc-delete',
                    click: function () {
                        return $scope.delete && $scope.delete();
                    }
                },
                openProp: {
                    groupId: 'base',
                    title: '查看',
					icon: 'iconfont hc-form',
                    click: function () {
                        return $scope.openProp && $scope.openProp();
                    }
                },
                refresh: {
                    groupId: 'base',
                    title: '刷新',
                    icon: 'iconfont hc-refresh',
                    click: function () {
                        return $scope.refresh && $scope.refresh();
                    }
                },
                filter: {
                    groupId: 'base',
                    title: '筛选',
                    icon: 'iconfont hc-shaixuan',
                    click: function () {
                        return $scope.search && $scope.search();
                    }
				},
				toggleSearchPanelVisible: {
					groupId: 'searchPanel',
					title: function () {
						return ($scope.searchPanelVisible ? '收起' : '展开') + '查询面板';
					},
					icon: function () {
						return 'iconfont ' + ($scope.searchPanelVisible ? 'hc-less' : 'hc-moreunfold');
					},
					click: function () {
						$scope.searchPanelVisible = !$scope.searchPanelVisible;
					},
					hide: function () {
						return !$scope.hasSearchPanel;
					}
				},
				clear: {
					groupId: 'searchPanel',
					title: '清除',
					icon: 'iconfont hc-qingsao',
					click: function () {
						$scope.searchObj = {};
					},
					hide: function () {
						return !$scope.searchPanelVisible;
					}
				},
				search: {
					groupId: 'searchPanel',
					title: '查询',
					icon: 'iconfont hc-search',
					click: function () {
						return $scope.refresh && $scope.refresh();
					},
					hide: function () {
						return !$scope.searchPanelVisible;
					}
				},
                reverseAudit: {
					title: '反审核',
					icon: 'iconfont hc-bohui',
                    click: function () {
                        return $scope.gridOptions.hcApi
                            .getFocusedNodeWithNotice({
                                actionName: '反审核'
                            })
                            .then(function (node) {
                                if (node.data.stat != 5) {
                                    var message = '状态为【已审核】时，才能反审核';
                                    swalApi.error(message);
                                    throw new Error(message);
                                }

                                return swalApi.confirmThenSuccess({
                                    title: '确定要反审核【' + node.data[$scope.data.codeField] + '】吗？',
                                    okTitle: '反审核成功',
                                    okFun: function () {
                                        var postParams = {};

                                        postParams.classId = $scope.data.classId;
                                        postParams.action = 'reverseaudit';
                                        postParams.data = {};
                                        postParams.data[$scope.data.idField] = node.data[$scope.data.idField];

                                        return requestApi.post(postParams).then($scope.refresh);
                                    }
                                });
                            });
                    }
                },
                batchAudit: {
                    title: '批量审核',
                    icon: 'iconfont hc-templatedefault',
                    click: function () {
                        var objType = $scope.data.objConf.objtypeid;
                        var objIds = selectedNodes.map(function (node) {
                            return node.data[$scope.data.idField];
                        });

                        return openBizObj({
                            stateName: 'baseman.wf',
                            params: {
                                objType: objType,
                                objId: objIds
                            }
                        }).result.finally($scope.refresh);
                    }
                },
                export: {
                    title: '导出',
                    icon: 'iconfont hc-daochu',
                    click: function () {
                        return $scope.gridOptions.hcApi.exportToExcel();
                    }
                },
                import: {
                    title: '导入',
                    icon: 'iconfont hc-daoru',
                    click: function () {
						var importSetting;

						if (typeof $scope.getImportSetting === 'function') {
							importSetting = $scope.getImportSetting();
						}

						importSetting = angular.extend({
							classId: $scope.data.classId
						}, importSetting);

                        return openBizObj({
							importSetting: importSetting
                        }).result.finally($scope.gridOptions.hcApi.search);
                    }
                },
                downloadImportFormat: {
                    title: '下载导入模板',
                    icon: 'iconfont hc-icondownload'
                },
                print: {
                    title: '打印',
                    icon: 'iconfont hc-print',
                    click: function () {
                        return $scope.print && $scope.print();
                    }
                }
            });

            constant.defineConstProp($scope, 'toolButtons', $scope.toolButtons);

            //以下按钮默认隐藏
            (function (buttonIds) {
                buttonIds.forEach(function (buttonId) {
                    $scope.toolButtons[buttonId].hide = true;
                });
            })([
                'import',
                'downloadImportFormat'
			]);

			specialProperty.defineHide($scope.toolButtons.add, function () {
				return $scope.$eval('data.objConf.isAllowed("edit") !== true');
			});
			
			specialProperty.defineHide($scope.toolButtons.delete, function () {
				if (!$scope.currRowNode || $scope.currItem.stat > 1) {
					return true;
				}

				return $scope.$eval('data.objConf.isAllowed("delete") !== true');
			});

			specialProperty.defineHide($scope.toolButtons.export, function () {
				return $scope.$eval('data.objConf.isAllowed("export") !== true');
			});

            specialProperty.defineHide($scope.toolButtons.copy, function () {
                return !$scope.data.objConf || $scope.data.objConf.cancopy != 2;
            });

            specialProperty.defineHide($scope.toolButtons.reverseAudit, function () {
                return !$scope.data.objConf || $scope.data.objConf.reverseauditable != 2;
            });

            specialProperty.defineHide($scope.toolButtons.print, function whenToHideButtonPrint() {
                //若没有关联打印模板 则隐藏
                var flag = !$scope.$eval('data.objConf.objrptconfofobjconfs.length');

                if (!flag && !printApi.doMultiplyPrint) { // 动态加载printApi
                    require(["printApi"], function (printapi) {
                        printApi = printapi;
                    })();
                }

                return flag;
            });

            var selectedNodes;
            specialProperty.defineHide($scope.toolButtons.batchAudit, function () {
                return !selectedNodes || selectedNodes.length < 2;
            });

            /* ============================== 过滤器 ============================== */
            if ($scope.$eval('data.objConf.isbill == 2 || data.objConf.objwftempofobjconfs.length') && $scope.filterSetting !== null) {
                $scope.filterSetting = {
                    filters: {
                        stat: {
                            options: [{
                                name: '制单',
                                value: 1
                            }, {
                                name: '已提交',
                                value: 3
                            }, {
                                name: '已审核',
                                value: 5
                            }]
                        }
                    },
                    onChange: function (params) {
                        if (params.id === 'stat') {
                            var column = $scope.gridOptions.columnApi.getColumn('stat');

                            if (column)
                                column.setVisible(!params.option.value);
                        }
                        $scope.refresh();
                    }
                };
            }

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

            //附件标识列
            $scope.gridOptions.columnDefs.splice(1, 0, {
                field: 'attachcount',
                headerName: '附件',
                width: 56,
                minWidth: 56,
                maxWidth: 56,
                pinned: 'left',
                suppressMenu: true,
                hide: true,
                cellStyle: {
                    'text-align': 'center'
                },
                cellRenderer: function (params) {
                    var attachCount = numberApi.toNumber(params.value);

                    if (attachCount > 0)
                        return '<i class="iconfont hc-attachment"></i>×' + attachCount;

                    return '';
                }
            });

            if ($scope.data.objConf)
                $scope.gridOptions.hcObjConf = $scope.data.objConf;

            $scope.gridOptions.hcEvents = $scope.gridOptions.hcEvents || {};
            $scope.gridOptions.hcEvents.cellDoubleClicked = function () {
                $scope.openProp();
            };

            $scope.gridOptions.hcEvents.rowSelected = function () {
                selectedNodes = $scope.gridOptions.api.getSelectedNodes() || [];
            };

            /**
             * 当模型变化时
             */
            $scope.gridOptions.hcEvents.modelUpdated = function (params) {
                var hasSearchAttachCount = true,	//是否有查询附件数量
                    hasAttach = false;				//是否有附件
                try {
                    params.api.getModel().forEachNode(function (node) {
                        if ('attachcount' in node.data) {
                            var attachCount = numberApi.toNumber(node.data.attachcount);
                            if (attachCount > 0) {
                                hasAttach = true;
                                throw 'break';
                            }
                        }
                        else {
                            hasSearchAttachCount = false;
                            throw 'break';
                        }
                    });
                }
                catch (e) {
                    if (e !== 'break') throw e;
                }

                //有附件则附件标识列可见
                var visible = hasAttach;

                params.columnApi.setColumnVisible('attachcount', visible);

                var needWarn = !hasSearchAttachCount;
                if (needWarn) console.warn('没有查询附件数量', $scope.$state.name);
            };

            if ($scope.gridOptions.hcExcelFileName) {
            }
            else if ($scope.$state.params.title)
                $scope.gridOptions.hcExcelFileName = $scope.$state.params.title;

			if (angular.isArray($scope.gridOptions.hcEvents.cellFocused)) {}
			else if (angular.isFunction($scope.gridOptions.hcEvents.cellFocused)) {
				$scope.gridOptions.hcEvents.cellFocused = [$scope.gridOptions.hcEvents.cellFocused];
			}
			else {
				$scope.gridOptions.hcEvents.cellFocused = [];
			}

			/**
			 * 单元格焦点切换时
			 */
			$scope.gridOptions.hcEvents.cellFocused.unshift(function (params) {
				if (params.rowIndex >= 0) {
					$scope.currRowNode = params.api.hcApi.getNodeOfRowIndex(params.rowIndex);
					$scope.currItem = $scope.currRowNode ? $scope.currRowNode.data : null;
				}
				else {
					$scope.currRowNode = null;
					$scope.currItem = null;
				}
			});

			(function (hcPostData) {
                $scope.searchObj = {};

				$scope.gridOptions.hcPostData = function () {
					var postData;

					if (hcPostData) {
						if (typeof hcPostData === 'function') {
							postData = hcPostData.call(this);
						}
						else {
							postData = hcPostData;
						}
					}

					return angular.extend({}, $scope.searchObj, postData);
				};
			})($scope.gridOptions.hcPostData);

            if ($scope.filterSetting) {
                //关联过滤器
                $scope.gridOptions.hcFilterSetting = $scope.filterSetting;
                //隐藏列【状态】
                /* (function () {
                    var columnOfStat = $scope.gridOptions.columnDefs.find(function (colDef) {
                        return colDef.field === 'stat';
                    });

                    if (!columnOfStat) return;

                    columnOfStat.hide = true;
                })(); */
            }

            (function () {
                var off, offs = [];

                function extendData(target, data) {
                    angular.forEach(data, function (value, key) {
                        var canPutIn = Switch(value, '===')
                            .case(undefined, null, true)
                            .default(function () {
                                var type = typeof value;

                                return Switch(type)
                                    .case('string', 'number', 'boolean', true)
                                    .result;
                            })
                            .result;

                        if (canPutIn) {
                            target[key] = value;
                        }
                    });

                    return target;
                }

                function copyData(data) {
                    return extendData({}, data);
                }

                off = requestApi.on({
                    classId: $scope.data.classId,
                    action: 'insert',
                    success: function (eventData) {
                        $scope.gridOptions.api.getModel().updateRowData({
                            add: [copyData(eventData.data)],
                            addIndex: 0
                        });

                        $scope.gridOptions.api.refreshCells({
                            columns: ['seq']
                        });
                    }
                });
                offs.push(off);

                off = requestApi.on({
                    classId: $scope.data.classId,
                    action: 'update',
                    success: function (eventData) {
                        var id = eventData.data[$scope.data.idField];

                        var targetNode;

                        $scope.gridOptions.api.forEachNode(function (node) {
                            if (node.data[$scope.data.idField] == id) {
                                targetNode = node;
                            }
                        });

                        if (targetNode) {
                            extendData(targetNode.data, eventData.data);

                            $scope.gridOptions.api.refreshCells({
                                rowNodes: [targetNode],
                            });
                        }
                    }
                });
                offs.push(off);

                $scope.$on('$destroy', function () {
                    offs.forEach(function (off) {
                        off();
                    });
                });
            })();
        }

        /**
         * 定义函数，所有函数请都定义在此处
         * @param {object} target 函数定义在哪个对象上
         */
        function defineFunction(target) {

            /**
             * 查询，由查询按钮使用
             * @return {Promise}
             * @since 2018-09-29
             */
            target.search = function () {
                //用表格产生条件，并查询
                return $scope.gridOptions.hcApi.searchByGrid();
            };

            /**
             * 刷新，由刷新按钮使用
             * @return {Promise}
             * @since 2018-09-29
             */
            target.refresh = function () {
                //刷新即是用上此的查询条件再查询一次
                return $scope.gridOptions.hcApi.search();
            };

            /**
             * 刷新一行
             */
            target.refreshOne = function (node) {
                return $q
                    .when()
                    .then(function () {
                        var postData = {};

                        postData[$scope.data.idField] = node.data[$scope.data.idField];

                        return {
                            classId: $scope.data.classId,
                            action: 'select',
                            data: postData,
                            noShowWaiting: true
                        };
                    })
                    .then(requestApi.post)
                    .then(function (newData) {
                        angular.extend(node.data, newData);

                        $scope.gridOptions.api.updateRowData({
                            update: [node.data]
                        });

                        return node.data;
                    });
            };

            /**
             * 查看详情，由查看详情按钮使用
             * @return {Promise}
             * @since 2018-10-12
             */
            target.openProp = function () {
                if (!$scope.data.propStateName)
                    return swalApi.error('无法' + $scope.toolButtons.openProp.title + '，请检查路由配置及命名是否符合标准').then($q.reject);

                if (!$scope.data.idField)
                    return swalApi.error('无法' + $scope.toolButtons.openProp.title + '，请检查对象配置是否定义了主键').then($q.reject);

                var rowNode = $scope.gridOptions.hcApi.getFocusedNode();
                if (!rowNode)
                    return swalApi.info('请先选中要' + $scope.toolButtons.openProp.title + '的行').then($q.reject);

                var bizData = rowNode.data;

                var propRouterParams = {
                    openedByListPage: true,
                    title: $scope.$state.params.title
                }; //属性页的路由参数

                if (angular.isFunction($scope.getPropRouterParams)) {
                    angular.extend(propRouterParams, $scope.getPropRouterParams({
                        rowNode: rowNode,
                        data: bizData
                    }));
                }

                propRouterParams.id = bizData[$scope.data.idField];

                var modalResultPromise = openBizObj({
                    stateName: $scope.data.propStateName,
                    params: propRouterParams
                }).result;

                //modalResultPromise.finally($scope.refresh);

                return modalResultPromise;
            };

            /**
             * 刷新，由新增按钮使用
             * @since 2018-10-05
             */
            target.add = function () {
                if (!$scope.data.propStateName)
                    return swalApi.error('无法' + $scope.toolButtons.add.title + '，请检查路由配置及命名是否符合标准').then($q.reject);

                var rowNode = $scope.gridOptions.hcApi.getFocusedNode();

                var propRouterParams = {
                    openedByListPage: true,
                    title: $scope.$state.params.title
                }; //属性页路由参数

                if (angular.isFunction($scope.getPropRouterParams)) {
                    angular.extend(propRouterParams, $scope.getPropRouterParams({
                        rowNode: rowNode,
                        data: rowNode ? rowNode.data : null
                    }));
                }

                var modalResultPromise = openBizObj({
                    stateName: $scope.data.propStateName,
                    params: propRouterParams
                }).result;

                //modalResultPromise.finally($scope.refresh);

                return modalResultPromise;
            };

            /**
             * 复制，由复制按钮使用
             * @since 2018-12-19
             */
            target.copy = function () {
                if (!$scope.data.propStateName)
                    return swalApi.error('无法' + $scope.toolButtons.copy.title + '，请检查路由配置及命名是否符合标准').then($q.reject);

                if (!$scope.data.idField)
                    return swalApi.error('无法' + $scope.toolButtons.copy.title + '，请检查对象配置是否定义了主键').then($q.reject);

                var rowNode = $scope.gridOptions.hcApi.getFocusedNode();
                if (!rowNode)
                    return swalApi.info('请先选中要' + $scope.toolButtons.copy.title + '的行').then($q.reject);

                var bizData = rowNode.data;

                var propRouterParams = {
                    openedByListPage: true,
                    title: $scope.$state.params.title
                }; //属性页的路由参数

                if (angular.isFunction($scope.getPropRouterParams)) {
                    angular.extend(propRouterParams, $scope.getPropRouterParams({
                        rowNode: rowNode,
                        data: bizData
                    }));
                }

                propRouterParams.copyFrom = bizData[$scope.data.idField];

                var modalResultPromise = openBizObj({
                    stateName: $scope.data.propStateName,
                    params: propRouterParams
                }).result;

                //modalResultPromise.finally($scope.refresh);

                return modalResultPromise;
            };

            /**
             * 删除，由删除按钮使用
             * @return {Promise}
             * @since 2018-10-05
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
								$scope.gridOptions.api.getModel().updateRowData({
                                    remove: [node.data]
                                });

                                $scope.gridOptions.api.refreshCells({
                                    columns: ['seq']
                                });

                                $scope.gridOptions.hcApi.setFocusedCell();

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
             * 初始化
             * @since 2018-11-12
             */
            target.doInit = function () {
                gridApi.execute($scope.gridOptions, function (gridOptions) {
                    $scope.data.rows = gridOptions.hcApi.getSelectedNodes('auto');
                });

                return $q.resolve();
            };

            /**
             * 打印
             */
            target.print = function () {
                var nodes = $scope.gridOptions.hcApi.getSelectedNodes('auto');
                if (nodes.length == 0) {
                    return swalApi.info('请先选中要打印的行').then($q.reject);
                }
                var data = angular.copy($scope.data);
                data.rows = nodes;
                printApi.doMultiplyPrint(data);
            }

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
        controller: BaseObjList
    });
});