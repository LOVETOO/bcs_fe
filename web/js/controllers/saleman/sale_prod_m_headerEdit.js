var basemanControllers = angular.module('inspinia');
function sale_prod_m_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_prod_m_headerEdit = HczyCommon.extend(sale_prod_m_headerEdit, ctrl_bill_public);
    sale_prod_m_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_prod_m_header",
        key: "prod_m_id",
        wftempid: "10037",
        FrmInfo: {},
        grids: [
            {
                optionname: 'options_21',
                idname: 'sale_prod_m_h_lineofsale_prod_m_headers',
                line: {optionname: "options_23", idname: "sale_prod_m_lineofsale_prod_m_h_lines"}
            },//订单明细  分体机
                
            {
                optionname: 'options_21',
                idname: 'sale_prod_m_h_lineofsale_prod_m_headers',
                line: {optionname: "options_22", idname: "sale_prod_m_h_detlofsale_prod_m_h_lines"}
            },//订单明细  交期拆分
            {optionname: 'options_24', idname: 'sale_prod_m_line_partofsale_prod_m_headers'},//配件清单
            {optionname: 'options_25', idname: 'sale_prod_m_packageofsale_prod_m_headers'},//配件打包
            {optionname: 'options_26', idname: 'sale_prod_m_erpcode_lineofsale_prod_m_headers'},//订单拆分信息1
            {optionname: 'options_27', idname: 'sale_prod_m_line_mbdataofsale_prod_m_headers'},//机型面板1			
			{
                optionname: 'options_21',
                idname: 'sale_prod_m_h_lineofsale_prod_m_headers',
                line: {optionname: "options_28", idname: "sale_prod_m_mause_lineofsale_prod_m_h_lines"}
            },//订单明细  长线物料消耗库存

            {optionname: 'options_31', idname: 'sale_prod_m_line_conf2ofsale_prod_m_headers'},//当前机型
            {optionname: 'options_32', idname: 'sale_prod_m_line_confofsale_prod_m_headers'},//所有机型

            //{optionname: 'options_41', idname: 'sale_prod_m_break_headerofsale_prod_m_headers'},//方案
            {
                optionname: 'options_41',
                idname: 'sale_prod_m_break_headerofsale_prod_m_headers',
                line: {optionname: "options_42", idname: "sale_prod_m_break_lineofsale_prod_m_break_headers"}
            },//方案  打散方案明细
            {
                optionname: 'options_41',
                idname: 'sale_prod_m_break_headerofsale_prod_m_headers',
                line: {optionname: "options_43", idname: "sale_prod_m_break_itemallofsale_prod_m_break_headers"}
            },//方案  包装方案
            {
                optionname: 'options_41',
                idname: 'sale_prod_m_break_headerofsale_prod_m_headers',
                line: {optionname: "options_44", idname: "sale_bill_break_itemofsale_prod_m_break_headers"}
            },//方案  辅料用料汇总
            //{optionname: 'options_45', idname: ''},//包装方案未维护 //前台计算1
            {optionname: 'options_46', idname: 'sale_prod_m_bom_lineofsale_prod_m_headers'},//替换明细1
            {optionname: 'options_47', idname: ''},//BOM清单1

            {
                optionname: 'options_51',
                idname: 'sale_m_printed_lineofsale_prod_m_headers', //
                line: {optionname: "options_52", idname: "sale_printed_lineofsale_prod_m_lines"}
            },//印刷件
            {optionname: 'options_53', idname: 'sale_m_printed_line_exceptionofsale_prod_m_headers'},//图纸文件与异常提醒
            //{optionname: 'options_61', idname: 'sale_prod_m_comp_lineofsale_prod_m_headers'}//印刷件汇总
        ]
    };
    /***********************隐藏区域**************************/
    { //sheet页1
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

        //sheet页2
        $scope.show_22 = false;
        $scope.show22 = function () {
            $scope.show_22 = !$scope.show_22;
        };
        $scope.show_23 = true;
        $scope.show23 = function () {
            $scope.show_23 = !$scope.show_23;
        };
        $scope.show_24 = false;
        $scope.show24 = function () {
            $scope.show_24 = !$scope.show_24;
        };
        $scope.show_25 = false;
        $scope.show25 = function () {
            $scope.show_25 = !$scope.show_25;
        };
        $scope.show_26 = false;
        $scope.show26 = function () {
            $scope.show_26 = !$scope.show_26;
        };
        $scope.show_27 = false;
        $scope.show27 = function () {
            $scope.show_27 = !$scope.show_27;
        };
		
		$scope.show_28 = false;
        $scope.show28 = function () {
            $scope.show_28 = !$scope.show_28;
        };

        //sheet页4
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

        //sheet页5
        $scope.show_53 = false;
        $scope.show53 = function () {
            $scope.show_53 = !$scope.show_53;
        };
    }

    // 类型 line_type
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "line_type"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
            //订单明细
            $scope.columns_21[1].cellEditorParams.values.push(newobj);
            $scope.columns_22[1].cellEditorParams.values.push(newobj);
            $scope.columns_23[1].cellEditorParams.values.push(newobj);
        }
    })

    // 类型 part_location
    BasemanService.RequestPostAjax("base_search", "search_printed_location").then(function (data) {
        for (var i = 0; i < data.base_searchs.length; i++) {
            var newobj = {
                value: data.base_searchs[i].locationid,
                desc: data.base_searchs[i].locationname
            }
            //订单明细
            $scope.columns_52[1].cellEditorParams.values.push(newobj);
            $scope.columns_61[1].cellEditorParams.values.push(newobj);
        }
    })
	// 类型 part_location
    BasemanService.RequestPostAjax("base_search", "search_printed_location").then(function (data) {
        for (var i = 0; i < data.base_searchs.length; i++) {
            var newobj = {
                value: data.base_searchs[i].locationid,
                desc: data.base_searchs[i].locationname
            }
            //订单明细
            $scope.columns_52[1].cellEditorParams.values.push(newobj);
            $scope.columns_61[1].cellEditorParams.values.push(newobj);
        }
    })
	//变更类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "change_type"}).then(function (data) {
        $scope.change_types = data.dicts;
    })
	
	//变更类型
	$scope.is_xpxxs =[
	{dictvalue:1,dictname:"引原生产单信息"},
	{dictvalue:2,dictname:"引PI变更单信息"},
	{dictvalue:3,dictname:"引生产单变更单信息"}
	]
	//散件规则引入
	$scope.break_froms =[
	{dictvalue:1,dictname:"生产单"},
	{dictvalue:2,dictname:"PI变更单"}
	]
    $scope.tab2 =function(){
		var postdata={};
		if($scope.data.currItem.org_id==""||$scope.data.currItem.org_id==undefined){
			postdata.org_id=0;
		}else{
			postdata.org_id=parseInt($scope.data.currItem.org_id);
		}
		BasemanService.RequestPost("sale_prod_header", "gethavamaterialinv",postdata).then(function (data) {
			$scope.data.currItem.is_havematerialinv=data.is_havematerialinv;
		});
	}

    /*****************权限控制*********************************/
    if (window.userbean) {
        $scope.userbean = window.userbean;
    }
    $scope.refresh_after = function () {
		$scope.data.currItem.part_transtype=parseInt($scope.data.currItem.part_transtype);
		$scope.data.currItem.marks_type=parseInt($scope.data.currItem.marks_type);
        var data = [];
        for (var i = 0; i < $scope.data.currItem.sale_m_printed_lineofsale_prod_m_headers.length; i++) {
            data = data.concat($scope.data.currItem.sale_m_printed_lineofsale_prod_m_headers[i].sale_m_printed_lineofsale_prod_m_lines);
        }
        for (var i = 0; i < data.length; i++) {
            data[i].seq = (i + 1);
        }
        $scope.options_61.api.setRowData(data);

        if (parseInt($scope.data.currItem.have_custpo) == 1) {
            var data = $scope.gridGetData("options_43");
            for (var i = 0; i < data.length; i++) {
                data[i].pocustno = "/"
            }
            $scope.options_43.api.setRowData(data);
        }

        if (mystring.indexOf("计划管理") > -1) {
            for (var i = 0; i < $scope.columns_21.length; i++) {
                if ($scope.columns_21[i].field == "prod_time") {
                    $scope.columns_21[i].editable = true;
                }
            }
			for (var i = 0; i < $scope.columns_22.length; i++) {
                if ($scope.columns_22[i].field == "prod_time") {
                    $scope.columns_22[i].editable = true;
                }
            }
        }
        if (mystring.indexOf("交期评审") > -1) {
            for (var i = 0; i < $scope.columns_21.length; i++) {
                if ($scope.columns_21[i].field == "pre_over_time") {
                    $scope.columns_21[i].editable = true;
                }
            }
			for (var i = 0; i < $scope.columns_22.length; i++) {
                if ($scope.columns_22[i].field == "pre_over_time") {
                    $scope.columns_22[i].editable = true;
                }
            }
        }
		if(parseInt($scope.data.currItem.stat)==1&&(parseInt($scope.data.currItem.change_type)==6||parseInt($scope.data.currItem.change_type)==3)){
				for (var i = 0; i < $scope.columns_21.length; i++) {
                     if ($scope.columns_21[i].field == "is_pause") {
                         $scope.columns_21[i].editable = true;
                        }
                    }
		}
        $scope.pei_jian_zu = mystring.indexOf("配件组") > -1 ? true : false;
        $scope.pei_jian_sf = mystring.indexOf("收费配件") > -1 ? true : false;
		if($scope.data.currItem.currprocname == "业务确认"){
	    for (var i = 0; i < $scope.columns_43.length; i++) {
		if ($scope.columns_43[i].field == "item_cust_code"||$scope.columns_43[i].field == "item_cust_desc"||$scope.columns_43[i].field == "pocustno") {
                    $scope.columns_43[i].editable = true;
                }
            }
		}
        if ($scope.data.currItem.currprocname == "包装方案维护" || $scope.data.currItem.currprocname == "散件BOM编制") {
            var column = $scope["options_43"].defaultColumns
            for (var i = 0; i < $scope.columns_43.length; i++) {
                $scope.columns_43[i].editable = column[i].editable;
            }
        }
        //网格过流程编辑问题
		$scope.updateColumns();
    }
    /**------------------------------------------------*******/
	$scope.prodno_search =function(){
		$scope.FrmInfo = {
            classid: "sale_prod_header",
			sqlBlock:" stat=5"
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.prod_id=parseInt(result.prod_id);
			BasemanService.RequestPost("sale_prod_header", "select", {prod_id: $scope.data.currItem.prod_id}).then(function (data) {				
				$scope.data.currItem=data;
				for(name in $scope.data.currItem){
				var name1=name.replace(/sale_prod_/g,"sale_prod_m_");
					$scope.data.currItem[name1]=$scope.data.currItem[name];
					if(name1!=name){
						delete $scope.data.currItem[name];
						if($scope.data.currItem[name1] instanceof Array){
							for(var j=0;j<$scope.data.currItem[name1].length;j++){
							    for(name2 in $scope.data.currItem[name1][j]){
								  if($scope.data.currItem[name1][j][name2] instanceof Array){
									  var name3=name2.replace(/sale_prod_/g,"sale_prod_m_");
								      $scope.data.currItem[name1][j][name3]=$scope.data.currItem[name1][j][name2];
								      delete $scope.data.currItem[name1][j][name2];
								  }								
								}
						   }
						}						
					}					
				}
				$scope.data.currItem.stat=1;
				$scope.data.currItem.sale_prod_m_headers=$scope.data.currItem.sale_prod_m_m_headers;
				delete $scope.data.currItem.sale_prod_m_m_headers;
				delete $scope.data.currItem.sale_pi_item_lineofsale_pi_headers;
				$scope.data.currItem.sale_m_printed_lineofsale_prod_m_headers=$scope.data.currItem.sale_printed_lineofsale_prod_m_headers;;
				delete $scope.data.currItem.sale_printed_lineofsale_prod_m_headers;
				for(var i=0;i<$scope.data.currItem.sale_m_printed_lineofsale_prod_m_headers.length;i++){
					$scope.data.currItem.sale_m_printed_lineofsale_prod_m_headers[i].sale_m_printed_lineofsale_prod_m_lines=$scope.data.currItem.sale_m_printed_lineofsale_prod_m_headers[i].sale_printed_lineofsale_prod_m_lines;
					delete $scope.data.currItem.sale_m_printed_lineofsale_prod_m_headers[i].sale_printed_lineofsale_prod_m_lines;
				}
				delete $scope.data.currItem.sale_printed_line_exceptionofsale_prod_m_headers;
				$scope.options_21.api.setRowData($scope.data.currItem.sale_prod_m_h_lineofsale_prod_m_headers);
				if($scope.data.currItem.sale_prod_m_h_lineofsale_prod_m_headers[0]){
					if($scope.data.currItem.sale_prod_m_h_lineofsale_prod_m_headers[0].sale_prod_m_h_detlofsale_prod_m_h_lines){
						$scope.options_22.api.setRowData($scope.data.currItem.sale_prod_m_h_lineofsale_prod_m_headers[0].sale_prod_m_h_detlofsale_prod_m_h_lines);
					}
					if($scope.data.currItem.sale_prod_m_h_lineofsale_prod_m_headers[0].sale_prod_m_lineofsale_prod_m_h_lines){
						$scope.options_23.api.setRowData($scope.data.currItem.sale_prod_m_h_lineofsale_prod_m_headers[0].sale_prod_m_lineofsale_prod_m_h_lines);
					}//分体机
					if($scope.data.currItem.sale_prod_m_h_lineofsale_prod_m_headers[0].sale_prod_m_mause_lineofsale_prod_m_h_lines){
						$scope.options_28.api.setRowData($scope.data.currItem.sale_prod_m_h_lineofsale_prod_m_headers[0].sale_prod_m_mause_lineofsale_prod_m_h_lines);
					}//长线物料消耗库存					
				};
				$scope.options_24.api.setRowData($scope.data.currItem.sale_prod_m_line_partofsale_prod_m_headers);//配件清单
				$scope.options_25.api.setRowData($scope.data.currItem.sale_prod_m_packageofsale_prod_m_headers);//配件打包
				$scope.options_26.api.setRowData($scope.data.currItem.sale_prod_m_erpcode_lineofsale_prod_m_headers);//订单拆分信息1
				$scope.options_27.api.setRowData($scope.data.currItem.sale_prod_m_line_mbdataofsale_prod_m_headers);//机型面板1
				$scope.options_31.api.setRowData($scope.data.currItem.sale_prod_m_line_conf2ofsale_prod_m_headers);//当前机型
				$scope.options_32.api.setRowData($scope.data.currItem.sale_prod_m_line_confofsale_prod_m_headers);//所有机型
				
				$scope.options_41.api.setRowData($scope.data.currItem.sale_prod_m_break_headerofsale_prod_m_headers)//方案
				if($scope.data.currItem.sale_prod_m_break_headerofsale_prod_m_headers[0]){
					if($scope.data.currItem.sale_prod_m_break_headerofsale_prod_m_headers[0].sale_prod_m_break_lineofsale_prod_m_break_headers){
						$scope.options_23.api.setRowData($scope.data.currItem.sale_prod_m_break_headerofsale_prod_m_headers[0].sale_prod_m_break_lineofsale_prod_m_break_headers);
					}//打散方案明细
					if($scope.data.currItem.sale_prod_m_break_headerofsale_prod_m_headers[0].sale_prod_m_break_itemallofsale_prod_m_break_headers){
						$scope.options_23.api.setRowData($scope.data.currItem.sale_prod_m_break_headerofsale_prod_m_headers[0].sale_prod_m_break_itemallofsale_prod_m_break_headers);
					}//包装方案
					if($scope.data.currItem.sale_prod_m_break_headerofsale_prod_m_headers[0].sale_bill_break_itemofsale_prod_m_break_headers){
						$scope.options_23.api.setRowData($scope.data.currItem.sale_prod_m_break_headerofsale_prod_m_headers[0].sale_bill_break_itemofsale_prod_m_break_headers);
					}//包装方案
				}
				//印刷件
				$scope.options_51.api.setRowData($scope.data.currItem.sale_m_printed_lineofsale_prod_m_headers);
				if($scope.data.currItem.sale_m_printed_lineofsale_prod_m_headers[0]){
					if($scope.data.currItem.sale_m_printed_lineofsale_prod_m_headers[0].sale_m_printed_lineofsale_prod_m_lines){
						$scope.options_52.api.setRowData($scope.data.currItem.sale_m_printed_lineofsale_prod_m_headers[0].sale_m_printed_lineofsale_prod_m_lines);
					}
			   }		
        });
	  })
	}
	$scope.pi_m_no =function(){
		if($scope.data.currItem.is_xpxx==""||$scope.data.currItem.is_xpxx==undefined||parseInt($scope.data.currItem.is_xpxx)==1){
			return;
		}
		if(parseInt($scope.data.currItem.is_xpxx)==2){
			$scope.FrmInfo = {
            classid: "sale_pi_m_header",
			sqlBlock:" 1=1 and stat = 5 and pi_id="+$scope.data.currItem.pi_id
            };
            BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.pi_m_no = result.pi_m_no;
            });
		}
		if(parseInt($scope.data.currItem.is_xpxx)==3){
			$scope.FrmInfo = {
            classid: "sale_prod_m_header",
			sqlBlock:" 1=1 and stat = 5 and prod_id="+$scope.data.currItem.prod_id
            };
            BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.pi_m_no = result.prod_m_no;
            });
		}		
	}
	$scope.break_from_no =function(){
		if($scope.data.currItem.break_from==""||$scope.data.currItem.break_from==undefined||parseInt($scope.data.currItem.break_from)==1){
			return;
		}
		if(parseInt($scope.data.currItem.break_from)==2){
			$scope.FrmInfo = {
            classid: "sale_prod_m_header",
			sqlBlock:" 1=1 and stat = 5 and prod_id="+$scope.data.currItem.prod_id
            };
            BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.break_from_no = result.prod_m_no;
            });
		}
	}
    /*****************网格处理事件****************************/
    {
        //订单拆分
        $scope.PI_Split = function () {
            if ($scope.data.currItem.prod_id == undefined || $scope.data.currItem.prod_id == 0) {
                BasemanService.notice("请先保存单据再做选配!", "alert-warning");
                return;
            }
            var postdata = {
                prod_id: parseInt($scope.data.currItem.prod_id)
            }
            BasemanService.RequestPost("sale_prod_m_header", "splitprod", postdata)
                .then(function (data) {
                    BasemanService.notice("生成完成", "alert-info");
                    $scope.refresh(2);
                })
        }
        //产品信息关联分体机
        $scope.defaultcoldef = $.extend(true, {}, ($scope.columns_21));
        $scope.rowClicked21 = function (event) {
			//处理光标下移问题
            $scope.deal_rowClicked("options_21", ["options_22", "options_23","options_28"]);
            //分体机==
            if (event.data) {
                $scope.options_22.api.setRowData(event.data.sale_prod_m_h_detlofsale_prod_m_h_lines);
                $scope.options_23.api.setRowData(event.data.sale_prod_m_lineofsale_prod_m_h_lines);
				$scope.options_28.api.setRowData(event.data.sale_prod_m_mause_lineofsale_prod_m_h_lines);
            }
            //单前机型
            if ($scope.options_32.api.getModel().rootNode.childrenAfterSort) {
                var node = $scope.options_32.api.getModel().rootNode.childrenAfterSort;
                if (node[0] && node[0].data) {
                    var postdata = {};
                    postdata.prod_id = node[0].data.prod_id;
                    postdata.prod_h_id = node[0].data.prod_h_id;
                    postdata.prod_line_id = node[0].data.prod_line_id;
                    BasemanService.RequestPost("sale_prod_header", "getsale_prod_line_conf", postdata)
                        .then(function (data) {
                            $scope.data.currItem.sale_prod_m_line_conf2ofsale_prod_m_headers = data.sale_prod_line_conf2ofsale_prod_headers;
                            $scope.options_31.api.setRowData($scope.data.currItem.sale_prod_m_line_conf2ofsale_prod_m_headers);
                        })
                }
            }

        };
        //分体机 关联单前机型
        $scope.rowClicked22 = function () {
            var rowidx = $scope.options_23.api.getFocusedCell().rowIndex;
            if ($scope.options_23.api.getModel().rootNode.childrenAfterSort) {
                var node = $scope.options_23.api.getModel().rootNode.childrenAfterSort;
                var postdata = {};
                if (node[0] && node[0].data) {
                    var postdata = {};
                    postdata.prod_id = node[0].data.prod_id;
                    postdata.prod_h_id = node[0].data.prod_h_id;
                    postdata.prod_line_id = node[0].data.prod_line_id;
                    BasemanService.RequestPost("sale_prod_header", "getsale_prod_line_conf", postdata)
                        .then(function (data) {
                            $scope.options_31.api.setRowData(data.sale_prod_line_conf2ofsale_prod_headers);
                        })
                }
            }
        };
        $scope.rowClicked24 = function () {
            if ($scope.pei_jian_zu || $scope.pei_jian_sf) {
                for (var i = 0; i < $scope.columns_24.length; i++) {
                    if ($scope.columns_24[i].field == "require_qty") {
                        $scope.columns_24[i].editable = true;
                    }
                }
                if ($scope.pei_jian_zu) {
                    for (var i = 0; i < $scope.columns_24.length; i++) {
                        if ($scope.columns_24[i].field == "cust_item_name" || $scope.columns_24[i].field == "erp_code" || $scope.columns_24[i].field == "pprod_qty" || $scope.columns_24[i].field == "note") {
                            $scope.columns_24[i].editable = true;
                        }
                    }
                }
            } else {
                for (var i = 0; i < $scope.columns_21.length; i++) {
                    if ($scope.columns_21[i].field == "prod_qty") {
                        $scope.columns_21[i].editable = false;
                    }
                }
            }
        }
        $scope.rowClicked41 = function (event) {
            if (event.data) {
                //打散方案明细
                if (event.data.sale_prod_m_break_lineofsale_prod_m_break_headers) {
                    $scope.options_42.api.setRowData(event.data.sale_prod_m_break_lineofsale_prod_m_break_headers);
                } else {
                    $scope.options_42.api.setRowData([]);
                }
                //包装方案
                if (event.data.sale_prod_m_break_itemallofsale_prod_m_break_headers) {
                    $scope.options_43.api.setRowData(event.data.sale_prod_m_break_itemallofsale_prod_m_break_headers);
                } else {
                    $scope.options_43.api.setRowData([]);
                }
                //辅料用料汇总
                if (event.data.sale_bill_break_itemofsale_prod_m_break_headers) {
                    $scope.options_44.api.setRowData(event.data.sale_bill_break_itemofsale_prod_m_break_headers);
                } else {
                    $scope.options_44.api.setRowData([]);
                }
            }

            var data = $scope.gridGetData("options_41");
            var index = $scope.options_41.api.getFocusedCell().rowIndex;
            $scope.data.currItem.item_code = data[index].item_code;
            $scope.data.currItem.erp_code = data[index].erp_code + "Z";
        }
        /**$scope.rowDoubleClicked43 = function (e) {
            if (e.api.getFocusedCell().column.colId == "package_name") {
                localeStorageService.set("crmman.sale_package_headerEdit");
                $state.go("crmman.sale_package_headerEdit");
            }

        }*/
        $scope.rowClicked51 = function (event) {
            if (event.data) {
                $scope.options_52.api.setRowData(event.data.sale_m_printed_lineofsale_prod_m_lines);
            }
        }
        //包装方案
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
                    if (!$scope.options_41.api.getFocusedCell()) {
                        var rowidx = 0
                    } else {
                        var rowidx = $scope.options_41.api.getFocusedCell().rowIndex;
                    }
                    var index = $scope.options_43.api.getFocusedCell().rowIndex;
                    var node = $scope.options_43.api.getModel().rootNode.childrenAfterSort;
                    var data = [];
                    for (var i = 0; i < node.length; i++) {
                        data.push(node[i].data);
                    }
                    ;
                    data[index].ptype_id = result.pack_id;
                    data[index].ptype_name = result.pack_name;

                    $scope.data.currItem.sale_prod_m_break_headerofsale_prod_m_headers[rowidx].sale_bill_break_itemofsale_prod_m_break_headers = data;
                    $scope.options_43.api.setRowData(data);
                });
        }
        //订单明细  国家
        $scope.area_names21 = function () {
            var FrmInfo = {};
            $scope.FrmInfo = {
                is_custom_search: true,
                is_high: true,
                type: "checkbox",
                title: "国家",
                thead: [
                    {
                        name: "国家编码",
                        code: "areacode",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "国家名称",
                        code: "areaname",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "国家中文",
                        code: "telzone",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }],
                classid: "scparea",
                postdata: {areaid: $scope.data.currItem.areaid},
                searchlist: ["areacode", "areaname", "telzone"],
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (result) {
                    var data = [];
                    var index = $scope.options_21.api.getFocusedCell().rowIndex;
                    var node = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
                    for (var i = 0; i < node.length; i++) {
                        data.push(node[i].data)
                    }
                    data[index].area_names = "";
                    data[index].area_ids = "";
                    for (var i = 0; i < result.length; i++) {
                        if (i == result.length - 1) {
                            data[index].area_names += result[i].telzone;
                            data[index].area_ids += result[i].areaid;
                        } else {
                            data[index].area_names += result[i].telzone + ",";
                            data[index].area_ids += result[i].areaid + ",";
                        }
                    }
                    $scope.options_21.api.setRowData(data);

                });

        }
        //客户机型-关联分体机
        $scope.cust_item_name21 = function () {
            var _this = $(this);
            var val = _this.val();
            var index = $scope.options_21.api.getFocusedCell().rowIndex;
            var nodes = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
            var datainputColumn = nodes[index].data;
            var datainputColumn = nodes[index].data;
            if (index != undefined) {
                for (var i = 0; i < nodes[index].data.sale_prod_m_lineofsale_prod_m_h_lines.length; i++) {
                    nodes[index].data.sale_prod_m_lineofsale_prod_m_h_lines[i].cust_item_name = val;
                    datainputColumn.item_h_id != undefined ? nodes[index].data.sale_prod_m_lineofsale_prod_m_h_lines[i].item_h_id == datainputColumn.item_h_id : 1;
                }
            }
			if (index != undefined) {
                for (var i = 0; i < nodes[index].data.sale_prod_m_h_detlofsale_prod_m_h_lines.length; i++) {
                    nodes[index].data.sale_prod_m_h_detlofsale_prod_m_h_lines[i].cust_item_name = val;
                    datainputColumn.item_h_id != undefined ? nodes[index].data.sale_prod_m_h_detlofsale_prod_m_h_lines[i].item_h_id == datainputColumn.item_h_id : 1;
                }
            }
            $scope.options_23.api.setRowData(nodes[index].data.sale_prod_m_lineofsale_prod_m_h_lines);
			$scope.options_22.api.setRowData(nodes[index].data.sale_prod_m_h_detlofsale_prod_m_h_lines);

        };
		//预计出货日期-关联分体机
		$scope.etd_ship_date21 = function (e) {
            var _this = $(this);
            var val = _this.val();
            var index = $scope.options_21.api.getFocusedCell().rowIndex;
            var nodes = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
            if (index != undefined) {
                for (var i = 0; i < nodes[index].data.sale_prod_m_lineofsale_prod_m_h_lines.length; i++) {
                    nodes[index].data.sale_prod_m_lineofsale_prod_m_h_lines[i].etd_ship_date = val;
                }
            }
            $scope.options_23.api.setRowData(nodes[index].data.sale_prod_m_lineofsale_prod_m_h_lines);
            for (var i = 0; i < nodes.length; i++) {
                if ((nodes[i].data.etd_ship_date == undefined || nodes[i].data.etd_ship_date == "") && e.currentTarget.value) {
                    nodes[i].data.etd_ship_date = e.currentTarget.value;
                    for (var j = 0; j < nodes[i].data.sale_prod_m_lineofsale_prod_m_h_lines.length; j++) {
                        nodes[i].data.sale_prod_m_lineofsale_prod_m_h_lines[j].etd_ship_date = e.currentTarget.value;
                        if (nodes[i].data.sale_prod_m_h_detlofsale_prod_m_h_lines[j]) {
                            nodes[i].data.sale_prod_m_h_detlofsale_prod_m_h_lines[j].etd_ship_date = e.currentTarget.value;
                        }

                    }
                    $scope.options_21.api.refreshCells(nodes, ["etd_ship_date"], true);
                }

            }


            var data = $scope.gridGetData("options_22");
            if (data.length == 0 || data.length >= 2) {
                return;
            } else {
                data[0].etd_ship_date = val;
                $scope.options_22.api.setRowData(data);
            }
        };
        //要求交货时间-关联分体机
        $scope.deliver_date21 = function (e) {

            var _this = $(this);
            var val = _this.val();
            var index = $scope.options_21.api.getFocusedCell().rowIndex;
            var nodes = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
            if (index != undefined) {
                for (var i = 0; i < nodes[index].data.sale_prod_m_lineofsale_prod_m_h_lines.length; i++) {
                    nodes[index].data.sale_prod_m_lineofsale_prod_m_h_lines[i].deliver_date = val;
                }
            }
            $scope.options_23.api.setRowData(nodes[index].data.sale_prod_m_lineofsale_prod_m_h_lines);
            for (var i = 0; i < nodes.length; i++) {
                if ((nodes[i].data.deliver_date == undefined || nodes[i].data.deliver_date == "") && e.currentTarget.value) {
                    nodes[i].data.deliver_date = e.currentTarget.value;
                    for (var j = 0; j < nodes[i].data.sale_prod_m_lineofsale_prod_m_h_lines.length; j++) {
                        nodes[i].data.sale_prod_m_lineofsale_prod_m_h_lines[j].deliver_date = e.currentTarget.value;
                        if (nodes[i].data.sale_prod_m_h_detlofsale_prod_m_h_lines[j]) {
                            nodes[i].data.sale_prod_m_h_detlofsale_prod_m_h_lines[j].deliver_date = e.currentTarget.value;
                        }

                    }
                    $scope.options_21.api.refreshCells(nodes, ["deliver_date"], true);
                }

            }


            var data = $scope.gridGetData("options_22");
            if (data.length == 0 || data.length >= 2) {
                return;
            } else {
                data[0].deliver_date = val;
                $scope.options_22.api.setRowData(data);
            }
        };

        $scope.prod_time21 = function () {
            var _this = $(this);
            var val = _this.val();
            var index = $scope.options_21.api.getFocusedCell().rowIndex;
            var nodes = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].data.prod_time == undefined || nodes[i].data.prod_time == "" && val) {
                    nodes[i].data.prod_time = val;
                    for (var j = 0; j < nodes[i].data.sale_prod_m_lineofsale_prod_m_h_lines.length; j++) {
                        nodes[i].data.sale_prod_m_lineofsale_prod_m_h_lines[j].prod_time = val;
                        if (nodes[i].data.sale_prod_m_h_detlofsale_prod_m_h_lines[j]) {
                            nodes[i].data.sale_prod_m_h_detlofsale_prod_m_h_lines[j].prod_time = val;
                        }

                    }
                    $scope.options_21.api.refreshCells(nodes, ["prod_time"], true);
                }
            }
			
			var data = $scope.gridGetData("options_22");
            if (data.length == 0 || data.length >= 2) {
                return;
            } else {
                data[0].prod_time = val;
                $scope.options_22.api.setRowData(data);
            }
        }

        $scope.pre_over_time21 = function () {
            var _this = $(this);
            var val = _this.val();
            var index = $scope.options_21.api.getFocusedCell().rowIndex;
            var nodes = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].data.pre_over_time == undefined || nodes[i].data.pre_over_time == "" && val) {
                    nodes[i].data.pre_over_time = val;
                    for (var j = 0; j < nodes[i].data.sale_prod_m_lineofsale_prod_m_h_lines.length; j++) {
                        nodes[i].data.sale_prod_m_lineofsale_prod_m_h_lines[j].pre_over_time = val;
                        if (nodes[i].data.sale_prod_m_h_detlofsale_prod_m_h_lines[j]) {
                            nodes[i].data.sale_prod_m_h_detlofsale_prod_m_h_lines[j].pre_over_time = val;
                        }

                    }
                    $scope.options_21.api.refreshCells(nodes, ["pre_over_time"], true);
                }
            }
			
			var data = $scope.gridGetData("options_22");
            if (data.length == 0 || data.length >= 2) {
                return;
            } else {
                data[0].pre_over_time = val;
                $scope.options_22.api.setRowData(data);
            }
        }
        //减少/增加数量-关联分体机
        $scope.modify_qty21 = function () {
            var _this = $(this);
            var val = _this.val();
			if($scope.options_21.api.getFocusedCell()){
				var index = $scope.options_21.api.getFocusedCell().rowIndex;
			}else{
				var index=0;
			}
            
            var nodes = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
            if (index != undefined) {
                for (var i = 0; i < nodes[index].data.sale_prod_m_lineofsale_prod_m_h_lines.length; i++) {
                    nodes[index].data.sale_prod_m_lineofsale_prod_m_h_lines[i].modify_qty = val;
					
                }
				if(nodes[index].data.sale_prod_m_mause_lineofsale_prod_m_h_lines){
					for(var i = 0; i < nodes[index].data.sale_prod_m_mause_lineofsale_prod_m_h_lines.length; i++){
					nodes[index].data.sale_prod_m_mause_lineofsale_prod_m_h_lines[i].modify_qty = val;
				    }
				}
				
            }
			if(nodes[index].data.sale_prod_m_lineofsale_prod_m_h_lines){
			 $scope.options_23.api.setRowData(nodes[index].data.sale_prod_m_lineofsale_prod_m_h_lines);	
			}
           
            $scope.options_28.api.setRowData(nodes[index].data.sale_prod_m_mause_lineofsale_prod_m_h_lines);
            var data = $scope.gridGetData("options_22");
            if (data.length == 0 || data.length >= 2) {
                return;
            } else {
                data[0].modify_qty = val;
                $scope.options_22.api.setRowData(data);
            }
        };
      //本次排产数量-关联分体机
        $scope.prod_qty21 = function () {
            var _this = $(this);
            var val = _this.val();
			if($scope.options_21.api.getFocusedCell()){
				var index = $scope.options_21.api.getFocusedCell().rowIndex;
			}else{
				var index=0;
			}
            
            var nodes = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
            if (index != undefined) {
                for (var i = 0; i < nodes[index].data.sale_prod_m_lineofsale_prod_m_h_lines.length; i++) {
                    nodes[index].data.sale_prod_m_lineofsale_prod_m_h_lines[i].prod_qty = val;
					
                }
				if(nodes[index].data.sale_prod_m_mause_lineofsale_prod_m_h_lines){
					for(var i = 0; i < nodes[index].data.sale_prod_m_mause_lineofsale_prod_m_h_lines.length; i++){
					nodes[index].data.sale_prod_m_mause_lineofsale_prod_m_h_lines[i].prod_qty = val;
				    }
				}
				
            }
			if(nodes[index].data.sale_prod_m_lineofsale_prod_m_h_lines){
			 $scope.options_23.api.setRowData(nodes[index].data.sale_prod_m_lineofsale_prod_m_h_lines);	
			}
           
            $scope.options_28.api.setRowData(nodes[index].data.sale_prod_m_mause_lineofsale_prod_m_h_lines);
            var data = $scope.gridGetData("options_22");
            if (data.length == 0 || data.length >= 2) {
                return;
            } else {
                data[0].prod_qty = val;
                $scope.options_22.api.setRowData(data);
            }
        };

        //增加行-产品信息
        $scope.addline21 = function () {
            if ($scope.data.currItem.pi_no == 0 || $scope.data.currItem.pi_no == undefined) {
                BasemanService.notice("清先选择'PI号'", "alert-info");
                return;
            }
            $scope.FrmInfo = {
                title: "产品查询",
                is_high: true,
                thead: [
                    {
                        name: "产品名称",
                        code: "item_h_name",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "客户机型",
                        code: "cust_item_name",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "合同价",
                        code: "price",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "工厂结算价",
                        code: "p4",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "PI数量",
                        code: "qty",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "已排产数量",
                        code: "proded_qty",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }],
                classid: "sale_pi_header",
                type: "checkbox",
                is_custom_search: true,
                searchlist: ["item_h_name", "cust_item_name", "price", "p4", "qty", "proded_qty"],
                postdata: {
                    pi_id: $scope.data.currItem.pi_id,
                    flag: 3
                }
            };
            BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (items) {
                if (items.length) {
                    var data = $scope.gridGetData("options_21");
                    var json_items = [].concat(items);
                    var len = json_items.length;
                    var current_item = "";
                    for (var i = 0; i < json_items.length; i++) {
                        var cust_item_name = json_items[i].cust_item_name, count = 0;
                        json_items[i].prod_qty = (parseInt(json_items[i].pi_qty) - parseInt(json_items[i].proded_qty))
                        for (var j = 0; j < data.length; j++) {
                            if (parseInt(json_items[i].pi_h_id) == parseInt(data[j].pi_h_id)) {
                                count++;
                            }
                        }
                        if (count == 0) {
                            data.push(json_items[i]);
                        }
                    }
                    $scope.data.currItem.sale_prod_m_h_lineofsale_prod_m_headers = data;
                }
                $scope.options_21.api.setRowData($scope.data.currItem.sale_prod_m_h_lineofsale_prod_m_headers);
                for (var i = 0; i < $scope.data.currItem.sale_prod_m_h_lineofsale_prod_m_headers.length; i++) {
                    var h_item = $scope.data.currItem.sale_prod_m_h_lineofsale_prod_m_headers[i].sale_prod_m_lineofsale_prod_m_h_lines;
                    if (h_item == undefined) {
                        h_item = [];
                        $scope.options_23.api.setRowData(h_item);
                        return;
                    } else {
                        for (var j = 0; j < h_item.length; j++) {
                            h_item[j].prod_qty = parseInt(h_item[j].pi_qty) - parseInt(h_item[j].proded_qty);
                            $scope.options_23.api.setRowData(h_item);
                        }

                    }
                }
            });
        };
		
		$scope.delline21 =function(){
		var data = [];
        var rowidx = $scope.options_21.api.getFocusedCell().rowIndex;
        var node = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        var data1=$scope.gridGetData("options_24");
	    if(parseInt(data[rowidx].line_type)==4){			
		    for(var i=data1.length-1;i>=0;i--){
			    if(parseInt(data1[i].pi_id||0)==parseInt(data[rowidx].pi_id)&&parseInt(data1[i].pi_h_id||0)==parseInt(data[rowidx].pi_h_id)){
					data1.splice(i,1);
				}
		    }
		};		
		//删除整机明细行
		data.splice(rowidx, 1);
        $scope.options_21.api.setRowData(data);
		//清空分机体明细
		if(rowidx>0){
		  var rowidx=rowidx-1;
		  var colKey= $scope.options_21.api.getFocusedCell().column.colId
		  $scope.options_21.api.setFocusedCell(rowidx,colKey);
		  $scope.options_22.api.setRowData($scope.data.currItem.sale_prod_m_h_lineofsale_prod_m_headers[rowidx].sale_prod_m_h_detlofsale_prod_m_h_lines);
          $scope.options_23.api.setRowData($scope.data.currItem.sale_prod_m_h_lineofsale_prod_m_headers[rowidx].sale_prod_m_lineofsale_prod_m_h_lines);
          $scope.options_28.api.setRowData($scope.data.currItem.sale_prod_m_h_lineofsale_prod_m_headers[rowidx].sale_prod_m_mause_lineofsale_prod_m_h_lines);			  
		}else{
		  if($scope.options_21.api.getModel().rootNode.childrenAfterSort.length==0){
			$scope.options_22.api.setRowData([]);
            $scope.options_23.api.setRowData([]);  
            $scope.options_28.api.setRowData([]);  			
		  }else{
		  var rowidx=rowidx;
		  var colKey= $scope.options_21.api.getFocusedCell().column.colId
		  $scope.options_21.api.setFocusedCell(rowidx,colKey);
		  $scope.options_22.api.setRowData($scope.data.currItem.sale_prod_m_h_lineofsale_prod_m_headers[rowidx+1].sale_prod_m_h_detlofsale_prod_m_h_lines);
          $scope.options_23.api.setRowData($scope.data.currItem.sale_prod_m_h_lineofsale_prod_m_headers[rowidx+1].sale_prod_m_lineofsale_prod_m_h_lines);
          $scope.options_28.api.setRowData($scope.data.currItem.sale_prod_m_h_lineofsale_prod_m_headers[rowidx+1].sale_prod_m_mause_lineofsale_prod_m_h_lines);	  
		  }
		}		
		//删除配件行
		$scope.options_24.api.setRowData(data1);
		}
		
        //增加指定机型配件
        $scope.addpj21 = function () {
            var data = $scope.gridGetData("options_21");
            var count = 0;
            for (var len = 0; len < data.length; len++) {
                if (data[len].line_type == 4) {
                    count++;
                }
            }
            if (count == 0) {
                BasemanService.notice("没有整机配件行", "alter-warning");
                return;
            }
            if ($scope.options_21.api.getFocusedCell()) {
                var rowidx = $scope.options_21.api.getFocusedCell().rowIndex;
            }
            var rowidx = $scope.options_21.api.getFocusedCell().rowIndex;
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
            var mystring = $scope.userbean.stringofrole;
            if (mystring.indexOf("销售人员") > -1) {
                $scope.FrmInfo = {};
                $scope.FrmInfo.postdata = {},
                    $scope.FrmInfo.postdata.flag = 2;
                $scope.FrmInfo.postdata.currency_id = $scope.data.currItem.currency_id;
                $scope.FrmInfo.postdata.exchangerate = $scope.data.currItem.exchangerate;
                $scope.FrmInfo.sqlBlock = " pro_item_header.item_h_id =" + parseInt(data1[rowidx].item_h_id || 0);
                BasemanService.openFrm("views/saleman/part_additem.html", part_additem, $scope, "", "lg")
                    .result.then(function (items) {
                        if (items[1].pro_item_partofpro_items.length == 0) {
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
                        $scope.options_24.api.setRowData(data);

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
            } else {
                var FrmInfo = {};
                $scope.FrmInfo = {
                    is_custom_search: true,
                    is_high: true,
                    title: "配件查询",
                    thead: [
                        {
                            name: "整机编码",
                            code: "item_h_code",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "配件描述",
                            code: "part_desc",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "单台用量",
                            code: "qty",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "整机描述",
                            code: "item_h_name",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "分体机编码",
                            code: "item_code",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "分体机描述",
                            code: "item_name",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }],
                    classid: "pro_item",
                    postdata: {flag: 2},
                    searchlist: ["item_h_code", "part_desc", "qty", "item_h_name", "item_code", "item_name"],
                    sqlBlock: " pro_item_header.item_h_id=" + parseInt(data1[rowidx].item_h_id || 0)
                };
                BasemanService.open(CommonPopController, $scope)
                    .result.then(function (items) {
                        if (items[1].pro_item_partofpro_items.length == 0) {
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
                        $scope.options_24.api.setRowData(data);

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
        };
        //产品选配sales_user_id: window.strUserId,
        $scope.addxp21222 = function () {
            if ($scope.data.currItem.prod_id == undefined || $scope.data.currItem.prod_id == 0) {
                BasemanService.notice("请先保存单据再做选配!", "alert-warning");
                return;
            }
            if ($scope.data.currItem.stat == 1 || $scope.data.currItem.stat == 0) {
                readonly = 0;
            } else {
                readonly = 1;
            }
            if (readonly = 1) {
                $scope.data.currItem.proc_id;
            }
            if ($scope.data.currItem.stat > 5 && $scope.data.currItem.proc_id == 0 || $scope.data.currItem.proc_id == 1 && $scope.data.currItem.sales_user_id) {
                readonly = 0
            }
            var pcsurl = "http://100.100.68.5:8081/ocm/login.jsp?user_id=538&randompass=PTAGQQNNNIJXCRGD&mo_id=" + $scope.data.currItem.prod_id + "&readonly=" + "&fullscreen=1" + "&oms_org_id=1500&is_new=1";
            $scope.newWindow = window.open(pcsurl, "newwindow");
            ds.dialog.confirm("是否完成选配？", function () {
                BasemanService.RequestPost("sale_pi_header", "getconf", {pi_id: $scope.data.currItem.prod_id, flag: 3})
                    .then(function (data) {
                        $scope.options_21.api.setRowData(data.sale_pi_headers);
                        $scope.options_31.api.setRowData(data.sale_pi_item_conf2ofsale_pi_headers);
                        BasemanService.notice("选配数据已完成!", "alert-info");
                        $scope.refresh(2);
                        $scope.newWindow.close();
                    });
            }, function () {
                $scope.newWindow.close();
            });
        };
        function fnPIconfBgClose() {
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

            BasemanService.RequestPost("sale_pi_header", "getconf", {pi_id: $scope.data.currItem.prod_id, flag: 3})
                .then(function (data) {
                    $scope.options_21.api.setRowData(data.sale_pi_headers);
                    BasemanService.notice("选配数据已完成!", "alert-info");
                    $scope.refresh(2);

                });

        }

        $scope.addxp21 = function () {
            if ($scope.data.currItem.prod_id == undefined || $scope.data.currItem.prod_id == 0) {
                BasemanService.notice("请先保存单据再做选配!", "alert-warning");
                return;
            }

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
                divClose.onclick = function () { //点击时间 ，关闭蒙板
                    fnPIconfBgClose();
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
            if ($scope.data.currItem.stat > 1) {
                var pcsurl = "http://100.100.68.5:8081/ocm/login.jsp?user_id=538&randompass=PTAGQQNNNIJXCRGD&mo_id=" + $scope.data.currItem.prod_id + "&readonly=1" + "&fullscreen=1" + "&oms_org_id=1500&is_new=1";
            } else {
                var pcsurl = "http://100.100.68.5:8081/ocm/login.jsp?user_id=538&randompass=PTAGQQNNNIJXCRGD&mo_id=" + $scope.data.currItem.prod_id + "&readonly=0" + "&fullscreen=1" + "&oms_org_id=1500&is_new=1";
            }

            document.getElementById('divPIconfBgIframe').src = pcsurl;
        }
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
   $scope.rowDoubleClicked43 =function(e){
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
    var data=$scope.gridGetData("options_43");
	var index=$scope.options_43.api.getFocusedCell().rowIndex;
	var pcsurl = "http://100.100.10.167:8080/web/index.jsp#/crmman/sale_package_headerEdit?package_id="+data[index].package_id+"&item_code="+data[index].item_code+"&item_name="+data[index].item_name+"&item_id="+data[index].item_id;	       
    document.getElementById('divPIconfBgIframe').src = pcsurl;		
	}
   }
        //订单明细 数据上移
        $scope.dataup = function () {
            var cell = $scope.options_21.api.getFocusedCell();
            var rowidx = $scope.options_21.api.getFocusedCell().rowIndex;
            var nodes = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
            var data = [];
            if (rowidx == 0) {
                return;
            } else {
                var temp = {};
                HczyCommon.copyobj(nodes[rowidx - 1].data, temp);
                temp.seq = parseInt(temp.seq) + 1;
                nodes[rowidx].data.seq = parseInt(nodes[rowidx].data.seq) - 1;
                nodes[rowidx - 1].data = nodes[rowidx].data;
                nodes[rowidx].data = temp;
            }
            for (var i = 0; i < nodes.length; i++) {
                data.push(nodes[i].data);
            }
            $scope.options_21.api.setFocusedCell(rowidx - 1, cell.column.colId);
            $scope.options_21.api.setRowData(data);
        }
        //订单明细 数据下移
        $scope.datadown = function () {
            var cell = $scope.options_21.api.getFocusedCell();
            var rowidx = $scope.options_21.api.getFocusedCell().rowIndex;
            var nodes = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
            var data = [];
            if (rowidx == parseInt(nodes.length - 1)) {
                return;
            } else {
                var temp = {};
                HczyCommon.copyobj(nodes[rowidx + 1].data, temp);
                temp.seq = parseInt(temp.seq) - 1;
                nodes[rowidx].data.seq = parseInt(nodes[rowidx].data.seq) + 1;
                nodes[rowidx + 1].data = nodes[rowidx].data;
                nodes[rowidx].data = temp;
            }
            for (var i = 0; i < nodes.length; i++) {
                data.push(nodes[i].data);
            }
            $scope.options_21.api.setFocusedCell(rowidx + 1, cell.column.colId);
            $scope.options_21.api.setRowData(data);
        }

        $scope.copypo = function () {
            var index = $scope.options_21.api.getFocusedCell().rowIndex;
            $scope.options_21.api.stopEditing(false);
            var data = $scope.gridGetData("options_21");
            for (var i = 0; i < data.length; i++) {
                if (i != index) {
                    data[i].cust_pono = data[index].cust_pono;
                }
            }
            $scope.options_21.api.setRowData(data);
        }

        $scope.copydeliver_date = function () {
            var index = $scope.options_21.api.getFocusedCell().rowIndex;
            $scope.options_21.api.stopEditing(false);
            var data = $scope.gridGetData("options_21");
            for (var i = 0; i < data.length; i++) {
                if (i != index && (data[i].deliver_date == "" || data[i].deliver_date == undefined)) {
                    data[i].deliver_date = data[index].deliver_date;
                }
            }
            $scope.options_21.api.setRowData(data);
        }
        //拆分行
        $scope.split = function () {
            var select_row = $scope.selectGridGetData('options_22');
            if (!select_row.length) {
                BasemanService.notice("未选中拆分明细!", "alert-warning");
                return;
            }
            var msg = [];
            if (select_row.length > 1) {
                msg.push("不能选择拆分的行数大于1行");
            }
            if (!(select_row[0].prod_qty > 1)) {
                msg.push("被拆分行的本次排产数量必须大于1");
            }
            /*if (!(select_row[0].line_type == 4)) {
             msg.push("配件不能拆分");
             }*/
            if (msg.length > 0) {
                BasemanService.notice(msg)
                return
            }
            var datachose = select_row[0];
            BasemanService.openFrm("views/Pop_copy_Line.html", PopCopyLineController, $scope)
                .result.then(function (result) {
                    var data = $scope.gridGetData("options_22")
                    var spiltRow = new Array(result.lines - 1);
                    for (i = 0; i < result.lines - 1; i++) {
                        spiltRow[i] = new Object();
                        for (var name in datachose) {
                            spiltRow[i][name] = datachose[name];
                        }
                        spiltRow[i].pi_qty = data[0].pi_qty;
                        //spiltRow[i].proded_qty = 0;
                        spiltRow[i].prod_qty = 0;
                        data.push(spiltRow[i]);
                    }
                    //数量拆分
                    //var sumTotal = datachose.prod_qty;
                    //var data=$scope.selectGridDelItem('options_22');//删除勾选行的数据
                    /**for (var i = 0; i < result.lines; i++) {
                        spiltRow[i].prod_qty=parseInt(sumTotal/(result.lines - i));
                        sumTotal = sumTotal - spiltRow[i].prod_qty;
                        spiltRow[i].proded_qty= spiltRow[i].pi_qty - spiltRow[i].prod_qty;
                        spiltRow[i].pi_qty= spiltRow[i].proded_qty - spiltRow[i].prod_qty;
                        data.push(spiltRow[i]);
                    }*/
                    for (var i = 0; i < data.length; i++) {
                        data[i].prod_detl_id = 0;
                    }
                    if ($scope.options_21.api.getFocusedCell()) {

                        $scope.data.currItem.sale_prod_m_h_lineofsale_prod_m_headers[$scope.options_21.api.getFocusedCell().rowIndex].sale_prod_m_h_detlofsale_prod_m_h_lines = data;
                    } else {
                        $scope.data.currItem.sale_prod_m_h_lineofsale_prod_m_headers[0].sale_prod_m_h_detlofsale_prod_m_h_lines = data;
                    }
                    $scope.options_22.api.setRowData(data);

                });

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
            if (items[0].sale_pi_item_h_lineofsale_pi_headers.length) {

                object = items[0].sale_pi_item_h_lineofsale_pi_headers[0];
                if ($scope.data.brandlist == undefined || $scope.data.brandlist.length == 0) {
                    object.brand_name = "";
                } else {
                    object.brand_name = $scope.data.brandlist[0].brand_name;
                }
				if(object.sale_pi_item_lineofsale_pi_item_h_lines){
				object.sale_prod_m_lineofsale_prod_m_h_lines = object.sale_pi_item_lineofsale_pi_item_h_lines;
                delete object.sale_pi_item_lineofsale_pi_item_h_lines;
				}
                
                object.line_type = 4;
                object.qty = 1;
                object.sale_amt = parseFloat(sale_amt || 0);
                object.price = parseFloat(sale_amt || 0);
                object.pi_id = parseInt($scope.data.currItem.pi_id);
                //object.pi_h_id=parseInt($scope.data.currItem.pi_h_id);
                object.sale_prod_m_lineofsale_prod_m_h_lines[0].qty = 1;
                object.sale_prod_m_lineofsale_prod_m_h_lines[0].line_type = 4;
                object.sale_prod_m_lineofsale_prod_m_h_lines[0].sale_amt = parseFloat(sale_amt || 0);
                object.sale_prod_m_lineofsale_prod_m_h_lines[0].price = parseFloat(sale_amt || 0);
            }
            return object;
        }
        //增加配件清单
        $scope.addline24 = function () {
            var data = $scope.gridGetData("options_21");
            var count = 0;
            for (var len = 0; len < data.length; len++) {
                if (data[len].line_type == 4) {
                    count++;
                }
            }
            if (count == 0) {
                BasemanService.notice("没有整机配件行", "alter-warning");
                return;
            }
            var mystring = $scope.userbean.stringofrole;
            if (mystring.indexOf("销售人员") > -1) {
                $scope.FrmInfo = {};
                $scope.FrmInfo.postdata = {},
                    $scope.FrmInfo.postdata.flag = 2;
                $scope.FrmInfo.postdata.currency_id = $scope.data.currItem.currency_id;
                if ($scope.data.currItem.exchangerate == 0 || $scope.data.currItem.exchangerate == undefined) {
                    BasemanService.notice("汇率为空！", "alert-warning");
                    return;
                }
                $scope.FrmInfo.postdata.exchangerate = $scope.data.currItem.exchangerate;
                BasemanService.openFrm("views/saleman/part_additem.html", part_additem, $scope, "", "lg")
                    .result.then(function (items) {
                        if (items[1].pro_item_partofpro_items.length == 0) {
                            return;
                        }
                        var data = [];
                        var nodes = $scope.options_24.api.getModel().rootNode.childrenAfterSort;
                        for (var i = 0; i < nodes.length; i++) {
                            data.push(nodes[i].data);

                        }
                        var data1 = [];
						var index= $scope.options_21.api.getFocusedCell().rowIndex;
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
									items[1].pro_item_partofpro_items[i].pi_id = parseInt(data1[index].pi_id);
									items[1].pro_item_partofpro_items[i].pi_h_id = parseInt(data1[index].pi_h_id);
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
									items[1].pro_item_partofpro_items[i].pi_id = parseInt(data1[index].pi_id);
									items[1].pro_item_partofpro_items[i].pi_h_id = parseInt(data1[index].pi_h_id);
                                    data.push(items[1].pro_item_partofpro_items[i]);
                                    //将其金额汇总
                                    sale_amt += parseFloat(items[1].pro_item_partofpro_items[i].amt || 0);
                                }
                            }
                        }
                        $scope.options_24.api.setRowData(data);

                       /** //加到订单明细的易损件中
                        if ($scope.is_ys()) {
                            //获取订单明细下标
                            var j = $scope.getindex(data1);
                            //返回汇总行
                            var temp = $scope.getoneYS(sale_amt, items);

                            data1[j].sale_amt = parseFloat(data1[j].sale_amt || 0) + temp.sale_amt;
                            data1[j].price = parseFloat(data1[j].price || 0) + temp.price;
                            data1[j].sale_prod_m_lineofsale_prod_m_h_lines[0].sale_amt = parseFloat(data1[j].sale_prod_m_lineofsale_prod_m_h_lines[0].sale_amt || 0)
                                + temp.sale_prod_m_lineofsale_prod_m_h_lines[0].sale_amt;
                            data1[j].sale_prod_m_lineofsale_prod_m_h_lines[0].price = parseFloat(data1[j].sale_prod_m_lineofsale_prod_m_h_lines[0].price || 0)
                                + temp.sale_prod_m_lineofsale_prod_m_h_lines[0].price;

                            $scope.options_21.api.setRowData(data1);
                        } else {
                            //返回汇总行
                            var temp = $scope.getoneYS(sale_amt, items);
                            temp.seq = (1 + data1.length);
                            data1.push(temp);
                            $scope.options_21.api.setRowData(data1);
                        }*/

                    });
            } else {
                var FrmInfo = {};
                $scope.FrmInfo = {
                    is_custom_search: true,
                    is_high: true,
                    title: "配件查询",
                    thead: [
                        {
                            name: "整机编码",
                            code: "item_h_code",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "配件描述",
                            code: "part_desc",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "单台用量",
                            code: "qty",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "整机描述",
                            code: "item_h_name",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "分体机编码",
                            code: "item_code",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "分体机描述",
                            code: "item_name",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }],
                    classid: "pro_item",
					backdatas:"pro_item_partofpro_items",
                    postdata: {flag: 2},
                    searchlist: ["item_h_code", "part_desc", "qty", "item_h_name", "item_code", "item_name"]
                };
                BasemanService.open(CommonPopController, $scope)
                    .result.then(function (res) {
						var items=[];
						var sale_pi_item_h_lineofsale_pi_headers=[];
						items.push({sale_pi_item_h_lineofsale_pi_headers:sale_pi_item_h_lineofsale_pi_headers});
						var pro_item_partofpro_items=[];
						pro_item_partofpro_items.push(res)
						items.push({pro_item_partofpro_items:pro_item_partofpro_items});
                        if (items[1].pro_item_partofpro_items.length == 0) {
                            return;
                        }
                        var data = [];
                        var nodes = $scope.options_24.api.getModel().rootNode.childrenAfterSort;
                        for (var i = 0; i < nodes.length; i++) {
                            data.push(nodes[i].data);
							
                        }
                        var data1 = [];
                        var nodes = $scope.options_21.api.getModel().rootNode.childrenAfterSort;
                        for (var i = 0; i < nodes.length; i++) {
                            data1.push(nodes[i].data);
							if(parseInt(nodes[i].data.line_type)==4){
								items[0].sale_pi_item_h_lineofsale_pi_headers.push(nodes[i].data);
							}
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
                        $scope.options_24.api.setRowData(data);

                        //加到订单明细的易损件中
                        if ($scope.is_ys()) {
                            //获取订单明细下标
                            var j = $scope.getindex(data1);
                            //返回汇总行
                            var temp = $scope.getoneYS(sale_amt, items);

                            data1[j].sale_amt = parseFloat(data1[j].sale_amt || 0) + temp.sale_amt;
                            data1[j].price = parseFloat(data1[j].price || 0) + temp.price;
                            data1[j].sale_prod_m_lineofsale_prod_m_h_lines[0].sale_amt = parseFloat(data1[j].sale_prod_m_lineofsale_prod_m_h_lines[0].sale_amt || 0)
                                + temp.sale_prod_m_lineofsale_prod_m_h_lines[0].sale_amt;
                            data1[j].sale_prod_m_lineofsale_prod_m_h_lines[0].price = parseFloat(data1[j].sale_prod_m_lineofsale_prod_m_h_lines[0].price || 0)
                                + temp.sale_prod_m_lineofsale_prod_m_h_lines[0].price;

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
        };
		
		//删除配件清单  走流程时有配件组这个权限的可以删除免费配件
		$scope.delline24 =function(){
		    var data=$scope.gridGetData("options_24");							
		    var index=$scope.options_24.api.getFocusedCell().rowIndex;
			if($scope.data.currItem.stat==1){
				data.splice(index,1);
			}else{
			  if($scope.pei_jian_zu){
				    if(parseFloat(data[index].psale_price||0)==0){
					    data.splice(index,1);
				     }				 
			    }
			}
			$scope.options_24.api.setRowData(data);
		}
		$scope.change_type =function(){
			//如果类型是暂停生产 整机明细行的“是否暂停”可以改，且全部默认为“是”
			if(parseInt($scope.data.currItem.change_type)==6){
				for (var i = 0; i < $scope.columns_21.length; i++) {
                     if ($scope.columns_21[i].field == "is_pause") {
                         $scope.columns_21[i].editable = true;
                        }
                    }
				    var data=$scope.gridGetData("options_21");
					for(var i=0;i<data.length;i++){
						data[i].is_pause=2;
					}
					$scope.options_21.api.setRowData(data);
			 //	当变更类型=“交期变更”，整机明细行的“是否暂停”可以改，且全部默认为“否”
			}else if(parseInt($scope.data.currItem.change_type)==3){
				 for (var i = 0; i < $scope.columns_21.length; i++) {
                     if ($scope.columns_21[i].field == "is_pause") {
                         $scope.columns_21[i].editable = true;
                        }
                    }
				    var data=$scope.gridGetData("options_21");
					for(var i=0;i<data.length;i++){					
							data[i].is_pause=1;
						
					}
					$scope.options_21.api.setRowData(data);
			}
			$scope.updateColumns();
		}
        //从历史单复制
        $scope.addls24 = function () {
			if($scope.options_21.api.getFocusedCell()){
				var index=$scope.options_21.api.getFocusedCell().rowIndex;
			}else{
				var index=0;
			}
            $scope.FrmInfo = {
                classid: "sale_prod_m_header",
                sqBlock: "stat!=99 and prod_id!=260280",
                postdata: {
                    flag: 10
                }
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                var postdata = {
                    prod_id:parseInt(result.prod_id)
                }
                BasemanService.RequestPost("sale_prod_m_header", "getprodfreepart", postdata)
                    .then(function (data) {
                        var temp=$scope.gridGetData("options_21")[index];
                         for(var i=0;i<data.sale_prod_m_line_partofsale_prod_m_headers.length;i++){
							 data.sale_prod_m_line_partofsale_prod_m_headers[i].item_line_seq=parseInt(temp.seq);
						 }						
                        $scope.options_24.api.setRowData(data.sale_prod_m_line_partofsale_prod_m_headers);
                        $scope.data.currItem.sale_prod_m_line_partofsale_prod_m_headers = data.sale_prod_m_line_partofsale_prod_m_headers
                    })
            });
        };
        //引入机型必选配件
        $scope.addbx24 = function () {
            var data = $scope.gridGetData("options_21");
            var count = 0;
            for (var len = 0; len < data.length; len++) {
                if (data[len].line_type == 4) {
                    count++;
                }
            }
            if (count == 0) {
                BasemanService.notice("没有整机配件行", "alter-warning");
                return;
            }
            if ($scope.options_21.api.getFocusedCell()) {
                var rowidx = $scope.options_21.api.getFocusedCell().rowIndex;
            }
            var rowidx = $scope.options_21.api.getFocusedCell().rowIndex;
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
            var mystring = $scope.userbean.stringofrole;
            if (mystring.indexOf("销售人员") > -1) {
                $scope.FrmInfo = {};
                $scope.FrmInfo.postdata = {},
                    $scope.FrmInfo.postdata.flag = 7;
                $scope.FrmInfo.postdata.currency_id = $scope.data.currItem.currency_id;
                $scope.FrmInfo.postdata.exchangerate = $scope.data.currItem.exchangerate;
                $scope.FrmInfo.sqlBlock = "  pro_item_header.item_h_id =" + parseInt(data1[rowidx].item_h_id || 0);
                BasemanService.openFrm("views/saleman/part_additem.html", part_additem, $scope, "", "lg")
                    .result.then(function (items) {
                        if (items[1].pro_item_partofpro_items.length == 0) {
                            return;
                        }
                        var data = [];
                        var nodes = $scope.options_24.api.getModel().rootNode.childrenAfterSort;
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
                        $scope.options_24.api.setRowData(data);

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
            } else {
                var FrmInfo = {};
                $scope.FrmInfo = {
                    is_custom_search: true,
                    is_high: true,
                    title: "配件查询",
                    thead: [
                        {
                            name: "整机编码",
                            code: "item_h_code",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "配件描述",
                            code: "part_desc",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "单台用量",
                            code: "qty",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "整机描述",
                            code: "item_h_name",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "分体机编码",
                            code: "item_code",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "分体机描述",
                            code: "item_name",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }],
                    classid: "pro_item",
                    postdata: {flag: 7},
                    searchlist: ["item_h_code", "part_desc", "qty", "item_h_name", "item_code", "item_name"],
                    sqlBlock: " pro_item_header.item_h_id=" + parseInt(data1[rowidx].item_h_id || 0)
                };
                BasemanService.open(CommonPopController, $scope)
                    .result.then(function (items) {
                        if (items[1].pro_item_partofpro_items.length == 0) {
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
                        $scope.options_24.api.setRowData(data);

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
        };
        //复制单前参考批次到其他空白行
        $scope.addq24 = function () {
            var index = $scope.options_24.api.getFocusedCell().rowIndex;
            $scope.options_24.api.stopEditing(false);
            var data = $scope.gridGetData("options_24");
            for (var i = 0; i < data.length; i++) {
                if (i != index) {
                    data[i].note = data[index].note;
                }
            }
            $scope.options_24.api.setRowData(data);
        };
        //机型面板
        $scope.addpro27 = function () {
            var postdata = {
                sqlwhere: ""
            }
            var sqlWhere = BasemanService.getSqlWhere(["prod_no"], $scope.searchtext);
            if (postdata) {
                postdata.sqlwhere = sqlWhere;
                postdata.prod_id = $scope.data.currItem.prod_id;
            }
            BasemanService.RequestPost("sale_prod_m_header", "creatembbill", postdata)
                .then(function (data) {
                    BasemanService.notice("生成成功！", "alert-warning");
                });
        };
		$scope.ma_no =function(){
			$scope.detail=0;
			if($scope.options_21.api.getFocusedCell()){
				var index=$scope.options_21.api.getFocusedCell().rowIndex;
			}else{
				var index=0;
			}
			BasemanService.openFrm("views/saleman/ma_no.html", ma_no, $scope, "", "lg")
                    .result.then(function (items) {
				var mad_ids="";
				var mad_nos="";
				for(var i=0;i<items.length;i++){
					if(i==0){
						mad_ids+=items[i].ma_id;
						mad_nos+=items[i].ma_no;
					}else{
						if(mad_ids.indexOf(items[i].ma_id)<0){
							mad_ids+=","+items[i].ma_id;
						}
						if(mad_nos.indexOf(items[i].ma_no)<0){
							mad_nos+=","+items[i].ma_no;
						}
					}
				}
				$scope.data.currItem.sale_prod_m_h_lineofsale_prod_m_headers[index].ma_id=mad_ids;
				$scope.data.currItem.sale_prod_m_h_lineofsale_prod_m_headers[index].ma_no=mad_nos;
			    $scope.options_21.api.setRowData($scope.data.currItem.sale_prod_m_h_lineofsale_prod_m_headers);		
			})
			
		}
		
		$scope.ma_no2 =function(){
			if($scope.options_21.api.getFocusedCell()){
				var index=$scope.options_21.api.getFocusedCell().rowIndex;
			}else{
				var index=0;
			}
			$scope.detail=1;
			BasemanService.openFrm("views/saleman/ma_no.html", ma_no, $scope, "", "lg")
                    .result.then(function (items) {
			})
		}
		
		$scope.ma_no1 =function(){
			if($scope.options_21.api.getFocusedCell()){
				var index=$scope.options_21.api.getFocusedCell().rowIndex;
			}else{
				var index=0;
			}
                $scope.FrmInfo = {
                    is_custom_search: true,
                    is_high: true,
                    title: "长线物料查询",
                    thead: [ {
                            name: "长线物料单号",
                            code: "ma_no",
                            show: true,
                            iscond: true,
                            type: 'string'
                        },{
                            name: "物料编码",
                            code: "item_code",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "物料描述",
                            code: "item_name",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "订单数量",
                            code: "prod_qty",
                            show: true,
                            iscond: false,
                            type: 'string'
                        }, {
                            name: "消耗数量",
                            code: "item_qty",
                            show: true,
                            iscond: false,
                            type: 'string'
                        }],
                    classid: "sale_material_apply_header",
                    postdata: {flag: 1}
                    //searchlist: ["item_h_code", "part_desc", "qty", "item_h_name", "item_code", "item_name"],
                   // sqlBlock: " pro_item_header.item_h_id=" + parseInt(data1[rowidx].item_h_id || 0)
                };
                BasemanService.open(CommonPopController, $scope)
                    .result.then(function (items) {
						$scope.data.currItem.sale_prod_m_h_lineofsale_prod_m_headers[index].ma_id=parseInt(items.ma_id);
						$scope.data.currItem.sale_prod_m_h_lineofsale_prod_m_headers[index].ma_no=(items.ma_no);
						$scope.options_21.api.setRowData($scope.data.currItem.sale_prod_m_h_lineofsale_prod_m_headers);
					})
		}
		
		$scope.delline28 =function(){
	    var data = [];
        var rowidx = $scope.options_28.api.getFocusedCell().rowIndex;
        var node = $scope.options_28.api.getModel().rootNode.childrenAfterSort;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        data.splice(rowidx, 1);
        $scope.options_28.api.setRowData(data);
		}
		
        //增加行-当前机型
        $scope.addline31 = function () {
            $scope.options_31.api.stopEditing(false);
            var data = [];
            var node = $scope.options_31.api.getModel().rootNode.allLeafChildren;
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data);
            }
            var item = {
                seq: node.length + 1
            };
            data.push(item);
            $scope.options_31.api.setRowData(data);
            $scope.data.currItem.sale_prod_m_line_partofsale_prod_m_headers = data;
        };
        //包装方案-增加行、空行
        $scope.addline43 = function () {
            var data = $scope.gridGetData("options_41");
            if ($scope.options_41.api.getFocusedCell()) {
                var index = $scope.options_41.api.getFocusedCell().rowIndex;
            } else {
                var index = 0;
            }

            $scope.FrmInfo = {
                title: "产品查询",
                is_high: true,
                thead: [
                    {
                        name: "物料编码",
                        code: "item_code",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "物料名称",
                        code: "item_name",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }],
                classid: "sale_pi_header",
                type: "checkbox",
                is_custom_search: true,
                searchlist: ["item_code", "item_name"],
                postdata: {flag: 57, item_code: data[index].item_code}
            };
            BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (data) {
                var items = $scope.gridGetData("options_43");
                for (var j = 0; j < data.length; j++) {
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].item_code == data[j].item_code && items[i].bom_level == data[j].bom_level && items[i].item_ids == data[j].po_no) {
                            break;
                        }
                    }
                    if (i == items.length) {
                        items.push(data[j]);
                    }
                }
                $scope.data.currItem.sale_prod_m_break_headerofsale_prod_m_headers[index].sale_prod_m_break_itemallofsale_prod_m_break_headers = items;
                for (var i = 0; i < $scope.data.currItem.sale_prod_m_break_headerofsale_prod_m_headers[index].sale_prod_m_break_itemallofsale_prod_m_break_headers.length; i++) {
                    $scope.data.currItem.sale_prod_m_break_headerofsale_prod_m_headers[index].sale_prod_m_break_itemallofsale_prod_m_break_headers[i].seq = (i + 1);
                    $scope.data.currItem.sale_prod_m_break_headerofsale_prod_m_headers[index].sale_prod_m_break_itemallofsale_prod_m_break_headers[i].line_id = (i + 1);
                }
                $scope.options_43.api.setRowData($scope.data.currItem.sale_prod_m_break_headerofsale_prod_m_headers[index].sale_prod_m_break_itemallofsale_prod_m_break_headers);
            });
        };
        $scope.additem43 = function () {
            $scope.options_43.api.stopEditing(false);
            var data = [];
            var node = $scope.options_43.api.getModel().rootNode.allLeafChildren;
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data);
            }
            var item = {
                seq: node.length + 1
            };
            data.push(item);
            $scope.options_43.api.setRowData(data);
            $scope.data.currItem.sale_prod_m_break_itemofsale_prod_m_headers = data;
        };
        //生成打散清单
        $scope.additemLine42 = function () {
            if ($scope.data.currItem.sale_prod_m_break_headerofsale_prod_m_headers[0].break_name == "" || $scope.data.currItem.sale_prod_m_break_headerofsale_prod_m_headers[0].break_name == undefined) {
                BasemanService.notice("请先选择打散方案！", "alert-info");
                return;
            }
            if ($scope.data.currItem.prod_id == undefined || $scope.data.currItem.prod_id == 0) {
                BasemanService.notice("请先保存单据再做选配!", "alert-warning");
                return;
            }
            var node = $scope.options_41.api.getModel().rootNode.childrenAfterSort;
            var data = $scope.options_41.api.getSelectedRows();
            
            var postdata = {
                flag: 4,
                prod_id: parseInt($scope.data.currItem.prod_id),
                prod_no: $scope.data.currItem.prod_no
            }
			if (data.length == 0) {
                postdata.prod_line_id=0;
            }else{
				postdata.prod_line_id=parseInt(data[0].prod_line_id);
			}
            BasemanService.RequestPost("sale_pi_header", "getsparebom", postdata)
                .then(function (data) {
                    BasemanService.notice("生成完成", "alert-info");
                    $scope.refresh(2);
                })
        }
        //取消红色提醒
        $scope.cancel42 = function colorRenderer(params) {
            parseInt(params.data.row_flag) == 1
            params.eGridCell.style.color = "black";
            if (params.value == undefined) {
                return ""
            } else {
                return params.value;
            }
            var data = $scope.gridGetData(options_41);
            for (var i = 0; i < data.length; i++) {
//          	    data[i].pi_id=
            }

        }
        //获取包装方案
        $scope.get43 = function () {
            if ($scope.options_41.api.getFocusedCell()) {
                var rowidx = $scope.options_41.api.getFocusedCell().rowIndex;
            } else {
                var rowidx = 0;
            }
            var node = $scope.options_41.api.getModel().rootNode.childrenAfterSort;
            var postdata = {};
            postdata.prod_id = parseInt($scope.data.currItem.prod_id);
            postdata.prod_no = parseInt($scope.data.currItem.prod_no);
//		postdata.item_code=node[rowidx].data.item_code;
            BasemanService.RequestPost("sale_prod_m_header", "matchpackage", postdata)
                .then(function (data) {
                    BasemanService.notice("获取成功", "alert-info");
                    $scope.refresh(2);
                })
        };
        //取消包装方案
        $scope.cancel43 = function () {
            var data1 = [];
            var node = $scope.options_43.api.getModel().rootNode.childrenAfterSort;
            var data = $scope.options_43.api.getSelectedRows();
            if (data.length == 0) {
                BasemanService.notice("未选中要取消的行", "alert-info");
                return;
            }
            data[0].package_name = "";
            data[0].qty = "";
            data[0].calc_qty = "";
            data[0].package_long = "";
            data[0].package_wide = "";
            data[0].package_high = "";
            data[0].item_code2 = "";
            data[0].item_desc2 = "";
            data[0].item_qty2 = "";
            data[0].package_ware = "";
            data[0].package_factory = "";
            data[0].made_type = "";
            data[0].item_type = "";
            data[0].row_type = "";
            data[0].package_qty = "";
            data[0].note = "";

            for (var i = 0; i < node.length; i++) {
                if (node[i].data.item_code != data[0].item_code) {
                    data1.push(node[i].data);
                }
            }
            data1.push(data[0]);
            var rowidx = $scope.options_41.api.getFocusedCell().rowIndex;
            $scope.data.currItem.sale_prod_m_break_headerofsale_prod_m_headers[rowidx].sale_m_break_lineofsale_m_break_headers = data1;
            $scope.options_43.api.setRowData(data1);
        };
        //计算包装方案
        $scope.compute43 = function () {
            var postdata = {};
            postdata.prod_id = $scope.data.currItem.prod_id;
            BasemanService.RequestPost("sale_prod_m_header", "calpackagefee", postdata)
                .then(function (data) {
                    BasemanService.notice("计算完成!", "alert-info");
                })
        };
        //从BOM引入单装物料
        $scope.addbom43 = function () {
            var postdata = {};
            postdata.prod_id = $scope.data.currItem.prod_id;
            BasemanService.RequestPost("sale_prod_m_header", "getbomitem", postdata)
                .then(function (data) {
                    BasemanService.notice("引入成功", "alert-info");
                })
        };
        //生成包装方案附件
        $scope.addfj43 = function () {
            //技术部也要判断
            /**if($scope.data.currItem.sale_order_type == 5||$scope.data.currItem.sale_order_type == 6){
            BasemanService.notice("请先选择打散方案！", "alert-info");
            return;
	    }*/
            var postdata = {};
            postdata.pi_h_id = $scope.data.currItem.pi_h_id;
            postdata.pi_line_id = $scope.data.currItem.pi_line_id;
			postdata.prod_id=$scope.data.currItem.prod_id;
			
            BasemanService.RequestPost("sale_prod_m_header", "createexcelbybox", postdata)
                .then(function (data) {
                    $scope.refresh(2);
                    BasemanService.notice("生成附件成功!!", "alert-info");
                })
        };
        //包装方案未获取
        $scope.add45 = function () {
            var data = [];
            var node = $scope.options_41.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < node.length; i++) {
                for (var j = 0; j < node[i].data.sale_prod_m_break_itemallofsale_prod_m_break_headers.length; j++)
                    if (node[i].data.sale_prod_m_break_itemallofsale_prod_m_break_headers[j].package_name == undefined || node[i].data.sale_prod_m_break_itemallofsale_prod_m_break_headers[j].package_name == "") {
                        data.push(node[i].data.sale_prod_m_break_itemallofsale_prod_m_break_headers[j]);
                    }
            }
            $scope.options_45.api.setRowData(data);
        };
        //查询标机BOM
        $scope.bjbom47 = function () {
            if ($scope.data.currItem.item_code == "" || $scope.data.currItem.item_code == undefined) {
                BasemanService.notice("打散方案明细未选择", "alert-info");
                return;
            }
            var postdata = {};
            postdata.item_code = $scope.data.currItem.item_code;
            BasemanService.RequestPost("sale_pi_header", "getdeploybom", postdata)
                .then(function (data) {
                    var shift = [];
                    shift[0] = {};
                    shift[0].item_code = $scope.data.currItem.item_code;
                    shift[0].folder = true;
                    shift[0].open = true;
                    shift[0].children = [];
                    //循环递归处理树状数据结构
                    shift[0].children = data.sale_pi_item_h_lineofsale_pi_headers;
                    $scope.options_47.api.setRowData(shift);
                });
        };
        //查询订单BOM
        $scope.djbom47 = function () {
            if ($scope.data.currItem.item_code == "" || $scope.data.currItem.item_code == undefined) {
                BasemanService.notice("打散方案明细未选择", "alert-info");
                return;
            }
            var postdata = {};
            postdata.item_code = $scope.data.currItem.erp_code;
            BasemanService.RequestPost("sale_pi_header", "getdeploybom", postdata)
                .then(function (data) {
                    var shift = [];
                    shift[0] = {};
                    shift[0].item_code = $scope.data.currItem.erp_code;
                    shift[0].folder = true;
                    shift[0].open = true;
                    shift[0].children = [];
                    //循环递归处理树状数据结构
                    shift[0].children = data.sale_pi_item_h_lineofsale_pi_headers;
                    $scope.options_47.api.setRowData(shift);
                });
        };
        /*********印刷件************/
            //全选
        $scope.choose = function () {
            var nodes = $scope.options_52.api.getModel().rootNode.childrenAfterSort;
            if ($scope.data.currItem.choose == 2) {

                $scope.options_52.api.selectAll();
            } else {
                $scope.options_52.api.deselectAll();
            }

        }
        //增加行
        $scope.addline52 = function () {
            $scope.FrmInfo = {
                classid: "psc_printed_part_list",
                type: "checkbox",
                postdata: {
                    list_id: $scope.data.currItem.list_id,
                    sqlBlock: "usable=2 and Invorg_Id=1100",
                }
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                var node = $scope.options_52.api.getModel().rootNode.allLeafChildren;
                if ($scope.options_51.api.getFocusedCell()) {
                    var index = $scope.options_51.api.getFocusedCell().rowIndex;
                } else {
                    var index = 0;
                }

                var data = [];
                for (var j = 0; j < node.length; j++) {
                    data.push(node[j].data);
                }
                for (var i = 0; i < result.length; i++) {
                    var tempobj = new Object();
                    tempobj.seq = node.length + 1;
                    tempobj.part_location = result[i].part_location;
                    tempobj.part_name = result[i].part_name;
                    tempobj.locationname = result[i].locationname;
                    tempobj.part_content = result[i].part_content;
                    tempobj.allow_delete = 2;

                    tempobj.std_item_desc = result[i].std_item_desc;
                    tempobj.std_item_name = result[i].std_item_name;
                    tempobj.std_item_code = result[i].std_item_code;
                    tempobj.std_draw_id = result[i].std_draw_id;
                    tempobj.std_item_id = result[i].std_item_id;
                    tempobj.list_id = result[i].list_id;
                    tempobj.part_lev = result[i].part_lev;
                    tempobj.is_screen = result[i].is_screen;
                    tempobj.screen_code = result[i].screen_code;
                    tempobj.screen_name = result[i].screen_name;
                    tempobj.screen_id = result[i].screen_id;
                    tempobj.p_item_code = result[i].p_item_code;
                    tempobj.p_item_name = result[i].p_item_name;
                    tempobj.screen_id = result[i].screen_id;
                    tempobj.p_item_code = result[i].p_item_code;
                    data.push(tempobj)
                }
                $scope.options_52.api.setRowData(data);
                //$scope.data.currItem.sale_printed_lineofsale_prod_m_headers=data;

                if ($scope.data.currItem.sale_printed_lineofsale_prod_m_headers[index].sale_printed_lineofsale_prod_m_lines == undefined) {
                    $scope.data.currItem.sale_printed_lineofsale_prod_m_headers[index].sale_printed_lineofsale_prod_m_lines = [];
                } else {
                    $scope.data.currItem.sale_printed_lineofsale_prod_m_headers[index].sale_printed_lineofsale_prod_m_lines = data;
                }
            });
        };
        //删除行
        $scope.delline52 = function () {
            var nodes = $scope.options_52.api.getModel().rootNode.childrenAfterSort;
            if ($scope.options_51.api.getFocusedCell()) {
                var index = $scope.options_51.api.getFocusedCell().rowIndex;
            } else {
                var index = 0;
            }

            var data = [];
            for (var i = 0; i < nodes.length; i++) {
                if (!nodes[i].selected || parseInt(nodes[i].data.allow_delete) == 1) {
                    data.push(nodes[i].data);
                }
            }
            $scope.options_52.api.setRowData(data);

            $scope.data.currItem.sale_printed_lineofsale_prod_m_headers[index].sale_printed_lineofsale_prod_m_lines = data;
        }
        $scope.temp_name51 = function () {
            $scope.FrmInfo = {
                classid: "psc_printed_temp_header",
                postdata: {}
            };
            var type = $scope.gridGetData("options_51")[$scope.options_51.api.getFocusedCell().rowIndex].pro_type;
            if (type == 1) {
                $scope.FrmInfo.postdata.sqlBlock = "1=1 and temp_name like '%内机%'";
            }
            if (type == 2) {
                $scope.FrmInfo.postdata.sqlBlock = "1=1 and temp_name like '%外机%'";
            }
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                var data = $scope.gridGetData("options_51");
                var index = $scope.options_51.api.getFocusedCell().rowIndex;
                data[index].temp_name = result.temp_name;
                data[index].temp_id = result.temp_id;
                $scope.options_51.api.setRowData(data);
                $scope.data.currItem.sale_printed_lineofsale_prod_m_headers = data;
                var postdata = {};
                postdata.temp_id = result.temp_id
                BasemanService.RequestPost("psc_printed_temp_header", "select", postdata)
                    .then(function (data) {
                        $scope.options_52.api.setRowData(data.psc_printed_temp_lineofpsc_printed_temp_headers);

                        var index = $scope.options_51.api.getFocusedCell().rowIndex;

                        $scope.data.currItem.sale_printed_lineofsale_prod_m_headers[index].sale_printed_lineofsale_prod_m_lines = data.psc_printed_temp_lineofpsc_printed_temp_headers;
                    });
            });
        }
        //复制清单
        $scope.addprodw1 = function () {
            $scope.FrmInfo = {
                title: "产品查询",
                is_high: true,
                thead: [
                    {
                        name: "产品编码", code: "item_code",
                        show: true, iscond: true, type: 'string'
                    }, {
                        name: "ERP编码", code: "erp_code",
                        show: true, iscond: true, type: 'string'
                    }, {
                        name: "产品名称", code: "item_name",
                        show: true, iscond: true, type: 'string'
                    }, {
                        name: "客户编码", code: "cust_code",
                        show: true, iscond: true, type: 'string'
                    }, {
                        name: "客户名称", code: "cust_name",
                        show: true, iscond: true, type: 'string'
                    }, {
                        name: "部门", code: "org_name",
                        show: true, iscond: true, type: 'string'
                    }],
                classid: "sale_prod_m_header",
                is_custom_search: true,
                searchlist: ["item_code", "erp_code", "item_name", "cust_code", "cust_name", "org_name"],
                postdata: {
                    flag: 103
                }
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                var postdata = {
                    order_weave_id: result.order_weave_id,
                    order_line_id: result.order_line_id,
                    flag: 104
                }
                BasemanService.RequestPost("sale_prod_m_header", "search", postdata)
                    .then(function (data) {
                        $scope.options_52.api.setRowData(data.sale_printed_lineofsale_prod_m_headers);
                        $scope.data.currItem.sale_printed_lineofsale_prod_m_headers = data.sale_printed_lineofsale_prod_m_headers;
                    });
            });
        };
        //复制行到
        $scope.addprodw2 = function () {
            $scope.options_52.api.stopEditing(false);
            if ($scope.options_52.api.getFocusedCell() == null) {
                BasemanService.notice("请选择要复制的行!");
                return false;
            }
            var data = $scope.gridGetData("options_52");
            var pi_line_id = "-1";
            for (i = 0; i < data.length; i++) {
                pi_line_id = data[i].pi_line_id + "," + pi_line_id;
            }
            $scope.FrmInfo = {
                title: "产品查询",
                is_high: true,
                thead: [
                    {
                        name: "机型编码",
                        code: "item_code",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "适用机型",
                        code: "item_name",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }],
                classid: "sale_prod_m_header",
                is_custom_search: true,
                searchlist: ["item_code", "item_name"],
                postdata: {
                    flag: 101,
                    prod_id: $scope.data.currItem.prod_id,
                    sqlBlock: "'1 = 1' + 'and erp_code like' + 'erp_code<>0' + 'and pi_line_id <>' + pi_line_id"
                }
            };
            BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (result) {
                var postdata = {
                    prod_id: result.prod_id,
                    prod_h_id: result.prod_h_id,
                    prod_line_id: result.prod_line_id
                }
                BasemanService.RequestPost("sale_prod_m_header", "clearCheckBox", postdata)
                    .then(function (data) {
                        $scope.options_52.api.setRowData(data.sale_printed_lineofsale_prod_m_headers);
                        $scope.data.currItem.sale_printed_lineofsale_prod_m_headers = data.sale_printed_lineofsale_prod_m_headers;
                    });
            });
        };
        //清单覆盖
        $scope.addprodw3 = function () {
            $scope.FrmInfo = {
                title: "产品查询",
                is_high: true,
                thead: [
                    {
                        name: "机型编码",
                        code: "item_code",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "适用机型",
                        code: "item_name",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }],
                classid: "sale_prod_m_header",
                is_custom_search: true,
                searchlist: ["item_code", "item_name"],
                sqlBlock: "1 = 1",
                postdata: {flag: 102}
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (items) {
                $scope.options_52.api.setRowData(items.psc_printed_part_lists);
            });
        };
        //复制行当前
        $scope.addprodw4 = function () {
            var select_row = $scope.selectGridGetData('options_52');
            if (!select_row.length) {
                BasemanService.notice("未选中行!", "alert-warning");
                return;
            }
            var msg = [];
            if (select_row.length > 1) {
                msg.push("不能选择拆分的行数大于1行");
            }
            if (msg.length > 0) {
                BasemanService.notice(msg)
                return
            }
            var datachose = select_row[0];
            BasemanService.openFrm("views/Pop_copy_Line.html", PopCopyLineController, $scope)
                .result.then(function (result) {
                    var spiltRow = new Array(result.lines);
                    for (i = 0; i < result.lines; i++) {
                        spiltRow[i] = new Object();
                        for (var name in datachose) {
                            spiltRow[i][name] = datachose[name];
                        }
                    }
                    var sumTotal = datachose.qty;
                    $scope.selectGridDelItem('options_52');//删除勾选行的数据
                    for (var i = 0; i < result.lines; i++) {
                        spiltRow[i].qty = parseInt(sumTotal);
                        $scope.gridAddItem('options_52', spiltRow[i])
                    }

                });
        };
        //覆盖到当前机型
        $scope.addprodw5 = function () {
            var data = $scope.gridGetData("options_51");
            if (data != undefined) {
                for (var i = 0; i < data.length; i++) {
                    var postdata = {};
                    data[i].pro_type != undefined ? postdata.pro_type = parseInt(data[i].pro_type) : 0;
                    data[i].pi_h_id != undefined ? postdata.pi_h_id = parseInt(data[i].pi_h_id) : 0;
                    data[i].pi_line_id != undefined ? postdata.pi_line_id = parseInt(data[i].pi_line_id) : 0;
                    data[i].pi_id != undefined ? postdata.pi_id = parseInt(data[i].pi_id) : 0;
                    data[i].prod_id != undefined ? postdata.prod_id = parseInt(data[i].prod_id) : 0;
                    data[i].prod_h_id != undefined ? postdata.pro_type = parseInt(data[i].prod_h_id) : 0;
                    data[i].prod_line_id != undefined ? postdata.pro_type = parseInt(data[i].prod_line_id) : 0;
                }
            }
            BasemanService.RequestPost("scpmenu", "select", postdata)
                .then(function (data) {
                    BasemanService.notice("操作成功!", "alert-info");
                })
        };
        //复制内容到
        $scope.addprodw6 = function () {
            $scope.options_52.api.stopEditing(false);
            if ($scope.options_52.api.getFocusedCell() == null) {
                BasemanService.notice("请选择要复制的行!");
                return false;
            }
            if ($scope.data.currItem.prod_id == undefined || $scope.data.currItem.prod_id == 0) {
                BasemanService.notice("请先保存单据再做选配!", "alert-warning");
                return;
            }
            var data = $scope.gridGetData("options_52");
            var pi_line_id = "-1";
            for (i = 0; i < data.length; i++) {
                pi_line_id = data[i].pi_line_id + "," + pi_line_id;
            }

            $scope.FrmInfo = {
                title: "产品查询",
                is_high: true,
                thead: [
                    {
                        name: "机型编码",
                        code: "item_code",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "适用机型",
                        code: "item_name",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }],
                classid: "sale_prod_m_header",
                is_custom_search: true,
                searchlist: ["item_code", "item_name"],
                postdata: {
                    flag: 101,
                    sqlBlock: "'1 = 1' + 'and erp_code like' + 'erp_code<>0' + 'and pi_line_id <>' + pi_line_id"
                }
            };
            BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (items) {
                var postdata = {
                    prod_id: result.prod_id,
                    prod_h_id: result.prod_h_id,
                    prod_line_id: result.prod_line_id
                }
                BasemanService.RequestPost("sale_prod_m_header", "clearCheckBox", postdata)
                    .then(function (data) {
                        $scope.options_52.api.setRowData(data.sale_printed_lineofsale_prod_m_headers);
                        $scope.data.currItem.sale_printed_lineofsale_prod_m_headers = data.sale_printed_lineofsale_prod_m_headers;
                    });
            });
        };
        //复制清单启动
        $scope.addprodw7 = function () {
            $scope.FrmInfo = {
                title: "产品查询",
                is_high: true,
                thead: [
                    {
                        name: "产品编码",
                        code: "item_code",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "ERP编码",
                        code: "erp_code",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "产品名称",
                        code: "item_name",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "客户编码",
                        code: "cust_code",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "客户名称",
                        code: "cust_name",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "部门",
                        code: "org_name",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }],
                classid: "sale_prod_m_header",
                is_custom_search: true,
                searchlist: ["item_code", "erp_code", "item_name", "cust_code", "cust_name", "org_name"],
                postdata: {
                    prod_id: $scope.data.currItem.prod_id,
                    flag: 1031,
                    sqBlock: "1=1"
                }
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (items) {
                var postdata = {
                    prod_id: items.prod_id,
                    prod_line_id: items.prod_line_id,
                    flag: 1041
                }
                BasemanService.RequestPost("sale_prod_m_header", "search", postdata)
                    .then(function (data) {
                        $scope.options_52.api.setRowData(data.sale_printed_lineofsale_prod_m_headers);
                        $scope.data.currItem.sale_printed_lineofsale_prod_m_headers = data.sale_printed_lineofsale_prod_m_headers;
                    });
            });
        };

        //印刷件
        $scope.addBomitem = function () {

        }

    }
    /******************弹出框区域****************************/
    {
        //跳转至PI
        $scope.buttonClick = function () {
            if ($scope.data.currItem.prod_id == undefined || $scope.data.currItem.prod_id == 0) {
                return;
            }
            localeStorageService.set("crmman.sale_pi_headerEdit", {
                pi_id: $scope.data.currItem.pi_id,
                stat: $scope.data.currItem.stat,
                flag: 3
            });
            $state.go("crmman.sale_pi_headerEdit");

        };

        //业务部门
        $scope.scporg = function () {
            if (!($scope.data.currItem.tt_type == 4 || $scope.data.currItem.tt_type == 5)) {
                BasemanService.notice("此到款类型'部门'不能选择", "alert-warning");
                return;
            }
            $scope.FrmInfo = {
                title: "地区查询",
                is_high: true,
                thead: [{
                    name: "机构编码",
                    code: "code",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "机构名称",
                    code: "orgname",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "负责人",
                    code: "manager",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "备注",
                    code: "note",
                    show: true,
                    iscond: true,
                    type: 'string'
                }],
                classid: "scporg",
                sqlBlock: "( idpath like '%1%') and 1=1 and stat =2 and OrgType = 5",
                searchlist: ["code", "orgname", "manager", "note"],
                backdatas: "orgs"
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.org_name = result.orgname;
                $scope.data.currItem.org_code = result.code;
                $scope.data.currItem.org_id = result.orgid;
            })
        };
        //客户
        $scope.customer = function () {
            if (!($scope.data.currItem.tt_type == 4 || $scope.data.currItem.tt_type == 5)) {
                BasemanService.notice("此到款类型'客户'不能选择", "alert-warning");
                return;
            }
            if ($scope.data.currItem.org_id == undefined || $scope.data.currItem.org_id == "") {
                BasemanService.notice("请先选择业务部门", "alert-warning");
                return;
            }
            $scope.FrmInfo = {
                title: "客户查询",
                is_high: true,
                thead: [
                    {
                        name: "客户编码",
                        code: "cust_code",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "SAP编码",
                        code: "sap_code",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "客户名称",
                        code: "cust_name",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "客户描述",
                        code: "cust_desc",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }],
                postdata: {
                    flag: 1
                },
                classid: "customer",
                sqlBlock: "",
                searchlist: ["cust_code", "sap_code", "cust_name", "cust_desc"],
            };
            $scope.FrmInfo.sqlBlock = " (org_id="
                + $scope.data.currItem.org_id + " or idpath like '%," + $scope.data.currItem.org_id + ",%')";
            // $scope.FrmInfo.sqlBlock = "cust_code like '%W%' and (org_id = 249 or other_org_ids like '%,249,%')";
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.cust_desc = result.cust_desc;
                $scope.data.currItem.cust_id = result.cust_id;
                $scope.data.currItem.cust_name = result.cust_name;
                $scope.data.currItem.cust_code = result.sap_code;
            })
        };
    }
    /*********************词汇值*****************************/
    {
        //状态
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
            $scope.stats = HczyCommon.stringPropToNum(data.dicts);
        });
        // 发运方式
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "ship_type"})
            .then(function (data) {
                $scope.ship_types = HczyCommon.stringPropToNum(data.dicts);
            });
        // 订单类型词汇
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "sale_order_type"})
            .then(function (data) {
                $scope.sale_types = HczyCommon.stringPropToNum(data.dicts);
            });

        BasemanService.RequestPostAjax("price_type", "search", {dictcode: "price_type"})
            .then(function (data) {
                $scope.price_types = HczyCommon.stringPropToNum(data.dicts);
            });
        //到款组织
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "scpent"})
            .then(function (data) {
                $scope.scpents = HczyCommon.stringPropToNum(data.dicts);

            });

        //贸易类型
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"})
            .then(function (data) {
                $scope.trade_types = HczyCommon.stringPropToNum(data.dicts);
            });
        //订单类型Sale_Order_Type
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "sale_order_type"})
            .then(function (data) {
                $scope.sale_ent_types = HczyCommon.stringPropToNum(data.dicts);

            });
        //配件运输方式
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "ship_transport"})
            .then(function (data) {
                $scope.ship_transports = HczyCommon.stringPropToNum(data.dicts);
            });
        //唛头使用型号
        $scope.marks_types = [
            {id: 0, name: "工厂型号"},
            {id: 1, name: "客户型号"},
        ];
        $scope.pdm_bom_stats = [
            {id: 1, name: "制单"},
            {id: 3, name: "已启动"},
            {id: 5, name: "已归档"},
        ];
        //是否
        $scope.is_prods = [
            {id: 1, name: "否"},
            {id: 2, name: "是"},
        ];
        $scope.is_no = [
            {
                id: 2,
                name: "整机下单"
            }, {
                id: 1,
                name: "裸机下单"
            }];
        $scope.have_custpos = [
            {id: 1, name: "无"},
            {id: 2, name: "有"},
        ];
        $scope.bill_types = [
            {id: 1, name: "正常订单"},
            {id: 2, name: "虚拟返包订单"},
        ];
        //客户等级
        $scope.cust_levels = [
            {id: 0, name: "S"}, {id: 1, name: "A"},
            {id: 2, name: "B"}, {id: 3, name: "C"},
            {id: 0, name: "C"}, {id: 1, name: "D"},
            {id: 2, name: "O"}, {id: 3, name: "E"}
        ];

        //网格下拉值
        // 类型 line_type
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "line_type"}).then(function (data) {
            for (var i = 0; i < data.dicts.length; i++) {
                var line_types = [];
                for (var i = 0; i < data.dicts.length; i++) {
                    line_types[i] = {
                        value: data.dicts[i].dictvalue,
                        desc: data.dicts[i].dictname
                    };
                }
                if ($scope.getIndexByField('columns_21', 'line_type')) {
                    $scope.columns_21[$scope.getIndexByField('columns_21', 'line_type')].cellEditorParams.values = line_types;
                }
            }
        })
        // 机型类别 pro_type
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pro_type"}).then(function (data) {
            for (var i = 0; i < data.dicts.length; i++) {
                var pro_types = [];
                for (var i = 0; i < data.dicts.length; i++) {
                    pro_types[i] = {
                        value: data.dicts[i].dictvalue,
                        desc: data.dicts[i].dictname
                    };
                }
                if ($scope.getIndexByField('columns_21', 'pro_type')) {
                    $scope.columns_21[$scope.getIndexByField('columns_21', 'pro_type')].cellEditorParams.values = pro_types;
                }
            }
        })

    }
    /***********************网格定义**************************/
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
			//suppressContextMenu:true,
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
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "行类型", field: "line_type", editable: false, filter: 'set', width: 85,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: []
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "品牌名", field: "brand_name", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "销售国家", field: "area_names", editable: true, filter: 'set', width: 100,
                cellEditor: "弹出框",
                action: $scope.area_names21,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },		
            {
                headerName: "产品编码", field: "item_h_code", editable: true, filter: 'set', width: 120,
                cellEditor: "弹出框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "产品名称", field: "item_h_name", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },{
                headerName: "长线物料申请单号", field: "ma_no", editable: true, filter: 'set', width: 150,
                cellEditor: "弹出框",
				action:$scope.ma_no,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: " 客户机型", field: "cust_item_name", editable: true, filter: 'set', width: 120,
                cellEditor: "文本框",
                cellchange: $scope.cust_item_name21,
                //non_empty:true,
                //cellStyle: {color: 'black', 'background-color': 'yellow'},
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },{
                headerName: "预计出货日期", field: "etd_ship_date", editable: true, filter: 'set', width: 130,
                cellEditor: "年月日",
                cellchange: $scope.etd_ship_date21,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "要求工厂交货时间", field: "deliver_date", editable: true, filter: 'set', width: 130,
                cellEditor: "年月日",
                cellchange: $scope.deliver_date21,
                //non_empty:true,
                //cellStyle: {color: 'black', 'background-color': 'yellow'},
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "生产通知时间", field: "prod_time", editable: false, filter: 'set', width: 130,
                cellEditor: "年月日",
                cellchange: $scope.prod_time21,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "工厂交期回复", field: "pre_over_time", editable: false, filter: 'set', width: 120,
                cellEditor: "年月日",
                cellchange: $scope.pre_over_time21,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "PI数量", field: "pi_qty", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                cellchange: $scope.qty21,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "已排产数量", field: "proded_qty", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "是否暂停", field: "is_pause", editable: false, filter: 'set', width: 100,
                cellEditor: "复选框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },{
                headerName: "本次排产数量", field: "prod_qty", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                cellchange: $scope.prod_qty21,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "减少/增加数量", field: "modify_qty", editable: true, filter: 'set', width: 120,
                cellEditor: "整数框",
                cellchange: $scope.modify_qty21,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },{
                headerName: "客户PO号", field: "cust_pono", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "已完工入库数量", field: "already_in_qty", editable: "false", filter: 'set', width: 130,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "已做发货通知单数量", field: "already_ship_qty", editable: false, filter: 'set', width: 150,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "已做出货预告数量", field: "warned_qty", editable: false, filter: 'set', width: 150,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "实际出库确认数量", field: "actual_out_qty", editable: false, filter: 'set', width: 150,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "压机到厂时间", field: "comp_time", editable: true, filter: 'set', width: 100,
                cellEditor: "年月日",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];
        //交期拆分
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
            rowClicked: undefined,
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
                headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                checkboxSelection: function (params) {
                    return params.columnApi.getRowGroupColumns().length === 0;
                },
            }, {
                headerName: "行类型", field: "line_type", editable: false, filter: 'set', width: 85,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: []
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "品牌名", field: "brand_name", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "产品编码", field: "item_h_code", editable: true, filter: 'set', width: 120,
                cellEditor: "弹出框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "产品名称", field: "item_h_name", editable: false, filter: 'set', width: 130,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: " 客户机型", field: "cust_item_name", editable: true, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
			{
                headerName: "预计出货日期", field: "etd_ship_date", editable: true, filter: 'set', width: 120,
                cellEditor: "年月日",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "要求交货时间", field: "deliver_date", editable: true, filter: 'set', width: 120,
                cellEditor: "年月日",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "生产通知时间", field: "prod_time", editable: false, filter: 'set', width: 120,
                cellEditor: "年月日",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "工厂交期回复", field: "pre_over_time", editable: false, filter: 'set', width: 120,
                cellEditor: "年月日",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "PI数量", field: "pi_qty", editable: false, filter: 'set', width: 100,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "已排产数量", field: "proded_qty", editable: false, filter: 'set', width: 110,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "本次排产数量", field: "prod_qty", editable: false, filter: 'set', width: 120,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
			{
                headerName: "减少/增加数量", field: "modify_qty", editable: true, filter: 'set', width: 120,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "客户PO号", field: "cust_pono", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "已完工入库数量", field: "already_in_qty", editable: "false", filter: 'set', width: 100,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "已做发货通知单数量", field: "already_ship_qty", editable: false, filter: 'set', width: 160,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "已做出货预告数量", field: "warned_qty", editable: false, filter: 'set', width: 140,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "实际出库确认数量", field: "actual_out_qty", editable: false, filter: 'set', width: 140,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "压机到厂时间", field: "comp_time", editable: false, filter: 'set', width: 130,
                cellEditor: "年月日",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];
        //分体机
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
            rowClicked: $scope.rowClicked22,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            groupColumnDef: groupColumn,
			fixedGridHeight:true,
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
                headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "机型类别", field: "pro_type", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: []
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "产品编码", field: "item_code", editable: true, filter: 'set', width: 130,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "产品名称", field: "item_name", editable: false, filter: 'set', width: 130,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "散件类型", field: "sj_type", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [{
                        value: 6,
                        desc: "SKD"
                    }, {
                        value: 7,
                        desc: "CKD"
                    }, {
                        value: 8,
                        desc: "不打散"
                    }]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "客户机型", field: "cust_item_name", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "客户产品名称", field: "cust_spec", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "ERP产品编码", field: "erp_code", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "要求交货时间", field: "deliver_date", editable: true, filter: 'set', width: 130,
                cellEditor: "年月日",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "返单机型ERP编码", field: "erp_code_f", editable: false, filter: 'set', width: 130,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "PI数量", field: "pi_qty", editable: false, filter: 'set', width: 100,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "已排产数量", field: "proded_qty", editable: false, filter: 'set', width: 110,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "本次排产数量", field: "prod_qty", editable: false, filter: 'set', width: 110,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },{
                headerName: "减少/增加数量", field: "modify_qty", editable: false, filter: 'set', width: 120,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "返包数量", field: "redo_qty", editable: false, filter: 'set', width: 100,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "全新生产数量", field: "new_qty", editable: false, filter: 'set', width: 120,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "已做发货通知单数量", field: "already_ship_qty", editable: false, filter: 'set', width: 150,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "已做出货预告数量", field: "warned_qty", editable: false, filter: 'set', width: 150,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "实际出库确认数量", field: "actual_out_qty", editable: false, filter: 'set', width: 150,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "箱数", field: "pack_style", editable: true, filter: 'set', width: 100,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "体积", field: "pack_rule", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "毛重", field: "unit_gw", editable: true, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "净重", field: "unit_nw", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "工厂订单号", field: "fac_order_no", editable: false, filter: 'set', width: 100,
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
            }, {
                headerName: "SAP订单号", field: "sap_no", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "原erp编码", field: "old_erp_code", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];
        //配件清单
        $scope.options_24 = {
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
            rowClicked: $scope.rowClicked24,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            groupColumnDef: groupColumn,
            showToolPanel: false,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_24.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
        $scope.columns_24 = [
            {
                headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "整机编码", field: "item_h_code", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "整机名称", field: "item_h_name", editable: true, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "分体机编码", field: "item_code", editable: false, filter: 'set', width: 130,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "分体机名称", field: "item_name", editable: true, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "客户型号", field: "cust_item_name", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "分类", field: "part_class", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "描述", field: "part_desc", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "ERP编码", field: "erp_code", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "参考批次", field: "note", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "需求数量", field: "require_qty", editable: false, filter: 'set', width: 100,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "已生产数量", field: "pproded_qty", editable: false, filter: 'set', width: 100,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "本次生产数量", field: "pprod_qty", editable: true, filter: 'set', width: 110,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "销售价格", field: "psale_price", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "成本价", field: "price", editable: "price", filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "金额", field: "amt", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "英文名", field: "part_en_name", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];
        //配件打包
        $scope.options_25 = {
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
            rowClicked: undefined,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            groupColumnDef: groupColumn,
            showToolPanel: false,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_25.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
        $scope.columns_25 = [
            {
                headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "整机编码", field: "item_h_code", editable: false, filter: 'set', width: 130,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "整机名称", field: "item_h_name", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "箱数", field: "pack_qty", editable: true, filter: 'set', width: 100,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "已做出货预告箱数", field: "already_warned_qty", editable: false, filter: 'set', width: 150,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "已做发货通知箱数", field: "already_ship_qty", editable: false, filter: 'set', width: 150,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "备注", field: "note", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "单价", field: "price", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "金额", field: "amt", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];
        //订单拆分信息
        $scope.options_26 = {
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
            rowClicked: undefined,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            groupColumnDef: groupColumn,
            showToolPanel: false,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_26.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
        $scope.columns_26 = [
            {
                headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "基础批次号", field: "base_inspection_batchno", editable: false, filter: 'set', width: 140,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "基础ERP编码", field: "base_erp_code", editable: false, filter: 'set', width: 140,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "拆分批次号", field: "from_inspection_batchno", editable: false, filter: 'set', width: 140,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "拆分ERP编码", field: "from_erp_code", editable: false, filter: 'set', width: 140,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "生产数量", field: "from_qty", editable: false, filter: 'set', width: 100,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];
        //机型面板
        $scope.options_27 = {
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
            rowClicked: undefined,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            groupColumnDef: groupColumn,
            showToolPanel: false,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_27.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
        $scope.columns_27 = [
            {
                headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "整机编码", field: "item_h_code", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "客户型号", field: "cust_item_name", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "机型类型", field: "item_type", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "面板款式", field: "mb_style", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "面板颜色", field: "mb_color", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "装饰条颜色", field: "mb_article", editable: true, filter: 'set', width: 110,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];
			
		//长线物料消耗库存
        $scope.options_28 = {
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
            rowClicked: undefined,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            groupColumnDef: groupColumn,
            showToolPanel: false,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_28.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
		$scope.columns_28 = [
            {
                headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
			{
                headerName: "生产单号", field: "prod_no", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
			{
                headerName: "标机编码", field: "item_h_code", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
			{
                headerName: "标机名称", field: "item_h_name", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
			{
                headerName: "长线物料申请单号", field: "ma_no", editable: false, filter: 'set', width: 200,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
			{
                headerName: "长线物料申请单行号", field: "ma_seq", editable: false, filter: 'set', width: 200,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
			{
                headerName: "物料编码", field: "item_code", editable: false, filter: 'set', width: 200,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
			{
                headerName: "物料描述", field: "item_name", editable: false, filter: 'set', width: 200,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
			{
                headerName: "订单数量", field: "prod_qty", editable: false, filter: 'set', width: 100,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
			{
                headerName: "BOM数量", field: "bom_qty", editable: false, filter: 'set', width: 100,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
			{
                headerName: "消耗数量", field: "item_qty", editable: false, filter: 'set', width: 100,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
        /************产品配置要求*****************/
            //当前机型
        $scope.options_31 = {
            rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
            pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
            groupHideGroupColumns: false,
            enableColResize: true, //one of [true, false]
            enableSorting: true, //one of [true, false]
            enableFilter: true, //one of [true, false]
            enableStatusBar: false,
            enableRangeSelection: false,
            rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
            rowDeselection: false,
            quickFilterText: null,
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
        $scope.columns_31 = [
            {
                headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "配置项名称", field: "conf_name", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "可选项名称", field: "option_name", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "是否标配", field: "is_default", editable: false, filter: 'set', width: 100,
                cellEditor: "复选框",
                checkbox_value: 1,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "是否特殊项", field: "is_special", editable: false, filter: 'set', width: 100,
                cellEditor: "复选框",
                checkbox_value: 2,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "方案号", field: "file_no", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "方案名称", field: "file_name", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "价差", field: "diff_price", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "选配信息", field: "defs", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "备注", field: "note", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];
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
            rowClicked: undefined,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
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
                headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "配置项名称", field: "conf_name", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "可选项名称", field: "option_name", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "是否标配", field: "is_default", editable: false, filter: 'set', width: 100,
                cellEditor: "复选框",
                checkbox_value: 1,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "是否特殊项", field: "is_special", editable: false, filter: 'set', width: 100,
                cellEditor: "复选框",
                checkbox_value: 2,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "方案号", field: "file_no", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "方案名称", field: "file_name", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "客户机型", field: "cust_item_name", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "机型编码", field: "item_code", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }
            , {
                headerName: "机型名称", field: "item_name", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "价差", field: "diff_price", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "备注", field: "note", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];
        /************包装方案*****************/
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
			selectAll:true,
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
                headerName: "散件类型", field: "sj_type", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellRenderer: function (params) {
                    return colorRenderer(params)
                },
                cellEditorParams: {
                    values: [{
                        value: 6,
                        desc: "SKD"
                    }, {
                        value: 7,
                        desc: "CKD"
                    }, {
                        value: 8,
                        desc: "不打散"
                    }]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "打散方案", field: "break_name", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "ERP编码", field: "erp_code", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "机型编码", field: "item_code", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "适用机型", field: "item_name", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "订单数量", field: "qty", editable: false, filter: 'set', width: 100,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "是否重新生成", field: "bom_stat", editable: false, filter: 'set', width: 120,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [{
                        value: 5,
                        desc: "是"
                    }]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "从BOM引入单装物料", field: "bom_stat2", editable: false, filter: 'set', width: 150,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [{
                        value: 0,
                        desc: "未引入"
                    }, {
                        value: 5,
                        desc: "已引入"
                    }
                    ]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "返单机型ERP编码", field: "erp_code_f", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];
        //打散方案明细
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
            rowClicked: undefined,
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
        function colorRenderer(params) {
            if (parseInt(params.data.row_flag) == 2) {
                params.eGridCell.style.color = "red";
            }
            if (params.value == undefined) {
                return ""
            } else {
                return params.value;
            }
        }

        $scope.columns_42 = [
            {
                headerName: '序号',
                field: 'line_id',
                width: 70,
                editable: true,
                enableRowGroup: true,
                cellRenderer: function (params) {
                    return colorRenderer(params)
                },
                icons: {
                    sortAscending: '<i class="fa fa-sort-alpha-asc"/>',
                    sortDescending: '<i class="fa fa-sort-alpha-desc"/>'
                }
            }, {
                headerName: "父项序号", field: "p_seq", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                cellRenderer: function (params) {
                    return colorRenderer(params)
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "编码前缀", field: "item_code", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                cellRenderer: function (params) {
                    return colorRenderer(params)
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "物料描述包含", field: "item_name", editable: false, filter: 'set', width: 130,
                cellEditor: "文本框",
                cellRenderer: function (params) {
                    return colorRenderer(params)
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "物料描述不包含", field: "item_name2", editable: false, filter: 'set', width: 130,
                cellEditor: "文本框",
                cellRenderer: function (params) {
                    return colorRenderer(params)
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "包装方式", field: "pack_name", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                cellRenderer: function (params) {
                    return colorRenderer(params)
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "备注", field: "note", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                cellRenderer: function (params) {
                    return colorRenderer(params)
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];
        //包装方案
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
            rowDoubleClicked: $scope.rowDoubleClicked43,
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
                headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
                checkboxSelection: function (params) {
                    return params.columnApi.getRowGroupColumns().length === 0;
                },
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "Bom层次", field: "bom_level", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "BOM路径", field: "item_ids", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "方案类型", field: "ptype_name", editable: true, filter: 'set', width: 100,
                cellEditor: "弹出框",
                action: $scope.ptype_name43,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "物料编码", field: "item_code", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "物料描述", field: "item_name", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },{
                headerName: "包装方案名称", field: "package_name", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "物料客户编码", field: "item_cust_code", editable: true, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "物料英文表述", field: "item_cust_desc", editable: true, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "客户PO号", field: "pocustno", editable: true, filter: 'set', width: 100,
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
            }, {
                headerName: "单台用量(PC)", field: "item_qty", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            
            {
                headerName: "原包装数量", field: "qty", editable: false, filter: 'set', width: 110,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "原包装用量", field: "calc_qty", editable: true, filter: 'set', width: 110,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "打散方式", field: "pack_name", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [{
                        value: 1,
                        desc: "单独打包"
                    }, {
                        value: 2,
                        desc: "下层打包"
                    }, {
                        value: 3,
                        desc: "删除"
                    }]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "长", field: "package_long", editable: false, filter: 'set', width: 60,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "宽", field: "package_wide", editable: false, filter: 'set', width: 60,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "高", field: "package_high", editable: false, filter: 'set', width: 60,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "包辅物料", field: "item_code2", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "包辅物料描述", field: "item_desc2", editable: true, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "包辅用量", field: "item_qty2", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "包装方式", field: "package_desc", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "BOM包类型", field: "package_ware", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [{
                        value: 1,
                        desc: "电子"
                    }, {
                        value: 2,
                        desc: "总装"
                    }]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "包装工厂", field: "package_factory", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [
                        {
                            value: 1,
                            desc: "塑胶"
                        }, {
                            value: 2,
                            desc: "电子"
                        }, {
                            value: 3,
                            desc: "总装"
                        }, {
                            value: 4,
                            desc: "两器"
                        }, {
                            value: 5,
                            desc: "钣金"
                        }]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "生产类型", field: "made_type", editable: true, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [
                        {
                            value: 1,
                            desc: "外购件"
                        }, {
                            value: 2,
                            desc: "自制件"
                        }]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "包辅料所需用量", field: "package_qty", editable: true, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "所属箱型", field: "item_type", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [{
                        value: 1,
                        desc: "內箱包辅料"
                    }, {
                        value: 2,
                        desc: "外箱包辅料"
                    }, {
                        value: 3,
                        desc: "零部件"
                    }]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "所属类型", field: "row_type", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [
                        {
                            value: 1,
                            desc: "包辅料"
                        }, {
                            value: 2,
                            desc: "包装箱"
                        }]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];
        //辅料用量汇总
        $scope.options_44 = {
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
            rowClicked: undefined,
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
                headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "包装分厂", field: "package_ware", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [{
                        value: 1,
                        desc: "塑胶"
                    }, {
                        value: 2,
                        desc: "电子"
                    }, {
                        value: 3,
                        desc: "总装"
                    }, {
                        value: 4,
                        desc: "两器"
                    }, {
                        value: 5,
                        desc: "钣金"
                    }
                    ]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "包辅料编码", field: "item_code2", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "包辅料描述", field: "item_desc2", editable: true, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "订单数量", field: "order_qty", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "包辅料所需用量", field: "package_qty", editable: true, filter: 'set', width: 130,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "包辅料实际用量", field: "actual_qty", editable: false, filter: 'set', width: 130,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "包装箱单位体积", field: "package_tj", editable: true, filter: 'set', width: 130,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "所属类型", field: "row_type", editable: true, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [{
                        value: 1,
                        desc: "包辅料"
                    }, {
                        value: 2,
                        desc: "包装箱"
                    }]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "所属箱型", field: "item_type", editable: true, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [{
                        value: 1,
                        desc: "內箱包辅料"
                    }, {
                        value: 2,
                        desc: "外箱包辅料"
                    }]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "合并序号", field: "union_seq", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "辅料成本(CNY)", field: "price", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];
        //包装方案（未维护）
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
            rowClicked: undefined,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
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
                headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "Bom层次", field: "bom_level", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "BOM路径", field: "item_ids", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "方案类型", field: "ptype_name", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "物料编码", field: "item_code", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "物料描述", field: "item_name", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "包装方案名称", field: "package_name", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "物料客户编码", field: "item_cust_code", editable: true, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "物料英文表述", field: "item_cust_desc", editable: true, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "客户PO号", field: "pocustno", editable: true, filter: 'set', width: 100,
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
            }, {
                headerName: "单台用量(PC)", field: "item_qty", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
           
            {
                headerName: "原包装数量", field: "qty", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "原包装用量", field: "calc_qty", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "打散方式", field: "pack_name", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [{
                        value: 1,
                        desc: "单独打包"
                    }, {
                        value: 2,
                        desc: "下层打包"
                    }, {
                        value: 3,
                        desc: "删除"
                    }]
                },
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
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "高", field: "package_high", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "包辅物料", field: "item_code2", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "包辅物料描述", field: "item_desc2", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "包辅用量", field: "item_qty2", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "包装方式", field: "package_desc", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "BOM包类型", field: "package_ware", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [{
                        value: 1,
                        desc: "电子"
                    }, {
                        value: 2,
                        desc: "总装"
                    }]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "包装工厂", field: "package_factory", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [
                        {
                            value: 1,
                            desc: "塑胶"
                        }, {
                            value: 2,
                            desc: "电子"
                        }, {
                            value: 3,
                            desc: "总装"
                        }, {
                            value: 4,
                            desc: "两器"
                        }, {
                            value: 5,
                            desc: "钣金"
                        }]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "生产类型", field: "made_type", editable: true, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [
                        {
                            value: 1,
                            desc: "外购件"
                        }, {
                            value: 2,
                            desc: "自制件"
                        }]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "包辅料所需用量", field: "package_qty", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "所属箱型", field: "item_type", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [{
                        value: 1,
                        desc: "內箱包辅料"
                    }, {
                        value: 2,
                        desc: "外箱包辅料"
                    }, {
                        value: 3,
                        desc: "零部件"
                    }]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "所属类型", field: "row_type", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [
                        {
                            value: 1,
                            desc: "包辅料"
                        }, {
                            value: 2,
                            desc: "包装箱"
                        }]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];
        //替换明细
        $scope.options_46 = {
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
            rowClicked: undefined,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            groupColumnDef: groupColumn,
            showToolPanel: false,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_46.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
        $scope.columns_46 = [
            {
                headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "基准物料编码", field: "bs_item_code", editable: false, filter: 'set', width: 130,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "基准物料名称", field: "bs_item_name", editable: true, filter: 'set', width: 130,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "基准物料描述", field: "bs_item_desc", editable: false, filter: 'set', width: 130,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "基准物料数量", field: "bs_item_qty", editable: true, filter: 'set', width: 130,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "操作", field: "operate", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [{
                        value: 1,
                        desc: "新增"
                    }, {
                        value: 2,
                        desc: "替换"
                    }, {
                        value: 3,
                        desc: "删除"
                    }, {
                        value: 4,
                        desc: "修改"
                    }]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "订单物料编码", field: "as_item_code", editable: true, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "订单物料名称", field: "as_item_name", editable: true, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "订单物料描述", field: "as_item_desc", editable: true, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "订单物料数量", field: "as_item_qty", editable: true, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];
        //BOM清单
        $scope.options_47 = {
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
        $scope.columns_47 = [
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
            }];
        /******************印刷件清单*********/
            //印刷件
        $scope.options_51 = {
            rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
            pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
            groupKeys: undefined,
            groupHideGroupColumns: false,
            enableColResize: true, //one of [true, false]
            enableSorting: true, //one of [true, false]
            enableFilter: true, //one of [true, false]
            enableStatusBar: false,
            enableRangeSelection: false,
            rowClicked: $scope.rowClicked51,
            rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
            rowDeselection: false,
            quickFilterText: null,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            groupColumnDef: groupColumn,
            showToolPanel: false,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_51.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
        $scope.columns_51 = [
            {
                headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "机型类别", field: "pro_type", editable: false, filter: 'set', width: 120,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [{
                        value: 1,
                        desc: "整机"
                    }, {
                        value: 2,
                        desc: "内机"
                    }, {
                        value: 3,
                        desc: "外机"
                    }, {
                        value: 4,
                        desc: "配件"
                    }]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "客户机型", field: "cust_item_name", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "ERP产品编码", field: "erp_code", editable: false, filter: 'set', width: 130,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "产品编码", field: "item_code", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "产品名称", field: "item_name", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "印刷品模板", field: "temp_name", editable: true, filter: 'set', width: 100,
                cellEditor: "弹出框",
                action: $scope.temp_name51,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "返单机型ERP编码", field: "erp_code_f", editable: true, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }
        ];
        $scope.options_52 = {
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
            rowClicked: undefined,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            groupColumnDef: groupColumn,
            showToolPanel: false,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_52.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
        $scope.columns_52 = [
            {
                headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                checkboxSelection: function (params) {
                    return params.columnApi.getRowGroupColumns().length === 0;
                },
            },{
                headerName: "印刷件名称", field: "part_name", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "数量", field: "qty", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "材质", field: "material", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },  {
                headerName: "位置", field: "part_location", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: []
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "印刷要求内容", field: "part_content", editable: true, filter: 'set', width: 200,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },{
                headerName: "备注", field: "note", editable: true, filter: 'set', width: 200,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "提醒颜色", field: "color", editable: true, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [
                        {value: 0, desc: "蓝色"},
                        {value: 1, desc: "红色"},
                        {value: 2, desc: "黑色"},
                        {value: 3, desc: "绿色"},
                    ]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "允许删除", field: "allow_delete", editable: false, filter: 'set', width: 100,
                cellEditor: "复选框",
                checkbox_value: 2,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];
        //图纸文件和异常提醒
        $scope.options_53 = {
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
            rowClicked: undefined,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            groupColumnDef: groupColumn,
            showToolPanel: false,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_53.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
        $scope.columns_53 = [
            {
                headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "异常库编码", field: "ex_code", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "提醒信息", field: "point_message", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "国家", field: "area_name", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "客户名称", field: "cust_name", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "工厂型号", field: "product_model_no", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "商标", field: "logo", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "备注", field: "note", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "机型编码", field: "item_code", editable: true, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }
            , {
                headerName: "机型名称", field: "item_name", editable: true, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "价差", field: "diff_price", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "备注", field: "note", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];
        /*******************印刷件清单汇总**********/
        $scope.options_61 = {
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
            rowClicked: undefined,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            groupColumnDef: groupColumn,
            showToolPanel: false,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_61.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
        $scope.columns_61 = [
            {
                headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },{
                headerName: "印刷件名称", field: "part_name", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },{
                headerName: "数量", field: "qty", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "材质", field: "material", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },  {
                headerName: "位置", field: "part_location", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: []
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "印刷要求内容", field: "part_content", editable: false, filter: 'set', width: 200,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },{
                headerName: "备注", field: "note", editable: false, filter: 'set', width: 200,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "机型类别", field: "pro_type", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [{
                        value: 1,
                        desc: "整机"
                    }, {
                        value: 2,
                        desc: "内机"
                    }, {
                        value: 3,
                        desc: "外机"
                    }, {
                        value: 4,
                        desc: "配件"
                    }]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "客户机型", field: "cust_item_name", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },{
                headerName: "提醒颜色", field: "color", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [
                        {value: 0, desc: "蓝色"},
                        {value: 1, desc: "红色"},
                        {value: 2, desc: "黑色"},
                        {value: 3, desc: "绿色"},
                    ]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "允许删除", field: "allow_delete", editable: false, filter: 'set', width: 100,
                cellEditor: "复选框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }
        ];
    }
    /*********************权限*******************************/
    if (window.userbean) {
        $scope.userbean = window.userbean;
    }
    //用户权限
    $scope.user_auth = {
        //知否有区域总监权限
        area_auth: false
    };
    //业务员,区总,系总,财务,事总
    var mystring = $scope.userbean.stringofrole;
    $scope.user_auth.saleman_auth = mystring.indexOf("销售人员") > -1 ? true : false;
    $scope.user_auth.areamanager_auth = mystring.indexOf("大区总监") > -1 ? true : false;
    $scope.user_auth.system_auth = mystring.indexOf("外总") > -1 ? true : false;
    $scope.user_auth.departmen_auth = mystring.indexOf("事总") > -1 ? true : false;
    $scope.user_auth.infance_auth = mystring.indexOf("财务部") > -1 ? true : false;
    $scope.user_auth.admin_auth = mystring.indexOf("admin") > -1 ? true : false;
    $scope.printed_item = "";
    $scope.printed_line = [];
    //提交
    $scope.wfstart_before = function () {
        //校验
        var msg = [];
		var errorlist=[];
        var data = $scope.data.currItem.sale_prod_m_line_partofsale_prod_m_headers;
        /**if (data == undefined) {
            BasemanService.notice("参考批次为空");
            return;
        }*/
        for (var i = 0; i < data.length; i++) {
            var seq = i + 1;
            if (data[i].note == undefined || data[i].note == "") {
                msg.push("配件清单第" + seq + "行参考批次为空");
            }
        }
        if (msg.length > 0) {
            BasemanService.notice(msg);
            return;
        }
	    if ((parseInt($scope.data.currItem.sale_order_type) == 5 || parseInt($scope.data.currItem.sale_order_type) == 6) && ($scope.data.currItem.have_custpo == "" || $scope.data.currItem.have_custpo == undefined)) {
            BasemanService.notice("散件订单有无客户po号必填", "alert-warning");
            return;
        }
		if(parseInt($scope.data.currItem.is_cndk)==2){
			if($scope.data.currItem.amt_date==undefined||$scope.data.currItem.amt_date==""){
			BasemanService.notice("承诺15天回订金已勾选，承诺订金到达日期为空", "alert-warning");
            return;	
			}
		}
        /**for (var i = 0; i < $scope.data.currItem.sale_prod_m_break_headerofsale_prod_m_headers.length; i++) {
            for (var j = 0; j < $scope.data.currItem.sale_prod_m_break_headerofsale_prod_m_headers[i].sale_bill_break_itemofsale_prod_m_break_headers.length; j++) {
                for(name in $scope.data.currItem.sale_prod_m_break_headerofsale_prod_m_headers[i].sale_bill_break_itemofsale_prod_m_break_headers[j]){
					if(name!="item_cust_code"&&name!="item_cust_desc"&&name!="pocustno"){
						if($scope.data.currItem.sale_prod_m_break_headerofsale_prod_m_headers[i].sale_bill_break_itemofsale_prod_m_break_headers[j][name]==""){
							BasemanService.notice("包装方案明细除物料客户编码，物料英文描述，客户PO号外其它列不为空");
                            return;
						}
					}
				}
            }
        }*/
        var obj = BasemanService.RequestPost("sale_prod_m_header", "cimmitcheck", {prod_id: $scope.data.currItem.prod_id,prod_m_id: $scope.data.currItem.prod_m_id})
        return obj;

    };



    /*********************导出Excle************************/
    $scope.exportJY1 = function () {
        if (!$scope.data.currItem.prod_m_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        BasemanService.RequestPost("sale_prod_m_header", "exporttoexceljy1", {'prod_m_id': $scope.data.currItem.prod_m_id})
            .then(function (data) {
                if (data.docid != undefined && Number(data.docid) != 0) {
                    var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                    window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                } else {
                    BasemanService.notice("导出失败!", "alert-info");
                }
            });
    }

    $scope.exportJY3 = function () {
        if (!$scope.data.currItem.prod_m_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        BasemanService.RequestPost("sale_prod_m_header", "exporttoexceljy3", {'prod_m_id': $scope.data.currItem.prod_m_id})
            .then(function (data) {
                if (data.docid != undefined && Number(data.docid) != 0) {
                    var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                    window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                } else {
                    BasemanService.notice("导出失败!", "alert-info");
                }
            });
    }
    $scope.exportJY4 = function () {
        if (!$scope.data.currItem.prod_m_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        BasemanService.RequestPost("sale_prod_m_header", "exporttoexceljy4", {'prod_m_id': $scope.data.currItem.prod_m_id})
            .then(function (data) {
                if (data.docid != undefined && Number(data.docid) != 0) {
                    var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                    window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                } else {
                    BasemanService.notice("导出失败!", "alert-info");
                }
            });
    }
    /*********************保存校验区域************************/
    $scope.validate = function () {
		if(parseInt($scope.data.currItem.sale_order_type)==2){
			if($scope.data.currItem.marks_type==""||$scope.data.currItem.part_transtype==""||$scope.data.currItem.is_khzd==""||$scope.data.currItem.marks_type==undefined||$scope.data.currItem.part_transtype==undefined||$scope.data.currItem.is_khzd==undefined){
				BasemanService.notice("外销配件订单唛头使用型号,配件运输方式,客户指定配件不能为空", "alert-warning");
                return;
			}
		}
        var errorlist = [];
        var data = $scope.data.currItem.sale_prod_m_h_lineofsale_prod_m_headers;
        for (var i = 0; i < data.length; i++) {
            if (data[i].deliver_date == undefined || data[i].deliver_date == "") {
                BasemanService.notice("订单明细第" + (i + 1) + "行要求交货时间为空", "alert-warning");
                return;
            }
			if(data[i].etd_ship_date<data[i].deliver_date){
				BasemanService.notice("订单明细第" + (i + 1) + "行预计出货日期小于要求交货时间", "alert-warning");
                return;
			}
            var sum = 0, sum2 = 0;
            for (var j = 0; j < data[i].sale_prod_m_h_detlofsale_prod_m_h_lines.length; j++) {
                sum += parseInt(data[i].sale_prod_m_h_detlofsale_prod_m_h_lines[j].pi_qty);
                sum2 += parseInt(data[i].sale_prod_m_h_detlofsale_prod_m_h_lines[j].prod_qty||0);
            }
            /**if (parseInt(data[i].pi_qty) != sum) {
                BasemanService.notice("订单明细第" + (i + 1) + "行与交期拆分pi数量总和不一致", "alert-warning");
                return;
            }*/
            if (parseInt(data[i].prod_qty||0) != sum2) {
                BasemanService.notice("订单明细第" + (i + 1) + "行与交期拆分本次排产数量总和不一致", "alert-warning");
                return;
            }
        }
		if($scope.data.currItem.cust_cause==""||$scope.data.currItem.cust_cause==undefined||$scope.data.currItem.cust_cause==1){
			if($scope.data.currItem.factory_cause==""||$scope.data.currItem.factory_cause==undefined||$scope.data.currItem.factory_cause==1){
				BasemanService.notice("客户原因和工厂原因都为空", "alert-warning");
                return;
			}
		}
       
        return true;
    }
    $scope.save_before = function () {
        delete $scope.data.currItem[""];
        var data = $scope.gridGetData("options_21");
        for (var i = 0; i < data.length; i++) {
            if (parseInt(data[i].line_type) == 4) {
                var data1 = [];

                data1.push(data[i]);
                data1[0].seq = 1;
                $scope.data.currItem.sale_prod_m_packageofsale_prod_m_headers = data1;
            }
        }
        var postdata = $scope.data.currItem;
        if ($scope.data.currItem.stat > 1) {
			postdata.sale_prod_m_break_itemallofsale_prod_m_headers=[];
			postdata.sale_prod_m_h_detlofsale_prod_m_headers=[];
		    for(var i=0;i<postdata.sale_prod_m_break_headerofsale_prod_m_headers.length;i++){
				for(var j=0;j<postdata.sale_prod_m_break_headerofsale_prod_m_headers[i].sale_prod_m_break_itemallofsale_prod_m_break_headers.length;j++){
				postdata.sale_prod_m_break_itemallofsale_prod_m_headers.push(postdata.sale_prod_m_break_headerofsale_prod_m_headers[i].sale_prod_m_break_itemallofsale_prod_m_break_headers[j]);
				}
			}
			
			for(var i=0;i<postdata.sale_prod_m_h_lineofsale_prod_m_headers.length;i++){
				for(var j=0;j<postdata.sale_prod_m_h_lineofsale_prod_m_headers[i].sale_prod_m_h_detlofsale_prod_m_h_lines.length;j++){
				postdata.sale_prod_m_h_detlofsale_prod_m_headers.push(postdata.sale_prod_m_h_lineofsale_prod_m_headers[i].sale_prod_m_h_detlofsale_prod_m_h_lines[j]);
				}
			}
            postdata.flag = 2;
        } else {
            postdata.flag = 0
        }

        for (var i = 0; i < $scope.data.currItem.sale_prod_m_line_confofsale_prod_m_headers.length; i++) {
            $scope.data.currItem.sale_prod_m_line_confofsale_prod_m_headers[i].seq = parseInt(i + 1);
        }
        for (var i = 0; i < $scope.data.currItem.sale_prod_m_line_conf2ofsale_prod_m_headers.length; i++) {
            $scope.data.currItem.sale_prod_m_line_conf2ofsale_prod_m_headers[i].seq = parseInt(i + 1);
        }
    };
    /*********************界面初始化************************/
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            stat: 1,
            creator: window.userbean.userid,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            bill_type: 1,
            is_into_amt: 1,
            is_yin: 2,
            amt_deduct: 0,
            fact_amt: 0,
            return_ent_type: 1,
            tt_type: 1,
            funds_type: 1,
            confirm_stat: 1,
            is_stand_stat: 2,
            sale_order_type: 1,
            bill_type: 1
        };
    };
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('sale_prod_m_headerEdit', sale_prod_m_headerEdit);
