/**
 * Simplified Chinese translation for bootstrap-datetimepicker
 * Rung-Sheng Jang <daniel@i-trend.co.cc>
 */
;(function($){
    $.fn.datetimepicker.dates['zh-CN'] = {
        days: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
        daysShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        daysMin:  ['日', '一', '二', '三', '四', '五', '六', '日'],
        months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        today: function () {
            var $input = $(this).closest('.datetimepicker').parent().children('input');

            if ($input.is('[hc-model-year]'))
                return '今年';

            if ($input.is('[hc-model-month],[hc-model-year-month]'))
                return '本月';

            return '今天';
        },
        suffix: [],
        meridiem: ['上午', '下午']
    };
}(jQuery));