/**
 *时间工具接口
 */

define(function () {

        var self = this; //固定this

        /**
         * 今天
         */
        self.today = function () {
            return new Date().Format('yyyy-MM-dd');
        };

        /**
         * 现在
         */
        self.now = function () {
            return new Date().Format('yyyy-MM-dd hh:mm:ss');
        };

        /**
         * 今年
         */
        self.nowYear = function () {
            return new Date().Format('yyyy')
        }

        /**
         * 当前月份
         */
        self.nowMonth = function () {
            return new Date().Format('MM')
        }

        /**
         * 当月第一天
         */
        self.firstDay = function () {
            var date = new Date();
            return new Date(date.getFullYear(), date.getMonth(), 1).Format('yyyy-MM-dd');
        }

        /**
         * 当月最后一天
         */
        self.lastDay = function () {
            var date = new Date();
            return new Date(date.getFullYear(), date.getMonth() + 1, 0).Format('yyyy-MM-dd');
        }

        /**
         * 根据不同浏览器类型去format日期
         */
        self.DateFormatter = function (string) {
            var browserType = self.BrowserType();
            if (navigator.appName === 'Microsoft Internet Explorer' || (navigator.appName === 'Netscape' && /Trident/.test(navigator.userAgent))) {
                var date = string.replace(new RegExp(/-/gm), "/");
                date = new Date(date);
                // return $filter('date')(date, 'yyyy-MM-dd');
                return 'dateFilter'.asAngularService(new Date(string), 'yyyy-MM-dd');
            } else if (browserType == 'safari') {
                var arr = string.split(/[- : \/]/)
                if (arr.length == 3) {
                    arr [3] = '00';
                    arr [4] = '00';
                    arr [5] = '00';
                }
                date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
                if (date && date.length > 10)
                    return date.substr(0, 10);
                return date
            } else {
                return 'dateFilter'.asAngularService(new Date(string), 'yyyy-MM-dd');
                // return $filter('date')(new Date(string), 'yyyy-MM-dd');
            }
        }

        /**
         * 判断浏览器类型
         * @returns {string}
         * @constructor
         */
        self.BrowserType = function () {
            var Sys = {};
            var ua = navigator.userAgent.toLowerCase();
            var s;
            (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
                (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
                    (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
                        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                            (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

            //以下进行测试
            if (Sys.ie) return 'ie';
            if (Sys.firefox) return 'firefox';
            if (Sys.chrome) return 'chrome';
            if (Sys.opera) return 'opera';
            if (Sys.safari) return 'safari';
        }

        return self;
    }
);