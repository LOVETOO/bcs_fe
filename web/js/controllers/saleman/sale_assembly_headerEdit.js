var salemanControllers = angular.module('inspinia');
function sale_assembly_headerEdit($scope, $location, $http, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {
    //继承基类方法
    sale_assembly_headerEdit = HczyCommon.extend(sale_assembly_headerEdit, ctrl_bill_public);
    sale_assembly_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_assembly_header",
        key: "assembly_id",
        wftempid: 10109,
        // FrmInfo: {},
        grids: [
            {
                optionname: 'options_11',
                idname: 'sale_assembly_lineofsale_assembly_headers'
            }
        ]
    };
    $scope.beforClearInfo = function () {
        var name = $rootScope.$state.$current.self.name;
        if (name == "crmman.sale_assembly_headerEdit") {
            $scope.s_flag = 1;
            $scope.objconf.FrmInfo={sqlBlock:"1=1"};
        } else if (name == "crmman.sale_assembly_header_zfEdit") {
            $scope.s_flag = 2;
            $scope.objconf.FrmInfo={sqlBlock:' stat in (5,99)'};
        }
    };
    $scope.beforClearInfo();
    //复制
    $scope.Copy = function () {
        if($scope.data.currItem.stat!=1){return};
        $scope.FrmInfo = {
            title: "装配规则",
            is_high: true,
            thead: [
                {
                    name: "装配编码",
                    code: "assembly_id",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "装配名称",
                    code: "assembly_name",
                    show: true,
                    iscond: true,
                    type: 'string'
                }],
            classid: "sale_assembly_header",
            is_custom_search: true,
            // searchlist: ["assembly_id", "assembly_name"],
            postdata: {}
        };
        BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (result) {
            BasemanService.RequestPost("sale_assembly_header", "select", {assembly_id: result.assembly_id})
                .then(function (data) {
                    $scope.options_11.api.setRowData(data.sale_assembly_lineofsale_assembly_headers);
                    $scope.data.currItem.sale_assembly_lineofsale_assembly_headers = data.sale_assembly_lineofsale_assembly_headers;
                });
        });
    };
    //作废
    $scope.Cancel=function(){
        if ($scope.data.currItem.modify_note == undefined || $scope.data.currItem.modify_note == "") {
            BasemanService.notice("请填写作废原因!", "alert-warning");
            return;
        }
        if ($scope.data.currItem.stat == 99) {return;}
        var assembly_name=$scope.data.currItem.assembly_name||""+"";
        var postdata={
            assembly_id: $scope.data.currItem.assembly_id,
            modify_note: $scope.data.currItem.modify_note,
            assembly_name: $scope.data.currItem.assembly_name
        };
        ds.dialog.confirm('确定要将' + assembly_name +'单据作废!', function () {
            BasemanService.RequestPost("sale_assembly_header", "cancel", postdata)
                .then(function (data) {
                    BasemanService.notice("作废成功", "alert-info");
                    $scope.refresh(2);
                });
        }, function () {
            $scope.newWindow.close();
        });
    };
    /**网格配置*/
    {
        //分组功能
        var groupColumn = {
            headerName: "Group",
            width: 200,
            field: 'name',
            valueGetter: function (params) {
                if (params.node.group) {
                    return params.node.key;
                } else {
                    return params.data[params.colDef.field];
                }
            },
            comparator: agGrid.defaultGroupComparator,
            cellRenderer: 'group',
            cellRendererParams: function (params) {
            }
        };
        $scope.options_11 = {
            rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
            pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
            groupKeys: undefined,
            groupHideGroupColumns: false,
            enableColResize: true, //one of [true, false]
            enableSorting: true, //one of [true, false]
            enableFilter: true, //one of [true, false]
            enableStatusBar: false,
            enableRangeSelection: true,
            rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
            rowDeselection: false,
            quickFilterText: null,
            rowClicked: $scope.itemline_rowClicked,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            groupColumnDef: groupColumn,
            showToolPanel: false,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_11.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            },
            getRowHeight: function (params) {
                if (params.data.rowHeight == undefined) {
                    params.data.rowHeight = 25;
                }
                return params.data.rowHeight;
            }
        };
        $scope.columns_11 = [
            {
                headerName: "序号",
                field: "line_seq",
                editable: true,
                filter: 'set',
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                pinned: "left",
                width: 60
            }, {
                headerName: "编码前缀",
                field: "item_code",
                editable: true,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                width: 120,
            }, {
                headerName: "物料描述包含",
                field: "item_name",
                editable: true,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                width: 120
            }, {
                headerName: "物料描述不包含",
                field: "item_name2",
                editable: true,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                width: 150
            }, {
                headerName: "装配关系",
                field: "line_relate",
                editable: true,
                filter: 'set',
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [
                        {
                            value: 1,
                            desc: "依赖"
                        }, {
                            value: 2,
                            desc: "干涉"
                        }]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                width: 100
            }, {
                headerName: "装配关系警示",
                field: "prompt_type",
                editable: true,
                filter: 'set',
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [
                        {
                            value: 1,
                            desc: "提示"
                        }, {
                            value: 2,
                            desc: "强制"
                        }]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                width: 120
            }];
    }
    $scope.clearinformation = function () {
        $scope.data.currItem.stat = 1;
        $scope.data.currItem.creator = window.strUserId;
        $scope.data.currItem.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
        if ($rootScope.$state.$current.self.name == "crmman.sale_assembly_headerEdit") {
            $scope.s_flag = 1;
        } else if ($rootScope.$state.$current.self.name == "crmman.sale_assembly_header_zfEdit") {
            $scope.s_flag = 2;
        }
    };
    $scope.initdata();
}//加载控制器
salemanControllers
    .controller('sale_assembly_headerEdit', sale_assembly_headerEdit)

