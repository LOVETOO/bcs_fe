var basemanControllers = angular.module('inspinia');

function customer_visit_record_edit($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {

    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "customer_visit_record",
        key: "record_id",
        classids: "customer_visit_records",
        hasOrg: false,
        objtypeid: 10105,

    }
    //继承基类方法
    customer_visit_record_edit = HczyCommon.extend(customer_visit_record_edit, ctrl_allbill_public);
    customer_visit_record_edit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);


    $scope.init = function () {

        BasemanService.pageInit($scope);

        var postdata = {
            sqlwhere: ""
        };

        //访谈类型
        $scope.recordTypes = [
            {
            id: 1,
            name: "客户来访"
        }, {
            id: 2,
            name: "拜访记录"
        }, {
            id: 3,
            name: "会谈记录"
        }, {
            id: 4,
            name: "不良记录"
        }];

        // 登录用户
        $scope.userbean = window.userbean;

        $scope.mainbtn = {
            search: false,
            add: false
        };
    };

    $scope.init();


    $scope.search = function () {
        $scope.FrmInfo = {
            title: "客户拜访记录查询",
            thead: [
                {
                    name: "单据号",
                    code: "record_no"
                }, {
                    name: "客户名",
                    code: "cust_name"
                }, {
                    name: "业务部门",
                    code: "org_name"
                }, {
                    name: "调整系数",
                    code: "modify_value"
                }],
            classid: "customer_visit_record",
            postdata: {},
            searchlist: ["record_no", "cust_name", "org_name", "modify_value"],
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (result) {
            $scope.data.currItem.record_id = result.record_id;
            $scope.refresh(2);
        });
    }


    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            stat: 1,
            creator: $scope.userbean.userid,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            objattachs:[],
        };
    };

    $scope.clearinformation();

    $scope.initData();


    //刷新
    $scope.refresh = function (flag) {
        var postdata = {
            record_id: $scope.data.currItem.record_id
        };
        if (postdata.record_id == undefined || postdata.record_id == 0) {
            BasemanService.notify(notify, "单据没有保存，无法刷新", "alert-warning", 1000);
            return;
        };
        BasemanService.RequestPost("customer_visit_record", "select", postdata)
        .then(function (data) {
            if (flag != 2) {
                BasemanService.notify(notify, "刷新成功", "alert-info", 500);
            };
            $scope.data.currItem = data;
        });
    };

    //处理参数，参数优先
    if ($location.search().param != undefined) {
        //var x = $location.search().param;
        $.base64.utf8encode = true;
        //var y = $.base64.atob(x, true);
        var ob = $.base64.atob($location.search().param);
        var obj1 = ob.split("|");
        var x = JSON.parse(obj1[3], true);
        if (x.userid) {
            if (x.userid != window.strUserId) {
                return;
            }
        }
        if (x) {
            $scope.data = {currItem: {}};
            $scope.data.currItem["record_id"] = x;
            $scope.refresh(-2);
        } else if (x.initsql) {
            $scope.autosearch(x.initsql);
        }
        //清除参数
    } else {    var _stateName = $rootScope.$state.$current.name;
        var data = localeStorageService.get(_stateName);
        if (data == undefined) { //非编辑
            var temp = localeStorageService.getHistoryItem(_stateName);
            if (temp) { //历史纪录
                $scope.data.currItem = temp;
            } else {
                //$scope.new();
            }
        } else {
            $scope.data.currItem = data;
            $scope.isEdit = data.isEdit;//查询界面中跳转过来，如果是查看详情，data.flag=9，编辑data.flag=9
            $scope.refresh(2);
        }
    }
}

//加载控制器
basemanControllers
    .controller('customer_visit_record_edit', customer_visit_record_edit);
