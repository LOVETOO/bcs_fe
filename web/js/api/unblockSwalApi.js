/**
 * 非阻塞 不遮挡 提示框
 * @since 2018-09-17
 */
define(
    ['toastr', 'angular', '$q', '$timeout'],
    function (toastr, angular, $q, $timeout) {


        //设置提示窗口的默认值
        toastr.options = {
            closeButton: true,
            debug: false,
            extendedTimeOut: "1000",
            hideDuration: "1000",
            hideEasing: "linear",
            hideMethod: "fadeOut",
            onclick: null,
            // positionClass: "toast-top-right",
            preventDuplicates: false,
            progressBar: true,
            showDuration: "400",
            showEasing: "swing",
            showMethod: "fadeIn",
            // timeOut: "1000"
        };

        var $toastlast;

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
            var params = swalParams(arguments);

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

            toastr.options.timeOut = timer ? timer : 1000;
            toastr.options.positionClass = params.position ? params.position : "toast-top-right";

            return $q(function (resolve, reject) {
                var $toast = toastr[params.type](params.text, params.title); // Wire up an event handler to a button in the toast, if it exists
                $toastlast = $toast;
            })
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
                position: params[2]
            };
        }

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
                type: 'error',
                timer: 10000
            });

            return api(params);
        };

        /**
         * 警告提示窗口，返回Promise
         * @param params
         * @return {Promise}
         */
        api.warning = function () {
            var params = swalParams(arguments);

            angular.extend(params, {
                type: 'warning',
                timer: 5000
            });

            return api(params);
        };

        return api;
    }
);