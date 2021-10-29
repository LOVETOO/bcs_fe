var billmanControllers = angular.module('inspinia');
function sale_pi_priceapply_headerEdit($scope, $location, $http, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {

    //继承基类方法
    sale_pi_priceapply_headerEdit = HczyCommon.extend(sale_pi_priceapply_headerEdit, ctrl_bill_public);
    sale_pi_priceapply_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_pi_priceapply_header",
        key: "price_apply_id",
        wftempid: 10062,
        FrmInfo: {},
        grids: [
            {
                optionname: 'itemline_options',
                idname: 'sale_pi_priceapply_lineofsale_pi_priceapply_headers',
            }, {
                optionname: 'line2_options',
                idname: 'sale_pi_priceapply_line2ofsale_pi_priceapply_headers'
            }
        ]
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
       
        //itemline_options
        {
            $scope.add_line=function () {
                $scope.FrmInfo = {
                    type: "checkbox",
                    classid: "pro_item_header",
                    sqlBlock:" usable=2 ",
                    postdata: {},
                };
                BasemanService.open(CommonPopController, $scope)
                    .result.then(function (datas) {
                    if(datas.length<1){
                        return;
                    }
                    var itemlines=$scope.gridGetData("itemline_options");
                    $scope.data.currItem.sale_pi_priceapply_line2ofsale_pi_priceapply_headers=
                        $scope.data.currItem.sale_pi_priceapply_line2ofsale_pi_priceapply_headers||[];
                    var notexists=true;
                    for(var i=0;i<datas.length;i++){
                        notexists=true;
                        for(var j=0;j<itemlines.length;j++){
                            if(itemlines[j].item_h_name.indexOf(datas[i].item_h_name)>-1||itemlines[j].item_h_code.indexOf(datas[i].item_h_code)>-1){
                                notexists=false;
                                continue
                            }
                        }
                        if(notexists){
                            itemlines.push(datas[i]);
                            var obj=BasemanService.RequestPostNoWait("pro_item","search",{sqlwhere:" usable=2  and item_h_id="+datas[i].item_h_id});
                            if(obj.pass){
                                $scope.data.currItem.sale_pi_priceapply_line2ofsale_pi_priceapply_headers=
                                    $scope.data.currItem.sale_pi_priceapply_line2ofsale_pi_priceapply_headers.concat(obj.data.pro_items);
                            }
                        }
                    }
                    $scope.gridSetData("itemline_options",itemlines);
                    $scope.itemline_rowClicked(undefined)
                })
            }

            $scope.del_line=function () {
                var data=$scope.gridGetRow("itemline_options");
                var obj={};
                for(var i=0;i<$scope.data.currItem.sale_pi_priceapply_line2ofsale_pi_priceapply_headers.length;i++){
                    obj=$scope.data.currItem.sale_pi_priceapply_line2ofsale_pi_priceapply_headers[i]
                    if(obj.item_h_id==data.item_h_id){
                        $scope.data.currItem.sale_pi_priceapply_line2ofsale_pi_priceapply_headers.splice(i,1);
                    }
                }
                $scope.gridDelItem("itemline_options");
                $scope.itemline_rowClicked(undefined);
            }

            $scope.itemline_rowClicked=function (e) {
                var data = {}
                if (e == undefined) {
                    data = $scope.gridGetRow('itemline_options');
                    if(!data){
                        data=$scope.gridGetData('itemline_options')[0]
                    }
                } else {
                    data = e.data;
                }
                var datas = [], j = 0, obj = {}
                for (var i = 0; i < $scope.data.currItem.sale_pi_priceapply_line2ofsale_pi_priceapply_headers.length; i++) {
                    obj = $scope.data.currItem.sale_pi_priceapply_line2ofsale_pi_priceapply_headers[i]
                    if (obj.item_h_id == data.item_h_id) {
                        obj.seq = ++j
                        datas.push(obj);
                    }
                }
                $scope.gridSetData('line2_options', datas);
            }

            $scope.itemline_options = {
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
                    var isGrouping = $scope.itemline_options.columnApi.getRowGroupColumns().length > 0;
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

            $scope.itemline_columns = [
                {
                    headerName: "序号",
                    field: "seq",
                    editable: false,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    pinned: "left",
                    width: 80,
                }, {
                    headerName: "整机编码",
                    field: "item_h_code",
                    editable: false,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 120,
                }, {
                    headerName: "整机名称",
                    field: "item_h_name",
                    editable: false,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 120
                }, {
                    headerName: "开始时间",
                    field: "start_date",
                    editable: true,
                    filter: 'set',
                    cellEditor: "年月日",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 100
                }, {
                    headerName: "结束时间",
                    field: "end_date",
                    editable: true,
                    filter: 'set',
                    cellEditor: "年月日",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 100
                } ,{
                    headerName: "结算价(USD)",
                    field: "base_price",
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 120
                }, {
                    headerName: "工厂结算价(RMB)",
                    field: "settle_price",
                    editable: true,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 120
                },  {
                    headerName: "备注",
                    field: "note",
                    editable: true,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 180
                },  {
                    headerName: "是否有效",
                    field: "usable",
                    editable: false,
                    filter: 'set',
                    cellEditor: "复选框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 100
                }, {
                    headerName: "作废时间",
                    field: "revoke_time",
                    editable: false,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 100
                }, {
                    headerName: "作废人",
                    field: "revokor",
                    editable: false,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 100
                }];

        }

        //line2_options
        {

            $scope.line2_options = {
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
                rowClicked: undefined,
                groupSelectsChildren: false, // one of [true, false]
                suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
                groupColumnDef: groupColumn,
                showToolPanel: false,
                checkboxSelection: function (params) {
                    var isGrouping = $scope.line2_options.columnApi.getRowGroupColumns().length > 0;
                    return params.colIndex === 0 && !isGrouping;
                },
                icons: {
                    columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                    filter: '<i class="fa fa-filter"/>',
                    sortAscending: '<i class="fa fa-long-arrow-down"/>',
                    sortDescending: '<i class="fa fa-long-arrow-up"/>',
                },
            };

            $scope.line2_columns = [
                {
                    headerName: "序号",
                    field: "seq",
                    editable: false,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    pinned: "left",
                    width: 80,
                }, {
                    headerName: "分体机编码",
                    field: "item_code",
                    editable: false,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 120,
                }, {
                    headerName: "分体机名称",
                    field: "item_name",
                    editable: false,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 120
                },{
                    headerName: "结算价(USD)",
                    field: "base_price",
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 120
                }, {
                    headerName: "工厂结算价(RMB)",
                    field: "settle_price",
                    editable: true,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 120
                },  {
                    headerName: "备注",
                    field: "note",
                    editable: true,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 180
                },  {
                    headerName: "是否有效",
                    field: "usable",
                    editable: false,
                    filter: 'set',
                    cellEditor: "复选框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 100
                }];
        }
    }

    $scope.clearinformation = function () {
        $scope.data.currItem.stat = 1;
    }

    $scope.initdata();
}//加载控制器
billmanControllers
    .controller('sale_pi_priceapply_headerEdit', sale_pi_priceapply_headerEdit)

