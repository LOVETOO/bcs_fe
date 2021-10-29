'use strict';

function basereminderpitem($scope, $location, $state,$timeout, $rootScope,  $modal,BasemanService, localeStorageService, FormValidatorService) {
	//继承基类方法
	basereminderpitem = HczyCommon.extend(basereminderpitem, ctrl_bill_public);
	basereminderpitem.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);

	//查询
	    $scope.search = function(flag) {

        var sqlwhere ="";

        var postdata = {
            sqlwhere:sqlwhere
        };
        BasemanService.RequestPost("erpitem", "search", postdata)
            .then(function(data) {
            	console.log(data);
                data.erpitems.genID("seq");

                $scope.erpitems=data.erpitems;

                var grid = $scope.inventptions.grid;

                grid.setDataResize($scope.erpitems);
                if(flag != 2){
                    $scope.erpitems.length > 0?
                        BasemanService.notice("搜索已完成","alert-info"):
                        BasemanService.notice("未有检索数据","alert-warning");
                }
            });
    };
	
	//网格中产品大类查询
	$scope.selectbigc = function(flag) {
		var _this = $(this);
		var index = _this.attr('index');
		index = Number(index);
		var cell = _this.attr('cell');
		var sqlwhere = "";
		$scope.FrmInfo = {
			title: "产品大类查询",
			initsql: sqlwhere,
			thead: [{
				name: "编码",
				code: "item_type_no"
			}, {
				name: "名称",
				code: "item_type_name"
			}],
			classid: "drp_item_type",
			postdata: {},
			searchlist: ["item_type_no", "item_type_name"]
		};
		//console.log($scope.FrmInfo);
		//$scope.FrmInfo = FrmInfo;
		BasemanService.open(CommonPopController, $scope)
			.result.then(function(result) {
				var grid = $scope.inventptions.grid;
				var data = grid.getData();
				data[index].bigc_name = result.item_type_name;
				data[index].bigc_id = result.item_type_id;
				grid.updateRow(index);
			});
	};
	
	//网格中产品小类查询
	$scope.selectbigc = function(flag) {
		var _this = $(this);
		//console.log($scope.data.currItem.orgid);
		var index = _this.attr('index');
		index = Number(index);
		var cell = _this.attr('cell');
		var sqlwhere = "";
		$scope.FrmInfo = {
			title: "产品小类查询",
			initsql: sqlwhere,
			thead: [{
				name: "编码",
				code: "item_type_no"
			}, {
				name: "名称",
				code: "item_type_name"
			}],
			classid: "drp_item_type",
			postdata: {},
			searchlist: ["item_type_no", "item_type_name"]
		};
		//console.log($scope.FrmInfo);
		//$scope.FrmInfo = FrmInfo;
		BasemanService.open(CommonPopController, $scope)
			.result.then(function(result) {
				var grid = $scope.inventptions.grid;
				var data = grid.getData();
				data[index].smallc_name = result.item_type_name;
				data[index].smallc_id = result.item_type_id;
				grid.updateRow(index);
			});
	};
	
	//保存
	    $scope.exportrtm = function(e){
    	e.currentTarget.disabled = true;
    	var postdata = {};
    	var grid = $scope.inventptions.grid;
    	var data = grid.getData();
		var rows = grid.getSelectedRows();
		var list = [];
		for(i=0;i<rows.length;i++){
			list.push(data[rows[i]]);
		}
		postdata.basereminderpitems = list;
    	if($scope.validate()){
    		var action = "exportrtm"
    		BasemanService.RequestPost("basereminderpitem", action, postdata)
                .then(function(data) {
                    BasemanService.notice("保存成功!", "alert-info");
                    $scope.data.currItem = data;
                    $scope.inventptions.grid.setDataResize($scope.data.currItem.basereminderpitems);

                    e.currentTarget.disabled = false;
                }, function(error) { e.currentTarget.disabled = false; });
        }else{
            e.currentTarget.disabled = false;
    	}
	}
	
	
	$scope.inventptions = {
		editable: true,
		enableAddRow: false,
		enableCellNavigation: true,
		asyncEditorLoading: false,
		autoEdit: true
	};
	
	$scope.inventcolumns = [{
	    id: "seq",
	    name: "序号",
	    field: "seq",
	    behavior: "select",
	    cssClass: "cell-selection",
	    width: 50,
	    cannotTriggerInsert: true,
	    resizable: false,
	    selectable: false,
	    focusable: false,
	    editor: Slick.Editors.ReadonlyText
	},{
		id: "item_kind",
		name: "产品组织",
		field: "item_kind",
		width: 90,
		formatter:Slick.Formatters.SelectOption,
		options:[{
			desc:"生活电器",
			value:1
		},{
			desc:"水产品",
			value:2
		}]
	}, {
		id: "item_code",
		name: "产品编码",
		field: "item_code",
		width: 90,
		editor: Slick.Editors.ReadonlyText
	}, {
		id: "item_name",
		name: "产品名称",
		field: "item_name",
		width: 90
	},{
		id: "spec",
		name: "产品型号",
		field: "spec",
		width: 90,
		editor:Slick.Editors.Text
	},{
		id: "creator",
		name: "创建人",
		field: "creator",
		width: 90,
		editor:Slick.Editors.ReadonlyText
	},{
		id: "create_time",
		name: "创建日期",
		field: "create_time",
		width: 90,
		editor:Slick.Editors.ReadonlyText
	},{
		id: "usable",
		name: "是否有效",
		field: "usable",
		width: 90,
		formatter: Slick.Formatters.Checkmark,
	}, {
		id: "uom_name",
		name: "单位",
		field: "uom_name",
		width: 90,
		editor:Slick.Editors.ReadonlyText
	},{
		id: "last_update_date",
		name: "最后更新日期",
		field: "last_update_date",
		width: 90,
		editor:Slick.Editors.ReadonlyText
	},{
		id: "item_type",
		name: "类型",
		field: "item_type",
		width: 90,
		formatter:Slick.Formatters.SelectOption,
		options:[{
			desc:"成品",
			value:1
		},{
			desc:"赠品",
			value:2
		},{
			desc:"配件",
			value:3
		}]
	}, {
		id: "bigc_name",
		name: "商品大类",
		field: "bigc_name",
		width: 90,
		editor:Slick.Editors.ButtonEditor,
		toaction: $scope.selectbigc
	}, {
		id: "smallc_name",
		name: "商品小类",
		field: "smallc_name",
		width:90,
		editor:Slick.Editors.ButtonEditor,
		toaction: $scope.selectsmallc
	},{
		id: "series_name",
		name: "商品系列",
		field: "series_name",
		width: 90,
		editor:Slick.Editors.Text
	}, {
		id: "volume ",
		name: "体积",
		field: "volume",
		width:90,
		editor:Slick.Editors.Text
	}, {
		id: "one_more_volume ",
		name: "整包装体积",
		field: "one_more_volume ",
		width:90,
		editor:Slick.Editors.Text
	}, {
		id: "one_more_qty ",
		name: "整包装数量",
		field: "one_more_qty ",
		width:90,
		editor:Slick.Editors.Text
	}];

	
	

	$scope.initdata();

}

angular.module('inspinia')
	.controller("basereminderpitem",basereminderpitem)
