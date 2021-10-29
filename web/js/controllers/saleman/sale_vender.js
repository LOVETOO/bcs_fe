'use strict';
var promanControllers = angular.module('inspinia');
function sale_vender($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope) {
    sale_vender = HczyCommon.extend(sale_vender, ctrl_view_public);
    sale_vender.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);

    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "sale_vender",
        key: "vender_id",
        nextStat: "sale_venderEdit",
        classids: "sale_venders",
        sqlBlock: "1=1",
        thead: [],
        grids: [{optionname: 'viewOptions', idname: 'contains'}]
    }
    $scope.headername = "供应商档案查询";
    $scope.hide=true;
    /**----网格列区域  ----------*/
    $scope.viewColumns = [
        {
            headerName: "序号", field: "queue", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "供应商编码",
            field: "vender_code",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "供应商名称",
            field: "vender_name",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "供应商描述",
            field: "vender_desc",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "供应商电话",
            field: "telnumber",
            editable: false,
            filter: 'set',
            width: 120,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "公司代码",
            field: "company_code",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "银行账户号码",
            field: "bank_account_num",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "银行账户持有人",
            field: "bank_account_ower",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "银行名称",
            field: "bank_name",
            editable: false,
            filter: 'set',
            width: 120,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "银行编码",
            field: "bank_code",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },


        {
            headerName: "创建人",
            field: "created_by",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "创建日期",
            field: "creation_date",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor:"年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "最后更新人",
            field: "last_updated_by",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "最后更新日期",
            field: "last_update_date",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor:"年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "数据版本",
            field: "version_id",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "删除标记",
            field: "delete_flag",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "供应商类型",
            field: "vender_type",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "修改人",
            field: "updator",
            editable: false,
            filter: 'set',
            width: 120,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
       {
            headerName: "修改时间",
            field: "update_time",
            editable: false,
            filter: 'set',
            width: 120,
            cellEditor:"年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注",
            field: "remark",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
        /*{
            headerName: "操作",
            field: "",
            editable: false,
            filter: 'set',
            width: 58,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            pinned: 'right',
            cellRenderer:"链接渲染"
        }*/];

    //数据缓存
    $scope.initData();
    $scope.viewOptions.rowDoubleClicked=undefined;
}

// 产品资料
promanControllers
    .controller('sale_vender', sale_vender)



