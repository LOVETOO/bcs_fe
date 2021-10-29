var basemanControllers = angular.module('inspinia');
function sale_prod_allo_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_prod_allo_headerEdit = HczyCommon.extend(sale_prod_allo_headerEdit, ctrl_bill_public);
    sale_prod_allo_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_prod_allo_header",
        key: "prod_allo_id",
        wftempid: 10127,
        FrmInfo: {},
        grids: [
            {optionname: 'options_11', idname: 'sale_prod_allo_lineofsale_prod_allo_headers'},
            {
                optionname: 'options_12',
                idname: 'sale_prod_allo_plineofsale_prod_allo_headers'
            }]
    };

    /******************  页面隐藏****************************/
    $scope.show_11 = false;
    $scope.show11 = function () {
        $scope.show_11 = !$scope.show_11;
    };
    $scope.show_12 = false;
    $scope.show12 = function () {
        $scope.show_12 = !$scope.show_12;
    };
    /**----弹出框区域*---------------*/
    //查询业务部门
    $scope.openCPCOrgFrm = function () {
        $scope.FrmInfo = {
            classid: "scporg",
            postdata: {},
            sqlBlock: "( idpath like '%211%' or idpath like '%273%') and 1=1 and stat =2 and OrgType = 5",
            backdatas: "orgs",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_id = result.orgid;
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_name = result.orgname;
        });
    };
    //客户查询
    $scope.openCustFrm = function () {
        if ($scope.data.currItem.org_id == undefined || $scope.data.currItem.org_id == "") {
            BasemanService.notice("请先选择业务部门", "alert-warning");
            return;
        }
        $scope.FrmInfo = {
            classid: "customer",
            postdata: {},
        };
        $scope.FrmInfo.sqlBlock="(org_id = "+$scope.data.currItem.org_id+"or other_org_ids like '%," +$scope.data.currItem.org_id+",%')";
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.cust_id = result.cust_id;
            $scope.data.currItem.sap_code = result.sap_code;
            $scope.data.currItem.cust_code = result.cust_code;
            $scope.data.currItem.cust_name = result.cust_name;
        });
    };
    //到款PI
    $scope.openLcNoSearchFrm = function () {
        if ($scope.data.currItem.org_id == undefined || $scope.data.currItem.org_id == "") {
            BasemanService.notice("请先选择业务部门", "alert-warning");
            return;
        }
        if ($scope.data.currItem.cust_id == undefined || $scope.data.currItem.cust_id == "") {
            BasemanService.notice("请先选择客户", "alert-warning");
            return;
        }
        $scope.FrmInfo = {
            classid: "fin_funds_allo_header",
            postdata: {flag:1},
        };
        $scope.FrmInfo.sqlBlock="org_id="+$scope.data.currItem.org_id+"and cust_id ="+$scope.data.currItem.cust_id+"and stat=5 and nvl(is_byhand,0)<>2 and exists (select 1 from fin_funds_allo_line l where l.allo_id=fin_funds_allo_header.allo_id and allo_amt > (nvl(prod_amt,0)+ nvl(tq_amt,0) ) ) and exists (select 1 from (select nvl(sum(invoice_check_amt),0) amt,allo_id,pi_id from fin_funds_allo_invoice_line group by allo_id,pi_id ) l,fin_funds_allo_line fl where l.allo_id(+)=fin_funds_allo_header.allo_id and fl.allo_id=fin_funds_allo_header.allo_id and fl.pi_id=l.pi_id(+) and nvl(amt,0) <fl.allo_amt )";

        BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (result) {
            $scope.data.currItem.allo_no=result.allo_no;
            $scope.data.currItem.allo_id=result.allo_id;
            BasemanService.RequestPost("fin_funds_allo_header", "select", {allo_id:result.allo_id,allo_no:result.allo_no})
                .then(function (data) {
                 var dataline=[];
                 var item={};
                 var dataitem=data.fin_funds_allo_lineoffin_funds_allo_headers;
                 for(var i=0;i<dataitem.length;i++){
                     item.allo_no=dataitem[i].allo_no;
                     item.allo_id=dataitem[i].allo_id;
                     item.pi_no=dataitem[i].pi_no;
                     item.pi_id=dataitem[i].pi_id;
                     item.allo_amt=dataitem[i].allo_amt;
                     item.send_amt=dataitem[i].send_amt;
                     dataline.push(item);
                 };
                 $scope.options_11.api.setRowData(dataline);
                 $scope.data.currItem.sale_prod_allo_lineofsale_prod_allo_headers=dataline;
            })
        })
    };
    //增加行-生产单
    $scope.additem2 = function (length) {
        if ($scope.data.currItem.org_id == undefined || $scope.data.currItem.org_id == "") {
            BasemanService.notice("请先选择业务部门", "alert-warning");
            return;
        }
        if ($scope.data.currItem.cust_id == undefined || $scope.data.currItem.cust_id == "") {
            BasemanService.notice("请先选择客户", "alert-warning");
            return;
        }
        var piids="";
        var data = $scope.data.currItem.sale_prod_allo_lineofsale_prod_allo_headers;
        for(var i=0;i<data.length;i++){
          if(data[i].pi_id!=""){
            data.length==0 ? piids=data[0].pi_id : piids=piids+data[i].pi_id;
          }
        }
        if(piids==0){
            BasemanService.notice("请先选择PI", "alert-warning");
            return;
        }
        $scope.FrmInfo = {
            classid: "sale_prod_header",
//            sqlBlock: "pi_id in (0) and prod_amt > 0 and nvl(new_prod,0) = 2",
//            postdata: {flag: 15},
            type: "checkbox"
        };
        $scope.FrmInfo.sqlBlock=' pi_id in ('  +  piids     +  ')' +  ' and prod_amt > 0 and nvl(new_prod,0) = 2';
        /*if($scope.data.currIem.bill_type==1){
          $scope.FrmInfo.postdata={flag:16};//TT
        }
        if($scope.data.currIem.bill_type==2){
         $scope.FrmInfo.postdata={flag:15};//LC
        }
        if($scope.data.currIem.bill_type==3){
         $scope.FrmInfo.postdata={flag:17};//生产单单独升级后
           $scope.FrmInfo.sqlBlock=' stat in(2,3,4,5) and prod_amt > 0 and nvl(new_prod,0) != 2' +' and org_id=' +$scope.data.currItem.org_code +' and cust_id=' + $scope.data.currItem.cust_code +' and not exists (select 1 from sale_ship_notice_header h,sale_ship_item_line l ' +'   where h.notice_id=l.notice_id and l.prod_id=sale_prod_header.prod_id and h.stat <> 99 )';
        }*/
        BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (result) {
            var node = $scope.options_12.api.getModel().rootNode.allLeafChildren;
            var data = [];
            for (var j = 0; j < node.length; j++) {
                data.push(node[j].data);
            }
            for (var i = 0; i < result.length; i++) {
                var item = {};
                item.seq = i + 1;
                item.prod_id = result[i].prod_id;
                item.pi_id = result[i].pi_id;
                item.prod_no = result[i].prod_no;
                item.pi_no = result[i].pi_no;
                item.amt = result[i].prod_amt;
                data.push(item);
            }
            $scope.options_12.api.setRowData(data);
            $scope.data.currItem.sale_prod_allo_plineofsale_prod_allo_headers=data;
        })
    };
    //删除行-生产单
    $scope.delitem2 = function () {
        //避免填写数据丢失
        $scope.options_12.api.stopEditing(false);
        var data = [];
        var rowidx = $scope.options_12.api.getFocusedCell().rowIndex;
        var node = $scope.options_12.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        data.splice(rowidx, 1);
        $scope.options_12.api.setRowData(data);
        $scope.data.currItem.sale_prod_allo_plineofsale_prod_allo_headers = data;

    };
    /*词汇值*/
    //状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            $scope.stats = HczyCommon.stringPropToNum(data.dicts);
        });
    $scope.bill_types=[
        {
            id:1,
            name:"到款PI分配"
        },
        {
            id:2,
            name:"信用证用途分配"
        },
        {
            id:4,
            name:"到款转入生产单"
        },
        {
            id:3,
            name:"无分配单"
        },
    ]
    //界面初始化
    $scope.clearinformation = function () {
        $scope.data.currItem.stat=1;
        $scope.data.currItem.creator=window.strUserId;
        $scope.data.currItem.create_time= moment().format('YYYY-MM-DD HH:mm:ss'),
        $scope.data.currItem.bill_type=4;
    };

    /**-------网格定义区域 ------*/
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
        cellRendererParams: {
            checkbox: true
        }
    };
    //金额分配明细
    $scope.columns_11 = [
        {
            headerName: "分配单号", field: "allo_no", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "PI号", field: "pi_no", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "分配金额", field: "allo_amt", editable: true, filter: 'set', width: 200,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "发货金额", field: "send_amt", editable: false, filter: 'set', width: 200,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
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
        }
    };
    //生产单分配明细
    $scope.columns_12 = [
        {
            headerName: "形式发票号", field: "pi_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "生产单号", field: "prod_no", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "应分配金额", field: "amt", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "生产单分配金额", field: "prod_amt", editable: true, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.options_12 = {
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
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_12.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };

    $scope.save_before=function(){
        var obj={};
        for(var i=0;i<$scope.data.currItem.sale_prod_allo_lineofsale_prod_allo_headers.length;i++){
            obj=$scope.data.currItem.sale_prod_allo_lineofsale_prod_allo_headers[i]
            obj.allo_amt=parseFloat(obj.allo_amt)||0;
            obj.send_amt=parseFloat(obj.send_amt)||0;
        }
        for(var i=0;i<$scope.data.currItem.sale_prod_allo_plineofsale_prod_allo_headers.length;i++){
            obj=$scope.data.currItem.sale_prod_allo_plineofsale_prod_allo_headers[i]
            obj.amt=Number(obj.amt)||0;
            obj.prod_amt=Number(obj.prod_amt)||0;
        }

    }

    $scope.initdata();

}

//加载控制器
basemanControllers
    .controller('sale_prod_allo_headerEdit', sale_prod_allo_headerEdit);
