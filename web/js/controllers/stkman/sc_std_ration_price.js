/**
 * 标准定额成本
 */

(function (defineFn) {
    define(['module', 'controllerApi', 'base_edit_list'], defineFn);
})(function (module, controllerApi, base_edit_list) {
    //声明依赖注入
    ScStdRationPrice.$inject = ['$scope'];
    function ScStdRationPrice($scope) {

        $scope.commonSearchSetting = {};//通用查询设置

        $scope.gridOptions = {
            columnDefs: [{
                type: '序号',
                headerCheckboxSelection: true,
                headerCheckboxSelectionFilteredOnly: true,
                checkboxSelection: true,
                width:100
            }, {
                field: 'year_month',
                headerName: '记账月份'
            },{
                field: 'item_code',
                headerName: '产品编码'
            },{
                field: 'item_name',
                headerName: '产品名称'
            },{
                field: 'uom_code',
                headerName: '单位编码',
                type:"单位"
            }, {
                field: 'uom_name',
                headerName: '单位名称',
                type:"单位"
            }, {
                field: 'price',
                headerName: '标准成本',
                type: '金额'
            }, {
                field: 'remark',
                headerName: '备注'
            },{
                field: 'created_by',
                headerName: '创建人'
            }, {
                field: 'creation_date',
                headerName: '创建时间',
                type:'日期'
            }, {
                field: 'last_updated_by',
                headerName: '修改人'
            }, {
                field: 'last_update_date',
                headerName: '修改时间',
                type:'日期'
            }]
        };


        controllerApi.extend({
            controller: base_edit_list.controller,
            scope: $scope
        });

        /*-------------------通用查询开始------------------------*/
        //查产品
        $scope.chooseItem = function (name) {
            return $scope.commonSearchSetting.item = {
                classId: 'item_org',
                title: '产品查询',
                gridOptions: {
                    "columnDefs": [
                        {
                            headerName: "产品编码",
                            field: "item_code"
                        }, {
                            headerName: "产品名称",
                            field: "item_name"
                        }, {
                            headerName: "单位",
                            field: "uom_name"
                        }
                    ]
                },
                afterOk: function (result) {
                    $scope.data.currItem.item_id = result.item_id;
                    $scope.data.currItem.item_code = result.item_code;
                    $scope.data.currItem.item_name = result.item_name;
                    $scope.data.currItem.uom_id = result.uom_id;
                    $scope.data.currItem.uom_code = result.uom_code;
                    $scope.data.currItem.uom_name = result.uom_name;
                }
            };
        };

        /*-------------------通用查询结束------------------------*/

        /**
         * 设置数据
         */
        $scope.setBizData = function (bizData) {
            $scope.hcSuper.setBizData(bizData);
        };

        /**
         * 新增时数据、网格默认设置
         */
        $scope.newBizData = function (bizData) {
            $scope.hcSuper.newBizData(bizData);
            bizData.year_month = new Date().Format('yyyy-MM');
        }



    }

    controllerApi.controller({
        module: module,
        controller: ScStdRationPrice
    });
});

