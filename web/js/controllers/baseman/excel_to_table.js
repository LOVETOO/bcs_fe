/**
 * 导入 Excel 到数据库表
 */
define(['module', 'controllerApi', 'fileApi', 'swalApi', 'jquery', 'directive/hcBox', 'directive/hcInput', 'directive/hcButtons'], function (module, controllerApi, fileApi, swalApi, $) {

	ExcelToTable.$inject = ['$scope'];
	function ExcelToTable(   $scope) {

		var fileInput;

		$scope.$on('$destroy', function () {
			if (fileInput) {
				fileInput.remove();
			}
		});

		/**
		 * 选择 Excel
		 */
		$scope.chooseExcel = function () {
			return fileApi
				.chooseFile({
					multiple: false,
					accept: '.xls,.xlsx',
					returnInput: true
				})
				.then(function () {
					fileInput = arguments[0];

					$scope.fileName = fileInput[0].files[0].name;

					(function () {
						var lastIndexOfDot = $scope.fileName.lastIndexOf('.');

						$scope.tableName = $scope.fileName.substring(0, lastIndexOfDot);
					})();

					$('#error').addClass('ng-hide');
				});
		};

		/**
		 * 导入 Excel
		 */
		$scope.importExcel = function () {
			var formData = new FormData();

			formData.append('excelFile', fileInput[0].files[0]);
			formData.append('tableName', $scope.tableName);

			return $.ajax({
				type: 'POST',
				url: '/web/scp/excel_to_table.do',
				data: formData,
				dataType: 'json',
				processData: false,
				contentType: false,
				success: function (data) {
					$('#error').addClass('ng-hide');

					swalApi.success('导入成功');
				},
				error: function (response) {
					$('#error > iframe')[0].contentWindow.document.body.innerHTML = response.responseText;
					$('#error').removeClass('ng-hide');
				}
			});
		};

		$scope.$watch('tableName', function (tableName) {
			if (tableName) {
				$scope.sql = 'select * from "' + tableName.toUpperCase() + '"';
			}
			else {
				$scope.sql = '';
			}
		});

	}

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: ExcelToTable
	});
});