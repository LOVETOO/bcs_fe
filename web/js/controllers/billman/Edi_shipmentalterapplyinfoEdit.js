var billmanControllers = angular.module('inspinia');
function edi_shipmentalterapplyinfoEdit($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService,notify) {
    //继承基类方法
    edi_shipmentalterapplyinfoEdit = HczyCommon.extend(edi_shipmentalterapplyinfoEdit, ctrl_bill_public);
    edi_shipmentalterapplyinfoEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "edi_shipmentalterapplyinfo",
        key:"corpserialid",
        wftempid:10146,
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
        $scope.data.currItem.feepaymode == undefined ? errorlist.push("缴费支付方式为空") : 0;
        $scope.data.currItem.alterreason == undefined ? errorlist.push("变更原因方式为空") : 0;
		
        if (errorlist.length) {
            BasemanService.notify(notify,errorlist, "alert-danger");
            return false;
        }
        return true;
    }
    /*----------------------保存校验区域-------------------*/
	$scope.refresh_after= function(){
	}
	/*---------------------刷新------------------------------*/
	$scope.refresh_after= function(){
		//复制历史
		if($scope.data.currItem.copy==1){
			$scope.data.currItem.corpserialid="";
		}
	}
    /**********************下拉框值查询（系统词汇）***************/
    //状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        $scope.stats = HczyCommon.stringPropToNum(data.dicts);
    })
	//运输方式
	$scope.trafficcode = [{dictvalue: "1", dictname: "海运"}, {dictvalue: "2", dictname: "空运"},
		{dictvalue: "3", dictname: "铁路"}, {dictvalue: "4", dictname: "公路"},{dictvalue: "5", dictname: "海陆联运"}];
	//合同支付方式

	$scope.paymode = [{dictvalue: "LC", dictname: "LC"}, {dictvalue: "DP", dictname: "DP"},
		{dictvalue: "DA", dictname: "DA"}, {dictvalue: "OA", dictname: "OA"}];
	// //缴费方式

	$scope.feepaymode = [{dictvalue: "LC", dictname: "LC"}, {dictvalue: "DP", dictname: "DP"},
		{dictvalue: "DA", dictname: "DA"}, {dictvalue: "OA", dictname: "OA"}];
    /**********************弹出框值查询**************************/
    //出运申报单查询
    $scope.selectoldno = function () {
        $scope.FrmInfo = {
            title: "出运申报单号查询",
            thead: [{
                name: "出运申报单号",
                code: "corpserialno",
                show: true,
                iscond: true,
                type: 'string'

            }, {
                name: "发票号码",
                code: "invoiceno",
                show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "出运日期",
                code: "transportdate",
                show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "支付条件",
                code: "paymode",
                show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "买方代码",
                code: "buyerno",
                show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "买方名称",
                code: "buyerengname",
                show: true,
                iscond: true,
                type: 'string'
            }],
            is_custom_search:true,
            is_high:true,
            classid: "edi_shipmentalterapplyinfo",
            postdata:{flag:2}
        };
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
            for (name in result) {
                $scope.data.currItem[name] = result[name];
            }
            $scope.data.currItem.oldcorpserialno = result.corpserialno;
            $scope.data.currItem.Oldcorpserialid = result.corpserialid;
            $scope.data.currItem.corpserialno = "";
            $scope.data.currItem.corpserialid = "0";
            $scope.data.currItem.stat = 1;
            $scope.data.currItem.wfid = 0;
            $scope.data.currItem.wfflag = 0;
            $scope.data.currItem.alterreason="";
        });
    }
 $scope.selectmoneyid = function () {
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
    .controller('edi_shipmentalterapplyinfoEdit', edi_shipmentalterapplyinfoEdit)
