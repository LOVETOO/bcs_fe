var basemanControllers = angular.module('inspinia');
function bank($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService){
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "bank",
        key: "bank_id",
        nextStat: "bankEdit",
        classids: "banks",
        sqlBlock:"1=1",
        thead:[],
        grids:[{optionname:'viewOptions', idname:'contains'}]
    };

    $scope.headername="银行信息";
    bank = HczyCommon.extend(bank,ctrl_view_public);
    bank.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);
    //回款组织
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "return_ent_type"}).then(function (data) {
        var return_ent_types = [];
        for (var i = 0; i < data.dicts.length; i++) {
            return_ent_types[i] = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            };
        }

        if ($scope.getIndexByField('viewColumns', 'return_ent_type')) {
            $scope.viewColumns[$scope.getIndexByField('viewColumns', 'return_ent_type')].cellEditorParams.values = return_ent_types;
        }
    });
    /**----网格列区域  ----------*/
    $scope.viewColumns = [
        {
            headerName: "银行编码", field: "bank_code",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "银行名称", field: "bank_name",editable: false, filter: 'set',  width: 180,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "银行简称", field: "bank_jc",editable: false, filter: 'set',  width: 180,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "币种名称", field: "currency_name",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "回款组织", field: "return_ent_type",editable: false, filter: 'set',  width: 85,
            cellEditor:"下拉框",
            cellEditorParams: {
                values: []
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "是否可用", field: "usable",editable: false, filter: 'set',  width: 90,
            cellEditor:"下拉框",
            cellEditorParams:{values:[{value:1,desc:'否'},{value:2,desc:'是'}]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "操作", field: "",editable: false, filter: 'set',  width: 58,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellRenderer:"链接渲染"
        }];
    //数据缓存
    $scope.initData();
}
//加载控制器
basemanControllers
    .controller('bank',bank);

