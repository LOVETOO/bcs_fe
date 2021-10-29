/**
 * 资金初始化 fd_fund_init
 * Created by zhl on 2019/1/10.
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_edit_list'], defineFn);
})(function (module, controllerApi, base_edit_list) {
    DemoEditList.$inject = ['$scope'];
    function DemoEditList($scope) {
        $scope.gridOptions = {
            columnDefs: [{
                type: '序号'
            }, {
                headerName: '资金账户',
                children:[{
                    field: 'fund_account_code',
                    headerName: '编码'
                },{
                    field: 'fund_account_name',
                    headerName: '名称'
                }]
            }, {
                field: 'date_startuse',
                headerName: '启用日期',
                type:'日期'
            }, {
                field: 'amount_lm',
                headerName: '期初余额',
                type:'金额'
            }, {
                field: 'fund_account_type',
                headerName: '账户类型',
                hcDictCode:'fund_account_type'
            }, {
                field: 'fund_account_property',
                headerName: '账户类别',
                hcDictCode:'fund_account_property'
            }, {
                field: 'crm_entid',
                headerName: '品类',
                hcDictCode:'crm_entid'
            }, {
                field: 'fund_account_status',
                headerName: '账户状态',
                hcDictCode:'account_stat'
            }, {
                field: 'base_currency_id',
                headerName: '记账货币',
                hcDictCode:'currency_name'
            }, {
                field: 'remark',
                headerName: '备注'
            }, {
                field: 'created_by',
                headerName: '创建人'
            }, {
                field: 'creation_date',
                headerName: '创建时间'
            }, {
                field: 'last_updated_by',
                headerName: '修改人'
            }, {
                field: 'last_update_date',
                headerName: '修改时间'
            }],
            hcBeforeRequest: function (searchObj) {
                //searchObj.falg = 1;
            }
        };

        controllerApi.extend({
            controller: base_edit_list.controller,
            scope: $scope
        });

        /**
         * 设置数据
         */
        $scope.setBizData = function (bizData) {
            $scope.hcSuper.setBizData(bizData);
            bizData.flag = 1;
        };

        /*---------------------  通用查询开始 -----------------------------*/
        $scope.chooseAccount = {
            sqlWhere:" fund_account_status = 2 ",
            afterOk: function (result) {
                $scope.data.currItem.userid = result.employee_code;
                $scope.data.currItem.username = result.employee_name;
                $scope.data.currItem.fd_fund_account_id = result.fd_fund_account_id;
                $scope.data.currItem.fund_account_code = result.fund_account_code;
                $scope.data.currItem.fund_account_name = result.fund_account_name;
                //带出数据：账户状态、账户类型、品类、账户类别、记账货币
                $scope.data.currItem.fund_account_status = result.fund_account_status;
                $scope.data.currItem.fund_account_type = result.fund_account_type;
                $scope.data.currItem.fund_account_property = result.fund_account_property;
                $scope.data.currItem.crm_entid = result.crm_entid;
                $scope.data.currItem.base_currency_id = result.base_currency_id;
            }
        };

        /*---------------------  通用查询结束 -----------------------------*/

        //按钮设置
        $scope.toolButtons = {
            save: {
                title: '保存',
                icon: 'fa fa-save',
                click: function () {
                    $scope.save && $scope.save();
                }
            },
            search: {
                title: '筛选',
                icon: 'fa fa-search',
                click: function () {
                    $scope.search && $scope.search();
                }
            },
            /*  refresh: {
                  title: '刷新',
                  icon: 'fa fa-refresh',
                  click: function () {
                      $scope.refresh && $scope.refresh();
                  }
              },*/
            export: {
                title: '导出',
                icon: 'glyphicon glyphicon-log-out',
                click: function () {
                    $scope.export && $scope.export();
                }
            }
        };

    }

    return controllerApi.controller({
        module: module,
        controller: DemoEditList
    });
});
