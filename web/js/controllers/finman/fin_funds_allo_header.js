var basemanControllers = angular.module('inspinia');
function fin_funds_allo_header($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService){
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "fin_funds_allo_header",
        key: "allo_id",
        nextStat: "fin_funds_allo_headerEdit",
        classids: "fin_funds_allo_headers",
        postdata:{sqlwhere:" nvl(is_byhand,0) <> 2"},
        sqlBlock:"1=1",
        thead:[],
        grids:[{optionname:'viewOptions', idname:'contains'}]
    };
    $scope.headername = "到款PI分配";
    if ($scope.$state.params.ExpandValue || $scope.$state.current.url == "/fin_funds_allo_header_sg") {
        $scope.ExpandValue = 1;
        $scope.objconf.postdata.sqlwhere = " nvl(is_byhand,0)=2";
        $scope.headername = "到款PI分配制单(手工录入)";
        $scope.objconf.nextStat = "fin_funds_allo_header_sgEdit";
    }
    fin_funds_allo_header = HczyCommon.extend(fin_funds_allo_header,ctrl_view_public);
    fin_funds_allo_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);
    /********下拉框词汇值******/
    //状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            var stats = [];
            for (var i = 0; i < data.dicts.length; i++) {
                stats[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('viewColumns', 'stat')) {
                $scope.viewColumns[$scope.getIndexByField('viewColumns', 'stat')].cellEditorParams.values = stats;
            }
        });
    //到款类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pay_type"})
        .then(function (data) {
            var funds_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                funds_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('viewColumns', 'funds_type')) {
                $scope.viewColumns[$scope.getIndexByField('viewColumns', 'funds_type')].cellEditorParams.values = funds_types;
            }
        });
    /********网格列区域*******/
    $scope.viewColumns = [
        {
            headerName: "状态", field:"stat",editable: false, filter: 'set',  width: 85,
            cellEditor:"下拉框",
            cellEditorParams:{values:[]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "分配单号", field: "allo_no",editable: false, filter: 'set',  width: 120,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "到款单号", field: "funds_no",editable: false, filter: 'set',  width: 130,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "资金系统单号", field: "other_no",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "到款类型", field: "funds_type",editable: false, filter: 'set',  width: 100,
            cellEditor:"下拉框",
            cellEditorParams:{values:[]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "信用证号", field: "lc_no",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "水单编号", field: "lc_bill_no",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "资金总额", field: "total_amt",editable: false, filter: 'set',  width: 85,
            cellEditor:"浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "可分配金额", field: "canuse_amt",editable: false, filter: 'set',  width: 120,
            cellEditor:"浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "已分配金额", field: "allocated_amt",editable: false, filter: 'set',  width: 110,
            cellEditor:"浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "此次分配总额", field: "total_allo_amt",editable: false, filter: 'set',  width: 120,
            cellEditor:"浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        /*{
         headerName: "汇款人", field: "hk_man",editable: false, filter: 'set',  width: 100,
         cellEditor:"文本框",
         enableRowGroup: true,
         enablePivot: true,
         enableValue: true,
         floatCell: true
         },*/
        {
            headerName: "货币", field: "currency_code",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "货币名称", field: "currency_name",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "版本号", field: "version",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "PI号(合同号)", field: "pi_no",editable: false, filter: 'set',  width: 120,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户", field: "cust_code",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户名称", field: "cust_name",editable: false, filter: 'set',  width: 150,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户描述", field: "cust_desc",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "部门", field: "org_code",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "部门名称", field: "org_name",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注", field: "note",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "制单人", field: "creator",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },

        {
            headerName: "制单时间", field: "create_time",editable: false, filter: 'set',  width: 120,
            cellEditor:"年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "修改人", field: "updator",editable: false, filter: 'set',  width: 120,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "修改时间", field: "update_time",editable: false, filter: 'set',  width: 120,
            cellEditor:"年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "审核人", field: "checkor",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "审核时间", field: "check_time",editable: false, filter: 'set',  width: 100,
            cellEditor:"年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "回款组织", field: "return_ent_type",editable: false, filter: 'set',  width: 110,
            cellEditor: "下拉框",
            cellEditorParams: {values: [{value: 1, desc: '宁波-进出口'}, {value: 2, desc: '香港'}, {value: 5, desc: '宁波-空调'}]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
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
    .controller('fin_funds_allo_header',fin_funds_allo_header);

