/**
 * 绩效分等比例表
 * Created by sgc
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_edit_list', 'swalApi', 'numberApi'], defineFn);
})(function (module, controllerApi, base_edit_list, swalApi, numberApi) {
    editList.$inject = ['$scope'];
    function editList($scope) {
        //网格定义
        $scope.gridOptions = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'employee_qty',
                headerName: '员工人数',
                cellStyle: function (params) {
                    return angular.extend(getDefaultCellStyle(params), {
                        'text-align': 'center' //文本居中
                    });
                }
            }, {
                field: 'scale',
                headerName: '分等比例',
                cellStyle: function (params) {
                    return angular.extend(getDefaultCellStyle(params), {
                        'text-align': 'center' //文本居中
                    });
                }
            }, {
                field: 'usable',
                headerName: '可用',
                type: "词汇",
                cellEditorParams: {
                    names: ["否", "是"],
                    values: [1, 2]
                },
                cellStyle: function (params) {
                    return angular.extend(getDefaultCellStyle(params), {
                        'text-align': 'center' //文本居中
                    });
                }
            }, {
                field: 'creator',
                headerName: '创建人',
            }, {
                field: 'create_time',
                headerName: '创建时间',
            }, {
                field: 'updator',
                headerName: '修改人',
            }, {
                field: 'update_time',
                headerName: '修改时间',
            }
            ]
        };
        function getDefaultCellStyle(params) {
            var style = {};

            if ($scope.gridOptions.defaultColDef) {
                var defaultStyle = $scope.gridOptions.defaultColDef.cellStyle;
                if (defaultStyle) {
                    if (angular.isObject(defaultStyle))
                        style = defaultStyle;
                    else if (angular.isFunction(defaultStyle))
                        style = defaultStyle(params);
                }
            }
            return style;
        };

        //校验输入员工人数
        $scope.numberCheck = function () {
            var qty = $scope.data.currItem.employee_qty;
            if (qty <= 0) {
                $scope.data.currItem.employee_qty = '';
                return swalApi.info("请输入大于0的数字");
            }
        };
        //继承基础控制器
        controllerApi.extend({
            controller: base_edit_list.controller,
            scope: $scope
        });

        //验证表头信息是否填完,并校验输入的员工人数和分等比例
        $scope.validCheck = function (invalidBox) {
            $scope.gridOptions.api.stopEditing();
            $scope.hcSuper.validCheck(invalidBox);
            //invalidBox.push('');
            var qty = $scope.data.currItem.employee_qty;
            var scale = $scope.data.currItem.scale;
            if ((qty == undefined) || qty == 0 || qty == null) {
                return;
            }
            if ((scale == undefined) || scale == '' || scale == null) {
                return;
            }
            var scaleList = scale.split(":");
            var scaleSum = 0;
            for (var i = 0; i < scaleList.length; i++) {
                scaleSum = scaleSum + numberApi.toNumber(scaleList[i], 0);
                if ((scaleList[i] >= qty) && (numberApi.toNumber(scaleList[i], 0) == 0)) {
                    invalidBox.push("请按正确格式输入分等比例");
                }
            }
            if ($scope.data.currItem.employee_qty != scaleSum) {
                if (scaleSum == 0) {
                    invalidBox.push("请按正确格式输入分等比例");
                } else {
                    invalidBox.push("输入的分等比例格式不正确，或输入的分等比例不等于员工人数");
                }
            }
            return invalidBox;
        };

        /**
         * 新增时数据、网格默认设置
         */
        $scope.newBizData = function (bizData) {
            $scope.hcSuper.newBizData(bizData);
            $scope.data.currItem.usable = 2;
        }
    };

    //注册控制器
    return controllerApi.controller({
        module: module,
        controller: editList
    });
});
