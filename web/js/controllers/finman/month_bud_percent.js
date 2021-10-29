/**
 * 预算进度设置
 */

(function (defineFn) {
    define(['module', 'controllerApi', 'base_edit_list', 'swalApi', 'requestApi', 'numberApi','dateApi'], defineFn);
})(function (module, controllerApi, base_edit_list, swalApi, requestApi, numberApi,dateApi) {
    //声明依赖注入
    MonthBudPercent.$inject = ['$scope'];
    function MonthBudPercent($scope) {

        $scope.gridOptions = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'month_bud_percent_no',
                headerName: '单据号'
            }, {
                field: 'bud_year',
                headerName: '预算编制年度'
            }, {
                field: 'dept_name',
                headerName: '部门'
            }, {
                field: 'crm_entid',
                headerName: '品类',
                hcDictCode: "crm_entid"
            }, {
                field: 'percent_month1',
                headerName: '1月占比',
                type: '百分比'
            }, {
                field: 'percent_month2',
                headerName: '2月占比',
                type: '百分比'
            }, {
                field: 'percent_month3',
                headerName: '3月占比',
                type: '百分比'
            }, {
                field: 'percent_month4',
                headerName: '4月占比',
                type: '百分比'
            }, {
                field: 'percent_month5',
                headerName: '5月占比',
                type: '百分比'
            }, {
                field: 'percent_month6',
                headerName: '6月占比',
                type: '百分比'
            }, {
                field: 'percent_month7',
                headerName: '7月占比',
                type: '百分比'
            }, {
                field: 'percent_month8',
                headerName: '8月占比',
                type: '百分比'
            }, {
                field: 'percent_month9',
                headerName: '9月占比',
                type: '百分比'
            }, {
                field: 'percent_month10',
                headerName: '10月占比',
                type: '百分比'
            }, {
                field: 'percent_month11',
                headerName: '11月占比',
                type: '百分比'
            }, {
                field: 'percent_month12',
                headerName: '12月占比',
                type: '百分比'
            }]
        };

        function getCurrItem() {
            return $scope.data.currItem;
        }

        controllerApi.extend({
            controller: base_edit_list.controller,
            scope: $scope
        });

        /*-------------------通用查询开始------------------------*/
        $scope.deptObj = {
            sqlWhere:"isfeecenter = 2",
            afterOk: function (result) {
                getCurrItem().dept_id = result.dept_id;
                getCurrItem().dept_code = result.dept_code;
                getCurrItem().dept_name = result.dept_name;
            }
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
            bizData.bud_year = numberApi.sum(dateApi.nowYear(),1);
            bizData.create_time = dateApi.now();
        }

        $scope.validCheck = function (invalidBox) {
            $scope.hcSuper.validCheck(invalidBox);
            var sum = numberApi.sum(
                getCurrItem().percent_month1,
                getCurrItem().percent_month2,
                getCurrItem().percent_month3,
                getCurrItem().percent_month4,
                getCurrItem().percent_month5,
                getCurrItem().percent_month6,
                getCurrItem().percent_month7,
                getCurrItem().percent_month8,
                getCurrItem().percent_month9,
                getCurrItem().percent_month10,
                getCurrItem().percent_month11,
                getCurrItem().percent_month12);
            if(sum!=1){
                invalidBox.push("1-12月占比之和必须为100%，请调整。")
            }
        }

        $scope.toolButtons.import.hide = true;
        $scope.toolButtons.downloadImportFormat.hide = true;


    }

    controllerApi.controller({
        module: module,
        controller: MonthBudPercent
    });
});

