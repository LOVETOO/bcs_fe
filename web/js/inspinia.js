/**
 * INSPINIA - Responsive Admin Theme
 * 2.3
 *
 * Custom scripts
 */
// Full height of sidebar
define(['jquery'], function ($) {
    function fix_height() {
        var windowheight = $(window).height();
        var headerheight = $('.header').innerHeight;
        var navtabheight = $('#MainCtrl').offsetHeight + 10;
        $("#page-wrapper > iframe").css("height", windowheight - headerheight - navtabheight + "px");
        $("nav.navbar-default").css("height", windowheight + "px");
    }
    $(document).ready(function () {
        $(window).bind("load resize scroll", function () {
            if (!$("body").hasClass('body-small')) {
                fix_height();
            }
        })
        setTimeout(function () {
            fix_height();
        });
        // Minimalize menu
        $('.navbar-minimalize').click(function () {
            $("body").toggleClass("mini-navbar");
        });
    });

    return {
        fix_height: fix_height
    };
});
