var CrmmanControllers = angular.module('inspinia');
function customer_visit_record_view($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "customer_visit_record",
        key: "record_id",
        classids: "customer_visit_records",
        nextStat:"gallery.customer_visit_record_edit",
        hasOrg:false,
        //SqlWhere:"1=1", 该条不存在就不要赋值
    }
    //继承基类方法
    customer_visit_record_view = HczyCommon.extend(customer_visit_record_view, ctrl_view_public);
    customer_visit_record_view.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);




    $scope.viewColumns = [
        {
            id: "id",
            name: "#",
            field: "id",
            behavior: "select",
            cssClass: "cell-selection",
            width: 40,
            cannotTriggerInsert: true,
            resizable: false,
            selectable: false,
            focusable: false
        },{
            id: "stat",
            name: "状态",
            field: "stat",
            width: 60,
            options: [],
            editor: Slick.Editors.ReadonlyText,
            formatter: Slick.Formatters.SelectOption,
        },{
            id: "record_no",
            name: "单据号",
            field: "record_no",
            width: 130,
            options: $scope.confirm_stats,
            editor: Slick.Editors.ReadonlyText,
        }, {
            id: "org_name",
            name: "部门名称",
            field: "org_name",
            width: 80,
            editor: Slick.Editors.ReadonlyText,
        }, {
            id: "cust_code",
            name: "客户编码",
            field: "cust_code",
            width: 80,
            editor: Slick.Editors.ReadonlyText,
        }, {
            id: "record_type",
            name: "访谈类型",
            field: "record_type",
            width: 80,
            options: [
                {
                    value: 1,
                    desc: "客户来访"
                }, {
                    value: 2,
                    desc: "拜访记录"
                }, {
                    value: 3,
                    desc: "会谈记录"
                }, {
                    value: 4,
                    desc: "不良记录"
                }],
            editor: Slick.Editors.ReadonlyText,
            formatter:Slick.Formatters.SelectOption,
        }, {
            id: "record_date",
            name: "访谈日期",
            field: "record_date",
            width: 100,
            editor: Slick.Editors.ReadonlyText,
        }, {
            id: "record_user",
            name: "参会人员",
            field: "record_user",
            width: 200,
            editor: Slick.Editors.ReadonlyText,
        }, {
            id: "record_msg",
            name: "议题",
            field: "record_msg",
            width: 200,
            editor: Slick.Editors.ReadonlyText,
        }, {
            id: "record_note",
            name: "会议内容",
            field: "record_note",
            width: 200,
            editor: Slick.Editors.ReadonlyText,
        }];

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



    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {};
    };
    $scope.clearinformation();


    $scope.initData();

}


CrmmanControllers
    .controller('customer_visit_record_view', customer_visit_record_view)

