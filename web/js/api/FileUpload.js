/**
 * 上传文件
 * 支持多文件同时上传
 * 上传成功后，承诺返回 doc 数组
 * @since 2018-11-08
 */
define(
	['jquery', 'angular', '$q'],
	function ($, angular, $q) {

        /**
         * 上传附件服务
         */
		var FileUpload = function () {
			return $q
				.when(true)
				.then(FileUpload.chooseFile)
				.then(FileUpload.uploadMultiFiles) //上传多个文件
				.catch(function (e) {
					//失败时输出到控制台
					console.error('上传文件失败', e);
				});
		};

        /**
         * 上传多个文件
         * @param {FileList|File[]|Input} fileList input 的 FileList 对象，或 File 对象数据，或 input
         * @return {Promise<CPCDoc[]>} 返回文件对象数组
         * @since 2018-11-08
         */
		FileUpload.uploadMultiFiles = function (fileList) {
			//若传入的是 input 元素
			if (angular.isElement(fileList)) {
				var div = $(fileList);

				if (div.is('input'))
					fileList = div[0].files;
			}

			if (!fileList || !fileList.length)
				return $q.reject('未选择任何文件');

			var maxLength = 20;
			if (fileList.length > maxLength)
				return $q.reject('您选择了' + fileList.length + '个文件，但一次最多只能上传' + maxLength + '个文件');

			var formData = new FormData();

			Array.prototype.slice.apply(fileList).forEach(function (file, index) {
				formData.append('docFile' + index, file);
			});

			return $q
				.when({
					type: 'POST',
					url: '/web/cpc/filesuploadsave2.do',
					data: formData,
					dataType: 'json',
					cache: false,
					processData: false,
					contentType: false
				})
				.then($.ajax)
				.then(function (response) {
					if (response.success === true || response.success === 'true')
						return response.data;

					console.error('上传文件失败', response);
					return $q.reject(response.msg);
				})
				;
		};

		/**
		 * 选择文件
		 * @param params = {
		 *     multiple   : boolean 多选
		 *     returnInput: boolean 返回文件输入框
		 * }
		 * @return Promise<File|File[]> 承诺返回 单选时，返回 File 对象；多选时，返回 File 对象数组
		 */
		FileUpload.chooseFile = function (params) {
			//当只传一个参数，且为 true 或 false 时，认为该参数是 multiple: boolean 多选
			if (arguments.length === 1 && angular.isBoolean(params)) {
				params = {
					multiple: params
				};
			}
			else {
				params = params || {};
			}

			//选完文件了吗？
			var fileChosen = $q.defer();

			//文件选择器
			var $fileInput = $('<input>')
				.attr('type', 'file')			//类型：文件
				.css('display', 'none')			//隐藏
				.on('change', function () {		//改变事件
					//已经选完附件
					fileChosen.resolve();
				})
				.appendTo('body');

			if (params.multiple)
				$fileInput.attr('multiple', 'multiple'); //多选

			var fileInput = $fileInput[0];

			//启动文件选择器
			$fileInput.click();

			return fileChosen.promise
				.then(function () {
					if (!fileInput.files || !fileInput.files.length)
						return $q.reject('未选择任何文件');

					//若要求返回文件输入框
					if (params.returnInput)
						return $fileInput;

					//若是多选，返回 File 数组
					if (params.multiple)
						return Array.prototype.slice.apply(fileInput.files);

					//单选返回单个 File 对象
					return fileInput.files[0];
				})
				.finally(function () {
					//选择完毕移除文件选择器
					if (!params.returnInput)
						$fileInput.remove();
				});
		};

		return FileUpload;
	}
);