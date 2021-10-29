var basemanControllers = angular.module('inspinia');
function ctr_base_make_factor($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService){
    ctr_base_make_factor = HczyCommon.extend(ctr_base_make_factor,ctrl_view_public);
    ctr_base_make_factor.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);
        
        $scope.rrrs = [{
        	id:4,
        	name:"测试1",
        },{
        	id:2,
        	name:"吃的啊",
        },{
        	id:3,
        	name:"饿哦IE",
        }]
        
        list = $scope.rrrs;
        
        /*$scope.rrrs = [];
        BasemanService.RequestPost("sale_pi_priceapply_header", "up_priceapply", {})
        .then(function (data) {
            	for(var i = 0;i<data.sale_pi_priceapply_header.length;i++){
            		var obj = {
            			id:Number(),
            			name:,
            			value:Number(),
            			desc:,
            		}
            		$scope.rrrs.push(obj);
            	}
            	for(var l = 0;l<$scope.columns1.length;l++){
            		
            		if($scope.columns1[l].field == "item_h_name"){
            			$scope.columns1[l].cellEditorParams.values = $scope.rrrs;
            		}
            	}
            	
        })*/
        
       /* $scope.area_name = function () {
	        $scope.FrmInfo = {
	           	is_high: false,
	            is_custom_search: true,
	            title: "整机查询",
	            thead: [
	                {
	                    name: "整机编码",
	                    code: "item_h_code",
	                    show: true,
	                    iscond: true,
	                    type: 'string'
	                }, {
	                    name: "整机名称",
	                    code: "item_h_name",
	                    show: true,
	                    iscond: true,
	                    type: 'string'
	                }],
	            classid: "exchange_bf",
	            postdata: {},
	            sqlBlock: " item_type_id>0 and usable=2 ",
	            type: "checkbox",
	        };
	        BasemanService.open(CommonPopController, $scope)
	            .result.then(function (data) {
	          		var  a = //网格里面的数据
	          		var cell = //当前行
	          		a[cell].data.seqd = data.//id,name,code
	          		
	        });
	    }*/
        
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
	    
	    $scope.columns1 = [
        {
            headerName: "序号",field: "seq",filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            pinned: "left",
            checkboxSelection: function (params) {
                return params.columnApi.getRowGroupColumns().length == 0
            },
            width: 80,
        }, {
            headerName: "整机编码",field: "item_h_code",filter: 'set',
            //cellEditor: "文本框/下拉框/整数框/浮点框/年月日/弹出框",
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 120,
        }, {
            headerName: "整机名称",field: "item_h_name",filter: 'set',
            cellEditor: "下拉框",
            cellEditorParams: {values: [{
            	value:1,
            	desc:"测试1"
            },{
            	value:2,
            	desc:"3企鹅热尔"
            }]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 120
        }, {
            headerName: "原结算价(USD)",field: "seqd",editable: true,filter: 'set',
            cellEditor: "弹出框",
            action:$scope.area_name,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 120
        }, {
            headerName: "原工厂结算价(RMB)",
            field: "settle_price",
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
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }, {
            headerName: "结束时间",
            field: "end_date",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }, {
            headerName: "新结算价(USD)",
            field: "base_price1",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }, {
            headerName: "原工厂结算价(RMB)",
            field: "settle_price1",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }, {
            headerName: "材料成本",
            field: "pdm_price",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }, {
            headerName: "单套制造费用",
            field: "p1",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }];
        
	    $scope.options1 = {
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
	        rowClicked: $scope.rowClicked_11,
	        groupSelectsChildren: false, // one of [true, false]
	        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
	        groupColumnDef: groupColumn,
	        showToolPanel: false,
	        checkboxSelection: function (params) {
	            var isGrouping = $scope.options1.columnApi.getRowGroupColumns().length > 0;
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
    
}
//加载控制器
basemanControllers
    .controller('ctr_base_make_factor',ctr_base_make_factor);

