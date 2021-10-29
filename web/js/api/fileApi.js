/**
 * 文件相关Api
 * @since 2018-11-10
 */
define(
	['require', 'exports', 'jquery', 'angular', '$q', '$timeout', 'requestApi', 'numberApi', 'swalApi', 'strApi', 'openBizObj'],
	function (require, api, $, angular, $q, $timeout, requestApi, numberApi, swalApi, strApi, openBizObj) {

		$timeout(function () {
			openBizObj = require('openBizObj');
		}, 100, false);

		/**
		 * 判断对象是不是文件
		 * @return {boolean}
		 * @since 2018-11-10
		 */
		api.isFile = function isFile(obj) {
			return obj instanceof File;
		};

		/**
		 * 取文件后缀名
		 * @param {string} file 文件名
		 * @param {boolean} withDot 返回的后缀名是否要包含点号，默认为`false`
		 * @return {string}
		 * @since 2019-02-15
		 */
		api.getSuffix = function getSuffix(file, withDot) {
			//最后一个点号位置
			var lastIndexOfDot = file.lastIndexOf('.');
			if (lastIndexOfDot < 0) return '';

			var suffixIndex = lastIndexOfDot;
			if (!withDot) suffixIndex++;

			//文件后缀名
			var suffix = file.substr(suffixIndex).toLowerCase();

			return suffix;
		};

		/**
		 * 判断文件是否匹配指定的后缀
		 * @return {boolean}
		 * @since 2019-02-21
		 */
		api.isSuffixMatch = function isSuffixMatch(file, suffixToMatch) {
			//文件名
			var name = getFileName(file);
			if (!name) return false;

			//文件后缀名
			var suffix = api.getSuffix(name);
			if (!suffix) return false;

			if (angular.isArray(suffixToMatch)) { }
			else if (angular.isString) {
				suffixToMatch = strApi.commonSplit(suffixToMatch);
			}
			else
				return false;

			return suffixToMatch.indexOf(suffix) >= 0;
		};

		/**
		 * 判断文件是否图片
		 * @return {boolean}
		 * @since 2019-02-13
		 */
		api.isImage = function isImage(file) {
			return api.isSuffixMatch(file, [
				'jpg',
				'jpeg',
				'gif',
				'png',
				'bmp'
			]);
		};

		/**
		 * 判断文件是否`PDF`文件
		 * @return {boolean}
		 * @since 2019-02-21
		 */
		api.isPDF = function isPDF(file) {
			return api.isSuffixMatch(file, ['pdf']);
		};

		/**
		 * 判断文件是否`Office`文件
		 * @return {boolean}
		 * @since 2019-02-21
		 */
		api.isOffice = function isOffice(file) {
			return api.isWord(file) || api.isExcel(file) || api.isPowerPoint(file);
		};

		/**
		 * 判断文件是否`Word`文件
		 * @return {boolean}
		 * @since 2019-02-21
		 */
		api.isWord = function isWord(file) {
			return api.isSuffixMatch(file, ['doc', 'docx']);
		};

		/**
		 * 判断文件是否`Excel`文件
		 * @return {boolean}
		 * @since 2019-02-21
		 */
		api.isExcel = function isExcel(file) {
			return api.isSuffixMatch(file, ['xls', 'xlsx']);
		};

		/**
		 * 判断文件是否`PowerPoint`文件
		 * @return {boolean}
		 * @since 2019-02-21
		 */
		api.isPowerPoint = function isPowerPoint(file) {
			return api.isSuffixMatch(file, ['ppt', 'pptx']);
		};

		/**
		 * 取文件名
		 * @param file
		 */
		function getFileName(file) {
			var name;

			if (angular.isString(file))
				name = file;
			else if (api.isFile(file))
				name = file.name;
			else if (angular.isObject(file))
				name = file.docname;
			else
				name = '';

			name = name || '';

			return name;
		}

		var CANCEL_CHOOSE_FILE = '取消选择文件';

		/**
		 * 选择文件
		 * @param params = {
		 *     multiple   : boolean 多选，默认为 true
		 *     accept     : string  接受的文件类型
		 *     returnInput: boolean 返回文件输入框，默认为 false
		 * }
		 * @return Promise<File[]|jQuery<input>> 承诺返回 File 对象数组
		 * @since 2018-11-10
		 */
		api.chooseFile = (function () {
			//参数默认值
			var defaults = {
				multiple: true,		//默认多选
				accept: '',			//默认接受所有类型的文件
				returnInput: false	//默认不返回 input
			};

			return function chooseFile(params) {
				var $fileInput,		//文件选择器(jQuery)
					fileInput;		//文件选择器(Dom)

				return $q
					.when()
					//处理参数
					.then(function () {
						//当只传一个参数时
						if (arguments.length === 1) {
							//若唯一实参是 boolean 类型，认为该参数是 multiple: boolean 多选
							if (params === true || params === false) {
								params = {
									multiple: params
								};
							}
							//若唯一实参是 string 类型，认为该参数是 accept: string 接受的文件类型
							else if (angular.isString(params)) {
								params = {
									accept: params
								};
							}
							else {
								params = params || {};
							}
						}
						else {
							params = params || {};
						}

						//填充默认值
						params = angular.extend({}, defaults, params);
					})
					//创建文件选择器
					.then(function () {
						//文件选择器
						$fileInput = $('<input>');
						fileInput = $fileInput[0];
					})
					//处理文件选择器
					.then(function () {
						$fileInput
							.attr('type', 'file')			//类型：文件
							.css('position', 'fixed')		//移出视野
							.css('left', '-1000px')			//移出视野
							.css('top', '-1000px')			//移出视野
							.appendTo('body');

						if (params.multiple)
							$fileInput.attr('multiple', 'multiple'); //多选

						if (params.accept)
							$fileInput.attr('accept', params.accept); //接受的文件类型
					})
					//启动文件选择器
					.then(function () {
						var fileChosen = $q.defer();

						//把焦点放在文件选择器上
						$fileInput.focus();

						//绑定【改变事件】
						$fileInput.one('change', function () {
							fileChosen.resolve();
						});

						//绑定【获得焦点事件】
						$fileInput.one('focus', function () {
							//【弹出】文件选择窗口时，文件选择器会【失去焦点】
							//【关闭】文件选择窗口时，文件选择器会重新【获得焦点】
							//由于直接点击【关闭】或【取消】按钮关闭文件选择窗口后不会触发【改变事件】
							//只能在重新【获得焦点事件】里判断是选择了文件还是没选
							//而且必须延时等待触发【改变事件】后再判断
							$timeout(500).then(function () {
								if (!fileInput.files || !fileInput.files.length)
									fileChosen.reject(CANCEL_CHOOSE_FILE);
							});
						});

						//触发【点击事件】
						$fileInput.click();

						return fileChosen.promise;
					})
					//返回选择结果
					.then(function () {
						if (!fileInput.files || !fileInput.files.length)
							return $q.reject('未选择任何文件');

						//若要求返回文件输入框
						if (params.returnInput)
							return $fileInput;

						//返回 File 数组
						return Array.prototype.slice.call(fileInput.files);
					})
					//移除文件选择器
					.finally(function () {
						//选择完毕移除文件选择器
						if (!params.returnInput && $fileInput)
							$fileInput.remove();
					})
					//输出异常
					.catch(function (e) {
						if (e !== CANCEL_CHOOSE_FILE)
							console.error('选择文件失败', e);

						return $q.reject(e);
					})
					;
			};
		})();

		/**
		 * 上传文件
		 * @param params = {
		 *     multiple   : boolean 多选，默认为 true
		 *     accept     : string  接受的文件类型
		 *     files      : File[]  File 对象数组，若传了文件，则上传该文件；若没传，则让用户选择
		 * }
		 * @return Promise<CPCDoc[]> 承诺返回 CPCDoc 对象数组
		 * @since 2018-11-10
		 */
		api.uploadFile = (function () {
			//参数默认值
			var defaults = {
				multiple: true,		//默认多选
				accept: '',			//默认接受所有类型的文件
				files: []			//默认要用户选择
			};

			return function uploadFile(params) {
				//实参
				var actualArguments = Array.prototype.slice.call(arguments);

				return $q
					.when()
					//处理实参
					.then(function () {
						//若每个实参都是 File 对象
						if (actualArguments.every(api.isFile)) {
							params = {
								files: actualArguments
							};
						}
						//若实参只有1个
						else if (actualArguments.length === 1) {
							//若唯一实参是数组
							if (angular.isArray(params)) {
								params = {
									files: params
								};
							}
							//若唯一实参是 input 元素
							else if ($(params).is('input')) {
								var input = $(params)[0];

								params = {
									files: input ? Array.prototype.slice.call(input.files) : []
								};
							}
							//若唯一实参是 boolean 类型，认为该参数是 multiple: boolean 多选
							else if (params === true || params === false) {
								params = {
									multiple: params
								};
							}
							//若唯一实参是 string 类型，认为该参数是 accept: string 接受的文件类型
							else if (angular.isString(params)) {
								params = {
									accept: params
								};
							}
							else {
								params = params || {};
							}
						}
						else {
							params = params || {};
						}

						//填充默认值
						params = angular.extend({}, defaults, params);
					})
					//选择文件
					.then(function () {
						//若已在实参传递文件，直接把该文件上传即可
						//否则需要用户选择文件
						if (!params.files.length) {
							params.returnInput = false;
							return api.chooseFile(params).then(function (files) {
								params.files = files;
							});
						}
					})
					//校验文件合法性
					.then(function () {
						var maxLength = 20;
						if (params.files.length > maxLength) {
							var msg = '您选择了' + params.files.length + '个文件，但一次最多只能上传' + maxLength + '个文件';
							return swalApi.error(msg).then($q.reject.bind($q, msg));
						}
					})
					//生成请求配置
					.then(function () {
						var formData = new FormData();

						params.files.forEach(function (file, index) {
							formData.append('docFile' + index, file);
						});

						IncRequestCount();

						return {
							type: 'POST',
							url: '/web/scp/filesuploadsave2.do',
							data: formData,
							dataType: 'json',
							cache: false,
							processData: false,
							contentType: false,
							xhr: function () {        //ajax进度条，直接拿过去就可以用
								var xhr = $.ajaxSettings.xhr();
								if (xhr.upload) {
									var html = "<div class='skillbar'><div class='progress-title'>文件上传进度</div><div class='progress-bar progress-bar-striped progress-bar-div active' role='progressbar' aria-valuenow=''aria-valuemin='0' aria-valuemax='100' style='width:0'></div></div>";
									$('body').append(html);
									xhr.upload.addEventListener("progress", function (e) {
										var loaded = e.loaded; //已经上传大小情况
										var tot = e.total; //附件总大小
										var per = Math.floor(100 * loaded / tot); //已经上传的百分比
										$('.progress-bar-div').css('width', per + '%');   //这里指的是进度条的宽度等于完成的百分比
										$('.progress-bar-div').prop('aria-valuenow',per);
										$('.progress-bar-div').html(per + '%');
									}, false);
									return xhr;
								}
							},
						};
					})
					//发送请求
					.then($.ajax)
					.finally(DecRequestCount)
					//请求响应
					.then(function (response) {
						if (response.success === true || response.success === 'true') {
							setTimeout(function () {
								$('.skillbar').remove();
							}, 500);
							return response.data;
						}
						return $q.reject(response);
					})
					//输出异常
					.catch(function (e) {
						if (e === CANCEL_CHOOSE_FILE)
							return $q.reject(e);
						setTimeout(function () {
							$('.skillbar').remove();
						}, 500);
						console.error('上传文件失败', e);
						return swalApi.error('上传文件失败').then($q.reject.bind($q, e));
					})
					;
			};
		})();

		/**
		 * 下载文件
		 * @param params = {}
		 */
		api.downloadFile = function downloadFile(params) {
			var docId;

			return $q
				.when()
				.then(function () {
					docId = getDocId(params);

					if (!docId)
						throw new Error('下载文件失败，参数：', params);

					// window.open('/downloadfile.do?docid=' + docId);

					if (!top.downloadFileIframe) {
						top.downloadFileIframe = top.$('<iframe/>', {
							style: 'display:none;',
							onload: function () {
								console.log('download done', arguments);
							}
						}).appendTo('body');
					}

					top.downloadFileIframe.attr('src', '/downloadfile.do?docid=' + docId);
				});
		};

		/**
		 * 打开文件
		 * @param params = {}
		 */
		api.openFile = function openFile(params) {
			var docId, rev;

			return $q
				.when()
				.then(function () {
					docId = getDocId(params);

					if (!docId)
						throw new Error('打开文件失败，参数：', params);

					if (params.docname && params.downloadcode)
						return params;

					rev = numberApi.toNumber(params.rev, -1);

					return requestApi.post({
						classId: 'scpdoc',
						action: 'select',
						data: {
							docid: docId,
							rev: rev
						}
					});
				})
				.then(function (doc) {
					//根据文件类型使用不同的打开方式
					var fileName = doc.docname;

					//图片
					if (api.isImage(fileName)) {
						return openBizObj({
							imageId: docId
						});
					}

					//PDF
					else if (api.isPDF(fileName)) {
						window.open('/viewPDF.jsp?' + $.param({
							// loginguid: strLoginGuid,
							// docid: docId,
							filename: doc.docname
						}) + '&filecode=' + doc.downloadcode);
					}

					//Office
					else if (api.isOffice(fileName)) {
						window.open('/viewFile.jsp?' + $.param({
							// loginguid: strLoginGuid,
							// docid: docId,
							filename: doc.docname
						}) + '&filecode=' + doc.downloadcode);

						window.open('https://view.officeapps.live.com/op/view.aspx?' + $.param({
							src: location.origin + '/downloadfile.do?docid=' + docId
						}));
					}

					//其他的下载
					else {
						return api.downloadFile(doc);
					}
				});
		};

		/**
		 * 取 docId
		 * @param params
		 */
		function getDocId(params) {
			if (angular.isNumber(params) || angular.isString(params))
				docId = params;
			else if ('docId' in params)
				docId = params.docId;
			else if ('docid' in params)
				docId = params.docid;
			else if ('doc_id' in params)
				docId = params.docid;
			else
				docId = 0;

			return numberApi.toNumber(docId);
		}

		/**
		 * 选择 Excel 并返回数据
		 * @return {Promise}
		 */
		api.chooseExcelAndGetData = function chooseExcelAndGetData() {
			return $q
				.when({
					multiple: false,
					accept: '.xls,.xlsx'
				})
				.then(api.uploadFile)
				.then(function (docs) {
					return docs[0].docid;
				})
				.then(requestApi.getExcelData);
		};

	}
);