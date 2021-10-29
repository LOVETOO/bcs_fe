/**
 * 单据号设置 billnumber
 * Created by zhl on 2019/1/21.
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_edit_list'], defineFn);
})(function (module, controllerApi, base_edit_list) {
    EditList.$inject = ['$scope'];
    function EditList($scope) {
        $scope.gridOptions = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'bill_type_id',
                headerName: '单据类型ID'
            }, {
                field: 'organization_id',
                headerName: '组织ID'
            }, {
                field: 'prefix',
                headerName: '单据号前缀'
            }, {
                field: 'descript',
                headerName: '描述'
            }, {
                field: 'max_number',
                headerName: '当前最大编号',
                type:'数字'
            }, {
                field: 'year_month',
                headerName: '当前年月',
                type:'日期'
            }, {
                field: 'bill_month',
                headerName: '单据月份',
                type:'日期'
            }, {
                field: 'month_seriallength',
                headerName: '流水号长度',
                type:'数字'
            }, {
                field: 'is_month',
                headerName: '按月生成流水号',
                type:'是否'
            }, {
                field: 'created_by',
                headerName: '创建者'
            }, {
                field: 'creation_date',
                headerName: '创建日期'
            }, {
                field: 'last_updated_by',
                headerName: '修改者'
            }, {
                field: 'last_update_date',
                headerName: '最后修改日期'
            }]
        };

        controllerApi.extend({
            controller: base_edit_list.controller,
            scope: $scope
        });

        /*----------------------- 数据设置 -----------------------*/
        function getCurrItem() {
            return $scope.data.currItem;
        }

        /*初始化数据*/
        $scope.setBizData = function (bizData) {
            $scope.hcSuper.setBizData(bizData);
            //初始化原“组织id”（单据号id、组织id、当前年月是复合主键，记录原内容用于删、改）
            getCurrItem().old_organization_id = bizData.organization_id;
            //初始化原“当前年月”
            getCurrItem().old_year_month = bizData.year_month;
            //console.log( "old org : " + getCurrItem().old_organization_id);
        };

        $scope.newBizData = function (bizData) {
            $scope.hcSuper.newBizData($scope.data.currItem = bizData);
            getCurrItem().year_month = new Date().Format('yyyyMM');
            console.log("test ym : "+ getCurrItem().year_month);
        }

        /*--------------------- 通用查询---------------------------*/

        //查询单据类型id
        $scope.commonSearchSettingOfObjconf = {
            afterOk: function (result) {
                getCurrItem().bill_type_id = result.objtypeid;
            }
        };

        //查询单据类型id
        $scope.commonSearchSettingOfEnt = {
            sqlWhere: ' isdisabled = 1 ',
            afterOk: function (result) {
                getCurrItem().organization_id = result.organization_id;
            }
        };

        /*----------------------- 事件 -----------------------*/
        /*年月格式转换*/
        $scope.onYearMonthChange = function(){
            $scope.data.currItem.year_month = $scope.data.currItem.year_month.replace('-','');
        }

        //隐藏按钮
        $scope.toolButtons.import.hide = true;
        $scope.toolButtons.export.hide = true;
        $scope.toolButtons.downloadImportFormat.hide = true;
    }

    return controllerApi.controller({
        module: module,
        controller: EditList
    });
});