'use strict';
var salemanControllers = angular.module('inspinia');
function po_inbill_header($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope) {
    po_inbill_header = HczyCommon.extend(po_inbill_header, ctrl_view_public);
    po_inbill_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);

    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "po_inbill_header",
        key: "in_id",
        classids: "po_inbill_headers",
        thead: [],
        grids: [{optionname: 'viewOptions', idname: 'contains'}]
    }
    $scope.beforClearInfo = function () {
        var name = $rootScope.$state.$current.self.name;
        if (name == "crmman.po_inbill_header") {//采购入库
            $scope.s_flag = 1;
            $scope.headername = "外购件入库";
            $scope.objconf.nextStat="po_inbill_headerEdit";
            $scope.objconf.postdata={sqlwhere:"in_type=1"};
        } else if (name == "crmman.po_inbill_header_qt") {//其他入库
            $scope.s_flag = 2;
            $scope.objconf.postdata={sqlwhere:"in_type=2"};
            $scope.headername = "其他入库";
            $scope.objconf.nextStat="po_inbill_header_qtEdit";
        }
    };
    $scope.beforClearInfo();
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            var line_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                line_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                }
            }
            if ($scope.getIndexByField('viewColumns', 'stat')) {
                $scope.viewColumns[$scope.getIndexByField('viewColumns', 'stat')].cellEditorParams.values = line_types;
            }
        });
    /**----网格列区域  ----------*/
    $scope.viewColumns = [{
            headerName: "序号", field: "queue", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "状态",
            field: "stat",
            editable: false,
            filter: 'set',
            width: 85,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: []
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "入库单号",
            field: "in_no",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "部门名称",
            field: "org_name",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户编码",
            field: "cust_code",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "采购申请单号",
            field: "source_bill_no",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "供应商编码",
            field: "vender_code",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "供应商",
            field: "vender_name",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "入库仓库",
            field: "wh_name",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "入库时间",
            field: "in_date",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "详情",
            field: "",
            editable: false,
            filter: 'set',
            width: 78,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            // pinned: 'right',
            cellRenderer: "链接渲染"
        }];
    //数据缓存
    $scope.initData();

}

salemanControllers
    .controller('po_inbill_header', po_inbill_header)



