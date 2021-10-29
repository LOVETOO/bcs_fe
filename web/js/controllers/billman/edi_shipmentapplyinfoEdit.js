var billmanControllers = angular.module('inspinia');
function edi_shipmentapplyinfoEdit($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService,notify) {
    //继承基类方法
    edi_shipmentapplyinfoEdit = HczyCommon.extend(edi_shipmentapplyinfoEdit, ctrl_bill_public);
    edi_shipmentapplyinfoEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "edi_shipmentapplyinfo",
        key:"corpserialid",
        wftempid:10147,
        FrmInfo: {},
		grids:[]
    };

    /************************初始化页面***********************/
	var myDate= new Date();
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            stat: 1,			
            create_time:myDate.toLocaleDateString(),
			code10: "8415101000",
			goodsname1: "独立窗式或壁式空气调节器",
			goodsname: "独立窗式或壁式空气调节器",
			payername: "宁波奥克斯进出口有限公司"
        };
    };
    /**---------------------初始化页面----------------------*/
    /***********************保存校验区域*********************/
    $scope.validate = function () {
        var errorlist = [];
        $scope.data.currItem.buyerno == undefined ? errorlist.push("买方代码为空") : 0;
        $scope.data.currItem.buyerengname == undefined ? errorlist.push("买方名称为空") : 0;
        $scope.data.currItem.cust_code == undefined ? errorlist.push("客户为空") : 0;
        $scope.data.currItem.invoiceno == undefined ? errorlist.push("发票号为空") : 0;
        $scope.data.currItem.invoicesum == undefined ? errorlist.push("发票金额为空") : 0;
        $scope.data.currItem.insuresum == undefined ? errorlist.push("投保金额为空") : 0;
		
		$scope.data.currItem.transportdate == undefined ? errorlist.push("出运日期为空") : 0;
        $scope.data.currItem.trafficcode == undefined ? errorlist.push("运输方式为空") : 0;
        $scope.data.currItem.moneyid == undefined ? errorlist.push("出运货币代码为空") : 0;
        $scope.data.currItem.paymode == undefined ? errorlist.push("合同支付方式为空") : 0;
        $scope.data.currItem.payterm == undefined ? errorlist.push("合同支付期限为空") : 0;
        $scope.data.currItem.feepaymode == undefined ? errorlist.push("缴费支付方式为空") : 0
		
        if (errorlist.length) {
            BasemanService.notify(notify,errorlist, "alert-danger");
            return false;
        }
        return true;
    }
    /**********************下拉框值查询（系统词汇）***************/
    //状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        $scope.stats = HczyCommon.stringPropToNum(data.dicts);
    })
    BasemanService.RequestPostAjax("base_search", "searchdict3", {dictcode: "ship_transport"}).then(function (data) {
        $scope.trafficcode = data.dicts;
    })
	//运输方式
	// $scope.trafficcode = [{dictvalue: "1", dictname: "海运"}, {dictvalue: "2", dictname: "空运"},
	// 	{dictvalue: "3", dictname: "铁路"}, {dictvalue: "4", dictname: "公路"},{dictvalue: "5", dictname: "海陆联运"}];
	//合同支付方式
	$scope.paymode = [{dictvalue: "LC", dictname: "LC"}, {dictvalue: "DP", dictname: "DP"},
		{dictvalue: "DA", dictname: "DA"}, {dictvalue: "OA", dictname: "OA"}];
	//缴费方式
	$scope.feepaymode = [{dictvalue: "LC", dictname: "LC"}, {dictvalue: "DP", dictname: "DP"},
		{dictvalue: "DA", dictname: "DA"}, {dictvalue: "OA", dictname: "OA"}];
    /**********************弹出框值查询**************************/
//买方代码查询
	 $scope.selectbuyer = function () {
         if($scope.data.currItem.stat!=1){
             return
         }
		 $scope.FrmInfo = {
            title: "买方代码查询",
            thead: [{
				name: "买方中信代码",
                code: "buyerno",
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
                name: "买方英文名称",
                code: "engname",
				show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "买方英文地址",
                code: "engaddress",
				show: true,
                iscond: true,
                type: 'string'
            }],
			is_custom_search:true,
			is_high:true,
            classid: "edi_buyerinfo",
	        postdata:{}
        };
		if ($scope.data.currItem.cust_code == undefined || $scope.data.currItem.cust_code == "") {
			}else{
			$scope.FrmInfo.sqlBlock="cust_code="+$scope.data.currItem.cust_code
			}
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
			 $scope.data.currItem.buyerno = result.buyerno;
            $scope.data.currItem.buyerchnname = result.chnname;
            $scope.data.currItem.corpbuyerno = result.Corpserialno;

			 $scope.data.currItem.buyerengname = result.engname;
			 $scope.data.currItem.buyercountrycode = result.countrycode;
			 $scope.data.currItem.buyerengaddr = result.engaddress;
             $scope.data.currItem.buyerchnaddr = result.chnaddress;
             $scope.data.currItem.buyerregno = result.regno;
			 $scope.data.currItem.buyertel = result.tel;
			 $scope.data.currItem.buyerfax = result.fax;
             $scope.data.currItem.cust_code = result.cust_code;
             $scope.data.currItem.cust_name = result.cust_name;
            $scope.data.currItem.cust_id = parseInt(result.cust_id);
        });
    }
//客户查询
 $scope.selectcust = function () {
       
    }
//开证行swift查询
    $scope.selectopenswift = function () {
        if($scope.data.currItem.stat!=1){
            return
        }
		 $scope.FrmInfo = {
            title: "开证行swift查询",
            thead: [{
                name: "企业内部编码",
                code: "corpserialno",
				 show: true,
                iscond: true,
                type: 'string'

            }, {
                name: "swift",
                code: "bankswift",
				show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "英文名称",
                code: "engname",
				show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "英文地址",
                code: "address",
				show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "国家代码",
                code: "countrycode",
				show: true,
                iscond: true,
                type: 'string'
            }
			],
			is_custom_search:true,
			is_high:true,
            classid: "edi_bankinfo",
	        postdata:{},
            backdatas: ""
        };
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
			 $scope.data.currItem.openbankswift = result.bankswift;
			 $scope.data.currItem.bankengname = result.engname;
			 $scope.data.currItem.bankaddr = result.address
					
        });
    }

    $scope.selectinvoiceno = function () {
        if($scope.data.currItem.stat!=1){
            return
        }
        $scope.FrmInfo = {
            title: "商业发票",
            thead: [
                {
                    name: "发票号",
                    code: "fact_invoice_no"
                }, {
                    name: "发票流水号",
                    code: "invoice_no"
                }, {
                    name: "客户编码",
                    code: "cust_code"
                }, {
                    name: "客户名称",
                    code: "cust_name"
                }],
            is_custom_search:true,
            is_high:true,
            searchlist: ["fact_invoice_no", "invoice_no", "cust_code", "cust_name"],
            classid: "bill_invoice_split_header",
            postdata: {flag: 3}
        };
        if ($scope.data.currItem.cust_id > 0) {
            $scope.FrmInfo.postdata.cust_id = $scope.data.currItem.cust_id;
        }
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (result) {
            if(result.invoice_id==undefined){
                return;
            }
            result=HczyCommon.stringPropToNum(result);
            $scope.data.currItem.invoiceno = result.fact_invoice_no;
            $scope.data.currItem.invoiceid = result.invoice_id;
            $scope.data.currItem.invoiceflag = result.flag;
            $scope.data.currItem.invoicesum = result.send_amt;
            $scope.data.currItem.employeename = result.org_name;
            $scope.data.currItem.contractno = result.pino_new;
            $scope.data.currItem.employeename = result.org_name;
            $scope.data.currItem.contractno = result.pino_new;
            $scope.data.currItem.cust_id = result.cust_id;
            $scope.data.currItem.cust_code = result.cust_code;
            $scope.data.currItem.cust_name = result.cust_name;
            $scope.data.currItem.org_id = result.org_id;
            $scope.data.currItem.org_code = result.org_code;
            $scope.data.currItem.org_name = result.org_name;
            $scope.data.currItem.idpath = result.idpath;
            $scope.data.currItem.lcno = result.lc_no;
            $scope.data.currItem.moneyid = result.currency_code;
            $scope.data.currItem.transportbillno = result.td_order;
            $scope.data.currItem.payterm = result.days;
            if (result.payment_type_name.indexOf('LC') > 0) {
                $scope.data.currItem.feepaymode = "LC"
                BasemanService.RequestPost("edi_bankinfo", "search", {clientno: $scope.data.currItem.lcno}).then(function (data) {
                    var obj = data.edi_bankinfos[0];
                    obj=HczyCommon.stringPropToNum(obj);
                    $scope.data.currItem.corpserialno = obj.corpserialno
                    $scope.data.currItem.bankchnname = obj.chnname
                    $scope.data.currItem.bankengname = obj.engname
                    $scope.data.currItem.bankcountrycode = obj.countrycode
                    $scope.data.currItem.bankaddr = obj.Address
                })
            } else {
                $scope.data.currItem.feepaymode = "OA"
            }
            BasemanService.RequestPost("bill_invoice_split_header", "getdays", {
                invoice_id: $scope.data.currItem.invoiceid,
                flag: $scope.data.currItem.invoiceflag,
            }).then(function (data) {
                data=HczyCommon.stringPropToNum(data);
                $scope.data.currItem.payterm = data.days
                $scope.data.currItem.insuresum = data.nottamt
                $scope.data.currItem.inv_nottamt = data.nottamt

                BasemanService.RequestPost("edi_buyerinfo", "search", {
                    sqlwhere:  " buyerno='" + data.box_note+"'",
                }).then(function (data1) {
                    var obj = data1.edi_buyerinfos[0];
                    obj=HczyCommon.stringPropToNum(obj);
                    $scope.data.currItem.buyerno = obj.buyerno;
                    $scope.data.currItem.buyerchnname = obj.chnname;
                    $scope.data.currItem.buyerengname = obj.engname;
                    $scope.data.currItem.corpbuyerno = obj.corpserialno;
                    $scope.data.currItem.buyercountrycode = obj.countrycode;
                    $scope.data.currItem.buyerengaddr = obj.engaddress;
                    $scope.data.currItem.buyerchnaddr = obj.chnaddress;
                    $scope.data.currItem.buyerregno = obj.regno;
                    $scope.data.currItem.buyertel = obj.tel;
                    $scope.data.currItem.buyerfax = obj.fax;
                    $scope.data.currItem.cust_id = obj.cust_id;
                    $scope.data.currItem.cust_code = obj.cust_code;
                    $scope.data.currItem.Cust_Name = obj.cust_name;
                })
            })

        });
    }

 $scope.selectmoneyid = function () {
     if($scope.data.currItem.stat!=1){
         return
     }
        $scope.FrmInfo = {
            title: "货币查询",
            thead: [{
                name: "货币代码",
                code: "currency_code",
				  show: true,
                iscond: true,
                type: 'string'

            },{
                name: "货币名称",
                code: "currency_name",
				  show: true,
                iscond: true,
                type: 'string'

            },{
                name: "备注",
                code: "note",
				  show: true,
                iscond: true,
                type: 'string'

            }],
			
			is_custom_search: true,
			is_high:true,
            classid: "base_currency"
			
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.moneyid =result.currency_code

        });
    }
    //数据缓存
    $scope.initdata();
}
//加载控制器
billmanControllers
    .controller('edi_shipmentapplyinfoEdit', edi_shipmentapplyinfoEdit)
