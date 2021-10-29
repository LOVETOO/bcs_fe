/**
 * zTree相关Api
 * @since 2018-11-02
 */
(function (defineFn) {
    define(['exports', 'jquery', 'angular', 'swalApi', 'arrayApi', 'promiseApi', 'angularApi', 'strApi', 'ztree.core', 'ztree.exhide'], defineFn);
})(function (api, $, angular, swalApi, arrayApi, promiseApi, angularApi, strApi) {
    var zTree = $.fn.zTree;

    require(['cssApi'], function (cssApi) {
        cssApi.loadCss('js/plugins/z-tree/css/zTreeStyle/zTreeStyle.css');
    });

    /**
     * 创建zTree
     * @param element 树容器元素
     * @param setting 树设置
     * @since 2018-11-02
     */
    api.create = function (element, setting) {
        return ['$q', '$compile', function ($q, $compile) {
            if (!element) {
                swalApi.error('无法创建树：未指定树容器元素');
                return;
            }

            if (!setting) {
                swalApi.error('无法创建树：未指定树设置');
                return;
            }

            if(!setting.check){
                setting.check = {};
            }
            if (angular.isString(element) && element.charAt(0) !== '#')
                element = '#' + element;

            //容器元素
            element = $(element);

            if (!element.attr('id'))
                element.attr('id', 'zTree_' + (+new Date()));

            setting.hcElement = element;

            //容器元素增加类
            element.addClass('ztree');

            var zTreeObj;

            setting.callback = setting.callback || {};

            /**
             * 树的点击事件
             * @since 2018-11-06
             */
            setting.callback.onClick = (function (onClick) {
                return function (event, treeId, node) {
                    if (node.isParent) {
                        //展开节点
                        zTreeObj.expandNode(
                            node, //treeNodeJSON 需要 展开 / 折叠 的节点
                            true, //expandFlag 省略此参数，则根据对此节点的展开状态进行 toggle 切换
                            null, //sonSign = false，只影响此节点，对于其 子孙节点无任何影响。省略此参数，等同于 false
                            null, //focus = true，表示 展开 / 折叠 操作后，通过设置焦点保证此焦点进入可视区域内。省略此参数，等同于 true
                            true //callbackFlag = true 表示执行此方法时触发 beforeExpand / onExpand 或 beforeCollapse / onCollapse 事件回调函数。省略此参数，等同于 false
                        );
                    }

                    if (setting.hcGridOptions && node.hcLoadPromise)
                        node.hcGridPromise = node.hcLoadPromise
                            .then(function () {
                                if (angular.isArray(node.hcGridData)) {
                                    return node.hcGridData;
                                }
                                else if (angular.isFunction(setting.hcGetGridData)) {
                                    return $q
                                        .when(node)
                                        .then(setting.hcGetGridData)
                                        .then(arrayApi.toObjArray)
                                        .then(function (gridData) {
                                            node.hcGridData = gridData;
                                            return gridData;
                                        })
                                        ;
                                }
							})
							.then(function (gridData) {
								if (!gridData) {
									return $q.reject();
								}

								return setting.hcGridOptions.hcReady.then(function () {
									return gridData;
								});
							})
							.then(function (gridData) {
								setting.hcGridOptions.hcApi.setRowData(gridData);
							})
                        ;

                    if (angular.isFunction(onClick))
                        onClick.apply(null, arguments);
                };
            })(setting.callback.onClick);

            /**
             * 树的展开前事件
             * @since 2018-11-06
             */
            setting.callback.beforeExpand = function (treeId, node) {
                //若节点数据在加载中，不允许展开
                if (node.hcLoading) return false;

                //若节点数据已加载完成，直接展开
                if (node.hcLoaded) return true;

                if (angular.isFunction(setting.hcGetChildNodes)) {
                    //标记节点正在加载数据
                    node.hcLoading = true;

                    var oldGridData = node.hcGridData;
                    node.hcGridData = null;

                    node.hcLoadPromise = $q
                        .when(node)
                        .then(setting.hcGetChildNodes)
                        .finally(function () {
                            //标记节点不在加载数据
                            node.hcLoading = false;
                        })
                        .catch(function () {
                            node.hcGridData = oldGridData;
                            return $q.reject(arguments[0]);
                        })
                        .then(function () {
                            //标记节点数据已加载完成
                            node.hcLoaded = true;

                            return arguments[0];
                        })
                        .then(arrayApi.toObjArray)
                        .then(function (childNodes) {
                            childNodes.forEach(function (node) {
                                if (!('isParent' in node))
                                    node.isParent = true;
                            });

                            //先移除旧的子节点
                            zTreeObj.removeChildNodes(node);

                            if (childNodes.length) {
                                //把子节点挂到父节点下面
                                zTreeObj.addNodes(node, childNodes);
                            }
                            else {
                                //没有子节点，取消父节点的父节点状态
                                node.isParent = false;
                                zTreeObj.updateNode(node);
                            }

                            return node.children;
                        })
                    ;

                    return false;
                }

                return true;
            };

            /**
             * 树的右键前事件
             * @since 2018-11-06
             */
            setting.callback.beforeRightClick = function () {
                return true;
            };

            var scope, menu, menuToggle;

            (function createMenu() {
                scope = element.scope().$new(true);

                scope.menuItems = setting.hcMenuItems;

                scope.isMenuItemNeedHide = function (params) {
                    if (params.menuItem.hide === true) return true;

                    if (angular.isFunction(params.menuItem.hide))
                        return params.menuItem.hide(params);

                    return false;
                };

                scope.getMenuItemTitle = function (params) {
                    if (angular.isString(params.menuItem.title))
                        return params.menuItem.title;

                    if (angular.isFunction(params.menuItem.title))
                        return params.menuItem.title(params);

                    return '';
                };

                var menuContainer = $('<div>\
						<button data-toggle="dropdown" style="display:none"></button>\
						<ul class="dropdown-menu" style="position:absolute">\
							<li ng-repeat="(id,menuItem) in menuItems"\
								ng-click="menuItem.click({id:id,menuItem:menuItem,node:node,event:$event})"\
								ng-hide="isMenuItemNeedHide({id:id,menuItem:menuItem,node:node})">\
								<a class="{{menuItem.icon}}" href="javascript:void(0)" ng-bind="getMenuItemTitle({id:id,menuItem:menuItem,node:node})">\
								</a>\
							</li>\
						</ul>\
					</div>');

                menuContainer = $compile(menuContainer)(scope).appendTo('body');
                menu = menuContainer.find('ul');
                menuToggle = menuContainer.find('button');

                menuContainer.on('hidden.bs.dropdown', function () {
                    scope.node = null;
                });
            })();

            /**
             * 树的右键事件
             * @param {Event} event
             * @param {string} treeId
             * @param {object} treeNode
             */
            setting.callback.onRightClick = setting.callback.onRightClick ? setting.callback.onRightClick : function (event, treeId, treeNode) {
                menu.css('left', event.pageX);
                menu.css('top', event.pageY);
                scope.node = treeNode;
                //若有节点，或允许无节点菜单
                if (treeNode || setting.hcAllowMenuWithoutNode) menuToggle.click();
            };

            //通过事件驱动 Angular 响应
            angular.forEach(setting.callback, function (eventHandler, eventName, callback) {
                callback[eventName] = function angularEvent() {
                    var result = eventHandler.apply(this, arguments);

                    angularApi.applyToScope(element.scope());

                    return result;
                };
            });

            setting.view = setting.view || {};
            if (['boolean', 'function'].indexOf(typeof setting.view.showIcon) < 0)
                setting.view.showIcon = false;

            //默认双击不展开
            if (setting.view.dblClickExpand === undefined)
                setting.view.dblClickExpand = false;

            zTreeObj = zTree.init(element, setting, setting.nodes);

            setting.zTreeObj = zTreeObj;

            setting.hcApi = {
                /**
                 * 重新加载节点
                 * @param {Node} [node] 需要重载的节点，可空，默认为当前节点，若为 null 则重置根节点
                 * @since 2018-11-16
                 */
                reload: function (node) {
                    //重新加载当前节点
                    if (angular.isUndefined(node)) {
                        node = zTreeObj.getSelectedNodes();

                        var error;
                        if (!node || !node.length) {
                            error = '当前无选中节点，无法刷新';
                        }
                        else if (node.length > 1) {
                            error = '当前有多个选中节点，无法刷新';
                        }

                        if (error) {
                            return swalApi.error(error).then(function () {
                                return $q.reject(error);
                            });
                        }

                        node = node[0];
                    }
                    else if (node) {
                        zTreeObj.selectNode(node);
                    }

                    //重新加载根节点
                    if (node === null) {
                        if (angular.isFunction(setting.hcGetRootNodes))
                            return setting.hcRootPromise = $q
                                .when()
                                .then(setting.hcGetRootNodes)
                                .then(arrayApi.toObjArray)
                                .then(function (rootNodes) {
                                    rootNodes.forEach(function (node) {
                                        if (!('isParent' in node))
                                            node.isParent = true;
                                    });

                                    zTreeObj.getNodes().slice().reverse().forEach(function (node) {
                                        zTreeObj.removeNode(node);
                                    });

                                    rootNodes = zTreeObj.addNodes(null, rootNodes);

                                    if (rootNodes.length) {
                                        zTreeObj.selectNode(rootNodes[0]);
                                        setting.hcApi.reload(rootNodes[0]);
                                    }

                                    return rootNodes;
                                })
                                ;

                        return $q.reject('尚未定义 setting.hcGetRootNodes 属性');
                    }

                    node.isParent = true;
                    node.hcLoaded = false;
                    node.hcLoadPromise = null;
                    node.hcGridPromise = null;

                    //更新节点状态
                    zTreeObj.updateNode(node);

                    //折叠节点
                    zTreeObj.expandNode(node, false);

                    var gridReady = null;

                    if (setting.hcGridOptions)
                        gridReady = setting.hcGridOptions.hcReady = setting.hcGridOptions.hcReady || promiseApi();

                    return $q
                        .when()
                        .then(gridReady)
                        .then(function () {
                            return setting.hcApi.clickNode(node);
                        });
                },

                /**
                 * 返回选中节点的Promise，没选中会提示
                 * @param params = {
				 *     message: string 没选中时的提示信息 与 actionName 冲突
				 *     actionName: string 选中后续动作的名称 与 message 冲突
				 * }
                 * @return {Promise<TreeNode>} 树节点
                 */
                getSelectedNodesWithNotice: function (params) {
                    if (angular.isString(params))
                        params = {
                            message: params
                        };

                    return $q
                        .when()
                        .then(function () {
                            var selectedNodes = zTreeObj.getSelectedNodes();

                            if (selectedNodes && selectedNodes.length)
                                return selectedNodes;

                            var actualMessage = params.message ? params.message : '请先选中要' + params.actionName + '的节点'

                            return swalApi.info(actualMessage).then($q.reject);
                        });
                },

                /**
                 * 点击指定节点
                 * @param {TreeNode} node
                 */
                clickNode: function (node) {
                    zTreeObj.selectNode(node);
                    setting.callback.onClick(null, null, node);
                    return node.hcGridPromise || node.hcLoadPromise;
                },

                /**
                 * 定位
                 * @param params
                 * @since 2019-02-28
                 */
                locate: function (params) {
                    var currNode = zTreeObj.getNodes()[0];

                    var treeNodeIds = strApi.commonSplit(params.path);

                    var gridNodeId;
                    if (params.locateToGrid)
                        gridNodeId = treeNodeIds.pop();

                    var promise = setting.hcApi.reload(currNode);

                    treeNodeIds.forEach(function (id) {
                        promise = promise.then(function () {
                            currNode = zTreeObj.getNodesByFilter(function (node) {
                                return node.data[params.key] == id;
                            }, true, currNode);

                            if (currNode)
                                return setting.hcApi.clickNode(currNode);
                        });
                    });

                    if (params.locateToGrid) {
                        promise = promise.then(function () {
                            var rowNode = setting.hcGridOptions.hcApi.getNodesByFilter(function (node) {
                                return node.data[params.gridKey] == gridNodeId;
                            })[0];

                            if (rowNode)
                                setting.hcGridOptions.hcApi.setFocusedCell(rowNode.rowIndex);
                        });
                    }

                    return promise;
                }
            };

            setting.hcApi.reload(null);

            return zTreeObj;
        }].callByAngular();
    };

});