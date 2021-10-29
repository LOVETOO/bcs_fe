
/**
 * 配送区域 sa_deliver_area_list
 *  * 2018-12-28 zhl
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_edit_list'], defineFn);
})(function (module, controllerApi, base_edit_list) {

    //依赖注入
    DemoEditList.$inject = ['$scope', '$stateParams'];
    //定义控制器
    function DemoEditList($scope, $stateParams) {

        //定义网格
        $scope.gridOptions = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'deliver_area_code',
                headerName: '配送区域编码'
            }, {
                field: 'deliver_area_name',
                headerName: '配送区域名称'
            }, {
                field: 'remark',
                headerName: '备注'
            }, {
                field: 'isusable',
                headerName: '有效',
                type:'是否'
            }, {
                field: 'created_by',
                headerName: '创建人'
            }, {
                field: 'creation_date',
                headerName: '创建时间'
            }, {
                field: 'last_updated_by',
                headerName: '修改人'
            }, {
                field: 'last_update_date',
                headerName: '修改时间'
            }],
            hcObjType: $stateParams.objtypeid
        };

        //继承基础控制器
        controllerApi.extend({
            controller: base_edit_list.controller,
            scope: $scope
        });

        /**
         * 新增时数据、网格默认设置
         */
        $scope.newBizData = function (bizData) {
            $scope.hcSuper.newBizData(bizData);

            bizData.created_by = strUserId;//默认“创建人”
            bizData.creation_date =  new Date().Format('yyyy-MM-dd hh:mm:ss');//默认“创建时间”
            bizData.isusable = 2;//默认“有效”为勾选状态
        }

        //按钮隐藏
        $scope.toolButtons.downloadImportFormat.hide = true;
        $scope.toolButtons.import.hide = true;

    }

    return controllerApi.controller({
        module: module,
        controller: DemoEditList
    });
});