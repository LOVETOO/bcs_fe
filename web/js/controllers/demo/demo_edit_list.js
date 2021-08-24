(function (defineFn) {
    define(['module', 'controllerApi', 'base_edit_list', 'requestApi'], defineFn);
})(function (module, controllerApi, base_edit_list, requestApi) {
    DemoEditList.$inject = ['$scope'];

    function DemoEditList($scope) {
        $scope.gridOptions = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'uom_code',
                headerName: '单位编码'
            }, {
                field: 'uom_name',
                headerName: '单位名称'
            }, {
                field: 'note',
                headerName: '备注'
            }]
        };

        $scope.test = function () {
            var info = {
                text: '百度是一家高科技公司',
            };
            info = JSON.stringify(info);
            var postData = {
                reqmethod: 'baidunlpapi',//类型：增值税发票
                reqdata: info
            }
            //调用后台接口扫描发票
            requestApi.post('base_openapi', 'reqapi', postData)
                .then(function (response) {
                    console.log(response);
                });
        };
        controllerApi.extend({
            controller: base_edit_list.controller,
            scope: $scope
        });
    }

    return controllerApi.controller({
        module: module,
        controller: DemoEditList
    });
});