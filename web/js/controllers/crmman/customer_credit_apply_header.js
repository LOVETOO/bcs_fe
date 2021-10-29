'use strict';
var basemanControllers = angular.module('inspinia');

function customer_credit_apply_header($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope) {
    //继承基类方法
    customer_credit_apply_header = HczyCommon.extend(customer_credit_apply_header, ctrl_view_public);
    customer_credit_apply_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);

    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "customer_credit_apply_header",
        key: "apply_id",
        nextStat: "customer_credit_apply_headerEdit",
        classids: "customer_credit_apply_headers",
        sqlBlock: "1=1",
        thead: [],
        grids: [{optionname: 'viewOptions', idname: 'contains'}]
    }
    $scope.headername = "董事长授信额度";

    /**------ 下拉框词汇值------------*/
    BasemanService.RequestPost("base_search", "searchdict", {dictcode: "stat"})
    .then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            $scope.viewColumns[0].cellEditorParams.values[i] = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
        }
    });
    /**----网格列区域  ----------*/
    $scope.viewColumns = [
        {
            headerName: "单据状态", field:"stat",editable: false, filter: 'set',  width: 100,
            cellEditor:"下拉框",
            cellEditorParams:{values:[]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, 
		{
            headerName: "调整申请单号", field: "apply_no",editable: false, filter: 'set',  width: 150,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, 
		{
            headerName: "制单人", field: "creator",editable: false, filter: 'set',  width: 150,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "制单时间", field: "create_time",editable: false, filter: 'set',  width: 150,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "备注", field: "note",editable: false, filter: 'set',  width: 200,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "操作", field: "",editable: false, filter: 'set',  width: 58,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            // pinned: 'right',
            cellRenderer:"链接渲染"
        }];
    //数据缓存
    $scope.initData();
}
// 产品资料
basemanControllers
    .controller('customer_credit_apply_header', customer_credit_apply_header)

