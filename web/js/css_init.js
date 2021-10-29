/**
 * 样式初始化
 * @since 2019-02-26
 */
(function (defineFn) {
	define(['jquery'], defineFn);
})(function ($) {



    /**
     * 获取对应名称的cookie
     * @param name cookie的名称
     * @returns {null} 不存在时，返回null
     */
 //    var getCookie = function (name) {
 //        var arr;
 //        var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
 //        if (arr = document.cookie.match(reg))
 //            return unescape(arr[2]);
 //        else
 //            return null;
 //    };

	// /*** 更换皮肤 */
 //    window.changeSkin = function changeSkin(name) {
 //        _changeSkin(top);
        
 //        /**
 //         * 递归更换皮肤
 //         */

 //        function _changeSkin(theWindow) {
 //            $(document.body).removeClass("greenSty skin-1 skin-3");
 //            $(document.body).addClass(name);
 //        }
 //    }
 //    var skin = getCookie("skin");
 //    changeSkin(skin);
 //    $("body").removeClass("greenSty skin-1 skin-3");
 //    $("body").addClass(skin);
});