/**
 * 工程项目附件
 * @since 2019-07-01
 */
define(['module', 'directiveApi', 'jquery', 'angular', 'gridApi', 'fileApi', 'requestApi', 'openBizObj', 'swalApi', 'directive/hcBox', 'directive/hcGrid'], function (module, directiveApi, $, angular, gridApi, fileApi, requestApi, openBizObj, swalApi) {

	/**
	 * 指令
	 */
	function hcProjAttachDirective() {
		return {
			restrict: 'E',
			require: '^?form',
			scope: {},
			template: function () {
				return [
					$('<div>', {
						'hc-grid': 'gridOptions',
						'ng-hide': 'objConf.tablename === "epm_project"'
					}),
					$('<div>', {
						'hc-box': '',
						'ng-show': 'otherProjAttaches.length || objConf.tablename === "epm_project"',
						'css': {
							'margin': '0',
							'flex': '1',
							'display': 'flex',
							'flex-direction': 'column'
						},
						'html': [
							$('<hc-box-title>', {
								'text': '其他项目附件',
								'ng-hide': 'objConf.tablename === "epm_project"'
							}),
							$('<div>', {
								'hc-grid': 'otherGridOptions',
								'css': {
									'flex': '1'
								}
							})
						]
					})
				];
			},
			controller: HcProjAttachController,
			link: hcProjAttachLink
		};
	}

	/**
	 * 控制器
	 */
	HcProjAttachController.$inject = ['$scope', '$element', '$attrs', '$parse', '$q', '$timeout'];
	function HcProjAttachController($scope, $element, $attrs, $parse, $q, $timeout) {
		var controller = this,
			$parentScope = $scope.$parent;

		if ($attrs.hcProjAttachAs) {
			$parse.parseAsSetter($attrs.hcProjAttachAs)($parentScope, controller);
		}

		if ($parentScope.$eval('data.objConf')) {
			$scope.objConf = $parentScope.data.objConf;

			$scope.$watch('$parent.data.currItem.project_id', function (projId) {
				projId = +projId;

				$q
					.when()
					.then(function () {
						if (!projId) {
							$scope.otherProjAttaches = [];
							return;
						}

						return requestApi
							.post({
								classId: 'epm_project_attach',
								action: 'get_other_attach',
								data: {
									project_id: projId,
									objtype: $parentScope.data.objConf.objtypeid
								},
								noShowError: true,
								noShowWaiting: true
							})
							.then(function (response) {
								$scope.otherProjAttaches = response.epm_project_attachs;
							});
					})
					.then(function () {
						return gridApi.execute($scope.otherGridOptions, function (gridOptions) {
							gridOptions.hcApi.setRowData($scope.otherProjAttaches);

							var visible = $scope.otherProjAttaches.some(function (attach) {
								return !!attach.attach_type;
							});

							gridOptions.columnApi.setColumnVisible('attach_type', visible);
						});
					});
			});
		}

		var attachTypes = {};

		$parentScope.$eval('data.objConf.attach_types || []').forEach(function (attachType) {
			attachTypes[attachType.attach_type] = attachType;
		});

		attachTypes[''] = {
			attach_type: '',
			suffix: '',
			at_least: 0,
			at_most: Number.MAX_SAFE_INTEGER
		};

		/**
		 * 表格：本单据附件
		 */
		$scope.gridOptions = {
			context: {},
			defaultColDef: {
				suppressMenu: true, //禁用头部菜单
			},
			columnDefs: [
				{
					type: '序号'/* ,
					cellRenderer: function (params) {
						var attachType = attachTypes[params.data.attach_type];

						var template;

						if (attachType && attachType.at_least > 0) {
							template = '<span style="color: red;">*</span>' + params.value;
						}
						else {
							template = params.value;
						}

						return template;
					} */
				},
				{
					field: 'attach_type',
					headerName: '附件类型',
					valueFormatter: function (params) {
						var value = params.value;

						if (!value && params.context.hasAttachType) {
							value = '其他';
                        }

                        var attachType = attachTypes[params.data.attach_type];

                        var at_least = +attachType.at_least || 0;

                        var attach_count = +params.data.attach_count || 0;

                        if (at_least > 0) {
                            value = '* ' + value;
                        }
                        
                        if (at_least > 1) {
                            if (attach_count == 0) {
                                value += '（至少上传' + at_least + '份）';
                            }
                            else if (0 < attach_count && attach_count < at_least) {
                                value += '（已上传' + attach_count + '份，还差' + (at_least - attach_count) + '份）';
                            }
                            else {
                                if (attach_count > 1) {
                                    value += '（共' + attach_count + '份）';
                                }
                            }
                        }
                        else {
                            if (attach_count > 1) {
                                value += '（共' + attach_count + '份）';
                            }
                        }

						return value;
					},
					rowSpan: function (params) {
						return params.data.attach_count;
					},
					tooltip: function (params) {
						var attachType = attachTypes[params.data.attach_type];

						return attachType && attachType.note;
					},
                    hide: attachTypes.length <= 1,
                    cellStyle: function (params) {
                        var attachType = attachTypes[params.data.attach_type];

                        if (!attachType) {
                            return;
                        }

                        var at_least = +attachType.at_least || 0;

                        var attach_count = +params.data.attach_count || 0;

                        if (at_least > 0 && attach_count < at_least) {
                            return {
                                color: 'red'
                            };
                        }
                    }
				},
				{
					field: 'docname',
					headerName: '附件名称',
					onCellDoubleClicked: function (params) {
						var doc = params.node.data;

						//有附件时打开
						if (doc.docname) {
							if (fileApi.isImage(doc)) {
								openBizObj({
									imageId: doc.docid,
									images: $scope.gridOptions.hcApi.getRowData()
								});
							}
							else {
								fileApi.openFile(doc);
							}
						}
						//没附件时添加
						else {
							var $formController = $element.controller('form');

							if ($formController && $formController.isReadonly && $formController.isReadonly()) {
							}
							else {
								addAttach(params.node);
							}
						}
					}
				},
				{
					field: 'op',
					headerName: '操作',
					autoHeight: true,
					cellStyle: {
						'display': 'flex',
						'justify-content': 'center',
						'align-items': 'center',
						'padding': '0'
					},
					cellRenderer: function (params) {
						var node = params.node;

						var $formController = $element.controller('form');

						var isReadonly = $formController && $formController.isReadonly && $formController.isReadonly();

						return $('<div>', {
							'css': {
								'display': 'flex',
								'justify-content': 'space-around',
								'align-items': 'center',
								'box-sizing': 'border-box',
								'padding': '0 4px'
							},
							'html': [
								isReadonly ? null : $('<i>', {
									'class': 'iconfont hc-add',
									'css': {
										'display': 'flex',
										'align-items': 'center',
										'margin': '0 4px',
										'cursor': 'pointer',
										'color': 'green'
									},
									'title': '添加附件',
									'on': {
										'click': function () {
											addAttach(node);
										}
									}
								}),
								isReadonly || !node.data.docname ? null : $('<i>', {
									'class': 'iconfont hc-delete',
									'css': {
										'display': 'flex',
										'align-items': 'center',
										'margin': '0 4px',
										'cursor': 'pointer',
										'color': 'orange'
									},
									'title': '删除附件',
									'on': {
										'click': function () {
											var attach_type, attach_count, docid,
												nodes, redrawNode;

											attach_type = node.data.attach_type;

											docid = node.data.docid;

											nodes = [];

											$scope.gridOptions.api.forEachNode(function (node) {
												if (node.data.attach_type !== attach_type) return;

												nodes.push(node);
											});

											firstNode = nodes[0];
											lastNode = nodes[nodes.length - 1];

											attach_count = (firstNode.data.attach_count || 0);

											if (attach_count === 0) return;

											if (attach_count === 1 || node !== firstNode) {
												redrawNode = firstNode;
											}
											else {
												redrawNode = nodes[1];
											}

											if (attach_count > 1) {
												$scope.gridOptions.api.updateRowData({
													remove: [node.data]
												});
											}
											else {
												node.data.docid = 0;
												node.data.docname = '';
											}

											redrawNode.data.attach_count = --attach_count;

											$scope.gridOptions.api.redrawRows({
												rowNodes: [redrawNode]
											});

											if (+docid) {
												requestApi.post({
													classId: 'scpdoc',
													action: 'delete',
													data: {
														docid: docid
													},
													noShowWaiting: true,
													noShowError: true
												});
											}
										}
									}
								}),
								!node.data.docname ? null : $('<i>', {
									'class': 'iconfont hc-icondownload',
									'css': {
										'display': 'flex',
										'align-items': 'center',
										'margin': '0 4px',
										'cursor': 'pointer',
										'color': 'deepskyblue'
									},
									'title': '下载附件',
									'on': {
										'click': function () {
											fileApi.downloadFile(node.data);
										}
									}
								})
							]
						})[0];
					}
				}
			],
			hcEvents: {
				gridReady: function () {
					controller.setAttaches();
				}
			}
		};

		function addAttach(node) {
			return $q
				.when()
				.then(function () {
					var accept;

					var attachType = attachTypes[node.data.attach_type];

					if (attachType && attachType.suffix) {
						accept = Switch(attachType.suffix)
							.case('图片', 'image/*')
							.case('Office', '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf')
							.case('Word', '.doc,.docx')
							.case('Excel', '.xls,.xlsx')
							.case('PowerPoint', '.ppt,.pptx')
							.case('PDF', '.pdf')
							.result;
					}

					return accept;
				})
				.then(fileApi.chooseFile)
				.then(function (files) {
					//校验选择的文件与已选文件是否重名
					var rowData = $scope.gridOptions.hcApi.getRowData();
					var repeatFile = [];
					files.forEach(function (curOut) {
						rowData.forEach(function (curIn) {
							if(curOut.name == curIn.docname){
								repeatFile.push(curOut.name);
							}
						})
					});
					//若有上传文件与已选文件重名，提示上传失败
					if (repeatFile.length && repeatFile.length > 0) {
						swalApi.info('上传失败,请勿上传重名文件：\n' + repeatFile.join(';\n'));
						return $q.reject('上传了重名文件');
					}else{
						return files;
					}
				})
				.then(fileApi.uploadFile)
				.then(function (docs) {
					var attach_type, attach_count,
						nodes, firstEmptyNode, firstNode, lastNode,
						addIndex;

					attach_type = node.data.attach_type;

					nodes = [];

					$scope.gridOptions.api.forEachNode(function (node) {
						if (node.data.attach_type !== attach_type) return;

						nodes.push(node);

						if (!firstEmptyNode && !node.data.docname) {
							firstEmptyNode = node;
						}
					});

					firstNode = nodes[0];
					lastNode = nodes[nodes.length - 1];

					attach_count = (firstNode.data.attach_count || 0) + docs.length;

					docs.forEach(function (doc) {
						doc.attach_type = attach_type;
					});

					if (firstEmptyNode) {
						firstEmptyNode.setData(docs.shift());
						addIndex = firstEmptyNode.rowIndex + 1;
					}
					else {
						addIndex = lastNode.rowIndex + 1;
					}

					if (docs.length) {
						$scope.gridOptions.api.updateRowData({
							add: docs,
							addIndex: addIndex
						});
					}

					firstNode.data.attach_count = attach_count;

					$scope.gridOptions.api.redrawRows({
						rowNodes: [firstNode]
					});
				});
		}

		/**
		 * 表格：其他单据附件
		 */
		$scope.otherGridOptions = {
			columnDefs: [
				{
					type: '序号'
				},
				{
					field: 'objname',
					headerName: '对象名称'
				},
				{
					field: 'objcode',
					headerName: '对象编码',
					onCellDoubleClicked: function (params) {
						openBizObj({
							objType: params.data.objtype,
							objId: params.data.objid
						});
					}
				},
				{
					field: 'attach_type',
					headerName: '附件类型',
					hide: true
				},
				{
					field: 'docname',
					headerName: '附件名称',
					onCellDoubleClicked: function (params) {
						var doc = params.data;

						if (fileApi.isImage(doc)) {
							openBizObj({
								imageId: doc.docid,
								images: $scope.otherGridOptions.hcApi.getRowData()
							});
						}
						else {
							fileApi.openFile(doc);
						}
					}
				},
				{
					field: 'op',
					headerName: '操作',
					autoHeight: true,
					cellStyle: {
						'display': 'flex',
						'justify-content': 'center',
						'align-items': 'center',
						'padding': '0'
					},
					cellRenderer: function (params) {
						return $('<div>', {
							'css': {
								'display': 'flex',
								'justify-content': 'space-around',
								'align-items': 'center',
								'box-sizing': 'border-box',
								'padding': '0 4px'
							},
							'html': $('<i>', {
								'class': 'iconfont hc-icondownload',
								'css': {
									'display': 'flex',
									'align-items': 'center',
									'margin': '0 4px',
									'cursor': 'pointer',
									'color': 'deepskyblue'
								},
								'title': '下载附件',
								'on': {
									'click': function () {
										fileApi.downloadFile(params.node.data);
									}
								}
							})
						})[0];
					}
				}
			]
		};

		/**
		 * 返回附件数据
		 * @returns {SCPDoc[]}
		 */
		controller.getAttaches = function () {
			var attaches = [];

			$scope.gridOptions.api.forEachNode(function (node) {
				if (!node.data.docname) return;

				var attach = angular.copy(node.data);

				delete attach.attach_count;

				attaches.push(attach);
			});

			return attaches;
		};

		/**
		 * 设置附件数据
		 * @param {SCPDoc[]} attaches
		 */
		controller.setAttaches = function (attaches) {
			var rowData = [], typeToRowData = {};

			angular.forEach(attachTypes, function (attachType, attach_type) {
				typeToRowData[attach_type] = [];
			});

			if (attaches) {
				attaches.forEach(function (attach) {
					if (!attach.docname) return;

					attach = angular.copy(attach);

					attach.attach_type = toString(attach.attach_type);

					delete attach.attach_count;

					var rowDataOfType = typeToRowData[attach.attach_type];

					if (!rowDataOfType) {
						rowDataOfType = [];

						typeToRowData[attach.attach_type] = rowDataOfType;
					}

					rowDataOfType.push(attach);
				});
			}

			//把无类型的顺序移到最后
			(function () {
				['其他', ''].forEach(function (attach_type) {
					if (attach_type in typeToRowData) {
						var rowDataOfType = typeToRowData[attach_type];

						delete typeToRowData[attach_type];

						typeToRowData[attach_type] = rowDataOfType;
					}
				});
			})();

			angular.forEach(typeToRowData, function (rowDataOfType, attach_type) {
				if (rowDataOfType.length) {
					rowDataOfType[0].attach_count = rowDataOfType.length;
				}
				else {
					rowDataOfType.push({
						attach_type: attach_type,
						docid: 0,
						docname: ''
					});
				}

				Array.prototype.push.apply(rowData, rowDataOfType);
			});

			$scope.gridOptions.context.hasAttachType = rowData.some(function (data) {
				return !!data.attach_type;
			});

			gridApi.execute($scope.gridOptions, function (gridOptions) {
				gridOptions.hcApi.setRowData(rowData);

				var attachTypeVisible = rowData.some(function (data) {
					return data.attach_type;
				});

				gridOptions.columnApi.setColumnVisible('attach_type', attachTypeVisible);
			});
		};

		/**
		 * 有效性校验
		 * @param {string[]} invalidBox
		 */
		controller.validCheck = function (invalidBox) {
			var attachCounts = {};

			$scope.gridOptions.api.forEachNode(function (node) {
				if (node.data.docname) {
					if (node.data.attach_type in attachCounts) {
						attachCounts[node.data.attach_type]++;
					}
					else {
						attachCounts[node.data.attach_type] = 1;
					}
				}
			});

			var required_attach_types = [],
				at_least_attach_types = [];

			angular.forEach(attachTypes, function (attachType, attach_type) {
				if (attachType.at_least > 0) {
					var attachCount = attachCounts[attach_type] || 0;

					//若附件数量少于要求数量
					if (attachCount < attachType.at_least) {
						if (attachType.at_least == 1) {
							required_attach_types.push(attach_type);
						}
						else {
							at_least_attach_types.push(attach_type);
						}
					}
				}
			});

			if (required_attach_types.length) {
				if (invalidBox.length) {
					invalidBox.push('');
				}

				invalidBox.push('以下类型的附件为必填项，请上传附件：');

				required_attach_types.forEach(function (attach_type) {
					invalidBox.push(attach_type);
				});
			}

			if (at_least_attach_types.length) {
				if (invalidBox.length) {
					invalidBox.push('');
				}

				invalidBox.push('以下类型的附件未达到要求数量，请补充附件：');

				at_least_attach_types.forEach(function (attach_type) {
					invalidBox.push(attach_type + '（需要' + attachTypes[attach_type].at_least + '个）');
				});
			}
		};
	}

	function hcProjAttachLink($scope, $element, $attrs, $formController) {
		if ($formController) {
			$scope.$watch('$parent.' + $formController.$name + '.isReadonly()', function (newValue, oldValue) {
				if (newValue === oldValue) return;

				gridApi.execute($scope.gridOptions, function (gridOptions) {
					gridOptions.api.refreshCells({
						columns: ['op'],
						force: true
					});
				});
			});
		}
	}

	function toString(value) {
		return Switch(typeof value)
			.case('string', function () {
				return value.trim();
			})
			.case('number', function () {
				return value.toString();
			})
			.default(function () {
				return '';
			})
			.result;
	}

	//使用Api注册指令
	//需传入require模块和指令定义
	return directiveApi.directive({
		module: module,
		directive: hcProjAttachDirective
	});
});