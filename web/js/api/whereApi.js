/**
 * sql条件Api
 * @since 2018-09-29
 */
define(
	['requestApi'],
	function (requestApi) {
		'use strict';

		var api = {};

		var controller = [
			'$scope', '$modalInstance', '$timeout', 'gridOptions',
			function ($scope, $modalInstance, $timeout, gridOptions) {
				$scope.title = '条件查询';

				$scope.footerRightButtons.search = {
					title: '立即搜索',
					click: function () {
						$scope.search();
					}
				};

				//分页查询
				// BaseService.pageInit($scope);
				$scope.addConfirm = function (params) {
					var line = $scope.options.api.getModel().getRow(params.rowIndex).data;
					line.initsqlwhere = $scope.initsqlwhere;
					line.sqlwhere = $scope.sqlwhere;
					if ($scope.FrmInfo.type != "checkbox") {
						$modalInstance.close(line);
					} else {
						$modalInstance.close([line]);
					}
				}

				$scope.search = function () {
					if ($scope.searchtype % 2 == 0) {
						var sql = $scope.sqlwhere_high;
					} else {
						var sql = getSqlWhere()
					}
					$modalInstance.close(sql)
				}
				$("body")
					.off("click")
					.on(
						"click",
						".j_add_line",
						function () {
							// 条件类型-不值范围或值范围
							var option_flag = $(this).closest("div.tab-pane").attr('option_flag');
							var data_type = $(this).closest("div.tab-pane").attr('data_type');
							//alert('option_flag:'+option_flag);

							var _this = $(this).closest("div.tab-pane").find('table tbody tr:last');
							var html = ' <tr >'
							if (option_flag == 1 || option_flag == 3) {
								html = html + '    <td  class="seq">或者</td>';
								html = html + '     <td> <input type="text"  class="input-sm form-control s_value"  value=""  ></td>';
							} else {
								html = html + '    <td  class="seq">并且</td>';
								html = html + '     <td> <input type="text"  class="input-sm form-control s_value"  value=""  ></td>';
							}
							if (option_flag < 3) {
								html = html
									+ '	   <td> <input type="text"  class="input-sm form-control e_value"  value=""  ></td>	'
							}
							html = html
								+ '	   <td class="text-center"><a  class="del" onclick="deleteTr(this);" style="cursor:pointer" >删除条件</a> '
								//+ '	                <a   class="add"  style="margin-left:15px;cursor:pointer ">添加条件</a>'
								+ '		</td>' + ' </tr>';
							var $html = $(html);
							if (data_type == "date") {
								var options = {
									format: 'yyyy-mm-dd',
									startView: 'day',
									todayBtn: true,
									forceParse: true,
									language: "zh-CN",
									multidate: false,
									autoclose: true,
									todayHighlight: true
								};
								$html.find("input").datepicker(options);
							}
							_this.after($html);
						});
				//分组功能
				/* var groupColumn = {
					headerName: "Group",
					width: 200,
					field: 'name',
					valueGetter: function (params) {
						if (params.node.group) {
							return params.node.key;
						} else {
							return params.data[params.colDef.field];
						}
					},
					comparator: agGrid.defaultGroupComparator,
					cellRenderer: 'group',
					cellRendererParams: function (params) {
					}
				}; */
				//定义网格的options
				$scope.options = {
					rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
					pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
					groupKeys: undefined,
					groupHideGroupColumns: false,
					enableColResize: true, //one of [true, false]
					enableSorting: true, //one of [true, false]
					enableFilter: true, //one of [true, false]
					enableStatusBar: false,
					enableRangeSelection: false,
					rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
					rowDeselection: false,
					quickFilterText: null,
					rowDoubleClicked: $scope.addConfirm,
					groupSelectsChildren: false, // one of [true, false]
					suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
					// groupColumnDef: groupColumn,
					showToolPanel: false,
					icons: {
						columnRemoveFromGroup: '<i class="fa fa-remove"/>',
						filter: '<i class="fa fa-filter"/>',
						sortAscending: '<i class="fa fa-long-arrow-down"/>',
						sortDescending: '<i class="fa fa-long-arrow-up"/>',
					}
				};
				$scope.columns = [
					{
						headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
						cellRenderer: function (params) {
							return parseInt(params.node.id) + 1
						},
						cellEditor: "文本框",
						enableRowGroup: true,
						enablePivot: true,
						enableValue: true,
						floatCell: true
					}
				];
				$scope.items = [];//列表元素
				$scope.item = {};//被选元素
				$scope.keys = [];//自定义的网格所有主键id["",""];
				$scope.tempArr = new Array();
				$scope.FrmInfo = $scope.$parent.FrmInfo || {};

				$scope.FrmInfo.thead = $scope.FrmInfo.thead || gridOptions.columnApi.getAllDisplayedColumns()
					.map(function (column) {
						return column.getColDef();
					})
					.filter(function (colDef) {
						return colDef.type !== '序号' && colDef.headerName !== '附件';
					})
					.map(function (column) {
						var result = {
							name: column.headerName,
							code: column.field,
							type: column.type || 'string'
						};

						if (column.type === '词汇') {
							result.type = 'list';

							result.dicts = column.cellEditorParams.values.map(function (value, index) {
								return {
									value: value,
									desc: column.cellEditorParams.names[index]
								};
							});
						}
						else if (column.type === '数量' || column.type === '金额')
							result.type = 'number';

						return result;
					});

				$scope.type = "default"
				$scope.cancel = function () {
					$modalInstance.dismiss({});
				};
				$scope.sqlwhere_unnull = true;
				if (typeof ($scope.FrmInfo.autoSearch) == "undefined" || $scope.FrmInfo.autoSearch == "")
					$scope.FrmInfo.autoSearch == "true"
				$scope.con = [{
					condition_name: $scope.FrmInfo.thead[0].code,
					condition_op: "center",
					type: $scope.FrmInfo.thead[0].type,
					dicts: $scope.FrmInfo.thead[0].dicts
				}, {
					condition_name: $scope.FrmInfo.thead[1].code,
					condition_op: "center",
					type: $scope.FrmInfo.thead[1].type,
					dicts: $scope.FrmInfo.thead[1].dicts
				}]

				$scope.change = function (con) {
					$.each($scope.FrmInfo.thead, function (i, item) {
						if (con == "condition_name1" && item.code == $scope.con[0].condition_name) {
							$scope.con[0].type = item.type
							$scope.con[0].dicts = item.dicts;
							$scope.con[0].condition_value = ''
						}
						else if (con == "condition_name2" && item.code == $scope.con[1].condition_name) {
							$scope.con[1].type = item.type
							$scope.con[1].dicts = item.dicts;
							$scope.con[1].condition_value = ''
						}
					})
				}

				// 高级条件
				$scope.sqlwhere_high = "";

				$scope.addLine = function (index, $event) {
					$($event.currentTarget).addClass("info").siblings("tr").removeClass("info");
					$scope.item = $scope.items[index];
				};

				$scope.enter = function (e) {
					var keycode = window.event ? e.keyCode : e.which;
					if (!$scope.FrmInfo.autoSearch) {
						$scope.search();
					}
				}

				if ($scope.FrmInfo.commitRigthNow) {
					$timeout(function () {
						$scope.search();
					}, 10)
				}

				function concat_cond(sqlwhere, addsql) {
					return HczyCommon.concat_sqlwhere(sqlwhere, addsql)
				}


				function getSqlWhereCommon(arr) {
					var sqlWhere = "";
					$.each(arr, function (i, item) {
						if (item.condition_value == "" || typeof (item.condition_value) == "undefined") {
							sqlWhere += "";
						} else {
							if (i == 1 && sqlWhere != "") {
								sqlWhere += " or "
							}
							switch (item.type) {
								case "date":
									switch (item.condition_op) {
										case "center":
											sqlWhere += " to_char(" + item.condition_name + ",'yyyy-mm-dd') like '%" + item.condition_value + "%' ";
											break;
										case "left":
											sqlWhere += " to_char(" + item.condition_name + ",'yyyy-mm-dd') like '" + item.condition_value + "%'";
											break;
										case "right":
											sqlWhere += "to_char(" + item.condition_name + ",'yyyy-mm-dd') like '%";
											break;
										case "=":
											sqlWhere += "to_char(" + item.condition_name + ",'yyyy-mm-dd') = '" + item.condition_value + QUOTE
											break;
										default:
											sqlWhere += " to_char(" + item.condition_name + ",'yyyy-mm-dd') like '%" + item.condition_value + "%' ";
									}
									break;
								default:
									switch (item.condition_op) {
										case "center":
											sqlWhere += " lower(" + item.condition_name + ") like lower('%" + item.condition_value + "%') ";
											break;
										case "left":
											sqlWhere += " lower(" + item.condition_name + ") like lower('" + item.condition_value + "%') ";
											break;
										case "right":
											sqlWhere += " lower(" + item.condition_name + ") like lower('%" + item.condition_value + "') ";
											break;
										case "=":
											sqlWhere += " lower(" + item.condition_name + ") = lower('" + item.condition_value + "')";
											break;
										default:
											sqlWhere += " lower(" + item.condition_name + ") like lower('%" + item.condition_value + "%') ";
									}
							}
						}
					})
					return sqlWhere;
				}


				function getSqlWhereCommon1(arr) {
					var sqlWhere = "";
					var len = arr.length;
					$.each(arr, function (i, item) {
						if (item.condition_value == "" || typeof (item.condition_value) == "undefined") {
							sqlWhere += "";
						} else {
							item.condition_value = String(item.condition_value).toLowerCase();
							if (item.type == "date") {
								if (item.condition_op == "center") {
									sqlWhere += (i == 1 && sqlWhere != "") ? " or to_char(" + item.condition_name + ",'yyyy-mm-dd') like '%" + item.condition_value + "%' " : " lower(" + item.condition_name + ") like '%" + item.condition_value + "%'";
								} else if (item.condition_op == "left") {
									sqlWhere += (i == 1 && sqlWhere != "") ? " or to_char(" + item.condition_name + ",'yyyy-mm-dd') like '" + item.condition_value + "%'" : " lower(" + item.condition_name + ") like '" + item.condition_value + "%' ";
								} else if (item.condition_op == "right") {
									sqlWhere += (i == 1 && sqlWhere != "") ? " or to_char(" + item.condition_name + ",'yyyy-mm-dd') like '%" + item.condition_value + QUOTE : "  lower(" + item.condition_name + ") like '%" + item.condition_value + "' ";
								}
								else if (item.condition_op == "=") {
									sqlWhere += (i == 1 && sqlWhere != "") ? " or to_char(" + item.condition_name + ",'yyyy-mm-dd') = '" + item.condition_value + QUOTE : " lower(" + arr[i] + ") = '" + item.condition_value + "' ";
								}
							} else {
								if (item.condition_op == "center") {
									sqlWhere += (i == 1 && sqlWhere != "") ? " or lower(" + item.condition_name + ") like '%" + item.condition_value + "%' " : " lower(" + item.condition_name + ") like '%" + item.condition_value + "%'";
								} else if (item.condition_op == "left") {
									sqlWhere += (i == 1 && sqlWhere != "") ? " or lower(" + item.condition_name + ") like '" + item.condition_value + "%'" : " lower(" + item.condition_name + ") like '" + item.condition_value + "%' ";
								} else if (item.condition_op == "right") {
									sqlWhere += (i == 1 && sqlWhere != "") ? " or lower(" + item.condition_name + ") like '%" + item.condition_value + QUOTE : "  lower(" + item.condition_name + ") like '%" + item.condition_value + "' ";
								}
								else if (item.condition_op == "=") {
									sqlWhere += (i == 1 && sqlWhere != "") ? " or lower(" + item.condition_name + ") = '" + item.condition_value + QUOTE : " lower(" + arr[i] + ") = '" + item.condition_value + "' ";
								}
							}
						}
					})
					console.log(arr)
					return sqlWhere;
				}

				// 查询
				function getSqlWhere() {
					if (!$scope.FrmInfo.searchlist) {
						var p_list = [];
						for (var i = 0; i < $scope.FrmInfo.thead.length; i++) {
							if ($scope.FrmInfo.thead[i].iscond) {
								p_list.push($scope.FrmInfo.thead[i].code);
							}
						}
						$scope.FrmInfo.searchlist = p_list;
					}
					var sqlWhere = "";
					// sqlWhere = BaseService.getSqlWhere($scope.FrmInfo.searchlist, $scope.searchtext, direct);
					sqlWhere = getSqlWhereCommon($scope.con);
					sqlWhere = concat_cond(sqlWhere, $scope.FrmInfo.sqlBlock);
					sqlWhere = concat_cond(sqlWhere, $scope.FrmInfo.initsql);
					sqlWhere = concat_cond(sqlWhere, $scope.sqlwhere_high);
					if ($scope.FrmInfo.postdata != undefined) {
						sqlWhere = concat_cond(sqlWhere, $scope.FrmInfo.postdata.sqlwhere);
					}
					return sqlWhere;
				}

				$scope.initsqlwhere = getSqlWhere();
				if ($scope.FrmInfo && $scope.FrmInfo.classid) {
					sessionStorage.setItem("frmInfo", JSON.stringify($scope.FrmInfo));
					$scope.FrmInfo.title = $scope.FrmInfo.title ? $scope.FrmInfo.title : "公共弹窗标题";
					var classid = $scope.FrmInfo.classid || "base_search";
					var action = $scope.FrmInfo.action || "search";
					var direct = $scope.FrmInfo.direct || "center";
					var _postdata = {};
					if ($scope.FrmInfo.postdata) {
						_postdata = $scope.FrmInfo.postdata;
					}
					//对网格的列进行拓展
					var str = "";
					for (var i = 0; i < $scope.FrmInfo.thead.length; i++) {
						if (str.indexOf($scope.FrmInfo.thead[i].code) > -1) {//去重复列
							$scope.FrmInfo.thead.splice(i, 1);
							i--;
							continue;
						}
						str += $scope.FrmInfo.thead[i].code;
						if ($scope.FrmInfo.thead[i].type == "list") {
							var object = {
								editable: false,
								filter: 'set',
								width: 150,
								cellEditor: "下拉框",
								enableRowGroup: true,
								enablePivot: true,
								enableValue: true,
								floatCell: true
							};
							for (var j = 0; j < $scope.FrmInfo.thead[i].dicts.length; j++) {
								$scope.FrmInfo.thead[i].dicts[j].value = $scope.FrmInfo.thead[i].dicts[j].id;
								//delete $scope.FrmInfo.thead[i].dicts[j].id;
								$scope.FrmInfo.thead[i].dicts[j].desc = $scope.FrmInfo.thead[i].dicts[j].name;
								//delete $scope.FrmInfo.thead[i].dicts[j].name;
							}
							object.cellEditorParams = {};
							object.cellEditorParams.values = $scope.FrmInfo.thead[i].dicts;
						} else {
							var object = {
								editable: false,
								filter: 'set',
								width: 150,
								cellEditor: "文本框",
								enableRowGroup: true,
								enablePivot: true,
								enableValue: true,
								floatCell: true
							};

							var options_name = "options_" + $scope.FrmInfo.thead[i].code;
							$scope[options_name] = {};
							$scope[options_name] = HczyCommon.copyobj($scope.options, $scope[options_name]);
							$scope[options_name].fixedGridHeight = true;
						}
						object.headerName = $scope.FrmInfo.thead[i].name;
						object.field = $scope.FrmInfo.thead[i].code;
						$scope.columns.push(object);
						$scope.keys.push(object.field);
					}
					$scope.fmax = function (e) {
						var stitle = $(e.currentTarget).attr("title");//判断是最大化还是最小化
						if (stitle == "最大化") {
							$(e.currentTarget).find("strong").html("<img src = 'images/min_pages.png'>");
							$(e.currentTarget).attr("title", "还原")
							$("#max_modal_content").parent().parent("div.modal-dialog.modal-lg").addClass("max_modal_content");//获取目标div
							$("#max_modal_content").css("height", "100%");//获取目标div
							var old_height = $("#max_slick_grid").css('height');
							var new_height = (Number(old_height.substring(0, old_height.length - 2)) + 100) + "px";
							$("#max_slick_grid").css({ 'height': new_height });
						} else if (stitle == "还原") {
							$(e.currentTarget).attr("title", "最大化")
							$(e.currentTarget).find("strong").html("<img src = 'images/max_pages.png'>");
							$("#max_modal_content").parent().parent("div.modal-dialog.modal-lg").removeClass("max_modal_content");
							$("#max_modal_content").css("height", "none");
							var old_height = $("#max_slick_grid").css('height');
							var new_height = (Number(old_height.substring(0, old_height.length - 2)) - 100) + "px";
							$("#max_slick_grid").css({ 'height': new_height });
						}
						/*window.moveTo(0,0);
						 window.resizeTo(screen.availWidth,screen.availHeight);
						 window.outerWidth=screen.availWidth;
						 window.outerHeight=screen.availHeight;*/
					}
					if (!$scope.FrmInfo.type) {//默认弹窗为单选
						$scope.ok = function () {
							var cell = $scope.options.api.getFocusedCell();
							if (cell == null) {
								swalApi.info("请先选中行!");
								return;
							}
							var line = $scope.options.api.getModel().getRow(cell.rowIndex).data;
							line.sqlwhere = $scope.sqlwhere;
							line.initsqlwhere = $scope.initsqlwhere;
							$modalInstance.close(line);
						};
					} else if ($scope.FrmInfo.type == "checkbox") {//多选
						$scope.options.selectAll = true;
						$scope.ok = function () {
							var data = $scope.options.api.getSelectedRows();
							$scope.tempArr = data;
							$modalInstance.close($scope.tempArr);
						};
					}
					var back_prop = $scope.FrmInfo.backdatas || classid + "s";
					$scope._pageLoad = function (postdata) {
						HczyCommon.copyobj(_postdata, postdata);
						postdata.sqlwhere = postdata.sqlwhere || ""
						if (getSqlWhere()) {
							postdata.sqlwhere = getSqlWhere();
						}
						if ($scope.FrmInfo.checkbox_value) {
							//隐藏掉弹出框的分页页面
							$scope.FrmInfo.hide = true;
							postdata.sqlwhere = concat_cond(postdata.sqlwhere, ' 1=1 or (' + $scope.FrmInfo.checkbox_key + ' in(' + $scope.FrmInfo.checkbox_value + '))');
						}
						if ($scope.FrmInfo.type != "sqlback") {
							if ($scope.FrmInfo.checkbox_value) {
								// postdata.pagination="pn=1,ps=100000,pc=0,cn=0,ci=0";
								delete postdata.pagination;
							}
							if (postdata.sqlwhere == "") {
								postdata.sqlwhere = " 1=1 ";
								$scope.sqlwhere_unnull = false;
							}
							requestApi({
								classId: classid,
								action: action,
								data: postdata
							})
								.then(function (data) {
									if ($scope.sqlwhere_unnull) {
										$scope.sqlwhere = data.sqlwhere;//记录sqlwhere
									}
									$scope.sqlwhere_unnull = true;
									if ($scope.FrmInfo.type != "checkbox") {
										$scope.items = data[back_prop];//返回的数据组？显示的字段？search方法不一样?
										$scope.options.api.setRowData($scope.items);
										$scope.options.columnApi.autoSizeColumns();
									} else {
										var _result = [];
										var checkbox_value = [];
										if ($scope.FrmInfo.checkbox_value) {
											if ($scope.FrmInfo.checkbox_value.split(",")) {
												var checkbox_value = $scope.FrmInfo.checkbox_value.split(",");
											}
											for (var j = 0; j < data[back_prop].length; j++) {
												for (var i = 0; i < checkbox_value.length; i++) {
													if (data[back_prop][j][$scope.FrmInfo.checkbox_key] == checkbox_value[i]) {
														_result.push(data[back_prop][j]);
														break;
													}
												}
											}
										}
										var check_length = _result.length;
										for (var j = 0; j < data[back_prop].length; j++) {
											for (var i = 0; i < checkbox_value.length; i++) {
												if (data[back_prop][j][$scope.FrmInfo.checkbox_key] == checkbox_value[i]) {
													break;
												}
											}
											if (i == checkbox_value.length) {
												_result.push(data[back_prop][j]);
											}
										}

										$scope.options.api.setRowData(_result);
										var nodes = $scope.options.api.getModel().rootNode.childrenAfterSort;
										for (var j = 0; j < check_length; j++) {
											$scope.options.api.clipboardService.selectionController.selectedNodes[nodes[j].id] = nodes[j];
											nodes[j].selected = true
										}
										$scope.options.api.refreshRows(nodes);
										$scope.options.columnApi.autoSizeColumns();
										$scope.items = _result;//返回的数据组？显示的字段？search方法不一样?
									}
									if (!$scope.items.length) {
										// BaseService.notice("未有搜索记录!", "alert-warning");
									}
									// BaseService.pageInfoOp($scope, data.pagination);
								});
						} else {
							$modalInstance.close(postdata);
						}
					}
					var realtime = $scope.FrmInfo.realtime || false;

					// $timeout(function () {
					//     $scope.options.columnApi.autoSizeColumns();
					//     if (realtime) {
					//         $scope.search();
					//     }
					// }, 10)
				} else {

				}
				$scope.showonetime = $scope.FrmInfo.type == "sqlback" ? true : false;
				$scope.conditions = true;
				$scope.searchtype = 1
				$scope.toggleFilter = function (e) {
					$(e.currentTarget).closest("div.modal-body").find("div.high_filter").slideToggle();
					$scope.conditions = !$scope.conditions;
					$scope.searchtype += 1;
				};

				$scope.columns_bh = [{
					headerName: "关系", field: "rel", editable: false, filter: 'set', width: 70,
					cellEditor: "文本框",
					enableRowGroup: true,
					enablePivot: true,
					enableValue: true,
					floatCell: true
				}, {
					headerName: "值", field: "value", editable: true, filter: 'set', width: 180,
					cellEditor: "文本框",
					enableRowGroup: true,
					enablePivot: true,
					enableValue: true,
					non_empty: true,
					floatCell: true
				}];
				$scope.cond_lines = [];
				for (var i = 0; i < 1000; i++) {
					$scope.cond_lines.push({ rel: "或者" });
				}

			}
		];

		/**
		 * 用表格产生条件
		 * @param params = {
		 *     gridOptions: 表格选项 - object
		 * }
		 * @return {Promise<string>}
		 * @since 2018-09-29
		 */
		api.gridWhere = function (params) {
			return ['$modal', '$q', function ($modal, $q) {
				if (!params || !params.gridOptions)
					return $q.rejecct('缺少参数 gridOptions');

				return $modal
					.open({
						//windowTemplateUrl: '',
						templateUrl: 'views/common/Pop_Common_High_New.html',
						controller: controller,
						resolve: {
							gridOptions: function () {
								return params.gridOptions;
							}
						}
					})
					.result;
			}].callByAngular();
		};

		api.getWhereByGridAndKeyword = getWhereByGridAndKeyword;

		/**
		 * 根据表格和关键字产生搜索条件
		 * @param gridOptions
		 * @param {string} keyword 关键字
         * @param {string[]} keys 搜索字段
		 * @returns {string}
		 */
		function getWhereByGridAndKeyword(gridOptions, keyword, keys) {
			if (!keyword) return '1 = 1';

			if (!keys)
				keys = gridOptions.columnApi
					.getAllDisplayedColumns()
					.filter(function (column) {
						return column.getColDef().type !== '序号';
					})
					.map(function (column) {
						return column.getColDef().field;
					});

			var sqlWhere = keys
				.map(function (key) {
					return likeAll(key, keyword);
				})
				.join(' or ');

			if (sqlWhere)
				sqlWhere = '(' + sqlWhere + ')';
			else
				sqlWhere = '1 = 1';

			return sqlWhere;
		}

		api.escape = escape;

		/**
		 * SQL转义
		 * @param {string} s
		 * @param {boolean} [addQuote=false] 两边是否添加单引号
		 * @returns {string}
		 */
		function escape(s, addQuote) {
			if (s == null) s = '';
			else if (typeof s !== 'string') s += '';

			//若字符串包含单引号，需要转义，以免SQL注入
			if (s.includes("'")) {
				(function () {
					var escapedString = '';

					Array.prototype.forEach.call(s, function (c) {
						if (c === "'") escapedString += "'";
						escapedString += c;
					});

					s = escapedString;
				})();
			}

			if (addQuote) s = "'" + s + "'";

			return s;
		}

		api.likeAll = likeAll;

		function likeAll(key, value) {
			return like('all', key, value);
		}

		api.likeLeft = likeLeft;

		function likeLeft(key, value) {
			return like('left', key, value);
		}

		api.likeRight = likeRight;

		function likeRight(key, value) {
			return like('right', key, value);
		}

		function like(position, key, value) {
			if (!value)
				throw new Error('使用 like 条件必须有值');

			var needQuoteEscape = value.includes("'"),							//是否需要单引号转义
				needLikeEscape = value.includes('%') || value.includes('_'),	//是否需要 like 条件转义
				needEscape = needQuoteEscape || needLikeEscape;					//是否需要转义

			var escapeCharForLike = '\\';

			if (needEscape) {
				(function () {
					var escapedValue = '';

					Array.prototype.forEach.call(value, function (c) {
						if (c === "'") escapedValue += "'";
						else if (needLikeEscape && (c === '%' || c === '_' || c === escapeCharForLike) ) {
							escapedValue += escapeCharForLike;
						}
						escapedValue += c;
					});

					value = escapedValue;
				})();
			}

			var where = key + " like ";

			where += "'";

			if (position === 'all' || position === 'left')
				where += '%';

			where += value;

			if (position === 'all' || position === 'right')
				where += '%';

			where += "'";

			if (needLikeEscape)
				where += " escape '" + escapeCharForLike + "'";

			return where;
		}

		function and(params) {

		}

		return api;
	}
);