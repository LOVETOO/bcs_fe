(function (defineFn) {
    define(['module', 'controllerApi', 'base_edit_list','swalApi','requestApi'], defineFn);
})(function (module, controllerApi, base_edit_list,swalApi,requestApi) {
    //声明依赖注入
    NewItemEditList.$inject = ['$scope'];
    function NewItemEditList($scope) {
        $scope.gridOptions = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'newitem_year',
                headerName: '年份',
                hcDictCode: 'newitem_year'
            }, {
                field: 'item_specs',
                headerName: '产品型号'
            }, {
                field: 'item_code',
                headerName: '产品编码'
            }, {
                field: 'item_name',
                headerName: '产品名称'
            }, {
                field: 'brand_name',
                headerName: '品牌',
                hcDictCode: 'brand_name'
            }, {
                field: 'entorgid',
                headerName: '品类',
                hcDictCode: 'crm_entid'
            },{
                field: 'fee_plan',
                headerName: '预算内',
                type: '是否'
            },  {
                field: 'note',
                headerName: '备注',
                suppressSizeToFit: false,
                minWidth: 780,
                maxWidth: 1200,
            }

            ]
        };


        controllerApi.extend({
            controller: base_edit_list.controller,
            scope: $scope
        });


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
        }


        $scope.importItem = function () {
            var postData = {
                classId: "fin_newitem",
                action: 'toitem',
                data: $scope.data.currItem
            };
            return requestApi.post(postData)
                .then(function (data) {
                    swalApi.success("生成成功！");
                });
        }


    }

    controllerApi.controller({
        module: module,
        controller: NewItemEditList
    });
});
