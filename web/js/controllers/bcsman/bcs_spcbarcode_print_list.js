/**
 * 龙头新产品标签
 * @since 2020年10月22日15:06:50
 * @author Htp
 */
define(
    ['module', 'controllerApi', 'base_obj_list', 'requestApi'],
    function (module, controllerApi, base_obj_list) {
        /**
         * 控制器
         */
        var bcs_spcbarcode_print = [
            '$scope',
            function ($scope) {

                $scope.gridOptions = {
                    hcClassId: 'bcs_spcbarcode_print',
                    hcRequestAction: 'search',  //打开页面前的请求方法
                    hcDataRelationName: "bcs_spcbarcode_prints",
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'pono',
                        headerName: '订单号',
                    }, {
                        field: 'organizationid',
                        headerName: '组织'
                    }, {
                        field: 'custno',
                        headerName: '客户编码',
                    }, {
                        field: 'custname',
                        headerName: '客户名称',
                    }, {
                        field: 'itemcode',
                        headerName: '产品编码',
                    }, {
                        field: 'itemname',
                        headerName: '产品名称',
                    }, {
                        field: 'factbase',
                        headerName: '基地',
                        hcDictCode: 'bcs.factbase'
                    }, {
                        field: 'qty',
                        headerName: '数量',
                        type: "数量"
                    }, {
                        field: 'packqty',
                        headerName: '包件数量',
                        type: "数量"
                    }, {
                        field: 'deliver_date',
                        headerName: '预计送货日期'
                    }, {
                        field: 'printor',
                        headerName: '打印人',
                    }, {
                        field: 'createtime',
                        headerName: '创建时间',
                    }, {
                        field: 'updatetime',
                        headerName: '更新时间',
                    }]
                };

                $(function () {
                    var intervalId = setInterval(function () {
                        if ($scope.searchPanelVisible === false) {//符合条件
                            clearInterval(intervalId);//销毁
                            $scope.searchPanelVisible = true;
                        }
                    }, 300);
                });
                /**
                  * 重写方法
                  */

                //继承列表页基础控制器
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                $scope.toolButtons.delete.hide = true;
                $scope.toolButtons.add.hide = true;
            }
        ];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: bcs_spcbarcode_print
        });
    });  