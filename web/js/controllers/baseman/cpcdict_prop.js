/**
 * 系统词汇-属性页
 * 2018-11-05
 */
define(
	['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'promiseApi'],
    function (module, controllerApi, base_obj_prop, swalApi, promiseApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$q',
            //控制器函数
            function ($scope, $q) {

                /*-------------------数据定义开始------------------------*/
				$scope.data = {};

				$scope.canModify = userbean.isAdmin;

                /**
				 * 表格：默认词汇选项
				 */
                $scope.defaultDictItemGridOptions = {
                    hcName: '词汇选项',
					hcRequired: function () {
						//不区分组织时必填
						return $scope.$eval('data.currItem.useinvorg != 2');
					},
					hcAutoAddRowWhenPaste: true, //粘贴时自动添加行
					hcEvents: {
						modelUpdated: function (params) {
							var rowNodes = [];

							params.api.forEachNode(function (rowNode) {
								if (rowNode.data.usable == undefined) {
									rowNodes.push(rowNode);
									rowNode.data.usable = 2;
								}
							});

							if (rowNodes.length) {
								params.api.refreshCells({
									rowNodes: rowNodes,
									columns: ['usable']
								});
							}
						}
					},
					defaultColDef: {
						editable: $scope.canModify
					},
                    columnDefs: [
                        {
                            type: '序号'
						},
						{
                            field: 'dictvalue',
							headerName: '词汇选项值',
							hcRequired: true
						},
						{
                            field: 'dictname',
							headerName: '词汇选项名称',
							hcRequired: true
						},
						{
                            field: 'dictcode',
							headerName: '词汇选项编码',
							hcRequired: true
						},
						{
							field: 'usable',
							headerName: '可用',
							type: '是否'
						},
						{
                            field: 'note',
                            headerName: '备注'
                        }
                    ]
				};
				
				/**
				 * 表格：企业个性化词汇选项
				 */
				$scope.entDictItemGridOptions = {
					hcName: '当前企业的个性化词汇选项',
					hcAutoAddRowWhenPaste: true, //粘贴时自动添加行
					hcEvents: {
						modelUpdated: function (params) {
							var rowNodes = [];

							params.api.forEachNode(function (rowNode) {
								if (rowNode.data.usable == undefined) {
									rowNodes.push(rowNode);
									rowNode.data.usable = 2;
								}
							});

							if (rowNodes.length) {
								params.api.refreshCells({
									rowNodes: rowNodes,
									columns: ['usable']
								});
							}
						}
					},
					defaultColDef: {
						editable: true
					},
					columnDefs: [
						{
							type: '序号'
						},
						{
							field: 'dictvalue',
							headerName: '词汇选项值',
							hcRequired: true
						},
						{
							field: 'dictname',
							headerName: '词汇选项名称',
							hcRequired: true
						},
						{
							field: 'dictcode',
							headerName: '词汇选项编码',
							hcRequired: true
						},
						{
							field: 'usable',
							headerName: '可用',
							type: '是否'
						},
						{
							field: 'note',
							headerName: '备注'
						}
					]
				};

                /*-------------------数据定义结束------------------------*/


                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });


                //新增时初始数据
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    bizData.usable = 2;
                    bizData.isitem = 1;
                    bizData.pid = 0;
                    bizData.default_dict_items = [];
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);

					$scope.defaultDictItemGridOptions.hcApi.setRowData(bizData.default_dict_items);
					$scope.entDictItemGridOptions.hcApi.setRowData(bizData.ent_dict_items);
				};
				
				/**
				 * 初始化
				 */
				$scope.doInit = function () {
					return $q
						.when()
						.then($scope.hcSuper.doInit)
						.then(function () {
							return promiseApi.whenTrue(function () {
								return !!$scope.lineTabController;
							})
						})
						.then(function () {
							if ($scope.$eval('data.currItem.useinvorg == 2 && data.currItem.ent_dict_items.length')) {
								$scope.lineTabController.setActiveTab('entDictItem');
							}
						});
				};

                //增加行
                $scope.add_line = function () {
                    $scope.stopEditingAllGrid();
                    var line = {
                        pid: $scope.data.currItem.dictid,
                        isitem: 2,
						dictid: 0
                    };
                    $scope.data.currItem.default_dict_items.push(line);

                    //赋值序号
                    for(var i = 0; i < $scope.data.currItem.default_dict_items.length; i++){
                        $scope.data.currItem.default_dict_items[i].seq = i + 1;
                    }

                    $scope.defaultDictItemGridOptions.hcApi.setRowData($scope.data.currItem.default_dict_items);
                };

                //删除行
                $scope.del_line = function () {
                    var idx = $scope.defaultDictItemGridOptions.hcApi.getFocusedRowIndex();
                    if (idx >= 0) {
                        $scope.data.currItem.default_dict_items.splice(idx, 1);

                        //赋值序号
                        for(var i = 0; i < $scope.data.currItem.default_dict_items.length; i++){
                            $scope.data.currItem.default_dict_items[i].seq = i + 1;
                        }

                        $scope.defaultDictItemGridOptions.hcApi.setRowData($scope.data.currItem.default_dict_items);
                    }
                };

                //置顶
                $scope.set_top = function () {
                    $scope.moveFun('top');
                };

                //置底
                $scope.set_bottom = function () {
                    $scope.moveFun('bottom');
                };

                //上移
                $scope.move_up = function () {
                    $scope.moveFun('up');
                };

                //下移
                $scope.move_down = function () {
                    $scope.moveFun('down');
                };

                /**
                 * 移动行函数
                 */
                $scope.moveFun = function (type) {
                    var index = $scope.defaultDictItemGridOptions.hcApi.getFocusedRowIndex();
                    var arr = $scope.data.currItem.default_dict_items;
                    var focusedIndex;

                    if(index < 0){
                        return swalApi.info('请选中要移动的行');
                    }

                    switch(type){
                        case 'up':
                            if(index == 0){
                                return;
                            }
                            arr[index] = arr.splice(index - 1, 1, arr[index])[0];
                            focusedIndex = index - 1;
                            break;
                        case 'down':
                            if(index == arr.length - 1){
                                return;
                            }
                            arr[index] = arr.splice(index + 1, 1, arr[index])[0];
                            focusedIndex = index + 1;
                            break;
                        case 'top':
                            if(index == 0){
                                return;
                            }
                            arr.unshift(arr[index]);
                            arr.splice(index + 1,1);
                            focusedIndex = 0;
                            break;
                        case 'bottom':
                            if(index == arr.length - 1){
                                return;
                            }
                            arr.push(arr[index]);
                            arr.splice(index,1);
                            focusedIndex = arr.length - 1;
                            break;
                    }

                    //设置焦点行
                    $scope.defaultDictItemGridOptions.hcApi.setFocusedCell(focusedIndex, 'dictvalue');

                    //赋值序号
                    for(var i = 0; i < arr.length; i++){
                        arr[i].seq = i + 1;
                    }

                    $scope.defaultDictItemGridOptions.hcApi.setRowData(arr);
                };

                //底部左边按钮
                // $scope.footerLeftButtons.add_line = {
				// 	icon: 'iconfont hc-add',
                //     //title: '增加词汇值',
                //     click: function () {
                //         $scope.add_line && $scope.add_line();
                //     }
                // };
                // $scope.footerLeftButtons.del_line = {
				// 	icon: 'iconfont hc-reduce',
				// 	//title: '删除词汇值',
                //     click: function () {
                //         $scope.del_line && $scope.del_line();
                //     }
                // };
                // $scope.footerLeftButtons.set_top = {
                //     //title: '置顶',
                //     icon: 'fa fa-angle-double-up',
                //     click: function () {
                //         $scope.set_top && $scope.set_top();
                //     }
                // };
                // $scope.footerLeftButtons.move_up = {
                //     //title: '上移',
                //     icon: 'fa fa-angle-up',
                //     click: function () {
                //         $scope.move_up && $scope.move_up();
                //     }
                // };
                // $scope.footerLeftButtons.move_down = {
                //     //title: '下移',
                //     icon: 'fa fa-angle-down',
                //     click: function () {
                //         $scope.move_down && $scope.move_down();
                //     }
                // };
                // $scope.footerLeftButtons.set_bottom = {
                //     //title: '置底',
                //     icon: 'fa fa-angle-double-down',
                //     click: function () {
                //         $scope.set_bottom && $scope.set_bottom();
                //     }
                // };


                //隐藏标签页
                $scope.tabs.wf.hide = true;
                $scope.tabs.attach.hide = true;

				$scope.tabs.base.hide = true;
				
				/**
				 * 明细标签页
				 */
				$scope.lineTabs = {
					defaultDictItem: {
						active: true,
						title: function () {
							return ($scope.$eval('data.currItem.useinvorg == 2') ? '默认' : '') + '词汇选项（' + $scope.$eval('data.currItem.default_dict_items.length || 0') + '）';
						}
					},
					entDictItem: {
						title: function () {
							return '【' + userbean.loginEnt.entid + '-' + userbean.loginEnt.entname + '】词汇选项（' + $scope.$eval('data.currItem.ent_dict_items.length || 0') + '）';
						},
						hide: function () {
							return $scope.$eval('data.currItem.useinvorg != 2');
						}
					}
				};

				$scope.data.currGridOptions = $scope.defaultDictItemGridOptions;
				$scope.data.currGridModel = 'data.currItem.default_dict_items';

				/**
				 * 明细标签页切换事件
				 */
				$scope.onLineTabChange = function (params) {
					switch (params.id) {
						case 'defaultDictItem': {
							$scope.data.currGridOptions = $scope.defaultDictItemGridOptions;
							$scope.data.currGridModel = 'data.currItem.default_dict_items';
							break;
						}
						case 'entDictItem': {
							$scope.data.currGridOptions = $scope.entDictItemGridOptions;
							$scope.data.currGridModel = 'data.currItem.ent_dict_items';
							break;
						}
						default: {
							$scope.data.currGridOptions = null;
							$scope.data.currGridModel = '';
						}
					}
				};

				/**
				 * 修改【区分组织】时
				 */
				$scope.onUseInvOrgChange = function () {
					//若启用【区分组织】
					if ($scope.data.currItem.useinvorg == 2) {
						//切换到标签页【企业词汇选项】
						if (!$scope.lineTabController.isTabActive('entDictItem')) {
							$scope.lineTabController.setActiveTab('entDictItem');
						}

						//且没有一套企业词汇选项，而且有一套默认词汇选项
						if ($scope.$eval('!data.currItem.ent_dict_items.length && data.currItem.default_dict_items.length')) {
							//询问是否复制默认词汇选项作为企业词汇选项的基础
							swalApi
								.confirm([
									'是否复制一份默认词汇选项作为初始的企业词汇选项？',
									'',
									'（这个操作对于企业词汇选项和默认词汇选项只有细微差别的情况比较有用）'
								])
								.then(function () {
									$scope.data.currItem.ent_dict_items = angular.copy($scope.data.currItem.default_dict_items);

									$scope.data.currItem.ent_dict_items.forEach(function (dictItem) {
										delete dictItem.dictid;
									});

									$scope.entDictItemGridOptions.hcApi.setRowData($scope.data.currItem.ent_dict_items);
								});
						}
					}
					//若取消【区分组织】
					else {
						//切换回标签页【默认词汇选项】
						if ($scope.lineTabController.isTabActive('entDictItem')) {
							$scope.lineTabController.setActiveTab('defaultDictItem');
						}
					}
				};

				if (!$scope.canModify) {
					(function () {
						$scope.footerRightButtons.saveThenAdd.hide = true;

						[
							'addRow',
							'deleteRow',
							'topRow',
							'upRow',
							'downRow',
							'bottomRow'
						].forEach(function (buttonId) {
							$scope.footerLeftButtons[buttonId].hide = whenToHide;
						});

						function whenToHide() {
							return $scope.$eval('data.currGridOptions !== entDictItemGridOptions');
						}
					})();
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



