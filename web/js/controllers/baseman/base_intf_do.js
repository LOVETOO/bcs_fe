var billmanControllers = angular.module('inspinia');
function base_intf_do($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService, notify) {
    //继承基类方法
    base_intf_do = HczyCommon.extend(base_intf_do, ctrl_bill_public);
    base_intf_do.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //
    $scope.objconf = {
        name: "",
        key:"",
        // wftempid:10142,
        FrmInfo: {},
        grids:[]
    };
    $scope.selectno = function () {
        $scope.FrmInfo = {
            title: "生产单查询",
            is_high: true,
            is_custom_search: true,
            thead: [{
                name: "生产单编码",
                code: "prod_no",
                show: true,
                iscond: true,
                type: 'string'

            }, {
                name: "形式发票号",
                code: "pi_no",
                show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "所属机构名称",
                code: "org_name",
                show: true,
                iscond: true,
                type: 'string'
            },{
                name: "客户名称",
                code: "cust_name",
                show: true,
                iscond: true,
                type: 'string'
            }],
            classid: "sale_prod_header",
            postdata: {flag: 2},
            sqlBlock:"stat = 5 and is_csh=1 and nvl(is_sap,0)!=2",
            type: "checkbox",
            // searchlist: ["dictname", "dictvalue"],
            commitRigthNow: true,
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (items) {
            if (items.length == 0) {
                return
            }
            var noticeid = '', noticeno = '', noticeid = [];
            for (var i = 0; i < items.length; i++) {
                noticeno += items[i].inspection_batchno + ',';
                noticeid += items[i].prod_id + ',';
                items.push[items[i].prod_id]
            }
            noticeno = noticeno.substring(0, noticeno.length - 1);
            noticeid = noticeid.substring(0, noticeid.length - 1);
            $scope.data.currItem.note3 = noticeno;
            $scope.data.currItem.note4 = noticeid;
        });
    }
    //测试
    $scope.test = function () {
        var postdata={flag:20};
        BasemanService.RequestPost("base_intf_do", "test", postdata)
            .then(function () {
                BasemanService.notice("执行成功！");
            });
    }
    //同步SAP开票数据
    $scope.test1 = function () {
        if(($scope.data.currItem.end_date1==""||$scope.data.currItem.end_date1==undefined)||
            ($scope.data.currItem.end_date4==""||$scope.data.currItem.end_date4==undefined)){
            BasemanService.notice("同步时间不能为空！");
            return;
        }
        var postdata={flag:1,
            end_date1: $scope.data.currItem.end_date1,
            end_date4: $scope.data.currItem.end_date4};
        BasemanService.RequestPost("base_intf_do", "test", postdata)
            .then(function () {
                BasemanService.notice("执行成功！");
            });
    }
   //同步SAP出入库数据
    $scope.test2 = function () {
        if($scope.data.currItem.end_date2==""||$scope.data.currItem.end_date2==undefined){
            BasemanService.notice("同步开始时间不能为空！");
            return;
        }
        if($scope.data.currItem.end_date3==""||$scope.data.currItem.end_date3==undefined){
            BasemanService.notice("同步结束时间不能为空！");
            return;
        }
        var postdata={flag:2,
            end_date2: $scope.data.currItem.end_date2,
            end_date3: $scope.data.currItem.end_date3};
        BasemanService.RequestPost("base_intf_do", "test", postdata)
            .then(function () {
                BasemanService.notice("执行成功！");
            });
    }
    //出库单引SAP生成交发货单
    $scope.test3 = function () {
        if($scope.data.currItem.note==""||$scope.data.currItem.note==undefined){
            BasemanService.notice("出库单号不能为空！");
            return;
        }
        var postdata={flag:3,
            note: $scope.data.currItem.note,
            };
        BasemanService.RequestPost("base_intf_do", "test", postdata)
            .then(function () {
                BasemanService.notice("执行成功！");
            });
    }
    //出库单引SAP生成交货单
    $scope.test4 = function () {
        if($scope.data.currItem.note1==""||$scope.data.currItem.note1==undefined){
            BasemanService.notice("出库单号不能为空！");
            return;
        }
        var postdata={flag:4,
            note: $scope.data.currItem.note,
        };
        BasemanService.RequestPost("base_intf_do", "test", postdata)
            .then(function () {
                BasemanService.notice("执行成功！");
            });
    }
    //出库单引SAP生成发货单
    $scope.test5 = function () {
        if($scope.data.currItem.note2==""||$scope.data.currItem.note2==undefined){
            BasemanService.notice("出库单号不能为空！");
            return;
        }
        var postdata={flag:5,
            note2: $scope.data.currItem.note2,
        };
        BasemanService.RequestPost("base_intf_do", "test", postdata)
            .then(function () {
                BasemanService.notice("执行成功！");
            });
    }
    //测算标机或物料价格
    $scope.test6 = function () {
        if($scope.data.currItem.note5==""||$scope.data.currItem.note5==undefined){
            BasemanService.notice("物料号不能为空！");
            return;
        }
        var postdata={flag:8,
            note5: $scope.data.currItem.note5,
        };
        BasemanService.RequestPost("base_intf_do", "test", postdata)
            .then(function () {
                BasemanService.notice("执行成功！");
            });
    }
    //生产单写SAP
    $scope.test7 = function () {
        if($scope.data.currItem.note3==""||$scope.data.currItem.note3==undefined){
            BasemanService.notice("生产单号不能为空！");
            return;
        }
        var postdata={flag:6,
            note4: $scope.data.currItem.note4,
        };
        BasemanService.RequestPost("base_intf_do", "test", postdata)
            .then(function () {
                BasemanService.notice("执行成功！");
            });
    }
    //生产变更单写SAP
    $scope.test8 = function () {
        if($scope.data.currItem.note6==""||$scope.data.currItem.note6==undefined){
            BasemanService.notice("生产变更单号不能为空！");
            return;
        }
        var postdata={flag:9,
            note6: $scope.data.currItem.note6,
        };
        BasemanService.RequestPost("base_intf_do", "test", postdata)
            .then(function () {
                BasemanService.notice("执行成功！");
            });
    }
    //PI变更单价写SAP
    $scope.test9 = function () {
        if($scope.data.currItem.note7==""||$scope.data.currItem.note7==undefined){
            BasemanService.notice("PI变更单号不能为空！");
            return;
        }
        if($scope.data.currItem.note8==""||$scope.data.currItem.note8==undefined){
            BasemanService.notice("PI对应商检批号不能为空！");
            return;
        }
        var postdata={flag:10,
            note7: $scope.data.currItem.note7,
            note8: $scope.data.currItem.note8,
        };
        BasemanService.RequestPost("base_intf_do", "test", postdata)
            .then(function () {
                BasemanService.notice("执行成功！");
            });
    }
    //PI到款调整写SAP
    $scope.test10 = function () {
        if($scope.data.currItem.note9==""||$scope.data.currItem.note9==undefined){
            BasemanService.notice("PI变更单号不能为空！");
            return;
        }
        var postdata={flag:11,
            note9: $scope.data.currItem.note9,
        };
        BasemanService.RequestPost("base_intf_do", "test", postdata)
            .then(function () {
                BasemanService.notice("执行成功！");
            });
    }
    //测试标准价
    $scope.test11 = function () {

        var postdata={flag:201,
            note: $scope.data.currItem.price1,
        };
        BasemanService.RequestPost("base_intf_do", "test", postdata)
            .then(function () {
                BasemanService.notice("执行成功！");
            });
    }
    //测试预算价
    $scope.test12 = function () {

        var postdata={flag:202,
            note: $scope.data.currItem.price2,
        };
        BasemanService.RequestPost("base_intf_do", "test", postdata)
            .then(function () {
                BasemanService.notice("执行成功！");
            });
    }
    //测试条码系统连接
    $scope.test13 = function () {

        var postdata={flag:101,
        };
        BasemanService.RequestPost("base_intf_do", "test", postdata)
            .then(function () {
                BasemanService.notice("执行成功！");
            });
    }
    //测试包装方案接口
    $scope.test14 = function () {
        var postdata={flag:102,
        };
        BasemanService.RequestPost("base_intf_do", "test", postdata)
            .then(function () {
                BasemanService.notice("执行成功！");
            });
    }
    //测试排柜计划接口
    $scope.test15 = function () {
        var postdata={flag:103,
        };
        BasemanService.RequestPost("base_intf_do", "test", postdata)
            .then(function () {
                BasemanService.notice("执行成功！");
            });
    }
    //执行OMS
    $scope.test16 = function () {
        var postdata={flag:301,
            note: $scope.data.currItem.sql,
        };
        BasemanService.RequestPost("base_intf_do", "test", postdata)
            .then(function () {
                BasemanService.notice("执行成功！");
            });
    }
    //执行PDM
    $scope.test17 = function () {
        var postdata={flag:302,
            note: $scope.data.currItem.sql,
        };
        BasemanService.RequestPost("base_intf_do", "test", postdata)
            .then(function () {
                BasemanService.notice("执行成功！");
            });
    }
    //数据缓存
    $scope.initdata();
}
//加载控制器
billmanControllers
    .controller('base_intf_do', base_intf_do)
