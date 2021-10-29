var basemanControllers = angular.module('inspinia');
function sale_payreg_header($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "sale_payreg_header",
        key: "reg_id",
        nextStat: "sale_payreg_headerEdit",
        classids: "sale_payreg_headers",
        postdata: {},
        sqlBlock: "1=1",
        thead: [],
        grids: [{optionname: 'viewOptions', idname: 'contains'}]
    };

    $scope.headername = "费用登记";
    if ($scope.$state.params.ExpandValue || $scope.$state.current.url == "/sale_payreg_headercheck") {
        $scope.ExpandValue = 2;
        $scope.hide = true;
        $scope.objconf.postdata.sqlwhere = " stat=5";
        $scope.headername = "费用登记取消审核";
        $scope.objconf.nextStat = "sale_payreg_headercheckEdit";
    }
    sale_payreg_header = HczyCommon.extend(sale_payreg_header, ctrl_view_public);
    sale_payreg_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);

    /**------ 下拉框词汇值------------*/
    BasemanService.RequestPost("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            for (var i = 0; i < data.dicts.length; i++) {
                var object = {};
                object.value = data.dicts[i].dictvalue;
                object.desc = data.dicts[i].dictname;
                $scope.viewColumns[0].cellEditorParams.values.push(object);
            }
        });
    BasemanService.RequestPost("base_search", "searchdict", {dictcode: "pay_style"})
        .then(function (data) {
            for (var i = 0; i < data.dicts.length; i++) {
                var object = {};
                object.value = data.dicts[i].dictvalue;
                object.desc = data.dicts[i].dictname;
                $scope.viewColumns[5].cellEditorParams.values.push(object);
            }
        });
    /**----网格列区域  ----------*/
    $scope.viewColumns = [
        {
            headerName: "状态", field: "stat", editable: false, filter: 'set', width: 75,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "登记流水号", field: "reg_no", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "支付对象", field: "transit_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "出货预告号", field: "warn_no", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "合同号", field: "pi_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "运费付款方式", field: "pay_style", editable: false, filter: 'set', width: 120,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: []
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "机构名称", field: "org_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "创建时间", field: "create_time", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "创建人", field: "creator", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "修改时间", field: "update_time", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "修改人", field: "updator", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "操作", field: "", editable: false, filter: 'set', width: 58,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            pinned: 'right',
            cellRenderer: "链接渲染"
        }];
    //数据缓存
    $scope.initData();
}
//加载控制器
basemanControllers
    .controller('sale_payreg_header', sale_payreg_header);

