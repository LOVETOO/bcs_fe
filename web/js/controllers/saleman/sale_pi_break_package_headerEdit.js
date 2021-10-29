var billmanControllers = angular.module('inspinia');
function sale_pi_break_package_headerEdit($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService,notify) {
    //继承基类方法
    sale_pi_break_package_headerEdit = HczyCommon.extend(sale_pi_break_package_headerEdit, ctrl_bill_public);
    sale_pi_break_package_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_pi_break_package_header",
        key: "pi_f_id",
        wftempid:10156,
        FrmInfo: {},
        grids: [{optionname: 'options_11', idname: 'sale_pi_pay_lineofsale_pi_break_package_headers'},//资金预览
            {optionname: 'options_12', idname: 'sale_pi_feeofsale_pi_break_package_headers'},//费用明细
            {optionname: 'options_13', idname: 'sale_pi_box_lineofsale_pi_break_package_headers'},//柜型柜量
            {optionname: 'options_14', idname: 'sale_pi_money_lineofsale_pi_break_package_headers'},//款项明细
            {optionname: 'options_15', idname: 'sale_pi_area_attributeofsale_pi_break_package_headers'},//机型参数
            {optionname: 'options_16', idname: 'sale_pi_item_mbdataofsale_pi_break_package_headers'},//机型面板

            {
                optionname: 'options_21',
                idname: 'sale_pi_item_h_lineofsale_pi_break_package_headers',
                line: {optionname: "options_22", idname: "sale_pi_item_lineofsale_pi_item_h_lines"}
            },//订单明细  分体机
            {optionname: 'options_23', idname: 'sale_pi_item_partofsale_pi_break_package_headers'},//配件清单

            {optionname: 'options_31', idname: 'sale_pi_item_conf2ofsale_pi_break_package_headers'},//当前机型
            {optionname: 'options_32', idname: 'sale_pi_item_confofsale_pi_break_package_headers'},//所有机型

            {      
                optionname: 'options_41',
                idname: 'sale_pi_break_headerofsale_pi_break_package_headers',
                line: {optionname: "options_42", idname: "sale_pi_break_line_fofsale_pi_break_headers"}
            },//打散-包装方案  打散方案明细（左）
            {
                optionname: 'options_41',
                idname: 'sale_pi_break_headerofsale_pi_break_package_headers',
                line: {optionname: "options_43", idname: "sale_pi_break_item_fofsale_pi_break_headers"}
            },//打散-包装方案  打散方案明细（右）
            {
                optionname: 'options_41',
                idname: 'sale_pi_break_headerofsale_pi_break_package_headers',
                line: {optionname: "options_44", idname: "sale_pi_break_item_fallofsale_pi_break_headers"}
            },//打散-包装方案  包装方案
			 {      
                optionname: 'options_41',
                idname: 'sale_pi_break_headerofsale_pi_break_package_headers',
                line: {optionname: "options_45", idname: "sale_bill_break_itemofsale_pi_break_headers"}
            },//辅料用量汇总
            //{optionname: 'options_46', idname: 'sale_pi_item_lineofsale_pi_headers'},标机BOM查看  保留数据，不需要更新
            {optionname: 'options_47', idname: ''},//包装方案（未维护）  前台计算
        ]
    };
    /**导出Excel*/
    $scope.exportjy2 = function () {
        if (!$scope.data.currItem.pi_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        BasemanService.RequestPost("sale_pi_header", "exporttoexceljy2", {'pi_id': $scope.data.currItem.pi_id})
            .then(function (data) {
                if (data.docid != undefined && Number(data.docid) != 0) {
                    var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                    window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                } else {
                    BasemanService.notice("导出失败!", "alert-info");
                }
            });
    }
    $scope.exportjy3 = function () {
        if (!$scope.data.currItem.pi_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        BasemanService.RequestPost("sale_pi_header", "exporttoexceljy3", {'pi_id': $scope.data.currItem.pi_id})
            .then(function (data) {
                if (data.docid != undefined && Number(data.docid) != 0) {
                    var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                    window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                } else {
                    BasemanService.notice("导出失败!", "alert-info");
                }
            });
    }
    $scope.exportjy4 = function () {
        if (!$scope.data.currItem.pi_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        BasemanService.RequestPost("sale_pi_header", "exporttoexceljy4", {'pi_id': $scope.data.currItem.pi_id})
            .then(function (data) {
                if (data.docid != undefined && Number(data.docid) != 0) {
                    var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                    window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                } else {
                    BasemanService.notice("导出失败!", "alert-info");
                }
            });
    }
    /************************初始化页面***********************/
	var datenow = new Date();
    var result = datenow.getFullYear()+'-'+(datenow.getMonth()+1)+'-'+datenow.getDate();
	var date=HczyCommon.getNewDay(result,180)
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            sales_user_id: window.strUserId,
            stat: 1,
            objattachs: [],
            days: 0,
			org_id: $scope.userbean.org_id,
            org_name: $scope.userbean.org_name,
            total_oth: 0,
            cust_part_rate: 0,
            commission_rate: 0,
            currency_id: 4,
            sale_ent_type: 1,
			item_type_id:"16",
			item_type_name:"家用空调",
			item_type_no:"110",
			ship_type:2,
			valid_date:date
        };
    };
    /**---------------------初始化页面----------------------*/
	$scope.summary =function(){
		var sum1=0,sum2=0;
		var row=$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers;
		if($scope.options_41.api.getFocusedCell()){
			var index=$scope.options_41.api.getFocusedCell().rowIndex
		}else{
			var index=0
		}
			for(var i=0;i<row.length;i++){
			 if(row[i].sale_bill_break_itemofsale_pi_break_headers){
				for(var j=0;j<row[i].sale_bill_break_itemofsale_pi_break_headers.length;j++){
					if(i==index){
					sum1+=parseFloat(row[i].sale_bill_break_itemofsale_pi_break_headers[j].package_qty||0)*parseFloat(row[i].sale_bill_break_itemofsale_pi_break_headers[j].package_tj||0)	
					}
					sum2+=parseFloat(row[i].sale_bill_break_itemofsale_pi_break_headers[j].package_qty||0)*parseFloat(row[i].sale_bill_break_itemofsale_pi_break_headers[j].package_tj||0)
				}
			 }
			}
			$scope.data.currItem.summary2=sum2;
			$scope.data.currItem.summary2=$scope.data.currItem.summary2.toFixed(3);
			$scope.data.currItem.summary1=sum1;
			$scope.data.currItem.summary1=$scope.data.currItem.summary1.toFixed(3);
	}
	//冒泡排序获取最大的序号
	$scope.sort =function(data){
		var temp=0;
		for(var i=0;i<data.length;i++){
			if((parseInt(data[i].line_id)>temp)){
				temp=parseInt(data[i].line_id);
			}
		}
		return temp;
	}
	
    /***********************保存校验区域*********************/
    $scope.validate = function () {
		var l=0,k=0;
		var nodes=$scope.options_23.api.getModel().rootNode.childrenAfterSort;
		var nodes1=$scope.options_21.api.getModel().rootNode.childrenAfterSort;
		for(var i=0;i<nodes.length;i++){
			l+=parseInt(nodes[i].data.require_qty)*parseFloat(nodes[i].data.psale_price);
		}
		for(var i=0;i<nodes1.length;i++){
			if(parseInt(nodes1[i].line_type)!=4){
			  k+=parseFloat(nodes1[i].data.sale_amt);
			}
		}
		if(k==0&&l!=0){
		$scope.data.currItem.part_rate=100;	
		}else if(l==0){
			$scope.data.currItem.part_rate=0;			
		}else{
			$scope.data.currItem.part_rate=HczyCommon.toDecimal2(parseFloat(l/k)*100);
		}
		/**var data=$scope.gridGetData("options_43");
		for(var i=0;i<$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers.length;i++){
			for(var j=0;j<$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[i].sale_pi_break_item_fofsale_pi_break_headers.length;j++){
				for(name in $scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[i].sale_pi_break_item_fofsale_pi_break_headers[j]){
					if(name=="line_id"||name=="item_code"||name=="item_name"||name=="ptype_name"||name=="pack_name"||name=="item_qty"||name=="bom_level")
					if($scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[i].sale_pi_break_item_fofsale_pi_break_headers[j][name]==""){
					BasemanService.notice("打散方案清单必须全部填写，请检查", "alert-warning");
                    return false;	
					}
				}
			}
		}*/		
        var errorlist = [];
        $scope.data.currItem.sales_user_id == undefined ? errorlist.push("业务员为空") : 0;
        $scope.data.currItem.cust_code == undefined ? errorlist.push("客户为空") : 0;
        $scope.data.currItem.currency_id == undefined ? errorlist.push("币种为空") : 0;
        $scope.data.currItem.sale_ent_type == undefined ? errorlist.push("贸易类型为空") : 0;
        $scope.data.currItem.price_type_id == undefined ? errorlist.push("价格条款为空") : 0;
        $scope.data.currItem.sale_order_type == undefined ? errorlist.push("订单类型为空") : 0;
        $scope.data.currItem.item_type_name == undefined ? errorlist.push("产品大类为空") : 0;
		$scope.data.currItem.pre_ship_date == undefined ? errorlist.push("预计出货日期为空") : 0;
        isNaN($scope.data.currItem.part_rate) ? errorlist.push("配件比例为空") : 0;
        isNaN($scope.data.currItem.cust_part_rate) ? errorlist.push("客户配件比例为空") : 0;
        isNaN($scope.data.currItem.commission_rate) ? errorlist.push("佣金为空") : 0;
        $scope.data.currItem.item_type_name == undefined ? errorlist.push("产品大类为空") : 0;
        $scope.data.currItem.seaport_out_name == undefined ? errorlist.push("出货港为空") : 0;
		$scope.data.currItem.valid_date == undefined ? errorlist.push("有效期为空") : 0;
        if (errorlist.length) {
            BasemanService.notify(notify,errorlist, "alert-danger");
            return false;
        }
        return true;
    }
	
	
	
    /**----------------------保存校验区域-------------------*/
	//复制历史
	$scope.copy =function(){
		$scope.FrmInfo = {
            classid: "sale_pi_header",
        };
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
			 $scope.data.currItem.copy=1;
             $scope.data.currItem.pi_id=result.pi_id;
			 $scope.refresh(2);
        });
		
	}
	
	$scope.save_before =function(){
		delete $scope.data.currItem[""];
        var postdata = $scope.data.currItem;
        postdata.flag=0;
		$scope.data.currItem.material_rate=postdata.material_rate=$scope.data.currItem.material_rate || 0;
		$scope.data.currItem.contract_subscrp!=undefined ? postdata.contract_subscrp=$scope.data.currItem.contract_subscrp : 0;
		$scope.data.currItem.zb_amt=postdata.zb_amt=$scope.data.currItem.zb_amt || 0;
		for(var i=0;i<$scope.data.currItem.sale_pi_item_h_lineofsale_pi_break_package_headers.length;i++){
			$scope.data.currItem.sale_pi_item_h_lineofsale_pi_break_package_headers[i].seq=parseInt(i+1);
		}
		

	}   
	/**********************刷新******************************/
	$scope.refresh_after= function(){
		$scope.data.brandlist=$scope.data.currItem.customer_brandofcustomers;
		if($scope.options_41.api.getFocusedCell()){
			var rowidx = $scope.options_41.api.getFocusedCell().rowIndex;	
            $scope.options_42.api.setRowData($scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_line_fofsale_pi_break_headers);			
			$scope.options_43.api.setRowData($scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_item_fofsale_pi_break_headers);
			$scope.options_44.api.setRowData($scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_item_fallofsale_pi_break_headers);
		}else{
			var rowidx=0;
			$scope.options_42.api.setRowData($scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_line_fofsale_pi_break_headers);			
			$scope.options_43.api.setRowData($scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_item_fofsale_pi_break_headers);
			$scope.options_44.api.setRowData($scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_item_fallofsale_pi_break_headers);
		}
		//复制历史
		if($scope.data.currItem.copy==1){
			$scope.data.currItem.pi_id="";
			$scope.data.currItem.pi_no="";
		}
		if($scope.data.currItem.currprocname=="打散方案维护"){
		for(var i=0;i<$scope.columns_41.length;i++){
			if($scope.columns_41[i].field=="break_name"||$scope.columns_41[i].field=="assembly_name"||$scope.columns_41[i].field=="item_type_name"){
				$scope.columns_41[i].editable=true;
			}
		}
		for(var i=1;i<$scope.columns_42.length;i++){			
				$scope.columns_42[i].editable=true;
		}
		for(var i=0;i<$scope.columns_43.length;i++){
				$scope.columns_43[i].editable=true;
		}
		for(var i=0;i<$scope.columns_44.length;i++){
			if($scope.columns_44[i].field=="ptype_name"||$scope.columns_44[i].field=="item_code"||$scope.columns_44[i].field=="item_qty"||$scope.columns_44[i].field=="pack_name"||$scope.columns_44[i].field=="note"){
				$scope.columns_44[i].editable=true;
			}
		  }
		}
		
		if($scope.data.currItem.currprocname=="包装方案维护"){
		for(var i=0;i<$scope.columns_44.length;i++){
		if($scope.columns_44[i].field=="ptype_name"||$scope.columns_44[i].field=="item_code"||$scope.columns_44[i].field=="item_uom"||$scope.columns_44[i].field=="item_qty"||$scope.columns_44[i].field=="pack_name"){
				$scope.columns_44[i].editable=true;
			}
		  }
		}
		$scope.summary();
		$scope.updateColumns();
	}
	/*---------------------刷新------------------------------/
	
	
	/**********************提交前校验*************************/
	$scope.wfstart_before =function(){
		var postdata={};
		postdata.pi_f_id=$scope.data.currItem.pi_f_id;

		var obj=BasemanService.RequestPost("sale_pi_break_package_header", "commitcheck",postdata)
        return obj;
	}	
	/**--------------------提交前校验------------------------*/
	
	
	
	/***********************权限控制*********************/
	function fnPIconfBgClose1() {
    if (!document.getElementById('divPIconfBg')) {
        return;
    }
    if (!document.getElementById('divPIconfBgIframe')) {
        return;
    }
    document.getElementById('divPIconfBgIframe').src = '';
    document.getElementById('divPIconfBgIframe').style.display = 'none';
    document.getElementById('divPIconfBg').style.display = 'none';
	
	$("#divPIconfBgIframe").remove();
	$("#divPIconfBg").remove();
	$("#divPIconfBgClose").remove();
}
    $scope.rowDoubleClicked44 =function(e){
		if (e.api.getFocusedCell().column.colId == "package_name") {	
    var h = document.body.offsetHeight,
        w = document.body.offsetWidth; //获取背景窗口大小 
    if (!document.getElementById('divPIconfBg')) {
        var div = document.createElement('div'); //创建背景蒙板 
        div.id = 'divPIconfBg';
        div.style.backgroundColor = 'white';
        div.style.position = 'absolute';
        // div.style.filter = 'alpha(opacity=80)';
        // div.style.opacity = '.80';
        div.style.zIndex = 100001;
        div.style.left = 0;
        div.style.top = 0;
        div.style.width = w + 'px';
        div.style.height = h + 'px';
        document.body.appendChild(div);

    }
    if (!document.getElementById('divPIconfBgClose')) {
        var div = document.createElement('div'); //创建关闭按钮在蒙板上 
        div.id = 'divPIconfBgClose';
        div.style.backgroundColor = "#1ab394";
        //div.style.position = 'absolute';
        //div.style.backgroundImage = 'url(img/boxy_btn.png)';
        div.style.zIndex = 100003;
        div.style.left = 0;
        div.style.top = 0;
        div.style.width = w + "px";
        div.style.height = '36px';

        var divClose = document.createElement("a");
        divClose.id = "divPIconfCloseBtn";
        divClose.style.backgroundColur = "red";
        divClose.style.position = 'absolute';
        divClose.style.backgroundImage = 'url(img/boxy_btn.png)';
        divClose.style.zIndex = 100004;
        divClose.style.right = 0;
        divClose.style.top = 0;
        divClose.style.width = "120px";
        divClose.style.height = '36px';
        divClose.style.paddingTop = '10px';
        divClose.title = '关闭';
        divClose.innerHTML = "<<返回";
		divClose.style.color = 'white';
		divClose.style.font.size = "16px";
        divClose.style.cursor = 'hand';
        divClose.onclick = function() { //点击时间 ，关闭蒙板 
            fnPIconfBgClose1();
        };

        div.appendChild(divClose);

        document.getElementById('divPIconfBg').appendChild(div);
    }
    if (!document.getElementById('divPIconfBgIframe')) {
        var iframe;
        iframe = document.createElement('IFRAME'); //创建蒙板内的内嵌iframe容器，用于嵌入显示其他网页 
        iframe.id = 'divPIconfBgIframe';
        iframe.frameBorder = '0';
        //iframe.scrolling = "no";
        iframe.style.overflow = 'hidden';
        iframe.allowTransparency = 'true';
        iframe.style.display = 'none';
        iframe.style.width = w + 'px'; //800 
        iframe.style.height = h - 36 + 'px'; //620 
        iframe.style.top = '36px'; //800 
        document.getElementById('divPIconfBg').appendChild(iframe);
    }

    document.getElementById('divPIconfBgClose').style.display = 'block';
    document.getElementById('divPIconfBgIframe').style.display = 'block';

    document.getElementById('divPIconfBg').style.display = 'block';
    var data=$scope.gridGetData("options_44");
	var index=$scope.options_44.api.getFocusedCell().rowIndex;
	var pcsurl = "http://100.100.10.167:8080/web/index.jsp#/crmman/sale_package_headerEdit?package_id="+data[index].package_id+"&item_code="+data[index].item_code+"&item_name="+data[index].item_name+"&item_id="+data[index].item_id;	       
    document.getElementById('divPIconfBgIframe').src = pcsurl;		
	}
	}
	if (window.userbean) {
        $scope.userbean = window.userbean;
    }
    //用户权限
    $scope.user_auth = {
        //知否有区域总监权限
        area_auth: false
    };
    //业务员,区总,系总,财务,事总权限
    var mystring = $scope.userbean.stringofrole;
    $scope.user_auth.saleman_auth = mystring.indexOf("销售人员") > -1 ? true : false;
    $scope.user_auth.areamanager_auth = mystring.indexOf("大区总监") > -1 ? true : false;
    $scope.user_auth.system_auth = mystring.indexOf("外总") > -1 ? true : false;
    $scope.user_auth.departmen_auth = mystring.indexOf("事总") > -1 ? true : false;
    $scope.user_auth.infance_auth = mystring.indexOf("财务部") > -1 ? true : false;
    $scope.user_auth.admin_auth = mystring.indexOf("admin") > -1 ? true : false;
    /**---------------------权限控制-------------------*/
	

    /******************  页面隐藏****************************/
    $scope.show_11 = false;
    $scope.show11 = function () {
        $scope.show_11 = !$scope.show_11;
    };
    $scope.show_12 = false;
    $scope.show12 = function () {
        $scope.show_12 = !$scope.show_12;
    };
    $scope.show_13 = false;
    $scope.show13 = function () {
        $scope.show_13 = !$scope.show_13;
    };
    $scope.show_14 = false;
    $scope.show14 = function () {
        $scope.show_14 = !$scope.show_14;
    };
    $scope.show_15 = false;
    $scope.show15 = function () {
        $scope.show_15 = !$scope.show_15;
    };
    $scope.show_16 = false;
    $scope.show16 = function () {
        $scope.show_16 = !$scope.show_16;
    };
	$scope.show_17 = false;
    $scope.show17 = function () {
        $scope.show_17 = !$scope.show_17;
    };
    //sheet 第2页
    $scope.show_21 = true;
    $scope.show21 = function () {
        $scope.show_21 = !$scope.show_21;
    };
    $scope.show_22 = false;
    $scope.show22 = function () {
        $scope.show_22 = !$scope.show_22;
    };
    //sheet 第3页
    $scope.show_31 = false;
    $scope.show31 = function () {
        $scope.show_31 = !$scope.show_31;
    };
    //sheet 第4页
    $scope.show_41 = false;
    $scope.show41 = function () {
        $scope.show_41 = !$scope.show_41;
    };
    $scope.show_42 = false;
    $scope.show42 = function () {
        $scope.show_42 = !$scope.show_42;
    };
    $scope.show_43 = false;
    $scope.show43 = function () {
        $scope.show_43 = !$scope.show_43;
    };
    $scope.show_44 = false;
    $scope.show44 = function () {
        $scope.show_44 = !$scope.show_44;
    };
    $scope.show_45 = false;
    $scope.show45 = function () {
        $scope.show_45 = !$scope.show_45;
    };

    /**----------------页面隐藏------------------------*/
    if (window.userbean) {
        $scope.userbean = window.userbean;
    }
    /**********************下拉框值查询（系统词汇）***************/
    //状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        var stats = [];
        for (var i = 0; i < data.dicts.length; i++) {
            object = {};
            object.id = data.dicts[i].dictvalue;
            object.name = data.dicts[i].dictname;
            stats.push(object);
        }
        $scope.stats = stats;
    })
    //币种
    BasemanService.RequestPost("base_search", "searchcurrency", {}).then(function (data) {
        $scope.base_currencys = data.base_currencys;
    });
    //贸易类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"}).then(function (data) {
        $scope.sale_ent_types = data.dicts;
    })
	
	 //区域等级
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "area_level"}).then(function (data) {
        $scope.area_levels = data.dicts;
    })
	
	//客户等级
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "cust_level"}).then(function (data) {
        $scope.cust_levels = data.dicts;
    })
    //价格条款
    var promise = BasemanService.RequestPostAjax("price_type", "search", "");
    promise.then(function (data) {
        $scope.price_types = [];
        for (var i = 0; i < data.price_types.length; i++) {
            var newobj = {
                dictvalue: parseInt(data.price_types[i].price_type_id),
                dictcode: data.price_types[i].price_type_code,
                dictname: data.price_types[i].price_type_name
            }
            $scope.price_types.push(newobj)
        }
    });
    //订单类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "sale_order_type"}).then(function (data) {
        $scope.sale_order_types = data.dicts;
    })
    //发运方式
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "ship_type"}).then(function (data) {
        $scope.ship_types = data.dicts;
    })
    //汇率
    var promise = BasemanService.RequestPostAjax("base_currency", "search", "");
    promise.then(function (data) {
        $scope.currencys = HczyCommon.stringPropToNum(data.base_currencys);
    });
    /**网格下拉值*/
    //柜型 box_type
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "box_type"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
            //柜型柜量
            $scope.columns_13[1].cellEditorParams.values.push(newobj)
        }
    })
    //参数类型 row_type
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "row_type"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
            //机型参数
            $scope.columns_15[4].cellEditorParams.values.push(newobj);
			
        }
    })

    // 类型 line_type
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "line_type"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
            //订单明细
            $scope.columns_21[3].cellEditorParams.values.push(newobj);
        }
    })
    // 机型类别 pro_type
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pro_type"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
            //分体机
            $scope.columns_22[0].cellEditorParams.values.push(newobj)
        }
    })
    //散件类型 sj_type
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "sj_type"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
            //分体机
            $scope.columns_22[1].cellEditorParams.values.push(newobj);
            //打散-包装方案
            $scope.columns_41[0].cellEditorParams.values.push(newobj);
        }
    })

    // 包装方式 pack_name
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pack_type"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
            //打散方案明细（左）
            $scope.columns_42[5].cellEditorParams.values.push(newobj);
            //打散方案明细（右）
            $scope.columns_43[4].cellEditorParams.values.push(newobj);
			//包装方案
			$scope.columns_44[8].cellEditorParams.values.push(newobj);
			//包装方案（未维护）
			$scope.columns_47[9].cellEditorParams.values.push(newobj);
			
        }
    })
	
	//BOM包类型
	BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "package_ware"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
			//包装方案
			$scope.columns_44[18].cellEditorParams.values.push(newobj);
			$scope.columns_44[19].cellEditorParams.values.push(newobj);
			$scope.columns_47[19].cellEditorParams.values.push(newobj);
			$scope.columns_47[20].cellEditorParams.values.push(newobj);
			$scope.columns_45[0].cellEditorParams.values.push(newobj);
			
        }
    })
	
	//生产类型
	BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "made_type"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
			//包装方案
			$scope.columns_44[20].cellEditorParams.values.push(newobj);
        }
    })
	//所属箱型 item_type
	BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "item_type"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
			//包装方案
			$scope.columns_44[21].cellEditorParams.values.push(newobj);
			$scope.columns_47[22].cellEditorParams.values.push(newobj);
			
			$scope.columns_45[8].cellEditorParams.values.push(newobj);
        }
    })
    /**--------------------下拉框值查询（系统词汇）-------------*/

    /**********************弹出框值查询**************************/
    //部门
    $scope.selectorg = function () {
        $scope.FrmInfo = {
            classid: "scporg",
            backdatas: "orgs",
            sqlBlock: "stat =2 and orgtype = 5",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_id = parseInt(result.orgid);
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_name = result.orgname;
            $scope.data.currItem.area_level = parseInt(result.lev);
        });
    }
    //业务员查询
    $scope.scpuser = function () {
        if ($scope.data.currItem.org_id == undefined || $scope.data.currItem.org_id == "") {
            BasemanService.notice("请先选择业务部门", "alert-warning")
            return;
        }
        $scope.FrmInfo = {
            classid: "scpuser",
            postdata: {
                flag: 10,
				org_id:parseInt($scope.data.currItem.org_id)
            },
            backdatas: "users"
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.sales_user_id = result.userid;
        });
    }

    //客户
    $scope.selectcust = function () {
        if ($scope.data.currItem.org_id == undefined || $scope.data.currItem.org_id == "") {
            BasemanService.notice("请先选择业务部门", "alert-warning");
            return;
        }
        $scope.FrmInfo = {
            classid: "customer",
            postdata: {},
            sqlBlock: "(org_id=" + $scope.data.currItem.org_id
            + " or other_org_ids like '%," + $scope.data.currItem.org_id + ",%')",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.cust_id = result.cust_id;
            $scope.data.currItem.cust_code = result.sap_code;
            $scope.data.currItem.cust_name = result.cust_name;
            $scope.data.currItem.cust_level = result.cust_level;

            $scope.data.currItem.rebate_rate = result.rebate_rate;// 返利率

            $scope.data.currItem.area_code = result.area_code;
            $scope.data.currItem.area_id = result.area_id;
            $scope.data.currItem.area_name = result.area_name;
            $scope.data.currItem.area_level = result.area_level;
            $scope.data.currItem.manager = result.manager;

            $scope.data.currItem.tel = result.tel;
            $scope.data.currItem.address = result.address;
            $scope.data.currItem.weburl = result.web_url;
            $scope.data.currItem.fax = result.fax;

            $scope.data.currItem.commission_rate = result.commission_rate;
            $scope.data.currItem.sale_ent_type = parseInt(result.sale_ent_type);
            $scope.data.currItem.lc_rate = result.lc_rate;

            $scope.data.currItem.xb_rate = undefined;
            $scope.data.currItem.payment_type_id = undefined;
            $scope.data.currItem.payment_type_name = undefined;
            $scope.data.currItem.payment_type_code = undefined;

            //查询客户时改变的pi(业务逻辑)
            var postdata = {cust_id: parseInt(result.cust_id)};
            $scope.cust_changepi(postdata);
        });

    };

    //产品大类查询
    $scope.pro_item_type = function () {
        $scope.FrmInfo = {
            classid: "pro_item_type",
            backdatas: "pro_item_types",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			$scope.data.currItem.item_type_id = result.item_type_id;	
            $scope.data.currItem.item_type_no = result.item_type_no;
            $scope.data.currItem.item_type_name = result.item_type_name;
        });
    }

    //目的国
    $scope.openAreaNameFrm = function () {
        var FrmInfo = {};
        $scope.FrmInfo = {
            classid: "scparea",
            postdata: {},
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.area_id = result.areaid;
            $scope.data.currItem.area_code = result.areacode;
            $scope.data.currItem.area_name = result.areaname;
        });

    }
    // 到货港
    $scope.searchSeaportInName = function () {
        $scope.FrmInfo = {
            classid: "seaport",
            postdata: {
                seaport_type: 2,
            },
        };
        if ($scope.data.currItem.area_name != undefined && $scope.data.currItem.area_name != "") {
            $scope.FrmInfo.sqlBlock = " area_id in(" + $scope.data.currItem.area_id + ",0)";
        }
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.seaport_in_id = result.seaport_id;
            $scope.data.currItem.seaport_in_name = result.seaport_name;
            $scope.data.currItem.seaport_in_code = result.seaport_code;
        });
    }
    // 出货港
    $scope.searchSeaportOut = function () {
        $scope.FrmInfo = {
            classid: "seaport",
            postdata: {
                seaport_type: 1,
            },
        };
        if ($scope.data.currItem.area_name != undefined && $scope.data.currItem.area_name != "") {
            $scope.FrmInfo.sqlBlock = " area_id in(" + $scope.data.currItem.area_id + ",0)";
        }
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.seaport_out_id = result.seaport_id;
            $scope.data.currItem.seaport_out_code = result.seaport_code;
            $scope.data.currItem.seaport_out_name = result.seaport_name;
            $scope.data.currItem.seaport_out_type = result.seaport_type;
        });
    }


    /*********网格弹出框值查询***/
    //柜型柜量 到货港
    $scope.seaport_in_name13 = function () {
        $scope.FrmInfo = {
            classid: "seaport",
            postdata: {
                seaport_type: 2,
            },
        };
        if ($scope.data.currItem.area_name != undefined && $scope.data.currItem.area_name != "") {
            $scope.FrmInfo.sqlBlock = " area_id in(" + $scope.data.currItem.area_id + ",0)";
        }
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            var data = [];
            var index = $scope.options_13.api.getFocusedCell().rowIndex;
            var node = $scope.options_13.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data)
            }
            data[index].seaport_in_name = result.seaport_name;
            data[index].seaport_in_code = result.seaport_code;
            data[index].seaport_in_id = result.seaport_id;
            $scope.options_13.api.setRowData(data);
        });
    }

    //订单明细  国家
      $scope.area_names21 = function () {
        var FrmInfo = {};
        $scope.FrmInfo = {
			is_custom_search:true,
			type:"checkbox",
            title: "国家",
            thead: [
                {
                    name: "国家编码",
                    code: "areacode"
                }, {
                    name: "国家名称",
                    code: "areaname"
                }, {
                    name: "国家中文",
                    code: "telzone"
                }],
            classid: "scparea",
            postdata: {},
            searchlist: ["areacode", "areaname"],
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            var data = [];
            var index = $scope.options_21.api.getFocusedCell().rowIndex;
            var node = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data)
            }
			data[index].area_names="";
			data[index].area_ids="";
			for(var i=0;i<result.length;i++){
				if(i==result.length-1){
					data[index].area_names+=result[i].telzone;
					data[index].area_ids+=result[i].areaid;
				}else{
					data[index].area_names+=result[i].telzone+",";
					data[index].area_ids+=result[i].areaid+",";
				}
			}
            $scope.options_21.api.setRowData(data);

        });

    }

    //订单明细  工厂型号编码
     $scope.item_h_code21 = function () {
		$scope.FrmInfo = {};
        $scope.FrmInfo.postdata = {},
        $scope.FrmInfo.postdata.flag = 2;
        $scope.FrmInfo.postdata.cust_id = $scope.data.currItem.cust_id;
        $scope.FrmInfo.postdata.pro_type=$scope.options_21.api.getModel().rootNode.childrenAfterSort[$scope.options_21.api.getFocusedCell().rowIndex].data.line_type;
        BasemanService.openFrm("views/saleman/item_h_code.html", item_h_code, $scope, "", "lg")
            .result.then(function (items) {
            var index = $scope.options_21.api.getFocusedCell().rowIndex;
            var node = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
			var data = []
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data);
            };
            //var item = {};
			if(items.cust_item_name!=undefined){
			data[index].cust_item_name = items.cust_item_name;
			}
            if(items.qty!=undefined){
			data[index].qty = parseInt(items.qty);
			}
			if(items.price!=undefined){
			data[index].price = parseFloat(items.price);
			}
            if(items.brand_name!=undefined){
			data[index].brand_name = items.brand_name;
			}
			data[index].sale_amt =parseInt(data[index].qty||0)*parseFloat(data[index].price||0);			
            data[index].item_h_id = items.item_h_id;
            data[index].h_spec = items.h_spec;
            data[index].item_h_code = items.item_h_code;
            data[index].item_h_name = items.item_h_name;
//            data[index].apply_price = parseFloat(items.price);
            //item.price = "";
            data[index].line_type = parseInt(items.line_type);
            data[index].pro_type = parseInt(items.pro_type);
            data[index].item_desc = items.h_spec;
            data[index].superid = parseInt(items.superid);
            data[index].seq = parseInt(node[index].data.seq);

            $scope.data.currItem.sale_pi_item_h_lineofsale_pi_break_package_headers = data;
            $scope.options_21.api.setRowData(data);
			$scope.options_31.api.setRowData([]);
            // 查询分体机(业务逻辑操作)
            $scope.proItem(data[index].pro_type, parseInt(index), parseInt(data[index].item_h_id));
        });
    }

    //打散-包装方案明细  打散方案查询
    $scope.break_name41 = function () {
        $scope.FrmInfo = {
            classid: "sale_break_header",
            postdata: {
                flag: 3
            },
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            var index = $scope.options_41.api.getFocusedCell().rowIndex;
            var node = $scope.options_41.api.getModel().rootNode.childrenAfterSort;
            var data = [];
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data);
            };
			data[index].break_id = result.break_id;
            data[index].break_name = result.break_name;
            data[index].assembly_name = result.assembly_name;

            $scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers = data;
            $scope.options_41.api.setRowData(data);
			
			var promise = BasemanService.RequestPost("sale_break_header", "select", {break_id:result.break_id});
            promise.then(function (data) {
			$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[index].sale_pi_break_line_fofsale_pi_break_headers=data.sale_break_lineofsale_break_headers;
			$scope.options_42.api.setRowData(data.sale_break_lineofsale_break_headers);
			});
			
			
        });
    }
	//删除打散-包装方案明细
	$scope.cellchange41 = function () {
            var _this = $(this);	var val = _this.val();
            var index = $scope.options_41.api.getFocusedCell().rowIndex;
            var node = $scope.options_41.api.getModel().rootNode.childrenAfterSort;
            var data = [];
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data);
            };
            if(val==""){
			$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[index].sale_pi_break_line_fofsale_pi_break_headers=[];	
			$scope.options_42.api.setRowData([]);
			$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[index].sale_pi_break_item_fofsale_pi_break_headers=[];
			$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[index].sale_pi_break_item_fallofsale_pi_break_headers=[];
			$scope.options_43.api.setRowData($scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[index].sale_pi_break_item_fofsale_pi_break_headers);
			$scope.options_44.api.setRowData($scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[index].sale_pi_break_item_fallofsale_pi_break_headers);
			}		
    }
    //打散-包装方案明细  装配规则
    $scope.assembly_name41 = function () {
        $scope.FrmInfo = {
            classid: "sale_assembly_header",
            postdata: {
                stat: 5
            },
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            var index = $scope.options_41.api.getFocusedCell().rowIndex;
            var node = $scope.options_41.api.getModel().rootNode.childrenAfterSort;
            var data = [];
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data);
            }
            ;
            data[index].assembly_id = result.assembly_id;
            data[index].assembly_name = result.assembly_name;

            $scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers = data;
            $scope.options_41.api.setRowData(data);
        });
    }
	//打散-包装方案明细  打散大类名称
    $scope.item_type_name41 = function () {
        $scope.FrmInfo = {
            classid: "base_make_factor",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            var index = $scope.options_41.api.getFocusedCell().rowIndex;
            var node = $scope.options_41.api.getModel().rootNode.childrenAfterSort;
            var data = [];
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data);
            };
			data[index].item_type_id = result.item_type_id;
            data[index].item_type_name = result.item_type_name;
            data[index].made_sx = result.sx;

            $scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers = data;
            $scope.options_41.api.setRowData(data);
        });
    }
	
	$scope.item_code43 = function () {
        $scope.FrmInfo = {
			is_custom_search:true,
            title: "物料查询",
            thead: [{
                name: "物料名称",
                code: "item_name"
            }, {
                name: "物料编码",
                code: "item_code"
            }],
			
            classid: "sale_pi_header",
			postdata: {
                flag: 57,
				item_code:$scope.options_41.api.getModel().rootNode.childrenAfterSort[$scope.options_41.api.getFocusedCell().rowIndex].data.item_code
            },
            searchlist: ["item_name", "item_code"]
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
		    var rowidx = $scope.options_41.api.getFocusedCell().rowIndex;
            var index = $scope.options_43.api.getFocusedCell().rowIndex;
            var node = $scope.options_43.api.getModel().rootNode.childrenAfterSort;
            var data = [];
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data);
            };
			data[index].item_code = result.item_code;
            data[index].item_name = result.item_name;
			data[index].item_id = result.item_id;
            data[index].pack_name = 1;
			data[index].item_qty = (result.amt);
			data[index].item_ids=result.po_no;
			data[index].item_uom=result.pi_no;
			data[index].bom_level=result.bom_level;
			
			$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_item_fofsale_pi_break_headers=data;
		    $scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_item_fallofsale_pi_break_headers=data;
            $scope.options_43.api.setRowData(data);
        });
    }
	//方案类型
	$scope.ptype_name43 = function () {
        $scope.FrmInfo = {
            classid: "sale_pack_type",
			postdata: {
                flag: 1
            },
        };
		$scope.FrmInfo.sqlBlock = " usable=2";
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			var rowidx = $scope.options_41.api.getFocusedCell().rowIndex;
            var index = $scope.options_43.api.getFocusedCell().rowIndex;
            var node = $scope.options_43.api.getModel().rootNode.childrenAfterSort;
            var data = [];
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data);
            };
			data[index].ptype_id = result.pack_id;
            data[index].ptype_name = result.pack_name;
			
			$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_item_fofsale_pi_break_headers=data;
		    $scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_item_fallofsale_pi_break_headers=data;
            $scope.options_43.api.setRowData(data);
        });
    }
	$scope.item_code44 = function () {
        $scope.FrmInfo = {
			is_custom_search:true,
            title: "物料查询",
            thead: [{
                name: "物料名称",
                code: "item_name"
            }, {
                name: "物料编码",
                code: "item_code"
            }],
			
            classid: "sale_pi_header",
			postdata: {
                flag: 57,
				item_code:$scope.options_41.api.getModel().rootNode.childrenAfterSort[$scope.options_41.api.getFocusedCell().rowIndex].data.item_code
            },
            searchlist: ["item_name", "item_code"]
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
		    var rowidx = $scope.options_41.api.getFocusedCell().rowIndex;
            var index = $scope.options_44.api.getFocusedCell().rowIndex;
            var node = $scope.options_44.api.getModel().rootNode.childrenAfterSort;
            var data = [];
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data);
            };
			data[index].item_code = result.item_code;
            data[index].item_name = result.item_name;
			data[index].item_id = result.item_id;
            data[index].pack_name = 1;
			data[index].item_qty = (result.amt);
			data[index].item_ids=result.po_no;
			data[index].item_uom=result.pi_no;
			data[index].bom_level=result.bom_level;
			
			$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_item_fofsale_pi_break_headers=data;
		    $scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_item_fallofsale_pi_break_headers=data;
            $scope.options_44.api.setRowData(data);
        });
    }
	
	//方案类型
	$scope.ptype_name44 = function () {
        $scope.FrmInfo = {
            classid: "sale_pack_type",
			postdata: {
                flag: 1
            },
        };
		$scope.FrmInfo.sqlBlock = " usable=2";
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			if(!$scope.options_41.api.getFocusedCell()){
				var rowidx=0
			}else{
			    var rowidx = $scope.options_41.api.getFocusedCell().rowIndex;
			}
            var index = $scope.options_44.api.getFocusedCell().rowIndex;
            var node = $scope.options_44.api.getModel().rootNode.childrenAfterSort;
            var data = [];
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data);
            };
			data[index].ptype_id = result.pack_id;
            data[index].ptype_name = result.pack_name;
			
			$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_item_fofsale_pi_break_headers=data;
		    $scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_item_fallofsale_pi_break_headers=data;
            $scope.options_44.api.setRowData(data);
        });
    }
    /**--------------------弹出框值查询-------------------------------*/
    /**********************业务逻辑控制*******************************/
    //查询客户改变pi
    $scope.cust_changepi = function (postdata) {
        var promise = BasemanService.RequestPost("customer", "select", postdata);
        promise.then(function (data) {
            // 查询汇率
            $scope.currencychange();
            $scope.data.currItem.currency_id = parseInt(data.currency_id);
            $scope.data.currItem.currency_code = data.currency_code;
            $scope.data.currItem.currency_name = data.currency_name;
            $scope.data.currItem.sale_ent_type = data.trade_type;
            $scope.data.currItem.part_rate_byhand = parseFloat(data.part_rate);// 免费配件比例
            $scope.data.currItem.cust_part_rate = parseFloat(data.part_rate);// 客户配件比例
            $scope.data.currItem.rebate_rate = parseFloat(data.rebate_rate);// 返利比例
            $scope.data.commission_amt = parseFloat(data.commission_amt);// 佣金比例
            $scope.data.currItem.customer_payment_typeofcustomers = (data.customer_payment_typeofcustomers);
            for (var i = 0; i < data.customer_payment_typeofcustomers.length; i++) {
                $scope.data.currItem.customer_payment_typeofcustomers[i].payment_type_id =
                    data.customer_payment_typeofcustomers[i].payment_type_id;
            }
            $scope.data.currItem.customer_brandofcustomers = (data.customer_brandofcustomers);
            if ($scope.data.currItem.customer_brandofcustomers.length > 0)$scope.data.currItem.brand_name = $scope.data.currItem.customer_brandofcustomers[0].brand_name;
            if ($scope.data.currItem.customer_payment_typeofcustomers.length > 0) {
                $scope.data.currItem.payment_type_line_id = parseInt($scope.data.currItem.customer_payment_typeofcustomers[0].seq);
                $scope.data.currItem.payment_type_id = $scope.data.currItem.customer_payment_typeofcustomers[0].payment_type_id;
                $scope.data.currItem.payment_type_code = $scope.data.currItem.customer_payment_typeofcustomers[0].payment_type_code;
                $scope.data.currItem.payment_type_name = $scope.data.currItem.customer_payment_typeofcustomers[0].payment_type_name;
                $scope.data.currItem.contract_subscrp = parseFloat($scope.data.currItem.customer_payment_typeofcustomers[0].contract_subscrp);
                // 查询客户获取付款方式明细
                $scope.openCustPriceType();
            }
            // 产品品牌
            $scope.data.brandlist = [];
            if (data.customer_brandofcustomers.length) {
                for (var i = 0; i < data.customer_brandofcustomers.length; i++) {
                    var newobj = {
                        brand_name: data.customer_brandofcustomers[i].brand_name,
                    };
                    $scope.data.brandlist.push(newobj);
                }
            } else {
                var newobj = {brand_name: ""};
                $scope.data.brandlist.push(newobj);
            }

            // 重选客户 -- 清空 产品明细和其细表
            $scope.options_21.api.setRowData([]);
            $scope.options_22.api.setRowData([]);
            // 取配件费用额度
            $scope.getpartlimit($scope.data.currItem.cust_id);

        })
    }

    // 查询客户获取付款方式明细
    $scope.openCustPriceType = function () {
        if ($scope.data.currItem.customer_payment_typeofcustomers.length > 0) {
            var payment_type_id = $scope.data.currItem.payment_type_id;
            $scope.data.currItem.payment_type_line_id = 0;
            var cust_id = 0;
            for (var i = 0; i < $scope.data.currItem.customer_payment_typeofcustomers.length; i++) {
                if (payment_type_id != $scope.data.currItem.customer_payment_typeofcustomers[i].payment_type_id) {
                    continue;
                } else {
                    $scope.data.currItem.payment_type_line_id = $scope.data.currItem.customer_payment_typeofcustomers[i].seq;
                    cust_id = $scope.data.currItem.customer_payment_typeofcustomers[i].cust_id;
                }
                ;
            }
            var str_payment = payment_type_id;
            var postdata = {
                payment_type_id: str_payment,
                cust_id: cust_id,
                payment_type_line_id: $scope.data.currItem.payment_type_line_id

            };
            BasemanService.RequestPost("customer", "getpayline", postdata)
                .then(function (data) {
                    $scope.data.currItem.sale_pi_pay_lineofsale_pi_break_package_headers = HczyCommon.stringPropToNum(data.customer_paytype_detailofcustomers);
                    $scope.data.currItem.customer_payment_typeofcustomers = HczyCommon.stringPropToNum(data.customer_payment_typeofcustomers);
                    //对于相同付款方式不同生产定金处理
                    for (var i = 0; i < data.customer_payment_typeofcustomers.length; i++) {
                        $scope.data.currItem.customer_payment_typeofcustomers[i].payment_type_id =
                            data.customer_payment_typeofcustomers[i].payment_type_id;
                    }
                    for (var i = 0; i < $scope.data.currItem.customer_payment_typeofcustomers.length; i++) {
                        if ($scope.data.currItem.payment_type_line_id == $scope.data.currItem.customer_payment_typeofcustomers[i].seq) {
                            $scope.data.currItem.payment_type_id = $scope.data.currItem.customer_payment_typeofcustomers[i].payment_type_id;
                            $scope.data.currItem.contract_subscrp = $scope.data.currItem.customer_payment_typeofcustomers[i].contract_subscrp;
                            $scope.data.currItem.payment_type_code = $scope.data.currItem.customer_payment_typeofcustomers[i].payment_type_code;
                            $scope.data.currItem.payment_type_name = $scope.data.currItem.customer_payment_typeofcustomers[i].payment_type_name;
                        }
                    }
                    for (var j = 0; j < data.customer_paytype_detailofcustomers.length; j++) {
                        if (data.customer_paytype_detailofcustomers[j].days > 0) {
                            $scope.data.currItem.days = data.customer_paytype_detailofcustomers[j].days;
                        } else {
                            $scope.data.currItem.days = data.customer_paytype_detailofcustomers[j].days;
                        }
                        if (data.customer_paytype_detailofcustomers[j].interest_rate > 0) {
                            $scope.data.currItem.funds_rate = parseFloat(data.customer_paytype_detailofcustomers[j].interest_rate);
                        } else {
                            $scope.data.currItem.funds_rate = parseFloat(data.customer_paytype_detailofcustomers[j].interest_rate);
                        }
                    }

                });
            $scope.data.currItem.total_tt = 0;
            $scope.data.currItem.total_oa = 0;
            $scope.data.currItem.total_lc = 0;
        }
        // 查询远期汇率
        $scope.getFuture_Rate();
        //信保费率
        $scope.getxbrate();
    };
    // 根据币种查询当月汇率
    $scope.currencychange = function () {
        $scope.currency_name_change();
        var postdata = {
            currency_id: $scope.data.currItem.currency_id,//
            currency_code: $scope.data.currItem.currency_code,
            rate_year: parseInt(moment().format('YYYY')),
            rate_month: parseInt(moment().format('M')),
            flag: 1

        };
        BasemanService.RequestPost("exchange_rate", "select", postdata)
            .then(function (data) {
                $scope.data.currItem.exchange_rate = data.exch_rate;

            });
        $scope.getFuture_Rate();
    };
    //根据currency_id赋值
    $scope.currency_name_change = function () {
        for (var i = 0; i < $scope.currencys.length; i++) {
            if ($scope.data.currItem.currency_id == $scope.currencys[i].currency_id) {
                $scope.data.currItem.currency_name = $scope.currencys[i].currency_name
                $scope.data.currItem.currency_code = $scope.currencys[i].currency_code
                break;
            }
        }
    }
    // 查询远期汇率
    $scope.getFuture_Rate = function () {
        if ($scope.data.currItem.pre_ship_date == undefined || $scope.data.currItem.pre_ship_date == "") {
            $scope.data.currItem.future_rate = 0;
        } else {
            var postdata = {
                create_time: $scope.data.currItem.pre_ship_date,
                currency_id: $scope.data.currItem.currency_id,
                flag: 0
            };
            BasemanService.RequestPost("exchange_rate", "select", postdata)
                .then(function (data) {
                    $scope.data.currItem.future_rate = data.exch_rate;
                });
        }
        ;
    };
    // 信保费率
    $scope.getxbrate = function () {
        var postdata = {};
        postdata.area_level = HczyCommon.stringPropToNum($scope.data.currItem.area_level);
        postdata.payment_type_id = $scope.data.currItem.payment_type_id;

        var promise = BasemanService.RequestPost("sale_pi_header", "getxbrate", postdata);
        promise.then(function (data) {
            $scope.data.currItem.xb_rate = HczyCommon.stringPropToNum(data.xb_rate);
        });
    };
    // 查询客户取配件费用额度（所有客户改变pi到此结束）
    $scope.getpartlimit = function (cust_id) {
        if (!cust_id) {
            cust_id == 0
        }
        var postdata = {
            cust_id: cust_id,
        };

        var promise = BasemanService.RequestPost("sale_pi_header", "getpartlimit", postdata);
        promise.then(function (data) {
            data.part_limit;
        });
    }

    //关联订单明细查询分体机
    $scope.proItem = function (pro_type, index, item_h_id) {
        var postdata = {};
        if (pro_type != 1) {
            var flag = 3;
            sql = "1=1 and pro_item.item_id = ";
        } else {
            var flag = 0;
            sql = "1=1 and pro_item.item_h_id = ";
        }
        postdata.item_h_id = item_h_id;
        postdata.flag = flag;
        postdata.sqlwhere = sql + item_h_id;
        var promise = BasemanService.RequestPost("pro_item", "search", postdata);
        promise.then(function (data) {
            for (var i = 0; i < data.pro_items.length; i++) {
                data.pro_items[i].seq = (i + 1);
                data.pro_items[i].item_line_seq = (index + 1);
                data.pro_items[i].qty = $scope.data.currItem.sale_pi_item_h_lineofsale_pi_break_package_headers[index].qty;
                data.pro_items[i].cust_item_name = $scope.data.currItem.sale_pi_item_h_lineofsale_pi_break_package_headers[index].cust_item_name;
				data.pro_items[i].cust_spec=data.pro_items[i].item_name;
            }
            $scope.data.currItem.sale_pi_item_h_lineofsale_pi_break_package_headers[index].sale_pi_item_lineofsale_pi_item_h_lines = data.pro_items;
            $scope.options_22.api.setRowData($scope.data.currItem.sale_pi_item_h_lineofsale_pi_break_package_headers[index].sale_pi_item_lineofsale_pi_item_h_lines);
            var l = {};
            l.sale_pi_item_h_lineofsale_pi_break_package_headers = [];
            l.sale_pi_item_h_lineofsale_pi_break_package_headers.push($scope.data.currItem.sale_pi_item_h_lineofsale_pi_break_package_headers[index]);
            var postdata = l;
            postdata.currencyid = $scope.data.currItem.currency_id;//货币
            postdata.exchange_rate = $scope.data.currItem.exchange_rate//汇率
            //查询订单明细,分体机的指导价，结算价，基准价和制造成本价
            $scope.selectprice(postdata, pro_type, $scope.data.currItem.sale_pi_item_h_lineofsale_pi_break_package_headers[index], index);
			
        })
    }
	

	
    //查询订单明细,分体机的指导价，结算价，基准价和制造成本价
    $scope.selectprice = function (postdata, line_type, dataheader,index) {
        if (line_type != 4) {
            var promise = BasemanService.RequestPost("sale_guide_priceapply_header", "getitemsyprice", postdata);
            promise.then(function (data) {
                for (var i = 0; i < data.sale_pi_item_h_lineofsale_pi_break_package_headers.length; i++) {
                    //内销订单要收取汇率费用
                    if ($scope.data.currItem.sale_order_type == 3) {
                        //订单明细
                        dataheader.guide_p6 = HczyCommon.toDecimal2(Number(data.sale_pi_item_h_lineofsale_pi_break_package_headers[i].guide_p6) * 1.17);
                        dataheader.p4 = HczyCommon.toDecimal2(Number(data.sale_pi_item_h_lineofsale_pi_break_package_headers[i].p4) * 1.17);
                        dataheader.std_p4 = HczyCommon.toDecimal2(Number(data.sale_pi_item_h_lineofsale_pi_break_package_headers[i].std_p4) * 1.17);
                        dataheader.make_p4 = HczyCommon.toDecimal2(Number(data.sale_pi_item_h_lineofsale_pi_break_package_headers[i].make_p4) * 1.17);
                        //分体机
                        var dataline = data.sale_pi_item_h_lineofsale_pi_break_package_headers[i].sale_pi_item_lineofsale_pi_item_h_lines;
                        for (var j = 0; j < dataline.length; j++) {
                            dataline[j].guide_p6 = HczyCommon.toDecimal2(dataline[j].guide_p6 * 1.17)
                            dataline[j].p4 = HczyCommon.toDecimal2(dataline[j].p4 * 1.17)
                            dataline[j].std_p4 = HczyCommon.toDecimal2(dataline[j].std_p4 * 1.17)
                            dataline[j].make_p4 = HczyCommon.toDecimal2(dataline[j].make_p4 * 1.17)
                        }
                    } else {
                        //订单明细
                        dataheader.guide_p6 = HczyCommon.toDecimal2(Number(data.sale_pi_item_h_lineofsale_pi_break_package_headers[i].guide_p6));
                        dataheader.p4 = HczyCommon.toDecimal2(Number(data.sale_pi_item_h_lineofsale_pi_break_package_headers[i].p4));
                        dataheader.std_p4 = HczyCommon.toDecimal2(Number(data.sale_pi_item_h_lineofsale_pi_break_package_headers[i].std_p4));
                        dataheader.make_p4 = HczyCommon.toDecimal2(Number(data.sale_pi_item_h_lineofsale_pi_break_package_headers[i].make_p4));
                        //分体机
                        var dataline = data.sale_pi_item_h_lineofsale_pi_break_package_headers[i].sale_pi_item_lineofsale_pi_item_h_lines;
                        for (var j = 0; j < dataline.length; j++) {
                            dataline[j].guide_p6 = HczyCommon.toDecimal2(dataline[j].guide_p6)
                            dataline[j].p4 = HczyCommon.toDecimal2(dataline[j].p4)
                            dataline[j].std_p4 = HczyCommon.toDecimal2(dataline[j].std_p4)
                            dataline[j].make_p4 = HczyCommon.toDecimal2(dataline[j].make_p4)
                        }

                    }
                }
                $scope.data.currItem.sale_pi_item_h_lineofsale_pi_break_package_headers[index] = dataheader;
                $scope.data.currItem.sale_pi_item_h_lineofsale_pi_break_package_headers[index].sale_pi_item_lineofsale_pi_item_h_lines = dataline;

                $scope.options_21.api.setRowData($scope.data.currItem.sale_pi_item_h_lineofsale_pi_break_package_headers);
                $scope.options_22.api.setRowData(dataline);
				
				$scope.computeqty(parseInt(dataheader.qty))
            })
        }
    }
     
	 	//计算价格，销售净额
	$scope.computeqty = function (qty) {
        var val =qty;	
        var index = $scope.options_21.api.getFocusedCell().rowIndex;
        var nodes = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
        var itemtemp = nodes[index].data;
        var pi_item_h_lines = itemtemp.sale_pi_item_lineofsale_pi_item_h_lines;
        var qty_temp = 0;
        var sum_qty = 0;
        var sum_amt = 0;
        //itemtemp.price = itemtemp.price ? itemtemp.price : 0;
        //itemtemp.sale_amt = parseFloat(val || 0) * parseFloat(itemtemp.price);
       // $scope.options_21.api.refreshCells(nodes, ["sale_amt"]);

        if (index != undefined) {
            val = val ? val : 0;
            for (var i = 0; i < pi_item_h_lines.length; i++) {
                if (pi_item_h_lines.length > 0) {
                    pi_item_h_lines[i].qty = parseInt(val);
                };
            };
            if (pi_item_h_lines.length == 1) {
                pi_item_h_lines[0].qty = parseInt(val||0);
				pi_item_h_lines[0].price=parseFloat(itemtemp.price||0)
                pi_item_h_lines[0].sale_amt = parseFloat(pi_item_h_lines[0].price || 0) * parseInt(pi_item_h_lines[0].qty || 0);
            } else {
                var sale_amt1 = 0;
                var price1 = 0;
                for (var i = 0; i < pi_item_h_lines.length; i++) {
					if(parseInt(itemtemp.guide_p6||0)==0){
					BasemanService.notice("机型没有指导价", "alert-info");
                     return;				
					}else{
				    pi_item_h_lines[i].price = HczyCommon.toDecimal2(Number((HczyCommon.toDecimal2(pi_item_h_lines[i].guide_p6 || 0) / HczyCommon.toDecimal2(itemtemp.guide_p6 || 0) * HczyCommon.toDecimal2(itemtemp.price || 0) * 100) / 100));
                    pi_item_h_lines[i].sale_amt = HczyCommon.toDecimal2(pi_item_h_lines[i].price * parseInt(pi_item_h_lines[i].qty || 0));
					}
                    
                }
                if (pi_item_h_lines.length - 1 > 0) {
                    for (var j = 0; j < pi_item_h_lines.length - 1; j++) {
                        price1 = HczyCommon.toDecimal2(parseFloat(price1 || 0) + parseFloat(pi_item_h_lines[j].price || 0));
                        sale_amt1 = HczyCommon.toDecimal2(parseFloat(sale_amt1 || 0) + parseFloat(pi_item_h_lines[j].sale_amt || 0))
                    }
                    price1 = parseFloat(HczyCommon.toDecimal2(price1));
                    sale_amt1 = parseFloat(HczyCommon.toDecimal2(sale_amt1));
                    pi_item_h_lines[pi_item_h_lines.length - 1].sale_amt = HczyCommon.toDecimal2(parseFloat(itemtemp.sale_amt || 0) - sale_amt1);
                    pi_item_h_lines[pi_item_h_lines.length - 1].price = HczyCommon.toDecimal2(parseFloat(itemtemp.price || 0) - price1);
                }
            }
            $scope.options_22.api.setRowData(pi_item_h_lines);
        }
    };
    //判断是否有易损件
    $scope.is_ys = function () {
        var count = 0;
        var data = [];
        var nodes = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
        if (nodes.length == 0) {
            return false;
        }
        for (var i = 0; i < nodes.length; i++) {
            data.push(nodes[i].data);
        }
        for (var j = 0; j < data.length; j++) {
            var line_type = data[j].line_type;
            if (line_type == 4) {
                count += 1;
            }
        }
        if (count == 0) {
            return false;
        } else {
            return true;
        }
    }
    //获取易损件下标
    $scope.getindex = function (data) {
        if ($scope.is_ys()) {
            for (var j = 0; j < data.length; j++) {
                var line_type = data[j].line_type;
                if (line_type == 4) {
                    return j;
                }
            }
        }
    }
    //获取汇总的单行易损件
    $scope.getoneYS = function (sale_amt, items) {
        var object = new Object();
        if (items[0].sale_pi_item_h_lineofsale_pi_break_package_headers.length) {

            object = items[0].sale_pi_item_h_lineofsale_pi_break_package_headers[0];
            if ($scope.data.brandlist == undefined || $scope.data.brandlist.length == 0) {
                object.brand_name = "";
            } else {
                object.brand_name = $scope.data.brandlist[0].brand_name;
            }
            object.line_type = 4;
            object.qty = 1;
            object.sale_amt = parseFloat(sale_amt || 0);
            object.price = parseFloat(sale_amt || 0);

            object.sale_pi_item_lineofsale_pi_item_h_lines[0].qty = 1;
            object.sale_pi_item_lineofsale_pi_item_h_lines[0].line_type = 4;
            object.sale_pi_item_lineofsale_pi_item_h_lines[0].sale_amt = parseFloat(sale_amt || 0);
            object.sale_pi_item_lineofsale_pi_item_h_lines[0].price = parseFloat(sale_amt || 0);
        }
        return object;
    }
    //递归方法 循环递归处理树状数据结构
    $scope.callback = function (array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].childrens) {
                array[i].children = array[i].childrens;
                array[i].folder = true;
            }
            if (array[i].childrens) {
                for (var j = 0; j < array[i].childrens.length; j++) {
                    if (array[i].childrens[j].childrens) {
                        array[i].childrens[j].children = array[i].childrens[j].childrens;
                        array[i].childrens[j].folder = true;
                        $scope.callback(array[i].childrens[j].childrens);
                    }
                }
            }
        }
    }
    $scope.tree=function(array,parentkey,key){
		var push=[];
		for(var i=0;i<array.length;i++){
			var object=$scope.getchildtree(array[i],parentkey,key,array);
			push.push(object);
		}
		return push;
	}
	//通用方法处理树状结构   idpath：路径，用/分割开,key：节点主键id
	$scope.getchildtree=function(dealobject,parentkey,key,array){
			//var arraykey=dealobject[idpath].split("/");
			//获取当前节点的父节点id
			var parentid=dealobject[parentkey];
			for(var j=0;j<array.length;j++){
				
			    if($scope.tratree(parentid,key,array[j],dealobject)){
					dealobject=array[j];
					$scope.getchildtree(dealobject,parentkey,key,array);
				}
			}

			return dealobject
    }
	$scope.tratree=function(parentid,key,parentobject,dealobject){
		if(parseInt(parentid)==parseInt(parentobject[key])){
			if(parentobject.children){
				parentobject.folder=true;
				parentobject.children.push(dealobject);
				return true 
			}else{
				parentobject.folder=true;
				parentobject.children=[];
				parentobject.children.push(dealobject);
				return true 
			}
		}else{
			if(parentobject.children){
				for(var k=0;k<parentobject.children.length;k++){
					$scope.tratree(parentid,key,parentobject.children[k],dealobject);
				}
			}
		}
		return false;	
	}
	
    /**------------------ 业务逻辑控制--------------------------------**/
    /***************************网格事件处理************************/
	
	$scope.cellValueChanged =function(){
		var data=[];
		var rowidx=$scope.options_41.api.getFocusedCell().rowIndex;
		var node=$scope.options_43.api.getModel().rootNode.childrenAfterSort;
		for(var i=0;i<node.length;i++){
			data.push(node[i].data);
		}
		$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_item_fofsale_pi_break_headers=data;
		$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_item_fallofsale_pi_break_headers=data;
		$scope.options_44.api.setRowData(data);
	}
	
    /**网格切换事件*/
    //订单明细  关联分体机和单前机型
	$scope.defaultcoldef = $.extend(true, {}, ($scope.columns_21));
    $scope.rowClicked21 = function (event) {
		//控制网格单行只读
	    var colmun=$scope.options_21.columnApi.getAllColumns();
		if($scope.options_21.api.getModel().rootNode.childrenAfterSort[$scope.options_21.api.getFocusedCell().rowIndex].data.line_type==4){
			
			
			for(var i=0;i<colmun.length;i++){
				if(colmun[i].colDef.editable==true){
					colmun[i].colDef.editable=false;
					colmun[i].colDef.flag=2;
				}
				
			}
		}else{
		   for(var i=0;i<colmun.length;i++){
				if(colmun[i].colDef.flag==2){
					colmun[i].colDef.editable=true;
				}
				
			}
		}
		
         $scope.options_22.api.setFocusedCell(-1,"cust_item_name");
        //分体机==
        if (event.data) {
            if (event.data.sale_pi_item_lineofsale_pi_item_h_lines == undefined) {
                event.data.sale_pi_item_lineofsale_pi_item_h_lines = [];
            }
			if($scope.options_22.api.getFocusedCell()){
				if($scope.options_22.api.getFocusedCell().rowIndex!=$scope.options_21.api.getFocusedCell().rowIndex){
				$scope.options_22.api.setRowData(event.data.sale_pi_item_lineofsale_pi_item_h_lines);	
			    }	
			}else{
				$scope.options_22.api.setRowData(event.data.sale_pi_item_lineofsale_pi_item_h_lines);
			}
            					            
        }
        //单前机型
        if ($scope.options_22.api.getModel().rootNode.childrenAfterSort) {
            var node = $scope.options_22.api.getModel().rootNode.childrenAfterSort;
            var postdata = {};
            if (node[0] && node[0].data) {
                postdata.pi_id = node[0].data.pi_id;
                postdata.pi_h_id = node[0].data.pi_h_id;
                postdata.pi_line_id = node[0].data.pi_line_id;
                BasemanService.RequestPost("sale_pi_header", "getsale_pi_item_conf", postdata)
                    .then(function (data) {
                        $scope.options_31.api.setRowData(data.sale_pi_item_conf2ofsale_pi_headers);
                    })
            }
        }
    }
    //分体机 关联单前机型
    $scope.rowClicked22 = function () {
        var rowidx = $scope.options_22.api.getFocusedCell().rowIndex;
        if ($scope.options_22.api.getModel().rootNode.childrenAfterSort) {
            var node = $scope.options_22.api.getModel().rootNode.childrenAfterSort;
            var postdata = {};
            if (node[rowidx] && node[rowidx].data) {
                postdata.pi_id = node[rowidx].data.pi_id;
                postdata.pi_h_id = node[rowidx].data.pi_h_id;
                postdata.pi_line_id = node[rowidx].data.pi_line_id;
                BasemanService.RequestPost("sale_pi_header", "getsale_pi_item_conf", postdata)
                    .then(function (data) {
                        $scope.options_31.api.setRowData(data.sale_pi_item_conf2ofsale_pi_headers);
                    })
            }
        }
    }
    //打散-包装方案 关联打散方案明细左和右
    $scope.rowClicked41 = function (event) {
        if (event.data) {
            //关联打散方案明细左
            if (event.data.sale_pi_break_line_fofsale_pi_break_headers == undefined) {
                event.data.sale_pi_break_line_fofsale_pi_break_headers = [];
            }
            $scope.options_42.api.setRowData(event.data.sale_pi_break_line_fofsale_pi_break_headers);
            //关联打散方案明细右
            if (event.data.sale_pi_break_item_fofsale_pi_break_headers == undefined) {
                event.data.sale_pi_break_item_fofsale_pi_break_headers = [];
            }
            $scope.options_43.api.setRowData(event.data.sale_pi_break_item_fofsale_pi_break_headers);
            //关联包装方案
            if (event.data.sale_pi_break_item_fallofsale_pi_break_headers == undefined) {
                event.data.sale_pi_break_item_fallofsale_pi_break_headers = [];
            }

            $scope.options_44.api.setRowData(event.data.sale_pi_break_item_fallofsale_pi_break_headers);
			//包装铺料汇总
            if (event.data.sale_bill_break_itemofsale_pi_break_headers == undefined) {
                event.data.sale_bill_break_itemofsale_pi_break_headers = [];
            }
            $scope.options_45.api.setRowData(event.data.sale_bill_break_itemofsale_pi_break_headers);
			
        }
        $scope.options_46.api.setRowData([]);
        //关联标准机型编码
        var rowidx = $scope.options_41.api.getFocusedCell().rowIndex;
        var node = $scope.options_41.api.getModel().rootNode.childrenAfterSort;
        $scope.data.currItem.item_code = node[rowidx].data.item_code;
		$scope.summary();
    }
    /**网格改变值事件*/
    $scope.cust_item_name21 = function () {
		var _this = $(this);
        var val = _this.val();	
        var index = $scope.options_21.api.getFocusedCell().rowIndex;
        var nodes = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
       if (index != undefined) {
            for (var i = 0; i < nodes[index].data.sale_pi_item_lineofsale_pi_item_h_lines.length; i++) {
                nodes[index].data.sale_pi_item_lineofsale_pi_item_h_lines[i].cust_item_name = val;
            }
        }
        $scope.options_22.api.setRowData(nodes[index].data.sale_pi_item_lineofsale_pi_item_h_lines);
    }
    // 设置数量、计算总数量
    $scope.qty21 = function () {

		var _this = $(this);
        var val = _this.val();	
        var index = $scope.options_21.api.getFocusedCell().rowIndex;
        var nodes = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
        var itemtemp = nodes[index].data;
        var pi_item_h_lines = itemtemp.sale_pi_item_lineofsale_pi_item_h_lines;

        //var node1s=$scope.options_22.api.getModel().rootNode.childrenAfterSort;
        // var fiss_data = node1s[index].data;

        var qty_temp = 0;
        var sum_qty = 0;
        var sum_amt = 0;
        itemtemp.price = itemtemp.price ? itemtemp.price : 0;
        itemtemp.sale_amt = parseFloat(val || 0) * parseFloat(itemtemp.price);
        $scope.options_21.api.refreshCells(nodes, ["sale_amt"]);

        if (index != undefined) {
            val = val ? val : 0;
            for (var i = 0; i < pi_item_h_lines.length; i++) {
                if (pi_item_h_lines.length > 0) {
                    pi_item_h_lines[i].qty = Number(val);
                };
            };
            if (pi_item_h_lines.length == 1) {
                pi_item_h_lines[0].qty = Number(val);
                pi_item_h_lines[0].sale_amt = Number(pi_item_h_lines[0].price || 0) * parseInt(pi_item_h_lines[0].qty || 0);
            } else {
                var sale_amt1 = 0;
                var price1 = 0;
                for (var i = 0; i < pi_item_h_lines.length; i++) {
					if(parseInt(itemtemp.guide_p6||0)==0){
					pi_item_h_lines[i].price=0;
                    pi_item_h_lines[i].sale_amt=0					
					}else{
				    pi_item_h_lines[i].price = HczyCommon.toDecimal2(Number((HczyCommon.toDecimal2(pi_item_h_lines[i].guide_p6 || 0) / HczyCommon.toDecimal2(itemtemp.guide_p6 || 0) * HczyCommon.toDecimal2(itemtemp.price || 0) * 100) / 100));
                    pi_item_h_lines[i].sale_amt = HczyCommon.toDecimal2(pi_item_h_lines[i].price * parseInt(pi_item_h_lines[i].qty || 0));
					}
                    
                }
                if (pi_item_h_lines.length - 1 > 0) {
                    for (var j = 0; j < pi_item_h_lines.length - 1; j++) {
                        price1 = HczyCommon.toDecimal2(parseFloat(price1 || 0) + parseFloat(pi_item_h_lines[j].price || 0));
                        sale_amt1 = HczyCommon.toDecimal2(parseFloat(sale_amt1 || 0) + parseFloat(pi_item_h_lines[j].sale_amt || 0))
                    }
                    price1 = parseFloat(HczyCommon.toDecimal2(price1));
                    sale_amt1 = parseFloat(HczyCommon.toDecimal2(sale_amt1));
                    pi_item_h_lines[pi_item_h_lines.length - 1].sale_amt = HczyCommon.toDecimal2(parseFloat(itemtemp.sale_amt || 0) - sale_amt1);
                    pi_item_h_lines[pi_item_h_lines.length - 1].price = HczyCommon.toDecimal2(parseFloat(itemtemp.price || 0) - price1);
                }
            }
            $scope.options_22.api.setRowData(pi_item_h_lines);
        }
    };

    $scope.price21 = function () {
		var _this = $(this);
        var val = _this.val();	
        var index = $scope.options_21.api.getFocusedCell().rowIndex;
        var nodes = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
        var itemtemp = nodes[index].data;
        var pi_item_h_lines = itemtemp.sale_pi_item_lineofsale_pi_item_h_lines;

        //var node1s=$scope.options_22.api.getModel().rootNode.childrenAfterSort;
        //var fiss_data = node1s[index].data;

        if (itemtemp.qty == undefined) {
            itemtemp.qty = 0;
        }
        itemtemp.sale_amt = Number(val) * parseInt(itemtemp.qty);
        $scope.options_21.api.refreshCells(nodes, ["sale_amt"]);
        if (index != undefined) {
            val = val ? val : 0;
            if (pi_item_h_lines.length == 1) {
                pi_item_h_lines[0].price = Number(val || 0);
                pi_item_h_lines[0].sale_amt = parseFloat(pi_item_h_lines[0].price || 0) * parseInt(pi_item_h_lines[0].qty || 0);
                pi_item_h_lines[0].sale_amt = HczyCommon.toDecimal2(pi_item_h_lines[0].sale_amt);
            } else {
                var price_1 = 0;
                var sale_amt1 = 0;
                var price1 = 0;
                for (var i = 0; i < pi_item_h_lines.length; i++) {
                    pi_item_h_lines[i].qty = pi_item_h_lines[i].qty ? pi_item_h_lines[i].qty : 0;
					if(parseInt(itemtemp.guide_p6)==0){
					pi_item_h_lines[i].price=0;
                    pi_item_h_lines[i].sale_amt=0;					
					}else{
					pi_item_h_lines[i].price = HczyCommon.toDecimal2((HczyCommon.toDecimal2(pi_item_h_lines[i].guide_p6 || 0) / HczyCommon.toDecimal2(itemtemp.guide_p6 || 0)) * HczyCommon.toDecimal2(val || 0));
                    pi_item_h_lines[i].sale_amt = HczyCommon.toDecimal2(pi_item_h_lines[i].price * parseInt(pi_item_h_lines[i].qty || 0));
                    price_1 = HczyCommon.toDecimal2(parseFloat(price_1) + parseFloat(pi_item_h_lines[i].price || 0));	
					}
                }
                if (pi_item_h_lines.length - 1 > 0) {
                    for (var j = 0; j < pi_item_h_lines.length - 1; j++) {
                        price1 = (parseFloat(price1 || 0) + parseFloat(pi_item_h_lines[j].price || 0));
                        sale_amt1 = (parseFloat(sale_amt1 || 0) + parseFloat(pi_item_h_lines[j].sale_amt || 0));
                    }
                    price1 = parseFloat(HczyCommon.toDecimal2(price1));
                    sale_amt1 = parseFloat(HczyCommon.toDecimal2(sale_amt1));
                    pi_item_h_lines[pi_item_h_lines.length - 1].sale_amt = HczyCommon.toDecimal2(parseFloat(itemtemp.sale_amt || 0) - parseFloat(sale_amt1 || 0));
                    pi_item_h_lines[pi_item_h_lines.length - 1].price = HczyCommon.toDecimal2(parseFloat(val || 0) - parseFloat(price1 || 0));
                }
            }
            $scope.options_22.api.setRowData(pi_item_h_lines);
        }
    };
    
	//配件清单  需求数量
	$scope.require_qty23=function(){
		var _this = $(this);
        var val = _this.val();	
        var index = $scope.options_23.api.getFocusedCell().rowIndex;
        var nodes = $scope.options_23.api.getModel().rootNode.childrenAfterSort;
        nodes[index].data.amt=parseFloat(nodes[index].data.psale_price||0)*parseInt(val);
		$scope.options_23.api.refreshCells(nodes,["amt"]);		
	}
     
	//配件清单  销售价格
	$scope.psale_price23=function(){
		var _this = $(this);
        var val = _this.val();	
        var index = $scope.options_23.api.getFocusedCell().rowIndex;
        var nodes = $scope.options_23.api.getModel().rootNode.childrenAfterSort;
        nodes[index].data.amt=parseInt(nodes[index].data.require_qty||0)*parseFloat(val);
		$scope.options_23.api.refreshCells(nodes,["amt"]);		
	}
    /**网格增加删除行*/
    //柜型柜量  新增
    $scope.addline13 = function () {
        var brand_id = "";
        //var test=$scope.options_21.rowData;
        var data = [];
        var node = $scope.options_13.api.getModel().rootNode.childrenAfterSort;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        item = {seq: data.length + 1}
        data.push(item);
        $scope.options_13.api.setRowData(data);
    }
    //柜型柜量  删除
    $scope.delline13 = function () {
        var data = [];
        var rowidx = $scope.options_13.api.getFocusedCell().rowIndex;
        var node = $scope.options_13.api.getModel().rootNode.childrenAfterSort;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        data.splice(rowidx, 1);
        $scope.options_13.api.setRowData(data);
    }
	//机型面板 产生面板确认单
	$scope.generate16 =function(){
		var postdata={};
		postdata.pi_id=parseInt($scope.data.currItem.pi_id);
		BasemanService.RequestPost("sale_pi_header", "creatembbill", postdata)
		.then(function (data) {
		$scope.refresh(2);
		BasemanService.notice("生成成功", "alter-warning");
        });
	}
	//机型面板 产生面板确认单
	$scope.getstandard =function(){
		var postdata={};
        postdata.sqlwhere=" usable = 2 and lev =2";
		BasemanService.RequestPost("pro_item_type", "search", postdata)
		.then(function (data) {
		$scope.refresh(2);
		BasemanService.notice("获取标准成本成功", "alter-warning");
        });
	}
	
    //订单明细  新增
    $scope.addline21 = function () {
        var brand_id = "";
        //var test=$scope.options_21.rowData;
        var data = [];
        var node = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        if ($scope.data.brandlist) {
            for (var i = 0; i < $scope.data.brandlist.length; i++) {
                if ($scope.data.brandlist[0].brand_name != undefined || $scope.data.brandlist[0].brand_name != "") {
                    brand_id = $scope.data.brandlist[0].brand_name;
                    break;
                }
                ;
            }
        } else {
            $scope.data.brandlist = []
        }

        var item = {seq: 1 + i + node.length, line_type: 1, brand_name: brand_id};
        data.push(item);
        $scope.options_21.api.setRowData(data);
    }
    //订单明细  删除
    $scope.delline21 = function () {
        var data = [];
        var rowidx = $scope.options_21.api.getFocusedCell().rowIndex;
        var node = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        data.splice(rowidx, 1);
        $scope.options_21.api.setRowData(data);
    }

    //订单明细 增加指定机型配件
    $scope.addpro_parts = function () {
		
        //$scope.identify = 1;
        if ($scope.options_21.api.getFocusedCell()) {
            var rowidx = $scope.options_21.api.getFocusedCell().rowIndex;
        }
        var data1 = [];
        var nodes = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
        for (var i = 0; i < nodes.length; i++) {
            data1.push(nodes[i].data);
        }
        $scope.item_h_id = data1[rowidx].item_h_id;
        if ($scope.item_h_id == "" || $scope.item_h_id == undefined) {
            BasemanService.notice("请选择工厂型号编码！", "alter-warning")
            return;
        }
        $scope.FrmInfo = {};
        $scope.FrmInfo.postdata = {},
        $scope.FrmInfo.postdata.flag = 2;
        $scope.FrmInfo.postdata.currency_id = $scope.data.currItem.currency_id;
        $scope.FrmInfo.postdata.exchangerate = $scope.data.currItem.exchange_rate;


        $scope.FrmInfo.sqlBlock = " and pro_item_header.item_h_id =" + parseInt(data1[rowidx].item_h_id || 0);
        BasemanService.openFrm("views/saleman/part_additem.html", part_additem, $scope, "", "lg")
            .result.then(function (items) {
			if(items[1].pro_item_partofpro_items.length==0){
				return;
			}
            var data = [];
            var nodes = $scope.options_23.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < nodes.length; i++) {
                data.push(nodes[i].data);

            }
            var data1 = [];
            var nodes = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < nodes.length; i++) {
                data1.push(nodes[i].data);
            }

            //新增配件明细
            if (items[1].pro_item_partofpro_items.length) {
                if ($scope.data.currItem.sale_order_type != 3) {
                    var sale_amt = 0;
                    for (var i = 0; i < items[1].pro_item_partofpro_items.length; i++) {
                        items[1].pro_item_partofpro_items[i].cust_sett_price = parseFloat(items[1].pro_item_partofpro_items[i].price);
                        data.push(items[1].pro_item_partofpro_items[i]);
                        //将其金额汇总
                        sale_amt += parseFloat(items[1].pro_item_partofpro_items[i].amt || 0);
                    }
                } else {
                    var sale_amt = 0;
                    for (var i = 0; i < items[1].pro_item_partofpro_items.length; i++) {
                        items[1].pro_item_partofpro_items[i].price = HczyCommon.toDecimal2(parseFloat(items[1].pro_item_partofpro_items[i].price) * 1.17);
                        items[1].pro_item_partofpro_items[i].sett_price = HczyCommon.toDecimal2(parseFloat(items[1].pro_item_partofpro_items[i].sett_price) * 1.17);
                        items[1].pro_item_partofpro_items[i].std_price = HczyCommon.toDecimal2(parseFloat(items[1].pro_item_partofpro_items[i].std_price) * 1.17);
                        items[1].pro_item_partofpro_items[i].make_price = HczyCommon.toDecimal2(parseFloat(items[1].pro_item_partofpro_items[i].make_price) * 1.17);
                        items[1].pro_item_partofpro_items[i].cust_sett_price = parseFloat(items[1].pro_item_partofpro_items[i].price);
                        data.push(items[1].pro_item_partofpro_items[i]);
                        //将其金额汇总
                        sale_amt += parseFloat(items[1].pro_item_partofpro_items[i].amt || 0);
                    }
                }
            }
            $scope.options_23.api.setRowData(data);

            //加到订单明细的易损件中
            if ($scope.is_ys()) {
                //获取订单明细下标
                var j = $scope.getindex(data1);
                //返回汇总行
                var temp = $scope.getoneYS(sale_amt, items);

                data1[j].sale_amt = parseFloat(data1[j].sale_amt || 0) + temp.sale_amt;
                data1[j].price = parseFloat(data1[j].price || 0) + temp.price;
                data1[j].sale_pi_item_lineofsale_pi_item_h_lines[0].sale_amt = parseFloat(data1[j].sale_pi_item_lineofsale_pi_item_h_lines[0].sale_amt || 0)
                    + temp.sale_pi_item_lineofsale_pi_item_h_lines[0].sale_amt;
                data1[j].sale_pi_item_lineofsale_pi_item_h_lines[0].price = parseFloat(data1[j].sale_pi_item_lineofsale_pi_item_h_lines[0].price || 0)
                    + temp.sale_pi_item_lineofsale_pi_item_h_lines[0].price;

                $scope.options_21.api.setRowData(data1);
            } else {
                //返回汇总行
                var temp = $scope.getoneYS(sale_amt, items);
                temp.seq = (1 + data1.length);
                data1.push(temp)

                $scope.options_21.api.setRowData(data1);
            }

        });
    };
	
	//订单明细 借用历史机型
	$scope.copyitem = function () {
        $scope.FrmInfo = {
			type: 'checkbox',
			postdata: {
                flag: 30
            },
            classid: "sale_pi_header",
        };
		$scope.FrmInfo.sqlBlock = " sale_order_type in (5,6)";
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {			
			var data=[];			
            var node = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
			for(var i=0;i<node.length;i++){
				data.push(node[i].data);
			}
			$scope.setresult(data,result);
			
									
        });
    }	
	
	$scope.setresult=function(data,result){
		var postdata={};
		for(var j=0;j<result.length;j++){
			  postdata.pi_id=parseInt(result[j].pi_id);
			  postdata.pi_h_id=parseInt(result[j].pi_h_id);
			  var promise= BasemanService.RequestPostAjax("sale_pi_header", "getcopyline",postdata)
			  promise.then(function (re) {
              re.sale_pi_item_h_lineofsale_pi_break_package_headers[0].sale_pi_item_lineofsale_pi_item_h_lines=re.sale_pi_item_lineofsale_pi_headers
			  data.push(re.sale_pi_item_h_lineofsale_pi_break_package_headers[0]); 
              $scope.options_21.api.setRowData(data);			  
              })
			}
	}
	
    //订单明细 订单选配
    $scope.open = function () {
        if ($scope.data.currItem.pi_id == undefined || $scope.data.currItem.pi_id == 0) {
            BasemanService.notice("请先保存单据再做选配!", "alert-warning");
            return;
        }
		/*if($("body").toggleLoading){
    		$("body").css({"overflow":"hidden"});
    		$("body").toggleLoading({msg:"正在选配数据..."});
    	};
		*/
        var pcsurl = "http://100.100.68.5:8081/ocm/login.jsp?user_id=538&randompass=AVMNOGAKKEIPSLUI&qo_id=" + $scope.data.currItem.pi_id + "&readonly=0&fullscreen=1&oms_org_id=1500&is_new=1&bill_type=40038";
        $scope.newWindow = window.open(pcsurl, "newwindow");
		/*
		var loop = setInterval(function () {
    		if (newWindow.closed) {
    			clearInterval(loop);
    			if($("body").toggleLoading){
    				$("body").css({"overflow":"auto"});
    				$("body").toggleLoading();
    				 BasemanService.RequestPost("sale_pi_header", "getconf", {pi_id: $scope.data.currItem.pi_id, flag: 1})
                .then(function (data) {
                    $scope.options_21.api.setRowData(data.sale_pi_headers);
                    BasemanService.notice("选配数据已完成!", "alert-info");
                    $scope.refresh(2);
                    $scope.newWindow.close(); 
                });
    			};
    		}
    	}, 1000);
		*/
        ds.dialog.confirm("是否完成选配？", function () {
            BasemanService.RequestPost("sale_pi_header", "getconf", {pi_id: $scope.data.currItem.pi_id, flag: 1})
                .then(function (data) {
                    $scope.options_21.api.setRowData(data.sale_pi_headers);
                    BasemanService.notice("选配数据已完成!", "alert-info");
                    $scope.refresh(2);
                    $scope.newWindow.close(); 
                });
        },function () {
            $scope.newWindow.close(); 
            });

    }
	//订单明细 数据上移
	$scope.dataup=function(){
    var cell = $scope.options_21.api.getFocusedCell(); 
	var rowidx = $scope.options_21.api.getFocusedCell().rowIndex; 
	var nodes = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
	var data=[];
	if(rowidx==0){
		return;
	  }else{
		  var temp={};
		  HczyCommon.copyobj(nodes[rowidx-1].data,temp);
		  temp.seq=parseInt(temp.seq)+1;
		  nodes[rowidx].data.seq=parseInt(nodes[rowidx].data.seq)-1;
		  nodes[rowidx-1].data=nodes[rowidx].data;
		  nodes[rowidx].data=temp;
	  }
	 for(var i=0;i<nodes.length;i++){
		 data.push(nodes[i].data);
	 }
	 $scope.options_21.api.setFocusedCell(rowidx-1,cell.column.colId);
	 $scope.options_21.api.setRowData(data);
	}
	
	//订单明细 数据下移
	$scope.datadown=function(){
	var cell = $scope.options_21.api.getFocusedCell(); 
	var rowidx = $scope.options_21.api.getFocusedCell().rowIndex; 
	var nodes = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
	var data=[];
	if(rowidx==parseInt(nodes.length-1)){
		return;
	  }else{
		  var temp={};
		  HczyCommon.copyobj(nodes[rowidx+1].data,temp);
		  temp.seq=parseInt(temp.seq)-1;
		  nodes[rowidx].data.seq=parseInt(nodes[rowidx].data.seq)+1;
		  nodes[rowidx+1].data=nodes[rowidx].data;
		  nodes[rowidx].data=temp;
	  }
	 for(var i=0;i<nodes.length;i++){
		 data.push(nodes[i].data);
	 }
	 $scope.options_21.api.setFocusedCell(rowidx+1,cell.column.colId);
	 $scope.options_21.api.setRowData(data);
	}
	
	
    //配件清单 增加配件
    $scope.addline23 = function () {
        $scope.FrmInfo = {};
        $scope.FrmInfo.postdata = {},
            $scope.FrmInfo.postdata.flag = 2;
        $scope.FrmInfo.postdata.currency_id = $scope.data.currItem.currency_id;
        if ($scope.data.currItem.exchange_rate == 0 || $scope.data.currItem.exchange_rate == undefined) {
            BasemanService.notice("汇率为空！", "alert-warning");
            return;
        }
        $scope.FrmInfo.postdata.exchangerate = $scope.data.currItem.exchange_rate;
        BasemanService.openFrm("views/saleman/part_additem.html", part_additem, $scope, "", "lg")
            .result.then(function (items) {
			if(items[1].pro_item_partofpro_items.length==0){
				return;
			}
            var data = [];
            var nodes = $scope.options_23.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < nodes.length; i++) {
                data.push(nodes[i].data);

            }
            var data1 = [];
            var nodes = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < nodes.length; i++) {
                data1.push(nodes[i].data);
            }

            //新增配件明细
            if (items[1].pro_item_partofpro_items.length) {
                if ($scope.data.currItem.sale_order_type != 3) {
                    var sale_amt = 0;
                    for (var i = 0; i < items[1].pro_item_partofpro_items.length; i++) {
                        items[1].pro_item_partofpro_items[i].cust_sett_price = parseFloat(items[1].pro_item_partofpro_items[i].price);
                        data.push(items[1].pro_item_partofpro_items[i]);
                        //将其金额汇总
                        sale_amt += parseFloat(items[1].pro_item_partofpro_items[i].amt || 0);
                    }
                } else {
                    var sale_amt = 0;
                    for (var i = 0; i < items[1].pro_item_partofpro_items.length; i++) {
                        items[1].pro_item_partofpro_items[i].price = HczyCommon.toDecimal2(parseFloat(items[1].pro_item_partofpro_items[i].price) * 1.17);
                        items[1].pro_item_partofpro_items[i].sett_price = HczyCommon.toDecimal2(parseFloat(items[1].pro_item_partofpro_items[i].sett_price) * 1.17);
                        items[1].pro_item_partofpro_items[i].std_price = HczyCommon.toDecimal2(parseFloat(items[1].pro_item_partofpro_items[i].std_price) * 1.17);
                        items[1].pro_item_partofpro_items[i].make_price = HczyCommon.toDecimal2(parseFloat(items[1].pro_item_partofpro_items[i].make_price) * 1.17);
                        items[1].pro_item_partofpro_items[i].cust_sett_price = parseFloat(items[1].pro_item_partofpro_items[i].price);
                        data.push(items[1].pro_item_partofpro_items[i]);
                        //将其金额汇总
                        sale_amt += parseFloat(items[1].pro_item_partofpro_items[i].amt || 0);
                    }
                }
            }
            $scope.options_23.api.setRowData(data);

            //加到订单明细的易损件中
            if ($scope.is_ys()) {
                //获取订单明细下标
                var j = $scope.getindex(data1);
                //返回汇总行
                var temp = $scope.getoneYS(sale_amt, items);

                data1[j].sale_amt = parseFloat(data1[j].sale_amt || 0) + temp.sale_amt;
                data1[j].price = parseFloat(data1[j].price || 0) + temp.price;
                data1[j].sale_pi_item_lineofsale_pi_item_h_lines[0].sale_amt = parseFloat(data1[j].sale_pi_item_lineofsale_pi_item_h_lines[0].sale_amt || 0)
                    + temp.sale_pi_item_lineofsale_pi_item_h_lines[0].sale_amt;
                data1[j].sale_pi_item_lineofsale_pi_item_h_lines[0].price = parseFloat(data1[j].sale_pi_item_lineofsale_pi_item_h_lines[0].price || 0)
                    + temp.sale_pi_item_lineofsale_pi_item_h_lines[0].price;

                $scope.options_21.api.setRowData(data1);
            } else {
                //返回汇总行
                var temp = $scope.getoneYS(sale_amt, items);
                temp.seq = (1 + data1.length);
                data1.push(temp)

                $scope.options_21.api.setRowData(data1);
            }

        });
    }
    //配件清单 删除配件
    $scope.delline23 = function () {
        var data = [];
        var rowidx = $scope.options_23.api.getFocusedCell().rowIndex;
        var node = $scope.options_23.api.getModel().rootNode.childrenAfterSort;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        data.splice(rowidx, 1);
        $scope.options_23.api.setRowData(data);
    }
    //打散-包装方案 打散方案明细(左) 增加行
    $scope.addline42 = function () {
        var data = [];
        var node = $scope.options_42.api.getModel().rootNode.childrenAfterSort;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
		var data2=$scope.gridGetData("options_43");
		var length=$scope.sort(data2)>$scope.sort(data)?$scope.sort(data2):$scope.sort(data);
        item = {line_id:length + 1};
        data.push(item);
		var rowidx = $scope.options_41.api.getFocusedCell().rowIndex;
		$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_line_fofsale_pi_break_headers=data;
        $scope.options_42.api.setRowData(data);
    }
    //打散-包装方案 打散方案明细(左) 删除行
    $scope.delline42 = function () {
        var data = [];
        var node = $scope.options_42.api.getModel().rootNode.childrenAfterSort;
        for (var i = 0; i < node.length; i++) {
            if (node[i].selected == false) {
                data.push(node[i].data);
            }
        }
		var rowidx = $scope.options_41.api.getFocusedCell().rowIndex;
		$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_line_fofsale_pi_break_headers=data;
        $scope.options_42.api.setRowData(data);
        $scope.options_42.api.setRowData(data);
    }

    //打散方案明细(左) 同步打散方案
    $scope.synchronize42 = function () {
        if (!$scope.options_41.api.getFocusedCell()) {
            BasemanService.notice("未选中要同步的方案", "alert-info");
            return;
        }
        var rowidx = $scope.options_41.api.getFocusedCell().rowIndex;
        var node = $scope.options_41.api.getModel().rootNode.childrenAfterSort;
        var postdata = {};
        postdata.pi_line_id = node[rowidx].data.pi_line_id;
        postdata.pi_id = $scope.data.currItem.pi_id;
        var promise = BasemanService.RequestPost("sale_pi_break_package_header", "synbreak", postdata);
        promise.then(function (data) {
            BasemanService.notice("同步成功", "alert-info");
        })
    }

    //打散方案明细(左) 指定规则生成打散清单
    $scope.generate42 = function () {
        if (!$scope.options_41.api.getFocusedCell()) {
            rowidx=0;
        }else{
			var rowidx = $scope.options_41.api.getFocusedCell().rowIndex;
		}        
        var node = $scope.options_41.api.getModel().rootNode.childrenAfterSort;
        var postdata = {};
        postdata.pi_line_id = node[rowidx].data.pi_line_id;
        postdata.pi_id = $scope.data.currItem.pi_id;
		postdata.pi_no = $scope.data.currItem.pi_no;
        postdata.pi_h_id = node[rowidx].data.pi_h_id;
		postdata.pi_f_id=$scope.data.currItem.pi_f_id;
		postdata.pi_f_no=$scope.data.currItem.pi_f_no;
		postdata.line_ids="";
		postdata.flag=6;
		if($scope.options_42.api.getSelectedRows().length>0){
			for(var i=0;i<$scope.options_42.api.getSelectedRows().length;i++){
				if(i!=$scope.options_42.api.getSelectedRows().length-1){				   
		           postdata.line_ids+=$scope.options_42.api.getSelectedRows()[i].line_id+",";
				}else{
				   postdata.line_ids+=$scope.options_42.api.getSelectedRows()[i].line_id
				}
			}
		}
        var promise = BasemanService.RequestPost("sale_pi_break_package_header", "getsparebom", postdata);
        promise.then(function (data) {
            //生成打散方案明细(右)
            $scope.options_43.api.setRowData(data.sale_pi_break_itemofsale_pi_break_header);
            BasemanService.notice("生成打散清单成功", "alert-info");
			$scope.refresh(2);
        })
    }
	
	//打散方案明细(左) 复制打散清单
	$scope.copy42 =function(){
		 $scope.FrmInfo = {
			is_custom_search:true,
            title: "包装订单查询",
            thead: [{
                name: "PI号",
                code: "pi_no"
            }, {
                name: "打散方案",
                code: "break_name"
            }, {
                name: "机型编码",
                code: "item_code"
            }, {
                name: "适应机型",
                code: "item_name"
            }, {
                name: "订单数量",
                code: "qty"
            }],
            classid: "sale_pi_break_package_header",
            searchlist: ["pi_no", "break_name", "item_code", "item_name"],
			postdata:{flag:60}
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (data) {
			var postdata={};
			var index=$scope.options_41.api.getFocusedCell().rowIndex;
			var node=$scope.options_41.api.getModel().rootNode.childrenAfterSort;
			postdata.pi_f_id=$scope.data.currItem.pi_f_id;
			postdata.pi_f_no=$scope.data.currItem.pi_f_no;
			postdata.pi_no=$scope.data.currItem.pi_no;
			postdata.pi_id=parseInt(node[index].data.pi_id);
			postdata.pi_h_id=parseInt(node[index].data.pi_h_id);
			postdata.pi_line_id=parseInt(node[index].data.pi_line_id);
			postdata.sqlwhere=" pi_id="+parseInt(data.pi_id)+' and pi_h_id='+parseInt(data.pi_h_id) +' and pi_line_id='+parseInt(data.pi_line_id);

			var promise = BasemanService.RequestPost("sale_pi_break_package_header", "copybreakto", postdata);
             promise.then(function (r) {BasemanService.notice("复制打散清单成功", "alert-info");
			 $scope.refresh(2);});

        })
	}
	//打散方案明细(右) 方案类型
	$scope.ptype_name = function () {
        $scope.FrmInfo = {
            classid: "sale_pack_type",
			postdata: {
                flag: 1
            },
        };
		$scope.FrmInfo.sqlBlock = " usable=2";
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.ptype_name = result.pack_name;		
            		
        });
    }
	//打散方案明细(右) 指定整行
	$scope.ptype_nameall = function () {
		/**
        var data=[];
		var rowidx = $scope.options_41.api.getFocusedCell().rowIndex;
		var nodes=$scope.options_43.api.getModel().rootNode.childrenAfterSort;
		for(var i=0;i<nodes.length;i++){
			nodes[i].data.ptype_name=$scope.data.currItem.ptype_name;
			data.push(nodes[i].data);
		}
		$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_item_fofsale_pi_break_headers=data;
		$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_item_fallofsale_pi_break_headers=data;
        $scope.options_43.api.setRowData(data);	*/
		ds.dialog.confirm("是否指定整单？", function () {
		var data=[];
		if($scope.options_41.api.getFocusedCell()){
			var rowidx = $scope.options_41.api.getFocusedCell().rowIndex;
		}else{
			var rowidx=0;
		}
		
		for(var i=0;i<$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers.length;i++){
			for(var j=0;j<$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[i].sale_pi_break_item_fofsale_pi_break_headers.length;j++){
			$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[i].sale_pi_break_item_fofsale_pi_break_headers[j].ptype_name=$scope.data.currItem.ptype_name;
			$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[i].sale_pi_break_item_fofsale_pi_break_headers[j].ptype_id=$scope.data.currItem.ptype_id;
			$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[i].sale_pi_break_item_fallofsale_pi_break_headers[j].ptype_name=$scope.data.currItem.ptype_name;
			$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[i].sale_pi_break_item_fallofsale_pi_break_headers[j].ptype_id=$scope.data.currItem.ptype_id;
			}			
		}               		
        $scope.options_43.api.setRowData($scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_item_fofsale_pi_break_headers);	
		})
    }
	$scope.ptype_namechoose = function () {
        var data=[];
		if($scope.options_41.api.getFocusedCell()){
			var rowidx = $scope.options_41.api.getFocusedCell().rowIndex;
		}else{
			var rowidx =0;
		}
		
		var nodes=$scope.options_43.api.getModel().rootNode.childrenAfterSort;
		for(var i=0;i<nodes.length;i++){
			if(nodes[i].selected==true){
			nodes[i].data.ptype_name=$scope.data.currItem.ptype_name;
            nodes[i].data.ptype_id=$scope.data.currItem.ptype_id;			
			}			
			data.push(nodes[i].data);
		}
		
		$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_item_fofsale_pi_break_headers=data;
		$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_item_fallofsale_pi_break_headers=data;
		
        $scope.options_43.api.setRowData(data);			
    }
	//打散方案明细(右) 生成打散清单
    $scope.generate43 = function () {
        if (!$scope.options_41.api.getFocusedCell()) {
            var rowidx=0
        }else{
			var rowidx = $scope.options_41.api.getFocusedCell().rowIndex;
		}       
        var node = $scope.options_41.api.getModel().rootNode.childrenAfterSort;
        var postdata = {};
        postdata.pi_line_id = node[rowidx].data.pi_line_id;
        postdata.pi_id = $scope.data.currItem.pi_id;
        postdata.pi_h_id = node[rowidx].data.pi_h_id;
		postdata.pi_f_id=$scope.data.currItem.pi_f_id;
        postdata.flag=6;
		
        var promise = BasemanService.RequestPost("sale_pi_break_package_header", "getsparebom", postdata);
        promise.then(function (data) {
            //生成打散方案明细(右)
            BasemanService.notice("生成打散清单成功", "alert-info");
			$scope.refresh(2);
        })
    }
    //打散-包装方案 打散方案明细(右) 增加行
    $scope.addline43 = function () {
        var data = [];
        var node = $scope.options_43.api.getModel().rootNode.childrenAfterSort;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
		var data2=$scope.gridGetData("options_42");
		var length=$scope.sort(data2)>$scope.sort(data)?$scope.sort(data2):$scope.sort(data);
        item = {line_id:length + 1};
        data.push(item);
		
		var rowidx = $scope.options_41.api.getFocusedCell().rowIndex;
		$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_item_fofsale_pi_break_headers=data;
		$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_item_fallofsale_pi_break_headers=(data);
        $scope.options_43.api.setRowData(data);
    }
    //打散-包装方案 打散方案明细(右) 删除行
    $scope.delline43 = function () {
        var data = [];
        var node = $scope.options_43.api.getModel().rootNode.childrenAfterSort;
        for (var i = 0; i < node.length; i++) {
            if (node[i].selected == false) {
                data.push(node[i].data);
            }
        }
		var rowidx = $scope.options_41.api.getFocusedCell().rowIndex;
		$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_item_fofsale_pi_break_headers=data;
		$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_item_fallofsale_pi_break_headers=data;
        $scope.options_43.api.setRowData(data);
    }
    //打散-包装方案 打散方案明细(右) 方案类型复制到相同编码机型
	 $scope.copyitem43 = function () {
		var data=[];
		var rowidx1 = $scope.options_41.api.getFocusedCell().rowIndex;
		var rowidx = $scope.options_43.api.getFocusedCell().rowIndex;
		var nodes=$scope.options_43.api.getModel().rootNode.childrenAfterSort;
		for(var i=0;i<$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers.length;i++){
			for(var j=0;j<$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[i].sale_pi_break_item_fofsale_pi_break_headers.length;j++){
				if($scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[i].sale_pi_break_item_fofsale_pi_break_headers[j].item_code==nodes[rowidx].data.item_code){
				$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[i].sale_pi_break_item_fofsale_pi_break_headers[j].ptype_name=nodes[rowidx].data.ptype_name;
			     }
			}
		}
        $scope.options_43.api.setRowData($scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx1].sale_pi_break_item_fofsale_pi_break_headers);
	 }
    //打散-包装方案 包装方案 增加行
    $scope.addline44 = function () {
        var data = [];
        var node = $scope.options_44.api.getModel().rootNode.childrenAfterSort;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        item = {line_id: node.length + 1};
        data.push(item);
        $scope.options_44.api.setRowData(data);
    }
    //打散-包装方案 包装方案 删除行
    $scope.delline44 = function () {
        var data = [];
        var node = $scope.options_44.api.getModel().rootNode.childrenAfterSort;
        for (var i = 0; i < node.length; i++) {
            if (node[i].selected == false) {
                data.push(node[i].data);
            }
        }
		if($scope.options_41.api.getFocusedCell()){
		var rowidx = $scope.options_41.api.getFocusedCell().rowIndex;	
		}else{
		var rowidx =0	;
		}
		$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_item_fofsale_pi_break_headers=data;
		$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_item_fallofsale_pi_break_headers=data;
        $scope.options_44.api.setRowData(data);
    }
	//打散-包装方案 包装方案 获取包装方案
    $scope.get44 = function () {
		if($scope.options_41.api.getFocusedCell()){
		var rowidx = $scope.options_41.api.getFocusedCell().rowIndex;	
		}else{
		var rowidx =0	;
		}
		
		var node = $scope.options_41.api.getModel().rootNode.childrenAfterSort;
		var postdata={};
		postdata.pi_id=parseInt($scope.data.currItem.pi_id);
		postdata.pi_no=parseInt($scope.data.currItem.pi_no);
		postdata.item_code=node[rowidx].data.item_code;
        var promise = BasemanService.RequestPost("sale_pi_break_package_header", "matchpackage", postdata);
        promise.then(function (data) {
			 BasemanService.notice("获取成功", "alert-info");
			$scope.refresh(2);
		})
    }
    //包装方案取消 zdm
	$scope.cancel44 = function () {
        var data1 = [];
        var nodes = $scope.options_44.api.getModel().rootNode.childrenAfterSort;
        var datas = $scope.gridGetData("options_44");
        var num=0;
        for(var i=0;i<nodes.length;i++){
            if(nodes[i].selected){
                num++;
                datas[i].package_name = "";
                datas[i].package_id = 0;
                datas[i].qty = "";
                datas[i].calc_qty = "";
                datas[i].package_long = "";
                datas[i].package_wide = "";
                datas[i].package_high = "";
                datas[i].item_code2 = "";
                datas[i].item_desc2 = "";
                datas[i].item_qty2 = "";
                datas[i].package_ware = "";
                datas[i].package_factory = "";
                datas[i].made_type = "";
                datas[i].item_type = "";
                datas[i].row_type = "";
                datas[i].package_qty = "";
                datas[i].note = "";
                nodes[i].setSelected(false);
                for (var j = 0; j < nodes.length; j++) {
                    if (nodes[j].data.item_code == datas[i].item_code&&i!=j) {
                        nodes[j].setSelected(true);
                    }
                }
            }
        }
        $scope.selectGridDelItem("options_44");
        if (num == 0) {
            BasemanService.notice("未选中要取消的行", "alert-info");
        }else{
            // BasemanService.notice(num+"行包装方案已取消!", "alert-info");
        }
    }
    //取消整单包装方案
    $scope.allcancel43 = function () {
        var nodes = $scope.options_43.api.getModel().rootNode.childrenAfterSort;
        var datas = $scope.gridGetData("options_43");
        $scope.options_43.api.selectAll("options_43");
        var num = 0, flag = false;
        ds.dialog.confirm("是否确认取消整单包装方案？", function () {
            for (var i = 0; i < datas.length; i++) {
                if (nodes[i].selected) {
                    if (datas[i].package_id != "" && Number(datas[i].package_id || 0) != 0) {
                        num = num + 1;
                    }
                    datas[i].package_name = "";
                    datas[i].qty = "0";
                    datas[i].calc_qty = "0";
                    datas[i].package_long = "0";
                    datas[i].package_wide = "0";
                    datas[i].package_high = "0";
                    datas[i].item_code2 = "";
                    datas[i].item_desc2 = "";
                    datas[i].item_qty2 = "0";
                    datas[i].package_desc = "";
                    datas[i].package_ware = "";
                    datas[i].package_factory = "";
                    datas[i].made_type = "";
                    datas[i].package_qty = "0";
                    datas[i].item_type = "";
                    datas[i].row_type = "";
                    datas[i].package_id = "";
                    datas[i].package_code = "";
                    $scope.gridUpdateRow('options_43', datas[i]);
                    $scope.options_43.api.setRowData(datas);
                    nodes[i].setSelected(false);
                    //取消包装方案后，选中多余的行，后续好遍历删除
                    for (var j = 0; j < datas.length; j++) {
                        if ((datas[j].item_code == datas[i].item_code) && (i != j)) {
                            nodes[j].setSelected(true);
                        }
                    }
                }
            }
            //删除多余的行
            var noselectdatas = [];
            for (var j = 0; j < datas.length; j++) {
                if (!(nodes[j].selected)) {
                    noselectdatas.push(nodes[j].data)
                }
            }
            $scope.options_43.api.setRowData(noselectdatas);
            if (num > 0) {
                BasemanService.notice(num + "'行包装方案已取消！'", "alert-info");
                return;
            } else if (noselectdatas.length > 0) {
                BasemanService.notice("操作成功", "alert-info");
                return;
            }
        }, function () {
            $scope.newWindow.close();
        });
    };
    //打散-包装方案 包装方案 计算包装方案
    $scope.compute44 = function () {
        postdata = {};
        postdata.pi_id = $scope.data.currItem.pi_id;
		postdata.pi_f_id = $scope.data.currItem.pi_f_id;
        var promise = BasemanService.RequestPost("sale_pi_break_package_header", "calpackagefee", postdata);
        promise.then(function (data) {
            $scope.refresh(2);
            BasemanService.notice("计算成功", "alert-info");
        })
    }
	//打散-包装方案 包装方案(未维护) 获取包装方案未维护
    $scope.getpack = function () {
		var data=[];
		var node=$scope.options_41.api.getModel().rootNode.childrenAfterSort;
		for (var i = 0; i < node.length; i++) {
			for(var j=0;j<node[i].data.sale_pi_break_item_fallofsale_pi_break_headers.length;j++)
            if (node[i].data.sale_pi_break_item_fallofsale_pi_break_headers[j].package_name == undefined||node[i].data.sale_pi_break_item_fallofsale_pi_break_headers[j].package_name=="") {
                data.push(node[i].data.sale_pi_break_item_fallofsale_pi_break_headers[j]);
            }
        }
		$scope.options_47.api.setRowData(data);
	}
	
    //打散-包装方案 标机BOM查看 查询（树状结构数据转换）
    $scope.item_code46 = function () {
        if ($scope.data.currItem.item_code == "" || $scope.data.currItem.item_code == undefined) {
            BasemanService.notice("打散方案明细未选择", "alert-info");
            return;
        }
        var postdata = {};
        postdata.item_code = $scope.data.currItem.item_code;
        var promise = BasemanService.RequestPost("sale_pi_header", "getdeploybom", postdata);
        promise.then(function (data) {
            var shift = [];
            shift[0] = {};
            shift[0].item_code = $scope.data.currItem.item_code;
            shift[0].folder = true;
            shift[0].open = true;
            shift[0].children = [];
            //循环递归处理树状数据结构
            //$scope.options_46.api.setRowData(data.sale_pi_item_h_lineofsale_pi_break_package_headers);
            $scope.callback(data.sale_pi_item_h_lineofsale_pi_headers);
            for (var i = 0; i < data.sale_pi_item_h_lineofsale_pi_headers.length; i++) {
                if (data.sale_pi_item_h_lineofsale_pi_headers[i].childrens) {
                    delete data.sale_pi_item_h_lineofsale_pi_headers[i].childrens;
                }
            }
            shift[0].children = data.sale_pi_item_h_lineofsale_pi_headers;
            $scope.options_46.api.setRowData(shift);
        });
    }
	
	//打散-包装方案 移入打散规则
    $scope.move46 = function () {
		var rowidx = $scope.options_41.api.getFocusedCell().rowIndex;
		var data=[],data1=[];
        var data2=$scope.options_46.api.getSelectedRows();
		var node=$scope.options_42.api.getModel().rootNode.childrenAfterSort;		
		var node1=$scope.options_43.api.getModel().rootNode.childrenAfterSort;
		var length=$scope.sort($scope.gridGetData("options_42"))>$scope.sort($scope.gridGetData("options_43"))?$scope.sort($scope.gridGetData("options_42")):$scope.sort($scope.gridGetData("options_43"));	
		for(var i=0;i<data2.length;i++){
			var object={},object1={};
			if(data2[i].children){
				delete data2[i].children
			}
			data2[i].line_id=(length+i+1);
			data2[i].pack_name="1";
			HczyCommon.copyobj(data2[i],object);
			object.item_code=object.item_code.substr(0,6);
			data.push(object);
			
			data2[i].item_qty=parseInt(data2[i].qty);
			HczyCommon.copyobj(data2[i],object1);
			data1.push(object1);
			$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_item_fallofsale_pi_break_headers.push(object1);
		}
		for(var i=0;i<node.length;i++){
			node[i].data.pack_name=parseInt(node[i].data.pack_name);
			data.push(node[i].data);
		}
		for(var i=0;i<node1.length;i++){
			node1[i].data.pack_name=parseInt(node1[i].data.pack_name);            			
			data1.push(node1[i].data);
		}
		if(parseInt($scope.data.currItem.stand_bom)==1){
		$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_line_fofsale_pi_break_headers=(data);
		$scope.options_42.api.setRowData(data);
		}	
		$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_item_fofsale_pi_break_headers=(data1);
		//$scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_item_fallofsale_pi_break_headers=(data1);
        $scope.options_43.api.setRowData(data1);		
		$scope.options_44.api.setRowData($scope.data.currItem.sale_pi_break_headerofsale_pi_break_package_headers[rowidx].sale_pi_break_item_fallofsale_pi_break_headers);
    }
    function sizeCellStyle() {
        return {'text-align': 'right'};
    }

    /**-------------------------网格事件处理-----------------------**/
    /**************************网格定义******************************/
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

    //资金预览
    $scope.options_11 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
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
    $scope.columns_11 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "付款方式", field: "pay_type", editable: false, filter: 'set', width: 150,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: [{value: 1, desc: 'TT'}, {value: 2, desc: 'LC'}, {
                    value: 3,
                    desc: 'OA'
                }, {value: 4, desc: '领导特批'}]
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "金额", field: "amount", editable: true, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "付款比例", field: "pay_ratio", editable: true, filter: 'set', width: 150,
            cellEditor: "浮点框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "资金成本率", field: "interest_rate", editable: true, filter: 'set', width: 150,
            cellEditor: "浮点框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		
		
        {
            headerName: "回款期限", field: "days", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "基础扣费", field: "base_fee", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];

    //费用明细
    $scope.options_12 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
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
    $scope.columns_12 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "订单费用编码", field: "order_fee_code", editable: true, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "订单费用名称", field: "order_fee_name", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "费用", field: "amt_fee", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];

    //柜型柜量
    $scope.options_13 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_13.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_13 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "柜型", field: "box_type", editable: true, filter: 'set', width: 200,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "柜数", field: "box_qty", editable: true, filter: 'set', width: 150,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "到货港", field: "seaport_in_name", editable: true, filter: 'set', width: 150,
            cellEditor: "弹出框",
            action: $scope.seaport_in_name13,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "单柜海运费", field: "amt_fee1", editable: true, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "单柜保险费", field: "amt_fee2", editable: true, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "参考海运费", field: "ref_amt", editable: true, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];

    //款项明细
    $scope.options_14 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        //rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_14.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_14 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "资金单号", field: "money_bill_no", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "付款方式", field: "pay_type", editable: false, filter: 'set', width: 150,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: [{value: 1, desc: 'TT'}, {value: 2, desc: 'LC'}, {
                    value: 3,
                    desc: 'OA'
                }, {value: 4, desc: '领导特批'}]
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "对应单据号", field: "source_bill_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "金额", field: "amount", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "发货金额", field: "send_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "已发货确认金额", field: "confirm_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "已核销金额", field: "reduce_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "是否可用", field: "usable", editable: true, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: [{value: 1, desc: '否'}, {value: 2, desc: '是'}]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];


    //机型参数
    $scope.options_15 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        //rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_15.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_15 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "整机编码", field: "item_h_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户型号", field: "cust_item_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "参数类型", field: "row_type", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "国家名称", field: "area_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "制冷剂类型", field: "refrigerant", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "气候", field: "climate_type", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "电源", field: "power_type", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "低电压", field: "low_voltage", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "冬季最低温度", field: "low_temperature", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "夏季最高温度", field: "high_temperature", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "能效", field: "energy", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "认证", field: "certification", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];

    //机型面板
    $scope.options_16 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        //rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_16.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_16 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "整机编码", field: "item_h_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户型号", field: "cust_item_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "机型类型", field: "item_type", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "面板款式", field: "mb_style", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "面板颜色", field: "mb_color", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "装饰条颜色", field: "mb_article", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];

    //sheet页第二页订单明细
    $scope.options_21 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        rowClicked: $scope.rowClicked21,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_21 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "品牌名", field: "brand_name", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "销售国家", field: "area_names", editable: true, filter: 'set', width: 150,
            cellEditor: "弹出框",
            action: $scope.area_names21,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "类型", field: "line_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "工厂型号编码", field: "item_h_code", editable: true, filter: 'set', width: 150,
            cellEditor: "弹出框",
            action: $scope.item_h_code21,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "工厂型号", field: "item_h_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: " 客户型号", field: "cust_item_name", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            cellchange: $scope.cust_item_name21,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "数量", field: "qty", editable: true, filter: 'set', width: 100,
            cellEditor: "整数框",
            cellchange: $scope.qty21,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "FOB销售价", field: "price", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
            cellchange: $scope.price21,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "销售金额", field: "sale_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "指导价", field: "guide_p6", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "业务结算价", field: "p4", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "标准结算价", field: "std_p4", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "指导价毛利率", field: "hguide_hwmlv", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "指导选配差价", field: "std_c_price", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "业务选配结算差价", field: "c_price", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "标准选配差价", field: "std_c_cl_cb", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "资金成本", field: "S3", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "汇兑损益", field: "S4", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "返利", field: "S7", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "佣金", field: "S1", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "CKD费用", field: "ckd_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "SKD费用", field: "skd_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包装费用", field: "package_fee", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "佣金", field: "s1", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "产品技术要求", field: "item_desc", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "材料成本价", field: "cl_cb", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "材料成本差价", field: "c_cl_cb", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "标准成本", field: "std_cl_cb", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "机型装柜数量", field: "box_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];

    //分体机
    $scope.options_22 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        rowClicked: $scope.rowClicked22,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_22.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_22 = [
        {
            headerName: "机型类别", field: "pro_type", editable: false, filter: 'set', width: 150,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "散件类型", field: "sj_type", editable: true, filter: 'set', width: 150,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "分体机编码", field: "item_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "分体机描述", field: "item_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户型号", field: "cust_item_name", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户产品名称", field: "cust_spec", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "数量", field: "qty", editable: true, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "FOB销售价", field: "price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "销售金额", field: "sale_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "指导价", field: "guide_p6", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "业务结算价", field: "P4", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "标准结算价", field: "std_p4", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "指导选配差价", field: "std_c_price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "业务选配结算差价", field: "c_price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "标准选配差价", field: "std_c_cl_cb", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注", field: "note", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "压机型号", field: "comp_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "材料成本价", field: "cl_cb", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "材料成本差价", field: "c_cl_cb", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "指导成本", field: "guide_cl_cb", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "制造费用系数", field: "made_sx", editable: false, filter: 'set', width: 120,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包装费用", field: "package_fee", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];

    //配件清单
    $scope.options_23 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        //rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_23.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_23 = [
        {
            headerName: "整机编码", field: "item_h_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "整机名称", field: "item_h_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "分体机编码", field: "item_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "分体机名称", field: "item_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户型号", field: "cust_item_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "配件分类", field: "part_class", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "配件描述", field: "part_desc", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "英文名", field: "part_en_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "单台用量", field: "qty", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "需求数量", field: "require_qty", editable: true, filter: 'set', width: 100,
            cellEditor: "整数框",
			cellchange:$scope.require_qty23,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "价格", field: "price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "销售价格", field: "psale_price", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
			cellchange:$scope.psale_price23,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "金额", field: "amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注", field: "note", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];

    //当前机型
    $scope.options_31 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        //rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_31.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_31 = [
        {
            headerName: "配置项名称", field: "conf_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "可选项名称", field: "option_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "是否特殊项", field: "is_special", editable: false, filter: 'set', width: 150,
            cellEditor: "复选框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "是否标配", field: "is_default", editable: false, filter: 'set', width: 150,
            cellEditor: "复选框",
            checkbox_value: 1,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "方案号", field: "file_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "方案名称", field: "file_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "价差", field: "diff_price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "选配信息", field: "defs", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注", field: "note", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];

    //所有机型
    $scope.options_32 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        //rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_32.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_32 = [
        {
            headerName: "配置项名称", field: "conf_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "可选项名称", field: "option_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "是否特殊项", field: "is_special", editable: false, filter: 'set', width: 150,
            cellEditor: "复选框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "是否标配", field: "is_default", editable: false, filter: 'set', width: 150,
            cellEditor: "复选框",
            checkbox_value: 1,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "方案号", field: "file_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "方案名称", field: "file_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户型号", field: "item_cust_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "机型编码", field: "item_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "机型名称", field: "item_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "价差", field: "diff_price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "选配信息", field: "defs", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注", field: "note", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];

    //打散-包装方案
    $scope.options_41 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        rowClicked: $scope.rowClicked41,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_41.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_41 = [
        {
            headerName: "散件类型", field: "sj_type", editable: false, filter: 'set', width: 150,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "打散方案", field: "break_name", editable: true, filter: 'set', width: 150,
            cellEditor: "弹出框",
            action: $scope.break_name41,
			cellchange:$scope.cellchange41,
			non_readonly:true,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "装配规则", field: "assembly_name", editable: true, filter: 'set', width: 150,
            cellEditor: "弹出框",
            action: $scope.assembly_name41,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "打散大类名称", field: "item_type_name", editable: true, filter: 'set', width: 150,
            cellEditor: "弹出框",
			action: $scope.item_type_name41,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "机型编码", field: "item_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "适用机型", field: "item_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "订单数量", field: "qty", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "制造费用系数", field: "made_sx", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包装费用", field: "package_fee", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "价差", field: "diff_price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "选配信息", field: "defs", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注", field: "note", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];
    function colorRenderer(params){
		if(parseInt(params.data.row_flag)==2){
		params.eGridCell.style.color="red";
		}		
		if(params.value==undefined){
			return ""
		}else{
		return params.value;	
		}
		
	}
    //打散方案明细 左边
    $scope.options_42 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        //rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_42.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_42 = [
        {
            headerName: '序号',
            field: 'line_id',
            width: 70,
            editable: true,
            enableRowGroup: true,
			cellRenderer:function(params){return colorRenderer(params)},
            checkboxSelection: function (params) {
                // we put checkbox on the name if we are not doing no grouping
                return params.columnApi.getRowGroupColumns().length === 0;
            },
            icons: {
                sortAscending: '<i class="fa fa-sort-alpha-asc"/>',
                sortDescending: '<i class="fa fa-sort-alpha-desc"/>'
            }
        },
        {
            headerName: "父项序号", field: "p_seq", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",	
			cellRenderer:function(params){return colorRenderer(params)},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "编码前缀", field: "item_code", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
			cellRenderer:function(params){return colorRenderer(params)},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "物料描述包含", field: "item_name", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
			cellRenderer:function(params){return colorRenderer(params)},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "物料描述不包含", field: "item_name2", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
			cellRenderer:function(params){return colorRenderer(params)},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包装方式", field: "pack_name", editable: true, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注", field: "note", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
			cellRenderer:function(params){return colorRenderer(params)},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];

    //打散方案明细 右边
    $scope.options_43 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        cellValueChanged: $scope.cellValueChanged,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_43.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_43 = [
        {
            headerName: '序号',
            field: 'line_id',
            width: 70,
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
        },
        {
            headerName: "编码", field: "item_code", editable: true, filter: 'set', width: 150,
            cellEditor: "弹出框",
			action:$scope.item_code43,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "物料描述", field: "item_name", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "方案类型", field: "ptype_name", editable: true, filter: 'set', width: 150,
            cellEditor: "弹出框",
			action:$scope.ptype_name43,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包装方式", field: "pack_name", editable: true, filter: 'set', width: 150,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "单台用量", field: "item_qty", editable: true, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "BOM层次", field: "bom_level", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];

    //包装方案
    $scope.options_44 = {
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
		rowDoubleClicked:$scope.rowDoubleClicked44,
        //rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_44.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_44 = [
        {
            headerName: '序号',
            field: 'line_id',
            width: 70,
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
        },
        {
            headerName: "BOM层次", field: "bom_level", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "BOM路径", field: "item_ids", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "方案类型", field: "ptype_name", editable: true, filter: 'set', width: 150,
            cellEditor: "弹出框",
			action:$scope.ptype_name44,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "物料编码", field: "item_code", editable: true, filter: 'set', width: 150,
            cellEditor: "弹出框",
			action:$scope.item_code44,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "物料描述", field: "item_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "包装方案名称", field: "package_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "单位", field: "item_uom", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "单台用量(PC)", field: "item_qty", editable: true, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "打散方式", field: "pack_name", editable: true, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        
        {
            headerName: "原包装数量", field: "qty", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "原包装用量", field: "calc_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "长", field: "package_long", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "宽", field: "package_wide", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "高", field: "package_high", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包辅物料", field: "item_code2", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包辅物料描述", field: "item_desc2", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包辅用量", field: "item_qty2", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "BOM包类型", field: "package_ware", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包装工厂", field: "package_factory", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "生产类型", field: "made_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: [{value:1,desc:"外购件"},{value:2,desc:"自制件"}]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "所属箱型", field: "item_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "所属类型", field: "row_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: [{value:1,desc:"包辅料"},{value:2,desc:"包装箱"}]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包辅料所需用量", field: "package_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注", field: "note", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];

    //辅料用量汇总
    $scope.options_45 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        //rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_45.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_45 = [
        {
            headerName: "BOM包类型", field: "package_ware", editable: false, filter: 'set', width: 150,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包辅料编码", field: "item_code2", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包辅料描述", field: "item_desc2", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "订单数量", field: "order_qty", editable: false, filter: 'set', width: 150,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包辅料所需用量", field: "package_qty", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包辅料实际用量", field: "actual_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包装箱单位体积", field: "package_tj", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "所属类型", field: "row_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: [{value:1,desc:"包辅料"},{value:2,desc:"包装箱"}]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "所属箱型", field: "item_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "合并序号", field: "union_seq", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "辅料成本", field: "price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];

    //标机BOM查看
    $scope.options_46 = {
        rowSelection: 'multiple',
        enableColResize: true,
        enableSorting: true,
		suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        rowHeight: 25,
        getNodeChildDetails: function (file) {
            if (file.folder) {
                return {
                    group: true,
                    children: file.children,
                    expanded: file.open
                };
            } else {
                return null;
            }
        },
        icons: {
            groupExpanded: '<i class="fa fa-minus-square-o"/>',
            groupContracted: '<i class="fa fa-plus-square-o"/>',
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_46 = [
        {
            headerName: "物料编码", field: "item_code", editable: false, filter: 'set', width: 200,
			checkboxSelection: function (params) {
                // we put checkbox on the name if we are not doing no grouping
                return params.columnApi.getRowGroupColumns().length === 0;
            },
            cellEditor: "树状结构"
        },
        {
            headerName: "物料名称", field: "item_name", editable: false, filter: 'set', width: 300,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "数量", field: "qty", editable: false, filter: 'set', width: 70,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "单装物料", field: "danz", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注", field: "note", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];

//包装方案（未维护）
    $scope.options_47 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        //rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_47.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_47 = [
        {
            headerName: '序号',
            field: 'line_id',
            width: 70,
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
        },
        {
            headerName: "BOM层次", field: "bom_level", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "BOM路径", field: "item_ids", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "方案类型", field: "ptype_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "物料编码", field: "item_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "物料描述", field: "item_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "包装方案名称", field: "package_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "单位", field: "item_uom", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "单台用量(PC)", field: "item_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "制造费用系数", field: "made_sx", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "打散方式", field: "pack_name", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        
        {
            headerName: "原包装数量", field: "qty", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "原包装用量", field: "calc_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "长", field: "package_long", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "宽", field: "package_wide", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "高", field: "package_high", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包辅物料", field: "item_code2", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包辅物料描述", field: "item_desc2", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包辅用量", field: "item_qty2", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "BOM包类型", field: "package_ware", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包装工厂", field: "package_factory", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "生产类型", field: "made_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "所属箱型", field: "item_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "所属类型", field: "row_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包辅料所需用量", field: "package_qty", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注", field: "note", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];


    $scope.options_48 = {
        rowSelection: 'multiple',
        enableColResize: true,
        enableSorting: true,
        rowHeight: 20,
        getNodeChildDetails: function (file) {
            if (file.folder) {
                return {
                    group: true,
                    children: file.children,
                    expanded: file.open
                };
            } else {
                return null;
            }
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_48 = [
        {
            headerName: "Name", field: "name", width: 250,
            cellEditor: "树状结构"
        },
        {headerName: "Size", field: "size", width: 70},
        {headerName: "Type", field: "type", width: 150},
        {headerName: "Date Modified", field: "dateModified", width: 150}

    ];
    /**----------------网格区域-----------------------------**/
    /*******************************导出excel**********/
    $scope.export = function () {
        if (!$scope.data.currItem.pi_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        BasemanService.RequestPost("sale_pi_header", "exporttoexcel", {'pi_id': $scope.data.currItem.pi_id})
            .then(function (data) {
                if (data.docid != undefined && Number(data.docid) != 0) {
                    var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                    window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                } else {
                    BasemanService.notice("导出失败!", "alert-info");
                }
            });
    }

    $scope.export1 = function () {
        if (!$scope.data.currItem.pi_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        BasemanService.RequestPost("sale_pi_header", "exporttoexcel1", {'pi_id': $scope.data.currItem.pi_id})
            .then(function (data) {
                if (data.docid != undefined && Number(data.docid) != 0) {
                    var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                    window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                } else {
                    BasemanService.notice("导出失败!", "alert-info");
                }
            });
    }

    /**--------------------网格定义--------------------------*/
    //数据缓存
    $scope.initdata();
}
//加载控制器
billmanControllers
    .controller('sale_pi_break_package_headerEdit', sale_pi_break_package_headerEdit)
