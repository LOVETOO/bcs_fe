/**
 * 应付账龄区间 account_pay_age_period_list
 * Created by zhl on 2019/1/4.
 */

(function (defineFn) {
    define(['module', 'controllerApi', 'base_edit_list', 'swalApi', 'requestApi'], defineFn);
})(function (module, controllerApi, base_edit_list, swalApi, requestApi) {
    'user strict'

    DemoEditList.$inject = ['$scope', '$q'];
    function DemoEditList($scope, $q) {
        $scope.gridOptions = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'pay_age_code',
                headerName: '编号',
            }, {
                field: 'days',
                headerName: '天数',
                type: '数字'
            }, {
                field: 'aging_description',
                headerName: '账龄期间描述'
            }, {
                field: 'remark',
                headerName: '备注',
                suppressSizeToFit: false,
                minWidth: 780,
                maxWidth: 1200,
            }]
        };
        controllerApi.extend({
            controller: base_edit_list.controller,
            scope: $scope
        });

        /**
         * 发保存请求之后的处理
         * @param responseData 响应的数据
         * @since 2018-12-10
         */
        $scope.doAfterSave = function (responseData) {
            $scope.gridOptions.hcApi.search();
        };

        //按钮隐藏
        $scope.toolButtons.downloadImportFormat.hide = true;
        $scope.toolButtons.import.hide = true;

    }

    return controllerApi.controller({
        module: module,
        controller: DemoEditList
    });
});