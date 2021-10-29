/**
 * 导入控制台
 * @since 2018-12-11
 */
(function (defineFn) {
	define(['module', 'directiveApi', 'fileApi', 'swalApi', 'requestApi', 'directive/hcInput', 'directive/hcButtons', 'directive/hcProgress', 'directive/hcGrid'], defineFn);
})(function (module,   directiveApi,   fileApi,   swalApi,   requestApi) {

	/**
	 * 导入控制台指令
	 * @since 2018-12-11
	 */
	function hcImportConsoleDirective() {
		return {
			scope: {
				getImportSetting: '&hcImportConsole'
			},
			templateUrl: directiveApi.getTemplateUrl(module),
			controller: HcImportConsoleController
		};
	}

	/**
	 * 导入控制台控制器
	 * @since 2018-12-11
	 */
	HcImportConsoleController.$inject = ['$scope', '$element', '$q'];
	function HcImportConsoleController(   $scope,   $element,   $q) {
		$element.css({
			'display': 'flex',
			'flex-direction': 'column',
			'flex': '1',
			'padding': '8px 16px'
		});

		var importSetting = $scope.getImportSetting() || {};

		//每个任务的状态
		var waiting = 0, //等待
			running = 1, //执行
			succeeded = 2, //成功
			failed = 3; //失败

		/**
		 * 整体状态
		 */
		$scope.status = {
			running: false,
			wantToPause: false
		};

		/**
		 * 统计
		 */
		$scope.count = {
			all: 0,
			waiting: 0,
			succeeded: 0,
			failed: 0
		};

		/**
		 * 按钮
		 */
		$scope.buttons = {
			start: {
				title: function () {
					if (!$scope.progress || $scope.progress.value === 0)
						return '开始导入';

					if ($scope.progress.value < $scope.progress.max)
						return '继续导入';

					if ($scope.count.failed)
						return '再次尝试导入失败的记录';

					return '导入完毕';
				},
				click: start,
				hide: function () {
					return $scope.status.running || (!$scope.count.waiting && !$scope.count.failed);
				}
			},
			pause: {
				title: function () {
					return $scope.status.wantToPause ? '正在暂停' : '暂停导入';
				},
				click: pause,
				hide: function () {
					return !$scope.status.running;
				},
				disabled: function () {
					return $scope.status.wantToPause;
				}
			}
		};

		/**
		 * 表格
		 */
		$scope.gridOptions = {
			columnDefs: [{
				type: '序号'
			}],
			hcEvents: {
				cellClicked: function (params) {
					$scope.currRow = params.node.data;
				}
			}
		};

		$scope.chooseFile = chooseFile;

		/**
		 * 选择文件
		 */
		function chooseFile() {
			if ($scope.status.running) {
				return $q.reject('正在导入中，不能选择文件');
			}

			return $q
				.when({
					multiple: false,
					accept: '.xls,.xlsx'
				})
				.then(fileApi.uploadFile)
				.then(function (docs) {
					$scope.doc = docs[0];
				})
				.then(function () {
					return requestApi.getExcelData($scope.doc.docid);
				})
				.then(function (response) {
					$scope.gridOptions.columnDefs = response.titles.map(function (title) {
						return {
							field: title,
							headerName: title,
							editable: function (params) {
								if ($scope.status.running)
									return false;

								var import_stat = params.data.import_stat;

								return [waiting, failed].indexOf(import_stat) !== -1;
							}
						};
					});

					$scope.gridOptions.columnDefs.unshift({
						type: '序号'
					}, {
						field: 'import_stat',
						headerName: '导入状态',
						pinned: 'left',
						type: '词汇',
						cellEditorParams: {
							names: ['等待中', '导入中', '成功', '失败'],
							values: [waiting, running, succeeded, failed]
						},
						cellStyle: function (params) {
							var color = null;
							switch (params.data.import_stat) {
								case waiting:
									color = 'orange';
									break;

								case running:
									color = 'blue';
									break;

								case succeeded:
									color = 'green';
									break;

								case failed:
									color = 'red';
									break;
							}

							return {
								color: color
							};
						}
					}, {
						field: 'import_msg',
						headerName: '反馈信息',
						pinned: 'left'
					});

					response.rows.forEach(function (row) {
						row.import_stat = waiting;
						row.import_msg = '';
					});

					$scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);

					$scope.gridOptions.hcApi.setRowData(response.rows);

					$scope.count.all = response.rows.length;
					$scope.count.waiting = $scope.count.all;
					$scope.count.succeeded = 0;
					$scope.count.failed = 0;

					$scope.progress.value = 0;
					$scope.progress.max = $scope.count.waiting;
				})
				.then(function () {
					return swalApi.confirm({
						title: '立即开始导入吗？',
						confirmButtonText: '立即开始',
						cancelButtonText: '稍候开始'
					});
				})
				.then(start);
		}

		/**
		 * 开始导入
		 */
		function start() {
			//停止表格编辑
			$scope.gridOptions.api.stopEditing();

			if ($scope.status.running)
				throw new Error('正在导入中，请勿重复启动导入');

			//导入任务列表
			var tasks = [];

			var importStatColumn = $scope.gridOptions.columnApi.getColumn('import_stat');
			var importMsgColumn = $scope.gridOptions.columnApi.getColumn('import_msg');

			//取【等待中】的行
			$scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
				var data = node.data;

				if (data.import_stat === waiting) {
					tasks.push({
						node: node,
						data: data
					});
				}
			});

			//若没有【等待中】的行
			//把【失败】的行标记为【等待中】
			if (!tasks.length) {
				$scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
					var data = node.data;

					if (data.import_stat === failed) {
						data.import_stat = waiting;
						data.import_msg = '再次尝试导入';
						$scope.count.failed--;
						$scope.count.waiting++;

						$scope.gridOptions.api.refreshCells({
							columns: [importStatColumn, importMsgColumn],
							rowNodes: [node]
						});

						tasks.push({
							node: node,
							data: data
						});
					}
				});

				$scope.progress.value = 0;
				$scope.progress.max = tasks.length;
			}

			if (!tasks.length) {
				return swalApi.info('已经全部导入完毕');
			}

			$scope.status.running = true;

			tasks.forEach(function (task, taskIndex) {
				var taskTrigger = $q.defer();

				task.start = taskTrigger.resolve;

				if (taskIndex > 0) {
					tasks[taskIndex - 1].nextTask = task;
				}

				taskTrigger.promise
					.then(function () {
						$scope.gridOptions.hcApi.setFocusedCell(task.node.rowIndex, 'import_stat');

						task.data.import_stat = running;

						$scope.gridOptions.api.refreshCells({
							columns: [importStatColumn],
							rowNodes: [task.node]
						});
					})
					.then(function () {
						return importRequest(task.data)
							.finally(function () {
								$scope.count.waiting--;
								$scope.progress.value++;
							})
							.then(
								function success() {
									task.data.import_stat = succeeded;
									task.data.import_msg = '';
									$scope.count.succeeded++;
								},
								function error(reason) {
									task.data.import_stat = failed;
									task.data.import_msg = reason;
									$scope.count.failed++;
								}
							)
							.finally(function () {
								$scope.gridOptions.api.refreshCells({
									columns: [importStatColumn, importMsgColumn],
									rowNodes: [task.node]
								});
							});
					})
					.finally(function () {
						if ($scope.status.wantToPause) {
							ending();
						}
						else {
							task.nextTask.start();
						}
					});
			});

			tasks[tasks.length - 1].nextTask = {
				start: ending
			};

			tasks[0].start();
		}

		/**
		 * 暂停导入
		 */
		function pause() {
			if ($scope.status.wantToPause)
				throw new Error('正在暂停导入中，请勿重复暂停导入');

			$scope.status.wantToPause = true;
		}

		/**
		 * 标记结束
		 */
		function ending() {
			$scope.status.running = false;
			$scope.status.wantToPause = false;
		}

		/**
		 * 单次的导入请求
		 * @param data
		 */
		function importRequest(data) {
			var postParams = {
				classId: importSetting.classId,
				action: importSetting.action || 'import',
				data: importSetting.data || {},
				noShowError: true,
				noShowWaiting: true
			};

			postParams.data[postParams.classId + 's'] = [data];

			return requestApi.post(postParams);
		}

	}

	//使用Api注册指令
	//需传入require模块和指令定义
	return directiveApi.directive({
		module: module,
		directive: hcImportConsoleDirective
	});
});