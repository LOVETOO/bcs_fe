var basemanControllers = angular.module('inspinia');

function AreaController($scope,$rootScope,notify,BasemanService,$state,$modal,localeStorageService){
    function DateCellEditor() {       
	    DateCellEditor.prototype.init = function (params) {
	        this.params = params;
			$input = $("<INPUT type=text class='editor-text' />");			
			if(params.column.action){
            	$input.on("change",params.column.action);
            }
			this.textarea=$input[0];			
			this.textarea.value=params.value;
			$input.datepicker({
                format: "yyyy-mm-dd",
                todayBtn: true,
                forceParse: true,
                language: "zh-CN",
                multidate: false,
                autoclose: true,
                todayHighlight: true,
                beforeShow: function() {
                    calendarOpen = true
                },
                onClose: function() {
                    calendarOpen = false
                }
            });
			$input.focus();
			$input.data("datepicker").setDate(params.value);				        
	    };
	    DateCellEditor.prototype.onKeyDown = function (event) {
	        var key = event.which || event.keyCode;
	        if (key == constants_1.Constants.KEY_LEFT ||
	            key == constants_1.Constants.KEY_UP ||
	            key == constants_1.Constants.KEY_RIGHT ||
	            key == constants_1.Constants.KEY_DOWN ||
	            (event.shiftKey && key == constants_1.Constants.KEY_ENTER)) {
	            event.stopPropagation();
	        }
	    };
		DateCellEditor.prototype.getGui = function() {		
         return this.textarea;	 
         };
	   DateCellEditor.prototype.afterGuiAttached = function () { 	
            this.textarea.focus();			
	    };
	    DateCellEditor.prototype.getValue = function () {
	        return this.textarea.value;
	    };
		DateCellEditor.prototype.destroy = function() {
            $.datepicker.dpDiv.stop(true, true);
            $input.datepicker("hide");
            $input.datepicker("destroy");
            $input.remove();
      };
 }
 
 function SelectCellEditor() {       
	    SelectCellEditor.prototype.init = function (params) {              
			$eSelect=$('<div class="ag-cell-edit-input"><select class="ag-cell-edit-input"/></select></div>')
			var eSelect = this.getGui().querySelector('select');;
	        for(var i=0;i<params.values.length;i++) {
				value=params.values[i];
		
				if (typeof(value) == "object") {
				   var v=value.value;
				   var t=value.desc;					
				}
	            var option = document.createElement('option');
	            option.value = parseInt(t);
	            option.text = v;
	            if (((params.value) == t)||(params.value)==v) {
	                option.selected = true;
	            }
	            eSelect.appendChild(option);

		   }	        
	    };
		SelectCellEditor.prototype.getGui = function() {		
         return $eSelect[0];	 
         };
		SelectCellEditor.prototype.afterGuiAttached = function () {
	  
	        var eSelect = this.getGui().querySelector('select');
	        eSelect.focus();
	    };
		SelectCellEditor.prototype.addDestroyableEventListener = function () {	        
	    };
	    SelectCellEditor.prototype.getValue = function () {
	        var eSelect = this.getGui().querySelector('select');
	        return eSelect.value;
	    };
 }
 
  function ButtonCellEditor() {       
	    ButtonCellEditor.prototype.init = function (params) {             
			$div=$('<div  tabindex="0"><div class="input-group" style="width:100%;height:100%;"></div></div>')
			this.params = params;
	        this.input = document.createElement("INPUT");
            this.input.className="input-sm form-control"
			if(params.value!=undefined){
			this.input.value = params.value;}
			//this.input.type="text"
			this.input.focus();
	        
			this.A = document.createElement("A");
			this.A.className="input-group-addon"
			if(this.params.column.colDef.action!=undefined){
			this.A.addEventListener ("click", this.params.column.colDef.action);
			}
			
			
			this.I = document.createElement("I");
			this.I.className="fa fa-ellipsis-h"
			
	        this.getGui().querySelector('.input-group').appendChild(this.input);
			this.getGui().querySelector('.input-group').appendChild(this.A);
			this.getGui().querySelector('.input-group-addon').appendChild(this.I);
	        //this.addGuiEventListener('cellDoubleClicked', this.onKeyDown.bind(this));
	    };
		ButtonCellEditor.prototype.getGui = function() {		
         return $div[0];	 
         };

		ButtonCellEditor.prototype.afterGuiAttached = function () {	  
	      this.input.focus();
	    };
		ButtonCellEditor.prototype.addDestroyableEventListener = function () {	        
	    };
	    ButtonCellEditor.prototype.getValue = function () {
	        return this.input.value;
	    };
 }
  function TextCellEditor() {       
	    TextCellEditor.prototype.init = function (params) {
	        this.params = params;
			$input = $('<input class="ag-cell-edit-input" type="text"/>');			
			if(params.column.colDef.cellchange){
            	$input.on("input",params.column.colDef.cellchange);
            }
     	    this.textarea=$input[0];	
			if(params.value!=undefined){
			this.textarea.value=params.value;}
			//$input.focus();			        
	    };
	    TextCellEditor.prototype.onKeyDown = function (event) {
	        var key = event.which || event.keyCode;
	        if (key == constants_1.Constants.KEY_LEFT ||
	            key == constants_1.Constants.KEY_UP ||
	            key == constants_1.Constants.KEY_RIGHT ||
	            key == constants_1.Constants.KEY_DOWN ||
	            (event.shiftKey && key == constants_1.Constants.KEY_ENTER)) {
	            event.stopPropagation();
	        }
	    };
		TextCellEditor.prototype.getGui = function() {		
         return this.textarea;	 
         };
	   TextCellEditor.prototype.afterGuiAttached = function () { 	
            this.textarea.focus();			
	    };
	    TextCellEditor.prototype.getValue = function () {

	        return this.textarea.value;
			
	    };

 }
    localeStorageService.pageHistory($scope,function(){
        $scope.data.currItem.page_info = {
            oldPage : $scope.oldPage,
            currentPage : $scope.currentPage,
            pageSize : $scope.pageSize,
            totalCount : $scope.totalCount,
            pages : $scope.pages
        }
        return $scope.data.currItem
    });
    $scope.myGrid="myGrid"
    $scope.data={};
    $scope.data.currItem={};
    $scope.userbean = {};
    $scope.refresh = function(){
        $scope.searchtext = "";
        $scope.search();
    }
  var firstColumn = {
        headerName: '勾选控件',
        field: 'note',
        width: 200,
        editable: true,
        enableRowGroup: true,
        checkboxSelection: function (params) {
            // we put checkbox on the name if we are not doing no grouping
            return params.columnApi.getRowGroupColumns().length === 0;
        },
        icons: {
            sortAscending: '<i class="fa fa-sort-alpha-asc"/>',
            sortDescending: '<i class="fa fa-sort-alpha-desc"/>'
        }
};

var groupColumn = {
    headerName: "Group",
    width: 200,
    field: 'name',
    valueGetter: function(params) {
        if (params.node.group) {
            return params.node.key;
        } else {
            return params.data[params.colDef.field];
        }
    },
    comparator: agGrid.defaultGroupComparator,
    cellRenderer: 'group',
    cellRendererParams: {
        checkbox: true
    }
};

	   
 $scope.selectAll=function(){
	$scope.FrmInfo = {
            title: "数据查询",
            thead: [{
                name: "弹出框控件测试",
                code: "idpath"
            }],
            classid: "scparea",
            searchlist: ["idpath"]
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (data) {
			var nodes=$scope.itemoptions.api.getRenderedNodes();
			var cell=$scope.itemoptions.api.getFocusedCell();
			nodes[cell.rowIndex].data.idpath=data.idpath;
			$scope.itemoptions.api.refreshRows(nodes);			
			
        })
}
$scope.itemoptions = {
    rowGroupPanelShow: 'always', // on of ['always','onlyWhenGrouping']
    pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
    groupKeys: undefined, 
    groupHideGroupColumns: true,
    enableColResize: true, //one of [true, false]
    enableSorting: true, //one of [true, false]
    enableFilter: true, //one of [true, false]
    enableStatusBar: true,
    enableRangeSelection: true,
    rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
    rowDeselection: true,
    quickFilterText: null,
    groupSelectsChildren: true, // one of [true, false]
    suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
    groupColumnDef: groupColumn,
    showToolPanel: true,
    checkboxSelection: function (params) {
        var isGrouping = $scope.itemoptions.columnApi.getRowGroupColumns().length > 0;
        return params.colIndex === 0 && !isGrouping;
    },
    icons: {
        columnRemoveFromGroup: '<i class="fa fa-remove"/>',
        filter: '<i class="fa fa-filter"/>',
        sortAscending: '<i class="fa fa-long-arrow-down"/>',
        sortDescending: '<i class="fa fa-long-arrow-up"/>',
    }
};
function selectRenderer(params) {
	for(var i=0;i<params.colDef.cellEditorParams.values.length;i++){
		if(params.colDef.cellEditorParams.values[i].desc==params.value){
			return params.colDef.cellEditorParams.values[i].value;
        }
	}
		return params.value
}
$scope.bankBalance=function(){
	var _this = $(this);
	var val = _this.val();
	var key=["idpath"];
	var nodes=$scope.itemoptions.api.getModel().rootNode.childrenAfterGroup;
	//var nodes=$scope.itemoptions.api.getRenderedNodes();
    var cell=$scope.itemoptions.api.getFocusedCell();
    nodes[cell.rowIndex].data.idpath=val;
	
	$scope.itemoptions.api.refreshCells(nodes,key);	
	//BasemanService.notify(notify,val,"alert-info",1000);
}

$scope.itemcolumns = [
    {
        headerName: 'Participant',
        children: [
            firstColumn,
            {headerName: "日期控件", field: "areaname", width: 150, editable: true,
        enableRowGroup: true,
        enablePivot: true,
        cellEditor: DateCellEditor,
        cellEditorParams: { 
            values: ["Argentina", "Brazil", "Colombia", "France", "Germany", "Greece", "Iceland", "Ireland",
                "Italy", "Malta", "Portugal", "Norway", "Peru", "Spain", "Sweden", "United Kingdom",
                "Uruguay", "Venezuela"]
        },
        //pinned: 'left',
        floatCell: true,
        filterParams: {  
            cellHeight: 20,
            newRowsAction: 'keep'
        },
        icons: {
            sortAscending: '<i class="fa fa-sort-alpha-asc"/>',
            sortDescending: '<i class="fa fa-sort-alpha-desc"/>'
        }
    },
    {
        headerName: "下拉控件", field: "areatype", width: 150, editable: true, filter: 'set',
        cellEditor:SelectCellEditor,
		cellRenderer: function (params) {      // Function cell renderer
            return selectRenderer(params);
        },

        enableRowGroup: true,
        enablePivot: true,
        cellEditorParams: {
            values: [{value:'English',desc:1}, {value:'Spanish',desc:2}, {value:'French',desc:3}, {value:'LLL',desc:4}]
        },
        headerTooltip: "Example tooltip for Language",
        filterParams: {newRowsAction: 'keep'},
        icons: {
            sortAscending: '<i class="fa fa-sort-alpha-asc"/>',
            sortDescending: '<i class="fa fa-sort-alpha-desc"/>'
        }
            }
        ]
      },
    {
        headerName: 'Game of Choice',
        children: [
            {headerName: "弹出框控件", field: "idpath", width: 180, editable: true, filter: 'set',
                tooltipField: 'gameName',
        cellClass: function () {
            return 'alphabet';
        },
		action:$scope.selectAll,
        cellEditor:ButtonCellEditor,
        enableRowGroup: true,
        enablePivot: true,
        icons: {
            sortAscending: '<i class="fa fa-sort-alpha-asc"/>',
            sortDescending: '<i class="fa fa-sort-alpha-desc"/>'
        }
    },
    {
        headerName: "文本框(改变内部值测试)", field: "bought",editable: true, filter: 'set',  width: 200,
		cellEditor:TextCellEditor,
		cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true}
        ]
    },
    {
        headerName: 'Performance',
        groupId: 'performance',
        children: [
            {headerName: "Bank Balance", field: "bankBalance", width: 150, editable: true,
                enableValue: true,
                icons: {
                    sortAscending: '<i class="fa fa-sort-amount-asc"/>',
                    sortDescending: '<i class="fa fa-sort-amount-desc"/>'
                },
				cellValueChanged:$scope.bankBalance
            },
            {
                headerName: "Extra Info 1", columnGroupShow: 'open', width: 150, editable: false,
                suppressSorting: true, suppressMenu: true, cellStyle: {"text-align": "right"},
                cellRenderer: function() { return 'Abra...'; }
            },
            {
                headerName: "Extra Info 2", columnGroupShow: 'open', width: 150, editable: false,
                suppressSorting: true, suppressMenu: true, cellStyle: {"text-align": "left"},
                cellRenderer: function() { return '...cadabra!'; }
            }
        ],
    },
    {
        headerName: "Rating", field: "rating", width: 100, editable: true,
		cellEditor:"select",
        floatCell: true,
		cellEditorParams: {
            values: [{value:'English',desc:1}, {value:'Spanish',desc:2}, {value:'French',desc:3}, {value:'LLL',desc:4}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true
    },
    {
        headerName: "Total Winnings", field: "areatype", filter: 'number',
        editable: false, width: 150,
        enableValue: true,
        icons: {
            sortAscending: '<i class="fa fa-sort-amount-asc"/>',
            sortDescending: '<i class="fa fa-sort-amount-desc"/>'
        }
    }
];
    BasemanService.pageInit($scope);
    
    // 查询
    function getSqlWhere(){
        return BasemanService.getSqlWhere(["areacode", "areaname","assistcode","telzone"],$scope.searchtext);

    }
    $scope._pageLoad = function(postdata){
        if(postdata){
            postdata.sqlwhere = getSqlWhere();
        }
        BasemanService.RequestPost("scparea","search",postdata)
            .then(function(data){
                //$scope.itemoptions.api.rowRenderer(); 
				
                $scope.data.currItem.scpareas =data.scpareas;
				$scope.data.currItem.scpareas[0].areatype=parseInt($scope.data.currItem.scpareas[0].areatype);
				$scope.itemoptions.api.setRowData($scope.data.currItem.scpareas);								
                BasemanService.pageInfoOp($scope,data.pagination);
            });
    }


    $scope.closebox = function(){
        $state.go("gallery.BaseA_0_1_E");
    }

    $scope.new = function(){

        localeStorageService.remove("gallery.BaseA_0_1_E");
        //跳转
        $state.go("gallery.BaseA_0_1_E");
    }

    $scope.so_delete = function(index){
        ds.dialog.confirm("您确定删除【整个单据】吗？",function(){
            var  postdata={
                areaid:$scope.data.currItem.scpareas[index].areaid
            };
            var promise = BasemanService.RequestPost("scparea","delete",postdata);
            promise.then(function(data){
                BasemanService.notify(notify,"删除成功!","alert-info",1000);
                $scope.search();
            });
        });
    }
    
    $scope.edit = function(index,event){

        $scope.editobj = {areaid: $scope.data.currItem.scpareas[index].areaid};
        //select
        var promise = BasemanService.RequestPost("scparea", "select", $scope.editobj);
        promise.then(function(data) {
            $scope.editobj = data;
            localeStorageService.set("gallery.BaseA_0_1_E", $scope.editobj);
            //跳转
            $state.go("gallery.BaseA_0_1_E");
        });

    }

    var temp = localeStorageService.getHistoryItem($rootScope.$state.$current.name);
    if(temp){
        $scope.data.currItem = temp;

        $scope.oldPage = temp.page_info.oldPage;
        $scope.currentPage = temp.page_info.currentPage;
        $scope.pageSize = temp.page_info.pageSize;
        $scope.totalCount = temp.page_info.totalCount;
        $scope.pages = temp.page_info.pages;
    }

}
//加载控制器
basemanControllers
    .controller('AreaController',AreaController)
