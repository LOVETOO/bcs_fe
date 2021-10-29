/**
 * 温馨提示框
 * @since 2018-09-17
 */
define(
	['plugins/sweetalert/sweetalert.min', 'angular', '$q', '$timeout'],
	function (swal, angular, $q, $timeout) {

		top.require(['plugins/sweetalert/sweetalert.min'], function (swalOfTop) {
			swal = swalOfTop;
		});

		//设置提示窗口的默认值
		swal.setDefaults({
			confirmButtonColor: '#007cfd', //使用该参数来修改“确认”按钮的背景颜色（必须是十六进制值）。
			confirmButtonText: '确定', //使用该参数来修改“确认”按钮的显示文本。
			cancelButtonText: '取消', //使用该参数来修改“取消”按钮的显示文本。
			allowEscapeKey: true, //如果设置为true，用户可以通过按下Escape键关闭弹窗。
			allowOutsideClick: false //如果设置为true，用户点击弹窗外部可关闭弹窗。
		});

		/**
		 * 统一超时消失的时间
		 * @type {number}
		 */
		var timer = 1000;

		/**
		 * 提示窗口，返回Promise
		 * @param params
		 * @return {Promise}
		 */
		function api() {
            var args = arguments;
			return $q(function (resolve, reject) {
                try {
                    var params = swalParams(args);

                    params.title = params.title || '';
                    params.text = params.text || '';

                    //若提示内容时数组，切换为html换行显示
                    ['title', 'text']
                        .forEach(function (key) {
                            var t = params[key];
                            if ((angular.isArray(t)) && t.length > 0) {
                                params[key] = t.reduce(function (result, element) {
                                    return result + '<br>' + element;
                                });

                                params.html = true;
                            }
                        });

                    //若只有标题没有内容，把标题当内容
                    if (params.title && !params.text) {
                        params.text = params.title;
                        params.title = '';
                    }

                    if ('closeOnConfirm' in params) {
                        console.warn('closeOnConfirm 选项禁止自行指定，此选项无效');
                    }
                    params.closeOnConfirm = params.type !== 'input';

                    if ('closeOnCancel' in params) {
                        console.warn('closeOnCancel 选项禁止自行指定，此选项无效');
                    }
                    params.closeOnCancel = true;

                    swal(params, function (value) {
                        var resolved = true;
                        var result = undefined;
                        var needClose = true;
                        //若是取消
                        if (value === false) {
                            resolved = false;
                        }
                        //若是【input】类型
                        else if (params.type === 'input') {
                            result = value;
                            //并且指定了验证器，进行验证
                            if ('inputValidator' in params) {
                                if (typeof params.inputValidator !== 'function') {
                                    needClose = false;
                                    swal.showInputError('inputValidator 必须是一个函数');
                                }
                                else {
                                    var errorText = params.inputValidator(value);
                                    if (errorText) {
                                        needClose = false;
                                        swal.showInputError(errorText);
                                    }
                                }
                            }
                        }
                        //若同时有【确认】和【取消】按钮
                        //根据按钮来改变Promise的状态
                        else if (params.showCancelButton) {
                            resolved = value === true;
                        }
                        //只有【确认】按钮的话，都改为【成功】状态
                        else {}

                        if (needClose) {
                            swal.close();
                            (resolved ? resolve : reject)(result);
                        }
                    });

                    //弹框关闭后，会把焦点回到原来的元素
                    //我们不需要这个功能
                    //且这个功能会引发一些不必要的 Bug
                    //去掉
                    window.previousActiveElement = null;
                }
                catch (e) {
                    reject(e);
                }
			})
				.finally(function () {
					//关闭提示框的代码是延时触发的
					//这里也要延时一下
					//否则第2个提示框弹不出来（会被延时执行的关闭代码关闭）
					return $timeout(300);
				});
		};

		/**
		 * 解析参数，返回参数对象
		 * 调用提示窗口支持2种形式：
		 * 1、参数为1个对象
		 * 2、参数为3个字符串(后2个可省略)
		 * @param params
		 * @return {Object}
		 */
		function swalParams(params) {
			if (angular.isObject(params[0]) && !angular.isArray(params[0]))
				return params[0];

			return {
				title: params[0],
				text: params[1],
				type: params[2]
			};
		}

		/**
		 * 确认提示窗口，返回Promise
		 * @param params
		 * @return {Promise}
		 */
		api.confirm = function () {
			var params = swalParams(arguments);

			angular.extend(params, {
				type: 'confirm', //图标为【?】
				showConfirmButton: true, //必须显示【确定】按钮
				showCancelButton: true, //必须显示【取消】按钮
				allowEscapeKey: false, //不允许Escape退出
				allowOutsideClick: false, //不允许点击旁边退出
				timer: null //不允许超时消失
			});

			return api(params);
		};

		/**
		 * 消息提示窗口，返回Promise
		 * @param params
		 * @return {Promise}
		 */
		api.info = function () {
			var params = swalParams(arguments);

			angular.extend(params, {
				type: 'info', //图标为【i】
				timer: null //不允许超时消失
			});

			return api(params);
		};

		/**
		 * 成功提示窗口，返回Promise
		 * @param params
		 * @return {Promise}
		 */
		api.success = function () {
			var params = swalParams(arguments);

			angular.extend(params, {
				type: 'success', //图标为【√】
				timer: angular.isDefined(params.timer) ? params.timer : timer //超时消失
			});

			return api(params);
		};

		/**
		 * 错误提示窗口，返回Promise
		 * @param params
		 * @return {Promise}
		 */
		api.error = function () {
			var params = swalParams(arguments);

			angular.extend(params, {
				type: 'error', //图标为【×】
				timer: null //不允许超时消失
			});

			return api(params);
		};

		/**
		 * 输入提示窗口，返回Promise
		 * @param params
		 * @return {Promise}
		 * @since 2018-12-21
		 */
		api.input = function () {
			var params = swalParams(arguments);


			angular.extend(params, {
				type: 'input',
				//closeOnConfirm: false, //点击【确定】不关闭，由后续代码判断是否关闭
				showConfirmButton: true, //必须显示【确定】按钮
				showCancelButton: true, //必须显示【取消】按钮
				allowEscapeKey: false, //不允许Escape退出
				allowOutsideClick: false, //不允许点击旁边退出
				timer: null //不允许超时消失
			});

			return api(params);
		};

		/**
		 * 确认，然后成功
		 * @param params = {
		 *     okFun: 点击【确定】后要做的事(回调)，执行完成后会有成功提示
		 *     okTitle: 成功提示内容
		 * }
		 */
		api.confirmThenSuccess = function (params) {
			angular.extend(params, {
				// closeOnConfirm: false //点击【确定】后不消失
			});

			var okFun = params.okFun; //点击【确定】后要做的事(回调)，执行完成后会有成功提示
			delete params.okFun;

			var okTitle = params.okTitle || '成功'; //成功后的提示内容
			delete params.okTitle;

			var theResult; //回调的执行结果

			return $q
				.when(params)
				.then(api.confirm) //确认，确定后执行回调
				.then(function () {
					/* api.info({
						title: '进行中，请稍候...',
						showConfirmButton: false, //不显示【确定按钮】
						allowEscapeKey: false, //如果设置为true，用户可以通过按下Escape键关闭弹窗。
						allowOutsideClick: false //如果设置为true，用户点击弹窗外部可关闭弹窗。
					}); */
				})
				.then(angular.noop) //不传值给回调
				.then(okFun) //执行回调
				.then(function (result) {
					theResult = result; //缓存回调的执行结果
					return okTitle;
				}, function (reason) { //当回调失败时
					api.close(); //关闭提示窗口
					return $q.reject(reason); //传递失败状态
				})
				.then(api.success) //提示成功
				.then(function () {
					return theResult; //返回回调的执行结果
				});
		};

		/**
		 * 关闭
		 * @since 2018-12-06
		 */
		api.close = swal.close.bind(swal);

		return api;
	}
);